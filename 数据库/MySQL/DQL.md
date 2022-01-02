> DQL：查询数据。

## 1. 查询数据

### 1.1 查询的概念

**查询**(query)——任何SQL语句都是查询，但此术语一般指SELECT语句。

**子查询**(subquery)——嵌套在其他查询中的查询。在SELECT语句中，子查询总是从内向外处理。

```sql
SELECT cus_name, cust_contact
FROM customers
WHERE cust_id IN (SELECT cust_id
                 FROM orders
                 WHERE order_num IN (SELECT order_num
                                    FROM orderitems
                                    WHERE prod_id = 'TNT2'));
```

如果没有明确排序查询结果，则返回的数据的顺序没有特殊意义。

### 1.2 SELECT基本用法

| 语法                                          | 说明     |
| --------------------------------------------- | -------- |
| `  SELECT * FROM <表名>  `                    | 基本查询 |
| `  SELECT * FROM <表名> WHERE <条件表达式>  ` | 条件查询 |
| `  SELECT 列1, 列2, 列3 FROM ...  `           | 投影查询 |
| `  SELECT * FROM <表1> <表2>  `               | 多表查询 |

- `*`表示“所有列”，FROM表示将要从哪个表查询

- `SELECT * FROM students`将查询出students表的所有数据。

    > 注意：查询结果也是一个二维表，它包含列名和每一行的数据。

- 这种多表查询又称**笛卡尔查询**，使用笛卡尔查询时要非常小心，结果集的列数是被查询表的列数之和，行数是被查询表的行数之积！对两个各自有1万行记录的表进行笛卡尔查询将返回1亿条记录！       

使用`SELECT 列1, 列2, 列3 FROM ...`时，还可以给每一列起个别名，这样，结果集的列名就可以与原表的列名不同。它的语法是`SELECT 列1 别名1, 列2 别名2, 列3 别名3 FROM ...`

### 1.3 LIMIT子句

| 语法                                | 说明                            |
| ----------------------------------- | ------------------------------- |
| `  LIMIT offset row_count  `        | 从offset开始返回row_count行数据 |
| `  LIMIT row_count OFFSET offset  ` | 同上，另一种写法                |

其中：

- OFFSET是可选的，如果只写`LIMIT row_count`，那么相当于`LIMIT M OFFSET 0`
- 使用`LIMIT <M> OFFSET <N>`分页时，随着N越来越大，查询效率也会越来越低

这种查询也叫分页查询，至于为什么这么叫，可以看廖雪峰的网站或百度一下。

### 1.4 JOIN子句

语法：

```sql
SELECT ... FROM tableA ??? JOIN tableB ON tableA.column1 = tableB.column2;
```

| ???的含义                        | 说明                         |
| -------------------------------- | ---------------------------- |
| INNER JOIN                       | 返回同时存在于两张表的行数据 |
| LEFT OUTER JOIN<br />LEFT JOIN   | 返回左表都存在的行           |
| RIGHT OUTER JOIN<br />RIGHT JOIN | 返回右表都存在的行           |
| FULL JOIN                        | 返回两张表的所有记录         |

### 1.5 连接查询详解

JOIN子句代表连接查询，连接查询是另一种类型的多表查询，其对多个表进行JOIN运算，简单地说，就是先确定一个主表作为结果集，然后，把其他表的行有选择性地“连接”在主表结果集上。

例如，对于两个表students和classes，如下。

```sql
-- 选出所有学生
SELECT s.id, s.name, s.class_id, s.gender, s.score FROM students s;
```

| **id** | **name** | **class_id** | **gender** | **score** |
| ------ | -------- | ------------ | ---------- | --------- |
| 1      | 小明     | 1            | M          | 90        |
| 2      | 小红     | 1            | F          | 95        |
| 3      | 小军     | 1            | M          | 88        |
| 4      | 小米     | 1            | F          | 73        |
| 5      | 小白     | 2            | F          | 81        |
| 6      | 小兵     | 2            | M          | 55        |
| 7      | 小林     | 2            | M          | 85        |
| 8      | 小新     | 3            | F          | 91        |
| 9      | 小王     | 3            | M          | 89        |
| 10     | 小丽     | 3            | F          | 88        |

