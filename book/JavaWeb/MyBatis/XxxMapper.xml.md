---
title: XxxMapper.xml
date: 2020-11-04
---

## 1. 整体介绍

首先一定不能忘记声明 xml 的版本和编码格式，以及引入 MyBatis 的 DTD 文档定义类型：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper
		PUBLIC "-//mybatis.org.//DTD Mapper 3.0//EN"
			   "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
```

配置文件的正文都被包裹在 **mapper 标签对**中，mapper 标签有一个 **namespace 属性**，其作用是对 SQL 进行分类化管理，实现不同业务的 SQL 隔离。接下来编写 SQL 语句配置即可，对应的标签有 insert, delete, update, select 等。

-   根标签：`<mapper namespace=""></mapper>`

-   SQL 语句标签

    -   `<select></select>`

    -   `<insert></insert>`

    -   `<delete></delete>`

    -   `<update></update>`

        > SQL 语句标签都有如下属性（当需要使用 Java 类型时一般都要声明该类型的**全路径名称**）：
        >
        > | 属性          | 说明                                         |
        > | ------------- | -------------------------------------------- |
        > | parameterType | 输入参数类型（一般是基本数据类型或包装类型） |
        > | parameterMap  | 输入参数集合（一般是 Map 集合）              |
        > | resultType    | 结果类型（基本数据类型或包装类型）           |
        > | resultClass   | 结果类（一般是 Java 类）                     |
        > | resultMap     | 结果集合（一般是 Map 集合）                  |

示例解析：

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org.//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="test">
    <select id="findUserById" parameterType="int" resultType="cn.com.mybatis.po.User">
        SELECT * FROM USER WHERE id=#{id}
    </select>

    <select id="findUserByUsername" parameterType="java.lang.String" resultType="cn.com.mybatis.po.User">
        SELECT * FROM USER WHERE username LIKE '%${value}%'
    </select>

    <insert id="insertUser" parameterType="cn.com.mybatis.po.User">
        <selectKey keyProperty="id" order="AFTER" resultType="java.lang.Integer">
            SELECT LAST_INSERT_ID()
        </selectKey>
        insert into user(username, password, gender, birthday, email, province, city)
        value (#{username}, #{password}, #{gender}, #{birthday, jdbcType=DATE}, #{email}, #{province}, #{city})
    </insert>

    <delete id="deleteUser" parameterType="java.lang.Integer">
        delete from user where id=#{id}
    </delete>

    <update id="updateUsername" parameterType="cn.com.mybatis.po.User">
        update user set username=#{username} where id=#{id}
    </update>

</mapper>
```

> 1. 在 SQL 语句标签中还有一个值为 findUserById 的 **id 属性**，这是因为 SQL 映射配置文件中的 SQL 都被解析并封装到 mappedStatement 对象中，为了调取对应的 SQL，需要一个唯一的标识，所以该 id 属性是映射文件中的 SQL 被解析并转换成为 Statement 的 id。
> 2. `#{}`表示一个占位符，其接收的参数类型可以是简单类型、普通 JavaBean 或 HashMap。对于简单类型，参数映射的时候{}内可以不写或者任意写任意内容；对于复杂类型，{}内应该填写该类的属性值。
> 3. `${}`表示拼接 SQL 串，将接收到的参数内容不加任何修饰地拼接在 SQL 中，在`${}`中只能使用 value 代表其中的参数。在 Web 项目中，如果没有防范 SQL 注入的机制，要谨慎使用`${}`符号拼接 SQL 语句串，因为可能会引起 SQL 注入的风险。

对应的 Java 类示例：

