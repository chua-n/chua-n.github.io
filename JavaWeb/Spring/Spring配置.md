## 1. XML配置

### 1.1 bean标签

bean标签用于配置将由Spring来创建的对象。默认情况下它调的是类中的无参构造函数，如果没有无参构造函数则不能成功创建。

#### 基本属性配置

| 基本属性 | 作用                                                         |
| :------: | ------------------------------------------------------------ |
|    id    | Bean实例（Bean对象）在Spring容器中的唯一标识（若未指定id，默认使用其全限定名作为id） |
|  class   | Bean的全限定名称                                             |
|  scope   | 指对象的作用范围，可取值为`singleton, prototype, request, session, global session` |

scope的取值：

- `singleton`：单例的（默认值）
    - Bean的实例化个数：1个
    - Bean的实例化时机：当Spring核心文件被加载时实例化Bean实例
    - Bean的生命周期：
        - 对象创建：当应用加载，创建容器时，对象就被创建了
        - 对象运行：只要容器在，对象就一直活着
        - 对象销毁：当应用卸载，销毁容器时，对象就被销毁了
- `prototype`：多例的
    - Bean的实例化个数：多个
    - Bean的实例化时机：当调用`getBean()`方法时实例化Bean实例
    - Bean的生命周期：
        - 对象创建：当使用对象时，创建新的对象实例
        - 对象运行：只要对象在使用中，就一直活着
        - 对象销毁：当对象长时间不用时，被Java的垃圾回收器回收

#### Bean生命周期属性配置

|      方法      |           作用           |
| :------------: | :----------------------: |
|  init-method   | 指定类中的初始化方法名称 |
| destroy-method |  指定类中的销毁方法名称  |

#### Bean实例化三种方式

1. 无参构造函数实例化

    ```xml
    <bean id="userDao" class="com.itheima.dao.impl.UserDaoImpl"
    init-method="init" destroy-method="destroy"></bean>
    ```

2. 工厂静态方法实例化

    ```xml
    <bean id="userDao" class="com.itheima.factory.StaticFactory" factory-method="getUserDao"></bean>
    ```

3. 工厂实例方法实例化

    ```xml
    <bean id="factory" class="com.itheima.factory.DynamicFactory"/>
    <bean id="userDao" factory-bean="factory" factory-method="getUserDao"/>
    ```

### 1.2 Bean的依赖注入

在编写程序时，通过控制反转，把对象的创建权交给了Spring，但是代码中不可能出现没有依赖的情况，而IoC解耦只是降低他们的依赖关系，但不会消除，例如：业务层仍会调用持久层的方法。

这种业务层和持久层的依赖关系，在使用Spring之后，就让Spring来维护了，简单地说，就是坐等框架把持久层对象传入业务层，而不用我们自己去获取，这些便由所谓的依赖注入去实现。

**依赖注入**(Dependency Injection, DI)，是Spring框架核心IoC的具体实现，依赖注入表示组件之间的依赖关系由容器在运行期决定，形象的说，即由容器动态的将某个依赖关系注入到组件之中。

#### 引导案例

对于两个类UserService和UserDao，它们都在Spring容器中，前者的代码定义中需要使用到后者。以前的做法是在容器外部获得UserService实例和UserDao实例，然后在程序中进行结合；然而，最终程序直接使用的是UserService，所以更好的方式是：在Spring容器中，将UserDao设置到UserSerivice内部。

<img src="https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/Spring/11.png" alt="11" style="zoom:50%;" />

以Spring进行依赖注入后的效果如下图：

<img src="https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/Spring/12.png" alt="12" style="zoom:50%;" />

#### 依赖注入的方式

