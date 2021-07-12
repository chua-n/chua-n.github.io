## 1. Restful简介

Restful是一种软件架构风格、设计风格，这不是标准，只是提供了一组设计原则和约束条件。主要用于客户端和服务器交互类的软件，基于这个风格设计的软件可以更简洁、更有层次、更易于实现缓存机制等。

Restful风格的请求使用“url+请求方式”表示一次请求目的，HTTP协议里面4个表示操作方式的动词如下：

| 操作方式 |     作用     |
| :------: | :----------: |
|   GET    | 用于获取资源 |
|   POST   | 用于新建资源 |
|   PUT    | 用于更新资源 |
|  DELETE  | 用于删除资源 |

## 2. 示例

说明：

| URL     |        |                |
| ------- | ------ | -------------- |
| /user/1 | GET    | 得到id=1的user |
| /user/1 | DELETE | 删除id=1的user |
| /user/1 | PUT    | 更新id=1的user |
| /user   | POST   | 新增user       |

上述url地址中的/user/1中的1就是要获得的请求参数，在SpringMVC中可以使用占位符进行参数绑定。地址/user/1可以写成/user/{id}，占位符{id}对应的就是1的值。在业务方法中我们可以使用`@PathVariable`注解进行点位符的匹配获取工作。

```java
// http://localhost:8080/itheima_springmvc1/quick19/zhangsan
@RequestMapping("quick19/{name}")
@ResponseBody
public void quickMethod19(@PathVariable(value = "name", required = true) String name) {
    System.out.println(name);
}
```

