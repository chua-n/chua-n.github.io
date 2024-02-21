---
title: Java注释
---

Java语言的注释一共有三种类型：

| Java注释 |         语法          |
| :------: | :-------------------: |
| 单行注释 |        使用//         |
| 多行注释 | 使用/* 开始，以*/结束 |
| 文档注释 | 使用/\*\*开始，以\*/结束 |

## 文档注释

**文档注释**是用于生成API文档的，而API文档主要用于说明类、方法、成员变量的功能，因此**javadoc工具**只处理文档源文件在类、接口、方法、成员变量、构造器、内部类之前的注释，忽略其他地方的文档注释。且javadoc工具默认只处理以public或protected修饰的这些内容。

每个`/** ... */`文档注释包含标记以及之后紧跟着的自由格式文本（free-form text）。标记以`@`开始，如`@since`或`@param`。

- 自由格式文本的第一句应该是一个概要性的句子，Javadoc工具自动将这些句子抽取出来生成概要页。
- 在自由格式文本中，可以使用HTML修饰符，例如用于强调的`<em>...</em>`等。这里强调一点，要键入等宽代码，需要使用`{@code ...}`而不是`<code>...</code>`，这样一来，就不用操心对代码中的`<`字符转义了。
- Java 9的API文档已经支持HTML 5规范，因此为了得到完全兼容HTML 5的API文档，必须要保证文档注释中的内容完全兼容HTML 5规范。

如果文档中有到其他文件的链接，如图像文件，就应该将这些文件放到包含源文件的目录下的一个子目录doc-files中。javadoc工具将从源目录将odc-files目录及其内容拷贝到文档目录中。在链接中需要使用doc-files目录，例如`<img src="doc-files/uml.png" alt="UML diagram" />`。

常用javadoc标记：

- 通用注释

    | javadoc标记 |              作用              |
    | :---------: | :----------------------------: |
    |   @since    |     引入这个特性的版本描述     |
    |   @author   |          指定程序作者          |
    |  @version   |        指定源文件的版本        |
    | @deprecated |        不推荐使用的方法        |
    |    @see     | “参见”，用于指定交叉参考的内容 |
    |    @link    |              链接              |

- 类注释

- 方法注释

    | javadoc标记 |             作用             |
    | :---------: | :--------------------------: |
    |   @param    |      方法的参数说明信息      |
    |   @return   |     方法的返回值说明信息     |
    |   @throws   | 抛出的异常，和@exception同义 |
    | @exception  |        抛出异常的类型        |

- 字段注释

- 包注释：要想产生包注释，就需要在每一个包目录中添加一个单独的文件，可以有如下两个选择：

    - 提供一个名为package-info.java的Java文件，该文件必须包含一个初始的以`/**`和`*/`界定的javadoc注释，后面是一个package语句，它不能包含更多的代码或注释
    - 提供一个名为package.html的HTML文件，会抽取标记`<body>...</body>`之间的所有文本。

## javadoc命令

javadoc命令用来对注释进行提取：

```cmd
javadoc -d docDirectory nameOfPackage1 nameOfPackage2...
```

如果省略-d选项，那HTML文件将会被提取到当前目录下。

为了能提取到文档中的@author和@version等标记信息，需在使用javadoc工具时增加-author和-version两个选项。

javadoc命令也可以指定对Java程序包来生成API文档，而不仅是对Java源文件。

有一个很有用的选项是-link，其用来为标准类添加超链接：

```cmd
javadoc -link http://docs.oracle.com/javase/9/docs/api *.java
```

