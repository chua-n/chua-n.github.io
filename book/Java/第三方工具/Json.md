---
title: Json
---

JSON(JavaScript Object Notation) 是一种轻量级的数据交换格式。其简洁和清晰的层次结构使得 JSON 成为理想的数据交换语言，同时也易于机器解析和生成，并有效地提升网络传输效率。目前很多Rest服务都采用JSON数据格式进行传输，Java中流行的开源JSON框架主要有Jackson、Gson、Fastjson等。

JSON建构于两种常见的数据结构：

- “键/值”对
- 数组

## Jackson

> GitHub地址：[GitHub - FasterXML/jackson](https://github.com/FasterXML/jackson)

Jackson社区相对比较活跃，更新速度也比较快， 从Github中的统计来看，Jackson是最流行的json解析器之一，Spring MVC的默认json解析器便是Jackson。

Jackson 的核心模块由三部分组成。

- jackson-core：核心包，提供基于"流模式"解析的相关 API，如 JsonPaser 和 JsonGenerator

- jackson-annotations：注解包，提供标准注解功能

- jackson-databind：数据绑定包， 提供基于"对象绑定" 解析的相关 API （ ObjectMapper ） 和"树模型" 解析的相关 API （JsonNode）；基于"对象绑定" 解析的 API 和"树模型"解析的 API 依赖基于"流模式"解析的 API。

    > jackson-databind 依赖于前两者，因此当添加了jackson-databind依赖后，jackson-core 和 jackson-annotations 也会相应添加到 Java 项目的依赖中。

maven坐标：

```xml
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
    <version>2.13.4</version>
</dependency>
```

基本api示例：

```java
package com.chuan.jackson;

import com.chuan.JsonApi;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.SneakyThrows;

/**
 * @author xucy-e
 */
public class JacksonApi implements JsonApi<JacksonBean> {
    @SneakyThrows
    @Override
    public String bean2Json(JacksonBean bean) {
        ObjectMapper objectMapper = new ObjectMapper();
        return objectMapper.writeValueAsString(bean);
    }

    @SneakyThrows
    @Override
    public JacksonBean json2Bean(String json) {
        ObjectMapper objectMapper = new ObjectMapper();
        return objectMapper.readValue(json, JacksonBean.class);
    }
}
```

## Gson

> 由谷歌开发：[GitHub - google/gson](https://github.com/google/gson)

maven坐标：

```xml
<dependency>
    <groupId>com.google.code.gson</groupId>
    <artifactId>gson</artifactId>
    <version>2.9.0</version>
</dependency>
```

基本api示例：

```java
package com.chuan.gson;

import com.chuan.JsonApi;
import com.google.gson.Gson;

/**
 * @author xucy-e
 */
public class GsonApi implements JsonApi<GsonBean> {
    @Override
    public String bean2Json(GsonBean bean) {
        Gson gson = new Gson();
        return gson.toJson(bean);
    }

    @Override
    public GsonBean json2Bean(String json) {
        Gson gson = new Gson();
        return gson.fromJson(json, GsonBean.class);
    }
}
```

## Fastjson

由阿里巴巴开发：[GitHub - alibaba/fastjson](https://github.com/alibaba/fastjson)

maven坐标：

```xml
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>fastjson</artifactId>
    <version>2.0.14</version>
</dependency>
```

基本api示例：

```java
package com.chuan.fastjson;

import com.alibaba.fastjson.JSONObject;
import com.chuan.JsonApi;

/**
 * @author xucy-e
 */
public class FastjsonApi implements JsonApi<FastjsonBean> {

    @Override
    public String bean2Json(FastjsonBean bean) {
        return JSONObject.toJSONString(bean);
    }

    @Override
    public FastjsonBean json2Bean(String json) {
        return JSONObject.parseObject(json, FastjsonBean.class);
    }
}
```

### fastjson出现`$ref: "$."`

fastjson作为一款序列化引擎，不可避免的会遇到循环引用的问题，为了避免`StackOverflowError`异常，fastjson会对引用进行检测。

如果检测到存在重复/循环引用的情况，fastjson默认会以“引用标识”来代替同一对象，而非继续循环解析，从而防止`StackOverflowError`。

因此，当fastjson转换出的json字符串中出现了`$ref: "$."`，有如下两种解决思路：

1. 创建新对象，不循环引用
2. 关闭检查，即`JSON.toJSONString(bean, SerializerFeature.DisableCircularReferenceDetect);`