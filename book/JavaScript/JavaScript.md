## 1. JavaScript简介

JavaScript是一门客户端脚本语言，其运行在客户端浏览器中，每一个浏览器都有JavaScript的解析引擎。

JavaScript可以用来增强用记和html页面的交互过程，可以来控制html元素，让页面有一些动态的效果，增强用户的体验。

1997年ECMA（欧洲计算机制造商协会）发布了ECMAScript，即所有客户端脚本语言的标准，就好比SQL相较于各种具体的SQL一样，为混乱的市场制定的统一的规范。
$$
JavaScript=ECMAScript+BOM+DOM
$$

## 2. JavsScript与html结合的方式

| 方式   | 说明                                              |
| ------ | ------------------------------------------------- |
| 内部js | 定义`<script>`标签，标签体内容就是js代码。        |
| 外部js | 定义`<script>`标签，通过src属性引入外部的js文件。 |

> 注意：`<script>`标签可以定义在html页面的任何地方，但是定义的位置会影响执行顺序；`<script>`也可以定义多个。

在外部文件中放置脚本有如下优势：

- 分离了 HTML 和代码
- 使 HTML 和 JavaScript 更易于阅读和维护
- 已缓存的 JavaScript 文件可加速页面加载

## 3. JavsScript基本语法

JavsScript的注释语法与Java完全一样。

在 JavaScript 中，标识符的首字符必须是字母、下划线（_）或美元符号（$）。

JavaScript语句以分号结尾，但如果一行只有一条语句，分号可以省略（不建议）。

### 3.1 数据类型

- 原始数据类型

    | 数据类型  |         含义         | 说明                                              |
    | :-------: | :------------------: | :------------------------------------------------ |
    |  number   |         数字         | 整数/小数/NaN                                     |
    |  string   |        字符串        | 单双引号均可                                      |
    |  boolean  |       布尔类型       | true/false                                        |
    | undefined |        未定义        | 如果一个变量没有给初始值，会被默认赋值为undefined |
    |   null    | 一个对象为空的占位符 |                                                   |

    > Undefined 与 null 的值相等，但类型不相等：
    >
    > ```js
    > typeof undefined              // undefined
    > typeof null                   // object
    > null === undefined            // false
    > null == undefined             // true
    > ```

- 复杂数据类型

    | 数据类型 | 含义 | 说明                                            |
    | :------: | :--: | :---------------------------------------------- |
    |  object  | 对象 | typeof 运算符把对象、数组、null均返回object     |
    | fuction  | 函数 | typeof 运算符不会把函数返回object，而是function |

    > typeof运算符把数组返回为object，因为js中数组即对象。

### 3.2 定义变量

#### 3.2.1 定义普通变量

- 定义的同时初始化

    ```js
    var 变量名 = 初始值;
    ```

- 先定义，再赋值

    ```js
    var 变量名; // 此时变量的值是undefined
    变量名=值;
    ```

如果再次声明某个 JavaScript 变量，将不会丢它的值。如，在以下这两条语句执行后，变量 carName 的值仍然是 "porsche"：

```js
var carName = "porsche";
var carName; 
```

#### 3.2.2 定义对象

如上所述，JavaScript 变量是数据值的容器，这段代码把一个*单一值*（porsche）赋给名为 person的*变量*：

```js
var person = "Bill";
```

而本节所言的**对象**也是变量，但是对象包含很多值。这段代码把*多个值*（Bill, Gates, age, eyeColor）赋给名为 person 的*变量*：

```js
var person = {firstName:"Bill", lastName:"Gates", age:62, eyeColor:"blue"};
```

其中，值以`名称:值`对的方式来书写（名称和值由冒号分隔）。

##### 3.2.2.1 属性

JavaScript 对象中的`名称:值`对被称为**属性**。

| 属性      | 属性值 |
| :-------- | :----- |
| firstName | Bill   |
| lastName  | Gates  |
| age       | 62     |
| eyeColor  | blue   |

##### 3.2.2.2 方法

对象也可以有**方法**。方法是在对象上执行的动作，方法以**函数定义**被存储在属性中。换言之，方法是作为属性来存储的函数。

```js
var person = {
  firstName: "Bill",
  lastName : "Gates",
  age      : 62,
  eyeColor : "blue",
  fullName : function() {
    return this.firstName + " " + this.lastName;
  }
};
```

