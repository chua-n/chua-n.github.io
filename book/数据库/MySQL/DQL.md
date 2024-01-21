> DQL(Data Query Language)：查询数据。

## 1. 查询数据

### 1.1 查询的概念

```sql
SELECT cus_name, cust_contact
FROM customers
WHERE cust_id IN (SELECT cust_id
                 FROM orders
                 WHERE order_num IN (SELECT order_num
                                    FROM orderitems
                                    WHERE prod_id = 'TNT2'));
```



- **查询**(query)——任何SQL语句都是查询，但此术语一般指`SELECT`语句。
- **子查询**(subquery)——嵌套在其他查询中的查询。在`SELECT`语句中，查询总是从内向外处理。

如果没有明确排序查询结果，则返回的数据的顺序没有特殊意义。

### 1.2 SELECT基本用法

| 语法                                          | 说明                   |
| --------------------------------------------- | ---------------------- |
| `  SELECT * FROM <表名>  `                    | 基本查询               |
| `  SELECT * FROM <表名> WHERE <条件表达式>  ` | 条件查询               |
| `  SELECT 列1, 列2, 列3 FROM ...  `           | 投影查询               |
| `  SELECT * FROM <表1> <表2>  `               | 多表查询（笛卡乐查询） |

- `*`表示“所有列”，`FROM`表示将要从哪个表查询

- `SELECT * FROM students`将查询出`students`表的所有数据。

    > 注意：查询结果也是一个二维表，它包含列名和每一行的数据。

- 使用笛卡尔查询时要非常小心，结果集的列数是被查询表的列数之和，行数是被查询表的行数之积！对两个各自有1万行记录的表进行笛卡尔查询将返回1亿条记录！

- 使用`SELECT 列1, 列2, 列3 FROM ...`时，还可以给每一列起个别名，这样，结果集的列名就可以与原表的列名不同。它的语法是`SELECT 列1 别名1, 列2 别名2, 列3 别名3 FROM ...`

### 1.3 LIMIT子句

带`LIMIT`的查询也叫**分页查询**，至于为什么这么叫，可以看廖雪峰的网站或百度一下。

| 语法                                | 说明                                |
| ----------------------------------- | ----------------------------------- |
| `  LIMIT offset row_count  `        | 从`offset`开始返回`row_count`行数据 |
| `  LIMIT row_count OFFSET offset  ` | 同上，另一种写法                    |

其中：

- `OFFSET`是可选的，如果只写`LIMIT row_count`，那么相当于`LIMIT M OFFSET 0`
- 使用`LIMIT <M> OFFSET <N>`分页时，随着N越来越大，查询效率也会越来越低

### 1.4 JOIN子句

`JOIN`子句代表连接查询，连接查询是另一种类型的多表查询，其对多个表进行`JOIN`运算。简单地说，就是先确定一个主表作为结果集，然后，把其他表的行有选择性地“连接”在主表结果集上。`JOIN`的语法如下：

```sql
SELECT ... FROM tableA ??? JOIN tableB ON tableA.column1 = tableB.column2;
```

| ???的含义                            | 说明                         |
| ------------------------------------ | ---------------------------- |
| `INNER JOIN`                         | 返回同时存在于两张表的行数据 |
| `LEFT OUTER JOIN`<br />`LEFT JOIN`   | 返回左表都存在的行           |
| `RIGHT OUTER JOIN`<br />`RIGHT JOIN` | 返回右表都存在的行           |
| `FULL JOIN`                          | 返回两张表的所有记录         |

#### 案例准备

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

#### INNER JOIN

`INNER JOIN`只返回同时存在于两张表的行数据，由于`students`表的`class_id`包含1，2，3，`classes`表的`id`包含1，2，3，4，所以，`INNER JOIN`根据条件`s.class_id = c.id`返回的结果集仅包含1，2，3。

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

#### RIGHT OUTER JOIN

`RIGHT OUTER JOIN`返回右表都存在的行。如果某一行仅在右表存在，那么结果集就会以`NULL`填充剩下的字段。

```sql
-- 使用OUTER JOIN
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

#### LEFT OUTER JOIN

`LEFT OUTER JOIN`则返回左表都存在的行。如果我们给`students`表增加一行，并添加`class_id=5`，由于`classes`表并不存在`id=5`的行，所以，`LEFT OUTER JOIN`的结果会增加一行，对应的`class_name`是`NULL`。

```sql
-- 先增加一列class_id=5:
INSERT INTO students (class_id, name, gender, score) values (5, '新生', 'M', 88);
-- 使用LEFT OUTER JOIN
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

#### FULL JOIN

