---
title: RestAPI
---

## 1. RestClient

ES官方提供了各种不同语言的[客户端](https://www.elastic.co/guide/en/elasticsearch/client/index.html)，用来操作ES，这些客户端的本质就是组装DSL语句，通过HTTP请求发送给ES。

<img src="https://figure-bed.chua-n.com/notebook/数据库/Elasticsearch/image-20211231225812173.png" alt="image-20211231225812173" style="zoom:50%;" />

## 2. 操作索引库

索引库操作的基本步骤：

- 初始化`RestHighLevelClient`
- 创建`XxxIndexRequest`（Xxx是Create, Get, Delete）
- 准备DSL（Create时需要）
- 发送请求——调用`RestHighLevelClient#indices().xxx()`方法，xxx是`create`, `exists`, `delete`

案例——根据酒店数据创建索引库，索引库名为hotel，mapping属性根据数据库结构定义：

1. 导入课前资料Demo：`tb_hotel.sql`, `hotel-demo`

    <img src="https://figure-bed.chua-n.com/notebook/数据库/Elasticsearch/image-20211231230302633.png" alt="image-20211231230302633" style="zoom:33%;" />

2. 分析数据结构，定义mapping属性——考虑字段名、数据类型、是否参与搜索、是否分词、如果分词那么分词器是什么

3. 初始化JavaRestClient

    1. 引入ES的RestHighLevelClient依赖：

        ```xml
        <dependency>
            <groupId>org.elasticsearch.client</groupId>
            <artifactId>elasticsearch-rest-high-level-client</artifactId>
        </dependency>
        ```

    2. 由于SpringBoot默认的ES版本是7.6.2，因此要覆盖默认的ES版本：

        ```xml
        <properties>
            <java.version>1.8</java.version>
            <elasticsearch.version>7.12.1</elasticsearch.version>
        </properties>
        ```

    3. 初始化RestHighLevelClient：

        ```java
        RestHighLevelClient client = new RestHighLevelClient(RestClient.builder(HttpHost.create("http://192.168.150.101:9200")));
        ```

4. 利用JavaRestClient创建索引库

    <img src="https://figure-bed.chua-n.com/notebook/数据库/Elasticsearch/image-20211231231648680.png" alt="image-20211231231648680" style="zoom:40%;" />

    > <img src="https://figure-bed.chua-n.com/notebook/数据库/Elasticsearch/image-20211231231940533.png" alt="image-20211231231940533" style="zoom:50%;" />

5. 利用JavaRestClient删除索引库

    ```java
    @Test
    void testDeleteHotelIndex() throws IOException {
        // 1. 创建Request对象
        DeleteIndexRequest request = new DeleteIndexRequest("hotel");
        // 2. 发起请求
        client.indices().delete(request, RequestOptions.DEFAULT);
    }
    ```

6. 利用JavaRestClient判断索引库是否存在

    ```java
    @Test
    void testExistsHotelIndex() throws IOException {
        // 1. 创建Request对象
        GetIndexRequest request = new GetIndexRequest("hotel");
        // 2. 发起请求
        boolean exists = client.indices().exists(request, RequestOptions.DEFAULT);
        // 3. 输出
        System.out.println(exists);
    }
    ```

## 3. 操作文档

文档操作的基本步骤：

- 初始化`RestHighLevelClient`
- 创建XxxRequest（Xxx是Index, Get, Update, Delete）
- 准备参数（Index和Update时需要）
- 发送请求——调用`RestHighLevelClient#.xxx()`方法，xxx是index, get, update, delete
- 解析结果（Get时需要）

案例——去数据库查询酒店数据，导入到hotel索引库，实现酒店数据的CRUD：

1. 初始化JavaRestClient：

    ```java
    public class ElasticsearchDocumentTest {
        // 客户端
        private RestHighLevelClient client;
        
        @BeforeEach
        void setUp() {
            client = new RestHighLevelClient(RestClient.builder(HttpPost.create("http://192.168.150.101:9200")));
        }
        
        @AfterEach
        void tearDown() throws IOException {
            client.close();
        }
    }
    ```

2. 新增酒店数据

    <img src="https://figure-bed.chua-n.com/notebook/数据库/Elasticsearch/image-20211231233648176.png" alt="image-20211231233648176" style="zoom:45%;" />

    <img src="https://figure-bed.chua-n.com/notebook/数据库/Elasticsearch/image-20211231233732619.png" alt="image-20211231233732619" style="zoom:55%;" />

3. 根据id查询酒店数据

    > 根据id查询到的文档数据是json，需要反序列化为Java对象

    <img src="https://figure-bed.chua-n.com/notebook/数据库/Elasticsearch/image-20211231233839531.png" alt="image-20211231233839531" style="zoom:45%;" />

    <img src="https://figure-bed.chua-n.com/notebook/数据库/Elasticsearch/image-20211231233915282.png" alt="image-20211231233915282" style="zoom:50%;" />

4. 根据id修改酒店数据

    > 依旧可分为全量更新与局部更新。

    <img src="https://figure-bed.chua-n.com/notebook/数据库/Elasticsearch/image-20211231234058245.png" alt="image-20211231234058245" style="zoom:45%;" />

5. 根据id删除文档数据

    <img src="https://figure-bed.chua-n.com/notebook/数据库/Elasticsearch/image-20211231234139694.png" alt="image-20211231234139694" style="zoom:50%;" />

### 批量处理

需求：批量查询酒店数据，然后批量导入索引库中

思路：

1. 利用mybatis-plus查询酒店数据

2. 将查询到的酒店数据（Hotel）转换为文档类型数据（HotelDoc）

3. 利用JavaRestClient中的Bulk批处理，实现批量新增文档，示例代码：

    ```java
    @Test
    void testBulkRequest() throws IOException() {
        // 批量查询酒店数据
        List<Hotel> hotels = hotelService.list();
        // 1. 创建Request
        BulkRequest request = new BulkRequest();
        // 2. 准备参数，添加多个新增的Request
        for (Hotel hotel : hotels) {
            // 转换为文档类型HotelDoc
            HotelDoc hotelDoc = new HotelDoc(hotel);
            // 创建新增文档的Request对象
            request.add(new IndexRequest("hotel")
                        .id(hotelDoc.getId().toString()
                        .source(JSON.toJSONString(hotelDoc), XContentType.JSON))
                       );
        }
        // 3. 发送请求
        client.bulk(request, RequestOptions.DEFAULT);
    }
    ```

> 分布式搜索引擎——Elasticsearch搜索功能。

## 4. 搜索/查询文档

### 通性概述

查询的基本步骤是：

1. 创建`SearchRequest`对象
2. 准备`Request.source()`，也就是DSL
    1. `QueryBuilders`构建查询条件
    2. 传入`Request.source()`的`query()`方法
3. 发送请求，得到结果
4. 解析结果（参考JSON结果，从外到内，逐层解析）

RestAPI中构建DSL是通过`HighLevelRestClient`中的`resource()`来实现的，其中包含了查询、排序、分页、高亮等所有功能：

<img src="https://figure-bed.chua-n.com/notebook/数据库/Elasticsearch/image-20220101130721646.png" alt="image-20220101130721646" style="zoom:45%;" />

RestAPI中构建查询条件的核心部分是由一个名为QueryBuilders的工具类提供的，其中包含了各种查询方法：

<img src="https://figure-bed.chua-n.com/notebook/数据库/Elasticsearch/image-20220101130821791.png" alt="image-20220101130821791" style="zoom:36%;" />

### match查询

#### match_all

这里通过`match_all`来演示基本的API：

<img src="https://figure-bed.chua-n.com/notebook/数据库/Elasticsearch/image-20220101130409162.png" alt="image-20220101130409162" style="zoom:50%;" />

<img src="https://figure-bed.chua-n.com/notebook/数据库/Elasticsearch/image-20220101130438837.png" alt="image-20220101130438837" style="zoom:60%;" />

#### match、multi_match

全文检索的`match`和`multi_match`查询与`match_all`的API基本一致，差别是查询条件，也就是query的部分，同样是利用`QueryBuilders`提供的方法：

```java
// 单字段查询
QueryBuilders.matchQuery("all", "如家");
// 多字段查询
QueryBuilders.multiMatchQuery("如家", "name", "business");
```

<img src="https://figure-bed.chua-n.com/notebook/数据库/Elasticsearch/image-20220101131436846.png" alt="image-20220101131436846" style="zoom:50%;" />

### 精确查询

```java
// 词条查询
QueryBuilders.termQuery("city", "杭州");
// 范围查询
QueryBuilders.rangeQuery("price").gte(100).let(150);
```

<img src="https://figure-bed.chua-n.com/notebook/数据库/Elasticsearch/image-20220101131640604.png" alt="image-20220101131640604" style="zoom:50%;" />

### 复合查询

```java
// 创建布尔查询
BoolQueryBuilder boolQuery = QueryBuilders.boolQuery();
// 添加must条件
boolQuery.must(QueryBuilders.termQuery("city", "杭州"));
// 添加filter条件
boolQuery.filter(QueryBuilders.rangeQuery("price").lte(250));
```

<img src="https://figure-bed.chua-n.com/notebook/数据库/Elasticsearch/image-20220101131900230.png" alt="image-20220101131900230" style="zoom:50%;" />

### 排序、分页、高亮

搜索结果的排序和分页是与query同级的参数，对应的API如下：

<img src="https://figure-bed.chua-n.com/notebook/数据库/Elasticsearch/image-20220101132021781.png" alt="image-20220101132021781" style="zoom:50%;" />

高亮API包括请求DSL构建和结果解析两部分：

- DSL构建：

    <img src="https://figure-bed.chua-n.com/notebook/数据库/Elasticsearch/image-20220101132103021.png" alt="image-20220101132103021" style="zoom:50%;" />

- 结果解析：

    <img src="https://figure-bed.chua-n.com/notebook/数据库/Elasticsearch/image-20220101132121066.png" alt="image-20220101132121066" style="zoom:50%;" />

## 5. 数据聚合

### RestAPI实现聚合

以品牌聚合为例：

<img src="https://figure-bed.chua-n.com/notebook/数据库/Elasticsearch/image-20220101210151672.png" alt="image-20220101210151672" style="zoom:50%;" />

<img src="https://figure-bed.chua-n.com/notebook/数据库/Elasticsearch/image-20220101210215327.png" alt="image-20220101210215327" style="zoom:50%;" />
