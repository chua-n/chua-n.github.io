---
title: DSL
---

> 索引库操作与文档操作。

## 1. 索引库操作

### 前言：mapping属性

mapping是对索引库中文档的约束，常见的mapping属性包括：

- `type`：字段数据类型
- `index`：是否创建索引，默认为true
- `analyzer`：使用哪种分词器
- `properties`：该字段的子字段

对于字段的数据类型`type`，常见的简单类型有：

- 字符串：
    - `text`（可分词的文本）
    - `keyword`（精确值，如：品牌、国家、ip地址）
- 数值：
    - `long`
    - `integer`
    - `short`
    - `byte`
    - `double`
    - `float`
- 布尔：`boolean`
- 日期：`date`
- 对象：`object`

```json
{
    "age": 21,
    "weight": 52.1,
    "isMarried": false,
    "info": "黑马程序员Java讲师",
    "email": "zy@itcast.cn",
    "score": [99.1, 99.5, 98.9],
    "name": {
        "firstName": "云",
        "lastName": "赵"
    }
}
```

ES中支持两种地理坐标数据类型：

- `geo_point`：由纬度和经度确定的一个点，如"32.8752345, 120.2982576"
- `geo_shape`：由多个`geo_point`组成的复杂几何图形，例如一条直线："LINESTRING(-77.03653 38.897676, -77.009051, 38.889939)"

### 创建索引库：`PUT /索引库名`

ES中通过Restful请求操作索引库、文档，请求内容用DSL语句来表示。创建索引库和mapping的DSL语法如下：

<img src="https://figure-bed.chua-n.com/数据库/Elasticsearch/image-20211231221313220.png" alt="image-20211231221313220" style="zoom:50%;" />

小提示：字段拷贝可以使用copu_to属性将当前字段拷贝到指定字段，如：

```json
"all": {
    "type": "text",
    "analyzer": "ik_max_work"
},
"brand": {
    "type": "keyword",
    "copy_to": "all"
}
```

### 查看索引库：`GET /索引库名`

```http
GET /索引库名
```

如，`GET /heima`。

### 删除索引库：`DELETE /索引库名`

```http
DELETE /索引库名
```

如，`DELETE /heima`。

### 修改索引库：`PUT /索引库名/_mapping`

索引库和mapping一旦创建无法修改，但是可以添加新的字段，语法如下：

```json
PUT /索引库名/_mapping
{
	"properties": {
		"新字段名": {
			"type": "integer"
		}
	}
}
```

示例：

```json
PUT /heima/_mapping
{
	"properties": {
		"age": {
			"type": "integer"
		}
	}
}
```

## 2. 文档操作

### 添加文档

新增文档的DSL语法如下：

<img src="https://figure-bed.chua-n.com/数据库/Elasticsearch/image-20211231222158358.png" alt="image-20211231222158358" style="zoom:50%;" />

### 查看文档

语法：

```http
GET /索引库名/_doc/文档id
```

示例：`GET /heima/_doc/1`

### 删除文档

语法：

```http
DELETE /索引库名/_doc/文档id
```

示例：`DELETE /heima/_doc/1`

### 修改文档

- 全量修改：会删除旧文档，添加新文档

    <img src="https://figure-bed.chua-n.com/数据库/Elasticsearch/IMG_1115.JPG" alt="IMG_1115" style="zoom:40%;" />

- 增量修改：修改指定字段值

    <img src="https://figure-bed.chua-n.com/数据库/Elasticsearch/image-20211231222832555.png" alt="image-20211231222832555" style="zoom:40%;" />

## 3. 搜索文档

### DSL查询分类

Elasticsearch提供了基于JSON的DSL(Domain Specific Language)来定义查询/搜索，常见的查询类型包括：

- 查询所有：查询出所有数据，一般测试用。如：
    - match_all
- 全文检索：利用分词器对用户输入内容分词，然后去倒排索引库中匹配。如：
    - match_query
    - multi_match_query
