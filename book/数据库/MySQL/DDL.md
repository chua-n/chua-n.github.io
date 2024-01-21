> DDL(Data Definition Language)——修改库表“结构”。

## 1. 库结构操作

- `SHOW`

    - `SHOW DATABASES`：列出本MySQL服务器上含有的所有数据库

    - `SHOW TABLES`：查看当前数据库的所有表

    - `SHOW COLUMNS FROM customers`：显式内部表的信息

    - `SHOW CREATE DATABASE/TABLE`：显示创建某数据库/表的MySQL语句

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

- `EXIT`：退出mysql

- `HELP`：显示某命令的帮助

    ```cmd
    mysql> HELP SHOW;
    ```

## 2. 表结构操作

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
