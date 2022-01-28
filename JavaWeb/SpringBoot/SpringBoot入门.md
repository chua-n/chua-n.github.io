## 1. SpringBoot简介

Spring Boot基于Spring开发，其本身并不提供Spring框架的核心特性以及扩展功能，只是用于快速、敏捷地开发新一代基于Spring框架的应用程序。也就是说，SpringBoot并不是用来替代Spring的解决方案，而是和Spring框架紧密结合用于提升Spring开发者的工具，其帮助开发人员把时间都集中在业务开发上。

SpringBoot以约定大于配置的核心思想，帮开发者进行了很多默认设置，多数SpringBoot应用只需要很少的Spring配置。同时它集成了大量常用的第三方库配置，如Redis、MongoDB、Jpa、RabbitMQ、Quartz等，SpringBoot应用中这些第三方库几乎可以零配置开箱即用。

Spring是如何简化Java开发的？

- 基于POJO的轻量级和最小侵入性编程；
- 通过IOC、依赖注入和面向接口实现松耦合；
- 基于切面（AOP）和惯例进行声明式编程；
- 通过切面和模版减少样式代码。

SpringBoot的主要优点：

- 为所有Spring开发者更快的入门；

- 开箱即用，提供各种默认配置来简化项目配置；

- 内嵌式容器简化Web项目；

- 没有冗余代码生成和XML配置的要求。

### 1.X 微服务

微服务——微服务是一种架构风格，它要求我们在开发一个应用的时候，这个应用必须构建成一系列小服务的组合，这些小的服务可以通过http等方式进行通信。

单体应用架构 v.s. 微服务架构。

![52](https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/SpringBoot/52.jpg)

## 2. 快速入门案例

### 2.1 引入依赖

> 所有的官方springboot依赖都以spring-boot-starter开头。

依赖主要涉及**父工程**和**启动器**。

核心依赖在父工程中：spring-boot-dependencies；在引入一些springboot依赖时，不需要指定版本，因为有这些版本仓库。

启动器：说白了就是SpringBoot的启动场景，如spring-boot-starter-web会帮我们自动导入web环境所有的依赖。springboot会将所有的功能场景都变成一个个的启动器，当我们要使用##功能，只需找到相应的启动器starter即可。

```xml
<!-- 父工程 -->
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>2.4.4</version>
</parent>

<dependencies>
    <!-- 启动器 -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
</dependencies>
```

### 2.2 创建主程序

```java
package com.kuang.helloWorld;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

// @SpringBootApplication：标注这个类是一个springboot的应用
@SpringBootApplication
public class HelloworldApplication {
    // 将springboot的应用启动
    public static void main(String[] args) {
        SpringApplication.run(HelloworldApplication.class, args);
    }
}
```

`@SpringBootApplication`标注一个类是一个springboot的应用

springboot所有的自动配置都是在启动的时候被扫描并加载：所有的自动配置类都在spring.factories里，但是不一定生效（要判断条件是否成立），只有导入对应的启动器starter，自动装配才会生效。

### 2.3 编写业务

```java
@RestController
public class HelloController {
    @RequestMapping("/hello")
    public String handle01(){
        return "Hello, Spring Boot 2!";
    }
}
```

### 2.4 测试

直接运行主程序的main方法。

### 2.5 简化部署

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
        </plugin>
    </plugins>
</build>
```

把项目打成jar包，直接在目标服务器执行即可。

注意点：取消掉cmd的快速编辑模式。

### 2.6 附：总的pom.xml（一般意义）

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <!--  父项目：继承spring-boot-starter-parent的依赖管理，控制版本与打包等内容  -->
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.4.4</version>
        <relativePath/>
        <!-- lookup parent from repository -->
    </parent>

    <!-- 项目元数据信息 -->
    <groupId>com.kuang</groupId>
    <artifactId>springboot</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>springboot</name>
    <description>Demo project for Spring Boot</description>

    <properties>
        <java.version>1.8</java.version>
    </properties>

    <!-- 项目具体依赖 -->
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <!-- 打jar包的插件：配合spring-boot-starter-parent就可
             以把Spring Boot应用打包成jar来直接运行 -->
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
```

