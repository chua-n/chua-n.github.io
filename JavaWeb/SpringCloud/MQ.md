## 1. 背景

### 1.1 同步调用

同步调用的优点：时效性强，可以立即得到结果。

同步调用的问题：

- 耦合度高：每次加入新的需求，都要修改原来的代码
- 性能下降：调用者需要等待服务提供者响应，如果调用链过长则响应时间等于每次调用的时间之和
- 资源浪费：调用链中的每个服务都在等待响应过程中，不能释放请求占用的资源，高并发场景下会极度浪费系统资源
- 级联失败：如果服务提供者出现问题，所有调用方都会跟着出问题，如同多米诺骨牌一样，迅速导致整个微服务群故障

微服务间基于Feign的调用就属于同步方式：

<img src="https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/SpringCloud/IMG_1030.JPG" alt="IMG_1030" style="zoom:50%;" />

### 1.2 异步调用

异步调用常见实现就是事件驱动模式：

<img src="https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/SpringCloud/image-20211225210725247.png" alt="image-20211225210725247" style="zoom:50%;" />

异步调用的优势：

- 耦合度低

- 吞吐量提升

- 故障隔离

- 流量削峰

    > <img src="https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/SpringCloud/IMG_1034.JPG" alt="IMG_1034" style="zoom:40%;" />

异步通信的缺点：

- 依赖于Broker的可靠性、安全性、吞吐能力
- 结构变复杂，业务没有明显的流程线，不好追踪管理

### 1.3 MQ

MQ（Message Queue），即消息队列，字面来看就是存放消息的队列，也就是事件驱动架构中的Broker。

<img src="https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/SpringCloud/image-20211225211328779.png" alt="image-20211225211328779" style="zoom:66%;" />

## 2. RabbitMQ

### 2.1 RabbitMQ概述

**RabbitMQ**是基于Erlang语言开发的开源消息通信中间件，官网地址：https://www.rabbitmq.com/ 。

RabbitMQ中的几个概念：

- `channel`: 操作MQ的工具
- `exchange`: 路由消息到队列中
- `queue`: 缓存消息
- `virtual host`: 虚拟主机，是对queue, exchange等资源的逻辑分组

<img src="https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/SpringCloud/image-20211225211515013.png" alt="image-20211225211515013" style="zoom:67%;" />

### 2.2 常见消息模型

MQ的官方文档中给出了5个MQ的Demo示例，对应了几种不同的用法：

1. 基本消息队列（BasicQueue）

    ![image-20211225212054633](https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/SpringCloud/image-20211225212054633.png)

2. 工作消息队列（WorkQueue）

    ![image-20211225212101443](https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/SpringCloud/image-20211225212101443.png)

3. 发布订阅（Publish/Subscribe）——根据交换机类型不同分为三种：

    1. Fanout Exchange

        ![image-20211225212115648](https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/SpringCloud/image-20211225212115648.png)

    2. Direct Exchange

        ![image-20211225212123109](https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/SpringCloud/image-20211225212123109.png)

    3. Topic Exchange

        ![image-20211225212130816](https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/SpringCloud/image-20211225212130816.png)

### 2.3 快速入门案例

HelloWorld案例：基于最基础的消息队列模型来实现，只包括三个角色：

<img src="https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/SpringCloud/image-20211225212311595.png" alt="image-20211225212311595" style="zoom:66%;" />

- publisher：消息发布者，将消息发送到队列queue
- queue：消息队列，负责接受并缓存消息
- consumer：订阅队列，处理队列中的消息

基本消息队列的消息发送流程：

1. 建立connection
2. 创建channel
3. 利用channel声明队列
4. 利用channel向队列发送消息

基本消息队列的消息接收流程：

1. 建立connection
2. 创建channel
3. 利用channel声明队列
4. 定义consumer的消费行为`handleDelivery()`
5. 利用channel将消费者与队列绑定

## 3. SpringAMQP

> SpringAMQP的官方地址：https://spring.io/projects/spring-amqp

