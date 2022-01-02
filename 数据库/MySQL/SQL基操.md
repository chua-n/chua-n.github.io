## 1. SQL语法概念

### 基础语法

- 大小写：SQL语句**不区分大小写**，因此SELECT与select，甚至与Select是等价的。

    > 一些SQL的开发习惯：
    >
    > 1. 对所有SQL关键字使用大写；
    >
    > 2. 对所有列和表名使用小写。

- 空格：在处理SQL语句时，其中所有的空格都被忽略，SQL语句可以在一行上给出，也可以分成许多行。多数SQL开发人员认为将SQL语句分成多行更容易阅读和调试。

- 关键字：作为MySQL语言组成部分的一个保留字，决不可用关键字命名一个表或列。

- 语句：

    - 子句(clause)——SQL语句由子句构成，有些子句是必需的，有的是可选的。一个子句通常由一个关键字和所提供的数据组成，如SELECT语句的FROM子句。
    - 多条SQL语句必须以 **分号(;)** 分隔；在MySQL命令行内，单条SQL语句也必须加上分号来结束。

- 自动增量：在每个行添加到表中时，MySQL可以自动地为每个行分配下一个可用编号，不用在添加一行时手动分配唯一值，此即所谓的自动增量。

    - 如果需要它，则必须在CREATE语句创建表时把它作为表定义的组成部分。
    - 每个表只允许一个AUTO_INCREMENT列，而且它必须被索引（如，通过使它成为主键）

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

    > 其中，`DELIMITER //` 告诉命令行实用程序用`//`作为新的语句结束分隔符，可以看到标志存储过程结束的`END`定义为`END //`而不是`END`;
    > 最后，为恢复为原来的语句分隔符，可使用`DELIMITER ;`
    > 除`\`符号外，任何字符都可以用作语句分隔符。

- 字符串：字符串用单引号`''`来限定。

- 注释：MySQL中注释符号为`--`

- 日期格式：MySQL使用的日期格式为：`yyyy-mm-dd`。虽然其他的日期格式可能也行，但这是首选的日期格式，因为它排除了多义性。

- 简化字符：MySQL不支持简化字符`*=`和`=*`等的使用，虽然这两种操作符在其他DBMS中很流行。

- 数据的格式化：这是一个表示问题，而不是一个检索问题，表示一般在显示该数据的应用程序中规定。

- 字典排序：在**字典排序**顺序中，A被视为与a相同，这是MySQL和大多数DBMS的默认行为。如果在排序时确实需要不按这种字典排序，用简单的ORDER BY子句是做不到的，必须请求数据库管理员的帮助。

- 计算字段：有时，存储在表中的数据不是应用程序直接需要的，我们需要在从数据库中查询出数据时进行计算或格式化上的转化；尽管你也可以先检索出数据然后在客户机上重新完成你需要的转换，但通常不建议这么做，因为DBMS能完成的相应工作都进行过相应的优化，这就是计算字段发挥作用的所在。

    - 计算字段并不实际存在于数据库表中，其是运行时在SELECT语句内创建的。
    - 字段基本上与列的意思相同，也经常互换使用，不过还是应该认为它是计算过程中发挥着类似列的作用的虚拟产物。

### 数据类型

对于一个关系表，除了定义每一列的名称外，还需要定义每一列的数据类型。关系数据库支持的标准数据类型包括数值、字符串、时间等：

|      名称      |      类型      | 说明                                                         |
| :------------: | :------------: | ------------------------------------------------------------ |
|     `INT`      |      整型      | 4字节整数类型，范围约+/-21亿                                 |
|    `BIGINT`    |     长整型     | 8字节整数类型，范围约+/-922亿亿                              |
|     `REAL`     |     浮点型     | 4字节浮点数，范围约+/-1038                                   |
|    `DOUBLE`    |     浮点型     | 8字节浮点数，范围约+/-10308                                  |
| `DECIMAL(M,N)` |   高精度小数   | 由用户指定精度的小数，例如，DECIMAL(20,10)表示一共20位，其中小数10位，通常用于财务计算 |
|   `CHAR(N)`    |   定长字符串   | 存储指定长度的字符串，例如，CHAR(100)总是存储100个字符的字符串 |
|  `VARCHAR(N)`  |   变长字符串   | 存储可变长度的字符串，例如，VARCHAR(100)可以存储0~100个字符的字符串 |
|   `BOOLEAN`    |    布尔类型    | 存储True或者False                                            |
|     `DATE`     |    日期类型    | 存储日期，例如，2018-06-22                                   |
|     `TIME`     |    时间类型    | 存储时间，例如，12:20:59                                     |
|   `DATETIME`   | 日期和时间类型 | 存储日期+时间，例如，2018-06-22 12:20:59                     |

上面的表中列举了最常用的数据类型。很多数据类型还有别名，例如，`REAL`又可以写成`FLOAT(24)`。还有一些不常用的数据类型，例如，`TINYINT`（范围在0~255）。各数据库厂商还会支持特定的数据类型，例如JSON。

选择数据类型的时候，要根据业务规则选择合适的类型。通常来说，`BIGINT`能满足整数存储的需求，`VARCHAR(N)`能满足字符串存储的需求，这两种类型是使用最广泛的。

### 其他关键字

- `NULL`：NULL表示无值，但注意NULL非零、非空串、非空格串。

    ```sql
    SELECT prod_name
    FROM products
    WHERE prod_price IS NULL;
    ```

- `NOT/AND/OR`：逻辑操作符。

    - 优先级NOT >AND > OR

    - MySQL支持NOT对IN, BETWEEN, EXISTS子句取反

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

- `DESC/ASC`：降序/升序排序，默认为升序。

    > 其只应用到直接位于其前面的列；若想将多个列降序，必须挨个指定DESC。

    ```sql
    SELECT prod_id, prod_price, prod_name
    FROM products
    ORDER BY prod_price DESC, prod_name;
    ```

- `AS`：SQL允许给列和表赋予别名，有了别名后任何客户端应用都可以按别名引用这个列，就像它是一个实际的表列一样。

    ```sql
    SELECT Concat(RTrim(vend_name), ' (', RTrim(vend_country), ')') AS vend_title
    FROM vendors
    ORDER BY vend_name;
    ```

- `ALL/DISTINCT`：指示MySQL返回全部的值/对重复的值只返回唯一的代表值。

    - 默认总是ALL

    - DISTINCT关键字应用于所有列而不仅是前置它的列。

        ```sql
        SELECT DISTINCT vend_id, prod_price
        FROM products
        -- 也就是说这里的prod_price其实也相当于有前置的DISTINC
        ```

- `WITH ROLLUP`：可以得到每个分组以及每个分组汇总级别（针对每个分组）的值。

    

    ```sql
    SELECT vend_id, COUNT(*) AS num_prods
    FROM products
    GROUP BY vend_id WITH ROLLUP;
    ```

- 通配符`%`与`_`：

    - `%`表示任意字符（不含NULL）出现任意次数（含0次）

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

- `REGEXP`：指示使用正则表达式匹配（MySQL支持正则表达式实现的一个很小的子集）。

    ```sql
    SELECT prod_name
    FROM pdoducts
    WHERE prod_name REGEXP '1000'
    ORDER BY prod_name;
    ```

- `\\`：转义操作符。

    | 字符  | 说明        |
    | ----- | ----------- |
    | `\\.` | 匹配.       |
    | `\\\` | 匹配反斜杠\ |
    | `\\f` | 换页        |
    | `\\n` | 换行        |
    | `\\r` | 换车        |
    | `\\t` | 制表        |
    | `\\v` | 纵向制表    |

- 字符类：

    |     类     |                       说明                        |
    | :--------: | :-----------------------------------------------: |
    | [:alnum:]  |           任意字母和数字（同[a-zA-Z0-9]           |
    | [:alpha:]  |              任意字符（同[a-zA-Z]）               |
    | [:blank:]  |              空格和制表（同`[\\t]`）              |
    | [:cntrl:]  |         ASCII控制字符（ASCII 0到31和127）         |
    | [:digit:]  |                任意数字（同[0-9]）                |
    | [:graph:]  |           与[:print:]相同，但不包括空格           |
    | [:lower:]  |              任意小写字母（同[a-z]）              |
    | [:print:]  |                  任意可打印字符                   |
    | [:punct:]  |    既不在[:alnum:]又不在[:cntrl:]中的任意字符     |
    | [:space:]  | 包括空格在内的任意空白字符（同`[\\f\\n\\r\\t\\v]` |
    | [:upper:]  |              任意大写字母（同[A-Z]）              |
    | [:xdigit:] |         任意十六进制数字（同[a-fA-F0-9]）         |

- MySQL的算术操作符：

    | 操作符 | 说明 |
    | :----: | :--: |
    |   +    |  加  |
    |   -    |  减  |
    |   *    |  乘  |
    |   /    |  除  |

    > 虽然SELECT通常用来从表中检索数据，但可以省略FROM子句以便**简单地访问和处理表达式**。如
    >
    > - `SELECT 2*3;`：返回6
    > - `SELECT Trim('abc');`：返回'abc'
    > - `SELECT Now();`：返回当前日期和时间

## 2. 主键-外键-索引

### 2.1 主键

对于关系表，有个很重要的约束，就是任意两条记录不能重复。不能重复不是指两条记录不完全相同，而是指能够通过某个字段唯一区分出不同的记录，这个字段被称为**主键(primary key)** 。

对主键的要求，最关键的一点是：记录一旦插入到表中，主键最好不要再修改，因为主键是用来唯一定位记录的，修改了主键，会造成一系列的影响。

1. 如果我们以学生的身份证号作为主键，似乎能唯一定位记录，然而，身份证号也是一种业务场景，如果身份证号升位了，或者需要变更，作为主键，不得不修改的时候，就会对业务产生严重影响。
2. 所以，选取主键的一个基本原则是：不使用任何业务相关的字段作为主键。因此，身份证号、手机号、邮箱地址这些看上去可以唯一的字段，均不可用作主键。
3. 作为主键最好是完全业务无关的字段，我们一般把这个字段命名为**id**。常见的可作为**id**字段的类型有：
    1. 自增整数类型：数据库会在插入数据时自动为每一条记录分配一个自增整数，这样我们就完全不用担心主键重复，也不用自己预先生成主键；
    2. 全局唯一GUID类型：使用一种全局唯一的字符串作为主键，类似8f55d96b-8acc-4636-8cb8-76bf8abc2f57。GUID算法通过网卡MAC地址、时间戳和随机数保证任意计算机在任意时间生成的字符串都是不同的，大部分编程语言都内置了GUID算法，可以自己预算出主键。

主键值也不能为null.

**联合主键**——关系数据库实际上还允许通过多个字段唯一标识记录，即两个或更多的字段都设置为主键，这种主键被称为联合主键。

对于联合主键，允许一列有重复，只要不是所有主键列都重复即可：

| **id_num** | **id_type** | **other columns...** |
| ---------- | ----------- | -------------------- |
| 1          | A           | ...                  |
| 2          | A           | ...                  |
| 2          | B           | ...                  |

> 1. 如果我们把上述表的id_num和id_type这两列作为联合主键，那么上面的3条记录都是允许的，因为没有两列主键组合起来是相同的。
> 2. 没有必要的情况下，我们尽量不使用联合主键，因为它给关系表带来了复杂度的上升。

### 2.2 外键

**外键**是某个表中的一列，它包含另一个表的主键值，定义了两个表的关系。

如，当我们用主键唯一标识记录时，我们就可以在students表中确定任意一个学生的记录：

| **id** | **name** | **other columns...** |
| ------ | -------- | -------------------- |
| 1      | 小明     | ...                  |
| 2      | 小红     | ...                  |

我们还可以在classes表中确定任意一个班级记录：

| **id** | **name** | **other columns...** |
| ------ | -------- | -------------------- |
| 1      | 一班     | ...                  |
| 2      | 二班     | ...                  |

但是我们如何确定students表的一条记录，例如，id=1的小明，属于哪个班级呢？由于一个班级可以有多个学生，在关系模型中，这两个表的关系可以称为“一对多”，即一个classes的记录可以对应多个students表的记录。为了表达这种一对多的关系，我们需要在students表中加入一列class_id，让它的值与classes表的某条记录相对应，这样，我们就可以根据class_id这个列直接定位出一个students表的记录应该对应到classes的哪条记录。

| **id** | **class_id** | **name** | **other columns...** |
| ------ | ------------ | -------- | -------------------- |
| 1      | 1            | 小明     | ...                  |
| 2      | 1            | 小红     | ...                  |
| 5      | 2            | 小白     | ...                  |

在students表中，通过class_id的字段，可以把数据与另一张表关联起来，这种列称为外键。

外键并不是通过列名实现的，而是通过定义外键约束实现的：

```sql
ALTER TABLE students
ADD CONSTRAINT fk_class_id
FOREIGN KEY (class_id)
REFERENCES classes (id);
```

> 其中，外键约束的名称fk_class_id可以任意，FOREIGN KEY (class_id)指定了class_id作为外键，REFERENCES classes (id)指定了这个外键将关联到classes表的id列（即classes表的主键）
>
> 通过定义外键约束，关系数据库可以保证无法插入无效的数据。即如果classes表不存在id=99的记录，students表就无法插入class_id=99的记录

由于外键约束会降低数据库的性能，大部分互联网应用程序为了追求速度，并不设置外键约束，而是仅靠应用程序自身来保证逻辑的正确性。这种情况下，class_id仅仅是一个普通的列，只是它起到了外键的作用而已。

要删除一个外键约束，也是通过ALTER TABLE实现的：

```sql
ALTER TABLE students
DROP FOREIGN KEY fk_class_id;
```

> 注意：删除外键约束并没有删除外键这一列。删除列是通过DROP  COLUMN ...实现的 。

### 2.3 索引

在关系数据库中，如果有上万甚至上亿条记录，在查找记录的时候，想要获得非常快的速度，就需要使用索引。

索引是关系数据库中对某一列或多个列的值进行预排序的数据结构。通过使用索引，可以让数据库系统不必扫描整个表，而是直接定位到符合条件的记录，这样就大大加快了查询速度。

例如，对于students表：

| **id** | **class_id** | **name** | **gender** | **score** |
| ------ | ------------ | -------- | ---------- | --------- |
| 1      | 1            | 小明     | M          | 90        |
| 2      | 1            | 小红     | F          | 95        |
| 3      | 1            | 小军     | M          | 88        |

如果要经常根据score列进行查询，就可以对score列创建索引：

```sql
ALTER TABLE students
ADD INDEX idx_score (score);
```

使用`ADD INDEX idx_score (score)`就创建了一个名称为idx_score、使用列score的索引。索引名称是任意的，索引如果有多列，可以在括号里依次写上，例如：

```sql
ALTER TABLE students
ADD INDEX idx_name_score (name, score);
```

索引的效率取决于索引列的值是否散列，即该列的值如果越互不相同，那么索引效率越高。反过来，如果记录的列存在大量相同的值，例如gender列，大约一半的记录值是M，另一半是F，因此，对该列创建索引就没有意义。

可以对一张表创建多个索引。索引的优点是提高了查询效率，缺点是在插入、更新和删除记录时，需要同时修改索引，因此，索引越多，插入、更新和删除记录的速度就越慢。

对于主键，关系数据库会自动对其创建主键索引。使用主键索引的效率是最高的，因为主键会保证绝对唯一。

在设计关系数据表的时候，看上去唯一的列，例如身份证号、邮箱地址等，因为他们具有业务含义，因此不宜作为主键。但是，这些列根据业务要求，又具有唯一性约束：即不能出现两条记录存储了同一个身份证号。这个时候，就可以给该列添加一个唯一索引。例如，我们假设students表的name不能重复：

```sql
ALTER TABLE students
ADD UNIQUE INDEX uni_name (name);
```

> 通过UNIQUE关键字我们就添加了一个唯一索引。
>
> 也可以只对某一列添加一个唯一约束而不创建唯一索引：
>
> ```sql
> ALTER TABLE students
> ADD CONSTRAINT uni_name UNIQUE (name);
> ```
>
> 这种情况下，name列没有索引，但仍然具有唯一性保证。

无论是否创建索引，对于用户和应用程序来说，使用关系数据库不会有任何区别。这里的意思是说，当我们在数据库中查询时，如果有相应的索引可用，数据库系统就会自动使用索引来提高查询效率，如果没有索引，查询也能正常执行，只是速度会变慢。因此，索引可以在使用数据库的过程中逐步优化。

## 3. CRUD

### 3.1 查询数据

#### 3.1.1 查询的概念

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

#### 3.1.2 SELECT基本用法

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

#### 3.1.3 LIMIT子句

| 语法                                | 说明                            |
| ----------------------------------- | ------------------------------- |
| `  LIMIT offset row_count  `        | 从offset开始返回row_count行数据 |
| `  LIMIT row_count OFFSET offset  ` | 同上，另一种写法                |

其中：

- OFFSET是可选的，如果只写`LIMIT row_count`，那么相当于`LIMIT M OFFSET 0`
- 使用`LIMIT <M> OFFSET <N>`分页时，随着N越来越大，查询效率也会越来越低

这种查询也叫分页查询，至于为什么这么叫，可以看廖雪峰的网站或百度一下。

#### 3.1.4 JOIN子句

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

#### 3.1.5 连接查询详解

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

##### INNER JOIN

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

##### RIGHT OUTER JOIN

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

##### LEFT OUTER JOIN

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

##### FULL JOIN

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

##### 图解连接查询

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

#### 3.1.6 笛卡尔查询示例

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

#### 3.1.7 注意事项

为执行一个查询，通常也不一定只有一种实现方法，很少有绝对正确或绝对错误的方法，性能可能会受操作类型、表中数据量、是否存在索引或键等一些条件的影响，因此，有必要对不同的选择机制进行实验，以找出最适合具体情况的办法。

### 3.2 过滤数据

查询数据时可以增加过滤条件语句以过滤数据。

#### 相关关键字

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

#### ON、WHERE

数据库在通过连接两张或多张表来返回记录时，都会生成一张中间的临时表，然后再将这张临时表返回给用户。在使用join时，on和where条件的区别如下：

1. “on条件”是在**生成**临时表时（强调这个生成过程）所采用的条件；

2. “where条件”是在临时表生成好后，对这张临时表进行**过滤**的条件。

#### ON、WHERE、HAVING的区别

on、where、having这三个都可以加条件的子句中，on是最先执行，where次之，having最后。有时候如果这先后顺序不影响中间结果的话，那最终结果是相同的。但因为on是先把不符合条件的记录过滤后才进行统计，它就可以减少中间运算要处理的数据，按理说应该速度是最快的。

  根据上面的分析，可以知道where也应该比having快点的，因为它过滤数据后才进行sum，所以having是最慢的。但也不是说having没用，因为有时在步骤3还没出来都不知道那个记录才符合要求时，就要用having了。

  在两个表联接时才用on的，所以在一个表的时候，就剩下where跟having比较了。在这单表查询统计的情况下，如果要过滤的条件没有涉及到要计算字段，那它们的结果是一样的，只是where可以使用rushmore技术，而having就不能，在速度上后者要慢。

  如果要涉及到计算的字段，就表示在没计算之前，这个字段的值是不确定的，根据上篇写的工作流程，where的作用时间是在计算之前就完成的，而having就是在计算后才起作用的，所以在这种情况下，两者的结果会不同。

  在多表联接查询时，on比where更早起作用。系统首先根据各个表之间的联接条件，把多个表合成一个临时表后，再由where进行过滤，然后再计算，计算完后再由having进行过滤。由此可见，要想过滤条件起到正确的作用，首先要明白这个条件应该在什幺时候起作用，然后再决定放在那里。

### 3.3 UNION查询

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

### 3.4 数据的增删改

关系数据库的基本操作就是增删改查，即CRUD：Create、Retrieve、Update、Delete。

其中，对于查询，我们已经详细讲述了SELECT语句的详细用法，而对于增、删、改，对应的SQL语句分别是：

- `INSERT`：插入新记录；
- `UPDATE`：更新已有记录；
- `DELETE`：删除已有记录。

#### 3.4.1 INSERT

语法：

```sql
INSERT INTO <表名> (字段1, 字段2, ...) VALUES (值1, 值2, ...);
```

示例：

```sql
-- 添加一条新记录
INSERT INTO students (class_id, name, gender, score) VALUES (2, '大牛', 'M', 80);

