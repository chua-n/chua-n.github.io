## 1. JavaScript简介

1. JavaScript是一门客户端脚本语言，其运行在客户端浏览器中，每一个浏览器都有JavaScript的解析引擎。

2. JavaScript可以用来增强用记和html页面的交互过程，可以来控制html元素，让页面有一些动态的效果，增强用户的体验。

3. 1997年ECMA（欧洲计算机制造商协会）发布了ECMAScript，即所有客户端脚本语言的标准，就好比SQL相较于各种具体的**SQL一样，为混乱的市场制定的统一的规范。
    $$
    JavaScript=ECMAScript+BOM+DOM
    $$

## 2. JavsScript与html结合的方式：

| 说明                                              | 方式   |
| ------------------------------------------------- | ------ |
| 定义`<script>`标签，标签体内容就是js代码。        | 内部js |
| 定义`<script>`标签，通过src属性引入外部的js文件。 | 外部js |

> 注意：`<script>`标签可以定义在html页面的任何地方，但是定义的位置会影响执行顺序；`<script>`也可以定义多个。

## 3. JavsScript基本语法

JavsScript的注释语法与Java完全一样。

### 3.1 数据类型

- 原始数据类型

    | 数据类型  |         含义         | 说明                                              |
    | :-------: | :------------------: | :------------------------------------------------ |
    |  number   |         数字         | 整数/小数/NaN                                     |
    |  string   |        字符串        | 单双引号均可                                      |
    |  boolean  |       布尔类型       | true/false                                        |
    |   null    | 一个对象为空的占位符 |                                                   |
    | undefined |        未定义        | 如果一个变量没有给初始值，会被默认赋值为undefined |

- 引用数据类型

    |   对象   | 作用 |
    | :------: | ---- |
    | Function |      |
    |  Array   |      |
    | Boolean  |      |
    |   Date   |      |
    |   Math   |      |
    |  Number  |      |
    |  String  |      |
    |  RegExp  |      |
    |  Global  |      |
    |    …     |      |

### 3.2 定义变量

- 定义的同时初始化

    ```js
    var 变量名 = 初始值;
    ```

- 先定义，再赋值

    ```js
    var 变量名;
    变量名=值;
    ```

### 3.3 输出到页面上

```js
// 定义变量
var num = 1;
var num2 = 1.2;
var num3 = NaN;
// 输出到页面上	
// 要想换行需使用"<br>"
document.write(num + "<br>");
document.write(num2 + "<br>");
document.write(num3 + "<br>");
```

### 3.4 typeof运算符

typeof运算符可获取变量的类型。

```js
// 返回变量的类型
typeof(变量名)
```

特殊的是，null运算后得到的是object，这是js的一个bug

### 3.5 注意

1. JavaScript有一个特殊的运算符：全等于运算符(===)。
    - 由于JS允许类型不同的变量进行比较，此时JS将先进行类型转换，再进行比较，如"123"==123将返回true。
    - 但有时我们不希望"123"与123相等，因此JS设置了===运算符，此时将在比较之前先判断类型，如果不类型不一样，则直接返回false。

2. 在JavaScript中，如果运算数不是运算符所要求的类型，那么js引擎会自动的将运算数进行类型转换。

    - 其他类型转number：

        - string转number：按照字面值转换，如果字面值不是数字，则转为NaN

        - boolean转number：true转为1，false转为0

            ```js
            var flag = +"123";  // flag为number类型，值为123
            var flag = +"123abc";  // flag为number类型，值为NaN
            ```

    - 其他类型转boolean：

        - number：0与NaN为false，其他为true
        - string：空串为false, 其他为true
         - null：false
         - undefined：false
         - 对象：所有对象都为true

3. JavaScript语句以分号结尾，但如果一行只有一条语句，分号可以省略（不建议)。

4. JS的变量定义使用var关键字，但也可以不使用（不建议）
    - 使用var：定义的变量是局部变量。
    - 不用var：定义的变量是全局变量

### 3.6 流程控制语法

JS的流程控制语法跟Java一模一样，只是switch可选择任意类型的对象。

另外值得注意的是，js似乎跟python一样，循环体中定义的变量脱离循环体后不会被主动销毁 。

```js
var sum = 0;
for (var i = 0; i <= 100; ++i) {
  sum += i;
}
alert(sum);
alert("i = " + i); // i变量没有被销毁
```

## 4. Function

Function是函数对象。

Function对象都有一个length属性，表示形参的个数。

### 4.1 创建语法

- 方法一：不推荐，忘掉吧

    ```js
    // 语法：var functionName = new Function(形式参数列表，函数体);
    // 示例
    var fun = new Function("a", "b", "alert(a);");
    fun(3, 4) // 3;
    ```

- 方式二：使用function关键字

    ```js
    function functionName(a, b){
    	// 函数体
    }
    ```

