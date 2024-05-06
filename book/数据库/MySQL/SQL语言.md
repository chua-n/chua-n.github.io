---
title: SQL 语言
date: 2019-08-14
---

## 1. DQL

> DQL(Data Query Language)：查询数据。

### 1.1 查询数据

#### 1.1.1 查询的概念

```sql
SELECT cus_name, cust_contact
FROM customers
WHERE cust_id IN (SELECT cust_id
                 FROM orders
                 WHERE order_num IN (SELECT order_num
                                    FROM orderitems
                                    WHERE prod_id = 'TNT2'));
```

- **查询**（query）——任何 SQL 语句都是查询，但此术语一般指`SELECT`语句。
- **子查询**（subquery）——嵌套在其他查询中的查询。在`SELECT`语句中，查询总是从内向外处理。

如果没有明确排序查询结果，则返回的数据的顺序没有特殊意义。

#### 1.1.2 SELECT 基本用法

| 语法                                          | 说明                   |
| --------------------------------------------- | ---------------------- |
| `  SELECT * FROM <表名>  `                    | 基本查询               |
| `  SELECT * FROM <表名> WHERE <条件表达式>  ` | 条件查询               |
| `  SELECT 列1, 列2, 列3 FROM ...  `           | 投影查询               |
| `  SELECT * FROM <表1> <表2>  `               | 多表查询（笛卡乐查询） |

- `*`表示“所有列”，`FROM`表示将要从哪个表查询

- `SELECT * FROM students`将查询出`students`表的所有数据。

    > 注意：查询结果也是一个二维表，它包含列名和每一行的数据。

- 使用笛卡尔查询时要非常小心，结果集的列数是被查询表的列数之和，行数是被查询表的行数之积！对两个各自有 1 万行记录的表进行笛卡尔查询将返回 1 亿条记录！

- 使用`SELECT 列1, 列2, 列3 FROM ...`时，还可以给每一列起个别名，这样，结果集的列名就可以与原表的列名不同。它的语法是`SELECT 列1 别名1, 列2 别名2, 列3 别名3 FROM ...`

#### 1.1.3 LIMIT 子句

对于查询语句，如果只想要其结果集中的部分数据，可使用 `LIMIT` 子句来限制结果集的数量。

| 语法                                | 说明                                |
| ----------------------------------- | ----------------------------------- |
| `  LIMIT row_count OFFSET offset  ` | 从`offset`开始返回`row_count`行数据 |
| `  LIMIT offset, row_count  `       | 同上，是 MySQL 独有的另一种简写     |

其中：

- `OFFSET`部分是可选的，如果只写`LIMIT row_count`，那么相当于`LIMIT M OFFSET 0`；

- 使用`LIMIT <M> OFFSET <N>`分页时，随着 `N` 越来越大，查询效率也会越来越低。

  > `LIMIT` 和 `OFFSET` 的效率问题，其实是 `OFFSET` 的问题，因为它会导致 MySQL 扫描大量不需要的行然后再抛弃掉。

带`LIMIT`的查询也叫**分页查询**。比如，对于一张学生表，希望取出其中考试分数位于特定名次的学生：

- 全量查询：

  ```sql
  SELECT id, name, gender, score FROM students ORDER BY score DESC;
  ```

- 假设把结果集分页，每页 3 条记录。要获取第 1 页的记录，则查询语句为：

  ```sql
  -- 对结果集从 0 号记录开始，最多取 3 条
  SELECT id, name, gender, score
  FROM students
  ORDER BY score DESC
  LIMIT 3 OFFSET 0;
  ```

- 如果要查询第 3 页的记录，相当于需要“跳过”头 2 页的那 $2 \times 3$ 条记录，即`OFFSET`应该设定为 6（注意 SQL 记录集的索引从 0 开始）：

  ```sql
  -- 查询第 3 页
  SELECT id, name, gender, score
  FROM students
  ORDER BY score DESC
  LIMIT 3 OFFSET 6;
  ```

- 可见，`LIMIT` 查询与分页查询的映射关系为：

  - `LIMIT`表示分页大小`pageSize`；
  - `OFFSET`表示`pageSize * (pageIndex - 1)`（这里`pageIndex`从 1 开始）。

#### 1.1.4 JOIN 子句

`JOIN`子句代表连接查询，连接查询是另一种类型的多表查询，其对多个表进行`JOIN`运算。简单地说，就是先确定一个主表作为结果集，然后，把其他表的行有选择性地“连接”在主表结果集上。`JOIN`的语法如下：

```sql
SELECT ... FROM tableA ??? JOIN tableB ON tableA.column1 = tableB.column2;
```

