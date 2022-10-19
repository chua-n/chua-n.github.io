## 1. Docker出现的背景

### 项目部署的问题

大型项目组件较多，运行环境也较为复杂，部署时会碰到一些问题，如依赖关系复杂易导致的兼容性问题，开发、测试、生产环境有差异。

<img src="https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/SpringCloud/IMG_0980.JPG" alt="IMG_0980" style="zoom:67%;" />

### Docker的原理

通常而言，计算机软硬件的架构是这样的：

<img src="https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/SpringCloud/IMG_0983.JPG" alt="IMG_0983" style="zoom:40%;" />

那么Docker如何解决不同系统环境的问题呢？

> <img src="https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/SpringCloud/IMG_0984.JPG" alt="IMG_0984" style="zoom:50%;" />

- Docker将用户程序与所需要调用的系统（如Ubuntu）函数库一起打包
- Docker运行到不同操作系统时，直接基于打包的库函数，借助于操作系统的Linux内核来运行

通过Docker可以解决依赖的兼容问题：

> <img src="https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/SpringCloud/IMG_0981.JPG" alt="IMG_0981" style="zoom:50%;" />

- 将应用的Libs（函数库）、Deps（依赖）、配置与应用一起打包
- 将每个应用放到一个隔离容器去运行，避免互相干扰

### Docker v.s. 虚拟机

虚拟机是在操作系统中模拟硬件设备，然后运行另一个操作系统，比如在windows系统里运行Ubuntu系统，这样就可以运行任意的Ubuntu应用了。

<img src="https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/SpringCloud/IMG_0987.JPG" alt="IMG_0988" style="zoom:40%;" />

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

<img src="https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/SpringCloud/IMG_0989.JPG" alt="IMG_0989" style="zoom:50%;" />

### 2.2 Docker和DockerHub

`DockerHub`是一个Docker镜像的托管平台，这样的平台称为Docker Registry。国内也有类似于`DockerHub`的公开服务，如网易云镜像服务、阿里云镜像库等。

<img src="https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/SpringCloud/IMG_0990.JPG" alt="IMG_0990" style="zoom:40%;" />

### 2.3 Docker架构

Docker是一个CS架构的程序，由两部分组成：

- 服务端：Docker守护进程，负责处理Docker指令，管理镜像、容器等
- 客户端：通过命令或RestAPI向Docker服务端发送指令。可以在本地或远程向服务端发送指令。

<img src="https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/SpringCloud/IMG_0991.JPG" alt="IMG_0991" style="zoom:45%;" />

### 2.4 Docker安装与启动

Docker分为CE（社区版）和EE（企业版）两大版本，CE版免费，支持周期7个月，EE强调安全，付费使用，支持周期24个月。

Docker CE 又分为`stable, test, nightly`三个更新频道。

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

## 3. Docker命令

> 以下各命令的具体参数可通过`docker COMMAND --help`来查阅官方说明，不一一列举。

### 3.1 基本信息

- `docker info [OPTIONS]`：显示 Docker 系统信息，包括镜像和容器数等
- `docker version [OPTIONS]`：显示 Docker 版本信息
- `docker inspect [OPTIONS] NAME|ID [NAME|ID...]`：获取容器/镜像的元数据
- `docker events [OPTIONS]`：从服务器获取实时事件

### 3.2 镜像

镜像名称一般分两部分组成：`[repository]:[tag]`，在没有指定tag时，默认是`latest`，即最新版本的镜像。

<img src="https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/SpringCloud/image-20211222234533061.png" alt="image-20211222234533061" style="zoom:50%;" />

镜像操作命令：

<img src="https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/SpringCloud/image-20211222234637316.png" alt="image-20211222234637316" style="zoom:30%;" />

#### 镜像仓库