- 方式三：

    ```js
    var 函数名 = function(形参列表){
    	// 函数体
    }
    ```

### 4.2 函数的特点

1. 函数定义时，形参的类型不用写；

2. 既然函数都是对象，如果定义名称相同的方法，会覆盖；此外，像python那样，把一个已定义的fun1重新赋给一个新定义的fun2就不足为奇了。

3. 函数的调用只与函数的名称有关，和参数列表无关。实际上，在函数声明中，有一个隐藏的内置对象，为一个名为arguments的数组，其封装了所有的实际参数。

    ```js
    // 定义函数fun
    function fun(a, b){
    	alert(a);
    	alert(b);
    }
    // 以下均不报错，语法正确
    fun(1, 2);
    fun(1);
    fun();
    fun(1,2,3);
    ```

## 5. Array

1. Array为数组类型，其有一个属性：length。

2. 创建方法

    ```js
    // 方法1
    var arr = new Array(元素列表);
    // 方法2
    var arr = new Array(默认长度);
    // 方法3
    var arr = [元素列表];
    ```

3. JS的Array的特点：

    - 数组元素的类型是可变的；

    - 数组长度是可变的。

4. Array的方法

    - join()
    - push()

## 6. RegExp

RegExp为正则表达式类型。

- 单个字符

    | 表示方法 | 示例                     |
    | -------- | ------------------------ |
    | []       | [a],  [ab], [a-zA-Z0-9_] |
    | \d       | 单个数字字符[0-9]        |
    | \w       | 单个单词字符[a-zA-Z0-9_] |

- 量词符号

    | 表示方法 | 含义                                                         |
    | -------- | ------------------------------------------------------------ |
    | ?        | 表示出现0次/1次                                              |
    | *        | 表示出现0次/多次                                             |
    | +        | 出现1次/多次                                                 |
    | {m,  n}  | 表示 m  <= 数量 <= n     如果m缺省：{, n}：最多n次   如果n缺省：{m, }：最少m次 |

正则对象的创建：

```js
// 方法1
var reg = new RegExp("正则表达式");
// 方法2
var reg = /正则表达式/;
```

正则对象的方法：

- test(param)：验证指定的字符串是否符合正则定义的规范

## 7. Global

Global类型的对象的特点：全局对象，Global中封装的方法不需要对象就可以直接调用，即`方法名();`即可。

Global的方法：

| 方法                 | 作用                                                         |
| -------------------- | ------------------------------------------------------------ |
| decodeURI()          | url编码                                                      |
| encodeURI()          | url解码                                                      |
| encodeURIComponent() | url编码                                                      |
| decodeURIComponent() | url解码                                                      |
| parseInt()           | 将字符串转为数字：逐一判断每一个字符是否是数字，直到不是数字为止，将前边数字部分转为number |
| isNaN()              | 判断一个值是否是NaN。首先要明白：NaN“六亲不认”，其即使参与NaN==NaN返回值也为false。由此必须定义isNaN()方法来判断。 |
| eval()               | 将JS字符串转换为脚本代码去执行                               |

## 8. BOM

### 8.1 基础概念

**BOM**(Browser Object Model)，浏览器对象模型，将浏览器的各个组成部分封装成对象。

| BOM的组成 |      含义      |
| :-------: | :------------: |
|  Window   |    窗口对象    |
|  History  |  历史记录对象  |
| Location  |   地址栏对象   |
| Navigator |   浏览器对象   |
|  Screen   | 显示器屏幕对象 |

### 8.2 Window对象

1. Window对象不需要创建，可以直接使用window27来使用：`window.方法名()`;

2. window引用可以省略：`方法名()`;

3. 方法：

    - 与弹出框有关的方法：

        | alert()   | 显示带有一段消息和一个确认按钮的警告框                       |
        | --------- | ------------------------------------------------------------ |
        | confirm() | 显示带有一段消息和确认按钮及取消按钮的对话框               按钮            返回值                  确定            true                  取消            false |
        | prompt()  | 显示可提示用户输入的对话框。返回值：获取用户输入的值         |

    - 与打开关闭有关的方法：

        | open()  | 打开一个新的浏览器窗口，其返回值类型是一个Window |
        | ------- | ------------------------------------------------ |
        | close() | 关闭浏览器窗口，哪个Window调用就关闭哪个Window   |

    - 与定时器有关的方法：

        | setTimeout()    |      |
        | --------------- | ---- |
        | clearTimeout()  |      |
        | setInterval()   |      |
        | clearInterval() |      |

4. 属性：

    - 获取其他BOM对象：

        | history   |      |
        | --------- | ---- |
        | location  |      |
        | Navigator |      |
        | Screen    |      |

    - 获取DOM对象：

        | document |      |
        | -------- | ---- |

### 8.3 Location对象

1. 创建：window.location/location;

2. 方法：

    | reload() | 重新加载当前文档，即刷新页面 |
    | -------- | ---------------------------- |

