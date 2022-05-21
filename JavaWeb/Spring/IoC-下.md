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
    - ``afterPropertiesSet()` as defined by the `InitializingBean` callback interface
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

- Note that the regular `org.springframework.context.Lifecycle` interface is a plain contract for explicit start and stop notifications and does not imply auto-startup at context refresh time. For fine-grained control over auto-startup of a specific bean (including startup phases), consider implementing `org.springframework.context.SmartLifecycle` instead.
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

To register a shutdown hook, call the registerShutdownHook() method that is declared on the `ConfigurableApplicationContext` interface, as the following example shows:

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

如果一个Bean实现了`org.springframework.context.ApplicationContextAware`接口，该Bean的实例会被提供一个指向`ApplicationContext`的引用。因此，一个Bean可以借此操作创造它们的（母体）`ApplicationContext`。

`ApplicationContextAware`接口的定义如下：

```java
public interface ApplicationContextAware extends Aware {
    void setApplicationContext(ApplicationContext var1) throws BeansException;
}
```

### 1.3 BeanNameAware

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

### 2.1 `BeanPostProcessor`: Customizing Beans

#### 2.1.1 概念简介

The `BeanPostProcessor` interface defines callback methods that you can implement to provide your own (or override the container’s default) instantiation logic, dependency resolution logic, and so forth. 

> Note: To change the actual bean definition (that is, the blueprint that defines the bean), you instead need to use a `BeanFactoryPostProcessor`.

If you want to implement some custom logic after the Spring container finishes instantiating, configuring, and initializing a bean, you can plug in one or more custom `BeanPostProcessor` implementations.

`BeanPostProcessor` instances operate on bean (or object) instances. That is, the Spring IoC container instantiates a bean instance and then `BeanPostProcessor` instances do their work.

#### 2.1.2 详解

The `org.springframework.beans.factory.config.BeanPostProcessor` interface consists of exactly two callback methods. 

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

When such a class is registered as a post-processor with the container, for each bean instance that is created by the container, the post-processor gets a callback from the container both before container initialization methods (such as `InitializingBean.afterPropertiesSet()` or any declared `init` method) are called, and after any bean initialization callbacks. 

The post-processor can take any action with the bean instance, including ignoring the callback completely. 

- A bean post-processor typically checks for callback interfaces, or it may wrap a bean with a proxy. 
- Some Spring AOP infrastructure classes are implemented as bean post-processors in order to provide proxy-wrapping logic.

#### 2.1.3 配置`BeanPostProcessor`

由于`BeanPostProcessor`的实现类是一种特殊的Bean，Spring容器在扫描配置的时候会自动检测`BeanPostProcessor`的存在。由此引发的一个特殊点在于，当使用`@Bean`工厂方法来配置`BeanPostProcessor`的时候，该方法的返回类型一定要显示声明为属于`BeanPostProcessor`类型，否则Spring容器无法根据类型判断出它是一个`BeanPostProcessor`，这会影响后续的工作。

尽管更推荐通过自动扫描的方式配置`BeanPostProcessor`，但也可以编程式地注册`BeanPostProcessor`的实例：

- you can register them programmatically against a `ConfigurableBeanFactory` by using the `addBeanPostProcessor` method. 
- This can be useful when you need to evaluate conditional logic before registration or even for copying bean post processors across contexts in a hierarchy. 
- Note, however, that `BeanPostProcessor` instances added programmatically do not respect the `Ordered` interface. Here, it is the order of registration that dictates the order of execution. 
- Note also that `BeanPostProcessor` instances registered programmatically are always processed before those registered through auto-detection, regardless of any explicit ordering.

#### 2.1.4 `BeanPostProcessor` instances and AOP auto-proxying

`BeanPostProcessor` instances and AOP auto-proxyingClasses that implement the `BeanPostProcessor` interface are special and are treated differently by the container. 

- All `BeanPostProcessor` instances and beans that they directly reference are instantiated on startup, as part of the special startup phase of the `ApplicationContext`. 

- Next, all `BeanPostProcessor` instances are registered in a sorted fashion and applied to all further beans in the container. 

- Because AOP auto-proxying is implemented as a `BeanPostProcessor` itself, neither `BeanPostProcessor` instances nor the beans they directly reference are eligible for auto-proxying and, thus, do not have aspects woven into them.

    > For any such bean, you should see an informational log message: `Bean someBean is not eligible for getting processed by all BeanPostProcessor interfaces (for example: not eligible for auto-proxying)`.

- If you have beans wired into your `BeanPostProcessor` by using autowiring or `@Resource` (which may fall back to autowiring), Spring might access unexpected beans when searching for type-matching dependency candidates and, therefore, make them ineligible for auto-proxying or other kinds of bean post-processing. 

    > For example, if you have a dependency annotated with `@Resource` where the field or setter name does not directly correspond to the declared name of a bean and no name attribute is used, Spring accesses other beans for matching them by type.

### 2.2 `BeanFactoryPostProcessor`: Customizing Configuration Metadata

```java
package org.springframework.beans.factory.config;

import org.springframework.beans.BeansException;

@FunctionalInterface
public interface BeanFactoryPostProcessor {
    void postProcessBeanFactory(ConfigurableListableBeanFactory var1) throws BeansException;
}
```

The semantics of `org.springframework.beans.factory.config.BeanFactoryPostProcessor` are similar to those of the `BeanPostProcessor`, with one major difference: `BeanFactoryPostProcessor` operates on the bean configuration metadata. That is, the Spring IoC container lets a `BeanFactoryPostProcessor` read the configuration metadata and potentially change it *before* the container instantiates any beans other than `BeanFactoryPostProcessor` instances.

> If you want to change the actual bean instances (that is, the objects that are created from the configuration metadata), then you instead need to use a `BeanPostProcessor`. 
>
> While it is technically possible to work with bean instances within a `BeanFactoryPostProcessor` (for example, by using `BeanFactory.getBean()`), doing so causes premature bean instantiation, violating the standard container lifecycle. This may cause negative side effects, such as bypassing bean post processing.

Spring includes a number of predefined bean factory post-processors, such as `PropertyOverrideConfigurer` and `PropertySourcesPlaceholderConfigurer`.

An `ApplicationContext` automatically detects any beans that are deployed into it that implement the `BeanFactoryPostProcessor` interface. 

As with `BeanPostProcessor`s , you typically do not want to configure `BeanFactoryPostProcessor`s for lazy initialization. 

- If no other bean references a `Bean(Factory)PostProcessor`, that post-processor will not get instantiated at all. Thus, marking it for lazy initialization will be ignored.
- The `Bean(Factory)PostProcessor` will be instantiated eagerly even if you set the `default-lazy-init` attribute to `true` on the declaration of your `<beans />` element.

### 2.3 `FactoryBean`: Customizing Instantiation Logic

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

The `FactoryBean` interface is a point of pluggability into the Spring IoC container’s instantiation logic. If you have complex initialization code that is better expressed in Java as opposed to a (potentially) verbose amount of XML, you can create your own `FactoryBean`, write the complex initialization inside that class, and then plug your custom `FactoryBean` into the container.

> The `FactoryBean` concept and interface are used in a number of places within the Spring Framework. More than 50 implementations of the `FactoryBean` interface ship with Spring itself.

When you need to ask a container for an actual `FactoryBean` instance itself instead of the bean it produces, prefix the bean’s `id` with the ampersand symbol (`&`) when calling the `getBean()` method of the `ApplicationContext`. 