```sql
SELECT * FROM classes;
```

| **id** | **name** |
| ------ | -------- |
| 1      | 一班     |
| 2      | 二班     |
| 3      | 三班     |
| 4      | 四班     |

假设我们希望结果集同时包含所在班级的名称，上面的结果集只有class_id列，缺少对应班级的name列。而存放班级名称的name列存储在classes表中，只有根据students表的class_id，找到classes表对应的行，再取出name列，就可以获得班级名称。这时，连接查询就派上了用场。

#### INNER JOIN

INNER JOIN只返回同时存在于两张表的行数据，由于students表的class_id包含1，2，3，classes表的id包含1，2，3，4，所以，INNER JOIN根据条件s.class_id = c.id返回的结果集仅包含1，2，3。

```sql
-- 选出所有学生，同时返回班级名称
SELECT s.id, s.name, s.class_id, c.name class_name, s.gender, s.score
FROM students s
INNER JOIN classes c
ON s.class_id = c.id;
```

| **id** | **name** | **class_id** | **class_name** | **gender** | **score** |
| ------ | -------- | ------------ | -------------- | ---------- | --------- |
| 1      | 小明     | 1            | 一班           | M          | 90        |
| 2      | 小红     | 1            | 一班           | F          | 95        |
| 3      | 小军     | 1            | 一班           | M          | 88        |
| 4      | 小米     | 1            | 一班           | F          | 73        |
| 5      | 小白     | 2            | 二班           | F          | 81        |
| 6      | 小兵     | 2            | 二班           | M          | 55        |
| 7      | 小林     | 2            | 二班           | M          | 85        |
| 8      | 小新     | 3            | 三班           | F          | 91        |
| 9      | 小王     | 3            | 三班           | M          | 89        |
| 10     | 小丽     | 3            | 三班           | F          | 88        |

注意INNER JOIN查询的写法是：

1. 先确定主表，仍然使用`FROM <表1>`的语法；
2. 再确定需要连接的表，使用`INNER JOIN <表2>`的语法；
3. 然后确定连接条件，使用`ON <条件...>`，这里的条件是`s.class_id = c.id`，表示`students`表的`class_id`列与`classes`表的`id`列相同的行需要连接；
4. 可选：加上`WHERE`子句、`ORDER BY`等子句。
5. 使用别名不是必须的，但可以更好地简化查询语句。       

#### RIGHT OUTER JOIN

RIGHT OUTER JOIN返回右表都存在的行。如果某一行仅在右表存在，那么结果集就会以NULL填充剩下的字段。

```sql
-- 使用OUTER JOIN
SELECT s.id, s.name, s.class_id, c.name class_name, s.gender, s.score
FROM students s
RIGHT OUTER JOIN classes c
ON s.class_id = c.id;
```

| **id** | **name** | **class_id** | **class_name** | **gender** | **score** |
| ------ | -------- | ------------ | -------------- | ---------- | --------- |
| 1      | 小明     | 1            | 一班           | M          | 90        |
| 2      | 小红     | 1            | 一班           | F          | 95        |
| 3      | 小军     | 1            | 一班           | M          | 88        |
| 4      | 小米     | 1            | 一班           | F          | 73        |
| 5      | 小白     | 2            | 二班           | F          | 81        |
| 6      | 小兵     | 2            | 二班           | M          | 55        |
| 7      | 小林     | 2            | 二班           | M          | 85        |
| 8      | 小新     | 3            | 三班           | F          | 91        |
| 9      | 小王     | 3            | 三班           | M          | 89        |
| 10     | 小丽     | 3            | 三班           | F          | 88        |
| NULL   | NULL     | NULL         | 四班           | NULL       | NULL      |

