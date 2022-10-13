Redis 命令用于在 redis 服务上执行操作。要在 redis 服务上执行命令需要一个 redis 客户端，在安装 redis 自动带有一个 redis-cli 工具，即为官方提供的客户端工具。启动 redis-cli 的方法：

- 连接本地服务：`$ redis-cli`

  ```bash
  $ redis-cli
  redis 127.0.0.1:6379>
  redis 127.0.0.1:6379> PING
  PONG
  redis 127.0.0.1:6379>
  ```

- 连接远程服务：`$ redis-cli -h host -p port -a password`

  ```bash
  $redis-cli -h 192.168.31.1 -p 6379 -a "mypass"
  redis 192.168.31.1:6379>
  redis 192.168.31.1:6379> PING
  PONG
  redis 192.168.31.1:6379>
  ```

## 查看/修改配置

Redis 的配置文件位于 Redis 安装目录下，文件名为 **redis.conf** (Windows 名为 redis.windows.conf)。

### 查看配置项

使用`CONFIG GET 配置名称`命令，例如获取日志级别：

```redis
redis 127.0.0.1:6379> CONFIG GET loglevel 
```

输出结果如下：

```redis
1) "loglevel"
2) "notice"
```

通过使用`*`则可以查看所有配置项，命令如下：

```redis
redis 127.0.0.1:6379> CONFIG GET *
```

输出结果如下：

```redis
1) "dbfilename"
2) "dump.rdb"
3) "requirepass"
4) ""
5) "masterauth"
6) ""
7) "cluster-announce-ip"
8) ""
9) "unixsocket"
10) ""
11) "logfile"
12) ""
13) "pidfile"
14) ""
15) "slave-announce-ip"
16) ""
17) "replica-announce-ip"
18) ""
19) "maxmemory"
20) "0"
21) "proto-max-bulk-len"
22) "536870912"
23) "client-query-buffer-limit"
24) "1073741824"
.....
```

### 修改配置项

使用命令：`CONFIG SET 配置项名称 配置项参数值`

例如修改日志级别：

```redis
127.0.0.1:6379> CONFIG SET loglevel "verbose"
OK
127.0.0.1:6379> CONFIG GET loglevel
1) "loglevel"
2) "verbose"
```

Redis 的日志级别有以下四种：

1. debug：会打印出很多信息，适用于开发和测试阶段。
2. verbose：包含很多不太有用的信息，但比debug简化一些。
3. notice：适用于生产模式。
4. warning : 警告信息。

Redis 默认设置为 verbose，开发测试阶段可以用 debug，生产模式一般选用 notice。

## 连接命令

Redis 连接命令是主要用于验证 Redis 服务器的连接状态，比如验证客户端与 Redis 服务器是否连接成功，以及检查服务器运行状态，以及是否断开当前连接等。

我们知道，只有当客户端与服务器正常连接后才能够实现彼此的交互、通信。Redis 通过“Redis序列化协议”（简称“RESP”），实现客户端与服务端之间的连接通信，该协议主要包括两个部分：网络模型和序列化协议：

- 网络模型主要负责数据交互的组织方式；
- 序列化协议则实现了数据的序列化（客户端与服务端交互的数据是以序列后的协议数据进行传输的）。

![Redis序列化协议](../../resources/images/notebook/数据库/Redis/14415131a-0.gif)

相关的命令有：

| 命令          | 说明                 |
| ------------- | -------------------- |
| PING          | 查看服务是否运行正常 |
| QUIT          | 关闭当前连接         |
| AUTH password | 验证密码是否正确     |
| ECHO message  | 打印字符串           |
| SELECT index  | 切换到指定的数据库   |

一组实例：

```redis
# 通过配置文件或者或者config命令配置客户端连接密码
redis 127.0.0.1:6379> CONFIG SET requirepass 123456
OK

# 验证给定的密码和配置文件密码是否一致
redis 127.0.0.1:6379> AUTH 123456
OK

# 检测客户端与服务器是否连接正常
redis 127.0.0.1:6379> PING
PONG

# 切换到2库
127.0.0.1:6379> SELECT 2
OK

# 打印字符串
127.0.0.1:6379[2]> ECHO "hello www.biancheng.net"
"hello www.biancheng.net"

# 中断连接
127.0.0.1:6379> QUIT

chuan@redmibook-2021:~$
```

