---
title: Scanner类
---

使用Scanner类可以获取用户的键盘输出，Scanner是一个基于正则表达式的文本扫描器，它可以从文件、输入流、字符串中解析出基本类型值和字符串值。

构造方法：

- `Scanner(InputStream in)`：用给定的输入流创建一个Scanner对象。
- `Scanner(Path p, String encoding)`：构造一个使用给定字符编码从给定路径读取数据的Scanner对象。
- `Scanner(String data)`：构造一个从给定字符串读取数据的Scanner。

Scanner主要提供了两个方法来扫描输入（其中Xxx可以是Int, Long等代表基本数据类型的字符串）：

- `hasNextXxx()`:是否还有下一个Xxx类型的输入项；如果只是判断是否包含下一个字符串，则直接使用`hasNext()`；

- `nextXxx()`:获取下一个输入项。

默认情况下，Scanner使用**空白**（包括空格、Tab空白、回车）作为多个输入项之间的分隔符。如果想改变Scanner的分隔符，可以使用相应Scanner对象的`useDelimiter(String pattern)`方法。

为了方便，Scanner提供了两个简单的方法来逐行读取：

- `boolean hasNextLine()`:返回输入源中是否还有下一行；

- `String nextLine()`:返回输入源中下一行的字符串。

如果一个Scanner要求输入一个long整数，而实际输入无法转换成long，会导致程序退出。

