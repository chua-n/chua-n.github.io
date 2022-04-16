## 1. Spring概要

### 1.1 Spring简介

Spring是分层的Jave  SE/EE应用的全栈的轻量级开源框架，以<font size=5>**IoC**(Inverse of Control，控制反转 )</font>和<font size=5>**AOP**(Aspect Oriented Programming，面向切面编程)</font>为内核。

> 所谓**控制反转**：即可通过Spring提供的IOC容器，可以将对象的依赖关系交由Spring进行控制，避免硬编码所造成的过度耦合。

Spring提供了**展示层SpringMVC**和**持久层Spring JDBCTemplate**以及**业务事务管理**等众多的企业级应用技术，还能整合开源世界众多著名的第三方框架和类库，逐渐成为使用最多的Java EE企业应用开源框架。

Spring的优势：

- 方便解耦，简化开发；
- AOP编程的支持；
- 声明式事务的支持；
- 方便程序的测试：方便使用Junit；
- 方便集成各种优秀框架；
- 降低JavaEE API（如JDBC、JavaMail、远程调用等）的使用难度；
- Java 源码是经典学习范例。

### 1.2 Spring体系结构

![9](https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/Spring/9.png)

### 1.3 Spring开发步骤

Spring开发的一般步骤：

1. 导入Spring开发的基本包坐标；
2. 创建Bean类；
3. 创建配置文件applicationContext.xml（配置文件叫啥名无所谓，但建议以此为名）；
4. 在配置文件中进行Bean的配置；
5. 创建ApplicationContext对象（Spring的客户端），以getBean方法得到指定的Bean。

<img src="https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/Spring/10.png" alt="10" style="zoom:50%;" />

## 2. Spring容器——IoC

> Spring容器指Spring的IoC容器。

在Spring读取Bean配置创建 Bean 实例之前，必须首先对Spring的IoC容器进行实例化，从而才能从 IoC 容器里获取 Bean 实例并使用。

### 2.1 两种类型的IoC容器

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

### 2.2 ApplicationContext接口

`ApplicationContext`为接口，其代直接翻译为（Spring的）应用上下文，用来代表Spring的IoC容器，通过`ApplicationContext`接口的对象可获得Spring容器中的Bean对象。

![image-20220416171705471](../../resources/images/notebook/JavaWeb/Spring/23.png)

`ApplicationContext`在初始化上下文时就实例化了所有单例的 Bean。`ApplicationContext`接口的实现类常见的有：

|   `ApplicationContext`接口的实现类   | 作用                                                         |
| :----------------------------------: | ------------------------------------------------------------ |
|   `ClassPathXmlApplicationContext`   | 从类路径下加载配置文件（推荐）                               |
|  `FileSystemXmlApplicationContext`   | 从文件系统中加载配置文件，配置文件可以在磁盘任意位置         |
| `AnnotationConfigApplicationContext` | 当使用注解配置容器对象时，需要使用此类来创建Spring容器，其用来读取注解 |
