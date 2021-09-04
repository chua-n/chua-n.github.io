# MySQL

## MySQL权限管理实例

grant all privileges on *.* to jack@'localhost' identified by "jack" with grant option;

## FULL JOIN

> MySQL不支持FullJoin； SQLServer支持；
>
> MySQL Full Join的实现 因为MySQL不支持FULL JOIN,下面是替代方法 left join + union(可去除重复数据)+ right join 

把LEFT JOIN的结果与RIGHT JOIN的结果UNION一下，即是FULL JOIN。

## UNION 与 UNION ALL

UNION会将左右合并后去重，UNION ALL的左右合并后并不去重。

## 主键、约束

一张表中的主键一定是唯一的，但约束可以有多个。

约束：

- Default约束
- Check约束
- Unique约束

## 视图

对视图的修改会反映到真实的数据表中。

## NULL与空

NULL与字符串为空完全不同。

## 事务

![image-20210804133909326](C:\Users\xucy-e\AppData\Roaming\Typora\typora-user-images\image-20210804133909326.png)

## INT类型

INT类型本身就是4个字节，那为什么还是MYSQL还是提供了一个size参数？

答：该参数指定的是显示多少位数。

## 函数

![image-20210804144844811](C:\Users\xucy-e\AppData\Roaming\Typora\typora-user-images\image-20210804144844811.png)

count(*)和count(1)可能根据数据库版本不同而不一样。

## 存储过程



存储过程以前用的比较多，现在用的相对少，但仍应该对其进行了解。

1. 存储过程只在创造时进行编译，以后每次执行存储过程都不需再重新编译，而一般 SQL 语句每执行一次就编译一次,所以使用存储过程可提高数据库执行速度。
2. 当对数据库进行复杂操作时(如对多个表进行 Update,Insert,Query,Delete 时），可将此复杂操作用存储过程封装起来与数据库提供的事务处理结合一起使用。这些操作，如果用程序来完成，就变成了一条条的 SQL 语句，可能要多次连接数据库。而换成存储，只需要连接一次数据库就可以了。
3. 存储过程可以重复使用,可减少数据库开发人员的工作量。
4. 安全性高,可设定只有此用户才具有对指定存储过程的使用权。

## 触发器

触发器用得也相对较少。