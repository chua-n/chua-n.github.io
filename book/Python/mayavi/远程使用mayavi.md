---
title: 远程使用mayavi
---

> 当使用SSH连接远程主机使用mayavi绘图的时候，由于mayavi的绘图机理基于OpenGL，似乎总是由于远程连接无法调用OpenGL而报错。

linux下使用`from mayavi import mlab`语句都会报错如下：

> mayavi的mlab，会在几乎每一次调用时都创建一个“python图形化进程”，包括在import引入mlab的语句中，远程无法调用openGL绘图，故而报错。

```cmd
qt.qpa.xcb: could not connect to display 
qt.qpa.plugin: Could not load the Qt platform plugin "xcb" in "" even though it was found.
This application failed to start because no Qt platform plugin could be initialized. Reinstalling the application may fix this problem.

Available platform plugins are: eglfs, linuxfb, minimal, minimalegl, offscreen, vnc, wayland-egl, wayland, wayland-xcomposite-egl, wayland-xcomposite-glx, webgl, xcb.

已放弃 (核心已转储)
```

另一种类似的情况是，也许你在本地服务器上运行python脚本，但你服务器没有显示器，此时情况同上。mayavi无法连接X服务（和OpenGL的关系尚不清楚？），尽管你想不`mlab.show()`出来你的图形，希望使用`mlab.savefig()`命令将绘制出的图形保存成.png格式后，传回个人电脑上再进行查看，但是会出现同样的报错。

解决方案是：建立一个虚拟的“显示器（X服务）”，在虚拟的服务上进行图形渲染。

1. 结合linux的xvfb-run命令运行python脚本：

    ```bash
    xvfb-run --server-args="-screen 0 1024x768x24" python my_mayavi.py
    ```

2. 通过python脚本内进行类似上述设置，需引入第三方库PyVirtualDisplay：

    ```python
    from pyvirtualdisplay import Display
    display = Display(visible=False, size=(1280, 1024))
    display.start()
    ```

注意：此时你必然无法在脚本运行的过程中看到渲染的图形，需要使用`mlab.savefig()`命令保存下来在其他地方进行查看。

- 若直接使用mlab.savefig()命令进行保存，存储下来的图片就是一个黑屏（你生成的虚拟X服务对应的黑屏）.
- 正确操作应该先把mlab.options.offscreen设置为True，才能正确地保存你的图形。故而直接在你的脚本中加入以下命令吧：

```python
from pyvirtualdisplay import Display
display = Display(visible=False, size=(1280, 1024))
display.start()

from mayavi import mlab
mlab.options.offscreen = True
```

注意：通过虚拟X服务渲染图形后，可不要再调用`mlab.show()`命令了，因为这意味着你进入和图形交互的状态，而这个“图形框”是虚拟的，你看不到摸不着，也就无法像正常那样通过关闭图形框来让`mlab.show()`命令停止了，于是你这个相应的脚本进入无限等待的阻塞状态，只有关闭相关进程才能将其终止。