```java
package cn.com.mybatis.test;

import cn.com.mybatis.datasource.DataConnection;
import cn.com.mybatis.po.User;

import org.apache.ibatis.session.SqlSession;
import org.junit.jupiter.api.Test;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.List;
public class MyBatisTest {

    public DataConnection dataConn = new DataConnection();

    @Test
    public void TestSelect() throws IOException {
        SqlSession sqlSession = dataConn.getSqlSession();
        // sqlSession.selectOne 最终结果与映射文件中所匹配的 resultType 类型
        User user = sqlSession.selectOne("test.findUserById", 1);
        System.out.println("姓名：" + user.getUsername());
        System.out.println("性别：" + user.getGender());
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        System.out.println("生日：" + sdf.format(user.getBirthday()));
        System.out.println("所在地：" + user.getProvince() + user.getCity());
        sqlSession.close();
    }

    @Test
    public void TestFuzzySearch() throws IOException {
        SqlSession sqlSession = dataConn.getSqlSession();
        // 模糊匹配，结果可能不止一个，所以使用 List<>
        List<User> userList = sqlSession.selectList("test.findUserByUsername", "李");
        for (int i = 0; i < userList.size(); ++i) {
            User u = userList.get(i);
            System.out.println("姓名：" + u.getUsername());
            System.out.println("性别：" + u.getGender());
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            System.out.println("生日：" + sdf.format(u.getBirthday()));
            System.out.println("所在地：" + u.getProvince() + u.getCity());
        }
        sqlSession.close();
    }

    @Test
    /*
	 * 这里要注意的是，没有给 User 设置 id 属性。 原因是在数据库建表的时候对 id 主键设置的是自增策略， 所以 id 会被赋值为自增的新数据
	 */
    public void TestInsert() throws Exception {
        SqlSession sqlSession = dataConn.getSqlSession();
        User user = new User();
        user.setUsername("孙佳佳");
        user.setGender("男");
        user.setPassword("5555");
        user.setEmail("5555@126.com");
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        user.setBirthday(sdf.parse("1991-02-16"));
        user.setProvince("湖北省");
        user.setCity("武汉市");
        sqlSession.insert("test.insertUser", user);
        sqlSession.commit();
        sqlSession.close();
    }

    @Test
    public void TestDelete() throws Exception {
        SqlSession sqlSession = dataConn.getSqlSession();
        sqlSession.delete("test.deleteUser", 7);
        sqlSession.commit();
        sqlSession.close();
    }

    @Test
    public void TestUpdate() throws Exception {
        SqlSession sqlSession = dataConn.getSqlSession();
        User user = new User();
        user.setId(4);
        user.setUsername("孙丽");
        sqlSession.update("test.updateUsername", user);
        sqlSession.commit();
        sqlSession.close();
    }
}
```

## 2. 配置标签详解

Mapper 配置文件标签一览

| 标签名称     | 标签作用                                                   |
| ------------ | ---------------------------------------------------------- |
| insert       | 映射插入语句                                               |
| update       | 映射更新语句                                               |
| delete       | 映射删除语句                                               |
| select       | 映射查询语句                                               |
| resultMap    | 将从数据库结果集取出的数据映射到相应的实体对象的相应字段中 |
| sql          | 配置可以被其他语句引用的 SQL 语句块                        |
| cache        | 给定命名空间的缓存配置                                     |
| cache-ref    | 其他命名空间缓存配置的引用                                 |
| parameterMap | 参数映射，此配置现已被废弃                                 |

SQL 语句配置中的各属性的含义：

| 属性名           | 含义                                                                                                                                  | 所属标签         |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| id               | SQL 映射配置的唯一标识，可以代表 SQL 配置                                                                                             | select           |
| parameterType    | 可选属性，用来传入 SQL 配置中需要的参数类型的类名或别名                                                                               | select           |
| resultType       | 可选属性，用来配置 SQL 语句执行后期望得到的结果数据类型，配置的是结果类型的类名或别名。此属性不能与 resultMap 同时使用                | select           |
| resultMap        | 用来引入外部结果集配置，该结果集配置对应 SQL 结果中的每个字段名称，即将映射到 Java 对象中的哪个属性。此属性不能与 resultType 同时使用 | select           |
| flushCache       | 设置语句调用时，是否清空本地缓存和二级缓存，默认为 false                                                                              | select           |
| useCache         | 设置语句调用时，执行结果是否保存二级缓存，对 select 元素默认为 false                                                                  | select           |
| timeout          | 在抛出异常前，驱动程序等待数据库回应的最大秒数                                                                                        | select           |
| fetchSize        | 设置驱动程序每次批量返回结果的行数                                                                                                    | select           |
| statementType    | 设置 MyBatis 的 Statement 类型，可以为 STATEMETN/PREPARED/CALLABLE，默认为 PREPARED                                                   | select           |
| resultSetType    | 设置 MyBatis 的结果集类型，可以为 FORWARD_ONLY/SCROLL_SENSITIVE/SCROLL_INSENSITIVE，默认无设置                                        | select           |
| databaseId       | 在配置 databaseIdProvider 的情况下，MyBatis 会加载所有不带 databaseId 或者匹配当前 databaseId 的语句                                  | select           |
| resultOrdered    | 在嵌套查询语句中使用，如果设置为 true，则表示 SQL 执行结果为嵌套结果或者分组                                                          | select           |
| resultSets       | 当有多个结果集的时候使用，会为 SQL 执行后返回的每个结果集设定一个名称，以逗号分隔                                                     | select           |
| useGeneratedKeys | 设置 MyBatis 使用 JDBC 的 getGeneratedKeys 方法来获取由数据库内部生成的主键（自增主键），默认为 false                                 | insert \| update |
| keyProperty      | 代表主键，MyBatis 会将生成的主键赋给这个列。联合主键使用逗号隔开                                                                      | insert \| update |
| keyColumn        | 仅对特定数据库生效，当主键列不是表中的第一列时需要设置该属性。如果希望得到多个生成的列，也可以是以逗号分隔的属性名称列表              | insert \| update |

