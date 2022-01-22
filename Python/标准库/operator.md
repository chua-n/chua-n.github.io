关于operator标准库：

> \>>> help(operator)
>
> Help on module operator:
>
>  
>
> NAME
>
>   operator - Operator interface.
>
>  
>
> DESCRIPTION
>
>   This module exports a set of functions implemented in C corresponding
>
>   to the intrinsic operators of Python. For example, operator.add(x, y)
>
>   is equivalent to the expression x+y. The function names are those
>
>   used for special methods; variants without leading and trailing
>
>   '__' are also provided for convenience.
>
>  
>
> CLASSES
>
>   builtins.object
>
> ​    attrgetter
>
> ​    itemgetter
>
> ​    methodcaller

通过operator模块的`itemgetter()`函数，可以非常容易地根据关键字排序字典列表：

| 操作                                                 | 说明                                                         |
| ---------------------------------------------------- | ------------------------------------------------------------ |
| ![](https://chua-n.gitee.io/blog-images/notebooks/Python/262.png) | ![](https://chua-n.gitee.io/blog-images/notebooks/Python/263.png)         |
| ![](https://chua-n.gitee.io/blog-images/notebooks/Python/264.png) | `itemgetter()`函数也支持多个keys                             |
| ![](https://chua-n.gitee.io/blog-images/notebooks/Python/265.png) | `itemgetter()`有时候也可以用lambda表达式替代；<br/> 这种方案不错，但是`itemgetter()`方式会稍快一点。 |
| ![](https://chua-n.gitee.io/blog-images/notebooks/Python/266.png) | 其实，`itemgetter()`操作也适用于`min()`和`max()`函数         |

`operator.methodcaller()`函数可通过字符串形式的方法名称调用某个对象的对应方法。见“类”页面笔记。