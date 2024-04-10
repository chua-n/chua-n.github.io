---
title: SpringCloud
---

## 1. 认识微服务

### 1.1 单体架构

**单体架构**：将业务的所有功能集中在一个项目中开发，打成一个包部署。如下图：

<img src="https://figure-bed.chua-n.com/notebook/JavaWeb/SpringCloud/image-20211128173356114.png" alt="image-20211128173356114" style="zoom:50%;" />

单体架构的优点是：

- 架构简单
- 部署成本低

### 1.2 分布式架构

**分布式架构**：根据业务功能对系统进行拆分，每个业务模块作为独立项目开发，称为一个**服务**。如下图：

<img src="https://figure-bed.chua-n.com/notebook/JavaWeb/SpringCloud/image-20211128173526231.png" alt="image-20211128173526231" style="zoom:30%;" />

分布式架构的优点是：

- 降低服务耦合
- 有利于服务升级拓展

分布式架构要考虑的问题——**服务治理**：

- 服务拆分粒度如何？
- 服务集群地址如何维护？
- 服务之间如何实现远程调用？
- 服务健康状态如何感知？

<img src="https://figure-bed.chua-n.com/notebook/JavaWeb/SpringCloud/image-20211128173747166.png" alt="image-20211128173747166" style="zoom:33%;" />

### 1.3 微服务方案的服务治理

微服务是一种经过良好架构设计的分布式架构方案，微服务架构特征：

- 单一职责：微服务拆分粒度更小，每一个服务都对应唯一的业务能力，做到单一职责，避免重复业务开发；
- 面向服务：微服务对外暴露业务接口
- 自治：团队独立、技术独立、数据独立、部署独立
- 隔离性强：服务调用做好隔离、容错、降级，避免出现级联问题

<img src="https://figure-bed.chua-n.com/notebook/JavaWeb/SpringCloud/image-20211128174200051.png" alt="image-20211128174200051" style="zoom:66%;" />

## 2. Spring Cloud

提起微服务，不得不提 Spring Cloud 全家桶系列，SpringCloud 是若干个框架的集合，包括 spring-cloud-config、spring-cloud-bus 等近 20 个子项目，提供了服务治理、服务网关、智能路由、负载均衡、断路器、监控跟踪、分布式消息队列、配置管理等领域的解决方案。Spring Cloud 通过 Spring Boot 风格的封装，屏蔽掉了复杂的配置和实现原理，最终给开发者留出了一套简单易懂、容易部署的分布式系统开发工具包。

需要强调的是，SpringCloud 与 SpringBoot 的版本存在兼容关系。

Spring Cloud 本身并不是一个拿来即可用的框架，它是一套微服务规范，这套规范可以认为目前有两代实现：

- 第一代实现： Spring Cloud Netflix

  > 2018 年 12 月12 日，Netflix 公司宣布 Spring Cloud Netflix 系列大部分组件都进入维护模式，不再添加新特性。

- 第二代实现： Spring Cloud Alibaba

Spring Cloud 组件体系：

|               | Spring Cloud Netflix |    Spring Cloud 官方    | Spring Cloud Zookeeper | Spring Cloud Consul | Spring  Cloud Kubernetes | Spring Cloud Alibaba |
| :-----------: | :------------------: | :---------------------: | :--------------------: | :-----------------: | :----------------------: | :------------------: |
|  分布式配置   |       Archaius       |   Spring Cloud Config   |       Zookeeper        |       Consul        |        ConfigMap         |        Nacos         |
| 服务注册/发现 |        Eureka        |            /            |       Zookeeper        |       Consul        |        Api Server        |        Nacos         |
|   服务熔断    |       Hystrix        |            /            |           /            |          /          |            /             |       Sentinel       |
|   服务调用    |        Feign         | OpenFeign, RestTemplate |           /            |          /          |            /             |      Dubbo RPC       |
|   服务路由    |         Zuul         |  Spring Cloud Gateway   |           /            |          /          |            /             |     Dubbo PROXY      |
|  分布式消息   |          /           |      SCS RabbitMQ       |           /            |          /          |            /             |     SCS RocketMQ     |
|   负载均衡    |        Ribbon        |            /            |           /            |          /          |            /             |       Dubbo LB       |
|  分布式事务   |          /           |            /            |           /            |          /          |            /             |        Seata         |

## 3. Spring Cloud Alibaba

Spring Cloud Alibaba 系列组件如下图，其中包含了阿里开源组件，阿里云商业化组件，以及集成Spring Cloud 组件。

![img](https://figure-bed.chua-n.com/notebook/JavaWeb/SpringCloud/v2-46c0b9e0d41c441d222390c79a4cd53b_720w.webp)

- 阿里开源组件

  - Nacos：一个更易于构建云原生应用的动态服务发现、配置管理和服务管理平台。
  - Sentinel：把流量作为切入点，从流量控制、熔断降级、系统负载保护等多个维度保护服务的稳定性。
  - RocketMQ：开源的分布式消息系统，基于高可用分布式集群技术，提供低延时的、高可靠的消息发布与订阅服务。
  - Dubbo：这个就不用多说了，在国内应用非常广泛的一款高性能 Java RPC 框架。
  - Seata：阿里巴巴开源产品，一个易于使用的高性能微服务分布式事务解决方案。
  - Arthas：开源的Java动态追踪工具，基于字节码增强技术，功能非常强大。

- 阿里商业化组件

  > 作为一家商业公司，阿里巴巴推出 Spring Cloud Alibaba，很大程度上市希望通过抢占开发者生态，来帮助推广自家的云产品。所以在开源社区，夹带了不少私货，

  - Alibaba Cloud ACM：一款在分布式架构环境中对应用配置进行集中管理和推送的应用配置中心产品。
  - Alibaba Cloud OSS：阿里云对象存储服务（Object Storage Service，简称 OSS），是阿里云提供的云存储服务。
  - Alibaba Cloud SchedulerX：阿里中间件团队开发的一款分布式任务调度产品，提供秒级、精准的定时（基于 Cron 表达式）任务调度服务。

- 集成 Spring Cloud 组件：Spring Cloud Alibaba 作为整套的微服务解决组件，只依靠目前阿里的开源组件是不够的，更多的是集成当前的社区组件，所以 Spring Cloud Alibaba 可以集成 Zuul，OpenFeign等网关，也支持 Spring Cloud Stream 消息组件。

## 4. 企业常用技术选型组合

企业常用技术选型组合：

<img src="https://figure-bed.chua-n.com/notebook/JavaWeb/SpringCloud/image-20211128172746094.png" alt="image-20211128172746094" style="zoom:28%;" />
