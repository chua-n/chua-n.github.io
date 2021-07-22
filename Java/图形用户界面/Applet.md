## 1. Applet的优缺点

1. 优点：

    - Web浏览器提供了运行Applet相关的许多功能；

    - Applet是在运行的时候从服务器端下载到浏览器端的，便于软件的及时发布与及时更新。

2. 缺点：

    - 不能在客户端机器上自由地读写当地的文件；
    - 不能运行客户端主机的任何程序；
    - 不能连接除了服务器以外的其他的网络上的机器。

## 2. Applet的使用

一个Applet必须继承Applet或者JApplet类。

```java
import java.awt.Graphics;
import javax.swing.JApplet;

public class MyApplet extends JApplet{
    // 重载JApplet类的paint方法
    // 参数是Graphics类的对象，是由浏览器传递过来的
    public void paint(Graphics g){
        super.paint(g);
        g.drawString("This is a Java Applet!", 25, 25)
    }
}
```

```html
<html>
<head>
    <meta charset="UTF-8">
    <title>测试Applet</title>
</head>
<body>
    <applet code="MyApplet.class" width="300" height="45"></applet>
</body>
</html>
```

将MyApplet.html文件与MyApplet.class文件放在同一个目录下，然后在浏览器中打开HTML文件，当浏览器遇到Applet标记时，就会自动载入指定的class文件，实现在屏幕上绘制一串字符的效果。

## 3. Applet体系结构

- java.lang.Object
    - java.awt.Component
        - java.awt.Container
            - java.awt.Panel——awt包里的是重量级的图形界面的类
                - java.applet.Applet
                    - javax.swing.JApplet——swing包里的是轻量级的图形界面的类

| Applet的方法                    | 调用时机和用途                                               |
| ------------------------------- | ------------------------------------------------------------ |
| `public void init()`            | 当浏览器（即Applet容器）载入某个Applet时，容器会自动创建这个Applet类的一个实例，并调用它的init方法 |
| `public void start()`           | init方法执行结束之后，自动调用该方法。此外，当浏览器在访问另一个网址之后重新返回applet所在的HTML页面，将再次调用start方法。 |
| `public void paint(Graphics g)` | start方法启动后调用此方法，另外每次需要重绘applet时也将调用该方法。程序通常不直接调用paint |
| `public void repaint()`         | 在响应用户和Applet的交互时经常用到，通常只是调用而不重写该方法。<br />1) 对于轻量级组件，它调用组件的paint方法；<br />2) 对于重量级组件，它调用组件的update方法，由update调用paint。 |
| `public void stop()`            | 用户离开Applet所在的HTML页面时调用该方法，它执行挂起Applet所需的所有任务，例如停止动画和线程。 |

`public void destroy()`用户关闭浏览器窗口时、Applet将从内存中移走的时候调用该方法。
