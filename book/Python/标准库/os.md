---
title: os
---

os 库是 Python 标准库，包含几百个函数，它提供通用的、基本的操作系统交互功能，对 Windows/Mac OS/Linux 都支持。

os 库常用功能主要包括路径操作、进程管理、环境参数等几类。

1. 路径操作：os.path 子库，处理文件路径及信息

2. 进程管理：启动系统中其他程序

3. 环境参数：获得系统软硬件信息等环境参数

## 路径的操作

> `import os.path` 或 `import os.path as op`。

os.path 子库以 path 为入口，用于操作和处理文件路径。

常用操作

- `op.abspath(path)`：返回 path 在当前系统中的绝对路径

    ```python
    >>>os.path.abspath("file.txt")
    'C:\\Users\\Tian Song\\Python36-32\\file.txt'
    ```

- `op.normpath(path)`：归一化 path 的表示形式，统一用\\分隔路径

  ```python
  >>>os.path.normpath("D://PYE//file.txt")
  'D:\\PYE\\file.txt'
  ```

- `op.relpath(path)`：返回当前程序与文件之间的相对路径

  ```python
  >>>os.path.relpath("C://PYE//file.txt")
  '..\\..\\..\\..\\..\\..\\..\\PYE\\file.txt'
  ```

- `op.dirname(path)`：返回 path 中的目录名称

  ```python
  >>>os.path.dirname("D://PYE//file.txt")
  'D://PYE'
  ```

- `op.basename(path)`：返回 path 中最后的文件名称

  ```python
  >>>os.path.basename("D://PYE//file.txt")
  'file.txt'
  ```

- `op.join(path, *paths)`：组合 path 与 paths，返回一个路径字符串

  ```python
  >>>os.path.join("D:/","PYE/file.txt")
  'D:/PYE/file.txt'
  ```

- `op.exists(path)`：判断 path 对应文件或目录是否存在，返回 True 或 False

  ```python
  >>>os.path.exists("D://PYE//file.txt")
  False
  ```

- `op.isfile(path)`：判断 path 是否为已存在的文件，返回布尔值

  ```python
  >>>os.path.isfile("D://PYE//file.txt")
  True
  ```

- `op.isdir(path)`：判断 path 是否为已存在的目录，返回布尔值

  ```python
  >>>os.path.isdir("D://PYE//file.txt")
  False
  ```

- `op.getatime(path)`：返回 path 对应文件或目录上一次的访问时间

  ```python
  >>>os.path.getatime("D:/PYE/file.txt")
  1518356633.7551725
  ```

- `op.getmtime(path)`：返回 path 对应文件或目录最近一次的修改时间

  ```python
  >>>os.path.getmtime("D:/PYE/file.txt")
  1518356633.7551725
  ```

- `op.getctime(path)`：返回 path 对应文件或目录的创建时间

  ```python
  >>> time.ctime(os.path.getctime("D:/PYE/file.txt"))
  'Sun Feb 11 21:43:53 2018'
  ```

- `op.getsize(path)`：返回 path 对应文件的大小，以字节为单位

  ```python
  >>>os.path.getsize("D:/PYE/file.txt")
  180768
  ```

## 进程管理

主要是`os.system(<command>)`命令：

| 操作                                                         | 含义                  | 说明                                                 |
| ------------------------------------------------------------ | --------------------- | ---------------------------------------------------- |
| `os.system(<command>)`                                       | 执行程序或命令command | 在windows系统中，返回值为cmd的调用返回信息           |
| import os<br />os.system("C:\\Windows\\System32\\calc.exe")  | >>><br />0            | ![](https://chua-n.gitee.io/figure-bed/notebook/Python/242.png) |
| import os<br/>os.system("C:\\Windows\\System32\\mspaint.exe \<br/>D:\\PYECourse\\grwordcloud.png") | \>>><br />0           | ![](https://chua-n.gitee.io/figure-bed/notebook/Python/243.png) |

## 环境参数操作

- `os.chdir(path)`：改当前程序操作的路径

    ```python
    >>>os.chdir("D:")
    ```

- `os.listdir(path=None)`：返回当前目录下所含文件的文件名列表，随机排序

- `os.getcwd()`：返回程序的当前路径

    ```python
    >>>os.getcwd()
    'D:\\'
    ```

- `os.rename()`：重命名文件名

    ```python
    >>>os.rename(oldname, newname)
    ```

- `os.getlogin()`：获得当前系统登录用户名称

    ```python
    >>>os.getlogin()
    'Tian Song'
    ```

- `os.cpu_count()`：获得当前系统的CPU数量

    ```python
    >>>os.cpu_count()
    8
    ```

- `os.urandom(n)`：获得n个字节长度的随机字符串，通常用于加解密运算

    ```python
    >>>os.urandom(10)
    b'7\xbe\xf2!\xc1=\x01gL\xb3'
    ```

