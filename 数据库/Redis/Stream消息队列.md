Stream 实际上是一个具有消息发布/订阅功能的组件，也就常说的消息队列。

> 其实这种类似于 broker/consumer(生产者/消费者)的数据结构很常见，比如 RabbitMQ 消息中间件、Celery 消息中间件，以及 Kafka 分布式消息系统等，而 Redis Stream 正是借鉴了 Kafaka 系统。

Stream 除了拥有很高的性能和内存利用率外, 它最大的特点就是提供了消息的持久化存储，以及主从复制功能，从而解决了网络断开、Redis 宕机情况下消息丢失的问题，即便是重启 Redis，存储的内容也会存在。

Stream 消息队列主要由四部分组成，分别是：

- 消息本身
- 生产者
- 消费者
- 消费组

一个 Stream 队列可以拥有多个消费组，每个消费组中又包含了多个消费者，组内消费者之间存在竞争关系。当某个消费者消费了一条消息时，同组消费者，都不会再次消费这条消息。被消费的消息 ID 会被放入等待处理的 Pending_ids 中。每消费完一条信息，消费组的游标就会向前移动一位，组内消费者就继续去争抢下消息。

Redis Stream 消息队列结构程如下图所示：

![Redis Stream结构图](../../resources/images/notebook/数据库/Redis/15253613F-0.gif)

- Stream direction：表示数据流，它是一个消息链，将所有的消息都串起来，每个消息都有一个唯一标识 ID 和对应的消息内容（Message content）；

- Consumer Group ：表示消费组，拥有唯一的组名，使用 XGROUP CREATE 命令创建。一个 Stream 消息链上可以有多个消费组，一个消费组内拥有多个消费者，每一个消费者也有一个唯一的 ID 标识；

- last_delivered_id ：表示消费组游标，每个消费组都会有一个游标 last_delivered_id，任意一个消费者读取了消息都会使游标 last_delivered_id 往前移动；

- pending_ids ：Redis 官方称为 PEL，表示消费者的状态变量，它记录了当前已经被客户端读取的消息 ID，但是这些消息没有被 ACK(确认字符)。如果客户端没有 ACK，那么这个变量中的消息 ID 会越来越多，一旦被某个消息被 ACK，它就开始减少。

    > ACK（Acknowledge character）即确认字符。、

常用命令汇总：

| 命令                      | 说明                                         |
| ------------------------- | -------------------------------------------- |
| XADD                      | 添加消息到末尾。                             |
| XTRIM                     | 对 Stream 流进行修剪，限制长度。             |
| XDEL                      | 删除指定的消息。                             |
| XLEN                      | 获取流包含的元素数量，即消息长度。           |
| XRANGE                    | 获取消息列表，会自动过滤已经删除的消息。     |
| XREVRANGE                 | 反向获取消息列表，ID 从大到小。              |
| XREAD                     | 以阻塞或非阻塞方式获取消息列表。             |
| XGROUP CREATE             | 创建消费者组。                               |
| XREADGROUP GROUP          | 读取消费者组中的消息。                       |
| XACK                      | 将消息标记为"已处理"。                       |
| XGROUP SETID              | 为消费者组设置新的最后递送消息ID。           |
| XGROUP DELCONSUMER        | 删除消费者。                                 |
| XGROUP DESTROY            | 删除消费者组。                               |
| XPENDING                  | 显示待处理消息的相关信息。                   |
| XCLAIM                    | 转移消息的归属权。                           |
| XINFO                     | 查看 Stream 流、消费者和消费者组的相关信息。 |
| XINFO GROUPS              | 查看消费者组的信息。                         |
| XINFO STREAM              | 查看 Stream 流信息。                         |
| XINFO CONSUMERS key group | 查看组内消费者流信息。                       |