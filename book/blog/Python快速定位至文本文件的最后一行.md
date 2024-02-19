---
title: Python快速定位至文本文件的最后一行
date: 2021-03-19 09:21:33
categories: python
---

编程语言在读取文本文件时总是自首行读取，因此文本开头的内容读取速度很快，那么如果文本量较大，如何快速读取文本仅最后一行呢？

> 说得一本正经，但并不是为此而生(\* ￣︿￣)。

<!-- more -->

## 1. 需求

办公室另个课题组野外项目多，经常要测各种数据，某天偶然聊到他们竟然有这样一个奇葩的需求：某仪器每次测一次数据，会得到一个含 725 份 txt 文本文件的文件夹，其中每个 txt 文本为 1000 多行、2 列的数据内容；每当仪器测出若干次数据后他们对数据进行一次分析，也就需要同时面对约二十个文件夹的近两万个 txt 文本，而他们的要求是所有的 txt 文本只取最后一行的第 2 个数字整理成 Excel 表然后做处理。

-   一个文件夹：

```shell
$ tree -l
.
├── 1.txt
├── 10.txt
├── 100.txt
├── 101.txt
├── ...
├── 96.txt
├── 97.txt
├── 98.txt
└── 99.txt

0 directories, 725 files
```

-   一个文件：

```txt
         Step Z Displace...
------------- -------------
 2.650000e+03 -3.941945e-08
 2.660000e+03 -1.150117e-07
 2.670000e+03 -1.168365e-07
 2.680000e+03 -3.220245e-07
 2.690000e+03 -2.561211e-06
      ...          ...
```

他们原本是怎么做这项工作的呢？课题组分派六、七个有闲的人，每人均分一部分工作，通过 windows 记事本打开每个 txt 文本，拖动鼠标至最后一行，然后复制粘贴相应数据到 Excel 表格中，据师兄说这样差不多要干一个通宵。

我意识到这个“固定模式的简单重复性工作”写一份代码可以完全自动化批量处理呀，于是帮师兄师姐写了份 python 脚本，师兄也把刚刚已经分配给几位师弟的文件全收回来交给我统一处理，脚本在几秒钟就做完了他们的工作。这份代码其实异常简单，寥寥几行，留之无用、弃之可惜，笔者也就权当纪念意义留在这里吧。

## 2. 代码

> 注：笔者的第一版本其实并非以下代码，原实现为暴力式搜索文本最后一行，此版源自网络，思路与性能更佳，故而也颇值得记录。

```python
import os


def find_last_line(file):
    """Find the last line of a file.

    Parameters:
    -----------
    file(str): Absolute path of a file.
    """
    with open(file, 'rb') as file_obj:
        offset = -50  # initial offset
        while True:
            file_obj.seek(offset, 2)
            lines = file_obj.readlines()
            if (len(lines) > 1):
                last_line = lines[-1]
                break
            else:
                offset *= 2
    return last_line.decode()
```

## 3. 附：完整脚本

以上仅是定位文本最后一行的函数定义，以下将为师兄处理数据的完整工作脚本作为附录。

```python
import os
import pandas as pd


def find_last_line(file):
    """Find the last line of a file.

    Parameters:
    -----------
    file(str): Absolute path of a file.
    """
    with open(file, 'rb') as file_obj:
        offset = -50  # initial offset
        while True:
            file_obj.seek(offset, 2)
            lines = file_obj.readlines()
            if (len(lines) > 1):
                last_line = lines[-1]
                break
            else:
                offset *= 2
    return last_line.decode()


def collect(folder):
    """Collect the last data from a group of data-files in a folder
    into a data structure, of pandas.Series, for later convenience.

    Parameters:
    -----------
    folder(str): Absolute path of a folder.
    """
    files = os.listdir(folder)
    files.sort(key=lambda filename: int(filename[:-4]))
    excel = []
    for file in files:
        file = os.path.join(folder, file)
        last_line = find_last_line(file)
        excel.append(last_line.split()[-1])
    excel = pd.Series(excel, index=files)
    return excel


if __name__ == "__main__":
    basefolder = "./ych"

    for folder in os.listdir(basefolder):

        folder = os.path.join(basefolder, folder)
        folder = os.path.abspath(folder)
        if os.path.isfile(folder):
            continue

        excel = collect(folder)
        excel_name = os.path.basename(folder) + '.xlsx'
        # 写入具体的excel文件
        excel.to_excel(os.path.join(basefolder, excel_name), header=None)
```