- 精确查询：根据精确词条值查找数据，一般是查找keyword、数值、日期、boolean等类型字段。如：
    - ids
    - range
    - term
- 地理查询：根据经纬度查询。如：
    - geo_distance
    - geo_bounding_box
- 复合查询：复合查询可以将上述各种查询条件组合起来，合并查询条件。如：
    - bool
    - function_score

查询的基本语法：

```json
GET /indexName/_search
{
    "query": {
        "查询类型": {
            "查询条件": "条件值"
        }
    }
}
```

> 示例：
>
> ```json
> GET /indexName/_search
> {
>  "query": {
>      "match_all": {}
>  }
> }
> ```

### 全文检索查询

全文检索查询会对用户输入内容分词，常用于搜索框搜索：

<img src="https://figure-bed.chua-n.com/数据库/Elasticsearch/image-20220101105237678.png" alt="image-20220101105542696" style="zoom:33%;" />

<img src="https://figure-bed.chua-n.com/数据库/Elasticsearch/image-20220101105622383.png" alt="image-20220101105622383" style="zoom:36%;" />

全文检索查询使用match与multi_match，两者的区别是，后者允许同时查询多个字段，参与查询的字段越多，查询性能越差。

- match

    ```json
    GET /indexName/_search
    {
        "query": {
            "match": {
                "FIELD": "TEXT"
            }
        }
    }
    ```

- multi_match

    ```json
    GET /indexName/_search
    {
        "query": {
            "multi_match": {
                "query": "TEXT",
                "fields": ["FIELD1", "FIELD2"]
            }
        }
    }
    ```

### 精准查询

精确查询是一般是查询keyword、数值、日期、boolean等类型字段，所以不会对搜索条件分词。常见的有：

- term：根据词条精确值查询

    ```json
    GET /indexName/_search
    {
        "query": {
            "term": {
                "FIELD": {
                    "value": "VALUE"
                }
            }
        }
    }
    ```

- range：根据值的范围查询

    ```json
    GET /indexName/_search
    {
        "query": {
            "term": {
                "FIELD": {
                    "gte": 10, // ≥
                    "lte": 20 // ≤
                }
            }
        }
    }
    ```

<img src="https://figure-bed.chua-n.com/数据库/Elasticsearch/image-20220101110220484.png" alt="image-20220101110220484" style="zoom:45%;" />

### 地理坐标查询

根据经纬度查询：

- geo_bounding_box：查询geo_point值落在某个矩形范围内的所有文档

    ```json
    GET /indexName/_search
    {
        "query": {
            "geo_bounding_box": {
                "FIELD": {
                    "top_left": {
                        "lat": 31.1,
                        "lon": 121.5
                    },
                    "bottom_right": {
                        "lat": 30.9,
                        "lon": 121.7
                    }
                }
            }
        }
    }
    ```

    <img src="https://figure-bed.chua-n.com/数据库/Elasticsearch/image-20220101110952283.png" alt="image-20220101110952283" style="zoom:50%;" />

- geo_distance：查询到指定中心点小于某个距离值的所有文档

    ```json
    GET /indexName/_search
    {
        "query": {
            "geo_distance": {
                "distance": "15km",
                "FIELD": "31.21, 121.5"
            }
        }
    }
    ```

    <img src="https://figure-bed.chua-n.com/数据库/Elasticsearch/image-20220101111120419.png" alt="image-20220101111120419" style="zoom:50%;" />

地理坐标查询常见的使用场景包括：

- 携程：搜索附近的酒店
- 滴滴：搜索附近的出租车
- 微信：搜索附近的人

### 复合查询

复合查询可以将其它简单查询组合起来，实现更复杂的搜索逻辑。如：

- 布尔查询：为一个或多个查询子句的组合。子查询的组合方式有：

    - must：必须匹配每个子查询，类似“与”
    - should：选择性匹配子查询，类似“或”
    - must_not：必须不匹配，不参与算法，类似“非”
    - filter：必须匹配，不参与算法

    <img src="https://figure-bed.chua-n.com/数据库/Elasticsearch/image-20220101113140561.png" alt="image-20220101113140561" style="zoom:80%;" />

