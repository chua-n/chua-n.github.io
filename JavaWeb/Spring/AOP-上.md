## 1. 概念

**AOP(Aspect Oriented Programming)** ，直译过来即为面向切面编程。AOP 是一种编程思想，是面向对象编程OOP的一种补充，提供了与 OOP 不同的抽象软件结构的视角。在 OOP 中，我们以类(class)作为我们的基本单元，而 AOP 中的基本单元是切面(Aspect)。好比下图，所谓切面，相当于应用对象间的横切点，我们可以将其单独抽象为单独的模块。

![img](https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/Spring/24.png)

### 面向切面编程

在面向切面编程的思想里面，可以把功能分为两种：

- **核心业务**：登陆、注册、增、删、改、查等，都叫核心业务
- **周边功能**：日志、事务管理等为周边业务

在面向切面编程中，核心业务功能和周边功能是分别独立进行开发，两者不是耦合的。然后把切面功能和核心业务功能 “编织”在一起，便谓之AOP。

### AOP的目的

AOP 要达到的效果是，保证开发者不修改源代码的前提下，去为系统中的业务组件添加某种**通用**功能。即，AOP能够将那些与业务无关，却为业务模块所共同调用的逻辑或责任（例如事务处理、日志管理、权限控制等）封装起来，便于减少系统的重复代码，降低模块间的耦合度，并有利于未来的可拓展性和可维护性。

在技术上，AOP可以在程序运行期间，在不修改源码的情况下对方法进行功能增强，如此一来，不难理解 AOP 其实就是代理模式的典型应用。

### AOP实现的分类

按照 AOP 修改源代码的时机，可以将其分为两类：

- 静态 AOP 实现：AOP 框架在编译阶段对程序源代码进行修改，生成了静态的 AOP 代理类（生成的 *.class 文件已经被改掉了，需要使用特定的编译器）。例如 AspectJ。
- 动态 AOP 实现： AOP 框架在运行阶段动态生成代理对象（在内存中以 JDK 或 CGlib 动态代理动态地生成 AOP 代理类）。如 SpringAOP。

常用AOP实现比较：

|      类别      |    机制     |                             原理                             |           优点           |                            缺点                            |
| :------------: | :---------: | :----------------------------------------------------------: | :----------------------: | :--------------------------------------------------------: |
|    静态AOP     |  静态织入   |    在编译期，切面直接以字节码的形式编译到目标字节码文件中    |     对系统无性能影响     |                         灵活性不足                         |
|    动态AOP     | JDK动态代理 | 在运行期，目标类加载后，为接口动态生成代理类，将切面织入到代理类中 |  相对于静态AOP更加灵活   | 1) 切入的关注点需要实现接口；<br />2) 对系统有一点性能损耗 |
| 动态字节码生成 |    CGLIB    | 在运行期，目标类加载后，动态生成目标类的子类，将切面逻辑加入到子类中 |    没有接口也可以织入    |       扩展类的实例方法用final修饰时，则无法进行织入        |
| 自定义类加载器 |             |      在运行期，目标类加载前，将切面逻辑加到目标字节码里      | 可以对绝大部分类进行织入 |      代码中如果使用了其他类加载器，则这些类将不会织入      |
|   字节码转换   |             |          在运行期，所有类加载器加载字节码前进行拦截          |   可以对所有类进行织入   |                                                            |

### AOP 术语

> Unfortunately, AOP terminology is not particularly intuitive.
>
> 谓词（predicate）：在计算机语言的环境下，谓词是指条件表达式的求值返回真或假的过程。

|     术语      |   中文   | 含义                                                         |
| :-----------: | :------: | ------------------------------------------------------------ |
|    Aspect     |   切面   | 横跨多个类的某个功能（如事务管理）。从概念上，它是切点和增强的结合。 |
|  Join point   |  联结点  | 程序执行过程中的一个时机（点）。例如方法的调用、异常的抛出。<br /><blockquote>在 Spring AOP 中，联结点总是方法的调用。</blockquote> |
|    Advice     |   增强   | 在某个联结点上，某个切面执行的具体动作（这里对advice译为增强，为意译）。<br /><blockquote>很多AOP框架（包括Spring）都把增强建模为一个拦截器，并且相应地围绕联结点维护了一个拦截器链。</blockquote> |
|   Pointcut    |   切点   | 一个用来匹配联结点的谓词。<br /><blockquote>Advice is associated with a pointcut expression and runs at any join point matched by the pointcut. For example, you could use an introduction to make a bean implement an `IsModified` interface, to simplify caching.</blockquote> |
| Introduction  |   引入   | 引入是为一个类声明额外的方法或字段。<br /><blockquote>Spring AOP lets you introduce new interfaces (and a corresponding implementation) to any advised object. </blockquote> |
| Target object | 目标对象 | 要被切面增强的（原始）对象，也常称作advised object（增强对象，这种称呼并不好，有歧义）。<br /><blockquote>由于Spring是基于运行时代理的机制实现AOP的，因此目标对象总是一个proxied object（被代理的对象）。</blockquote> |
|   AOP Proxy   | AOP代理  | AOP为实现切面功能而创建的对象，故名之代理对象。<br /><blockquote>在Spring中，代理对象总是一个JDK代理或CBLIB代理对象。</blockquote> |
|    Weaving    |   织入   | 描述了把增强处理添加到目标对象、并创建一个被增强的对象（代理）这一过程，不对应一份实体。<br /><blockquote>1) 织入可以发生在编译时、加载时、运行时<br />2) SpringAOP的织入总是发生在运行时。</blockquote> |

