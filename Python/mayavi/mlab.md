## 1. mlab 绘图函数

mlab 的绘图函数：

| data 维度 | 绘图函数            | 函数描述                                                     |
| :-------: | ------------------- | ------------------------------------------------------------ |
|    0D     | `points3d()`        | 基于 array 类型的 x, y, z 提供的三维点坐标（x, y, z 的形状必须相同），绘制离散点 |
|    1D     | `plot3d()`          | 基于 1-d array 类型的 x, y, z 提供的三维坐标，绘制线图形     |
|    2D     | `imshow()`          | 将 2-d array 可视化为一张图像                                |
|    2D     | `surf()`            | 将 2-d array 可视化为"表面图"(carpet plot)，以 z 轴代表点的高度 |
|    2D     | `contour_surf()`    | 将 2-d array 可视化为等高线，高度值由相应位置的数值表示      |
|    2D     | `mesh()`            | 由 3 个 2-d array 类型的 x, y, z 提供的三维坐标，绘制网络表面图 |
|    2D     | `barchart()`        | 参数看 help，绘制三维柱状图                                  |
|    2D     | `triangular_mesh()` | 参数看 help，绘制三角网络面                                  |
|    3D     | `contour3d()`       | 由 3-d array 绘制等值面                                      |
|    3D     | `quiver3d()`        | 参数看 help，绘制矢量数据的箭图                              |
|    3D     | `flow()`            | 由 3 个 3-d array 表示的网络上的 u, v, w 分量绘制粒子在矢量场的轨迹图 |
|    3D     | `volume_slice()`    | 参数看 help，绘制切割体数据的交互式平面                      |

注意事项：

1. 在用 `surf()`和 `contour_surf()`函数时，z 轴的单位长度默认和 x, y 轴相同，但可以通过设置 `warp_scale` 参数来调整，当设置为 `warp_scale='auto'`时，纵横比将被定为 2/3.
2. 只知道点的位置信息不足以定义一个平面，还需要知道点的连接(connectivity)信息。
    - 当使用 `surf()`和 `mesh()`函数时，连接信息隐式地从输入数组的形状中提取，即 "neighboring data points in the 2D input arrays are connected, and the data lies on a grid".
    - 当使用 `triangular_mesh()`函数时，……
3. 结构化与非结构化数据：`contour3d(), volume_slice(), flow()`函数需要输入有序的数据（以便能够在点之间插值），而 `quiver3d()` 则没有限制。详细信息查看每个函数的文档。

外观展示的参数设置：

| 参数           | 含义                          | 补充说明                                                                                                                                                                                                                                                                                                                                                                                          |
| -------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `colormap`     | 颜色风格                      | accent flag hot pubu set2 autumn gist_earth hsv pubugn set3 black-white gist_gray jet puor spectral blue-red gist_heat oranges purd spring blues gist_ncar orrd purples summer bone gist_rainbow paired rdbu winter brbg gist_stern pastel1 rdgy ylgnbu bugn gist_yarg pastel2 rdpu ylgn bupu gnbu pink rdylbu ylorbr cool gray piyg rdylgn ylorrd copper greens prgn reds dark2 greys prism set1 |
| `color`        | VTK 对象的颜色                | 定义为(0, 1)的三元组，如果存在的话会覆盖掉 colormap 的设置                                                                                                                                                                                                                                                                                                                                        |
| `mask_points`  | 减少/降低大规模点数据集的数量 |                                                                                                                                                                                                                                                                                                                                                                                                   |
| `resolution`   | glyph 的分辨率                | 如球的细分数，该值点整型，默认为 8                                                                                                                                                                                                                                                                                                                                                                |
| `scale_factor` | 点(glyph)的缩放比例           |                                                                                                                                                                                                                                                                                                                                                                                                   |
| `scale_mode`   | 符号的缩放模式                | 如，vector, scalar, none                                                                                                                                                                                                                                                                                                                                                                          |
| …              | ……                            | ……                                                                                                                                                                                                                                                                                                                                                                                                |

gallery：

