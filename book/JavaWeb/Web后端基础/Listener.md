---
title: Listener
date: 2021-02-11
---

## 1. 何为监听？

事件的监听机制：

|    概念    | 解释                                                         |
| :--------: | ------------------------------------------------------------ |
|    事件    | 一件事情                                                     |
|   事件源   | 事件发生的地方                                               |
|   监听器   | 一个对象                                                     |
| 注册监听器 | 将事件、事件源、监听器绑定在一起，当事件源上发生某个事件后，执行监听器代码 |

## 2. Servlet 中的 Listener

在整个 Tomcat 服务器中，Listener 使用得非常广泛，这是基于观察者模式设计的，Listener 的设计为开发 Servlet 应用程序提供了一种快捷的手段，能够方便地从另一个纵向维度控制程序和数据。

目前在 Servlet 中提供了 6 种两类事件的观察者接口：

<img src="https://figure-bed.chua-n.com/JavaWeb/后端/27.png" style="zoom:50%;" />

实际上，这 6 个 Listener 都继承了`EventListener`接口，每个 Listener 各自定义了需要实现的接口：

<img src="https://figure-bed.chua-n.com/JavaWeb/后端/28.png" style="zoom:50%;" />

<img src="https://figure-bed.chua-n.com/JavaWeb/后端/29.png" style="zoom:50%;" />

如 Spring 的 `ContextLoaderListener` 就实现了一个 `ServletContextListener`，当容器加载时启动 Spring 容器。

## 3. ServletContextListener

JavaWeb 中有很多类型的监听器，这里只介绍`ServletContextListener`，其作用是监听 ServletContext 对象的创建和销毁。

| ServletContextListener 的方法                       | 作用                                     |
| -------------------------------------------------- | ---------------------------------------- |
| `void contextInitialized(ServletContextEvent sce)` | ServletContext 对象创建后会调用该方法     |
| `void contextDestroyed(ServletContextEvent sce)`   | ServletContext 对象被销毁之前会调用该方法 |

使用 ServletContextListener 的步骤：

1. 定义一个类，实现 ServletContextListener 接口，复写其方法；

2. 进行配置：

    - web.xml

        ```xml
        <listener>
            <listener-class>   
                cn.itcast.web.listerner.ContextLoaderListerner
            </listener-class>
        </listener>
        
        <!-- 指定初始化参数<context-param> -->
        ```

    - 注解：`@WebListener`
