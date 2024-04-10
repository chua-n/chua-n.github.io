---
title: Web请求过程
date: 2021-06-27
---

## 1. HTTP

B/S架构中，服务端基于统一的HTTP，而传统的C/S架构使用自定义的应用层协议。

和大多数传统C/S互联网应用程序采用的长连接的交互模型不同，HTTP采用无状态的短连接的通信方式，通常情况下，一次请求就完成了一次数据交互，通常也对应一个业务逻辑，然后这次通信连接就断开了。采用这种方式是为了能够同时服务更多的用户，因为当前互联网应用每天都会处理上亿的用户请求，不可能每个用户访问一次后就一直保持这个连接。

### 常见Java web服务器软件

由于使用统一的HTTP，所以基于HTTP的服务器就有很多，如Apache, IIS, Nginx, Tomcat, JBoss等，这些服务器可以直接拿来使用，不需要服务开发者单独来开发。

| Web服务器软件 | 描述                                                         |
| :-----------: | ------------------------------------------------------------ |
|   webLogic    | oracle公司，大型的JavaEE服务器，支持所有的JavaEE规范，收费   |
|   webSphere   | IBM公司，大型的JavaEE服务器，支持所有的JavaEE规范，收费      |
|     JBOSS     | JBOSS公司，大型的JavaEE服务器，支持所有的JavaEE规范，收费    |
|  **Tomcat**   | Apache基金组织，中小型的JavaEE服务器，仅支持少量的JavaEE规范，如servlet、jsp，开源免费 |

> 重点需要关注Tomcat。

概念辨析：

- 服务器：安装了服务器软件的计算机。
- 服务器软件：接收用户的请求、处理请求、做出响应。
- 在web服务器软件中，可以部署web项目，让用户通过浏览器来访问这些项目。web服务器软件也被称为**web容器**。
- JavaEE: Java语言在企业级开发中使用的技术规范的总和，一共规定了13项大的规范。

### 互联网不变的原则

不管网络架构如何变化，始终有一些固定不变的原则需要遵守：

1. 互联网上所有资源都要用一个URL来表示；

2. 必须基于HTTP与服务端交互；

3. 数据展示必须在浏览器中进行。

### 其他方式发起HTTP请求

如何发起一个HTTP请求和如何建立一个Socket连接区别不大，只不过outputStream.write写的二进制字节数据格式要符合HTTP。

既然发起一个HTTP连接本质上就是建立一个Socket连接，那么我们完全可以模拟浏览器来发起HTTP请求，这很好实现，也有很多方法来做，比如HttpClient就是一个开源的、通过程序实现的、处理HTTP请求的工具包，还有linux中的curl命令等。

### Web请求过程

<img src="https://figure-bed.chua-n.com/notebook/JavaWeb/后端/8.png" alt="image-20211009232347506" style="zoom:50%;" />

当一个用户在浏览器里输入 www.taobao.com 这个URL时，将会发生很多操作：

1. 首先它会请求DNS把这个域名解析成对应的IP地址
2. 然后根据这个IP地址在互联网上找到对应的服务器
3. 向这个服务器发起一个get请求
4. 由这个服务器决定返回默认的数据资源给访问的用户。

实际上，在服务器端还有很复杂的业务逻辑：

- 服务器可能有很多台，到底指定哪台服务器来处理请求——这需要一个负载均衡设备来平均分配所有用户的请求；
- 请求的数据是存储在分布式缓存里、一个静态文件中、还是在数据库里；
- 当数据返回浏览器时，浏览器解析数据发现还有一些静态资源（如css, js 或图片）时又会发起另外的HTTP请求，而这些请求很可能会在CDN上，那么CDN服务器又会处理这个用户的请求。

> 大体上一个用户请求会涉及这么多的操作，每一个细节都会影响这个请求最终是否会成功。

## 2. 浏览器缓存机制

