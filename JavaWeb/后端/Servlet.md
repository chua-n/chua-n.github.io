## 1. Servlet简介

Servlet是用Java技术来实现CGI(Commen Gateway Interface，通用网关接口)功能的编程，其介于浏览器（或其他HTTP客户端）与服务器之间，起到桥梁作用。

**Servlet(Server applet)**，运行在服务器端的小程序。其本质上就是一个Java接口，定义了Java类能被浏览器访问到的规则(或者说被tomcat识别的规则)。

在B/S架构中，服务器端存在静态资源和动态资源，对于动态资源，它是怎么样做到每个人访问的时候返还给浏览器的资源是不一样的呢？——这必须需要逻辑性的代码支持，在Java web中也就必然是Java类代码。

- 故而，浏览器请求动态资源时，实际上就是要找相应的Java类；
- 而这里的Java类依赖于服务器才能运行，它没有main()方法，也即相当于是Tomcat在执行它；
- 为了让Tomcat能够识别所要运行的Java类，相应Java类需要遵守一定的规则（Java接口），而这个规则是谁呢？——就是Servlet。

当我们自定义一个类实现了Servlet接口时，Tomat就能够识别这个类。

Servlet最重要的作用是服务器可以得到客户想要做的事情：客户请求是表现为表单数据的，由“名/值”对组成。当提交某一个网页的时候常常在浏览器地址栏中看到类似格式的数据，即name/value，每对数据之间用&隔开，即param1=value1&param2=value2&param3=value3…

| Servlet中的操作              | 说明                             |
| ---------------------------- | -------------------------------- |
| request.getParameter()       | 得到表单参数的值                 |
| request.getParameterValues() | 得到多次出现的参数值             |
| request.getParameterNames()  | 得到当前请求中所有参数的完整列表 |

Web服务器响应(response)的构成（这种构成不取决于Servlet的原理，而取决于你懂不懂HTML网页的原理及格式）：

1. 状态行：由http版本（HTTP/1.1）、一个状态码（200）和一段对应状态代码的简短消息（OK）组成。

2. 一些响应报头：Content-Type:      text/html等

3. 一个空行和响应的文档。

---

Servlet的优点：

1. 高效率：通过Servlet，JVM用轻量级的Java线程处理每个请求。同时有N个请求的情况下，CGI程序需要被调入到服务器内存N次；而对于Servlet将开启N个线程，但仅仅调入一个Servlet实例到内存中。
2. 应用方便：Servlet在解析和编码HTML数据、读取设置HTML标题、操作Cookie等很多方面的应用更加方便。
3. 功能强大：Servlet可以直接与Web服务器对话；多个Servlet可以共享数据；Servlet与数据库的连接也比较简单等。
4. 便携性好：Servlet由Java语言编写，遵循标准的API，具有一次编译、到处运行的良好的移植性。
5. 安全：受益于Java语言，Servlet是安全的。
6. 成本低：有很多免费或相对便宜的Web服务器，适合做个人的或者小容量的网站，而且很多商业级的Web服务器相对也比较便宜，此外令一个服务器支持Servlet所需的额外花费也很少。

---

概念辨析：

1. **Servlet容器**——是一个编译好的可执行程序，它是Web服务器与Servlet间的媒介，其负责将请求翻译成Servlet能够理解的形式传递给Servlet，同时传给Servlet一个对象使之可以送回响应。Servlet容器还负责管理Servlet的生命周期。

2. **Web服务器**——能够处理Http请求的服务器；可以提供静态页面、图像等；很多Web服务器也支持动态页面的生成，支持JSP、Servlet等，具有JVM。

    > 一些Servlet容器（如Tomcat）自己也可以作为独立的web服务器运行。

4. **应用服务器**——概念更广，可以处理多种协议的请求，及其他J2EE服务等。

5. **Web应用程序**——组成部分包括Servlet、JSP及其他文件，这些组件需要进行部署。

