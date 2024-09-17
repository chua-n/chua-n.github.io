---
title: Kubernetes 对象
---

## 释义

Kubernetes 对象是 Kubernetes 系统中的持久性实体。 Kubernetes 使用这些实体表示你的集群状态。具体而言，它们描述了如下信息：

- 哪些容器化应用正在运行（以及在哪些节点上运行）
- 可以被应用使用的资源
- 关于应用运行时行为的策略，比如重启策略、升级策略以及容错策略

关于 Kubernetes 对象，官方有下面一段描述：

> A Kubernetes object is a "record of intent"--once you create the object, the Kubernetes system will constantly work to ensure that the object exists. By creating an object, you're effectively telling the Kubernetes system what you want your cluster's workload to look like; this is your cluster's *desired state*.

操作 Kubernetes 对象（无论是创建、修改或者删除）需要使用 [Kubernetes API](https://kubernetes.io/zh-cn/docs/concepts/overview/kubernetes-api)。 

- 比如，当使用 `kubectl` 命令行接口（CLI）时，CLI 会调用必要的 Kubernetes API；
- 也可以在程序中使用[客户端库](https://kubernetes.io/zh-cn/docs/reference/using-api/client-libraries/)， 来直接调用 Kubernetes API。

## 对象的规约与状态

几乎每个 Kubernetes 对象包含两个嵌套的对象字段，它们负责管理对象的配置——对象规约（`spec`）和对象状态（`status`）：

- `spec`：对于具有 `spec` 的 Kubernetes 对象，你必须在创建对象时就设置 `spec` 的内容，它们描述了你希望这个 Kubernetes 对象所具有的特征，即**期望状态（Desired State）**。
- `status`：`status` 描述了对象的**当前状态（Current State）**，它是由 Kubernetes 系统和组件来设置并更新的。在任何时刻，Kubernetes [控制平面](https://kubernetes.io/zh-cn/docs/reference/glossary/?all=true#term-control-plane) 都一直在积极地管理着对象的实际状态，以使之达成期望状态。

例如，Kubernetes 中的 Deployment 对象能够表示运行在集群中的应用。当创建 Deployment 时，你可能会设置 Deployment 的 `spec`，指定该应用要有 3 个副本运行。Kubernetes 系统读取 Deployment 的 `spec`， 并启动我们所期望的应用的 3 个实例——更新状态以与规约相匹配。 如果这些实例中有的失效了，Kubernetes 系统会通过执行修正操作来响应 `spec` 和 `status` 间的不一致——意味着它会启动一个新的实例来替换。

## 描述对象

创建 Kubernetes 对象时，必须提供对象的 `spec`，以及关于对象的一些基本信息（例如名称）。 当使用 Kubernetes API 创建对象时（直接创建或经由 `kubectl` 创建），API 请求必须在请求主体中包含 JSON 格式的信息。

实际使用过程中，通常通过 **清单（Manifest）** 文件为 `kubectl` 提供对象的这些描述信息。按照惯例，这个清单使用 YAML 格式（当然也可以使用 JSON）。像 `kubectl` 这样的工具在通过 HTTP 进行 API 请求时， 会将清单中的信息转换为 JSON 或其他受支持的序列化格式。

### 必需字段

在想要创建的 Kubernetes 对象所对应的清单中，必须要配置的字段如下：

- `apiVersion`：创建该对象所使用的 Kubernetes API 的版本
- `kind`：想要创建的对象的类别
- `metadata`：帮助唯一标识对象的一些数据，包括一个 `name` 字符串、`UID` 和可选的 `namespace`
- `spec`：你所期望的该对象的状态

对每个 Kubernetes 对象而言，其 `spec` 之精确格式都是不同的，不同的类型可能包含不同的嵌套字段（详见 [Kubernetes API 参考](https://kubernetes.io/zh-cn/docs/reference/kubernetes-api/)）。

例如，对于每个 Pod，其 `.spec` 字段设置了 Pod 及其期望状态（例如 Pod 中每个容器的容器镜像名称）。对于 StatefulSet 而言，其 `.spec` 字段设置了 StatefulSet 及其期望状态。在 StatefulSet 的 `.spec` 内，有一个为 Pod 对象提供的模板，该模板描述了 StatefulSet 控制器为了满足 StatefulSet 规约而要创建的 Pod。

### 示例

例如，以下是一个清单示例文件，展示了 Kubernetes Deployment 的必需字段和对象 `spec`：

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
spec:
  selector:
    matchLabels:
      app: nginx
  replicas: 2 # 告知 Deployment 运行 2 个与该模板匹配的 Pod
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.14.2
        ports:
        - containerPort: 80
```