-- 查询并观察结果:
SELECT * FROM students;
```

还可以一次性添加多条记录，只需要在`VALUES`子句中指定多个记录值，每个记录是由(...)包含的一组值：

```sql
-- 一次性添加多条新记录
INSERT INTO students (class_id, name, gender, score) VALUES
  (1, '大宝', 'M', 87),
  (2, '二宝', 'M', 81);

SELECT * FROM students;
```

#### 3.4.2 UPDATE

语法：

```sql
UPDATE <表名> SET 字段1=值1, 字段2=值2, ... WHERE ...;
```

示例：

```sql
-- 更新id=1的记录
UPDATE students SET name='大牛', score=66 WHERE id=1;

-- 查询并观察结果:
SELECT * FROM students WHERE id=1;
```

在`UPDATE`语句中，更新字段时可以使用表达式。例如，把所有80分以下的同学的成绩加10分：

```sql
-- 更新id=999的记录
UPDATE students SET score=100 WHERE id=999;

-- 查询并观察结果:
SELECT * FROM students;
```

`UPDATE`语句可以没有`WHERE`条件，这时整个表的所有记录都会被更新。例如：

```sql
UPDATE students SET score=60;
```

因此，在执行UPDATE语句时要非常小心！

#### 3.4.3 DELETE

语法：

```sql
DELETE FROM <表名> WHERE ...;
```

示例：

```sql
-- 删除id=1的记录 
DELETE FROM students WHERE id=1;

-- 查询并观察结果:
SELECT * FROM students;
```

和`UPDATE`类似，不带`WHERE`条件的`DELETE`语句会删除整个表的数据：

```sql
DELETE FROM students;
```

这时，整个表的所有记录都会被删除。所以，在执行`DELETE`语句时也要非常小心!

#### 3.4.4 复合式

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

