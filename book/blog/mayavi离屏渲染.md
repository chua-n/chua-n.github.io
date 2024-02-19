---
title: mayavi离屏渲染
date: 2020-12-07 15:33:00
categories: [python, mayavi]
---

有时我们使用 mayavi 绘制一个 3D 图形，不需要在前台进行图形展示，而只是想随着程序的执行批量保存一些图片，这时候就需要配置好 mayavi 的后台离屏渲染功能了，以便关停烦人的图像弹窗。

<!-- more -->

## 1. `mlab.options.offscreen` 之坑

mayavi 虽然提供有一个直接的选项`mlab.options.offscreen`可以打开/关闭离屏渲染，但在实测中非常难用，linux 下在 python 脚本中设置`mlab.options.offscreen = True`根本不奏效。

笔者参照 [mayavi 官方文档](http://docs.enthought.com/mayavi/mayavi/tips.html?highlight=offscreen)进行了大量尝试，最后在这里总结出比较好用的方案。

## 2. 关闭渲染弹窗

解决方案是：建立一个虚拟的“显示器（X 服务）”，在虚拟的服务上进行图形渲染。具体地，可以有两种选择：

1. 结合 linux 的 xvfb-run 命令运行编写好的 python 脚本：
    ```bash
    # xvfb-run ... x24"会开启一个相应分辨率的虚拟屏幕
    # 后面再结合一个具体的命令便可在开启的虚拟屏幕上运行该命令
    # 这里执行的便是让python运行一个mayavi绘图脚本的命令
    xvfb-run --server-args="-screen 0 1024x768x24" python my_mayavi.py
    ```
2. 通过 python 脚本内部进行类似上述设置，此时需引入第三方库 PyVirtualDisplay：
    ```python
    from pyvirtualdisplay import Display
    # 开启一个分辨率为1280*1024的虚拟屏幕
    display = Display(visible=False, size=(1280, 1024))
    # 启动该屏幕
    display.start()
    ```

此后必然无法再在脚本运行的过程中看到渲染的图形弹窗，需要使用`mlab.savefig()`命令把后台渲染出的图像保存下来再在其他地方进行查看。

## 3. 推荐方案

这里推荐解决方案中的第 2 种，因为其更通用也更优雅和方便。不过，仅仅进行上述设置会导致`mlab.savefig()`命令存储下来的图片就是一个黑屏（你生成的虚拟 X 服务对应的黑屏），正确操作应该同时把 mlab.options.offscreen 设置为 True，才能正确地保存你的图形。所以，干脆直接在脚本中加入以下命令吧：

```python
from pyvirtualdisplay import Display
display = Display(visible=False, size=(1280, 1024))
display.start()
from mayavi import mlab
mlab.options.offscreen = True
```

为了方案的“移值性”更强，建议直接将上述命令保存成一个 python 模块，以后每次希望离屏渲染时从这个模块中导入 mlab，不希望离屏渲染时则仍旧从 mayavi 中导入 mlab。如，笔者将其打包为`mayaviOffScreen.py`文件，并添加了一些注释：

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

以后每次需要离屏渲染时，把这个文件复制到项目文件夹，然后使用`from mayaviOffScreen import mlab`命令代替正常情况下的`from mayavi import mlab`即可。

## 4. 注意事项

1. 在具体执行 mayavi 绘图脚本时，可能你导入的其他模块（`import othermodule`）中事实上存在`from mayavi import mlab`语句，如果在你的执行脚本中`import othermodule`语句先于`from mayaviOffScreen import mlab`出现，那么依然会导致离屏渲染失败。因此，最好令这条离屏渲染语句`from mayaviOffScreen import mlab`作为你的执行模块的第一条语句。
2. 通过虚拟 X 服务渲染图形后，可不要再调用`mlab.show()`命令了，因为这意味着你进入和图形交互的状态，而这个“图形框”是虚拟的，你看不到摸不着，也就无法像正常那样通过关闭图形框来让`mlab.show()`命令停止了，于是你这个相应的脚本进入无限等待的阻塞状态，只有关闭相关进程才能将其终止。
