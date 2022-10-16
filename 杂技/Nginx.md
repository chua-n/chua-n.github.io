## nginx简介

### 正向/反向代理

### 负载均衡

### 动静分离

## nginx命令

通常在nginx的安装目录`cd /usr/local/nginx`中执行，常用命令如下：

| 命令                | 说明              |
| ------------------- | ----------------- |
| `./nginx -v`        | 查看 nginx 版本号 |
| `./nginx`           | 启动 nginx        |
| `./nginx -s stop`   | 关闭 nginx        |
| `./nginx -s reload` | 重新加载 nginx    |

## nginx配置文件

配置文件的路径：`/usr/local/nginx/conf/nginx.conf`

nginx配置文件由三大块组成：

- 全局块
- events块
- http块
    - http全局块
    - server块


## 反射代理

## 负载均衡

nginx 分配服务器策略：

- 轮询（默认选项）
- 权重：默认权重为1
- IP哈希
- fair（第三方）

## 动静分离

严格来说，nginx的动静分离指的是将动态请求和静态请求分开。动静分离从目前实现角度来讲大致分为两种：

- 一种是纯粹把静态文件独立成单独的域名，放在独立的服务器上，也是目前主流推崇的方案；
- 另一种是动态跟静态文件混合在一起发布，通过nginx来分开

## nginx高可用（集群？）

## nginx原理解析

> nginx同redis类似都采用了io多路复用机制......
