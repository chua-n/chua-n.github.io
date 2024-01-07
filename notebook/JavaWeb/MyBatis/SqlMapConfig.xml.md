## 1. 简介

SqlMapConfig.xml，是 MyBatis 与数据库建立连接的核心文件，是整个 MyBatis 的全局配置文件。

在 xml 声明信息下，加入 MyBatis 的 DTD 文档定义类型的配置信息：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE configuration
         PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
         "http://mybatis.org/dtd/mybatis-3-config.dtd">
```

所有的配置信息都会被包裹在**configuration 标签对**中，其中有许多的配置标签，每个配置标签必须严格按照先后顺序配置。

-   标签设置概览

    ```xml
    <settings></settings>
    <environments>
    	<environment>
    		<transactionManager … />
    		<dataSource>
    			<property … />
    		</dataSource>
    	</environment>
    </environments>
    ```

-   标签详解

    -   setting：定义一些设置信息，如配置日志输出模式 logImpl 为 LOG4J

    -   environments

        -   environment

        > environments 配置 MyBatis 的环境信息，里面允许有多个 environment 标签，每一个单独的 environment 标签代表一个单独的数据库配置环境。

    -   transactionManager：配置 MyBatis 的事务控制类型：JDBC/MANAGED

    -   dataSource

        -   property

        > 配置数据库的连接信息，其中包含多个 property 标签，用于配置数据库驱动信息 driver、数据库连接地址 url、数据库用户名 username、数据库密码 password

除上以外 SqlMapConfig.xml 中还可包含 Mapper 映射文件的声明及别名定义等功能。

## 2. 配置标签详解

MyBatis 全局配置文件的可配项主要如下：

|      配置名称      |     配置含义     | 配置简介                                                                                                                                                     |
| :----------------: | :--------------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
|   configuration    | 包裹所有配置标签 | 整个配置文件的顶级标签                                                                                                                                       |
|     properties     |       属性       | 该标签可以引入外部配置的属性，也可以自己配置。该配置标签所在的同一个配置文件中的其他配置均可引用此配置中的属性                                               |
|      settings      |   全局配置参数   | 配置一些改变运行时行为的信息。如是否使用缓存机制，是否使用延迟加载，是否使用错误处理机制等；并可以设置最大并发请求数量、最大并发事务数量、是否启用命名空间等 |
|    typeAliases     |     类型别名     | 用来设置一些别名来代替 Java 的长类型声明（如 java.lang.int 变为 int），减少配置编码的冗余。                                                                  |
|    typeHandlers    |    类型处理器    | 将 SQL 中返回的数据库类型转换为相应 Java 类型的处理器配置                                                                                                    |
|   objectFactory    |     对象工厂     | 实例化目标类的工厂类配置                                                                                                                                     |
|      plugins       |       插件       | 可以通过插件修改 MyBatis 的核心行为，例如对语句执行的某一点进行拦截调用                                                                                      |
|    environments    | 环境集合属性对象 | 数据库环境信息的集合。在一个配置文件中，可以有多种数据库环境集合，这样可以使 MyBatis 将 SQL 同时映射至多个数据库                                             |
|    environment     |  环境子属性对象  | 数据库环境配置的详细配置                                                                                                                                     |
| transactionManager |     事务管理     | 指定 MyBatis 的事务管理器                                                                                                                                    |
|     dataSource     |      数据源      | 使用其中的 type 指定数据源的连接类型，在标签对中可以使用 property 属性指定数据库连接池的其他信息                                                             |
|      mappers       |      映射器      | 配置 SQL 映射文件的位置，告知 MyBatis 去哪里加载 SQL 映射配置                                                                                                |

配置文件样例：

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>
    <!--        1. properties属性引入外部配置文件-->
    <properties resource="org/mybatis/example/config.properties">
        <!--        property里面的属性全局均可使用-->
        <property name="username" value="root"/>
        <property name="password" value="1234"/>
    </properties>

    <!--        2. 全局配置参数-->
    <settings>
        <!--        设置是否启用缓存-->
        <setting name="cacheEnabled" value="true"/>
        <!--        设置是否启用懒加载-->
        <setting name="lasyLoadingEnabled" value="true"/>
    </settings>

    <!--    3. 别名设置-->
    <typeAliases>
        <typeAlias alias="student" type="cn.com.mybatis.student"/>
        <typeAlias alias="teacher" type="cn.com.mybatis.teacher"/>
        <typeAlias alias="integer" type="java.lang.Integer"/>
    </typeAliases>

    <!--    4. 类型转换器-->
    <typeHandlers>
        <typeHandler handler="org.mybatis.example.ExampleTypeHandler"/>
    </typeHandlers>

    <!--    5. 对象工厂-->
    <objectFactory type="org.mybatis.example.ExampleObjectFactory">
        <!--        对象工厂注入的参数-->
        <property name="someProperty" value="100"/>
    </objectFactory>

    <!--    6. 插件-->
    <plugins>
        <plugin interceptor="org.mybatis.example.ExamplePlugin">
            <property name="someProperty" value="100"/>
        </plugin>
    </plugins>

    <!--    7. environments数据库环境配置-->
    <!--    和Spring整合后environments配置将被废除-->
    <environments default="development">
        <environment id="development">
            <!--            使用JDBC事务管理-->
            <transactionManager type="JDBC"/>
            <!--            数据库连接池-->
            <dataSource type="POOLED">
                <property name="driver" value="${driver}"/>
                <property name="url" value="${url}"/>
                <property name="username" value="${username}"/>
                <property name="password" value="${password}"/>
            </dataSource>
        </environment>
    </environments>

    <!--  加载映射文件  -->
    <mappers>
        <mapper resource="sqlmap/UserMapper.xml"/>
        <mapper resource="sqlmap/OtherMapper.xml"/>
    </mappers>

</configuration>
```

