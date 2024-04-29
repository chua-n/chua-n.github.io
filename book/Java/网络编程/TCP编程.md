---
title: TCP编程
---

## 1. ServerSocket类

Java 中能接收其他通信实体连接请求的类是`ServerSocket`，`ServerSocket`对象用于监听来自客户端的`Socket`连接，如果没有连接，它将一直处于等待状态。

`ServerSocket`的构造器：

| 构造方法                                                     | 说明                                                         |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| `ServerSocket(int port)`                                     | 用指定的端口`port`来创建一`ServerSocket`，该端口应该有一个有效的端口整数值，即 0~65535 |
| `ServerSocket(int port, int backlog)`                        | 增加一个用来改变连接队列长度的参数`backlog`                  |
| `ServerSocket(int port, int backlog, InetAddress localAddr)` | 在机器存在多个 IP 地址的情况下，允许通过 `localAddr` 参数来指定将 `ServerSocket` 绑定到指定的 IP 地址 |

`ServerSocket`的方法：

| 方法              | 说明                                                         |
| ----------------- | ------------------------------------------------------------ |
| `Socket accept()` | 监听来自客户端的连接请求。如果接收到一个客户端`Socket`的连接请求，其返回一个与客户端`Socket`对应的`Socket`（每个 TCP 连接有两个`Socket`）；否则该方法将一直处于等待状态，线程也被阻塞。 |
| `close()`         | 当`ServerSocket`使用完毕后，应使用此方法关闭该`ServerSocket` |

## 2. Socket类

`Socket`的构造器（客户端通常可以使用`Socket`类的构造器来连接到指定服务器）：

| 构造方法                                                     | 说明                                                         |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| `Socket()`                                                   | 创建一个无连接的`Socket`                                     |
| `Socket(InetAddress/String remoteAddress, int port)`         | 创建连接到指定远程主机、远程端口的`Socket`，使用本地主机的默认 IP 地址及系统动态分配的端口 |
| `Socket(InetAddress/String remoteAddress, int port, InetAddress localAddr, int localPort)` | 创建连接到指定远程主机、远程端口的`Socket`，并指定本地 IP 地址和本地端口，适用于本地主机有多个 IP 地址的情形 |

`Socket` 的方法：

| 方法                                           | 说明                                                         |
| ---------------------------------------------- | ------------------------------------------------------------ |
| `InputStream getInputStream()`                 | 返回该`Socket`对象对应的输入流，让程序通过该输入流从`Socket`中取出数据 |
| `OutputStream getOutputStream()`               | 返回该`Socket`对象对应的输出流，让程序通过该输出流向`Socket`中输出数据 |
| `setSoTimeout(int timeout)`                    | 设置超时时长。当网络连接、读取操作超过合理时间之后，系统自动认为该操作失败 |
| `connect(SocketAddress endpoint, int timeout)` | 连接到指定服务器，此重载版本可设置超时参数                   |
| `shutdownInput()`                              | 关闭该`Socket`的输入流，程序还可通过该`Socket`的输出流输出数据 |
| `shutdownOutput()`                             | 关闭该`Socket`的输出流，程序还可通过该`Socket`的输入流读取数据 |
| `isInputShutdown()/isOutputShutdown()`         | 判断该`Socket`是否处于半读/半写状态                          |
| `close()`                                      | 关闭该`Socket`                                               |

对于`Socket`的半关闭状态：

1. 即使同一个`Socket`的实例先后调用`shutdownInput()`、`shutdownOutput()`方法，该`Socket`实例依然没有被关闭，只是它既不能输出数据，也不能读取数据而已。

2. 当调用`Socket`的`shutdownInput()/shutdownOutput()`方法关闭了输入流/输出流之后，该`Socket`无法再次打开输入流/输出流，因此这种做法通常不适合保持持久通信状态的交互式应用，只适用于一站式的通信协议，如 HTTP 协议。

由于`Socket`的构造器时没有提供指定超时时长的参数，当程序希望为一个连接服务器的`Socket`指定超时时长时，需要先创建一个无连接的`Socket`，再调用`Socket`的`connect()`方法来连接服务器，然后在`connect()`方法里传入一个超时时长参数。

```java
// 创建一个无连接的Socket
Socket s = new Socket();
// 让该Socket连接到远程服务器，如果经过10s还未连接，则认为连接超时
s.connect(new InetSocketAddress(host, port), 10000);
```

## 3. 示例

一旦使用`ServerSocket`与`Socket`建立网络连接之后，程序通过网络通信与普通 IO 并没有太大的区别。

```java
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintStream;
import java.net.ServerSocket;
import java.net.Socket;
class Server {
    public static void main(String[] args) throws IOException {
        // 创建一个ServerSocket用于监听客户端Socket的连接请求
        ServerSocket ss = new ServerSocket(30000);
        // 采用循环不断地接收来自客户端的请求
        while (true) {
            // 每当接收到客户端Socket的请求时，服务器端也对应产生一个Socket
            Socket s = ss.accept();
            // 将Socket对应的输出流包装成PrintStream
            PrintStream ps = new PrintStream(s.getOutputStream());
            ps.println("您好，您收到了服务器的新年祝福！");
            // 关闭输出流，关闭Socket
            ps.close();
            s.close();
        }
    }
}
class Client {
    public static void main(String[] args) throws IOException {
        Socket socket = new Socket("127.0.0.1", 30000);
        BufferedReader br = new BufferedReader(new InputStreamReader(socket.getInputStream()));
        // 进行普通IO操作
        String line = br.readLine();
        System.out.println("来自服务器的数据：" + line);
        br.close();
        socket.close();
    }
}
```

## 4. 使用NIO/AIO实现非阻塞通信

其中 AIO 为异步 IO（Asynchronous IO），以后再说吧……

