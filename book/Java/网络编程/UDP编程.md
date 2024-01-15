## 1. UDP协议

UDP协议的主要作用是完成网络数据流和数据报之间的转换——在信息的发送端，UDP协议将网络数据流封装成数据报，然后将数据报发送出去；在信息的接收端，UDP协议将数据报转换成实际数据内容。

可以认为UDP协议的Socket类似于码头，数据报则类似于集装箱，码头的作用就是负责发送、接收集装箱，Java使用DatagramSocket代表这个码头。DatagramSocket的作用就是发送、接收数据报，数据报在Java中以DatagramPacket来代表。因此对于基于UDP协议的通信双方而言，没有所谓的客户端和服务器端的概念。

## 2. DatagramSocket类

Java提供了**DatagramSocket**对象作为基于UDP协议的Socket，使用DatagramPacket代表DatagramSocket发送、接收的数据报。

## 2.1 构造方法

| 构造方法                                     | 说明                                                         |
| -------------------------------------------- | ------------------------------------------------------------ |
| DatagramSocket()                             | 创建一个DatagramSocket实例，并将该对象绑定到本机默认IP地址、本机所有可用端口中随机选择的某个端口 |
| DatagramSocket(int  port)                    | 创建一个DatagramSocket实例，并将该对象绑定到本机默认IP地址、指定端口 |
| DatagramSocket(int  port, InetAddress laddr) | 创建一个DatagramSocket实例，并将该对象绑定到指定IP地址、指定端口 |

## 2.2 方法

| 方法                       | 说明                                 |
| -------------------------- | ------------------------------------ |
| receive(DatagramPacket  p) | 从该DatagramSocket中接收数据报       |
| send(DatagramPacket  p)    | 以该DatagramSocket对象向外发送数据报 |

由receive/send这两个方法也可看出，使用DatagramSocket发送数据报时，DatagramSocket并不知道将该数据报发送到哪里，而是由DatagramPacket自身决定数据报的目的地。就像码头并不知道每个集装箱的目的地，码头只是将这些集装箱发送出去，而集装箱本身包含了该集装箱的目的地。

### 2.3 其他

使用DatagramSocket进行网络通信时，“服务器端”无须也无法保存每个“客户端”的状态，客户端把数据报发送到服务器端后，完全有可能立即退出。但不管客户端是否退出，服务器端都无法知道客户端的状态。

## 3. DatagramPacket类

### 3.1 构造器

| 构造方法                                                     | 说明                                                         |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| DatagramPacket(byte[]  buf, int length)                      | 以一个空数组来创建  DatagramPacket对象，该对象的作用是接收  DatagramSocket中的数据 |
| DatagramPacket(byte[]  buf, int length, InetAddress addr, int port) | 以一个包含数据的数组来创建  DatagramPacket对象，同时指定数据报的目的IP地址和端口 |
| DatagramPacket(byte[]  buf, int offset, int length)          | 以一个空数组来创建  DatagramPacket对象，并指定接收到的数据放入buf数组中时从offset开始，最多放length个字节 |
| DatagramPacket(byte[]  buf, int offset, int length, InetAddress addr, int port) | 创建一个用于发送的  DatagramPacket对象，指定发送buf数组中从offset开始的总共length个字节 |

### 3.2 方法

| 方法                              | 说明                                                         |
| --------------------------------- | ------------------------------------------------------------ |
| InetAddress  getAddress()         | 当程序准备发送此数据报时，该方法返回此数据报的目标机器的IP地址；当程序刚接收到一个数据报时，该方法返回该数据报的发送主机的IP地址 |
| int  getPort()                    | 当程序准备发送此数据报时，该方法返回此数据报的目标机器的端口；当程序刚接收到一个数据报时，该方法返回该数据报的发送主机的端口 |
| SocketAddress  getSocketAddress() | 当程序……，……目标机器的SocketAddress；当程序……，……发送主机的SocketAddress |

## 4. MulticastSocket类

MulticastSocket是DatagramSocket的一个子类，即它是特殊的DatagramSocket。

DatagramSocket只允许数据报发送给指定的目标地址，而**MulticastSocket**可以将数据报以广播方式发送到多个客户端。

IP多点广播实现了将单一信息发送到多个接收者的广播，其思想是设置一组特殊网络地址作为多点广播地址，每一个多点广播地址都被看做一个组，当客户端需要发送、接收广播信息时，加入到该组即可。

IP协议点多点广播提供了这批特殊的IP地址，这些IP地址的范围是224.0.0.0~239.255.255.255。多点广播示意图如下：

![52](https://chua-n.gitee.io/figure-bed/notebook/Java/52.png)

### 构造方法

|                    构造方法                     |                        说明                         |
| :---------------------------------------------: | :-------------------------------------------------: |
|            public  MulticastSocket()            | 使用本机默认地址、随机端口来创建MulticastSocket对象 |
|     public  MulticastSocket(int portNumber)     | 使用本机默认地址、指定端口来创建MulticastSocket对象 |
| public  MulticastSocket(SocketAddress bindaddr) |  使用本机指定IP地址、指定端口来创建MulticastSocket  |

### 方法

|                  方法                  |                             说明                             |
| :------------------------------------: | :----------------------------------------------------------: |
| joinGroup(InetAddress  multicastAddr)  |          将该MulticastSocket加入指定的多点广播地址           |
| leaveGroup(InetAddress  multicastAddr) |          让该MulticastSocket离开指定的多点广播地址           |
|             setInterface()             |            强制MulticastSocket使用指定的网络接口             |
|             getInterface()             |              查询MulticastSocket监听的网络接口               |
|        setTimeToLive(int  ttl)         | ttl参数用于设置数据报最多可以跨过多少个网络，默认为1               0            本地主机                  1            本地局域网                  32            本站点的网络                  64            本地区                  128            本大洲                  255            所有地方 |

## 5. 示例

使用MulticastSocket实现的一个基于广播的多人聊天室。

