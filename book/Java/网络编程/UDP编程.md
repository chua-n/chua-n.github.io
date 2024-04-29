---
title: UDP编程
---

## 1. UDP协议

UDP 协议的主要作用是完成网络数据流和数据报之间的转换——在信息的发送端，UDP 协议将网络数据流封装成数据报，然后将数据报发送出去；在信息的接收端，UDP 协议将数据报转换成实际数据内容。

可以认为 UDP 协议的 Socket 类似于码头，数据报则类似于集装箱，码头的作用就是负责发送、接收集装箱，Java 使用 `DatagramSocket` 代表这个码头。`DatagramSocket`的作用就是发送、接收数据报，数据报在 Java 中以 `DatagramPacket` 来代表。因此对于基于 UDP 协议的通信双方而言，没有所谓的客户端和服务器端的概念。

## 2. DatagramSocket类

Java 提供了`DatagramSocket`对象作为基于 UDP 协议的 Socket，使用`DatagramPacket`代表`DatagramSocket`发送、接收的数据报。

## 2.1 构造方法

| 构造方法                                      | 说明                                                         |
| --------------------------------------------- | ------------------------------------------------------------ |
| `DatagramSocket()`                            | 创建一个`DatagramSocket`实例，并将该对象绑定到本机默认 IP 地址、本机所有可用端口中随机选择的某个端口 |
| `DatagramSocket(int port)`                    | 创建一个`DatagramSocket`实例，并将该对象绑定到本机默认 IP 地址、指定端口 |
| `DatagramSocket(int port, InetAddress laddr)` | 创建一个`DatagramSocket`实例，并将该对象绑定到指定 IP 地址、指定端口 |

## 2.2 方法

| 方法                        | 说明                                   |
| --------------------------- | -------------------------------------- |
| `receive(DatagramPacket p)` | 从该`DatagramSocket`中接收数据报       |
| `send(DatagramPacket p)`    | 以该`DatagramSocket`对象向外发送数据报 |

由`receive/send`这两个方法也可看出，使用`DatagramSocket`发送数据报时，`DatagramSocket`并不知道将该数据报发送到哪里，而是由`DatagramPacket`自身决定数据报的目的地。就像码头并不知道每个集装箱的目的地，码头只是将这些集装箱发送出去，而集装箱本身包含了该集装箱的目的地。

### 2.3 其他

使用`DatagramSocket`进行网络通信时，“服务器端”无须也无法保存每个“客户端”的状态，客户端把数据报发送到服务器端后，完全有可能立即退出。但不管客户端是否退出，服务器端都无法知道客户端的状态。

## 3. DatagramPacket类

### 3.1 构造器

| 构造方法                                                     | 说明                                                         |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| `DatagramPacket(byte[] buf, int length)`                     | 以一个空数组来创建  `DatagramPacket` 对象，该对象的作用是接收  `DatagramSocket`中的数据 |
| `DatagramPacket(byte[] buf, int length, InetAddress addr, int port)` | 以一个包含数据的数组来创建  `DatagramPacket` 对象，同时指定数据报的目的 IP 地址和端口 |
| `DatagramPacket(byte[] buf, int offset, int length)`         | 以一个空数组来创建  `DatagramPacket` 对象，并指定接收到的数据放入`buf`数组中时从`offset`开始，最多放`length`个字节 |
| `DatagramPacket(byte[] buf, int offset, int length, InetAddress addr, int port)` | 创建一个用于发送的  `DatagramPacket` 对象，指定发送`buf`数组中从`offset`开始的总共`length`个字节 |

### 3.2 方法

| 方法                               | 说明                                                         |
| ---------------------------------- | ------------------------------------------------------------ |
| `InetAddress getAddress()`         | 当程序准备发送此数据报时，该方法返回此数据报的目标机器的 IP 地址；当程序刚接收到一个数据报时，该方法返回该数据报的发送主机的 IP 地址 |
| `int getPort()`                    | 当程序准备发送此数据报时，该方法返回此数据报的目标机器的端口；当程序刚接收到一个数据报时，该方法返回该数据报的发送主机的端口 |
| `SocketAddress getSocketAddress()` | 当程序……，……目标机器的`SocketAddress`；当程序……，……发送主机的`SocketAddress` |

## 4. MulticastSocket类

`MulticastSocket`是`DatagramSocket`的一个子类，即它是特殊的`DatagramSocket`。

`DatagramSocket`只允许数据报发送给指定的目标地址，而`MulticastSocket`可以将数据报以广播方式发送到多个客户端。

IP 多点广播实现了将单一信息发送到多个接收者的广播，其思想是设置一组特殊网络地址作为多点广播地址，每一个多点广播地址都被看做一个组，当客户端需要发送、接收广播信息时，加入到该组即可。

IP 协议点多点广播提供了这批特殊的 IP 地址，这些 IP 地址的范围是 224.0.0.0~239.255.255.255。

多点广播示意图如下：

![52](https://figure-bed.chua-n.com/Java/52.png)

### 构造方法

|                     构造方法                     |                         说明                          |
| :----------------------------------------------: | :---------------------------------------------------: |
|            `public MulticastSocket()`            | 使用本机默认地址、随机端口来创建`MulticastSocket`对象 |
|     `public MulticastSocket(int portNumber)`     | 使用本机默认地址、指定端口来创建`MulticastSocket`对象 |
| `public MulticastSocket(SocketAddress bindaddr)` | 使用本机指定 IP 地址、指定端口来创建`MulticastSocket` |

### 方法

|                  方法                   |                     说明                      |
| :-------------------------------------: | :-------------------------------------------: |
| `joinGroup(InetAddress multicastAddr)`  |  将该`MulticastSocket`加入指定的多点广播地址  |
| `leaveGroup(InetAddress multicastAddr)` |  让该`MulticastSocket`离开指定的多点广播地址  |
|            `setInterface()`             |    强制`MulticastSocket`使用指定的网络接口    |
|            `getInterface()`             |      查询`MulticastSocket`监听的网络接口      |
|        `setTimeToLive(int ttl)`         | `ttl`参数用于设置数据报最多可以跨过多少个网络 |

## 5. 示例

使用`MulticastSocket`实现的一个基于广播的多人聊天室。

