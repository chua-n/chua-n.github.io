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

The following example shows a fully configured and functioning Spring Cloud Stream application that receives the payload of the message as a `String` type (see [Content Type Negotiation](https://docs.spring.io/spring-cloud-stream/docs/3.2.7/reference/html/spring-cloud-stream.html#content-type-management) section), logs it to the console and sends it down stream after converting it to upper case.

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

The above example looks no different then any vanilla spring-boot application. It defines a single bean of type `Function` and that it is. So, how does it became spring-cloud-stream application? It becomes spring-cloud-stream application simply based on the presence of spring-cloud-stream and binder dependencies and auto-configuration classes on the classpath effectively setting the context for your boot application as spring-cloud-stream application. And in this context beans of type `Supplier`, `Function` or `Consumer` are treated as defacto message handlers triggering binding of to destinations exposed by the provided binder following certain naming conventions and rules to avoid extra configuration.

Binding is an abstraction that represents a bridge between sources and targets exposed by the binder and user code. This abstraction has a name and such name(s) is necessary for cases where additional per-binding configuration is required.

Throughout this manual you will see examples of configuration properties such as `spring.cloud.stream.bindings.input.destination=myQueue`. The `input` segment in this property name is what we refer to as *binding name* and it could derive via several mechanisms. The following sub-sections will describe the naming conventions and configuration elements used by spring-cloud-stream to control binding names.

#### Functional binding names

Unlike the explicit naming required by annotation-based support (legacy) used in the previous versions of spring-cloud-stream, the functional programming model defaults to a simple convention when it comes to binding names, thus greatly simplifying application configuration. Let’s look at the first example:

```java
@SpringBootApplication
public class SampleApplication {

	@Bean
	public Function<String, String> uppercase() {
	    return value -> value.toUpperCase();
	}
}
```

In the preceding example we have an application with a single function which acts as message handler. As a `Function` it has an input and output. The naming convention used to name input and output bindings is as follows:

- input - `<functionName> + -in- + <index>`
- output - `<functionName> + -out- + <index>`

The `in` and `out` corresponds to the type of binding (such as *input* or *output*). The `index` is the index of the input or output binding. It is always 0 for typical single input/output function, so it’s only relevant for [Functions with multiple input and output arguments](https://docs.spring.io/spring-cloud-stream/docs/3.2.7/reference/html/spring-cloud-stream.html#_functions_with_multiple_input_and_output_arguments).

So if for example you would want to map the input of this function to a remote destination (e.g., topic, queue etc) called "my-topic" you would do so with the following property:

```properties
--spring.cloud.stream.bindings.uppercase-in-0.destination=my-topic
```

Note how `uppercase-in-0` is used as a segment in property name. The same goes for `uppercase-out-0`.

##### Descriptive Binding Names

Some times to improve readability you may want to give your binding a more descriptive name (such as 'account', 'orders' etc). Another way of looking at it is you can map an *implicit binding name* to an *explicit binding name*. And you can do it with `spring.cloud.stream.function.bindings.<binding-name>` property. This property also provides a migration path for existing applications that rely on custom interface-based bindings that require explicit names.

For example,

```properties
--spring.cloud.stream.function.bindings.uppercase-in-0=input
```

In the preceding example you mapped and effectively renamed `uppercase-in-0` binding name to `input`. Now all configuration properties can refer to `input` binding name instead (e.g., `--spring.cloud.stream.bindings.input.destination=my-topic`).

> While descriptive binding names may enhance the readability aspect of the configuration, they also create another level of misdirection by mapping an implicit binding name to an explicit binding name. And since all subsequent configuration properties will use the explicit binding name you must always refer to this 'bindings' property to correlate which function it actually corresponds to. We believe that for most cases (with the exception of [Functional Composition](https://docs.spring.io/spring-cloud-stream/docs/3.2.7/reference/html/spring-cloud-stream.html#_functional_composition)) it may be an overkill, so, it is our recommendation to avoid using it altogether, especially since not using it provides a clear path between binder destination and binding name, such as `spring.cloud.stream.bindings.uppercase-in-0.destination=sample-topic`, where you are clearly correlating the input of `uppercase` function to `sample-topic` destination.

#### Explicit binding creation

In the previous section we explained how bindings are created implicitly driven by Function, Supplier or Consumer provided by your application. However, there are times when you may need to create binding explicitly where bindings are not tied to any function. This is typically done to support integrations with other frameworks (e.g., Spring Integration framework) where you may need direct access to the underlying `MessageChannel`.

Spring Cloud Stream allows you to define input and output bindings explicitly via `spring.cloud.stream.input-bindings` and `spring.cloud.stream.output-bindings` properties. Noticed the plural in the property names allowing you to define multiple bindings by simply using `;` as a delimiter. Just look at the following test case as an example:

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

As you can see we have declared two input bindings and two output bindings while our configuration had no functions defined, yet we were able to successfully create these bindings and access their corresponding channels.

The rest of the binding rules that apply to implicit bindings apply here as well (for example, you can see that `fooin` turned into `fooin-in-0` binding/channel etc).

### Message

You can write a Spring Cloud Stream application by simply writing functions and exposing them as `@Bean`s. You can also use Spring Integration annotations based configuration or Spring Cloud Stream annotation based configuration, although starting with spring-cloud-stream 3.x we recommend using functional implementations.

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

