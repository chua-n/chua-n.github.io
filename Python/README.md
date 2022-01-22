> Python 笔记本。

-   开区间 $[L, R)$ 中含有的数据量 $count = R - L$
-   Tutorial 和 Document 的区别：原来 tutorial 更多翻译成教程的意思，而 document 翻译为文档。

## History

1. The "dummy" node is used to simplify some corner cases such as a list with only one node, or removing the head of the list.

2. `<<=`

3. 给定 N 个对象（不妨假设为从 1 到 N 的 N 个整数），怎么找到他们的全排列？

4. 同样的算法面对不同的输入可能有质的差别：

    | ![](../resources/images/notebooks/Python/QQ截图20190524090536.jpg) | ![](../resources/images/notebooks/Python/QQ截图20190524090601.jpg) | ![](../resources/images/notebooks/Python/QQ截图20190524090606.jpg) |
    | ------------------------------------------------------------------ | ------------------------------------------------------------------ | ------------------------------------------------------------------ |

5. `a += b` 与 `a = a + b`:

 <img src="../resources/images/notebooks/Python/574.png" style="zoom:67%;" />

6. Leetcode 55. Jump Game:

    ![](../resources/images/notebooks/Python/575.png)

    - 对于使得目标台阶 target 变为 loc，虽然在现时世界中你肯定认为“可以到达 loc 但不必要”，固然可以通过先踩到这一阶 loc 的位置再到达之前的 target，但是现世中也许完全可以通过从此 loc 之前的某一位置而一步跨到 target，所以在思考的时候可能很难想到这一方案是可行的。
    - 但是！其实接着上面的思路——可从 loc 一步到达 target，也可从 loc 之前的某位置一步跨到 target，因为该位置在 loc 之前，那么必然该位置对应的最大步长 step 大于 loc 的 step，故而总可以从该位置抵达 loc，即若该位置方案可行则必然存在 loc 方案！故而某种程度上可认为 loc 方案与该位置方案等价，那么就可以将 loc 方案认为是唯一方案了！所以将 loc 设为 target 是可行的！

7. 树结构的回溯

    ![](../resources/images/notebooks/Python/576.png)

8. 先序遍历与中序遍历的关系：

    ![](../resources/images/notebooks/Python/577.png)

9. 按照计算机科学的一般概念，脚本指的是一个程序，它被另一个程序（解释程序）而不是计算机的处理机来解释或执行。

10. 一个脚本运行起来比一般的编译程序要慢，因为它的每一条指令先要被另一个程序来处理，这就要一些附加的指令，而不是直接被指令处理器来处理。

11. 若要查看一个类的成员函数的 help，在不知道类名的情况下，可通过该类的实例来引用该方法，进而使用`help()`：

    ```python
    cube = np.array([1, 2, 3])
    help(cube.astype) # 因为当时不知道应该输入help(numpy.ndarray.astype)来查看帮助
    ```

12. `np.bool_`类型占用大小竟然是 1 个字节而不是一个比特！实际上，在 C/C++中也是如此。