**AMQP**：Advanced Message Queuing Protocol，是用于在应用程序之间传递业务消息的开放标准。该协议与语言和平台无关，更符合微服务中独立性的要求。

**Spring AMQP**：是基于AMQP协议定义的一套API规范，提供了模板来发送和接收消息。其包含两部分，其中spring-amqp是基础抽象，spring-rabbit是底层的默认实现。

### 3.1 Basic Queue 简单队列模型

利用SpringAMQP实现HelloWorld中的基础消息队列功能的流程：

- 在父工程中引入`spring-amqp`的依赖（因为publisher和consumer服务都需要amqp依赖，因此这里把依赖直接放到父工程中）

    ```xml
    <!--AMQP依赖，包含RabbitMQ-->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-amqp</artifactId>
    </dependency>
    ```

- 在publisher服务中利用RabbitTemplate发送消息到simple.queue这个队列

    - 在publisher服务中编写application.yml，添加mq连接信息：

        ```yml
        spring:
            rabbitmq:
                host: 192.168.150.101 # 主机名
                port: 5672 # 端口
                virtual-host: / # 虚拟主机
                username: itcast # 用户名
                password: 123321 # 密码
        ```

    - 在publisher服务中新建一个测试类，编写测试方法：

        ```java
        @RunWith(SpringRunner.class)
        @SpringBootTest
        public class SpringAmqpTest {
            @Autowired
            private RabbitTemplate rabbitTemplate;
            
            @Test
            public void testSimpleQueue() {
                String queueName = "simple.queue";
                String message = "hello, spring amqp!";
                rabbitTemplate.convertAndSend(queueName, message);
            }
        }
        ```

- 在consumer服务中编写消费逻辑，绑定simple.queue这个队列

    - 在consumer服务中编写application.yml，添加mq连接信息：

        ```yml
        spring:
          rabbitmq:
            host: 192.168.150.101 # 主机名
            port: 5672 # 端口
            virtual-host: / # 虚拟主机
            username: itcast # 用户名
            password: 123321 # 密码
        ```

    - 在consumer服务中新建一个类，编写消费逻辑：

        ```java
        @Component
        public class SpringRabbitListener {
            @RabbitListener(queues = "simple.queue")
            public void listenSimpleQueueMessage(String msg) throws InterruptedException {
                System.out.println("spring 消费者接收到消息 ：【" + msg + "】");
            }
        }
        ```

        > 注意：消息一旦消费就会从队列中删除，RabbitMQ没有消息回溯功能。

### 3.2 Work Queue 工作队列模型

Work Queue，工作队列，可以提高消息处理速度，避免队列消息堆积。

<img src="https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/SpringCloud/image-20211225214534320.png" alt="image-20211225214534320" style="zoom:67%;" />

- 多个消费者绑定到一个队列，同一条消息只会被一个消费者处理
- 通过设置prefetch来控制消费者预取的消息数量

可以进行消费预取限制——修改application.yml文件，设置preFetch的值，可以控制预取消息的上限（默认为无限？）：

```yml
spring:
  rabbitmq:
    host: 192.168.150.101 # 主机名
    port: 5672 # 端口
    virtual-host: / # 虚拟主机
    username: itcast # 用户名
    password: 123321 # 密码
    listener:
      simple:
        perfetch: 1 # 每次只能获取一条消息，处理完成才能获取下一个消息
```

### 3.3 发布-订阅模型

发布订阅模式与之前案例的区别就是允许将同一消息发给多个消费者。实现方式是加入了exchange（交换机），常见的exchange类型包括：

> 注意：exchange负责消息路由，而不是存储，路由失败则消息丢失。

- `Fanout`：广播
- `Direct`：路由
- `Topic`：话题

<img src="https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/SpringCloud/image-20211225215154665.png" alt="image-20211225215154665" style="zoom:67%;" />

#### 3.3.1 Fanout Exchange

Fanout Exchange 会将接收到的消息广播到每一个跟其绑定的queue：

