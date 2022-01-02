> DDL——修改库表“结构”。

## 1. 库结构操作

### 1.1 SHOW

- `SHOW DATABASES;`：列出本MySQL服务器上含有的所有数据库
- `SHOW TABLES;`：查看当前数据库的所有表
- `SHOW COLUMNS FROM customers;`：显式内部表的信息
- `SHOW CREATE DATABASE/TABLE;`：显示创建某数据库/表的MySQL语句
- `SHOW GRANTS;`：显示授予用户的安全权限
- `SHOW STATUS;`：显示广泛的服务器状态信息
- `SHOW ERRORS;`：显示服务器错误消息
- `SHOW WARNINGS;`：显示服务器警告消息

### 1.2 DESCRIBE

```sql
DESCRIBE customers;
```

作为 SHOW COLUMNS FROM 的一种快捷方式

### 1.3 CREATE

```sql
-- 创建一个新的数据库
CREATE DATABASE;
-- 创建一个新的表
CREATE TABLE;
```

```CMD
mysql> CREATE DATABASE test;
Query OK, 1 row affected (0.01 sec)
```

### 1.4 DROP

`DROP DATABASE/TABLE`删除一个数据库/表（删除一个数据库将导致该数据库的所有表全部被删除）

```cmd
mysql> DROP DATABASE test;
Query OK, 0 rows affected (0.01 sec)
```

### 1.5 USE

把某数据库切换为当前数据库，以便对其操作

```cmd
mysql> USE test;
Database changed
```

### 1.6 EXIT

退出mysql

### 1.7 HELP

显示某命令的帮助。

```cmd
mysql> HELP SHOW;
```

## 2. 表结构操作

### 2.1 ADD COLUMN

给students表新增一列birth：

```sql
ALTER TABLE students ADD COLUMN birth VARCHAR(10) NOT NULL;
```

### 2.2 CHANGE COLUMN.

修改birth列，把列名改为birthday，类型改为VARCHAR(20)：

```sql
ALTER TABLE students CHANGE COLUMN birth birthday VARCHAR(20) NOT NULL;
```

### 2.3 DROP COLUMN

删除列birthday：

```sql
ALTER TABLE students DROP COLUMN birthday;
```

### 2.4 AUTO_INCREMENT

将表的AUTO_INCREMENT值修改为number：

```sql
ALTER TABLE students AUTO_INCREMENT number;
```



