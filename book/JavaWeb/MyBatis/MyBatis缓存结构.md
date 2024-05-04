---
title: MyBatis 缓存结构
date: 2020-11-05
---

MyBatis 提供一级缓存和二级缓存的机制。

![47](https://figure-bed.chua-n.com/JavaWeb/MyBatis/47.png)

## 1. 一级缓存

![48](https://figure-bed.chua-n.com/JavaWeb/MyBatis/48.png)

**一级缓存**是 SqlSession 级别的缓存。在操作数据库时，每个 SqlSession 类的实例对象中有一个数据结构（HashMap）可以用于存储缓存数据，不同的 SqlSession 类的实例对象缓存的数据区域（HashMap）是互不影响的。

- 当每一次查询某一个数据时，SqlSession 类的实例对象会将该数据存入一级缓存区域，在没有收到改变该数据的请求之前，用户再次查询该数据，都会从缓存中获取该数据，而不是再次连接数据库进行查询。
- 在下一次查询时，如果 sqlSession 执行了 commit 操作（即执行了修改、添加和删除），则会清除它的一级缓存区域，以此来保证缓存中的信息是最新的，避免脏读现象发生。
- MyBatis 默认支持一级缓存，不需要在配置文件中配置一级缓存的相关数据。

## 2. 二级缓存

![49](https://figure-bed.chua-n.com/JavaWeb/MyBatis/49.png)

**二级缓存**是 Mapper 级别的缓存。多个 SqlSession 类的实例对象操作同一个 Mapper 配置文件中的 SQL 语句，多个 SqlSession 类的实例对象可以共用二级缓存，二级缓存是跨 SqlSession 的。

- 二级缓存存在于 Mapper 实例中，当多个 SqlSession 类的实例对象加载相同的 Mapper 文件，并执行其中的 SQL 配置时，它们就共享一个 Mapper 缓存。
- 当某个 SqlSession 类的实例对象执行了增、删、改等改变数据的操作时，Mapper 实例都会清空其二级缓存。
- 与一级缓存相比，二级缓存的范围更大。

开启二级缓存：

1. 在 SqlMapConfig.xml 中配置 setting 属性，设置名为"cacheEnabled"的属性值为"true"：

    ```xml
    <setting name="cacheEnabled" value="true"/>
    ```

2. 由于二级缓存是 Mapper 级别的，须在需要开启二级缓存的具体 mapper.xml 文件中开启二级缓存，具体地，只要在相应的 mapper.xml 中添加一个 cache 标签即可：

    ```xml
    <!-- 开启本 Mapper 的 namespace 下的二级缓存 -->
    <cache/>
    ```

综上，二级缓存有如下特点：

- 缓存以 namespace 为单位，不同 namespace 下的操作互不影响；
- 增、删、改操作会清空 namespace 下的全部缓存；
- 通常使用 MyBatis Generator（逆向工程）生成的代码中，各个表都是独立的，每个表都有自己的 namespace。
