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

