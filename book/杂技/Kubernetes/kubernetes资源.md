---
title: 资源
---

## ~~资源和对象~~

类似于 Linux 中一切皆文件的理念，在 k8s 中，可以认为一切皆资源。

- 资源：k8s 中的所有内容都被抽象为“资源”，如 Pod、Service、Node 等都是资源。
- 对象：而“对象”就是资源的实例，是持久化的实体，如某个具体的 Node，k8s 使用这些实体去表示整个集群的状态。

## ~~资源的分类~~

> 讲师自己搞的分类，不一定正确。

- 元数据级
  - Horizontal Pod Autoscaler（HPA，水平伸缩）
  - PodTemplate
  - LimitRange
- 集群级
  - Namespace
  - Node
  - ClusterRole
  - ClusterRoleBinding
- 命名空间级
  - 工作负载型
    - Pod
  - 服务发现
    - Service：实现 k8s 内部网络调用、负载均衡
    - Ingress：将 k8s 内部服务暴露给外网访问的
  - 存储
    - Volume
    - CSI
  - 特殊类型配置
    - ConfigMap
    - Secret
    - DownwardAPI
  - 其他
    - Role
    - RoleBinding

## Pod

Pod 是 Kubernetes 抽象出来的，表示一组（一个或多个）应用容器（如 Docker），以及这些容器的一些共享资源。这些资源包括：

- 共享存储，当作卷
- 网络，作为唯一的集群 IP 地址
- 有关每个容器如何运行的信息，例如容器镜像版本或要使用的特定端口

Pod 为特定于应用的“逻辑主机”建模，并且可以包含相对紧耦合的不同应用容器。例如，Pod 可能既包含带有 Node.js 应用的容器，也包含另一个不同的容器，用于提供 Node.js 网络服务器要发布的数据。Pod 中的容器共享 IP 地址和端口，始终位于同一位置并且共同调度，并在同一节点上的共享上下文中运行。

*Pod 是 Kubernetes 平台上的原子单元*。当我们在 Kubernetes 上创建 Deployment 时，该 Deployment 会在其中创建包含容器的 Pod（而不是直接创建容器）。每个 Pod 都与调度它的节点绑定，并保持在那里直到终止（根据重启策略）或删除。如果节点发生故障，则会在集群中的其他可用节点上调度相同的 Pod。

