---
title: Servlet
date: 2020-10-21
---

## 1. Servlet 简介

Servlet 是用 Java 技术来实现 CGI(Commen Gateway Interface，通用网关接口）功能的编程，其介于浏览器（或其他 HTTP 客户端）与服务器之间，起到桥梁作用。

**Servlet(Server applet)** ，运行在服务器端的小程序。其本质上就是一个 Java 接口，定义了 Java 类能被浏览器访问到的规则（或者说被 tomcat 识别的规则）。

在 B/S 架构中，服务器端存在静态资源和动态资源，对于动态资源，它是怎么样做到每个人访问的时候返还给浏览器的资源是不一样的呢？——这必须需要逻辑性的代码支持，在 Java Web 中也就必然是 Java 类代码。

- 故而，浏览器请求动态资源时，实际上就是要找相应的 Java 类；
- 而这里的 Java 类依赖于服务器才能运行，它没有 main() 方法，也即相当于是 Tomcat 在执行它；
- 为了让 Tomcat 能够识别所要运行的 Java 类，相应 Java 类需要遵守一定的规则（Java 接口），而这个规则是谁呢？——就是 Servlet。

当我们自定义一个类实现了 Servlet 接口时，Tomat 就能够识别这个类。

Servlet 最重要的作用是服务器可以得到客户想要做的事情：客户请求是表现为表单数据的，由“名/值”对组成。当提交某一个网页的时候常常在浏览器地址栏中看到类似格式的数据，即`name/value`，每对数据之间用`&`隔开，即`param1=value1&param2=value2&param3=value3…`

| Servlet 中的操作              | 说明                             |
| ---------------------------- | -------------------------------- |
| request.getParameter()       | 得到表单参数的值                 |
| request.getParameterValues() | 得到多次出现的参数值             |
| request.getParameterNames()  | 得到当前请求中所有参数的完整列表 |

Web 服务器响应 (response) 的构成（这种构成不取决于 Servlet 的原理，而取决于你懂不懂 HTML 网页的原理及格式）：

1. 状态行：由 http 版本（HTTP/1.1）、一个状态码（200）和一段对应状态代码的简短消息（OK）组成。
2. 一些响应报头：`Content-Type: text/html` 等
3. 一个空行和响应的文档。

---

Servlet 的优点：

1. 高效率：通过 Servlet，JVM 用轻量级的 Java 线程处理每个请求。同时有 N 个请求的情况下，CGI 程序需要被调入到服务器内存 N 次；而对于 Servlet 将开启 N 个线程，但仅仅调入一个 Servlet 实例到内存中。
2. 应用方便：Servlet 在解析和编码 HTML 数据、读取设置 HTML 标题、操作 Cookie 等很多方面的应用更加方便。
3. 功能强大：Servlet 可以直接与 Web 服务器对话；多个 Servlet 可以共享数据；Servlet 与数据库的连接也比较简单等。
4. 便携性好：Servlet 由 Java 语言编写，遵循标准的 API，具有一次编译、到处运行的良好的移植性。
5. 安全：受益于 Java 语言，Servlet 是安全的。
6. 成本低：有很多免费或相对便宜的 Web 服务器，适合做个人的或者小容量的网站，而且很多商业级的 Web 服务器相对也比较便宜，此外令一个服务器支持 Servlet 所需的额外花费也很少。

---

概念辨析：

1. **Servlet 容器**——是一个编译好的可执行程序，它是 Web 服务器与 Servlet 间的媒介，其负责将请求翻译成 Servlet 能够理解的形式传递给 Servlet，同时传给 Servlet 一个对象使之可以送回响应。Servlet 容器还负责管理 Servlet 的生命周期。

2. **Web 服务器**——能够处理 Http 请求的服务器；可以提供静态页面、图像等；很多 Web 服务器也支持动态页面的生成，支持 JSP、Servlet 等，具有 JVM。

    > 一些 Servlet 容器（如 Tomcat）自己也可以作为独立的 web 服务器运行。

3. **应用服务器**——概念更广，可以处理多种协议的请求，及其他 J2EE 服务等。

4. **Web 应用程序**——组成部分包括 Servlet、JSP 及其他文件，这些组件需要进行部署。

---

Servlet API：

1. 存在于 `javax.servlet` 和 `javax.servlet.http` 两个包中。

2. 所有 `Servlet` 都须实现 `javax.servlet.Servlet` 接口。

    > 不过通常继承如下两个类中的一个：`GenericServlet, HttpServlet`。

3. 开发 Servlet 和 JSP 程序，建议参考 Servlet API 文档。

## 2. Servlet 使用步骤

### 2.1 xml 方式

1. 创建 JavaEE 项目；

2. 定义一个类，实现 Servlet 接口，需实现接口中的抽象方法；

3. 配置 Servlet（在 web.xml 中配置）：先引入编写好的 Servlet 类，然后配置好其映射的资源路径。

    ```xml
    <!--  配置 servlet：引入编写的 Servlet 类，然后配置好路径映射  -->
    <servlet>
        <servlet-name>demo1</servlet-name>
        <servlet-class>cn.itcast.web.servlet.ServletDemo1</servlet-class>
    </servlet>
    <servlet-mapping>
        <servlet-name>demo1</servlet-name>
        <url-pattern>/demo1</url-pattern>
    </servlet-mapping>
    ```

每个注册的 Servlet 都有相关的很多初始化参数，这些初始化参数写在 web.xml 中，具体的语法格式参见 Tomcat 文档。

### 2.2 注解方式

自 Servlet 3.0 之后，Servlet 支持使用注解进行配置，不再需要 web.xml 了。步骤如下：

1. 创建 JavaEE 项目，选择 Servlet 的版本为 3.0 以上，可以不创建 web.xml；
2. 定义一个类，实现 `Servlet` 接口，复写其方法；
3. 在实现类上使用 `@WebServlet` 注解，进行配置。

| 语法                                  | 说明                                                         |
| ------------------------------------- | ------------------------------------------------------------ |
| `@WebServlet(urlPatterns="资源路径")` | 完整版写法                                                   |
| `@WebServlet(value="资源路径")`       | `value` 这个属性一般会绑定到最重要的一个属性，显示 `urlPatterns` 属性最重要，所以 Servlet 将 `value` 属性等同于 `urlPatterns` |
| `@WebServlet("资源路径")`             | 由于 `value` 属性的重要性不言而喻，总是需要定义其值，故而为了方便，可以直接输入 `value` 的值。 |

> 注意概念辨析：*虚拟路径*是项目的访问方式，*资源路径*才对应到相应的资源。附：`@WebServlet` 注解的定义如下：
>
> ```java
> package javax.servlet.annotation;
> 
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

## 4. Servlet 的方法

Servlet 含有 5 个方法，但主要需关注其生命周期方法。

### 4.1 初始化

```java
public void init(ServletConfig servletConfig) throws ServletException
```

默认情况下，Servlet 被第一次访问时，Servlet 对象被创建；也可将其配置为在服务器启动时被创建。

| `<load-on-startup>`的值 |   创建时机   |
| :---------------------: | :----------: |
|         负整数          | 第一次访问时 |
|        0、正整数        | 服务器启动时 |

Servlet 对象的 `init` 方法，只执行一次！这说明 Servlet 在内存中只存在一个对象，故 Servlet 是单例的：

| 问题                                       | 解决                                                         |
| :----------------------------------------- | :----------------------------------------------------------- |
| 当多个用户同时访问时，可能存在线程安全问题 | 尽量不要在 Servlet 中定义成员变量，即使定义了成员变量，也不要修改其值。 |

### 4.2 提供服务

```java
public void service(ServletRequest servletRequest, ServletResponse servletResponse) throws ServletException, IOException
```

Servlet 对象提供服务的方法，可执行多次。每次访问 Servlet 时，`service` 方法都会被调用一次。

### 4.3 销毁

```java
public void destroy()
```

Servlet 对象的 `destroy` 方法，只执行一次。

- Servlet 对象被销毁前执行（服务器关闭时，Servlet 被销毁）；
- 只有服务器正常关闭时，才会执行 `destroy` 方法；
- `destroy` 方法在 Servlet 被销毁之前执行，一般用于释放资源。

`destroy` 方法一般用于：

- 翻译 Servlet 所获得的资源；
- 使 Servlet 有机会关闭数据库连接、停止后台运行的线程、将 Cookie 列表和点击数据写入到磁盘；
- 执行其他清理活动。

### 4.4 Servlet 的生命周期（清华大学郑莉）

首先服务器仅创建 Servlet 的一个实例（此时会执行 Servlet 的 `init` 方法）。

针对每个客户端的每个请求，都会创建一个线程去处理这个请求，这个线程调用 Servlet 实例的 `service` 方法，这个 `service` 方法根据 HTTP 请求的类型去调用 `doGet/doPost` 方法等。

## 5. Servlet 体系结构

### 5.1 Servlet 接口及其实现类

|       API        |  类型  | 说明                                                         |
| :--------------: | :----: | ------------------------------------------------------------ |
|    `Servlet`     |  接口  |                                                              |
| `GenericServlet` | 抽象类 | 其将 Servlet 接口中其他的方法做了默认空实现，只将 `service` 方法作为抽象方法。<br />故而将来定义 Servlet 类时，可以选择继承 `GenericServlet`，然后只实现 `service` 方法即可。 |
|  `HttpServlet`   | 抽象类 | 继承自 `GenericServlet` 类，对 http 协议的封装，可以简化操作（如不再需要写判断请求方式（GET/POST）的代码）。<br />1) 定义 Servlet 类时继承 `HttpServlet`；<br />2) 重载 `doGet/doPost` 方法。 |

### 5.2 Servlet 顶层类关联图

<img src="https://figure-bed.chua-n.com/JavaWeb/后端/23.png" style="zoom:67%;" />

- 与 Servlet 主要关联的是三个类，分别是`ServletConfig, ServletRequest, ServletResponse`，它们都是通过容器传递给 Servlet 的，其中`ServletConfig`在 Servlet 初始化时就传给 Servlet 了，后两个是在请求达到时调用 Servlet 传递过来的。
- Servlet 的运行模式是一个典型的“握手型的交互式”运行模式，即两个模块为了交换数据通常都会准备一个交易场景，这个场景一直跟随这个交易过程直到这个交易完成为止。
- 我们在创建自己的 Servlet 类时通常使用的都是`HttpServletRequest`和`HttpServletResponse`，它们分别继承了`ServletRequest`和`ServletResponse`。

`ServletConfig` 对象包含 Servlet 初始化所需的很多参数，如计数器、默认值等，这些参数可以以配置文件的形式存在。

与 Request 相关的类结构图：

<img src="https://figure-bed.chua-n.com/JavaWeb/后端/24.png" style="zoom:67%;" />

Request 和 Response 的转变过程：

<img src="https://figure-bed.chua-n.com/JavaWeb/后端/25.png" style="zoom:67%;" />

### 5.3 一个 Servlet 的基本结构

Servlet 基本结构：

1. 一般扩展自 `HttpServlet`
2. 复写 `doGet` 或 `doPost` 方法，
    - 这两个方法都接受两个类型的参数：`HttpServletRequest` 和 `HttpServletResponse`。
    - 通过 `HttpServletRequest`，可以得到所有的输入数据，如表单数据、HTTP 请求头等客户信息。
3. `doGet` 或 `doPost` 方法是由 `service` 方法调用的。

## 6. Servlet 的协作与通信

为了更好地响应客户端的请求，Servlet 有时需要和网络上的其他资源进行通信，如 HTML 网页、其他 Servlet、JSP 网页等。

Servlet 协作通讯的第一步是获得分发器（dispatcher)，即 RequestDispatcher 接口的一个对象。

关于 RequestDispatcher 接口：

- 产生其对象：
    - `request.getRequestDispatcher(someURL)`
    - `getServletContext().getRequestDispatcher("someURL")`
- 通过设置字符串参数可以获得 Servlet、HTML 网页、JSP 网页等资源
- forward() 方法：将本 Servlet 的 request 请求传递给“其他资源”响应，通过利用此方法可实现：Servlet 先预处理 request，然后将处理后的 request 传递给“其他资源”处理。

重定向与转发：

- 重写向——HttpServletResponse 对象调用 sendRedirect() 方法：
    - 不能自动保留所有请求的数据；
    - 将产生一个不同的 URL
- 转发——RequestDispatcher 类的 forward() 方法：
    - 可以保留请求的数据
    - 保留 servlet 的 URL

## 7. Servlet 容器——Tomcat

> Tomcat 是最常用的 Servlet 容器。

### 7.1 Tomcat 执行 Servlet 的原理简述（黑马程序员版）

1. 当服务器授收到客户端浏览器的请求后，会解析请求 url 路径（ http://localhost:8080/day13_tomcat/demo1 ），获取访问的 Servlet 的资源路径（/demo1）；

    > 注：这里 day13_tomcat 是虚拟目录；

2. Tomcat 查找 web.xml 文件，查看是否有对应该资源的`<url-pattern>`标签体内容，如果有，由再找到相应的`<servlet-class>`全类名；

3. Tomcat 会将该类的字节码文件加载进内存，并创建其对象；

4. Tomcat 调用其方法（主要是`service`方法）。

### 7.2 Tomcat 容器模型详述

Tomcat 的容器模型分为 4 个等级：

<img src="https://figure-bed.chua-n.com/JavaWeb/后端/20.png" style="zoom:67%;" />

真正管理 Servlet 的容器是 Context 容器，一个 Context 对应一个 web 工程，在 Tomcat 的配置文件中可以很容易地发现这一点，如`<Context path="/projectOne" docBase="D:\projects\projectOne" reloadable="true" />`。

添加一个 web 应用时将会创建一个 StandardContext 容器，并且给这个 Context 容器设置必要的参数，url 和 path 分别代表这个应用在 Tomcat 中的访问路径和这个应用实际的物理路径。

**Tomcat 的启动逻辑**是基于观察者模式设计的，所有的容器都会继承 `Lifecycle` 接口，它管理着容器的整个生命周期，所有容器的修改和状态的改变都会由它去通知已经注册的观察者 (Listener)。

<img src="https://figure-bed.chua-n.com/JavaWeb/后端/21.png" style="zoom:50%;" />

ContextConfig 的 init 方法将会主要完成以下工作：

1. 创建用于解析 XML 配置文件的 contextDigester 对象；
2. 读取默认的 context.xml 配置文件，如果存在则解析它；
3. 读取默认的 Host 配置文件，如果存在则解析它；
4. 读取默认的 Context 自身的配置文件，如果存在则解析它；
5. 设置 Context 的 DocBase。

ContextConfig 的 init 方法完成后，Context 容器就会执行 startInternal 方法，这个方法的启动逻辑比较复杂，主要包括如下几部分：
1. 创建读取资源文件的对象。
2. 创建 ClassLoader 对象。
3. 设置应用的工作目录。
4. 启动相关的辅助类，如 logger, realm,      resources 等。
5. 修改启动状态，通知感兴趣的观察者（Web 应用的配置）。
6. 子容器的初始化。
7. 获取 ServletContext 并设置必要的参数。
8. 初始化"load on startup"的 Servlet。

Web 应用的初始化工作：

1. Web 应用的初始化工作是在 ContextConfig 的 configureStart 方法中实现的，应用的初始化主要是解析 web.xml 文件，这个文件描述了一个 web 应用的关键信息，也是一个 web 应用的入口。
2. 为什么要将 Servlet 包装成 StandardWrapper 而不直接包装成 Servlet 对象？这里 SatandardWrapper 是 Tomcat 容器中的一部分，它具有容器的特征，而 Servlet 作为一个独立的 Web 开发标准，不应该强耦合在 Tomcat 中。
3. 除了将 Servlet 包装万 StandarWrapper 并作为子容器添加到 Context 中外，其他所有的 web.xml 属性都被解析到 Context 中，所以说 Context 容器才是真正运行 Servlet 的 Servlet 容器。一个 web 应用对应一个 Context 容器，容器的配置属性由应用的 web.xml 指定，这样我们就能理解 web.xml 到底起什么作用了。

### 7.3 创建 Servlet 实例

如果 Servlet 的 `load-on-startup` 配置项大于 0，那么在 Context 容器启动时就会被实例化，前面提到在解析配置文件时会读取默认的 globalWebXml，在 conf 下的 web.xml 文件中定义了一些默认的配置项，其中定义了两个 Servlet，分别是`org.apache.catalina.servlets.DefaultServlet`和`org.apache.jasper.servlet.JspServlet`，它们的 load-on-startup 分别是 1 和 3，也就是当 Tomcat 启动时这两个 Servlet 就会被启动。

创建 Servlet 实例的方法是从`Wrapper.loadServlet`开始的。

创建 Servlet 对象的相关类结构：

<img src="https://figure-bed.chua-n.com/JavaWeb/后端/22.png" style="zoom:67%;" />

事实上 Servlet 从被 web.xml 解析到完成初始化，这个过程非常复杂，中间有很多过程，包括各种容器状态的转化引起的监听事件的触发、各种访问权限的控制和一些不可预料的错误发生的判断行为等。

## 8. Servlet 的工作流程

用户从浏览器向服务器发起的一个请求通常会包含如下信息：http://hostname:port/contextpath/servletpath ，其中 hostname 与 port 用来与服务器建立 TCP 连接，后面的 URL 才用来选择在服务器中哪个子容器服务用户的请求。服务器是如何根据这个 URL 来到达正确的 Servlet 容器中的呢？

Request 在容器中的路由图：

<img src="https://figure-bed.chua-n.com/JavaWeb/后端/26.png" style="zoom:50%;" />

> Servlet 的确已经能够帮我们完成所有的工作了，但是现在的 Web 应用很少直接将交互的全部页面用 Servlet 来实现，而是采用更加高效的 MVC 框架来实现。这些 MVC 框架的基本原理是将所有的请求都映射到一个 Servlet，然后去实现 `service` 方法，这个方法也就是 MVC 框架的入口。

当 Servlet 从 Servlet 容器中移除时，也就表明该 Servlet 的生命周期结束了，这时 Servlet 的`destroy`方法将被调用，做一些扫尾工作。

## 9. url-pattern

### 9.1 综述

在 web.xml 中`<servlet-mapping>`和`<filter-mapping>`都有`<url-pattern>`配置项，它们的作用都是匹配一次请求是否会执行这个 Servlet 或者 Filter。

Filter 的 `url-pattern` 匹配是在创建`ApplicationFilterChain`对象时进行的，它会把所有定义的 Filter 的 `url-pattern` 与当前的 URL 匹配，如果匹配成功就将这个 Filter 保存到`ApplicationFilterChain`的 filters 数组中，然后在 FilterChain 中依次调用。

在 web.xml 加载时，会首先检查`<url-pattern>`配置是否符合规则，这个检查是在`StandardContext`的`validateURLPattern`方法中检查的，如果检查不成功，Context 容器启动会失败，并且会报`java.lang.IllegalArgumentException:Invalid<url-pattern>/a/*.htm in Servlet mapping`错误。

### 9.2 \<url-pattern>的解析规则

`<url-pattern>`的解析规则，对于 Servlet 和 Filter 是一样的，匹配的规则有如下三种：

- 精确匹配：如`/foo.htm`只会匹配 `foo.html` 这个 URL
- 路径匹配：如`/foo/*`会匹配以 `foo` 为前缀的 URL
- 后缀匹配：如`*.htm`会匹配所有以 `htm` 为后缀的 URL

Servlet 的匹配规则在`org.apache.tomcat.util.http.mapper.Mapper.internalMapWrapper`中定义，对 Servlet 的匹配来说如果同时定义了多个`<url-pattern>`，那么到底匹配哪个 Servlet 呢？这个匹配顺序是（一次请求只会成功匹配到一个 Servlet）：

1. 首先精确匹配；

2. 其次使用“最长路径匹配”；

   > 如 Servlet1 为`/foo/*`，Servlet2 为`/*`，这时请求的 URL 为 http://localhost/foo/foo.htm ，那么 Servlet1 匹配成功。

3. 最后根据后缀进行匹配。

Filter 的匹配规则在`ApplicationFilterFactory.matchFiltersURL`方法中定义。Filter 的匹配原则和 Servlet 有些不同，只要匹配成功，这些 Filter 都会在请求链上被调用。`<url-pattern>`的其他写法，如`/foo/, /*.htm, */foo`，都是不对的。
