## 1. 数据源简介

数据源（连接池）的作用：

- 数据源（连接池）是为提高程序性能出现的；
- 它会事先实例化数据源，初始化部分连接源；
- 使用连接资源时从数据源中获取，使用完毕后会将连接资源归还给数据源。

常见的数据源（连接池）：DBCP、C3P0、BoneCP、Druid等。

数据源的手动创建：

1. 在代码中直接创建（强耦合）
2. 通过properties配置文件创建（解耦合）

## 2. 使用Spring配置数据源

通过Spring创建数据源，其基本步骤依然遵循spring开发的一般步骤，只是DataSource的创建权交由了Spring容器去完成。

> 以下为c3p0数据源为例。

- 可以直接在Spring配置文件applicationContext.xml中配置DataSource的相关连接信息：

    ![13](https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/Spring/13.png)

- 也可以让Spring抽取另外的DataSource的properties配置文件：

    > 其不再在`<bean>`标签内了，而需引入`<context>`标签

    ![14](https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/Spring/14.png)

    ![15](https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/Spring/15.png)

    示例：

    ![16](https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/Spring/16.png)

