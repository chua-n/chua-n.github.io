---
title: 配置-XML
---

> The configuration metadata is represented in **XML**, **Java annotations**, or **Java code**.
>
> - XML: 最早的配置形式。
> - Annotation-based configuration: Spring 2.5 开始支持。
> - Java-based configuration: Starting with Spring 3.0 开始支持。

## 1. bean 标签

bean 标签用于配置将由 Spring 来创建的对象。默认情况下它调的是类中的无参构造函数，如果没有无参构造函数则不能成功创建。

### 基本属性配置

| 基本属性 | 作用                                                         |
| :------: | ------------------------------------------------------------ |
|    id    | Bean 实例（Bean 对象）在 Spring 容器中的唯一标识（若未指定 id，默认使用其全限定名作为 id） |
|  class   | Bean 的全限定名称                                             |
|  scope   | 指对象的作用范围，可取值为`singleton, prototype, request, session, global session` |

scope 的取值：

- `singleton`：单例的（默认值）
    - Bean 的实例化个数：1 个
    - Bean 的实例化时机：当 Spring 核心文件被加载时实例化 Bean 实例
    - Bean 的生命周期：
        - 对象创建：当应用加载，创建容器时，对象就被创建了
        - 对象运行：只要容器在，对象就一直活着
        - 对象销毁：当应用卸载，销毁容器时，对象就被销毁了
- `prototype`：多例的
    - Bean 的实例化个数：多个
    - Bean 的实例化时机：当调用`getBean()`方法时实例化 Bean 实例
    - Bean 的生命周期：
        - 对象创建：当使用对象时，创建新的对象实例
        - 对象运行：只要对象在使用中，就一直活着
        - 对象销毁：当对象长时间不用时，被 Java 的垃圾回收器回收

### Bean 生命周期属性配置

|      方法      |           作用           |
| :------------: | :----------------------: |
|  init-method   | 指定类中的初始化方法名称 |
| destroy-method |  指定类中的销毁方法名称  |

### Bean 实例化三种方式

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

## 2. Bean 的依赖注入

### 属性注入

> 通过`setXxx()`方法。

采用`<property>`子标签注入；其中`name`属性指定 bean 的属性名称，`value`属性指定属性的值。

- 对于普通属性，直接指定：

    ```xml
    <!-- fullname 为 String 类型 -->
    <property name="fullname" value="张三"></property>
    ```

- 若属性值为其他 bean，使用`ref`来引用：

    ```xml
    <property name="person" ref="person"></property>
    ```

    > 附：Person 类的定义及其 bean 配置为：
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
    <!-- fruit 为 String[] 类型 -->
    <property name="fruit">
        <list value-type="java.lang.String">
            <value>apple</value>
            <value>orange</value>
            <value>banana</value>
        </list>
    </property>
    
    <!-- family 为 Map<String, String>类型 -->
    <property name="family">
        <map key-type="java.lang.String" value-type="java.lang.String">
            <entry key="father" value="lisi"/>
            <entry key="mother" value="wangpo"/>
            <entry key="sister" value="wuliu"/>
        </map>
    </property>
    ```

- 可采用 p 命名空间注入，此时可采用属性的方式去注入。

另：依赖注入的数据类型对应的属性/标签：

- 普通数据类型：`value="…"`
- 引用其他 bean：`ref="…"`
- 集合数据类型：`<list>、<map>`等子标签

#### 空属性

设置 Bean 的属性时，Spring 将空参数视为空字符串。故而以下与`exampleBean.setEmail("");`等效：

```xml
<bean class="ExampleBean">
    <property name="email" value=""/>
</bean>
```

若想单独设置某个属性为 null，可使用`<null/>`标签：

```xml
<bean class="ExampleBean">
    <property name="email">
	    <null/>
    </property>
