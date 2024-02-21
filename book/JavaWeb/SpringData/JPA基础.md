---
title: JPA基础
---

## 1. JPA简介

JPA全称Java Persistence API，是SUN公司推出的一套基于ORM的规范。注意JPA不是ORM框架，因为JPA并未提供ORM实现，而是只提供了一些编程的API接口。

- JPA的作用：使得软件工程中可以自由切换实现了JPA规范的ORM框架
- ORM框架的作用：简化JDBC的代码

## 2. JPA快速入门

快速入门步骤：

- 准备数据库环境

- 创建Java工程、导入maven坐标

- 创建实体类

- 在实体类中配置其和数据库表的映射关系

- 加入JPA的核心配置文件

- 测试

    ```java
    // 1. 创建一个持久化管理器工厂
    String persistenceUnitName = "jpa01";
    EntityManagerFactory factory = Persistence.createEntityManagerFactory(persistenceUnityName);
    
    // 2. 创建持久化管理器（这个API非常重要，基于此API可以完成事务获取以及数据库的CRUD操作）
    EntityManager entityManager = factory.createEntityManager();
    
    // 3. 得到事务，并且开启
    EntityTransaction transaction = entityManager.getTransaction();
    transaction.begin();
    
    // 4. 操作
    entityManager.persist(article);
    
    // 5. 提交事务
    transaction.commit();
    
    // 6. 关闭资源
    eneityManager.close();
    ```

## 3. EntityManager

JPA的实体管理器（EntityManager）用于管理系统中的实体，它是实体与数据库之间的桥梁，通过调用实体管理器的相关方法可以把实体持久化到数据库中，同时也可以把数据库中的记录打包成实体对象。

### 3.1 JPA实体的四种状态

JPA 实体生命周期有四种状态（不知道有用没）：

- 新建状态（New）：对象在保存进数据库之前为临时状态。此时数据库中没有该对象的信息，该对象的ID属性也为空。如果没有被持久化，程序退出时临时状态的对象信息将丢失。
- 托管状态（Managed）：对象在保存进数据库后或者从数据库中加载后、并且没有脱离Session时为持久化状态。这时候数据库中有对象的信息，对象的id为数据库中对应记录的主键值。由于还在 Session中，持久化状态的对象可以执行任何有关数据库的操作，例如获取集合属性的值等。
- 游离状态（Datached）：是对象曾经处于持久化状态、但是现在已经离开Session了。虽然游离状态的对象有id值，有对应的数据库记录，但是已经无法执行有关数据库的操作。例如，读取延迟加载的集合属性，可能会抛出延迟加载异常。
- 删除状态（Removed）：删除的对象，有id值，尚且和 Persistence Context 有关联，但是已经准备好从数据库中删除。

### 3.2 创建EntityManager

所有实体管理器都来自类型为`javax.persistence.EntityManagerFactory`的工厂。

```java
// 1. 拿到工厂对象
EntityManagerFactory factory = 
    Persistence.createEntityManagerFactory(persistenceUnityName);

// 2. 创建EntityManager
EntityManager entityManager = factory.createEntityManager();
```

### 3.3 CRUD操作

#### 保存

```java
Article article = new Article();
article.setTitle("测试文章");
article.setAuthor("黑马");
article.setCreateTime(new Date());
entityManager.persist(article);
```

#### 查找

```java
Article article = entityManager.find(Article.class, 1);
```

#### 更新

JPA的修改操作要求必须先查询、再修改。

```java
Article article = entityManager.find(Article.class, 1);
article.setAuthor("黑马-1");
entityManager.merge(article);
```

#### 删除

JPA的修改操作要求必须先查询、再删除。

```java
Article article = entityManager.find(Article.class, 1);
entityManager.remove(employee);
```

### 3.4 事务

...

## 4. ...