1. 属性注入——通过`setXxx()`方法：

    - 采用`<property>`子标签注入；其中`name`属性指定bean的属性名称，`value`属性指定属性的值。

        - 对于普通属性，直接指定：

            ```xml
            <!-- fullname为String类型 -->
            <property name="fullname" value="张三"></property>
            ```

        - 若属性值为其他bean，使用`ref`来引用：

            ```xml
            <property name="person" ref="person"></property>
            ```

            > 附：Person类的定义及其bean配置为：
            >
            > ```java
            > package com.glodon.pojo;
            > 
            > import lombok.Data;
            > 
            > @Data
            > public class Person {
            >     private String name;
            >     private int age;
            >     private boolean sex;
            > }
            > ```
            >
            > ```xml
            > <bean id="person" class="com.glodon.pojo.Person">
            >     <property name="name" value="张三"/>
            >     <property name="age" value="26"/>
            >     <property name="sex" value="true"/>
            > </bean>
            > ```

        - 若属性值为集合类型：

            ```xml
            <!-- fruit 为String[]类型 -->
            <property name="fruit">
                <list value-type="java.lang.String">
                    <value>apple</value>
                    <value>orange</value>
                    <value>banana</value>
                </list>
            </property>
            
            <!-- family 为Map<String, String>类型 -->
            <property name="family">
                <map key-type="java.lang.String" value-type="java.lang.String">
                    <entry key="father" value="lisi"/>
                    <entry key="mother" value="wangpo"/>
                    <entry key="sister" value="wuliu"/>
                </map>
            </property>
            ```

    - 可采用p命名空间注入，此时可采用属性的方式去注入。

2. 构造器注入（不常用）——需使用有参构造方式，采用`<constructor-arg>`标签；

    - 可按索引匹配入参

        ```xml
        <bean id="car" class="com.atguigu.spring.helloworld.Car">
        	<constructor-arg value="奥迪" index="0"></constructor-arg>
            <constructor-arg value="长春一汽" index="1"></constructor-arg>
            <constructor-arg value="500000" index="2"></constructor-arg>
        </bean>
        ```

    - 可按类型匹配入参

        ```xml
        <bean id="car" class="com.atguigu.spring.helloworld.Car">
        	<constructor-arg value="奥迪" type="java.lang.String"></constructor-arg>
            <constructor-arg value="长春一汽" type="java.lang.String"></constructor-arg>
            <constructor-arg value="500000" type="double"></constructor-arg>
        </bean>
        ```

3. 工厂方法注入（很少使用，不推荐）

另：依赖注入的数据类型对应的属性/标签：

- 普通数据类型：`value="…"`
- 引用其他bean：`ref="…"`
- 集合数据类型：`<list>、<map>`等子标签

#### 内部Bean

当 Bean 实例**仅仅**给一个特定的属性使用时, 可以将其声明为内部 Bean. 内部 Bean 声明直接包含在 `<property>` 或 `<constructor-arg>` 元素里, 不需要设置任何 id 或 name 属性。

<font color="red">???????</font>

### 1.3 分模块开发

Spring的配置文件可**分模块开发**，此时在主配置文件中引用其他配置文件的方法为使用`<import>`标签加载：

`<import resource="applicationContext-xxx.xml"/>`

### 1.4 Spring的重点配置

`<bean>`标签

- id属性：在容器中Bean实例的唯一标识，不允许重复
- class属性：要实例化的Bean的全限定名
- scope属性：Bean的作用范围，常用的是singleton和prototype
- `<property>`标签：通过set方法注入
    - name属性：属性名称
    - value属性：注入的普通属性值
    - ref属性：注入的对象引用值
    - `<list>`标签
    - `<map>`标签
    - `<props>`标签
- `<constructor-arg>`标签：通过构造方法注入
    - …（同上）

`<import>`标签：导入其他的Spring配置分文件

## 2. 注解配置

Spring是轻代码而重配置的框架，配置比较繁重，影响开发效率，所以注解开发是一种趋势，注解代替xml配置文件可以简化配置，提高开发效率。

Spring“原始注解”与“新注解”主要是一种逻辑上的区分。

### 2.1 原始注解

使用原始注解进行开发时，需要在applicationContext.xml中配置组件扫描，其作用是指定哪个包（及其子包）下的Bean需要进行扫描以便识别使用注解配置的类、字段和方法。

```xml
<!--配置组件扫描-->
<context:component-scan base-package="com.itheima"></context:component-scan>
```

