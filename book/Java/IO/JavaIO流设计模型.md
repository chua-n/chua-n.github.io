Java把所有设备里的有序数据抽象成流模型，简化了输入/输出处理。

## 1. 流的概念

**流的基本概念模型**把设备抽象成一个“水管”：

- 输入流——输入流使用**隐式的记录指针**来表示当前正准备从哪个“水滴”开始读取，每当程序从输入流中取出一个或多个“水滴”后，记录指针自动向后移动；

    <img src="https://chua-n.gitee.io/figure-bed/notebook/Java/43.jpg" alt="43" style="zoom:50%;" />

- 输出流——输出流同样采样**隐式的记录指针**来标识当前水滴即将放入的位置，每当程序向输出流里输出一个或多个水滴后，记录指针自动向后移动。

    <img src="https://chua-n.gitee.io/figure-bed/notebook/Java/44.jpg" alt="44" style="zoom:50%;" />

## 2. Java的处理流模型

Java的**处理流模型**则体现了Java输入/输出流设计的灵活性，处理流的功能主要体现在：

<img src="https://chua-n.gitee.io/figure-bed/notebook/Java/45.jpg" alt="45" style="zoom:50%;" />

- 性能的提高：主要以增加缓冲的方式来提高输入/输出的效率；
- 操作的便捷：处理流可能提供了一系列便捷的方法来一次输入/输出大批量的内容，而不是输入/输出一个或多个“水滴”。

使用处理流时，先用处理流来包装节点流，然后程序通过处理流来执行输入/输出功能，让节点流与底层的I/O设备、文件交互。

```java
class PrintStreamTest {
    public static void main(String[] args) {
        try (
            FileOutputStream fos = new FileOutputStream("test.txt"); 
            PrintStream ps = new PrintStream(fos);
        ) {
            ps.println("hello, world");
            ps.println(new PrintStreamTest());
        } catch (IOException ioe) {
            ioe.printStackTrace();
        }
    }
}
```

## 3. Java的IO流体系

Java的IO流共涉及40多个类，它们都是从**4个抽象基类**派生的：

| 抽象基类            | 说明                                                 |
| ------------------- | ---------------------------------------------------- |
| InputStream/Reader  | 所有输入流的基类，前者是字节输入流，后者是字符输入流 |
| OutputStream/Writer | 所有输出流的基类，前者是字节输出流，后者是字符输出流 |

### 3.1 输入流的方法

#### 3.1.1 InputStream

| 方法                                  | 说明                                                         |
| ------------------------------------- | ------------------------------------------------------------ |
| int  read()                           | 从输入流中读取单个字节，返回所读取的字节数据                 |
| int  read(byte[] b)                   | 从输入流中最多读取b.length个字节，并将其存储在字节数组b中，返回实际读取的字节数 |
| int  read(byte[] b, int off, int len) | 从输入流中最多读取len个字节，并将其存储在字节数组b中，放入数组b中时，从off位置开始，返回实际读取的字节数 |

#### 3.1.2 Reader

| 方法                                     | 说明                                         |
| ---------------------------------------- | -------------------------------------------- |
| int  read()                              | 从输入流中读取单个字符，返回所读取的字符数据 |
| int  read(char[] cbuf)                   | …                                            |
| int  read(char[] cbuf, int off, int len) | …                                            |

#### 3.1.3 InputStream/Reader

| 方法                           | 说明                                                 |
| ------------------------------ | ---------------------------------------------------- |
| void  mark(int readAheadLimit) | 在记录指针当前位置记录一个标记                       |
| boolean  markSupported()       | 判断此输入流是否支持mark()操作                       |
| void  reset()                  | 将此流的记录指针重新定位到上一次记录标记(mark)的位置 |
| long  skip(long n)             | 记录指针向前移动n个字节/字符                         |

### 3.2 输出流的方法

#### 3.2.1 OutputStream/Writer

| 方法                                             | 说明                                                         |
| ------------------------------------------------ | ------------------------------------------------------------ |
| void  write(int c)                               | 将指定的字节/字符输出到输出流中                              |
| void  write(byte[]/char[] buf)                   | 将字节数组/字符数组中的数据输出到指定输出流中                |
| void  write(byte[]/char[] buf, int off, int len) | 将字节数组/字符数组中从off位置开始，长度为len的字节/字符输出到输出流中 |

#### 3.2.2 Writer

因为字符流直接以字符作为操作单位，所以Writer可以用字符串来代替字符数组。