### 2.1 resultType & resultMap 标签

Mapper 配置输出映射有两种方式：resultType 和 resultMap。

> resultType 就没啥好说的…

可以通过定义一个 resultMap 在列名和 Java 包装类属性名之间创建映射关系。

使用 resultMap 可以定义一个结果集配置，该配置声明了 SQL 查询结果集中的每一个字段与 type 中指定的 Java 实体类的哪个属性名对应，以及该配置最终生成的类型格式。

如下，这里对于 select 配置使用 resultMap 进行输出映射，其中 userResultMap 就是一个 resultMap 配置的 id，表明该 SQL 配置的结果集要指向那个 resultMap 配置。

```xml
<resultMap type="cn.com.mybatis.po.User" id="userResultMap">
    <id column="_id" property="id" />
    <result column="_username" property="username"/>
</resultMap>

<select id="findUserByResultMap" parameterType="int" resultMap="userResultMap">
    select id _id, username _username from user where id=#{value}
</select>
```

resultMap 还有两个稍微复杂一些的属性：association, collection。它们以后碰到再说吧。

### 2.2 discriminator 标签

在 MyBatis 的 SQL 查询结果集中，有时需要根据某个字段的值，来决定关联哪种结果集，此时就需要使用 discriminator（鉴别器）来实现。

### 2.3 “动态 SQL”相关标签

MyBatis 提供了一种可以根据条件动态配置 SQL 语句，以及单独配置 SQL 语句块的机制。

动态 SQL 主要涉及以下几个标签：

| 标签    | 子标签           |
| ------- | ---------------- |
| if      | /                |
| choose  | when,  otherwise |
| trim    | where,  set      |
| foreach |                  |

当查询语句的查询条件由于输入参数的不同而无法确切定义时，可以使用`<where>`标签对来包裹需要动态指定的 SQL 查询条件，而在`<where>`标签对中，可以使用`<if test="…">`条件来分情况设置 SQL 查询条件。

> 下面的样例设置了当输入参数的 Java 包装类中含有的条件不同时，查询条件可动态变化。

```xml
<select id="findUserList" parameterType="cn.com.mybatis.po.UserQueryVo" 
        resultType="cn.com.mybatis.po.User">
    select * from user
    <where>
        <if test="UserQueryVo!=null">
            <if test="UserQueryVo.gender!=null and UserQueryVo.gender!=''">
                and user.sex=#{UserQueryVo.gender}
            </if>
            <if test="UserQueryVo.username!=null and UserQueryVo.username!=''">
                and user.username like '%${UserQueryVo.username}%'
            </if>
        </if>
    </where>
</select>
```

## 3. 自动映射

当 SQL 语句查询出结果时，如果对应输出配置的 Java 包装类中有相同名称的属性，且拥有 set 方法，则该结果就会被自动映射。

> 实际上，MyBatis 的自动映射功能是建立在 resultMap 基础之上的。resutlType 属性自动映射的原理是：当 SQL 映射输出配置为 resultType 时，MyBatis 会生成一个空的 resultMap，然后指定这个 resultMap 的 type 为指定的 resultType 类型，接着 MyBatis 检测查询结果集中字段与指定 type 类型中属性的映射关系，对结果进行自动映射。

可通过在 MyBatis 全局配置文件 SqlMapConfig.xml 中的 setting 标签内设置自动映射模式：

```xml
<setting name="autoMappingBehavior" value="PARTIAL"/>
```

在 MyBatis 中，自动映射有三种模式，分别是 NONE, PARTIAL,     FULL，默认为 PARTIAL。

|  模式   |               说明                |
| :-----: | :-------------------------------: |
|  NONE   |          不启用自动映射           |
| PARTIAL | 只对非嵌套的 resultMap 进行自动映射 |
|  FULL   |  对所有的 resultMap 都进行自动映射  |

如果只有部分字段与输入配置类型中的属性名称不一样，则可以仅在 resultMap 中指定不一样的字段对应#的输出类型的属性，其他的则会直接进行自动映射。

如果在某些 resultMap 中不想使用自动映射，则可以单独在该 resultMap 中设置 autoMapping 属性为 false，此时该 resultMap 仅映射开发人员指定的映射字段。

```xml
<select id="findUserById" parameterType="java.lang.Long" resultMap="UserResult" autoMapping="false">
    select id, name, email from t_user where id=#{id}
</select>
```