![](https://chua-n.gitee.io/blog-images/notebooks/Python/569.png)

> [advanced mlab examples](http://docs.enthought.com/mayavi/mayavi/auto/examples.html)

## 2. mlab 控制函数

图形控制函数：

-   `figure`：创建一个新 scene 或者取回一个已存在的 scene

    ```python
    mayavi.mlab.figure(figure=None, bgcolor=None, fgcolor=None, engine=None, size=(400, 350))
    ```

    | 参数    | 说明                                                                            |
    | ------- | ------------------------------------------------------------------------------- |
    | figure  | figure 的名字或句柄 handle                                                      |
    | bgcolor | 背景的颜色                                                                      |
    | fgcolor | 前景的颜色，即所有文本注释标签的颜色(axes, orientation axes, scalar bar labels) |
    | engine  | 控制图像的 mayavi 引擎                                                          |
    | size    | 创建出的 scene 的像素尺寸                                                       |

-   `clf`：清空当前图像

    ```python
    mlab.clf(figure=None)
    ```

-   `close`：关闭图像窗口，`mlab.close(scene=None, all=False)`

    | 参数            | 说明                         |
    | --------------- | ---------------------------- |
    | close()         | 关闭当前图像                 |
    | close(num)      | 关闭编号为 num 的图像        |
    | close(name)     | 关闭名字为 name 的图像       |
    | close(figure)   | 关闭某个 figure(scence 实例) |
    | close(all=True) | 关闭 mlab 控制的所有图像     |

-   `draw`：强制重新绘制当前图像，`mlab.draw(figure=None)`

-   `gcf`：返回当前图像的 handle，`mlab.gcf(figure=None)`

-   `savefig`：存储当前图像，输出为 png, jpb, bmp, tiff…

    ```python
    mlab.savefig(filename, size=None, figure=None, magnification='auto', **kwargs)
    ```

    | 参数            | 说明                                                         |
    | --------------- | ------------------------------------------------------------ |
    | `size`          | 除非设置了 `magnification`，否则就设置为用于呈现的窗口的尺寸 |
    | `figure`        | 要保存的 `scene` 实例                                        |
    | `magnification` | 放大率                                                       |

-   `screenshot`：将当前图形的像素映射作为数组返回，`mlab.screenshot(figure=None, mode='rgb', antialiased=False)`

    | 参数          | 说明              |
    | ------------- | ----------------- |
    | `figure`      |                   |
    | mode``        | `{'rgb', 'rgba'}` |
    | `antialiased` | `{True, False}`   |

-   `sync_camera`：在参考图的摄像机上同步目标图的摄像机，`mlab.sync_camera(reference_figure, target_figure)`

-   `text`：给图像添加文本，`mlab.text(*args, **kwargs)`

-   `text3d`：添加文本到当前 scene 中的 3D 位置，`mlab.text3d(*args, **kwargs)`

-   `title`：给图像建立标题，`mlab.title(*args, **kwargs)`

图形装饰函数：

| 函数        | 说明                               | 示例                                                         |
| ----------- | ---------------------------------- | ------------------------------------------------------------ |
| `colorbar`  | 为给定对象的颜色映射增加颜色条     | mlab.colorbar(object=None, title=None, orientation=None, nb_labels=None, nb_colors=None, label_fmt=None) |
| `scalarbar` | 为给定对象的标量颜色映射增加颜色条 | mlab.scalarbar(object=None, title=None, orientation=None, nb_labels=None, nb_colors=None, label_fmt=None) |
| `vectorbar` | 为给定对象的矢量颜色映射增加颜色条 | mlab.vectorbar(object=None, title=None, orientation=None, nb_labels=None, nb_colors=None, label_fmt=None) |
| `xlabel`    | 建立坐标轴，并添加 x 轴的标签      | mlab.xlabel(text, object=None)                               |
| `ylabel`    | 建立坐标轴，并添加 y 轴的标签      |                                                              |
| `zlabel`    | 建立坐标轴，并添加 z 轴的标签      |                                                              |

相机控制函数：

-   `move`：同时移动相机和焦点，返回`(camera_position, focal_point_position)` 或 `None`。

    ```python
    mlab.move(forward=None, right=None, up=None)
    ```

    | 参数      | 数据类型        | 说明                                           |
    | --------- | --------------- | ---------------------------------------------- |
    | `forward` | float, optional | 将相机向前（正数）或向后（负数）移动的空间距离 |
    | `right`   | float, optional | 将相机向右（正数）或向左（负数）移动的空间距离 |
    | `up`      | float, optional | 将相机向上（正数）或向下（负数）移动的空间距离 |

-   `view`：设置/获取当前视图中相机的视点

    ```python
    mlab.view(azimuth=None, elevation=None, distance=None, focalpoint=None, roll=None, reset_roll=True, figure=None)
    ```

-   `pitch`：沿着当前视角的右轴旋转摄像机。`mlab.pitch(degrees)`

-   `yaw`：沿着当前视角的上轴旋转摄像机。`mlab.yaw(degrees)`

-   `roll`：设置/返回相机的绝对滚角(roll angle)。`mlab.roll(roll=None, figure=None)`

其他函数：

| 函数            | 说明                      | 示例                                        |
| --------------- | ------------------------- | ------------------------------------------- |
| `animate`       | 动画控制函数              | mlab.animate(func=None, delay=500, ui=True) |
| `axes`          | 为当前/给定对象设置坐标轴 | mlab.axes(\*args, \*\*kwargs)               |
| `outline`       | 为当前/给定对象建立外轮廓 | mlab.outline(\*args, \*\*kwargs)            |
| `show`          | 与当前图像开始交互        | mlab.show(func=None, stop=False)            |
| `show_pipeline` | 显示 mayavi 的管线对话框  |                                             |

mayavi 的`mlab`，会在几乎每一次调用（包括`imoprt`时）都创建一个 python“图形化”进程，即便设置了`mlab.options.offscreen=True`也会创建“图形化”进程，只不过这时没有显示出窗口，但这个进程的属性仍然是“图形化”属性，这会试图调用 OpenGL 相关的一个包来进行渲染（虽然不显示出来，但是例如投影射线等操作还是需要进行渲染计算的）[reference](https://www.cnblogs.com/QingHuan/p/9419749.html)。

## 3. mlab.pipeline

> For each Mayavi module or filter (see Modules and Filters), there is a corresponding mlab.pipeline function. The name of this function is created by replacing the alternating capitals in the module or filter name by underscores. Thus ScalarCutPlane corresponds to scalar_cut_plane.

mlab提供了一个子模块pipeline，其提供了一些能在脚本中轻松构成pipeline的函数：

- mlab.pipeline
- mayavi.tools.pipeline

相较于mlab的主要接口，mlab.pipeline中的函数可以通过Mayavi管道对图形进行更精细化的控制。

详见[此](http://docs.enthought.com/mayavi/mayavi/mlab_pipeline_reference.html)：

![](https://chua-n.gitee.io/blog-images/notebooks/Python/570.png)
