## 1. SpringData JPA简介

SpringData JPA是SpringData家庭的一个成员，是Spring Data对JPA封装之后的产物，目的在于简化基于JPA的数据访问技术。

使用SpringData JPA时，开发者只需要声明DAO层的接口，不必再写实现类或其他代码，剩下的一切交给SpringData JPA来搞定即可。

### 1. 1快速入门的步骤

- 准备数据环境

- 创建java工程、导入maven坐标

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

- 编写DAO接口

- 添加Spring整合JPA的配置文件

- 测试

### 1.2 关于编写DAO接口

使用SpringData JPA操作数据库，只需要按照框架的规范提供（不含方法体的）DAO接口即可，不需要为接口提供实现类就能完成基本的数据库的CRUD等功能。所谓的DAO接口的规范如下：

- 创建一个DAO层接口，并继承JpaRepository和JpaSpecificationExecutor
- 提供相应的泛型

关于上述的两个接口：

- JpaRepository<实体类类型，主键类型>：用来完成基本的CRUD操作
- JpaSpecificationExecutor<实体类类型>：用于复杂查询（如分页等）

DAO接口示例：

```java
public interface ArticleDao extends JpaRepository<Article, Integer>, JpaSpecificationExecutor<Article> {
    
}
```

