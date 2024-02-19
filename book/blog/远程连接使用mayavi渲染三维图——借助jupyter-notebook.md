---
title: 在远程服务器中使用mayavi渲染三维图——借助jupyter notebook
date: 2021-02-01 19:26:56
categories:
    - [python, jupyter]
    - [python, mayavi]
---

mayavi 库基于 opengl 绘制三维图，似乎凡是通过 opengl 调用 GPU 进行图像渲染的相关功能在远程连接中都无法使用，SSH 与 linux 的连接如是，win10 的远程桌面连接亦如是，曾经在 2020 年寒假使用服务器工作时深受其害，至 2021 年寒假竟然碰巧发现一些窍门可以正常使用 mayavi 了。

> 注：本文说的“远程正常使用 mayavi”指其能正常渲染展示 3D 图（使用鼠标可以拖动至各个视角查看），如果只是希望能够保存 mayavi 绘制出的图片为 png 文件，不需要前台的 3D 展示，参考另一篇[博文](https://www.chua-n.com/2020/12/07/mayavi离屏渲染/)。

<!-- more -->

## 1. 一般情况下的报错

若不进行任何操作，在 ssh 连接下的服务器命令行中，进入 python 其至都无法导入 mayavi 的 mlab，更别提绘图了：

```bash
chuan@zwgroup-1080ti:~/soil$ python
Python 3.7.9 (default, Aug 31 2020, 12:42:55)
[GCC 7.3.0] :: Anaconda, Inc. on linux
Type "help", "copyright", "credits" or "license" for more information.
>>> from mayavi import mlab
qt.qpa.xcb: could not connect to display
qt.qpa.plugin: Could not load the Qt platform plugin "xcb" in "" even though it was found.
This application failed to start because no Qt platform plugin could be initialized. Reinstalling the application may fix this problem.

Available platform plugins are: eglfs, linuxfb, minimal, minimalegl, offscreen, vnc, wayland-egl, wayland, wayland-xcomposite-egl, wayland-xcomposite-glx, webgl, xcb.

已放弃 (核心已转储)
```

> 注 1：mayavi 的 mlab，会在几乎每一次调用时都创建一个“python 图形化进程”，包括在 import 引入 mlab 的语句中，远程无法调用 openGL 绘图，故而报错。
>
> 注 2：另一种类似的情况是，也许你在本地服务器上运行 python 脚本，但你服务器没有显示器，此时情况同上。mayavi 无法连接 X 服务（和 OpenGL 的关系尚不清楚？），尽管你想不`mlab.show()`出来你的图形，希望使用`mlab.savefig()`命令将绘制出的图形保存成.png 格式后，传回个人电脑上再进行查看，但是会出现同样的报错。

也在 mayavi 官方文档[这里](http://docs.enthought.com/mayavi/mayavi/tips.html?highlight=offscreen)尝试了很多解决方案，但无甚效果。

即使使用 jupyter notebook 导入 mlab，也会把其服务搞挂掉：

![jupyter挂掉](https://chua-n.gitee.io/figure-bed/notebook/blog/远程连接使用mayavi渲染三维图——借助jupyter-notebook/jupyter挂掉.png)

## 2. 解决方案 1

巧合的是，离校前我在服务器的主机上就地操作时，开启了一个 tmux 终端服务(见[常用 linux 命令杂记](https://www.chua-n.com/2021/01/15/常用linux命令杂记/))，在这个 tmux 终端中我意外开启了 jupyter-notebook 服务，jupyter 竟然能正常渲染出 mayavi 的三维图了！

```shell
chuan@zwgroup-1080ti:~/soil$ jupyter-notebook
[I 20:09:54.166 NotebookApp] 启动notebooks 在本地路径: /home/chuan/soil
[I 20:09:54.166 NotebookApp] Jupyter Notebook 6.1.5 is running at:
[I 20:09:54.166 NotebookApp] http://[ipAddress]:8888/
```

![jupyter成功使用mayavi](https://chua-n.gitee.io/figure-bed/notebook/blog/远程连接使用mayavi渲染三维图——借助jupyter-notebook/jupyter成功使用mayavi.png)

但这个 tmux 终端是我在服务器主机上本地开启的，现在我在远程连接中再开一个新的 tmux 终端并开启 jupyter-notebook 服务时，导入 mlab 依然会挂掉 jupyter 服务。因而推测：**在远程连接中调用一些系统命令时，跟在本地调用相同命令时被系统授予的权限是不同的**，尽管我可以在远程连接中新开一个 tmux，但这个 tmux 没有权限连接 X 服务（无法渲染基于 opengl 的 3D 图像），而本地开启的 tmux 则拥有相关权限。

因此，若希望在远程中仍然可以正常使用 mayavi，在离开服务前先在服务器中开启一个 tmux 终端服务吧，不妨将它命名为“mayavi”，然后等需要的时候在其中开启 jupyter 服务：

```bash
tmux new -n mayavi  # 需在服务器本机上输入这条命令
jupyter-notebook  # 无所谓何时开启Jupyter服务
```

那么如果我无法去到服务器所在地，无法开启所需的 tmux 终端呢？那就试试[方案 2](#jump) 吧。

## <span id="jump">3. 解决方案 2</span>

此方案实际是 mayavi 离屏渲染方法的一体两面，参见[此篇博文](https://www.chua-n.com/2020/12/07/mayavi离屏渲染/)创建一个 `mayaviOffScreen.mlab` 代替你需要的 `mayavi.mlab` 吧：

```python
"""Render the mayavi scene off screen.

When you don't need display the mayavi scene while running python scripts,
importing `mlab` from this module is recommended, i.e.,

from mayaviOffScreen imoprt mlab

Notes:
-------
    1. If you are using mayavi from remote host by SSH, etc, you must
        import `mlab` from this module. Or something wrong happens!
    2. Under the circumstance above, if you need import some other modules meanwhile
        and those modules import `mlab` as well in themselves, make sure the sentence
        `from mayaviOffScreen import mlab` appears before `import otherModule`!
        So that `mayaviOffScreen.mlab` covers `otherModule.mlab`.
"""
from pyvirtualdisplay import Display

display = Display(visible=False, size=(1280, 1024))
display.start()

from mayavi import mlab
mlab.options.offscreen = True
print("Set mlab.options.offscreen={}".format(mlab.options.offscreen))

```

因为即使把 mayavi 的离屏渲染功能打开，jupyter 仍然会捕捉到 mayavi 的图像，于是，只要把方案 1 中的第一句`from mayavi import mlab`替换为`from mayaviOffScreen import mlab`便可以像方案 1 一样在 jupyter 中正常渲染 mayavi 图形。