| 原始注解         | 解释                                                      |
| ---------------- | --------------------------------------------------------- |
| `@Component`     | 使用在类上，用于实例化Bean                                |
| `@Controller`    | @Component的衍生注解：使用在Web层上，用于实例化Bean       |
| `@Service`       | @Component的衍生注解：使用在service层类上，用于实例化Bean |
| `@Repository`    | @Component的衍生注解：使用在dao层类上，用于实例化Bean     |
| `@Autowired`     | 通常使用在字段上，用于根据Bean的类型进行依赖注入          |
| `@Qualifier`     | 结合@Autowired一起使用用于同时根据类型和名称进行依赖注入  |
| `@Resource`      | 相当于@Autowired+@Qualifier，按照名称进行注入             |
| `@Value`         | 注入普通属性                                              |
| `@Scope`         | 标注Bean的作用范围                                        |
| `@PostConstruct` | 使用在方法上，标注该方法是Bean的初始化方法                |
| `@PreDestroy`    | 使用在方法上，标注该方法是Bean的销毁方法                  |

### 2.2 新注解

使用原始注解还不能全部替代xml配置文件，还需要使用注解替代的配置如下：

- 非自定义的Bean的配置：`<bean>`
- 加载properties文件的配置：`<context:property-placeholder>`
- 组件扫描的配置：`<context:component-scan>`
- 引入其他文件：`<import>`

| 新注解            | 解释                                                         |
| ----------------- | ------------------------------------------------------------ |
| `@Configuration`  | 用于指定当前类是一个Spring配置类，当创建容器时会从该类上加载注解 |
| `@ComponentScan`  | 用于指定Spring在初始化容器时要扫描的包，作用和在Spring的xml配置文件中的<context:component-scan  base-package="com.itheima"/>一样 |
| `@Bean`           | 使用在方法上，表示将该方法的返回值存储到Spring容器中，并可赋予指定名称 |
| `@PropertySource` | 用于加载properties文件中的配置                               |
| `@Import`         | 用于导入其他配置类                                           |

### 2.3 注解详解

#### @Autowired

`@Autowired`根据类型注入Bean，对应类型的Bean需要是单例的。

```java
@Target({ElementType.CONSTRUCTOR, ElementType.METHOD, ElementType.PARAMETER, ElementType.FIELD, ElementType.ANNOTATION_TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface Autowired {
    boolean required() default true;
}
```

如果对应的类型有多个，`@Autowired`会失败，此时有三种解决方式：

- 与 `@Qualifier`（合格者、修饰词）结合，在同类型的基础上通过名称再进行取舍；

- 在被注入的Bean上加入优先级，如指定某一个Bean为`@Primary`；

- 另外，实际上可以将注入的字段改为集合类型：

    ```java
    @Service
    public class UserService {
    
        @Autowired
        private List<IUser> userList;
    
        @Autowired
        private Set<IUser> userSet;
    
        @Autowired
        private Map<String, IUser> userMap;
    
        public void test() {
            // userList:[User1@2513a118, User2@2bfb583b]
            System.out.println("userList:" + userList);
            // userSet:[User1@2513a118, User2@2bfb583b]
            System.out.println("userSet:" + userSet);
            // {user1=User1@2513a118, user2=User2@2bfb583b}
            System.out.println("userMap:" + userMap);
        }
    }
    ```

注意，由`@Autowired`的定义可知，其作用范围为构造器、方法、形参、字段、注解，最常见的字段注入的方式只是其中之一而已。当然了，当用在方法上时，此注解肯定不可能用在静态方法上。

> 当在方法上使用`@Autowired`时，spring会在项目启动的过程中，自动调用一次加了`@Autowired`注解的方法，我们可以在该方法做一些初始化的工作（如此一来，与`@PostConstruct`的区别？）

注入对象为null的可能原因：

- 使用@Autowired的类不在IoC容器中（没有加@Componet, @Controller之类的注解）
- 包未被spring扫描
- 在listener和filter里面@Autowired某个bean：由于web应用启动的顺序是：`listener` -> `filter` -> `servlet`，而SpringMVC的启动是在`DisptachServlet`里面做的，执行在对应的bean还没有初始化，无法自动装配。此时可以通过其他途径来实现。
- 循环依赖问题（在单例情况下多数没问题）

#### @Resource

