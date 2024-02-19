---
title: 使用SSH把个人电脑配置成 linux 服务器
date: 2020-06-23 09:04:00
categories: linux
---

以前不懂计算机网络的时候，总觉得服务器是一个很神奇的东西，等到突然知道了 SSH 可以在命令行下连接并操纵另一台电脑，原来每一台电脑都可以作为 C/S 架构中的服务器，于是拿自己的笔记本电脑捣腾了一番。

<!-- more -->

## 1. 更新软件源

```bash
sudo apt update
sudo apt upgrade
```

## 2. 安装并启动 sshserver

```bash
sudo apt install openssh-server
# 查看是否已默认启动，如已下输出看到了sshd则已经启动
ps -e | grep ssh
# 若无，启动sshserver
/etc/init.d/ssh start
/etc/init.d/ssh restart
# 可再次查看sshd进程是否已启动
ps -e | grep ssh
```

## 3. 创建 linux 使用帐户

```bash
tail /etc/passwd  # 查看已有用户
useradd chuan -ms /bin/bash
passwd chuan  # 更改密码
```

## 4. 添加管理员权限（可选）

```bash
sudo vim /etc/sudoers
```

找到以下这两行：

```bash
# User privilege specification
root ALL=(ALL:ALL) ALL
```

在下面跟`root ALL=(ALL:ALL) ALL`对齐着添加`chuan ALL=(ALL:ALL) ALL`即可。

## 5. 远程连接服务器

方法很多，linux 系统下可直接在 shell 中连接，windows 也可以在 cmd 里连接（但要安装有 ssh），还有装 Git 的时候附带的 git bash 里其实也能连接。具体命令行操作为：

```bash
# username为你在服务器上注册的用户名，host_ip为服务器的 IP 地址
ssh username@host_ip
```

此外，windows 下还可以通过流行的 Xshell 等软件来连接。

## 6. 附记

值得一提的是，通过 ssh 的连接方式似乎不能直接在公共的互联网上使用，在校园环境内，个人电脑与服务器都是学校的局域网，所以能直接连接，个人电脑在校外的时候需要用学校的 VPN 接入校园网络后才能连接。

我之前做实验，在家里先将自己的笔记本配置成服务器，让位于其他省的同学尝试连接我的笔记本，结果就是连不上的，但是此时再用一台笔记本连上自己家的网，就能连接了，因为是在同一个小局域网之下。前者失败的原因，百度了下好像是由于我是通过家里的无线 WIFI 连网的，这个首先要设置好路由器的跳转连接，不然人家对你的 IP 地址搜不到；不过，即便个人路由器已配置好，能否直接通过公有的互联网连接成功尚有疑问。

先挖个坑，后续有时间了再来了解下相关原理吧。