## key

Redis 是一种键值（key-value）型的缓存型数据库，它将数据全部以键值对的形式存储在内存中，并且 key 与 value 一一对应。这里的 key 被形象的称之为密钥，Redis 提供了诸多操作这把“密钥”的命令，从而实现了对存储数据的管理。

| 命令                | 说明                                                         |
| ------------------- | ------------------------------------------------------------ |
| DEL key             | 若键存在的情况下，该命令用于删除键。                         |
| DUMP key            | 用于序列化给定 key ，并返回被序列化的值。                    |
| EXISTS key          | 用于检查键是否存在，若存在则返回 1，否则返回 0。             |
| EXPIRE key          | 设置 key 的过期时间，以秒为单位。                            |
| EXPIREAT key        | 该命令与 EXPIRE 相似，用于为 key 设置过期时间，不同在于，它的时间参数值采用的是时间戳格式。 |
| PEXPIRE key         | 设置 key 的过期，以毫秒为单位。                              |
| PEXPIREAT key       | 与 PEXPIRE 相似，用于为 key 设置过期时间，采用以毫秒为单位的时间戳格式。 |
| KEYS pattern        | 此命令用于查找与指定 pattern 匹配的 key。                    |
| MOVE key db         | 将当前数据库中的 key 移动至指定的数据库中（默认存储为 0 库，可选 1-15中的任意库）。 |
| PERSIST key         | 该命令用于删除 key 的过期时间，然后 key 将一直存在，不会过期。 |
| PTTL key            | 用于检查 key 还剩多长时间过期，以毫秒为单位。                |
| TTL key             | 用于检查 key 还剩多长时间过期，以秒为单位。                  |
| RANDOMKEY           | 从当前数据库中随机返回一个 key。                             |
| RENAME key newkey   | 修改 key 的名称。                                            |
| RENAMENX key newkey | 如果新键名不重复，则将 key 修改为 newkey。                   |
| SCAN cursor         | 基于游标的迭代器，用于迭代数据库中存在的所有键，cursor 指的是迭代游标。 |
| TYPE key            | 该命令用于获取 value 的数据类型。                            |

## string

Redis 操作字符串命令的语法格式为`COMMAND KEY_NAME`（COMMAND表示字符串的命令，KEY_NAME表示键的名称）。

常用命令：

| 命令                             | 说明                                                         |
| -------------------------------- | ------------------------------------------------------------ |
| SET key value                    | 用于设定指定键的值。                                         |
| GET key                          | 用于检索指定键的值。                                         |
| GETRANGE key start end           | 返回 key 中字符串值的子字符。                                |
| GETSET key value                 | 将给定 key 的值设置为 value，并返回 key 的旧值。             |
| GETBIT key offset                | 对 key 所存储的字符串值，获取其指定偏移量上的位（bit）。     |
| APPEND key value                 | 该命令将 value 追加到 key 所存储值的末尾。                   |
| MGET key1 [key2...]              | 批量获取一个或多个 key 所存储的值，减少网络耗时开销。        |
| SETBIT key offset value          | 对 key 所储存的字符串值，设置或清除指定偏移量上的位(bit)。   |
| SETEX key seconds value          | 将值 value 存储到 key中 ，并将 key 的过期时间设为 seconds (以秒为单位)。 |
| SETNX key value                  | 当 key 不存在时设置 key 的值。                               |
| SETRANGE key offset value        | 从偏移量 offset 开始，使用指定的 value 覆盖的 key 所存储的部分字符串值。 |
| STRLEN key                       | 返回 key 所储存的字符串值的长度。                            |
| MSET key value [key value ...]   | 该命令允许同时设置多个键值对。                               |
| MSETNX key value [key value ...] | 当指定的 key 都不存在时，用于设置多个键值对。                |
| PSETEX key milliseconds value    | 此命令用于设置 key 的值和有过期时间（以毫秒为单位）。        |
| INCR key                         | 将 key 所存储的整数值加 1。                                  |
| INCRBY key increment             | 将 key 所储存的值加上给定的递增值（increment）。             |
| INCRBYFLOAT key increment        | 将 key 所储存的值加上指定的浮点递增值（increment）。         |
| DECR key                         | 将 key 所存储的整数值减 1。                                  |
| DECRBY key decrement             | 将 key 所储存的值减去给定的递减值（decrement）。             |