| ??? 的含义                            | 说明                         |
| ------------------------------------ | ---------------------------- |
| `INNER JOIN`                         | 返回同时存在于两张表的行数据 |
| `LEFT OUTER JOIN`<br />`LEFT JOIN`   | 返回左表都存在的行           |
| `RIGHT OUTER JOIN`<br />`RIGHT JOIN` | 返回右表都存在的行           |
| `FULL JOIN`                          | 返回两张表的所有记录         |

##### 案例准备

例如，对于两个表`students`和`classes`，如下：

```sql
-- 选出所有学生
SELECT s.id, s.name, s.class_id, s.gender, s.score FROM students s;
```

|  id  | name | class_id | gender | score |
| :--: | :--: | :------: | :----: | :---: |
|  1   | 小明 |    1     |   M    |  90   |
|  2   | 小红 |    1     |   F    |  95   |
|  3   | 小军 |    1     |   M    |  88   |
|  4   | 小米 |    1     |   F    |  73   |
|  5   | 小白 |    2     |   F    |  81   |
|  6   | 小兵 |    2     |   M    |  55   |
|  7   | 小林 |    2     |   M    |  85   |
|  8   | 小新 |    3     |   F    |  91   |
|  9   | 小王 |    3     |   M    |  89   |
|  10  | 小丽 |    3     |   F    |  88   |

```sql
SELECT * FROM classes;
```

|  id  | name |
| :--: | :--: |
|  1   | 一班 |
|  2   | 二班 |
|  3   | 三班 |
|  4   | 四班 |

假设我们希望结果集同时包含所在班级的名称，上面的结果集只有`class_id`列，缺少对应班级的`name`列。而存放班级名称的`name`列存储在`classes`表中，只有根据`students`表的`class_id`，找到`classes`表对应的行，再取出`name`列，就可以获得班级名称。这时，连接查询就派上了用场。

##### INNER JOIN

`INNER JOIN`只返回同时存在于两张表的行数据，由于`students`表的`class_id`包含 1，2，3，`classes`表的`id`包含 1，2，3，4，所以，`INNER JOIN`根据条件`s.class_id = c.id`返回的结果集仅包含 1，2，3。

```sql
-- 选出所有学生，同时返回班级名称
SELECT s.id, s.name, s.class_id, c.name class_name, s.gender, s.score
FROM students s
INNER JOIN classes c
ON s.class_id = c.id;
```

|  id  | name | class_id | class_name | gender | score |
| :--: | :--: | :------: | :--------: | :----: | :---: |
|  1   | 小明 |    1     |    一班    |   M    |  90   |
|  2   | 小红 |    1     |    一班    |   F    |  95   |
|  3   | 小军 |    1     |    一班    |   M    |  88   |
|  4   | 小米 |    1     |    一班    |   F    |  73   |
|  5   | 小白 |    2     |    二班    |   F    |  81   |
|  6   | 小兵 |    2     |    二班    |   M    |  55   |
|  7   | 小林 |    2     |    二班    |   M    |  85   |
|  8   | 小新 |    3     |    三班    |   F    |  91   |
|  9   | 小王 |    3     |    三班    |   M    |  89   |
|  10  | 小丽 |    3     |    三班    |   F    |  88   |

注意`INNER JOIN`查询的写法是：

1. 先确定主表，仍然使用`FROM <表1>`的语法；
2. 再确定需要连接的表，使用`INNER JOIN <表2>`的语法；
3. 然后确定连接条件，使用`ON <条件...>`，这里的条件是`s.class_id = c.id`，表示`students`表的`class_id`列与`classes`表的`id`列相同的行需要连接；
4. 可选：加上`WHERE`子句、`ORDER BY`等子句。
5. 使用别名不是必须的，但可以更好地简化查询语句。       

##### RIGHT OUTER JOIN

`RIGHT OUTER JOIN`返回右表都存在的行。如果某一行仅在右表存在，那么结果集就会以`NULL`填充剩下的字段。

```sql
-- 使用 OUTER JOIN
SELECT s.id, s.name, s.class_id, c.name class_name, s.gender, s.score
FROM students s
RIGHT OUTER JOIN classes c
ON s.class_id = c.id;
```

|  id  | name | class_id | class_name | gender | score |
| :--: | :--: | :------: | :--------: | :----: | :---: |
|  1   | 小明 |    1     |    一班    |   M    |  90   |
|  2   | 小红 |    1     |    一班    |   F    |  95   |
|  3   | 小军 |    1     |    一班    |   M    |  88   |
|  4   | 小米 |    1     |    一班    |   F    |  73   |
|  5   | 小白 |    2     |    二班    |   F    |  81   |
|  6   | 小兵 |    2     |    二班    |   M    |  55   |
|  7   | 小林 |    2     |    二班    |   M    |  85   |
|  8   | 小新 |    3     |    三班    |   F    |  91   |
|  9   | 小王 |    3     |    三班    |   M    |  89   |
|  10  | 小丽 |    3     |    三班    |   F    |  88   |
| NULL | NULL |   NULL   |    四班    |  NULL  | NULL  |

