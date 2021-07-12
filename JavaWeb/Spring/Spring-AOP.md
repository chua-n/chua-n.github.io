## 1. 概念

**AOP(Aspect Oriented Programming)**为面向切面编程，是通过预编译方式和运行期**动态代理**实现程序功能的统一维护的一种技术。

AOP 是 OOP 的延续，是软件开发中的一个热点，也是 Spring 框架中的一个重要内容，是函数式编程的一种衍生范型。利用 AOP 可以对业务逻辑的各个部分进行隔离，从而使得业务逻辑各部分之间的耦合度降低，提高程序的可重用性，同时提高了开发的效率。

AOP 的作用：在程序运行期间，在不修改源码的情况下对方法进行功能增强。

AOP 的优势：减少重复代码，提高开发效率，便于维护。

AOP技术在Spring中实现的内容：Spring框架监控切点方法的执行，一旦监控到切入点方法被运行，即使用代理机制，动态创建目标对象的代理对象，根据通知类别在代理对象的相应位置将Advice对应的功能织入，完成完整的代码逻辑运行。

## 2. AOP 的底层实现

通过 Spring 提供的动态代理技术实现——在运行期间，Spring 通过动态代理技术动态地生成代理对象，**代理对象**在执行相应方法时进行增强功能的注入，再去调用**目标对象**的方法，从而完成功能的增强。

