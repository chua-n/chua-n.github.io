> Spring Boot provides auto-configuration for Spring MVC that works well with most applications.

## 1. 静态资源

### 1.1 静态资源目录

只要静态资源放在类路径下：即`/static`（有时为`/public`、`/resources`、`/META-INF/resources`），即可如下直接访问：

- `当前项目根路径/静态资源名`

其原理即为静态映射：当请求进来，先寻找是否有Controller能处理，当不能处理时，所有请求都交给静态资源处理器。如果静态资源找都找不到则响应404页面。

如下改变默认的静态资源路径：

```yaml
spring:
  mvc:
    static-path-pattern: /res/**

  resources:
    static-locations: [classpath:/haha/]
```

### 1.2 静态资源访问前缀

静态资源的访问默认无前缀：

```yaml
spring:
  mvc:
    static-path-pattern: /res/**
```

> 当前项目 + static-path-pattern + 静态资源名 = 静态资源文件夹下找。

###  1.3 webjar

这是个啥？？？？？[05、Web开发 · 语雀 (yuque.com)](https://www.yuque.com/atguigu/springboot/vgzmgh)

### 1.4 静态资源配置原理

SpringBoot启动默认加载`XxxAutoConfiguration`类（自动配置类），因此SpringMVC功能的自动配置类`WebMvcAutoConfiguration`生效。`WebMvcAutoConfiguration`有如下注解：

```java
@Configuration(proxyBeanMethods = false)
@ConditionalOnWebApplication(type = Type.SERVLET)
@ConditionalOnClass({ Servlet.class, DispatcherServlet.class, WebMvcConfigurer.class })
@ConditionalOnMissingBean(WebMvcConfigurationSupport.class)
@AutoConfigureOrder(Ordered.HIGHEST_PRECEDENCE + 10)
@AutoConfigureAfter({ DispatcherServletAutoConfiguration.class, TaskExecutionAutoConfiguration.class,
		ValidationAutoConfiguration.class })
public class WebMvcAutoConfiguration {}
```

...........都讲了些啥.....以后再说吧。。。。。。

## 4. 视图解析与模板引擎

视图解析：SpringBoot默认不支持 JSP，需要引入第三方模板引擎技术实现页面渲染。

模板引擎：Thymyleaf

