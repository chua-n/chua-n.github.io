## 增强方法的执行顺序

### 同一 aspect、不同 advice 

执行顺序如下：

<img src="../../resources/images/notebook/JavaWeb/Spring/25.svg" alt="AOP增强方式" style="zoom:67%;" />

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

![AOP不同切面执行顺序](../../resources/images/notebook/JavaWeb/Spring/26.png)

### 同一 aspect、相同 advice 的执行顺序

同一aspect、相同advice的执行顺序是无法确定的， `@Order` 在advice方法上也无效，因此尽量不用使用这种方式。

## AOP代理类的自调用

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