| 方法                                      | 说明                                                         |
| ----------------------------------------- | ------------------------------------------------------------ |
| void  write(String str)                   | 将str字符串里包含的字符输出到指定输出流中                    |
| void  write(String str, int off, int len) | 将str字符串里从off位置开始，长度为len的字符输出到指定输出流中 |

## 4. 注意事项

### 4.1 close()方法

`InputStream`和`OutputStream`都提供了`close()`方法关闭输出流，以便释放系统资源。但是要特别注意的是，`OutputStream`还提供了一个`flush()`方法，它的目的是将缓冲区的内容真正输出到目的地。

为什么要有`flush()`？因为向磁盘、网络写入数据的时候，出于效率的考虑，操作系统并不是输出一个字节就立刻写入到文件或者发送到网络，而是把输出的字节先放到内存的一个缓冲区里（本质上就是一个`byte[]`数组），等到缓冲区写满了，再一次性写入文件或者网络。对于很多IO设备来说，一次写一个字节和一次写1000个字节，花费的时间几乎是完全一样的，所以`OutputStream`有个`flush()`方法，能强制把缓冲区内容输出。

通常情况下，我们不需要调用这个`flush()`方法，因为缓冲区写满了`OutputStream`会自动调用它，并且，在调用`close()`方法关闭`OutputStream`之前，也会自动调用`flush()`方法。

因此，使用Java的IO流执行输出时，<font color="red">不要忘记执行close()方法关闭输出流</font>，关闭输出流除可以保证流的物理资源被回收之外，可能还可以将输出流缓冲区中的数据flush到物理节点里。

不过，在某些情况下，我们仍然必须手动调用`flush()`方法。例如：

> 小明正在开发一款在线聊天软件，当用户输入一句话后，就通过`OutputStream`的`write()`方法写入网络流。小明测试的时候发现，发送方输入后，接收方根本收不到任何信息，怎么肥四？
>
> 原因就在于写入网络流是先写入内存缓冲区，等缓冲区满了才会一次性发送到网络。如果缓冲区大小是4K，则发送方要敲几千个字符后，操作系统才会把缓冲区的内容发送出去，这个时候，接收方会一次性收到大量消息。
>
> 解决办法就是每输入一句话后，立刻调用`flush()`，不管当前缓冲区是否已满，强迫操作系统把缓冲区的内容立刻发送出去。

实际上，`InputStream`也有缓冲区。例如，从`FileInputStream`读取一个字节时，操作系统往往会一次性读取若干字节到缓冲区，并维护一个指针指向未读的缓冲区。然后，每次我们调用`int read()`读取下一个字节时，可以直接返回缓冲区的下一个字节，避免每次读一个字节都导致IO操作。当缓冲区全部读完后继续调用`read()`，则会触发操作系统的下一次读取并再次填满缓冲区。

---

在使用处理流包装了底层节点流之后，关闭输入/输出流资源时，只要关闭最上层的处理流即可，系统会自动关闭被该处理流包装的节点流。

## 5. 输入-输出流体系

Java输入/输出流体系中常用的流分类（有些流无法提供字节流，有些流无法提供字符流）。

> 其中粗体字标出的类代表节点流，其必须直接与指定的物理节点关联；
>
> 其中斜体字标出的类代表抽象基类，无法直接创建实例。

|    分类    | 字节输入流               | 字节输出流                | 字符输入流          | 字符输出流          |
| :--------: | ------------------------ | ------------------------- | ------------------- | ------------------- |
|  抽象基类  | *InputStream*            | *OutputStream*            | *Reader*            | *Writer*            |
|  访问文件  | **FileInputStream**      | **FileOutputStream**      | **FileReader**      | **FileWriter**      |
|  访问数组  | **ByteArrayInputStream** | **ByteArrayOutputStream** | **CharArrayReader** | **CharArrayWriter** |
|  访问管道  | **PipedInputStream**     | **PipedOutputStream**     | **PipedReader**     | **PipedWriter**     |
| 访问字符串 |                          |                           | **StringReader**    | **StringWriter**    |
|   缓冲流   | BufferedInputStream      | BufferedOutputStream      | BufferedReader      | BufferedWriter      |
|   转换流   |                          |                           | InputStreamReader   | OutputStreamWriter  |
|   对象流   | ObjectInputStream        | ObjectOutputStream        |                     |                     |
|  抽象基类  | *FilterInputStream*      | *FilterOutputStream*      | *FilterReader*      | *FilterWriter*      |
|   打印流   |                          | PrintStream               |                     | PrintWriter         |
| 推回输入流 | PushbackInputStream      |                           | PushbackReader      |                     |
|   特殊流   | DataInputStream          | DataOutputStream          |                     |                     |