| 属性      | 属性值                                                    |
| :-------- | :-------------------------------------------------------- |
| firstName | Bill                                                      |
| lastName  | Gates                                                     |
| age       | 62                                                        |
| eyeColor  | blue                                                      |
| fullName  | `function() {return this.firstName + " " + this.lastName;}` |

#### 3.2.3 new关键字

如果通过关键词 "new" 来声明 JavaScript 变量，则该变量会被创建为对象：

```js
var x = new String();        // 把 x 声明为 String 对象
var y = new Number();        // 把 y 声明为 Number 对象
var z = new Boolean();       //	把 z 声明为 Boolean 对象
```

请避免字符串、数值或逻辑对象。他们会增加代码的复杂性并降低执行速度。

### 3.3 输出到页面上

JavaScript 能够以不同方式“输出”数据：

- 使用 window.alert() 写入警告框

    ```html
    <!DOCTYPE html>
    <html>
    <body>
    
    <h1>我的第一张网页</h1>
    
    <p>我的第一个段落</p>
    
    <script>
    window.alert(5 + 6);
    </script>
    
    </body>
    </html> 
    ```

- 使用 document.write() 写入 HTML 输出

    ```html
    <!DOCTYPE html>
    <html>
    <body>
    
    <h1>我的第一张网页</h1>
    
    <p>我的第一个段落</p>
    
    <script>
    document.write(5 + 6);
    </script>
    
    </body>
    </html> 
    ```

    > 注意：在 HTML 文档完全加载后使用 **document.write()** 将*删除所有已有的 HTML* ：
    >
    > ```html
    > <!DOCTYPE html>
    > <html>
    > <body>
    > 
    > <h1>我的第一张网页</h1>
    > 
    > <p>我的第一个段落</p>
    > 
    > <button onclick="document.write(5 + 6)">试一试</button>
    > 
    > </body>
    > </html>
    > ```

- 使用 innerHTML 写入 HTML 元素

    ```html
    <!DOCTYPE html>
    <html>
    <body>
    
    <h1>我的第一张网页</h1>
    
    <p>我的第一个段落</p>
    
    <p id="demo"></p>
    
    <script>
     document.getElementById("demo").innerHTML = 5 + 6;
    </script>
    
    </body>
    </html> 
    ```

- 使用 console.log() 写入浏览器控制台

    ```html
    <!DOCTYPE html>
    <html>
    <body>
    
    <h1>我的第一张网页</h1>
    
    <p>我的第一个段落</p>
    
    <script>
    console.log(5 + 6);
    </script>
    
    </body>
    </html>
    ```

### 3.4 typeof运算符

typeof运算符可获取变量的类型。

```js
// 返回变量的类型
typeof(变量名)
```

特殊的是，null运算后得到的是object，这是js的一个bug

### 3.5 ==与===

JavaScript有一个特殊的运算符：全等于运算符(===)。

- 由于JS允许类型不同的变量进行比较，此时JS将先进行类型转换，再进行比较，如"123"==123将返回true。
- 但有时我们不希望"123"与123相等，因此JS设置了===运算符，此时将在比较之前先判断类型，如果不类型不一样，则直接返回false。

### 3.6 JavaScript运算数的自动类型转换

在JavaScript中，如果运算数不是运算符所要求的类型，那么js引擎会自动的将运算数进行类型转换。

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

### 3.7 delete

`delete` 操作符用于删除对象的某个属性；如果没有指向这个属性的引用，那它最终会被释放。

语法：

```js
delete expression;

// 其中expression具体可为：
delete object.property
delete object['property']
```

示例：

```js
const Employee = {
    firstname: 'John',
    lastname: 'Doe'
};

console.log(Employee.firstname);
// expected output: "John"

delete Employee.firstname;

console.log(Employee.firstname);
// expected output: undefined
```

与通常的看法不同，`delete`操作符与直接释放内存**无关**。内存管理通过断开引用来间接完成的，查看[内存管理](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Memory_Management)页可了解详情。

**`delete `**操作符会从某个对象上移除指定属性。成功删除的时候会返回 `true`，否则返回 `false`。

但是，以下情况需要重点考虑：

