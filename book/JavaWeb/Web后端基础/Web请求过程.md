---
title: Web 请求过程
date: 2021-06-27
---

## 1. HTTP

B/S 架构中，服务端基于统一的 HTTP，而传统的 C/S 架构使用自定义的应用层协议。

和大多数传统 C/S 互联网应用程序采用的长连接的交互模型不同，HTTP 采用无状态的短连接的通信方式，通常情况下，一次请求就完成了一次数据交互，通常也对应一个业务逻辑，然后这次通信连接就断开了。采用这种方式是为了能够同时服务更多的用户，因为当前互联网应用每天都会处理上亿的用户请求，不可能每个用户访问一次后就一直保持这个连接。

### 常见 Java Web 服务器软件

由于使用统一的 HTTP，所以基于 HTTP 的服务器就有很多，如 Apache, IIS, Nginx, Tomcat, JBoss 等，这些服务器可以直接拿来使用，不需要服务开发者单独来开发。

| Web 服务器软件 | 描述                                                         |
| :-----------: | ------------------------------------------------------------ |
|   webLogic    | Oracle 公司，大型的 JavaEE 服务器，支持所有的 JavaEE 规范，收费   |
|   webSphere   | IBM 公司，大型的 JavaEE 服务器，支持所有的 JavaEE 规范，收费      |
|     JBOSS     | JBOSS 公司，大型的 JavaEE 服务器，支持所有的 JavaEE 规范，收费    |
|    Tomcat     | Apache 基金组织，中小型的 JavaEE 服务器，仅支持少量的 JavaEE 规范，如 servlet、jsp，开源免费 |

> 重点需要关注 Tomcat。

概念辨析：

- 服务器：安装了服务器软件的计算机。
- 服务器软件：接收用户的请求、处理请求、做出响应。
- 在 web 服务器软件中，可以部署 web 项目，让用户通过浏览器来访问这些项目。web 服务器软件也被称为** web 容器**。
- JavaEE: Java 语言在企业级开发中使用的技术规范的总和，一共规定了 13 项大的规范。

### 互联网不变的原则

不管网络架构如何变化，始终有一些固定不变的原则需要遵守：

1. 互联网上所有资源都要用一个 URL 来表示；

2. 必须基于 HTTP 与服务端交互；

3. 数据展示必须在浏览器中进行。

### 其他方式发起 HTTP 请求

如何发起一个 HTTP 请求和如何建立一个 Socket 连接区别不大，只不过 outputStream.write 写的二进制字节数据格式要符合 HTTP。

既然发起一个 HTTP 连接本质上就是建立一个 Socket 连接，那么我们完全可以模拟浏览器来发起 HTTP 请求，这很好实现，也有很多方法来做，比如 HttpClient 就是一个开源的、通过程序实现的、处理 HTTP 请求的工具包，还有 Linux 中的 curl 命令等。

### Web 请求过程

<img src="https://figure-bed.chua-n.com/JavaWeb/后端/8.png" alt="image-20211009232347506" style="zoom:50%;" />

当一个用户在浏览器里输入 www.taobao.com 这个 URL 时，将会发生很多操作：

1. 首先它会请求 DNS 把这个域名解析成对应的 IP 地址
2. 然后根据这个 IP 地址在互联网上找到对应的服务器
3. 向这个服务器发起一个 get 请求
4. 由这个服务器决定返回默认的数据资源给访问的用户。

实际上，在服务器端还有很复杂的业务逻辑：

- 服务器可能有很多台，到底指定哪台服务器来处理请求——这需要一个负载均衡设备来平均分配所有用户的请求；
- 请求的数据是存储在分布式缓存里、一个静态文件中、还是在数据库里；
- 当数据返回浏览器时，浏览器解析数据发现还有一些静态资源（如 css, js 或图片）时又会发起另外的 HTTP 请求，而这些请求很可能会在 CDN 上，那么 CDN 服务器又会处理这个用户的请求。

> 大体上一个用户请求会涉及这么多的操作，每一个细节都会影响这个请求最终是否会成功。

## 2. 浏览器缓存机制

浏览器缓存是一个比较复杂但又比较重要的机制，在我们浏览一个页面时发现有异常的情况下，通常考虑的就是是不是浏览器做了缓存，所以一般的做法就是按 Ctrl+F5 组合键重新请求一次这个页面，此时在 HTTP 的请求头中会增加一些请求头，它告诉服务器端我们要获取最新的数据而不是缓存，因而重新请求的页面肯定是最新的页面。

<img src="https://figure-bed.chua-n.com/JavaWeb/后端/9.png" style="zoom:80%;" />

> 请求头中多了两个请求项：
>
> - Pragma:no-cache
> - Cache-Control:no-cache

### 请求字段：Cache-Control

请求字段 Cache-Control 的可选值：

