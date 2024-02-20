---
title: Gateway
---

## 1. 前言

对于微服务集群内部而言，服务注册与发现机制已经解决了服务之间的相互调用问题。而对于微服务集群外部呢？比如终端的用户，其到目前为止，要向一个微服务发起请求，仍然需要直接面向该服务的 `ip:port` 信息，面对千千万万个微服务，这无疑又对用户造成了巨大的困扰。因此，有必要为外部的客户端提供一个统一的访问入口，避免客户端直接与庞大的后台微服务进行接触，从而让客户端的访问更简单。

<img src="https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/SpringCloud/IMG_0953.JPG" alt="IMG_0953" style="zoom:40%;" />

概括而言，网关发挥了如下作用：

- 对接客户端请求，将其路由到对应微服务，并实现负载均衡
- 对用户请求做身份认证、权限校验
- 对用户请求做限流

在 Spring Cloud Gateway 的网关实现基于 Spring5 中提供的 WebFlux，属性于响应式编程，具备更好的性能。

### 快速入门

搭建网关服务的步骤：

<img src="https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/SpringCloud/IMG_0960.JPG" alt="IMG_0960" style="zoom:50%;" />

1. 创建新的module，引入`SpringCloudGateway`的依赖和`nacos`的服务发现依赖：

   ```xml
   <!--网关依赖-->
   <dependency>
       <groupId>org.springframework.cloud</groupId>
       <artifactId>spring-cloud-starter-gateway</artifactId>
   </dependency>
   <!--nacos服务发现依赖-->
   <dependency>
       <groupId>com.alibaba.cloud</groupId>
       <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
   </dependency>
   ```

2. 配置application.yml，包括服务基本信息、`nacos`地址、路由：

   > 其中路由配置包括：
   >
   > - 路由id：路由的唯一标识
   > - 路由目标（uri）：路由的目标地址，http代码固定地址，lb代表根据服务名负载均衡
   > - 路由断言（predicates）：判断路由的规则
   > - 路由过滤器（filters）；对请求或响应做处理

   ```yml
   server:
     port: 10010 # 网关端口
   spring:
     application:
       name: gateway # 服务名称
     cloud:
       nacos:
         server-addr: localhost:8848 # nacos地址
       gateway:
         routes: # 网关路由配置
           - id: user-service # 路由id，自定义，只要唯一即可
             # uri: http://127.0.0.1:8081 # 路由的目标地址 http就是固定地址
             uri: lb://userservice  # 路由的目标地址 lb就是负载均衡，后面跟服务名称
             predicates: # 路由断言，也就是判断请求是否符合路由规则的条件
               - Path=/user/** # 这个就是按照路径匹配，只要以/user/开头就符合要求
           - id: order-service
             uri: lb://orderservice
             predicates:
               - Path=/order/**
           - id: after_route # 这个例子从Spring Cloud Gateway官方文档中挪过来的
             uri: https://example.org
             predicates:
               - Cookie=mycookie,mycookievalue
   ```

对于一个包含了`spring-cloud-starter-gateway`依赖的项目，如果不想启用网关功能，可以设置`spring.cloud.gateway.enabled=false`。

## 2. Gateway执行原理

The following diagram provides a high-level overview of how Spring Cloud Gateway works:

![Spring Cloud Gateway Diagram](https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/SpringCloud/spring_cloud_gateway_diagram.png)

- Clients make requests to Spring Cloud Gateway.

- If the Gateway Handler Mapping determines that a request matches a route, it is sent to the Gateway Web Handler.

- This handler runs the request through a filter chain that is specific to the request.

  > The reason the filters are divided by the dotted line is that filters can run logic both before and after the proxy request is sent. All “pre” filter logic is executed. Then the proxy request is made. After the proxy request is made, the “post” filter logic is run.

Spring Cloud Gateway 的术语：

