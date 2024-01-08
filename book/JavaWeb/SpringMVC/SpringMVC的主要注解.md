## 1. @RequestMapping

见前文内容。

## 2. @RequestParam：参数绑定注解

### 2.1 针对场景

有时候，浏览器请求的参数名称与Controller的业务方法中的参数名称不一致，这样就不能正确获取数据。

如这样一个业务方法：

```java
@RequestMapping("/quick10")
@ResponseBody
public void save10(String username) {
    System.out.println(username);
}
```

正常情况：

- 浏览器地址栏输入：http://localhost/quick10?username=zhangsan
- IDEA控制台输出：zhangsan

参数名称不匹配情况：

- 浏览器地址栏输入：http://localhost/quick10?name=zhangsan
- IDEA控制台输出：null

未输入参数情况：

- 浏览器地址栏输入：http://localhost/quick10
- IDEA控制台输出：null

### 2.2 使用@RequestParam

对于上述情况，可以通过@RequestParam注解对参数进行显示的绑定。

业务方法加入@RequestParam注解：

```java
@RequestMapping("/quick10")
@ResponseBody
public void save10(@RequestParam("name") String username) {
    System.out.println(username);
}
```

问题已解决：

- 浏览器地址栏输入：http://localhost/quick10?name=zhangsan
- IDEA控制台输出：zhangsan

@RequestParam注解还有如下参数可以使用：

- value：请求参数名称
- required：此在指定的请求参数是否必须包括，默认是true，提交时如果没有此参数则报错。
- defaultValue：当没有指定请求参数时，则使用指定的默认值赋值。

```java
@RequestMapping("/quick14")
@ResponseBody
public void quickMethod14(@RequestParam(value="name", required=false, defaultValue="itcast") String username) throws IOException{
    System.out.println(username);
}
```

## 3. @RequestHead：获取请求头

使用@RequestHeader可以获得请求头信息，相当于web阶段学习的request.getHeader(name)。

@RequestHeader注解的属性如下：

- value：请求头的名称
- required：是否必须携带此请求头

示例：

```java
@RequestMapping("/quick17")
@ResponseBody
public void quickMethod17(@RequestHeader(value = "User-Agent", required = false) String headerValue) {
    System.out.println(headerValue);
}
```

## 4. @CookieValue：获取指定Cookie

@CookieValue注解的属性如下：

- value：指定cookie的名称
- required：是否必须携带此cookie

示例：

```java
@RequestMapping("/quick18")
@ResponseBody
public void quickMethod18(@CookieValue(value = "JSESSIONID", required = false) String jsessionid) {
    System.out.println(jsessionid);
}
```

