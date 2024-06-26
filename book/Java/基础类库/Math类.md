---
title: Math类
---

`Math` 类是一个工具类，它的构造器被定义成`private`的，因此无法创建`Math`类的对象。

`Math`类中的所有方法都是类方法。在`Math`类中，为了达到最佳的性能，所有的方法都使用计算机浮点单元中的例程。如果得到一个完全可预测的结果比运行速度更重要的话，那应该选择`StrictMath`类而不是`Math`类。

`Math` 类提供了两个类变量，`PI`和`E`，分别代表 $\pi$ 和 $e$。

|     常用Math方法     |                    作用                    |
| :------------------: | :----------------------------------------: |
|       floor()        |       取整，小于等于目标数的最大整数       |
|        ceil()        |       取整，大于等于目标数的最小整数       |
|       round()        |                四舍五入取整                |
|        abs()         |                   绝对值                   |
|     max(x1,  x2)     |                  找最大值                  |
|     min(x1,  x2)     |                  找最小值                  |
|       random()       |           [0, 1)之间的一个随机数           |
|      pow(a,  b)      |                  a的b次幂                  |
|        sqrt()        |                  开平方根                  |
|        cbrt()        |                  开立方根                  |
|        exp()         |                  e的n次幂                  |
|        log()         |                  自然对数                  |
|       log10()        |               底数为10的对数               |
|       log1p()        |           参数与1之和的自然对数            |
|  cos()/sin()/tan()   |             三角余弦/正弦/正切             |
| cosh()/sinh()/tanh() |             双曲余弦/正弦/正切             |
| acos()/asin()/atan() |            反三角余弦/正弦/正切            |
|     toDegrees()      |                 弧度变角度                 |
|     toRadians()      |                 角度变弧度                 |
|       atan2()        |   将矩形坐标(x,y)转换成极坐标(r, theta)    |
|   IEEEremainder()    | 根据IEEE 754的规定，对两个参数进行余数运算 |

Math类提供了一些方法使整数有更好的运算安全性。
