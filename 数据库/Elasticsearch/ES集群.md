## 1. 搭建ES集群

ES集群结构：单机的ES做数据存储，必然面临两个问题：

<img src="https://chua-n.gitee.io/blog-images/notebooks/数据库/Elasticsearch/image-20220101213703181.png" alt="image-20220101213703181" style="zoom:33%;" />

- 海量数据存储问题：将索引库从逻辑上拆分为N个分片（shard），存储到多个节点
- 单点故障问题：将分片数据在不同节点备份（replica）

自己玩的时候，可以尝试用3个docker容器模拟3个ES的节点：

<img src="https://chua-n.gitee.io/blog-images/notebooks/数据库/Elasticsearch/IMG_1220.JPG" alt="IMG_1220" style="zoom:30%;" />

ES中集群节点有不同的职责划分：

|    节点类型     |                 配置参数                 | 默认值 |                           节点职责                           |
| :-------------: | :--------------------------------------: | :----: | :----------------------------------------------------------: |
| master eligible |               node.master                |  true  | 备选主节点（主节点可以管理和记录集群状态、决定分片在哪个节点、处理创建和删除索引库的请求） |
|      data       |                node.data                 |  true  |             数据节点：存储数据、搜索、聚合、CRUD             |
|     ingest      |               node.ingest                |  true  |                     数据存储之前的预处理                     |
|  coordinating   | 上面3个参数都为false则为coordinating节点 |   无   | 1) 路由请求到其它节点<br />2) 合并其它节点处理的结果，返回给用户 |

ES中的每个节点角色都有自己不同的职责，因此建议集群部署时，每个节点都有独立的角色。

<img src="https://chua-n.gitee.io/blog-images/notebooks/数据库/Elasticsearch/image-20220101214345746.png" alt="image-20220101214345746" style="zoom:50%;" />

## 2. 集群脑裂问题

默认情况下，每个节点都是master eligible节点，因此一旦master节点宕机，其它候选节点会选举一个成为主节点。当主节点与其它节点网络故障时，可能发生脑裂问题。

<img src="https://chua-n.gitee.io/blog-images/notebooks/数据库/Elasticsearch/image-20220101214619319.png" alt="image-20220101214619319" style="zoom:50%;" />

为了避免脑裂，需要要求选票超过$（eligible节点数量+1）/2$才能当选为主，因此eligible节点数量最好是奇数。对应配置项是discovery.zen.minimum_master_nodes，在ES7.0以后，已经成为默认配置，因此一般不会发生脑裂问题。

## 3. 集群分布式存储

当新增文档时，应该保存到不同分片，保证数据均衡，那么coordinating node如何确定数据该存储到哪个分片呢？ES会通过hash算法来计算文档应该存储到哪个分片：

```text
shard = hash(_routing) % number_of_shards
```

- _routing默认是文档的id
- 算法与分片数量有关，因此索引库一旦创建，分片数量不能修改！

新增文档流程：

<img src="https://chua-n.gitee.io/blog-images/notebooks/数据库/Elasticsearch/image-20220101215059940.png" alt="image-20220101215059940" style="zoom:50%;" />

## 4. 集群分布式查询

ES的查询分成两个阶段：

- scatter phase：分散阶段，coordinating node会把请求分发到每一个分片
- gather phase：聚集阶段，coordinating node汇总data node的搜索结果，并处理为最终结果集返回给用户

<img src="https://chua-n.gitee.io/blog-images/notebooks/数据库/Elasticsearch/image-20220101215304196.png" alt="image-20220101215304196" style="zoom:50%;" />

## 5. 集群故障转移

集群的master节点会监控集群中的节点状态，如果发现有节点宕机，会立即将宕机节点的分片数据迁移到其它节点，确保数据安全，即**故障转移**。

<img src="https://chua-n.gitee.io/blog-images/notebooks/数据库/Elasticsearch/image-20220101215445902.png" alt="image-20220101215445902" style="zoom:50%;" />