> 常用的动态代理技术：
>
> -   JDK 代理：基于接口的动态代理技术
> -   cglib 代理 ：基于父类的动态代理技术
>
> ![17](https://chua-n.gitee.io/blog-images/notebooks/JavaWeb/Spring/17.png)

Spring 的 AOP 实现底层就是对 JDK 代理、cglib 代理的方式进行了封装，封装后我们只需要对需要关注的部分进行代码编写，并通过配置的方式完成指定目标的方法增强。

在 Spring 中，框架会根据目标类是否实现了接口来决定采用哪种动态代理的方式。

## 3. AOP 的常用术语

| 术语      | 中文      | 含义                                                                                                                                 |
| --------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Target    | 目标对象  | 代理的目标对象                                                                                                                       |
| Proxy     | 代理      | 一个类被 AOP 织入增强后，就产生一个结果代理类                                                                                        |
| Joinpoint | 连接点    | 所谓连接点是指那些被拦截到的点。在 Spring 中这些点指的就是**方法**，因为 Spring 只支持方法类型的连接点。“可以被增强的方法叫连接点。” |
| Pointcut  | 切入点    | 所谓切入点是指我们要对哪些 Joinpoint 进行拦截的定义，简称**切点**。“真正被增强了的方法叫切入点。”                                    |
| Advice    | 通知/增强 | 所谓通知（增强）是指拦截到 Joinpoint 之后所要做的事情                                                                                |
| Aspect    | 切面      | 切入点和通知的结合                                                                                                                   |
| Weaving   | 织入      | 是指把 Advice 应用到目标对象来创建新的代理对象的过程。Spring 采用动态代理织入，而 AspectJ 采用编译器织入和类装载器织入               |

通俗来讲：

- Pointcut(切点)：被增强的方法；
- Advice(通知)：封装增强业务逻辑的方法；
- Aspect(切面)：切点+通知；
- Weaving(织入)：将切点与通知结合的过程。

## 4. Spring AOP开发——基于XML

基于XML的AOP开发流程：

1. 导入AOP相关坐标；
2. 创建目标接口和目标类（内部有切点）；
3. 创建切面类（内部有增强方法）；
4. 将目标类和切面类的对象创建权交给Spring；
5. 在applicationContext.xml中配置织入关系；
6. 测试代码。

### 4.1 快速入门案例

pom.xml

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-context</artifactId>
        <version>5.0.5.RELEASE</version>
    </dependency>
    <dependency>
        <groupId>org.aspectj</groupId>
        <artifactId>aspectjweaver</artifactId>
        <version>1.8.4</version>
    </dependency>
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-test</artifactId>
        <version>5.0.5.RELEASE</version>
    </dependency>
    <dependency>
        <groupId>junit</groupId>
        <artifactId>junit</artifactId>
        <version>4.12</version>
    </dependency>
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-test</artifactId>
        <version>5.0.5.RELEASE</version>
        <scope>test</scope>
    </dependency>
</dependencies>
```

TargetInterface.java

```java
package com.itheima.aop;
public interface TargetInterface {
    public void save();
}
```

Target.java

```java
package com.itheima.aop;
public class Target implements TargetInterface {
    public void save() {
        System.out.println("save running...");
    }
}
```

MyAspect.java

```java
package com.itheima.aop;
public class MyAspect {
    public void test() {
        System.out.println("前置增强......");
    }
}
```

applicationContext.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:apo="http://www.springframework.org/schema/aop"
    xmlns:aop="http://www.springframework.org/schema/aop" xsi:schemaLocation="
       http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
       http://www.springframework.org/schema/aop http://www.springframework.org/schema/aop/spring-aop.xsd
">
    <!-- 目标对象 -->
    <bean id="target" class="com.itheima.aop.Target"/>
    <!-- 切面对象 -->
    <bean id="myAspect" class="com.itheima.aop.MyAspect"/>
    <!--  配置织入：告诉Spring哪些方法（切点）需要进行哪些增强（前置、后置等）  -->
    <aop:config>
        <!--  声明切面  -->
        <aop:aspect ref="myAspect">
            <apo:before method="test" pointcut="execution(public void com.itheima.aop.Target.save())"/>
        </aop:aspect>
    </aop:config>
</beans>
```

测试代码

```java
package com.itheima.test;
import com.itheima.aop.TargetInterface;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration("classpath:applicationContext.xml")
public class AopTest {
    @Autowired
    private TargetInterface target;
    @Test
    public void test1() {
        target.save();
    }
}
```

### 4.2 配置XML

#### 4.2.1 切点表达式

切点表达式的写法：`execution([修饰符] 返回值类型 包名.类名.方法名(参数))`

- 访问修饰符可以省略不写；
- 返回值类型、包名、类名、方法名可以用*代表任意；
- 包名与类名之间一个点.代表当前包下的类，两个点..表示当前包及其子包下的类；
- 参数列表可以使用两个点..表示任意个数、任意类型的参数列表。

示例：

![18](https://chua-n.gitee.io/blog-images/notebooks/JavaWeb/Spring/18.png)

#### 4.2.2 通知

![19](https://chua-n.gitee.io/blog-images/notebooks/JavaWeb/Spring/19.png)

#### 4.2.3 小知识点——切点表达式的抽取

当有多个切点表达式相同时，可以将切点表达式进行抽取，在增强中使用pointcut-ref属性代替pointcut属性来引用抽取后的切点表达式。

![20](https://chua-n.gitee.io/blog-images/notebooks/JavaWeb/Spring/20.png)

## 5. Spring AOP开发——基于注解

> 来源： https://b23.tv/GAAFVz 视频的P49。

基于注解的AOP开发流程：

1. 创建目标接口和目标类（内部有切点）；
2. 创建切面类（内部有增强方法）；
3. 将目标类和切面类的对象创建权交给Spring；
4. 在切面类中使用注解配置织入关系；
5. 在配置文件中开启组件扫描和AOP的自动代理；
6. 测试。

注解配置AOP详解：

- 通知的注解类型：`@通知注解("切点表达式")`

    ![21](https://chua-n.gitee.io/blog-images/notebooks/JavaWeb/Spring/21.png)

- 切点表达式的抽取：抽取方式是在该方法上使用@Pointcut注解定义切点表达式，然后在增强注解中进行引用。

    ![22](https://chua-n.gitee.io/blog-images/notebooks/JavaWeb/Spring/22.png)

使用注解的开发步骤：

1. 使用`@Aspect`标注切面类；
2. 使用`@通知注解`标注通知方法；
3. 在配置文件中配置AOP自动代理：`<aop:aspectj-autoproxy/>`。

