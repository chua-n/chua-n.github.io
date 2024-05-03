---
title: Tomcat
date: 2020-10-21
---

## 1. Tomcat 快速实战

### 1.1 Tomcat 安装与启动

https://tomcat.apache.org/ 下载安装包，解压后即可完成安装。建议安装路径不要有中文和空格。

下载安装好 Tomcat 后，启动 Tomcat 的方式为：找到 Tomcat 目录下的 `bin/startup.bat`，双击运行即可。启动可能遇到的问题：

1. 黑窗口一闪而过：没有正确配置 `JAVA_HOME` 环境变量，应该像这样配置：

    | 环境变量  |               内容                |
    | :-------: | :-------------------------------: |
    | JAVA_HOME | C:\Program  Files\Java\jdk-11.0.9 |
    |   PATH    |          %JAVA_HOME%\bin          |

2. 启动报错：

    - 暴力：找到占用的端口号，并且找到对应的进程，杀死该进程

        ```cmd
        netstat -ano
        ```

    - 温柔：修改自身的端口号

        - conf/server.xml

            ```xml
            <Connector port="8888" protocol="HTTP/1.1"
                       connectionTimeout="20000"
                       redirectPort="8445" />
            ```

        - 一般会将 Tomcat 的默认端口号改为 80，因为 80 是 HTTP 协议的默认端口号，这样的好处是在访问时地址拦可以不再专门输入端口号。

修复 Tomcat 命令行中文乱码：

- 方式一：修改 CMD 命令行的编码格式为 UTF-8。

- 方式二：将 Tomcat 控制台日志输出编码格式更改为 GBK。具体而言，修改 Tomcat 根目录下 conf/logging.properties 文件中的 ConsoleHandler.encoding 配置项为 GBK：

    ```properties
    # java.util.logging.ConsoleHandler.encoding = UTF-8
    java.util.logging.ConsoleHandler.encoding = GBK
    ```

### 1.2 Tomcat 的目录结构

| 文件夹  | 说明                                   |
| :-----: | -------------------------------------- |
|   bin   | 可执行文件                             |
|  conf   | 配置文件                               |
|   lib   | 依赖 jar 包（Tomcat 是纯 Java 编写的） |
|  logs   | 日志文件                               |
|  temp   | 临时文件                               |
| webapps | 存放 Web 项目                          |
|  work   | 存放运行时的数据                       |

### 1.3 项目部署与访问

Tomcat 部署项目的 3 种方式：

1. 直接将项目放到 webapps 目录下即可

    - 文件夹形式：如一个 /hello 的 web 项目，此时项目的访问路径即是虚拟目录 。
    - war 包形式：将项目打成一个 war 包，再将 war 包放置到 webapps 目录下，war 包会自动解压缩。

2. 配置 conf/server.xml 文件：

    ```xml
    <!-- 
    在<Host>标签体中配置如下，其中，docBase：项目存放的路径
    path：虚拟目录
    -->
    
    <Context docBase="D:\hello" path="/hehe" />
    ```

3. 在 conf\Catalina\localhost 创建任意名称的 xml 文件，在文件中编写：

    ```xml
    <!-- 此时虚拟目录即是编写的 xml 文件的名称  -->
    <Context docBase="D:\hello" />
    ```

访问 Tomcat 项目：浏览器访问 http://localhost:8080 （访问自己），或 http://别人的ip地址:8080 （访问别人）。

### 1.4 静态项目与动态项目

Java 动态项目的目录结构比静态项目多一个 WEB-INF 目录：

```shell
-- 项目的根目录

	-- WEB-INF 目录

		-- web.xml：web 项目的核心配置文件

		-- classes 目录：放置字节码文件的目录

		-- lib 目录：放置依赖的 jar 包
```

### 1.5 Tomcat 集成到 IDEA

Tomcat 可集成到 IDEA 中，在 IDEA 中创建 JavaEE 的项目并部署项目（参见 https://www.bilibili.com/video/BV1uJ411k7wy?p=683 ）。

IDEA 与 Tomcat 的相关配置（参见 https://www.bilibili.com/video/BV1uJ411k7wy?p=690 ）：

- IDEA 会为每一个 Tomcat 部署的项目单独建立一份配置文件；

    - 可通过查看控制台的输出信息查看这些配置文件的存储路径；
    - 如我这里的路径：`Using CATALINA_BASE: "C:\Users\admin\AppData\Local\JetBrains\IntelliJIdea2020.3\tomcat\265aa75b-dfa6-4cab-ba62-5cfc609a7207"`

