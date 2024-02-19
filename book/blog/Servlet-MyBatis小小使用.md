---
title: Servlet+MyBatis小小使用
date: 2021-06-27 09:50:34
categories: Java
---

在学 Servlet 的时候，视频老师用的是 JDBC/Spring JDBCTemplate 作为 DAO 层技术的，但现在主流技术都是 MyBatis 嘛，自己又是个新手，MyBatis 刚学了也没怎么实践过，就想着自己胡戳着把 DAO 层改成 MyBatis 来实现，同时增强 Servlet 和 MyBatis 的基础使用知识。

<!-- more -->

> 需要额外提一句的是，这里没有使用数据库连接池技术，有点遗憾但饭还得一口一口吃。

## 1. 项目概览

先来看看项目结构，主要关注 Java 代码目录 com/chuan/servlet/\*，及相关的配置文件目录。

```shell
.
├── pom.xml
├── servlet.iml
├── src
│   ├── main
│   │   ├── java
│   │   │   └── com
│   │   │       └── chuan
│   │   │           └── servlet
│   │   │               ├── entity
│   │   │               │   └── User.java
│   │   │               ├── mapper
│   │   │               │   └── UserMapper.java
│   │   │               ├── service
│   │   │               │   └── UserService.java
│   │   │               └── web
│   │   │                   ├── ServletTestDemo1.java
│   │   │                   └── servlet
│   │   │                       ├── LoginFailServlet.java
│   │   │                       ├── LoginServlet.java
│   │   │                       └── LoginSuccessServlet.java
│   │   ├── resources
│   │   │   ├── com
│   │   │   │   └── chuan
│   │   │   │       └── servlet
│   │   │   │           └── mapper
│   │   │   │               └── UserMapper.xml
│   │   │   ├── jdbc.properties
│   │   │   └── sqlMapConfig.xml
│   │   └── webapp
│   │       ├── WEB-INF
│   │       │   └── web.xml
│   │       ├── index.jsp
│   │       └── login.html
│   └── test
│       ├── java
│       │   └── com
│       │       └── chuan
│       │           └── servlet
│       │               └── service
│       │                   └── UserServiceTest.java
│       └── resources
└── target
    ├── classes
    │   ├── com
    │   │   └── chuan
    │   │       └── servlet
    │   │           ├── entity
    │   │           │   └── User.class
    │   │           ├── mapper
    │   │           │   ├── UserMapper.class
    │   │           │   └── UserMapper.xml
    │   │           ├── service
    │   │           │   └── UserService.class
    │   │           └── web
    │   │               ├── ServletTestDemo1.class
    │   │               └── servlet
    │   │                   ├── LoginFailServlet.class
    │   │                   ├── LoginServlet.class
    │   │                   └── LoginSuccessServlet.class
    │   ├── jdbc.properties
    │   └── sqlMapConfig.xml
    ├── generated-sources
    │   └── annotations
    ├── generated-test-sources
    │   └── test-annotations
    ├── servlet-1.0-SNAPSHOT
    │   ├── META-INF
    │   │   └── MANIFEST.MF
    │   ├── WEB-INF
    │   │   ├── classes
    │   │   │   ├── com
    │   │   │   │   └── chuan
    │   │   │   │       └── servlet
    │   │   │   │           ├── entity
    │   │   │   │           │   └── User.class
    │   │   │   │           ├── mapper
    │   │   │   │           │   ├── UserMapper.class
    │   │   │   │           │   └── UserMapper.xml
    │   │   │   │           ├── service
    │   │   │   │           │   └── UserService.class
    │   │   │   │           └── web
    │   │   │   │               ├── ServletTestDemo1.class
    │   │   │   │               └── servlet
    │   │   │   │                   ├── LoginFailServlet.class
    │   │   │   │                   ├── LoginServlet.class
    │   │   │   │                   └── LoginSuccessServlet.class
    │   │   │   ├── jdbc.properties
    │   │   │   └── sqlMapConfig.xml
    │   │   ├── lib
    │   │   │   ├── lombok-1.18.18.jar
    │   │   │   ├── mybatis-3.5.6.jar
    │   │   │   ├── mysql-connector-java-8.0.11.jar
    │   │   │   ├── protobuf-java-2.6.0.jar
    │   │   │   ├── slf4j-api-1.7.30.jar
    │   │   │   └── slf4j-simple-1.7.30.jar
    │   │   └── web.xml
    │   ├── index.jsp
    │   └── login.html
    └── test-classes
        └── com
            └── chuan
                └── servlet
                    └── service
                        └── UserServiceTest.class

57 directories, 47 files
```