浏览器缓存是一个比较复杂但又比较重要的机制，在我们浏览一个页面时发现有异常的情况下，通常考虑的就是是不是浏览器做了缓存，所以一般的做法就是按Ctrl+F5组合键重新请求一次这个页面，此时在HTTP的请求头中会增加一些请求头，它告诉服务器端我们要获取最新的数据而不是缓存，因而重新请求的页面肯定是最新的页面。

<img src="https://figure-bed.chua-n.com/notebook/JavaWeb/后端/9.png" style="zoom:80%;" />

> 请求头中多了两个请求项：
>
> - Pragma:no-cache
> - Cache-Control:no-cache

### 请求字段：Cache-Control

请求字段Cache-Control的可选值：

| 可选值                               | 说明                                                         |
| ------------------------------------ | ------------------------------------------------------------ |
| public                               | 所有内容都将被缓存，在响应头中设置                           |
| private                              | 内容只缓存到私有缓存中，在响应头中设置                       |
| no-cache                             | 所有内容都不会被缓存，在请求头和响应头中设置                 |
| no-store                             | 所有内容都不会被缓存到缓存或Interget临时文件中，在响应头中设置 |
| must-revalidation/proxy-revalidation | 如果缓存的内容失效，请求必须发送到服务器/代码以进行重新验证，在请求头中设置 |
| max-age=xxx                          | 缓存的内容将在xxx秒后失效，这个选项只在HTTP 1.1中可用，和Last-Modified一起使用时优先级较高，在响应头中设置 |

Cache-Control请求字段被各个浏览器支持得较好，而且它的优先级也比较高，在和其他一些请求字段（如Expires）同时出现时，Cache-Control会覆盖其他字段。

### 请求字段：Pragma

Pragma字段的作用和Cache-Control有点类似，它也是在HTTP头中包含一个特殊的指令，使相关的服务器遵守该指令，最常用的就是Pragma:no-cache，它和Cache-Control:no-cache的作用一样。

### 请求字段：Expires

请求字段Expires：Expires通常的使用格式是 Expires: Sat, 25 Feb 2012 12:22:17 GMT，后面跟着一个日期和时间，超过这个时间值后，缓存的内容将失效，也就是浏览器在发出请求之前检查这个页面的这个字段，看该页面是否已经过期了，过期了就重新向服务器发起请求。

### 响应字段：Last-Modified

响应字段Last-Modified：一般用于表示一个服务器上的资源的最后修改时间，该资源可以是静态的或动态的内容，其中静态内容自动加上Last-Modified字段，对于动态内容Servlet提供了一个getLastModified方法。

通过这个响应字段可以判断当前请求的资源是否是最新的，如Last-Modified: Sat, 25 Feb 2012 12:55:04 GMT，那么在下次浏览器请求时在请求头增加一个If-Modified-Since: Sat, 25 Feb 2012 12:55:04 GMT字段，询问当前缓存的页面是否发生了变化，如果没有则服务器返回304状态码，告诉浏览器是最新的，同时服务器也不会再次传输被缓存的数据。

### 响应字段：Etag

与Last-Modifed字段有类似功能的还有一个Etag字段，其作用是让服务端给每个页面分配一个唯一的编号，然后通过编号来区分当前页面是否是最新的，这种方式比Last-Modifed更灵活，但在后端的Web服务器有多台时比较难处理，因为每个Web服务器都要记住网站的所有资源，否则浏览器返回这个编号就没有意义了。

## 3. DNS域名解析

虽然我们平时上网感觉不到DNS解析的存在，但是一旦DNS解析出错，可能会导致非常严重的互联网灾难。目前世界上的整个互联网有几个DNS根域名服务器，任何一台坏掉后果都会非常严重。

### 3.1 域名解析过程

DNS域名解析的过程大概有10步，如图所示：

<img src="https://figure-bed.chua-n.com/notebook/JavaWeb/后端/10.png" style="zoom:67%;" />

在浏览器中输入域名并回车后：

> DNS域名解析的10个步骤中的前两步都是在本机进行的，因此在图1-10中没有表示出来。

