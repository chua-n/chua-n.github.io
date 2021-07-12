## 1. Servlet简介

**Servlet(Server applet)**，运行在服务器端的小程序。其本质上就是一个Java接口，定义了Java类能被浏览器访问到的规则(或者说被tomcat识别的规则)。

在B/S架构中，服务器端存在静态资源和动态资源，对于动态资源，它是怎么样做到每个人访问的时候返还给浏览器的资源是不一样的呢？——这必须需要逻辑性的代码支持，在Java web中也就必然是Java类代码。

- 故而，浏览器请求动态资源时，实际上就是要找相应的Java类；
- 而这里的Java类依赖于服务器才能运行，它没有main()方法，也即相当于是Tomcat在执行它；
- 为了让Tomcat能够识别所要运行的Java类，相应Java类需要遵守一定的规则（Java接口），而这个规则是谁呢？——就是Servlet。

当我们自定义一个类实现了Servlet接口时，Tomat就能够识别这个类。

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

## 5. Servlet体系结构

|      API       |  类型  | 说明                                                         |
| :------------: | :----: | ------------------------------------------------------------ |
|    Servlet     |  接口  |                                                              |
| GenericServlet | 抽象类 | 其将Servlet接口中其他的方法做了默认空实现，只将service方法作为抽象方法。<br />故而将来定义Servlet类时，可以选择继承GenericServlet，然后只实现service方法即可。 |
|  HttpServlet   | 抽象类 | 继承自GenericServlet类，对http协议的封装，可以简化操作（如不再需要写判断请求方式（GET/POST）的代码）。<br />1) 定义Servlet类时继承HttpServlet；<br />2) 重载doGet/doPost方法。 |

## 6. 注解配置

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



