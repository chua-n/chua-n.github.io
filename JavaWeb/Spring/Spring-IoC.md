## 1. Spring容器——IoC

> Spring容器指Spring的IoC容器。
>
> 以下将[Spring官方文档](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#spring-core)中的configureration metadata理解为“配置”一词。

在Spring读取Bean配置创建 Bean 实例之前，必须首先对Spring的IoC容器进行实例化，从而才能从 IoC 容器里获取 Bean 实例并使用。

- Spring IOC容器的两个基础包是`org.springframework.beans`和`org.springframework.context`。
- In Spring, the objects that form the backbone of your application and that are managed by the
    Spring IoC container are called **beans**.
- Beans, and the dependencies among them, are reflected in the configuration metadata
    used by a container.

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

![image-20220416171705471](../../resources/images/notebook/JavaWeb/Spring/23.png)

`ApplicationContext`在初始化上下文时就实例化了所有单例的 Bean。`ApplicationContext`接口的实现类常见的有：

|   `ApplicationContext`接口的实现类   | 作用                                                         |
| :----------------------------------: | ------------------------------------------------------------ |
|   `ClassPathXmlApplicationContext`   | 从类路径下加载配置文件（推荐）                               |
|  `FileSystemXmlApplicationContext`   | 从文件系统中加载配置文件，配置文件可以在磁盘任意位置         |
| `AnnotationConfigApplicationContext` | 当使用注解配置容器对象时，需要使用此类来创建Spring容器，其用来读取注解 |

通过拿到`ApplicationContext`的`BeanFactory`（通常是`DefaultListableBeanFactory`），`ApplicationContext`的实现类也支持注册在容器外创建的对象。比如`DefaultListableBeanFactory`可以通过`registerSingleton(..)` 和 `registerBeanDefinition(..)`方法来支持注册功能。

