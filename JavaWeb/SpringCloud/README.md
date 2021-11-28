## 1. 认识微服务

单体架构：

![image-20211128173356114](../../resources/images/notebooks/JavaWeb/SpringCloud/image-20211128173356114.png)

分布式架构：

![image-20211128173526231](../../resources/images/notebooks/JavaWeb/SpringCloud/image-20211128173526231.png)

微服务方案的服务治理：

![image-20211128173747166](../../resources/images/notebooks/JavaWeb/SpringCloud/image-20211128173747166.png)

微服务是一种经过良好架构设计的分布式架构方案，微服务架构特征：

- 单一职责：微服务拆分粒度更小，每一个服务都对应唯一的业务能力，做到单一职责，避免重复业务开发；
- 面向服务：微服务对外暴露业务接口
- 自治：团队独立、技术独立、数据独立、部署独立
- 隔离性强：服务调用做好隔离、容错、降级，避免出现级联问题

![image-20211128174200051](../../resources/images/notebooks/JavaWeb/SpringCloud/image-20211128174200051.png)

## 2. 微服务技术

微服务技术对比：

![image-20211128172440203](../../resources/images/notebooks/JavaWeb/SpringCloud/image-20211128172440203.png)

企业常用技术选型组合：

![image-20211128172746094](../../resources/images/notebooks/JavaWeb/SpringCloud/image-20211128172746094.png)

## 3. SpringCloud

SpringCloud是目前国内使用最广泛的微服务框架，其集成了各种微服务功能组件，并基于SpringBoot实现了这些组件的自动装配，从而提供了良好的开箱即用体验：

![image-20211128174503807](../../resources/images/notebooks/JavaWeb/SpringCloud/image-20211128174503807.png)

SpringCloud与SpringBoot的版本存在兼容关系。