---
title: SQL 语法
---

## 1. 基础语法

- 大小写：SQL 语句**不区分大小写**，因此`SELECT`与`select`，甚至与`Select`是等价的。

- 关键字：作为 MySQL 语言组成部分的一个保留字，决不可用关键字命名一个表或列。

- SQL 语句：

    - **子句（clause）** ：SQL 语句由子句构成，有些子句是必需的，有的是可选的。一个子句通常由一个关键字和所提供的数据组成，如`SELECT`语句的`FROM`子句。
    - 多条 SQL 语句必须以分号`;`分隔。在 MySQL 命令行内，单条 SQL 语句也必须加上分号来结束。

- 自动增量：在每个行添加到表中时，MySQL 可以自动地为每个行分配下一个可用编号，不用在添加一行时手动分配唯一值，此即所谓的**自动增量**。

    - 如果需要它，则必须在`CREATE`语句创建表时把它作为表定义的组成部分。
    - 每个表只允许一个`AUTO_INCREMENT`列，而且它必须被索引。

- 完全限定的名字：

    - 完全限定的列名：`  SELECT products.prod_name FROM products;  `
    - 完全限定的表名：`  SELECT products.prod_name FROM crashcourse.products;  `

- 更改语句分割符：如果命令行实用程序要解释存储过程自身内的`;`字符，需如下解决，临时更改命令行实用程序的语句分隔符：

    ```sql
    DELIMITRE //
    
    CREATE PROCEDURE productpricing()
    BEGIN
    	SELECT Avg(prod_price) AS priceaverage
    	FROM products;
    END //
    
    DELIMITER ;
    ```

    > - `DELIMITER //` 告诉命令行实用程序用`//`作为新的语句结束分隔符，可以看到标志存储过程结束的`END`定义为`END //`而不是`END`;
    > - 最后，为恢复为原来的语句分隔符，可使用`DELIMITER ;`
    > - 除`\`符号外，任何字符都可以用作语句分隔符。

- 字符串：字符串用单引号`''`来限定。

- 注释：MySQL 中注释符号为`--`

- 日期格式：MySQL 使用的日期格式为：`yyyy-mm-dd`。虽然其他的日期格式可能也行，但这是首选的日期格式，因为它排除了多义性。

- 简化字符：MySQL 不支持简化字符`*=`和`=*`等的使用，虽然这两种操作符在其他 DBMS 中很流行。

- 字典排序：在字典排序顺序中，A 被视为与 a 相同，这是 MySQL 和大多数 DBMS 的默认行为。如果在排序时确实需要不按这种字典排序，用简单的`ORDER BY`子句是做不到的，必须请求数据库管理员的帮助。

- 计算字段：有时，存储在表中的数据不是应用程序直接需要的，我们需要在从数据库中查询出数据时进行计算或格式化上的转化；尽管你也可以先检索出数据然后在客户机上重新完成你需要的转换，但通常不建议这么做，因为 **DBMS 能完成的相应工作都进行过相应的优化**，这就是计算字段发挥作用的所在。

    - 计算字段并不实际存在于数据库表中，其是运行时在`SELECT`语句内创建的。

## 2. 其他关键字

- `NULL`：`NULL`表示无值，但注意`NULL`非零、非空串、非空格串。

    ```sql
    SELECT prod_name
    FROM products
    WHERE prod_price IS NULL;
    ```

- `NOT/AND/OR`：逻辑操作符。

    - 优先级`NOT` >`AND` > `OR`

    - MySQL 支持`NOT`对`IN`, `BETWEEN`, `EXISTS`子句取反

        ```sql
        SELECT prod_name, prod_price
        FROM products
        WHERE vend_id = 1002 OR vend_id = 1003 AND prod_price >= 10;
        
        -- 以下与上等价
        SELECT prod_name, prod_price
        FROM products
        WHERE (vend_id = 1002 OR vend_id = 1003) AND prod_price >= 10;
        ```

        ```sql
        SELECT prod_name, prod_price
        FROM products
        WHERE vend_id NOT IN (1002, 1003)
        ORDER BY prod_name;
        ```

- `ASC/DESC`：升序/降序排序，默认为升序。

    > 此关键字只应用到直接位于其前面的列。也就是说，若想将多个列降序，必须挨个指定`DESC`。

    ```sql
    SELECT prod_id, prod_price, prod_name
    FROM products
    ORDER BY prod_price DESC, prod_name;
    ```

- `AS`：SQL 允许给列和表赋予别名，有了别名后任何客户端应用都可以按别名引用这个列，就像它是一个实际的表列一样。

    ```sql
    SELECT Concat(RTrim(vend_name), ' (', RTrim(vend_country), ')') AS vend_title
    FROM vendors
    ORDER BY vend_name;
    ```

- `ALL/DISTINCT`：指示 MySQL 返回全部的值/对重复的值只返回唯一的代表值。

    - 默认总是`ALL`；

    - `DISTINCT`关键字应用于所有列而不仅是前置它的列。

        ```sql
        SELECT DISTINCT vend_id, prod_price
        FROM products
        -- 也就是说这里的 prod_price 其实也相当于有前置的 DISTINC
        ```

- `WITH ROLLUP`：可以得到每个分组以及每个分组汇总级别（针对每个分组）的值。

  ```sql
    SELECT vend_id, COUNT(*) AS num_prods
    FROM products
    GROUP BY vend_id WITH ROLLUP;
  ```
  
- 通配符`%`与`_`：

    - `%`表示任意字符（不含`NULL`）出现任意次数（含 0 次）

        ```sql
        SELECT prod_name
        FROM products
        WHERE prod_name LIKE 's%e';
        ```

    - `_`表示只匹配单个字符

        ```sql
        SELECT prod_id, prod_name
        FROM products
        WHERE prod_name LIKE '_ ton anvil';
        ```

- `REGEXP`：表示使用正则表达式匹配（MySQL 支持正则表达式实现的一个很小的子集）

    ```sql
    SELECT prod_name
    FROM pdoducts
    WHERE prod_name REGEXP '1000'
    ORDER BY prod_name;
    ```

- `\\`：转义操作符

    | 字符  |     说明      |
    | :---: | :-----------: |
    | `\\.` |    匹配`.`    |
    | `\\\` | 匹配反斜杠`\` |
    | `\\f` |     换页      |
    | `\\n` |     换行      |
    | `\\r` |     换车      |
    | `\\t` |     制表      |
    | `\\v` |   纵向制表    |

- 字符类：

    |      类      |                       说明                        |
    | :----------: | :-----------------------------------------------: |
    | `[:alnum:]`  |          任意字母和数字（同`[a-zA-Z0-9]`          |
    | `[:alpha:]`  |             任意字符（同`[a-zA-Z]`）              |
    | `[:blank:]`  |              空格和制表（同`[\\t]`）              |
    | `[:cntrl:]`  |         ASCII 控制字符（ASCII 0 到 31 和 127）         |
    | `[:digit:]`  |               任意数字（同`[0-9]`）               |
    | `[:graph:]`  |          与`[:print:]`相同，但不包括空格          |
    | `[:lower:]`  |             任意小写字母（同`[a-z]`）             |
    | `[:print:]`  |                  任意可打印字符                   |
    | `[:punct:]`  |  既不在`[:alnum:]`又不在`[:cntrl:]`中的任意字符   |
    | `[:space:]`  | 包括空格在内的任意空白字符（同`[\\f\\n\\r\\t\\v]` |
    | `[:upper:]`  |             任意大写字母（同`[A-Z]`）             |
    | `[:xdigit:]` |        任意十六进制数字（同`[a-fA-F0-9]`）        |

- MySQL 的算术操作符：

    | 操作符 | 说明 |
    | :----: | :--: |
    |  `+`   |  加  |
    |  `-`   |  减  |
    |  `*`   |  乘  |
    |  `/`   |  除  |

- `SELECT`不仅可以用来从表中检索数据，也可以**计算表达式**（这对应不写`FROM`子句的情形），如：

    - `SELECT 2*3`：返回 6
    - `SELECT Trim('abc')`：返回`'abc'`
    - `SELECT Now()`：返回当前日期和时间
