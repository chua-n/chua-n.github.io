> Spring Cloud Stream.

## Spring Cloud Stream 介绍

Spring Cloud Stream is a framework for building message-driven microservice applications. Spring Cloud Stream builds upon Spring Boot to create standalone, production-grade Spring applications and uses Spring Integration to provide connectivity to message brokers. It provides opinionated configuration of middleware from several vendors, introducing the concepts of persistent publish-subscribe semantics, consumer groups, and partitions.

By adding `spring-cloud-stream` dependencies to the classpath of your application, you get immediate connectivity to a message broker exposed by the provided `spring-cloud-stream` binder (more on that later), and you can implement your functional requirement, which is run (based on the incoming message) by a `java.util.function.Function`.

The following listing shows a quick example:

```java
@SpringBootApplication
public class SampleApplication {

	public static void main(String[] args) {
		SpringApplication.run(SampleApplication.class, args);
	}

    @Bean
	public Function<String, String> uppercase() {
	    return value -> value.toUpperCase();
	}
}
```

The following listing shows the corresponding test:

```java
@SpringBootTest(classes =  SampleApplication.class)
@Import({TestChannelBinderConfiguration.class})
class BootTestStreamApplicationTests {

	@Autowired
	private InputDestination input;

	@Autowired
	private OutputDestination output;

	@Test
	void contextLoads() {
		input.send(new GenericMessage<byte[]>("hello".getBytes()));
		assertThat(output.receive().getPayload()).isEqualTo("HELLO".getBytes());
	}
}
```

## 主要概念

Spring Cloud Stream provides a number of abstractions and primitives that simplify the writing of message-driven microservice applications. This section gives an overview of the following:

