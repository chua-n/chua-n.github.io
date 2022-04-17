## 1. 概念

**AOP(Aspect Oriented Programming)** ，直译过来即为面向切面编程。AOP 是一种编程思想，是面向对象编程OOP的一种补充，提供了与 OOP 不同的抽象软件结构的视角。在 OOP 中，我们以类(class)作为我们的基本单元，而 AOP 中的基本单元是切面(Aspect)。好比下图，所谓切面，相当于应用对象间的横切点，我们可以将其单独抽象为单独的模块。

![img](../../resources/images/notebook/JavaWeb/Spring/24.png)

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

### Spring-AOP 的底层实现

> spring关于AOP的spring-aspects包中引用了aspectjweaver。
>
> 相比于 AspectJ 的面向切面编程，Spring AOP 也有一些局限性，但是已经可以解决开发中的绝大多数问题了，如果确实遇到了 Spring AOP 解决不了的场景，我们依然可以在 Spring 中使用 AspectJ 来解决。

AOP技术在Spring中实现的内容：Spring框架监控切点方法的执行，一旦监控到切入点方法被运行，即使用代理机制，动态创建目标对象的代理对象，根据通知类别在代理对象的相应位置将Advice对应的功能织入，完成完整的代码逻辑运行。

通过 Spring 提供的动态代理技术实现——在运行期间，Spring 通过动态代理技术动态地生成代理对象，**代理对象**在执行相应方法时进行增强功能的注入，再去调用**目标对象**的方法，从而完成功能的增强。

> 常用的动态代理技术：
>
> -   JDK 代理：基于接口的动态代理技术
> -   cglib 代理 ：基于父类的动态代理技术
>
> <img src="https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/Spring/17.png" alt="17" style="zoom:50%;" />

Spring 的 AOP 实现底层就是对 JDK 代理、cglib 代理的方式进行了封装，封装后我们只需要对需要关注的部分进行代码编写，并通过配置的方式完成指定目标的方法增强。

在 Spring 中，框架会根据目标类是否实现了接口来决定采用哪种动态代理的方式。

### AOP 术语

|   术语    |   中文   | 含义                                                         |
| :-------: | :------: | ------------------------------------------------------------ |
|  Target   | 目标对象 | 要代理的目标对象                                             |
|   Proxy   |   代理   | 一个（目标对象的）类被 AOP 织入增强后，就产生一个代理类      |
|  Advice   |   增强   | 代理要对目标对象进行的具体的增强处理（这里对advice译为增强，为意译） |
| Joinpoint |  连接点  | 表示应用执行过程中能够插入切面的一个点，这个点可以是方法的调用、异常的抛出。<br />在 Spring AOP 中，连接点总是方法的调用。 |
| Pointcut  |   切点   | 可以插入增强处理的连接点                                     |
|  Aspect   |   切面   | 切点和增强的结合                                             |
|  Weaving  |   织入   | 描述了把增强处理添加到目标对象、并创建一个被增强的对象（代理）这一过程，不对应一份实体。<br />Spring 采用动态代理织入， AspectJ 采用编译器织入和类装载器织入。 |

## 2. Spring AOP开发

> 以注解配置为例。

### 2.1 入门案例

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

4. 加入切面

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

### 2.2 切点表达式

Spring AOP 中的切点表达式是AspectJ的一个子集，其支持的写法有：

> 在spring中尝试使用其他AspectJ指示器时，将会抛出IllegalArgumentException异常。

| AspectJ表达式 |                             说明                             |
| :-----------: | :----------------------------------------------------------: |
| `execution()` |                  用于匹配是连接点的执行方法                  |
|   `this()`    |        限制连接点匹配AOP代理的Bean引用为指定类型的类         |
| `@annotation` |                  限制匹配带有指定注解连接点                  |
|    `arg()`    |            限制连接点匹配参数为指定类型的执行方法            |
|   `@args()`   |          限制连接点匹配参数由指定注解标注的执行方法          |
|  `target()`   |             限制连接点匹配目标对象为指定类型的类             |
|  `@target()`  | 限制连接点匹配选定的执行对象，这些对象对应的类要具备指定类型的注解 |
|  `within()`   |                   限制连接点匹配指定的类型                   |
|  `@within()`  | 限制连接点匹配注解所标注的类型（当使用Spring AOP时，方法定义在由定注解所标注的类里） |

对于上面的切点表达式，只有execution表达式是唯一的执行匹配，其他的表达式都是用于限制匹配的。这说明execution是我们在编写切点定义时最主要使用的表达式，在此基础上，我们使用其他表达式来限制所匹配的切点。

