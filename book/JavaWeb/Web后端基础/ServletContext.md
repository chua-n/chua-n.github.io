---
title: ServletContext
date: 2021-02-10
---

ServletContext 对象代表整个 web 应用，可以和程序的容器（即服务器）来通信。

## 1. ServletContext 对象的获取

以下两者获取的是同一个 ServletContext 对象。

- 通过 request 对象获取：`request.getServletContext();`
- 通过 HttpServlet 获取：`this.getServletContext();`

## 2. ServletContext 对象的功能

1. 获取 MIME 类型

    |      概念      | 解释                                               |
    | :------------: | -------------------------------------------------- |
    |    MIME 类型    | 在互联网通信过程中定义的一种描述文件数据类型的标准 |
    | MIME 类型的格式 | 大类型/小类型，如 `text/html`、`image/jpeg`         |
    |    获取方式    | `String getMimeType(String file)`                 |

    示例：

    ```java
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        ServletContext context = req.getServletContext();
        String filename = "a.jpg";
        String mimeType = context.getMimeType(filename);
        System.out.println(mimeType); // 输出：image/jpeg
    }
    ```

2. 作为域对象：可共享数据

    - 作用范围：共享所有用户所有请求的数据
    - 操作
        - `setAttribute(String name, Object value)`
        - `getAttribute(String name)`
        - `removeAttribute(String name)`
    - 注意事项：谨慎使用

3. 获取文件的真实路径，即服务器路径：`String getRealPath(String path)`

    - 在使用时，传入的参数是从当前 web 项目所在文件夹算起的相对路径，要以"/" 开头，否则会找不到路径，导致 `NullPointerException`。
    - 比如，当前编译后的 web 项目（即实际运行 tomcat 的项目）文件夹为`D:\code\practiceJava\servlet\target\servlet-1.0-SNAPSHOT`，则传入参数`/a.txt`将得到`D:\code\practiceJava\servlet\target\servlet-1.0-SNAPSHOT\a.txt`。
    - 注意项目 src 路径下的文件会被编译到 WEB-INF 目录的 classes 文件夹，因而对于 src 路径下的文件，传入参数时应该写作`/WEB-INF/classes/c.txt`。

## 3. 案例

> 见 https://www.bilibili.com/video/BV1uJ411k7wy?p=734 。

文件下载需求：

- 页面展示超链接；
- 点击超链接后弹出下载提示框；
- 完成图片文件下载。

步骤：

1. 定义页面，编辑超链接的 href 属性，使其指向一个 Servlet，传递资源名称 filename
2. 定义 Servlet：
    1. 获取文件名称；
    2. 使用字节输入流加载文件进内存；
    3. 指定 response 的响应头：`content-disposition:attachment;filename=xxx`
    4. 将数据写出到 response 输出流。
