---
title: MyBatis注解开发
date: 2021-04-15
---

这几年来注解开发越来越流行，mybatis也可以使用注解开发方式，可以减少Mapper文件的编写工作。

| MyBatis常用注解 | 作用                              |
| --------------- | --------------------------------- |
| @Insert         |                                   |
| @Update         |                                   |
| @Delete         |                                   |
| @Select         |                                   |
| @Result         | 实现结果集封装                    |
| @Results        | 与@Result一起使用，封装多个结果集 |
| @One            | 实现一对一结果集封装              |
| @Many           | 实现一对多结果集封装              |

一些注解详解：

- @One
    - 代替了`<assocation>`标签，是多表查询的关键，在注解中用来指定子查询返回单一对象。
    - @One注解含有这些属性：
        - select：指定用来多表查询的sqlmapper
    - 使用格式：`@Result(column="", property="", one=@One(select=""))`
- @Many
    - 代替了`<collection>`标签，是多表查询的关键，在注解中用来指定子查询返回对象的集合。
    - 使用格式：`@Result(property="", column="", many=@Many(selct=""))`
- @Results
    - 代替的是标签`<resultMap>`
    - 本注解中可以使用单个@Result注解，也可以使用@Result集合。
    - 使用格式：`@Result({@Result(), @Result()})`或`@Results(@Result())`
- @Result
    - 代替了`id`标签和`result`标签
    - @Result中属性
        - column：数据库的列名
        - property：需要装配的属性名
        - one：需要使用的@One注解（`@Result(one=@One())`）
        - many：需要使用的@Many注解（`@Result(many=@many())`）

> 之前，实现复杂关系映射我们要在映射文件中通过配置`<resultMap>`来实现。使用注解开发后，我们可以使用@Results注解、@Result注解、@One注解、@Many注解的组合来完成复杂关系的配置。

> 详见视频  https://www.bilibili.com/video/BV1WZ4y1H7du?p=187&share_source=copy_web 。

> 不过MyBatis的注解开发会不会导致强耦合？？？