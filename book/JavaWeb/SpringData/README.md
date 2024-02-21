---
title: SpringData
---

> 本章为关于SpringData的相关内容。

## SpringData简介

SpringData是一个用来简化DAO层开发的构架，它在保证了各个底层存储特性的同时，提供了一套统一的数据访问API。SpringData可以很好地支持常用的关系型数据库和非关系型数据库。

使用SpringData作为DAO层开发，将大大地简化代码量，而且且API比各个技术的原生API更加简单易用。

SpringData支持的持久层技术非常多，以下为几个常用模块：

| 模块                      | 作用                                              |
| ------------------------- | ------------------------------------------------- |
| Spring Data Common        | Spring Data的核心模块，定义了SpringData的核心功能 |
| Spring Data JDBC          | 对JDBC的Spring Data存储库支持                     |
| Spring Data JPA           | 对JPA的Spring Data存储库支持                      |
| Spring Data MongoDB       | 对MongoDB的基于Spring对象文档的存储存支持         |
| Spring Data Redis         | 封装Jedis技术，对Redis实现访问操作                |
| Spring Data Elasticsearch | 对ElasticSearch实现访问操作                       |

