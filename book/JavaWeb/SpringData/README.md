---
title: SpringData
---

> 本章为关于 SpringData 的相关内容。

## SpringData 简介

SpringData 是一个用来简化 DAO 层开发的构架，它在保证了各个底层存储特性的同时，提供了一套统一的数据访问 API。SpringData 可以很好地支持常用的关系型数据库和非关系型数据库。

使用 SpringData 作为 DAO 层开发，将大大地简化代码量，而且 API 比各个技术的原生 API 更加简单易用。

SpringData 支持的持久层技术非常多，以下为几个常用模块：

| 模块                      | 作用                                              |
| ------------------------- | ------------------------------------------------- |
| Spring Data Common        | Spring Data 的核心模块，定义了 SpringData 的核心功能 |
| Spring Data JDBC          | 对 JDBC 的 Spring Data 存储库支持                     |
| Spring Data JPA           | 对 JPA 的 Spring Data 存储库支持                      |
| Spring Data MongoDB       | 对 MongoDB 的基于 Spring 对象文档的存储存支持         |
| Spring Data Redis         | 封装 Jedis 技术，对 Redis 实现访问操作                |
| Spring Data Elasticsearch | 对 ElasticSearch 实现访问操作                       |