- function_score：算分函数查询，可以控制文档**相关性算分**，根据新得到的算分控制文档排序

    <img src="https://figure-bed.chua-n.com/数据库/Elasticsearch/image-20220101112830872.png" alt="image-20220101112830872" style="zoom:50%;" />

    > function_score的例子比如百度竞价：
    >
    > <img src="https://figure-bed.chua-n.com/数据库/Elasticsearch/image-20220101112011862.png" alt="image-20220101112011862" style="zoom:45%;" />

案例：

- 搜索名字包含如家、价格不高于400、在坐标31.21, 121.5周围10km内的酒店：

    <img src="https://figure-bed.chua-n.com/数据库/Elasticsearch/image-20220101113428776.png" alt="image-20220101113428776" style="zoom:50%;" />

- 给如家品牌的酒店排名靠前一些：

    <img src="https://figure-bed.chua-n.com/数据库/Elasticsearch/image-20220101113413130.png" alt="image-20220101113413130" style="zoom:50%;" />

#### 相关性算法

对于相关性算分，当我们使用match查询时，文档结果会根据与搜索词条的关联度打分（_score），返回结果时按照分值降序排列。如，搜索“虹桥如家”的结果如下：

<img src="https://figure-bed.chua-n.com/数据库/Elasticsearch/image-20220101112210234.png" alt="image-20220101112210234" style="zoom:45%;" />

Elasticsearch中的相关性打分算法：

- TF-IDF（在es5.0之前）：会随着词频增加而越来越大
- BM25（在es5.0之后）：会随着词频增加而增大，但增长曲线会趋于水平

## 4. 搜索结果处理

### 排序

elasticsearch支持对搜索结果排序，默认是根据相关度算分（_score）来排序。可以排序的字段类型有：keyword类型、数值类型、地理坐标类型、日期类型等。

```json
GET /indexName/_search
{
    "query": {
        "match_all": {}
    },
    "sort": [
        {
            "FIELD": "desc" // 排序字段和排序方式ASC、DESC
        }
    ]
}
```

```json
GET /indexName/_search
{
    "query": {
        "match_all": {}
    },
    "sort": [
        {
            "_geo_distance": {
                "FIELD": "纬度、经度",
                "order": "asc",
                "unit": "km"
            }
        }
    ]
}
```

### 分页

Elasticsearch默认情况下只返回top10的数据，如果要查询更多数据需要修改分页参数，Elasticsearch中通过修改`from`、`size`参数来控制要返回的分页结果：

```json
GET /hotel/_search
{
    "query": {
        "match_all": {}
    },
    "from": 990, // 分页开始的位置，默认为0
    "size": 10, // 期望获取的文档总数
    "sort": [
        {"price": "asc"}
    ]
}
```

<img src="https://figure-bed.chua-n.com/数据库/Elasticsearch/image-20220101124909562.png" alt="image-20220101124909562" style="zoom:50%;" />

#### 深度分页问题

ES是分布式的，所以会面临深度分页问题。例如按price排序后，获取from=990, size=10的数据：

1. 首先在每个数据分片上都排序并查询前1000条文档；
2. 然后将所有节点的结果聚合，在内存中重新排序选出前1000条文档；
3. 最后从这1000条中，选取从990开始的10条文档。

<img src="https://figure-bed.chua-n.com/数据库/Elasticsearch/image-20220101125200756.png" alt="image-20220101125200756" style="zoom:50%;" />

如果搜索页数过多，或者结果集（from + size）越大，对内存和CPU的消耗也越高，因此ES设定结果集查询的上限是10000。

针对深度分页，ES提供了两种解决方案：