| 可选值                               | 说明                                                         |
| ------------------------------------ | ------------------------------------------------------------ |
| public                               | 所有内容都将被缓存，在响应头中设置                           |
| private                              | 内容只缓存到私有缓存中，在响应头中设置                       |
| no-cache                             | 所有内容都不会被缓存，在请求头和响应头中设置                 |
| no-store                             | 所有内容都不会被缓存到缓存或 Interget 临时文件中，在响应头中设置 |
| must-revalidation/proxy-revalidation | 如果缓存的内容失效，请求必须发送到服务器/代码以进行重新验证，在请求头中设置 |
| max-age=xxx                          | 缓存的内容将在 xxx 秒后失效，这个选项只在 HTTP 1.1 中可用，和 Last-Modified 一起使用时优先级较高，在响应头中设置 |

Cache-Control 请求字段被各个浏览器支持得较好，而且它的优先级也比较高，在和其他一些请求字段（如 Expires）同时出现时，Cache-Control 会覆盖其他字段。

### 请求字段：Pragma

Pragma 字段的作用和 Cache-Control 有点类似，它也是在 HTTP 头中包含一个特殊的指令，使相关的服务器遵守该指令，最常用的就是 Pragma:no-cache，它和 Cache-Control:no-cache 的作用一样。

### 请求字段：Expires

请求字段 Expires：Expires 通常的使用格式是 Expires: Sat, 25 Feb 2012 12:22:17 GMT，后面跟着一个日期和时间，超过这个时间值后，缓存的内容将失效，也就是浏览器在发出请求之前检查这个页面的这个字段，看该页面是否已经过期了，过期了就重新向服务器发起请求。

### 响应字段：Last-Modified

响应字段 Last-Modified：一般用于表示一个服务器上的资源的最后修改时间，该资源可以是静态的或动态的内容，其中静态内容自动加上 Last-Modified 字段，对于动态内容 Servlet 提供了一个 getLastModified 方法。

通过这个响应字段可以判断当前请求的资源是否是最新的，如 Last-Modified: Sat, 25 Feb 2012 12:55:04 GMT，那么在下次浏览器请求时在请求头增加一个 If-Modified-Since: Sat, 25 Feb 2012 12:55:04 GMT 字段，询问当前缓存的页面是否发生了变化，如果没有则服务器返回 304 状态码，告诉浏览器是最新的，同时服务器也不会再次传输被缓存的数据。

### 响应字段：Etag

与 Last-Modifed 字段有类似功能的还有一个 Etag 字段，其作用是让服务端给每个页面分配一个唯一的编号，然后通过编号来区分当前页面是否是最新的，这种方式比 Last-Modifed 更灵活，但在后端的 Web 服务器有多台时比较难处理，因为每个 Web 服务器都要记住网站的所有资源，否则浏览器返回这个编号就没有意义了。

## 3. DNS 域名解析

虽然我们平时上网感觉不到 DNS 解析的存在，但是一旦 DNS 解析出错，可能会导致非常严重的互联网灾难。目前世界上的整个互联网有几个 DNS 根域名服务器，任何一台坏掉后果都会非常严重。

### 3.1 域名解析过程

DNS 域名解析的过程大概有 10 步，如图所示：

<img src="https://figure-bed.chua-n.com/JavaWeb/后端/10.png" style="zoom:67%;" />

在浏览器中输入域名并回车后：

> DNS 域名解析的 10 个步骤中的前两步都是在本机进行的，因此在图 1-10 中没有表示出来。

1. 第 1 步，由于浏览器对于域名也有缓存机制，浏览器会检查缓存中有没有这个域名对应的解析过的 IP 地址，如果有，整个解析过程就将结束。不过，浏览器对缓存大小有缓存时间都有限制，缓存时间通常为几分钟到几小时不等，可通过 TTL 属性来设置。
2. 第 2 步，如果浏览器没有对应的域名解析结果的缓存，浏览器会查找操作系统缓存中是否有相应结果。其实操作系统也会有一个域名解析的过程，
    - 在 Windows 中可以通过`C:\Windows\System32\drivers\etc\hosts`文件来设置，可以将任何域名解析到任何能够访问的 IP 地址（为防止黑客攻击等恶性操作，Windows7 中将 hosts 文件设置成了只读的，防止该文件被轻易修改）。
    - 在 Linux 中这个配置文件是`/etc/hosts`，修改这个文件可以达到同样的目的。
3. 第 3 步，在我们的网络配置中都会有“DNS 服务器地址”这一项，用于提供 DNS 解析服务，其通常位于所在城市的某个角落，通常不会很远，所以也称 LDNS。例如，假如你是在学校接入互联网，你的 DNS 服务器肯定在你学校；假如你在一个小区，那么这个 DNS 就是提供给你接入互联网的应用提供商，即电信、联通等，也就是通常所说的 SPA。
    - 在 Windows 下可以通过`ipconfig`查询这个地址；
    - 在 Linux 下可以通过如下方式查询配置的 DNS Server。
    - 这个专门的域名解析服务器性能都会很好，其一般也会缓存域名解析结果，大约 80%的域名解析都到这里就结束了。
