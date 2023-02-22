## 1. 认识微服务

### 1.1 单体架构

**单体架构**：将业务的所有功能集中在一个项目中开发，打成一个包部署。如下图：

<img src="https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/SpringCloud/image-20211128173356114.png" alt="image-20211128173356114" style="zoom:50%;" />

单体架构的优点是：

- 架构简单
- 部署成本低

### 1.2 分布式架构

**分布式架构**：根据业务功能对系统进行拆分，每个业务模块作为独立项目开发，称为一个**服务**。如下图：

<img src="https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/SpringCloud/image-20211128173526231.png" alt="image-20211128173526231" style="zoom:30%;" />

分布式架构的优点是：

- 降低服务耦合
- 有利于服务升级拓展

分布式架构要考虑的问题——**服务治理**：

- 服务拆分粒度如何？
- 服务集群地址如何维护？
- 服务之间如何实现远程调用？
- 服务健康状态如何感知？

<img src="https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/SpringCloud/image-20211128173747166.png" alt="image-20211128173747166" style="zoom:33%;" />

### 1.3 微服务方案的服务治理

微服务是一种经过良好架构设计的分布式架构方案，微服务架构特征：

- 单一职责：微服务拆分粒度更小，每一个服务都对应唯一的业务能力，做到单一职责，避免重复业务开发；
- 面向服务：微服务对外暴露业务接口
- 自治：团队独立、技术独立、数据独立、部署独立
- 隔离性强：服务调用做好隔离、容错、降级，避免出现级联问题

<img src="https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/SpringCloud/image-20211128174200051.png" alt="image-20211128174200051" style="zoom:66%;" />

## 2. 微服务技术

微服务技术对比：

![image-20211128172440203](https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/SpringCloud/image-20211128172440203.png)

企业常用技术选型组合：

<img src="https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/SpringCloud/image-20211128172746094.png" alt="image-20211128172746094" style="zoom:28%;" />

## 3. SpringCloud

SpringCloud是目前国内使用最广泛的微服务框架，其集成了各种微服务功能组件，并基于SpringBoot实现了这些组件的自动装配，从而提供了良好的开箱即用体验：

<img src="https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/SpringCloud/image-20211128174503807.png" alt="image-20211128174503807" style="zoom:33%;" />

SpringCloud与SpringBoot的版本存在兼容关系。

Spring Cloud模块体系：

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

