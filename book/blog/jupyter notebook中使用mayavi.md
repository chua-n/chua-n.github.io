---
title: jupyter notebook中使用mayavi三维绘图库
date: 2020-12-08 21:09:00
categories:
    - [python, jupyter]
    - [python, mayavi]
---

就像绘图时可使把 matplotlib 嵌入 jupyter 中一样，mayavi 也可以在 jupyter notebook 中嵌入式使用。

<!-- more -->

> 注：以下假定已经安装好了 jupyter notebook 和 mayavi 库。

## 1. 安装需要的 python 依赖

```bash
pip install ipywidgets ipyevents
```

## 2. 进行设置

命令行中输入以下命令即可：

```bash
jupyter nbextension install --py mayavi --user
jupyter nbextension enable --py mayavi --user
```

## 3. 开始使用

打开 jupyter notebook，在正式开始使用 mayavi 绘图前，调用`mayavi.mlab.init_notebook()`函数即可。

```python
from mayavi import mlab
mlab.init_notebook()
```

此后，mlab 绘制出来的三维图即是内嵌于 jupyter 之中了，而且也可以用鼠标对其进行拖动旋转等操作。

![](https://chua-n.gitee.io/figure-bed/notebook/blog/jupyter%20notebook中使用mayavi/jupyter效果图.png)