![](https://figure-bed.chua-n.com/杂技/Kubernetes/module_03_pods.svg)

Kubernetes 集群中的每个 Pod 都有一个唯一的 IP 地址，即使是在同一个 Node 上的 Pod 也是如此。

## 副本

一个 Pod 可以被复制成多份，每一份可被称之为一个副本（replica），这些“副本”除了一些描述性的信息（Pod 的名字、uid 等）不一样以外，其它信息都是一样的。

Pod 的*控制器*通常包含一个名为 `replicas` 的属性，`replicas` 属性则指定了特定 Pod 的副本的数量，当当前集群中该 Pod 的数量与该属性指定的值不一致时，k8s 会采取一些策略去使得当前状态满足配置的要求。

## 控制器

### ReplicaSet 与 Deployment

ReplicaSet 与 Deployment 是两个适用无状态应用的控制器：

- **ReplicaSet**：RS 用来确保容器应用的副本数始终与用户定义的数量相同。即，如果有容器异常退出，会自动创建新的 Pod 来替代；而如果异常多出来的容器也会自动回收。

  > 其与原来的 RC（ReplicationController，已废弃）没有本质的区别，只是 RS 支持使用 Label 与 Selector 来对 Pod 进行筛选。

- **Deployment**：针对 RS 的更高层次的封装，提供了更丰富的部署相关的功能。

  - 创建 ReplicaSet/Pod
  - 滚动升级/回滚
  - 平滑扩容/缩容
  - 暂停/恢复 Deployment 机制

### StatefulSet

StatefulSet 适用有状态应用的控制器。

- 特性：
  - 稳定的网络标识：StatefulSet 使用 *Headless Service* 使得每个 Pod 都有一个唯一的 DNS 名称，格式为 `(statefulset name)-(ordinal)`，例如 web-0、web-1 等。
  - 持久化存储：StatefulSet 可以通过 *volumeClaimTemplates* 自动为每个 Pod 创建 PersistentVolumeClaim，确保每个 Pod 拥有独立的存储卷。
  - 有序部署和扩缩：Pod 会按照顺序创建和删除，确保在创建下一个 Pod 之前，所有前面的 Pod 都处于 Running 和 Ready 状态。
  - 有序滚动更新：在更新过程中，Pod 会按照逆序进行更新，确保系统的稳定性。
- 使用场景：
  - 需要稳定的持久化存储的应用（如数据库）
  - 需要稳定的网络标识的应用（如分布式系统）
  - 需要有序部署和扩缩的应用
- 限制：
  - StatefulSet 需要配合 Headless Service 使用，以提供 Pod 的网络标识
  - 删除 StatefulSet 时，关联的 PersistentVolume 不会被自动删除，以确保数据安全

### DaemonSet

DaemonSet 是一种守护进程的作用，其确保在集群中的每个 Node 上运行一个 Pod 的实例（除了那些明确指定不希望运行该 Pod 实例的节点）。这通常用于在每个节点上运行系统服务，如日志收集、监控代理或存储服务等。其主要特点是：

- 全局性：DaemonSet 确保在集群的每个节点上都运行一个 Pod 实例，无论节点的数量如何变化。
- 自动部署：当新的节点加入集群时，DaemonSet 会自动在新节点上创建 Pod 实例。
- 隔离性：DaemonSet 允许你指定某些节点不运行其 Pod 实例，这是通过节点选择器（Node Selector）或节点亲和性（Node Affinity）来实现的。
- 自动重启：如果 Pod 由于任何原因终止，DaemonSet 会负责重启该 Pod。
- 更新管理：DaemonSet 允许你更新 Pod 模板，它会确保所有节点上的 Pod 实例都更新到新版本。
- 资源竞争：DaemonSet 通常用于运行系统级别的守护进程，这些守护进程需要与节点上的其他 Pod 隔离开来，以避免资源竞争。

### Job

Job 具体可分为任务/定时任务：

- **Job**：一次性任务，运行完成后 Pod 销毁，不再重新启动新容器。
- **CronJob**：在 Job 的基础上增加了定时执行功能。

## Service

Pod 不能直接提供给外网访问，而是应该使用 Service，后者才是真正的“服务”。

Service 是 Kubernetes 中的一种抽象，它定义了一种访问 Pod 组的方法。Service 为一组具有相同功能的 Pod 提供一个单一的入口地址，无论这些 Pod 在集群中的哪个节点上运行。

通过设置 Service 的 `spec` 中的 `type`，你可以用不同的方式公开 Service：

- *ClusterIP*（默认）：在集群的内部 IP 上公开 Service。这种类型使得 Service 只能从集群内访问。
- *NodePort*：使用 NAT 在集群中每个选定 Node 的相同端口上公开 Service 。使用`<NodeIP>:<NodePort>` 从集群外部访问 Service，是 ClusterIP 的超集。
- *LoadBalancer*：在当前云中创建一个外部负载均衡器（如果支持的话），并为 Service 分配一个固定的外部IP，是 NodePort 的超集。
- *ExternalName*：将 Service 映射到 `externalName` 字段的内容（例如 `foo.bar.example.com`），通过返回带有该名称的 `CNAME` 记录实现。不设置任何类型的代理。这种类型需要 `kube-dns` 的 v1.7 或更高版本，或者 CoreDNS 的 0.8 或更高版本。

Service 通常与 Label Selector 配合使用，Label Selector 用于指定 Service 应该路由到哪些 Pod。

## Ingress

Ingress 允许你通过定义规则来控制如何将外部网络请求路由到集群内的 Service。

Ingress 是管理外部访问应用的规则集，它提供了 URL 路由、负载均衡、SSL 终端等功能。Ingress 通常依赖于 Ingress 控制器来实现，不同的云服务提供商或 Kubernetes 安装可能使用不同的 Ingress 控制器。

Service 与 Ingress 的区别：

- 访问级别：Service 通常用于集群内部的 Pod 访问，而 Ingress 用于管理集群外部到 Service 的 HTTP 和 HTTPS 访问。
- 功能：Service 提供稳定的网络访问，而 Ingress 提供了更复杂的路由和流量管理功能。
- 配置：Service 通过 Kubernetes API 直接创建，而 Ingress 需要额外的配置和可能的 Ingress 控制器支持。
- 使用场景：Service 适合集群内部的微服务之间的通信，Ingress 适合公网访问的应用，如网站或 API 端点。

## 存储

*Volume*：数据卷，共享 Pod 中容器使用的数据。用来放持久化的数据，比如数据库数据。

*CSI*：CSI（Container Storage Interface）是由来自 Kubernetes、Mesos、Docker 等社区成员联合制定的一个行业标准接口规范，旨在将任意存储系统暴露给容器化应用程序。CSI 规范定义了存储提供商实现 CSI 兼容的 Volume Plugin 的最小操作集和部署建议。CSI 规范的主要焦点是声明 Volume Plugin 必须实现的接口。

## 配置

- ConfigMap：一种 API 对象，用来将非机密性的数据保存到键值对中。使用时，Pod 可以将其用作环境变量、命令行参数或者存储卷中的配置文件。ConfigMap 将你的环境配置信息和容器镜像解耦，便于应用配置的修改。
- Secret：同 ConfigMap，但使用非明文存储，用于存储敏感信息，如密码、OAuth 令牌、SSH 密钥等。
- DownwardAPI：使得 Pod 内部的容器可以访问 Pod 自身的某些信息，如 CPU 和内存请求、Pod 的名称、所在的节点等。这些信息可以通过环境变量或文件的形式提供给容器。

## 权限

在 Kubernetes 中，Role 和 RoleBinding 是基于角色的访问控制（RBAC）的一部分，用于定义和限制用户或服务账户对 Kubernetes 资源的访问权限。

### Role

Role 是一种 Kubernetes 资源，它定义了一组权限，这些权限可以授予尝试执行特定操作的用户或服务账户。Role 通常与特定的命名空间相关联，这意味着它的作用域限定在该命名空间内。

Role 中定义的权限包括对资源的 CRUD（创建、读取、更新、删除）操作，例如：

- `pods`：允许用户对 Pod 进行 CRUD 操作。
- `services`：允许用户对 Service 进行 CRUD 操作。
- `configmaps`：允许用户对 ConfigMap 进行 CRUD 操作。

### RoleBinding

RoleBinding 将 Role 分配给用户或组，从而授予他们 Role 中定义的权限。RoleBinding 也与特定的命名空间相关联，这意味着它的作用域限定在该命名空间内。