---

Servlet API：

1. 存在于javax.servlet和javax.servlet.http两个包中。

2. 所有Servlet都须实现javax.servlet.Servlet接口。

    > 不过通常继承如下两个类中的一个：GenericServlet、HttpServlet。

3. 开发Servlet和JSP程序，建议参考Servlet API文档。

## 2. Servlet使用步骤

1. 创建JavaEE项目；

2. 定义一个类，实现Servlet接口，需实现接口中的抽象方法；

3. 配置Servlet（在web.xml中配置）：先引入编写好的Servlet类，然后配置好其映射的资源路径。

    ```xml
    <!--  配置servlet：引入编写的Servlet类，然后配置好路径映射  -->
    <servlet>
        <servlet-name>demo1</servlet-name>
        <servlet-class>cn.itcast.web.servlet.ServletDemo1</servlet-class>
    </servlet>
    <servlet-mapping>
        <servlet-name>demo1</servlet-name>
        <url-pattern>/demo1</url-pattern>
    </servlet-mapping>
    ```

每个注册的Servlet都有相关的很多初始化参数，这些初始化参数写在web.xml中，具体的语法格式参见Tomcat文档。

## 3. Tomcat执行Servlet的原理

1. 当服务器授收到客户端浏览器的请求后，会解析请求url路径（ http://localhost:8080/day13_tomcat/demo1 ），获取访问的Servlet的资源路径（/demo1）；

    > 注：这里day13_tomcat是虚拟目录；

2. Tomcat查找web.xml文件，查看是否有对应该资源的<url-pattern>标签体内容，如果有，由再找到相应的<servlet-class>全类名；

3. Tomcat会将该类的字节码文件加载进内存，并创建其对象；

4. Tomcat调用其方法（主要是service()方法）。

## 4. Servlet的方法

Servlet含有5个方法，但主要需关注其生命周期方法：

### 4.1 初始化：

```java
public void init(ServletConfig servletConfig) throws ServletException
```

默认情况下，Servlet被第一次访问时，Servlet对象被创建；也可将其配置为在服务器启动时被创建。

| `<load-on-startup>`的值 |   创建时机   |
| :---------------------: | :----------: |
|         负整数          | 第一次访问时 |
|        0、正整数        | 服务器启动时 |

Servlet对象的init方法，只执行一次！这说明Servlet在内存中只存在一个对象，故Servlet是单例的：

|                    问题                    |                             解决                             |
| :----------------------------------------: | :----------------------------------------------------------: |
| 当多个用户同时访问时，可能存在线程安全问题 | 尽量不要在Servlet中定义成员变量，即使定义了成员变量，也不要修改其值。 |

### 4.2 提供服务

```java
public void service(ServletRequest servletRequest, ServletResponse servletResponse) throws ServletException, IOException
```

Servlet对象提供服务的方法，可执行多次。每次访问Servlet时，service方法都会被调用一次。

### 4.3 销毁

```java
public void destroy()
```

Servlet对象的destroy方法，只执行一次。

- Servlet对象被销毁前执行（服务器关闭时，Servlet被销毁）；
- 只有服务器正常关闭时，才会执行destroy方法；
- destroy方法在Servlet被销毁之前执行，一般用于释放资源。

destroy方法一般用于：

- 翻译Servlet所获得的资源；
- 使Servlet有机会关闭数据库连接、停止后台运行的线程、将cookie列表和点击数据写入到磁盘；
- 执行其他清理活动。

## 5. Servlet体系结构

|      API       |  类型  | 说明                                                         |
| :------------: | :----: | ------------------------------------------------------------ |
|    Servlet     |  接口  |                                                              |
| GenericServlet | 抽象类 | 其将Servlet接口中其他的方法做了默认空实现，只将service方法作为抽象方法。<br />故而将来定义Servlet类时，可以选择继承GenericServlet，然后只实现service方法即可。 |
|  HttpServlet   | 抽象类 | 继承自GenericServlet类，对http协议的封装，可以简化操作（如不再需要写判断请求方式（GET/POST）的代码）。<br />1) 定义Servlet类时继承HttpServlet；<br />2) 重载doGet/doPost方法。 |