- search after：分页时需要排序，原理是从上一次的排序值开始，查询下一页数据（官方推荐使用的方式）
    - 优点：没有查询上限（单次查询的size不超过10000）
    - 缺点：只能向后逐页查询，不支持随机翻页
    - 场景：没有随机翻页需求的搜索，例如手机向下滚动翻页
- scroll：原理将数据形成快照，保存在内存（官方已不推荐使用）
    - 优点：没有查询上限（单次查询的size不超过10000）
    - 缺点：会有额外内存消耗，并且搜索结果是非实时的
    - 场景：海量数据的获取和迁移（从ES7.1开始不推荐，建议用after search方案）

### 高亮

高亮就是在搜索结果中把搜索关键字突出显示。其原理是将搜索结果中的关键字用标签标记出来，在页面中给标签添加CSS样式。

<img src="https://figure-bed.chua-n.com/数据库/Elasticsearch/image-20220101130126159.png" alt="image-20220101130126159" style="zoom:50%;" />

语法：

```json
GET /hotel/_search
{
    "query": {
        "match": {
            "FIELD": "TEXT"
        }
    },
    "highlight": {
        "fields": { // 指定根本高亮的字段
            "FIELD": {
                "pre_tags": "<em>", // 用来标记高亮字段的前置标签
                "post_tags": "</em>" // 用来标记高亮字段的后置标签
            }
        }
    }
}
```

## 5. 数据聚合

### 聚合的分类

聚合（aggregations）可以实现对文档数据的统计、分析、运算。聚合常见的有三类：

- 桶（Bucket）聚合：用来对文档做分组
    - `TermAggregation`：按照文档字段值分组
    - `Date Histogram`：按照日期阶梯分组，例如一周为一组、一月为一组
- 度量（Metric）聚合：用以计算一些值，比如：最大值、最小值、平均值
    - `Avg`
    - `Max`
    - `Min`
    - `Stats`：同时求`max, min, avg, sum`等
- 管道（piepeline）聚合：其他聚合的结果为基础做聚合

参与聚合的字段类型必须是：`keyword`, `数值`, `日期`, `布尔`。

### DSL实现聚合

聚合必须的三要素：

- 聚合名称
- 聚合类型
- 聚合字段

聚合可配置属性有：

- size：指定聚合结果数量
- order：指定聚合结果排序方式
- filed：指定聚合字段

#### Bucket聚合示例

要统计所有数据中的酒店品牌有几种，此时可以根据酒店品牌的名称做聚合：

```json
GET /hotel/_search
{
    "size": 0, // 设置size为0，结果中不包含文档，只包含聚合结果
    "aggs": { // 定义聚合
        "brandAgg": { // 给聚合起个名字
            "terms": { // 聚合的类型，按照品牌值聚合，因此选term
                "field": "brand", // 参与聚合的字段
                "size": 20 // 希望获取的聚合结果数量
            }
        }
    }
}
```

默认情况下，Bucket聚合是对索引库的所有文档做聚合，我们可以限定要聚合的文档范围，只要添加query条件即可：

> aggs代表聚合，与query同级，此时query的作用是限定聚合的文档范围。

```json
GET /hotel/_search
{
    "query": {
        "range": {
            "price": {
                "lte": 200 // 只对200元以下的文档聚合
            }
        }
    },
    "size": 0,
    "aggs": {
        "brandAgg": {
            "terms": {
                "field": "brand",
                "size": 20
            }
        }
    }
}
```

#### Metrics聚合示例

如，我们要求获取每个品牌的用户评分的min, max, avg等值，可以使用stats：

```json
GET /hotel/_search
{
    "size": 0,
    "aggs": {
        "brandAgg": {
            "terms": {
                "field": "brand",
                "size": 20
            },
            "aggs": { // 是brands聚合的子聚合，也就是分组后对每组分别计算
                "score_stats": { // 聚合名称
                    "stats": { // 聚合类型，这里stats可以计算min, max, avg等
                        "field": "score" // 聚合字段，这里是score
                    }
                }
            }
        }
    }
}
```