1. 第1步，由于浏览器对于域名也有缓存机制，浏览器会检查缓存中有没有这个域名对应的解析过的IP地址，如果有，整个解析过程就将结束。不过，浏览器对缓存大小有缓存时间都有限制，缓存时间通常为几分钟到几小时不等，可通过TTL属性来设置。
2. 第2步，如果浏览器没有对应的域名解析结果的缓存，浏览器会查找操作系统缓存中是否有相应结果。其实操作系统也会有一个域名解析的过程，
    - 在Windows中可以通过C:\Windows\System32\drivers\etc\hosts文件来设置，可以将任何域名解析到任何能够访问的IP地址（为防止黑客攻击等恶性操作，Windows7中将hosts文件设置成了只读的，防止该文件被轻易修改）。
    - 在Linux中这个配置文件是/etc/hosts，修改这个文件可以达到同样的目的。
3. 第3步，在我们的网络配置中都会有“DNS服务器地址”这一项，用于提供DNS解析服务，其通常位于所在城市的某个角落，通常不会很远，所以也称LDNS。例如，假如你是在学校接入互联网，你的DNS服务器肯定在你学校；假如你在一个小区，那么这个DNS就是提供给你接入互联网的应用提供商，即电信、联通等，也就是通常所说的SPA。
    - 在windows下可以通过ipconfig查询这个地址；
    - 在linux下可以通过如下方式查询配置的DNS Server。
    - 这个专门的域名解析服务器性能都会很好，其一般也会缓存域名解析结果，大约80%的域名解析都到这里就结束了。
4. 第4步，如果LNDS仍然没有命中，就直接到根域名服务器请求解析。
5. 第5步，根域名服务器返回给LDNS一个所查询域的主域名服务器(gTLD Server)地址。gTLD是国际顶级域名服务器，如.com, .cn, .org等，全球只有13台左右。
6. 第6步，LDNS再向上一步返回的gTLD服务器发送请求。
7. 第7步，接受请求的gTLD服务器查找并返回此域名对应的**Name Server域名服务器**中的地址，这个Name Server通常就是你注册的域名服务器，例如你在某个域名服务提供商申请的域名，那么这个域名解析任务就由这个域名提供商的服务器来完成。
8. 第8步，Name Server域名服务器会查询存储的域名和IP的映射关系表，在正常情况下都根据域名得到目标IP记录，连同一个TTL值返回给DNS Server域名服务器。
9. 第9步，返回该域名对应的IP和TTL值，Local DNS Server会缓存这个域名和IP的对应关系，缓存的时间由TTL值控制。
10. 第10步，把解析的结果返回给用户，用户根据TTL值缓存在本地系统缓存中，域名解析过程结束。

在实际的DNS解析过程中，可能还不止这10个步骤，如 Name Server 也可能有多级，或者有一个GTM来负载均衡控制，这都有可能会影响域名解析的过程。

### 3.2 查看域名解析结果

在linux和windows下都可以用`nslookup`命令来查询域名的解析结果：

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

在linux系统中还可以使用`dig`命令来查询DNS的解析过程，如`dig [www.taobao.com](http://www.taobao.com)`，其中通过+trace参数还可跟踪这个域名的解析过程。

### 3.3 清除DNS解析缓存

清除本机的DNS解析缓存（当然，重启电脑依然是解决很多问题的第一选择）：

- Windows：`ipconfig /flushdns`
- Linux：`/etc/init.d/nscd restart`

清除JVM的DNS解析缓存：

> 在Java应用中JVM也会缓存DNS的解析结果，这个缓存是在`InetAddress`类中完成的，而且这个缓存时间还比较特殊，它有两种缓存策略：一种是正确解析结果缓存，另一种是失败的解析结果缓存。这两个缓存时间由两个配置项控制，配置项是在`%JAVA_HOME%\lib\security\java.security`文件中配置的。两个配置项分别是`networkaddress.cache.ttl`和`networkaddress.cache.negative.ttl`，它们的默认值分别是-1（永不失效）和10（缓存10秒）。
>
> 要修改这两个值同样有几种方式，分别是：直接修改`java.security`文件中的默认值、在Java的启动参数中增加`-Dsun.net.inetaddr.ttl=xxx`来修改默认值、通过`InetAddress`类动态修改。
>
> 在这里还要特别强调一下，如果我们需要用`InetAddress`类解析域名，必须是单例模式，不然会有严重的性能问题，如果每次都创建InetAddress实例，则每次都要进行一次完整的域名解析，非常耗时，对这一点要特别注意。

