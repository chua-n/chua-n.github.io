---
title: linux 命令行下适配 nvidia 驱动
date: 2020-06-29 15:56:00
categories: linux
---

疫情期间回不了学校，只能用 SSH 连接学校的服务器做试验，PyTorch 需要另一个版本的 cuda，只得在命令行下强装对应的 cuda 版本和 nvidia 驱动，于是有了这篇踩坑实录……

<!-- more -->

## 1. 下载相应驱动

在官网[这里](https://www.nvidia.cn/Download/index.aspx?lang=cn)选择适应你 GPU 的驱动版本，在下载界面可用右键得到下载链接，然后在 linux 命令行下使用 wget 进行下载，如我下载的是 1080 Ti 的驱动版本：

```bash
wget https://www.nvidia.cn/content/DriverDownload-March2009/confirmation.php?url=/XFree86/Linux-x86_64/440.82/NVIDIA-Linux-x86_64-440.82.run&lang=cn&type=TITAN
```

下载完成后是一个名为`NVIDIA-Linux-x86_64-440.82.run`的文件。此时若使用`sudo sh NVIDIA-Linux-x86_64-440.82.run`进行安装，会产生如下报错：

```shell
You appear to be running an X server; please exit X before installing.
```

这主要是由于通常而言你的电脑上已经有 nvidia 驱动并且在运行了，此时无法进行新驱动的安装，因为会影响依赖你现有驱动的应用的正常运行。比方说你的桌面程序就需要依靠现有的显卡驱动进行显示。

回到这个报错，百度了解到是有一个叫做 X 的进程服务在依赖着 nvidia 驱动的运行，这个 X 进程似乎就是支撑你的图形桌面的服务。使用`ps aux | grep X`命令可查看到这个正在运行的服务：

```bash
$ ps aux | grep X
root      1459  0.0  0.0  15984   928 pts/40   S+   19:12   0:00 grep X
root      1643  0.0  0.1 426836 187692 tty7    Ssl+ 10:43   0:15 /usr/lib/xorg/Xorg -core :0 -seat seat0 -auth /var/run/lightdm/root/:0 -nolisten tcp vt7 -novtswitch
root      3604  0.0  0.0 387052 71108 tty8     Ssl+ 10:44   0:22 /usr/lib/xorg/Xorg -core :1 -seat seat0 -auth /var/run/lightdm/root/:1 -nolisten tcp vt8 -novtswitch
git       3909  0.0  0.0  43732  4264 ?        Ss   10:44   0:03 dbus-daemon --fork --session --address=unix:abstract=/tmp/dbus-E2NLgH7XO1
```

## 2. 关闭 X 服务

为了能够安装新的 nvidia 驱动，我们需要关闭这个 X 服务，我的 Ubuntu 是基于 lightdm 类型的桌面系统，采用如下命令：

```bash
sudo /etc/init.d/lightdm stop
sudo /etc/init.d/lightdm status
```

对于其他的 linux 版本，如果桌面系统是基于 gdm 类型，应该把命令中的 lightdm 改为 gdm 即可；非这两种桌面系统类型的，百度一下你的 linux 版本关闭 X 服务的相关命令吧。

关闭了 X 服务后图形桌面可能会关闭，因为我是通过 ssh 连接的服务器进行的操作，所以也没有看到具体的变化，不确定具体会发生什么情况，不过别慌就是了。

关闭 X 后，可再次用 ps 命令查看相关进程以确认，我这里显示如下，确实没有运行的 X 服务了：

```bash
$ ps aux | grep X
root      1656  0.0  0.0  15984  1084 pts/40   S+   19:15   0:00 grep X
```

## 3. 卸载旧的驱动

终于可以卸载旧驱动了：

```bash
sudo apt-get --purge remove nvidia-*
# 也有的说用下面的命令进行卸载，我个人均有尝试，无碍
sudo apt-get --purge remove "*nvidia*"
```

## 4. 安装新驱动

在第 1 步下载的驱动文件目录里运行安装包即可：

```bash
sudo sh NVIDIA-Linux-x86_64-440.82.run
```

值得一提的是，中间可能会有一些小的 warning 提示（好像还有一个 error？），但流程走下来最终还是提示 successfully complete，这就中了！使用`nvidia-smi`已经可以看到你的新驱动版本号（Driver Version）产生了变化：

```shell
$ nvidia-smi
Sun Jun 21 19:16:54 2020
+-----------------------------------------------------------------------------+
| NVIDIA-SMI 440.82       Driver Version: 440.82       CUDA Version: 10.2     |
|-------------------------------+----------------------+----------------------+
| GPU  Name        Persistence-M| Bus-Id        Disp.A | Volatile Uncorr. ECC |
| Fan  Temp  Perf  Pwr:Usage/Cap|         Memory-Usage | GPU-Util  Compute M. |
|===============================+======================+======================|
|   0  GeForce GTX 108...  Off  | 00000000:02:00.0 Off |                  N/A |
| 27%   35C    P5    24W / 250W |      0MiB / 11170MiB |      2%      Default |
+-------------------------------+----------------------+----------------------+

+-----------------------------------------------------------------------------+
| Processes:                                                       GPU Memory |
|  GPU       PID   Type   Process name                             Usage      |
|=============================================================================|
|  No running processes found                                                 |
+-----------------------------------------------------------------------------+
```
