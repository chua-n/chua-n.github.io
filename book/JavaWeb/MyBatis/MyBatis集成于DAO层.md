---
title: MyBatis 集成于 DAO 层
date: 2021-04-15
---

在正经的 JavaWeb 工程中，MyBatis 都用于在 DAO 层中集成。

MyBatis 在 DAO 层中的直接集成方法如下：

- 项目结构概览：

    ![45](https://figure-bed.chua-n.com/JavaWeb/MyBatis/45.png)

- DAO 层代码

    - UserMapper.java

        ```java
        package com.chuan.mybatis.dao;
        
        import com.chuan.mybatis.domain.User;
        import java.io.IOException;
        import java.util.List;
        
        /**
         * @author chuan
         * @date 2021/4/15 13:49
         */
        public interface UserMapper {
            public List<User> findAll() throws IOException;
        }
        ```

    - UserMapperImpl.java

        ```java
        package com.chuan.mybatis.dao.impl;
        
        import com.chuan.mybatis.dao.UserMapper;
        import com.chuan.mybatis.domain.User;
        import org.apache.ibatis.io.Resources;
        import org.apache.ibatis.session.SqlSession;
        import org.apache.ibatis.session.SqlSessionFactory;
        import org.apache.ibatis.session.SqlSessionFactoryBuilder;
        import java.io.IOException;
        import java.io.InputStream;
        import java.util.List;
        
        /**
         * @author chuan
         * @date 2021/4/15 13:50
         */
        public class UserMapperImpl implements UserMapper {
            @Override
            public List<User> findAll() throws IOException {
                InputStream resourceAsStream = Resources.getResourceAsStream("sqlMapConfig.xml");
                SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(resourceAsStream);
                SqlSession sqlSession = sqlSessionFactory.openSession();
                List<User> userList = sqlSession.selectList("userMapper.findAll");
                return userList;
            }
        }
        ```

- service 层代码：service 调用 dao 层

    - UserService.java

        ```java
        package com.chuan.mybatis.service;
        
        import java.io.IOException;
        
        /**
         * @author chuan
         * @date 2021/4/15 13:55
         */
        public interface UserService {
            public void printUser() throws IOException;
        }
        ```

    - UserServiceImpl.java

        ```java
        package com.chuan.mybatis.service.impl;
        
        import com.chuan.mybatis.dao.UserMapper;
        import com.chuan.mybatis.dao.impl.UserMapperImpl;
        import com.chuan.mybatis.domain.User;
        import com.chuan.mybatis.service.UserService;
        import java.io.IOException;
        import java.util.List;
        
        /**
         * @author chuan
         * @date 2021/4/15 13:54
         */
        public class UserServiceImpl implements UserService {
            @Override
            public void printUser() throws IOException {
        	// 创建 dao 层对象
                UserMapper userMapper = new UserMapperImpl();
                // 调用 dao 层对象的方法
                List<User> all = userMapper.findAll();
                System.out.println(all);
            }
            public static void main(String[] args) throws IOException {
                UserService userService = new UserServiceImpl();
                userService.printUser();
        	// 控制台输出：[User{id=1, username='zhangsan', password='123'}, User{id=2,
        	// username='lisi', password='123'}, User{id=3, username='wangwu',
        	// password='123'}, User{id=4, username='zhaoliu', password='123'}, User{id=5,
        	// username='tianqi', password='123'}]
            }
        }
        ```

> 如上所述，采用这种方式写代码的方式过于繁琐，即每次都要创建 XxxMapper 的接口及其实现类等等，故而 MyBatis 提供了**动态代理**开发方式，具体可见下节。
