## 1. 服务拆分注意事项

- 不同微服务，不要重复开发相同业务
- 微服务数据独立，不要访问其它微服务的数据库
- 微服务可以将自己的业务暴露为接口，供其它微服务调用

<img src="https://chua-n.gitee.io/blog-images/notebooks/JavaWeb/SpringCloud/image-20211128174921800.png" alt="image-20211128174921800" style="zoom:25%;" />

微服务远程调用：

<img src="https://chua-n.gitee.io/blog-images/notebooks/JavaWeb/SpringCloud/image-20211128175731514.png" alt="image-20211128175731514" style="zoom:25%;" />

远程调用方式分析——根源需要在Java代码中直接发起HTTP请求：

<img src="https://chua-n.gitee.io/blog-images/notebooks/JavaWeb/SpringCloud/image-20211128175944257.png" alt="image-20211128175944257" style="zoom:25%;" />

远程调用实现——基于`RestTemplate`发起的HTTP请求实现远程调用，由于HTTP请求做远程调用是与语言无关的调用，只要知道对方的IP、端口、接口路径、请求参数即可。

1. 注册`RestTemplate`——在order-service的`OrderApplication`中注册`RestTemplate`：

    ```java
    @MapperScan("cn.itcast.order.mapper")
    @SpringBootApplication
    public class OrderApplication {
        public static void main(String[] args) {
            SpringApplication.run(OrderApplication.class, args);
        }
        
        @Bean
        public RestTemplate restTemplate() {
            return new RestTemplate();
        }
    }
    ```

2. 服务远程调用`RestTemplate`——修改order-servic中的`OrderService`的`queryOrderById`方法：

    ```java
    @Service
    public class OrderService {
        @Autowired
        private RestTemplate restTemplate;
        
        public Order queryOrderById(Long orderId) {
            // 1. 查询订单
            Order order = orderMapper.findById(orderId);
            // 2. 查询用户
            String url = "http://localhost:8081/user/" + order.getUserId();
            User user = restTemplate.getForObject(url, User.class);
            // 3. 封装user信息
            order.setUser(user);
            // 4. 返回
            return order;
        }
    }
    ```

## 2. 微服务远程调用

### 2.1 提供者与消费者

- 服务提供者：一次业务中，被其它微服务调用的服务（提供接口给其它微服务）。
- 服务消费者：一次业务中，调用其它微服务的服务（调用其他微服务提供的接口）。

> 实际上，一个服务既可以是提供者，又可以是消费者，这是一种相对的概念。