### 2.1 properties 标签

properties 标签中的参数可以设置默认值，即在所需引入的属性名的后面添加“:”引号，然后填写当该属性不存在或为空时的默认值。

```xml
<dataSource type="POOLED">
    <property name="username" value="${username:root}"/>
</dataSource>
```

### 2.2 typeAliases 标签

#### 2.2.1 一般性用法

如下所述定义 SqlMapConfig 中的 typeAliases 标签，就可以为 SQL 映射文件中的输入/输出参数设置类型别名，然后在 SQL 映射配置文件中指定输入/输出参数类型时使用别名：

-   SqlMapConfig.xml：

```xml
<typeAliases>
    <typeAlias alias="user" type="cn.com.mybatis.po.User" />
    <typeAlias alias="str" type="java.lang.String" />
</typeAliases>
```

-   XxxMapper.xml

```xml
<select id="findUserByUsername" parameterType="str" resultType="user">
    SELECT * FROM USER WHERE username LIKE '%${value}%'
</select>
```

#### 2.2.2 批量定义别名

一个一个配置别名很烦琐，所以 MyBatis 提供了批量定义别名的方法，指定包名即可，程序会为该包下的所有包装类加上别名。定义别名的规范就是<u>对应包装类的类名首字母变为小写</u>。

```xml
<typeAliases>
    <package name="cn.com.mybatis.po" />
</typeAliases>
```

#### 2.2.3 使用注解

除了使用 typeAliases 标签来定义别名，也可以使用注解来实现，实现方式就是在需要指定别名的类声明头添加@Alias 注解，其中的参数就是该类对应的别名。

```java
@Alias("user")
public class User {
    ...
}
```

#### 2.2.4 常见类型的 MyBatis 别名

MyBatis 已经为 Java 的常见类型默认指定了别名，可以直接使用。其中有一些基本数据类型和包装数据类型的名称一样，故在基本数据类型的前面加了下划线\_作为区分。

