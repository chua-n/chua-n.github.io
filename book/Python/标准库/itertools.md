---
title: itertools
---

关于itertools标准库：

> \>>> help(itertools)
>
> Help on built-in module itertools:
>
>  
>
> NAME
>
>   itertools - Functional tools for creating and using iterators.
>
>  
>
> DESCRIPTION
>
>   Infinite iterators:
>
>   count(start=0, step=1) --> start, start+step, start+2*step, ...
>
>   cycle(p) --> p0, p1, ... plast, p0, p1, ...
>
>   repeat(elem [,n]) --> elem, elem, elem, ... endlessly or up to n times
>
>  
>
>   Iterators terminating on the shortest input sequence:
>
>   accumulate(p[, func]) --> p0, p0+p1, p0+p1+p2
>
>   chain(p, q, ...) --> p0, p1, ... plast, q0, q1, ...
>
>   chain.from_iterable([p, q, ...]) --> p0, p1, ... plast, q0, q1, ...
>
>   compress(data, selectors) --> (d[0] if s[0]), (d[1] if s[1]), ...
>
>   dropwhile(pred, seq) --> seq[n], seq[n+1], starting when pred fails
>
>   groupby(iterable[, keyfunc]) --> sub-iterators grouped by value of keyfunc(v)
>
>   filterfalse(pred, seq) --> elements of seq where pred(elem) is False
>
>   islice(seq, [start,] stop [, step]) --> elements from
>
> ​      seq[start:stop:step]
>
>   starmap(fun, seq) --> fun(*seq[0]), fun(*seq[1]), ...
>
>   tee(it, n=2) --> (it1, it2 , ... itn) splits one iterator into n
>
>   takewhile(pred, seq) --> seq[0], seq[1], until pred fails
>
>   zip_longest(p, q, ...) --> (p[0], q[0]), (p[1], q[1]), ...
>
>  
>
>   Combinatoric generators:
>
>   product(p, q, ... [repeat=1]) --> cartesian product
>
>   permutations(p[, r])
>
>   combinations(p, r)
>
>   combinations_with_replacement(p, r)
>
>  
>
> CLASSES
>
>   builtins.object
>
> ​    accumulate
>
> ​    chain
>
> ​    combinations
>
> ​    combinations_with_replacement
>
> ​    compress
>
> ​    count
>
> ​    cycle
>
> ​    dropwhile
>
> ​    filterfalse
>
> ​    groupby
>
> ​    islice
>
> ​    permutations
>
> ​    product
>
> ​    repeat
>
> ​    starmap
>
> ​    takewhile
>
> ​    zip_longest

`itertools.groupby()`函数扫描整个序列并查找连续相同值（或根据指定key函数返回值相同）的元素序列。

- 在每次迭代的时候，它会返回一个值和一个迭代器对象，这个迭代器对象可以生成元素值全部等于上面那个值的组中所有对象。

- 一个非常重要的准备步骤是要根据指定的字段将数据排序，因为`groupby()`仅仅检查连续的元素，若事先无排序将得到不想要的结果。

- 若仅仅希望根据字段将数据分组到一个大的数据结构中去，并且允许随机访问，那么最好使用`defaultdict()`来构建一个多值字典。

    | 示例                                                 |
    | ---------------------------------------------------- |
    | ![](https://chua-n.gitee.io/figure-bed/notebook/Python/267.png) |
    | ![](https://chua-n.gitee.io/figure-bed/notebook/Python/268.png) |
    | ![](https://chua-n.gitee.io/figure-bed/notebook/Python/269.png) |

过滤工具`itertools.compress()`，见“数据结构与算法”页面笔记

切片工具`itertools.islice()`，见“迭代器”页面笔记

itertools模块的`permutations(), combinations(), combinations_with_replacement()`函数可迭代遍历一个容器中元素的所有排列或组合，见“迭代器”页面笔记

`itertools.zip_longest()`函数可使打包出来的迭代跟最长序列保持一致，见“迭代器”页面笔记

collections模块定义了很多抽象基类，当你想自定义容器类的时候它们会非常有用。见“类”页面笔记