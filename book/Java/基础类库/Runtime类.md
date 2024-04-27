---
title: Runtime类
---

`Runtime` 类代表 Java 程序的运行时环境，每个 Java 程序都有一个与之对应的 `Runtime` 实例，应用程序通过该对象与其运行时环境相连。

应用程序不能创建自己的 `Runtime` 实例，但可以通过 `Runtime` 类的 `getRuntime()` 方法获取与之关联的 `Runtime` 对象。

`Runtime` 类的方法：

| 方法                           | 作用                                  |
| ------------------------------ | ------------------------------------- |
| `static  Runtime getRuntime()` | 获取与该应用程序关联的 `Runtime` 对象 |
| `gc()`                         | 通知系统进行垃圾回收                  |
| `runFinalization()`            | 通知系统进行垃圾回收                  |
| `load(String filename)`        | 加载文件                              |
| `loadLibrary(String libname)`  | 加载动态链接库                        |
| ……                             | ……                                    |

`Runtime` 类代表 Java 程序的运行时环境，可以访问 JVM 的相关信息，如处理器数量、内存信息等。

```java
class RuntimeTest {
    public static void main(String[] args) {
        // 获取Java程序关联的运行时对象
        Runtime rt = Runtime.getRuntime();
        System.out.println("处理器数量：" + rt.availableProcessors());
        System.out.println("空闲内存数：" + rt.freeMemory());
        System.out.println("总内存数：" + rt.totalMemory());
        System.out.println("可用最大内存数：" + rt.maxMemory());
    }
}
```

`Runtime` 提供了一系列 `exec()` 方法来运行操作系统命令，可查看相关 API 文档。通过 `exec` 启动平台上的命令之后，它就变成了一个进程，Java使用 `Processs` 来代表进程。

```java
import java.util.concurrent.CompletableFuture;
class RuntimeTest {
    public static void main(String[] args) throws Exception {
        // 获取Java程序关联的运行时对象
        Runtime rt = Runtime.getRuntime();
        System.out.println("处理器数量：" + rt.availableProcessors());
        System.out.println("空闲内存数：" + rt.freeMemory());
        System.out.println("总内存数：" + rt.totalMemory());
        System.out.println("可用最大内存数：" + rt.maxMemory());
        // Runtime类还可以直接单独启动一个进程来运行操作系统的命令
        // 通过exec启动平台上的命令之后，它就变成了一个进程，Java使用Process来代表进程
        Process p = rt.exec("notepad.exe");
        ProcessHandle ph = p.toHandle();
        System.out.println("进程是否运行：" + ph.isAlive());
        System.out.println("进程ID：" + ph.pid());
        System.out.println("父进程：" + ph.parent());
        // 通过ProcessHandle.Info信息获取进程相关信息
        ProcessHandle.Info info = ph.info();
        System.out.println("进程命令：" + info.command());
        System.out.println("进程参数：" + info.arguments());
        System.out.println("进程启动时间：" + info.startInstant());
        System.out.println("进程累计运行时间：" + info.totalCpuDuration());
        // 通过CompletableFuture在进程结束时运行某个任务
        CompletableFuture<ProcessHandle> cf = ph.onExit();
        cf.thenRunAsync(() -> {
            System.out.println("程序退出");
        });
        Thread.sleep(5000);
    }
}
```