多个匹配之间我们可以使用链接符 `&&`、`||`、`！`来表示 “且”、“或”、“非”的关系。不过，在使用 XML 文件配置时，这些符号有特殊的含义，所以相应使用 “and”、“or”、“not”来表示。

#### execution表达式

execution切点表达式的写法：`execution([修饰符] 返回值类型 包名.类名.方法名(参数))`

- 访问修饰符可以省略不写；
- 返回值类型、包名、类名、方法名可以用*代表任意；
- 包名与类名之间一个点.代表当前包下的类，两个点..表示当前包及其子包下的类；
- 参数列表可以使用两个点..表示任意个数、任意类型的参数列表。

示例：

```java
execution(public void com.itheima.aop.Target.method())
execution(void com.itheima.aop.Target.*(..))
execution(* com.itheima.aop.*.*(..))
execution(* com.itheima.aop..*.*(..))
execution(* *..*.*(..))
```

### 2.3 增强

#### 增强的类型

SpringAOP中有5种增强方式，其相应的注解如下，其使用语法均为`@通知注解("切点表达式")`：

|     名称     |       注解        |                             说明                             |
| :----------: | :---------------: | :----------------------------------------------------------: |
|   前置增强   |     `@Before`     |                增强方法在切点方法调用之前执行                |
|  返回后增强  | `@AfterReturning` |                增强方法在切点方法返回之后执行                |
| 异常抛出增强 | `@AfterThrowing`  |               增强方法在切点方法抛出异常后执行               |
|   后置增强   |     `@After`      |       增强方法会在切点方法正常返回或发生异常后都会执行       |
|   环绕增强   |     `@Around`     | 增强方法会将切点方法封装起来，可以选择在切点方法执行的前后各执行一段处理 |

对于冠以以上增强注解的增强方法：

- 连接点信息：即`JoinPoint`，其包含了类名、被切面的方法名，参数等属性，可供读取使用。

    - 每个增强方法里都可以根据需要加上或者不加参数`JoinPoint`。

    - 对于`@Around`方法，其连接点参数类型还可以使用类型`ProceedingJoinPoint`，该类型实际上是`JoinPoint`子接口。

- `@AfterReturning`方法里，可以通过注解中的`returning = “xxx”`，以xxx形参接收切点方法的返回值。

- `@AfterThrowing`方法里，可以通过注解中的`throwing = “xxx”`，以xxx形参获取切点方法的异常信息。

#### Jointpoint与ProceedingJoinPoint

- JoinPoint

    ```java
    public interface JoinPoint {
        /**
         * 获取连接点方法运行时的入参列表
         */
        Object[] getArgs();
        /**
         * 获取连接点的方法签名对象
         */
        Signature getSignature();
        /**
         * 获取连接点所在的目标对象
         */
        Object getTarget();
        /**
         * 获取代理对象本身
         */
        Object getThis();
        
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
         * 通过反射执行目标对象的连接点处的方法
         */
        Object proceed() throws Throwable;
        /**
         * 通过反射执行目标对象连接点处的方法，不过使用新的入参替换原来的入参
         */
        Object proceed(Object[] var1) throws Throwable;
        
        void set$AroundClosure(AroundClosure var1);
    
        default void stack$AroundClosure(AroundClosure arc) {
            throw new UnsupportedOperationException();
        }
    
    }
    ```

#### @Pointcut注解抽取切点表达式

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

### 2.4 增强方法的执行顺序

#### 同一 aspect、不同 advice 

执行顺序如下：

<img src="../../resources/images/notebook/JavaWeb/Spring/25.svg" alt="AOP增强方式" style="zoom:67%;" />

需要注意的是，对于`@Around`环绕增强，如果增强方法内部没有调用 `pjp.proceed()`，那么将导致其他的增强方法失去了判断执行的入口，其他类型的增强advice将失效！

#### 不同 aspect、同一advice

Spring可以支持多个切面同时运行，如果刚好多个切面的切点相同，切面的运行顺序便很重要了。默认情况下，切面的运行顺序是混乱的，如果需要指定切面的运行顺序，Spring AOP 通过指定`aspect`的优先级来控制。具体有两种方式：

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

![AOP不同切面执行顺序](../../resources/images/notebook/JavaWeb/Spring/26.png)

#### 同一 aspect、相同 advice 的执行顺序

同一aspect、相同advice的执行顺序是无法确定的， `@Order` 在advice方法上也无效，因此尽量不用使用这种方式。

### 2.5 AOP代理类的自调用

这里所谓的**自调用**，是指一个类的方法调用本类的其他方法。

#### 代码的粒度

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

#### 如何让自调用走代理？

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

