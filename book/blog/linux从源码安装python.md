---
title: linux 下从源码安装 Python——小白踩坑记
date: 2020-06-29 15:55:00
categories:
    - [linux]
    - [python]
---

实验室服务器使用的系统为 Ubuntu 16.04，自带的 python 版本为 Python 2.7.12 和 Python 3.5.2，命令行下使用`$ python`命令来启动 python 时默认是 python2.7。而我想使用 Python 3.8，因此尝试从源码安装 Python，并更改默认的`$ python`命令指向。

<!-- more -->

> 注：如果想要安装某个非系统自带的 Python 版本，切忌冲动删除系统自带的 Python 2.7 和 Python 3.5，某些系统应用可能依赖于这些 Python 环境的调用，防止系统出错！

## 1. 官网下载 python 源码

在官网[这里](https://www.python.org/downloads/source/)下载你想要的 linux 环境下的 python 源码，如我下载的是下图第一个 Gzipped source tarball，其实二选一就好。

![python源码.png](https://chua-n.gitee.io/figure-bed/notebook/blog/linux源码安装python/python源码包.png)

我下载完成后是一个叫 Python-3.8.3.tgz 的文件，在下载目录里使用`tar -xvf Python-3.8.3.tgz` 命令解压文件包，目录里多出一个 Python-3.8.3 的文件夹，cd 命令进入该文件夹。

上述操作总结起来如下：

```bash
wget https://www.python.org/ftp/python/3.8.3/Python-3.8.3.tgz
tar -xvf Python-3.8.3.tgz
cd Python-3.8.3
```

## 2. 安装依赖

Python 源码编译、安装过程中需要用到一些工具，你的系统里可能有、可能没有这些工具，保险起见，使下以下命令先把这些依赖安装好吧。

> 这一步其实可以放在最开始执行。

1. Ubuntu/Debian 系列：
    ```bash
    sudo apt-get install -y make build-essential libssl-dev zlib1g-dev libbz2-dev libreadline-dev libsqlite3-dev wget curl llvm libncurses5-dev libncursesw5-dev xz-utils tk-dev libffi-dev liblzma-dev python-openssl
    ```
2. Fedora/CentOS/RHEL 等可参考：
    ```bash
    sudo yum install zlib-devel bzip2 bzip2-devel readline-devel sqlite sqlite-devel openssl-devel xz xz-devel libffi-devel
    ```

---

## 3. 编译并安装 python

注意根据第 1 节最后的 cd 命令，我们现在是在 python 的源码文件夹里进行操作。

### 3.1. 指定 python 的安装目录

作为 CS 小白，我还是要区别一下 python 的“源码目录”和“安装目录”两个概念的，毕竟是第一次在 linux 下从源码安装软件。

要知道，当前我们所在的目录`Python-3.8.3`是由最开始下载的源码压缩包解压出来的，因此这个目录里是 python 这个软件开源的源码，故称之为**源码目录**；而**安装目录**是说我们这个 python 软件要安装在系统的哪个地方，你启动 python 的时候实际是从这里启动的。

类比下 windows 的话就是：源码目录是你下载的那个安装程序`xxx.exe`所在的目录，还记得一些大型软件（如 office 2016）安装的时候通常是一个文件夹里有一个`setup.exe`的程序吗（当然，很多软件你下载下来的安装包其实就一个单独的.exe 可执行文件就没了），windows 下就是直接点击这个`xxx.exe`进行安装的，这就是所谓的**源码目录**；那么显而易见，**安装目录**就是你在运行`xxx.exe`进行安装的时候选择的安装地址，譬如说经常是`C:\Program Files\`等等。真正的软件组件肯定是在安装目录里，软件需要从这里启动，而你平常习惯的在 windows 桌面/开始菜单里点击的图标就是从安装目录里延伸出的快捷方式。

回归主题，我选择的 python 安装目录是`/opt/python3.8`，因此通过如下命令先建立这个文件夹：

```bash
mkdir /opt/python3.8
```

### 3.2. 执行./configure

python 源码目录里有一个 configure 可执行文件，这个命令的作用是生成一个 MakeFile 文件，此 Makefile 文件用来被之后的 make 命令所使用进行源码编译（Linux 需要按照 Makefile 所指定的顺序来编译 (build) 程序组件）。

configure 通常有一些参数选项，最常见的是--prefix，用来指定安装目录。此外，要注意的是，python3.4 以后自带了 pip，为了在之后能够成功使用这个 pip 进行 python 库的安装，最好加上--with-ssl 参数。--with-ssl 这个参数不加的话 python 的安装过程不受影响，只是当你想要用 pip 安装 python 库的时候会报错，发现它无法连接到 pypi，跟 pip 连不上网没啥区别。

总之，使用如下命令：

```bash
./configure --with-ssl --prefix=/opt/python3.8
```

### 3.3. make 编译

`make`命令实际就是编译源代码，其根据 Makefile 文件执行编译指令并生成可执行文件。

```bash
make
```

### 3.4. 使用 make install 进行安装

当 make 的源代码编译无误，使用`make install`就是进行软件的安装，似乎也要根据 Makefile 文件以及根据 make 生成的可执行文件进行执行，原理尚不明确，现在确定的是其现实意义是把软件安装到`configure`命令指定的目录，对我而言就是`/opt/python3.8`。

`make install`因为是软件安装，因此通常需要 sudo 权限。

```bash
sudo make install
```

## 4. 配置环境

至此 python 的安装过程其实已经完成，在安装目录里使用`./bin/python3`即可打开安装好的 python 可执行文件并进入 python 命令行了：

![启动python.png](https://chua-n.gitee.io/figure-bed/notebook/blog/linux源码安装python/python命令行.png)

但是每次要从安装目录里启动 python 很不方便，我们想要达到的是在 shell 中随时随地唤醒这个 python，这便需要进行相关的环境配置。

### 4.1. 删除原有的软链接

开头的时候提到，我的系统中默认的 python 命令打开的是系统自带的 python2.7，现在要更改这个命令让它打开的是新安装的 python3.8，这需要我们先理解命令行(shell)中的命令是怎么执行的：

-   在 shell 中，执行的所有命令如 cd、ls、ps、python 等，分为“内建命令”和“外部命令”。**内建命令**是 shell 自带的命令，好比编程语言不需要使用函数库而自带的那些函数，如`print()`函数；**外部命令**是为了丰富 shell 的功能而自己安装的一些命令，好比你编程时使用的第三方库，当然，有些外部命令是你安装 linux 系统时就已经自带的命令，好比编程语言的标准库，虽然是“自带的”但依然是“外部命令”。
-   python 毫无疑问是外部命令，那么外部命令是怎么执行呢？这就要提到平常经常见到的`PATH`概念了。当 shell 中输入一个命令时，shell 首先检验它是不是内建命令，当内建命令中找不到这条命令时，shell 就搜索你的`PATH`，这个东西就是一个存储了你的外部命令所在路径的集合，shell 在这些路径中寻找你输入的命令对应的那个可执行文件，找得到就在 shell 中执行，找不到就报错。
-   于是，shell 中 python 命令的执行过程为：在`PATH`存储的那么路径里（包含很多路径，其中一个是`/usr/bin/`）寻找一个名为`python`的可执行文件，一般情况下，有这么一个文件：`/usr/bin/python`，找到它以后执行，就打开了 python。

现在我们使用`ls -l /usr/bin/python`查看这个文件的详细信息，发现它是一个执行 python2.7 的软链接（相当于 windows 里的快捷方式），把它删掉，这样在 shell 中直接输入 python 就再也打不开任何 python 环境了，它成了一个无效命令。

总结一下，这步操作的命令过程为：

```bash
ls -l /usr/bin/python
sudo rm /usr/bin/python
```

### 4.2. 建立新的软链接

使用软链接创建命令`ln -s`把新安装的 python 链接到上步删除的旧的软链接所在目录即可。即：

```bash
ln -s /opt/python3.8/bin/python3 /usr/bin/python
```

此时在任意工作目录的 shell 中任意输入 python，即可打开新安装的 python 3.8 了。

```bash
chuan@workstation:~$ python
Python 3.8.3 (default, Jun 21 2020, 16:34:59)
[GCC 5.4.0 20160609] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>>
```

### 4.3. 配置 pip 命令

你的系统可能也自带了 pip 或 pip2、pip3 等命令，由于自带的 pip 关联的肯定是原有的 python 环境，此时盲目使用 pip install 一些库的话，这些库其实被安装到了系统自带的 python 环境里了，在你新安装的 python3.8 里根本无法导入这些库，这就尴尬了。

这个 pip 其实和之前被删除的 python 软链接一样，是一个在相同目录下的 pip 软链接，和更改 python 命令一样，删除掉原来的 pip 被建立一个新的 pip 软链接即可。为了让 pip 关联的是新下载的 python3.8，新的 pip 应该来自 python3.8 自带的那个 pip，其路径为`./opt/python3.8/bin/pip3`。话不多说，代码如下：

```bash
sudo rm /usr/bin/pip
ln -s /opt/python3.8/bin/pip3 /usr/bin/pip
```

## 5. 前方告捷，嘿嘿

## 6. 附记

新安装的 pip 在安装第三方库时还是有一个小小的报错，提示什么文件夹权限不明确/不足以及：

```shell
Could not install packages due to an EnvironmentError: [Errno 13] Permission denied
```

根据百度，出现这个报错之后，在 pip install 之后加个--user 可解决，如下：

```bash
pip install --user numpy
```

第一次加过--user 之后便不再有报错，但不明所以的是这样之后 pip 安装的第三方库的目录被定在了`~/.local/`，原来似乎不存在这个文件夹。不过这并没有造成后续什么问题，暂且不管了，挖个坑后续再研究。

另外，不知道能不能选择直接把一个已安装的 pip 绑定到指定的 python 环境，而不用这么折腾，未完待续吧......