4. 第 4 步，如果 LDNS 仍然没有命中，就直接到根域名服务器请求解析。
5. 第 5 步，根域名服务器返回给 LDNS 一个所查询域的主域名服务器 (gTLD Server) 地址。gTLD 是国际顶级域名服务器，如。com, .cn, .org 等，全球只有 13 台左右。
6. 第 6 步，LDNS 再向上一步返回的 gTLD 服务器发送请求。
7. 第 7 步，接受请求的 gTLD 服务器查找并返回此域名对应的** Name Server 域名服务器**中的地址，这个 Name Server 通常就是你注册的域名服务器，例如你在某个域名服务提供商申请的域名，那么这个域名解析任务就由这个域名提供商的服务器来完成。
8. 第 8 步，Name Server 域名服务器会查询存储的域名和 IP 的映射关系表，在正常情况下都根据域名得到目标 IP 记录，连同一个 TTL 值返回给 DNS Server 域名服务器。
9. 第 9 步，返回该域名对应的 IP 和 TTL 值，Local DNS Server 会缓存这个域名和 IP 的对应关系，缓存的时间由 TTL 值控制。
10. 第 10 步，把解析的结果返回给用户，用户根据 TTL 值缓存在本地系统缓存中，域名解析过程结束。

在实际的 DNS 解析过程中，可能还不止这 10 个步骤，如 Name Server 也可能有多级，或者有一个 GTM 来负载均衡控制，这都有可能会影响域名解析的过程。

### 3.2 查看域名解析结果

在 Linux 和 Windows 下都可以用`nslookup`命令来查询域名的解析结果：

- Windows

    ```cmd
    C:\Users\chuan>nslookup
    默认服务器:  XiaoQiang
    Address:  192.168.31.1
    
    > www.taobao.com
    服务器:  XiaoQiang
    Address:  192.168.31.1
    
    非权威应答:
    名称:    www.taobao.com.danuoyi.tbcache.com
    Addresses:  2408:8614:460:0:3::3fa
              2408:8614:460:0:3::3f9
              27.211.197.171
              27.211.197.172
    Aliases:  www.taobao.com
    
    > www.chua-n.com
    服务器:  XiaoQiang
    Address:  192.168.31.1
    
    非权威应答:
    名称:    chua-n.github.io
    Addresses:  185.199.108.153
              185.199.110.153
              185.199.109.153
              185.199.111.153
    Aliases:  www.chua-n.com
    
    >
    ```

- Linux

    ```bash
    chuan@RedmiBook-2021:/mnt/c/Users/chuan$ nslookup
    > www.taobao.com
    Server:         192.168.31.1
    Address:        192.168.31.1#53
    
    Non-authoritative answer:
    www.taobao.com  canonical name = www.taobao.com.danuoyi.tbcache.com.
    Name:   www.taobao.com.danuoyi.tbcache.com
    Address: 27.211.197.171
    Name:   www.taobao.com.danuoyi.tbcache.com
    Address: 27.211.197.172
    Name:   www.taobao.com.danuoyi.tbcache.com
    Address: 2408:8614:460:0:3::3f9
    Name:   www.taobao.com.danuoyi.tbcache.com
    Address: 2408:8614:460:0:3::3fa
    > www.chua-n.com
    Server:         192.168.31.1
    Address:        192.168.31.1#53
    
    Non-authoritative answer:
    www.chua-n.com  canonical name = chua-n.github.io.
    Name:   chua-n.github.io
    Address: 185.199.111.153
    Name:   chua-n.github.io
    Address: 185.199.108.153
    Name:   chua-n.github.io
    Address: 185.199.110.153
    Name:   chua-n.github.io
    Address: 185.199.109.153
    >
    ```

在 Linux 系统中还可以使用`dig`命令来查询 DNS 的解析过程，如`dig [www.taobao.com](http://www.taobao.com)`，其中通过+trace 参数还可跟踪这个域名的解析过程。

### 3.3 清除 DNS 解析缓存

清除本机的 DNS 解析缓存（当然，重启电脑依然是解决很多问题的第一选择）：

- Windows：`ipconfig /flushdns`
- Linux：`/etc/init.d/nscd restart`

清除 JVM 的 DNS 解析缓存：

