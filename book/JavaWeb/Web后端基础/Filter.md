---
title: Filter
date: 2021-02-11
---

## 1. 简介

Servlet, Filter, Listener合称JavaWeb的三大组件。

Filter，过滤器：当客户端浏览器访问服务器的资源时，过滤器可以将请求拦截下来，完成一些特殊的功能。

一般地，过滤器用于完成通用的操作，如登录验证、统一编码处理、敏感字符过滤……

### 《深入理解JavaWeb技术内幕》

实际上Filter可以完成与Servlet同样的工作，甚至比Servlet使用起来更加灵活，因为它除了提供了request和response对象外，还提供了一个FilterChain对象，这个对象可以让我们更加灵活地控制请求的流转。

<img src="https://figure-bed.chua-n.com/JavaWeb/后端/30.png" style="zoom:67%;" />

在Tomcat容器中，`FilterConfig`和`FilterChain`的实现类分别是`ApplicationFilterConfig`和`ApplicationFilterChain`，而Filter的实现类由用户自定义，只要实现Filter接口中定义的三个接口就行，这三个接口与在Servlet中的类似。

## 2. 快速入门案例

1. 定义一个类，实现接口Filter，复写其方法；

2. 配置拦截路径：此路径说明对哪些资源进行拦截，即访问这些资源之前，都会执行该过滤器。

这是Java类：

```java
package cn.itcast.web.filter;

import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import java.io.IOException;

@WebFilter("/filter.jsp") // 这里使用注解配置
public class FilterDemo1 implements Filter {
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
    }
    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        System.out.println("filterDemo1被执行了......");
        // 放行
        filterChain.doFilter(servletRequest, servletResponse);
    }
    @Override
    public void destroy() {
    }
}
```

这是web.xml的配置：

> 相应的注解配置为：
>
> 在Filter类头上加`@WebFilter("拦截路径")`注解即可。

```xml
<filter>
    <filter-name>demo1</filter-name>
    <filter-class>cn.itcast.web.filter.FilterDemo1</filter-class>
</filter>
<filter-mapping>
    <filter-name>demo1</filter-name>
    <!-- 配置拦截路径 -->
    <url-pattern>/filter.jsp</url-pattern>
</filter-mapping>
```

## 3. 过滤器生命周期方法

|   方法   | 作用                                                         |
| :------: | ------------------------------------------------------------ |
|   init   | 在服务器启动后，会创建Filter对象，然后调用init方法。init方法只会执行一次，一般用于加载资源 |
| doFilter | 每一次请求拦截资源时就会执行，执行多次                       |
| destroy  | 在服务器关闭后，Filter对象被销毁，如果服务器是正常关闭，则会执行destroy方法。destroy方法只执行一次，用于释放资源。 |

## 4. 过滤器执行流程

1. 执行过滤器；
2. 根据代码`filterChain.**doFilter**(servletRequest, servletResponse);`执行放行后的资源文件；
3. 继续执行上述过滤器放行代码之后的代码。

---

FilterDemo2.java：

```java
package cn.itcast.web.filter;
import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import java.io.IOException;
@WebFilter("/filter.jsp")
public class FilterDemo2 implements Filter {
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
    }
    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        // 对request对象的请求消息增强
        System.out.println("filterDemo2执行了......");
        // 放行
        filterChain.doFilter(servletRequest, servletResponse);
        // 对request对象的响应消息增强
        System.out.println("filterDemo2回来了了......");
    }
    @Override
    public void destroy() {
    }
}
```

filter.jsp：

```jsp
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>filter</title>
</head>
<body>
    <h1>This page is for testing Filter.</h1>
    <%
        System.out.println("I am filter.jsp......");
    %>
</body>
</html>
```

控制台输出效果：

```
filterDemo2执行了......
I am filter.jsp......
filterDemo2回来了了......
```

## 5. 过滤器配置详解

### 5.1 拦截路径配置

- 具体资源路径

    `/index.jsp`：只有访问index.jsp资源时，过滤器才会被执行

- 拦截目录

    `/user/*`：访问/user下的所有资源时，过滤器都会被执行

- 后缀名拦截

    `*.jsp`：访问所有后缀名为jsp的资源时，过滤器都会被执行

- 拦截所有资源

    `/*`：访问所有资源时，过滤器都会被执行

### 5.2 拦截方式配置

- 注解配置：设置dispatcherTypes属性

    |    属性取值     |        作用        |
    | :-------------: | :----------------: |
    | REQUEST（默认） | 浏览器直接请求资源 |
    |     FORWARD     |    转发访问资源    |
    |     INCLUDE     |    包含访问资源    |
    |      ERROR      |    错误跳转资源    |
    |      ASYNC      |    异步访问资源    |

- web.xml配置：设置`<dispatcher></dispatcher>`标签，其取值也是上述5个

## 6. 过滤器链

过滤器链即可以配置多个过滤器，但要注意其顺序问题。

执行顺序（假设有2个过滤器）：

![image-20210710113931423](https://figure-bed.chua-n.com/JavaWeb/后端/过滤器链.png)

- 过滤器1
- 过滤器2
- 资源执行
- 过滤器2
- 过滤器1

而先后顺序如何定义呢？

- 注解配置——按照类名的字符串比较规则排序
- web.xml配置——`<filter-mapping>`谁定义在上面谁先执行

