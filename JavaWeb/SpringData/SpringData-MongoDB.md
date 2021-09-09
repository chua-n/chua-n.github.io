## 快速入门

步骤：

- 创建工程、引入坐标

    ```xml
    <dependency>
        <groupId>org.springframework.data</groupId>
        <artifactId>spring-data-mongodb</artifactId>
        <version>2.1.8.RELEASE</version>
    </dependency>
    ```

- 创建配置文件

    ```xml
    <?xml version="1.0" encoding="UTF-8"?>
    <beans xmlns="http://www.springframework.org/schema/beans"
           xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
           xmlns:mongo="http://www.springframework.org/schema/data/mongo"
           xsi:schemaLocation="
           http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
           http://www.springframework.org/schema/data/mongo  http://www.springframework.org/schema/data/mongo/spring-mongo.xsd
    ">
        <!--包扫描-->
        <mongo:repositories base-package="com.chuan"/>
    
        <!--spring连接mongodb数据库的配置-->
        <mongo:mongo-client host="192.168.106.128" port="27017" id="mongo">
            <mongo:client-options write-concern="SAFE"/>
        </mongo:mongo-client>
        <mongo:db-factory id="mongoDbFactory" dbname="heima" mongo-ref="mongo"/>
    
        <bean id="mongoTemplate" class="org.springframework.data.mongodb.core.MongoTemplate">
            <constructor-arg name="mongoDbFactory" ref="mongoDbFactory"/>
        </bean>
    
    </beans>
    ```

- 创建实体类

    ```java
    // 使用@Document建立实体类和collection的关系
    @Document
    public class Article {
    
        @Id // 标识这是主键字段
        private Integer id;
    
        // 使用@Field建立实体类中属性跟collection中字段的映射关系，省略时表示两个名称一致
        // @Field
        private String name;
    
        private String content;
    
        private Integer hits;
    
    }
    ```

- 自定义DAO接口

    ```java
    import com.chuan.entity.Article;
    import org.springframework.data.mongodb.repository.MongoRepository;
    
    /**
     * @author xucy-e
     * @date 2021/9/8 22:03
     */
    public interface ArticleDao extends MongoRepository<Article, Integer> {
    }
    ```

- 测试

## SpringData MongoDB实现CRUD操作

这里只演示自定义时的根据命名规则查询：

```java
public interface ArticleDao extends MongoRepository<Article, Integer> {
    // 根据标题查询
    List<Article> findByNameLike(String name);

    // 根据点击量查询
    List<Article> findByHitsGreaterThan(Integer hits);
}
```

## 其他

实体类声明`@Entity` 关系型数据库支持类型、声明`@Document` 为 Mongodb 支持类型，不同的数据源使用不同的实体就可以了

