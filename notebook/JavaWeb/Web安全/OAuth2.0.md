> 参考资料：
>
> - [OAuth 2.0 — OAuth](https://oauth.net/2/)
> - [10 分钟理解什么是 OAuth 2.0 协议 | Deepzz's Blog](https://deepzz.com/post/what-is-oauth2-protocol.html)
> - [OAuth 2.0 的四种方式 - 阮一峰的网络日志 (ruanyifeng.com)](https://www.ruanyifeng.com/blog/2019/04/oauth-grant-types.html)

## 概念

OAuth 2.0 是一个行业的标准授权协议。其作用是为第三方应用颁发一个有时效性的令牌 token，使得第三方应用能够通过该令牌获取相关的资源。第三方登录就是一个常见的场景：当你想要登录某个论坛，但没有账号，而这个论坛接入了如 QQ、Facebook 等的登录功能，此时当你使用 QQ 来登录时，其中使用的就是 OAuth 2.0 协议。

## 角色术语

首先需要介绍的是 OAuth 2.0 协议中定义了[4个角色](https://www.rfc-editor.org/rfc/rfc6749#section-1.1)，整个授权协议的流程都将围绕这些角色：

- `resource owner`：资源所有者，通常即为对该资源拥有“所有权”的用户。

- `resource server`：资源服务器，托管资源的服务器。

- `client`：客户端，经过资源所有者的授权后，代表资源所有者向资源发起请求的（第三方？）应用程序。一般为web网站、移动应用等。

- `authorization server`：授权服务器，负责向客户端颁发令牌。

  > 资源服务器与认证服务器，可以是同一台服务器，也可以是不同的服务器。

此外，`user-agent`（用户代理）的概念虽然不属于上述官方定义的角色，但也经常提到，其指的是帮助资源所有者与客户端沟通的工具，如 web 浏览器、移动 App 等。

举例而言：假如我想要在 `coding.net` 这个网站上用 `github.com` 的账号登录，那么 coding 相对于 github 就是一个客户端，而我们在操作时使用的浏览器就是所谓的用户代理。当从 github 的授权服务器获得 token 后，coding 是需要请求 github 账号信息的，从哪请求？从 github 的资源服务器。

## 协议流程

下图详细的描述了这四个角色之间的步骤流程：

![oauth2-roles](https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/Web安全/oauth2-roles.jpg)

1. Client 请求 Resource Owner 的授权。授权请求可以直接向 Resource Owner 请求，也可以通过 Authorization Server 间接的进行。
2. Client 获得授权许可。
3. Client 向 Authorization Server 请求访问令牌。
4. Authorization Server 验证授权许可，如果有效则颁发访问令牌。
5. Client 通过访问令牌从 Resource Server 请求受保护资源。
6. Resource Server 验证访问令牌，有效则返回响应。

用 OAuth 2.0 的 RFC 官方文档中的描绘，则为下图：

```
     +--------+                               +---------------+
     |        |--(A)- Authorization Request ->|   Resource    |
     |        |                               |     Owner     |
     |        |<-(B)-- Authorization Grant ---|               |
     |        |                               +---------------+
     |        |
     |        |                               +---------------+
     |        |--(C)-- Authorization Grant -->| Authorization |
     | Client |                               |     Server    |
     |        |<-(D)----- Access Token -------|               |
     |        |                               +---------------+
     |        |
     |        |                               +---------------+
     |        |--(E)----- Access Token ------>|    Resource   |
     |        |                               |     Server    |
     |        |<-(F)--- Protected Resource ---|               |
     +--------+                               +---------------+

                     Figure 1: Abstract Protocol Flow
```

不难看出，上面六个步骤之中，B是关键，即用户怎样才能给于客户端授权。客户端必须得到用户的授权（authorization grant），才能获得令牌（access token），进而凭令牌获取资源。

## 授权方式

OAuth 2.0 标准定义了四种授权方式：

- Authorization Code：授权码
- Implicit：隐藏式
- Resource Owner Password Credentials：密码式
- Client Credentials：客户端凭证

注意，不管哪一种授权方式，第三方应用申请令牌之前，都必须先到系统备案，说明自己的身份，然后会拿到两个身份识别码：*客户端 ID（client ID）*和*客户端密钥（client secret）*。这是为了防止令牌被滥用，没有备案过的第三方应用，是不会拿到令牌的。

### 授权码

授权码（authorization code）方式，指的是第三方应用先申请一个授权码，然后再用该码获取令牌。

这种方式是最常用的流程，安全性也最高，它适用于那些有后端的 Web 应用。授权码通过前端传送，令牌则是储存在后端，而且所有与资源服务器的通信都在后端完成。这样的前后端分离，可以避免令牌泄漏。

其步骤如下：

```
     +----------+
     | Resource |
     |   Owner  |
     |          |
     +----------+
          ^
          |
         (B)
     +----|-----+          Client Identifier      +---------------+
     |         -+----(A)-- & Redirection URI ---->|               |
     |  User-   |                                 | Authorization |
     |  Agent  -+----(B)-- User authenticates --->|     Server    |
     |          |                                 |               |
     |         -+----(C)-- Authorization Code ---<|               |
     +-|----|---+                                 +---------------+
       |    |                                         ^      v
      (A)  (C)                                        |      |
       |    |                                         |      |
       ^    v                                         |      |
     +---------+                                      |      |
     |         |>---(D)-- Authorization Code ---------'      |
     |  Client |          & Redirection URI                  |
     |         |                                             |
     |         |<---(E)----- Access Token -------------------'
     +---------+       (w/ Optional Refresh Token)

   Note: The lines illustrating steps (A), (B), and (C) are broken into
   two parts as they pass through the user-agent.

                     Figure 3: Authorization Code Flow
```

1. 用户访问客户端，后者将前者导向认证服务器；
2. 用户选择是否给予客户端授权；
3. 假设用户给予授权，认证服务器将用户导向客户端事先指定的重定向URI（redirection URI），同时附上一个授权码；
4. 客户端收到授权码，附上早先的重定向URI，向认证服务器申请令牌（这一步是在客户端的后台的服务器上完成的，对用户不可见）；
5. 认证服务器核对了授权码和重定向URI，确认无误后，向客户端发送访问令牌（access token）和更新令牌（refresh token）。

以下以 coding 和 github 为例进行具体说明，当我想在 coding 上通过 github 账号登录时：

1. `GET 请求` 点击登录，重定向到 github 的授权端点：

   ```http
   https://github.com/login/oauth/authorize?
     response_type=code&
     client_id=a5ce5a6c7e8c39567ca0&
     redirect_uri=https://coding.net/api/oauth/github/callback&
     scope=user:email
   ```

   | 字段          | 描述                                                         |
   | :------------ | :----------------------------------------------------------- |
   | response_type | 必须，固定为 code，表示这是一个授权码请求。                  |
   | client_id     | 必须，在 github 注册获得的客户端 ID。                        |
   | redirect_uri  | 可选，通过客户端注册的重定向 URI（一般要求且与注册时一致）。 |
   | scope         | 可选，请求资源范围，多个空格隔开。                           |
   | state         | 可选（推荐），如果存在，原样返回给客户端。                   |

   返回值：

   ```
   https://coding.net/api/oauth/github/callback?code=fb6a88dc09e843b33f
   ```

   | 字段  | 描述                         |
   | :---- | :--------------------------- |
   | code  | 必须。授权码                 |
   | state | 如果出现在请求中，必须包含。 |

   授权错误：

   - 第一种，客户端没有被识别或错误的重定向 URI，授权服务器没有必要重定向资源拥有者到重定向URI，而是通知资源拥有者发生了错误。
   - 第二种，客户端被正确地授权了，但是其他某些事情失败了。这种情况下下面地错误响应会被发送到客户端，包括在重定向 URI 中。

   ```http
   https://coding.net/api/oauth/github/callback?
     error=redirect_uri_mismatch&
     error_description=The+redirect_uri+MUST+match+the+registered+callback+URL+for+this+application.&
     error_uri=https%3A%2F%2Fdeveloper.github.com%2Fapps%2Fmanaging-oauth-apps%2Ftroubleshooting-authorization-request-errors%2F%23redirect-uri-mismatch
   ```

   | 字段              | 描述                                                         |
   | :---------------- | :----------------------------------------------------------- |
   | error             | 必须，必须是预先定义的错误码: [错误码](https://tools.ietf.org/html/rfc6749#section-4.1.2.1)。 |
   | error_description | 可选，错误描述                                               |
   | error_uri         | 可选，指向可解读错误的 URI                                   |
   | state             | 必须，如果出现在授权请求中                                   |

2. `POST 请求`获取令牌 token，当获取到授权码 code 后，客户端需要用它获取访问令牌：

   ```http
   https://github.com/login/oauth/access_token?
     client_id=a5ce5a6c7e8c39567ca0&
     client_secret=xxxx&
     grant_type=authorization_code&
     code=fb6a88dc09e843b33f&
     redirect_uri=https://coding.net/api/oauth/github/callback
   ```

   > 出于安全考虑 `client_id` 和 `client_secret` 可以通过 HTTP Basic 认证：`Authorization: Basic YTVjZTVhNmM3ZThjMzk1NjdjYTA6eHh4eA==`

   | 字段          | 描述                                                         |
   | :------------ | :----------------------------------------------------------- |
   | grant_type    | 必须，固定为 authorization_code/refresh_token。              |
   | code          | 必须，上一步获取到的授权码。                                 |
   | redirect_uri  | 必须（如果请求/authorize接口有），完成授权后的回调地址，与注册时一致。 |
   | client_id     | 必须，客户端标识。                                           |
   | client_secret | 必须，客户端密钥。                                           |

   返回值：

   ```
   {
     "access_token":"a14afef0f66fcffce3e0fcd2e34f6ff4",
     "token_type":"bearer",
     "expires_in":3920,
     "refresh_token":"5d633d136b6d56a41829b73a424803ec"
   }
   ```

   | 字段          | 描述                                            |
   | :------------ | :---------------------------------------------- |
   | access_token  | 这个就是最终获取到的令牌。                      |
   | token_type    | 令牌类型，常见有 bearer/mac/token（可自定义）。 |
   | expires_in    | 失效时间。                                      |
   | refresh_token | 刷新令牌，用来刷新 access_token。               |

3. 获取资源服务器资源，拿着 access_token 就可以获取账号的相关信息了：

   ```bash
   curl -H "Authorization: token a14afef0f66fcffce3e0fcd2e34f6ff4" https://api.github.com/user
   ```

4. `POST 请求` 刷新令牌。我们的 access_token 是有时效性的，当在获取 github 用户信息时，如果返回 token 过期：

   ```http
   https://github.com/login/oauth/access_token?
     client_id=a5ce5a6c7e8c39567ca0&
     client_secret=xxxx&
     redirect_uri=https://coding.net/api/oauth/github/callback&
     grant_type=refresh_token&
     refresh_token=5d633d136b6d56a41829b73a424803ec
   ```

   | 字段          | 描述                             |
   | :------------ | :------------------------------- |
   | redirect_uri  | 必须                             |
   | grant_type    | 必须，固定为 refresh_token       |
   | refresh_token | 必须，上面获取到的 refresh_token |

   返回值：

   ```
   {
     "access_token":"a14afef0f66fcffce3e0fcd2e34f6ee4",
     "token_type":"bearer",
     "expires_in":3920,
     "refresh_token":"4a633d136b6d56a41829b73a424803vd"
   }
   ```

   > `refresh_token` 只有在 `access_token` 过期时才能使用，并且只能使用一次。当换取到的 `access_token` 再次过期时，使用新的 `refresh_token` 来换取 `access_token`。

### 隐藏式

有些 Web 应用是纯前端应用，没有后端。这时就不能用上面的方式了，必须将令牌储存在前端。RFC 6749 就规定了第二种方式，允许直接向前端颁发令牌。这种方式没有授权码这个中间步骤，所以称为（授权码）**隐藏式**（implicit）。

![img](https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/Web安全/bg2019040906.jpg)

1. 第一步，A 网站提供一个链接，要求用户跳转到 B 网站，授权用户数据给 A 网站使用。

   ```http
   https://b.com/oauth/authorize?
     response_type=token&
     client_id=CLIENT_ID&
     redirect_uri=CALLBACK_URL&
     scope=read
   ```

   上面 URL 中，`response_type`参数为`token`，表示要求直接返回令牌。

2. 第二步，用户跳转到 B 网站，登录后同意给予 A 网站授权。这时，B 网站就会跳回`redirect_uri`参数指定的跳转网址，并且把令牌作为 URL 参数，传给 A 网站。

   ```http
   https://a.com/callback#token=ACCESS_TOKEN
   ```

   上面 URL 中，`token`参数就是令牌，A 网站因此直接在前端拿到令牌。注意，令牌的位置是 URL 锚点（fragment），而不是查询字符串（query string），这是因为 OAuth 2.0 允许跳转网址是 HTTP 协议，因此存在“中间人攻击”的风险，而浏览器跳转时，锚点不会发到服务器，就减少了泄漏令牌的风险。

这种方式把令牌直接传给前端，是很不安全的。因此，只能用于一些安全要求不高的场景，并且令牌的有效期必须非常短，通常就是会话期间（session）有效，浏览器关掉，令牌就失效了。

### 密码式

如果你高度信任某个应用，RFC 6749 也允许用户把用户名和密码，直接告诉该应用。该应用就使用你的密码，申请令牌，这种方式称为**密码式**。

1. 第一步，A 网站要求用户提供 B 网站的用户名和密码。拿到以后，A 就直接向 B 请求令牌。

   ```http
   https://oauth.b.com/token?
     grant_type=password&
     username=USERNAME&
     password=PASSWORD&
     client_id=CLIENT_ID
   ```

   上面 URL 中，`grant_type`参数是授权方式，这里的`password`表示"密码式"，`username`和`password`是 B 的用户名和密码。

2. 第二步，B 网站验证身份通过后，直接给出令牌。注意，这时不需要跳转，而是把令牌放在 JSON 数据里面，作为 HTTP 回应，A 因此拿到令牌。

这种方式需要用户给出自己的用户名/密码，显然风险很大，因此只适用于其他授权方式都无法采用的情况，而且必须是用户高度信任的应用。

### 凭证式

**凭证式**（client credentials）适用于没有前端的命令行应用，即在命令行下请求令牌。

1. 第一步，A 应用在命令行向 B 发出请求。

   ```http
   https://oauth.b.com/token?
     grant_type=client_credentials&
     client_id=CLIENT_ID&
     client_secret=CLIENT_SECRET
   ```

   上面 URL 中，`grant_type`参数等于`client_credentials`表示采用凭证式，`client_id`和`client_secret`用来让 B 确认 A 的身份。

2. 第二步，B 网站验证通过以后，直接返回令牌。

这种方式给出的令牌，是针对第三方应用的，而不是针对用户的，即有可能多个用户共享同一个令牌。

## 令牌的使用及更新

A 网站拿到令牌以后，就可以向 B 网站的 API 请求数据了。

此时，每个发到 API 的请求，都必须带有令牌。具体做法是在请求的头信息，加上一个`Authorization`字段，令牌就放在这个字段里面：

```bash
curl -H "Authorization: Bearer ACCESS_TOKEN" \
"https://api.b.com"
```

> 上面命令中，`ACCESS_TOKEN`就是拿到的令牌。

令牌的有效期到了，如果让用户重新走一遍上面的流程，再申请一个新的令牌，很可能体验不好，而且也没有必要。OAuth 2.0 允许用户自动更新令牌。

具体方法是，B 网站颁发令牌的时候，一次性颁发两个令牌，一个用于获取数据，另一个用于获取新的令牌（refresh token 字段）。令牌到期前，用户使用 refresh token 发一个请求，去更新令牌：

```http
https://b.com/oauth/token?
  grant_type=refresh_token&
  client_id=CLIENT_ID&
  client_secret=CLIENT_SECRET&
  refresh_token=REFRESH_TOKEN
```

> 上面 URL 中，`grant_type`参数为`refresh_token`表示要求更新令牌，`client_id`参数和`client_secret`参数用于确认身份，`refresh_token`参数就是用于更新令牌的令牌。

B 网站验证通过以后，就会颁发新的令牌。
