## 1. IDEA项目结构

IDEA的项目结构：

<img src="https://chua-n.gitee.io/blog-images/notebooks/Java/53.png" alt="53" style="zoom:50%;" />

IDEA中创建包和创建目录时是不一样的：包在创建时，com.itheima.dao是一个三级结构；目录在创建时，com.itheima.dao是一级目录。

（Eclipse）对于一个项目，一般将目录结构分为源代码目录、配置文件目录、测试目录。

JavaBean——Java基本信息封装类，这种类满足这些条件：

- 有一个空的构造方法；
- 可序列化；
- 类中的属性可以用get/set方法来获取和设置。

## 2. IDEA的缓存和索引

IDEA首次加载项目时都会创建索引，创建索的时间跟项目文件的多少成正比。当IDEA创建索引时，即使你编辑了代码无法编译、运行，所以还是安安静静等IDEA创建索引完成。

IDEA的缓存和索引主要是用来加快文件查询的，从而加快各种查找、代码提示等操作的速度。

但在某些特殊条件下，IDEA的缓存和索引文件也会发生损坏等而产生各种问题，此时就需要清理缓存和索引了，具体操作为：`File -> Invalidate Caches -> Invalidate and Restart`。

## 3. 调试

| 功能             | 作用                                                         |
| ---------------- | ------------------------------------------------------------ |
| Step Over        | 进入下一步，如果当前行断点是一个方法，则不进入当前方法体内。 |
| Step Into        | 进入下一步，如果当前行断点是一个方法，则进入当前方法体内。   |
| Force Step Into  | 进入下一步，如果当前行断点是一个方法，则进入当前方法体内。   |
| Step Out         | 跳出。                                                       |
| Drop Frame       | "断点回退"——回退到上一个方法调用的开始处<br />1) 在IDEA里测试无法一行一行地回退或回到到上一个断点处，而只能回到上一个方法<br />2) 有一点需要注意的是，断点回退只能重新走一下流程，之前的某些参数/数据的状态已经改变了的是无法回退到之前的状态的，如对象、集合、更新了数据库数据等 |
| Run to Cursor    | 运行到光标处所在行，此时该行不需要打断点。                   |
| Resume Program   | 恢复程序运行，但如果该断点下面代码还有断点，则停留在下一个断点上。 |
| Stop             | 停止。                                                       |
| Mute Breakpoint  | 点中将使得所有的断点失效。                                   |
| View Breakpoints | 查看所有断点。                                               |

除上以外，IDEA中还能条件断点。比如在一个`for (int i = 0; i < 100; ++i)`的循环中设置循环在`i == 66`时触发断点。

## 4. IDEA模板

IDEA中所谓模板就是配置一些常用代码字母缩写，在输入简写时可以出现你预定义的固定模式的代码，使得开发效率大大提高，同时也可以增加个性化，最简单的例子就是在 Java 中输入 sout 会出现`System.out.println();`。

在IDEA中提供了两种模板，其中 Live Templates 可以自定义，而 Postfix Completion 不可以。同时， 有些操作二者都提供了模板，Postfix Templates 较 Live Templates 能快 0.01 秒

常用模板如下：

- psvm : 生成 main 方法

- sout : System.out.println() 快捷输出

    > soutp=System.out.println("方法形参名 = " + 形参名);
    >
    > soutv=System.out.println("变量名 = " + 变量);
    >
    > soutm=System.out.println("当前类名.当前方法"); "abc".sout => System.out.println("abc");
    
- fori : 生成 for 循环

    > iter：可生成增强 for 循环
    >
    > itar：可生成普通 for 循环
    
- list.for : 可生成集合 list 的 for 循环

    > 对于`List<String> list = new ArrayList<String>();`，输入: list.for 即可输出
    >
    > ```java
    > for(String s:list){
    > 
    > }
    > ```
    >
    > 此外还有：
    >
    > list.fori
    >
    > list.forr

- ifn：生成`if(xxx = null)`

    > inn：可生成`if(xxx != null)`
    >
    > xxx.nn
    >
    > xxx.null

- prsf：生成`private static final`

    > psf：可生成` public static final`
    >
    > psfi：可生成`public static final int`
    >
    > psfs：可生成`public static final String`

## 5. 一些快捷键

| 快捷键     | 作用                                                   |
| ---------- | ------------------------------------------------------ |
| Ctrl + F12 | 查看一个文件的结构（对话框打开后可直接按键盘进行搜索） |