| 别名       | 映射的类型           |
| ---------- | -------------------- |
| \_byte     | byte                 |
| \_long     | long                 |
| \_short    | short                |
| \_int      | int                  |
| \_integer  | int                  |
| \_double   | double               |
| \_float    | float                |
| \_boolean  | boolean              |
| string     | java.lang.String     |
| byte       | java.lang.Byte       |
| long       | java.lang.Long       |
| short      | java.lang.Short      |
| int        | java.lang.Integer    |
| integer    | java.lang.Integer    |
| double     | java.lang.Double     |
| boolean    | java.lang.Boolean    |
| date       | java.util.Date       |
| decimal    | java.math.BigDecimal |
| bigdecimal | java.math.BigDecimal |
| object     | java.lang.Object     |
| map        | java.util.Map        |
| hashmap    | java.util.HashMap    |
| list       | java.util.List       |
| arraylist  | java.util.ArrayList  |
| collection | java.util.Collection |
| iterator   | java.util.Iterator   |

### 2.3 settings 标签

settings 配置也是 MyBatis 全局配置文件中比较重要的配置，它影响 MyBatis 框架在运行时的一些行为。

settings 配置缓存、延迟加载、结果集控制、执行器、分页设置、命名规则等一系列控制性参数，与 MyBatis 的运行性能息息相关。

settings 配置参数：

| 属性名                           | 含义             | 简介                                                                                        | 有效值        | 默认值 |
| -------------------------------- | ---------------- | ------------------------------------------------------------------------------------------- | ------------- | ------ |
| cacheEnabled                     | 是否使用缓存     | 整个工程中所有映射器配置缓存的开关                                                          | true \| false | true   |
| lazyLoadingEnabled               | 是否开启延迟加载 | 控制全局是否使用延迟加载。当有特殊关联关系需要单独配置时，可使用 fetchType 属性来覆盖此配置 | true \| false | false  |
| aggressiveLazyLoading            |                  |                                                                                             |               |        |
| multipleResultSetsEnabled        |                  |                                                                                             |               |        |
| useColunLabel                    |                  |                                                                                             |               |        |
| useGeneratedKeys                 |                  |                                                                                             |               |        |
| autoMappingBehavior              |                  |                                                                                             |               |        |
| autoMappingUnknownColumnBehavior |                  |                                                                                             |               |        |
| defaultExecutorType              |                  |                                                                                             |               |        |
| defaultStatementTimeout          |                  |                                                                                             |               |        |
| defaultFetchSize                 |                  |                                                                                             |               |        |
| safeRowBoundsEnabled             |                  |                                                                                             |               |        |
| safeResultHandlerEnabled         |                  |                                                                                             |               |        |
| mapUnderscoreToCamelCase         |                  |                                                                                             |               |        |
| localCacheScope                  |                  |                                                                                             |               |        |
| jdbcTypeForNull                  |                  |                                                                                             |               |        |
| lazyLoadTriggerMethods           |                  |                                                                                             |               |        |
| defaultScriptingLanguage         |                  |                                                                                             |               |        |
| callSettersOnNulls               |                  |                                                                                             |               |        |
| returnInstanceForEmptyRow        |                  |                                                                                             |               |        |
| logPrefix                        |                  |                                                                                             |               |        |
| logImpl                          |                  |                                                                                             |               |        |
| proxyFactory                     |                  |                                                                                             |               |        |
| vfsImpl                          |                  |                                                                                             |               |        |
| useActualParamName               |                  |                                                                                             |               |        |
| configurationFactory             |                  |                                                                                             |               |        |

### 2.4 typeHandlers 标签

在 SQL 映射配置文件中，为 SQL 配置的输入参数最终要从 Java 类型转换成数据库识别的类型，而从 SQL 的查询结果集中获取的数据，也要从数据库的数据类型转换为对应的 Java 类型。

MyBatis 即使用**类型处理器(TypeHandler)**将从数据库获取的值以适合的方式转换为 Java 类型，或者将 Java 类型的参数转换为数据库对应的类型。

MyBatis 中有许多类型处理器，但依然不能总是满足开发需要，有时还需要配置自己的类型处理器，typeHandlers 标签就是用来声明自己的类型处理器的。

使用 typeHandlers 标签配置一个自己的类型处理器一般有三个步骤：

