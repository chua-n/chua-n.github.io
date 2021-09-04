## 1. IoC容器

Spring容器指Spring的IoC容器。

在Spring读取Bean配置创建 Bean 实例之前，必须首先对Spring的IoC容器进行实例化，从而才能从 IoC 容器里获取 Bean 实例并使用。

Spring提供了两种类型的IoC容器：

- `BeanFactory`接口： IoC容器的基本实现。

    > `BeanFactory` 是 Spring 框架的基础设施，面向 Spring 本身。

- `ApplicationContext`接口：提供了更多的高级特性，是 `BeanFactory` 的子接口。

    > `ApplicationContext`面向使用 Spring 框架的开发者，几乎所有的应用场合都可以直接使用 `ApplicationContext` 而非底层的 `BeanFactory`。

## 2. ApplicationContext接口

`ApplicationContext`为接口，其代直接翻译为（Spring的）应用上下文，用来代表Spring的IoC容器，通过`ApplicationContext`接口的对象可获得Spring容器中的Bean对象。

`ApplicationContext`在初始化上下文时就实例化了所有单例的 Bean。

### 2.1 `ApplicationContext`接口的实现类

|   `ApplicationContext`接口的实现类   | 作用                                                         |
| :----------------------------------: | ------------------------------------------------------------ |
|   `ClassPathXmlApplicationContext`   | 从类路径下加载配置文件（推荐）                               |
|  `FileSystemXmlApplicationContext`   | 从文件系统中加载配置文件，配置文件可以在磁盘任意位置         |
| `AnnotationConfigApplicationContext` | 当使用注解配置容器对象时，需要使用此类来创建Spring容器，其用来读取注解 |

### 2.2 获取Bean对象

从IoC容器中获取Bean对象的方法是调用`getBean()`方法，`getBean()`方法有两种使用形式：

- 根据bean的id进行获取（允许容器中出现多个相同类型的bean）

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

> 值得注意的是，`getBean()`方法并非来自`ApplicationContext`接口。