3. 属性：

    | href | 设置或返回完整的URL |
    | ---- | ------------------- |

### 8.4 History对象

......

## 9. DOM

### 9.1 基础概念

**DOM**(Document     Object Model，文档对象模型)将标记语言文档的各个组成部分封装为对象，可以使用这些对象对标记语言文档进行CRUD的动态操作。

- DOM是W3C（万维网联盟）的标准。

- DOM定义了访问HTML和XML文档的标准：W3C文档对象模型（DOM）是中立于平台和语言的接口，它允许程序和脚本动态地访问和更新文档的内容、结构和样式。

- W3C DOM标准被分为3个不同的部分：

    - 核心DOM：针对任何结构化文档的标准模型；

        |   组成    |             说明              |
        | :-------: | :---------------------------: |
        | Document  |           文档对象            |
        |  Element  |           元素对象            |
        | Attribute |           属性对象            |
        |   Text    |           文本对象            |
        |  Comment  |           注释对象            |
        |   Node    | 节点对象，其他5个对象的父对象 |

    - XML DOM：针对XML文档的标准模型；

    - HTML DOM：针对HTML文档的标准模型。

### 9.2 HTML DOM树

![è¿éåå¾çæè¿°](data:image/png;base64,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)

HTML DOM模型：

- 标签体的设置和获取：innerHTML
- 使用html元素对象的属性：查文档
- 控制元素样式

### 9.3 核心DOM模型

#### 9.3.1 Document：文档对象

1. 创建：在html dom模型中可以使用window对象来获取：

    | window.document |             |
    | --------------- | ----------- |
    | document        | // 与上等价 |

2. 方法：

    - 获取Element对象

        | getElementById()         | 根据id属性值获取元素对象，id属性值一般唯一      |
        | ------------------------ | ----------------------------------------------- |
        | getElementsByTagName()   | 根据元素名称获取元素对象们，返回值是一个数组    |
        | getElementsByClassName() | 根据Class属性值获取元素对象们，返回值是一个数组 |
        | getElementsByName()      | 根据name属性获取元素对象们，返回值是一个数组    |

    - 创建其他DOM对象

        | createAttribute(name) |      |
        | --------------------- | ---- |
        | createComment()       |      |
        | createElement()       |      |
        | createTextNode()      |      |

3. 属性：......

#### 9.3.1 Element：元素对象

1. 创建：通过document来获取和创建

2. 方法：

    | removeAttribute() | 删除属性 |
    | ----------------- | -------- |
    | setAttribute()    | 设置属性 |

#### 9.3.2. Node：节点对象

节点对象是其他5个的父对象，所有DOM对象都可以被认为是一个节点。

|      方法      |                  作用                  |
| :------------: | :------------------------------------: |
| appendChild()  | 向节点的子节点列表的末尾添加新的子节点 |
| removeChild()  |     删除并返回当前节点的指定子节点     |
| replaceChild() |         用新节点替换一个子节点         |

|    属性    |       作用       |
| :--------: | :--------------: |
| parentNode | 返回节点的父节点 |

## 10. 事件

### 10.1 概念

事件：某些组件被执行了某些操作后，触发某些代码的执行。

- 事件：如单击、双击、键盘按下了、鼠标移动了……
- 事件源：组件，如按键、文本输入框……
- 监听器：代码
- 注册监听：将事件、事件源、监听器结合在一起，当事件源上发生了某个事件，则触发执行某个监听器代码。

### 10.2 绑定事件

1. 直接在html标签上，指定事件的属性（操作），属性值就是js代码：
2. 通过js获取元素对象，指定事件属性。

### 10.3 常见的事件

- 点击事件：

    |  onclick   | 单击事件 |
    | :--------: | :------: |
    | ondblclick | 双击事件 |

- 焦点事件：

    | onfocus | 元素获得焦点 |
    | :-----: | :----------: |
    | onblur  |   获得焦点   |

- 加载事件

    | onload | 一张页面或一幅图像完成加载 |
    | :----: | :------------------------: |
    
- 鼠标事件

    | onmousedown |    鼠标按钮被按下    |
    | :---------: | :------------------: |
    |  onmouseup  |    鼠标按钮被松开    |
    | onmousemove |      鼠标被移动      |
    | onmouseover | 鼠标移动到某元素之上 |
    | onmouseout  |   鼠标从某元素移开   |

- 键盘事件：

    | onkeydown  |    某个键盘按键被按下    |
    | :--------: | :----------------------: |
    |  onkeyup   |    某个键盘按键被松开    |
    | onkeypress | 某个键盘按键被按下并松开 |

- 选择和改变

    | onchange | 域的内容被改变 |
    | :------: | :------------: |
    | onselect |   文本被选中   |

- 表单事件：

    | onsubmit | 确认按钮被点击 |
    | :------: | :------------: |
    | onreset  | 重围按钮被点击 |