增强的类型：

- 前置增强
- 返回后增强
- 异常抛出增强
- 后置增强
- 环绕增强

## 2. Spring AOP的特性

### 能力与目标

Spring AOP does not need to control the class loader hierarchy and is thus suitable for use in a servlet container or application server.

Spring AOP当前只支持对Spring Bean的方法作为联结点，不支持对字段的拦截（尽管对字段拦截的支持不需要破坏Spring AOP的核心API）。如果希望拦截对字段的访问与更新，建议直接使用AspectJ。

SpringAOP使用时需要结合SpringIoC容器，因此SpringAOP无法对非常细粒度的对象进行增强，典型的例子就是domain objects，对于这些场景，选择AspectJ吧。

### AOP机制

> The AOP runtime is still pure Spring AOP, though, and there is no dependency on the AspectJ compiler or weaver.
>
> spring关于AOP的spring-aspects包中引用了aspectjweaver。

AOP技术在Spring中实现的内容：Spring框架监控切点方法的执行，一旦监控到切入点方法被运行，即使用**动态代理**机制，动态创建目标对象的代理对象，根据增强类别在代理对象的相应位置将Advice对应的功能织入，从而完成增强后的整个代码逻辑的执行（TODO 代理发生的时机对吗？）。

Spring 的 AOP 实现底层就是对 JDK 代理、cglib 代理的方式进行了封装，封装后我们只需要对需要关注的部分进行代码编写，并通过配置的方式完成指定目标的方法增强。

<img src="https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/Spring/17.png" alt="17" style="zoom:50%;" />

-   JDK 代理：基于接口的动态代理技术。
-   cglib 代理 ：基于父类的动态代理技术。

默认情况下，Spring 会根据目标类是否实现了接口来决定采用哪种动态代理的方式。如果一个对象没有实现任何接口，则会使用CGLIB代理，否则使用JDK代理。

- 当使用JDK代理的时候，所有该目标对象实现的接口都会被代理；

- 如果需要，也可以强制使用CGLIB代理，方法是设置`proxy-target-class`为`true`：

    ```xml
    <aop:aspectj-autoproxy proxy-target-class="true"/>
    ```

Spring使用CBLIB代理时需注意如下事项：

- `final`方法无法被增强，因为它们无法被在运行时生成的子类所覆盖；

- 正常情况下，CBLIB代理是通过Objenesis创建的，但当JVM不允许绕过构造函数时，SpringAOP会对构造器进行双重调用来达成目的，此时Spring会记录相应的debug日志信息。

    > Objenesis是一个轻量的Java库，作用是绕过构造器创建实例。

#### 理解SpringAOP的代理

Spring AOP是基于代理的，牢记这一点很重要，这是本质特征！

可通过如下示例来理解代理这件事情：

假定有一个纯天然的POJO类：

```java
public class SimplePojo implements Pojo {

    public void foo() {
        // this next method invocation is a direct call on the 'this' reference
        this.bar();
    }

    public void bar() {
        // some logic...
    }
}
```

对于POJO类的实例pojo，调用pojo的方法时毫无疑问会直接调用该对象的相应方法：

```java
public class Main {

    public static void main(String[] args) {
        Pojo pojo = new SimplePojo();
        // this is a direct method call on the 'pojo' reference
        pojo.foo();
    }
}
```

