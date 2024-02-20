---
title: MyBatis入门
---

## 1. 概念

MyBatis是Apache的一个Java开源项目，原名为iBatis（即Internet与abatis的结合），后因项目托管平台的迁移（由Google     Code转移至Github）更名为MyBatis。MyBatis采用配置文件动态管理SQL语句，是一款并含有输入映射、输出映射机制以及数据库连接池配置的持久层框架。

Mybatis整体的构造由**MyBatis核心配置文件**、**SQL映射配置文件**、**会话工厂**、**会话**、**执行器**以及**底层封装对象**组成。

### 1.1 MyBatis核心配置文件

通常命名为SqlMapConfig.xml（文件名可更改），主要涉及数据源（数据库连接池）等数据库的核心配置。

数据库连接池让数据库的配置信息从外部的某种配置文件中读取，然后由一个独立处理数据库连接的程序来和数据库进行交互，该配置文件中主要配置了数据库驱动、数据库连接地址、数据库用户名和密码、事务管理等参数。

### 1.2 SQL映射配置文件

MyBatis将SQL语句配置在独立的配置文件XxxMapper.xml（文件名可更改）中，简称Mapper配置文件。在这个配置文件中可以配置任何类型的SQL语句，如select, update, delete, insert等。

为了让MyBatis能够找到Mapper.xml文件，需要在核心配置文件SqlMapConfig.xml中配置Mapper.xml的路径。

- 一般会配置在核心源配置文件SqlMapConfig.xml中配置Mapper.xml的文件路径：

    ```xml
    <mappers>
        <mapper resource="sqlmap/UserMapper.xml"/>
        <mapper resource="sqlmap/GoodsMapper.xml"/>
    </mappers>
    ```

- Mapper.xml示例

    ```xml
    <?xml version="1.0" encoding="UTF-8" ?>
    <!DOCTYPE mapper
            PUBLIC "-//mybatis.org.//DTD Mapper 3.0//EN"
            "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
    <mapper>
        <select id="findUserById" parameterType="int" resultType="cn.com.mybatis.model.User">
            SELECT * FROM USER WHERE id=#{id}
        </select>
    </mapper>
    ```

    - parameterType——指定输入参数的类型
    - resultType——指定输出结果映射的Java对象类型

### 1.3 会话工厂与会话

MyBatis中处理配置信息的核心对象就是会话工厂（`SqlSessionFactory`类）与会话（`SqlSession`类）。

- `SqlSessionFactory`类：SqlSessionFactory类根据Resources资源信息加载对象，获取开发人员在项目中配置的SqlMapConfig.xml配置信息；当然，由于Mapper.xml的路径配置在SqlMapConfig.xml中，`SqlSessionFactory`也会同时获取Mapper.xml的配置信息。
- 由上，产生可以与数据库交互的会话实例类——`SqlSession`类。

### 1.4 MyBatis运行流程

![41](https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/MyBatis/41.png)

## 2. MyBatis开发步骤

1. 添加MyBatis的坐标；

    ```xml
    <!--mysql连接驱动-->
    <dependency>
    	<groupId>mysql</groupId>
    	<artifactId>mysql-connector-java</artifactId>
    	<version>8.0.11</version>
    </dependency>
    <!--mybatis依赖-->
    <dependency>
    	<groupId>org.mybatis</groupId>
    	<artifactId>mybatis</artifactId>
    	<version>3.5.6</version>
    </dependency>
    ```

2. 创建user数据表；

    ![42](https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/MyBatis/42.png)

3. 创建User实体类；

    ```java
    package com.chuan.mybatis.domain;
    
    /**
     * @author chuan
     * @date 2021/4/14 19:29
     */
    public class User {
        private int id;
        private String username;
        private String password;
        public User() {
        }
        public User(int id, String username, String password) {
            this.id = id;
            this.username = username;
            this.password = password;
        }
        public int getId() {
            return id;
        }
        public void setId(int id) {
            this.id = id;
        }
        public String getUsername() {
            return username;
        }
        public void setUsername(String username) {
            this.username = username;
        }
        public String getPassword() {
            return password;
        }
        public void setPassword(String password) {
            this.password = password;
        }
        @Override
        public String toString() {
            return "User{" +
                    "id=" + id +
                    ", username='" + username + '\'' +
                    ", password='" + password + '\'' +
                    '}';
        }
    }
    ```

