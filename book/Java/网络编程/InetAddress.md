---
title: InetAddress
---

Java 的 `InetAddress` 类代表 IP 地址，`InetAddress` 下还有两个子类：`Inet4Address, Inet6Address`，它们分别代表 IPv4 与 IPv6 地址。

`InetAddress` 类没有提供构造器，而是提供了两个静态方法来获取 `InetAddress` 实例：

|              方法              |                      说明                       |
| :----------------------------: | :---------------------------------------------: |
|    `getByName(String host)`    |      根据主机获取对应的 `InetAddress` 对象      |
| `getByAddress(byte[] address)` | 根据原始 IP 地址来获取对应的 `InetAddress` 对象 |

`InetAddress` 类提供的方法：

|                方法                 |                     说明                      |
| :---------------------------------: | :-------------------------------------------: |
|   `String getCanonicalHostName()`   |          获取此 IP 地址的全限定域名           |
|      `String getHostAddress()`      | 返回该 `InetAddress` 实例对应的 IP 地址字符串 |
|       `String getHostName()`        |            获取此 IP 地址的主机名             |
|       `boolean isReachable()`       |             测试是否可到达该地址              |
| `static InetAddress getLocalHost()` |   获取本机 IP 地址对应的 `InetAddress` 实例   |