- 如果你试图删除的属性不存在，那么delete将不会起任何作用，但仍会返回true
- 如果对象的原型链上有一个与待删除属性同名的属性，那么删除属性之后，对象会使用原型链上的那个属性（也就是说，delete操作只会在自身的属性上起作用）
- 不可设置的(Non-configurable)属性不能被移除。这意味着像[`Math`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Math), [`Array`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array), [`Object`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object)内置对象的属性以及使用[`Object.defineProperty()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)方法设置为不可设置的属性不能被删除。

### 3.8 var、空、let、const

JavaScript变量有三种作用域：

- 全局作用域
- 函数作用域
- 块作用域

#### 3.8.1 var与空

在 ES2015 之前，JavaScript 只有两种类型的作用域：**全局作用域**和**函数作用域**。

Javascript 声明变量时虽然用 var 声明和不用关键字声明很多时候运行并没有问题，但是这两种方式还是有区别的：

- 使用var

```js
/*
使用var时，是在当前域中声明变量：
	1) 如果在方法中声明，则为局部变量;
	2) 如果是在全局域中声明，则为全局变量。
*/
var num = 1;
```

- 不使用任何关键字

```js
/*
而不使用关键字时，事实上是对属性的赋值操作：
	1) 首先，它会尝试在当前作用域链中解析 num，如果在任何当前作用域链中找到 num，则会执行对 num 属性赋值；
	2) 如果没有找到 num，它会在全局对象（即当前作用域链的最顶层对象，如 window 对象）中创造 num 属性并赋值。
*/
num = 1;
```

> 即便如此，可能你还是很难明白“变量声明”跟“创建对象属性”在这里的区别。事实上，Javascript 的变量声明、创建属性以及 Javascript 中的每个属性都有一定的标志说明它们的属性----如只读、不可枚举、不可删除......
>
> 由于变量声明自带不可删除属性，比较 `var num = 1` 跟 `num = 1`，前者是变量声明，带不可删除属性，因此无法被删除；后者为全局变量的一个属性，因此可以从全局变量中删除。
>
> ```js
> // num1为全局变量，num2为window的一个属性
> var num1 = 1;
> num2 = 2;
> 
> // delete num1;  无法删除。语句返回false
> // delete num2;  删除。语句返回true
> 
> function model() {
>     var num1 = 1; // 本地变量
>     num2 = 2; // window的属性
>     // 匿名函数
>     (function () {
>         var num = 1; // 本地变量
>         num1 = 2; // 继承作用域（闭包）
>         num3 = 3; // window的属性
>     }())
> }
> ```

#### 3.8.2 var与let

> let的出现让JavaScript拥有了块作用域。

我们知道，任何时候在函数作用域内声明的变量都不可能在函数之外被访问到。而对于函数之外的变量，可将其分为全局作用域和块作用域，其中var变量具有全局作用域，let变量对应块作用域。

```js
{ 
  var a = 10; 
}
// 此处可以使用 a

{ 
  let b = 10;
}
// 此处不可以使用 b
```

##### 推论1——对于重新声明变量

在块中重新声明变量也将重新声明块外的变量：

```js
var x = 10;
// 此处 x 为 10
{ 
  var x = 6;
  // 此处 x 为 6
}
// 此处 x 为 6
```

使用 let 关键字重新声明变量可以解决这个问题，在块中重新声明变量不会重新声明块外的变量：

```js
var x = 10;
// 此处 x 为 10
{ 
  let x = 6;
  // 此处 x 为 6
}
// 此处 x 为 10
```

##### 推论2——对于循环中的变量

在循环中使用 var：

```js
var i = 7;
for (var i = 0; i < 10; i++) {
  // 一些语句
}
// 此处，i 为 10
```

在循环中使用 let：

```js
let i = 7;
for (let i = 0; i < 10; i++) {
  // 一些语句
}
// 此处 i 为 7
```

##### 推论3——在函数作用域内及全局作用域内var与let很相似

在函数内声明变量时，使用 var 和 let 很相似，它们都有*函数作用域*：

```js
function myFunction() {
  var carName = "porsche";   // 函数作用域
}
function myFunction() {
  let carName = "porsche";   // 函数作用域
}
```

如果在块外声明声明，那么 var 和 let 也很相似，它们都拥有*全局作用域*：

```js
var x = 10;       // 全局作用域
let y = 6;       // 全局作用域
```

##### 区别二——HTML 中的全局变量

使用 JavaScript 的情况下，全局作用域是 JavaScript 环境；在 HTML 中，全局作用域是 window 对象。

通过 var 关键词定义的全局变量属于 window 对象：

```js
var carName = "porsche";
// 此处的代码可使用 window.carName
```

通过 let 关键词定义的全局变量不属于 window 对象：

```js
let carName = "porsche";
// 此处的代码不可使用 window.carName
```

##### 区别三——关于“提升（Hoisting）”

通过 var 声明的变量会**提升**到顶端。您可以在声明变量之前就使用它：

```js
// 在此处，您可以使用 carName
var carName;
```

通过 let 定义的变量不会被提升到顶端。在声明 let 变量之前就使用它会导致 ReferenceError：

```js
// 在此处，您不可以使用 carName
let carName;
```

#### 3.8.3 const

[JavaScript Const (w3school.com.cn)](https://www.w3school.com.cn/js/js_const.asp)

### 3.9 流程控制语法

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

## 4. 一些常用对象

### 4.1 Function

Function是函数对象。

Function对象都有一个length属性，表示形参的个数。

#### 4.1.1 创建语法

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

#### 4.1.2 函数的特点

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

### 4.2 Array

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

### 4.3 RegExp

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
    | `{m,  n}`  | 表示 `m  <= 数量 <= n`     如果m缺省：`{, n}`：最多n次   如果n缺省：`{m, }`：最少m次 |

正则对象的创建：

```js
// 方法1
var reg = new RegExp("正则表达式");
// 方法2
var reg = /正则表达式/;
```

正则对象的方法：

- test(param)：验证指定的字符串是否符合正则定义的规范

### 4.4 Global

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

## 5. BOM

### 5.1 基础概念

**BOM**(Browser Object Model)，浏览器对象模型，将浏览器的各个组成部分封装成对象。

| BOM的组成 |      含义      |
| :-------: | :------------: |
|  Window   |    窗口对象    |
|  History  |  历史记录对象  |
| Location  |   地址栏对象   |
| Navigator |   浏览器对象   |
|  Screen   | 显示器屏幕对象 |

### 5.2 Window对象

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

### 5.3 Location对象

1. 创建：window.location/location;

2. 方法：

    | reload() | 重新加载当前文档，即刷新页面 |
    | -------- | ---------------------------- |

3. 属性：

    | href | 设置或返回完整的URL |
    | ---- | ------------------- |

### 5.4 History对象

......

## 6. DOM

### 6.1 基础概念

**DOM**(Document Object Model，文档对象模型)将标记语言文档的各个组成部分封装为对象，可以使用这些对象对标记语言文档进行CRUD的动态操作。

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

### 6.2 HTML DOM树

![è¿éåå¾çæè¿°](data:image/png;base64,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)

HTML DOM模型：

- 标签体的设置和获取：innerHTML
- 使用html元素对象的属性：查文档
- 控制元素样式

### 6.3 核心DOM模型

#### 6.3.1 Document：文档对象

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

#### 6.3.2 Element：元素对象

1. 创建：通过document来获取和创建

2. 方法：

    | removeAttribute() | 删除属性 |
    | ----------------- | -------- |
    | setAttribute()    | 设置属性 |

#### 6.3.3 Node：节点对象

节点对象是其他5个的父对象，所有DOM对象都可以被认为是一个节点。

|      方法      |                  作用                  |
| :------------: | :------------------------------------: |
| appendChild()  | 向节点的子节点列表的末尾添加新的子节点 |
| removeChild()  |     删除并返回当前节点的指定子节点     |
| replaceChild() |         用新节点替换一个子节点         |

|    属性    |       作用       |
| :--------: | :--------------: |
| parentNode | 返回节点的父节点 |

## 7. 事件

### 7.1 概念

事件：某些组件被执行了某些操作后，触发某些代码的执行。

- 事件：如单击、双击、键盘按下了、鼠标移动了……
- 事件源：组件，如按键、文本输入框……
- 监听器：代码
- 注册监听：将事件、事件源、监听器结合在一起，当事件源上发生了某个事件，则触发执行某个监听器代码。

事件处理程序可用于处理、验证用户输入、用户动作和浏览器动作：

- 每当页面加载时应该做的事情
- 当页面被关闭时应该做的事情
- 当用户点击按钮时应该被执行的动作
- 当用户输入数据时应该被验证的内容
- ......

让 JavaScript 处理事件的不同方法有很多：

- HTML 事件属性可执行 JavaScript 代码
- HTML 事件属性能够调用 JavaScript 函数
- 您能够向 HTML 元素分配自己的事件处理函数
- 您能够阻止事件被发送或被处理
- .......

### 7.2 绑定事件

1. 直接在html标签上，指定事件的属性（操作），属性值就是js代码：
2. 通过js获取元素对象，指定事件属性。

### 7.3 常见的事件

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

## 8. jQuery

[jQuery 教程 (w3school.com.cn)](https://www.w3school.com.cn/jquery/index.asp)

## 9. AJAX

[AJAX 教程 (w3school.com.cn)](https://www.w3school.com.cn/ajax/index.asp)

## 10. Web Storage

### 10.1 简介

Web Storage 是一种可以简单地将 JavaScript 所处理的数据永久保存的接口。在过去，必须通过服务器才能进行数据的读写操作，当出现了 Web Storage 等多种客户端存储技术后，就可以直接在客户端存储一些数据了。由于这些技术很好地去除了与服务器的通信部分，因此人们可以享受到性能的提高、开发手续的削减、离线操作的实现等各个方面的优点。

Web Storage 具有以下这些特征：

- Key-Value型的简单的存储方式；
- 能够以与普通的 JavaScript 对象相同的方式来进行读写操作；
- 与Cookie相比，能够保存大容量的数据。

虽然 Web Storage 的标准中没有限制其可能的保存容量，但大部分的浏览器都是以5MB 为上限对该功能进行实现的。尽管在一些浏览器中也可以根据用户设定来更改这一上限，不过对于面向一般用户公开的 Web 应用程序，还是应该意识到这一限制。此外，在 Web Storage 中，为每个源（同源策略的源）准备了共享的存储空间。即使是不同的服务，只要它们的源是相同的，就能够共享存储。因此，有时 1 个服务可以使用的容量将不足5MB，对此请加以注意。在不同的源中执行的程序之间不能相互引用其 Web Storage。

Web Storage 的实体是在全局对象中定义的 `localStorage` 与 `sessionStorage` 这两种对象。只要像通常的对象那样对其属性进行读写，就能使所保存的数据在页面跳转时也不会丢失。

### 10.2 localStorage 与 sessionStorage

`localStorage` 与 `sessionStorage` 的区别在于数据的生存周期。

对于在 `localStorage` 中保存的数据来说，只要没有被显式地删除，即使浏览器或计算机执行了重启，这些数据也不会丢失；而另一方面，在 `sessionStorage` 中，数据仅能在同一个会话内得以保留，当页面会话结束——也就是说，当页面被关闭时，存储在 `sessionStorage` 的数据会被清除。

下面简单总结了`sessionStorage` 的生存周期，参考自[MDN](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage)：

- Whenever a document is loaded in a particular tab in the browser, a unique page session gets created and assigned to that particular tab. That page session is valid only for that particular tab.
- A page session lasts as long as the tab or the browser is open, and survives over page reloads and restores.
- **Opening a page in a new tab or window creates a new session with the value of the top-level browsing context, which differs from how session cookies work.**
- Opening multiple tabs/windows with the same URL creates `sessionStorage` for each tab/window.
- Duplicating a tab copies the tab's `sessionStorage` into the new tab.
- Closing a tab/window ends the session and clears objects in `sessionStorage`.

> Data stored in `sessionStorage` **is specific to the protocol of the page**. In particular, data stored by a script on a site accessed with HTTP (e.g., [http://example.com](https://example.com/)) is put in a different `sessionStorage` object from the same site accessed with HTTPS (e.g., [https://example.com](https://example.com/)).

只要没有显式地删除 `localStorage` 中的数据，这些数据就不会被重置。因此，如果把它们当作本地变量来使用，而胡乱地添加了过多属性，就将会使今后的管理变得十分困难。对于通过 `sessionStorage` 就能够实现功能的情况，则最好使用`sessionStorage`，这样就能省去对数据进行删除管理的麻烦。

### 10.3 基本操作

Web Storage 的方法与属性：

- `setItem(key, value)`：保存数据至 Web Storage。Web Storage 只支持对字符串进行读写，因此存储的key-value都必须是字符串。如果需要存储对象，需要使用 `JSON.stringify` 与 `JSON.parse` 方法。
- `getItem(key)`：引用对应 key 的数据。需要注意的是，如果指定了一个不存在的键并试图引用，则会返回`null` 值。而对于通常的对象来说，如果指定了一个不存在的键并试图引用，返回的将是`undefined` 值。
- `removeItem(key)`：删除对应的 key-value 数据
- `clear()`：清空所有数据
- `key(index)`：根据下标获取数据。不过需要注意的是，通过 key 方法返回的键并不一定是保序的。在进行值的添加或删除操作时，浏览器可能会改变 key 的顺序。不过，只要没有进行值的添加或删除操作，则将一定会保持原有的顺序。
- `length`：属性，Web Storage 中存储的键的数据

可以通过 `setItem` 方法将数据保存至 `localStorage`，并通过调用 `getItem` 方法来引用数据。此外，Web Storage 也提供了可以对值进行读写的语法糖，其操作方法与通常的对象相同。

```js
// 数据的保存。以下3 行是等价的
localStorage.setItem('foo', 'bar');
localStorage.foo = 'bar';
localStorage['foo'] = 'bar';

// 数据的引用。以下3 行是等价的
var data = localStorage.getItem('foo');
var data = localStorage.foo;
var data = localStorage['foo'];

// 枚举所有被保存的数据
for (var i = 0; i < localStorage.length; i++) {
    var key = localStorage.key(i),
    value = localStorage[key];
    /* 进行一些处理 */
}
```

### 10.4 storage事件

在某个窗口中更改了Web Storage 中的数据之后，将会在除了更改数据的窗口之外所有的窗口中触发storage事件。通过捕捉该 storage 事件并加以适当的处理，就能够在多个同时打开的窗口之间确保数据的一致性。例如，通过在新标签页中打开的某个页面来更新存储时，可以通过捕捉并处理storage 事件以使其他所有标签页都能获知设定的更改并执行UI 的更新处理，从而避免与存储数据之间产生不一致。

storage 事件对象的属性有：

- `key`：被更新的键名
- `oldValue`：更新前的值
- `newValue`：更新后的值
- `url`：被更新的页面的URL
- `storageArea`：`localStorage` 或 `sessionStorage`

代码示例：

```js
window.addEventListener('storage', function(event) {
    if (event.key === 'userid') {
        var msg = ' 你好，' + event.newValue + ' 先生/ 女士';
        document.getElementById('msg').textContent = msg;
    }
}, false);
```

### 10.5 对比cookie

一直以来，说起在浏览器中保存数据的方法，我们通常都会想到利用 Cookie 来实现的方法。在不支持Web Storage 的浏览器中，则可以通过 Cookie 来实现数据的永久保存。不过由于Cookie 有以下特点，因此在实际上很少能够被用作Web Storage 的替代品：

- 容量上限非常小，只有4KB，因此无法保存较大的数据
- 向服务器发送请求时Cookie将被一起发送
- 常用于保存会话信息等重要的信息

Cookie 的使用方法：

```js
// 值的保存
document.cookie = 'foo=1';
console.log(document.cookie); // ->'foo=1'

// 值的保存（具有1 小时的期限）
document.cookie = 'bar=2; expires=' + new Date(Date.now()+3600000).toGMTString();
console.log(document.cookie); // ->'foo=1; bar=2'

// 值的删除
document.cookie = 'foo=; expires=' + new Date().toGMTString();
console.log(document.cookie); // ->'bar=2'

// 1 小时之后
setTimeout(function() {
    console.log(document.cookie); // ->"
}, 3600000);
```

## 11. 其他

把脚本置于`<body>`元素的底部，可改善显示速度，因为脚本编译会拖慢显示。

廖雪峰：js的一个重要特性就是单线程执行模式，浏览的js引擎在执行js代码时总是以单线程模式执行，也就是说，任何时候，js代码都不可能同时有多于1个线程在执行。