1. 编写类型处理器类，其一般要实现`org.apache.ibatis.type.TypeHandler`接口（或继承类`org.apache.ibatis.type.BaseTypeHandler`，其是 MyBatis 的一个标准基础类型处理器），接口的泛型指定要转换的 Java 参数类型（若不指定则默认为 Object 类）。

    - 实现 TypeHandler 接口主要改写以下 4 个方法：

        | 方法                                                                                          | 作用                   |
        | --------------------------------------------------------------------------------------------- | ---------------------- |
        | `public void setParameter (PreparedStatement ps, int i, String parameter, JdbcType jdbcType)` |                        |
        | `public String getResult ( ResultSet rs, String columnName)`                                  | 供普通 select 方法使用 |
        | `public String getResult ( ResultSet rs, int columnIndex)`                                    | 供普通 select 方法使用 |
        | `public String getResult ( CallableStatement cs, int columnIndex)`                            | 代存储过程使用         |

    - 类型处理器类示例：

        ```java
        package cn.com.mybatis;
    
        import org.apache.ibatis.type.JdbcType;
        import org.apache.ibatis.type.TypeHandler;
        import java.sql.*;
        import java.text.SimpleDateFormat;
        public class DateTypeHandler implements TypeHandler<Date> {
    
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    
            @Override
            public void setParameter(PreparedStatement ps, int i, Date date, JdbcType jdbcType) throws SQLException {
                System.out.println("其他逻辑");
                ps.setDate(i, date);
                System.out.println("其他逻辑");
            }
    
            @Override
            public Date getResult(ResultSet resultSet, String columnName) throws SQLException {
                System.out.println("其他逻辑");
                return resultSet.getDate(columnName);
            }
    
            @Override
            public Date getResult(ResultSet resultSet, int columnIndex) throws SQLException {
                System.out.println("其他逻辑");
                return resultSet.getDate(columnIndex);
            }
    
            @Override
            public Date getResult(CallableStatement cs, int columnIndex) throws SQLException {
                System.out.println("其他逻辑");
                return cs.getDate(columnIndex);
            }
        }
        ```

2. 在 MyBatis 全局配置文件中配置该类型处理器；

    ```xml
    <typeHandlers>
        <typeHandler handler="cn.com.mybatis.test.DateTypeHandler"
                     javaType="java.util.Date" jdbcType="TIMESTAMP"/>
    </typeHandlers>
    ```

3. 在 SQL 映射配置文件中使用。

    ```sql
    insert into user(username, password, regdate)
    values
    (#{username}, #{password}, #{regdate, javaType=date, jdbcType=TIMESTAMP, typeHandler=cn.com.mybatis.test.DateTypeHandler})
    ```

### 2.5 objectFactory 标签

**objectFactory**——**对象工厂**，即用来创建实体对象的类。

MyBatis 中默认的 objectFactory 要做的是实例化查询结果对应的目标类，有两种方式可以将查询结果的值映射到对应的目标类：

-   一种是通过目标类的默认构造方法
-   另一种是通过目标类的有参构造方法。

如果想改写默认的对象工厂，可以继承 DefaultObjectFactory 来创建自己的对象工厂，从而改写相关的 4 个方法。

objectFactory 自定义对象类被定义在工程中，在 MyBatis 全局配置文件 SqlMapConfig.xml 中配置。当 Resource 资源类加载 SqlMapConfig.xml 文件，并创建出 SqlSessionFactory 时，会加载配置文件中的自定义 objectFactory，并设置配置标签中包裹的 property 参数。

在配置文件 SqlMapConfig.xml 中进行配置对象工厂的方式如下：

```xml
<objectFactory type="org.mybatis.example.MyObjectFactory">
    <property name="email" value="undefined"/>
</objectFactory>
```

### 2.6 plugins 标签

在 MyBatis 中，对某种方法进行拦截调用的机制，被称为**plugin（插件）**。使用 plugin 可以很好地对方法的调用进行监控，而且还可以修改或重写方法的行为逻辑。

> plugin 可以操作 MyBatis 的框架核心方法，在修改 plugin 时可能会影响框架的稳定性，所以在编写 plugin 时要十分谨慎。

MyBatis 允许使用 plugin 来拦截的方法有：

