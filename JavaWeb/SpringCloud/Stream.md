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

### Binder

Spring Cloud Stream provides Binder implementations for [Kafka](https://github.com/spring-cloud/spring-cloud-stream-binder-kafka) and [Rabbit MQ](https://github.com/spring-cloud/spring-cloud-stream-binder-rabbit). The framework also includes a test binder for integration testing of your applications as spring-cloud-stream application. See [Testing](https://docs.spring.io/spring-cloud-stream/docs/3.2.7/reference/html/spring-cloud-stream.html#_testing) section for more details.

Binder abstraction is also one of the extension points of the framework, which means you can implement your own binder on top of Spring Cloud Stream.

Spring Cloud Stream uses Spring Boot for configuration, and the Binder abstraction makes it possible for a Spring Cloud Stream application to be flexible in how it connects to middleware.

### Persistent Publish-Subscribe Support

Communication between applications follows a publish-subscribe model, where data is broadcast through shared topics. This can be seen in the following figure, which shows a typical deployment for a set of interacting Spring Cloud Stream applications.

![SCSt sensors](../../resources/images/notebook/JavaWeb/SpringCloud/SCSt-sensors.png)

Data reported by sensors to an HTTP endpoint is sent to a common destination named `raw-sensor-data`. From the destination, it is independently processed by a microservice application that computes time-windowed averages and by another microservice application that ingests the raw data into HDFS (Hadoop Distributed File System). In order to process the data, both applications declare the topic as their input at runtime.

The publish-subscribe communication model reduces the complexity of both the producer and the consumer and lets new applications be added to the topology without disruption of the existing flow.

While the concept of publish-subscribe messaging is not new, Spring Cloud Stream takes the extra step of making it an opinionated choice for its application model. By using native middleware support, Spring Cloud Stream also simplifies use of the publish-subscribe model across different platforms.

### Consumer Groups

While the publish-subscribe model makes it easy to connect applications through shared topics, the ability to scale up by creating multiple instances of a given application is equally important. When doing so, different instances of an application are placed in a competing consumer relationship, where only one of the instances is expected to handle a given message.

Spring Cloud Stream models this behavior through the concept of a consumer group. (Spring Cloud Stream consumer groups are similar to and inspired by Kafka consumer groups.) Each consumer binding can use the `spring.cloud.stream.bindings.<bindingName>.group` property to specify a group name. For the consumers shown in the following figure, this property would be set as `spring.cloud.stream.bindings.<bindingName>.group=hdfsWrite` or `spring.cloud.stream.bindings.<bindingName>.group=average`.

![SCSt groups](../../resources/images/notebook/JavaWeb/SpringCloud/SCSt-groups.png)

All groups that subscribe to a given destination receive a copy of published data, but only one member of each group receives a given message from that destination. By default, when a group is not specified, Spring Cloud Stream assigns the application to an anonymous and independent single-member consumer group that is in a publish-subscribe relationship with all other consumer groups.

### Consumer Types

Two types of consumer are supported:

- Message-driven (sometimes referred to as Asynchronous)
- Polled (sometimes referred to as Synchronous)

Prior to version 2.0, only asynchronous consumers were supported. A message is delivered as soon as it is available and a thread is available to process it.

When you wish to control the rate at which messages are processed, you might want to use a synchronous consumer.

### Durability

Consistent with the opinionated application model of Spring Cloud Stream, consumer group subscriptions are durable. That is, a binder implementation ensures that group subscriptions are persistent and that, once at least one subscription for a group has been created, the group receives messages, even if they are sent while all applications in the group are stopped.

> Anonymous subscriptions are non-durable by nature. For some binder implementations (such as RabbitMQ), it is possible to have non-durable group subscriptions.

In general, it is preferable to always specify a consumer group when binding an application to a given destination. When scaling up a Spring Cloud Stream application, you must specify a consumer group for each of its input bindings. Doing so prevents the application’s instances from receiving duplicate messages (unless that behavior is desired, which is unusual).

### Partitioning Support

Spring Cloud Stream provides support for partitioning data between multiple instances of a given application. In a partitioned scenario, the physical communication medium (such as the broker topic) is viewed as being structured into multiple partitions. One or more producer application instances send data to multiple consumer application instances and ensure that data identified by common characteristics are processed by the same consumer instance.

Spring Cloud Stream provides a common abstraction for implementing partitioned processing use cases in a uniform fashion. Partitioning can thus be used whether the broker itself is naturally partitioned (for example, Kafka) or not (for example, RabbitMQ).

![SCSt partitioning](../../resources/images/notebook/JavaWeb/SpringCloud/SCSt-partitioning.png)

Partitioning is a critical concept in stateful processing, where it is critical (for either performance or consistency reasons) to ensure that all related data is processed together. For example, in the time-windowed average calculation example, it is important that all measurements from any given sensor are processed by the same application instance.

## 编程模型

To understand the programming model, you should be familiar with the following core concepts:

- **Destination Binders:** Components responsible to provide integration with the external messaging systems.
- **Bindings:** Bridge between the external messaging systems and application provided *Producers* and *Consumers* of messages (created by the Destination Binders).
- **Message:** The canonical data structure used by producers and consumers to communicate with Destination Binders (and thus other applications via external messaging systems).

![SCSt overview](../../resources/images/notebook/JavaWeb/SpringCloud/SCSt-overview.png)

### Destination Binders

Destination Binders are extension components of Spring Cloud Stream responsible for providing the necessary configuration and implementation to facilitate integration with external messaging systems. This integration is responsible for connectivity, delegation, and routing of messages to and from producers and consumers, data type conversion, invocation of the user code, and more.

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