- **Route**: The basic building block of the gateway. It is defined by an ID, a destination URI, a collection of predicates, and a collection of filters. A route is matched if the aggregate predicate is true.
- **Predicate**: This is a [Java 8 Function Predicate](https://docs.oracle.com/javase/8/docs/api/java/util/function/Predicate.html). The input type is a [Spring Framework `ServerWebExchange`](https://docs.spring.io/spring/docs/5.0.x/javadoc-api/org/springframework/web/server/ServerWebExchange.html). This lets you match on anything from the HTTP request, such as headers or parameters.
- **Filter**: These are instances of [`GatewayFilter`](https://github.com/spring-cloud/spring-cloud-gateway/tree/main/spring-cloud-gateway-server/src/main/java/org/springframework/cloud/gateway/filter/GatewayFilter.java) that have been constructed with a specific factory. Here, you can modify requests and responses before or after sending the downstream request.

## 3. 路由断言

我们在配置文件中写的断言规则只是字符串，这些字符串会被 Route Predicate Factory （路由断言工厂）读取并处理，转变为路由判断的条件。

例如，`Path=/user/**`是按照路径匹配，这个规则是由`org.springframework.cloud.gateway.handler.predicate.PathRoutePredicateFactory`类来处理的，像这样的路由断言工厂在 Spring Cloud Gateway 中内置了十几个，可以从[官方文档](https://docs.spring.io/spring-cloud-gateway/docs/3.1.6/reference/html/#gateway-request-predicates-factories)中一窥其貌：

<img src="https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/SpringCloud/IMG_0963.JPG" alt="IMG_0963" style="zoom:33%;" />

## 4. 路由过滤器

> Route filters allow the modification of the incoming HTTP request or outgoing HTTP response in some manner. Route filters are scoped to a particular route. Spring Cloud Gateway includes many built-in GatewayFilter Factories.

### 4.1 `GatewayFilter`

`GatewayFilter`是网关中提供的一种过滤器，可以对进入网关的请求和微服务返回的响应做处理：

<img src="https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/SpringCloud/IMG_0964.JPG" alt="IMG_0964" style="zoom:45%;" />

类似于路由断言工厂，Spring 提供了30多种不同的路由过滤器工厂**`GatewayFilter` Factory**，例如：

|          名称          |             说明             |
| :--------------------: | :--------------------------: |
|   `AddRequestHeader`   |   给当前请求添加一个请求头   |
| `RemoveRequestHeader`  |    移除请求中的一个请求头    |
|  `AddResponseHeader`   |  给响应结果中添加一个响应头  |
| `RemoveResponseHeader` |  从响应结果中移除一个响应头  |
|  `RequestRateLimiter`  |        限制请求的流量        |
|          ...           |            ......            |
|    `DefaultFilters`    | 默认过滤器（对所有请求生效） |

<img src="https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/SpringCloud/IMG_0966.JPG" alt="IMG_0966" style="zoom:33%;" />

#### 案例

假设我们需要给所有进入`userservice`的请求添加一个请求头：`Truth=itcast is freaking awesome!`，其实现方式是，在`gateway`中修改`application.yml`文件，给`userservice`的路由添加过滤器：

<img src="https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/SpringCloud/IMG_0967.JPG" alt="IMG_0967" style="zoom:50%;" />

#### 默认过滤器

如果要对所有的路由都生效，可以将过滤器工厂写到 `default-filters`下，这个属性接收一个过滤器数组。如：

<img src="https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/SpringCloud/IMG_0968.JPG" alt="IMG_0968" style="zoom:45%;" />

### 4.2 `GlobalFilter`

> When a request matches a route, the filtering web handler adds all instances of `GlobalFilter` and all route-specific instances of `GatewayFilter` to a filter chain. This combined filter chain is sorted by the `org.springframework.core.Ordered` interface, which you can set by implementing the `getOrder()` method.

全局过滤器（`GlobalFilter`）的作用也是处理一切进入网关的请求和微服务响应，与`GatewayFilter`的作用一样。区别在于，`GatewayFilter`通过配置定义，处理逻辑是固定的，而`GlobalFilter`的逻辑可以自定义，需要自己写代码实现，定义方式是实现`GlobalFilter`接口：

<img src="https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/SpringCloud/IMG_0969.JPG" alt="IMG_0969" style="zoom:45%;" />

实现全局过滤器的步骤：

- 实现`GlobalFilter`接口
- 添加`@Order`注解或实现`Ordered`接口
- 编写处理逻辑

<img src="https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/SpringCloud/IMG_0973.jpg" alt="IMG_0973" style="zoom:40%;" />

#### 案例

> 定义全局过滤器，拦截并判断用户身份。

需求：定义全局过滤器，拦截请求，判断请求的参数是否满足下面条件，如果同时满足则放行，否则拦截。

- 参数中是否有`authorization`
- `authorization`参数值是否为`admin`

步骤：

1. 自定义过滤器——自定义类，实现`GatewayFilter`接口，添加`@Order`注解：

    <img src="https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/SpringCloud/IMG_0971.JPG" alt="IMG_0971" style="zoom:45%;" />

2. ...

### 4.3 过滤器执行顺序

过滤器通过 Spring 的 `Ordered` 接口来决定自己的执行顺序：

- `GatewayFilter`的order由Spring指定，默认是按照声明顺序从1递增；
- `GlobalFilter`通过手动实现`Ordered`接口，或者添加`@Order`注解来指定order值；
- 当过滤器的order值一样时，会按照`defaultFilter > GatewayFilter > GlobalFilter`的顺序执行。

可参考下面几个类的源码来看：

<img src="https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/SpringCloud/IMG_0974.JPG" alt="IMG_0974" style="zoom:40%;" />

## 5. 跨域问题

网关对CORS的解决方案，只需简单配置即可实现：

<img src="https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/SpringCloud/image-20211222175152188.png" alt="image-20211222175152188" style="zoom:35%;" />

CORS跨域要配置的参数包括哪几个？

- 允许哪些域名跨域
- 允许哪些请求头
- 允许哪些请求方式
- 是否允许使用cookie
- 有效期是多久