## 1. 简介

先要知识：在一个web页面中，每一个图片等都是一个资源，每一个资源对应一个单独的请求。

HTTP（Hyper Text Transfer Protocol）超文本传输协议。所谓传输协议，即定义了客户端与服务端通信时，发据数据的格式。

HTTP的特点：

1. 基于基础协议TCP/IP协议的高级协议；
2. 默认端口号：80
3. 基于请求/响应模型：一次请求对应一次响应；
4. 无状态的：每次请求之间相互独立，不能交互数据。

HTTP的历史版本：

|  版本   |                特点                |
| :-----: | :--------------------------------: |
| 1.0版本 |  每一次请求-响应都会建立新的连接   |
| 1.1版本 | N次请求-响应会复用第一次建立的连接 |

## 2. 请求消息数据格式

### 2.1 请求行

| 格式                           | 示例                      |
| ------------------------------ | ------------------------- |
| 请求方式 请求url 请求协议/版本 | GET  /login.html HTTP/1.1 |

请求方式有7种，常用的为2种：

- GET
    - 请求参数在请求行中（在url后也会有体现）
    - 请求的url长度有限制
    - 不太安全
- POST
    - 请求参数在请求体中
    - 请求的url长度无限制
    - 相对安全

### 2.2 请求头

请求头指客户端浏览器向服务器报告自己的一些信息，请求头的名称是不变的，变化的是请求头的内容值。

格式：`请求头名称: 请求头值`（键值对形式）

示例：

```http
Host: localhost
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.96 Safari/537.36 Edg/88.0.705.56
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
Accept-Language: zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6
Accept-Encoding: gzip, deflate, br
Connection: keep-alive
Upgrade-Insecure-Requests: 1
……
```

常见的请求头：

- User-Agent：浏览器访问服务器所使用的浏览器版本信息
- Referer：告诉服务器我从哪里来，用以防盗链及统计工作

### 2.3 请求空行

就是一个空行，起分隔作用，分隔POST请求的请求头与请求体。

### 2.4 请求体

即请求正文，封装POST请求消息的请求参数。

格式：`参数=值`，如`username=zhangsan`

> 如果不是这种格式，是由于浏览器为了更易懂把它解析了。

## 3. 响应消息数据格式

### 3.1 响应行

格式与示例：`协议/版本 响应状态码 状态码描述`，`HTTP/1.1 200`

响应状态码：服务器告诉客户端浏览器本次请求和响应的一个状态。状态码都是3位数字，共5类。

| 状态码 |                             含义                             |
| :----: | :----------------------------------------------------------: |
|  1xx   | 服务器接收客户端消息但没有接收完成，等待一段时间后，发送1xx状态码。 |
|  2xx   |                       成功。典型：200                        |
|  3xx   |         重定向。典型：302（重定向）、304（访问缓存）         |
|  4xx   | 客户端错误。典型：404（请求路径没有对应资源）、405（请求方式没有对应的doXxx方法） |
|  5xx   |        服务器端错误。典型：500（服务器内部出现异常）         |

### 3.2 响应头

格式：`头名称: 值`

示例：

```http
Accept-Ranges: bytes
ETag: W/"278-1612939987627"
Last-Modified: Wed, 10 Feb 2021 06:53:07 GMT
Content-Type: text/html
Content-Length: 278
Date: Wed, 10 Feb 2021 06:58:19 GMT
Keep-Alive: timeout=20
Connection: keep-alive
```

常见的响应头：

- Content-Type：服务器告诉客户端本次的响应体数据格式以及编码格式。如：text/html;charset=UTF-8。

    > - text：文本内容
    > - html：文本类型为html
    > - charset：编码格式

- Content-Length：字节数

- Content-disposition：服务器告诉客户端以什么格式打开响应数据。

    - inline：默认值，在当前页面内打开
    - attachment; filename=xxx：以附件形式打开响应体，即文件下载

### 3.3 响应空行

同请求空行。

### 3.4 响应体

响应体：响应发送回客户端的真实数据。

```html
<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <title>test login</title>
</head>
<body>
    <form action="/myTomcat/demo1" method="POST">
        <input name="username">
        <input type="submit" value="提交">
    </form>
</body>
</html>
```

## 4. HTTP Header

要理解HTTP，最重要的就是要熟悉HTTP中的HTTP Header，Http Header控制着互联网上成千上万的用户的数据的传输。常见的如：

| 常见的HTTP请求头 | 说明                                                         |
| ---------------- | ------------------------------------------------------------ |
| Accept-Charset   | 用于指定客户端接受的字符集                                   |
| Accept-Encoding  | 用于指定可接受的内容编码，如Accept-Encoding:gzip.deflate     |
| Accept-Language  | 用于指定一种自然语言，如Accept-Language:zh-cn                |
| Host             | 用于指定被请求资源的Internet主机和端口号，如Host:www.taobao.com |
| User-Agent       | 客户端将它的操作系统、浏览器和其他属性告诉服务器             |
| Connection       | 当前连接是否保持，如Connection: Keep-Alive                   |

| 常见的HTTP响应头 | 说明                                                         |
| ---------------- | ------------------------------------------------------------ |
| Server           | 使用的服务器名称，如Server: Apache/1.3.6(Unix)               |
| Content-Type     | 用来指明发送给接收者的实体正文的媒体类型，如Content-Type:text/html;charset=GBK |
| Content-Encoding | 与请求报头Accept-Encoding对应，告诉浏览器服务端采用的是什么压缩编码 |
| Content-Language | 描述了资源所用的自然语言，与Accept-Language对应              |
| Content-Length   | 指明实体正文的长度，用以字节方式存储的十进制数字来表示       |
| Keep-Alive       | 保持连接的时间，如Keep-Alive: timeout=5,max=120              |

| 常见的HTTP状态码 | 说明                                   |
| ---------------- | -------------------------------------- |
| 200              | 客户端请求成功                         |
| 302              | 临时跳转，跳转的地址通过Location指定   |
| 400              | 客户端请求有语法错误，不能被服务器识别 |
| 403              | 服务器收到请求，但是拒绝提供服务       |
| 404              | 请求的资源不存在                       |
| 500              | 服务器发生不可预期的错误               |

## 