通常来讲，字节流的功能比字符流的功能强大，因为计算机里所有的数据都是二进制的，而字节流可以处理所有的二进制文件。但问题是，如果使用字节流来处理文本文件，则需要使用合适的方式把这些字节转换成字符，这就增加了编程的复杂度。

一般规则：如果进行输入/输出的内容是文本内容，应该考虑使用字符流；如果进行输入/输出的内容是二进制内容，应该考虑使用字节流。

### 5.1 推回输入流

两个推回输入流提供了三个方法：

| 方法                                            | 作用                                                         |
| ----------------------------------------------- | ------------------------------------------------------------ |
| void  unread(int b)                             | 将一个字节/字符推回到推回缓冲区里，从而允许重复读取刚刚读取的内容 |
| void  unread(byte[]/char[] buf)                 | 将一个字节/字符数组内容推回到推回缓冲区里，从而允许重复读取刚刚读取的内容 |
| void  unread(byte[]/char[] b, int off, int len) | 将一个字节/字符数组里从off开始，长度为len字节/字符的内容推回到推回缓冲区里，从而允许重复读取刚刚读取的内容 |

两个推回输入流都带有一个推回缓冲区，当程序调用它们的unread()方法时，系统将会把指定数组的内容推回到该缓冲区里，而推回输入流每次调用read()方法时总是先从推回缓冲区读取，只有完全读取了推回缓冲区的内容，且还没有装满read()所需的数组时才会从原输入流中读取。

<img src="https://chua-n.gitee.io/figure-bed/notebook/Java/46.png" alt="46" style="zoom:50%;" />

据上，当程序创建一个PushbackInputStream或PushbackReader时需要指定推回缓冲区的大小，默认的推回缓冲区的长度为1。如果程序中推回到推回缓冲区的内容超出了推回缓冲区的大小，将引发Pushback buffer overflow的IOException异常。

### 5.2 标准输入/输出流

Java使用System.in和System.out来代表标准输入/输出，即键盘输入/显示器。

- System.in：标准输入流，InputStream类型，这个流是已经打开了的，默认状态对应于键盘输入；
- System.out：标准输出流，PrintStream类型，默认状态对应于屏幕输出；
- System.err：标准错误信息输出流，PrintStream类型，默认状态对应于屏幕输出。

在System类里提供了如下三个重定向标准输入/输出的方法：

| 方法                                 | 作用                 |
| ------------------------------------ | -------------------- |
| static  void setIn(InputStream in)   | 重定向标准输入流     |
| static  void setOut(PrintStream out) | 重定向标准输出流     |
| static  void setErr(PrintStream err) | 重定向标准错误输出流 |

示例——一个方便的API把文本转换成基本类型或者String：

```java
Scanner scanner = new Scanner(System.in);
int num = scanner.nextInt();

// Scanner还有如下方法：
// nextByte()
// nextDouble()
// nextFloat()
// nextInt()
// nextInt()
// nextLong()
// nextShort()
```

### 5.3 写文本文件示例——FileWriter与BufferedWriter

```java
package com.chuan;

import java.io.FileWriter;
import java.io.IOException;
import org.junit.Test;

public class FileWriterTest {
    @Test
    public void testWrite() throws IOException {
        String filename = "C:\\Users\\chuan\\Desktop\\temp\\hello.txt";
        FileWriter writer = new FileWriter(filename); // 如果文件已存在，会覆盖
        // FileWriter writer = new FileWriter(filename, true); // 如果文件已存在，会追加内容
        writer.write("Hello!\n");
        writer.write("This is my first text file,\n");
        writer.write("You can see how this is done.\n");
        writer.write("输入一行中文也可以");
        writer.close();
    }
}
```

注意事项：

- 创建一个磁盘文件
- 关闭一个磁盘文件
- write()方法
- 捕获I/O异常

BufferedWriter类：如果需要写入的内容很多，就应该使用更为高效的缓冲器类BufferedWriter，其不同于FileWriter类的区别是BufferedWriter多提供了一个`newLine()`方法用于换行，该方法可以输出在当前计算机上正确的换行符。

类似地，关于读文本文件的FileReader类与BufferedReader类，后者拥有`readLine()`方法可以进行按行读。

> 文件结束时，Reader返回-1，而BufferedReader返回null。

### 5.4 DataInputStream/DataOutputStream

二进制文件的DataInputStream/DataOutputStream可以按照类型读写。

