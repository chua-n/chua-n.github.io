## 1. Eureka注册中心

<img src="https://chua-n.gitee.io/blog-images/notebooks/JavaWeb/SpringCloud/image-20211128181508456.png" alt="image-20211128181508456" style="zoom:33%;" />

Eureka的作用：

- 服务消费者该如何获取服务提供者的地址信息？
    - 服务提供者启动时向Eureka注册自己的信息
    - Eureka保存这些信息
    - 消费者根据服务名称向Eureka拉取提供者信息
- 如果有多个服务提供者，消费者该如何选择？
    - 服务消费者利用负载均衡算法，从服务列表中挑选一个
- 消费者如何得知服务提供者的健康状态？
    - 服务提供者会每隔30秒向EurekaServer发送心跳请求，报告健康状态
    - Eureka会更新记录服务列表信息，心跳不正常会被剔除
    - 消费者就可以拉取到最新的信息

在Eureka架构中，微服务角色有两类：

- EurekaServer：服务端，注册中心
    - 记录服务信息
    - 心跳监控
- EurekaClient：客户端
    - Provider：服务提供者，例如案例中的user-service
        - 注册自己的信息到EurekaServer
        - 每隔30秒向EurekaServer发送心跳
    - Consumer：服务消费者，例如案例中的order-service
        - 根据服务名称从EurekaServer拉取服务列表
        - 基于服务列表做负载均衡，选中一个微服务后发起远程调用

## 2. 搭建EurekaServer

1. 创建项目，引入`spring-cloud-starter-netflix-eureka-server`的依赖：

    ```xml
    <dependency>
    	<groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-netflix-eureka-server</artifactId>
    </dependency>
    ```

2. 编写启动类，添加`@EnableEurekaServer`注解

    ```java
    @EnableEurekaServer
    @SpringBootApplication
    public class EurekaApplication {
        public static void main(String[] args) {
            SpringApplication.run(EurekaApplication.class, args);
        }
    }
    ```

3. 添加application.yml文件，配置如下：

    ```yml
    server:
      port: 10086 # 服务端口
    spring:
      application:
        name: eurekaserver # eureka的服务名称
    eureka:
      client:
        service-url: # eureka的地址信息
          defaultZone: http://localhost:10086/eureka/
    ```

## 2. 服务注册

将user-service服务注册到EurekaServer步骤如下：

1. 在user-service项目引入spring-cloud-starter-netflix-eureka-client的依赖：

    ```xml
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
    </dependency>
    ```

2. 在application.yml文件，编写下面的配置：

    ```yaml
    spring:
      application:
        name: userservice
    eureka:
      client:
        service-url:
          defaultZone: http://127.0.0.1:10086/eureka/
    ```

<img src="https://chua-n.gitee.io/blog-images/notebooks/JavaWeb/SpringCloud/image-20211128183720269.png" alt="image-20211128183720269" style="zoom:25%;" />

可以这样模拟配置同一个服务的多个实例：

<img src="https://chua-n.gitee.io/blog-images/notebooks/JavaWeb/SpringCloud/image-20211128183805641.png" alt="image-20211128183805641" style="zoom:30%;" />

<img src="https://chua-n.gitee.io/blog-images/notebooks/JavaWeb/SpringCloud/image-20211128183951686.png" alt="image-20211128183951686" style="zoom:33%;" />

## 3. 服务发现

服务拉取是基于服务名称获取服务列表，然后再对服务列表做负载均衡。

在order-service中完成服务拉取：

1. 修改`OrderService`的代码，修改访问的路径，用服务名代替ip、端口

    ```java
    String url = "http://userservice/user/" + order.getUserId();
    ```

    ```java
    public Order queryOrderById(Long orderId) {
        // 1. 查询订单
        Order order = orderMapper.findById(orderId);
        // 2. 利用RestTemplate发起http请求，查询用户
        // 2.1. url路径
        String url = "http://userservice/user/" + order.getUserId();
        // 2.2. 发送http请求，实现远程调用
        User user = restTemplate.getForObject(url, User.class);
        // 3. 封装user到Order
        order.setUser(user);
        // 4. 返回
        return order;
    }
    ```

2. 在order-service项目的启动类`OrderApplication`中的`RestTemplate`添加负载均衡注解：

    ```java
    @Bean
    @LoadBalanced
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
    ```

