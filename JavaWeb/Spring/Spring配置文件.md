## 1. bean标签

bean标签用于配置将由Spring来创建的对象。默认情况下它调的是类中的无参构造函数，如果没有无参构造函数则不能成功创建。

### 1.1 基本属性配置

| 基本属性 | 作用                                                         |
| :------: | ------------------------------------------------------------ |
|    id    | Bean实例（Bean对象）在Spring容器中的唯一标识                 |
|  class   | Bean的全限定名称                                             |
|  scope   | 指对象的作用范围，可取值为singleton, prototype, request, session, global session |

scope的取值：

- singleton：单例的（默认值）
    - Bean的实例化个数：1个
    - Bean的实例化时机：当Spring核心文件被加载时实例化Bean实例
    - Bean的生命周期：
        - 对象创建：当应用加载，创建容器时，对象就被创建了
        - 对象运行：只要容器在，对象就一直活着
        - 对象销毁：当应用卸载，销毁容器时，对象就被销毁了
- prototype：多例的
    - Bean的实例化个数：多个
    - Bean的实例化时机：当调用getBean()方法时实例化Bean实例
    - Bean的生命周期：
        - 对象创建：当使用对象时，创建新的对象实例
        - 对象运行：只要对象在使用中，就一直活着
        - 对象销毁：当对象长时间不用时，被Java的垃圾回收器回收

### 1.2 Bean生命周期属性配置

|      方法      |           作用           |
| :------------: | :----------------------: |
|  init-method   | 指定类中的初始化方法名称 |
| destroy-method |  指定类中的销毁方法名称  |

### 1.3 Bean实例化三种方式

1. 无参构造函数实例化

    ```xml
    <bean id="userDao"class="com.itheima.dao.impl.UserDaoImpl"
    init-method="init"destroy-method="destroy"></bean>
    ```

2. 工厂静态方法实例化

    ```xml
    <bean id="userDao"class="com.itheima.factory.StaticFactory"factory-method="getUserDao"></bean>
    ```

3. 工厂实例方法实例化

    ```xml
    <bean id="factory"class="com.itheima.factory.DynamicFactory"/>-->
    <!--<bean id="userDao"factory-bean="factory"factory-method="getUserDao"/>
    ```

## 2. Bean的依赖注入

**依赖注入**(Dependency Injection)，是Spring框架核心IoC的具体实现。在编写程序时，通过控制反转，把对象的创建权交给了Spring，但是代码中不可能出现没有依赖的情况，而IoC解耦只是降低他们的依赖关系，但不会消除，例如：业务层仍会调用持久层的方法。

这种业务层和持久层的依赖关系，在使用Spring之后，就让Spring来维护了，简单地说，就是坐等框架把持久层对象传入业务层，而不用我们自己去获取。

### 2.1 引导案例

对于两个类UserService和UserDao，它们都在Spring容器中，前者的代码定义中需要使用到后者。以前的做法是在容器外部获得UserService实例和UserDao实例，然后在程序中进行结合；然而，最终程序直接使用的是UserService，所以更好的方式是：在Spring容器中，将UserDao设置到UserSerivice内部。

![11](https://chua-n.gitee.io/blog-images/notebooks/JavaWeb/Spring/11.png)

以Spring进行依赖注入后的效果如下图：

![12](https://chua-n.gitee.io/blog-images/notebooks/JavaWeb/Spring/12.png)

### 2.2 Bean的依赖注入方式：

1. 构造方法：需使用有参构造方式，采用`<constructor-arg>`标签；
2. set()方法：
    - 参见 https://b23.tv/GAAFVz 视频的P14，采用`<property>`子标签注入；
    - 可采用p命名空间注入，此时可采用属性的方式去注入。

### 2.3 Bean的依赖注入的数据类型：

- 普通数据类型：`value="…"`
- 引用数据类型：`ref="…"`
- 集合数据类型：`<list>、<map>`等子标签

## 3. 分模块开发

Spring的配置文件可**分模块开发**，此时在主配置文件中引用其他配置文件的方法为使用`<import>`标签加载：

`<import resource="applicationContext-xxx.xml"/>`

## 4. Spring的重点配置

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

