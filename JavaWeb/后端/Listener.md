事件的监听机制：

| **概念** | **解释**                                                     |
| -------- | ------------------------------------------------------------ |
| 事件     | 一件事情                                                     |
| 事件源   | 事件发生的地方                                               |
| 监听器   | 一个对象                                                     |
| 注册监听 | 将事件、事件源、监听器绑定在一起，当事件源上发生某个事件后，执行监听器代码 |

---

JavaWeb中有很多类型的监听器，这里只介绍ServletContextListener，其作用是监听ServletContext对象的创建和销毁。

| ServletContextListener的方法                       | 作用                                     |
| -------------------------------------------------- | ---------------------------------------- |
| `void contextInitialized(ServletContextEvent sce)` | ServletContext对象创建后会调用该方法     |
| `void contextDestroyed(ServletContextEvent sce)`   | ServletContext对象被销毁之前会调用该方法 |

---

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

