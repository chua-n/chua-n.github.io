> HTTP客户端`Feign`。

## 1. 前言

### `RestTemplate`方式调用存在的问题

对于之前利用`RestTemplate`发起远程调用的代码：

```java
String url = "http://userservice/user/" + order.getUserId();
User user = restTemplate.getForObject(url, User.class);
```

其存在以下问题：

- 代码可读性差，编程体验不统一
- 参数复杂，URL难以维护

### Feign简介

Feign就是一个声明式的HTTP客户端，官方地址https://github.com/OpenFeign/feign，其作用就是帮助我们优雅的实现HTTP请求的发送，解决上述问题。

<img src="../../resources/images/notebooks/JavaWeb/SpringCloud/IMG_0931.JPG" alt="IMG_0931" style="zoom:33%;" />

## 2. 定义和使用Feign客户端

使用Feign的步骤如下：

- 引入依赖：

    ```xml
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-openfeign</artifactId>
    </dependency>
    ```

- 在order-service的启动类添加注解开启Feign的功能：

    ```java
    @EnableFeignClients
    @MapperScan("cn.itcast.order.mapper")
    @SpringBootApplication
    public class OrderApplication {
        public static void main(String[] args) {
            SpringApplication.run(OrderApplication.class, args);
        }
    }
    ```

- 编写Feign客户端：

    ```java
    @FeignClient("useruservice")
    public interface UserClient {
        @GetMapping("/user/{id}")
        User findById(@PathVariable("id") Long id);
    }
    ```

    > 这里主要是基于SpringMVC的注解来声明远程调用的信息，比如
    >
    > - 服务名称：userservice
    > - 请求方式：GET
    > - 请求路径：/user/{id}
    > - 请求参数：Long id
    > - 返回值类型：User

- 用Feign客户端代替`RestTemplate`

    ```java
    @Autowired
    private UserClient userClient;
    
    public Order queryOrderById(Long orderId) {
        // 1. 查询清单
        Order order = orderMapper.findById(orderId);
        // 2. 利用Feign发起HTTP请求，查询用户
        User user = userClient.findById(order.getUserId());
        // 3. 封装user到Order
        order.setUser(user);
        // 4. 返回
        return order;
    }
    ```

## 3. 自定义Feign的配置

Feign运行自定义配置来覆盖默认配置，可以修改的配置如下（一般我们需要配置的就是日志级别）：

|         类型          |       作用       |                          说明                          |
| :-------------------: | :--------------: | :----------------------------------------------------: |
| `feign.Logger.Level`  |   修改日志级别   |     包含4种不同的级别：NONE, BASIC, HEADERS, FULL      |
| `feign.codec.Decoder` | 响应结果的解析器 | HTTP远程调用的结果做解析，例如解析JSON字符串为Java对象 |
| `feign.codec.Encoder` |   请求参数编码   |          将请求参数编码，便于通过HTTP请求发送          |
|   `feign.Contract`    |  支持的注解格式  |                 默认是SpringMVC的注解                  |
|    `feign.Retryer`    |   失败重试机制   | 请求失败的重试机制，默认是没有，不过会使用Ribbon的重试 |

配置Feign日志的方式：

- 方式一：配置文件方式

    - 全局生效：

        ```yml
        feign:
          client:
            config:
              default: # 这里用default就是全局配置，如果是写服务名称，则是针对某个微服务的配置
                loggerLevel: FULL # 日志级别
        ```

    - 局部生效：

        ```yml
        feign:
          client:
            config:
              userservice: # 这里用default就是全局配置，如果是写服务名称，则是针对某个微服务的配置
                loggerLevel: FULL # 日志级别
        ```

- 方式二：代码方式。需先声明一个Bean：

    ```java
    public class FeignClientConfiguration {
        @Bean
        public Logger.Level feignLogLevel() {
            return Logger.Level.BASIC;
        }
    }
    ```

    - 全局配置——放到`@EnableFeignClients`注解中

        ```java
        @EnableFeignClients(defaultConfiguration = FeignClientConfiguration.class)
        ```

    - 局部配置——放到`@FeignClient`注解中：

        ```java
        @FeignClient(value = "userservice", configuration = FeignClientConfiguration.class)
        ```

## 4. Feign的性能优化

Feign底层的客户端实现：

- `URLConnection`: 默认实现，不支持连接池
- `Apache HttpClient`: 支持连接池
- `OKHttp`: 支持连接池

因此优化Feign的性能主要包括：

- 使用连接池替代默认的`URLConnection`

    - 如Feign添加`HttpClient`的支持：

        - 引入依赖：

            ```xml
            <dependency>
                <groupId>io.github.openfeign</groupId>
                <artifactId>feign-httpclient</artifactId>
            </dependency>
            ```

        - 配置连接池：

            ```yml
            feign:
              client:
                config:
                  default: # default全局的配置
                    loggerLevel: FULL # 日志级别，BASIC就是基本的请求和响应消息
              httpclient:
                enabled: true # 开启feign对HttpClient的支持
                max-connections: 200 # 最大的连接数
                max-connections-per-route: 50 # 每个路径的最大连接数
            ```

- 日志级别，最好用`basic`或`none`

## 5. Feign的最佳实践

### 5.1 方式一：继承

此法给消费者的`FeignClient`和提供者的`Controller`定义统一的父接口作为标准，其特点是：

- 服务紧耦合
- 父接口参数列表中的映射不会被继承

<img src="../../resources/images/notebooks/JavaWeb/SpringCloud/image-20211222154441762.png" alt="image-20211222154441762" style="zoom:33%;" />

### 5.2 方式二：抽取

将`FeignClient`抽取为独立模块，并且把接口有关的POJO、默认的Feign配置都放到这个模块中，提供给所有的消费者使用：

<img src="../../resources/images/notebooks/JavaWeb/SpringCloud/IMG_0948.JPG" alt="IMG_0948" style="zoom:40%;" />

抽取`FeignClient`的步骤：

1. 首先创建一个module，命名为feign-api，然后引入feign的starter依赖；
2. 将order-service中编写的UserClient, User, DefaultFeignConfiguration都复制到feign-api项目中；
3. 在order-service中引入feign-api的依赖；
4. 修改order-service中的所有与上述三个组件有关的import部分，改成导入feign-api中的包；
5. 重启测试。

当定义的`FeignClient`不在`SpringBootApplication`的扫描包范围时，这些`FeignClient`无法使用，可通过如下两种方式解决：

- 方式一：指定`FeignClient`所在包

    ```java
    @EnableFeignClients(basePackages = "cn.itcast.feign.clients")
    ```

- 方式二：指定`FeignClient`字节码

    ```java
    @EnableFeignClients(clients = {UserClient.class})
    ```