- `docker login [OPTIONS] [SERVER]`：登陆到一个Docker镜像仓库，如果未指定镜像仓库地址，默认为官方仓库 Docker Hub
- `docker logout [OPTIONS] [SERVER]`：登出一个Docker镜像仓库，如果未指定镜像仓库地址，默认为官方仓库 Docker Hub
- `docker pull [OPTIONS] NAME[:TAG|@DIGEST]`：从镜像仓库中拉取或者更新指定镜像
- `docker push [OPTIONS] NAME[:TAG]`：将本地的镜像上传到镜像仓库，需要先登陆到镜像仓库
- `docker search [OPTIONS] TERM`：从 Docker Hub 查找镜像

#### 本地镜像管理

- `docker images [OPTIONS] [REPOSITORY[:TAG]]`：列出本地镜像
- `docker rmi [OPTIONS] IMAGE [IMAGE...]`：删除本地一个或多个镜像
- `docker tag [OPTIONS] IMAGE[:TAG] [REGISTRYHOST/][USERNAME/]NAME[:TAG]`：标记本地镜像，将其归入某一仓库
- `docker build [OPTIONS] PATH | URL | -`：使用 Dockerfile 创建镜像
- `docker history [OPTIONS] IMAGE`：查看指定镜像的创建历史
- `docker save [OPTIONS] IMAGE [IMAGE...]`：将指定镜像保存成 tar 压缩包
- `docker load [OPTIONS]`：从压缩包或标准输入中加载一个镜像
- `docker import [OPTIONS] file|URL|- [REPOSITORY[:TAG]]`：类似`docker load`，但

### 3.3 容器

<img src="https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/SpringCloud/IMG_1003.JPG" alt="IMG_1003" style="zoom:45%;" />

#### 容器生命周期管理

- `docker run [OPTIONS] IMAGE [COMMAND] [ARG...]`：创建一个新的容器，并在其中运行一个命令
- `docker start [OPTIONS] CONTAINER [CONTAINER...]`：启动一个或多个已经被停止的容器
- `docker stop [OPTIONS] CONTAINER [CONTAINER...]`：停止一个或多个正在运行的容器
- `docker restart [OPTIONS] CONTAINER [CONTAINER...]`：重启一个或多个容器
- `docker kill [OPTIONS] CONTAINER [CONTAINER...]`：杀掉一个或多个运行中的容器
- `docker rm [OPTIONS] CONTAINER [CONTAINER...]`：删除一个或多个容器
- `docker pause CONTAINER [CONTAINER...]`：暂停容器中所有的进程
- `docker unpause CONTAINER [CONTAINER...]`：恢复容器中所有的进程
- `docker create [OPTIONS] IMAGE [COMMAND] [ARG...]`：创建一个新的容器但不启动它，各种参数同`docker run`

#### 容器操作

- `docker ps [OPTIONS]`：列出容器（默认不加参数时只会列出正在执行的容器）
- `docker top [OPTIONS] CONTAINER [ps OPTIONS]`：查看容器中运行的进程信息，支持 ps 命令参数
- `docker exec [OPTIONS] CONTAINER COMMAND [ARG...]`：在运行的容器中执行命令
- `docker attach [OPTIONS] CONTAINER`：连接到正在运行中的容器
- `docker logs [OPTIONS] CONTAINER`：获取容器的日志
- `docker wait [OPTIONS] CONTAINER [CONTAINER...]`：阻塞运行直到容器停止，然后打印出它的退出代码
- `docker export [OPTIONS] CONTAINER`：将一个容器的文件系统导出为一个tar包，默认输出到STDOUT
- `docker port [OPTIONS] CONTAINER [PRIVATE_PORT[/PROTO]]`：列出某个容器的端口映射
- `docker stats [OPTIONS] [CONTAINER...]`：统计容器的资源使用情况，包括：CPU、内存、网络 I/O 等

#### rootfs命令

- `docker commit [OPTIONS] CONTAINER [REPOSITORY[:TAG]]`：从容器创建一个新的镜像
- `docker cp`：用于容器与主机之间的数据拷贝
  - `docker cp [OPTIONS] CONTAINER:SRC_PATH DEST_PATH|-`
  - `docker cp [OPTIONS] SRC_PATH|- CONTAINER:DEST_PATH`
