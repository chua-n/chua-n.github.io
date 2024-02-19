---
title: linux 命令行下安装特定版本的 cuda (踩坑记录)
date: 2020-06-29 15:58:00
categories: linux
---

实验室服务器 Ubuntu 16.04 系统下原本安装的 cuda 版本是 9.0，硬件条件是一张 1080 Ti 的 GPU，在使用 PyTorch 的过程中想要把 cuda 版本换成 10.2，尝试了网上各种教程，无奈网络博客的质量实在是鱼目混珠，现在总结一下自己的踩坑记录，尽量详细地照顾到从头至尾的各个细节。

<!-- more -->

> 其实可直接看第 4 步的总结……

## 1. 走官网教程

首先想的当然是走官网的 cuda 安装教程啦，尝试了[官网页面](https://developer.nvidia.com/cuda-10.2-download-archive?target_os=Linux&target_arch=x86_64&target_distro=Ubuntu&target_version=1604&target_type=runfilelocal)里的`runfile(local)`、`deb(local)`安装方式选项均失败，失败过程的详细说明如下：

### 1.1. 使用`deb(local)`方法（不推荐）

官网给的安装方式为：

```bash
$ wget https://developer.download.nvidia.com/compute/cuda/repos/ubuntu1604/x86_64/cuda-ubuntu1604.pin
$ sudo mv cuda-ubuntu1604.pin /etc/apt/preferences.d/cuda-repository-pin-600
$ wget http://developer.download.nvidia.com/compute/cuda/10.2/Prod/local_installers/cuda-repo-ubuntu1604-10-2-local-10.2.89-440.33.01_1.0-1_amd64.deb
$ sudo dpkg -i cuda-repo-ubuntu1604-10-2-local-10.2.89-440.33.01_1.0-1_amd64.deb
$ sudo apt-key add /var/cuda-repo-10-2-local-10.2.89-440.33.01/7fa2af80.pub
$ sudo apt-get update
$ sudo apt-get -y install cuda
```

虽然服务器上已经有安装的 cuda 9.0，但此方法不需要先卸载老版本（大概是因为用的 apt-get 安装会自动覆盖吧），一路执行下来都没有报错，畅快地安装完成。然而，后又经过各种尝试后发现，在执行到最后一句`sudo apt-get -y install cuda`时，安装好的版本总是当前 NVIDIA 最新的 cuda 版本——截止到 2020.06.21 是 cuda 11.0，而我要安装的是 cuda 10.2（因为当前 PyTorch 只支持到 cuda 10.2）！

事实上，如果你要安装最新的 cuda 版本的话，这个方法非常好，安装流程到这里就可以结束了。

至于为什么总是安装的最新的 cuda 版本，而不是你以为的你指定的版本，大抵是因为最后那一句命令本质上还是用 apt 从软件源里下载 cuda，而软件源里的是最新版本所以你安装的也只能是最新版本吧。

### 1.2. 使用`runfile(local)`方法（推荐）

对于`runfile(local)`，官网给的安装方式为：

```bash
$ wget http://developer.download.nvidia.com/compute/cuda/10.2/Prod/local_installers/cuda_10.2.89_440.33.01_linux.run
$ sudo sh cuda_10.2.89_440.33.01_linux.run
```

这个看上去靠谱多了，毕竟是下载到本地你指定的安装包然后直接在本地安装，但是在执行`sudo sh cuda_10.2.89_440.33.01_linux.run`发现依然报错，按其提示，用 cat 或 vim 查看相应的日志记录如下：

```log
[INFO]: Driver not installed.
[INFO]: Checking compiler version...
[INFO]: gcc location: /usr/bin/gcc

[INFO]: gcc version: gcc version 5.4.0 20160609 (Ubuntu 5.4.0-6ubuntu1~16.04.12)

[INFO]: Initializing menu
[INFO]: Setup complete
[INFO]: Components to install:
[INFO]: Driver
[INFO]: 440.33.01
[INFO]: Executing NVIDIA-Linux-x86_64-440.33.01.run --ui=none --no-questions --accept-license --disable-nouveau --no-cc-version-check --install-libglvnd  2>&1
[INFO]: Finished with code: 256
[ERROR]: Install of driver component failed.
[ERROR]: Install of 440.33.01 failed, quitting
```

注意最后的`[ERROR]: Install of driver component failed.`，意思是驱动安装失败，我简直莫名奇妙。

找了找查看驱动相关的命令，使用`sudo dpkg --list | grep nvidia-*`命令查看了驱动版本号，发现竟然装了两个驱动版本！啥意思呢？就是原来我服务器上装的那个驱动，加上在上一步尝试`deb(local)`方法安装 cuda 时自动装的一个驱动，两个同时存在了。

> 为啥 cuda 覆盖了而 nvidia 驱动没覆盖，难道是我记错了 w(ﾟ Д ﾟ)w ？不过这其实并不重要，反正无论一个/两个都要卸载。

## 2. 解决驱动问题

为了这个专门写了篇博客，移步[这里](https://www.chua-n.com/2020/06/29/linux命令行下安装特定版本的cuda/)。

## 3. 安装

配置好 nvidia 驱动后，可以安装 cuda 了，先删除原有的 cuda，再对 1.2 节里下载的文件运行安装就可以了。

```bash
sudo apt autoremove cuda
# 若上一步删不干净，接着使用：
sudo apt --purge remove "*cublas*" "cuda*"
# 在 1.2 节之前下载的文件目录下运行：
sudo sh cuda_10.2.89_440.33.01_linux.run
```

按照安装过程中的提示一步步走下来即可，会让你选择安装的组件等等，像 nvidia samples 后面那几个组件我就没有装。

## 4. 总结

简而言之，总的流程其实是：

1. 适配好你需要的 NVIDIA Driver(英伟达驱动)，参考[这里](https://www.chua-n.com/2020/06/29/linux命令行下安装特定版本的cuda/)；
2. 使用 1.2 节的`runfile(local)`方法先下载好相应的 cuda 版本；
3. 按照第 3 节进行安装。
