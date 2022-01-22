## 1. 可视化

科学计算可视化的主要分类：

1. 二维标量数据场
    - 颜色映射方法
    - 等值线方法
    - 立体图法和层次分割法
2. 三维标量数据场
    - 面绘制方法(surface rendering)
    - 体绘制方法(volume rendering)
3. 矢量数据场
    - 直接法
    - 流线法(stream line)

数据集（Dateset）需包含这些特性：

-   点(point)与数据(data)：点即提供坐标，数据提供相应位置的值，相应当$data=f(x,y,z)$
-   点之间：连接 vs 非连接
-   点的连接：显式 vs 隐式
-   数据：标量(scalar) vs 矢量(vector)
-   单元(cell)：多个相关的点组成单元

![](../../resources/images/notebooks/Python/dataset_diagram.jpg)

## 2. Mayavi

VTK(Visualization Toolkit)，由 C++编写，非常优秀的三维可视化工具。VTK 的接口虽然在 Python 下有标准的绑定，但其 API 和 C++相同，不能体现出 Python 作为动态语言的优势。

TVTK(Traited VTK)，对标准 VTK 库进行的 Python 风格化的封装。

Mayavi 通过 TVTK 库来满足所有的可视化需求，其提供了一套更简易、方便和 pythonic 的接口。

Mayavi 主要有两部分组成：

1. 图形可视化和图形操作的 mlab 模块，详见 mlab 页的笔记；
2. 操作管线对象和窗口对象的 API：
    - 管线基础对象：`mayavi.core.api.<Object>`
        - `Scene`：多个数据集合 Sources
        - `Source`：数据源的基础类
        - `Filter`：对数据进行变换
        - `ModuleManager`：模块管理器节点，控制 colors and legends 等
        - `Module`：最终数据的可视化模组，如线条、平面等
        - `PipelineBase`：pipeline 中所有`Source, Filters, Modules`的基类
        - `Engine`：创建和销毁`Scenes`
    - 主视窗和 UI 对象:
        - `DecoratedScene`
        - `MayaviScene`
        - `SceneEditor`
        - `MlabSceneModel`
        - `EngineView`
        - `EngineRichView`

Mayavi 中所有的可视化对象都属于一个 `scene`，类似于 `pyplot` 里的 `Figure`，Mayavi 中的 `scene` 由 `mlab.figure()`函数创建。

Mayavi 用了像 VTK 一样的管道架构(pipeline architecture)，对于用户来说，这基本归结为一个简单的层次结构：

1. 加载数据源：Mayavi 支持的数据源格式有：VTK legacy, VTK XML, array, any other sequence；

2. 如需要，用 Filters 转换器转换数据；

3. 用 Modules 模组可视化数据。

`mayavi.mlab` 模块提供了一个像 matplotlib 的 pylab 接口一样的接口，但 mlab 用来非常方便地绘制三维可视化图形。

mlab 提供了非常适宜于脚本编程的设计，不过其未提供完全面向对象的 API。

当使用mlab进行绘图时会自动创建一个pipeline，这个pipeline可以用`mlab.show_pipeline()`命令显示出来：

```python
import numpy as np
from mayavi import mlab

a = np.random.random((4, 4))
mlab.surf(a)
mlab.show_pipeline()
```

```python
# 以上的pipeline等价于如下的过程
src = mlab.pipeline.array2d_source(a)
warp = mlab.pipeline.warp_scalar(src)
normals = mlab.pipeline.poly_data_normals(warp)
surf = mlab.pipeline.surface(normals)
```

```text
# 输出
Array2DSource
    \__ WarpScalar
            \__ PolyDataNormals
                    \__ Colors and legends
                            \__ Surface
```

mlab的绘图函数可以numpy array为输入，这个array描述了数据的x, y, z坐标。mlab的函数建立了全面可视化：

- 创建数据源
- 必要时过滤处理
- 添加可视化模组
- 可视化结果可以通过像pylab一样的关键字参数进行调整

## 3. 源数据形式

### 统述

Mayavi 支持的数据源格式有：VTK legacy, VTK XML, array, any other sequence。

TVTK 有五种数据集：

![](../../resources/images/notebooks/Python/dataset_diagram.jpg)

-   connectivity
    -   隐式连接：隐式连接认为数据是排列在一个类似晶格的结构上，每个方向的层数相等，x 先沿着数组增加，然后是 y，最后是 z
    -   显式连接
-   data
    -   标量数据/矢量数据
        -   标量数据时，可以执行获取梯度、用彩色地图显示数据等操作；
        -   矢量数据时，可以执行显示流线、显示向量、提取向量的范数等操作；
    -   point 数据/cell 数据
        -   无论标量或矢量，当数据被放置到顶点(vertex)时，叫做 point 数据，存储在 VTK 数据集的.point_data 属性中；
        -   无论标量或矢量，当数据被关联到一个 cell 时，叫做 cell 数据，存储在 VTK 数据集的.cell_data 属性中。

> Each VTK dataset is defined by vertices and cells, explicitly or implicitly.

### TVTK 数据集

|                           VTK name                           | Connectivity |        Suitable for        |                    Required information                    |
| :----------------------------------------------------------: | :----------: | :------------------------: | :--------------------------------------------------------: |
| [ImageData](http://docs.enthought.com/mayavi/mayavi/data.html#imagedata) |   Implicit   |    Volumes and surfaces    |         3D data array and spacing along each axis          |
| [RectilinearGrid](http://docs.enthought.com/mayavi/mayavi/data.html#rectilineargrid) |   Implicit   |    Volumes and surfaces    |    3D data array and 1D array of spacing for each axis     |
| [StructuredGrid](http://docs.enthought.com/mayavi/mayavi/data.html#structuredgrid) |   Implicit   |    Volumes and surfaces    |     3D data array and 3D position arrays for each axis     |
| [PolyData](http://docs.enthought.com/mayavi/mayavi/data.html#polydata) |   Explicit   | Points, lines and surfaces | x, y, z, positions of vertices and arrays of surface Cells |
| [UnstructuredGrid](http://docs.enthought.com/mayavi/mayavi/data.html#unstructuredgrid) |   Explicit   |    Volumes and surfaces    |  x, y, z positions of vertices and arrays of volume Cells  |

### TVTK 数据集样式

|                           VTK name                           |                             Demo                             |
| :----------------------------------------------------------: | :----------------------------------------------------------: |
| [ImageData](http://docs.enthought.com/mayavi/mayavi/data.html#imagedata) | ![](../../resources/images/notebooks/Python/image_data1.jpg) |
| [RectilinearGrid](http://docs.enthought.com/mayavi/mayavi/data.html#rectilineargrid) | ![](../../resources/images/notebooks/Python/rectilinear_grid1.jpg) |
| [StructuredGrid](http://docs.enthought.com/mayavi/mayavi/data.html#structuredgrid) | ![](../../resources/images/notebooks/Python/structured_grid1.jpg) |
| [PolyData](http://docs.enthought.com/mayavi/mayavi/data.html#polydata) |  ![](../../resources/images/notebooks/Python/poly_data.jpg)  |
| [UnstructuredGrid](http://docs.enthought.com/mayavi/mayavi/data.html#unstructuredgrid) | ![](../../resources/images/notebooks/Python/unstructured_grid1.jpg) |
