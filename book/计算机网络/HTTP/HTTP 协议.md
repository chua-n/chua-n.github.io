---
title: HTTP 协议
date: 2022-10-11 20:31:00
---

> 很好的阅读资料：[HTTP | MDN (mozilla.org)](https://developer.mozilla.org/en-US/docs/Web/HTTP)

## 1. 踏入山门

### 1.1 TCP/IP

为了准确无误地将数据送达目标处，TCP 协议采用了**三报文握手**（three-way handshaking）策略。用 TCP 协议把数据包送出去后，TCP 不会对传送后的情况置之不理，它一定会向对方确认是否成功送达。握手过程中使用了 TCP 的标志（flag）：**SYN**（synchronize）和 **ACK**（acknowledgement）。

发送端首先发送一个带 SYN 标志的数据包给对方。接收端收到后，回传一个带有 SYN/ACK 标志的数据包以示传达确认信息。最后，发送端再回传一个带 ACK 标志的数据包，代表“握手”结束。

若在握手过程中某个阶段莫名中断，TCP 协议会再次以相同的顺序发送相同的数据包。

![image-20221010141758665](https://figure-bed.chua-n.com/杂技/计算机网络/image-20221010141758665.png)

### 1.2 基于 TCP/IP 的 HTTP 传输过程

![image-20221010140908985](https://figure-bed.chua-n.com/杂技/计算机网络/image-20221010140908985.png)

发送端在层与层之间传输数据时，每经过一层时必定会被打上一个该层所属的首部信息。反之，接收端在层与层传输数据时，每经过一层时会把对应的首部消去。这种把数据信息包装起来的做法称为**封装**。

### 1.3 URI 与 URL

定义：

- URI: Uniform Resource Identifier，统一**资源标志**符，用于标识某一互联网资源
- URL: Uniform Resource Locator，统一**资源定位**符，用于标识和定位某一互联网资源

> （个人理解）上述术语中的“统一”只是说使用一个大一统的规则，千万不要将它误以为带有“唯一”的意思。

#### 白话例子

用大白话讲，URI 就是在某一规则下能把一个资源独一无二地标识出来。

拿人作例子，假设这个世界上所有人的名字都不能重复，那么名字就是 URI 的一个实例，通过名字这个字符串就可以标识出唯一的一个人；而现实当中名字当然是会重复的，所以身份证号才是 URI，通过身份证号能让我们能且仅能确定一个人。

那统一资源定位符 URL 是什么呢？

也拿人作例子然后跟 HTTP 的 URL 做类比，就可以有：`动物住址协议://地球/中国/浙江省/杭州市/西湖区/某大学/14号宿舍楼/525号寝/张三.人`，于是，这相字符串同样标识出了唯一的一个人，相当于也起到了 URI 的作用。URL 是以描述人的位置来唯一确定一个人的。

所以不论是用定位的方式还是用身份证号的方式，我们都可以唯一确定一个人，这些都是 URI 的一种实现，*所谓的 URL 就是用定位的方式实现的 URI 而已*。

#### 谁是谁的子集？

网上很多帖子花很大力气来表达“URL 是 URI 的子集”这一概念，感觉这实在是没有必要，反而容易歧路亡羊。

实际上，从表达的内容实体来讲，由于“URL 是用定位的方式实现的 URI”，URL 确实是 URI 的子集。

但是，从用字符串表达 URI 和 URL 的方式本身来看，名子`张三`是 URI，张三的定位方式`动物住址协议://地球/中国/浙江省/杭州市/西湖区/某大学/14号宿舍楼/525号寝/张三.人`是 URL，直观望去，为了表达这个一长串的 URL，通常要用到表示相应 URI 的`张三`，也就是说 URI 往往是 URL 的一部分。因此，直观上可以认为“URI 是 URL 的子集”。

综上，笔者认为反复强调“URL 是 URI 的子集”这一概念实在是太无聊了。建议忘记这件事吧，返璞归真，从最朴素的视角理解相关的概念即可。

#### URL 的构成

URL 一般有以下部分组成：

```
scheme:[subscheme:]//[username:password@]host:port/path?query#fragment
```

- `scheme`: 通信协议，例如 http、https 等

- `subscheme`：子协议，可选，常用于区分数据库

    > 例子：
    >
    > - `jdbc:mysql://localhost:3306/nemo?user=root&password=123456`
    > - `jdbc:oracle:thin:@localhost:1521:nemo`
    > - `jdbc:sqlserver://localhost:1433:DatabaseName=nemo`

- `username:password`：可选，用户名密码。

    > 例子，正如命令`ssh user@127.0.0.1`：
    >
    > - http://user:123@baidu.com/login
    > - ftp://user:123@127.0.0.1
    > - telnet://user:123@127.0.0.1
    > - ssh://user:123@127.0.0.1

- `host`: 服务器的域名主机名或 IP 地址

- `port`: 端口号，可选

- `path`: 目录，由`/`隔开的字符串，表示的是主机上的目录或文件地址

- `query`: 查询，可选。可以给动态网页传递参数，用`&`隔开，每个参数的名和值用`=`隔开；

- `fragment`: 信息片段 ID，字符串，可选。用于指定网络资源中的某片断

#### HTTP 协议中的请求 URI

对于 HTTP 请求而言，通常称一个 URL 中的路径部分为**请求 URI**（request-URI)。

以 `GET /myTomcat/demo2?username=zhangsan HTTP/1.1` 为示例，请求 URI 是指 `/myTomcat/demo2`。

### 1.4 HTTP 概览

HTTP 协议规定，请求从客户端发出，然后服务器端响应该请求并返回。换句话说，肯定是先从客户端开始建立通信的，服务器端在没有接收到请求之前不会发送响应。

|                        请求报文的构成                        |                        响应报文的构成                        |
| :----------------------------------------------------------: | :----------------------------------------------------------: |
| ![image-20221011102119184](https://figure-bed.chua-n.com/杂技/计算机网络/image-20210905164945301.png) | ![image-20221011102354273](https://figure-bed.chua-n.com/杂技/计算机网络/image-20221011102354273.png) |

HTTP 是一种不保存状态，即**无状态（stateless）协议**。HTTP 协议自身不对请求和响应之间的通信状态进行保存：

![image-20221011102604097](https://figure-bed.chua-n.com/杂技/计算机网络/image-20221011102604097.png)

HTTP 协议使用 URI 定位互联网上的资源，如果不是访问特定资源而是对服务器本身发起请求，可以用一个`*`来代替请求 URI。例如下面`OPTIONS * HTTP/1.1`可以查询 HTTP 服务器端支持的 HTTP 方法种类。

## 2. HTTP 方法

下表列出了 HTTP/1.1 支持的方法，注意方法名区分大小写，必须使用大写字母：

|  方法   |          说明          |
| :-----: | :--------------------: |
|   GET   |        获取资源        |
|  POST   |      传输实体主体      |
|   PUT   |        传输文件        |
|  HEAD   |      获取报文首部      |
| DELETE  |        删除文件        |
| OPTIONS |     询问支持的方法     |
|  TRACE  |        追踪路径        |
| CONNECT | 要求用隧道协议连接代理 |

在 HTTP/1.1 中，所有的连接默认都是持久连接（keey-alive）：

![image-20221011103345667](https://figure-bed.chua-n.com/杂技/计算机网络/image-20221011103345667.png)

持久连接使得多数请求以管线化（pipelining）方式发送成为可能。从前发送请求后需等待并收到响应，才能发送下一个请求。管线化技术出现后，不用等待响应亦可直接发送下一个请求：

![image-20221011103704035](https://figure-bed.chua-n.com/杂技/计算机网络/image-20221011103704035.png)

## 3. HTTP 报文

用于 HTTP 协议交互的信息被称为 HTTP 报文。请求端（客户端）的 HTTP 报文叫做请求报文，响应端（服务器端）的叫做响应报文。

HTTP 报文本身是由多行（用 CR+LF 作换行符）数据构成的字符串文本。

HTTP 报文大致可分为**报文首部**和**报文主体**两块。两者由第一个出现的空行（CR+LF）来划分。通常，并不一定要有报文主体。

![image-20221011112715447](https://figure-bed.chua-n.com/杂技/计算机网络/image-20221011112715447.png)

### 3.1 请求报文及响应报文的结构

结构划分：

![image-20221011113235286](https://figure-bed.chua-n.com/杂技/计算机网络/image-20221011113235286.png)

示例：

![image-20221011113300440](https://figure-bed.chua-n.com/杂技/计算机网络/image-20221011113300440.png)

对于请求/响应报文的首部而言：

- 请求行：包含用于请求的方法，请求 URI 和 HTTP 版本
- 状态行：包含表明响应结果的状态码，原因短语和 HTTP 版本
- 首部字段：包含表示请求和响应的各种条件和属性的各类首部。一般有 4 种首部，分别是：
    - 通用首部
    - 请求首部
    - 响应首部
    - 实体首部
- 其他：可能包含 HTTP 的 RFC 里未定义的首部（Cookie 等）

### 3.2 报文主体 vs 实体主体

- 报文（message）：是 HTTP 通信中的基本单位，由 8 位组字节流（octet sequence，其中 octet 为 8 个比特）组成，通过 HTTP 通信传输。
- 实体（entity）：作为请求或响应的有效载荷数据（补充项）被传输，其内容由实体首部和实体主体组成。

HTTP 报文的主体用于传输请求或响应的实体主体。通常，报文主体等于实体主体，只有当传输中进行编码操作时，实体主体的内容发生变化，才导致它和报文主体产生差异。

> HTTP 在传输数据时可以按照数据原貌直接传输，但也可以在传输过程中通过编码提升传输速率。通过在传输时编码，能有效地处理大量的访问请求。但是，编码的操作需要计算机来完成，因此会消耗更多的 CPU 等资源。

常用的内容压缩编码有以下几种：

- gzip（GNU zip）
- compress（UNIX 系统的标准压缩）
- deflate（zlib）
- identity（不进行编码）

当然，编码也可以通过将实体主体分块的形式来进行，通过分块传输编码，可以把数据分割成多块，能够让浏览器逐步显示页面：

![image-20221011142143998](https://figure-bed.chua-n.com/杂技/计算机网络/image-20221011142143998.png)

### 3.3 发送多种数据的多部分对象集合

发送邮件时，我们可以在邮件里写入文字并添加多份附件。这是因为采用了 MIME（Multipurpose Internet Mail Extensions，多用途因特网邮件扩展）机制，它允许邮件处理文本、图片、视频等多个不同类型的数据。例如，图片等二进制数据以 ASCII 码字符串编码的方式指明，就是利用 MIME 来描述标记数据类型。而在 MIME 扩展中会使用一种称为**多部分对象集合**（Multipart）的方法，来容纳多份不同类型的数据：

![image-20221011142447040](https://figure-bed.chua-n.com/杂技/计算机网络/image-20221011142447040.png)

相应地，HTTP 协议中也采纳了多部分对象集合，发送的一份报文主体内可含有多类型实体。通常是在图片或文本文件等上传时使用。多部分对象集合包含的对象如下：

- `multipart/form-data`：在 Web 表单文件上传时使用

- `multipart/byteranges`：状态码 206（Partial Content，部分内容）响应报文包含了多个范围的内容时使用

- `multipart/form-data`

    ```http
    Content-Type: multipart/form-data; boundary=AaB03x
    　--AaB03x
    Content-Disposition: form-data; name="field1"
    　
    Joe Blow
    --AaB03x
    Content-Disposition: form-data; name="pics"; filename="file1.txt"
    Content-Type: text/plain
    　
    ...（file1.txt 的数据）...
    --AaB03x--
    ```

- `multipart/byteranges`

    ```http
    HTTP/1.1 206 Partial Content
    Date: Fri, 13 Jul 2012 02:45:26 GMT
    Last-Modified: Fri, 31 Aug 2007 02:02:20 GMT
    Content-Type: multipart/byteranges; boundary=THIS_STRING_SEPARATES
    
    --THIS_STRING_SEPARATES
    Content-Type: application/pdf
    Content-Range: bytes 500-999/8000
    
    ...（范围指定的数据）...
    --THIS_STRING_SEPARATES
    Content-Type: application/pdf
    Content-Range: bytes 7000-7999/8000
    
    ...（范围指定的数据）...
    --THIS_STRING_SEPARATES--
    ```

在 HTTP 报文中使用多部分对象集合时，需要在首部字段里加上`Content-type`；同时使用 `boundary` 字符串来划分多部分对象集合指明的各类实体，在 `boundary` 字符串指定的各个实体的起始行之前插入`--`标记，而在多部分对象集合对应的字符串的最后插入`--`标记作为结束。

多部分对象集合的每个部分类型中，都可以含有首部字段。另外，可以在某个部分中嵌套使用多部分对象集合。

### 3.4 获取部分内容的范围请求

指定范围发送的请求叫做**范围请求**（Range Request），比如，对一份 10 000 字节大小的资源，如果使用范围请求，可以只请求 5001~10 000 字节内的资源。

![image-20221011144814387](https://figure-bed.chua-n.com/杂技/计算机网络/image-20221011144814387.png)

执行范围请求时，会用到首部字段 `Range` 来指定资源的 byte 范围，byte 范围的指定形式如下：

- 5001~10 000 字节

    ```http
    Range: bytes=5001-10000
    ```

- 从 5001 字节之后全部的

    ```http
    Range: bytes=5001-
    ```

- 从一开始到 3000 字节和 5000~7000 字节的多重范围

    ```http
    Range: bytes=-3000, 5000-7000
    ```

针对范围请求，响应会返回状态码为 `206 Partial Content` 的响应报文。另外，对于多重范围的范围请求，响应会在首部字段 `Content-Type` 标明 `multipart/byteranges` 后返回响应报文。如果服务器端无法响应范围请求，则会返回状态码 `200 OK` 和完整的实体内容。

## 4. HTTP 状态码

HTTP 状态码（HTTP Status Code）的职责是当客户端向服务器端发送请求时，描述返回的请求结果：

![image-20221011145501308](https://figure-bed.chua-n.com/杂技/计算机网络/image-20221011145501308.png)

### 4.1 状态码分类

HTTP 状态码由三个十进制数字组成，第一个十进制数字定义了状态码的类型，后两个数字没有分类的作用。HTTP 状态码共分为 5 种类型：

| 状态码 |               类别               |                  作用                  |
| :----: | :------------------------------: | :------------------------------------: |
|  1**   |  Informational（信息性状态码）   | 服务器收到请求，需要请求者继续执行操作 |
|  2**   |      Success（成功状态码）       |          操作被成功接收并处理          |
|  3**   |   Redirection（重定向状态码）    |       需要进一步的操作以完成请求       |
|  4**   | Client Error（客户端错误状态码） |     请求包含语法错误或无法完成请求     |
|  5**   | Server Error（服务端错误状态码） |   服务器在处理请求的过程中发生了错误   |

只要遵守状态码类别的定义，即使改变 RFC2616 中定义的状态码，或服务器端自行创建状态码都没问题。

### 4.2 常用状态码列表

| 状态码 |         状态码英文名称          | 中文描述                                                     |
| :----: | :-----------------------------: | :----------------------------------------------------------- |
|  100   |            Continue             | 继续。客户端应继续其请求                                     |
|  101   |       Switching Protocols       | 切换协议。服务器根据客户端的请求切换协议。只能切换到更高级的协议，例如，切换到 HTTP 的新版本协议 |
|  200   |               OK                | 请求成功。一般用于 GET 与 POST 请求                              |
|  201   |             Created             | 已创建。成功请求并创建了新的资源                             |
|  202   |            Accepted             | 已接受。已经接受请求，但未处理完成                           |
|  203   |  Non-Authoritative Information  | 非授权信息。请求成功。但返回的 meta 信息不在原始的服务器，而是一个副本 |
|  204   |           No Content            | 无内容。服务器成功处理，但未返回内容。在未更新网页的情况下，可确保浏览器继续显示当前文档 |
|  205   |          Reset Content          | 重置内容。服务器处理成功，用户终端（例如：浏览器）应重置文档视图。可通过此返回码清除浏览器的表单域 |
|  206   |         Partial Content         | 部分内容。服务器成功处理了部分 GET 请求                        |
|  300   |        Multiple Choices         | 多种选择。请求的资源可包括多个位置，相应可返回一个资源特征与地址的列表用于用户终端（例如：浏览器）选择 |
|  301   |        Moved Permanently        | 永久移动。请求的资源已被永久的移动到新 URI，返回信息会包括新的 URI，浏览器会自动定向到新 URI。今后任何新的请求都应使用新的 URI 代替 |
|  302   |              Found              | 临时移动。与 301 类似。但资源只是临时被移动。客户端应继续使用原有 URI |
|  303   |            See Other            | 查看其它地址。与 301 类似。使用 GET 和 POST 请求查看               |
|  304   |          Not Modified           | 未修改。所请求的资源未修改，服务器返回此状态码时，不会返回任何资源。客户端通常会缓存访问过的资源，通过提供一个头信息指出客户端希望只返回在指定日期之后修改的资源 |
|  305   |            Use Proxy            | 使用代理。所请求的资源必须通过代理访问                       |
|  306   |             Unused              | 已经被废弃的 HTTP 状态码                                       |
|  307   |       Temporary Redirect        | 临时重定向。与 302 类似。使用 GET 请求重定向                     |
|  400   |           Bad Request           | 客户端请求的语法错误，服务器无法理解                         |
|  401   |          Unauthorized           | 请求要求用户的身份认证                                       |
|  402   |        Payment Required         | 保留，将来使用                                               |
|  403   |            Forbidden            | 服务器理解请求客户端的请求，但是拒绝执行此请求               |
|  404   |            Not Found            | 服务器无法根据客户端的请求找到资源（网页）。通过此代码，网站设计人员可设置"您所请求的资源无法找到"的个性页面 |
|  405   |       Method Not Allowed        | 客户端请求中的方法被禁止                                     |
|  406   |         Not Acceptable          | 服务器无法根据客户端请求的内容特性完成请求                   |
|  407   |  Proxy Authentication Required  | 请求要求代理的身份认证，与 401 类似，但请求者应当使用代理进行授权 |
|  408   |        Request Time-out         | 服务器等待客户端发送的请求时间过长，超时                     |
|  409   |            Conflict             | 服务器完成客户端的  PUT 请求时可能返回此代码，服务器处理请求时发生了冲突 |
|  410   |              Gone               | 客户端请求的资源已经不存在。410 不同于 404，如果资源以前有现在被永久删除了可使用 410 代码，网站设计人员可通过 301 代码指定资源的新位置 |
|  411   |         Length Required         | 服务器无法处理客户端发送的不带 Content-Length 的请求信息       |
|  412   |       Precondition Failed       | 客户端请求信息的先决条件错误                                 |
|  413   |    Request Entity Too Large     | 由于请求的实体过大，服务器无法处理，因此拒绝请求。为防止客户端的连续请求，服务器可能会关闭连接。如果只是服务器暂时无法处理，则会包含一个 Retry-After 的响应信息 |
|  414   |      Request-URI Too Large      | 请求的 URI 过长（URI 通常为网址），服务器无法处理               |
|  415   |     Unsupported Media Type      | 服务器无法处理请求附带的媒体格式                             |
|  416   | Requested range not satisfiable | 客户端请求的范围无效                                         |
|  417   |       Expectation Failed        | 服务器无法满足 Expect 的请求头信息                             |
|  500   |      Internal Server Error      | 服务器内部错误，无法完成请求                                 |
|  501   |         Not Implemented         | 服务器不支持请求的功能，无法完成请求                         |
|  502   |           Bad Gateway           | 作为网关或者代理工作的服务器尝试执行请求时，从远程服务器接收到了一个无效的响应 |
|  503   |       Service Unavailable       | 由于超载或系统维护，服务器暂时的无法处理客户端的请求。延时的长度可包含在服务器的 Retry-After 头信息中 |
|  504   |        Gateway Time-out         | 充当网关或代理的服务器，未及时从远端服务器获取请求           |
|  505   |   HTTP Version not supported    | 服务器不支持请求的 HTTP 协议的版本，无法完成处理               |

特殊说明：

- 304 虽然被划分在 3XX 类别中，但是和重定向没有关系。

- 401 状态码表示发送的请求需要有通过 HTTP 认证的认证信息，另外若之前已进行过 1 次请求，则表示用户认证失败

    ![image-20221011150309031](https://figure-bed.chua-n.com/杂技/计算机网络/image-20221011150309031.png)

- 403 状态码表明对请求资源的访问被服务器拒绝了，服务器端没有必要给出拒绝的详细理由，但如果想作说明的话，可以在实体的主体部分对原因进行描述

    ![image-20221011150519798](https://figure-bed.chua-n.com/杂技/计算机网络/image-20221011150519798.png)

## 5. HTTP 首部

在客户端与服务器之间以 HTTP 协议进行通信的过程中，无论是请求还是响应都会使用首部字段，它能起到传递额外重要信息的作用。

使用首部字段是为了给浏览器和服务器提供报文主体大小、所使用的语言、认证信息等内容。

### 5.1 首部字段的结构

HTTP 首部字段由首部字段名和字段值构成，中间用冒号`:`分隔，如下，其中`Content-Type`为首部字段名，字符串`text/html`表示字段值：

```http
Content-Type: text/html
```

单个 HTTP 首部字段可以有多个值，用逗号`,`分隔：

```http
Keep-Alive: timeout=15, max=100
```

> 若 HTTP 首部字段重复了会如何？
>
> 当 HTTP 报文首部中出现了两个或两个以上具有相同首部字段名时，这种情况在规范内尚未明确，根据浏览器内部处理逻辑的不同，结果可能并不一致。有些浏览器会优先处理第一次出现的首部字段，而有些则会优先处理最后出现的首部字段。

### 5.2 首部字段类型

#### HTTP/1.1 规范字段

HTTP 首部字段根据实际用途被分为以下 4 种类型，同时 HTTP/1.1 规范定义了如下 47 种首部字段：

- 通用首部字段（General Header Fields）：请求报文和响应报文两方都会使用的首部。

    |    首部字段名     |            说明            |
    | :---------------: | :------------------------: |
    |   Cache-Control   |       控制缓存的行为       |
    |    Connection     |    逐跳首部、连接的管理    |
    |       Date        |     创建报文的日期时间     |
    |      Pragma       |          报文指令          |
    |      Trailer      |     报文末端的首部一览     |
    | Transfer-Encoding | 指定报文主体的传输编码方式 |
    |      Upgrade      |       升级为其他协议       |
    |        Via        |    代理服务器的相关信息    |
    |      Warning      |          错误通知          |

- 请求首部字段（Request Header Fields）：从客户端向服务器端发送请求报文时使用的首部。补充了请求的附加内容、客户端信息、响应内容相关优先级等信息。

    |     首部字段名      |                     说明                      |
    | :-----------------: | :-------------------------------------------: |
    |       Accept        |           用户代理可处理的媒体类型            |
    |   Accept-Charset    |                 优先的字符集                  |
    |   Accept-Encoding   |                优先的内容编码                 |
    |   Accept-Language   |            优先的语言（自然语言）             |
    |    Authorization    |                  Web 认证信息                  |
    |       Expect        |             期待服务器的特定行为              |
    |        From         |              用户的电子邮箱地址               |
    |        Host         |              请求资源所在服务器               |
    |      If-Match       |             比较实体标记（ETag）              |
    |  If-Modified-Since  |              比较资源的更新时间               |
    |    If-None-Match    |       比较实体标记（与 If-Match 相反）        |
    |      If-Range       |     资源未更新时发送实体 Byte 的范围请求      |
    | If-Unmodified-Since | 比较资源的更新时间（与 If-Modified-Since 相反） |
    |    Max-Forwards     |                最大传输逐跳数                 |
    | Proxy-Authorization |        代理服务器要求客户端的认证信息         |
    |        Range        |              实体的字节范围请求               |
    |       Referer       |           对请求中 URI 的原始获取方           |
    |         TE          |               传输编码的优先级                |
    |     User-Agent      |             HTTP 客户端程序的信息             |

- 响应首部字段（Response Header Fields）：从服务器端向客户端返回响应报文时使用的首部。补充了响应的附加内容，也会要求客户端附加额外的内容信息。

    |     首部字段名     |             说明             |
    | :----------------: | :--------------------------: |
    |   Accept-Ranges    |     是否接受字节范围请求     |
    |        Age         |     推算资源创建经过时间     |
    |        ETag        |        资源的匹配信息        |
    |      Location      |   令客户端重定向至指定 URI    |
    | Proxy-Authenticate | 代理服务器对客户端的认证信息 |
    |    Retry-After     |   对再次发起请求的时机要求   |
    |       Server       |     HTTP 服务器的安装信息     |
    |        Vary        |   代理服务器缓存的管理信息   |
    |  WWW-Authenticate  |   服务器对客户端的认证信息   |

- 实体首部字段（Entity Header Fields）：针对请求报文和响应报文的实体部分使用的首部。补充了资源内容更新时间等与实体有关的信息。

    |    首部字段名    |             说明             |
    | :--------------: | :--------------------------: |
    |      Allow       |     资源可支持的 HTTP 方法     |
    | Content-Encoding |    实体主体适用的编码方式    |
    | Content-Language |      实体主体的自然语言      |
    |  Content-Length  | 实体主体的大小（单位：字节） |
    | Content-Location |      替代对应资源的 URI       |
    |   Content-MD5    |      实体主体的报文摘要      |
    |  Content-Range   |      实体主体的位置范围      |
    |   Content-Type   |      实体主体的媒体类型      |
    |     Expires      |    实体主体过期的日期时间    |
    |  Last-Modified   |    资源的最后修改日期时间    |

此外，根据缓存代理和非缓存代理的行为区别，HTTP 首部字段可以分为 2 种类型：

- 逐跳首部（Hop-by-hop Header）：此类别中的首部只对单次转发有效，会因通过缓存或代理而不再转发。HTTP/1.1 和之后版本中，如果要使用 hop-by-hop 首部，需提供 Connection 首部字段。逐跳首部字段有：
    - Connection
    - Keep-Alive
    - Proxy-Authenticate
    - Proxy-Authorization
    - Trailer
    - TE
    - Transfer-Encoding
    - Upgrade
- 端到端首部（End-to-end Header）：此类别中的首部会转发给请求 / 响应对应的最终接收目标，且必须保存在由缓存生成的响应中，另外规定它必须被转发。除了上述 8 个逐跳首部字段，其他所有字段都属于端到端首部

#### 非 HTTP/1.1 首部字段

在 HTTP 协议通信交互中使用到的首部字段，不限于 RFC2616 中定义的 47 种首部字段。还有 Cookie、Set-Cookie 和 Content-Disposition 等在其他 RFC 中定义的首部字段，它们的使用频率也很高。

这些非正式的首部字段统一归纳在 RFC4229 HTTP Header Field Registrations 中。

- Content-disposition：服务器告诉客户端以什么格式打开响应数据。

  - inline：默认值，在当前页面内打开
  - attachment; filename=xxx：以附件形式打开响应体，即文件下载

### 5.3 首部字段作用详情

> 参考《图解 HTTP》等资料吧。

## 6. 使用 Cookie 的状态管理

不可否认，无状态协议当然也有它的优点。由于不必保存状态，自然可减少服务器的 CPU 及内存资源的消耗。从另一侧面来说，也正是因为 HTTP 协议本身是非常简单的，所以才会被应用在各种场景里：

![image-20221011110408327](https://figure-bed.chua-n.com/杂技/计算机网络/image-20221011110408327.png)

保留无状态协议这个特征的同时又要解决类似的矛盾问题，于是引入了 Cookie 技术。Cookie 技术通过在请求和响应报文中写入 Cookie 信息来控制客户端的状态。

- 没有 Cookie 信息状态下的请求

  ![image-20221011110551890](https://figure-bed.chua-n.com/杂技/计算机网络/image-20221011110551890.png)

- 第 2 次以后（存有 Cookie 信息状态）的请求

  ![image-20221011110600103](https://figure-bed.chua-n.com/杂技/计算机网络/image-20221011110600103.png)

有了 Cookie 后，HTTP 请求报文和响应报文的内容发生的变化如下：

- 请求报文（没有 Cookie 信息的状态）

  ```http
  GET /reader/ HTTP/1.1
  Host: hackr.js
  * 首部字段内没有 Cookie 的相关信息
  ```

- 响应报文（服务器端生成 Cookie 信息）

  ```http
  HTTP/1.1 200 OK
  Date: Thu, 12 Jul 2012 07:12:20 GMT
  Server: Apache
  <Set-Cookie: sid=1342077140226724; path=/; expires=Wed, 10-Oct-12 07:12:20 GMT>
  Content-Type: text/plain; charset=UTF-8
  ```

- 请求报文（*自动*发送保存着的 Cookie 信息）

  ```http
  GET /image/ HTTP/1.1
  Host: hackr.jp
  Cookie: sid=1342077140226724
  ```