- [Spring Cloud Stream’s application model](https://docs.spring.io/spring-cloud-stream/docs/3.2.7/reference/html/spring-cloud-stream.html#spring-cloud-stream-overview-application-model)
- [The Binder Abstraction](https://docs.spring.io/spring-cloud-stream/docs/3.2.7/reference/html/spring-cloud-stream.html#spring-cloud-stream-overview-binder-abstraction)
- [Persistent publish-subscribe support](https://docs.spring.io/spring-cloud-stream/docs/3.2.7/reference/html/spring-cloud-stream.html#spring-cloud-stream-overview-persistent-publish-subscribe-support)
- [Consumer group support](https://docs.spring.io/spring-cloud-stream/docs/3.2.7/reference/html/spring-cloud-stream.html#consumer-groups)
- [Partitioning support](https://docs.spring.io/spring-cloud-stream/docs/3.2.7/reference/html/spring-cloud-stream.html#partitioning)
- [A pluggable Binder SPI](https://docs.spring.io/spring-cloud-stream/docs/3.2.7/reference/html/spring-cloud-stream.html#spring-cloud-stream-overview-binder-api)

Spring Cloud Stream 的模型：

![SCSt with binder](../../resources/images/notebook/JavaWeb/SpringCloud/SCSt-with-binder.png)

### Binder, Binding, Message

- **Destination Binders:** 简称 Binder，SCS 提供的一个抽象概念，负责集成外部消息系统。

  > 对于一个具体的消息中间件，开发者可以实现一个自己的 Binder 从而集成到 SCS 应用中，SCS 官方提供了 [Kafka](https://github.com/spring-cloud/spring-cloud-stream-binder-kafka) 和 [Rabbit MQ](https://github.com/spring-cloud/spring-cloud-stream-binder-rabbit) 的 Binder。

- **Bindings:** Bridge between the external messaging systems and application provided *Producers* and *Consumers* of messages (created by the *Destination Binders*).

- **Message:** 用于生产者、消费者通过 *Destination Binders* 进行沟通的规范化的数据结构。

![SCSt overview](../../resources/images/notebook/JavaWeb/SpringCloud/SCSt-overview.png)

### 持久化的发布-订阅机制

应用程序之间的通信遵循 发布-订阅 （publish-subscribe model）模型，数据通过共享主题（shared topics）进行广播。发布-订阅通信模型降低了生产者和消费者的复杂性，使得新的应用程序被添加到拓扑结构中时不会破坏现有的流程。

下图是经典的 SCS 的发布-订阅模型，生产者生产消息发布在 shared topic 上，然后消费者通过订阅这个 topic 来获取消息（两个订阅者都可以接收到消息）：

> 其中 topic 对应于 SCS 中的 destinations（相当于Kafka的 topic、RabbitMQ 的 exchanges）。

![img](../../resources/images/notebook/JavaWeb/SpringCloud/1149398-20180731154827761-111530488.png)

### 消费者组

对于同一个应用的多个实例，当该应用收到一条消息时，如果每一个实例都去消费、处理该消息，很有可能造成“重复消费”的问题，很多情况下你可能只希望该应用只有一个实例去消费该消息，这时便可借助 SCS 提供的消费者组（借鉴自 Kafka 的消费者组）的概念来解决此问题。

每个消费者 binding 可以使用 `spring.cloud.stream.bindings.<bindingName>.group` 属性来指定一个组名. 对于下图所示的消费者，两个消费者组的名称被指定为 `spring.cloud.stream.bindings.<bindingName>.group=Group-A` or `spring.cloud.stream.bindings.<bindingName>.group=Group-B`。

![img](../../resources/images/notebook/JavaWeb/SpringCloud/1149398-20180731154859044-1037571011.png)

All groups that subscribe to a given destination receive a copy of published data, but only one member of each group receives a given message from that destination. By default, when a group is not specified, Spring Cloud Stream assigns the application to an anonymous and independent single-member consumer group that is in a publish-subscribe relationship with all other consumer groups.

所有订阅某一个给定的 destination 的组都会收到发布消息的一个备份，但是每个组内部只会有一个成员接收到该消息。当没有指定组时，默认情况下 SCS 会将该消费者 binding 分配给一个匿名的、独立的“单成员消费者组”，该组与所有其他消费者组都是发布-订阅关系。

> 也就是说如果 binding 没有指定消费组，那么这个匿名消费组会与其它组一起消费消息，可能导致重复消费问题。

一般来说，当把应用程序绑定到一个特定的 destination 时，最好总是指定消费者组。当扩展 SCS 应用程序时，你必须为其每个输入 binding 指定消费者组，这样做可以防止应用程序的实例收到重复的消息，除非你真的需要这种行为（这不太正常）。

### 订阅持久性

Binder 的实现可以确保组的订阅是持久的。也就是说，一旦为一个组创建了至少一个订阅，该组就会收到消息，即使这些消息是在该组的所有 app 都处于宕机状态时发送的。

- 匿名消费者组的订阅在本质上是不可持久的；
- 对于一些 Binder 的实现（如 RabbitMQ），也可以有非持久性的组订阅。

### 消费者类型

SCS 支持两种消费者类型：

- 消息驱动型（异步型）：Message-driven (sometimes referred to as Asynchronous)
- 轮询型（同步型）：Polled (sometimes referred to as Synchronous)

> Prior to version 2.0, only asynchronous consumers were supported. A message is delivered as soon as it is available and a thread is available to process it.

当你想控制消息的处理速度时，可能需要用到同步消费者类型。

### 分区

在消费组中我们可以保证消息不会被重复消费，但是在同组下有多个实例的时候，我们无法确定每次处理消息的是不是被同一消费者消费，**分区**的作用就是为了确保具有共同特征标识的数据由同一个消费者实例进行处理。

SCS 提供了在一个应用程序的多个实例之间进行数据分区的支持。In a partitioned scenario, the physical communication medium (such as the broker topic) is viewed as being structured into multiple partitions.

为以统一方式实现分区处理用例，SCS 提供了一个通用抽象。因此，无论 broker 本身是天然分区（如Kafka）的还是不分区（如RabbitMQ）的，都可以使用 SCS 的分区。

![SCSt partitioning](../../resources/images/notebook/JavaWeb/SpringCloud/SCSt-partitioning.png)

分区是有状态处理中的一个关键概念，在有状态处理中，确保所有相关数据被一起处理是非常关键的（出于性能或一致性的原因）。例如，在时间窗平均计算的例子中，确保来自任何给定传感器的所有测量数据都由同一个应用实例处理非常重要。

> 注意：要使用分区处理，你必须同时对生产者和消费者进行配置。

## 编程模型

### Destination Binders

Binder 的集成负责：

- 生产者和消费者之间的连接、委托和消息的路由
- 数据类型转换
- 用户代码的调用等

Binders handle a lot of the boiler plate responsibilities that would otherwise fall on your shoulders. However, to accomplish that, the binder still needs some help in the form of minimalistic yet required set of instructions from the user, which typically come in the form of some type of *binding* configuration.

### Bindings

#### 函数式 binding

下面的例子显示了一个完全配置和正常运行的 Spring Cloud Stream 应用程序，该应用程序接收作为字符串类型的消息的有效载荷，将其记录到控制台，并在将其转换为大写字母后向下发送。

这个例子看起来和任何 spring-boot 应用程序没有什么不同。那么，它是如何成为 spring-cloud-stream 应用程序的呢？

仅仅是因为在 `classpath` 上存在 spring-cloud-stream 和 binder 的依赖以及自动配置类，它们有效地将启动应用程序的上下文设置为 spring-cloud-stream 应用程序。在这个上下文里，`Supplier`、`Function`、`Consumer` 类型的 bean 被视为事实上的消息处理程序，并遵循一定的命名规则以避免额外的配置。

```java
@SpringBootApplication
public class SampleApplication {

	public static void main(String[] args) {
		SpringApplication.run(SampleApplication.class, args);
	}

	@Bean
	public Function<String, String> uppercase() {
	    return value -> {
	        System.out.println("Received: " + value);
	        return value.toUpperCase();
	    };
	}
}
```

`binding`（绑定） 是一个抽象概念，代表了由 binder 和用户代码所暴露的源和目标之间的桥梁。这个抽象概念有一个名字，比如，`spring.cloud.stream.bindings.input.destination=myQueue`这个属性名称中的 `input` 就是我们所说的 *binding 的名称*（binding name）。

binding 名称可以通过若干种机制衍生出来，下面的小节将描述 SCS 用于控制绑定名称的命名惯例和配置元素。

##### 函数式 binding 的名称

> Unlike the explicit naming required by annotation-based support (legacy) used in the previous versions of spring-cloud-stream, the functional programming model defaults to a simple convention when it comes to binding names, thus greatly simplifying application configuration.

```java
@SpringBootApplication
public class SampleApplication {

	@Bean
	public Function<String, String> uppercase() {
	    return value -> value.toUpperCase();
	}
}
```

在上面的例子中，我们有一个应用程序，它有一个单一的函数作为消息处理器。首先，作为 `Function`，它有一个输入和输出，SCS 对其的输入和输出绑定的命名规则如下:

- input - `<functionName> + -in- + <index>`
- output - `<functionName> + -out- + <index>`

其中，`in` 和 `out` 对应的是 binding 的类型（如输入或输出）；`index`是这个输入或输出绑定的索引，对于典型的单一输入/输出函数，它总是0，所以只有[具有多个输入和输出参数的函数](https://docs.spring.io/spring-cloud-stream/docs/3.2.7/reference/html/spring-cloud-stream.html#_functions_with_multiple_input_and_output_arguments)会与`index`产生关联。

因此，如果你想把这个函数的输入映射到一个叫做 `my-topic` 的 remote destination （远程目标，例如topic、queue等），你可以通过以下属性来实现:

```properties
--spring.cloud.stream.bindings.uppercase-in-0.destination=my-topic
```

请注意其中的 `uppercase-in-0` 是如何作为属性名称中的一段的。同理，`uppercase-out-0`是类似的。

##### 起别名

> 官方文档不推荐使用别名。

有些时候，为了提高可读性，你可能想给你的 binding 一个更具描述性的名字，此时可以用 `spring.cloud.stream.function.bindings.<binding-name>` 属性，该属性也支持基于自定义接口的绑定。

```properties
--spring.cloud.stream.function.bindings.uppercase-in-0=input
```

例如，上面把 binding name `uppercase-in-0` 重命名为 `input`，这样一来，所有的配置属性都可以引用 `input`这个名字，比如之前的 `--spring.cloud.bindings.input.destination=my-topic`。

#### 显式创建binding

我们已经知道 SCS 可以通过 Function, Supplier 或 Consumer 驱动来隐式地创建 binding，然而，有时你可能需要显式地创建 binding，同时它们并不与任何函数挂钩。通常来说，这种情况多发生于需要支持与其他框架（如 Spring Integration 框架）进行集成的场景，此时你可能需要直接访问底层的 `MessageChannel`。

SCS 允许你通过 `spring.cloud.stream.input-bindings` 和 `spring.cloud.output-bindings` 属性来显示定义输入和输出 binding。注意属性名称中的复数，这意味着你可以通过`;`来定义多个 binding。

下面是一个例子：

```java
@Test
public void testExplicitBindings() {
	try (ConfigurableApplicationContext context = new SpringApplicationBuilder(
		TestChannelBinderConfiguration.getCompleteConfiguration(EmptyConfiguration.class))
				.web(WebApplicationType.NONE)
				.run("--spring.jmx.enabled=false",
					"--spring.cloud.stream.input-bindings=fooin;barin",
					"--spring.cloud.stream.output-bindings=fooout;barout")) {

	assertThat(context.getBean("fooin-in-0", MessageChannel.class)).isNotNull();
	assertThat(context.getBean("barin-in-0", MessageChannel.class)).isNotNull();
	assertThat(context.getBean("fooout-out-0", MessageChannel.class)).isNotNull();
	assertThat(context.getBean("barout-out-0", MessageChannel.class)).isNotNull();
	}
}

@EnableAutoConfiguration
@Configuration
public static class EmptyConfiguration {
}
```

### 消息的生产/消费

> Starting with version 3.0 spring-cloud-stream provides support for functions that have multiple inputs and/or multiple outputs (return values). What does this actually mean and what type of use cases it is targeting?
>
> - *Big Data: Imagine the source of data you’re dealing with is highly un-organized and contains various types of data elements (e.g., orders, transactions etc) and you effectively need to sort it out.*
> - *Data aggregation: Another use case may require you to merge data elements from 2+ incoming _streams*.

#### Suppliers



#### Consumers



### Event Routing

Event Routing, in the context of Spring Cloud Stream, is the ability to either 

- route events to a particular event subscriber 
- or, route events produced by an event subscriber to a particular destination. 

Here we’ll refer to it as route ‘TO’ and route ‘FROM’.

## Binders

Spring Cloud Stream provides a Binder abstraction for use in connecting to physical destinations at the external middleware. This section provides information about the main concepts behind the Binder SPI, its main components, and implementation-specific details.

## Configuration Options

## Content Type Negotiation

## Inter-Application Communication

## Health Indicator

Spring Cloud Stream provides a health indicator for binders. It is registered under the name `binders` and can be enabled or disabled by setting the `management.health.binders.enabled` property.