4. 编写映射文件UserMapper.xml

    ```xml
    <?xml version="1.0" encoding="UTF-8" ?>
    <!DOCTYPE mapper PUBLIC "-//mybatis.org.//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
    <mapper namespace="userMapper">
        <select id="findAll" resultType="com.chuan.mybatis.domain.User">
            SELECT * FROM USER
        </select>
        <select id="findUserById" parameterType="int" resultType="com.chuan.mybatis.domain.User">
            SELECT * FROM USER WHERE id=#{id}
        </select>
    </mapper>
    ```

5. 编写核心文件SqlMapConfig.xml

    ```xml
    <?xml version="1.0" encoding="UTF-8" ?>
    <!DOCTYPE configuration PUBLIC "-//mybatis.org/DTD Config 3.0//EN" "http://mybatis.org/dtd/mybatis-3-config.dtd">
    <configuration>
        <settings>
            <setting name="logImpl" value="LOG4J"/>
        </settings>
        <!--和Spring整合后environments标签将被废除-->
        <environments default="development">
            <environment id="development">
                <!--使用JDBC事务管理-->
                <transactionManager type="JDBC"/>
                <!--数据库连接池-->
                <dataSource type="POOLED">
                    <property name="driver" value="com.mysql.cj.jdbc.Driver"/>
                    <!--mybatis_test表示哪个数据库，?serverTimezone=GMT%2B8为设置时区（正常不应该需要这个语句）-->
                    <property name="url" value="jdbc:mysql://localhost:3306/mybatis_test?serverTimezone=GMT%2B8"/>
                    <property name="username" value="root"/>
                    <property name="password" value="3.14"/>
                </dataSource>
            </environment>
        </environments>
        <!--加载映射文件-->
        <mappers>
            <mapper resource="com/itheima/mapper/UserMapper.xml"/>
        </mappers>
    </configuration>
    ```

6. 编写测试类。

    - 为了后续方便，单独编写一个DataConnection工具类

        ```java
        package com.chuan.mybatis.utils;
        import org.apache.ibatis.io.Resources;
        import org.apache.ibatis.session.SqlSession;
        import org.apache.ibatis.session.SqlSessionFactory;
        import org.apache.ibatis.session.SqlSessionFactoryBuilder;
        import java.io.IOException;
        import java.io.InputStream;
        /**
         * @author chuan
         * @date 2021/4/15 9:52
         */
        public class DataConnection {
            // MyBatis配置文件，其位置是相对类加载路径的位置
            private String resource = "SqlMapConfig.xml";
            private SqlSessionFactory sqlSessionFactory;
            private SqlSession sqlSession;
            public SqlSession getSqlSession() throws IOException {
                // 加载MyBatis核心配置文件
                InputStream inputStream = Resources.getResourceAsStream(resource);
                // 创建SqlSessionFactory工厂对象，传入MyBatis配置文件信息
                sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
                // 获得SqlSession对象（之后就可以执行sql语句了）
                sqlSession = sqlSessionFactory.openSession();
                return sqlSession;
            }
        }
        ```

    - 测试类

        ```java
        package com.chuan.mybatis;
        import com.chuan.mybatis.domain.User;
        import com.chuan.mybatis.utils.DataConnection;
        import org.apache.ibatis.session.SqlSession;
        import org.junit.jupiter.api.Test;
        import java.io.IOException;
        import java.util.List;
        /**
         * @author chuan
         * @date 2021/4/15 9:56
         */
        public class UserTest {
            public DataConnection dataConnection = new DataConnection();
            @Test
            public void TestSelect() throws IOException {
                SqlSession sqlSession = dataConnection.getSqlSession();
                // sqlSession.selectOne最终结果对应映射文件中所匹配的resultType类型，其第一个参数为Mapper中的namespace.id
                User user = sqlSession.selectOne("userMapper.findUserById", 1);
                System.out.println(user);
        
                List<User> userList = sqlSession.selectList("userMapper.findAll");
                System.out.println(userList);
                sqlSession.close();
            }
        }
        ```

    - 测试结果

        ![43](https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/MyBatis/43.png)

