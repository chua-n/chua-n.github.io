## 1. ApplicationContext的继承体系

ApplicationContext本身为一接口类型，代表应用上下文，可能通过其实例获得Spring容器中的Bean对象。

|     ApplicationContext的实现类     | 作用                                                         |
| :--------------------------------: | ------------------------------------------------------------ |
|   ClassPathXmlApplicationContext   | 从类的根路径下加载配置文件（推荐）                           |
|  FileSystemXmlApplicationContext   | 从磁盘路径上加载配置文件，配置文件可以在磁盘任意位置         |
| AnnotationConfigApplicationContext | 当使用注解配置容器对象时，需要使用此类来创建Spring容器，其用来读取注解 |

## 2. getBean()方法有两种使用形式

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

