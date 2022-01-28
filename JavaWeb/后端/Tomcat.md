## 1. Tomcat快速实战

### 1.1 Tomcat安装与启动

https://tomcat.apache.org/ 下载安装包，解压后即可完成安装。建议安装路径不要有中文和空格。

下载安装好Tomcat后，启动Tomcat的方式为：找到Tomcat目录下的 bin/startup.bat，双击运行即可。启动可能遇到的问题：

1. 黑窗口一闪而过：没有正确配置JAVA_HOME环境变量，应该像这样配置：

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

        - 一般会将Tomcat的默认端口号改为80，因为80是HTTP协议的默认端口号，这样的好处是在访问时地址拦可以不再专门输入端口号。

修复Tomcat命令行中文乱码：

- 方式一：修改CMD命令行的编码格式为UTF-8。

- 方式二：将tomcat控制台日志输出编码格式更改为GBK。具体而言，修改Tomcat 根目录下 conf/logging.properties 文件中的 ConsoleHandler.encoding 配置项为GBK：

    ```properties
    # java.util.logging.ConsoleHandler.encoding = UTF-8
    java.util.logging.ConsoleHandler.encoding = GBK
    ```

### 1.2 Tomcat的目录结构

| 文件夹  | 说明                              |
| :-----: | --------------------------------- |
|   bin   | 可执行文件                        |
|  conf   | 配置文件                          |
|   lib   | 依赖jar包（Tomcat是纯java编写的） |
|  logs   | 日志文件                          |
|  temp   | 临时文件                          |
| webapps | 存放web项目                       |
|  work   | 存放运行时的数据                  |

### 1.3 项目部署与访问

Tomcat部署项目的3种方式：

1. 直接将项目放到webapps目录下即可

    - 文件夹形式：如一个/hello的web项目，此时项目的访问路径即是虚拟目录 。
    - war包形式：将项目打成一个war包，再将war包放置到webapps目录下，war包会自动解压缩  

2. 配置conf/server.xml文件：

    ```xml
    <!-- 
    在<Host>标签体中配置如下，其中，docBase：项目存放的路径
    path：虚拟目录
    -->
    
    <Context docBase="D:\hello" path="/hehe" />
    ```

3. 在conf\Catalina\localhost创建任意名称的xml文件，在文件中编写：

    ```xml
    <!-- 此时虚拟目录即是编写的xml文件的名称  -->
    <Context docBase="D:\hello" />
    ```

访问Tomcat项目：浏览器访问 http://localhost:8080 （访问自己），或 http://别人的ip地址:8080 （访问别人）。

### 1.4 静态项目与动态项目

Java动态项目的目录结构比静态项目多一个WEB-INF目录：

```shell
-- 项目的根目录

	-- WEB-INF目录

		-- web.xml：web项目的核心配置文件

		-- classes目录：放置字节码文件的目录

		-- lib目录：放置依赖的jar包
```

### 1.5 Tomcat集成到IDEA

Tomcat可集成到idea中，在idea中创建JavaEE的项目并部署项目（参见 https://www.bilibili.com/video/BV1uJ411k7wy?p=683 ）。

IDEA与tomcat的相关配置（参见 https://www.bilibili.com/video/BV1uJ411k7wy?p=690 ）：

- IDEA会为每一个tomcat部署的项目单独建立一份配置文件；

    - 可通过查看控制台的输出信息查看这些配置文件的存储路径；
    - 如我这里的路径：`Using CATALINA_BASE: "C:\Users\admin\AppData\Local\JetBrains\IntelliJIdea2020.3\tomcat\265aa75b-dfa6-4cab-ba62-5cfc609a7207"`

- 在IDEA中，一个Tomcat项目有两个相关的存储地方：“工作空间项目”和“Tomcat部署的web项目”，其区别为：

    | 工作空间项目                                                 | Tomcat部署的web项目                                          |
    | ------------------------------------------------------------ | ------------------------------------------------------------ |
    | ![img](https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/后端/工作空间项目.png) | ![img](https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/后端/Tomcat部署的Web项目.png) |

    - tomcat真正访问的是“Tomcat部署的web项目”，其对应着“工作空间项目”的webapp目录下的所有资源；
    - WEB-INF目录下的资源不能被浏览器直接访问。