- 在 IDEA 中，一个 Tomcat 项目有两个相关的存储地方：“工作空间项目”和“Tomcat 部署的 web 项目”，其区别为：

    |                         工作空间项目                         |                     Tomcat部署的web项目                      |
    | :----------------------------------------------------------: | :----------------------------------------------------------: |
    | ![img](https://figure-bed.chua-n.com/JavaWeb/后端/工作空间项目.png) | ![img](https://figure-bed.chua-n.com/JavaWeb/后端/Tomcat部署的Web项目.png) |

    - Tomcat 真正访问的是“Tomcat 部署的 web 项目”，其对应着“工作空间项目”的 webapp 目录下的所有资源；
    - WEB-INF 目录下的资源不能被浏览器直接访问。

- Tomcat 的调试：需要使用“小虫子”图标启动高度：debug 启动。

## 2. Tomcat 的结构

### 2.1 总体结构

Tomcat 的结构很复杂，但 Tomcat 也非常模块化，找到了 Tomcat 最核心的模块，便抓住了 Tomcat 的七寸。

<img src="https://figure-bed.chua-n.com/JavaWeb/后端/38.png" style="zoom:67%;" />

- 心脏组件：Connector 和 Container。
- Connector 组件可以被替换，这给服务器设计者提供更多的选择。
- 一个 Container 可以选择对应多个 Connector，多个 Connector 和一个 Container 就形成了一个 Service，有了 Service 就可以对外提供服务了。
- 但 Service 还要有一个生存的环境——赋其生命、掌其生死，这时就非 Server 莫属了，因而整个 Tomcat 的生命周期是由 Server 控制的。

### 2.2 Service

从 Service 接口中定义的方法可以看出，它主要是为了关联 Connector 和 Container，同时会初始化它下面的其他组件：

<img src="https://figure-bed.chua-n.com/JavaWeb/后端/39.png" style="zoom:80%;" />

- 尽管在接口中并没有规定一定要控制它下面的组件的生命周期，实际上 Tomcat 所有组件的生命周期在一个 Lifecycle 的接口中控制，这里用到了一个重要的设计模式。
- Service 接口的标准实现类是 StandarService，它不仅实现了 Service 接口，同时还实现了 LifeCycle 接口，这样它就可以控制下面组件的生命周期了。

### 2.3 Server

Server 要完成的任务很简单，就是提供一个接口让其他程序能够访问到这个 Service 集合，同时要维护它所包含的所有 Service 的生命周期，包括如何初始化、如何结束服务、如何找到别人要访问的 Service 等等。

<img src="https://figure-bed.chua-n.com/JavaWeb/后端/40.png" style="zoom:80%;" />

> `Server` 的标准实现类 `StandardServer` 同时实现了 `Lifecycle`、`MbeanRegistration` 两个接口的所有方法。

### 2.4 Lifecycle

组件的生命“Lifecycle”——在 Tomcat 中组件的生命周期是通过 Lifecycle 接口来控制的，组件只要继承这个接口并实现其中的方法，就可以统一被拥有它的组件进行控制。

这样一层一层地直到一个最高级的组件——Server，就可以控制 Tomcat 中所有组件的生命周期了。

而控制 Server 的是 Startup，也就是启动和关闭 Tomcat。

上述即为：

<img src="https://figure-bed.chua-n.com/JavaWeb/后端/41.png" style="zoom:80%;" />

### 2.5 Connector

Connector 的主要任务是负责接收浏览器发过来的 TCP 连接请求，创建一个 Request 和 Response 对象分别用于和请求端交换数据，然后会产生一个线程来处理这个请求并把产生的 Request 和 Response 对象传给处理这个请求的线程，处理这个请求的线程就是 Container 组件的任务了。

![42.png](https://figure-bed.chua-n.com/JavaWeb/后端/42.png)

Connector 的主要类图：

![](https://figure-bed.chua-n.com/JavaWeb/后端/43.png)

当 Connector 将 Socket 连接封装成 Request 和 Response 对象后，接下来的事情就交给 Container 来处理了。

### 2.6 Container

Container 是容器的父接口，所有子容器都必须实现这个接口。

Container 容器的设计用的是典型的责任链的设计模式，它由 4 个子容器组件构成，分别是 Engine、Host、Context、Wrapper，这 4 个组件并不平行，而是父子关系，Engine 包含 Host，Host 包含 Context，Context 包含 Wrapper。

<img src="https://figure-bed.chua-n.com/JavaWeb/后端/44.png" style="zoom:67%;" />

要运行 war 程序，就必须要用 Host，因为在 war 中必有 web.xml 文件，这个文件的解析就需要 Host。

当 Connector 接收一个连接请求时，会将请求交给 Container，Container 具体是如何处理的呢？

<img src="https://figure-bed.chua-n.com/JavaWeb/后端/45.png" style="zoom:67%;" />

Context 容器代表 Servlet 的 Context，它具备了 Servlet 运行的基本环境，理论上只要有 Context 就能运行 Servlet 了，简单的 Tomcat 可以没有 Engine 和 Host。

Wrapper 代表一个 Servlet，它负责管理一个 Servlet，包括 Servlet 的装载、初始化、执行及资源回收。

Wrapper 是最底层的容器了，因而如果调用它的 addChild 将会报错。

### 2.7 其他组件

Tomcat 中还有其他一些重要的组件，如安全组件 security，日志组件 logger、session、mbeans、naming 等，这些组件共同为 Connector 和 Container 提供必要的服务。

## 3. Tomcat 中的设计模式

在 Tomcat 中用了很多设计模式，有模板模式、工厂模式、单例模式等一些大家比较熟悉的设计模式，还有门面设计模式、观察者设计模式、命令设计模式、责任链设计模式等。

详见 [Java/设计模式/](../../Java/设计模式/) 。
