---
title: 配置jupyter notebook远程连接服务
date: 2020-12-08 20:49:00
categories:
    - [linux]
    - [python, jupyter]
---

jupyter notebook 不仅可在本地进行连接，而且可以在远程主机上开启 jupyter notebook 服务，然后在本地进行连接以便使用服务器的资源。

<!-- more -->

## 1. 安装 jupyter notebook

```bash
pip install jupyter
```

## 2. 生成相关配置文件

在命令行中运行

```bash
jupyter notebook --generate-config
```

## 3. 设置连接 jupyter notebook 服务时的密码

在命令行中进入 IPython 进行如下操作：

```python
In [1]: from notebook.auth import passwd
In [2]: passwd()
Enter password:
Verify password:
Out[2]: 'sha1:***yourcode***'
```

复制上面 Out[2]: 出来的密文，即引号中的内容，后续会用到。

## 4. 在上面生成的配置文件中进行配置

这里我们通过在 vim 编辑器中进行设置：

```bash
vim ~/.jupyter/jupyter_notebook_config.py
```

在上面文件的最后面插入以下设置，其含义见注释即可：

```bash
c.NotebookApp.ip = '0.0.0.0'  # 所有IP都可以访问
c.NotebookApp.port = 8888  # 默认的端口是8888
# 禁止自动在服务器上打开jupyter
# 若不设置此选项，则在命令行中输入`jupyter notebook`时会自动打开你的浏览器连接刚刚开启的jupyter服务
c.NotebookApp.open_browser = False
# 将之前复制的密文复制到这里
# 测试了一下，如不设置此选项，在浏览器中连接时会出现异常，虽然也提示你输入密码，但是就是无法连接成功
c.NotebookApp.password = u'sha1:***yourcode***'
# 设置启动Jupyter后其工作的根目录
# 该文件夹需要你自己去创建，我设置的为我在我的家目录中创建的jupyter文件夹
# 若不设置此项，打开jupyter时的工作目录为你在命令行输入jupyter notebook命令时对应的目录
c.NotebookApp.notebook_dir = "/path_of/root_directory/where/jupyter/works/"
```

## 5. 启动 jupyter notebook

在终端中输入`jupyter notebook`即可，此时可在本地或者远程连接此 jupyter notebook 服务。

## 6. 远程连接

在你的本地浏览器中，输入地址名`http://hostIpAddress:8888`（其中 hostIpAddress 以你主机的 IP 地址进行替换），输入登陆密码即可连接。
