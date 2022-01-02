> DML：数据的增删改

关系数据库的基本操作就是增删改查，即CRUD：Create、Retrieve、Update、Delete。

其中，对于查询，我们已经详细讲述了SELECT语句的详细用法，而对于增、删、改，对应的SQL语句分别是：

- `INSERT`：插入新记录；
- `UPDATE`：更新已有记录；
- `DELETE`：删除已有记录。

## 1. INSERT

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

## 2. UPDATE

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

## 3. DELETE

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

## 4. 复合式

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

