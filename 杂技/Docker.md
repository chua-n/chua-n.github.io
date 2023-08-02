## 0. 容器技术

> 此节可详见[容器技术概念详解_Docker 入门教程-慕课网 (imooc.com)](https://www.imooc.com/wiki/dockerlesson/containertechnology.html)。

### 容器技术的实质

假定我们编写了一个批量运算加法的程序，这个程序的输入需要从一个文件 A 中读取，处理结果保存到另一个文件 B 中。当操作系统执行这个加法程序时，操作系统会根据程序的指引，从文件 A 中读取数据，保存到内存里，然后执行加法指令，CPU 与内存协作，完成了运算，将结果保存到 B 中。

在程序的运行过程中，计算机内存的数据，CPU 寄存器里的数据，内存堆栈中的指令，读取写入的文件，以及运行过程中计算机的状态，这些信息的集合，就是进程。

对于进程来说，它的静止态就是一个二进制可执行文件，它的运行态就是与它相关的计算机数据和状态的总和。而子进程的所有资源都继承父进程，只要控制住父进程的资源，通过父进程衍生的子进程也会被控制。

所以，简单来说容器技术的实质就是：**通过各种手段，修改、约束一个“容器”进程的运行状态，按照用户的意图“误导”它能看到的资源，控制它的边界，从而达到环境隔离，或者说虚拟化的目的**。

### Namespace与CGroupf

> 容器技术的核心有两个：Namespace 和 Cgroup，详见 [Namespace_Docker 入门教程](https://www.imooc.com/wiki/dockerlesson/namespace.html) 与 [CGroup_Docker 入门教程](https://www.imooc.com/wiki/dockerlesson/cgroup.html)。

### rootfs

> 参见 [rootfs 与容器技术_Docker 入门教程-慕课网 (imooc.com)](https://www.imooc.com/wiki/dockerlesson/rootfs.html) 。

## 1. Docker出现的背景

### 1.1 项目部署的问题

大型项目组件较多，运行环境也较为复杂，部署时会碰到一些问题，如依赖关系复杂易导致的兼容性问题，开发、测试、生产环境有差异。

<img src="https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/SpringCloud/IMG_0980.JPG" alt="IMG_0980" style="zoom:67%;" />

### 1.2 Docker的原理

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

### 1.3 Docker v.s. 虚拟机

虚拟机是在操作系统中模拟硬件设备，然后运行另一个操作系统，比如在windows系统里运行Ubuntu系统，这样就可以运行任意的Ubuntu应用了。

<img src="https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/SpringCloud/IMG_0987.JPG" alt="IMG_0988" style="zoom:40%;" />

### 1.4 Docker的解决方案总结

Docker如何解决大型项目依赖关系复杂，不同组件依赖的兼容性问题？

- Docker允许开发中将应用、依赖、函数库、配置一起打包，形成可移植镜像
- Docker应用运行在容器中，使用沙箱机制，相互隔离

Docker如何解决开发、测试、生产环境有差异的问题？

- Docker镜像中包含完整运行环境，包括系统函数库，仅依赖系统的Linux内核，因此可以在任意Linux操作系统上运行

## 2. Docker相关概念

### 2.1 镜像

镜像（Image）：Docker将应用程序及其所需的依赖、函数库、环境、配置等文件打包在一起，称为镜像，镜像是容器的只读模板，其不包含任何动态数据，其内容在构建之后也不会被改变。

- 镜像是一个分层存储的架构，由多层（Layer）文件系统联合组成；

- 镜像构建时，会一层层构建，前一层是后一层的基础；

  > 从下载过程中的命令行输出也可以看出，镜像是由多层存储所构成，下载也是一层层的去下载，并非单一文件。下载过程中给出了每一层的 ID 的前 12 位，并且下载结束后，给出该镜像完整的 sha256 的摘要，以确保下载一致性；

- 镜像层依赖于一系列的底层技术，比如文件系统、写时复制（copy-on-write）、联合挂载（union mounts）等。

  | <img src="../resources/images/notebook/JavaWeb/SpringCloud/v2-d5c06c456761b5a27090e3328b1f6882_r.jpg" alt="img" style="zoom:67%;" /> | <img src="../resources/images/notebook/JavaWeb/SpringCloud/image-20230213222923702.png" alt="image-20230213222923702" style="zoom:67%;" /> |
  | ------------------------------------------------------------ | ------------------------------------------------------------ |

通过 `docker history IMAGE` 命令可以查看到镜像中各层的内容及大小，每层会对应 `Dockerfile` 中的一条指令。例如，

```bash
chuan@RedmiBook-2021:~$ docker history redis
IMAGE          CREATED         CREATED BY                                      SIZE      COMMENT
7614ae9453d1   13 months ago   /bin/sh -c #(nop)  CMD ["redis-server"]         0B
<missing>      13 months ago   /bin/sh -c #(nop)  EXPOSE 6379                  0B
<missing>      13 months ago   /bin/sh -c #(nop)  ENTRYPOINT ["docker-entry…   0B
<missing>      13 months ago   /bin/sh -c #(nop) COPY file:df205a0ef6e6df89…   374B
<missing>      13 months ago   /bin/sh -c #(nop) WORKDIR /data                 0B
<missing>      13 months ago   /bin/sh -c #(nop)  VOLUME [/data]               0B
<missing>      13 months ago   /bin/sh -c mkdir /data && chown redis:redis …   0B
<missing>      13 months ago   /bin/sh -c set -eux;   savedAptMark="$(apt-m…   27.8MB
<missing>      13 months ago   /bin/sh -c #(nop)  ENV REDIS_DOWNLOAD_SHA=5b…   0B
<missing>      13 months ago   /bin/sh -c #(nop)  ENV REDIS_DOWNLOAD_URL=ht…   0B
<missing>      13 months ago   /bin/sh -c #(nop)  ENV REDIS_VERSION=6.2.6      0B
<missing>      13 months ago   /bin/sh -c set -eux;  savedAptMark="$(apt-ma…   4.24MB
<missing>      13 months ago   /bin/sh -c #(nop)  ENV GOSU_VERSION=1.12        0B
<missing>      13 months ago   /bin/sh -c groupadd -r -g 999 redis && usera…   329kB
<missing>      13 months ago   /bin/sh -c #(nop)  CMD ["bash"]                 0B
<missing>      13 months ago   /bin/sh -c #(nop) ADD file:09675d11695f65c55…   80.4MB
```

由于 Docker 镜像是多层存储结构，并且可以继承、复用，因此不同镜像可能会因为使用相同的基础镜像，从而拥有共同的层。由于 Docker 使用 Union FS，相同的层只需要保存一份即可，因此实际镜像硬盘占用空间很可能要比这个镜像层列表大小的总和要小的多。

在删除镜像时，对于镜像中的多个镜像层，也是从上层向基础层方向依次进行删除判断。由于镜像的多层结构让镜像复用变得非常容易，因此在删除镜像时很有可能某个其它镜像正依赖于当前镜像的某一层，这种情况下不会触发删除该层的行为。直到没有任何层依赖当前层时，才会真实的删除当前层。

### 2.2 容器

容器（Container）：镜像中的应用程序运行后形成的进程就是容器，只是Docker会给容器做隔离，对外不可见。

> 镜像运行起来就是容器，一个镜像可以运行多个容器。

<img src="https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/SpringCloud/IMG_0989.JPG" alt="IMG_0989" style="zoom:50%;" />



### 2.3 Docker和DockerHub

`DockerHub`是一个Docker镜像的托管平台，这样的平台称为Docker Registry。国内也有类似于`DockerHub`的公开服务，如网易云镜像服务、阿里云镜像库等。

<img src="https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/SpringCloud/IMG_0990.JPG" alt="IMG_0990" style="zoom:40%;" />

### 2.4 Docker架构

Docker是一个CS架构的程序，由两部分组成：

- 服务端：Docker守护进程，负责处理Docker指令，管理镜像、容器等
- 客户端：通过命令或RestAPI向Docker服务端发送指令。可以在本地或远程向服务端发送指令。

<img src="https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/SpringCloud/IMG_0991.JPG" alt="IMG_0991" style="zoom:45%;" />

### 2.5 Docker安装与启动

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

<img src="../resources/images/notebook/JavaWeb/SpringCloud/v2-820aee2a33654099d87cdd2b7a1ce741_r.jpg" alt="img" style="zoom:67%;" />

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
- `docker save [OPTIONS] IMAGE [IMAGE...]`：将指定镜像保存成 tar 压缩包，会保留该镜像所有的元信息及历史记录
- `docker load [OPTIONS]`：从压缩包或标准输入中加载一个镜像，会保留该镜像所有的元信息及历史记录
- `docker import [OPTIONS] file|URL|- [REPOSITORY[:TAG]]`：类似`docker load`，但丢失所有元数据及历史记录
- `docker image prune -af --filter "until=240h"`

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

容器是否会长久运行，是和 `docker run` 指定的命令有关，即容器内是否有前台进程在运行，和 `-d` 参数无关。例如通过 `-d` 参数后台运行 `centos` 镜像，容器创建完成后将退出。而通过 `-it` 分配一个伪终端后，容器内将有一个 bash 终端守护容器，容器便不会退出：

<img src="../resources/images/notebook/JavaWeb/SpringCloud/856154-20190923233721960-1995535823.png" alt="img" style="zoom:50%;" />

#### 容器操作

- `docker ps [OPTIONS]`：列出容器（默认不加参数时只会列出正在执行的容器）
- `docker top [OPTIONS] CONTAINER [ps OPTIONS]`：查看容器中运行的进程信息，支持 ps 命令参数
- `docker exec [OPTIONS] CONTAINER COMMAND [ARG...]`：在运行的容器中执行命令
- `docker attach [OPTIONS] CONTAINER`：连接到正在运行中的容器
- `docker logs [OPTIONS] CONTAINER`：获取容器的日志
- `docker wait [OPTIONS] CONTAINER [CONTAINER...]`：阻塞运行直到容器停止，然后打印出它的退出代码
- `docker export [OPTIONS] CONTAINER`：将一个容器的文件系统导出为一个tar包，默认输出到STDOUT，舍弃所有元信息及历史记录
- `docker port [OPTIONS] CONTAINER [PRIVATE_PORT[/PROTO]]`：列出某个容器的端口映射
- `docker stats [OPTIONS] [CONTAINER...]`：统计容器的资源使用情况，包括：CPU、内存、网络 I/O 等

一条命令快速实现停用并删除所有容器：

```shell
docker stop $(docker ps -q) & docker rm $(docker ps -aq)
```

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

## 5. 容器网络

### 5.1 网络模式

docker 容器在启动时可以通过`--net`参数指定五种网络模式：

- `bridge`：默认情况，docker 启动后会创建一个 `docker0` 网桥，docker 默认创建的容器会添加到这个网桥中。通过`ifconfig`命令可以看出这一效果：

  - 启动 docker 前后：

    ```bash
    chuan@RedmiBook-2021:~$ ifconfig
    eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
            inet 172.31.165.213  netmask 255.255.240.0  broadcast 172.31.175.255
            inet6 fe80::215:5dff:feec:e946  prefixlen 64  scopeid 0x20<link>
            ether 00:15:5d:ec:e9:46  txqueuelen 1000  (Ethernet)
            RX packets 1  bytes 217 (217.0 B)
            RX errors 0  dropped 0  overruns 0  frame 0
            TX packets 7  bytes 586 (586.0 B)
            TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
    
    lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
            inet 127.0.0.1  netmask 255.0.0.0
            inet6 ::1  prefixlen 128  scopeid 0x10<host>
            loop  txqueuelen 1000  (Local Loopback)
            RX packets 0  bytes 0 (0.0 B)
            RX errors 0  dropped 0  overruns 0  frame 0
            TX packets 0  bytes 0 (0.0 B)
            TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
    
    chuan@RedmiBook-2021:~$ sudo service docker start
    [sudo] password for chuan:
     * Starting Docker: docker                                                                                       [ OK ]
    chuan@RedmiBook-2021:~$ ifconfig
    docker0: flags=4099<UP,BROADCAST,MULTICAST>  mtu 1500
            inet 172.17.0.1  netmask 255.255.0.0  broadcast 172.17.255.255
            ether 02:42:99:30:65:41  txqueuelen 0  (Ethernet)
            RX packets 0  bytes 0 (0.0 B)
            RX errors 0  dropped 0  overruns 0  frame 0
            TX packets 0  bytes 0 (0.0 B)
            TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
    
    eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
            inet 172.31.165.213  netmask 255.255.240.0  broadcast 172.31.175.255
            inet6 fe80::215:5dff:feec:e946  prefixlen 64  scopeid 0x20<link>
            ether 00:15:5d:ec:e9:46  txqueuelen 1000  (Ethernet)
            RX packets 4  bytes 868 (868.0 B)
            RX errors 0  dropped 0  overruns 0  frame 0
            TX packets 8  bytes 656 (656.0 B)
            TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
    
    lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
            inet 127.0.0.1  netmask 255.0.0.0
            inet6 ::1  prefixlen 128  scopeid 0x10<host>
            loop  txqueuelen 1000  (Local Loopback)
            RX packets 0  bytes 0 (0.0 B)
            RX errors 0  dropped 0  overruns 0  frame 0
            TX packets 0  bytes 0 (0.0 B)
            TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
    
    chuan@RedmiBook-2021:~$
    ```

  - 容器内查看网络配置，可以看到会默认分配一个 `docker0` 的内网IP：

    <img src="../resources/images/notebook/JavaWeb/SpringCloud/856154-20191006221712371-558945729.png" alt="img" style="zoom:67%;" />

- `host`：容器不会获得一个独立的 network namespace，而是与主机共用一个。这就意味着容器不会有自己的网卡信息，而是使用宿主机的，容器除了网络，其它都是隔离的。

  - 可以看到 host 网络模式下，容器网络配置与宿主机是一样的，那么容器内应用的端口将占用宿主机的端口：

    <img src="../resources/images/notebook/JavaWeb/SpringCloud/856154-20191006222034377-323969518.png" alt="img" style="zoom:67%;" />

- `none`：获取独立的 network namespace，但不为容器进行任何网络配置，需要我们手动配置。这种模式应用场景比较少。

  <img src="../resources/images/notebook/JavaWeb/SpringCloud/856154-20191006222522643-1364582786.png" alt="img" style="zoom:67%;" />

- `container:<CONTAINER NAME/ID>`：与指定的容器使用同一个 network namespace，具有同样的网络配置信息，两个容器除了网络，其它都是隔离的。

  - 创建容器，并映射 9090 端口到容器的 80 端口，进入容器内，通过 `netstat -antp` 可以看到没有端口连接信息：

    <img src="../resources/images/notebook/JavaWeb/SpringCloud/856154-20191006223802000-1773597709.png" alt="img" style="zoom:67%;" />

  - 创建 `nginx` 容器，并使用 `net_container` 容器的网络。可以看到 `net_container` 容器内已经在监听 `nginx` 的80端口了，而且通过映射的 9090 端口可以访问到 `nginx` 服务：

    <img src="../resources/images/notebook/JavaWeb/SpringCloud/856154-20191006224235577-1982026757.png" alt="img" style="zoom:67%;" />

- 自定义网络：与默认的bridge原理一样，但自定义网络具备内部DNS发现，可以通过容器名或者主机名进行容器之间网络通信。

  - 首先创建一个自定义网络

  - 创建两个容器并加入到自定义网络，在容器中就可以互相连通

    <img src="../resources/images/notebook/JavaWeb/SpringCloud/856154-20191007123036413-300458064.png" alt="img" style="zoom:67%;" />

### 5.2 容器网络访问原理

当 Docker 启动时，会自动在主机上创建一个 docker0 虚拟网桥（其上有一个 docker0 内部接口），实际上是Linux 的一个 bridge，可以理解为一个软件交换机。它在内核层连通了其他的物理或虚拟网卡，这就将所有容器和本地主机都放到同一个物理网络。

- 每次创建一个新容器的时候，Docker 从可用的地址段中选择一个空闲的 IP 地址分配给容器的 eth0 端口，使用本地主机上 docker0 接口的 IP 作为所有容器的默认网关。
- 当创建一个 Docker 容器的时候，同时会创建一对 veth pair 接口（当数据包发送到一个接口时，另外一个接口也可以收到相同的数据包）。这对接口一端在容器内，即 eth0 ；另一端在本地并被挂载到 docker0 网桥，名称以 veth 开头。通过这种方式，主机可以跟容器通信，容器之间也可以相互通信。Docker 就创建了在主机和所有容器之间的一个虚拟共享网络。

| <img src="../resources/images/notebook/JavaWeb/SpringCloud/856154-20191007124456783-38819526.png" alt="img" style="zoom:80%;" /> | <img src="../resources/images/notebook/JavaWeb/SpringCloud/856154-20191007125216709-1729870172.png" alt="img" style="zoom:80%;" /> |
| ------------------------------------------------------------ | ------------------------------------------------------------ |

## 6. Dockerfile

> 通过Dockerfile可以构建自定义镜像。

### 6.1 镜像结构与Dockerfile

镜像结构：

<img src="https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/SpringCloud/IMG_1015.JPG" alt="IMG_1015" style="zoom:40%;" />

镜像是分层结构，每一层称为一个layer：

- BaseImage层：包含基本的系统函数库、环境变量、文件系统
- Entrypoint：入口，是镜像中应用启动的命令
- 其他：在BaseImage基础上添加依赖、安装程序、完成整个应用的安装和配置

`Dockerfile`就是一个文本文件，其他包含一个个的指令（Instruction），用指令来说明要执行什么操作来构建镜像，*每一个指令都会形成一层Layer*，因此每一条指令的内容，就是描述该层应当如何构建。

|     指令      |                           说明                           |             示例              |
| :-----------: | :------------------------------------------------------: | :---------------------------: |
|    `FROM`     |      指定基础镜像，必须是 `Dockerfile` 的第一条指令      |        `FROM centos:6`        |
|     `ENV`     |              设置环境变量，可在后面指令使用              |        `ENV key value`        |
|    `COPY`     |               拷贝本地文件到镜像的指定目录               |  `COPY ./mysql-5.7.rpm /tmp`  |
|     `RUN`     |        执行Linux的shell命令，一般是安装过程的命令        |     `RUN yum install gcc`     |
|   `EXPOSE`    |       指定容器运行时监听的端口，是给镜像使用者看的       |         `EXPOSE 8080`         |
| `EXTRYPOINT`  |           镜像中应用的启动命令，容器运行时调用           | `EXTRYPOINT java -jar xx.jar` |
|    `USER`     | 切换到指定用户，这个用户必须是事先建立好的，否则无法切换 |                               |
| `HEALTHCHECK` |                                                          |                               |
|   `WORKDIR`   |                                                          |                               |
|   `VOLUME`    |                                                          |                               |
|     `CMD`     |              指定默认的容器主进程的启动命令              |                               |
|      ...      |                           ...                            |              ...              |

> 更多详细语法说明，参考官方文档：https://docs.docker.com/engine/reference/builder 。

### 6.2 FROM 指定基础镜像

所谓定制镜像，那一定是以一个镜像为基础，在其上进行定制。而 `FROM` 就是指定**基础镜像**，因此一个 `Dockerfile` 中 `FROM` 是必备的指令，并且必须是第一条指令。

在 [Docker Hub](https://hub.docker.com/search?q=&type=image&image_filter=official) 上有非常多的高质量的官方镜像，有可以直接拿来使用的服务类的镜像，如 [`nginx`](https://hub.docker.com/_/nginx/)、[`redis`](https://hub.docker.com/_/redis/)、[`mongo`](https://hub.docker.com/_/mongo/)、[`mysql`](https://hub.docker.com/_/mysql/)、[`httpd`](https://hub.docker.com/_/httpd/)、[`php`](https://hub.docker.com/_/php/)、[`tomcat`](https://hub.docker.com/_/tomcat/) 等；也有一些方便开发、构建、运行各种语言应用的镜像，如 [`node`](https://hub.docker.com/_/node)、[`openjdk`](https://hub.docker.com/_/openjdk/)、[`python`](https://hub.docker.com/_/python/)、[`ruby`](https://hub.docker.com/_/ruby/)、[`golang`](https://hub.docker.com/_/golang/) 等。可以在其中寻找一个最符合我们最终目标的镜像为基础镜像进行定制。

如果没有找到对应服务的镜像，官方镜像中还提供了一些更为基础的操作系统镜像，如 [`ubuntu`](https://hub.docker.com/_/ubuntu/)、[`debian`](https://hub.docker.com/_/debian/)、[`centos`](https://hub.docker.com/_/centos/)、[`fedora`](https://hub.docker.com/_/fedora/)、[`alpine`](https://hub.docker.com/_/alpine/) 等，这些操作系统的软件库为我们提供了更广阔的扩展空间。

除了选择现有镜像为基础镜像外，Docker 还存在一个特殊的镜像，名为 `scratch`，这个镜像是虚拟的概念，并不实际存在，它表示一个空白的镜像。

```dockerfile
FROM scratch
...
```

如果你以 `scratch` 为基础镜像的话，意味着你不以任何镜像为基础，接下来所写的指令将作为镜像第一层开始存在。

不以任何系统为基础，直接将可执行文件复制进镜像的做法并不罕见，对于 Linux 下静态编译的程序来说，并不需要有操作系统提供运行时支持，所需的一切库都已经在可执行文件里了，因此直接 `FROM scratch` 会让镜像体积更加小巧。使用 [Go 语言](https://golang.google.cn/) 开发的应用很多会使用这种方式来制作镜像，这也是为什么有人认为 Go 是特别适合容器微服务架构的语言的原因之一。

### 6.3 RUN 执行命令

`RUN` 指令是用来执行命令行命令的。由于命令行的强大能力，`RUN` 指令在定制镜像时是最常用的指令之一。其格式有两种：

- *shell* 格式：`RUN <命令>`，就像直接在命令行中输入的命令一样。刚才写的 Dockerfile 中的 `RUN` 指令就是这种格式。

  ```dockerfile
  RUN echo '<h1>Hello, Docker!</h1>' > /usr/share/nginx/html/index.html
  ```

- *exec* 格式：`RUN ["可执行文件", "参数1", "参数2"]`，这更像是函数调用中的格式。

既然 `RUN` 就像 Shell 脚本一样可以执行命令，那么我们是否就可以像 Shell 脚本一样把每个命令对应一个 `RUN` 呢？比如这样：

```docker
FROM debian:stretch

RUN apt-get update
RUN apt-get install -y gcc libc6-dev make wget
RUN wget -O redis.tar.gz "http://download.redis.io/releases/redis-5.0.3.tar.gz"
RUN mkdir -p /usr/src/redis
RUN tar -xzf redis.tar.gz -C /usr/src/redis --strip-components=1
RUN make -C /usr/src/redis
RUN make -C /usr/src/redis install
```

之前说过，Dockerfile 中每一个指令都会建立一层，`RUN` 也不例外。每一个 `RUN` 的行为会新建立一层 layer，在其上执行这些命令，执行结束后，`commit` 这一层的修改，构成新的镜像。因此，上面的这种写法，实际创建了 7 层镜像，这是完全没有意义的。而且很多运行时不需要的东西，都被装进了镜像里，比如编译环境、更新的软件包等等。结果就是产生非常臃肿、非常多层的镜像，不仅仅增加了构建部署的时间，也很容易出错。 这是很多初学 Docker 的人常犯的一个错误。

> Union FS 是有最大层数限制的，比如 AUFS，曾经是最大不得超过 42 层，现在是不得超过 127 层。

上面的 `Dockerfile` 正确的写法应该是这样：

```docker
FROM debian:stretch

RUN set -x; buildDeps='gcc libc6-dev make wget' \
    && apt-get update \
    && apt-get install -y $buildDeps \
    && wget -O redis.tar.gz "http://download.redis.io/releases/redis-5.0.3.tar.gz" \
    && mkdir -p /usr/src/redis \
    && tar -xzf redis.tar.gz -C /usr/src/redis --strip-components=1 \
    && make -C /usr/src/redis \
    && make -C /usr/src/redis install \
    && rm -rf /var/lib/apt/lists/* \
    && rm redis.tar.gz \
    && rm -r /usr/src/redis \
    && apt-get purge -y --auto-remove $buildDeps
```

- 首先，之前所有的命令只有一个目的，就是编译、安装 redis 可执行文件。因此没有必要建立很多层，这只是一层的事情。因此，这里没有使用很多个 `RUN` 一一对应不同的命令，而是仅仅使用一个 `RUN` 指令，并使用 `&&` 将各个所需命令串联起来。将之前的 7 层，简化为了 1 层。在撰写 Dockerfile 的时候，要经常提醒自己，这并不是在写 Shell 脚本，而是在定义每一层该如何构建。

- 并且，这里为了格式化还进行了换行。Dockerfile 支持 Shell 类的行尾添加 `\` 的命令换行方式，以及行首 `#` 进行注释的格式。良好的格式，比如换行、缩进、注释等，会让维护、排障更为容易，这是一个比较好的习惯。

- 此外，还可以看到这一组命令的最后添加了清理工作的命令，删除了为了编译构建所需要的软件，清理了所有下载、展开的文件，并且还清理了 `apt` 缓存文件。这是很重要的一步，我们之前说过，镜像是多层存储，每一层的东西并不会在下一层被删除，会一直跟随着镜像。因此镜像构建时，一定要确保每一层只添加真正需要添加的东西，任何无关的东西都应该清理掉。

  > 很多人初学 Docker 制作出了很臃肿的镜像的原因之一，就是忘记了每一层构建的最后一定要清理掉无关文件。

### 6.4 镜像构建上下文

以下面的 Dockerfile 为例进行阐释，从命令的输出结果中，我们可以清晰的看到镜像的构建过程。在 `Step 2` 中，如同我们之前所说的那样，`RUN` 指令启动了一个容器 `9cdc27646c7b`，执行了所要求的命令，并最后提交了这一层 `44aa4490ce2c`，随后删除了所用到的这个容器 `9cdc27646c7b`。

```bash
$ docker build -t nginx:v3 .
Sending build context to Docker daemon 2.048 kB
Step 1 : FROM nginx
 ---> e43d811ce2f4
Step 2 : RUN echo '<h1>Hello, Docker!</h1>' > /usr/share/nginx/html/index.html
 ---> Running in 9cdc27646c7b
 ---> 44aa4490ce2c
Removing intermediate container 9cdc27646c7b
Successfully built 44aa4490ce2c
```

这里我们使用了 `docker build` 命令进行镜像构建。其格式为 `docker build [选项] <上下文路径/URL/->`，在这里的 `-t nginx:v3` 意思是我们指定了最终镜像的名称。

但注意，`docker build` 命令最后有一个 `.`。`.` 表示当前目录，而 `Dockerfile` 就在当前目录，因此不少初学者以为这个路径是在指定 `Dockerfile` 所在路径，这么理解其实是不准确的。对应上面的命令格式，这其实是在指定**上下文路径**。那么什么是上下文呢？

首先我们要理解 `docker build` 的工作原理。Docker 在运行时分为 Docker 引擎（也就是服务端守护进程）和客户端工具。Docker 的引擎提供了一组 REST API，被称为 [Docker Remote API](https://docs.docker.com/develop/sdk/)，而如 `docker` 命令这样的客户端工具，则是通过这组 API 与 Docker 引擎交互，从而完成各种功能。因此，虽然表面上我们好像是在本机执行各种 `docker` 功能，但实际上，一切都是使用的远程调用形式在服务端（Docker 引擎）完成。也因为这种 C/S 设计，让我们操作远程服务器的 Docker 引擎变得轻而易举。

当我们进行镜像构建的时候，并非所有定制都会通过 `RUN` 指令完成，经常会需要将一些本地文件复制进镜像，比如通过 `COPY` 指令、`ADD` 指令等。而 `docker build` 命令构建镜像，其实并非在本地构建，而是在服务端，也就是 Docker 引擎中构建的。那么在这种客户端/服务端的架构中，如何才能让服务端获得本地文件呢？

这就引入了**上下文**的概念。当构建的时候，用户会指定构建镜像上下文的路径，`docker build` 命令得知这个路径后，会将路径下的所有内容打包，然后上传给 Docker 引擎。这样 Docker 引擎收到这个上下文包后，展开就会获得构建镜像所需的一切文件。

因此，如果在 `Dockerfile` 中这么写 `COPY ./package.json /app/`，这并不是要复制执行 `docker build` 命令所在的目录下的 `package.json`，也不是复制 `Dockerfile` 所在目录下的 `package.json`，而是复制*上下文（context）*目录下的 `package.json`。

也是如此，`COPY` 这类指令中的源文件的路径都是*相对路径*。这也是初学者经常会问的为什么 `COPY ../package.json /app` 或者 `COPY /opt/xxxx /app` 无法工作的原因，因为这些路径已经超出了上下文的范围，Docker 引擎无法获得这些位置的文件。如果真的需要那些文件，应该将它们复制到上下文目录中去。现在就可以理解刚才的命令 `docker build -t nginx:v3 .` 中的这个 `.`，实际上是在指定上下文的目录，`docker build` 命令会将该目录下的内容打包交给 Docker 引擎以帮助构建镜像。

如果观察 `docker build` 输出，我们其实已经看到了这个发送上下文的过程：

```bash
$ docker build -t nginx:v3 .
Sending build context to Docker daemon 2.048 kB
...
```

理解构建上下文对于镜像构建是很重要的，避免犯一些不应该的错误。比如有些初学者在发现 `COPY /opt/xxxx /app` 不工作后，于是干脆将 `Dockerfile` 放到了硬盘根目录去构建，结果发现 `docker build` 执行后，在发送一个几十 GB 的东西，极为缓慢而且很容易构建失败。那是因为这种做法是在让 `docker build` 打包整个硬盘，这显然是使用错误。

一般来说，应该会将 `Dockerfile` 置于一个空目录下，或者项目根目录下。如果该目录下没有所需文件，那么应该把所需文件复制一份过来。如果目录下有些东西确实不希望构建时传给 Docker 引擎，那么可以用 `.gitignore` 一样的语法写一个 `.dockerignore`，该文件是用于剔除不需要作为上下文传递给 Docker 引擎的。

那么为什么会有人误以为 `.` 是指定 `Dockerfile` 所在目录呢？这是因为在默认情况下，如果不额外指定 `Dockerfile` 的话，会将上下文目录下的名为 `Dockerfile` 的文件作为 Dockerfile。这只是默认行为，实际上 `Dockerfile` 的文件名并不要求必须为 `Dockerfile`，而且并不要求必须位于上下文目录中，比如可以用 `-f ../Dockerfile.php` 参数指定某个文件作为 `Dockerfile`。当然，一般大家习惯性的会使用默认的文件名 `Dockerfile`，以及会将其置于镜像构建上下文目录中。

### 6.5 多阶段构建

把一个镜像有构建过程分散到多个 Dockerfile 中......

### 6.6 示例

- 示例1：基于Ubuntu镜像构建一个新镜像，运行一个java项目

    <img src="https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/SpringCloud/image-20211223005014040.png" alt="image-20211223005014040" style="zoom:35%;" />

- 示例2：基于java:8-alpine镜像，将一个java项目构建为镜像

    <img src="https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/SpringCloud/image-20211223005050347.png" alt="image-20211223005050347" style="zoom:33%;" />

    <img src="https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/SpringCloud/image-20211223005125668.png" alt="image-20211223005125668" style="zoom:40%;" />

## 7. Docker Compose

### 7.1 概念介绍

`Compose` 项目是 Docker 官方的开源项目，负责实现对 Docker 容器集群的快速编排。从功能上看，跟 `OpenStack` 中的 `Heat` 十分类似。`Compose` 的定位是 *「定义和运行多个 Docker 容器的应用」*，其前身是开源项目 Fig。`Compose` 项目由 Python 编写，实现上调用了 Docker 服务提供的 API 来对容器进行管理。因此，只要所操作的平台支持 Docker API，就可以在其上利用 `Compose` 来进行编排管理。

在 `Dockerfile` 一节中，我们已经知道使用一个 `Dockerfile` 模板文件，可以让用户很方便的定义一个单独的应用容器。然而在日常工作中，经常会碰到需要多个容器相互配合来完成某项任务的情况，例如要实现一个 Web 项目，除了 Web 服务容器本身，往往还需要再加上后端的数据库服务容器，甚至还包括负载均衡器等。`Compose` 恰好满足了这样的需求，它允许用户通过一个单独的 `docker-compose.yml` 模板文件来将一组相关联的应用容器定义为一个项目（project）。

`Compose` 恰好满足了这样的需求。它允许用户通过一个单独的 `docker-compose.yml` 模板文件（YAML 格式）来定义一组相关联的应用容器为一个项目（project）。

`Compose` 中有两个重要的概念：

- 服务 (`service`)：一个应用的容器。
- 项目 (`project`)：由一组关联的容器组成的一个完整业务单元。

`Compose` 的默认管理对象是项目，一个项目可以由多个服务（容器）关联而成，`Compose` 面向项目进行管理，通过子命令对项目中的一组容器进行便捷地生命周期管理。

### 7.2 安装与卸载

`Compose` 支持 Linux、macOS、Windows 三大平台。`Docker Desktop for Mac/Windows` 自带 `compose`，安装 Docker 之后可以直接使用。

至于 Linux，也十分简单，从 [官方 GitHub Release](https://github.com/docker/compose/releases) 处直接下载编译好的二进制文件即可。如下为在 Linux 64 位系统上的操作：

```bash
$ DOCKER_CONFIG=/usr/local/lib/docker/cli-plugins
$ sudo mkdir -p $DOCKER_CONFIG/cli-plugins
$ sudo curl -SL https://github.com/docker/compose/releases/download/v2.6.1/docker-compose-linux-x86_64 -o $DOCKER_CONFIG/cli-plugins/docker-compose
$ sudo chmod +x $DOCKER_CONFIG/cli-plugins
$ docker compose version

# 国内用户可以使用以下方式加快下载
$ sudo curl -SL https://download.fastgit.org/docker/compose/releases/download/v2.6.1/docker-compose-linux-x86_64 -o $DOCKER_CONFIG/cli-plugins/docker-compose
```

### 7.3 docker-compose.yml

Docker Compose 默认使用文件名 `docker-compose.yml` 作为模板配置文件，不过也可以使用 `-f` 参数指定具体文件。

<img src="https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/SpringCloud/image-20211223005256604.png" alt="image-20211223005256604" style="zoom:33%;" />

Docker Compose 的 YAML 文件包含 4 个一级 key：`version, services, networks, volumes`

- `version`：必须指定，且总是位于文件的第一行。它定义了 Compose 文件格式的版本，注意，并非定义 Docker Compose 或 Docker 引擎的版本号。
- `services`：用于定义各个应用服务，一个服务对应一个单独的 docker 容器。
- `networks`：用于指引 Docker 创建新的网络。默认情况下，Docker Compose 会创建 bridge 网络（这是一种单主机网络，只能够实现同一主机上容器的连接），也可以使用 driver 属性来指定不同的网络类型。
- `volumes`：用于指引 Docker 来创建新的卷。

其中还有一些详细的指令，可参考：[Compose 模板文件 · Docker -- 从入门到实践](https://docker-practice.github.io/zh-cn/compose/compose_file.html)。

### 7.4 compose 命令

命令格式：`docker-compose [-f <arg>...] [options] [COMMAND] [ARGS...]`

| 常用命令                 | 说明                                                         |
| ------------------------ | ------------------------------------------------------------ |
| `docker-compose up`      | 创建并启动容器                                               |
| `docker-compose down`    | 停止并删除容器                                               |
| `docker-compose start`   | 启动已经存在的服务容器                                       |
| `docker-compose stop`    | 停止已经处于运行状态的容器，但不删除它                       |
| `docker-compose ps`      | 列出项目中的容器                                             |
| `docker-compose logs`    | 查看输出日志。默认情况下，docker compose 将对不同的服务输出使用不同的颜色来区分 |
| `docker-compose build`   | 构建（重新构建）项目中的服务容器                             |
| `docker-compose restart` | 重启项目中的服务                                             |
| ...                      | ...                                                          |

更多的看官方文档吧，`docker-compose --help`是个好东西。

### 7.5 示例

- `app.py`

  ```python
  from flask import Flask
  from redis import Redis
  
  app = Flask(__name__)
  redis = Redis(host='redis', port=6379)
  
  @app.route('/')
  def hello():
      count = redis.incr('hits')
      return 'Hello World! 该页面已被访问 {} 次。\n'.format(count)
  
  if __name__ == "__main__":
      app.run(host="0.0.0.0", debug=True)
  ```

- `Dockerfile`

  ```dockerfile
  FROM python:3.6-alpine
  ADD . /code
  WORKDIR /code
  RUN pip install redis flask
  CMD ["python", "app.py"]
  ```

- `docker-compose.yml`

  ```yaml
  version: '3'
  services:
  
    web:
      build: .
      ports:
       - "5000:5000"
  
    redis:
      image: "redis:alpine"
  ```

- 运行 compose 项目：

  ```bash
  $ docker compose up
  ```

## 8. Docker镜像服务

镜像仓库（Docker Registry）有公共的和私有的两种形式：

- 公共仓库：如Docker官方的Docker Hub，国内的网易云镜像服务、DaoCloud镜像服务、阿里云镜像服务等
- 私有仓库：在本地搭建的私有镜像仓库，企业自己的镜像最好是采用私有Docker Registry来实现。

