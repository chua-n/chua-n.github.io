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

## 后端问题定位和分析

> 容器篇使用基础。

LBS

SLB: Server(Serivce) Load Balancing

从单体到微服务的时候，自然而然地引入了DDD。

K8S把DOCKER容器的编排处理得很好。

docker system df

### arthas定位问题

arthas 可实现热编译，可只针对一个jar包中的一个类进行更换。

thread 命令：针对高并发情况很有用。

- thread -b