### 3.4 域名解析的方式

几种域名解析的方式——A记录、MX记录、CNAME记录、NS记录、TXT记录。

1. A记录：A代表Address，即IP地址，A记录用来将某域名指定到某IP上。A记录可以将多个域名解析到同一个IP地址，但是不能将一个域名解析到多个IP地址。

2. MX记录：MX为Mail Exchange，其可以将某个域名下的邮件服务器指向自己的Mail Server。如taobao.com域名的A记录IP地址是115.238.25.xxx，如果将MX记录设置为115.238.25.xxx，即xxx@taobao.com的邮件路由，DNS会将邮件发送到114.238.25.xxx所在的服务器，而正常通过web请求的话仍然解析到A记录的IP地址。

3. CNAME记录：全称是Canonical Name（别名解析），意即可以为一个域名设置一个或多个别名。如将taobao.com解析到xulingbo.net，将srcfan.com也解析到xulingbo.net，其中xulingbo.net分别是taobao.com和srcfan.com的别名。

4. NS记录：为某个域名指定DNS解析服务器，也就是这个域名有指定的IP地址的DNS服务器去解析。

5. TXT记录：为某个主机名或域名设置说明。如可以为xulingbo.net设置TXT为“君山的博客|许令波”这样的说明。

## 4. CDN工作机制

### 4.1 总述

CDN（Content Delivery Network），指内容分配式网络，是构筑在现有Internet上的一种先进的流量分配网络。CDN的目的是通过在现有的Internet中增加一层新的网络架构，将网站的内容发布到最接近用户的网络“边缘”，使用户可以就近取得所需的内容，提高用户访问网站的响应速度。

CDN不同于镜像，它比镜像更智能，可以做下面这样一个比喻——因而CDN可以明显提高Internet中信息流动的效率：
$$
CDN=镜像（Mirror）+缓存（Cache）+整体负载均衡（GSLB）
$$
目前CDN都以缓存网站中的静态数据为主。

通常的CDN架构：

<img src="https://figure-bed.chua-n.com/notebook/JavaWeb/后端/11.png" alt="image-20211010111124657" style="zoom:67%;" />

### 4.2 负载均衡

负载均衡（Load Balance）就是对工作任务进行平衡、分摊到多个操作单元上执行，如图片服务器、应用服务器等，共同完成工作任务。它可以提高服务器响应速度及利用效率，避免软件或者硬件模块出现单点失效，解决网络拥塞问题，实现地理位置无关性，为用户提供较一致的访问质量。

通常有三种负载均衡架构，分别是链路负载均衡、集群负载均衡、操作系统负载均衡。

### 4.3 CDN的动态加速技术

CDN的动态加速技术也是当前比较流行的一种优化技术，它的技术原理就是在CDN的DNS解析中通过动态的链路探测来寻找回源最好的一条路径，然后通过DNS的调度将所有请求调度到选定的这条路径上回源，从而加速用户访问的效率。

<img src="https://figure-bed.chua-n.com/notebook/JavaWeb/后端/12.png" style="zoom:67%;" />

由于CDN节点是遍布全国的，所以用户接入一个CDN节点后，可以选择一条从离用户最近的CDN节点到源站链路最好的路径让用户走。一个简单的原则就是在每个CDN节点上从源站下载一个一定大小的文件，看哪个链路的总耗时最短，这样可以构成一个链路列表，然后绑定到DNS解析上，更新到CDN的Local DNS。当然是否走这个并不一定根据耗时这个唯一条件，有时也要考虑网络成本，例如走某个节点虽然可以节省10ms，但是网络带宽的成本却增加了很多，还有其他网络链路的安全等因素也要综合考虑。

