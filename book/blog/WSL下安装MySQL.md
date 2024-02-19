---
title: WSL下安装MySQL
date: 2020-08-14 16:54:00
categories:
    - [linux, WSL]
    - mysql
---

近期我在 Win10 中装了 WSL(Windows Subsystem for Linux)，又在学习 mysql，试图在 WSL(Ubuntu)中安装 mysql 进行命令行练习时，发现如下问题并解决。

<!-- more -->

## 1. 安装 mysql

1. `apt-get install mysql-server mysql-client`
2. 此时试图在 shell 中进入`mysql`会报错如下：
   `ERROR 2002 (HY000): Can't connect to local MySQL server through socket '/var/run/mysqld/mysqld.sock' (2)`

## 2. 解决方法

使用如下命令即可：

```bash
sudo mkdir -p /var/run/mysqld
sudo chown mysql /var/run/mysqld/
sudo service mysql restart
```

## 3. 问题原因分析

在 WSL 中，`/var/run/mysqld/mysqld.sock` 文件不存在。执行`vim /etc/mysql/my.cnf`将会看到如下内容：

```shell
#
# The MySQL database server configuration file.
#
# You can copy this to one of:
# - "/etc/mysql/my.cnf" to set global options,
# - "~/.my.cnf" to set user-specific options.
#
# One can use all long options that the program supports.
# Run program with --help to get a list of available options and with
# --print-defaults to see which it would actually understand and use.
#
# For explanations see
# http://dev.mysql.com/doc/mysql/en/server-system-variables.html
#
# * IMPORTANT: Additional settings that can override those from this file!
# The files must end with '.cnf', otherwise they'll be ignored.
#
!includedir /etc/mysql/conf.d/
!includedir /etc/mysql/mysql.conf.d/
```

这里的 mysql 的配置在/etc/mysql/mysql.conf.d 目录下的 mysqld.cnf 文件，打开可以看到:`bind-address = 127.0.0.1` `socket = /var/run/mysqld/mysqld.sock` 等信息。

而 WSL 的/var/run 下面没有 mysqld 目录，如果执行上述解决方法中的命令，目录和 sock 文件就都有了。

此时再输入 mysql 即可进入 mysql 的命令环境：

```sql
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 13
Server version: 8.0.20-0ubuntu0.20.04.1 (Ubuntu)

Copyright (c) 2000, 2020, Oracle and/or its affiliates. All rights reserved.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql>
```