和INNER JOIN相比，RIGHT OUTER JOIN多了一行，多出来的一行是“四班”，但是，学生相关的列如name、gender、score都为NULL。

这也容易理解，因为根据ON条件`s.class_id = c.id`，classes表的id=4的行正是“四班”，但是，students表中并不存在class_id=4的行。

#### LEFT OUTER JOIN

LEFT OUTER JOIN则返回左表都存在的行。如果我们给students表增加一行，并添加class_id=5，由于classes表并不存在id=5的行，所以，LEFT OUTER JOIN的结果会增加一行，对应的class_name是NULL

```sql
-- 先增加一列class_id=5:
INSERT INTO students (class_id, name, gender, score) values (5, '新生', 'M', 88);
-- 使用LEFT OUTER JOIN
SELECT s.id, s.name, s.class_id, c.name class_name, s.gender, s.score
FROM students s
LEFT OUTER JOIN classes c
ON s.class_id = c.id;
```

| **id** | **name** | **class_id** | **class_name** | **gender** | **score** |
| ------ | -------- | ------------ | -------------- | ---------- | --------- |
| 1      | 小明     | 1            | 一班           | M          | 90        |
| 2      | 小红     | 1            | 一班           | F          | 95        |
| 3      | 小军     | 1            | 一班           | M          | 88        |
| 4      | 小米     | 1            | 一班           | F          | 73        |
| 5      | 小白     | 2            | 二班           | F          | 81        |
| 6      | 小兵     | 2            | 二班           | M          | 55        |
| 7      | 小林     | 2            | 二班           | M          | 85        |
| 8      | 小新     | 3            | 三班           | F          | 91        |
| 9      | 小王     | 3            | 三班           | M          | 89        |
| 10     | 小丽     | 3            | 三班           | F          | 88        |
| 11     | 新生     | 5            | NULL           | M          | 88        |

RIGHT OUTER JOIN和INNER JOIN相比的差异同上。

#### FULL JOIN

```sql
-- 使用FULL OUTER JOIN
SELECT s.id, s.name, s.class_id, c.name class_name, s.gender, s.score
FROM students s
FULL OUTER JOIN classes c
ON s.class_id = c.id;
```

| **id** | **name** | **class_id** | **class_name** | **gender** | **score** |
| ------ | -------- | ------------ | -------------- | ---------- | --------- |
| 1      | 小明     | 1            | 一班           | M          | 90        |
| 2      | 小红     | 1            | 一班           | F          | 95        |
| 3      | 小军     | 1            | 一班           | M          | 88        |
| 4      | 小米     | 1            | 一班           | F          | 73        |
| 5      | 小白     | 2            | 二班           | F          | 81        |
| 6      | 小兵     | 2            | 二班           | M          | 55        |
| 7      | 小林     | 2            | 二班           | M          | 85        |
| 8      | 小新     | 3            | 三班           | F          | 91        |
| 9      | 小王     | 3            | 三班           | M          | 89        |
| 10     | 小丽     | 3            | 三班           | F          | 88        |
| 11     | 新生     | 5            | NULL           | M          | 88        |
| NULL   | NULL     | NULL         | 四班           | NULL       | NULL      |

最后，我们使用FULL OUTER JOIN，它会把两张表的所有记录全部选择出来，并且，自动把对方不存在的列填充为NULL。

#### 图解连接查询

假设查询语句如下，结合下图，我们把tableA看作左表，把tableB看成右表：

```sql
SELECT ... FROM tableA ??? JOIN tableB ON tableA.column1 = tableB.column2;
```

