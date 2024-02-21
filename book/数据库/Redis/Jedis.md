---
title: Jedis
---

Jedis是 Redis 官方提供的基于java语言的redis客户端，集成了redis的命令操作，提供了连接池管理等。

## 1. Maven坐标

```xml
<dependency>
    <groupId>redis.clients</groupId>
    <artifactId>jedis</artifactId>
    <version>3.3.0</version>
</dependency>
```

## 2. 基本用法

没啥好说的，直接看示例代码吧：

```java
package com.chuan.redis.jedis;

import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import redis.clients.jedis.Jedis;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * @author xucy-e
 */
public class JedisTest {

    private Jedis jedis;

    @Before
    public void setJedis() {
        String host = "localhost";
        int port = 6379;
        this.jedis = new Jedis(host, port);
    }

    @Test
    public void testConnection() {
        String pingResp = jedis.ping();
        System.out.println(pingResp);
        Assert.assertEquals("PONG", pingResp);
    }

    @Test
    public void testString() {
        jedis.set("name", "张三");
        jedis.mset("age", "18", "gender", "true");
        Set<String> keys = jedis.keys("*");
        System.out.println(keys);
        Assert.assertEquals("张三", jedis.get("name"));
    }

    @Test
    public void testList() {
        jedis.del("provinces:l", "provinces:r");
        List<String> provinces = Stream.of("河南省", "山西省", "陕西省").collect(Collectors.toList());
        jedis.lpush("provinces:l", provinces.toArray(new String[0]));
        jedis.rpush("provinces:r", provinces.toArray(new String[0]));
        Assert.assertNotEquals(provinces, jedis.lrange("provinces:l", 0, -1));
        Assert.assertEquals(provinces.subList(0, 2), jedis.lrange("provinces:r", 0, 1));
    }

    @Test
    public void testHash() {
        String keyAccount1 = "account:1";
        String keyAccount2 = "account:2";

        jedis.hset(keyAccount1, "username", "张三");
        jedis.hset(keyAccount1, "age", "18");
        jedis.hset(keyAccount1, "gender", "male");
        Map<String, String> account = jedis.hgetAll(keyAccount1);
        System.out.println(account);

        account.put("username", "李四");
        System.out.println(account);
        jedis.hset(keyAccount2, account);
        Assert.assertEquals(account, jedis.hgetAll(keyAccount2));
    }

    @Test
    public void testSet() {
        jedis.sadd("flowers", "牡丹", "百合", "丁香", "太阳花", "百合");
        Set<String> flowers = jedis.smembers("flowers");
        System.out.println(flowers);
    }

    @Test
    public void testZSet() {
        String key = "subjects";
        jedis.zadd(key, 67, "math");
        jedis.zadd(key, 80, "Chinese");
        jedis.zadd(key, 99, "physics");
        jedis.zadd(key, 60, "chemical");
        Set<String> zSet = jedis.zrange(key, 0, -1);
        System.out.println(zSet.getClass());
        System.out.println(zSet);
    }

    @After
    public void closeJedis() {
        jedis.close();
    }
}
```

