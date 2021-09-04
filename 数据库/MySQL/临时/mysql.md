# MySQL

## MySQL权限管理

权限管理的两个验证阶段：

- 连接检查：服务器首先会检查你是否允许连接。因为创建用户的时候会加上主机限制，可以限制成本地、某个IP、某个IP段、以及任何地方等，只允许你从配置的指定地方登陆。
- 权限检查：如果你能连接，Mysql会检查你发出的每个请求，看你是否有足够的权限实施它。比如你要更新某个表、或者查询某个表，Mysql会查看你对哪个表或者某个列是否有权限。再比如，你要运行某个存储过程，Mysql会检查你对存储过程是否有执行权限等。

### MySQL权限管理经验

- 只授予能满足需要的最小权限（Insert，Select…）
- 创建用户的时候限制用户的登录主机，一般是限制成指定IP或者内网IP段。
- 初始化数据库的时候删除没有密码的用户。
- 为每个用户设置满足密码复杂度的密码。
- 定期清理不需要的用户。回收权限或者删除用户。

### MySQL权限管理实例

- grant all privileges on *.* to jack@'localhost' identified by "jack" with grant option;
- flush privileges; 
- show grants;  
- show grants for 'jack'@'%‘; 
- revoke delete on *.* from 'jack'@'localhost'; 
- drop user 'jack'@'localhost';
- rename user 'jack'@'%' to 'jim'@'%';
- SET PASSWORD FOR 'root'@'localhost' = PASSWORD(’root'); 

### 如何保证密码信息的安全

- SELECT password('mypass'); 
- CREATE user 'tom'@'localhost' identified BY password'*6C8989366EAF75BB670AD8EA7A7FC1176A95CEF4';
- SELECT * FROM \`mysql\`.\`user\` WHERE \`User\` ='tom';

### 忘记密码怎么办？

#### 方法1：用SET PASSWORD命令

首先登录MySQL：
格式：mysql> set password for 用户名@localhost = password('新密码'); 
例子：mysql> set password for root@localhost = password('123'); 

 #### 方法2：用mysqladmin
格式：mysqladmin -u用户名 -p旧密码 password 新密码 
例子：mysqladmin -uroot -p123456 password 123 

#### 方法3：用UPDATE直接编辑user表

首先登录MySQL：

```cmd
mysql> use mysql; 
mysql> update user set password=password('123') where user='root' and host='localhost'; 
mysql> flush privileges; 
```

 #### 方法4：在忘记root密码的时候，可以这样

 以windows为例：

1. 关闭正在运行的MySQL服务。 
2. 打开DOS窗口，转到mysql\bin目录。 
3. 输入`mysqld --skip-grant-tables` 回车。`--skip-grant-tables` 的意思是启动MySQL服务的时候跳过权限表认证。 
4. 再开一个DOS窗口（因为刚才那个DOS窗口已经不能动了），转到mysql\bin目录。 
5. 输入mysql回车，如果成功，将出现MySQL提示符 >。 
6. 连接权限数据库：`use mysql;` 。 
7. 改密码：`update user set password=password("123") where user="root";`
8. 刷新权限（必须步骤）：`flush privileges;`　。 
9. 退出`quit;`。 
10. 注销系统，再进入，使用用户名root和刚才设置的新密码123登录。 

## MySQL基本语法

SQL 分为两个部分：

- 数据操作语言 (DML)
  - *SELECT* - 从数据库表中获取数据
  - *UPDATE* - 更新数据库表中的数据
  - *DELETE* - 从数据库表中删除数据
  - *INSERT INTO* - 向数据库表中插入数据
- 数据定义语言 (DDL)
  - *CREATE DATABASE* - 创建新数据库
  - *ALTER DATABASE* - 修改数据库
  - *CREATE TABLE* - 创建新表
  - *ALTER TABLE* - 变更（改变）数据库表
  - *DROP TABLE* - 删除表
  - *CREATE INDEX* - 创建索引（搜索键）
  - *DROP INDEX* - 删除索引

## MySQL高级语法

- TOP 子句&Limit子句（分页）
- Like操作符
- SQL通配符（%， _,  [charlist], [^charlist], [!charlist]）
- SELECT column_name(s) FROM table_name WHERE column_name IN (value1,value2,...)
- SELECT column_name(s) FROM table_name WHERE column_name BETWEEN value1 AND value2
- 表的 SQL Alias 语法
- SQL INNER JOIN ,Join关键字
- LeftJoin;
- RigthJoin;
- FullJoin;
- CrossJoin；（笛卡尔积）
- SQL UNION ， Union All操作符
- SELECT INTO （MySQL不支持）
- CREATE DATABASE 语句
- CREATE TABLE 语句
- Unique，PrimaryKey，ForeignKey，Default，Check；
- CreateIndex
- DropIndex
- AlterTable
- CreateView
- NULL判断；（NULL用Is Null , is not null）
- IFNULL()
- 嵌套查询
- In exists

[浅析MySQL中exists与in的使用 （写的非常好） - struggle_beiJing - 博客园 (cnblogs.com)](https://www.cnblogs.com/beijingstruggle/p/5885137.html)

## MySQL事务

在 MySQL 中只有使用了 Innodb 数据库引擎的数据库或表才支持事务。

事务处理可以用来维护数据库的完整性，保证成批的 SQL 语句要么全部执行，要么全部不执行。

事务用来管理 insert,update,delete 语句

事务是必须满足4个条件（ACID）：原子性（**A**tomicity，或称不可分割性）、一致性（**C**onsistency）、隔离性（**I**solation，又称独立性）、持久性（**D**urability）。

### 关键字

BEGIN或START TRANSACTION；显式地开启一个事务；

COMMIT；也可以使用COMMIT WORK，不过二者是等价的。COMMIT会提交事务，并使已对数据库进行的所有修改称为永久性的；

ROLLBACK；有可以使用ROLLBACK WORK，不过二者是等价的。回滚会结束用户的事务，并撤销正在进行的所有未提交的修改；

SAVEPOINT identifier；SAVEPOINT允许在事务中创建一个保存点，一个事务中可以有多个SAVEPOINT；

RELEASE SAVEPOINT identifier；删除一个事务的保存点，当没有指定的保存点时，执行该语句会抛出一个异常；

ROLLBACK TO identifier；把事务回滚到标记点；

### MySQL事务处理的两种方式

#### 1、用 BEGIN, ROLLBACK, COMMIT来实现

- BEGIN开始一个事务
- ROLLBACK事务回滚
- COMMIT事务确认

#### 2、直接用 SET 来改变 MySQL 的自动提交模式:

- `SET AUTOCOMMIT=0`禁止自动提交
- `SET AUTOCOMMIT=1`开启自动提交

mysql如果开了`set autocommit=0`，那意味着所有的语句都在一个事务里，此时如果你使用连接池，并且在查询之前没有rollback或者`set autocommit=1`，那么你就杯具了。因为根据mysql的默认事务级别——一致性读，你永远也取不到这个事务被开启前的数据。

此外，`set autocommit= 0`，会自动提交前一个事务，因此正确的作法是`rollback; set autocommit=0;`，完成之后再`set autocommit=1`;

```sql
begin;

insert into t_transaction values(1, 'abc');

insert into t_transaction values(2, 'xyz');

commit;
```

### MySQL事务——隔离性级别

隔离性遇到的三大问题：

- 脏读
- 不可重复读
- 幻读

MySQL隔离性几个级别：

- Serializable (串行化)：可避免脏读、不可重复读、幻读的发生。
- Repeatable read (可重复读)：可避免脏读、不可重复读的发生。
- Read committed (读已提交)：可避免脏读的发生。
- Read uncommitted (读未提交)：最低级别，任何情况都无法保证。

## MySQL临时表

MySQL 临时表在我们需要保存一些临时数据时是非常有用的。临时表只在当前连接可见，当关闭连接时，Mysql会自动删除表并释放所有空间。

临时表在MySQL 3.23版本中添加，如果你的MySQL版本低于 3.23版本就无法使用MySQL的临时表。不过现在一般很少有再使用这么低版本的MySQL数据库服务了。

```sql
CREATE TEMPORARY TABLE SalesSummary (product_name VARCHAR(50) NOT NULL,
    total_sales DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    avg_unit_price DECIMAL(7,2) NOT NULL DEFAULT 0.00,
    total_units_sold INT UNSIGNED NOT NULL DEFAULT 0
);


INSERT INTO SalesSummary
    (product_name, total_sales, avg_unit_price, total_units_sold)
    VALUES
    ('cucumber', 100.25, 90, 2);

SELECT * FROM SalesSummary;
# 在当前连接下可以删除临时表
DROP TABLE SalesSummary;

```

## MySQL复制表

如果我们需要完全的复制MySQL的数据表，包括表的结构，索引，默认值等。 如果仅仅使用`CREATE TABLE ... SELECT`命令，是无法实现的。

使用`SHOW CREATE TABLE`命令获取创建数据表(`CREATE TABLE`) 语句，该语句包含了原数据表的结构，索引等。

复制以下命令显示的SQL语句，修改数据表名，并执行SQL语句，通过以上命令 将完全的复制数据表结构。

如果你想复制表的内容，你就可以使用`INSERT INTO ... SELECT`语句来实现。

```sql
CREATE TABLE t_person_test1 LIKE t_persons;
INSERT INTO t_person_test1 SELECT * FROM t_persons;
```

### 其他扩展方法

```sql
# 可以拷贝一个表中其中的一些字段:
CREATE TABLE newadmin AS (     SELECT username, password FROM admin )
# 可以将新建的表的字段改名:
CREATE TABLE newadmin AS (     SELECT id, username AS uname, password AS pass FROM admin )
# 可以拷贝一部分数据:
CREATE TABLE newadmin AS (     SELECT * FROM admin WHERE LEFT(username,1) = 's' )
# 可以在创建表的同时定义表中的字段信息:
CREATE TABLE newadmin (     id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY ) AS (     SELECT * FROM admin ) 
```

## MySQL元数据（了解即可）

查询结果信息：SELECT, UPDATE 或 DELETE语句影响的记录数。

数据库和数据表的信息： 包含了数据库及数据表的结构信息。

MySQL服务器信息： 包含了数据库服务器的当前状态，版本号等。

在MySQL的命令提示符中，我们可以很容易的获取以上服务器信息。

```sql
SELECT VERSION( );
SELECT DATABASE( );
SELECT USER( );
SHOW STATUS;
SHOW VARIABLES;
```

## MySQL数据类型

![image-20210804163835747](C:\Users\xucy-e\AppData\Roaming\Typora\typora-user-images\image-20210804163835747.png)

![image-20210804163840680](C:\Users\xucy-e\AppData\Roaming\Typora\typora-user-images\image-20210804163840680.png)

![image-20210804163845665](C:\Users\xucy-e\AppData\Roaming\Typora\typora-user-images\image-20210804163845665.png)

> 思考题：` Create table t(x int(3) zerofill)`，这个`Int(3)`是做什么用的？

## SQL中的常见函数

- Avg
- Count
- Max
- Min
- Sum
- Mid
- Length
- Round
- Now
- DATE_FORMAT
- Ucase, Lcase
- Group By, Having

> 问题：Where和Having的区别？
>
> HAVING用于GroupBy之后的数据筛选；
>
> Having执行优先级低于Where。

> 问题：count(*),count(1), cout(列名)区别？
>
> Count(*)需要做回表操作；
>
> Count（1）不需要做回表操作；
>
> Count(列名)只返回不为空的数量。
>
> > 回表：根据指定行取指定的数据。

## MySQL优化



- 查询频繁的列需要建立索引；
- 少用类似select * from t where xx is null（放弃索引全局扫描）
- 尽量避免在 where 子句中使用 != 或 <> 操作符（放弃索引全局扫描）
- 尽量避免在 where 子句中使用 or 来连接条件（任何一个条件列没有索引，将放弃索引全局扫描）
- 尽量避免使用in 和 not in ，否则会导致全表扫描
- 连续的数值，能用 between 就不要用 in 
- 尽量用Exits代替In，（Exits会使用索引，In不会使用索引）
- like ‘%abc%’不使用索引
- 尽量避免在 where 子句中对字段进行表达式操作
- select id from t where num/**2** = **100->** select id from t where num = **100*****2**
- 避免在where子句中对字段进行函数操作，这将导致引擎放弃使用索引而进行全表扫描
- select id from t where datediff(day,createdate,’**2005**-**11**-**30**′) = **0**
- select id from t where name like 'abc%' select id from t where createdate >= '2005-11-30' and createdate < '2005-12-1‘
- 对于多张大数据量（这里几百条就算大了）的表JOIN，要先分页再JOIN，否则逻辑读会很高，性能很差。
- 尽量用Count（1）代替Count(*)
- 索引列最好不要超过6个；
- 尽量使用数字类型代替字符类型（数字类型只比较一次，字符类型逐个字符对比）
- 尽可能的使用 varchar/nvarchar 代替 char/nchar ，因为首先变长字段存储空间小，可以节省存储空间，其次对于查询来说，在一个相对较小的字段内搜索效率显然要高些。
- 任何地方都不要使用 select * from t ，用具体的字段列表代替“*”，不要返回用不到的任何字段
- 尽量避免使用游标，因为游标的效率较差，如果游标操作的数据超过1万行，那么就应该考虑改写。
- 尽量避免大事务操作，提高系统并发能力。
- 尽量避免向客户端返回大数据量，若数据量过大，应该考虑相应需求是否合理。

## MySQL备份

- 数据库备份

  ```sql
  mysqldump -u root -h localhost -p testbackup > c:\mysql.sql
  ```

- 备份单个数据表

  ```sql
  mysqldump -u root -h localhost -p testbackup t_user > c:\mysql.sql
  ```

- 备份多个数据库

  ```sql
  mysqldump -u root -h localhost -p --database testbackup db > c:\mysql.sql
  ```

- 备份所有数据库

  ```sql
  mysqldump -u root -h localhost -p --all-databases> c:\mysql.sql
  ```

## MySQL还原

方法一：

```cmd
mysql -u root -h localhost -p testbackup< C:\mysql.sql
```

> 注意：备份前应先创建数据库名

方法二：

也可以登录到数据库中，使用Source命令 

```cmd
source C:\mysql.sql
```

## MySQL日志管理（有点乱，再说吧）

### BinLog配置

```cmd
log-bin="C:\Mysql\log"
expire_logs_days=10
max_binlog_size=100M
# 重启MySQL服务。
```

通过变量查询可以查看配置的日志是否开启：

```sql
show VARIABLES LIKE '%log_%';
```

查看二进制文件命令：

```sql
SHOW BINARY LOGS;
```

查看二进制操作记录，Insert，Update语句

```sql
show binlog events;
```



