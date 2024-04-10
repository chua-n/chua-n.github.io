---
title: classpath和jar
date: 2020-11-09
---

## 1. classpath

> 参考自[classpath和jar - 廖雪峰的官方网站 (liaoxuefeng.com)](https://www.liaoxuefeng.com/wiki/1252599548343744/1260466914339296)

### 什么是classpath

在Java中，我们经常听到`classpath`这个东西。到底什么是`classpath`？

`classpath`是JVM用到的一个环境变量，它用来指示JVM如何搜索`class`。也就是说，JVM需要知道，如果要加载一个`com.exmaple.Hello`的类，应该去哪搜索对应的`Hello.class`文件。

所以，`classpath`就是一组目录的集合，它设置的搜索路径与操作系统相关。例如，

- 在Windows系统上，用`;`分隔，带空格的目录用`""`括起来，可能长这样：

    ```
    C:\work\project1\bin;C:\shared;"D:\My Documents\project1\bin"
    ```

- 在Linux系统上，用`:`分隔，可能长这样：

    ```
    /usr/shared:/usr/local/bin:/home/liaoxuefeng/bin
    ```

现在我们假设`classpath`是`.;D:\work\project1\bin;C:\shared`，当JVM在加载`com.exmaple.Hello`这个类时，会依次查找：

- <当前目录>\com\exmaple\Hello
- D:\work\project1\bin\com\exmaple\Hello
- C:\shared\com\exmaple\Hello

如果JVM在某个路径下找到了对应的`class`文件，就不再往后继续搜索。如果所有路径下都没有找到，就报错。

### 如何设定classpath

`classpath`的设定方法有两种：

- 在系统环境变量中设置`classpath`环境变量，不推荐；
- 在启动JVM时设置`classpath`变量，推荐。

我们强烈**不推荐**在系统环境变量中设置`classpath`，那样会污染整个系统环境。在启动JVM时设置`classpath`才是推荐的做法。实际上就是给`java`命令传入`-classpath`或`-cp`参数：

```
java -classpath .;D:\work\project1\bin;C:\shared com.exmaple.Hello
```

或者使用`-cp`的简写：

```
java -cp .;C:\work\project1\bin;C:\shared com.exmaple.Hello
```

如果没有设置`classpath`的系统环境变量，也没有传入`-cp`参数，那么JVM默认的`classpath`为`.`，即当前目录：

```
java com.exmaple.Hello
```

这意味着上述命令告诉JVM只在当前目录搜索`Hello.class`。

## 2. jar

### 2.1 jar 文件

<font size="5">**JAR 文件**</font>的全称为 Java Archive File，意思为 Java 档案文件。

jar 文件使用ZIP格式组织文件和子目录，可以使用任何ZIP工具查看JAR文件，通常也称其为<font size="5"> **jar 包**</font>。jar 文件与 ZIP 文件的区别就是在 JAR 文件中默认包含了一个名为 META-INF/MANIFEST.MF 的清单文件，这个清单文件是在生成 jar 文件时由系统自动创建的。

使用 JAR 文件有以下好处：

1. 安全：能够对 JAR 文件进行数字签名，只让能够识别数字签名的用户使用里面的东西；
2. 加快下载速度：在网上使用 Applet 时，如果存在多个文件而不打包，为了能够把每个文件都下载到客户端，需要为每个文件单独建立一个 HTTP 连接，这是非常耗时的工作。将这些文件压缩成一个 JAR 包，只要建立一次 HTTP 连接就能够一次下载所有的文件。
3. 压缩：使文件变小，JAR 的压缩机制和 ZIP 完全相同；
4. 包封装：能够让 JAR 包里面的文件依赖于统一版本的类文件；
5. 可移值性：JAR 包作为内嵌在 Java 平台内部处理的标准，能够在各种平台上直接使用。

当一个应用程序开发成功后，大致有如下三种发布方式：

1. 使用平台相关的编译器将整个应用编译成平台相关的可执行性文件；

2. 为应用编辑一个批处理文件；

3. 将一个应用程序制作成可执行的 jar 包，通过 jar 包来发布应用程序：

    - 如果开发者把整个应用制作成一个可执行的 jar 包交给用户，那么用户使用起来就方便了。在 Windows 下安装 JRE 时，安装文件会将*.jar 文件映射成由 javaw.exe 打开，对于一个可执行的 jar 包，用户只需要双击它就可以运行程序了，和阅读*.chm 文档一样方便（\*.chm 文档默认是由 hh.exe 打开的）。

    - 创建可执行的 jar 包的关键在于：让 javaw 命令知道 jar 包中哪个类是主类，javaw 命令可以通过运行该主类来运行程序。

    - jar 命令有-e 选项即可指定 jar 包中作为程序入口的主类的类名，故而制作一个可执行的 jar 包只要增加-e 选项即可：

        ```
        // test.Test是完整类名
        jar cvfe test.jar test.Test test
        ```

    - 运行 jar 包有两种方式：

        - 使用 java 命令：`java -jar test.jar`
        - 使用 javaw 命令：`javaw test.jar`

### 2.2 类路径

类路径（class path）是所有包含类文件的路径的集合。把一个 jar 文件添加到系统的 CLASSPATH 环境变量中后，JVM 就可以自动在内存中解压这个 JAR 包。Java 会把这个 jar 文件当成一个路径来处理，在其中查询所需要的类或包层次对应的路径结构。

最好使用 -classpath (-cp 或 Java9中的 --class-ath) 选项指定类路径；其次可以通过设置CLASSPATH环境变量来指定，具体细节取决于使用的shell。

- `java -classpath /home/user/classdir:.:/home/user/archives/archive.jar MyProg`
- `export CLASSPATH=/home/user/classdir:.:/home/user/archives/archive.jar`

在Java9中，还可以从模块路径加载类。

### 2.3 jar 命令

JAR 文件通常使用 jar 命令压缩而成，当使用 jar 命令压缩生成 jar 文件时，可以把一个或多个路径全部压缩成一个 JAR 文件。jar 是随 JDK 自动安装的，在 JDK 安装目录下的 bin 目录中，Windows 下文件名为 jar.exe，Linux 下文件名为 jar。

<img src="https://figure-bed.chua-n.com/notebook/Java/22.png" alt="22" style="zoom:80%;" />

<img src="https://figure-bed.chua-n.com/notebook/Java/23.png" alt="23" style="zoom:80%;" />

语法：通常 jar 命令的格式为`jar options file1, file2…`

jar 命令参数

| 选项 | 说明                                                                                                                                                                |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| c    | 创建一个新的或者空的存档文件并加入文件。若指定的文件名是目录，jar 程序将会对它们进行递归处理                                                                        |
| C    | 暂时改变目录，如 jar cvf jarFileName.jar -C classes \*.class 改变 classes 子目录，以便增加这些类文件                                                                |
| e    | 在清单文件中创建一个条目                                                                                                                                            |
| f    | 将 jar 文件名指定为第二个命令行参数。如果没有这个参数，jar 命令会将结果写到标准输出上（在创建 jar 文件时），或者从标准输入中读取它（在解压或者列出 jar 文件内容时） |
| i    | 建立索引文件，用于加快对大型归档的查找                                                                                                                              |
| m    | 将一个清单文件（manifest）添加到 jar 文件中，清单是对存档内容和来源的说明。每个归档都有一个默认的清单文件。                                                         |
| M    | 不为条目创建清单文件                                                                                                                                                |
| t    | 显示内容表                                                                                                                                                          |
| u    | 更新一个已有的 jar 文件                                                                                                                                             |
| v    | 生成详细的输出结果                                                                                                                                                  |
| x    | 解压文件。如果提供一个或多个文件名，只解压这些文件；否则，解压所有文件                                                                                              |
| 0    | 存储，不进行 ZIP 压缩                                                                                                                                               |

### 2.4 清单文件

除了类文件、图像和其他资源外，每个JAR文件还包含一个清单文件（manifest），用于描述归档文件的特殊特性。

清单文件被命名为MANIFEST.MF，位于JAR文件的一个特殊的META-INF子目录中。符合标准的最小清单文件极其简单：

```text
Manifest-Version: 1.0
```

复杂的清单文件可能包含更多条目。这些清单条目被分成多个节，节与节之间用空行分开。第一节被称为主节，它作用于整个JAR文件。随后的条目用来指定命名实体的属性，如单个文件、包或URL，它们都必须以一个Name条目开始。如：

```text
Manifest-Version: 1.0
lines describing this archive.

Name: Woozle.class
lines describing this file
Name: com/mycompany/mypkg
lines describing this package
```

清单文件的最后一行必须以换行符结束。

### 2.5 可执行 JAR 文件

可使用jar命令当中的e选项指定程序的入口点，即通常需要在调用java程序启动器时指定的类：

```cmd
jar cvfe myProgram.jar com.mycompany.mypkg.MainAppClass files to add
```

或者，可以在清单文件中指定程序的，包括以下形式的语句（不要为主类名增加扩展名.class）：

```text
Main-Class: com.mycompany.mypkg.MainAppClass
```

不论使用哪一种方法，用户可以简单地通过下面的命令来启动程序：

```cmd
java -jar MyProgram.jar
```

### 2.6 多版本JAR

Java9引入了多版本JAR，其中可以包含面向不同Java版本的类文件。

> 暂略。

