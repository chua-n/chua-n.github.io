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

![image-20211231221313220](../../resources/images/notebooks/JavaWeb/SpringCloud/image-20211231221313220.png)

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

![image-20211231222158358](../../resources/images/notebooks/JavaWeb/SpringCloud/image-20211231222158358.png)

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

    ![IMG_1115](../../resources/images/notebooks/JavaWeb/SpringCloud/IMG_1115.JPG)

- 增量修改：修改指定字段值

    ![image-20211231222832555](../../resources/images/notebooks/JavaWeb/SpringCloud/image-20211231222832555.png)

