---
title: Nacos
---

## 1. Nacos 简介

Nacos 是阿里巴巴的产品，现在是 SpringCloud 中的一个组件，相比 Eureka 功能更加丰富与强大，集服务注册/发现、配置管理于一身，在国内受欢迎程度较高。

Nacos 的关键特性包括（详见 [什么是 Nacos](https://nacos.io/zh-cn/docs/what-is-nacos.html)）：

- 服务发现和服务健康监测
- 动态配置服务
- 动态 DNS 服务
- 服务及其元数据管理

### Nacos 地图与生态图

Nacos 地图：

<img src="https://figure-bed.chua-n.com/JavaWeb/SpringCloud/nacosMap.jpg" alt="img" style="zoom:50%;" />

Nacos 生态图：

<img src="https://figure-bed.chua-n.com/JavaWeb/SpringCloud/1533045871534-e64b8031-008c-4dfc-b6e8-12a597a003fb.png" alt="img" style="zoom:50%;" />

### 安装

类似于 zookeeper，nacos 运行也需要下载安装一个 server 端，系统中的微服务仅作为 client 端，nacos 安装的部分参考 [官网](https://nacos.io/zh-cn/index.html) 吧。

## 2. 服务注册

<img src="https://figure-bed.chua-n.com/JavaWeb/SpringCloud/image-20211128211348606.png" alt="image-20211128211348606" style="zoom:50%;" />

<img src="https://figure-bed.chua-n.com/JavaWeb/SpringCloud/image-20211128211407488.png" alt="image-20211128211407488" style="zoom:45%;" />

## 3. Nacos 服务分级存储模型

- 一级是服务，例如 userservice
- 二级是集群，例如杭州、上海
- 三级是实例，例如杭州机房的某台部署了 userservice 的服务器

<img src="https://figure-bed.chua-n.com/JavaWeb/SpringCloud/image-20211128212006476.png" alt="image-20211128212006476" style="zoom:25%;" />

<img src="https://figure-bed.chua-n.com/JavaWeb/SpringCloud/image-20211128212122650.png" alt="image-20211128212122650" style="zoom:30%;" />

设置实例的集群属性：

- 修改 application.yml 文件，添加`spring.cloud.nacos.discovery.cluster-name`属性即可。

<img src="https://figure-bed.chua-n.com/JavaWeb/SpringCloud/image-20211128212328655.png" alt="image-20211128212328655" style="zoom:33%;" />

## 4. Nacos 负载均衡

### 4.1 根据集群负载均衡

1. 修改 order-service 中 application.yml，设置集群为 HZ：

    ```yml
    spring:
      cloud:
        nacos:
          server-addr: localhost:8848 # nacos 服务端位置
          discovery:
            cluster-name: HZ # 配置集群名称，也就是机房位置
    ```

2. 然后在 order-service 中设置负载均衡的 IRule 为 NacosRule，这个规则优先会寻找与自己同集群的服务：

    ```yml
    userservice:
      ribbon:
        NFLoadBalancerRuleClassName: com.alibaba.cloud.nacos.ribbon.NacosRule # 负载均衡规则
    ```

3. 注意将 user-service 的权重都设置为 1

NacosRule 负载均衡策略：

- 优先选择同集群服务实例列表
- 本地集群找不到提供者，才去其他集群寻找，并且会报警告
- 确定了可用实例列表后，再采用随机负载均衡挑选实例

### 4.2 根据权重负载均衡

实际部署中会出现这样的场景：服务器设置性能有差异，部分实例所在机器性能较好，另一些较差，我们希望性能好的机器承担更多的用户请求。

面对这样的场景，Nacos 提供了权重配置来控制访问频率，权重越大则访问频率越高。

- Nacos 控制台可以设置实例的权重值，0~1 之间
- 同集群内的多个实例，权重越高被访问的频率越高
- 权重设置为 0 则完全不会被访问

实际步骤示例：

1. 在 Nacos 控制台可以设置实例的权重值，首先选中实例后面的编辑按钮

    ![IMG_0899](https://figure-bed.chua-n.com/JavaWeb/SpringCloud/IMG_0899.jpg)

2. 将权重设置为 0.1，测试可以发现 8081 被访问到的频率大大降低

    <img src="https://figure-bed.chua-n.com/JavaWeb/SpringCloud/IMG_0899-2.JPG" alt="IMG_0899-2" style="zoom:67%;" />

## 5. Nacos 注册中心

### 环境隔离-namespace

Nacos 中服务存储和数据存储的最外层都是一个名为 namespace 的东西，用来做最外层隔离。

<img src="https://figure-bed.chua-n.com/JavaWeb/SpringCloud/IMG_0901.JPG" alt="IMG_0901" style="zoom:50%;" />

步骤示例：

1. 在 Nacos 控制台可以创建 namespace，用来隔离不同环境

    <img src="https://figure-bed.chua-n.com/JavaWeb/SpringCloud/IMG_0902.JPG" alt="IMG_0902" style="zoom:50%;" />

2. 然后填写一个新的命名空间信息

    <img src="https://figure-bed.chua-n.com/JavaWeb/SpringCloud/IMG_0903.JPG" alt="IMG_0903" style="zoom:50%;" />

3. 保存后会在控制台看到这个命名空间的 id:

    <img src="https://figure-bed.chua-n.com/JavaWeb/SpringCloud/image-20211221232618963.png" alt="image-20211221232618963" style="zoom:40%;" />

4. 修改 order-service 的 application.yml，添加 namespace:

    <img src="https://figure-bed.chua-n.com/JavaWeb/SpringCloud/image-20211221232701490.png" alt="image-20211221232701490" style="zoom:40%;" />

5. 重启 order-service 后，再来查看控制台：
    <img src="https://figure-bed.chua-n.com/JavaWeb/SpringCloud/image-20211221232930869.png" alt="image-20211221232930869" style="zoom:40%;" />

6. 此时访问 order-service，因为 namespace 不同，会导致找不到 userservice，控制台会报错：

    <img src="https://figure-bed.chua-n.com/JavaWeb/SpringCloud/image-20211221232951661.png" alt="image-20211221232951661" style="zoom:33%;" />

Nacos 环境隔离：

- namespace 用来做环境隔离
- 每个 namespace 都有唯一 id
- 不同 namespace 下的服务不可见

### Nacos 注册中心原理

<img src="https://figure-bed.chua-n.com/JavaWeb/SpringCloud/IMG_0910.JPG" alt="IMG_0910" style="zoom:40%;" />

### 临时实例和非临时实例

服务注册到 Nacos 时，可以选择注册为临时或非临时实例：

```yml
spring:
  cloud:
    nacos:
      discovery:
        ephemeral: false # 设置为非临时实例
```

临时实例宕机时，会从 nacos 的服务列表中剔除，而非临时实例则不会。

### Nacos 与 Eureka

共同点：

- 都支持服务注册和服务拉取
- 都支持服务提供者心跳方式做健康检测

区别：

- Nacos 支持服务端主动检测提供者状态：临时实例采用心跳模式，非临时实例采用主动检测模式
- 临时实例心跳不正常会被剔除，非临时实例则不会被剔除
- Nacos 支持服务列表变更的消息推送模式，服务列表更新更及时
- Nacos 集群默认采用 AP 方式，当集群中存在非临时实例时，采用 CP 模式；Eureka 采用 AP 方式

## 6. Nacos 配置管理

### 6.1 统一配置管理

#### 6.1.1 特点与原理

配置更改热更新：

<img src="https://figure-bed.chua-n.com/JavaWeb/SpringCloud/IMG_0913.JPG" alt="IMG_0913" style="zoom:50%;" />

在弹出表单中填写配置信息：

<img src="https://figure-bed.chua-n.com/JavaWeb/SpringCloud/IMG_0914.JPG" alt="IMG_0914" style="zoom:50%;" />

配置获取的步骤如下：

<img src="https://figure-bed.chua-n.com/JavaWeb/SpringCloud/IMG_0916.JPG" alt="IMG_0916" style="zoom:45%;" />

#### 6.1.2 步骤

1. 引入 Nacos 的配置管理客户端依赖：

    <img src="https://figure-bed.chua-n.com/JavaWeb/SpringCloud/image-20211221234335154.png" alt="image-20211221234335154" style="zoom:50%;" />

2. 在 userservice 中的 resource 目录添加一个 bootstrap.yml 文件，这个文件是引导文件，优先级高于 application.yml：

    <img src="https://figure-bed.chua-n.com/JavaWeb/SpringCloud/image-20211221234355526.png" alt="image-20211221234355526" style="zoom:50%;" />

3. 测试：在 user-service 中将 pattern.dateformat 这个属性注入到 UserController 中做测试：

    <img src="https://figure-bed.chua-n.com/JavaWeb/SpringCloud/IMG_0918.JPG" alt="IMG_0918" style="zoom:50%;" />

将配置交给 Nacos 管理的步骤：

- 在 Nacos 中添加配置文件
- 在微服务中引入 nacos 的 config 依赖
- 在微服务中添加 bootstrap.yml，配置 nacos 地址、当前环境、服务名称、文件后缀名。这些决定了程序启动时去 Nacos 读取哪个文件

### 6.2 配置自动刷新

Nacos 中的配置文件变更后，微服务无需重启即可感知，不过需通过以下两种配置实现：

- 方式一：在`@Value`注入的变量所在类上添加注解`@RefreshScope`

    <img src="https://figure-bed.chua-n.com/JavaWeb/SpringCloud/IMG_0920.JPG" alt="IMG_0920" style="zoom:50%;" />

- 方式二：使用`@ConfigurationProperties`注解

    <img src="https://figure-bed.chua-n.com/JavaWeb/SpringCloud/IMG_0921.JPG" alt="IMG_0921" style="zoom:50%;" />

注意事项：不宜把所有的配置都放到配置中心，维护起来比较麻烦，建议将一些关键参数，需要运行时调整的参数放到 nacos 配置中心，一般都是自定义配置。

### 6.3 多环境配置共享

微服务启动时会从 nacos 读取多个配置文件：

- `[spring.application.name]-[spring.profiles.active].yaml`，例如`userservice-dev.yaml`
- `[spring.application.name].yaml`，例如：`userservice.yaml`

无论 profile 如何变化，`[spring.application.name].yaml`这个文件一定会加载，因此多环境共享配置可以写入这个文件：

<img src="https://figure-bed.chua-n.com/JavaWeb/SpringCloud/IMG_0923.JPG" alt="IMG_0923" style="zoom:50%;" />

多种配置的优先级：

`[服务名]-[环境].yaml` > `[服务名].yaml` > `本地配置`

<img src="https://figure-bed.chua-n.com/JavaWeb/SpringCloud/image-20211221235605552.png" alt="image-20211221235605552" style="zoom:50%;" />

### 6.4 Nacos 集群搭建

<img src="https://figure-bed.chua-n.com/JavaWeb/SpringCloud/IMG_0926.JPG" alt="IMG_0926" style="zoom:50%;" />

集群搭建步骤：

- 搭建 MySQL 集群并初始化数据库表
- 下载解压 nacos
- 修改集群配置（节点信息）、数据库配置
- 分别启动多个 nacos 节点
- nginx 反向代码
