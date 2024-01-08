## JdbcTemplate的基本使用

JdbcTemplate是spring框架中提供的一个对象，是对原始繁琐的Jdbc API对象的简单封装。Spring框架为我们提供了很多的操作模板类，例如：操作关系型数据的JdbcTemplate和HibernateTemplate，操作nosql数据库的RedisTemplate，操作消息队列的JmsTemplate等等。

JdbcTemplate开发步骤：

- 导入spring-jdbc和spring-tx坐标；
- 创建数据库表和实体；
- 创建JdbcTemplate对象；
- 执行数据库操作。

现在的企业用的不多，暂略，参见 https://b23.tv/GAAFVz 视频的P54。

