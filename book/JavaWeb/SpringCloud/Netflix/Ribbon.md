---
title: Ribbon
---

> Ribbon负载均衡。

## 1. 负载均衡流程：

<img src="https://figure-bed.chua-n.com/notebook/JavaWeb/SpringCloud/image-20211128203741731.png" alt="image-20211128203741731" style="zoom:33%;" />

详细流程：

<img src="https://figure-bed.chua-n.com/notebook/JavaWeb/SpringCloud/image-20211128204715351.png" alt="image-20211128204715351" style="zoom:33%;" />

## 2. 负载均衡策略

Ribbon的负载均衡规则是一个叫做IRule的接口来定义的，每一个子接口都是一种规则：

<img src="https://figure-bed.chua-n.com/notebook/JavaWeb/SpringCloud/image-20211128204937331.png" alt="image-20211128204937331" style="zoom:33%;" />

<img src="https://figure-bed.chua-n.com/notebook/JavaWeb/SpringCloud/image-20211128205019996.png" alt="image-20211128205019996" style="zoom:33%;" />

## 3. 配置负载均衡策略

通过定义IRule实现可以修改负载均衡规则，有两种方式：

- 代码方式（全局配置）：在order-service中的OrderApplication类中，定义一个新的IRule:

    ```java
    @Bean
    public IRule randomRule() {
        return new RandomRule();
    }
    ```

- 配置文件方式（针对某个微服务）：在order-service的application.yml文件中，添加如下配置：

    ```yml
    userservice:
      ribbon:
        NFLoadBalancerRuleClassName: com.netflix.loadbalancer.RandomRule # 负载均衡规则
    ```

## 4. 饥饿加载

Ribbon默认采用懒加载，即第一次访问时才会去创建`LoadBalanceClient`，请求时间会很长。

而饥饿加载则会在项目启动时创建，降低第一次访问的耗时，通过下面配置开启饥饿加载：

```yml
ribbon:
  eager-load:
    enabled: true # 开启饥饿加载
    clients: userservice # 指定对userservice这个服务饥饿加载
```