- INNER JOIN是选出两张表都存在的记录：

    ![inner-join](https://chua-n.gitee.io/blog-images/notebooks/数据库/1.png)

- LEFT OUTER JOIN是选出左表存在的记录：

    ![left-outer-join](https://chua-n.gitee.io/blog-images/notebooks/数据库/2.png)

- RIGHT OUTER JOIN是选出右表存在的记录：

    ![right-outer-join](https://chua-n.gitee.io/blog-images/notebooks/数据库/3.png)

- FULL OUTER JOIN则是选出左右表都存在的记录：

    ![full-outer-join](https://chua-n.gitee.io/blog-images/notebooks/数据库/4.png)

要意识到连接只是一种机制，用来在一条SELECT语句中关联表，其不是物理实体，换句话说，它在实际的数据库表中不存在，仅存在于查询的执行当中。

### 1.6 笛卡尔查询示例

由没有连接条件的表关系返回的结果为笛卡尔积，即一个表中中的每一个将与另一个表中的每个配对而不管它们是否逻辑上可以在一起，如同时从students表和classes表查询数据：

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

上述查询的结果集有两列id和两列name，两列id是因为其中一列是students表的id，而另一列是classes表的id，但是在结果集中，不好区分。两列name同理。要解决这个问题，我们仍然可以利用投影查询的“设置列的别名”来给两个表各自的id和name列起别名：

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

### 1.7 注意事项

为执行一个查询，通常也不一定只有一种实现方法，很少有绝对正确或绝对错误的方法，性能可能会受操作类型、表中数据量、是否存在索引或键等一些条件的影响，因此，有必要对不同的选择机制进行实验，以找出最适合具体情况的办法。

## 2. 过滤数据

查询数据时可以增加过滤条件语句以过滤数据。

### 相关关键字

- `WHERE`：按指定条件进行行过滤，WHERE子句通常在FROM子句之后给出

    ```sql
    SELECT prod_name, prod_price
    FROM products
    WHERE prod_price = 2.50;
    ```

    - `WHERE ... IS NULL`：特殊的WHERE字句，可用来检查具有NULL值的列

- `HAVING`：HAVING非常类似于WHERE，HAVING支持所有WHERE操作，唯一的差别是WHERE过滤行，HAVING过滤分组。

    > 换言之可理解为：WHERE在数据分组前进行过滤，HAVING在数据分组后进行过滤，所以，WHERE排除的行不包括在分组中。

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

- `IN`：IN 取圆括号内由逗号分隔的合法值清单。

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

以上SELECT子句的顺序

|    子句     |        说明        |      是否必须使用      |
| :---------: | :----------------: | :--------------------: |
|  `SELECT`   | 要返回的列或表达式 |           是           |
|   `FROM`    |  从中检索数据的表  | 仅在从表选择数据时使用 |
|   `WHERE`   |      行级过滤      |           否           |
| `GROUP  BY` |      分组说明      | 仅在按组计算聚焦时使用 |
|  `HAVING`   |     分组级过滤     |           否           |
| `ORDER  BY` |   输出的排序顺序   |           否           |
|   `LIMIT`   |    要检索的行数    |           否           |

常用的条件表达式：

|  符号  |   条件   |    表达式举例1    |    表达式举例2     |                       说明                        |
| :----: | :------: | :---------------: | :----------------: | :-----------------------------------------------: |
|  `=`   |   相等   |   `score = 80`    |   `name = 'abc'`   |             字符串需要用单引号括起来              |
|  `>`   |   大于   |   `score > 80`    |   `name > 'abc'`   | 字符串比较根据ASCII码，中文字符比较根据数据库设置 |
|  `>=`  | 大于等于 |   `score >= 80`   |  `name >= 'abc'`   |                                                   |
|  `<`   |   小于   |   `score < 80`    |  `name <= 'abc'`   |                                                   |
|  `<=`  | 小于等于 |   `score <= 80`   |  `name <= 'abc'`   |                                                   |
|  `<>`  |  不相等  |   `score <> 80`   |  `name <> 'abc'`   |                                                   |
| `LIKE` |   相似   | `name LIKE 'ab%'` | `name LIKE '%bc%'` | %表示任意字符，例如'ab%'将匹配'ab'，'abc'，'abcd' |

> 注意事项：在通过过滤条件选择出不具有特定值的行时，你可能希望返回具有NULL值的行，但是这其实做不到。因为未知具有特殊的含义，数据库不知道它们是否匹配，所以在匹配过滤或不匹配过滤时不返回它们。

### ON、WHERE

数据库在通过连接两张或多张表来返回记录时，都会生成一张中间的临时表，然后再将这张临时表返回给用户。在使用join时，on和where条件的区别如下：

1. “on条件”是在**生成**临时表时（强调这个生成过程）所采用的条件；

2. “where条件”是在临时表生成好后，对这张临时表进行**过滤**的条件。

### ON、WHERE、HAVING的区别

on、where、having这三个都可以加条件的子句中，on是最先执行，where次之，having最后。有时候如果这先后顺序不影响中间结果的话，那最终结果是相同的。但因为on是先把不符合条件的记录过滤后才进行统计，它就可以减少中间运算要处理的数据，按理说应该速度是最快的。

  根据上面的分析，可以知道where也应该比having快点的，因为它过滤数据后才进行sum，所以having是最慢的。但也不是说having没用，因为有时在步骤3还没出来都不知道那个记录才符合要求时，就要用having了。

  在两个表联接时才用on的，所以在一个表的时候，就剩下where跟having比较了。在这单表查询统计的情况下，如果要过滤的条件没有涉及到要计算字段，那它们的结果是一样的，只是where可以使用rushmore技术，而having就不能，在速度上后者要慢。

  如果要涉及到计算的字段，就表示在没计算之前，这个字段的值是不确定的，根据上篇写的工作流程，where的作用时间是在计算之前就完成的，而having就是在计算后才起作用的，所以在这种情况下，两者的结果会不同。

  在多表联接查询时，on比where更早起作用。系统首先根据各个表之间的联接条件，把多个表合成一个临时表后，再由where进行过滤，然后再计算，计算完后再由having进行过滤。由此可见，要想过滤条件起到正确的作用，首先要明白这个条件应该在什幺时候起作用，然后再决定放在那里。

## 3. UNION查询

MySQL允许执行多个查询，即多条SELECT语句，并将结果作为单个查询结果集返回。这些**组合查询**通常称为 **并(union)** 或 **复合查询(compound query)** 。

有两种基本情况需要使用组合查询：

1. 在单个查询中从不同的表返回类似结构的数据；

2. 对单个表执行多个查询，按单个查询返回数据。

> 其实，多数情况下，组合相同表的两个查询完成的工作与具有多个WHERE子句条件的单条查询完成的工作相同，UNION通常只意味着另一种书写方式，可能这种书写会显得简洁。

- `UNION`：给出每条SELECT语句，在各条语句之间放上关键字UNION即可：

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

    1. UNION必须由两条或以上的SELECT语句组成，语句之间用UNION分隔

    2. UNION中的每个查询必须包含相同的列、表达式或聚集函数，各个列不需要以相同的次序列出

    3. 列数据类型必须兼容：类型不必完全相同，但必须是DBMS可以隐含转换的类型，如不同的数值类型或不同的日期类型

- `UNION ALL`：UNION默认从查询结果集中自动去除了重复的行；如果想返回所有匹配行，使用UNION ALL。

    ```sql
    SELECT vend_id, prod_id, prod_price
    FROM products
    WHERE prod_price <= 5
    UNION ALL
    SELECT vend_id, prod_id, prod_price
    FROM products
    WHERE vend_id IN (1001, 1002);
    ```

    <img src="https://chua-n.gitee.io/blog-images/notebooks/数据库/5.png" alt="img" style="zoom:50%;" />

- `UNION`与`ORDER BY`子句：在使用UNION组合查询时，**只能使用一条ORDER BY子句**，它必须出现在最后一条SELECT语句之后。

    > 这实际上很好理解，因为UNION查询的结果是按照类似单个查询的结果给出的，即结果是一个整体，所以它的排序只能有一个。

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

    <img src="https://chua-n.gitee.io/blog-images/notebooks/数据库/6.png" alt="6.png" style="zoom:50%;" />