- `docker diff [OPTIONS] CONTAINER`：检查容器里文件的更改

#### 示例

- 示例1：创建并运行一个Nginx容器：`docker run --name containerName -p 80:80 -d nginx`

    - `docker run` 创建并运行一个容器
    - `--name` 给容器起一个名字，比如叫做mn
    - `-p` 将宿主端口与容器端口映射，冒号左侧是宿主机端口，右侧是容器端口
    - `-d` 后台运行容器
    - `nginx` 镜像名称，如nginx

- 示例2：进入Nginx容器，修改HTML文件的内容：

    <img src="https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/SpringCloud/IMG_1006.JPG" alt="IMG_1006" style="zoom:40%;" />

### 3.4 附：Management Commands

docker 1.13 之后，为了方便命令的管理，分为了 Management Commands 和 Commands，两者其实是互通的，例如`docker system info`等价于`docker info`。通过在命令行直接输入 docker 可直观看出：

```shell
chuan@RedmiBook-2021:~$ docker

Usage:  docker [OPTIONS] COMMAND

A self-sufficient runtime for containers

Options:
      --config string      Location of client config files (default "/home/chuan/.docker")
  -c, --context string     Name of the context to use to connect to the daemon (overrides DOCKER_HOST env var and
                           default context set with "docker context use")
  -D, --debug              Enable debug mode
  -H, --host list          Daemon socket(s) to connect to
  -l, --log-level string   Set the logging level ("debug"|"info"|"warn"|"error"|"fatal") (default "info")
      --tls                Use TLS; implied by --tlsverify
      --tlscacert string   Trust certs signed only by this CA (default "/home/chuan/.docker/ca.pem")
      --tlscert string     Path to TLS certificate file (default "/home/chuan/.docker/cert.pem")
      --tlskey string      Path to TLS key file (default "/home/chuan/.docker/key.pem")
      --tlsverify          Use TLS and verify the remote
  -v, --version            Print version information and quit

Management Commands:
  app*        Docker App (Docker Inc., v0.9.1-beta3)
  builder     Manage builds
  buildx*     Docker Buildx (Docker Inc., v0.8.2-docker)
  compose*    Docker Compose (Docker Inc., v2.6.0)
  config      Manage Docker configs
  container   Manage containers
  context     Manage contexts
  image       Manage images
  manifest    Manage Docker image manifests and manifest lists
  network     Manage networks
  node        Manage Swarm nodes
  plugin      Manage plugins
  scan*       Docker Scan (Docker Inc., v0.17.0)
  secret      Manage Docker secrets
  service     Manage services
  stack       Manage Docker stacks
  swarm       Manage Swarm
  system      Manage Docker
  trust       Manage trust on Docker images
  volume      Manage volumes

Commands:
  attach      Attach local standard input, output, and error streams to a running container
  build       Build an image from a Dockerfile
  commit      Create a new image from a container's changes
  cp          Copy files/folders between a container and the local filesystem
  create      Create a new container
  diff        Inspect changes to files or directories on a container's filesystem
  events      Get real time events from the server
  exec        Run a command in a running container
  export      Export a container's filesystem as a tar archive
  history     Show the history of an image
  images      List images
  import      Import the contents from a tarball to create a filesystem image
  info        Display system-wide information
  inspect     Return low-level information on Docker objects
  kill        Kill one or more running containers
  load        Load an image from a tar archive or STDIN
  login       Log in to a Docker registry
  logout      Log out from a Docker registry
  logs        Fetch the logs of a container
  pause       Pause all processes within one or more containers
  port        List port mappings or a specific mapping for the container
  ps          List containers
  pull        Pull an image or a repository from a registry
  push        Push an image or a repository to a registry
  rename      Rename a container
  restart     Restart one or more containers
  rm          Remove one or more containers
  rmi         Remove one or more images
  run         Run a command in a new container
  save        Save one or more images to a tar archive (streamed to STDOUT by default)
  search      Search the Docker Hub for images
  start       Start one or more stopped containers
  stats       Display a live stream of container(s) resource usage statistics
  stop        Stop one or more running containers
  tag         Create a tag TARGET_IMAGE that refers to SOURCE_IMAGE
  top         Display the running processes of a container
  unpause     Unpause all processes within one or more containers
  update      Update configuration of one or more containers
  version     Show the Docker version information
  wait        Block until one or more containers stop, then print their exit codes

Run 'docker COMMAND --help' for more information on a command.

To get more help with docker, check out our guides at https://docs.docker.com/go/guides/
```

