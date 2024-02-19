---
title: Python多进程
date: 2021-03-12 09:39:04
categories: python
---

接连面临多个耗时性程序，形势已经演变到必须了解 Python 并行计算的地步了。

<!-- more -->

## 0. 从 Unix/Linux 的`fork()`说起

在 Unix/Linux 系统中，提供了一个系统级函数`fork()`，普通的函数调用一次、返回一次，而`fork()`调用一次、返回两次，因为操作系统把当前进程（父进程）复制了一份（子进程），此时出现两份进程，于是该函数分别在该父、子进程中返回。

`fork()`函数在父进程中的返回值为子进程的进程 ID（Process ID, pid），在子进程中的返回值永远为 0。不过，在子进程中，可以通过调用`getppid()`拿到父进程的 pid。

如以下在 linux 系统中的 python 程序演示：

```python
import os

# 打印当前进程，即父进程的pid
print(f"Process {os.getpid()} starts...")

pid = os.fork()  # 创建了一个子进程
if pid == 0:
    print(f"I am child process {os.getpid()} and my parent process is {os.getppid()}.")
else:
    print(f"I ({os.getpid()}) just created a child process {pid})")
```

输出结果如下：

```shell
Process 483317 starts...
I (483317) just created a child process 483318)
I am child process 483318 and my parent process is 483317.
```

故而，有了`fork()`，一个进程在处理某些任务时就可以复制出一个子进程来协助处理这些任务，充分利用计算机的多核处理优势，实现并行处理。

## 1. multiprocessing 标准库

Windows 系统下没有`fork()`调用，不过 python 作为跨平台的编程语言，当然会提供统一的接口方便编写多进程程序，这就是标准库中的`multiprocessing`了。

> 注意，`Process`类和`Pool`类都支持上下文管理器协议了，即可以使用`with`。

### 1.1. Process 类

multiprocessing 库使用`Process`类代表一个进程对象，可以用它来在当前进程中创建子进程：

```python
import os
from multiprocessing import Process


def func(name):
    print(f"Child process {name} ({os.getpid()}) is running...")


print(f"Parent process is {os.getpid()}")
# 创建一个子进程对象，但在执行它的start()方法之前它并非真正的“进程”
p = Process(target=func, args=('test',))
print("Attention! Child process will start.")
# 子进程被激活
p.start()
# 调用进程的join()方法意味着：当前进程在子进程的任务完成以前，都不会向下执行语句
p.join()

print("Child process ends running.")
```

打印结果如下：

```txt
Parent process is 486285
Attention! Child process will start.
Child process test (486286) is running...
Child process ends running.
```

对于不熟悉多进程的程序员而言，不妨试试将上述代码中的`p.join()`注释掉，会发现整个程序的执行结果*通常*如下，也就是主程序不会等待子进程的执行结束即立刻向下执行，导致子进程明明没有执行结束，却打印出昭示子进程运行结束的语句`Child process ends running.`

```txt
Parent process is 486490
Attention! Child process will start.
Child process ends running.
Child process test (486491) is running...
```

关于`Process`类中方法的更多介绍，参见[官方文档](https://docs.python.org/zh-cn/3/library/multiprocessing.html#the-process-class)。

### 1.2. Pool 类

当需要多个子进程时，每次都使用`Process`类去创建一个子进程太麻烦了，可以使用**进程池**来批量创建子进程：

```python
import os
import time
import random
from multiprocessing import Pool


def longTimeTask(name):
    print(f"Run task {name} ({os.getpid()})")
    start = time.time()
    time.sleep(random.random()*5)
    end = time.time()
    print(f"Task {name} ({os.getpid()}) runs {end-start :.2f} seconds.")


if __name__ == "__main__":
    start = time.time()
    print(f"Parent process {os.getpid()}")

    # 创建有4个进程的进程池
    p = Pool(4)
    for i in range(7):
        # apply_async方法随机挑选一个进程池中的空闲进程执行传入的方法
        # 并返回一个AsyncResult对象
        p.apply_async(longTimeTask, args=(i,))
    print("Waiting for all subprocesses done...")
    # 关闭进程池：阻止后续任务提交到进程池，当所有任务执行完毕后工作进程退出
    p.close()
    # 主程序等待工作进程结束。调用join()方法之前必须先调用close()或terminate()
    p.join()

    end = time.time()
    print(f"All subprocesses done, time cost is {end-start :.2f}.")
```

输出结果如下（不熟悉并行计算的请注意总程序运行时间的 7.72 s 远远少于 7 个任务分别执行的耗时总和 1.74+3.80+4.72+4.90+4.53+2.73+2.76=25.18 s，这便是并行计算了）：

```txt
Parent process 493253
Waiting for all subprocesses done...
Run task 0 (493256)
Run task 2 (493255)
Run task 1 (493254)
Run task 3 (493257)
Task 2 (493255) runs 1.74 seconds.
Run task 4 (493255)
Task 1 (493254) runs 3.80 seconds.
Run task 5 (493254)
Task 0 (493256) runs 4.72 seconds.
Run task 6 (493256)
Task 3 (493257) runs 4.90 seconds.
Task 4 (493255) runs 4.53 seconds.
Task 5 (493254) runs 2.73 seconds.
Task 6 (493256) runs 2.76 seconds.
All subprocesses done, time cost is 7.52.
```

关于`Pool`类的方法（详情请见[官方文档](https://docs.python.org/zh-cn/3/library/multiprocessing.html#multiprocessing.pool.Pool)）；

|                                    方法                                    |                                          说明                                          |
| :------------------------------------------------------------------------: | :------------------------------------------------------------------------------------: |
|                       `apply(func[, args[, kwds]])`                        |         调用一个进程池中的空闲进程执行相关函数，该函数执行完毕之前父进程会阻塞         |
|     `apply_async(func[, args[, kwds[, callback[, error_callback]]]])`      |          `apply()`方法的一个变种，区别是不会阻塞，并返回一个`AsyncResult`对象          |
|                     `map(func, iterable[, chunksize])`                     |             内置函数`map()`的并行版本，这会保持阻塞直到被执行函数执行结束              |
|   `map_async(func, iterable[, chunksize[, callback[, error_callback]]])`   |          `map()` 方法的一个变种，区别是不会阻塞，并返回一个`AsyncResult`对象           |
|                    `imap(func, iterable[, chunksize])`                     |                                 `map()`的延迟执行版本                                  |
|               `imap_unordered(func, iterable[, chunksize])`                |                   和 `imap()` 相同，只是通过迭代器返回的结果是任意的                   |
|                   `starmap(func, iterable[, chunksize])`                   |            和 `map()` 类似，不过 iterable 中的每一项会被解包再作为函数参数             |
| `starmap_async(func, iterable[, chunksize[, callback[, error_callback]]])` |                         相当于`starmap()`与`map_async()`的结合                         |
|                                 `close()`                                  |             阻止后续任务提交到进程池，当所有任务执行完成后，工作进程会退出             |
|                               `terminate()`                                | 不等待未完成任务，立即停止工作进程。当进程池对象被垃圾回收时， 会立即调用`terminate()` |
|                                  `join()`                                  |          等待工作进程结束。调用`join()`前必须先调用`close()`或者`terminate`()          |

## 2. 进程同步、进程通信等

未完待续......
