---
title: 使用 python 绘制不同尺寸的球——利用Mayavi库
date: 2020-12-22 08:11:00
categories:
    - [python, mayavi]
---

“万恶”的 mayavi 库，琢磨了老半天，才弄清楚怎么根据给定的球心坐标和半径批量绘制出三维空间的球。

<!-- more -->

## 1. 思路

mayavi 的 mlab 类似 matplotlib 的 pyplot, 其中`points3d`函数用来绘制一些三维空间的离散点，在实际情况中，一个点必然需要一种“表示方式”，在`points3d`函数中，提供了`"sphere", "point", "cylinder", "cone", "cube", "2darrow", "2dcircle"`等很多模式，即用“球、点、圆柱、圆锥、方块、二维箭头、二维圆”等来表示一个点，当选择`"point"`时，往往可能由于点的可视感太低而显示出来的结果“啥都没有”，所以此函数默认的图例模式为`"sphere"`。由此引发感想，若可控制每个球的大小，那么不就可以用这些球来表示出自己想画的一些球了嘛。

于是通过研究`mlab.points3d()`函数发现，可以传入若干球的球心坐标对应的`x,y,z`，以及相应的半径`r`，然后设置好`scale_factor`、`resolution`、`mode`参数即可。这三个参数和`r`参数的说明如下：

1. `scale_factor`：缩放因子，mayavi 的[官方文档](http://docs.enthought.com/mayavi/mayavi/auto/mlab_helper_functions.html#mayavi.mlab.points3d)说得很含糊，其到底怎么发挥作用的完全没有说清楚，这里经过多次试验总结为：将其设置为`scale_factor=1`的话，即会按传入的“大小参数”`r`进行一比一缩放，这个参数可视为不存在。
2. `resolution`：每一个点（球）的解析度/分辨率，为整数，默认值为 8，默认值为 8 时可明显看出用球表示点时球有“棱角”，这里将其设置为 30。
   ![](https://chua-n.gitee.io/figure-bed/notebook/blog/python绘制三维球/1.png)
   ![](https://chua-n.gitee.io/figure-bed/notebook/blog/python绘制三维球/2.png)
    > 观察这里的坐标，显然，`resolution`参数还会一定程度上影响计算的精度吧，毕竟表面是计算后渲染出来的！咳，这点以后再说吧，目前只是需要绘制图形效果。
3. `mode`：其实可以不设置，默认情况即是用 sphere 作为点的的图例，这里拿出来只是作为强调，应该设置为`mode="sphere"`。
4. `r`：按照官方文档，严格来说这不是`r`参数，其形参名为`s`，但不管叫什么，它就是表示`points3d`函数绘制出来的点的大小的一个参数。这里经过多次试验，发现它的数值表示的“大小含义”，对于`mode="sphere"`来说就是球的直径，对于`mode="cube"`来说就是立方体的边长，对于`mode="cone"`来说就是圆锥的高，对于`mode="cylinder"`来说就是圆柱的高。概括而言，在内部实现中，这种对应关系是否有统一理论指导其代码实现尚不得而知。

## 2. 解决方案

这样绘制你的球：`mlab.points3d(x, y, z, r*2, scale_factor=1, resolution=30)`

## 3. 示例

设置一个位于原点的单位球，然后在其上、下、左、右、前、后再各放置 1 个球，检验他们的相切情况。

```python
import numpy as np
from mayavi import mlab


points = np.array([[0, 0, 0, 1],
                   [4, 0, 0, 3],
                   [-4, 0, 0, 3],
                   [0, 2, 0, 1],
                   [0, -2, 0, 1],
                   [0, 0, 2, 0.5],
                   [0, 0, -2, 0.5]])

x, y, z, r = points[:, 0], points[:, 1], points[:, 2], points[:, 3]

mlab.points3d(x, y, z, r*2, scale_factor=1, resolution=30, mode="sphere")
mlab.outline()
mlab.axes()
mlab.show()
```

![](https://chua-n.gitee.io/figure-bed/notebook/blog/python绘制三维球/3.png)
![](https://chua-n.gitee.io/figure-bed/notebook/blog/python绘制三维球/4.png)
![](https://chua-n.gitee.io/figure-bed/notebook/blog/python绘制三维球/5.png)

## 4. 附录

### 4.1. 我本来想要画的球堆积颗粒模型：

![](https://chua-n.gitee.io/figure-bed/notebook/blog/python绘制三维球/6.png)

### 4.2. 原本我采用的绘球函数：

若要在一张图上绘制很多球的话，这种方式只能使用 for 循环一个球一个球地进行绘制，效率比较低，硬件成本也比较高。也是为此一直在研究`points3d`函数的。

```python
import random
import numpy as np


class Plotter:
    random.seed(3.14)

    @classmethod
    def randomColor(cls):
        color = (random.random(), random.random(), random.random())
        return color

    @classmethod
    def sphere(cls, center, radius, nPoints=100, opacity=1.0, color=None):
        """Draw a sphere according to given center and radius.

        Parameters:
        -----------
        center(tuple): (x, y, z) coordinate
        radius(float): radius of the sphere
        """
        u = np.linspace(0, 2 * np.pi, nPoints)
        v = np.linspace(0, np.pi, nPoints)
        x = radius * np.outer(np.cos(u), np.sin(v)) + center[0]
        y = radius * np.outer(np.sin(u), np.sin(v)) + center[1]
        z = radius * np.outer(np.ones(np.size(u)), np.cos(v)) + center[2]
        from mayavi import mlab
        color = cls.randomColor() if color is None else color
        scene = mlab.mesh(x, y, z, color=color, opacity=opacity)
        return scene
```
