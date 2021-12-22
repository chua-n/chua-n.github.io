## 1. Docker出现的背景

### 项目部署的问题

大型项目组件较多，运行环境也较为复杂，部署时会碰到一些问题，如依赖关系复杂易导致的兼容性问题，开发、测试、生产环境有差异。

![IMG_0980](../../resources/images/notebooks/JavaWeb/SpringCloud/IMG_0980.JPG)

### Docker的原理

通常而言，计算机软硬件的架构是这样的：

![IMG_0983](../../resources/images/notebooks/JavaWeb/SpringCloud/IMG_0983.JPG)

那么Docker如何解决不同系统环境的问题呢？

> ![IMG_0984](../../resources/images/notebooks/JavaWeb/SpringCloud/IMG_0984.JPG)

- Docker将用户程序与所需要调用的系统（如Ubuntu）函数库一起打包
- Docker运行到不同操作系统时，直接基于打包的库函数，借助于操作系统的Linux内核来运行

通过Docker可以解决依赖的兼容问题：

> ![IMG_0981](../../resources/images/notebooks/JavaWeb/SpringCloud/IMG_0981.JPG)

- 将应用的Libs（函数库）、Deps（依赖）、配置与应用一起打包
- 将每个应用放到一个隔离容器去运行，避免互相干扰

### Docker v.s. 虚拟机

虚拟机是在操作系统中模拟硬件设备，然后运行另一个操作系统，比如在windows系统里运行Ubuntu系统，这样就可以运行任意的Ubuntu应用了。

![IMG_0988](../../resources/images/notebooks/JavaWeb/SpringCloud/IMG_0987.JPG)

### Docker的解决方案总结

Docker如何解决大型项目依赖关系复杂，不同组件依赖的兼容性问题？

- Docker允许开发中将应用、依赖、函数库、配置一起打包，形成可移植镜像
- Docker应用运行在容器中，使用沙箱机制，相互隔离

Docker如何解决开发、测试、生产环境有差异的问题？

- Docker镜像中包含完整运行环境，包括系统函数库，仅依赖系统的Linux内核，因此可以在任意Linux操作系统上运行

## 2. Docker相关概念

### 2.1 镜像和容器

- 镜像（Image）：Docker将应用程序及其所需的依赖、函数库、环境、配置等文件打包在一起，称为镜像。
- 容器（Container）：镜像中的应用程序运行后形成的进程就是容器，只是Docker会给容器做隔离，对外不可见。

> 镜像运行起来就是容器，一个镜像可以运行多个容器。

![IMG_0989](../../resources/images/notebooks/JavaWeb/SpringCloud/IMG_0989.JPG)

### 2.2 Docker和DockerHub

`DockerHub`是一个Docker镜像的托管平台，这样的平台称为Docker Registry。国内也有类似于`DockerHub`的公开服务，如网易云镜像服务、阿里云镜像库等。

![IMG_0990](../../resources/images/notebooks/JavaWeb/SpringCloud/IMG_0990.JPG)

### 2.3 Docker架构

Docker是一个CS架构的程序，由两部分组成：

- 服务端：Docker守护进程，负责处理Docker指令，管理镜像、容器等
- 客户端：通过命令或RestAPI向Docker服务端发送指令。可以在本地或远程向服务端发送指令。

![IMG_0991](../../resources/images/notebooks/JavaWeb/SpringCloud/IMG_0991.JPG)

### 2.4 Docker安装与启动

Docker分为CE（社区版）和EE（企业版）两大版本，CE版免费，支持周期7个月，EE强调安全，付费使用，支持周期24个月。

Docker CE 又分为`stale, test, nightly`三个更新频道。

docker应用需要用到各种端口，如果逐一去修改防火墙设置非常麻烦，因此可以直接关闭防火墙：

```sh
# 关闭防火墙
systemctl stop firewalld
# 禁止开机启动防止墙
systemctl disable firewalld
```

通过命令启动docker：

```sh
systemctl start docker # 启动docer服务

systemctl stop docker # 停止docker服务

systemctl restart docker # 重启docker服务
```

## 3. 镜像相关命令

镜像名称一般分两部分组成：`[repository]:[tag]`，在没有指定tag时，默认是`latest`，即最新版本的镜像。

![image-20211222234533061](../../resources/images/notebooks/JavaWeb/SpringCloud/image-20211222234533061.png)

镜像操作命令：

![image-20211222234637316](../../resources/images/notebooks/JavaWeb/SpringCloud/image-20211222234637316.png)

- `docker images`：查看镜像
- `docker rmi`：删除镜像
- `docker pull`：从服务器拉取镜像
- `docker push`：推送镜像到服务器
- `docker build`：构建镜像
- `docker save`：保存镜像为一个压缩包
- `docker load`：加载压缩包为镜像

## 4. 容器相关命令

![IMG_1003](../../resources/images/notebooks/JavaWeb/SpringCloud/IMG_1003.JPG)

- `docker run`：运行镜像
- `docker pause`：暂停镜像
- `docker unpause`：从暂停状态恢复镜像的运行
- `docker start`：
- `docker stop`：
- `docker exec`：进入容器执行命令
- `docker logs`：查看容器运行日志
- `docker ps`：查看所有运行的容器及状态
- `docker rm`：删除指定容器

