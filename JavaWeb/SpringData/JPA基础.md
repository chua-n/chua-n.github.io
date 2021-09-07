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