![aop proxy plain pojo call](https://docs.spring.io/spring-framework/docs/current/reference/html/images/aop-proxy-plain-pojo-call.png)

然而，如果pojo引用的是代理类的代理对象时，调用方式会发生改变：

```java
public class Main {

    public static void main(String[] args) {
        ProxyFactory factory = new ProxyFactory(new SimplePojo());
        factory.addInterface(Pojo.class);
        factory.addAdvice(new RetryAdvice());

        Pojo pojo = (Pojo) factory.getProxy();
        // this is a method call on the proxy!
        pojo.foo();
    }
}
```

![aop proxy call](https://docs.spring.io/spring-framework/docs/current/reference/html/images/aop-proxy-call.png)

However, once the call has finally reached the target object (the `SimplePojo` reference in this case), any method calls that it may make on itself.

- Such as `this.bar()` or `this.foo()`, are going to be invoked against the `this` reference, and not the proxy. 
- It means that self-invocation is not going to result in the advice associated with a method invocation getting a chance to run.

综上，最好的方式永远是代码中不要出现有自调用的情况。其次，如果真的迫不得已，可以通过在代码中使用Spring提供的一些API来解决，如下：

> 这种方案首先使得代码与Spring发生了强耦合，其次使得这个类本身知道了自己即将被代理，后者与AOP的理念背道而驰了。

```java
public class SimplePojo implements Pojo {

    public void foo() {
        // this works, but... gah!
        ((Pojo) AopContext.currentProxy()).bar();
    }

    public void bar() {
        // some logic...
    }
}
```

```java
public class Main {

    public static void main(String[] args) {
        ProxyFactory factory = new ProxyFactory(new SimplePojo());
        factory.addInterface(Pojo.class);
        factory.addAdvice(new RetryAdvice());
        factory.setExposeProxy(true);

        Pojo pojo = (Pojo) factory.getProxy();
        // this is a method call on the proxy!
        pojo.foo();
    }
}
```

最后需要强调的是，上述自调用问题的根源是由于Spring AOP是基于代理这一机制实现的，故而在AspectJ中不存在这一问题。

### Enabling @AspectJ Support

> 启用与停用的差别？

The @AspectJ support can be enabled with XML- or Java-style configuration：

- xml

    ```xml
    <aop:aspectj-autoproxy/>
    ```

- java-style

    ```java
    @Configuration
    @EnableAspectJAutoProxy
    public class AppConfig {
    
    }
    ```

## 3. Spring AOP开发入门案例

> 以注解配置为例。

1. 准备一个接口和它的实现类：

    ```xml
    <dependencies>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-context</artifactId>
            <version>5.3.13</version>
        </dependency>
    </dependencies>
    ```

    ```java
    public interface IBuy {
        void buy();
    }
    ```

    ```java
    @Component
    public class Boy implements IBuy {
        @Override
        public void buy() {
            System.out.println("一男子购了一台游戏机");
        }
    }
    ```

    ```java
    @Component
    public class Girl implements IBuy {
        @Override
        public void buy() {
            System.out.println("一女子购了一件漂亮衣服");
        }
    }
    ```

2. 配置并启动Spring

    - Spring配置类

        ```java
        @ComponentScan
        @Configuration
        public class AppConfig {
        }
        ```

    - main程序运行：

        ```java
        public class AppRunner {
            public static void main(String[] args) {
                AnnotationConfigApplicationContext applicationContext = new AnnotationConfigApplicationContext(AppConfig.class);
                Boy boy = applicationContext.getBean(Boy.class);
                Girl girl = applicationContext.getBean(Girl.class);
                boy.buy();
                girl.buy();
            }
        }
        ```

    - 输出：

        ```text
        一男子购了一台游戏机
        一女子购了一件漂亮衣服
        ```

3. 加入切面

    - pom.xml

        ```xml
        <dependencies>
            <dependency>
                <groupId>org.springframework</groupId>
                <artifactId>spring-context</artifactId>
                <version>5.3.13</version>
            </dependency>
            <!-- spring-aspects包中引入了org.aspectj的aspectjweaver -->
            <dependency>
                <groupId>org.springframework</groupId>
                <artifactId>spring-aspects</artifactId>
                <version>5.3.5</version>
            </dependency>
        </dependencies>
        ```

    - Spring配置

        ```java
        @EnableAspectJAutoProxy(proxyTargetClass = true)
        @ComponentScan
        @Configuration
        public class AppConfig {
        }
        ```

    - 编写切面

        ```java
        @Aspect
        @Component
        public class BuyAspect {
            @After("execution(* com.chuan.service.IBuy.buy(..))")
            public void saySomething() {
                System.out.println("买到了，开心！");
            }
        }
        ```

    - `AppRunner#main`方法的输出变为：

        ```text
        一男子购了一台游戏机
        买到了，开心！
        一女子购了一件漂亮衣服
        买到了，开心！
        ```

## 4. 定义切面与切点

### 4.1 声明切面

在`@Component`修饰Bean的基础上，使用`@Aspect`注解。

在SpringAOP中，切面自身不能作为目标对象被其他切面增强。因为`@Aspect`注解除了将一个类标记为切面类以外，还将这个类排除在了auto-proxying之外。

#### 切面实例化模型

默认情况下，每一个切面在Spring容器中都是单例的，但是也可以定义不同生命周期的切面。Spring支持AspectJ的 `singleton`（默认情况）、`perthis` 和 `pertarget` 实例化模型，但目前不支持 `percflow`, `percflowbelow`, `pertypewithin`。

在@Aspect注解中声明一个`perthis` 分句就可以声明`perthis`切面了，如下所示：

```java
@Aspect("perthis(com.xyz.myapp.CommonPointcuts.businessService())")
public class MyAspect {

    private int someState;

    @Before("com.xyz.myapp.CommonPointcuts.businessService()")
    public void recordServiceUsage() {
        // ...
    }
}
```

- the effect of the `perthis` clause is that one aspect instance is created for each unique service object that performs a business service (each unique object bound to `this` at join points matched by the pointcut expression). 
- The aspect instance is created the first time that a method is invoked on the service object. The aspect goes out of scope when the service object goes out of scope. 
- Before the aspect instance is created, none of the advice within it runs. As soon as the aspect instance has been created, the advice declared within it runs at matched join points, but only when the service object is the one with which this aspect is associated.

`pertarget` 实例模型的用法同 `perthis`，只不过它为每一个不同的目标对象来创建切面对象。

### 4.2 声明切点

#### @Pointcut注解抽取切点表达式

> In the @AspectJ annotation-style of AOP, a pointcut signature is provided by a regular method definition, and the pointcut expression is indicated by using the `@Pointcut` annotation (the method serving as the pointcut signature must have a `void` return type).

当多个增强方法都锚定的是同一个切点时，可以将相应切点表达式抽取出来，避免多次重复硬编码。

抽取方式是设定一个方法（起标识作用，往往可以是空方法），在该方法上使用`@Pointcut`注解定义切点表达式，然后在增强注解中进行引用即可：

```java
@Aspect
@Component
public class BuyAspect {

    @Before("buyPoint()")
    public void preAdvice() {
        System.out.println("<<<<<<<<<<<前置增强<<<<<<<<<<<");
    }

    @After("buyPoint()")
    public void afterAdvice() {
        System.out.println(">>>>>>>>>>>后置增强>>>>>>>>>>>");
    }

    @Pointcut("execution(* com.chuan.service.IBuy.buy(..))")
    public void buyPoint() {

    }
}
```

引用切点表达式时，java方法的作用域修饰符是起作用的，即你不能在某一个类中引用另一个类里定义的private的@Pointcut方法。

#### 定义公共的切点

有时候可以定义一些公共的切点，从而在项目中可以被作为一种公共资源来使用。

例如，如下一个类中定义了若干切点表达式：

```java
package com.xyz.myapp;

import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;

@Aspect
public class CommonPointcuts {

    /**
     * A join point is in the web layer if the method is defined
     * in a type in the com.xyz.myapp.web package or any sub-package
     * under that.
     */
    @Pointcut("within(com.xyz.myapp.web..*)")
    public void inWebLayer() {}

    /**
     * A join point is in the service layer if the method is defined
     * in a type in the com.xyz.myapp.service package or any sub-package
     * under that.
     */
    @Pointcut("within(com.xyz.myapp.service..*)")
    public void inServiceLayer() {}

    /**
     * A join point is in the data access layer if the method is defined
     * in a type in the com.xyz.myapp.dao package or any sub-package
     * under that.
     */
    @Pointcut("within(com.xyz.myapp.dao..*)")
    public void inDataAccessLayer() {}

    /**
     * A business service is the execution of any method defined on a service
     * interface. This definition assumes that interfaces are placed in the
     * "service" package, and that implementation types are in sub-packages.
     *
     * If you group service interfaces by functional area (for example,
     * in packages com.xyz.myapp.abc.service and com.xyz.myapp.def.service) then
     * the pointcut expression "execution(* com.xyz.myapp..service.*.*(..))"
     * could be used instead.
     *
     * Alternatively, you can write the expression using the 'bean'
     * PCD, like so "bean(*Service)". (This assumes that you have
     * named your Spring service beans in a consistent fashion.)
     */
    @Pointcut("execution(* com.xyz.myapp..service.*.*(..))")
    public void businessService() {}

    /**
     * A data access operation is the execution of any method defined on a
     * dao interface. This definition assumes that interfaces are placed in the
     * "dao" package, and that implementation types are in sub-packages.
     */
    @Pointcut("execution(* com.xyz.myapp.dao.*.*(..))")
    public void dataAccessOperation() {}

}
```

如果想给项目中的service层加入事务机制，可以进行如下配置：

```java
<aop:config>
    <aop:advisor
        pointcut="com.xyz.myapp.CommonPointcuts.businessService()"
        advice-ref="tx-advice"/>
</aop:config>

<tx:advice id="tx-advice">
    <tx:attributes>
        <tx:method name="*" propagation="REQUIRED"/>
    </tx:attributes>
</tx:advice>
```

## 5. 切点表达式

> The pointcut expression may be either a simple reference to a named pointcut or a pointcut expression declared in place.

### 5.1 Spring支持的PCD

Spring AOP 中的切点表达式(pointcut designators, PCD)是AspectJ的一个子集，其支持的写法有：

- `execution`: 用于匹配联结点（即方法的执行），SpringAOP最主要的用法。

    - 语法

        ```
        execution(modifiers-pattern? ret-type-pattern declaring-type-pattern?namepattern(
        param-pattern) throws-pattern?)
        ```

        > 其中各个部分，支持使用通配符`*`。
        >
        > `modifiers-pattern`, `ret-type-pattern`, `declaring-type-pattern`是可选的，非必填项。

        - `modifiers-pattern`：修饰符
        - `ret-type-pattern`：返回值类型
        - `declaring-type-pattern`：类的类型（类名），如果存在，需要使用`.`与`namepattern`分隔。
            - 包名与类名之间一个点`.`代表当前包下的类
            - 两个点`..`表示当前包及其子包下的类；
        - `namepattern`：方法名
        - `param-pattern`：方法形参
            - `()` 匹配没有参数的方法
            - `(..)` 匹配有任意数量参数的方法
            - `(*)` 匹配有一个任意类型参数的方法
            - `(*,String)` 匹配有两个参数的方法，并且第一个为任意类型，第二个为 `String` 类型
        - `throws-pattern`：异常类型。省略时匹配任意类型

    - 示例

        - The execution of any public method:

            ```java
                execution(public * *(..))
            ```

        - The execution of any method with a name that begins with `set`:

            ```java
                execution(* set*(..))
            ```

        - The execution of any method defined by the `AccountService` interface:

            ```java
                execution(* com.xyz.service.AccountService.*(..))
            ```

        - The execution of any method defined in the `service` package:

            ```java
                execution(* com.xyz.service.*.*(..))
            ```

        - The execution of any method defined in the service package or one of its sub-packages:

            ```java
                execution(* com.xyz.service..*.*(..))
            ```

- `within`: 匹配目标类。限制联结点必须出现在某些特定的类中，这些类中所有的方法均会成为联结点。

    - Any join point (method execution only in Spring AOP) within the service package:

        ```java
            within(com.xyz.service.*)
        ```

    - Any join point (method execution only in Spring AOP) within the service package or one of its sub-packages:

        ```java
            within(com.xyz.service..*)
        ```

- `this`: 通过代理类的类型来匹配。如果某个Bean的代理类属于该类型，则拦截该Bean的方法。

    > Limits matching to join points (the execution of methods when using Spring AOP) where the bean reference (Spring AOP proxy) is an instance of the given type.

    - Any join point (method execution only in Spring AOP) where the proxy implements the `AccountService` interface:

        ```java
            this(com.xyz.service.AccountService)
        ```

- `target`: 通过目标类的类型来匹配。如果某个Bean（即被代理的类）属于该类型，则拦截该Bean的方法。

    > Limits matching to join points (the execution of methods when using Spring AOP) where the target object (application object being proxied) is an instance of the given type.

    - Any join point (method execution only in Spring AOP) where the target object implements the `AccountService` interface:

        ```java
            target(com.xyz.service.AccountService)
        ```

- `args`: 通过联结点的形参来匹配。

    - Any join point (method execution only in Spring AOP) that takes a single parameter and where the argument passed at runtime is `Serializable`:

        ```java
            args(java.io.Serializable)
        ```

    - 注意，通过`args`来匹配联结点与通过在`execution`中指定形参来匹配联结点的两种方式有所不同。`args` 是以运时行类型作为匹配条件，而相应的`execution`则以声明方法时的方法签名作为匹配条件。

- `@annotation`: 通过联结点是否被相应的注解所修饰来进行匹配。

    > Limits matching to join points where the subject of the join point (the method being run in Spring AOP) has the given annotation.

    - Any join point (method execution only in Spring AOP) where the executing method has an `@Transactional` annotation:

        ```java
            @annotation(org.springframework.transaction.annotation.Transactional)
        ```

- `@within`: 指定一个修饰类型的注解，通过目标对象的类型是否属于被该注解修饰的（子）类型来进行匹配。

    > Limits matching to join points within types that have the given annotation (the execution of methods **declared** in types with the given annotation when using Spring AOP).

    - Any join point (method execution only in Spring AOP) where the declared type of the target object has an `@Transactional` annotation:

        ```java
            @within(org.springframework.transaction.annotation.Transactional)
        ```

- `@target`: 指定一个修饰类型的注解，通过目标对象是否被该注解所修饰来进行匹配。

    > Limits matching to join points (the execution of methods when using Spring AOP) where the class of the executing object has an annotation of the given type.

    - Any join point (method execution only in Spring AOP) where the target object has a `@Transactional` annotation:

        ```java
            @target(org.springframework.transaction.annotation.Transactional)
        ```

- `@args`: 指定一个修饰类型的注解，通过传入联结点的实参的运行时类型是否被该注解所修饰来进行匹配。

    > Limits matching to join points (the execution of methods when using Spring AOP) where the runtime type of the actual arguments passed have annotations of the given types.

    - Any join point (method execution only in Spring AOP) which takes a single parameter, and where the runtime type of the argument passed has the `@Classified` annotation:

        ```java
            @args(com.xyz.security.Classified)
        ```

Spring还支持一个额外的PCD：

- `bean`: 通过 Bean 的ID或名称来进行匹配。可使用通配符来匹配多个Bean。

    > This PCD lets you limit the matching of join points to a particular named Spring bean or to a set of named Spring beans (when using wildcards). 

    - The `bean` PCD has the following form:
    
        ```java
        bean(idOrNameOfBean)
        ```

    - The bean PCD operates at the instance level (building on the Spring bean name concept) rather than at the type level only (to which weaving-based AOP is limited).

        > Instance-based pointcut designators are a special capability of Spring’s proxy-based AOP framework and its close integration with the Spring bean factory, where it is natural and straightforward to identify specific beans by name.

    - 示例：

        - Any join point (method execution only in Spring AOP) on a Spring bean named `tradeService`:
    
            ```java
                bean(tradeService)
            ```

        - Any join point (method execution only in Spring AOP) on Spring beans having names that match the wildcard expression `*Service`:
    
            ```java
                bean(*Service)
            ```

多个匹配之间我们可以使用链接符 `&&`、`||`、`!`来表示 “且”、“或”、“非”的关系。不过，在使用 XML 文件配置时，这些符号有特殊的含义，所以相应使用 “and”、“or”、“not”来表示。

#### 注：`this`与`target`

AspectJ itself has type-based semantics and, at an execution join point, both `this` and `target` refer to the same object: the object executing the method. Spring AOP is a proxy-based system and differentiates between the proxy object itself (which is bound to `this`) and the target object behind the proxy (which is bound to `target`).

Due to the proxy-based nature of Spring’s AOP framework, calls within the target object are, by definition, not intercepted. 

- For JDK proxies, only public interface method calls on the proxy can be intercepted. 
- With CGLIB, public and protected method calls on the proxy are intercepted (and even package-visible methods, if necessary). 
- However, common interactions through proxies should always be designed through public signatures.

### 5.2 附：其他PCD

The full AspectJ pointcut language supports additional pointcut designators that are not supported in Spring:

> Use of these pointcut designators in pointcut expressions interpreted by Spring AOP results in an `IllegalArgumentException` being thrown.

- `call`
- `get`
- `set`
- `preinitialization`
- `staticinitialization`
- `initialization`
- `handler`
- `adviceexecution`
- `withincode`
- `cflow`
- `cflowbelow`
- `if`
- `@this`
- `@withincode`

The set of pointcut designators supported by Spring AOP may be extended in future releases to support more of the AspectJ pointcut designators.

### 5.3 切点表达式的匹配性能

切点表达式为了匹配相应的联结点，必须对代码进行核查并决定相应的联结点是否与切点表达式相匹配，这显然是具有运行成本的，因此AsepectJ会在编译时对切点进行处理以优化性能。

- On first encountering a pointcut declaration, AspectJ rewrites it into an optimal form for the matching process. 

- What does this mean? Basically, pointcuts are rewritten in DNF (Disjunctive Normal Form) and the components of the pointcut are sorted such that those components that are cheaper to evaluate are checked first. 

    > This means you do not have to worry about understanding the performance of various pointcut designators and may supply them in any order in a pointcut declaration.

为了优化匹配的性能，在定义切点表达式的时候应该尽可能地缩小匹配空间的范围。

AspectJ的PCD可以划分为如下三种类型(kinded, scoping, contextual):

> 一个好的切点表达式应该至少包含前两种类型（kinded, scoping）。

- Kinded designators select a particular kind of join point: `execution`, `get`, `set`, `call`, and `handler`.
- Scoping designators select a group of join points of interest (probably of many kinds): `within` and `withincode`
- Contextual designators match (and optionally bind) based on context: `this`, `target`, and `@annotation`

## 6. 定义增强

### 6.1 增强的类型

SpringAOP中有5种增强方式，其相应的注解如下，其使用语法均为`@增强注解("切点表达式")`：

|     名称     |       注解        |                             说明                             |
| :----------: | :---------------: | :----------------------------------------------------------: |
|   前置增强   |     `@Before`     | 增强动作在切点方法调用之前执行。若前置增强抛异常，则切点方法将无法执行。 |
|  返回后增强  | `@AfterReturning` |              增强动作在切点方法正常返回之后执行              |
| 异常抛出增强 | `@AfterThrowing`  |              增强动作在切点方法抛出异常之后执行              |
|   后置增强   |     `@After`      | 增强动作无视切点方法是否正常返回或发生异常，其总在切点方法执行退出后执行 |
|   环绕增强   |     `@Around`     | 增强动作会将切点方法封装起来，可以选择在切点方法执行的前后各执行一段处理，并可以选择是否执行该切点方法，还可以自由地返回任意数据作为切点方法的返回值或直接抛出异常。环绕增强是最强大的一种增强。 |

> 在选择增强的类型时，在满足业务要求的情况下，建议选择最小强度的增强类型。

### 6.2 增强方法的特殊说明

对于冠以以上增强注解的增强方法：

- 联结点信息：即`JoinPoint`，其包含了类名、被切面的方法名，参数等属性，可供读取使用。

    - 每个增强方法里都可以根据需要加上或者不加参数`JoinPoint`。
- 如果加参数`JoinPoint`的话，应该将其声明在第一个形参的位置。
    - 对于`@Around`方法，其联结点参数类型还可以使用类型`ProceedingJoinPoint`，该类型实际上是`JoinPoint`子接口。

- `@AfterReturning`方法里，可以通过注解中的`returning = “xxx”`，以`xxx`形参接收切点方法的返回值（同一个引用）。

    > 注意，与此同时，这也成为切点表达式匹配联结点的一个限制条件：联结点的返回类型必须符合相应的类型。

- `@AfterThrowing`方法里，可以通过注解中的`throwing = “xxx”`，以`xxx`形参获取切点方法的异常信息。

    > 注意，与此同时，这也成为切点表达式匹配联结点的一个限制条件：联结点的异常类型必须符合相应的类型。

- `@Around`方法

    - 增强方法的返回值将会作为切点方法的返回值，通常应该将返回值类型声明为`Object`类型。
    - 第一个形参必须是`ProceedingJoinPoint`类型。

### 6.3 增强方法的参数

#### Jointpoint与ProceedingJoinPoint

- JoinPoint

    ```java
    public interface JoinPoint {
        /**
         * 获取联结点方法运行时的入参列表
         */
        Object[] getArgs();
        /**
         * 获取联结点的方法签名对象
         */
        Signature getSignature();
        /**
         * 获取联结点所在的目标对象
         */
        Object getTarget();
        /**
         * 获取代理对象本身
         */
        Object getThis();
        /**
         * 获取联结点方法的一个描述信息
         */
        String toString();
    
        String toShortString();
    
        String toLongString();
    
        String getKind();
        
        SourceLocation getSourceLocation();
    
        JoinPoint.StaticPart getStaticPart();
    
        public interface EnclosingStaticPart extends JoinPoint.StaticPart {
        }
        
        // ...
    }
    ```

- ProceedingJoinPoint

    ```java
    package org.aspectj.lang;
    
    import org.aspectj.runtime.internal.AroundClosure;
    
    public interface ProceedingJoinPoint extends JoinPoint {
        /**
         * 通过反射执行目标对象的联结点处的方法
         */
        Object proceed() throws Throwable;
        /**
         * 通过反射执行目标对象联结点处的方法，不过使用新的入参替换原来的入参
         */
        Object proceed(Object[] var1) throws Throwable;
        
        void set$AroundClosure(AroundClosure var1);
    
        default void stack$AroundClosure(AroundClosure arc) {
            throw new UnsupportedOperationException();
        }
    
    }
    ```

#### 传递实参

> To make argument values available to the advice body, you can use the binding form of `args`.

If you use a parameter name in place of a type name in an `args` expression, the value of the corresponding argument is passed as the parameter value when the advice is invoked.

对于PCD里的`args`表达式（`this`, `target`, `@within`, `@target`, `@annotation`, `@args`同理），如果传入的不再是一个类型的全限定名，而是一个普通形参名，同时将原类型名与新的形参名对应着写到增强方法的参数列表中，则可将目标方法执行时的实参传入增强方法中。例如：

```java
@Before("com.xyz.myapp.CommonPointcuts.dataAccessOperation() && args(account,..)")
public void validateAccount(Account account) {
    // ...
}
```

此时，上例中切点表达式中的 `args(account,..)` 有两个作用：

- 限制切点表达式匹配的联结点必须至少含有一个参数且为`Account`类型；
- 使得切点方法 `Account` 类型的参数值通过`account`变量传递给了增强方法。

另一种达成相同功能的类似写法是，定义一个`@Pointcut`方法来接收 `Account` 对象，然而在相应的增强方法中引用该`@Pointcut`方法。代码如下：

```java
@Pointcut("com.xyz.myapp.CommonPointcuts.dataAccessOperation() && args(account,..)")
private void accountDataAccessOperation(Account account) {}

@Before("accountDataAccessOperation(account)")
public void validateAccount(Account account) {
    // ...
}
```

#### 传递实参：泛型

SpringAOP也能处理在类声明或方法形参里的泛型。对于如下的接口：

```java
public interface Sample<T> {
    void sampleGenericMethod(T param);
    void sampleGenericCollectionMethod(Collection<T> param);
}
```

通过在增强方法中显示指定类型，可以令AOP只拦截对应类型的方法：

```java
@Before("execution(* ..Sample+.sampleGenericMethod(*)) && args(param)")
public void beforeSampleMethod(MyType param) {
    // Advice implementation
}
```

不过，这种方法对集合类型是无效的，所以下述代码其实发挥不了希望的作用：

```java
@Before("execution(* ..Sample+.sampleGenericCollectionMethod(*)) && args(param)")
public void beforeSampleMethod(Collection<MyType> param) {
    // Advice implementation
}
```

> To make this work, we would have to inspect every element of the collection, which is not reasonable, as we also cannot decide how to treat `null` values in general. To achieve something similar to this, you have to type the parameter to `Collection<?>` and manually check the type of the elements.

#### 参数绑定关系

> 指的是注解中的变量与增强方法中形参的绑定？

The parameter binding in advice invocations relies on matching names used in pointcut expressions to declared parameter names in advice and pointcut method signatures. 

Parameter names are not available through Java reflection, so Spring AOP uses the following strategy to determine parameter names:

- 所有的增强注解及@Pointcut注解都有一个 `argNames` 属性可以用来显式指定注解方法（即增强方法？）中对应的形参名。如：

    ```java
    @Before(value="com.xyz.lib.Pointcuts.anyPublicMethod() && target(bean) && @annotation(auditable)",
            argNames="bean,auditable")
    public void audit(Object bean, Auditable auditable) {
        AuditCode code = auditable.value();
        // ... use code and bean
    }
    ```

- If the `argNames` attribute has not been specified, Spring AOP looks at the debug information for the class and tries to determine the parameter names from the local variable table. 

    > This information is present as long as the classes have been compiled with debug information (`-g:vars` at a minimum). 

    > If an @AspectJ aspect has been compiled by the AspectJ compiler (`ajc`) even without the debug information, you need not add the `argNames` attribute, as the compiler retain the needed information.

- 如果代码编译后无法找到任何debug信息，SpringAOP将尝试自己去推断绑定变量与方法参数的配对（比如，如果注解中和方法中均只有一个参数，这种配对是很明显的）。如果在推断过程中发现这种绑定关系是模棱两可的，Spring会抛出一个`AmbiguousBindingException`异常。

- 如果上述所有策略都失败，Spring会抛出一个`IllegalArgumentException`异常。

值得一提的是，如果增强方法中第一个形参是 `JoinPoint`, `ProceedingJoinPoint`,  `JoinPoint.StaticPart` 类型，这种匹配完全不需要依赖 `argNames` 属性，因此 `argNames` 中可以不申明这个参数。

## 7. 增强方法的执行顺序

### 同一 aspect、不同 advice 

执行顺序如下：

<img src="https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/Spring/25.svg" alt="AOP增强方式" style="zoom:67%;" />

需要注意的是，对于`@Around`环绕增强，如果增强方法内部没有调用 `pjp.proceed()`，那么将导致其他的增强方法失去了判断执行的入口，其他类型的增强advice将失效！

### 不同 aspect、同一advice

Spring可以支持多个切面同时运行，如果刚好多个切面的切点相同，切面的运行顺序便很重要了。默认情况下，切面的运行顺序是混乱的（undefined），如果需要指定切面的运行顺序，Spring AOP 通过指定`aspect`的优先级来控制。具体有两种方式：

- Aspect 类添加**注解**：`org.springframework.core.annotation.Order`，使用注解`value`属性指定优先级。
- Aspect 类实现**接口**：`org.springframework.core.Ordered`，实现 `Ordered` 接口的 `getOrder()` 方法。

`@Order` 注解用来声明组件的顺序，值越小，优先级越高，即越先被执行/初始化。如果没有该注解，则优先级最低。

```java
@Order(1)
@Aspect
@Component
public class FirstAspect {
  ……
}

@Order(2)
@Aspect
@Component
public class SecondAspect {
  ……
}
```

`@Order`注解中的值就是切面的顺序，但对于切面而言，他们不是顺序执行的先后关系而是包含关系：先入后出、后入先出。

![AOP不同切面执行顺序](https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/Spring/26.png)

### 同一 aspect、相同 advice 的执行顺序

同一aspect、相同advice的执行顺序是无法确定的， `@Order` 在advice方法上也无效，因此尽量不用使用这种方式。

## 8. 引入

**引入**指一个切面能够为目标对象实现（引入）一个指定的接口。

> Introductions (known as inter-type declarations in AspectJ) enable an aspect to declare that advised objects implement a given interface, and to provide an implementation of that interface on behalf of those objects.

创建引入使用 `@DeclareParents` 注解，该注解的作用为某一个类（目标对象）声明一个新的父接口：

- 此注解修饰的字段的类型，即是待实现的父接口的类型；
- `value`属性是一个AspectJ的type pattern，用以匹配目标对象；
- `defaultImpl`是为指定的父接口提供一个默认的实现类；

例如，给定一个`UsageTracked`接口及其实现类 `DefaultUsageTracked`，如下切面宣告了所有的service包下的接口的实现类同时实现了`UsageTracked`接口：

```java
@Aspect
public class UsageTracking {

    @DeclareParents(value="com.xzy.myapp.service.*+", defaultImpl=DefaultUsageTracked.class)
    public static UsageTracked mixin;

    @Before("com.xyz.myapp.CommonPointcuts.businessService() && this(usageTracked)")
    public void recordUsage(UsageTracked usageTracked) {
        usageTracked.incrementUseCount();
    }

}
```

## 9. AOP代理类的自调用

这里所谓的**自调用**，是指一个类的方法调用本类的其他方法。

### 代码的粒度

当一个切面对一个业务类生效时，我们使用的业务类对象实际上是Spring帮我们生成的一个代理对象，而这个代理的粒度，是**类级别**的。

正因为AOP代理的粒度是类级别的，所以在自调用时不会走其切面逻辑。例如，Spring的事务管理中有个 `@Transactional` 注解可以方便的管理事务，其是基于 AOP 实现的，该注解在这样的情况下会失效：“外部类调用本类的一个没有 `@Transactional` 注解的函数，而该函数调用本类的一个有 `@Transactional` 注解的函数”，失效原因就是因为代理是类级别的。

```java
@Aspect
@Component
public class Aspect {
    // 前置增强Test
    @Before("execution(* TargetBean.hi(..))")
    public void before(JoinPoint joinPoint){
        System.out.println("--------我是前置通知--------");
    }
}

@Component
public class TargetBean {

    // 一个切点方法
    public void hi() {
        System.out.println("hi");
    }
    
    // 一个非切点方法，但调用了上面的切点方法
    public void hello() {
        System.out.println("hello");
        this.hi(); // 调用上述切点方法，发现并未走其对应的增强方法
    }
}
```

为什么要这样设计呢？其实技术上也能实现自调用时也走切面逻辑，比如 [cglib 的 MethodInterceptor](https://www.letianbiji.com/java/java-cglib.html)。然而，有些场景自调用走代理更合适，而另外一些场景不走代理更合适，因此选择类级别的代理是权衡的结果。

### 如何让自调用走代理？

有两种方式，但其本质其实是一个道理，即获取本类被代理后的对象。

1. 自注入

    ```java
    @Component
    public class TargetBean {
        @Autowired
        private TargetBean self;  // 注入自己，此时注入的是代理后的对象
    
        public void hi() {
            System.out.println("hi");
        }
        
        public void hello() {
            System.out.println("hello");
            self.hi(); // 会调用到增强方法
        }
    }
    ```

2. 手动获取当前代理：`AopContext.currentProxy()`

    ```java
    @EnableAspectJAutoProxy(exposeProxy = true) // 需开启exposeProxy = true
    @Component
    public class TargetBean {
    
        public void hi() {
            System.out.println("hi");
        }
        
        public void hello() {
            System.out.println("hello");
            TargetBean self = (TargetBean) AopContext.currentProxy();  // 获取当前代理
            self.hi();
        }
    }
    ```

