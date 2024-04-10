---
title: JWT
---

> 参考：
>
> - [JSON Web Token 入门教程 - 阮一峰的网络日志 (ruanyifeng.com)](https://www.ruanyifeng.com/blog/2018/07/json_web_token-tutorial.html) 。
> - [JavaGuide (gitee.io)](https://snailclimb.gitee.io/javaguide/#/docs/system-design/security/jwt-intro)

## 定义

JSON Web Token（缩写 JWT），是为了在网络应用环境间传递声明而执行的一种基于JSON的开放标准（[RFC 7519](https://link.jianshu.com?t=https://tools.ietf.org/html/rfc7519)）。该token被设计为紧凑且安全的，

JWT（JSON Web Token） 是目前最流行的跨域认证解决方案，是一种基于 JSON 形式的 Token 的认证授权机制。JWT 一般被用来在身份提供者和服务提供者之间传递被认证的用户身份信息，以便于从资源服务器获取资源，其特别适用于分布式站点的单点登录（SSO）场景，也可以增加一些额外的其它业务逻辑所必须的声明信息。

JWT 自身包含了身份验证所需要的所有信息，因此，我们的服务器不需要存储 Session 信息。这显然增加了系统的可用性和伸缩性，大大减轻了服务端的压力。可以看出，JWT 更符合设计 RESTful API 时的「Stateless（无状态）」原则。并且，使用 JWT 认证可以有效避免 CSRF 攻击，因为 JWT 一般是存在于 localStorage 中，使用 JWT 进行身份验证的过程中是不会涉及到 Cookie 的。

## JWT 的原理

JWT 的原理是，服务器认证以后，生成一个 JSON 对象，发回给用户，就像下面这样：

```js
{
  "姓名": "张三",
  "角色": "管理员",
  "到期时间": "2018年7月1日0点0分"
}
```

以后，用户与服务端通信的时候，都要发回这个 JSON 对象。服务器完全只靠这个对象认定用户身份。当然，为了防止用户篡改数据，服务器在生成这个对象的时候，会加上签名。

由此，服务器就不保存任何 session 数据了，也就是说，服务器变成无状态了，从而比较容易实现扩展。

## JWT 的数据结构

JWT 通常是这样的：`xxx.yyy.zzz`，其本质上就是一组字串，通过点（`.`）切分成三个为 Base64 编码的部分：

![此图片来源于：https://supertokens.com/blog/oauth-vs-jwt](https://figure-bed.chua-n.com/notebook/JavaWeb/Web安全/jwt-composition.png)

- **Header（头部）**: 描述 JWT 的元数据，定义了生成签名的算法以及 `Token` 的类型。
- **Payload（负载）**: 用来存放实际需要传递的数据
- **Signature（签名）**：签名。服务器通过 Payload、Header 和一个密钥(Secret)使用 Header 里面指定的签名算法（默认是 HMAC SHA256）生成。

示例：

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

Header 和 Payload 都是 JSON 格式的数据，Signature 由 Payload、Header 和 Secret（密钥）通过特定的计算公式和加密算法得到。

> 附：Header 和 Payload 串型化的算法是 Base64URL。这个算法跟 Base64 算法基本类似，但有一些小的不同。
>
> JWT 作为一个令牌（token），有些场合可能会放到 URL（比如 api.example.com/?token=xxx）。Base64 有三个字符`+`、`/`和`=`，在 URL 里面有特殊含义，所以要被替换掉：`=`被省略、`+`替换成`-`，`/`替换成`_` 。这就是 Base64URL 算法。

### Header

Header 通常由两部分组成：

- `typ`（Type）：令牌类型，也就是 JWT。
- `alg`（Algorithm） ：签名算法，比如 HS256。

示例：

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

JSON 形式的 Header 被转换成 Base64 编码，成为 JWT 的第一部分。

### Payload

Payload 也是 JSON 格式数据，用来存放实际需要传递的数据。JWT 规定了7个官方字段供选用：

- `iss`（issuer）：JWT 签发方。
- `iat`（issued at time）：JWT 签发时间。
- `sub`（subject）：JWT 主题。
- `aud`（audience）：JWT 接收方。
- `exp`（expiration time）：JWT 的过期时间。
- `nbf`（not before time）：JWT 生效时间，早于该定义的时间的 JWT 不能被接受处理。
- `jti`（JWT ID）：JWT 唯一标识。

当然也可以定义自己的私有字段，以下为一个示例：

```json
{
  "sub": "1234567890",
  "name": "John Doe",
  "admin": true
}
```

Payload 部分默认是不加密的，任何人都可以读到，所以不要把秘密信息放在这个部分。

JSON 形式的 Payload 被转换成 Base64 编码，成为 JWT 的第二部分。

### Signature

Signature 部分是对前两部分的签名，作用是防止 JWT（主要是 payload） 被篡改。

这个签名的生成需要用到：

- Header + Payload
- 存放在服务端的密钥（一定不能泄露出去）
- Header 里面指定的签名算法（默认是 HMAC SHA256）

签名的计算公式如下：

```js
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  secret
)
```

算出签名以后，把 Header、Payload、Signature 三个部分拼成一个字符串，每个部分之间用点（`.`）分隔，这个字符串就是要返回给用户的 JWT 。

## JWT 的使用方式

客户端收到服务器返回的 JWT，可以储存在 Cookie 里面，也可以储存在 localStorage。

此后，客户端每次与服务器通信，都要带上这个 JWT。你可以把它放在 Cookie 里面自动发送，但是这样不能跨域，所以更好的做法是放在 HTTP 请求的头信息`Authorization`字段里面。

> ```javascript
> Authorization: Bearer <token>
> ```

另一种做法是，跨域的时候，JWT 就放在 POST 请求的数据体里面。

## JWT 如何防篡改

有了签名之后，即使 JWT 被泄露或者截获，黑客也没办法同时篡改 Signature 、Header 、Payload。

这是为什么呢？因为服务端拿到 JWT 之后，会解析出其中包含的 Header、Payload 以及 Signature 。服务端会根据 Header、Payload、密钥再次生成一个 Signature。拿新生成的 Signature 和 JWT 中的 Signature 作对比，如果一样就说明 Header 和 Payload 没有被修改。

不过，如果服务端的秘钥也被泄露的话，黑客就可以同时篡改 Signature 、Header 、Payload 了。黑客直接修改了 Header 和 Payload 之后，再重新生成一个 Signature 就可以了。

因此，密钥一定保管好，一定不要泄露出去。JWT 安全的核心在于签名，签名安全的核心在密钥。

## JWT 的几个特点

- JWT 默认是不加密，但也是可以加密的。生成原始 Token 以后，可以用密钥再加密一次。
- JWT 不加密的情况下，不能将秘密数据写入 JWT。
- JWT 不仅可以用于认证，也可以用于交换信息。有效使用 JWT，可以降低服务器查询数据库的次数。
- JWT 的最大缺点是，由于服务器不保存 session 状态，因此无法在使用过程中废止某个 token，或者更改 token 的权限。也就是说，一旦 JWT 签发了，在到期之前就会始终有效，除非服务器部署额外的逻辑。
- JWT 本身包含了认证信息，一旦泄露，任何人都可以获得该令牌的所有权限。为了减少盗用，JWT 的有效期应该设置得比较短。对于一些比较重要的权限，使用时应该再次对用户进行认证。
- 为了减少盗用，JWT 不应该使用 HTTP 协议明码传输，要使用 HTTPS 协议传输。