| 类/接口          | 方法                                                                              |
| ---------------- | --------------------------------------------------------------------------------- |
| Executor         | update, query, flushStatements, commit, rollback, getTransaction, close, isClosed |
| ParameterHandler | getParameterObject, setParameters                                                 |
| ResultSetHandler | handleResultSets, handleOutputParameters                                          |
| StatementHandler | prepare, parameterize, batch, update, query                                       |

> -   Executor 是 MyBatis 对外提供的一个操作接口类，其中包含了上述的这些核心方法；
> -   ParameterHandler, ResultSetHandler, StatementHandler 分别是处理参数、结果集、预编译状态的接口，里面的一些方法也可以使用 plugin 拦截。

实现一个 plugin 也很简单，只要继承 Interceptor 接口，并指定需要拦截的签名信息即可：

```java
import org.apache.ibatis.executor.Executor;
import org.apache.ibatis.mapping.MappedStatement;
import org.apache.ibatis.plugin.*;
import org.apache.ibatis.session.ResultHandler;
import org.apache.ibatis.session.RowBounds;
import java.util.Properties;
@Intercepts({
    @Signature(
        type = Executor.class,
        method = "query",
        args = {MappedStatement.class, Object.class, RowBounds.class, ResultHandler.class}
    )
})

public class QueryPlugin implements Interceptor {
    @Override
    public Object intercept(Invocation invocation) throws Throwable {
        return invocation.proceed();
    }

    @Override
    public Object plugin(Object target) {
        return Plugin.wrap(target, this);
    }

    @Override
    public void setProperties(Properties properties) {
    }
}
```

### 2.7 DataSource 标签

数据源 DataSource 在 MyBatis 中有三种内建的数据源类型，分别为 UNPOOLED, POOLED, JNDI。

| 数据源类型 | 说明                                                                                                       |
| ---------- | ---------------------------------------------------------------------------------------------------------- |
| UNPOOLED   | 设置每次请求时打开和关闭连接                                                                               |
| POOLED     | 设置一个管理数据库连接的资源池，用来合理控制数据库的连接与关闭次数，利用“池”的概念将 JDBC 连接对象组织起来 |
| JNDI       | 配置连接外部数据源（如服务器提供的数据源）的信息                                                           |

在DataSource中配置以JDBC标准连接数据库所需要的各项参数信息后，依据DataSource的不同，可以设置以下属性：

![44](https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/MyBatis/44.png)

当然也可以设置自己的数据源，通过实现`DataSourceFactory`接口来实现（也可以引入其他第三方数据源）。

### 2.8 mappers标签

MyBatis是基于SQL映射配置的框架，SQL语句都写在XxxMapper配置文件中，当构建SqlSession类之后，就需要读取Mapper配置文件中的SQL配置。而SqlMapConfig.xml中的mappers标签就用来配置需要加载的SQL映射配置文件的路径。

mappers标签下有许多mapper标签，每一个mapper标签中配置的都是一个独立的Mapper映射配置文件的路径。有以下几种配置方式：

1. 使用相对路径进行配置

    ```xml
    <mappers>
        <mapper resource="org/mybatis/mappers/UserMapper.xml"/>
        <mapper resource="org/mybatis/mappers/ProductMapper.xml"/>
        <mapper resource="org/mybatis/mappers/ManagerMapper.xml"/>
    </mappers>
    ```

2. 使用绝对路径进行配置

    ```xml
    <mappers>
        <mapper url="file:///var/mappers/UserMapper.xml"/>
        <mapper url="file:///var/mappers/ProductMapper.xml"/>
        <mapper url="file:///var/mappers/ManagerMapper.xml"/>
    </mappers>
    ```

3. 使用接口信息进行配置

    ```xml
    <mappers>
        <mapper class="org.mybatis.mappers.UserMapper"/>
        <mapper class="org.mybatis.mappers.ProductMapper"/>
        <mapper class="org.mybatis.mappers.ManagerMapper"/>
    </mappers>
    ```

4. 使用接口所在包进行配置

    ```xml
    <mappers>
        <package name="org.mybatis.mappers"/>
    </mappers>
    ```

