> Commons、Guava、Spring中的工具类......

## Commons概览

- Commons BeanUtils
    - 针对Bean的一个工具集。由于Bean往往是有一堆get和set组成，所以BeanUtils也是在此基础上进行一些包装。
    - 一个比较常用的功能是Bean Copy，也就是copy bean的属性。如果做分层架构开发的话就会用到，比如从PO（Persistent Object）拷贝数据到VO（Value Object）
- Commons Codec
    - 是编码和解码组件，提供常用的编码和解码方法，如DES、SHA1、MD5、Base64、URL和Soundx等。
- Commons Collections
    - 是一个集合组件，扩展了Java标准Collections API，对常用的集合操作进行了很好的封装、抽象和补充，在保证性能的同时大大简化代码。
- Commons Compress
    - 是一个压缩、解压缩文件的组件，可以操作rar、cpio、Unix dump、tar、zip、gzip、XZ、Pack200和bzip2格式的压缩文件。
- Commons Configuration
    - 是一个Java应用程序的配置管理工具，可以从properties或者xml文件中加载配置信息。
- Commons CSV
    - 是一个用来读写各种Comma Separated Value(CSV)格式文件的Java类库。
- Commons Daemon
    - 实现将普通的Java应用变成系统的后台服务,例如 Tomcat 就是利用这个项目来实现作为 Linux 和 Windows 的服务启动和停止的。
-  Commons DBCP
    - 数据库连接池。
- Commons DBUtils
    - 是JDBC工具组件，对传统操作数据库的类进行二次封装，可以把结果集转化成List。
-  Commons Digester
    - 是XML到Java对象的映射工具集。
-  Commons Email
    - 是邮件操作组件，对Java Mail API进行了封装，提供了常用的邮件发送和接收类，简化邮件操作。该组件依赖Java Mail API。
- Commons Exec
    - 提供一些常用的方法用来执行外部进程，如执行exe文件或命令行。
-  Commons FileUpload
    - 为Web应用程序或Servlet提供文件上传功能，Struts2和SpringMVC的文件上传组件。
- Commons IO
    - 是处理IO的工具类包，对java.io进行扩展，提供了更加方便的IO操作。
- Commons JCI
    - 提供通用的Java编译器接口。
- Commons Lang3
    - 是处理Java基本对象方法的工具类包，该类包提供对字符、数组等基本对象的操作，弥补了java.lang api基本处理方法上的不足。
- Commons Launcher
    - 可以跨平台独立启动的java应用程序。
- Commons Logging
    - 提供统一的日志接口，同时兼顾轻量级和不依赖于具体的实现。类包给中间件/日志工具开发者一个简单的日志操作抽象，允许程序开发人员使用不同的具体日志实现工具。
- Commons Math
    - 轻量级自容器的数学和统计计算方法类包，包含大多数常用的数值算法。
- Commons Net
    - 封装了各种网络协议的客户端，支持FTP、NNTP、SMTP、POP3、Telnet等协议。
- Commons Pool
    - 提供了一整套用于实现对象池化的框架，以及若干各具特色的对象池实现，可以有效地减少处理对象池化时的工作量。类包用于提高像文件句柄、数据库连接、socket通信这类大对象的调用效率，简单的说就是一种对象一次创建多次使用的技术。
-  Commons Primitives
    - 提供了一个更小，更快和更易使用的对Java基本类型的支持。
- Commons Validator
    - 提供了一个简单的、可扩展的框架来在一个XML文件中定义校验器(校验方法)和校验规则。支持校验规则的和错误消息的国际化。
-  Apache HttpClient
    - 曾经是Apache Commons的子项目，后来独立出来。HttpClient简化HTTP客户端与服务器的各种通讯，实现HTTP客户端程序（也就是浏览器程序）的功能。

## Guava概览

- com.google.common.annotations
    - 普通注解类型。
- com.google.common.base
    - 基本工具类库和接口，让使用Java语言更令人愉悦。
    - 使用和避免 null：null 有语言歧义， 会产生令人费解的错误， 反正他总是让人不爽。很多 Guava 的工具类在遇到 null 时会直接拒绝或出错，而不是默默地接受他们。
    - 前提条件：更容易的对你的方法进行前提条件的测试。
    - 常见的对象方法： 简化了Object常用方法的实现， 如 hashCode() 和 toString()。
    - 排序： Guava 强大的 "fluent Comparator"比较器， 提供多关键字排序。
    - Throwable类： 简化了异常检查和错误传播。
- com.google.common.cache
    - 缓存工具包，非常简单易用且功能强大的JVM内缓存。
    - 本地缓存，可以很方便的操作缓存对象，并且支持各种缓存失效行为模式。
- com.google.common.collect
    - 带泛型的集合接口扩展和实现，以及工具类，这里你会发现很多好玩的集合。集合类库是 Guava 对 JDK 集合类的扩展， 这是 Guava 项目最完善和为人所知的部分。
    - Immutable collections（不变的集合）： 防御性编程， 不可修改的集合，并且提高了效率。
    - New collection types(新集合类型)：JDK collections 没有的一些集合类型，主要有：multisets，multimaps，tables， bidirectional maps等等
    - Powerful collection utilities（强大的集合工具类）： java.util.Collections 中未包含的常用操作工具类
    - Extension utilities（扩展工具类）: 给 Collection 对象添加一个装饰器? 实现迭代器? 我们可以更容易使用这些方法。
- com.google.common.eventbus
    - 发布订阅风格的事件总线。
    - 基于发布-订阅模式的组件通信，但是不需要明确地注册在委托对象中。
- com.google.common.hash
    - 哈希工具包，提供比 Object.hashCode() 更复杂的 hash 方法, 提供 Bloom filters.
- com.google.common.io
    - I/O工具包。简化 I/O 操作, 特别是对 I/O 流和文件的操作, for Java 5 and 6.
- com.google.common.math
    - 原始算术类型和超大数的运算工具包。
- com.google.common.net
    - 网络工具包。
- com.google.common.primitives
    - 八种原始类型和无符号类型的静态工具包。
    - 扩展 JDK 中未提供的对原生类型（如int、char等）的操作，包括某些类型的无符号的变量。
- com.google.common.reflect
    - 反射工具包。
- com.google.common.util.concurrent
    - 多线程工具包。
    - 强大,简单的抽象,让我们更容易实现简单正确的并发性代码。
    -  ListenableFuture（可监听的Future）: Futures,用于异步完成的回调。
    - Service: 控制事件的启动和关闭，为你管理复杂的状态逻辑。

## Spring概览

