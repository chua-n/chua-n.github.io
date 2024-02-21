---
title: Proxy、ProxySelector
---

## 1. 代理服务器

代理服务器的功能就是代理用户去获得网络信息。**代理服务器**是介于浏览器和服务器之间的一台服务器，设置了代理服务器之后，浏览器不是直接向Web服务器发送请求，而是向代理服务器发送请求，再由代理服务器向真正的Web服务器发送请求，并取回浏览器所需要的信息，再送回给浏览器。

大部分代理服务器都具有**缓冲功能**，它会不断地将新取得的数据存储到代理服务器的本地存储器上，如果浏览器所请求的数据在它本机的存储器上已经存在而且是最新的，那么它就无须从Web服务器取数据，而直接将本地存储器上的数据送加浏览器，这样能显著提高浏览速度。

归纳起来，代理服务器主要提供如下两个功能：

1. 突破自身IP限制，对外隐藏自身IP地址。突破IP限制包括访问国外受限站点、访问国内特定单位/团体的内部资源；

2. 提高访问速度。

Java在java.net包下提供了**Proxy**和**ProxySelector**两个类，其中Proxy代表一个代理服务器，ProxySelector代表一个代理选择器，它提供了对代理服务器更加灵活的控制。

## 2. Proxy类

构造方法：`Proxy(Proxy.Type type, SocketAddress sa)`，其中sa参数指定代理服务器的地址，type表示该代理服务器的类型。

| 代理服务器的类型  |               说明                |
| :---------------: | :-------------------------------: |
| Proxy.Type.DIRECT |     表示直接连接，不使用代理      |
|  Proxy.Type.HTTP  | 表示支持高级协议代理，如HTTP或FTP |
| Proxy.Type.SOCKS  |      表示SOCKS(V4或V5）代理       |

和Proxy相关的URLConnection、Socket使用方法：

| 相关内容                                   | 说明                                                     |
| ------------------------------------------ | -------------------------------------------------------- |
| URLConnection  openConnection(Proxy proxy) | 方法，使用指定的代理服务器来打开连接                     |
| Socket(Proxy  proxy)                       | 构造器，使用指定的代理服务器创建一个没有连接的Socket对象 |

一旦创建Proxy对象，程序就可以在使用URLConnection打开连接时，或在创建Socket连接时传入一个Proxy对象，作为本次连接所使用的代理服务器。

```java
import java.io.IOException;
import java.io.PrintStream;
import java.net.InetSocketAddress;
import java.net.MalformedURLException;
import java.net.Proxy;
import java.net.URL;
import java.net.URLConnection;
import java.util.Scanner;
class ProxyTest {
    final String PROXY_ADDR = "129.82.12.188"; // 代理服务器的地址
    final int PROXY_PORT = 3124; // 代理服务器的端口
    
    String urlStr = "http://www.crazyit.org"; // 定义需要访问的网站地址
    
    public void init() throws IOException, MalformedURLException {
        URL url = new URL(urlStr);
        // 创建一个代理服务器对象
        Proxy proxy = new Proxy(Proxy.Type.HTTP, new InetSocketAddress(PROXY_ADDR, PROXY_PORT));
        // 使用指定的代理服务器打开连接
        URLConnection conn = url.openConnection(proxy);
        conn.setConnectTimeout(3000);
        try (
            // 通过代理服务器读取数据的Scanner
            Scanner scan = new Scanner(conn.getInputStream());
            PrintStream ps = new PrintStream("index.htm")) {
            while (scan.hasNextLine()) {
                String line = scan.nextLine();
                System.out.println(line); // 在控制台输出网页资源内容
                ps.println(line); // 将网页资源内容输出到指定输出流
            }
        }
    }
    
    public static void main(String[] args) throws IOException, MalformedURLException {
        new ProxyTest().init();
    }
}
```

## 3. ProxySelector抽象类

ProxySelector是一个抽象类，代表一个代理选择器，开发者需要继承ProxySelector来实现自己的代理选择器。

| 抽象方法                                                    | 说明                                                         |
| ----------------------------------------------------------- | ------------------------------------------------------------ |
| `List<Proxy> select(URI uri)`                               | 根据业务需要返回代理服务器列表，若该方法返回的集合中只包含一个Proxy，该Proxy将会作为默认的代理服务器 |
| `connectFailed(URI uri, SocketAddress sa, IOException ioe)` | 连接代理服务器失败时回调该方法                               |

ProxySelector的静态方法：

- `setDefault(ProxySelector ps)`：注册该代理选择器

示例：

```java
import java.io.IOException;
import java.net.InetSocketAddress;
import java.net.MalformedURLException;
import java.net.Proxy;
import java.net.ProxySelector;
import java.net.SocketAddress;
import java.net.URI;
import java.net.URL;
import java.net.URLConnection;
import java.util.ArrayList;
import java.util.List;

class ProxySelectorTest {
    final String PROXY_ADDR = "139.82.12.188"; // 代理服务器的地址
    final int PROXY_PORT = 3124; // 代理服务器的端口
    
    String urlStr = "http://www.crazyit.org"; // 定义需要访问的网站地址
    
    public void init() throws IOException, MalformedURLException {
        
        ProxySelector.setDefault(new ProxySelector() {
            @Override
            public void connectFailed(URI uri, SocketAddress sa, IOException ioException) {
                System.out.println("无法连接到指定代理服务器！");
            }
            
            // 根据业务需要返回特定的对应的代理服务器
            @Override
            public List<Proxy> select(URI uri) {
                // 本程序总是返回某个固定的代理服务器
                List<Proxy> result = new ArrayList<>();
                result.add(new Proxy(Proxy.Type.HTTP, new InetSocketAddress(PROXY_ADDR, PROXY_PORT)));
                return result;
            }
        });
        
        URL url = new URL(urlStr);
        // 没的指定代理服务器，直接打开连接
        URLConnection conn = url.openConnection();
        // ......
    }
}
```