这里是项目的`pom.xml`：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.chuan</groupId>
    <artifactId>servlet</artifactId>
    <version>1.0-SNAPSHOT</version>
    <name>servlet</name>
    <packaging>war</packaging>

    <properties>
        <maven.compiler.target>1.8</maven.compiler.target>
        <maven.compiler.source>1.8</maven.compiler.source>
        <junit.version>5.7.1</junit.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>javax.servlet</groupId>
            <artifactId>javax.servlet-api</artifactId>
            <version>4.0.1</version>
            <scope>provided</scope>
        </dependency>
        <dependency>
            <groupId>org.junit.jupiter</groupId>
            <artifactId>junit-jupiter-api</artifactId>
            <version>${junit.version}</version>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.junit.jupiter</groupId>
            <artifactId>junit-jupiter-engine</artifactId>
            <version>${junit.version}</version>
            <scope>test</scope>
        </dependency>

        <!--lombok相关-->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <version>1.18.18</version>
        </dependency>
        <dependency>
            <groupId>org.slf4j</groupId>
            <artifactId>slf4j-api</artifactId>
            <version>1.7.30</version>
        </dependency>
        <dependency>
            <groupId>org.slf4j</groupId>
            <artifactId>slf4j-simple</artifactId>
            <version>1.7.30</version>
        </dependency>

        <!--mybatis-->
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <version>8.0.11</version>
        </dependency>
        <dependency>
            <groupId>org.mybatis</groupId>
            <artifactId>mybatis</artifactId>
            <version>3.5.6</version>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-war-plugin</artifactId>
                <version>3.3.0</version>
            </plugin>
        </plugins>
    </build>
</project>
```

## 2. `User.java`

```java
package com.chuan.servlet.entity;

import lombok.Data;

@Data
public class User {
    private int id;
    private String username;
    private String password;
}
```

## 3. `UserMapper.java` & `UserMapper.xml`

-   这里是`UserMapper.java`：

```java
package com.chuan.servlet.mapper;

import com.chuan.servlet.entity.User;
import org.apache.ibatis.annotations.Param;

public interface UserMapper {
    int insert(User user);

    int deleteById(int userId);

    int update(User user);

    User getUserById(int userId);

    User getUser(@Param("username") String username,
                 @Param("password") String password);
}
```

-   这里是`UserMapper.xml`：

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd" >
<mapper namespace="com.chuan.servlet.mapper.UserMapper">
    <sql id="table">user</sql>

    <insert id="insert" parameterType="user">
        INSERT INTO
        <include refid="table"/>
        (id, username, password)
        VALUES (#{id}, #{username}, #{password})
    </insert>

    <delete id="deleteById" parameterType="Integer">
        DELETE FROM
        <include refid="table"/>
        WHERE id = #{id}
    </delete>

    <update id="update" parameterType="user">
        UPDATE
        <include refid="table"/>
        <set>
            <if test="username != null">username=#{username}</if>
            <if test="password != null">password=#{password}</if>
        </set>
        WHERE id = #{id}
    </update>

    <select id="getUserById" parameterType="Integer" resultType="user">
        SELECT * FROM
        <include refid="table"/>
        WHERE id = #{id}
        ORDER BY id ASC
    </select>

    <select id="getUser" resultType="user">
        SELECT * FROM
        <include refid="table"/>
        WHERE username = #{username} AND password = #{password}
    </select>
</mapper>
```

## 4. `UserService.java`

```java
package com.chuan.servlet.service;

import com.chuan.servlet.entity.User;
import com.chuan.servlet.mapper.UserMapper;
import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;

import java.io.IOException;
import java.io.InputStream;

public class UserService {
    public User login(User loginUser) {
        try {
            InputStream resourceAsStream = Resources.getResourceAsStream("sqlMapConfig.xml");
            SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(resourceAsStream);
            SqlSession sqlSession = sqlSessionFactory.openSession();
            UserMapper userMapper = sqlSession.getMapper(UserMapper.class);
            User user = userMapper.getUser(loginUser.getUsername(), loginUser.getPassword());
            sqlSession.commit();
            sqlSession.close();
            return user;
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }
}
```

## 5. `LoginServlet.java` & `LoginXxxServlet.java`

-   这里是`LoginServlet.java`：

```java
package com.chuan.servlet.web.servlet;

import com.chuan.servlet.service.UserService;
import com.chuan.servlet.entity.User;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet("/loginServlet")
public class LoginServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        // 1. 设置编码
        req.setCharacterEncoding("utf-8");
        // 2. 获取请求参数
        String username = req.getParameter("username");
        String password = req.getParameter("password");
        // 3. 封装User对象
        User loginUser = new User();
        loginUser.setUsername(username);
        loginUser.setPassword(password);
        // 4. 调用UserService的login方法
        UserService userService = new UserService();
        User user = userService.login(loginUser);
        // 5. 判断User
        if (user == null){
            // 登录失败
            req.getRequestDispatcher("/failServlet").forward(req, resp);
        }else{
            // 登录成功
            // 先存储数据
            req.setAttribute("user", user);
            // 再转发
            req.getRequestDispatcher("/successServlet").forward(req, resp);
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        this.doGet(req, resp);
    }
}
```