- @Autowired是Spring提供的注解，@Resource是Java（JSR-250）提供的注解。
- @Autowired只包含一个参数：required，表示是否开启自动准入，默认是true；而@Resource包含七个参数，其中最重要的两个参数是：name 和 type。
- @Resource只能用在类、成员变量和方法上。
- @Resource的装配顺序：
    - 未给定任何参数：首先根据名称匹配，如果找不到再根据类型匹配
    - 仅指定了name：根据名称装配
    - 仅指定了type：根据类型装配
    - 同时指定了name和type：寻找名称和类型都匹配的Bean进行装配

```java
@Target({TYPE, FIELD, METHOD})
@Retention(RUNTIME)
public @interface Resource {

    String name() default "";

    String lookup() default "";

    Class<?> type() default java.lang.Object.class;

    AuthenticationType authenticationType() default AuthenticationType.CONTAINER;

    boolean shareable() default true;

    String mappedName() default "";

    String description() default "";
    
    enum AuthenticationType {
            CONTAINER,
            APPLICATION
    }
}
```

## 3. 附一些特殊场景的spring配置

### 3.1 数据源（以XML为例）

> spring容器加载properties文件：
>
> ```xml
> <context:property-placeholder location="xx.properties"/>
> <property name="" value="${key}"/>
> ```

#### 数据源简介

数据源（连接池）的作用：

- 数据源（连接池）是为提高程序性能出现的；
- 它会事先实例化数据源，初始化部分连接源；
- 使用连接资源时从数据源中获取，使用完毕后会将连接资源归还给数据源。

常见的数据源（连接池）：DBCP、C3P0、BoneCP、Druid等。

数据源的手动创建：

1. 在代码中直接创建（强耦合）
2. 通过properties配置文件创建（解耦合）

#### 使用Spring配置数据源

通过Spring创建数据源，其基本步骤依然遵循spring开发的一般步骤，只是DataSource的创建权交由了Spring容器去完成。

> 以下为c3p0数据源为例。

- 可以直接在Spring配置文件applicationContext.xml中配置DataSource的相关连接信息：

    ```xml
    <bean id="dataSource" class="com.mchange.v2.c3p0.ComboPooledDataSource">
        <property name="driverClass" value="com.mysql.jdbc.Driver"></property>
        <property name="jdbcUrl" value="jdbc:mysql://localhost:3306/test"></property>
        <property name="user" value="root"></property>
        <property name="password" value="root"></property>
    </bean>
    ```

- 也可以让Spring抽取另外的DataSource的properties配置文件，令applicationContext.xml加载jdbc.properties配置文件来获得连接信息。

    > 其不再在`<bean>`标签内了，而需引入`<context>`标签。
    >
    > - 命名空间：`xmlns:context="http://www.springframework.org/schema/context"`
    > - 约束路径：`http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context.xsd`

    示例：

    ```xml
    <?xml version="1.0" encoding="UTF-8"?>
    <beans xmlns="http://www.springframework.org/schema/beans"
           xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
           xmlns:context="http://www.springframework.org/schema/context"
           xsi:schemaLocation="
           http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
           http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context.xsd
    ">
        <!-- 加载外部的properties文件 -->
        <context:property-placeholder location="classpath:jdbc.properties"/>
        
        <bean id="dataSource" class="com.mchange.v2.c3p0.ComboPooledDataSource">
            <property name="driverClass" value="${jdbc.driver}"></property>
            <property name="jdbcUrl" value="${jdbc.url}"></property>
            <property name="user" value="${jdbc.username}"></property>
            <property name="password" value="${jdbc.password}"></property>
        </bean>
        
    </beans>
    ```

### 3.2 声明式事务

编程式事务控制 v.s. 声明式事务控制：前者需要写代码，后者只要写配置。

声明式事务处理的作用：事务管理不侵入开发的组件。具体来说，业务逻辑对象不会意识到是否正处在事务管理之中，如果想要改变事务管理策划的话，只需要在定义文件中重新配置即可。这样其实更符合实际，因为事务管理是属于系统层面的服务，而不是业务逻辑的一部分。

Spring声明式事务控制的底层就是AOP。

基于XML的声明式事务控制：

> 暂略，参见 https://b23.tv/GAAFVz 视频的P66。

基于注解的声明式事务控制：暂略
