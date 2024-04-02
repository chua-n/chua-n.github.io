---
title: Listener
date: 2021-02-11
---

## 1. 何为监听？

事件的监听机制：

| **概念** | **解释**                                                     |
| -------- | ------------------------------------------------------------ |
| 事件     | 一件事情                                                     |
| 事件源   | 事件发生的地方                                               |
| 监听器   | 一个对象                                                     |
| 注册监听 | 将事件、事件源、监听器绑定在一起，当事件源上发生某个事件后，执行监听器代码 |

## 2. Servlet中的Listener

在整个Tomcat服务器中，Listener使用得非常广泛，这是基于观察者模式设计的，Listener的设计为开发Servlet应用程序提供了一种快捷的手段，能够方便地从另一个纵向维度控制程序和数据。

目前在Servlet中提供了6种两类事件的观察者接口：

<img src="https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/后端/27.png" style="zoom:50%;" />

实际上，这6个Listener都继承了`EventListener`接口，每个Listener各自定义了需要实现的接口：

<img src="https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/后端/28.png" style="zoom:50%;" />

<img src="https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/后端/29.png" style="zoom:50%;" />

如Spring的`org.springframework.web.context.ContextLoaderListener`就实现了一个`ServletContextListener`，当容器加载时启动Spring容器。

## 3. ServletContextListener

JavaWeb中有很多类型的监听器，这里只介绍`ServletContextListener`，其作用是监听ServletContext对象的创建和销毁。

| ServletContextListener的方法                       | 作用                                     |
| -------------------------------------------------- | ---------------------------------------- |
| `void contextInitialized(ServletContextEvent sce)` | ServletContext对象创建后会调用该方法     |
| `void contextDestroyed(ServletContextEvent sce)`   | ServletContext对象被销毁之前会调用该方法 |

使用ServletContextListener的步骤：

1. 定义一个类，实现ServletContextListener接口，复写其方法；

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