- Tomcat的调试：需要使用“小虫子”图标启动高度：debug启动。

## 2. Tomcat的结构

### 2.1 总体结构

Tomcat的结构很复杂，但Tomcat也非常模块化，找到了Tomcat最核心的模块，便抓住了Tomcat的七寸。

<img src="https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/后端/38.png" style="zoom:67%;" />

- 心脏组件：Connector和Container。
- Connector组件可以被替换，这给服务器设计者提供更多的选择。
- 一个Container可以选择对应多个Connector，多个Connector和一个Container就形成了一个Service，有了Service就可以对外提供服务了。
- 但Service还要有一个生存的环境——赋其生命、掌其生死，这时就非Server莫属了，因而整个Tomcat的生命周期是由Server控制的。

### 2.2 Service

从Service接口中定义的方法可以看出，它主要是为了关联Connector和Container，同时会初始化它下面的其他组件：

<img src="https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/后端/39.png" style="zoom:80%;" />

- 尽管在接口中并没有规定一定要控制它下面的组件的生命周期，实际上Tomcat所有组件的生命周期在一个Lifecycle的接口中控制，这里用到了一个重要的设计模式。
- Service接口的标准实现类是StandarService，它不仅实现了Service接口，同时还实现了LifeCycle接口，这样它就可以控制下面组件的生命周期了。

### 2.3 Server

Server要完成的任务很简单，就是提供一个接口让其他程序能够访问到这个Service集合，同时要维护它所包含的所有Service的生命周期，包括如何初始化、如何结束服务、如何找到别人要访问的Service等等。

<img src="https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/后端/40.png" style="zoom:80%;" />

> Server的标准实现类`StandardServer`同时实现了`Lifecycle`、`MbeanRegistration`两个接口的所有方法。

### 2.4 Lifecycle

组件的生命“Lifecycle”——在Tomcat中组件的生命周期是通过Lifecycle接口来控制的，组件只要继承这个接口并实现其中的方法，就可以统一被拥有它的组件进行控制。

这样一层一层地直到一个最高级的组件——Server，就可以控制Tomcat中所有组件的生命周期了。

而控制Server的是Startup，也就是启动和关闭Tomcat。

上述即为：

<img src="https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/后端/41.png" style="zoom:80%;" />

### 2.5 Connector

Connector的主要任务是负责接收浏览器发过来的TCP连接请求，创建一个Request和Response对象分别用于和请求端交换数据，然后会产生一个线程来处理这个请求并把产生的Request和Response对象传给处理这个请求的线程，处理这个请求的线程就是Container组件的任务了。

<img src="https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/后端/42.png" style="zoom:80%;" />

Connector的主要类图：

<img src="https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/后端/43.png" style="zoom:67%;" />

当Connector将Socket连接封装成Request和Response对象后，接下来的事情就交给Container来处理了。

### 2.6 Container

Container是容器的父接口，所有子容器都必须实现这个接口。

Container容器的设计用的是典型的责任链的设计模式，它由4个子容器组件构成，分别是Engine、Host、Context、Wrapper，这4个组件并不平行，而是父子关系，Engine包含Host，Host包含Context，Context包含Wrapper。

<img src="https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/后端/44.png" style="zoom:67%;" />

要运行war程序，就必须要用Host，因为在war中必有web.xml文件，这个文件的解析就需要Host。

当Connector接收一个连接请求时，会将请求交给Container，Container具体是如何处理的呢？

<img src="https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/后端/45.png" style="zoom:67%;" />

Context容器代表Servlet的Context，它具备了Servlet运行的基本环境，理论上只要有Context就能运行Servlet了，简单的Tomcat可以没有Engine和Host。

Wrapper代表一个Servlet，它负责管理一个Servlet，包括Servlet的装载、初始化、执行及资源回收。

Wrapper是最底层的容器了，因而如果调用它的addChild将会报错。

### 2.7 其他组件

Tomcat中还有其他一些重要的组件，如安全组件security，日志组件logger、session、mbeans、naming等，这些组件共同为Connector和Container提供必要的服务。

## 3. Tomcat中的设计模式

在Tomcat中用了很多设计模式，有模板模式、工厂模式、单例模式等一些大家比较熟悉的设计模式，还有门面设计模式、观察者设计模式、命令设计模式、责任链设计模式等。

详见Java/设计模式。

