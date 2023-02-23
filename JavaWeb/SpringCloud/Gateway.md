## 1. 前言

为什么需要网关？

<img src="https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/SpringCloud/IMG_0953.JPG" alt="IMG_0953" style="zoom:40%;" />

- 对用户请求做身份认证、权限校验
- 将用户请求路由到微服务，并实现负载均衡
- 对用户请求做限流

在SpringCloud中网关的实现包括两种：

- gateway
- zuul

> `Zuul`是基于Servlet的实现，属于阻塞式编程，而`SpringCloudGateway`是基于Spring5中提供的WebFlux，属性于响应式编程，具备更好的性能。

## 2. gateway快速入门

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
    ```

## 3. 路由断言

我们在配置文件中写的断言规则只是字符串，这些字符串会被Predicate Factory读取并处理，转变为路由判断的条件。例如，`Path=/user/**`是按照路径匹配，这个规则是由`org.springframework.cloud.gateway.handler.predicate.PathRoutePredicateFactory`类来处理的，像这样的断言工厂（Route Predicate Factory）在`SpringCloudGateway`中还有十几个。

<img src="https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/SpringCloud/IMG_0963.JPG" alt="IMG_0963" style="zoom:33%;" />

## 4. 过滤器

`GatewayFilter`是网关中提供的一种过滤器，可以对进入网关的请求和微服务返回的响应做处理：

<img src="https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/SpringCloud/IMG_0964.JPG" alt="IMG_0964" style="zoom:45%;" />

Spring提供了31种不同的路由过滤器工厂`GatewayFilterFactory`，例如：

|          名称          |            说明            |
| :--------------------: | :------------------------: |
|   `AddRequestHeader`   |  给当前请求添加一个请求头  |
| `RemoveRequestHeader`  |   移除请求中的一个请求头   |
|  `AddResponseHeader`   | 给响应结果中添加一个响应头 |
| `RemoveResponseHeader` | 从响应结果中移除一个响应头 |
|  `RequestRateLimiter`  |       限制请求的流量       |
|          ...           |           ......           |

<img src="https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/SpringCloud/IMG_0966.JPG" alt="IMG_0966" style="zoom:33%;" />

### 案例

假设我们需要给所有进入`userservice`的请求添加一个请求头：`Truth=itcast is freaking awesome!`，其实现方式是，在`gateway`中修改`application.yml`文件，给`userservice`的路由添加过滤器：

<img src="https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/SpringCloud/IMG_0967.JPG" alt="IMG_0967" style="zoom:50%;" />

### 默认过滤器

如果要对所有的路由都生效，可以将过滤器工厂写到default下，如：

<img src="https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/SpringCloud/IMG_0968.JPG" alt="IMG_0968" style="zoom:45%;" />

### 全局过滤器

全局过滤器（`GlobalFilter`）的作用也是处理一切进入网关的请求和微服务响应，与`GatewayFilter`的作用一样。

区别在于`GatewayFilter`通过配置定义，处理逻辑是固定的，而`GlobalFilter`的逻辑可以自定义，需要自己写代码实现，定义方式是实现`GlobalFilter`接口：

<img src="https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/SpringCloud/IMG_0969.JPG" alt="IMG_0969" style="zoom:45%;" />

实现全局过滤器的步骤：

- 实现`GlobalFilter`接口
- 添加`@Order`注解或实现`Ordered`接口
- 编写处理逻辑

> 附：<img src="https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/SpringCloud/IMG_0973.jpg" alt="IMG_0973" style="zoom:40%;" />

#### 案例：定义全局过滤器，拦截并判断用户身份

需求：定义全局过滤器，拦截请求，判断请求的参数是否满足下面条件，如果同时满足则放行，否则拦截。

- 参数中是否有authorization
- authorization参数值是否为admin

步骤：

1. 自定义过滤器——自定义类，实现`GatewayFilter`接口，添加`@Order`注解：

    <img src="https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/SpringCloud/IMG_0971.JPG" alt="IMG_0971" style="zoom:45%;" />

2. ...

### 过滤器执行顺序

- 每一个过滤器都必须指定一个int类型的order值，order值越小，优行级越高，执行顺序越靠前

    > - `GlobalFilter`通过实现`Ordered`接口，或者添加`@Order`注解来指定order值，由我们自己指定
    > - 路由过滤器和`defaultFilter`的order由Spring指定，默认是按照声明顺序从1递增

- 当过滤器的order值一样时，会按照`defaultFilter > 局部路由过滤器 > GlobalFilter`的顺序执行

可参考下面几个类的源码来看：

<img src="https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/SpringCloud/IMG_0974.JPG" alt="IMG_0974" style="zoom:40%;" />

## 5. 跨域问题

跨域：域名不一致就是跨域，主要包括：

- 域名不同：`www.taobao.com` 和 `www.taobao.org` 和 `www.jd.com` 和 `miaosha.jd.com`
- 域名相同，端口不同：`localhost:8080` 和 `localhost:8081`

跨域问题：浏览器禁止请求的发起者与服务端发生跨域ajax请求，请求被浏览器拦截的问题。

网关的解决方案：CORS，只需简单配置即可实现：

<img src="https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/SpringCloud/image-20211222175152188.png" alt="image-20211222175152188" style="zoom:35%;" />

CORS跨域要配置的参数包括哪几个？

- 允许哪些域名跨域
- 允许哪些请求头
- 允许哪些请求方式
- 是否允许使用cookie
- 有效期是多久