- 在 Java 应用中 JVM 也会缓存 DNS 的解析结果，这个缓存是在`InetAddress`类中完成的，而且这个缓存时间还比较特殊，它有两种缓存策略：一种是正确解析结果缓存，另一种是失败的解析结果缓存。这两个缓存时间由两个配置项控制，配置项是在`%JAVA_HOME%\lib\security\java.security`文件中配置的。两个配置项分别是`networkaddress.cache.ttl`和`networkaddress.cache.negative.ttl`，它们的默认值分别是-1（永不失效）和 10（缓存 10 秒）。
- 要修改这两个值同样有几种方式，分别是：直接修改`java.security`文件中的默认值、在 Java 的启动参数中增加`-Dsun.net.inetaddr.ttl=xxx`来修改默认值、通过`InetAddress`类动态修改。
- 在这里还要特别强调一下，如果我们需要用`InetAddress`类解析域名，必须是单例模式，不然会有严重的性能问题，如果每次都创建`InetAddress`实例，则每次都要进行一次完整的域名解析，非常耗时，对这一点要特别注意。

### 3.4 域名解析的方式

几种域名解析的方式——A 记录、MX 记录、CNAME 记录、NS 记录、TXT 记录。

1. A 记录：A 代表 Address，即 IP 地址，A 记录用来将某域名指定到某 IP 上。A 记录可以将多个域名解析到同一个 IP 地址，但是不能将一个域名解析到多个 IP 地址。

2. MX 记录：MX 为 Mail Exchange，其可以将某个域名下的邮件服务器指向自己的 Mail Server。如 taobao.com 域名的 A 记录 IP 地址是 115.238.25.xxx，如果将 MX 记录设置为 115.238.25.xxx，即 xxx@taobao.com 的邮件路由，DNS 会将邮件发送到 114.238.25.xxx 所在的服务器，而正常通过 web 请求的话仍然解析到 A 记录的 IP 地址。

3. CNAME 记录：全称是 Canonical Name（别名解析），意即可以为一个域名设置一个或多个别名。如将 taobao.com 解析到 xulingbo.net，将 srcfan.com 也解析到 xulingbo.net，其中 xulingbo.net 分别是 taobao.com 和 srcfan.com 的别名。

4. NS 记录：为某个域名指定 DNS 解析服务器，也就是这个域名由指定的 IP 地址的 DNS 服务器去解析。

5. TXT 记录：为某个主机名或域名设置说明。如可以为 xulingbo.net 设置 TXT 为“君山的博客|许令波”这样的说明。

## 4. CDN 工作机制

### 4.1 总述

CDN（Content Delivery Network），指内容分配式网络，是构筑在现有 Internet 上的一种先进的流量分配网络。CDN 的目的是通过在现有的 Internet 中增加一层新的网络架构，将网站的内容发布到最接近用户的网络“边缘”，使用户可以就近取得所需的内容，提高用户访问网站的响应速度。

CDN 不同于镜像，它比镜像更智能，可以做下面这样一个比喻——因而 CDN 可以明显提高 Internet 中信息流动的效率：
$$
CDN=镜像（Mirror）+缓存（Cache）+整体负载均衡（GSLB）
$$
目前 CDN 都以缓存网站中的静态数据为主。

通常的 CDN 架构：

<img src="https://figure-bed.chua-n.com/JavaWeb/后端/11.png" alt="image-20211010111124657" style="zoom:67%;" />

### 4.2 负载均衡

负载均衡（Load Balance）就是对工作任务进行平衡、分摊到多个操作单元上执行，如图片服务器、应用服务器等，共同完成工作任务。它可以提高服务器响应速度及利用效率，避免软件或者硬件模块出现单点失效，解决网络拥塞问题，实现地理位置无关性，为用户提供较一致的访问质量。

通常有三种负载均衡架构，分别是*链路负载均衡*、*集群负载均衡*、*操作系统负载均衡*。

### 4.3 CDN 的动态加速技术

CDN 的动态加速技术也是当前比较流行的一种优化技术，它的技术原理就是在 CDN 的 DNS 解析中通过动态的链路探测来寻找回源最好的一条路径，然后通过 DNS 的调度将所有请求调度到选定的这条路径上回源，从而加速用户访问的效率。

<img src="https://figure-bed.chua-n.com/JavaWeb/后端/12.png" style="zoom:67%;" />

由于 CDN 节点是遍布全国的，所以用户接入一个 CDN 节点后，可以选择一条从离用户最近的 CDN 节点到源站链路最好的路径让用户走。一个简单的原则就是在每个 CDN 节点上从源站下载一个一定大小的文件，看哪个链路的总耗时最短，这样可以构成一个链路列表，然后绑定到 DNS 解析上，更新到 CDN 的 Local DNS。当然是否走这个并不一定根据耗时这个唯一条件，有时也要考虑网络成本，例如走某个节点虽然可以节省 10 ms，但是网络带宽的成本却增加了很多，还有其他网络链路的安全等因素也要综合考虑。
