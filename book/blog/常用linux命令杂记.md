---
title: 常用linux命令杂记
date: 2021-01-15 09:38:25
categories: linux
---

`tmux`命令、更改 apt 源、`cloc`命令、更新 Git 到最新版

<!-- more -->

## 1. tmux

当在本地的命令行中使用 SSH 连接到远程服务器进行工作时，如果 SSH 连接突然停止，会导致远程服务器中运行的相关命令停止执行（因为 SSH 创建的进程被关闭），这意味着如果你正在服务器中进行一个长时间执行的操作，比方说训练一个神经网络，当网络意外中断、或你关闭了本地的命令行窗口，将导致该操作的运行终止，而不是继续在服务器中执行。那么如何让“连接中断时，正在执行的指令仍旧保持运行”呢，这就可以用到 tmux 命令了。

### 1.1. tmux 简介

tmux(terminal multiplexer) 是一个终端复用器，它可以在一个窗口屏幕上创建、访问、控制多个终端。

-   tmux 使得“终端会话”可以从屏幕上分离出来，继续在后台运行，待后续重新连接；
-   tmux 还允许每个会话有多个连接窗口，因此可以多个用户实时共享会话。

### 1.2. session、window、pane:

tmux 中有三个重要的概念需要辨析：session、window、pane，其手册中如是说：

> A session is a single collection of pseudo terminals under the management of tmux. Each session has one or more windows linked to it. A window occupies the entire screen and may be split into rectangular panes, each of which is a separate pseudo terminal (the pty(4) manual page documents the technical details of pseudo terminals). Any number of tmux instances may connect to the same session, and any number of windows may be present in the same session. Once all sessions are killed, tmux exits.
>
> Each session is persistent and will survive accidental disconnection (such as ssh(1) connection timeout) or intentional detaching (with the ‘C-b d’ key strokes).

即，一个会话(session)是一系列伪终端的集合，一个会话可以有多个窗口(window)，所谓的窗口就是日常所说的占据一块屏幕区域的窗口，每一个窗口又可以进行“分屏”，切割为若干窗格(pane)，或称之为子屏幕，对于每一个子屏幕，它也是一个独立的伪终端。

### 1.2. tmux 命令

|                          命令                          |                                       作用                                       |
| :----------------------------------------------------: | :------------------------------------------------------------------------------: |
|                          tmux                          |                       开启一个 tmux 会话（以数字编号为名）                       |
|            tmux new -s &lt;session-name&gt;            |                         开启一个名为 session-name 的会话                         |
|                        tmux ls                         |                             查看所有存在的 tmux 会话                             |
|                      tmux detach                       |                                脱离当前 tmux 会话                                |
|          tmux attach -t &lt;session-name&gt;           | 连接名为 session-name 的会话，这里的 session-name 当然也可以为数字编号形式的名字 |
|          tmux switch -t &lt;session-name&gt;           |                                     切换会话                                     |
| tmux rename-session -t &lt;oldname&gt; &lt;newname&gt; |                                    重命名会话                                    |
|       tmux kill-session -t &lt;session-name&gt;        |                                     销毁会话                                     |

### 1.3. tmux 快捷键

在 tmux 会话内，可使用一些快捷键替代 tmux 命令，不过要想使用快捷键，必须每次先按下前缀键`Ctrl + b`唤醒快捷键功能。

> 注意：若想脱离而不销毁会话，一定要按`Ctrl + b + d`，别按成了`Ctrl + d`，这个属于 linux 终端的快捷键，会直接退出并销毁会话。

-   系统操作：

