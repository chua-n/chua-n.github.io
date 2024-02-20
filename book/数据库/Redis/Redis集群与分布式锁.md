---
title: Redis集群与分布式锁
---

## 1. 主从模式

### 1.1 Redis 主从模式概述

在软件的架构中，主从模式（Master-Slave）是使用较多的一种架构。主（Master）和从（Slave）分别部署在不同的服务器上，当主节点服务器写入数据时，同时也会将数据同步至从节点服务器，*通常情况下*，主节点负责写入数据，而从节点负责读取数据。

Redis 主从模式的结构图如下。其中，Redis 主机会一直将自己的数据复制给 Redis 从机，从而实现主从同步。在这个过程中，只有 master 主机可执行写命令，其他 salve 从机只能只能执行读命令，这种读写分离的模式可以大大减轻 Redis 主机的数据读取压力，从而提高了Redis 的效率，并同时提供了多个数据备份。主从模式是搭建 Redis 集群最简单的一种方式。

|                         “主从直连”式                         |                         “薪火相传”式                         |
| :----------------------------------------------------------: | :----------------------------------------------------------: |
| ![Redis主从模式](https://chua-n.gitee.io/figure-bed/notebook/数据库/Redis/16133214H-0.gif) | ![image-20221014111727994](https://chua-n.gitee.io/figure-bed/notebook/数据库/Redis/image-20221014111727994.png) |

当一个主机挂掉之后，如果没有手动进行任何更改，不会有任何一个从机跃升为主机，它们的相对关系不会发生变化，当主机恢复之后仍将成为主机。

### 1.2 复制过程

![image-20221014111538664](https://chua-n.gitee.io/figure-bed/notebook/数据库/Redis/image-20221014111538664.png)

1. slave 启动成功连接到 master 后会发送一个 sync 命令；
2. master 接到 sync 命令后会启动后台的存盘进程，同时收集所有接收到的用于修改数据集的命令，在后台进程执行完毕之后，master 将传送整个数据文件到 slave，以完成一次完全同步；
3. 全量复制：slave 服务在接收到数据库文件数据后，将其存盘并加载到内存中；
4. 增量复制：在主从连接完成之后的过程中，master 会持续将新的修改命令依次传给 slave，完成同步；
5. 需要注意的是，slave 只要重新连接一次 master，就会做一次全量复制。

### 1.3 搭建：命令行方式

可以在启动 redis 服务时，使用以下命令，如 `redis-server --port 6300 --slaveof 127.0.0.1 6379`（开启一个端口为6300的从机，它依赖的主机的ip=127.0.0.1, port=6379）:

```bash
redis-server --port <slave-port> --slaveof <master-ip> <master-port>
```

也可以在正常启动的 redis 服务对应的客户端 redis-cli 中，使用以下命令：

- `SLAVEOF ip port`：将当前服务器设置为从服务器，从属于相应的 ip 和 port 指定的主服务器
- `SLAVEOF no one`：将当前服务器切换为独立主机

### 1.4 搭建：配置文件方式

例如，新建 redis_6302.conf 文件，并添加以下配置信息：

```
slaveof 127.0.0.1 6379 # 指定主机的ip与port
port 6302 # 指定从机的端口
```

启动 Redis 服务器，执行以下命令：

```bash
$ redis-server redis_6302.conf
```

通常而言，通过命令搭建主从模式的方式，简单又快捷，所以一般可以不用修改配置文件的方式。

### 1.5 缺点

该主从模式并不完美，它也存在许多不足之处：

- Redis 主从模式不具备自动容错和恢复功能，如果主节点宕机，Redis 集群将无法工作，此时需要人为干预，将从节点提升为主节点；
- 如果主机宕机前有一部分数据未能及时同步到从机，即使切换主机后也会造成数据不一致的问题，从而降低了系统的可用性；
- 因为只有一个主节点，所以其写入能力和存储能力都受到一定程度地限制；
- 在进行数据全量同步时，若同步的数据量较大可能会造卡顿的现象。

## 2. 哨兵模式

Redis 官方推荐一种高可用方案，也就是 Redis Sentinel 哨兵模式，它弥补了主从模式的不足。Sentinel 通过监控的方式获取主机的工作状态是否正常，当主机发生故障时， Sentinel 会自动进行故障转移，并将其监控的从机提升为主服务器（master），从而保证了系统的高可用性。

### 2.1 基本模式

哨兵模式是一种特殊的模式，Redis 为其提供了专属的哨兵命令，它是一个独立的进程，能够独立运行。其基本结构图如下：

![哨兵模式](https://chua-n.gitee.io/figure-bed/notebook/数据库/Redis/1K00M955-0.gif)

在上图过程中，哨兵主要有两个重要作用：

- 第一：哨兵节点会以每秒一次的频率对每个 Redis 节点发送`PING`命令，并通过 Redis 节点的回复来判断其运行状态；
- 第二：当哨兵监测到主服务器发生故障时，会自动在从节点中选择一台将机器，并其提升为主服务器，然后使用 PubSub 发布订阅模式，通知其他的从节点，修改配置文件，跟随新的主服务器。

### 2.2 多哨兵模式

在实际生产情况中，Redis Sentinel 是集群的高可用的保障，为避免 Sentinel 发生意外，它一般是由 3～5 个节点组成，这样就算挂了个别节点，该集群仍然可以正常运转。其结构图如下所示：

![Redis哨兵模式](https://chua-n.gitee.io/figure-bed/notebook/数据库/Redis/1K00HQ5-1.gif)

上图所示，多个哨兵之间也存在互相监控，这就形成了多哨兵模式，对该模式的工作过程如下：

- 主观下线：适用于主服务器和从服务器。如果在规定的时间内(配置参数：down-after-milliseconds)，Sentinel 节点没有收到目标服务器的有效回复，则判定该服务器为“主观下线”。比如 Sentinel1 向主服务发送了`PING`命令，在规定时间内没收到主服务器`PONG`回复，则 Sentinel1 判定主服务器为“主观下线”。
- 客观下线：只适用于主服务器。 Sentinel1 发现主服务器出现了故障，它会通过相应的命令，询问其它 Sentinel 节点对主服务器的状态判断。如果超过半数以上的 Sentinel 节点认为主服务器 down 掉，则 Sentinel1 节点判定主服务为“客观下线”。
- 投票选举：所有 Sentinel 节点会通过投票机制，按照谁发现谁去处理的原则，选举 Sentinel1 为领头节点去做 故障转移操作。Sentinel1 节点则按照一定的规则在所有从节点中选择一个最优的作为主服务器，然后通过发布订功能通知其余的从节点（slave）更改配置文件，跟随新上任的主服务器（master）。至此就完成了主从切换的操作。

总结而言，Sentinel 负责监控主从节点的“健康”状态。当主节点挂掉时，自动选择一个最优的从节点切换为主节点。客户端来连接 Redis 集群时，会首先连接 Sentinel，通过 Sentinel 来查询主节点的地址，然后再去连接主节点进行数据交互。当主节点发生故障时，客户端会重新向 Sentinel 要地址，Sentinel 会将最新的主节点地址告诉客户端。因此应用程序无需重启即可自动完成主从节点切换。

### 2.3 搭建

搭建步骤如下：

- 搭建主从模式：按搭建一般的主从模式的方式搭建即可。例如，在本地环境使用主从模式搭建一个拥有三台服务器的 Redis 集群：

  ```bash
  # 启动6379的redis服务器作为master主机:
  $ sudo /etc/init.d/redis-server start
  
  # 启动6380的redis服务器，设置为6379的slave:
  $ redis-server --port 6380
  $ redis-cli -p 6380
  127.0.0.1:6380> slaveof 127.0.0.1 6379
  OK
  
  # 启动6381的redis服务器，设置为6379的salve
  $ redis-server --port 6381
  $ redis-cli -p 6381
  127.0.0.1:6381> slaveof 127.0.0.1 6379
  ```

- 配置哨兵：新建 sentinel.conf 文件，并对其进行配置：

  ```shell
  port 26379 # sentinel监听端口，默认是26379，可以更改
  sentinel monitor biancheng 127.0.0.1 6379 1 # 格式：sentinel monitor <master-name> <ip> <redis-port> <quorum>
  ```

  > `sentinel monitor <master-name> <ip> <redis-port> <quorum>`表示让 sentinel 去监控一个地址为 ip:port 的主服务器：
  >
  > - 这里的 `master-name` 可以自定义；
  > - `<quorum>`：是一个数字，表示当有多少个 sentinel 认为主服务器宕机时，它才算真正的宕机掉，通常数量为半数或半数以上才会认为主机已经宕机，`<quorum>` 需要根据 sentinel 的数量设置。

- 启动哨兵：以下方式二选一即可

  - `redis-sentinel sentinel.conf`
  - `redis-server sentinel.conf --sentinel`

- 如果您想开启多个哨兵，只需配置要多个 sentinel.conf 文件即可，一个配置文件开启一个。

### 2.4 sentinel.conf 配置项

......

### 2.5 模拟主服务器宕机

以下模拟主服务器宕机的情况，然后查看从服务器是否被提升为了主服务器：

- 终止master的redis服务：`sudo /etc/init.d/redis-server stop`

- 执行完上述命令，会发现 6381 成为了新的 master，而其余节点变成了它的从机，通过以下命令可验证：

  ```redis
  127.0.0.1:6381> set webname www.biancheng.net
  OK
  ```

- 此时会发现哨兵的配置文件 sentinel.conf 也发生了变化：

  ```shell
  #port 26379
  #sentinel myid 4c626b6ff25dca5e757afdae2bd26a881a61a2b2
  # Generated by CONFIG REWRITE
  dir "/home/biancheng"
  maxclients 4064
  sentinel myid 4c626b6ff25dca5e757afdae2bd26a881a61a2b2
  sentinel monitor biancheng 127.0.0.1 6379 1
  sentinel config-epoch biancheng 2
  sentinel leader-epoch biancheng 2
  sentinel known-slave biancheng 127.0.0.1 6379
  sentinel known-slave biancheng 127.0.0.1 6380
  sentinel known-slave biancheng 127.0.0.1 6381
  port 26379
  sentinel current-epoch 2
  ```

## 3. 无中心化集群

TODO...

## 4. 分布式锁

在分布式系统中，当不同进程或线程一起访问共享资源时，会造成资源争抢，如果不加以控制的话，就会引发程序错乱。此时使用分布式锁能够非常有效的解决这个问题，它采用了一种互斥机制来防止线程或进程间相互干扰，从而保证了数据的一致性。

分布式锁主流的实现方案：

1. 基于数据库实现分布式锁

2. 基于缓存，如 Redis

3. 基于 Zookeeper

> 每一种分布式锁解决方案都有各自的优缺点：
>
> - 性能：redis 最高
> - 可靠性：zookeeper 最高

### 4.1 Redis分布式锁介绍

分布式锁并非是 Redis 独有，比如 MySQL 关系型数据库，以及 Zookeeper 分布式服务应用，它们都实现分布式锁，只不过 Redis 是基于缓存实现的。

Redis 分布式锁有很对应用场景，比如春运时，我们需要在 12306 上抢购回家火车票，但 Redis 数据库中只剩一张票了，此时有多个用户来预订购买，那么这张票会被谁抢走呢？Redis 服务器又是如何处理这种情景的呢？在这个过程中就需要使用分布式锁。

Redis 分布式锁主要有以下特点：

- 互斥性：是分布式锁的重要特点，在任意时刻，只有一个线程能够持有锁；
- 锁的超时时间：一个线程在持锁期间挂掉了而没主动释放锁，此时通过设置超时时间来保证该线程在超时后可以释放锁，这样其他线程才可以继续获取锁；
- 加锁和解锁必须是由同一个线程来设置；
- Redis 是缓存型数据库，拥有很高的性能，因此加锁和释放锁开销较小，并且能够很轻易地实现分布式锁。

> 注意：对Redis而言一个线程代表一个客户端。

### 4.2 Redis分布式锁命令

分布式锁的本质其实就是要在 Redis 里面占一个“坑”，当别的进程也要来占时，发现已经有人蹲了，就只好放弃或者稍做等待。这个“坑”同一时刻只允许被一个客户端占据，并且本着“先来先占”的原则。

Redis 分布式锁常用命令如下所示：

- `SETNX key val`：仅当key不存在时，设置一个 key 为 value 的字符串，返回1；若 key 存在，设置失败，返回 0；
- `Expire key timeout`：为 key 设置一个超时时间，以 second 秒为单位，超过这个时间锁会自动释放，避免死锁；
- `DEL key`：删除 key。

还有一种特殊情况，如果在 `SETNX` 和 `EXPIRE` 之间服务器进程突然挂掉，也就是还未设置过期时间，这样就会导致 `EXPIRE` 执行不了，因此还是会造成“死锁”的问题。为了避免这个问题，可以使用 `SET` 命令同时执行 `SETNX` 和 `EXPIRE` 命令，从而解决死锁问题：

- `SET key value [expiration EX seconds|PX milliseconds] [NX|XX]`  
- EX second：设置键的过期时间为 second 秒。 SET key value EX second 效果等同于 SETEX key second value 。
  
- PX millisecond：设置键的过期时间为毫秒。SET key value PX millisecond 效果等同于 PSETEX key millisecondvalue 。
  
- NX：只在键不存在时，才对键进行设置操作。 SET key value NX 效果等同于 SETNX key value 。
  
- XX：只在键已经存在时，才对键进行设置操作。

### 4.3 优化

- UUID 防止锁的误删
- Lua 脚本保证原子性