和`INNER JOIN`相比，`RIGHT OUTER JOIN`多了一行，多出来的一行是“四班”，但是，学生相关的列如`name`、`gender`、`score`都为`NULL`。

这也容易理解，因为根据`ON`条件`s.class_id = c.id`，`classes`表的`id=4`的行正是“四班”，但是，`students`表中并不存在`class_id=4`的行。

##### LEFT OUTER JOIN

`LEFT OUTER JOIN`则返回左表都存在的行。如果我们给`students`表增加一行，并添加`class_id=5`，由于`classes`表并不存在`id=5`的行，所以，`LEFT OUTER JOIN`的结果会增加一行，对应的`class_name`是`NULL`。

```sql
-- 先增加一列 class_id=5:
INSERT INTO students (class_id, name, gender, score) values (5, '新生', 'M', 88);
-- 使用 LEFT OUTER JOIN
SELECT s.id, s.name, s.class_id, c.name class_name, s.gender, s.score
FROM students s
LEFT OUTER JOIN classes c
ON s.class_id = c.id;
```

|  id  | name | class_id | class_name | gender | score |
| :--: | :--: | :------: | :--------: | :----: | :---: |
|  1   | 小明 |    1     |    一班    |   M    |  90   |
|  2   | 小红 |    1     |    一班    |   F    |  95   |
|  3   | 小军 |    1     |    一班    |   M    |  88   |
|  4   | 小米 |    1     |    一班    |   F    |  73   |
|  5   | 小白 |    2     |    二班    |   F    |  81   |
|  6   | 小兵 |    2     |    二班    |   M    |  55   |
|  7   | 小林 |    2     |    二班    |   M    |  85   |
|  8   | 小新 |    3     |    三班    |   F    |  91   |
|  9   | 小王 |    3     |    三班    |   M    |  89   |
|  10  | 小丽 |    3     |    三班    |   F    |  88   |
|  11  | 新生 |    5     |    NULL    |   M    |  88   |

`RIGHT OUTER JOIN`和`INNER JOIN`相比的差异同上。

##### FULL JOIN

```sql
-- 使用 FULL OUTER JOIN
SELECT s.id, s.name, s.class_id, c.name class_name, s.gender, s.score
FROM students s
FULL OUTER JOIN classes c
ON s.class_id = c.id;
```

|  id  | name | class_id | class_name | gender | score |
| :--: | :--: | :------: | :--------: | :----: | :---: |
|  1   | 小明 |    1     |    一班    |   M    |  90   |
|  2   | 小红 |    1     |    一班    |   F    |  95   |
|  3   | 小军 |    1     |    一班    |   M    |  88   |
|  4   | 小米 |    1     |    一班    |   F    |  73   |
|  5   | 小白 |    2     |    二班    |   F    |  81   |
|  6   | 小兵 |    2     |    二班    |   M    |  55   |
|  7   | 小林 |    2     |    二班    |   M    |  85   |
|  8   | 小新 |    3     |    三班    |   F    |  91   |
|  9   | 小王 |    3     |    三班    |   M    |  89   |
|  10  | 小丽 |    3     |    三班    |   F    |  88   |
|  11  | 新生 |    5     |    NULL    |   M    |  88   |
| NULL | NULL |   NULL   |    四班    |  NULL  | NULL  |

最后，我们使用`FULL OUTER JOIN`，它会把两张表的所有记录全部选择出来，并且，自动把对方不存在的列填充为`NULL`。

##### 图解连接查询

假设查询语句如下，结合下图，我们把`tableA`看作左表，把`tableB`看成右表：

```sql
SELECT ... FROM tableA ??? JOIN tableB ON tableA.column1 = tableB.column2;
```