## list

常用命令：

| 命令                                  | 说明                                                         |
| ------------------------------------- | ------------------------------------------------------------ |
| LPUSH key value1 [value2]             | 在列表头部插入一个或者多个值。                               |
| LRANGE key start stop                 | 获取列表指定范围内的元素。                                   |
| RPUSH key value1 [value2]             | 在列表尾部添加一个或多个值。                                 |
| LPUSHX key value                      | 当储存列表的 key 存在时，用于将值插入到列表头部。            |
| RPUSHX key value                      | 当存储列表的 key 存在时，用于将值插入到列表的尾部。          |
| LINDEX key index                      | 通过索引获取列表中的元素。                                   |
| LINSERT key before\|after pivot value | 指定列表中一个元素在它之前或之后插入另外一个元素。           |
| LREM key count value                  | 表示从列表中删除元素与 value 相等的元素。count 表示删除的数量，为 0 表示全部移除。 |
| LSET key index value                  | 表示通过其索引设置列表中元素的值。                           |
| LTRIM key start stop                  | 保留列表中指定范围内的元素值。                               |
| LPOP key                              | 从列表的头部弹出元素，默认为第一个元素。                     |
| RPOP key                              | 从列表的尾部弹出元素，默认为最后一个元素。                   |
| LLEN key                              | 用于获取列表的长度。                                         |
| RPOPLPUSH source destination          | 用于删除列表中的最后一个元素，然后将该元素添加到另一个列表的头部，并返回该元素值。 |
| BLPOP key1 [key2 ] timeout            | 用于删除并返回列表中的第一个元素（头部操作），如果列表中没有元素，就会发生阻塞， 直到列表等待超时或发现可弹出元素为止。 |
| BRPOP key1 [key2 ] timeout            | 用于删除并返回列表中的最后一个元素（尾部操作），如果列表中没有元素，就会发生阻塞， 直到列表等待超时或发现可弹出元素为止。 |
| BRPOPLPUSH source destination timeout | 从列表中取出最后一个元素，并插入到另一个列表的头部。如果列表中没有元素，就会发生 阻塞，直到等待超时或发现可弹出元素时为止。 |

## hash

hash常用命令汇总：

