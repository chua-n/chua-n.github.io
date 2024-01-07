SQL语言是一个非过程化的语言，所以它很简单。所谓过程化语言指的是C语言、Java语言这些，需要一步一步写清楚怎么做的步骤，而非过程化语言则只要求你做什么，而不要求怎么做。

JDBC本身是一种规范，其是一组由Java语言编写的类和接口，包含在java.sql和javax.sql两个包中。

> 其中java.sql是核心包，位于J2SE中，javax.sql则扩展了JDBC API的功能，位于J2EE中。

JDBC API可分为两个层次：

1. 面向底层的JDBC Driver API：由数据库厂商开发数据库底层驱动程序时使用。
2. 面向用户的JDBC API：由程序员使用。

JDBC API主要的类

| JDBC相关类    | 说明                                                         |
| ------------- | ------------------------------------------------------------ |
| DriverManager | 处理驱动的调入并且对产生新的数据库连接提供支持               |
| DataSource    | 在JDBC 2.0 API中被推荐使用代替DriverManager实现和数据库的连接 |
| Connection    | 代表对特定数据库的连接                                       |
| Statement     | 代表一个特定的容器，容纳并执行一条SQL语句                    |
| ResultSet     | 控制执行查询语句得到的结果集                                 |

一个基本的JDBC程序开发步骤：

1. 设置环境，引入相应的JDBC类；
2. 选择合适的JDBC驱动程序并加载；
3. 分配一个Connection对象；
4. 分配一个Statement对象，用该Statement对象进行查询等操作；
5. 从返回的ResultSet对象中获取相应的数据；
6. 关闭Connection。

## ODBC?

如果说你使用的数据库没有提供JDBC的驱动，从Java程序调用本地的C程序访问数据库会带来一系列安全性、完整性、健壮性等方面的问题，因而通过JDBC-ODBC桥来访问没有提供JDBC接口的数据库是一个常用的方案。

ODBC是由微软提出的用于在数据库管理系统中存取数据的接口，由C语言实现的一套API，使用ODBC的难度要大于JDBC。