## 6. 一个Servlet的基本结构

Servlet基本结构：

1. 一般扩展自HttpServlet

2. 复写doGet或doPost方法，

    - 这两个方法都接受两个类型的参数：HttpServletRequest和HttpServletResponse。

    - 通过HttpServletRequest，可以得到所有的输入数据，如表单数据、HTTP请求头等客户信息。

3. doGet或doPost方法是由service方法调用的。

## 7. Servlet的生命周期（清华大学郑莉）

首先服务器仅创建Servlet的一个实例（此时会执行Servlet的init方法）。

针对每个客户端的每个请求，都会创建一个线程去处理这个请求，这个线程调用Servlet实例的service方法，这个service方法根据HTTP请求的类型去调用doGet/doPost方法等。

## 8. ServletConfig对象

ServletConfig对象包含Servlet初始化所需的很多参数，如计数器、默认值等，这些参数可以以配置文件的形式存在。

## 9. 注解配置

自Servlet 3.0之后，Servlet支持使用注解进行配置，不再需要web.xml了。步骤如下：

1. 创建JavaEE项目，选择Servlet的版本为3.0以上，可以不创建web.xml；
2. 定义一个类，实现Servlet接口，复写其方法；
3. 在实现类上使用@WebServlet注解，进行配置。

| 语法                                | 说明                                                         |
| ----------------------------------- | ------------------------------------------------------------ |
| @WebServlet(urlPatterns="资源路径") | 完整版写法                                                   |
| @WebServlet(value="资源路径")       | value这个属性一般会绑定到最重要的一个属性，显示urlPatterns属性最重要，所以Servlet将value属性等同于urlPatterns |
| @WebServlet("资源路径")             | 由于value属性的重要性不言而喻，总是需要定义其值，故而为了方便，可以直接输入value的值。 |

> 注意概念辨析：“虚拟路径”是项目的访问方式，“资源路径”才对应到相应的资源
>
> 附：@WebServlet注解的定义如下：
>
> ```java
> @Target({ElementType.TYPE})
> @Retention(RetentionPolicy.RUNTIME)
> @Documented
> public @interface WebServlet {
>     String name() default "";
>     String[] value() default {};
>     String[] urlPatterns() default {};
>     int loadOnStartup() default -1;
>     WebInitParam[] initParams() default {};
>     boolean asyncSupported() default false;
>     String smallIcon() default "";
>     String largeIcon() default "";
>     String description() default "";
>     String displayName() default "";
> }
> ```

## 10. Servlet的协作与通信

为了更好地响应客户端的请求，Servlet有时需要和网络上的其他资源进行通信，如HTML网页、其他Servlet、JSP网页等。

Servlet协作通讯的第一步是获得分发器（dispatcher)，即RequestDispatcher接口的一个对象。

关于RequestDispatcher接口：

- 产生其对象：
    - `request.getRequestDispatcher(someURL)`
    - `getServletContext().getRequestDispatcher("someURL")`
- 通过设置字符串参数可以获得Servlet、HTML网页、JSP网页等资源
- forward()方法：将本Servlet的request请求传递给“其他资源”响应，通过利用此方法可实现：Servlet先预处理request，然后将处理后的request传递给“其他资源”处理。

重定向与转发：

- 重写向——HttpServletResponse对象调用sendRedirect()方法：
    - 不能自动保留所有请求的数据；
    - 将产生一个不同的URL
- 转发——RequestDispatcher类的forward()方法：
    - 可以保留请求的数据
    - 保留servlet的URL

## 11. Applet与Servlet的通信

Applet与Servlet也可以通信，比如使用Socket技术。