<img src="https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/SpringCloud/image-20211225215409556.png" alt="image-20211225215409556" style="zoom:60%;" />

利用SpringAMQP演示FanoutExchange的使用：

> <img src="https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/SpringCloud/image-20211225215603233.png" alt="image-20211225215603233" style="zoom:50%;" />

- 在consumer服务中，利用代码声明交换机（`Exchange`）、队列（`Queue`），并将两者绑定（`Binding`）：

    ```java
    @Configuration
    public class FanoutConfig {
        // 声明FanoutExchange交换机
        @Bean
        public FanoutExchange fanoutExchange() {
            return new FanoutExchange("itcast.fanout");
        }
        
        // 声明第1个队列
        @Bean
        public Queue fanoutQueue1() {
            return new Queue("fanout.queue1");
        }
        
        // 绑定队列1和交换机
        @Bean
        public Binding bindingQueue1(Queue fanoutQueue1, FanoutExchange fanoutExchange) {
            return BindingBuilder.bind(fanoutQueue1).to(fanoutExchange);
        }
        
        // ... 略，以相同方式声明第2个队列，并完成绑定
    }
    ```

    > 类关系图：
    >
    > <img src="https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/SpringCloud/image-20211225215818506.png" alt="image-20211225215818506" style="zoom:60%;" />

- 在consumer服务中，编写两个消费者方法，分别监听fanout.queue1和fanout.queue2：

    ```java
    @RabbitListener(queues = "fanout.queue1")
    public void listenFanoutQueue1(String msg) {
        System.out.println("消费者1接收到Fanout消息：【" + msg + "】");
    }
    
    @RabbitListener(queues = "fanout.queue2")
    public void listenFanoutQueue2(String msg) {
        System.out.println("消费者2接收到Fanout消息：【" + msg + "】");
    }
    ```

- 在publisher服务中编写测试方法，向itcast.fanout发送消息：

    ```java
    @Test
    public void testFanoutExchange() {
        // 队列名称
        String exchangeName = "itcast.fanout";
        // 消息
        String message = "hello, everyone!";
        // 发送消息，参数分别是：交互机名称、RoutingKey（暂为空）、消息
        rabbitTemplate.convertAndSend(exchangeName, "", message);
    }
    ```

#### 3.3.2 Direct Exchange

Direct Exchange会将接收到的消息根据规则路由到指定的Queue，因此称为**路由模式（routes）**，其特点是：

- 每一个`Queue`都与`Exchange`设置一个`BindingKey`
- 发布者发送消息时，指定消息的`RoutingKey`
- `Exchange`将消息路由到`BindingKey`与消息`RoutingKey`一致的队列

<img src="https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/SpringCloud/image-20211225221007411.png" alt="image-20211225221007411" style="zoom:50%;" />

利用SpringAMQP演示Direct Exchange的使用，实现思路如下：

<img src="https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/SpringCloud/image-20211225221318200.png" alt="image-20211225221318200" style="zoom:50%;" />

1. 在consumer服务中，编写两个消费者方法，分别监听direct.queue1和direct.queue2，并使用`@RabbitListener`声明`Exchange`、`Queue`、`RoutingKey`

    ```java
    @RabbitListener(bindings = @QueueBinding(
        value = @Queue(name = "direct.queue1"),
        exchange = @Exchange(name = "itcast.direct", type = ExchangeTypes.DIRECT),
        key = {"red", "blue"}
    ))
    public void listenDirectQueue1(String msg) {
        System.out.println("消费者1接收到Direct消息：【" + msg + "】");
    }
    
    @RabbitListener(bindings = @QueueBinding(
        value = @Queue(name = "direct.queue2"),
        exchange = @Exchange(name = "itcast.direct", type = ExchangeTypes.DIRECT),
        key = {"red", "yellow"}
    ))
    public void listenDirectQueue2(String msg) {
        System.out.println("消费者2接收到Direct消息：【" + msg + "】");
    }
    ```

