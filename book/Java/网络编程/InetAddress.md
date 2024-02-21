---
title: InetAddress
---

Java的**InetAddress类**代表IP地址，InetAddress下还有两个子类：Inet4Address、Inet6Address，它们分别代表IPv4与IPv6地址。

InetAddress类没有提供构造器，而是提供了两个静态方法来获取InetAddress实例：

|             方法              |                   说明                    |
| :---------------------------: | :---------------------------------------: |
|    getByName(String  host)    |     根据主机获取对应的InetAddress对象     |
| getByAddress(byte[]  address) | 根据原始IP地址来获取对应的InetAddress对象 |

InetAddress类提供的方法：

|                方法                |                  说明                   |
| :--------------------------------: | :-------------------------------------: |
|   String  getCanonicalHostName()   |        获取此IP地址的全限定域名         |
|      String  getHostAddress()      | 返回该InetAddress实例对应的IP地址字符串 |
|       String  getHostName()        |          获取此IP地址的主机名           |
|       boolean  isReachable()       |          测试是否可到达该地址           |
| static  InetAddress getLocalHost() |   获取本机IP地址对应的InetAddress实例   |

