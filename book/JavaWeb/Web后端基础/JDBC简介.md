---
title: JDBC 简介
---

SQL 语言是一个**非过程化**的语言，所以它很简单。所谓**过程化**语言指的是 C 语言、Java 语言这些，需要一步一步写清楚怎么做的步骤，而非过程化语言则只要求你做什么，而不要求怎么做。

JDBC 本身是一种规范，其是一组由 Java 语言编写的类和接口，包含在 java.sql 和 javax.sql 两个包中。

> 其中 java.sql 是核心包，位于 J2SE 中；javax.sql 则扩展了 JDBC API 的功能，位于 J2EE 中。

JDBC API 可分为两个层次：

1. 面向底层的 JDBC Driver API：由数据库厂商开发数据库底层驱动程序时使用。
2. 面向用户的 JDBC API：由程序员使用。

JDBC API 主要的类

| JDBC 相关类    | 说明                                                         |
| ------------- | ------------------------------------------------------------ |
| DriverManager | 处理驱动的调入并且对产生新的数据库连接提供支持               |
| DataSource    | 在 JDBC 2.0 API 中被推荐使用代替 DriverManager 实现和数据库的连接 |
| Connection    | 代表对特定数据库的连接                                       |
| Statement     | 代表一个特定的容器，容纳并执行一条 SQL 语句                    |
| ResultSet     | 控制执行查询语句得到的结果集                                 |

一个基本的 JDBC 程序开发步骤：

1. 设置环境，引入相应的 JDBC 类；
2. 选择合适的 JDBC 驱动程序并加载；
3. 分配一个 Connection 对象；
4. 分配一个 Statement 对象，用该 Statement 对象进行查询等操作；
5. 从返回的 ResultSet 对象中获取相应的数据；
6. 关闭 Connection。

## ODBC?

如果说你使用的数据库没有提供 JDBC 的驱动，从 Java 程序调用本地的 C 程序访问数据库会带来一系列安全性、完整性、健壮性等方面的问题，因而通过 JDBC-ODBC 桥来访问没有提供 JDBC 接口的数据库是一个常用的方案。

ODBC 是由微软提出的用于在数据库管理系统中存取数据的接口，由 C 语言实现的一套 API，使用 ODBC 的难度要大于 JDBC。