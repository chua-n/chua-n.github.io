---
title: Stream
---

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

![SCSt with binder](https://figure-bed.chua-n.com/JavaWeb/SpringCloud/SCSt-with-binder.png)

### Binder, Binding, Message

- **Destination Binders:** 简称 Binder，SCS 提供的一个抽象概念，负责集成外部消息系统。

  > 对于一个具体的消息中间件，开发者可以实现一个自己的 Binder 从而集成到 SCS 应用中，SCS 官方提供了 [Kafka](https://github.com/spring-cloud/spring-cloud-stream-binder-kafka) 和 [Rabbit MQ](https://github.com/spring-cloud/spring-cloud-stream-binder-rabbit) 的 Binder。

- **Bindings:** Bridge between the external messaging systems and application provided *Producers* and *Consumers* of messages (created by the *Destination Binders*).

- **Message:** 用于生产者、消费者通过 *Destination Binders* 进行沟通的规范化的数据结构。

![SCSt overview](https://figure-bed.chua-n.com/JavaWeb/SpringCloud/SCSt-overview.png)

### 持久化的发布-订阅机制

应用程序之间的通信遵循 发布-订阅 （publish-subscribe model）模型，数据通过共享主题（shared topics）进行广播。发布-订阅通信模型降低了生产者和消费者的复杂性，使得新的应用程序被添加到拓扑结构中时不会破坏现有的流程。

下图是经典的 SCS 的发布-订阅模型，生产者生产消息发布在 shared topic 上，然后消费者通过订阅这个 topic 来获取消息（两个订阅者都可以接收到消息）：

> 其中 topic 对应于 SCS 中的 destinations（相当于 Kafka 的 topic、RabbitMQ 的 exchanges）。

![img](https://figure-bed.chua-n.com/JavaWeb/SpringCloud/1149398-20180731154827761-111530488.png)

### 消费者组

对于同一个应用的多个实例，当该应用收到一条消息时，如果每一个实例都去消费、处理该消息，很有可能造成“重复消费”的问题，很多情况下你可能只希望该应用只有一个实例去消费该消息，这时便可借助 SCS 提供的消费者组（借鉴自 Kafka 的消费者组）的概念来解决此问题。

每个消费者 binding 可以使用 `spring.cloud.stream.bindings.<bindingName>.group` 属性来指定一个组名。对于下图所示的消费者，两个消费者组的名称被指定为 `spring.cloud.stream.bindings.<bindingName>.group=Group-A` or `spring.cloud.stream.bindings.<bindingName>.group=Group-B`。

![img](https://figure-bed.chua-n.com/JavaWeb/SpringCloud/1149398-20180731154859044-1037571011.png)

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

为以统一方式实现分区处理用例，SCS 提供了一个通用抽象。因此，无论 broker 本身是天然分区（如 Kafka）的还是不分区（如 RabbitMQ）的，都可以使用 SCS 的分区。

![SCSt partitioning](https://figure-bed.chua-n.com/JavaWeb/SpringCloud/SCSt-partitioning.png)

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

在上面的例子中，我们有一个应用程序，它有一个单一的函数作为消息处理器。首先，作为 `Function`，它有一个输入和输出，SCS 对其的输入和输出绑定的命名规则如下：

- input - `<functionName> + -in- + <index>`
- output - `<functionName> + -out- + <index>`

其中，`in` 和 `out` 对应的是 binding 的类型（如输入或输出）；`index`是这个输入或输出绑定的索引，对于典型的单一输入/输出函数，它总是 0，所以只有 [具有多个输入和输出参数的函数](https://docs.spring.io/spring-cloud-stream/docs/3.2.7/reference/html/spring-cloud-stream.html#_functions_with_multiple_input_and_output_arguments) 会与`index`产生关联。

因此，如果你想把这个函数的输入映射到一个叫做 `my-topic` 的 remote destination （远程目标，例如 topic、queue 等），你可以通过以下属性来实现：

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

##### spring.cloud.function.define

> To specify which functional bean to bind to the external destination(s) exposed by the bindings, you must provide `spring.cloud.function.definition` property.

在你的程序中，如果你只有`java.util.function.[Supplier/Function/Consumer]`类型的单个 Bean，SCS 会自动帮你将这些 Bean 识别为消息处理器。但是，当其中每个函数式类型的 Bean 有多个时，其中某些 Bean 可能是在程序中发挥其他作用的，此时要指定哪个函数式 Bean 需要绑定到 binding 作为消息处理器，你就必须提供 `spring.cloud.function.definition` 属性了。

事实上，在官方文档中提倡永远主动提供这个 `spring.cloud.function.definition` 属性，防止发生混淆。

此外，如果你想禁用 SCS 的这个自动发现机制，可以设置属性 `spring.cloud.stream.function.autodetect=false`。

#### 显式创建 binding

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

#### Supplier

对于 `java.util.function.[Supplier/Function/Consumer]`作为消息处理器的调用时机，显然其中的 `Function` 和 `Consumer` 是非常直接的，它们会根据发送到它们所绑定的 `destination` 的数据来触发，也就是说，`Function` 和 `Consumer` 是事件驱动的。

然而，对于 `Supplier` 而言，作为数据产生的源头，其触发机制定然不同。

##### Supplier 的实现方式

关于 SCS 中 `Supplier` 的实现方式，SCS 提供了三种风格，**命令式（imperative）**、**反应式（reactive）**、**混合式**，这两种风格直接关系到 `Supplier` 的触发机制。

- 命令式：考虑如下的示例：

  ```java
  @SpringBootApplication
  public static class SupplierConfiguration {
  
  	@Bean
  	public Supplier<String> stringSupplier() {
  		return () -> "Hello from Supplier";
  	}
  }
  ```

  SCS 框架的规则是：针对上述 `Supplier` 的 Bean，由框架提供一个轮询机制去触发其 `get()` 方法，默认情况下频率是每秒一次。也就是说，上述代码会每秒钟产生一条消息，发送到其绑定的输出 `destination` 中去。

- 反应式：考虑如下一个不同的例子：

  ```java
  @SpringBootApplication
  public static class SupplierConfiguration {
  
      @Bean
      public Supplier<Flux<String>> stringSupplier() {
          return () -> Flux.fromStream(Stream.generate(new Supplier<String>() {
              @Override
              public String get() {
                  try {
                      Thread.sleep(1000);
                      return "Hello from Supplier";
                  } catch (Exception e) {
                      // ignore
                  }
              }
          })).subscribeOn(Schedulers.elastic()).share();
      }
  }
  ```

  上面的 `Supplier` Bean 采用了反应式编程风格。与命令式 `Supplier` 不同，通常情况下它只被触发一次，因为调用它的 `get()` 方法会产生连续的消息流而不是单个消息。SCS 框架能够自动识别两种不同的编程风格，并保证这样的 `Supplier` 只被触发一次。

- 混合式：如果你想轮询一些数据源并返回代表结果集的有限数据流，可以如下实现：

  ```java
  @SpringBootApplication
  public static class SupplierConfiguration {
  
  	@PollableBean
  	public Supplier<Flux<String>> stringSupplier() {
  		return () -> Flux.just("hello", "bye");
  	}
  }
  ```

  如此，使用了 `PollableBean` 注解（`@Bean`的子集），从而向框架发出信号，表示“尽管这样一个 `Supplier` 的实现是反应式的，但它仍然需要被轮询”。

##### Supplier 线程

由于 Supplier 没有任何输入，因此由不同的机制（poller）触发，它可能有一个不可预知的线程机制。

虽然大多数时候线程机制的细节与函数的下游执行无关，但在某些情况下可能会出现问题，特别是对于那些可能对线程亲和力（thread affinity）有一定期望的集成框架。例如，Spring Cloud Sleuth 就依赖于存储在 thread local 中的追踪数据。对于这些情况，应该通过另一种基于 `StreamBridge` 的机制，让用户可以对线程机制有更多的控制。

#### StreamBridge

经试验，对于作为 Bean 的 `Supplier`，如果你在业务程序里手动去调用去 `get()` 方法，是无法触发其事件发送机制的，它的表现就像一个普通的业务 Bean 一样，只有被 SCS 框架本身调用时才会具有数据源属性。

然而，有些情况下，实际的数据源可能来自于非 binder 的外部系统，你没有办法借助 SCS 的轮询机制来发送你的数据源。例如，数据源可能来自于一个 REST 请求，此时可使用 SCS 提供的 `StreamBridge` 来发送这样的消息。

##### 一般使用

```java
@SpringBootApplication
@Controller
public class WebSourceApplication {

	public static void main(String[] args) {
		SpringApplication.run(WebSourceApplication.class, "--spring.cloud.stream.source=toStream");
	}

	@Autowired
	private StreamBridge streamBridge;

	@RequestMapping
	@ResponseStatus(HttpStatus.ACCEPTED)
	public void delegateToSupplier(@RequestBody String body) {
		System.out.println("Sending " + body);
		streamBridge.send("toStream-out-0", body);
	}
}
```

在这里，我们 @Autowire 了一个 `StreamBridge` Bean，它允许我们将数据发送到 output binding，从而有效地将非 SCS 程序与 SCS 程序连接起来。

- 注意，在上面的例子中，没有预定义任何 `Supplier` 的 Bean，`StreamBridge` 会在第一次调用`send(..)`操作时创建这个不存在的 output binding，并将其缓存起来供后续复用。
- 如果你想在程序启动时就预先创建一个 output binding，你可以利用 `spring.cloud.stream.source` 属性来声明你的数据源的名称，该名称将被用作一个触发器来创建一个数据源绑定（source binding）。对于上面的例子，输出绑定的名称将是`toStream-out-0`，同时你可以使用`;`来表示多个数据源（即多个输出绑定），例如，`-–spring.cloud.stream.source=foo;bar`。

另外，注意 `streamBridge.send(..)` 方法需要一个对象作为入参。这意味着你可以向它发送`POJO`或`Message`，它在发送输出时会像 `Supplier` 或 `Function` 一样经过同样的流程。

##### 动态 destination

`StreamBridge` 也可以用于 output destination(s) 事先不知道的情况，类似于 [Routing FROM Consumer](https://docs.spring.io/spring-cloud-stream/docs/3.2.7/reference/html/spring-cloud-stream.html#_routing_from_consumer)。比如，下面的例子非常类似于上一节的例子，区别仅仅在于没有设置 `spring.cloud.stream.source` 属性，因为此例中的数据被发送至一个不存在的名为 `myDestination` 的地方，这种情况下 `myDestination` 就会被视为动态 destination。

```java
@SpringBootApplication
@Controller
public class WebSourceApplication {

	public static void main(String[] args) {
		SpringApplication.run(WebSourceApplication.class, args);
	}

	@Autowired
	private StreamBridge streamBridge;

	@RequestMapping
	@ResponseStatus(HttpStatus.ACCEPTED)
	public void delegateToSupplier(@RequestBody String body) {
		System.out.println("Sending " + body);
		streamBridge.send("myDestination", body);
	}
}
```

缓存动态 destination 有可能会导致内存泄露，为了一定程度上避免这种情况，SCS 提供了一种自驱逐的缓存机制：默认只缓存 10 个 output binding，动态 destination 的数量超过这个数，某个已存在的 binding 可能会被驱逐出缓存，在使用的时候需要重新创建。可能通过 `spring.cloud.stream.dynamic-destination-cache-size` 属性来设置其他的值。

##### 拦截器

`StreamBridge` 使用 `MessageChannel` 来建立 output binding，因此当使用 `StreamBridge` 发送数据时可以激活一些 channel 拦截器。SCS 不会将检测到的所有通道拦截器注入到 `StreamBridge` 中，除非它们用 `@GlobalChannelInterceptor(patterns = "*")` 进行了注解。

假设你有下面两个 `StreamBridge` 的 bindings：

- `streamBridge.send("foo-out-0", message);`
- `streamBridge.send("bar-out-0", message);`

如果你想有一个通道拦截器同时作用于这两个 binding，可以如下声明一个 `GlobalChannelInterceptor` 的 Bean：

```java
@Bean
@GlobalChannelInterceptor(patterns = "*")
public ChannelInterceptor customInterceptor() {
    return new ChannelInterceptor() {
        @Override
        public Message<?> preSend(Message<?> message, MessageChannel channel) {
            ...
        }
    };
}
```

如果你希望为每个 binding 关联一个专用的拦截器，可以用如下操作：

```java
@Bean
@GlobalChannelInterceptor(patterns = "foo-*")
public ChannelInterceptor fooInterceptor() {
    return new ChannelInterceptor() {
        @Override
        public Message<?> preSend(Message<?> message, MessageChannel channel) {
            ...
        }
    };
}

@Bean
@GlobalChannelInterceptor(patterns = "bar-*")
public ChannelInterceptor barInterceptor() {
    return new ChannelInterceptor() {
        @Override
        public Message<?> preSend(Message<?> message, MessageChannel channel) {
            ...
        }
    };
}
```

#### Consumer

##### ???

Reactive `Consumer` is a little bit special because it has a void return type, leaving framework with no reference to subscribe to. Most likely you will not need to write `Consumer<Flux<?>>`, and instead write it as a `Function<Flux<?>, Mono<Void>>` invoking `then` operator as the last operator on your stream.

For example:

```java
public Function<Flux<?>, Mono<Void>>consumer() {
	return flux -> flux.map(..).filter(..).then();
}
```

But if you do need to write an explicit `Consumer<Flux<?>>`, remember to subscribe to the incoming Flux.

Also, keep in mind that the same rule applies for function composition when mixing reactive and imperative functions. Spring Cloud Function indeed supports composing reactive functions with imperative, however you must be aware of certain limitations. For example, assume you have composed reactive function with imperative consumer. The result of such composition is a reactive `Consumer`. However, there is no way to subscribe to such consumer as discussed earlier in this section, so this limitation can only be addressed by either making your consumer reactive and subscribing manually (as discussed earlier), or changing your function to be imperative.

##### 轮询型

不想看了......

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
