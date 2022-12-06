## 1. 定制Bean的特性

The Spring Framework provides a number of interfaces you can use to customize the nature of a bean. This section groups them as follows:

- [Lifecycle Callbacks](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#beans-factory-lifecycle)
- [`ApplicationContextAware` and `BeanNameAware`](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#beans-factory-aware)
- [Other `Aware` Interfaces](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#aware-list)

### 1.1 Lifecycle Callbacks

#### 实现方式

> In addition to the initialization and destruction callbacks, Spring-managed objects may also implement the `Lifecycle` interface so that those objects can participate in the startup and shutdown process, as driven by the container’s own lifecycle.

使用“回调”参与到Bean的生命周期的方式有三种：

- 使用JSR-250的`@PostConstruct` 和 `@PreDestroy` 注解（强烈推荐）

- Spring配置中配置Bean的`init-method`和`destroy-method`（推荐）

    ```java
    <bean id="exampleInitBean" class="examples.ExampleBean" init-method="init"/>
    ```

    ```java
    public class ExampleBean {
    
        public void init() {
            // do some initialization work
        }
    }
    ```

- 实现Spring的`InitializingBean`和`DisposableBean`接口（不推荐，与SpringAPI强耦合了）：

    ```java
    package org.springframework.beans.factory;
    
    public interface InitializingBean {
        void afterPropertiesSet() throws Exception;
    }
    ```

    ```java
    package org.springframework.beans.factory;
    
    public interface DisposableBean {
        void destroy() throws Exception;
    }
    ```

如上所述，配置生命周期回调的方式有三种，如果对同一个Bean同时配置了这三种方式，其执行顺序如下：

- 初始化
    - Methods annotated with `@PostConstruct`
    - `afterPropertiesSet()` as defined by the `InitializingBean` callback interface
    - A custom configured `init()` method
- 销毁（同初始化）
    - Methods annotated with `@PreDestroy`
    - `destroy()` as defined by the `DisposableBean` callback interface
    - A custom configured `destroy()` method

#### 设置默认方法

XML配置中，顶级的`<beans/>`标签中可以通过`default-init-method`、`default-destroy-method`属性配置默认的Bean初始化和销毁方法，详情不在此阐述。

#### 生命周期回调与AOP执行顺序

A target bean is fully created first and then an AOP proxy (for example) with its interceptor chain is applied.

- The Spring container guarantees that a configured initialization callback is called immediately after a bean is supplied with all dependencies. 

    > Thus, the initialization callback is called on the raw bean reference, which means that AOP interceptors and so forth are not yet applied to the bean.

- If the target bean and the proxy are defined separately, your code can even interact with the raw target bean, bypassing the proxy. 

    > Hence, it would be inconsistent to apply the interceptors to the `init` method, because doing so would couple the lifecycle of the target bean to its proxy or interceptors and leave strange semantics when your code interacts directly with the raw target bean.

#### Lifecycle接口

The Lifecycle interface defines the essential methods for any object that has its own lifecycle requirements (such as starting and stopping some background process):

> start/stop 方法在执行前，会调用 isRunning 方法返回的状态来决定是否执行 start/stop 方法。

```java
package org.springframework.context;

public interface Lifecycle {
    void start();

    void stop();

    boolean isRunning();
}
```

Any Spring-managed object may implement the `Lifecycle` interface. Then, when the `ApplicationContext` itself receives start and stop signals (for example, for a stop/restart scenario at runtime), it cascades those calls to all `Lifecycle` implementations defined within that context. It does this by delegating to a `LifecycleProcessor`, shown in the following listing:

```java
package org.springframework.context;

public interface LifecycleProcessor extends Lifecycle {
    void onRefresh();

    void onClose();
}
```

> Notice that the `LifecycleProcessor` is itself an extension of the `Lifecycle` interface. It also adds two other methods for reacting to the context being refreshed and closed.

Note：

- The regular `org.springframework.context.Lifecycle` interface is a plain contract for explicit start and stop notifications and does not imply auto-startup at context refresh time. For fine-grained control over auto-startup of a specific bean (including startup phases), consider implementing `org.springframework.context.SmartLifecycle` instead.
- Also, please note that stop notifications are not guaranteed to come before destruction. On regular shutdown, all `Lifecycle` beans first receive a stop notification before the general destruction callbacks are being propagated. However, on hot refresh during a context’s lifetime or on stopped refresh attempts, only destroy methods are called.

##### 相互依赖的Bean

当Bean之间存在依赖关系时，它们触发`startup`和`shutdown`方法的时机需要明确：如果A depends-on B，则是B先于A触发`startup`，同时B滞后于A触发`shutdown`。

然而，有时候Bean之间的依赖关系不是那么明确，此时可以通过`SmartLifecycle`接口的`getPhase()`方法（继承自`Phased`接口）来定义一个绝对的顺序：

```java
package org.springframework.context;

public interface SmartLifecycle extends Lifecycle, Phased {
    int DEFAULT_PHASE = 2147483647;

    default boolean isAutoStartup() {
        return true;
    }

    default void stop(Runnable callback) {
        this.stop();
        callback.run();
    }

    default int getPhase() {
        return 2147483647;
    }
}
```

```java
package org.springframework.context;

public interface Phased {
    int getPhase();
}
```

对于`startup`方法，phase最小的对象最早执行；对于`shutdown`方法则正好相反，phase最小的对象最晚执行。

实际上，对于未实现`SmartLifecycle`接口的`Lifecycle`对象，其对应的phase值默认被设定为0。

#### Shutting Down the Spring IoC Container Gracefully in Non-Web Applications

>  This section applies only to non-web applications. Spring’s web-based `ApplicationContext` implementations already have code in place to gracefully shut down the Spring IoC container when the relevant web application is shut down.

To register a shutdown hook, call the `registerShutdownHook()` method that is declared on the `ConfigurableApplicationContext` interface, as the following example shows:

```java
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public final class Boot {

    public static void main(final String[] args) throws Exception {
        ConfigurableApplicationContext ctx = new ClassPathXmlApplicationContext("beans.xml");

        // add a shutdown hook for the above context...
        ctx.registerShutdownHook();

        // app runs here...

        // main method exits, hook is called prior to the app shutting down...
    }
}
```

### 1.2 ApplicationContextAware

如果一个Bean（注意前提它得是一个Spring的Bean）实现了`org.springframework.context.ApplicationContextAware`接口，该Bean的实例会被提供一个指向`ApplicationContext`的引用。因此，一个Bean可以借此操作创造它们的（母体）`ApplicationContext`。

`ApplicationContextAware`接口的定义如下：

```java
public interface ApplicationContextAware extends Aware {
    void setApplicationContext(ApplicationContext var1) throws BeansException;
}
```

### 1.3 BeanNameAware

> 获取Bean在IoC容器中的名字。

When an `ApplicationContext` creates a class that implements the `org.springframework.beans.factory.BeanNameAware` interface, the class is provided with a reference to the name defined in its associated object definition.

```java
public interface BeanNameAware {
    void setBeanName(String name) throws BeansException;
}
```

The callback is invoked after population of normal bean properties but before an initialization callback such as `InitializingBean.afterPropertiesSet()` or a custom init-method.

### 1.4 Other Aware Interfaces

Besides `ApplicationContextAware` and `BeanNameAware`, Spring offers a wide range of `Aware` callback interfaces that let beans indicate to the container that they require a certain infrastructure dependency.

| Name                             | Injected Dependency                                          | Explained in…                                                |
| :------------------------------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| `ApplicationContextAware`        | Declaring `ApplicationContext`.                              | [`ApplicationContextAware` and `BeanNameAware`](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#beans-factory-aware) |
| `ApplicationEventPublisherAware` | Event publisher of the enclosing `ApplicationContext`.       | [Additional Capabilities of the `ApplicationContext`](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#context-introduction) |
| `BeanClassLoaderAware`           | Class loader used to load the bean classes.                  | [Instantiating Beans](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#beans-factory-class) |
| `BeanFactoryAware`               | Declaring `BeanFactory`.                                     | [The `BeanFactory`](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#beans-beanfactory) |
| `BeanNameAware`                  | Name of the declaring bean.                                  | [`ApplicationContextAware` and `BeanNameAware`](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#beans-factory-aware) |
| `LoadTimeWeaverAware`            | Defined weaver for processing class definition at load time. | [Load-time Weaving with AspectJ in the Spring Framework](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#aop-aj-ltw) |
| `MessageSourceAware`             | Configured strategy for resolving messages (with support for parametrization and internationalization). | [Additional Capabilities of the `ApplicationContext`](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#context-introduction) |
| `NotificationPublisherAware`     | Spring JMX notification publisher.                           | [Notifications](https://docs.spring.io/spring-framework/docs/current/reference/html/integration.html#jmx-notifications) |
| `ResourceLoaderAware`            | Configured loader for low-level access to resources.         | [Resources](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#resources) |
| `ServletConfigAware`             | Current `ServletConfig` the container runs in. Valid only in a web-aware Spring `ApplicationContext`. | [Spring MVC](https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#mvc) |
| `ServletContextAware`            | Current `ServletContext` the container runs in. Valid only in a web-aware Spring `ApplicationContext`. | [Spring MVC](https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#mvc) |

> Note again that using these interfaces ties your code to the Spring API and does not follow the Inversion of Control style. As a result, we recommend them for infrastructure beans that require programmatic access to the container.

## 2. IoC容器的扩展点

通常情况下，程序开发者不需要去继承`ApplicationContext`接口的实现类，而可以通过Spring提供的特殊集成接口来对 IoC 容器进行扩展。

### 2.1 `BeanFactoryPostProcessor`: Customizing Configuration Metadata

```java
package org.springframework.beans.factory.config;

import org.springframework.beans.BeansException;

@FunctionalInterface
public interface BeanFactoryPostProcessor {
    void postProcessBeanFactory(ConfigurableListableBeanFactory var1) throws BeansException;
}
```

`BeanFactoryPostProcessor` 的语义与 `BeanPostProcessor` 类似，区别在于 `BeanFactoryPostProcessor` 操作的是 Bean 的配置数据。也就是说，在Spring的 IoC 容器实例化所有 Bean 对象（不包含`BeanFactoryPostProcessor` 对象，因为显然它们需要事先被实例化）之前，会让 `BeanFactoryPostProcessor` 读取配置数据，并允许对配置进行改变，从而改变 Bean 的一些特性。

从 `BeanFactoryPostProcessor` 接口的定义可以看出，尽管在技术上一个 `BeanFactoryPostProcessor` 也是可以直接操作 Bean 对象本身的——使用 `BeanFactory.getBean()` 即可获取相应的 bean ——然而并不推荐这样做！因为这实际上造成了 Bean 被提前创建，与标准的 IoC 容器赋予的生命周期相脱离，很可能导致一些负面效果。

Spring 框架预定义了一些 `BeanFactoryPostProcessor`，比如 `PropertyOverrideConfigurer` 和`PropertySourcesPlaceholderConfigurer`。

As with `BeanPostProcessor`s , you typically do not want to configure `BeanFactoryPostProcessor`s for lazy initialization:

- If no other bean references a `Bean(Factory)PostProcessor`, that post-processor will not get instantiated at all. Thus, marking it for lazy initialization will be ignored.
- The `Bean(Factory)PostProcessor` will be instantiated eagerly even if you set the `default-lazy-init` attribute to `true` on the declaration of your `<beans />` element.

### 2.2 `BeanPostProcessor`: Customizing Beans

#### 2.2.1 概念

> The `BeanPostProcessor` interface defines callback methods that you can implement to provide your own (or override the container’s default) instantiation logic, dependency resolution logic, and so forth. 
>
> If you want to implement some custom logic after the Spring container finishes instantiating, configuring, and initializing a bean, you can plug in one or more custom `BeanPostProcessor` implementations.

`BeanPostProcessor` 对象操作的是被实例化了 Bean 对象，也就是说，首先由 Spring IoC 容器创建 Bean 实例，然后`BeanPostProcessor` 开始干它们的活儿。

`BeanPostProcessor` 接口包含两个回调方法，当在 Spring 容器中注册了一个 `BeanPostProcessor` 后，每当Spring 容器创建一个 Bean 对象，注册的 `BeanPostProcessor` 对象在 Bean 对象的初始化方法 (container initialization methods, such as `InitializingBean.afterPropertiesSet()` or any declared `init` method) 执行前后都会收到一个回调：

```java
package org.springframework.beans.factory.config;

import org.springframework.beans.BeansException;
import org.springframework.lang.Nullable;

public interface BeanPostProcessor {
    @Nullable
    default Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
        return bean;
    }

    @Nullable
    default Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
        return bean;
    }
}
```

The post-processor can take any action with the bean instance, including ignoring the callback completely. 

- A bean post-processor typically checks for callback interfaces, or it may wrap a bean with a proxy. 
- Some Spring AOP infrastructure classes are implemented as bean post-processors in order to provide proxy-wrapping logic.

#### 2.2.2 配置`BeanPostProcessor`

由于`BeanPostProcessor`的实现类是一种特殊的Bean，Spring容器在扫描配置的时候会自动检测`BeanPostProcessor`的存在。由此引发的一个特殊点在于，当使用`@Bean`工厂方法来配置`BeanPostProcessor`的时候，该方法的返回类型一定要显式声明为属于`BeanPostProcessor`类型，否则Spring容器无法根据类型判断出它是一个`BeanPostProcessor`，这会影响后续的工作。

尽管更推荐通过自动扫描的方式配置`BeanPostProcessor`，但也可以编程式地注册`BeanPostProcessor`的实例：

> This can be useful when you need to evaluate conditional logic before registration or even for copying bean post processors across contexts in a hierarchy. 

- You can register them programmatically against a `ConfigurableBeanFactory` by using the `addBeanPostProcessor` method. 
- Note, however, that `BeanPostProcessor` instances added programmatically do not respect the `Ordered` interface. Here, it is the order of registration that dictates the order of execution. 
- Note also that `BeanPostProcessor` instances registered programmatically are always processed before those registered through auto-detection, regardless of any explicit ordering.

#### 2.2.3 `BeanPostProcessor` instances and AOP auto-proxying

`BeanPostProcessor` instances and AOP auto-proxyingClasses that implement the `BeanPostProcessor` interface are special and are treated differently by the container. 

- All `BeanPostProcessor` instances and beans that they directly reference are instantiated on startup, as part of the special startup phase of the `ApplicationContext`. 

- Next, all `BeanPostProcessor` instances are registered in a sorted fashion and applied to all further beans in the container. 

- Because AOP auto-proxying is implemented as a `BeanPostProcessor` itself, neither `BeanPostProcessor` instances nor the beans they directly reference are eligible for auto-proxying and, thus, do not have aspects woven into them.

    > For any such bean, you should see an informational log message: `Bean someBean is not eligible for getting processed by all BeanPostProcessor interfaces (for example: not eligible for auto-proxying)`.

- If you have beans wired into your `BeanPostProcessor` by using autowiring or `@Resource` (which may fall back to autowiring), Spring might access unexpected beans when searching for type-matching dependency candidates and, therefore, make them ineligible for auto-proxying or other kinds of bean post-processing. 

    > For example, if you have a dependency annotated with `@Resource` where the field or setter name does not directly correspond to the declared name of a bean and no name attribute is used, Spring accesses other beans for matching them by type.

### 2.3 `FactoryBean`: Customizing Instantiation Logic

> 注意这可不是`BeanFactory`。

```java
package org.springframework.beans.factory;

import org.springframework.lang.Nullable;

public interface FactoryBean<T> {
    String OBJECT_TYPE_ATTRIBUTE = "factoryBeanObjectType";

    /**
     * Returns an instance of the object this factory creates. The instance can possibly be shared, depending on whether this factory returns singletons or prototypes.
     */
    @Nullable
    T getObject() throws Exception;

    /**
     * Returns the object type returned by the getObject() method or null if the type is not known in advance.
     */
    @Nullable
    Class<?> getObjectType();

    /**
     * Returns true if this FactoryBean returns singletons or false otherwise.
     */
    default boolean isSingleton() {
        return true;
    }
}
```

`FactoryBean` 接口表示一个工厂 Bean，即它可以生成某一个类型的 Bean 实例，`FactoryBean` 最大的作用即是可以让我们自定义 Bean 的创建过程。如果一些情况下使用XML/注解等配置的手段来创建 Bean 显得太复杂了，那么可以选择使用 `FactoryBean` 来通过代码定义创建 Bean 的过程，只要最后将 `FactoryBean` 纳入 Spring 容器即可（即`FactoryBean`本身需要是一个容器中的 Bean）。

Spring框架本身也定义和使用了大量的 `FactoryBean`，差不多有50多个。

当你需要从容器中获取一个`FactoryBean`本身，而非该`FactoryBean`创建的 Bean 时，只需要在调用`ApplicationContext`的 `getBean()` 方法时，传入（由该`FactoryBean`创建的）Bean的`id`然后加上一个`&`前缀。

## 3. Environment Abstraction

The [`Environment`](https://docs.spring.io/spring-framework/docs/5.3.20/javadoc-api/org/springframework/core/env/Environment.html) interface is an abstraction integrated in the container that models two key aspects of the application environment: [profiles](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#beans-definition-profiles) and [properties](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#beans-property-source-abstraction).

### 3.1 Bean Definition Profiles

A profile is a named, logical group of bean definitions to be registered with the container only if the given profile is active. The role of the `Environment` object with relation to profiles is in determining which profiles (if any) are currently active, and which profiles (if any) should be active by default.

The `@Profile` annotation lets you indicate that a component is eligible for registration when one or more specified profiles are active.

```java
@Configuration
@Profile("development")
public class StandaloneDataConfig {

    @Bean
    public DataSource dataSource() {
        return new EmbeddedDatabaseBuilder()
            .setType(EmbeddedDatabaseType.HSQL)
            .addScript("classpath:com/bank/config/sql/schema.sql")
            .addScript("classpath:com/bank/config/sql/test-data.sql")
            .build();
    }
}
```

```java
@Configuration
@Profile("production")
public class JndiDataConfig {

    @Bean(destroyMethod="")
    public DataSource dataSource() throws Exception {
        Context ctx = new InitialContext();
        return (DataSource) ctx.lookup("java:comp/env/jdbc/datasource");
    }
}
```

The profile string may contain a simple profile name (for example, `production`) or a profile expression. A profile expression allows for more complicated profile logic to be expressed (for example, `production & us-east`). The following operators are supported in profile expressions:

- `!`: A logical “not” of the profile
- `&`: A logical “and” of the profiles
- `|`: A logical “or” of the profiles

#### Activating a Profile

...

#### Default Profile

...

### 3.2 `PropertySource` Abstraction

#### 释义

The role of the `Environment` object with relation to properties is to provide the user with a convenient service interface for configuring property sources and resolving properties from them. 

Properties play an important role in almost all applications and may originate from a variety of sources: 

- properties files
- JVM system properties
- system environment variables
- JNDI
- servlet context parameters
- ad-hoc `Properties` objects
- `Map` objects
- ......

A `PropertySource` is a simple abstraction over any source of key-value pairs, and Spring’s [`StandardEnvironment`](https://docs.spring.io/spring-framework/docs/5.3.20/javadoc-api/org/springframework/core/env/StandardEnvironment.html) is configured with two PropertySource objects: 

- one representing the set of JVM system properties (`System.getProperties()`) 
- one representing the set of system environment variables (`System.getenv()`).

#### PropertySource的搜索

Spring’s `Environment` abstraction provides search operations over a configurable hierarchy of property sources. Consider the following listing:

```java
ApplicationContext ctx = new GenericApplicationContext();
Environment env = ctx.getEnvironment();
boolean containsMyProperty = env.containsProperty("my-property");
System.out.println("Does my environment contain the 'my-property' property? " + containsMyProperty);
```

The search performed is hierarchical. 

- By default, system properties have precedence over environment variables. 
- So, if the `my-property` property happens to be set in both places during a call to `env.getProperty("my-property")`, the system property value “wins” and is returned. 
- Note that property values are not merged but rather completely overridden by a preceding entry.

For a common `StandardServletEnvironment`, the full hierarchy is as follows, with the highest-precedence entries at the top:

1. ServletConfig parameters (if applicable — for example, in case of a `DispatcherServlet` context)
2. ServletContext parameters (web.xml context-param entries)
3. JNDI environment variables (`java:comp/env/` entries)
4. JVM system properties (`-D` command-line arguments)
5. JVM system environment (operating system environment variables)

#### 自定义PropertySource

Most importantly, the entire mechanism is configurable. Perhaps you have a custom source of properties that you want to integrate into this search. To do so, implement and instantiate your own `PropertySource` and add it to the set of `PropertySources` for the current `Environment`. The following example shows how to do so:

```java
ConfigurableApplicationContext ctx = new GenericApplicationContext();
MutablePropertySources sources = ctx.getEnvironment().getPropertySources();
sources.addFirst(new MyPropertySource());
```

> In the preceding code, `MyPropertySource` has been added with highest precedence in the search.

### 3.3 @PropertySource

The [`@PropertySource`](https://docs.spring.io/spring-framework/docs/5.3.20/javadoc-api/org/springframework/context/annotation/PropertySource.html) annotation provides a convenient and declarative mechanism for adding a `PropertySource` to Spring’s `Environment`.

```java
package org.springframework.context.annotation;

@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Repeatable(PropertySources.class)
public @interface PropertySource {
    String name() default "";

    String[] value();

    boolean ignoreResourceNotFound() default false;

    String encoding() default "";

    Class<? extends PropertySourceFactory> factory() default PropertySourceFactory.class;
}
```

Given a file called `app.properties` that contains the key-value pair `testbean.name=myTestBean`, the following `@Configuration` class uses `@PropertySource` in such a way that a call to `testBean.getName()` returns `myTestBean`:

```java
@Configuration
@PropertySource("classpath:/com/myco/app.properties")
public class AppConfig {

    @Autowired
    Environment env;

    @Bean
    public TestBean testBean() {
        TestBean testBean = new TestBean();
        testBean.setName(env.getProperty("testbean.name"));
        return testBean;
    }
}
```

Any `${…}` placeholders present in a `@PropertySource` resource location are resolved against the set of property sources already registered against the environment, as the following example shows:

```java
@Configuration
@PropertySource("classpath:/com/${my.placeholder:default/path}/app.properties")
public class AppConfig {

    @Autowired
    Environment env;

    @Bean
    public TestBean testBean() {
        TestBean testBean = new TestBean();
        testBean.setName(env.getProperty("testbean.name"));
        return testBean;
    }
}
```

## 4. LoadTimeWeaver

> Load Time Weaver，简称LTW。

The `LoadTimeWeaver` is used by Spring to dynamically transform classes as they are loaded into the Java virtual machine (JVM).

To enable load-time weaving, you can add the `@EnableLoadTimeWeaving` to one of your `@Configuration` classes, as the following example shows:

```java
@Configuration
@EnableLoadTimeWeaving
public class AppConfig {
}
```

Once configured for the `ApplicationContext`, any bean within that `ApplicationContext` may implement `LoadTimeWeaverAware`, thereby receiving a reference to the load-time weaver instance. 

- This is particularly useful in combination with [Spring’s JPA support](https://docs.spring.io/spring-framework/docs/current/reference/html/data-access.html#orm-jpa) where load-time weaving may be necessary for JPA class transformation. 
- Consult the [`LocalContainerEntityManagerFactoryBean`](https://docs.spring.io/spring-framework/docs/5.3.20/javadoc-api/org/springframework/orm/jpa/LocalContainerEntityManagerFactoryBean.html) javadoc for more detail. 
- For more on AspectJ load-time weaving, see [Load-time Weaving with AspectJ in the Spring Framework](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#aop-aj-ltw).

## 5. ApplicationContext的其他功能

> 后面再跟。

主要包含如下几个点：

- Internationalization using `MessageSource`
- Standard and Custom Events
- Convenient Access to Low-level Resources
- Application Startup Tracking
- Convenient `ApplicationContext` Instantiation for Web Applications
- Deploying a Spring `ApplicationContext` as a Java EE RAR File

## 6. BeanFactory

The `BeanFactory` API provides the underlying basis for Spring’s IoC functionality.

`BeanFactory` and related interfaces (such as `BeanFactoryAware`, `InitializingBean`, `DisposableBean`) are important integration points for other framework components. By not requiring any annotations or even reflection, they allow for very efficient interaction between the container and its components. 

> Note that the core `BeanFactory` API level and its `DefaultListableBeanFactory` implementation do not make assumptions about the configuration format or any component annotations to be used. 
>
> - All of these flavors come in through extensions (such as `XmlBeanDefinitionReader` and `AutowiredAnnotationBeanPostProcessor`) and operate on shared `BeanDefinition` objects as a core metadata representation. 
> - This is the essence of what makes Spring’s container so flexible and extensible.

### `BeanFactory` or `ApplicationContext`?

You should use an ApplicationContext unless you have a good reason for not doing so.