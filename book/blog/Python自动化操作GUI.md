---
title: Python自动化操作GUI
date: 2022-01-28 11:55:09
categories:
---

Python 实现对 windows 鼠标和键盘的接管，自动化 GUI 操作。

<!-- more -->

## 1. PyAutoGUI 简介

> 详细教程推荐查看文档：[Welcome to PyAutoGUI’s documentation! — PyAutoGUI documentation](https://pyautogui.readthedocs.io/en/latest/index.html) 。

[PyAutoGUI](https://github.com/asweigart/pyautogui) 接管了鼠标、键盘使用权，基本上完全仿照人的操作，底层不必套牢在 Windows 系统，因而是跨平台的。这类 GUI 自动化工具的初衷是给 GUI 程序自动化测试用，产生点击鼠标、敲击键盘的行为，在日志中记录下消息事件和 GUI 程序的响应结果，事后分析 GUI 程序可能存在的 bug。不过，既然能产生点击鼠标、敲击键盘的行为，我们就可以用来控制 GUI 程序批量完成文件编辑、保存工作。

按照官方的说法，`PyAutoGUI`给人类用的 GUI 自动化神器，简单高效、函数分类清晰，它被[awesome-python](https://link.zhihu.com/?target=https%3A//github.com/vinta/awesome-python)、[awesome-python-cn](https://link.zhihu.com/?target=https%3A//github.com/jobbole/awesome-python-cn)收录。

安装 PyAutoGUI：`py -m pip install pyautogui`。

## 2. 保护措施

Python 移动鼠标、点击键盘非常快，有可能导致其他应用出现问题。在这种情况下，程序可能会失控（即使是按照你的意思执行的），那时就需要中断。如果鼠标还在自动操作，就很难在程序窗口关闭它。

为了能够及时中断，PyAutoGUI 提供了一个保护措施：当`pyautogui.FAILSAFE = True`时，如果把鼠标光标在屏幕左上角，PyAutoGUI 函数就会产生`pyautogui.FailSafeException`异常，因此如果你的程序失控了导致需要中断 PyAutoGUI 函数，就把鼠标光标在屏幕左上角。

要禁用这个特性，就把`FAILSAFE`设置成`False`：

```
import pyautogui
pyautogui.FAILSAFE = False
```

通过把`pyautogui.PAUSE`设置成`float`或`int`时间（秒），可以为所有的 PyAutoGUI 函数增加延迟。默认延迟时间是 0.1 秒。在函数循环执行的时候，这样做可以让 PyAutoGUI 运行的慢一点，非常有用。例如：

```python
import pyautogui

pyautogui.PAUSE = 2.5

pyautogui.moveTo(100,100)
pyautogui.click()
```

所有的 PyAutoGUI 函数在延迟完成前都处于阻塞状态（blocked），PyAutoGUI 未来计划增加一个可选的非阻塞模式来调用函数。

通常建议`PAUSE`和`FAILSAFE`一起使用。

## 3. 鼠标操作

-   获取鼠标当前位置：

    ```python
    In [3]: pyautogui.position() # 获取鼠标当前位置
    Out[3]: Point(x=846, y=437)
    ```

-   移动

    -   `pyautogui.moveTo(x,y[,duration = t])`：鼠标移动到指定位置，`duration`指定移动的耗时，省略时表示立即移动
    -   `pyautogui.moveRel(x,y[,duration = t])`：鼠标相对于当前位置移动指定的偏移量

-   点击

    ```python
    # 按下鼠标按键（左键）
    pyautogui.mouseDown()

    # 释放鼠标按键（左键）
    pyautogui.mouseUp()

    # 向计算机发送虚拟的鼠标点击(click()函数只是前面两个函数调用的方便封装)
    # 默认在当前光标位置，使用鼠标左键点击，可选择在(x,y)处点击鼠标左键、右键、中键
    pyautogui.click([x,y,button='left/right/middle'])

    # 单击鼠标右键
    pyautogui.rightClick()

    # 单击鼠标中键
    pyautogui.middleClick()

    # 双击鼠标左键
    pyautogui.doubleClick()
    ```

-   拖动：按住一个键不放，同时移动鼠标

    ```python
    # 将鼠标拖动到指定位置
    pyautogui.dragTo(x,y[,duration=t])

    # 将鼠标拖动到相对当前位置的位置
    pyautogui.dragRel(x,y[,duration=t])
    ```

-   滚动：模拟鼠标划轮控制窗口上下滚动（滚动发生在鼠标的当前位置），正数表示向上滚动，负数表示向下滚动

    ```python
    pyautogui.scroll()
    ```

## 4. 键盘操作

-   输入字符串：`pyautogui.typewrite(message, interval=0.0, logScreenshot=None, _pause=True)`

    -   输入单个字符（不支持中文字符，因为函数无法知道输入法需要什么按键才能得到中文字符）：

        ```python
        >>> pyautogui.typewrite('Hello world!', 0.25)
        >>> Hello world!
        ```

    -   输入特殊字符：

        ```python
        >>> pyautogui.typewrite(['enter', 'a', 'b', 'left', 'left', 'X', 'Y'], '0.25')
        >>>
        >>> XYab
        ```

        > PyAutoGUI 键盘表：
        >
        > | 字符串                                | 键盘操作                              |
        > | ------------------------------------- | ------------------------------------- |
        > | ‘enter’(或‘return’ 或 ‘\n’)           | 回车                                  |
        > | ‘esc’                                 | ESC 键                                |
        > | ‘shiftleft’, ‘shiftright’             | 左右 SHIFT 键                         |
        > | ‘altleft’, ‘altright’                 | 左右 ALT 键                           |
        > | ‘ctrlleft’, ‘ctrlright’               | 左右 CTRL 键                          |
        > | ‘tab’ (‘\t’)                          | TAB 键                                |
        > | ‘backspace’, ‘delete’                 | BACKSPACE 、DELETE 键                 |
        > | ‘pageup’, ‘pagedown’                  | PAGE UP 和 PAGE DOWN 键               |
        > | ‘home’, ‘end’                         | HOME 和 END 键                        |
        > | ‘up’, ‘down’, ‘left’,‘right’          | 箭头键                                |
        > | ‘f1’, ‘f2’, ‘f3’….                    | F1…….F12 键                           |
        > | ‘volumemute’, ‘volumedown’,‘volumeup’ | 有些键盘没有                          |
        > | ‘pause’                               | PAUSE 键                              |
        > | ‘capslock’, ‘numlock’,‘scrolllock’    | CAPS LOCK, NUM LOCK, 和 SCROLLLOCK 键 |
        > | ‘insert’                              | INS 或 INSERT 键                      |
        > | ‘printscreen’                         | PRTSC 或 PRINT SCREEN 键              |
        > | ‘winleft’, ‘winright’                 | Win 键                                |
        > | ‘command’                             | Mac OS X command 键                   |

-   按键的按下和释放（和鼠标按键非常类似）：

    -   `pyautogui.keyDown()`：按下某个键
    -   `pyautogui.keyUp()`：松开某个键
    -   `pyautogui.press()`：一次完整的击键，前面两个函数的组合。

-   直接使用快捷键函数`hotkey`——接受多个键名参数，按传入顺序按下，再按照相反顺序释放：

    ```python
    pyautogui.hotkey('altleft', 'f4')
    ```

## 5. 消息弹窗

PyAutoGUI 利用 pymsgbox 的功能，以 JavaScript 风格函数提供消息框功能，包括以下函数，它们连参数都是一致的，熟悉 JavaScript 的朋友不会陌生。

-   `alert()`：提示框
-   `confirm()`：选择框
-   `prompt()`：普通输入
-   `password()`：密码输入

```python
In [24]: pyautogui.alert(text='警告',title='PyAutoGUI消息框',button='OK')
Out[24]: 'OK' # 点击的按键被返回

In [28]: pyautogui.confirm(text='请选择',title='PyAutoGUI消息框',buttons=['1','2'
    ...: ,'3'])
Out[28]: '2' # 点击的按键被返回

In [30]: pyautogui.prompt(text='请输入',title='PyAutoGUI消息框',default='请输入')
Out[30]: 'input by 伪码人' # 点OK按钮后返回输入内容

In [32]: pyautogui.password(text='输入密码',title='PyAutoGUI消息框',default='',mask='*')
Out[32]: 'We_Coder' # 点OK按钮后返回输入内容
```

## 6. 屏幕处理

有时我们需要监控屏幕上的内容，从而决定要不要进行对应的操作，pyautogui 提供了一些相关的方法。

-   获取屏幕尺寸：

    ```python
    In [2]: pyautogui.size()  # 获取屏幕尺寸（分辨率×分辨率）
    Out[2]: Size(width=1920, height=1080)
    ```

-   判断坐标是否在屏幕范围内：

    ```python
    In [4]: pyautogui.onScreen(100,200) # 判断坐标是否在屏幕范围内
    Out[4]: True

    In [5]: pyautogui.onScreen(100,2000) # 判断坐标是否在屏幕范围内
    Out[5]: False
    ```

-   获取屏幕截图：`screenshot()`，可以返回一个 Pillow 的`Image`对象。

    ```python
    import pyautogui

    im = pyautogui.screenshot()

    # 获得某个坐标的像素
    im.getpixel((50, 200)) # (30, 132, 153)

    # 判断屏幕坐标的像素是不是等于某个值
    pyautogui.pixelMatchesColor(50, 200, (30, 132, 153))  # True
    ```

-   图片匹配：在屏幕按像素匹配，定位图片在屏幕上的坐标位置

    -   `locateOnScreen(*args, **kwargs)`：返回`Box`对象，即左上角坐标、宽度、高度 4 个值组成的元组；若未找到返回`None`。

        ```python
        In [30]: shot = pyautogui.screenshot(region=(0, 270, 170, 200))

        In [31]: shot.show()

        In [32]: res = pyautogui.locateOnScreen(shot);res
        Out[32]: Box(left=0, top=270, width=170, height=200)

        In [33]: pyautogui.center(res) # 可用`center()`函数计算出中心坐标。
        Out[33]: Point(x=85, y=370)
        ```

    -   `locateCenterOnScreen`：一步到位，返回中心坐标。

    -   `locateAllOnScreen`：找到所有匹配的位置。

## 7. 示例

```python
import time
import sys
import os

import pyautogui

import keyboard
from tqdm import trange


def getMousePositon():
    """获取鼠标位置"""
    time.sleep(5)  # 准备时间
    print("-------开始获取鼠标位置-------")
    try:
        for i in range(10):
            # Get and print the mouse coordinates.
            x, y = pyautogui.position()
            positionStr = f"鼠标坐标点：(x, y)= ({str(x).rjust(4)}, {str(y).rjust(4)}), "
            pix = pyautogui.screenshot().getpixel((x, y))  # 获取鼠标所在屏幕点的RGB颜色
            positionStr += f"该位置的颜色：RGB = ({str(pix[0]).rjust(3)}, {str(pix[1]).rjust(3)}, {str(pix[2]).rjust(3)})"
            print(positionStr)
            time.sleep(0.5)  # 停顿时间
    except:
        print('获取鼠标位置失败')


def task(times=1):
    folder = "./steps"
    if not os.path.isdir(folder):
        os.mkdir(folder)
    filenames = os.listdir(folder)
    filenames.sort()
    maxNum = int(filenames[-1][:-4]) if len(filenames) > 0 else 0
    initPosition = (697, 1428)
    x, y = initPosition
    for i in trange(times):
        pyautogui.moveTo(x, y)
        pyautogui.click()
        pyautogui.hotkey("alt", "enter")
        pyautogui.screenshot(f"{folder}/{str(maxNum + i + 1).zfill(4)}.png",
                             region=(0, y - 250, 1000, 600))
        pyautogui.press(keys=["up", "enter"])
        # time.sleep(0.5)  # 停顿时间


def callback(keyboardEvent):
    if (keyboardEvent.event_type == "esc"):
        print("-----------------------")
        print(keyboardEvent)
        # raise SystemError("主动终止程序!")
        sys.exit()


if __name__ == "__main__":
    keyboard.hook(callback)
    # keyboard.wait()
    # getMousePositon()
    task(20)
```

![](https://chua-n.gitee.io/figure-bed/notebook/blog/python自动化操作GUI/pyautogui.gif)