## 4. 数据卷

### 4.1 整体介绍

背景——容器与数据耦合导致的问题：

<img src="https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/SpringCloud/IMG_1007.JPG" alt="IMG_1007" style="zoom:40%;" />

数据卷（volume）是一个虚拟目录，指向宿主机文件系统中的某个目录：

<img src="https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/SpringCloud/IMG_1008.JPG" alt="IMG_1008" style="zoom:50%;" />

数据卷的作用是将容器与数据分离，解耦合，方便操作容器内数据，保证数据安全。

### 4.2 操作数据卷

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

### 4.3 挂载数据卷

我们在创建容器时，可以通过`-v`参数来挂载一个数据卷到某个容器目录：

<img src="https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/SpringCloud/image-20211223003923310.png" alt="image-20211223003923310" style="zoom:40%;" />

例如，创建并运行一个MySQL容器，将宿主机目录直接挂载到容器：

<img src="https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/SpringCloud/IMG_1012.JPG" alt="IMG_1012" style="zoom:50%;" />

数据卷挂载的方式对比：

<img src="https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/SpringCloud/IMG_1014.JPG" alt="IMG_1014" style="zoom:45%;" />

## 5. 自定义镜像：Dockerfile

镜像结构：

<img src="https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/SpringCloud/IMG_1015.JPG" alt="IMG_1015" style="zoom:40%;" />

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
|   `EXPOSE`   | 指定容器运行时监听的端口，是给镜像使用者看的 |         `EXPOSE 8080`         |
| `EXTRYPOINT` |     镜像中应用的启动命令，容器运行时调用     | `EXTRYPOINT java -jar xx.jar` |

> 更多详细语法说明，参考官方文档：https://docs.docker.com/engine/reference/builder 。

示例：

- 示例1：基于Ubuntu镜像构建一个新镜像，运行一个java项目

    <img src="https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/SpringCloud/image-20211223005014040.png" alt="image-20211223005014040" style="zoom:35%;" />

- 示例2：基于java:8-alpine镜像，将一个java项目构建为镜像

    <img src="https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/SpringCloud/image-20211223005050347.png" alt="image-20211223005050347" style="zoom:33%;" />

    <img src="https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/SpringCloud/image-20211223005125668.png" alt="image-20211223005125668" style="zoom:40%;" />

## 6. DockerCompose

Docker Compose是可以基于Compose文件帮我们快速的部署分布式应用，而无需手动一个个创建和运行容器。

Compose文件是一个文本文件，通过指令定义集群中每个容器如何运行，如：

<img src="https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/SpringCloud/image-20211223005256604.png" alt="image-20211223005256604" style="zoom:33%;" />

> <img src="https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/SpringCloud/image-20211223005331811.png" alt="image-20211223005331811" style="zoom:33%;" />

## 7. Docker镜像服务

镜像仓库（Docker Registry）有公共的和私有的两种形式：

- 公共仓库：如Docker官方的Docker Hub，国内的网易云镜像服务、DaoCloud镜像服务、阿里云镜像服务等
- 私有仓库：在本地搭建的私有镜像仓库，企业自己的镜像最好是采用私有Docker Registry来实现。