### 示例

- 示例1：创建并运行一个Nginx容器：`docker run --name containerName -p 80:80 -d nginx`

    - `docker run` 创建并运行一个容器
    - `--name` 给容器起一个名字，比如叫做mn
    - `-p` 将宿舍主端口与容器端口映射，冒号左侧是宿舍机端口，右侧是容器端口
    - `-d` 后台运行容器
    - `nginx` 镜像名称，如nginx

- 示例2：进入Nginx容器，修改HTML文件的内容：

    ![IMG_1006](../../resources/images/notebooks/JavaWeb/SpringCloud/IMG_1006.JPG)

## 5. 数据卷

### 5.1 整体介绍

背景——容器与数据耦合导致的问题：

![IMG_1007](../../resources/images/notebooks/JavaWeb/SpringCloud/IMG_1007.JPG)

数据卷（volume）是一个虚拟目录，指向宿舍机文件系统中的某个目录：

![IMG_1008](../../resources/images/notebooks/JavaWeb/SpringCloud/IMG_1008.JPG)

数据卷的作用是将容器与数据分离，解耦合，方便操作容器内数据，保证数据安全。

### 5.2 操作数据卷

数据卷操作的基本语法如下：

```sh
docker volume [COMMAND]
```

docker volume命令是数据卷操作，根据命令后跟随的command来确定下一步的操作：

- `create`：创建一个volume
- `inspect`：显示一个或多个volume的信息
- `ls`：列出所有的volume
- `prune`：删除未使用的volume
- `rm`：删除一个或多个指定的volume

### 5.3 挂载数据卷

我们在创建容器时，可以通过`-v`参数来挂载一个数据卷到某个容器目录：

![image-20211223003923310](../../resources/images/notebooks/JavaWeb/SpringCloud/image-20211223003923310.png)

例如，创建并运行一个MySQL容器，将宿主机目录直接挂载到容器：

![IMG_1012](../../resources/images/notebooks/JavaWeb/SpringCloud/IMG_1012.JPG)

数据卷挂载的方式对比：

![IMG_1014](../../resources/images/notebooks/JavaWeb/SpringCloud/IMG_1014.JPG)

## 6. 自定义镜像：Dockerfile

镜像结构：

![IMG_1015](../../resources/images/notebooks/JavaWeb/SpringCloud/IMG_1015.JPG)

镜像是分层结构，每一层称为一个layer：

- BaseImage层：包含基本的系统函数库、环境变量、文件系统
- Entrypoint：入口，是镜像中应用启动的命令
- 其他：在BaseImage基础上添加依赖、安装程序、完成整个应用的安装和配置

`Dockerfile`就是一个文本文件，其他包含一个个的指令（Instruction），用指令来说明要执行什么操作来构建镜像，每一个指令都会形成一层Layer：

|     指令     |                     说明                     |             示例              |
| :----------: | :------------------------------------------: | :---------------------------: |
|    `FROM`    |                 指定基础镜像                 |        `FROM centos:6`        |
|    `ENV`     |        设置环境变量，可在后面指令使用        |        `ENV key value`        |
|    `COPY`    |         拷贝本地文件到镜像的指定目录         |  `COPY ./mysql-5.7.rpm /tmp`  |
|    `RUN`     |  执行Linux的shell命令，一般是安装过程的命令  |     `RUN yum install gcc`     |
|   `EXPOSE`   | 指定容器运行时监听的商品，是给镜像使用者看的 |         `EXPOSE 8080`         |
| `EXTRYPOINT` |     镜像中应用的启动命令，容器运行时调用     | `EXTRYPOINT java -jar xx.jar` |

> 更多详细语法说明，参考官方文档：https://docs.docker.com/engine/reference/builder 。

示例：

- 示例1：基于Ubuntu镜像构建一个新镜像，运行一个java项目

    ![image-20211223005014040](../../resources/images/notebooks/JavaWeb/SpringCloud/image-20211223005014040.png)

- 示例2：基于java:8-alpine镜像，将一个java项目构建为镜像

    ![image-20211223005050347](../../resources/images/notebooks/JavaWeb/SpringCloud/image-20211223005050347.png)

    ![image-20211223005125668](../../resources/images/notebooks/JavaWeb/SpringCloud/image-20211223005125668.png)

## 7. DockerCompose

Docker Compose是可以基于Compose文件帮我们快速的部署分布式应用，而无需手动一个个创建和运行容器。

Compose文件是一个文本文件，通过指令定义集群中每个容器如何运行，如：

![image-20211223005256604](../../resources/images/notebooks/JavaWeb/SpringCloud/image-20211223005256604.png)

> ![image-20211223005331811](../../resources/images/notebooks/JavaWeb/SpringCloud/image-20211223005331811.png)

## 8. Docker镜像服务

镜像仓库（Docker Registry）有公共的和私有的两种形式：

- 公共仓库：如Docker官方的Docker Hub，国内的网易云镜像服务、DaoCloud镜像服务、阿里云镜像服务等
- 私有仓库：在本地搭建的私有镜像仓库，企业自己的镜像最好是采用私有Docker Registry来实现。