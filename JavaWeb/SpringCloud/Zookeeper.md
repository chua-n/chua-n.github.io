## Zookeeper

### 概念

Zookeeper 是 Apache Hadoop 项目下的一个子项目，是一个树形目录服务。Zookeeper 翻译过来就是动物园管理员，它是用来管 Hadoop（大象）、Hive（大象）、Pig（小猪）的管理员，简称ZK。

ZK是一个分布式的、开源的分布式应用程序的协调服务。其提供的主要功能包括：

- 配置管理
- 分布式锁
- 集群管理

### 安装

略

### 数据模型

ZK是一个树形目录服务，其数据模型和Unix的文件系统目录树很类似，拥有一个层次化结构。

|                             Unix                             |                              ZK                              |
| :----------------------------------------------------------: | :----------------------------------------------------------: |
| ![Snipaste_2023-02-22_21-34-29（1）](../../resources/images/notebook/JavaWeb/SpringCloud/Snipaste_2023-02-22_21-34-29（1）.png) | ![Snipaste_2023-02-22_21-34-29（2）](../../resources/images/notebook/JavaWeb/SpringCloud/Snipaste_2023-02-22_21-34-29（2）.png) |

- 其中每一个节点都被称为`ZNode`，每个节点上都会保存自己的数据和节点信息。
- 节点可以拥有子节点，同时也允许少量（默认1MB）数据存储在该节点之下。
- 节点可以分为四大类：
  - `PERSISTENT`：持久化节点
  - `EPHEMERAL`：临时节点，`-e`
  - `PERSISTENT_SEQUENTIAL`：持久化顺序节点，`-s`
  - `EPHEMERAL_SEQUENTIAL`：临时顺序节点，`-es`

### ZK 命令

#### 服务端命令

|       服务端命令        |      作用      |
| :---------------------: | :------------: |
|  `./zkServer.sh start`  |   启动zk服务   |
| `./zkServer.sh status`  | 查看zk服务状态 |
|  `./zkServer.sh stop`   |   停止zk服务   |
| `./zkServer.sh restart` |   重启zk服务   |

#### 客户端命令

|             客户端常用命令              |                     作用                     |
| :-------------------------------------: | :------------------------------------------: |
|      `./zkCli.sh -server ip:port`       |                连接 zk 服务端                |
|                 `quit`                  |                   断开连接                   |
|                 `help`                  |                 查看命令帮助                 |
|      `ls [-s, -w, -R] /node_path`       |             显示指定目录下的节点             |
| `create [-e, -s, -es] /node_path value` | 创建持久化（临时、持久化顺序、临时顺序）节点 |
|            `get /node_path`             |                  获取节点值                  |
|         `set /node_path value`          |                  设置节点值                  |
|           `delete /node_path`           |                 删除单个节点                 |
|         `deleteall /node_path`          |             删除带有子节点的节点             |

### Java API

常见的 zk Java API有：

- 原生Java API：官方的，很难用
- ZkClient：对官方的进行了一些封装，依旧不好用
- Curator：原本由 netflix 公司研发，后捐献给 Apache 基金会，目前是 Apache 的顶级项目

Curator 简化了 zk 客户端的使用，其官网是 http://curator.apache.org/。

Curaotr 的 Maven 依赖坐标主要为：

```xml
<dependency>
    <groupId>org.apache.curator</groupId>
    <artifactId>curator-framework</artifactId>
</dependency>
<dependency>
    <groupId>org.apache.curator</groupId>
    <artifactId>curator-recipes</artifactId>
</dependency>
```