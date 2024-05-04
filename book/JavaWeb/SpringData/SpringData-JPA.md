---
title: SpringData-JPA
---

## 1. SpringData JPA 简介

SpringData JPA 是 SpringData 家庭的一个成员，是 Spring Data 对 JPA 封装之后的产物，目的在于简化基于 JPA 的数据访问技术。

使用 SpringData JPA 时，开发者只需要声明 DAO 层的接口，不必再写实现类或其他代码，剩下的一切交给 SpringData JPA 来搞定即可。

### 1.1 快速入门的步骤

- 准备数据环境

- 创建 java 工程、导入 maven 坐标

    ```xml
    <!-- Spring 框架相关 jar 包 -->
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-context</artifactId>
        <version>5.1.9.RELEASE</version>
    </dependency>
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-test</artifactId>
        <version>5.1.7.RELEASE</version>
    </dependency>
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-orm</artifactId>
        <version>5.3.9</version>
    </dependency>
    <dependency>
        <groupId>org.aspectj</groupId>
        <artifactId>aspectjweaver</artifactId>
        <version>1.8.10</version>
    </dependency>
    
    <!-- jpa -->
    <dependency>
        <groupId>org.springframework.data</groupId>
        <artifactId>spring-data-jpa</artifactId>
        <version>2.5.4</version>
    </dependency>
    ```

    

- 创建实体类

- 在实体类中配置映射关系

- 编写 DAO 接口

- 添加 Spring 整合 JPA 的配置文件

    - 配置包扫描
    - 配置数据源
    - 配置 EntityManagerFactory
    - 声明事务管理器
    - 做一个 jpa:repositroy 的配置，其中 base-package 配置 dao 包的包名，它会为这个包内所有的接口动态产生代理对象

- 测试

### 1.2 关于编写 DAO 接口

使用 SpringData JPA 操作数据库，只需要按照框架的规范提供（不含方法体的）DAO 接口即可，不需要为接口提供实现类就能完成基本的数据库的 CRUD 等功能。所谓的 DAO 接口的规范如下：

- 创建一个 DAO 层接口，并继承 JpaRepository 和 JpaSpecificationExecutor
- 提供相应的泛型

关于上述的两个接口：

- JpaRepository<实体类类型，主键类型>：用来完成基本的 CRUD 操作
- JpaSpecificationExecutor<实体类类型>：用于复杂查询（如分页等）

DAO 接口示例：

```java
public interface ArticleDao extends JpaRepository<Article, Integer>, JpaSpecificationExecutor<Article> {
    
}
```

## SpringData JPA 的多种查询方式

### 父接口方法查询

### 方法命名规则查询

### JPQL 查询

### 本地 SQL 查询

### Specification 动态查询

## SpringData JPA 实现多表操作

### 多表关系分析

### 案例表间关系

### 一对一关系

### 一对多关系

### 多对多关系
