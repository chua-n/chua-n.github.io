---
title: URLDecoder、URLEncoder
---

`URLDecoder/URLEncoder` 提供了普通字符串和 `application/x-www-form-urlencodedMIME` 字符串相互转换的静态方法。

| 方法                                      | 说明                                                         |
| ----------------------------------------- | ------------------------------------------------------------ |
| `URLDecoder.decode(String s, String enc)` | 将 `application/x-www-form-urlencodedMIME` 字符串转换成普通字符串 |
| `URLEncoder.encode(String s, String enc)` | 将普通字符串转换成 `application/x-www-form-urlencodedMIME` 字符串 |

`application/x-www-form-urlencodedMIME` 字符串，即当 `URL` 地址里包含非西欧字符的字符串时，将这些非西欧字符串根据一定的规则进行编码转换（平常见到的地址栏中那种以 `%` 开头的编码串）。

示例：

```java
import java.net.URLDecoder;
import java.net.URLEncoder;

class URLDecoderTest {
    public static void main(String[] args) throws Exception {
        String keyWord = URLDecoder.decode("%E7%96%AF%E7%8B%82Java", "utf-8");
        System.out.println(keyWord); // 疯狂Java
        String urlStr = URLEncoder.encode("疯狂Java讲义", "GBK");
        System.out.println(urlStr); // %B7%E8%BF%F1Java%BD%B2%D2%E5
    }
}
```

