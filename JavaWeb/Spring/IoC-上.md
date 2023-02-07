## 1. IoC释义

> Spring容器指Spring的IoC容器。
>
> 以下将[Spring官方文档](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#spring-core)中的configuration metadata理解为“配置”一词。

在Spring读取Bean配置创建 Bean 实例之前，必须首先对Spring的IoC容器进行实例化，从而才能从 IoC 容器里获取 Bean 实例并使用。

- Spring IOC容器的两个基础包是`org.springframework.beans`和`org.springframework.context`。
- In Spring, the objects that form the backbone of your application and that are managed by the Spring IoC container are called **beans**.
- Beans, and the dependencies among them, are reflected in the configuration metadata used by a container.

### 1.1 两种类型的IoC容器

Spring提供了两种类型的IoC容器：

- `BeanFactory`接口： IoC容器的基础实现，是Spring框架的基础设施。
- `ApplicationContext`接口：提供了更多的高级特性，实际是 `BeanFactory` 的子接口。`ApplicationContext`面向使用 Spring 框架的开发者，几乎所有的应用场合都可以直接使用 `ApplicationContext` 而非底层的 `BeanFactory`。

从IoC容器中获取Bean对象的方法是调用底层`BeanFactory`接口提供的`getBean()`方法，`getBean()`方法有两种使用形式：

- 根据bean的id名称进行获取（允许容器中出现多个相同类型的bean）

    ```java
    public Object getBean(String name) throws BeansException {
        assertBeanFactorActive();
        return getBeanFactory().getBean(name);
    }
    ```

- 根据bean的类型进行获取（容器中存在多个相同类型的bean时无法识别，会报错）

    ```java
    public <T> T getBean(Class<T> requiredType) throws BeansException {
        assertBeanFactoryActive();
        return getBeanFactory().getBean(requiredType)
    }
    ```

实际上，Spring不建议调用任何`getBean`方法来获取对象，因为这样会导致应用程序的代码依赖了Spring的API。

### 1.2 ApplicationContext接口

`ApplicationContext`为接口，其代直接翻译为（Spring的）应用上下文，用来代表Spring的IoC容器，通过`ApplicationContext`接口的对象可获得Spring容器中的Bean对象。

![image-20220416171705471](https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/Spring/23.png)

`ApplicationContext`在初始化上下文时就实例化了所有单例的 Bean。`ApplicationContext`接口的实现类常见的有：

|   `ApplicationContext`接口的实现类   | 作用                                                         |
| :----------------------------------: | ------------------------------------------------------------ |
|   `ClassPathXmlApplicationContext`   | 从类路径下加载配置文件（推荐）                               |
|  `FileSystemXmlApplicationContext`   | 从文件系统中加载配置文件，配置文件可以在磁盘任意位置         |
| `AnnotationConfigApplicationContext` | 当使用注解配置容器对象时，需要使用此类来创建Spring容器，其用来读取注解 |

通过拿到`ApplicationContext`的`BeanFactory`（通常是`DefaultListableBeanFactory`），`ApplicationContext`的实现类也支持注册在容器外创建的对象。比如`DefaultListableBeanFactory`可以通过`registerSingleton(..)` 和 `registerBeanDefinition(..)`方法来支持注册功能。

## 2. Bean

### 2.1 BeanDefinition

A Spring IoC container manages one or more beans. These beans are created with the configuration metadata that you supply to the container (for example, in the form of XML `<bean/>` definitions).

Within the container itself, these bean definitions are represented as `BeanDefinition` objects, which contain (among other information) the following metadata:

- A package-qualified class name: typically, the actual implementation class of the bean being defined.
- Bean behavioral configuration elements, which state how the bean should behave in the container (scope, lifecycle callbacks, and so forth).
- References to other beans that are needed for the bean to do its work. These references are also called *collaborators* or *dependencies*.
- Other configuration settings to set in the newly created object — for example, the size limit of the pool or the number of connections to use in a bean that manages a connection pool.

This metadata translates to a set of properties that make up each bean definition. The following table describes these properties:

<center><i>Table 1. The bean definition</i></center>

|         Property         |                        Explained in…                         |
| :----------------------: | :----------------------------------------------------------: |
|          Class           | [Instantiating Beans](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#beans-factory-class) |
|           Name           | [Naming Beans](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#beans-beanname) |
|          Scope           | [Bean Scopes](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#beans-factory-scopes) |
|  Constructor arguments   | [Dependency Injection](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#beans-factory-collaborators) |
|        Properties        | [Dependency Injection](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#beans-factory-collaborators) |
|     Autowiring mode      | [Autowiring Collaborators](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#beans-factory-autowire) |
| Lazy initialization mode | [Lazy-initialized Beans](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#beans-factory-lazy-init) |
|  Initialization method   | [Initialization Callbacks](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#beans-factory-lifecycle-initializingbean) |
|    Destruction method    | [Destruction Callbacks](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#beans-factory-lifecycle-disposablebean) |

> In addition to bean definitions that contain information on how to create a specific bean, the `ApplicationContext` implementations also permit the registration of existing objects that are created outside the container (by users). This is done by accessing the ApplicationContext’s `BeanFactory` through the `getBeanFactory()` method, which returns the `DefaultListableBeanFactory` implementation. `DefaultListableBeanFactory` supports this registration through the `registerSingleton(..)` and `registerBeanDefinition(..)` methods. However, typical applications work solely with beans defined through regular bean definition metadata.

A bean definition is essentially a recipe for creating one or more objects. The container looks at the recipe for a named bean when asked and uses the configuration metadata encapsulated by that bean definition to create (or acquire) an actual object.

### 2.2 Bean的命名

如果Bean在配置的时候没有给予其名称，Spring默认按照如下规则给其命名：

1. 以类名为名，并将首字母小写；
2. 如果类名的前两个字母均为大写，将会保留原始的类名。

### 2.3 Bean的实例化时机

- The Spring container validates the configuration of each bean as the container is created. However, the bean properties themselves are not set until the bean is actually created.
- You can generally trust Spring to do the right thing. It detects configuration problems, such as references to non-existent beans and circular dependencies, at container load-time. Spring sets properties and resolves dependencies as late as possible, when the bean is actually created.
- This potentially delayed visibility of some configuration issues is why ApplicationContext implementations by default **pre-instantiate** singleton beans. 
- ..., the bean is instantiated (if it is not a pre-instantiated singleton), its dependencies are set, and the relevant lifecycle methods (such as a configured init method or the InitializingBean callback
    method) are invoked.

### 2.4 Bean的实例化方式

实例化Bean的三种方式：

- 构造方式实例化

    ```xml
    <bean id="exampleBean" class="examples.ExampleBean"/>
    <bean name="anotherExample" class="examples.ExampleBeanTwo"/>
    ```

- 静态工厂方法实例化

    ```xml
    <bean id="clientService" class="examples.ClientService" factory-method="createInstance"/>
    ```

    ```java
    public class ClientService {
        private static ClientService clientService = new ClientService();
        
        private ClientService() {}
        
        public static ClientService createInstance() {
            return clientService;
        }
    }
    ```

- 实例工厂方法实例化

    ```xml
    <!-- the factory bean, which contains a method called createInstance() -->
    <bean id="serviceLocator" class="examples.DefaultServiceLocator">
        <!-- inject any dependencies required by this locator bean -->
    </bean>
    
    <!-- the bean to be created via the factory bean -->
    <bean id="clientService" factory-bean="serviceLocator" factory-method="createClientServiceInstance"/>
    ```
    
    ```java
    public class DefaultServiceLocator {
        private static ClientService clientService = new ClientServiceImpl();
        
        public ClientService createClientServiceInstance() {
            return clientService;
        }
    }
    ```

对于内部类：

- An inner bean definition does not require a defined ID or name. If specified, the container does not use such a value as an identifier. 
- The container also ignores the scope flag on creation, because inner beans are always anonymous and are always created with the outer bean. 
- It is not possible to access inner beans independently or to inject them into collaborating beans other than into the enclosing bean.

### 2.5 Bean Scopes

> 私以为将其翻译为bean的作用域不太准确。

The Spring Framework supports six scopes, four of which are available only if you use a web-aware ApplicationContext. You can also create a custom scope.

| Scope                                                        | Description                                                  |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| [singleton](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#beans-factory-scopes-singleton) | (Default) Scopes a single bean definition to a single object instance for each Spring IoC container. |
| [prototype](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#beans-factory-scopes-prototype) | Scopes a single bean definition to any number of object instances. |
| [request](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#beans-factory-scopes-request) | Scopes a single bean definition to the lifecycle of a single HTTP request. That is, each HTTP request has its own instance of a bean created off the back of a single bean definition. Only valid in the context of a web-aware Spring `ApplicationContext`. |
| [session](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#beans-factory-scopes-session) | Scopes a single bean definition to the lifecycle of an HTTP `Session`. Only valid in the context of a web-aware Spring `ApplicationContext`. |
| [application](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#beans-factory-scopes-application) | Scopes a single bean definition to the lifecycle of a `ServletContext`. Only valid in the context of a web-aware Spring `ApplicationContext`. |
| [websocket](https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#websocket-stomp-websocket-scope) | Scopes a single bean definition to the lifecycle of a `WebSocket`. Only valid in the context of a web-aware Spring `ApplicationContext`. |

#### 2.5.1 singleton

![singleton](https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/Spring/singleton.png)

The scope of the Spring singleton is best described as being per-container and per-bean. This means that, if you define one bean for a particular class in a single Spring container, the Spring container creates one and only one instance of the class defined by that bean definition.

```xml
<bean id="accountService" class="com.something.DefaultAccountService"/>

<!-- the following is equivalent, though redundant (singleton scope is the default) -->
<bean id="accountService" class="com.something.DefaultAccountService" scope="singleton"/>
```

#### 2.5.2 prototype

![prototype](https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/Spring/prototype.png)

The non-singleton prototype scope of bean deployment results in the creation of a new bean instance every time a request for that specific bean is made. That is, the bean is injected into another bean or you request it through a `getBean()` method call on the container. As a rule, you should use the prototype scope for all stateful beans and the singleton scope for stateless beans.

```xml
<bean id="accountService" class="com.something.DefaultAccountService" scope="prototype"/>
```

notes:

- In contrast to the other scopes, Spring does not manage the complete lifecycle of a prototype bean.
- Thus, although initialization lifecycle callback methods are called on all objects regardless of scope, in the case of prototypes, **configured destruction lifecycle callbacks are not called**. The client code must clean up prototype-scoped objects and release expensive resources that the prototype beans hold. 
- In some respects, the Spring container’s role in regard to a prototype-scoped bean is a replacement for the Java `new` operator. All lifecycle management past that point must be handled by the client.

#### 2.5.3 Singleton Beans with Prototype-bean Dependencies

> When you use singleton-scoped beans with dependencies on prototype beans, be aware that dependencies are resolved at instantiation time. 

单例的Bean中注入的prototype-bean实例始终是同一个对象，不会随着调用的重复而重新获取新的prototype-bean实例。

如果你需要每次获取一个全新的prototype-bean实例，参见[Method Injection](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#beans-factory-method-injection)即可。

#### 2.5.4 Request, Session, Application, and WebSocket Scopes

> 暂略。

#### 2.5.5 Custom Scopes

The bean scoping mechanism is extensible. You can define your own scopes or even redefine existing scopes, although the latter is considered bad practice and you cannot override the built-in `singleton` and `prototype` scopes.

##### 2.5.5.1 Creating a Custom Scope

To integrate your custom scopes into the Spring container, you need to implement the `org.springframework.beans.factory.config.Scope` interface. The `Scope` interface has four methods to get objects from the scope, remove them from the scope, and let them be destroyed.

```java
public interface Scope {
    Object get(String var1, ObjectFactory<?> var2);

    @Nullable
    Object remove(String var1);

    void registerDestructionCallback(String var1, Runnable var2);

    @Nullable
    Object resolveContextualObject(String var1);

    @Nullable
    String getConversationId();
}
```

##### 2.5.5.2 Using a Custom Scope

After you write and test one or more custom Scope implementations, you need to make the Spring container aware of your new scopes. 

The `ConfigurableBeanFactory#registerScope` method is the central method to register a new Scope with the Spring container:

> This method is declared on the ConfigurableBeanFactory interface, which is available through the BeanFactory property on most of the concrete ApplicationContext implementations that ship with Spring.

```java
void registerScope(String scopeName, Scope scope);
```

## 3. 依赖注入

> DI exists in two major variants: **Constructor-based dependency injection** and **Setter-based dependency injection**.

在编写程序时，通过控制反转，把对象的创建权交给了Spring，但是代码中不可能出现没有依赖的情况，而IoC解耦只是降低他们的依赖关系，但不会消除，例如：业务层仍会调用持久层的方法。

这种业务层和持久层的依赖关系，在使用Spring之后，就让Spring来维护了，简单地说，就是坐等框架把持久层对象传入业务层，而不用我们自己去获取，这些便由所谓的依赖注入去实现。

**依赖注入**(Dependency Injection, DI)，是Spring框架核心IoC的具体实现，依赖注入表示组件之间的依赖关系由容器在运行期决定，形象的说，即由容器动态的将某个依赖关系注入到组件之中。

### 引导案例

对于两个类UserService和UserDao，它们都在Spring容器中，前者的代码定义中需要使用到后者。以前的做法是在容器外部获得UserService实例和UserDao实例，然后在程序中进行结合；然而，最终程序直接使用的是UserService，所以更好的方式是：在Spring容器中，将UserDao设置到UserSerivice内部。

<img src="https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/Spring/11.png" alt="11" style="zoom:50%;" />

以Spring进行依赖注入后的效果如下图：

<img src="https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/Spring/12.png" alt="12" style="zoom:50%;" />

### 3.1 构造方法注入

```java
package examples;
public class ExampleBean {
    // Number of years to calculate the Ultimate Answer
    private final int years;
    
    // The Answer to Life, the Universe, and Everything
    private final String ultimateAnswer;
    
    public ExampleBean(int years, String ultimateAnswer) {
        this.years = years;
        this.ultimateAnswer = ultimateAnswer;
    }
}
```

- 默认情况下，构造方法的形参匹配是通过参数的类型来进行的。

    - 在无歧义的情况下，形参按照在构造方法中出现的顺序依次进行赋值以初始化Bean。

    - 此时也可以选择显示地指定参数类型来进行匹配，但没有这个必要。

        ```xml
        <bean id="exampleBean" class="examples.ExampleBean">
            <constructor-arg type="int" value="7500000"/>
            <constructor-arg type="java.lang.String" value="42"/>
        </bean>
        ```

- 当有歧义时，可通过形参的索引顺序来匹配：

    ```xml
    <bean id="exampleBean" class="examples.ExampleBean">
        <constructor-arg index="0" value="7500000"/>
        <constructor-arg index="1" value="42"/>
    </bean>
    ```

- 也可以根据形参的名称进行匹配：

    ```xml
    <bean id="exampleBean" class="examples.ExampleBean">
        <constructor-arg name="years" value="7500000"/>
        <constructor-arg name="ultimateAnswer" value="42"/>
    </bean>
    ```

### 3.2 setter方法注入

> Setter-based DI is accomplished by the container calling setter methods on your beans after invoking a no-argument constructor or a no-argument static factory method to instantiate your bean.

```java
public class SimpleMovieLister {
    // the SimpleMovieLister has a dependency on the MovieFinder
    private MovieFinder movieFinder;
    
    // a setter method so that the Spring container can inject a MovieFinder
    public void setMovieFinder(MovieFinder movieFinder) {
	    this.movieFinder = movieFinder;
    }
    
    // business logic that actually uses the injected MovieFinder is omitted...
}
```

The ApplicationContext also supports setter-based DI after some dependencies have already been injected through the
constructor approach. 

### 3.3 构造注入 or setter注入？

尽管Spring既支持构造器注入和setter方法注入，但Spring更推荐使用构造器注入：

- The Spring team generally advocates constructor injection, as it lets you implement application components as immutable objects and ensures that required dependencies are not null. 
- Furthermore, constructor-injected components are always returned to the client (calling) code in a fully initialized state. 
- As a side note, a large number of constructor arguments is a bad code smell, implying that the class likely has too many responsibilities and should be refactored to better address proper separation of concerns.

setter方法注入应该作为一种备选项：

- Setter injection should primarily only be used for optional dependencies that can be assigned reasonable default values within the class. Otherwise, not-null checks must be performed everywhere the code uses the dependency. 

- One benefit of setter injection is that setter methods make objects of that class amenable to reconfiguration or re-injection later.

    > Management through JMX MBeans is therefore a compelling use case for setter injection.

### 3.4 循环依赖问题

问题：

> For example: Class A requires an instance of class B through constructor injection, and class B requires an instance of class A through constructor injection. If you configure beans for classes A and B to be injected into each other, the Spring IoC container detects this circular reference at runtime, and throws a `BeanCurrentlyInCreationException`.

解决方案——构造器注入不支持循环依赖，setter注入支持循环依赖：

> Alternatively, avoid constructor injection and use setter injection
> only. In other words, although it is not recommended, you can configure circular dependencies with setter injection.

### 3.5 自动织入

> The Spring container can autowire relationships between collaborating beans. You can let Spring resolve collaborators (other beans) automatically for your bean by inspecting the contents of the ApplicationContext.

在XML中，可以通过`<bean/>`标签的`autowire`属性来配置自动织入，其有4个模式：

| Mode          | Explanation                                                  |
| :------------ | :----------------------------------------------------------- |
| `no`          | (Default) No autowiring. Bean references must be defined by `ref` elements. Changing the default setting is not recommended for larger deployments, because specifying collaborators explicitly gives greater control and clarity. To some extent, it documents the structure of a system. |
| `byName`      | Autowiring by property name. Spring looks for a bean with the same name as the property that needs to be autowired. For example, if a bean definition is set to autowire by name and it contains a `master` property (that is, it has a `setMaster(..)` method), Spring looks for a bean definition named `master` and uses it to set the property. |
| `byType`      | Lets a property be autowired if exactly one bean of the property type exists in the container. If more than one exists, a fatal exception is thrown, which indicates that you may not use `byType` autowiring for that bean. If there are no matching beans, nothing happens (the property is not set). |
| `constructor` | Analogous to `byType` but applies to constructor arguments. If there is not exactly one bean of the constructor argument type in the container, a fatal error is raised. |

注意：

- `byName`或`byType`自动织入时，相应的字段必须有setter方法，否则无法注入。
- Explicit dependencies in property and constructor-arg settings always override autowiring. 
- You cannot autowire simple properties such as primitives, Strings, and Classes (and arrays of such simple properties). This limitation is by-design.

如果不希望某些bean参与到自动织入的体系，即不希望它们可以被自动织入到其他类：

- 可以通过设置\<bean/>标签的autowire-candidate属性为false来实现。不过，这个属性只对byType类型织入的模式有效。
- You can also limit autowire candidates based on pattern-matching against bean names.

## 4. 注入方法（Method Injection）

### 4.1 场景引入

有时我们需要在一个bean A中调用另一个bean B的方法，通常我们会添加一个字段，然后使用依赖注入把bean B的实例注入到这个字段上。这种情况下在bean A 和 bean B都是singleton时没问题，但是在 bean A是singleton和bean B是非singleton时就可能出现问题。因为bean B为非singleton , 那么bean B是希望他的使用者在一些情况下创建一个新实例，而bean A使用字段把bean B的一个实例缓存了下来，每次都使用的是同一个实例。

A solution is to forego（放弃） some inversion of control. You can make bean A aware of the container by implementing the ApplicationContextAware interface, and by making a getBean("B") call to the container ask for (a typically new) bean B instance every time bean A needs it. The following example shows this approach:

```java
// a class that uses a stateful Command-style class to perform some processing
package fiona.apple;
// Spring-API imports

import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;

public class CommandManager implements ApplicationContextAware {
    private ApplicationContext applicationContext;

    public Object process(Map commandState) {
// grab a new instance of the appropriate Command
        Command command = createCommand();
// set the state on the (hopefully brand new) Command instance
        command.setState(commandState);
        return command.execute();
    }

    protected Command createCommand() {
// notice the Spring API dependency!
        return this.applicationContext.getBean("command", Command.class);
    }

    public void setApplicationContext(
            ApplicationContext applicationContext) throws BeansException {
        this.applicationContext = applicationContext;
    }
}
```

然而这种方式并不推荐，因为这样的代码就和Spring API强绑定了。相反，Method Injection, a somewhat advanced feature of the Spring IoC container, lets you handle this use case cleanly.

> 注入方法即重写方法、替换方法？

Spring提供两种机制来注入方法，分别是 Lookup Method Injection 和Arbitrary method replacement。

- Lookup Method Injection 只提供返回值注入
- Arbitrary method replacement 可以替换任意方法来达到注入

### 4.2 Lookup Method Injection

Lookup method injection is the ability of the container to override methods on container-managed beans and **return the lookup result** for another named bean in the container. 

这种方法通常用于涉及prototype bean的场景，Spring实现这种方法注入的原理是使用CGLIB动态生成一个覆盖该方法的子类（如果该方法是抽象方法，则在子类中实现该方法；如果该方法不是抽象方法，则在子类中覆盖该方法）。基于此原理，Lookup Method Injection有如下限制：

- For this dynamic subclassing to work, the class that the Spring bean container subclasses cannot be final, and the method to be overridden cannot be final, either.
- Unit-testing a class that has an abstract method requires you to subclass the class yourself and to supply a stub implementation of the abstract method.
- Concrete methods are also necessary for component scanning, which requires **concrete classes** to pick up.
- A further key limitation is that lookup methods do not work with factory
    methods and in particular not with `@Bean` methods in configuration classes, since, in that case, the container is not in charge of creating the instance and therefore cannot create a runtime-generated subclass on the fly.

对于上述场景，Lookup Method Injection的解决方案是：

- 代码

    ```java
    package fiona.apple;
    
    // no more Spring imports!
    
    public abstract class CommandManager {
    
        public Object process(Object commandState) {
            // grab a new instance of the appropriate Command interface
            Command command = createCommand();
            // set the state on the (hopefully brand new) Command instance
            command.setState(commandState);
            return command.execute();
        }
    
        // okay... but where is the implementation of this method?
        protected abstract Command createCommand();
    }
    ```

- XML配置方式

    ```java
    <!-- a stateful bean deployed as a prototype (non-singleton) -->
    <bean id="myCommand" class="fiona.apple.AsyncCommand" scope="prototype">
        <!-- inject dependencies here as required -->
    </bean>
    
    <!-- commandProcessor uses statefulCommandHelper -->
    <bean id="commandManager" class="fiona.apple.CommandManager">
        <lookup-method name="createCommand" bean="myCommand"/>
    </bean>
    ```

- 注解配置方式：`@Lookup`

    ```java
    public abstract class CommandManager {
    
        public Object process(Object commandState) {
            Command command = createCommand();
            command.setState(commandState);
            return command.execute();
        }
    
        @Lookup("myCommand")
        // 直接使用 @Lookup 也可以
        protected abstract Command createCommand();
    }
    ```

In the client class that contains the method to be injected (the `CommandManager` in this case), the method to be injected requires a signature of the following form (???对的错的???):

```xml
<public|protected> [abstract] <return-type> theMethodName(no-arguments);
```

### 4.3 Arbitary Method Injection

A less useful form of method injection than lookup method injection is the ability to replace arbitrary methods in a managed bean with another method implementation.

在XML配置中，可以通过replaced-method标签来替换一个已经存在的方法实现。

例如，现在想替换一个类中的`computeValue`方法：

```java
public class MyValueCalculator {

    public String computeValue(String input) {
        // some real code...
    }

    // some other methods...
}
```

A class that implements the `org.springframework.beans.factory.support.MethodReplacer` interface provides the new method definition, as the following example shows:

```java
/**
 * meant to be used to override the existing computeValue(String)
 * implementation in MyValueCalculator
 */
public class ReplacementComputeValue implements MethodReplacer {

    /**
     * 重新实现某个Bean的某个方法。
     * @param o 某Bean对象
     * @param m 被替换的方法
     * @param args 方法的实参列表
     */
    public Object reimplement(Object o, Method m, Object[] args) throws Throwable {
        // get the input value, work with it, and return a computed result
        String input = (String) args[0];
        ...
        return ...;
    }
}
```

The bean definition to deploy the original class and specify the method override would resemble the following example:

```xml
<bean id="myValueCalculator" class="x.y.z.MyValueCalculator">
    <!-- arbitrary method replacement -->
    <replaced-method name="computeValue" replacer="replacementComputeValue">
        <arg-type>String</arg-type>
    </replaced-method>
</bean>

<bean id="replacementComputeValue" class="a.b.c.ReplacementComputeValue"/>
```

## 5. 其他

### depends-on

通常情况下，一个bean中引用另一个bean，可以使用`<ref/>`标签。但是当两个bean有强烈的生命周期依赖时，就需要使用`depends-on`属性了。

- The depends-on attribute can explicitly force one or more beans to be initialized before the bean using this element is initialized. 
- The depends-on attribute can specify both an initialization-time dependency and, in the case of singleton beans only, a corresponding destruction-time dependency. Dependent beans that define a depends-on relationship with a given bean are destroyed first, prior to the given bean itself being destroyed. Thus, depends-on can also control shutdown order.

### 懒加载

所谓懒加载的Bean，其实例化的时机是该Bean第一次被使用的时候，而不是在项目启动的时候。

Spring不推荐使用Bean的懒加载模式，因为这会导致一些问题可能到项目运行 了很长时间以后才会暴露出来，而不是项目启动的时候即可以被发现。

懒加载的配置方式：

- 单个Bean层次的控制

    ```xml
    <bean id="lazy" class="com.something.ExpensiveToCreateBean" lazy-init="true"/>
    <bean name="not.lazy" class="com.something.AnotherBean"/>
    ```

- 容器层次的控制

    ```xml
    <beans default-lazy-init="true">
        <!-- no beans will be pre-instantiated... -->
    </beans>
    ```
