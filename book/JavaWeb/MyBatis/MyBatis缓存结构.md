---
title: MyBatis缓存结构
date: 2020-11-05
---

MyBatis提供一级缓存和二级缓存的机制。

![47](https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/MyBatis/47.png)

## 1. 一级缓存

![48](https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/MyBatis/48.png)

**一级缓存**是SqlSession级别的缓存。在操作数据库时，每个SqlSession类的实例对象中有一个数据结构（HashMap）可以用于存储缓存数据，不同的SqlSession类的实例对象缓存的数据区域（HashMap）是互不影响的。

- 当每一次查询某一个数据时，SqlSession类的实例对象会将该数据存入一级缓存区域，在没有收到改变该数据的请求之前，用户再次查询该数据，都会从缓存中获取该数据，而不是再次连接数据库进行查询。
- 在下一次查询时，如果sqlSession执行了commit操作（即执行了修改、添加和删除），则会清除它的一级缓存区域，以此来保证缓存中的信息是最新的，避免脏读现象发生。
- MyBatis默认支持一级缓存，不需要在配置文件中配置一级缓存的相关数据。

## 2. 二级缓存

![49](https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/MyBatis/49.png)

**二级缓存**是Mapper级别的缓存。多个SqlSession类的实例对象操作同一个Mapper配置文件中的SQL语句，多个SqlSession类的实例对象可以共用二级缓存，二级缓存是跨SqlSession的。

- 二级缓存存在于Mapper实例中，当多个SqlSession类的实例对象加载相同的Mapper文件，并执行其中的SQL配置时，它们就共享一个Mapper缓存。
- 当某个SqlSession类的实例对象执行了增、删、改等改变数据的操作时，Mapper实例都会清空其二级缓存。
- 与一级缓存相比，二级缓存的范围更大。

开启二级缓存：

1. 在SqlMapConfig.xml中配置setting属性，设置名为"cacheEnabled"的属性值为"true"：

    ```xml
    <setting name="cacheEnabled" value="true"/>
    ```

2. 由于二级缓存是Mapper级别的，须在需要开启二级缓存的具体mapper.xml文件中开启二级缓存，具体地，只要在相应的mapper.xml中添加一个cache标签即可：

    ```xml
    <!-- 开启本Mapper的namespace下的二级缓存 -->
    <cache/>
    ```

综上，二级缓存有如下特点：

- 缓存以namespace为单位，不同namespace下的操作互不影响；
- 增、删、改操作会清空namespace下的全部缓存；
- 通常使用MyBatis Generator（逆向工程）生成的代码中，各个表都是独立的，每个表都有自己的namespace。

