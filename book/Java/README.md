---
title: Java
icon: java
---

> 本笔记为Java相关知识点。

## 重新思考内容

1. 为什么“Java 中不能只分配内存空间而不赋初始值。”（/Java/踏入山门/数组.md 的第 3 节）？C++是怎样的？

    > 当一个对象被创建成功后，这个对象将被保存在堆内存中，Java程序不允许直接访问堆内存中的对象，只能通过该对象的引用操作该对象，这跟数组类似。

2. 成员变量无法显式地初始化（可能是因为成员变量是存储在堆上？？？）、局部变量都必须显式初始化（可能是因为成员变量是存储在栈上？？？）

3. 协变与逆变？泛型好晕？

4. 线程通信的Condition、BlockingQueue......

10. Java自带的日志体系（《Java核心技术 卷I》第7章）......

- 如果编译代码时使用了`-g:vars`选项，意味着：
    - your code is slightly easier to understand (reverse engineer)
    - the class file sizes are very slightly bigger (typically inconsequential)
    - the optimization to remove unused local variables is not applied by your compiler.
- `-javaagent`选项：参考这篇博文 [javaagent使用指南](https://www.cnblogs.com/rickiyang/p/11368932.html)