-   这里是`LoginSuccessServlet.java`：

```java
package com.chuan.servlet.web.servlet;

import com.chuan.servlet.entity.User;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet("/successServlet")
public class LoginSuccessServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        User user = (User) request.getAttribute("user");
        if (user != null) {
            // 给页面写一句话
            response.setContentType("text/html;charset=utf-8");
            response.getWriter().write("登录成功！" + user + "，欢迎您。");
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.doGet(request, response);
    }
}
```

-   这里是`LoginFailServlet.java`：

```java
package com.chuan.servlet.web.servlet;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.IOException;

@WebServlet("/failServlet")
public class LoginFailServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // 给页面写一句话
        response.setContentType("text/html;charset=utf-8");
        response.getWriter().write("登录失败，用户名或密码错误");
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.doGet(request, response);
    }
}
```

## 6. `sqlMapConfig.xml`&`jdbc.properties`配置文件

-   这里是`sqlMapConfig.xml`：

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration PUBLIC "-//mybatis.org//DTD Config 3.0//EN" "http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>
    <properties resource="jdbc.properties"/>
    <typeAliases>
        <package name="com.chuan.servlet.entity"/>
    </typeAliases>
    <environments default="development">
        <environment id="development">
            <transactionManager type="JDBC"/>
            <dataSource type="POOLED">
                <property name="driver" value="${jdbc.driver}"/>
                <property name="url" value="${jdbc.url}"/>
                <property name="username" value="${jdbc.username}"/>
                <property name="password" value="${jdbc.password}"/>
            </dataSource>
        </environment>
    </environments>
    <mappers>
        <!--<mapper resource="com/chuan/servlet/mapper/UserMapper.xml"/>-->
        <package name="com.chuan.servlet.mapper"/>
    </mappers>
</configuration>
```

-   这里是`jdbc.properties`：

```conf
jdbc.driver=com.mysql.cj.jdbc.Driver
jdbc.url=jdbc:mysql://localhost:3306/practice_java?useUnicode=true&characterEncoding=utf8&serverTimezone=UTC
jdbc.username=root
jdbc.password=**网络加密**
```

## 7. `login.html`前端展示

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <title>登录</title>
    </head>
    <body>
        <form action="/servlet_learning/loginServlet" method="post">
            用户名：<input type="text" name="username" /> <br />
            密码：<input type="password" name="password" /> <br />

            <input type="submit" value="登录" />
        </form>
    </body>
</html>
```

## 8. 其他

-   这里是`ServletTestDemo1.java`：

```java
package com.chuan.servlet.web;

import javax.servlet.*;
import java.io.IOException;

public class ServletTestDemo1 implements Servlet {
    @Override
    public void init(ServletConfig servletConfig) throws ServletException {
        System.out.println("ServletDemo1 is initializing...");
    }

    @Override
    public ServletConfig getServletConfig() {
        return null;
    }

    @Override
    public void service(ServletRequest servletRequest, ServletResponse servletResponse) throws ServletException, IOException {
        System.out.println("Hello, Servlet!");
    }

    @Override
    public String getServletInfo() {
        return null;
    }

    @Override
    public void destroy() {
        System.out.println("ServletDemo1 is destroying...");
    }
}
```

-   这里是`web.xml`：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee http://xmlns.jcp.org/xml/ns/javaee/web-app_4_0.xsd"
         version="4.0">
    <servlet>
        <servlet-name>demo1</servlet-name>
        <servlet-class>com.chuan.servlet.web.ServletTestDemo1</servlet-class>
        <!--<load-on-startup>1</load-on-startup>-->
    </servlet>
    <servlet-mapping>
        <servlet-name>demo1</servlet-name>
        <url-pattern>/demo1</url-pattern>
    </servlet-mapping>
</web-app>
```

-   这里是`index.jsp`：

```jsp
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <title>JSP - Hello World</title>
</head>
<body>
<%--以下代码将置于Servlet的service()方法中--%>
<%
    System.out.println("hello jsp");
    int i = 1;
    System.out.println(i);
%>

<%--以下代码将置于Servlet类的定义成员的位置--%>
<%!
    private int i = 2;
%>

<%--以下代码将直接输出到页面上--%>
<%= "i = " + i %>

</body>
</html>
```

-   这里是`UserServiceTest`：

```java
package com.chuan.servlet.service;

import com.chuan.servlet.entity.User;
import org.junit.jupiter.api.Test;


class UserServiceTest {
    @Test
    public void testLogin() {
        User loginUser = new User();
        // loginUser.setId(1);
        loginUser.setUsername("zhangsan");
        loginUser.setPassword("haha");
        UserService userService = new UserService();
        User user = userService.login(loginUser);
        System.out.println(user);
    }
}
```