2. 在publisher服务中发送消息到Direct Exchange：

    ```java
    @Test
    public void testDirectExchange() {
        // 队列名称
        String exchangeName = "itcast.direct";
        // 消息
        String message = "红色警报！日本乱排核废水，导致海洋生物变异，尽责哥斯拉！";
        // 发送消息，参数依次为：交换机名称、RoutingKey、消息
        rabbitTemplate.convertAndSend(exchangeName, "red", message);
    }
    ```

由此可见，Direct交换机与Fanout交换机的区别是：

- Fanout交换机将消息路由给每一个与之绑定的队列
- Direct交换机根据`RoutingKey`判断路由给哪个队列
- 如果多个队列具有相同的`RoutingKey`，则与Fanout功能类似

附：基于`@RabbitListener`注解声明队列和交换机常基于注解`@Queue`和`@Exchange`。

#### 3.3.3 Topic Exchange

Topic Exchange 与 Direct Exchange 类似，区别在于RoutingKey必须是多个单词的列表，并以点`.`分割。

Queue与Exchange指定BindingKey时可以使用通配符：

- `#`：代指0/N个单词
- `*`：代指一个单词

<img src="https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/SpringCloud/image-20211225222812663.png" alt="image-20211225222812663" style="zoom:66%;" />

利用SpringAMQP演示Topic Exchange的使用：

<img src="https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/SpringCloud/image-20211225223019895.png" alt="image-20211225223019895" style="zoom:80%;" />

- 在consumer服务中，编写两个消费者方法，分别监听topic.queue1和topic.queue2，并利用`@RabbitListener`声明`Exchange`、`Queue`、`RoutingKey`：

    ```java
    @RabbitListener(bindings = @QueueBinding(
        value = @Queue(name = "topic.queue1"),
        exchange = @Exchange(name = "itcast.topic", type = ExchangeTypes.TOPIC),
        key = {"china.#"}
    ))
    public void listenTopicQueue1(String msg) {
        System.out.println("消费者1接收到Topic消息：【" + msg + "】");
    }
    
    @RabbitListener(bindings = @QueueBinding(
        value = @Queue(name = "topic.queue2"),
        exchange = @Exchange(name = "itcast.topic", type = ExchangeTypes.TOPIC),
        key = {"#.news"}
    ))
    public void listenTopicQueue2(String msg) {
        System.out.println("消费者2接收到Topic消息：【" + msg + "】");
    }
    ```

- 在publisher服务中发送消息到TopicExchange：

    ```java
    @Test
    public void testTopicExchange() {
        // 队列名称
        String exchangeName = "itcast.topic";
        // 消息
        String message = "喜报！孙悟空大战哥斯拉，胜！";
        // 发送消息
        rabbitTemplate.convertAndSend(exchangeName, "china.news", message);
    }
    ```

### 3.4 消息转换器

在SpringAMQP的发送方法中，接收消息的类型是Object，这意味着我们可以发送任意对象类型的消息，SpringAMQP会帮我们**序列化为字节**后发送。

Spring的对消息对象的处理是由`org.springframework.amqp.support.converter.MessageConverter`来处理的，其默认实现是`SimpleMessageConverter`，基于JDK的`ObjectOutputStream`完成序列化。如果要修改，只需要定义一个`MessageConverter`类型的Bean即可。

> 注意：发送方与接收方必须使用相同的`MessageConverter`。

推荐用JSON方式序列化，步骤如下：

- 在publisher服务引入依赖：

    ```xml
    <dependency>
        <groupId>com.fasterxml.jackson.dataformat</groupId>
        <artifactId>jackson-dataformat-xml</artifactId>
        <version>2.9.10</version>
    </dependency>
    ```

- 在publisher服务声明`MessageConverter`：

    ```java
    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }
    ```

- 定义一个消费者，监听object.queue队列并消费消息：

    ```java
    @RabbitListener(queues = "object.queue")
    public void listenObjectQueue(Map<String, Object> msg) {
        System.out.println("收到消息：【" + msg + "】");
    }
    ```

