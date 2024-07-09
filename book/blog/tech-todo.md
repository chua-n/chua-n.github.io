---
title: tech-todo
date: 2024-05-18
article: false
timeline: false
---

日常工作、求职面试过程中积攒的技术方面的待研究项或有趣的思考题。

<!-- more -->

## 问题

### Java

1. `String s1 = new String("abc");` 这行代码创建了几个字符串对象？

   > 会创建 1 或 2 个字符串对象。

2. 协变与逆变？泛型好晕？

3. [说一说 PriorityQueue](https://javaguide.cn/java/collection/java-collection-questions-01.html#说一说-priorityqueue)

4. 为什么程序计数器、虚拟机栈、本地方法栈是线程私有的呢？为什么堆和方法区是线程共享的呢？

5. [volatile-关键字？](https://javaguide.cn/java/concurrent/java-concurrent-questions-02.html#volatile-关键字)

6. [`sleep` 方法和 `wait` 方法对比？](https://javaguide.cn/java/concurrent/java-concurrent-questions-01.html#thread-sleep-方法和-object-wait-方法对比)

7. [`synchronized` 和 `ReentrantLock` 的区别？](https://javaguide.cn/java/concurrent/java-concurrent-questions-02.html#synchronized-和-reentrantlock-有什么区别)

8. [`ThreadLocal` 内存泄露问题是怎么导致的？](https://javaguide.cn/java/concurrent/java-concurrent-questions-03.html#threadlocal-内存泄露问题是怎么导致的)

9. 讲一下 Java 线程池？[Java 线程池详解 | JavaGuide](https://javaguide.cn/java/concurrent/java-thread-pool-summary.html)

10. `ThreadLocal`的 API，gatling、coral 中那两个应用吃透。

11. coral 平台采用的分布式 ID 方案。

### JVM

1. [Java 内存模型？](https://javaguide.cn/java/concurrent/jmm.html#jmm-java-memory-model)
2. [Java内存区域详解](https://javaguide.cn/java/jvm/memory-area.html)
3. ~~[JVM垃圾回收？](https://javaguide.cn/java/jvm/jvm-garbage-collection.html)~~
4. ~~[类文件结构详解？](https://javaguide.cn/java/jvm/class-file-structure.html)~~
5. ~~[类加载过程详解？](https://javaguide.cn/java/jvm/class-loading-process.html)~~
6. [类加载器详解？](https://javaguide.cn/java/jvm/classloader.html)

### MySQL

1. ~~数据库范式？~~
2. [drop、delete 与 truncate 区别？](https://javaguide.cn/database/basis.html#drop、delete-与-truncate-区别)
3. [并发事务带来了哪些问题?](https://javaguide.cn/database/mysql/mysql-questions-01.html#并发事务带来了哪些问题)
4. [SQL 标准定义了哪些事务隔离级别?](https://javaguide.cn/database/mysql/mysql-questions-01.html#sql-标准定义了哪些事务隔离级别)
5. Spring 事务中，有哪几种事务传播行为，有哪几种隔离级别？
6. 读写分离这块，了解 sharding-jdbc 吗？
7. [什么是分库分表？](https://javaguide.cn/high-performance/read-and-write-separation-and-library-subtable.html)
8. [MySQL索引？](https://javaguide.cn/database/mysql/mysql-index.html)

### Redis

1. [使用 Redis 实现一个排行榜怎么做？](https://javaguide.cn/database/redis/redis-questions-01.html#使用-redis-实现一个排行榜怎么做)

2. [使用 Set 实现抽奖系统需要用到什么命令？](https://javaguide.cn/database/redis/redis-questions-01.html#使用-set-实现抽奖系统怎么做)

3. Redis 6.0 以前为什么不使用多线程？

   - 单线程编程容易并且更容易维护，多线程就会存在死锁、线程上下文切换等问题，甚至会影响性能；
   - Redis 的性能瓶颈不在 CPU ，主要在内存和网络；

4. [Redis 的 6 种数据淘汰策略？](https://javaguide.cn/database/redis/redis-questions-01.html#redis-内存淘汰策略了解么)

5. [Redis 的持久化操作方式？](https://javaguide.cn/database/redis/redis-persistence.html)RDB 与 AOF

   - RDB 创建快照时会阻塞主线程吗？
   - Redis AOF 日志是如何实现的？

6. [如何使用 Redis 事务？](https://javaguide.cn/database/redis/redis-questions-02.html#如何使用-redis-事务)

   > Redis 所谓事务比较鸡肋，基本不怎么用。

7. [Redis 缓存的穿透、击穿、雪崩？](https://javaguide.cn/database/redis/redis-questions-02.html#redis-生产问题-重要)

8. 布隆过滤器是啥，如何用于 Redis 的？

### 分布式

1. 分布式定时任务技术选型有哪些？
2. CAP 定理？CP、AP架构？——[CAP理论](https://javaguide.cn/distributed-system/protocol/cap-and-base-theorem.html#cap-理论)
3. [Redis 如何解决集群情况下分布式锁的可靠性？](https://javaguide.cn/distributed-system/distributed-lock-implementations.html#redis-如何解决集群情况下分布式锁的可靠性)
4. [基于-zookeeper-实现分布式锁的原理](https://javaguide.cn/distributed-system/distributed-lock-implementations.html#基于-zookeeper-实现分布式锁)

### 高性能与高可用

1. 什么是 CDN？
2. 消息队列？
3. 什么是高可用？有哪些提高系统可用性的方法？
4. 限流算法有哪些？
5. 超时和重试机制？

## 备忘

### Java

1. 成员变量无法显式地初始化（可能是因为成员变量是存储在堆上？？？）、局部变量都必须显式初始化（可能是因为成员变量是存储在栈上？？？）
2. 基本数据类型的局部变量存放在 Java 虚拟机栈中的局部变量表中，基本数据类型的成员变量（未被 `static` 修饰 ）存放在 Java 虚拟机的堆中。包装类型属于对象类型，我们知道几乎所有对象实例都存在于堆中。
3. HashMap：JDK 1.8 之前是由数组+链表实现的，数组是主体，链表则是为了解决哈希冲突而存在的。JDK 1.8 以后在解决哈希冲突时有了较大的变化，当链表长度大于阈值（默认为 8）时，将链表转化为红黑树，以减少搜索时间。另外，将链表转换成红黑树前会判断，如果当前数组的长度小于 64，那么会选择先进行数组扩容，而不是转换为红黑树。
4. 一个进程在其执行的过程中可以产生多个线程。与进程不同的是同类的多个线程共享进程的**堆**和**方法区**资源，但每个线程有自己的**程序计数器**、**虚拟机栈**和**本地方法栈**，所以系统在产生一个线程，或是在各个线程之间做切换工作时，负担要比进程小得多，也正因为如此，线程也被称为轻量级进程。

### MySQL

1. 只有保证了事务的持久性、原子性、隔离性之后，一致性才能得到保障。也就是说 A、I、D 是手段，C 是目的！

   ![AID->C](https://oss.javaguide.cn/github/javaguide/mysql/AID-%3EC.png)

   > 原子性，隔离性和持久性是数据库的属性，而一致性（在 ACID 意义上）是应用程序的属性。应用可能依赖数据库的原子性和隔离属性来实现一致性，但这并不仅取决于数据库。因此，字母 C 不属于 ACID 。

2. MySQL InnoDB 存储引擎的默认支持的隔离级别是 **REPEATABLE-READ（可重读）**

3. 虽然 UUID 能够做到全局唯一性，但分布式 ID 中一般也很少会使用它：

   - UUID 消夏的存储空间比较大（32 个字符串，128 位），数据库主键应该越短越好；
   - UUID 是无序的，InnoDB 引擎下，数据库主键的无序性会严重影响性能。


### Redis

1. Redis 通过 IO 多路复用程序来监听来自客户端的大量连接（或者说是监听多个 socket），它会将感兴趣的事件及类型（读、写）注册到内核中并监听每个事件是否发生。
2. Redis 里，如果一个 key 对应的 value 占用的内存特别大，那这个 key 就可以看作是 bigkey。
3. 锁的实现，核心在于互斥。
4. 在 Redis 中，`SETNX` 命令可以帮助我们实现互斥。
5. 如果不是非要实现绝对可靠的分布式锁的话，单机版 Redis 就完全够了，这样实现简单，性能也非常高。如果必须实现一个绝对可靠的分布式锁的话，可以基于 Zookeeper 来做，只是性能会差一些。