```sql
-- 使用FULL OUTER JOIN
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

#### 图解连接查询

假设查询语句如下，结合下图，我们把`tableA`看作左表，把`tableB`看成右表：

```sql
SELECT ... FROM tableA ??? JOIN tableB ON tableA.column1 = tableB.column2;
```

|      连接方式      |                             图示                             |          说明          |
| :----------------: | :----------------------------------------------------------: | :--------------------: |
|    `INNER JOIN`    | ![inner-join](https://chua-n.gitee.io/figure-bed/notebook/数据库/MySQL/1.png) | 选出两张表都存在的记录 |
| `LEFT OUTER JOIN`  | ![left-outer-join](https://chua-n.gitee.io/figure-bed/notebook/数据库/MySQL/2.png) |   选出左表存在的记录   |
| `RIGHT OUTER JOIN` | ![right-outer-join](https://chua-n.gitee.io/figure-bed/notebook/数据库/MySQL/3.png) |   选出右表存在的记录   |
| `FULL OUTER JOIN`  | ![full-outer-join](https://chua-n.gitee.io/figure-bed/notebook/数据库/MySQL/4.png) | 选出左右表都存在的记录 |

要意识到连接只是一种机制，用来在一条`SELECT`语句中关联表，其不是物理实体，换句话说，它在实际的数据库表中不存在，仅存在于查询的执行当中。

### 1.5 笛卡尔查询示例

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

### 1.6 注意事项

为执行一个查询，通常也不一定只有一种实现方法，很少有绝对正确或绝对错误的方法，性能可能会受操作类型、表中数据量、是否存在索引或键等一些条件的影响，因此，有必要对不同的选择机制进行实验，以找出最适合具体情况的办法。

## 2. 过滤数据

查询数据时可以增加过滤条件语句以过滤数据。

### 2.1 相关关键字

- `WHERE`：按指定条件进行行过滤，`WHERE`子句通常在`FROM`子句之后给出

    ```sql
    SELECT prod_name, prod_price
    FROM products
    WHERE prod_price = 2.50;
    ```

    - `WHERE ... IS NULL`：特殊的`WHERE`字句，可用来检查具有`NULL`值的列

- `HAVING`：`HAVING`非常类似于`WHERE`，`HAVING`支持所有`WHERE`操作，唯一的差别是`WHERE`过滤行，`HAVING`过滤分组。

    > 换言之可理解为：`WHERE`在数据分组前进行过滤，`HAVING`在数据分组后进行过滤，所以，`WHERE`排除的行不包括在分组中。

    - 示例1：

        ```sql
        SELECT cust_id, COUNT(*) AS orders
        FROM orders
        GROUP BY cust_id
        HAVING COUNT(*) >= 2;
        ```

        | cust_id | orders |
        | :-----: | :----: |
        |  10001  |   2    |

    - 示例2：

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
    -- 执行该SELECT语句时，会把class_id相同的列先分组，再对各组分别计算其COUNT(*)
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

|  符号  |   条件   |    表达式举例1    |    表达式举例2     |                          说明                           |
| :----: | :------: | :---------------: | :----------------: | :-----------------------------------------------------: |
|  `=`   |   相等   |   `score = 80`    |   `name = 'abc'`   |                字符串需要用单引号括起来                 |
|  `>`   |   大于   |   `score > 80`    |   `name > 'abc'`   |   字符串比较根据`ASCII`码，中文字符比较根据数据库设置   |
|  `>=`  | 大于等于 |   `score >= 80`   |  `name >= 'abc'`   |                                                         |
|  `<`   |   小于   |   `score < 80`    |  `name <= 'abc'`   |                                                         |
|  `<=`  | 小于等于 |   `score <= 80`   |  `name <= 'abc'`   |                                                         |
|  `<>`  |  不相等  |   `score <> 80`   |  `name <> 'abc'`   |                                                         |
| `LIKE` |   相似   | `name LIKE 'ab%'` | `name LIKE '%bc%'` | `%`表示任意字符，例如`'ab%'`将匹配`'ab', 'abc', 'abcd'` |

> 注意事项：在通过过滤条件选择出不具有特定值的行时，你可能希望返回具有`NULL`值的行，但是这其实做不到。因为`NULL`具有特殊的含义，数据库不知道它们是否匹配，所以在匹配过滤或不匹配过滤时不返回它们。

### 2.2 ON、WHERE、HAVING

数据库在通过连接两张或多张表来返回记录时，都会生成一张中间的临时表，然后再将这张临时表返回给用户。在使用`join`时，`on`和`where`条件的区别如下：

- `on`条件：是在**生成**临时表时（强调这个生成过程）所采用的条件；
- `where`条件：是在临时表生成好后，对这张临时表进行**过滤**的条件；
- `on, where, having`这三个都可以加条件的子句中，`on`是最先执行，`where`次之，`having`最后。有时候如果这先后顺序不影响中间结果的话，那最终结果是相同的。

## 3. UNION查询

`UNION`查询，即**组合查询**，或称**复合查询**。即，MySQL允许一条查询语句中含多条`SELECT`语句，并将结果作为单个查询结果集返回。

其实，多数情况下，组合相同表的两个查询完成的工作与具有多个`WHERE`子句条件的单条查询完成的工作相同，`UNION`通常只意味着另一种书写方式，可能这种书写会显得简洁。

### 3.1 UNION

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

`UNION`使用有几条**规则**：

1. `UNION`必须由两条或以上的`SELECT`语句组成，语句之间用`UNION`分隔；

2. `UNION`中的每个查询必须包含相同的列、表达式或聚集函数，各个列不需要以相同的次序列出；

3. 列数据类型必须兼容：类型不必完全相同，但必须是DBMS可以隐含转换的类型，如不同的数值类型或不同的日期类型。

### 3.2 UNION ALL

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

<img src="https://chua-n.gitee.io/figure-bed/notebook/数据库/MySQL/5.png" alt="img" style="zoom:50%;" />

### 3.3 UNION 与 ORDER BY

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

<img src="https://chua-n.gitee.io/figure-bed/notebook/数据库/MySQL/6.png" alt="6.png" style="zoom:50%;" />