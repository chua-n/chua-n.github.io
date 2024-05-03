---
title: Spring-JdbcTemplate
date: 2021-02-08
---

## JdbcTemplate 的基本使用

JdbcTemplate 是 spring 框架中提供的一个对象，是对原始繁琐的 Jdbc API 对象的简单封装。Spring 框架为我们提供了很多的操作模板类，例如：操作关系型数据的 JdbcTemplate 和 HibernateTemplate，操作 nosql 数据库的 RedisTemplate，操作消息队列的 JmsTemplate 等等。

JdbcTemplate 开发步骤：

- 导入 spring-jdbc 和 spring-tx 坐标；
- 创建数据库表和实体；
- 创建 JdbcTemplate 对象；
- 执行数据库操作。

现在的企业用的不多，暂略，参见 https://b23.tv/GAAFVz 视频的 P54。