|  快捷键  |                           功能                           |
| :------: | :------------------------------------------------------: |
|    ?     |                      列出所有快捷键                      |
|    :     |                      进入命令行模式                      |
|    [     |           进入复制模式，此时的操作与 vim 相同            |
|    d     |                       脱离当前会话                       |
|    D     |                     选择要脱离的会话                     |
|    r     |                   强制重绘未脱离的会话                   |
|    ~     | 列出提示信息缓存，其中包含了之前 tmux 返回的各种提示信息 |
| `Ctrl+z` |                       挂起当前会话                       |

-   窗口操作

| 快捷键 |                 功能                 |
| :----: | :----------------------------------: |
|   c    |              创建新窗口              |
|   &    |             关闭当前窗口             |
| 数字键 |            切换至指定窗口            |
|   p    |            切换至上一窗口            |
|   n    |            切换至下一窗口            |
|   l    |       在前后两个窗口间互相切换       |
|   w    |         通过窗口列表切换窗口         |
|   ,    |            重命名当前窗口            |
|   .    | 修改当前窗口编号，相当于窗口重新排序 |
|   f    |       在所有窗口中查找指定文本       |

-   窗格操作

|    快捷键     |               功能                |
| :-----------: | :-------------------------------: |
|       "       |     当当前窗格上下平分为两块      |
|       %       |     将当前窗格左右平分为两块      |
|       x       |           关闭当前窗格            |
|       !       |       将当前面板置于新窗口        |
| `Ctrl+方向键` | 以 1 个单元格为单位，移动窗格边缘 |
| `Alt+方向键`  | 以 5 个单元格为单位，移动窗格边缘 |
|       q       |           显示窗格编号            |
|       o       |     在当前窗格中选择下一窗格      |
|    方向键     |        移动光标以选择面板         |
|       {       |         向前置换当前面板          |
|       }       |         向后置换当前面板          |
|   `Ctrl+o`    |     顺时针旋转当前窗口的面板      |
|    `Alt+o`    |     逆时针旋转当前窗口的面板      |

## 2. 更改 Ubuntu 的 apt 源为阿里源

Ubuntu 下的包管理工具 apt 默认的软件源为国外服务器，在国内使用时经常会速度非常慢，因此可将其更换为清华源、阿里源等，只需要更改配置文件/etc/apt/sources.list 即可。

### 2.1. 备份原配置文件

```bash
cd /etc/apt/
sudo cp sources.list sources.list.backup
```

### 2.2. 改写 source.list 配置文件

将/etc/apt/sources.list 文件的原内容全部加`#`号注释或直接删除，然后添加以下内容：

```shell
deb http://mirrors.aliyun.com/ubuntu/ focal main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ focal main restricted universe multiverse

deb http://mirrors.aliyun.com/ubuntu/ focal-security main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ focal-security main restricted universe multiverse

deb http://mirrors.aliyun.com/ubuntu/ focal-updates main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ focal-updates main restricted universe multiverse

deb http://mirrors.aliyun.com/ubuntu/ focal-backports main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ focal-backports main restricted universe multiverse

deb http://mirrors.aliyun.com/ubuntu/ focal-proposed main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ focal-proposed main restricted universe multiverse
```

现在已经改写了配置文件，再执行以下命令即可完成 apt 的软件源的更新：

```bash
sudo apt update
```

> 附：由于更新了软件源，因此一些软件被系统检测到的最新版本号可能发生变化，故而不妨再使用`sudo apt upgrade`更新一下这些软件。

### 2.3. sources.list 配置内容说明

sources.list 文件的每个配置条目都是有格式的：

```bash
deb http://site.example.com/debian distribution component1 component2 component3
deb-src http://site.example.com/debian distribution component1 component2 component3
```

其中每一行最后面的*componentN*参数表示对软件包的分类，ubuntu 下就是 main、restricted、universe、multiverse；*distribution*参数代表系统版本代号，可使用`lsb_release -c`命令查看，比如：

|     版本     |  代号  |
| :----------: | :----: |
| Ubuntu 15.04 | vivid  |
| Ubuntu 16.04 | xenial |
| Ubuntu 17.04 | zesty  |
| Ubuntu 18.04 | bionic |
| Ubuntu 19.04 | disco  |
| Ubuntu 20.04 | focal  |

## 3. cloc：统计代码行数

当想要统计某文件夹下代码的行数时，可以使用`cloc`命令。如：

```shell
$ cloc particle/

     123 text files.
     110 unique files.
      23 files ignored.

github.com/AlDanial/cloc v 1.82  T=0.22 s (494.5 files/s, 188728.2 lines/s)
-------------------------------------------------------------------------------
Language                     files          blank        comment           code
-------------------------------------------------------------------------------
Python                          94           4487          15174          19605
XML                              8            101            153           1023
XSD                              1             23             15            161
Bourne Shell                     1              2             36             26
Markdown                         3             12              0             22
-------------------------------------------------------------------------------
SUM:                           107           4625          15378          20837
-------------------------------------------------------------------------------
```

## 4. 更新 Git 到最新版本

Ubuntu 的默认软件源（以及阿里源）不能把 Git 更新到官方最新版，导致一些特性不能使用（比如我想把主分支的命名从 master 改为 main）。要想对 Git 进行更新，如下添加 Git 官方的软件源然后更新即可：

```bash
# 添加Git官方软件源
sudo add-apt-repository ppa:git-core/ppa
# 更新
sudo apt update
sudo apt upgrade
# 查看当前Git版本
git --version
```

## 5. to be continued