| 命令                                     | 说明                                                  |
| ---------------------------------------- | ----------------------------------------------------- |
| HDEL key field2 [field2]                 | 用于删除一个或多个哈希表字段。                        |
| HEXISTS key field                        | 用于确定哈希表字段是否存在。                          |
| HGET key field                           | 获取 key 关联的哈希字段的值。                         |
| HGETALL key                              | 获取 key 关联的所有哈希字段值。                       |
| HINCRBY key field increment              | 给 key 关联的哈希字段做整数增量运算 。                |
| HINCRBYFLOAT key field increment         | 给 key 关联的哈希字段做浮点数增量运算 。              |
| HKEYS key                                | 获取 key 关联的所有字段和值。                         |
| HLEN key                                 | 获取 key 中的哈希表的字段数量。                       |
| HMSET key field1 value1 [field2 value2 ] | 在哈希表中同时设置多个 field-value(字段-值）          |
| HMGET key field1 [field2]                | 用于同时获取多个给定哈希字段（field）对应的值。       |
| HSET key field value                     | 用于设置指定 key 的哈希表字段和值（field/value）。    |
| HSETNX key field value                   | 仅当字段 field 不存在时，设置哈希表字段的值。         |
| HVALS key                                | 用于获取哈希表中的所有值。                            |
| HSCAN key cursor                         | 迭代哈希表中的所有键值对，cursor 表示游标，默认为 0。 |

## set

Redis set 向集合中添加一个成员的语法格式为 `SADD key member [member ...]`。常用命令如下：

| 命令                                           | 说明                                                     |
| ---------------------------------------------- | -------------------------------------------------------- |
| SADD key member1 [member2\]                    | 向集合中添加一个或者多个元素，并且自动去重。             |
| SCARD key                                      | 返回集合中元素的个数。                                   |
| SDIFF key1 [key2]                              | 求两个或多个集合的差集。                                 |
| SDIFFSTORE destination key1 [key2]             | 求两个集合或多个集合的差集，并将结果保存到指定的集合中。 |
| SINTER key1 [key2]                             | 求两个或多个集合的交集。                                 |
| SINTERSTORE destination key1 [key2]            | 求两个或多个集合的交集，并将结果保存到指定的集合中。     |
| SISMEMBER key member                           | 查看指定元素是否存在于集合中。                           |
| SMEMBERS key                                   | 查看集合中所有元素。                                     |
| SMOVE source destination member                | 将集合中的元素移动到指定的集合中。                       |
| SPOP key [count]                               | 弹出指定数量的元素。                                     |
| SRANDMEMBER key [count]                        | 随机从集合中返回指定数量的元素，默认返回 1个。           |
| SREM key member1 [member2]                     | 删除一个或者多个元素，若元素不存在则自动忽略。           |
| SUNION key1 [key2]                             | 求两个或者多个集合的并集。                               |
| SUNIONSTORE destination key1 [key2]            | 求两个或者多个集合的并集，并将结果保存到指定的集合中。   |
| SSCAN key cursor [match pattern] [count count] | 该命令用来迭代的集合中的元素。                           |

## zset

常用命令集合：

| 命令                                            | 说明                                                         |
| ----------------------------------------------- | ------------------------------------------------------------ |
| ZADD key score1 member1 [score2 member2\]       | 用于将一个或多个成员添加到有序集合中，或者更新已存在成员的 score 值 |
| ZCARD key                                       | 获取有序集合中成员的数量                                     |
| ZCOUNT key min max                              | 用于统计有序集合中指定 score 值范围内的元素个数。            |
| ZINCRBY key increment member                    | 用于增加有序集合中成员的分值。                               |
| ZINTERSTORE destination numkeys key [key ...]   | 求两个或者多个有序集合的交集，并将所得结果存储在新的 key 中。 |
| ZLEXCOUNT key min max                           | 当成员分数相同时，计算有序集合中在指定词典范围内的成员的数量。 |
| ZRANGE key start stop [WITHSCORES]              | 返回有序集合中指定索引区间内的成员数量。                     |
| ZRANGEBYLEX key min max [LIMIT offset count\]   | 返回有序集中指定字典区间内的成员数量。                       |
| ZRANGEBYSCORE key min max [WITHSCORES\] [LIMIT] | 返回有序集合中指定分数区间内的成员。                         |
| ZRANK key member                                | 返回有序集合中指定成员的排名。                               |
| ZREM key member [member ...]                    | 移除有序集合中的一个或多个成员。                             |
| ZREMRANGEBYLEX key min max                      | 移除有序集合中指定字典区间的所有成员。                       |
| ZREMRANGEBYRANK key start stop                  | 移除有序集合中指定排名区间内的所有成员。                     |
| ZREMRANGEBYSCORE key min max                    | 移除有序集合中指定分数区间内的所有成员。                     |
| ZREVRANGE key start stop [WITHSCORES]           | 返回有序集中指定区间内的成员，通过索引，分数从高到低。       |
| ZREVRANGEBYSCORE key max min [WITHSCORES]       | 返回有序集中指定分数区间内的成员，分数从高到低排序。         |
| ZREVRANK key member                             | 返回有序集合中指定成员的排名，有序集成员按分数值递减(从大到小)排序。 |
| ZSCORE key member                               | 返回有序集中，指定成员的分数值。                             |
| ZUNIONSTORE destination numkeys key [key ...]   | 求两个或多个有序集合的并集，并将返回结果存储在新的 key 中。  |
| ZSCAN key cursor [MATCH pattern] [COUNT count]  | 迭代有序集合中的元素（包括元素成员和元素分值）。             |

## 客户端命令

Redis 提供了一些操作客户端（client）的命令，比如查询所有已连接到服务器的客户端数量，控制客户端的连接状态（关闭或者挂起）等。通过客户端命令我们可以轻松的实现对客户端的管理、控制。

Redis 服务器通过监听 TCP 端口的方式来接受客户端的连接。当一个连接建立后，Redis 会自动执行以下过程：

- 首先客户端 socket 被设置为非阻塞模式，这是因为 Redis 在网络事件处理上采用了非阻塞式 IO（即 IO 多路复用模型）；

- 其次设置 socket 的 TCP_NODELAY 属性，从而禁用 Nagle 算法；

  > TCP_NODELAY 控制是否开启 Nagle 算法，该算法可以提高广域网传输效率，减少分组的报文个数，适合传输体量较大的数据。
  >
  > Redis 使用命令的格式向客户端输入数据，这个数据量是非常小的。当向客户端输入命令后，我们希望能快速的得到服务器的应答，也就是低延时性，但如果开启了 Nagle 算法就会出现频繁延时的现象，导致用户体验极差。

- 最后创建一个可读的文件事件，用它来监听客户端 socket 的数据发送。

客户端常用命令：

| 命令           | 说明                                                         |
| -------------- | ------------------------------------------------------------ |
| CLIENT LIST    | 以列表的形式返回所有连接到 Redis 服务器的客户端。            |
| CLIENT SETNAME | 设置当前连接的名称。                                         |
| CLIENT GETNAME | 获取通过 CLIENT SETNAME 命令设置的服务名称。                 |
| CLIENT PAUSE   | 挂起客户端连接，将所有客户端挂起指定的时间（以毫秒为计算）。 |
| CLIENT KILL    | 关闭客户端连接。                                             |
| CLIENT ID      | 返回当前客户端 ID。                                          |
| CLIENT REPLY   | 控制发送到当前连接的回复，可选值包括 on\|off\|skip。         |

## 服务器命令

Redis 提供了诸多操作服务器的命令，这些命令都有着各自重要的作用。比如`BGSAVE`命令，用异步的方式将 Redis 数据库的数据同步到本地磁盘中，实现数据的持久化存储，这对服务器的数据安全有着重要的作用。

Redis 服务器的常用命令：

| 命令                                         | 说明                                                         |
| -------------------------------------------- | ------------------------------------------------------------ |
| BGREWRITEAOF                                 | 在后台以异步的方式执行一个 AOF 文件的重写操作，对源文件进行压缩，使其体积变小。 AOF 是实现数据持久化存储的方式之一。 |
| BGSAVE                                       | 在后台执行初始化操作，并以异步的方式将当前数据库的数据保存到磁盘中。 |
| CLIENT KILL [ip：port] [ID client-id]        | 关闭客户端连接。                                             |
| CLIENT LIST                                  | 获取连接到服务器的客户端连接列表。                           |
| CLIENT GETNAME                               | 获取当前连接客户端的名称。                                   |
| CLIENT PAUSE timeout                         | 使服务器在指定的时间停止执行来自客户端的命令。               |
| CLIENT SETNAME connection-name               | 设置当前连接客户端的名称。                                   |
| COMMAND                                      | 返回所有 Redis 命令的详细描述信息。                          |
| COMMAND COUNT                                | 此命令用于获取 Redis 命令的总数。                            |
| COMMAND GETKEYS                              | 获取指定命令的所有键。                                       |
| INFO [section]                               | 获取 Redis 服务器的各种信息和统计数值。                      |
| COMMAND INFO command-name [command-name ...] | 用于获取指定 Redis 命令的描述信息。                          |
| CONFIG GET parameter                         | 获取指定配置参数的值。                                       |
| CONFIG REWRITE                               | 修改启动 Redis 服务器时所指定的 redis.conf 配置文件。        |
| CONFIG SET parameter value                   | 修改 Redis 配置参数，无需重启。                              |
| CONFIG RESETSTAT                             | 重置 INFO 命令中的某些统计数据。                             |
| DBSIZE                                       | 返回当前数据库中 key 的数量。                                |
| DEBUG OBJECT key                             | 获取 key 的调试信息。当 key 存在时，返回有关信息；当 key 不存在时，返回一个错误。 |
| DEBUG SEGFAULT                               | 使用此命令可以让服务器崩溃。                                 |
| FLUSHALL                                     | 清空数据库中的所有键。                                       |
| FLUSHDB                                      | 清空当前数据库的所有 key。                                   |
| LASTSAVE                                     | 返回最近一次 Redis 成功将数据保存到磁盘上的时间，以 UNIX 格式表示。 |
| MONITOR                                      | 实时打印出 Redis 服务器接收到的命令。                        |
| ROLE                                         | 查看主从实例所属的角色，角色包括三种，分别是 master、slave、sentinel。 |
| SAVE                                         | 执行数据同步操作，将 Redis 数据库中的所有数据以 RDB 文件的形式保存到磁盘中。 RDB 是 Redis 中的一种数据持久化方式。 |
| SHUTDOWN [NOSAVE] [SAVE]                     | 将数据同步到磁盘后，然后关闭服务器。                         |
| SLAVEOF host port                            | 此命令用于设置主从服务器，使当前服务器转变成为指定服务器的从属服务器， 或者将其提升为主服务器(执行 SLAVEOF NO ONE 命令)。 |
| SLOWLOG subcommand [argument]                | 用来记录查询执行时间的日志系统。                             |
| SYNC                                         | 用于同步主从服务器。                                         |
| SWAPDB index index                           | 用于交换同一 Redis 服务器上的两个数据库，可以实现访问其中一个数据库的客户端连接，也可以立即访问另外一个数据库的数据。 |
| TIME                                         | 此命令用于返回当前服务器时间。                               |

## HyperLogLog

常用命令：

| 命令                                      | 说明                                    |
| ----------------------------------------- | --------------------------------------- |
| PFADD key element [element ...]           | 添加指定元素到 HyperLogLog key 中。     |
| PFCOUNT key [key ...]                     | 返回指定 HyperLogLog key 的基数估算值。 |
| PFMERGE destkey sourcekey [sourcekey ...] | 将多个 HyperLogLog key 合并为一个 key。 |

## GEO地理位置

在 Redis 3.2 版本中，新增了存储地理位置信息的功能，即 GEO（英文全称 geographic）。Redis GEO 有很多应用场景，举一个简单的例子，你一定点过外卖，或者用过打车软件，在这种 APP上会显示“店家距离你有多少米”或者“司机师傅距离你有多远”，类似这种功能就可以使用 Redis GEO 实现。数据库中存放着商家所处的经纬度，你的位置则由手机定位获取，这样 APP 就计算出了最终的距离。再比如微信中附近的人、摇一摇、实时定位等功能都依赖地理位置实现。

Redis GEO 的底层通过 Redis 有序集合（zset）实现，不过 Redis GEO 并没有与 zset 共用一套的命令，而是拥有自己的一套命令：

| 命令              | 说明                                                         |
| ----------------- | ------------------------------------------------------------ |
| GEOADD            | 将指定的地理空间位置（纬度、经度、名称）添加到指定的 key 中。 |
| GEOPOS            | 从 key 里返回所有给定位置元素的位置（即经度和纬度）          |
| GEODIST           | 返回两个地理位置间的距离，如果两个位置之间的其中一个不存在， 那么命令返回空值。 |
| GEORADIUS         | 根据给定地理位置坐标(经纬度)获取指定范围内的地理位置集合。   |
| GEORADIUSBYMEMBER | 根据给定地理位置(具体的位置元素)获取指定范围内的地理位置集合。 |
| GEOHASH           | 获取一个或者多个的地理位置的 GEOHASH 值。                    |
| ZREM              | 通过有序集合的 zrem 命令实现对地理位置信息的删除。           |
