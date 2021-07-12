## 1. 前言

> 来源： https://b23.tv/GAAFVz 视频的P29。

Spring是轻代码而重配置的框架，配置比较繁重，影响开发效率，所以注解开发是一种趋势，注解代替xml配置文件可以简化配置，提高开发效率。

Spring“原始注解”与“新注解”主要是一种逻辑上的区分。

## 2. 原始注解

使用原始注解进行开发时，需要在applicationContext.xml中配置组件扫描，其作用是指定哪个包（及其子包）下的Bean需要进行扫描以便识别使用注解配置的类、字段和方法。

```xml
<!--配置组件扫描-->
<context:component-scan base-package="com.itheima"></context:component-scan>
```

| 原始注解       | 解释                                                      |
| -------------- | --------------------------------------------------------- |
| @Component     | 使用在类上，用于实例化Bean                                |
| @Controller    | @Component的衍生注解：使用在Web层上，用于实例化Bean       |
| @Service       | @Component的衍生注解：使用在service层类上，用于实例化Bean |
| @Repository    | @Component的衍生注解：使用在dao层类上，用于实例化Bean     |
| @Autowired     | 使用在字段上，用于根据类型依赖注入                        |
| @Qualifier     | 结合@Autowired一起使用用于根据名称进行依赖注入            |
| @Resource      | 相当于@Autowired+@Qualifier，按照名称进行注入             |
| @Value         | 注入普通属性                                              |
| @Scope         | 标注Bean的作用范围                                        |
| @PostConstruct | 使用在方法上，标注该方法是Bean的初始化方法                |
| @PreDestroy    | 使用在方法上，标注该方法是Bean的销毁方法                  |

## 3. 新注解

使用原始注解还不能全部替代xml配置文件，还需要使用注解替代的配置如下：

- 非自定义的Bean的配置：`<bean>`
- 加载properties文件的配置：`<context:property-placeholder>`
- 组件扫描的配置：`<context:component-scan>`
- 引入其他文件：`<import>`

| 新注解          | 解释                                                         |
| --------------- | ------------------------------------------------------------ |
| @Configuration  | 用于指定当前类是一个Spring配置类，当创建容器时会从该类上加载注解 |
| @ComponentScan  | 用于指定Spring在初始化容器时要扫描的包，作用和在Spring的xml配置文件中的<context:component-scan  base-package="com.itheima"/>一样 |
| @Bean           | 使用在方法上，表示将该方法的返回值存储到Spring容器中，并可赋予指定名称 |
| @PropertySource | 用于加载properties文件中的配置                               |
| @Import         | 用于导入其他配置类                                           |

