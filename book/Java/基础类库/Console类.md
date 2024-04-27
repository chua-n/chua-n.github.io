---
title: Console类
---

因为输入是可见的，所有 `Scanner` 类不适用于从控制台读取密码，Java6特别引入了 `java.io.Console` 类来实现这个目的，要想读取一个密码，可以使用如下代码：

```java
Console cons = System.console();
String username = cons.readLine("User name: ");
char[] passwd = cons.readPassword("Password: ");
```

方法：

- `static char[] readPassword(String prompt, Object... args)`
- `static String readLine(String prompt, Object... args)`：显示字符串prompt（提示符）并读取用户输入，直到输入行结束。`args` 参数可以用来提供格式参数。