|      连接方式      |                             图示                             |          说明          |
| :----------------: | :----------------------------------------------------------: | :--------------------: |
|    `INNER JOIN`    | ![inner-join](https://figure-bed.chua-n.com/数据库/MySQL/1.png) | 选出两张表都存在的记录 |
| `LEFT OUTER JOIN`  | ![left-outer-join](https://figure-bed.chua-n.com/数据库/MySQL/2.png) |   选出左表存在的记录   |
| `RIGHT OUTER JOIN` | ![right-outer-join](https://figure-bed.chua-n.com/数据库/MySQL/3.png) |   选出右表存在的记录   |
| `FULL OUTER JOIN`  | ![full-outer-join](https://figure-bed.chua-n.com/数据库/MySQL/4.png) | 选出左右表都存在的记录 |

要意识到连接只是一种机制，用来在一条`SELECT`语句中关联表，其不是物理实体，换句话说，它在实际的数据库表中不存在，仅存在于查询的执行当中。

#### 1.1.5 笛卡尔查询示例

由没有连接条件的表关系返回的结果为笛卡尔积，即一个表中中的每一个将与另一个表中的每个配对而不管它们是否逻辑上可以在一起，如同时从`students`表和`classes`表查询数据：

```sql
-- FROM students, classes:
```

|  id  | class_id | name | gender | score |  id  | name |
| :--: | :------: | :--: | :----: | :---: | :--: | :--: |
|  1   |    1     | 小明 |   M    |  90   |  1   | 一班 |
|  1   |    1     | 小明 |   M    |  90   |  2   | 二班 |
|  1   |    1     | 小明 |   M    |  90   |  3   | 三班 |
|  1   |    1     | 小明 |   M    |  90   |  4   | 四班 |
|  2   |    1     | 小红 |   F    |  95   |  1   | 一班 |
|  2   |    1     | 小红 |   F    |  95   |  2   | 二班 |
|  2   |    1     | 小红 |   F    |  95   |  3   | 三班 |
|  2   |    1     | 小红 |   F    |  95   |  4   | 四班 |
|  3   |    1     | 小军 |   M    |  88   |  1   | 一班 |
|  3   |    1     | 小军 |   M    |  88   |  2   | 二班 |
|  3   |    1     | 小军 |   M    |  88   |  3   | 三班 |
|  3   |    1     | 小军 |   M    |  88   |  4   | 四班 |
|  4   |    1     | 小米 |   F    |  73   |  1   | 一班 |
|  4   |    1     | 小米 |   F    |  73   |  2   | 二班 |
|  4   |    1     | 小米 |   F    |  73   |  3   | 三班 |
|  4   |    1     | 小米 |   F    |  73   |  4   | 四班 |
|  5   |    2     | 小白 |   F    |  81   |  1   | 一班 |
|  5   |    2     | 小白 |   F    |  81   |  2   | 二班 |
|  5   |    2     | 小白 |   F    |  81   |  3   | 三班 |
|  5   |    2     | 小白 |   F    |  81   |  4   | 四班 |
|  6   |    2     | 小兵 |   M    |  55   |  1   | 一班 |
|  6   |    2     | 小兵 |   M    |  55   |  2   | 二班 |
|  6   |    2     | 小兵 |   M    |  55   |  3   | 三班 |
|  6   |    2     | 小兵 |   M    |  55   |  4   | 四班 |
|  7   |    2     | 小林 |   M    |  85   |  1   | 一班 |
|  7   |    2     | 小林 |   M    |  85   |  2   | 二班 |
|  7   |    2     | 小林 |   M    |  85   |  3   | 三班 |
|  7   |    2     | 小林 |   M    |  85   |  4   | 四班 |
|  8   |    3     | 小新 |   F    |  91   |  1   | 一班 |
|  8   |    3     | 小新 |   F    |  91   |  2   | 二班 |
|  8   |    3     | 小新 |   F    |  91   |  3   | 三班 |
|  8   |    3     | 小新 |   F    |  91   |  4   | 四班 |
|  9   |    3     | 小王 |   M    |  89   |  1   | 一班 |
|  9   |    3     | 小王 |   M    |  89   |  2   | 二班 |
|  9   |    3     | 小王 |   M    |  89   |  3   | 三班 |
|  9   |    3     | 小王 |   M    |  89   |  4   | 四班 |
|  10  |    3     | 小丽 |   F    |  88   |  1   | 一班 |
|  10  |    3     | 小丽 |   F    |  88   |  2   | 二班 |
|  10  |    3     | 小丽 |   F    |  88   |  3   | 三班 |
|  10  |    3     | 小丽 |   F    |  88   |  4   | 四班 |

上述查询的结果集有两列`id`和两列`name`，两列`id`是因为其中一列是`students`表的`id`，而另一列是`classes`表的`id`，但是在结果集中，不好区分。两列`name`同理。要解决这个问题，我们仍然可以利用投影查询的“设置列的别名”来给两个表各自的`id`和`name`列起别名：

```sql
SELECT
    students.id sid,
    students.name,
    students.gender,
    students.score,
    classes.id cid,
    classes.name cname
FROM students, classes;

-- 以下也可

SELECT
    s.id sid,
    s.name,
    s.gender,
    s.score,
    c.id cid,
    c.name cname
FROM students s, classes c;
```

#### 1.1.6 注意事项

为执行一个查询，通常也不一定只有一种实现方法，很少有绝对正确或绝对错误的方法，性能可能会受操作类型、表中数据量、是否存在索引或键等一些条件的影响，因此，有必要对不同的选择机制进行实验，以找出最适合具体情况的办法。

### 1.2 过滤数据

查询数据时可以增加过滤条件语句以过滤数据。

#### 1.2.1 相关关键字

- `WHERE`：按指定条件进行行过滤，`WHERE`子句通常在`FROM`子句之后给出

    ```sql
    SELECT prod_name, prod_price
    FROM products
    WHERE prod_price = 2.50;
    ```

    - `WHERE ... IS NULL`：特殊的`WHERE`字句，可用来检查具有`NULL`值的列

- `HAVING`：`HAVING`非常类似于`WHERE`，`HAVING`支持所有`WHERE`操作，唯一的差别是`WHERE`过滤行，`HAVING`过滤分组。

    > 换言之可理解为：`WHERE`在数据分组前进行过滤，`HAVING`在数据分组后进行过滤，所以，`WHERE`排除的行不包括在分组中。

    - 示例 1：

        ```sql
        SELECT cust_id, COUNT(*) AS orders
        FROM orders
        GROUP BY cust_id
        HAVING COUNT(*) >= 2;
        ```

        | cust_id | orders |
        | :-----: | :----: |
        |  10001  |   2    |

    - 示例 2：

        ```sql
        SELECT vend_id, COUNT(*) AS num_prods
        FROM products
        WHERE prod_price >= 10
        GROUP BY vend_id
        HAVING COUNT(*) >= 2;
        ```

        | vend_id | num_prods |
        | :-----: | :-------: |
        |  1003   |     4     |
        |  1005   |     2     |

- `BETWEEN`：`BETWEEN 低端值 AND 高端值`，表示一个闭区间。

    ```sql
    SELECT prod_name, prod_price
    FROM products
    WHERE vend_id IN (1002, 1003)
    ORDER BY prod_name;
    ```

- `IN`：`IN` 取圆括号内由逗号分隔的合法值清单。

    ```sql
    SELECT prod_name, prod_price
    FROM products
    WHERE vend_id IN (1002, 1003)
    ORDER BY prod_name;
    ```

- `ORDER BY`：取一个/多个列的名字，据此对输出进行排序。

    ```sql
    SELECT prod_id, prod_price, prod_name
    FROM products
    ORDER BY prod_price, prod_name;
    ```

- `GROUP BY`：提供分组聚合功能，即先分组数据，然后对各个组分别进行指定的聚合操作。

    ```sql
    -- 执行该 SELECT 语句时，会把 class_id 相同的列先分组，再对各组分别计算其 COUNT(*)
    SELECT COUNT(*) as num FROM students GROUP BY class_id;
    
    -- 也可对多列进行操作
    SELECT class_id, gender, COUNT(*) as num FROM students GROUP BY class_id, gender;
    ```

以上`SELECT`子句的顺序

|    子句    |        说明        |      是否必须使用      |
| :--------: | :----------------: | :--------------------: |
|  `SELECT`  | 要返回的列或表达式 |           是           |
|   `FROM`   |  从中检索数据的表  | 仅在从表选择数据时使用 |
|  `WHERE`   |      行级过滤      |           否           |
| `GROUP BY` |      分组说明      | 仅在按组计算聚焦时使用 |
|  `HAVING`  |     分组级过滤     |           否           |
| `ORDER BY` |   输出的排序顺序   |           否           |
|  `LIMIT`   |    要检索的行数    |           否           |

常用的条件表达式：

|  符号  |   条件   |    表达式举例 1    |    表达式举例 2     |                          说明                           |
| :----: | :------: | :---------------: | :----------------: | :-----------------------------------------------------: |
|  `=`   |   相等   |   `score = 80`    |   `name = 'abc'`   |                字符串需要用单引号括起来                 |
|  `>`   |   大于   |   `score > 80`    |   `name > 'abc'`   |   字符串比较根据`ASCII`码，中文字符比较根据数据库设置   |
|  `>=`  | 大于等于 |   `score >= 80`   |  `name >= 'abc'`   |                                                         |
|  `<`   |   小于   |   `score < 80`    |  `name <= 'abc'`   |                                                         |
|  `<=`  | 小于等于 |   `score <= 80`   |  `name <= 'abc'`   |                                                         |
|  `<>`  |  不相等  |   `score <> 80`   |  `name <> 'abc'`   |                                                         |
| `LIKE` |   相似   | `name LIKE 'ab%'` | `name LIKE '%bc%'` | `%`表示任意字符，例如`'ab%'`将匹配`'ab', 'abc', 'abcd'` |

> 注意事项：在通过过滤条件选择出不具有特定值的行时，你可能希望返回具有`NULL`值的行，但是这其实做不到。因为`NULL`具有特殊的含义，数据库不知道它们是否匹配，所以在匹配过滤或不匹配过滤时不返回它们。

#### 1.2.2 ON、WHERE、HAVING

数据库在通过连接两张或多张表来返回记录时，都会生成一张中间的临时表，然后再将这张临时表返回给用户。在使用`join`时，`on`和`where`条件的区别如下：

- `on`条件：是在**生成**临时表时（强调这个生成过程）所采用的条件；
- `where`条件：是在临时表生成好后，对这张临时表进行**过滤**的条件；
- `on, where, having`这三个都可以加条件的子句中，`on`是最先执行，`where`次之，`having`最后。有时候如果这先后顺序不影响中间结果的话，那最终结果是相同的。

### 1.3 UNION 查询

`UNION`查询，即**组合查询**，或称**复合查询**。即，MySQL 允许一条查询语句中含多条`SELECT`语句，并将结果作为单个查询结果集返回。

其实，多数情况下，组合相同表的两个查询完成的工作与具有多个`WHERE`子句条件的单条查询完成的工作相同，`UNION`通常只意味着另一种书写方式，可能这种书写会显得简洁。

#### 1.3.1 UNION

给出每条`SELECT`语句，在各条语句之间放上关键字`UNION`即可：

```sql
SELECT vend_id, prod_id, prod_price
FROM products
WHERE prod_price <= 5
UNION
SELECT vend_id, prod_id, prod_price
FROM products
WHERE vend_id IN (1001, 1002);
```

`UNION`使用有几条规则：

1. `UNION`必须由两条或以上的`SELECT`语句组成，语句之间用`UNION`分隔；
2. `UNION`中的每个查询必须包含相同的列、表达式或聚集函数，各个列不需要以相同的次序列出；
3. 列数据类型必须兼容：类型不必完全相同，但必须是 DBMS 可以隐含转换的类型，如不同的数值类型或不同的日期类型。

#### 1.3.2 UNION ALL

`UNION`默认从查询结果集中自动去除了重复的行，如果想返回所有匹配行，使用`UNION ALL`。

```sql
SELECT vend_id, prod_id, prod_price
FROM products
WHERE prod_price <= 5
UNION ALL
SELECT vend_id, prod_id, prod_price
FROM products
WHERE vend_id IN (1001, 1002);
```

<img src="https://figure-bed.chua-n.com/数据库/MySQL/5.png" alt="img" style="zoom:50%;" />

#### 1.3.3 UNION 与 ORDER BY

在使用`UNION`组合查询时，**只能使用一条`ORDER BY`子句**，它必须出现在最后一条`SELECT`语句之后。

> 这实际上很好理解，因为`UNION`查询的结果是按照类似单个查询的结果给出的，即结果是一个整体，所以它的排序只能有一个。

```sql
SELECT vend_id, prod_id, prod_price
FROM products
WHERE prod_price <= 5
UNION
SELECT vend_id, prod_id, prod_price
FROM products
WHERE vend_id IN (1001, 1002)
ORDER BY vend_id, prod_price;
```

<img src="https://figure-bed.chua-n.com/数据库/MySQL/6.png" alt="6.png" style="zoom:50%;" />

## 2. DML

> DML(Data Manipulation Language)：数据的增删改

关系数据库的基本操作就是增删改查，即 CRUD：

- C：Create
- R：Retrieve
- U：Update
- D：Delete

其中，对于查询，我们已经详细讲述了`SELECT`语句的详细用法，而对于增、删、改，对应的 SQL 语句分别是：

- `INSERT`：插入新记录；
- `UPDATE`：更新已有记录；
- `DELETE`：删除已有记录。

### 2.1 INSERT

语法：

```sql
INSERT INTO <表名> (字段1, 字段2, ...) VALUES (值1, 值2, ...);
```

示例：

```sql
-- 添加一条新记录
INSERT INTO students (class_id, name, gender, score) VALUES (2, '大牛', 'M', 80);

-- 查询并观察结果：
SELECT * FROM students;
```

还可以一次性添加多条记录，只需要在`VALUES`子句中指定多个记录值，每个记录是由`(...)`包含的一组值：

```sql
-- 一次性添加多条新记录
INSERT INTO students (class_id, name, gender, score) VALUES
  (1, '大宝', 'M', 87),
  (2, '二宝', 'M', 81);

SELECT * FROM students;
```

### 2.2 UPDATE

语法：

```sql
UPDATE <表名> SET 字段1=值1, 字段2=值2, ... WHERE ...;
```

示例：

```sql
-- 更新 id=1 的记录
UPDATE students SET name='大牛', score=66 WHERE id=1;

-- 查询并观察结果：
SELECT * FROM students WHERE id=1;
```

在`UPDATE`语句中，更新字段时可以使用表达式。例如，把所有 80 分以下的同学的成绩加 10 分：

```sql
-- 更新 id=999 的记录
UPDATE students SET score=100 WHERE id=999;

-- 查询并观察结果：
SELECT * FROM students;
```

`UPDATE`语句可以没有`WHERE`条件，这时整个表的所有记录都会被更新。例如：

```sql
UPDATE students SET score=60;
```

因此，在执行`UPDATE`语句时要非常小心！

### 2.3 DELETE

语法：

```sql
DELETE FROM <表名> WHERE ...;
```

示例：

```sql
-- 删除 id=1 的记录 
DELETE FROM students WHERE id=1;

-- 查询并观察结果：
SELECT * FROM students;
```

和`UPDATE`类似，不带`WHERE`条件的`DELETE`语句会删除整个表的数据：

```sql
DELETE FROM students;
```

这时，整个表的所有记录都会被删除。所以，在执行`DELETE`语句时也要非常小心！
### 2.4 复合式

```sql
INSERT … SELECT …
```

结合`INSERT`和`SELECT`，可以将`SELECT`语句的结果集直接插入到指定表中，例如：

```sql
INSERT INTO statistics (class_id, average)
SELECT class_id, AVG(score) 
FROM students
GROUP BY class_id;
```

## 3. DDL

> DDL(Data Definition Language)——修改库表“结构”。

### 3.1 库结构操作

- `SHOW`

  - `SHOW DATABASES`：列出本 MySQL 服务器上含有的所有数据库

  - `SHOW TABLES`：查看当前数据库的所有表

  - `SHOW COLUMNS FROM customers`：显式内部表的信息

  - `SHOW CREATE DATABASE/TABLE`：显示创建某数据库/表的 MySQL 语句

  - `SHOW GRANTS`：显示授予用户的安全权限

  - `SHOW STATUS`：显示广泛的服务器状态信息

  - `SHOW ERRORS`：显示服务器错误消息

  - `SHOW WARNINGS`：显示服务器警告消息

- `DESCRIBE`：作为 `SHOW COLUMNS FROM` 的一种快捷方式

  ```sql
  DESCRIBE customers;
  ```

- `CREATE`

  ```sql
  -- 创建一个新的数据库
  CREATE DATABASE;
  -- 创建一个新的表
  CREATE TABLE;
  ```

  ```cmd
  mysql> CREATE DATABASE test;
  Query OK, 1 row affected (0.01 sec)
  ```

- `DROP`：`DROP DATABASE/TABLE`删除一个数据库/表（删除一个数据库将导致该数据库的所有表全部被删除）

  ```cmd
  mysql> DROP DATABASE test;
  Query OK, 0 rows affected (0.01 sec)
  ```

- `USE`：把某数据库切换为当前数据库，以便对其操作

  ```cmd
  mysql> USE test;
  Database changed
  ```

- `EXIT`：退出 mysql

- `HELP`：显示某命令的帮助

  ```cmd
  mysql> HELP SHOW;
  ```

### 3.2 表结构操作

- `ADD COLUMN`：给`students`表新增一列`birth`：

  ```sql
  ALTER TABLE students ADD COLUMN birth VARCHAR(10) NOT NULL;
  ```

- `CHANGE COLUMN`：修改`birth`列，把列名改为`birthday`，类型改为`VARCHAR(20)`：

  ````sql
  ALTER TABLE students CHANGE COLUMN birth birthday VARCHAR(20) NOT NULL;
  ````

- `DROP COLUMN`：删除列`birthday`

  ```sql
  ALTER TABLE students DROP COLUMN birthday;
  ```

- `AUTO_INCREMENT`：将表的`AUTO_INCREMENT`值修改为`number`：

  ```sql
  ALTER TABLE students AUTO_INCREMENT number;
  ```

- `CREATE TABLE`：创建新表

- `ALTER TABLE`：变更（改变）数据库表

- `DROP TABLE`：删除表

- `CREATE INDEX`：创建索引（搜索键）

- `DROP INDEX`：删除索引

## 4. 函数

### 4.1 文本函数

|     函数      | 说明                |
| :-----------: | ------------------- |
|   `Left()`    | 返回串左边的字符    |
|  `Length()`   | 返回串的长度        |
|  `Locate()`   | 找出串的一个子串    |
|   `Lower()`   | 将串转换为小写      |
|   `LTrim()`   | 去掉串左边的空格    |
|   `Right()`   | 返回串右边的字符    |
|   `RTrim()`   | 去掉串右边的空格    |
|  `Soundex()`  | 返回串的`SOUNDEX`值 |
| `SubString()` | 返回子串的字符      |
|   `Upper()`   | 将串转换为大写      |

> 注：`SOUNDEX`是一个将任何文本串转换为描述其语音表示的字母数字模式的算法。`SOUNDEX`考虑了类似的发音字符和音节，使得能对串进行发音比较而不是字母比较。
>
> ```sql
> SELECT cust_name, cust_concat
> FROM customers
> WHERE Soundex(cust_concat) = Soundex('Y Lie');
> ```
>
> 输出：
>
> |  cust_name  | cust_concat |
> | :---------: | :---------: |
> | Coyote Inc. |    Y Lee    |

### 4.2 数值函数

|   函数   | 说明               |
| :------: | ------------------ |
| `Abs()`  | 返回一个数的绝对值 |
| `Cos()`  | 返回一个角度的余弦 |
| `Exp()`  | 返回一个数的指数值 |
| `Mod()`  | 返回除操作的余数   |
|  `Pi()`  | 返回圆周率         |
| `Rand()` | 返回一个随机数     |
| `Sin()`  | 返回一个角度的正弦 |
| `Sqrt()` | 返回一个数的平方根 |
| `Tan()`  | 返回一个角度的正切 |

### 4.3 日期和时间函数

|      函数       | 说明                           |
| :-------------: | ------------------------------ |
|   `AddDate()`   | 增加一个日期（天、周等）       |
|   `AddTime()`   | 增加一个时间（时、分等）       |
|   `CurDate()`   | 返回当前日期                   |
|   `CurTime()`   | 返回当前时间                   |
|    `Date()`     | 返回日期时间的日期部分         |
|  `DateDiff()`   | 计算两个日期之差               |
|  `Date_Add()`   | 高度灵活的日期运算函数         |
| `Date_Format()` | 返回一个格式化的日期或时间串   |
|     `Day()`     | 返回一个日期的天数部分         |
|  `DayOfWeek()`  | 对于一个日期，返回对应的星期几 |
|    `Hour()`     | 返回一个时间的小时部分         |
|   `Minute()`    | 返回一个时间的分钟部分         |
|    `Month()`    | 返回一个日期的月份部分         |
|     `Now()`     | 返回当前日期和时间             |
|   `Second()`    | 返回一个时间的秒部分           |
|    `Time()`     | 返回一个日期时间的时间部分     |
|    `Year()`     | 返回一个日期的年份部分         |

### 4.4 系统函数

返回 DBMS 正使用的特殊信息，如返回用户登录信息，检查版本细节

### 4.5 聚合函数

运行在行组上，计算和返回单个值的函数。聚合的计算结果虽然是一个数字，但查询的结果仍然是一个二维表，只是这个二维表只有一行一列。

| 函数                | 说明                                                         |
| ------------------- | ------------------------------------------------------------ |
| `COUNT()`           | 返回某列的行数。<br />1) `COUNT(*)`对表中的行的数目进行计算，不管表列中包含的是否为`NULL`；<br/>2) `COUNT(column)`对特定列中具有值的行进行计算，忽略`NULL`值。 |
| `AVG()`             | 返回某列的平均值，该列必须为数值类型。<br />1) 若要获得多个列的平均值，必须使用多个`AVG()`函数；<br />2) `AVG()`函数忽略值为`NULL`的行。 |
| `SUM()`             | 返回某列值之和，该列必须为数值类型。其忽略值为`NULL`的行。   |
| `MAX()`             | 返回某列的最大值。<br />1) 一般用来找出最大的数值或日期值，但 MySQL 允许其对任意列返回最大值，包括返回文本列中的最大值。<br/>2) 在用于文本数据时，如果数据按相应的列排序，则`MAX()`返回最后一行。<br/>3) `MAX()`忽略值为`NULL`的行。 |
| `MIN()`             | 返回某列的最小值。                                           |
| `ALL/DISTINCT` 参数 | 聚集函数默认`ALL`参数，可以指定`DISTINCT`参数                |
| 结合`WHERE`子句     | 可指定条件查询。<br />如果聚合查询的`WHERE`条件没有匹配到任何行，`COUNT()`会返回`0`，而`SUM(), AVG(), MAX(), MIN()`会返回`NULL`。 |

`SELECT`语句可以包含多个聚集函数：

```sql
SELECT COUNT(*) AS num_items,
	MIN(prod_price) AS price_min,
	MAX(prod_price) AS price_max,
	AVG(prod_price) AS price_avg
FROM products;
```

### 4.6 一些函数举例

......
