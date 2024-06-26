---
title: WSL
---

> 如无特殊说明，本文中所述 WSL 将都是 WSL2，不再学习 WSL1 相关的内容。

## 1. 安装WSL

参考[如何在 Windows 10 上安装 WSL 2 ](https://zhuanlan.zhihu.com/p/337104547)等。

## 2. WSL 的特殊性

### 2.1 WSL与宿主机的网络映射

> 官方文档：[Accessing network applications with WSL | Microsoft Learn](https://learn.microsoft.com/en-us/windows/wsl/networking)。

在结合WSL开发网络应用时，有几点WSL的特殊性需要明确一下：

|    服务端    |    客户端    |                    客户端访问方式                     |
| :----------: | :----------: | :---------------------------------------------------: |
|   本机 WSL   | 本机 Windows |                localhost 即可直接访问                 |
| 本机 Windows |   本机 WSL   |            *必须通过宿主机的IP地址来访问*             |
| 本机 Windows |   其他主机   |               宿主机 IP+PORT，无须多言                |
|   本机 WSL   |   其他主机   | *需要将宿主机相应的端口映射到WSL，然后通过宿主机访问* |

在WSL中获取宿主机IP地址的一个方式为：

- 在WSL中执行`cat /etc/resolv.conf`；

- 命令输出中`nameserver`字段后的内容即为相应IP。

  ![img](https://figure-bed.chua-n.com/杂技/Linux/wsl2-network-l2w.png)

通过远程主机访问本地主机WSL中的应用程序时，WSL1 和 WSL2 略有区别：

- 在 WSL1 中，可认为 WSL1 和宿主机融为一体，远程主机访问本地 WSL1 中运行的程序与访问本地 Windows 中运行的程序相比并无区别；
- 在 WSL2 中，WSL2 拥有一张虚拟网卡，因此拥有独立的 IP 地址。目前来说，远程主机访问本地 WSL2 中运行的程序时必须像访问本地虚拟机中的程序一样，依照虚拟机的情况进行上述相关设置，而不能认为 WSL2 是一个子系统，微软团队声称他们正在解决这一痛点。

宿主机 Windows 向 WSL 作映射时，通过 powershell 的一个命令即可。如下为一个操作示例：

- WSL 查看 IP 信息：

  ```bash
  chuan@WSL:~$ ifconfig
  eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
          inet 172.17.178.146  netmask 255.255.255.240  broadcast 172.17.178.159
          inet6 fe80::215:5dff:fef8:cd04  prefixlen 64  scopeid 0x20<link>
          ether 00:15:5d:f8:cd:04  txqueuelen 1000  (Ethernet)
          RX packets 14970  bytes 2603065 (2.6 MB)
          RX errors 0  dropped 0  overruns 0  frame 0
          TX packets 1409  bytes 2056139 (2.0 MB)
          TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
  
  lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
          inet 127.0.0.1  netmask 255.0.0.0
          inet6 ::1  prefixlen 128  scopeid 0x10<host>
          loop  txqueuelen 1000  (Local Loopback)
          RX packets 1613  bytes 2099263 (2.0 MB)
          RX errors 0  dropped 0  overruns 0  frame 0
          TX packets 1613  bytes 2099263 (2.0 MB)
          TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
  ```

- Windows 查看 IP 信息：

  ```powershell
  PS C:\Users\chuan> ipconfig
  
  Windows IP 配置
  
  
  以太网适配器 以太网 4:
  
     连接特定的 DNS 后缀 . . . . . . . :
     本地链接 IPv6 地址. . . . . . . . : fe80::90d0:c29a:bcad:ba2d%12
     IPv4 地址 . . . . . . . . . . . . : 10.8.224.5
     子网掩码  . . . . . . . . . . . . : 255.255.254.0
     默认网关. . . . . . . . . . . . . : 10.8.225.254
  
  以太网适配器 以太网 5:
  
     媒体状态  . . . . . . . . . . . . : 媒体已断开连接
     连接特定的 DNS 后缀 . . . . . . . :
  
  以太网适配器 以太网 6:
  
     媒体状态  . . . . . . . . . . . . : 媒体已断开连接
     连接特定的 DNS 后缀 . . . . . . . :
  
  以太网适配器 vEthernet (WSL):
  
     连接特定的 DNS 后缀 . . . . . . . :
     本地链接 IPv6 地址. . . . . . . . : fe80::a5ea:4b35:7ff2:32ba%34
     IPv4 地址 . . . . . . . . . . . . : 172.17.178.145
     子网掩码  . . . . . . . . . . . . : 255.255.255.240
     默认网关. . . . . . . . . . . . . :
  ```

- Windows 的 powershell 执行如下命令：

  ```powershell
  PS C:\Users\chuan> netsh interface portproxy add v4tov4 listenport=7777 listenaddress=0.0.0.0 connectport=7777 connectaddress=172.17.178.146
  ```

  > **TODO**：
  >
  > - `connectaddress` 的值为什么是 `172.17.178.146` 而不是 `172.17.178.145` ？
  >
  > - 内外系统查到的 WSL 的 IP 为什么不同，到底是什么机制导致的？
  >
  > - 同样的问题是，WSL 中通过`cat /etc/resolv.conf`查宿主机的IP，为什么也和Windows下执行`ipconfig`看到的IP不一样？
  >
  >   ```bash
  >   $ cat /etc/resolv.conf
  >   # This file was automatically generated by WSL. To stop automatic generation of this file, add the following entry to /etc/wsl.conf:
  >   # [network]
  >   # generateResolvConf = false
  >   nameserver 172.17.178.145
  >   ```

- 可通过如下命令查看 powershell 的端口映射是否设置成功：

  ```powershell
  PS C:\Users\chuan> netsh interface portproxy show all
  
  侦听 ipv4:                 连接到 ipv4:
  
  地址            端口        地址            端口
  --------------- ----------  --------------- ----------
  0.0.0.0         7777        172.17.178.146  7777
  
  ```


### 2.2 Sysvinit

> `Sysvinit`可参考[技术|浅析 Linux 初始化 init 系统: sysvinit](https://linux.cn/article-4422-1.html)

WSL的Ubuntu，使用`Sysvinit`而不是`Systemd`，因此，当需要使用`Systemd`命令时，需要用`Sysvinit`的相应命令来代替：

|         Systemd command          |        Sysvinit command        |
| :------------------------------: | :----------------------------: |
|  `systemctl start service_name`  |  `service service_name start`  |
|  `systemctl stop service_name`   |  `service service_name stop`   |
| `systemctl restart service_name` | `service service_name restart` |
| `systemctl status service_name`  | `service service_name status`  |
| `systemctl enable service_name`  |  `chkconfig service_name on`   |
| `systemctl disable service_name` |  `chkconfig service_name off`  |

### 2.3 其他可配置项目

- [WSL 中的高级设置配置 | Microsoft Learn](https://learn.microsoft.com/zh-cn/windows/wsl/wsl-config#wslconfig)

## 3. WSL中安装docker

### 3.1 安装过程

安装 docker 的过程大体上与 wsl 本身关系不大，直接参考官方所述的在 Linux 中安装 docker 的教程即可，这里以 [Install Docker Engine on Ubuntu | Docker Docs](https://docs.docker.com/engine/install/ubuntu/) 为例。

1. 卸载旧 docker 以防版本冲突：

   ```shell
   for pkg in docker.io docker-doc docker-compose docker-compose-v2 podman-docker containerd runc; do sudo apt-get remove $pkg; done
   ```

2. 设置 docker 的 apt 数据源，执行如下脚本：

   ```shell
   # Add Docker's official GPG key:
   sudo apt-get update
   sudo apt-get install ca-certificates curl
   sudo install -m 0755 -d /etc/apt/keyrings
   sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
   sudo chmod a+r /etc/apt/keyrings/docker.asc
   
   # Add the repository to Apt sources:
   echo \
     "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
     $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
     sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
   sudo apt-get update
   ```

3. 通过 apt 安装 docker：

   ```shell
   sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
   ```

### 3.2 WSL 的特殊设置

经过上述安装过程，实际上 docker 已经安装到你的机器上了，然而这时候你可能会发现你的 docker 死活启动不了，具体表现为：

```shell
chuan@wsl:~$ sudo service docker start
 * Starting Docker: docker                                                                           [ OK ]
chuan@wsl:~$ docker ps
Cannot connect to the Docker daemon at unix:///var/run/docker.sock. Is the docker daemon running?
chuan@wsl:~$ sudo service docker status
 * Docker is not running
```

此时，你需要执行如下两个命令：

> 参考自这篇博文：[wsl2中docker启动不了的问题解决方法](https://www.cnblogs.com/towinar/p/17344345.html)。

```shell
sudo update-alternatives --set iptables /usr/sbin/iptables-legacy
sudo update-alternatives --set ip6tables /usr/sbin/ip6tables-legacy
```

至此，你会发现 docker 可以正常运行了：

```shell
chuan@wsl:~$ sudo service docker start
 * Starting Docker: docker                                                                           [ OK ]
chuan@wsl:~$ docker ps
CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES
```

### 3.3 让非root用户使用docker

默认情况下，安装好的 docker 只允许 root 用户随意访问，正如官方所言：

> The Docker daemon binds to a Unix socket, not a TCP port. By default it's the `root` user that owns the Unix socket, and other users can only access it using `sudo`. The Docker daemon always runs as the `root` user.

在没有权限的情况下，你执行 docker 命令会报如下错误：

```shell
chuan@wsl:~$ docker ps
permission denied while trying to connect to the Docker daemon socket at unix:///var/run/docker.sock: Get "http://%2Fvar%2Frun%2Fdocker.sock/v1.45/containers/json": dial unix /var/run/docker.sock: connect: permission denied
```

如果你希望非 root 用户也能随意使用 docker，执行下述命令：

- 创建 docker 用户组（通常也不需要执行这一步，因为 docker 用户组在你安装 docker 的时候会自动创建）：

  ```shell
  sudo groupadd docker
  ```

- 将你的用户名加入 docker 用户组：

  ```shell
  sudo usermod -aG docker $USER
  ```

- 激活刚刚修改的用户组的设置：

  ```shell
  newgrp docker
  ```

- 验证是否成功：

  ```shell
  chuan@wsl:~$ docker ps
  CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES
  ```

这里再附上一个查看 docker 用户组设置情况的命令，以供辅助验证：

```shell
chuan@wsl:~$ grep docker /etc/group # 添加本人用户名之前
docker:x:999:
chuan@wsl:~$ grep docker /etc/group # 添加本人用户名之后
docker:x:999:chuan
```

### 3.4 卸载docker

- 卸载 docker 程序：

  ```shell
  sudo apt-get purge docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin docker-ce-rootless-extras
  ```

- 删除所有的镜像、容器、数据卷：

  ```shell
  sudo rm -rf /var/lib/docker
  sudo rm -rf /var/lib/containerd
  ```

## 4. WSL中安装nvm

> 直接参考官方：[nvm-sh/nvm](https://github.com/nvm-sh/nvm?tab=readme-ov-file#install--update-script)。

依次按以下步骤执行即可：

1. 下载安装脚本：

   ```bash
   wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh > install-nvm.sh
   ```

2. 切换为 root 用户，设置 nvm 的安装目录（我这里设置为`/opt/nvm`，如果默认的安装目录`~/.nvm`已经满足你的需求则可跳过这一步）：

   ```shell
   $ sudo su root
   $ echo $NVM_DIR # 查看当前是否有环境变量NVM_DIR
   
   $ mkdir /opt/nvm # 创建nvm的安装目录
   $ NVM_DIR=/opt/nvm # 设置一个（局部）变量
   $ export NVM_DIR # 将变量提升为全局变量，以便后续在执行 install-nvm.sh 脚本时，脚本能够读取到此变量
   $ echo $NVM_DIR
   /opt/nvm
   ```

3. 执行安装脚本：

   ```shell
   $ bash install-nvm.sh
   => Downloading nvm from git to '/opt/nvm'
   => Cloning into '/opt/nvm'...
   remote: Enumerating objects: 365, done.
   remote: Counting objects: 100% (365/365), done.
   remote: Compressing objects: 100% (313/313), done.
   remote: Total 365 (delta 43), reused 166 (delta 26), pack-reused 0
   Receiving objects: 100% (365/365), 365.08 KiB | 350.00 KiB/s, done.
   Resolving deltas: 100% (43/43), done.
   * (HEAD detached at FETCH_HEAD)
     master
   => Compressing and cleaning up git repository
   
   => Appending nvm source string to /root/.bashrc
   => Appending bash_completion source string to /root/.bashrc
   => Close and reopen your terminal to start using nvm or run the following to use it now:
   
   export NVM_DIR="/opt/nvm"
   [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
   [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
   ```

4. 根据安装脚本时出现的提示语，重启一下你的 shell 客户端，则可使用 nvm 了：

   ```shell
   $ sudo su root
   $ nvm
   
   Node Version Manager (v0.39.7)
   
   Note: <version> refers to any version-like string nvm understands. This includes:
     - full or partial version numbers, starting with an optional "v" (0.10, v0.1.2, v1)
     - default (built-in) aliases: node, stable, unstable, iojs, system
     - custom aliases you define with `nvm alias foo`
   
   ......
   
   Note:
     to remove, delete, or uninstall nvm - just remove the `$NVM_DIR` folder (usually `~/.nvm`)
   
   $ nvm ls
               N/A
   iojs -> N/A (default)
   node -> stable (-> N/A) (default)
   unstable -> N/A (default)
   ```

5. nvm 已经安装成功，此时借助 nvm 安装你需要的 node 版本即可了，比如我这里安装一个 20.x 的 node：

   ```shell
   $ nvm ls
   ->     v20.12.2
   default -> 20 (-> v20.12.2)
   iojs -> N/A (default)
   unstable -> N/A (default)
   node -> stable (-> v20.12.2) (default)
   stable -> 20.12 (-> v20.12.2) (default)
   lts/* -> lts/iron (-> v20.12.2)
   lts/argon -> v4.9.1 (-> N/A)
   lts/boron -> v6.17.1 (-> N/A)
   lts/carbon -> v8.17.0 (-> N/A)
   lts/dubnium -> v10.24.1 (-> N/A)
   lts/erbium -> v12.22.12 (-> N/A)
   lts/fermium -> v14.21.3 (-> N/A)
   lts/gallium -> v16.20.2 (-> N/A)
   lts/hydrogen -> v18.20.2 (-> N/A)
   lts/iron -> v20.12.2
   $ node
   Welcome to Node.js v20.12.2.
   Type ".help" for more information.
   >
   ```

6. 执行完毕。通过上述安装过程中 nvm 给出的提示来看，所谓安装 nvm，实际就是：

   - 找到一个 nvm 安装目录，所有 nvm 程序的内容都会安装到这里；

   - shell 绑定 nvm 程序的路径 `NVM_DIR`，从而在命令行中输入 nvm 时能够找到对应的 nvm 程序，具体而言，官方默认是通过在你的 `~/.bashrc` 文件中添加如下代码来实现的：

     ```shell
     $ vim ~/.bashrc
     ......
     # nvm
     export NVM_DIR="/opt/nvm"
     [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
     [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
     ```

   - 因此，正如 nvm 命令所提示的，当删除 nvm 时，只要删除安装目录 `NVM_DIR`，然后删除 `~/.bashrc` 文件中关于 nvm 的上述代码片段就可以了。

细究一下，上述过程实质上是通过 `root` 用户来安装的，而且在 `~/.bashrc` 中设置环境变量的做法显示跟特定的用户绑定了，故而会导致普通用户（比如`chuan`）依旧无法使用 nvm。这种情况的解决方案其实也很简单，在普通用户`chuan`的`~/.bashrc` 文件中添加上述环境变量代码片段，然后重启客户端即可。
