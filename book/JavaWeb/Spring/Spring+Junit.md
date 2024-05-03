---
title: Spring+Junit
date: 2020-11-08
---

## 1. 问题引入

原始 junit 测试 Spring 的问题：在测试类中，每个测试方法都有以下两行代码，它们的作用是获取容器，如果不写的话，会产生空指针异常，所以又不能轻易删掉。

```java
ApplicationContext app = new ClassPathXmlApplicationContext("applicationContext.xml");
UserService userService = app.getBean(UserService.class);
```

解决方案：

1. 让 SpringJunit 负责创建 Spring 容器，此时需要将配置文件的名称告诉它；
2. 将需要进行测试的 Bean 直接在测试类中进行注入

## 2. Spring 集成 Junit 步骤

1. 导入 spring 集成 junit 的坐标；

    ```xml
    <dependency>
        <groupId>junit</groupId>
        <artifactId>junit</artifactId>
        <version>4.12</version>
        <scope>test</scope>
    </dependency>
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-context</artifactId>
        <version>5.0.5.RELEASE</version>
    </dependency>
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-test</artifactId>
        <version>5.0.5.RELEASE</version>
    </dependency>
    ```

    

2. 使用`@Runwith`注解替换原来的运行器；

3. 使用`@ContextConfiguration`指定配置文件或配置类；

4. 使用`@Autowired`注入需要测试的对象；

5. 创建测试方法进行测试：

    ```java
    import org.junit.Test;
    import org.junit.runner.RunWith;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.test.context.ContextConfiguration;
    import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
    import javax.sql.DataSource;
    import java.sql.SQLException;
    
    @RunWith(SpringJUnit4ClassRunner.class)
    @ContextConfiguration("classpath:applicationContext.xml")
    //@ContextConfiguration(classes = {SpringConfiguration.class})
    public class SpringJunitTest {
        @Autowired
        private UserService userService;
        @Autowired
        private DataSource dataSource;
        @Test
        public void test1() throws SQLException {
            userService.save();
            System.out.println(dataSource.getConnection());
        }
    }
    ```
