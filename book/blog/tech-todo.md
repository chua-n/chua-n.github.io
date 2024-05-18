---
title: tech-todo
date: 2024-05-18
article: false
timeline: false
---

日常工作、求职面试过程中积攒的技术方面的待研究项或有趣的思考题。

<!-- more -->

## 问题

1. `String s1 = new String("abc");` 这行代码创建了几个字符串对象？
2. API 与 SPI 的区别？SPI 的优缺点？
3. 何为拉链法？
4. 说一说 `PriorityQueue`？
5. `HashMap` 的长度为什么是 2 的幂？
6. 为什么程序计数器、虚拟机栈、本地方法栈是线程私有的呢？为什么堆和方法区是线程共享的呢？
7. `sleep` 方法和 `wait` 方法对比？
8. `synchronized` 和 `ReentrantLock` 的区别？
9. `ThreadLocal` 内存泄露问题是怎么导致的？
10. 讲一下 Java 线程池？
11. JVM：
    - Java 内存模型？
    - Java 垃圾回收？
    - 类文件结构详解？
    - 类加载过程详解？
    - 类加载器详解？
12. 数据库范式？
13. drop、delete 与 truncate 区别？
14. 并发事务带来了哪些问题？
15. SQL 标准定义了哪些事务隔离级别？
16. 使用 Redis 实现一个排行榜怎么做？
17. 使用 Redis 的 Set 实现抽奖系统需要用到什么命令？
18. Redis 6.0 以前为什么不使用多线程？
19. Redis 的 6 种数据淘汰策略？
20. Redis 的持久化操作方式？RDB 与 AOF
    - RDB 创建快照时会阻塞主线程吗？
    - Redis AOF 日志是如何实现的？
21. 如何使用 Redis 事务？
22. 布隆过滤器是啥，如何用于 Redis 的？
23. Spring 事务中，有哪几种事务传播行为，有哪几种隔离级别？
24. 分布式定时任务技术选型有哪些？
25. CAP 定理？CP、AP架构？
26. Redis 如何解决集群情况下分布式锁的可靠性？
27. 读写分离这块，了解 sharding-jdbc 吗？
28. 什么是分库分表？
29. 什么是 CDN？
30. 消息队列？
31. 什么是高可用？有哪些提高系统可用性的方法？
32. 限流算法有哪些？
33. 超时和重试机制？

## 备忘

1. 基本数据类型的局部变量存放在 Java 虚拟机栈中的局部变量表中，基本数据类型的成员变量（未被 `static` 修饰 ）存放在 Java 虚拟机的堆中。包装类型属于对象类型，我们知道几乎所有对象实例都存在于堆中。

2. HashMap：JDK 1.8 之前是由数组+链表实现的，数组是主体，链表则是为了解决哈希冲突而存在的。JDK 1.8 以后在解决哈希冲突时有了较大的变化，当链表长度大于阈值（默认为 8）时，将链表转化为红黑树，以减少搜索时间。另外，将链表转换成红黑树前会判断，如果当前数组的长度小于 64，那么会选择先进行数组扩容，而不是转换为红黑树。

3. 一个进程在其执行的过程中可以产生多个线程。与进程不同的是同类的多个线程共享进程的**堆**和**方法区**资源，但每个线程有自己的**程序计数器**、**虚拟机栈**和**本地方法栈**，所以系统在产生一个线程，或是在各个线程之间做切换工作时，负担要比进程小得多，也正因为如此，线程也被称为轻量级进程。

4. [volatile-关键字](https://javaguide.cn/java/concurrent/java-concurrent-questions-02.html#volatile-关键字)

5. 所谓公平锁，就是指先等待的线程先获得锁。

6. 只有保证了事务的持久性、原子性、隔离性之后，一致性才能得到保障。也就是说 A、I、D 是手段，C 是目的！

   ![AID->C](https://oss.javaguide.cn/github/javaguide/mysql/AID-%3EC.png)

   > 原子性，隔离性和持久性是数据库的属性，而一致性（在 ACID 意义上）是应用程序的属性。应用可能依赖数据库的原子性和隔离属性来实现一致性，但这并不仅取决于数据库。因此，字母 C 不属于 ACID 。

7. MySQL InnoDB 存储引擎的默认支持的隔离级别是 **REPEATABLE-READ（可重读）**

8. Redis 通过 IO 多路复用程序来监听来自客户端的大量连接（或者说是监听多个 socket），它会将感兴趣的事件及类型（读、写）注册到内核中并监听每个事件是否发生。

9. Redis 里，如果一个 key 对应的 value 占用的内存特别大，那这个 key 就可以看作是 bigkey。

10. 虽然 UUID 能够做到全局唯一性，但分布式 ID 中一般也很少会使用它：

    - UUID 消夏的存储空间比较大（32 个字符串，128 位），数据库主键应该越短越好；
    - UUID 是无序的，InnoDB 引擎下，数据库主键的无序性会严重影响性能。

11. 锁的实现，核心在于互斥。

12. 在 Redis 中，`SETNX` 命令可以帮助我们实现互斥。

13. 如果不是非要实现绝对可靠的分布式锁的话，单机版 Redis 就完全够了，这样实现简单，性能也非常高。如果必须实现一个绝对可靠的分布式锁的话，可以基于 Zookeeper 来做，只是性能会差一些。

14. 高可用集群、同城灾备、异地灾备、同城多活、异地多活，这些是冗余思想在高可用系统设计中最典型的应用。

## 原 /Java/README.md

### 重新思考内容

1. 为什么“Java 中不能只分配内存空间而不赋初始值。”（/Java/踏入山门/数组.md 的第 3 节）？C++是怎样的？

   > 当一个对象被创建成功后，这个对象将被保存在堆内存中，Java程序不允许直接访问堆内存中的对象，只能通过该对象的引用操作该对象，这跟数组类似。

2. 成员变量无法显式地初始化（可能是因为成员变量是存储在堆上？？？）、局部变量都必须显式初始化（可能是因为成员变量是存储在栈上？？？）

3. 协变与逆变？泛型好晕？

4. 线程通信的Condition、BlockingQueue......

5. Java自带的日志体系（《Java核心技术 卷I》第7章）......

6. Java 命令行参数：

   - 如果编译代码时使用了`-g:vars`选项，意味着：
     - your code is slightly easier to understand (reverse engineer)
     - the class file sizes are very slightly bigger (typically inconsequential)
     - the optimization to remove unused local variables is not applied by your compiler.
   - `-javaagent`选项：参考这篇博文 [javaagent使用指南](https://www.cnblogs.com/rickiyang/p/11368932.html)


### 重新思考内容-2024.04

1. `volatile` 关键字
2. 什么是多态？
3. `PriorityQueue` 与堆的关系？
4. `TreeSet` 与 `LinkedHashSet` ?
5. `Thread` 和 `Executor` 的关系？
6. `ThreadLocal`的 API，gatling、coral 中那两个应用吃透。
7. [Java 线程池详解 | JavaGuide](https://javaguide.cn/java/concurrent/java-thread-pool-summary.html)
8. coral 平台采用的分布式 ID 方案。

