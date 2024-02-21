---
title: IoC-下
---

## 1. 定制Bean的特性

The Spring Framework provides a number of interfaces you can use to customize the nature of a bean. This section groups them as follows:

- [Lifecycle Callbacks](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#beans-factory-lifecycle)
- [`ApplicationContextAware` and `BeanNameAware`](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#beans-factory-aware)
- [Other `Aware` Interfaces](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#aware-list)

### 1.1 Lifecycle Callbacks

#### 1.1.1 单个Bean的控制

To interact with the container’s management of the bean lifecycle, you can implement the Spring `InitializingBean` and `DisposableBean` interfaces. The container calls `afterPropertiesSet()` for the former and `destroy()` for the latter to let the bean perform certain actions upon initialization and destruction of your beans.

Internally, the Spring Framework uses `BeanPostProcessor` implementations to process any callback interfaces it can find and call the appropriate methods. If you need custom features or other lifecycle behavior Spring does not by default offer, you can implement a `BeanPostProcessor` yourself.

##### 实现方式

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

    > 使用XML配置时，顶级的`<beans/>`标签中可以通过`default-init-method`、`default-destroy-method`属性配置默认的Bean初始化和销毁方法，详情不在此阐述。

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

##### 生命周期回调与AOP执行顺序

A target bean is fully created first and then an AOP proxy (for example) with its interceptor chain is applied.

- The Spring container guarantees that a configured initialization callback is called immediately after a bean is supplied with all dependencies. 

    > Thus, the initialization callback is called on the raw bean reference, which means that AOP interceptors and so forth are not yet applied to the bean.

- If the target bean and the proxy are defined separately, your code can even interact with the raw target bean, bypassing the proxy. 

    > Hence, it would be inconsistent to apply the interceptors to the `init` method, because doing so would couple the lifecycle of the target bean to its proxy or interceptors and leave strange semantics when your code interacts directly with the raw target bean.

#### 1.1.2 容器级别的控制：Lifecycle接口

In addition to the initialization and destruction callbacks, Spring-managed objects may also implement the `Lifecycle` interface so that those objects can participate in the startup and shutdown process, as driven by the container’s own lifecycle.

##### Lifecycle接口

`Lifecycle` 接口属于面向生命周期的一种通用的基本接口，其中定义的方法是当任何一个Java对象想要表达生命周期这一概念时都会需要的方法，如表示启动的`start()`、表示停止的`stop()`。

`Lifecycle` 接口的源码定义如下：

```java
package org.springframework.context;

/**
 * `start/stop` 方法在执行前，会调用 `isRunning` 方法返回的状态来决定是否执行 `start/stop` 方法。
 */
public interface Lifecycle {
    void start();

    void stop();

    boolean isRunning();
}
```

凡是被 Spring 管理的对象都可以选择实现 `Lifecycle` 接口。当 Spring 容器 `ApplicationContext` 接收到 `start/stop` 信号时，Spring 会将该信号传递给容器内所有实现了 `Lifecycle` 接口的对象，从而触发相应的生命周期方法。Spring 的这一机制是委托给 `LifecycleProcessor` 来实现的，其源码如下：

```java
package org.springframework.context;

public interface LifecycleProcessor extends Lifecycle {
    void onRefresh();

    void onClose();
}
```

> Notice that the `LifecycleProcessor` is itself an extension of the `Lifecycle` interface. It also adds two other methods for reacting to the context being refreshed and closed.

注意：

- 对于常规的 `org.springframework.context.Lifecycle` 接口，spring 容器在启动/关闭的时候并不会自动通知`Lifecycle`的实现类去执行相应回调方法，若想执行`Lifecycle`的`start/stop`方法，需要手动触发 spring 容器（`ConfigurableApplicationContext`）的`start/stop`方法来发出信号；
- 如果想要在 spring 容器启动/关闭/刷新的时候自动触发 `Lifecycle` 的 `start/stop` 方法，可以选择实现 `SmartLifecycle` 接口；
- Also, please note that stop notifications are not guaranteed to come before destruction. On regular shutdown, all `Lifecycle` beans first receive a stop notification before the general destruction callbacks are being propagated. However, on hot refresh during a context’s lifetime or on stopped refresh attempts, only destroy methods are called.

##### SmartLifecycle接口

> TODO: `ApplicationContext` 的 `refresh` 是一种怎样的操作？

`SmartLifecycle` is an extension of the `Lifecycle` interface for those objects that require to be started upon `ApplicationContext` refresh and/or shutdown in a particular order.

- The `isAutoStartup()` return value indicates whether this object should be started at the time of a context refresh. 
- The callback-accepting `stop(Runnable)` method is useful for objects that have an asynchronous shutdown process. Any implementation of this interface must invoke the callback's `run()` method upon shutdown completion to avoid unnecessary delays in the overall `ApplicationContext` shutdown.

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

##### SmartLifecycle实现类的执行顺序

当Bean之间存在依赖关系时，它们触发`startup`和`shutdown`方法的时机需要明确：如果A depends-on B，则是B先于A触发`startup`，同时B滞后于A触发`shutdown`。

然而，有时候Bean之间的依赖关系不是那么明确，此时可以通过`SmartLifecycle`接口的`getPhase()`方法（继承自`Phased`接口）来定义一个绝对的顺序：

```java
package org.springframework.context;

public interface Phased {
    int getPhase();
}
```

对于`startup`方法，phase最小的对象最早执行；对于`shutdown`方法则正好相反，phase最小的对象最晚执行。

实际上，对于未实现`SmartLifecycle`接口的`Lifecycle`对象，其对应的phase值默认被设定为0。

##### SmartLifecycle与InitializingBean、DisposableBean的相对执行顺序

对于一个同时实现了`SmartLifecycle`、`InitializingBean`、`DisposableBean`的bean而言，我们知道，在bean完成初始化后会执行`InitializingBean`的回调，而容器初始化完成后会执行`SmartLifecycle`的`start`回调，那么它们的顺序是如何的呢？

这实际上是bean初始化完成与容器初始化完成的标准定义问题。对于spring容器，其会在其中所有的bean初始化完成之后才认为自己步入了初始化完成的阶段，因此，一个 bean 的 `InitializingBean` 回调会早于其`SmartLifecycle`的`start`回调；而对于销毁方法，过程正好相反。顺序如下所示：

```
smart postConstruct
smart start
smart stop
smart preDestroy
```

#### 1.1.3 关停非Web的IoC容器

>  This section applies only to non-web applications. Spring’s web-based `ApplicationContext` implementations already have code in place to gracefully shut down the Spring IoC container when the relevant web application is shut down.

如果在 non-web application 的环境下使用IoC容器，需要通过 JVM 的钩子来注册关停回调，这样才能保证相关联的 singleton bean 的生命周期回调能够正常被执行。要注册这样一个回调钩子，可以通过 Spring 的 `ConfigurableApplicationContext#registerShutdownHook` 方法，如下所示：

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

### 3.1 概述

The [`Environment`](https://docs.spring.io/spring-framework/docs/5.3.20/javadoc-api/org/springframework/core/env/Environment.html) interface is an abstraction integrated in the container that models two key aspects of the application environment: [profiles](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#beans-definition-profiles) and [properties](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#beans-property-source-abstraction).

```java
package org.springframework.core.env;

public interface Environment extends PropertyResolver {
    String[] getActiveProfiles();

    String[] getDefaultProfiles();

    boolean acceptsProfiles(Profiles profiles);
}
```

```java
package org.springframework.core.env;

import org.springframework.lang.Nullable;

public interface PropertyResolver {
    boolean containsProperty(String key);

    @Nullable
    String getProperty(String key);

    String getProperty(String key, String defaultValue);

    @Nullable
    <T> T getProperty(String key, Class<T> targetType);

    <T> T getProperty(String key, Class<T> targetType, T defaultValue);

    String getRequiredProperty(String key) throws IllegalStateException;

    <T> T getRequiredProperty(String key, Class<T> targetType) throws IllegalStateException;

    String resolvePlaceholders(String text);

    String resolveRequiredPlaceholders(String text) throws IllegalArgumentException;
}
```

- 一个`profile`是指对一系列bean definitions进行的一个逻辑分组，不同的 profile（即分组）通过名称区分。只有激活`profile`，其关联的这组bean definitions才会被注册到Spring容器中。`Environment`会决定当前激活的是哪个`profile`，以及在默认情况下会激活哪个`profile`。

  > A profile is a named, logical group of bean definitions to be registered with the container only if the given profile is active.

  ```java
  package org.springframework.core.env;
  
  import java.util.function.Predicate;
  
  @FunctionalInterface
  public interface Profiles {
      boolean matches(Predicate<String> activeProfiles);
  
      static Profiles of(String... profiles) {
          return ProfilesParser.parse(profiles);
      }
  }
  ```

- `Properties` 可以取自很多地方，如 JVM 参数、系统环境变量、JNDK、servlet context 参数、ad-hoc Properties 对象、Map 对象等等。`Environment` 的作用是给用户提供方便的配置 property sources 以及从中读取 properties 的接口。

  ```java
  public interface PropertySources extends Iterable<PropertySource<?>> {
      default Stream<PropertySource<?>> stream() {
          return StreamSupport.stream(this.spliterator(), false);
      }
  
      boolean contains(String name);
  
      @Nullable
      PropertySource<?> get(String name);
  }
  ```

  ```java
  package org.springframework.core.env;
  
  import org.apache.commons.logging.Log;
  import org.apache.commons.logging.LogFactory;
  import org.springframework.lang.Nullable;
  import org.springframework.util.Assert;
  import org.springframework.util.ObjectUtils;
  
  public abstract class PropertySource<T> {
      protected final Log logger;
      protected final String name;
      protected final T source;
  
      public PropertySource(String name, T source) {
          this.logger = LogFactory.getLog(this.getClass());
          Assert.hasText(name, "Property source name must contain at least one character");
          Assert.notNull(source, "Property source must not be null");
          this.name = name;
          this.source = source;
      }
  
      public PropertySource(String name) {
          this(name, new Object());
      }
  
      public String getName() {
          return this.name;
      }
  
      public T getSource() {
          return this.source;
      }
  
      public boolean containsProperty(String name) {
          return this.getProperty(name) != null;
      }
  
      @Nullable
      public abstract Object getProperty(String name);
  
      public boolean equals(@Nullable Object other) {
          return this == other || other instanceof PropertySource && ObjectUtils.nullSafeEquals(this.getName(), ((PropertySource)other).getName());
      }
  
      public int hashCode() {
          return ObjectUtils.nullSafeHashCode(this.getName());
      }
  
      public String toString() {
          return this.logger.isDebugEnabled() ? this.getClass().getSimpleName() + "@" + System.identityHashCode(this) + " {name='" + this.getName() + "', properties=" + this.getSource() + "}" : this.getClass().getSimpleName() + " {name='" + this.getName() + "'}";
      }
  
      public static PropertySource<?> named(String name) {
          return new ComparisonPropertySource(name);
      }
  
      static class ComparisonPropertySource extends StubPropertySource {
          private static final String USAGE_ERROR = "ComparisonPropertySource instances are for use with collection comparison only";
  
          public ComparisonPropertySource(String name) {
              super(name);
          }
  
          public Object getSource() {
              throw new UnsupportedOperationException("ComparisonPropertySource instances are for use with collection comparison only");
          }
  
          public boolean containsProperty(String name) {
              throw new UnsupportedOperationException("ComparisonPropertySource instances are for use with collection comparison only");
          }
  
          @Nullable
          public String getProperty(String name) {
              throw new UnsupportedOperationException("ComparisonPropertySource instances are for use with collection comparison only");
          }
      }
  
      public static class StubPropertySource extends PropertySource<Object> {
          public StubPropertySource(String name) {
              super(name, new Object());
          }
  
          @Nullable
          public String getProperty(String name) {
              return null;
          }
      }
  }
  
  ```

### 3.2 Bean Definition Profiles

Bean definition profiles 提供了一种在不同环境可以注册不同的bean的机制。这里的环境比如开发环境、测试环境、生产环境，其中连接的SQL数据库可能不同，因此属于不同条件下需要激活的profile。

`@Profile`注解可以修饰类/方法，其作用是指明一个Bean只有在某个/某些profile被激活时，才能被注册到Spring容器（未设置`@Profile`的bean，不受激活的profile的限制），比如：

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

```java
@Configuration
public class AppConfig {

    @Bean("dataSource")
    @Profile("development")
    public DataSource standaloneDataSource() {
        return new EmbeddedDatabaseBuilder()
            .setType(EmbeddedDatabaseType.HSQL)
            .addScript("classpath:com/bank/config/sql/schema.sql")
            .addScript("classpath:com/bank/config/sql/test-data.sql")
            .build();
    }

    @Bean("dataSource")
    @Profile("production")
    public DataSource jndiDataSource() throws Exception {
        Context ctx = new InitialContext();
        return (DataSource) ctx.lookup("java:comp/env/jdbc/datasource");
    }
}
```

The profile string may contain a simple profile name (for example, `production`) or a profile expression. A profile expression allows for more complicated profile logic to be expressed (for example, `production & us-east`). The following operators are supported in profile expressions:

- `!`: A logical “not” of the profile
- `&`: A logical “and” of the profiles
- `|`: A logical “or” of the profiles

#### 激活profile

激活一个profile的方式可分为两种：

- 编程式激活：调用`Environment`的 api：

  ```java
  AnnotationConfigApplicationContext ctx = new AnnotationConfigApplicationContext();
  ctx.getEnvironment().setActiveProfiles("development");
  ctx.register(SomeConfig.class, StandaloneDataConfig.class, JndiDataConfig.class);
  ctx.refresh();
  ```

- 声明式激活：设置 `spring.profiles.active` 属性，它可以通过以下途径进行设置：

  > 通过普通的`xxx.properties`文件来设置这个属性，似乎是不生效的。

  - JVM 参数

  - 系统环境变量

  - web.xml中的servlet context参数

  - JNDI


  ```java
  -Dspring.profiles.active="profile1,profile2"
  ```

- In integration tests, active profiles can be declared by using the `@ActiveProfiles` annotation in the `spring-test` module (see [context configuration with environment profiles](https://docs.spring.io/spring-framework/docs/current/reference/html/testing.html#testcontext-ctx-management-env-profiles)).

需要强调的是，激活的 profile 不是一种 *eithor-or* 的关系，可以同时激活多个 profile 的。

#### 默认Profile

如果没有在程序中显式指定一个被激活的`profile`，Spring会激活名称为`default`的默认`profile`。即，默认情况下如下 bean 会被激活：

```java
@Configuration
@Profile("default")
public class DefaultDataConfig {

    @Bean
    public DataSource dataSource() {
        return new EmbeddedDatabaseBuilder()
            .setType(EmbeddedDatabaseType.HSQL)
            .addScript("classpath:com/bank/config/sql/schema.sql")
            .build();
    }
}
```

如果想修改默认激活的`profile`的名称，可以通过编程式调用`Envirionment`的`setDefaultProfiles()`接口，或声明式地修改`spring.profiles.default`属性。

### 3.3 `PropertySource` Abstraction

#### 释义

`PropertySource` 是对任何形式表达的key-value键值对的一种抽象。

Spring 的 [`StandardEnvironment`](https://docs.spring.io/spring-framework/docs/5.3.20/javadoc-api/org/springframework/core/env/StandardEnvironment.html) 源自两个 `PropertySource` 对象： 

- 一个代表 JVM 系统参数 (`System.getProperties()`) 的 `PropertySource` 对象
- 一个代表系统环境变量 (`System.getenv()`)的 `PropertySource` 对象

#### `PropertySource`的搜索

对于如下代码：

```java
ApplicationContext ctx = new GenericApplicationContext();
Environment env = ctx.getEnvironment();
boolean containsMyProperty = env.containsProperty("my-property");
System.out.println("Does my environment contain the 'my-property' property? " + containsMyProperty);
```

`Environment` 在查找对应的property的时候，有如下规则：

- By default, system properties have precedence over environment variables. 
- So, if the `my-property` property happens to be set in both places during a call to `env.getProperty("my-property")`, the system property value “wins” and is returned. 
- Note that property values are not merged but rather completely overridden by a preceding entry.

For a common `StandardServletEnvironment`, the full hierarchy is as follows, with the highest-precedence entries at the top:

1. ServletConfig parameters (if applicable — for example, in case of a `DispatcherServlet` context)
2. ServletContext parameters (web.xml context-param entries)
3. JNDI environment variables (`java:comp/env/` entries)
4. JVM system properties (`-D` command-line arguments)
5. JVM system environment (operating system environment variables)

#### 自定义`PropertySource`

如果你自定义了一个 properties 的 source，想把它集成到 Spring 的 `Environment` 中。假设这个 source 的形式是一个名为 `app.properties` 的 `properties` 文件，依然有两种形式来集成它：

- 编程式：实现`PropertySource`然后将对应实例塞入 `Environment` 的 `PropertySources` 中去即可：

  ```java
  ConfigurableApplicationContext ctx = new GenericApplicationContext();
  MutablePropertySources sources = ctx.getEnvironment().getPropertySources();
  sources.addFirst(new MyPropertySource());
  ```

  > 此外，如果你想设置你自定义的`PropertySource`的搜索优先级，只需要设置其在 `Environment` 的 `PropertySources` 这个list中的顺序即可。如上将`MyPropertySource` 加到了 list 中的第一个元素，因而其将拥有最高优先级。

- 声明式：使用`@PropertySource`注解

  - 示例1：

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

  - 示例2：在路径参数中的 `${prop:defaultValue}` 占位符代表一个变量`prop`，`prop`的值将从之前已经载入 `Environment` 中的 `PropertySource` （如JVM系统参数、环境变量）中取，如果取不到，`prop`将使用默认值`defaultValue`。

    > 当然，也可以选择不设置默认值，此时解析不到变量`prop`，程序将抛出一个 `IllegalArgumentException` 异常。

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

#### @PropertySource

[`@PropertySource`](https://docs.spring.io/spring-framework/docs/5.3.20/javadoc-api/org/springframework/context/annotation/PropertySource.html) 注解的定义如下：

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

The `@PropertySource` annotation is repeatable, according to Java 8 conventions. However, all such `@PropertySource` annotations need to be declared at the same level, either directly on the configuration class or as meta-annotations within the same custom annotation. Mixing direct annotations and meta-annotations is not recommended, since direct annotations effectively override meta-annotations.

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