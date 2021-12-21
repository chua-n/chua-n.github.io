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

![IMG_0931](../../resources/images/notebooks/JavaWeb/SpringCloud/IMG_0931.JPG)

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

