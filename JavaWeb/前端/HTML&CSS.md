## 1. HTML

> 详细可参考 [HTML 教程 (w3school.com.cn)](https://www.w3school.com.cn/html/index.asp) 。

### 1.1 概念

HTML（Hyper Text Markup Language，超文本标记语言）是最基础的网页开发语言。所谓标记语言，是指由标签构成的语言，如html、xml，要明白“标记语言不是编程语言”，其不具备流程控制的能力。

### 1.2 HTML语法

1. html文档后缀名为.html或.htm，两者没有任何区别。

2. 标签的类型分为：

    | 围堵标签   | 有开始标签和结束标签     | 如`<html> </html>` |
    | ---------- | ------------------------ | ------------------ |
    | 自闭合标签 | 开始标签和结束标签在一起 | 如`<br/>`          |

3. 标签可以嵌套。但需要正确嵌套，不能你中有我，我中有你：`<a><b></a></b>（错误），<a><b></b></a>（正确）`。

4. 在开始标签中可以定义属性，属性由键值对构成，其中值需要用引号（单双都可）引起来。

5. html的标签不区分大小写，但是建议使用小写。

6. html标签的语法非常不严格，很难写错。

    ```html
    <html>
      <head>
        <title>title</title>
      </head>
      <body>
        <font color="red">Hello World</font><br />
        <font color="green">Hello World</font><br />
      </body>
    </html>
    ```

### 1.3 标签学习

#### 1.3.1 文件标签——构成HTML最基本的标签

| 标签              | 含义                                           |
| ----------------- | ---------------------------------------------- |
| `<!DOCTYPE html>` | html5中定义该文档是html文档                    |
| html              | html文档的根标签                               |
| head              | 头标签，指定html文档的一些属性，引入外部的资源 |
| body              | 体标签                                         |

#### 1.3.2 文本标签：和文本有关的标签。

|       标签        | 含义                                                         |
| :---------------: | ------------------------------------------------------------ |
| `<!--注释内容-->` | 注释                                                         |
|   `<h1>...<h6>`   | 标题标签，共6级                                              |
|       `<p>`       | 段落标签                                                     |
|      `<br>`       | 换行标签                                                     |
|      ~~`<hr>`~~      | 显示一条水平线。  可设置属性进行个性化：color, width, size, align等，但不推荐（HTML5已不支持），应该使用CSS来控制这些内容。 |
|       `<b>`       | 字体加粗                                                     |
|       `<i>`       | 字体斜体                                                     |
|     ~~`<font>`~~     | 字体标签，HTML5已弃用。可设置属性：color, size, face等       |
|    ~~`<center>`~~     | 文本居中（相对于父元素），HTML5已弃用                        |
|      `&***;`      | 插入特殊符号，具体查表                                       |

#### 1.3.3 图片标签`<img />`

|  属性  | 作用                     |
| :----: | ------------------------ |
|  src   | 图片路径                 |
| align  | 对齐方式                 |
|  alt   | 图片加载失败时显示此信息 |
| width  | 图片宽度                 |
| height | 图片高度                 |

#### 1.3.4 列表标签

| 标签 | 作用                        |
| :--: | --------------------------- |
|  ol  | 有序列表（ordered  list）   |
|  ul  | 无序列表（unordered  list） |
|  li  | 列表项                      |

#### 1.3.5 链接标签`<a>`

定义超链接（若在a标签内嵌套一个img标签，即可实现点击图片发生页面跳转的功能）。

|  属性  | 作用                                                         |
| :----: | ------------------------------------------------------------ |
|  href  | 指定访问资源的超链接                                         |
| target | "_self"：在当前标签页打开URL<br />"_blank"：在新的空白标签页打开URL |

#### 1.3.6 表格标签

HTML中只有行的概念，没有列的概念，列的概念由每一行的单元格数量来表示。

|  标签   | 作用                                                         |
| :-----: | ------------------------------------------------------------ |
|  table  | 定义表格。属性有：border, width, cellpadding, cellspacing, bgcolor, align… |
|   tr    | 定义行                                                       |
|   td    | 定义单元格，属性有：rowspan, colspan, …                      |
|   th    | 定义表头单元格                                               |
| caption | 表格标题                                                     |
|  thead  | 表格的头部分，无样式                                         |
|  tbody  | 表格的体部分，无样式                                         |
|  tfoot  | 表格的脚部分，无样式                                         |

#### 1.3.7 表单标签

表单用于采集用户输入的数据，以便和服务器进行交互。

1. 子标签`form`：定义表单，用于用户输入。该标签限定的范围代表采集用户数据的范围。

    |  属性  | 作用                                     |
    | :----: | ---------------------------------------- |
    | action | 指定提交数据的URL                        |
    | method | 指定提交方式。"get",  "post", …（共7种） |

    | 提交方式的类型 | 说明                                                         |
    | :------------: | :----------------------------------------------------------- |
    |      get       | 请求参数会在浏览器地址栏中显示，会封装在请求行中；请求参数的大小有限制；不太安全。 |
    |      post      | 请求参数不会在地址栏中显示，会封装在请求体中；请求参数的大小没有限制；较为安全。 |

2. 子标签`input`——定义输入框。

    1. 属性`type`：可以通过type属性值，改变元素展示的样式。

    2. 属性`name`：表单项中的数据要想被提交，必须指定其name属性。

    3. 属性`value`

    4. 属性`checked`

    5. 属性`placeholder`：占位符，单击后内容消失，如“请输入用户名”。

    6. 属性`label`：指定输入项的文字描述信息。其for属性一般会与input的id属性值对应，如果对应了，则点击label区域即会让input输入框获取焦点。

        | `type`属性的值 | 作用                                                         |
        | :------------- | ------------------------------------------------------------ |
        | text           | 文本输入框，默认值                                           |
        | password       | 密码输入框                                                   |
        | radio          | 单选框，注意此时与input标签中的name,  value, checked属性的关联作用 |
        | checkbox       | 复选框，注意此时与input标签中的name,  value, checked属性的关联作用 |
        | file           | 文件选择框，可选择文件输入                                   |
        | hidden         | 隐藏域，用于提交信息                                         |
        | submit         | 提交按钮。用来提交表单                                       |
        | button         | 普通按钮。                                                   |
        | image          | 图片提交按钮，可搭配src属性指定图片的路径                    |
        | color          | 定义拾色器                                                   |
        | date           |                                                              |
        | datetime       |                                                              |
        | email          |                                                              |
        | number         |                                                              |

3. 子标签`select`：下拉列表

    |  属性  | 作用         |
    | :----: | ------------ |
    | option | 指定列表的项 |
    |  name  |              |

4. 子标签`textaresa`：文本域

    | 属性 | 作用                             |
    | :--: | -------------------------------- |
    | cols | 指定列数，也即每一行有多少个字符 |
    | rows | 默认多少行                       |

#### 1.3.8 span和div标签

它们原生无样式，只是为了将某些内容封装成行/块，以方便CSS进行个性化定制。

| 标签 | 作用                                       |
| :--: | ------------------------------------------ |
| span | 文本信息在一行展示，属于行内标签或内联标签 |
| div  | 每一个div占满一整行，属于块级标签          |

#### 1.3.9 语义化标签

html5中为了提高程序的可读性提供的一些标签，无实际的样式作用，但更方便了跟CSS结合进行操作。

|  标签  |     作用     |
| :----: | :----------: |
| header | 头部块级标签 |
| footer | 尾部块级标签 |

### 1.4 属性定义

#### 1.4.1 全局属性

全局属性是指所有 HTML 元素都有的属性。

HTML全局属性为：

| 属性                                                         | 描述                                                   |
| :----------------------------------------------------------- | :----------------------------------------------------- |
| [accesskey](https://www.w3school.com.cn/tags/att_standard_accesskey.asp) | 规定激活元素的快捷键。                                 |
| [class](https://www.w3school.com.cn/tags/att_standard_class.asp) | 规定元素的一个或多个类名（引用样式表中的类）。         |
| [contenteditable](https://www.w3school.com.cn/tags/att_global_contenteditable.asp) | 规定元素内容是否可编辑。                               |
| [contextmenu](https://www.w3school.com.cn/tags/att_global_contextmenu.asp) | 规定元素的上下文菜单。上下文菜单在用户点击元素时显示。 |
| [data-*](https://www.w3school.com.cn/tags/att_global_data.asp) | 用于存储页面或应用程序的私有定制数据。                 |
| [dir](https://www.w3school.com.cn/tags/att_standard_dir.asp) | 规定元素中内容的文本方向。                             |
| [draggable](https://www.w3school.com.cn/tags/att_global_draggable.asp) | 规定元素是否可拖动。                                   |
| [dropzone](https://www.w3school.com.cn/tags/att_global_dropzone.asp) | 规定在拖动被拖动数据时是否进行复制、移动或链接。       |
| [hidden](https://www.w3school.com.cn/tags/att_global_hidden.asp) | 规定元素仍未或不再相关。                               |
| [id](https://www.w3school.com.cn/tags/att_standard_id.asp)   | 规定元素的唯一 id。                                    |
| [lang](https://www.w3school.com.cn/tags/att_standard_lang.asp) | 规定元素内容的语言。                                   |
| [spellcheck](https://www.w3school.com.cn/tags/att_global_spellcheck.asp) | 规定是否对元素进行拼写和语法检查。                     |
| [style](https://www.w3school.com.cn/tags/att_standard_style.asp) | 规定元素的行内 CSS 样式。                              |
| [tabindex](https://www.w3school.com.cn/tags/att_standard_tabindex.asp) | 规定元素的 tab 键次序。                                |
| [title](https://www.w3school.com.cn/tags/att_standard_title.asp) | 规定有关元素的额外信息。                               |
| [translate](https://www.w3school.com.cn/tags/att_global_translate.asp) | 规定是否应该翻译元素内容。                             |

#### 1.4.2 其他常用属性 

1. color

    |      表示方式      |             书写形式              | 评价               |
    | :----------------: | :-------------------------------: | ------------------ |
    |      英文单词      |         red,  green, blue         | 表达范围有限       |
    | rgb(值1, 值2, 值3) | 值的范围为0~255，如rgb(0, 0, 255) | 许多浏览器已不支持 |
    |     #值1值2值3     |    值的范围为00~FF，如#FF00FF     | 推荐写法           |

2. width

    | 表示方式 |                书写形式                |
    | :------: | :------------------------------------: |
    |   数值   | width='20'，数值的单位默认是px（像素） |
    |  数值%   |         占比相对于父元素的比例         |

### 1.5 事件

HTML 有能力让事件触发浏览器中的动作，例如当用户单击元素时启动 JavaScript。

HTML配置事件的方式是给特定的元素添加相应的表示某个事件的属性。

> 事件详见 [HTML 事件参考手册 (w3school.com.cn)](https://www.w3school.com.cn/tags/html_ref_eventattributes.asp) 。

#### 1.5.1 Window事件

针对 window 对象触发的事件（应用到`<body>`标签）：

#### 1.5.2 Form事件

由 HTML 表单内的动作触发的事件（应用到几乎所有 HTML 元素，但最常用在 form 元素中）：

#### 1.5.3 Keyboard事件

#### 1.5.4 Mouse事件

由鼠标或类似用户动作触发的事件：

#### 1.5.5 Media 事件

由媒介（比如视频、图像和音频）触发的事件（适用于所有 HTML 元素，但常见于媒介元素中，比如 `<audio>、<embed>、<img>、<object> 以及 <video>`）:

## 2. CSS

### 2.1 概念

1. CSS为Cascading Style Sheets，即层叠样式表。层叠意味着多个样式可以作用在同一个html的元素上，同时生效。

2. CSS的好处：功能强大；将内容展示(HTML)和样式控制(CSS)分离：降低了耦合度，让分工协作更容易，提高了开发效率。

### 2.2 CSS的使用方式：即与HTML结合的方式

1. 行内CSS：在标签内使用style属性指定css代码，如`<div style="color:red;">hello css</div>`。不推荐使用，因为依然是强耦合的形式。

2. 内部CSS：在head标签内，定义style标签，style标签的标签体内容就是CSS代码，如:

    ```css
    <style>
      div {
        color: bule;
      }
    </style>
    <div>hello css</div>
    ```

3. 外部CSS：在head标签内，定义link标签，引入外部定义好的css资源文件。

    - 定义好的a.css文件

    ```css
    div {
      color: green;
    }
    ```

    - 在head标签内定义link标签
    ```html
    <link rel="stylesheet" href="a.css" />
    <div>hello css</div>
    ```


### 2.3 CSS的语法

- 选择器：CSS选择器用于“查找”（或选取）所要设置样式的HTML元素。

    ```css
    选择器 {
        属性名1: 属性值1;
        属性名2: 属性值2;
        …
    }
    ```

- 选择器中的每一对属性需要使用;隔开，最后一对属性可以不加;。

- 注释语法

    ```css
    /*
    这里是注释内容
    */
    ```


### 2.4 选择器的分类

#### 2.4.1 基础选择器

> 优先级：id选择器>类选择器>元素选择器。

- id选择器——选择具有某一id属性值的元素（在一个html页面中id值唯一）。

    ```css
    /*
    	假设某HTML中某一元素的id为id1
    */
    # id1 {
      key1: value1;
      key2: value2;
    }
    ```

- 类（型）选择器——选择具有相同的class属性值的元素。 

    ```css
    /*
    	假设某HTML中某一（些）元素的class属性值为class1
    */
    . class1 {
      key1: value1;
      key2: value2;
    }
    ```

- 元素选择器——选择具有相同标签名称的元素。

    - `*`：选取所有元素
    - `element`：选取元素element
    - `element1,element2,...`：选取所有element1元素和所有element2元素

    ```css
    p {
      key1: value1;
      key2: value2;
    }
    
    div, p {
      key3: value1;
      key4: value2;
    }
    ```

#### 2.4.2 组合选择器

> 实例参见 [CSS 组合器 (w3school.com.cn)](https://www.w3school.com.cn/css/css_combinators.asp) 。

组合选择器根据多个基础选择器之间的特定组合关系来选取元素。

- 后代选择器（空格）——选择属于指定元素后代（子孙）的所有元素。

    ```css
    /*
    	选择 <div> 元素内的所有 <p> 元素。
    */
    
    div p {
      background-color: yellow;
    }
    ```

- 子选择器（>）——选择属于指定元素子元素的所有元素。

    ```css
    /*
    	选择属于 <div> 元素子元素的所有 <p> 元素：
    */
    div > p {
      background-color: yellow;
    }
    ```

- 相邻兄弟选择器（+）——选择所有作为指定元素的相邻同级的元素。

    > 兄弟（同级）元素必须具有相同的父元素，“相邻”的意思是“紧随其后”。

    ```css
    /*
    	选择紧随 <div> 元素之后的所有 <p> 元素：
    */
    div + p {
      background-color: yellow;
    }
    ```

- 通用兄弟选择器（~）——选择属于指定元素的同级元素的所有元素。

    ```css
    /*
    	选择属于 <div> 元素的同级元素的所有 <p> 元素：
    */
    div ~ p {
      background-color: yellow;
    }
    ```

#### 2.4.3 伪类选择器

伪类用于定义元素的特殊状态。例如，它可以用于：

- 设置鼠标悬停在元素上时的样式
- 为已访问和未访问链接设置不同的样式
- 设置元素获得焦点时的样式

伪类的语法：

```css
selector:pseudo-class {
  property: value;
}
```

实例：

```css
/* 未访问的链接 */
a:link {
  color: #FF0000;
}

/* 已访问的链接 */
a:visited {
  color: #00FF00;
}

/* 鼠标悬停链接 */
a:hover {
  color: #FF00FF;
}

/* 已选择的链接 */
a:active {
  color: #0000FF;
}
```

> **注意：**`a:hover` 必须在 CSS 定义中的 `a:link` 和 `a:visited` 之后，才能生效！`a:active` 必须在 CSS 定义中的 `a:hover` 之后才能生效！伪类名称对大小写不敏感。

所有[CSS 伪类](https://www.w3school.com.cn/css/css_pseudo_classes.asp)：

| 选择器                                                       | 例子                  | 例子描述                                                     |
| :----------------------------------------------------------- | :-------------------- | :----------------------------------------------------------- |
| [:active](https://www.w3school.com.cn/cssref/selector_active.asp) | a:active              | 选择活动的链接。                                             |
| [:checked](https://www.w3school.com.cn/cssref/selector_checked.asp) | input:checked         | 选择每个被选中的 `<input>` 元素。                            |
| [:disabled](https://www.w3school.com.cn/cssref/selector_disabled.asp) | input:disabled        | 选择每个被禁用的 `<input>` 元素。                            |
| [:empty](https://www.w3school.com.cn/cssref/selector_empty.asp) | p:empty               | 选择没有子元素的每个 `<p>` 元素。                            |
| [:enabled](https://www.w3school.com.cn/cssref/selector_enabled.asp) | input:enabled         | 选择每个已启用的 `<input>` 元素。                            |
| [:first-child](https://www.w3school.com.cn/cssref/selector_first-child.asp) | p:first-child         | 选择作为其父的首个子元素的每个`<p>`元素。                    |
| [:first-of-type](https://www.w3school.com.cn/cssref/selector_first-of-type.asp) | p:first-of-type       | 选择作为其父的首个`<p>`元素的每个`<p>`元素。                 |
| [:focus](https://www.w3school.com.cn/cssref/selector_focus.asp) | input:focus           | 选择获得焦点的`<input>`元素。                                |
| [:hover](https://www.w3school.com.cn/cssref/selector_hover.asp) | a:hover               | 选择鼠标悬停其上的链接。                                     |
| [:in-range](https://www.w3school.com.cn/cssref/selector_in-range.asp) | input:in-range        | 选择具有指定范围内的值的`<input>`元素。                      |
| [:invalid](https://www.w3school.com.cn/cssref/selector_invalid.asp) | input:invalid         | 选择所有具有无效值的`<input>`元素。                          |
| [:lang(*language*)](https://www.w3school.com.cn/cssref/selector_lang.asp) | p:lang(it)            | 选择每个 lang 属性值以 "it" 开头的`<p>`元素。                |
| [:last-child](https://www.w3school.com.cn/cssref/selector_last-child.asp) | p:last-child          | 选择作为其父的最后一个子元素的每个 `<p>` 元素。              |
| [:last-of-type](https://www.w3school.com.cn/cssref/selector_last-of-type.asp) | p:last-of-type        | 选择作为其父的最后一个`<p>`元素的每个`<p>`元素。             |
| [:link](https://www.w3school.com.cn/cssref/selector_link.asp) | a:link                | 选择所有未被访问的链接。                                     |
| [:not(*selector*)](https://www.w3school.com.cn/cssref/selector_not.asp) | :not(p)               | 选择每个非`<p>`元素的元素。                                  |
| [:nth-child(*n*)](https://www.w3school.com.cn/cssref/selector_nth-child.asp) | p:nth-child(2)        | 选择作为其父的第二个子元素的每个`<p>`元素。                  |
| [:nth-last-child(*n*)](https://www.w3school.com.cn/cssref/selector_nth-last-child.asp) | p:nth-last-child(2)   | 选择作为父的第二个子元素的每个`<p>`元素，从最后一个子元素计数。 |
| [:nth-last-of-type(*n*)](https://www.w3school.com.cn/cssref/selector_nth-last-of-type.asp) | p:nth-last-of-type(2) | 选择作为父的第二个`<p>`元素的每个`<p>`元素，从最后一个子元素计数 |
| [:nth-of-type(*n*)](https://www.w3school.com.cn/cssref/selector_nth-of-type.asp) | p:nth-of-type(2)      | 选择作为其父的第二个`<p>`元素的每个`<p>`元素。               |
| [:only-of-type](https://www.w3school.com.cn/cssref/selector_only-of-type.asp) | p:only-of-type        | 选择作为其父的唯一`<p>`元素的每个`<p>`元素。                 |
| [:only-child](https://www.w3school.com.cn/cssref/selector_only-child.asp) | p:only-child          | 选择作为其父的唯一子元素的`<p>`元素。                        |
| [:optional](https://www.w3school.com.cn/cssref/selector_optional.asp) | input:optional        | 选择不带 "required" 属性的`<input>` 元素。                   |
| [:out-of-range](https://www.w3school.com.cn/cssref/selector_out-of-range.asp) | input:out-of-range    | 选择值在指定范围之外的`<input>` 元素。                       |
| [:read-only](https://www.w3school.com.cn/cssref/selector_read-only.asp) | input:read-only       | 选择指定了 "readonly" 属性的`<input>` 元素。                 |
| [:read-write](https://www.w3school.com.cn/cssref/selector_read-write.asp) | input:read-write      | 选择不带 "readonly" 属性的`<input>` 元素。                   |
| [:required](https://www.w3school.com.cn/cssref/selector_required.asp) | input:required        | 选择指定了 "required" 属性的`<input>` 元素。                 |
| [:root](https://www.w3school.com.cn/cssref/selector_root.asp) | root                  | 选择元素的根元素。                                           |
| [:target](https://www.w3school.com.cn/cssref/selector_target.asp) | #news:target          | 选择当前活动的 #news 元素（单击包含该锚名称的 URL）。        |
| [:valid](https://www.w3school.com.cn/cssref/selector_valid.asp) | input:valid           | 选择所有具有有效值的 `<input>` 元素。                        |
| [:visited](https://www.w3school.com.cn/cssref/selector_visited.asp) | a:visited             | 选择所有已访问的链接。                                       |

#### 2.4.4 伪元素选择器

CSS 伪元素用于设置元素指定部分的样式。例如，它可用于：

- 设置元素的首字母、首行的样式
- 在元素的内容之前或之后插入内容

伪元素的语法：

```css
selector::pseudo-element {
  property: value;
}
```

所有[CSS 伪元素](https://www.w3school.com.cn/css/css_pseudo_elements.asp)

| 选择器                                                       | 例子            | 例子描述                      |
| :----------------------------------------------------------- | :-------------- | :---------------------------- |
| [::after](https://www.w3school.com.cn/cssref/selector_after.asp) | p::after        | 在每个`<p>`元素之后插入内容。 |
| [::before](https://www.w3school.com.cn/cssref/selector_before.asp) | p::before       | 在每个`<p>`元素之前插入内容。 |
| [::first-letter](https://www.w3school.com.cn/cssref/selector_first-letter.asp) | p::first-letter | 选择每个`<p>`元素的首字母。   |
| [::first-line](https://www.w3school.com.cn/cssref/selector_first-line.asp) | p::first-line   | 选择每个`<p>`元素的首行。     |
| [::selection](https://www.w3school.com.cn/cssref/selector_selection.asp) | p::selection    | 选择用户选择的元素部分。      |

#### 2.4.5 属性选择器

我们可以设置带有特定属性或属性值的 HTML 元素的样式。属性选择器便用于选取带有指定属性的元素。

下例选择所有带有 target 属性的`<a>`元素；

```css
a[target] {
  background-color: yellow;
}
```

下例选取所有带有 target="_blank" 属性的 `<a>` 元素：

```css
a[target="_blank"] { 
  background-color: yellow;
}
```

所有[CSS 属性选择器](https://www.w3school.com.cn/css/css_attribute_selectors.asp)：

| 选择器                                                       | 例子                | 例子描述                                                |
| :----------------------------------------------------------- | :------------------ | :------------------------------------------------------ |
| [[attribute\]](https://www.w3school.com.cn/cssref/selector_attribute.asp) | [target]            | 选择带有 target 属性的所有元素。                        |
| [[attribute=value\]](https://www.w3school.com.cn/cssref/selector_attribute_value.asp) | [target=_blank]     | 选择带有 target="_blank" 属性的所有元素。               |
| [[attribute~=value\]](https://www.w3school.com.cn/cssref/selector_attribute_value_contain.asp) | [title~=flower]     | 选择带有包含 "flower" 一词的 title 属性的所有元素。     |
| [[attribute\|=value\]](https://www.w3school.com.cn/cssref/selector_attribute_value_start.asp) | [lang\|=en]         | 选择带有以 "en" 开头的 lang 属性的所有元素。            |
| [[attribute^=value\]](https://www.w3school.com.cn/cssref/selector_attr_begin.asp) | a[href^="https"]    | 选择其 href 属性值以 "https" 开头的每个`<a>`元素。      |
| [[attribute$=value\]](https://www.w3school.com.cn/cssref/selector_attr_end.asp) | a[href\$=".pdf"]    | 选择其 href 属性值以 ".pdf" 结尾的每个`<a>`元素。       |
| [[attribute*=value\]](https://www.w3school.com.cn/cssref/selector_attr_contain.asp) | a[href*="w3school"] | 选择其 href 属性值包含子串 "w3school" 的每个`<a>`元素。 |

### 2.5 CSS的配置的常用属性

> 详见[CSS 教程 (w3school.com.cn)](https://www.w3school.com.cn/css/index.asp)。

#### 附1：盒子模型——控制布局

|  属性   | 作用   |
| :-----: | ------ |
| margin  | 外边距 |
| padding | 内边距 |
|  float  | 浮动   |

#### 附2：CSS字体

> 字体样例可见 [CSS 字体 (w3school.com.cn)](https://www.w3school.com.cn/css/css_font.asp) 。

在 CSS 中，有五个通用字体族，所有不同的字体名称都属于这五个通用字体系列之一：

- 衬线字体（Serif）：在每个字母的边缘都有一个小的笔触。它们营造出一种形式感和优雅感。
- 无衬线字体（Sans-serif）：字体线条简洁（没有小笔画）。它们营造出现代而简约的外观。
- 等宽字体（Monospace）：这里所有字母都有相同的固定宽度。它们创造出机械式的外观。
- 草书字体（Cursive）：模仿了人类的笔迹。
- 幻想字体（Fantasy）：是装饰性/俏皮的字体。