</bean>
```

### 构造器注入（不常用）

> 需使用有参构造方式，采用`<constructor-arg>`标签。

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

### 工厂方法注入（很少使用，不推荐）

略。

### 内部 Bean

当 Bean 实例**仅仅**给一个特定的属性使用时，可以将其声明为内部 Bean. 内部 Bean 声明直接包含在 `<property>` 或 `<constructor-arg>` 元素里，不需要设置任何 id 或 name 属性。

<font color="red">???????</font>

## 3. 组件扫描

组件扫描的配置：`<context:component-scan>`。

当使用 `<context:component-scan>` 时，会隐式地包含 `<context:annotation-config>`，因此没有必要再单独对后者进行设置了。

You can disable the registration of `AutowiredAnnotationBeanPostProcessor` and `CommonAnnotationBeanPostProcessor` by including the `annotation-config` attribute with a value of `false`.

## 4. 分模块开发

Spring 的配置文件可**分模块开发**，此时在主配置文件中引用其他配置文件的方法为使用`<import>`标签加载：

```xml
<beans>
    <import resource="services.xml"/>
    <import resource="resources/messageSource.xml"/>
    <import resource="/resources/themeSource.xml"/>
    
    <bean id="bean1" class="..."/>
    <bean id="bean2" class="..."/>
</beans>
```

## 5. p 命名空间、c 命名空间

- The p-namespace lets you use the bean element’s attributes (instead of nested \<property/> elements) to describe your property values collaborating beans, or both.
- Similar to the XML Shortcut with the p-namespace, the c-namespace, introduced in Spring 3.1, allows inlined attributes for configuring the constructor arguments rather then nested constructorarg elements.

## 6. Bean Definition Inheritance

A bean definition can contain a lot of configuration information, including constructor arguments, property values, and container-specific information, such as the initialization method, a static factory method name, and so on. 

A child bean definition inherits configuration data from a parent definition. The child definition can override some values or add others as needed. Using parent and child bean definitions can save a lot of typing. Effectively, this is a form of templating.

所以，以后再看吧。

## 7. 附一些特殊场景的 spring 配置

### 数据源（以 XML 为例）

> spring 容器加载 properties 文件：
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

常见的数据源（连接池）：DBCP、C3P0、BoneCP、Druid 等。

数据源的手动创建：

1. 在代码中直接创建（强耦合）
2. 通过 properties 配置文件创建（解耦合）

#### 使用 Spring 配置数据源

通过 Spring 创建数据源，其基本步骤依然遵循 spring 开发的一般步骤，只是 DataSource 的创建权交由了 Spring 容器去完成。

> 以下为 c3p0 数据源为例。

- 可以直接在 Spring 配置文件 applicationContext.xml 中配置 DataSource 的相关连接信息：

    ```xml
    <bean id="dataSource" class="com.mchange.v2.c3p0.ComboPooledDataSource">
        <property name="driverClass" value="com.mysql.jdbc.Driver"></property>
        <property name="jdbcUrl" value="jdbc:mysql://localhost:3306/test"></property>
        <property name="user" value="root"></property>
        <property name="password" value="root"></property>
    </bean>
    ```

- 也可以让 Spring 抽取另外的 DataSource 的 properties 配置文件，令 applicationContext.xml 加载 jdbc.properties 配置文件来获得连接信息。

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
        <!-- 加载外部的 properties 文件 -->
        <context:property-placeholder location="classpath:jdbc.properties"/>
        
        <bean id="dataSource" class="com.mchange.v2.c3p0.ComboPooledDataSource">
            <property name="driverClass" value="${jdbc.driver}"></property>
            <property name="jdbcUrl" value="${jdbc.url}"></property>
            <property name="user" value="${jdbc.username}"></property>
            <property name="password" value="${jdbc.password}"></property>
        </bean>
        
    </beans>
    ```

### 声明式事务

编程式事务控制 v.s. 声明式事务控制：前者需要写代码，后者只要写配置。

声明式事务处理的作用：事务管理不侵入开发的组件。具体来说，业务逻辑对象不会意识到是否正处在事务管理之中，如果想要改变事务管理策划的话，只需要在定义文件中重新配置即可。这样其实更符合实际，因为事务管理是属于系统层面的服务，而不是业务逻辑的一部分。

Spring 声明式事务控制的底层就是 AOP。

基于 XML 的声明式事务控制：

> 暂略，参见 https://b23.tv/GAAFVz 视频的 P66。

基于注解的声明式事务控制：暂略
