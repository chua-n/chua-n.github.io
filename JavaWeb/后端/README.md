> 本章是关于后端的知识笔记。

> 广联达计价术语：gatling, gbq

# 后端问题分析

- SSH工具
- Arthas: github.com/alibaba/arthas
- JDK、Jps...

## 服务端部署图

[img](...)

## SSH工具

- FinalShell（ssh+sftp），不能用XShell
- Secure Shell Client：老牌工具
- Putty：小巧
- CMD/Terminal

### 隧道的概念

### 常用命令

- vi, less, tar, netstat, tail, head, top, watch, nohup（放后台，一定要回）, 
- grep, find, lsof, ulimit -n, sed, awk
- curl, wget
    - wget -c 是断点续传
- tree
- tcpdump
- alias
- scp：不支持断点续传

java命令：jar, jps

- java -jar vmparra xx.jar
- nohup java -jar vmpara xx.jar > log.log &

如果只是查看文件，最好不要用vi/vim命令。

thread命令：针对高并发情况很有用。

- thread -b

### arthas定位问题

arthas可实现热编译，可只针对一个jar包中的一个类进行更换。

## Docker

docker imgages

docker ps

docker run -it ...

docker exec ...

