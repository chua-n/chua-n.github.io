---
title: XML
date: 2020-10-28
---

## 1. 概念

**XML**(Extensible Markup Language)，可扩展标记语言。可扩展的含义是：标签都是自定义的，可以在不中断应用程序的情况下进行扩展。

XML的功能为存储数据。可作为配置文件，并方便在网络中传输数据。

XML与HTML的区别：

- XML的标签都是自定义的，HTML标签是预定义的；
- XML的语法严格，HTML语法松散（历史上浏览器恶性竞争所致）；
- XML是存储数据的，HTML是展示数据的。

## 2. 引导案例

设想一下，我们创建了一个应用程序，可将 `<to>、<from> 以及 <body>` 元素提取出来，并产生以下的输出：

> **MESSAGE**
>  To: George
>  From: John
>
> Don't forget the meeting!

```xml
<note>
    <to>George</to>
    <from>John</from>
    <body>Don't forget the meeting!</body>
</note>
```

若之后这个 XML 文档作者又向这个文档添加了如左的一些额外的信息，那么这个应用程序会中断或崩溃吗？答案是否定的，因为应用程序依然可以找到XML文档中的 `<to>、<from> 以及 <body> 元素`，并产生同样的输出。XML的优势之一，就是可以经常在不中断应用程序的情况下进行扩展。

```xml
<note>
    <date>2008-08-08</date>
    <to>George</to>
    <from>John</from>
    <heading>Reminder</heading>
    <body>Don't forget the meeting!</body>
</note>
```

## 3. 基本语法

- XML文档的后缀名为“.xml”
- XML的第一行为文档声明，定义XML的版本、编码等；
- XML的第二行为根标签，根标签只能有且仅有一个；
- 属性值必须使用引号（单双均可）引起来；
- 标签必须正确关闭；
- XML的标签名称区别大小写。

```xml
<?xml version='1.0' ?>
<users>
    <user id='1'>
        <name>zhangsan</name>
        <age>23</age>
        <gender>male</gender>
        <br/>
    </user>
    <user id='2'>
        <name>lisi</name>
        <age>24</age>
        <gender>female</gender>
    </user>
</users>
```

## 4. XML文档的构成组件

1. 元素：即标签，如`<note>, <message>……`元素可包含文本、其他元素或为空。

    ```xml
    <body>body text in between</body>
    <message>some message in between</message>
    ```

2. 属性：提供有关元素的额外信息，其总是被置于某元素的开始标签中。

    ```xml
    <img src="computer.gif" />
    ```

3. 实体：用来定义普通文本的变量。实体引用即是对这些实体的引用，当文本被XML解析器解析时，实体就会被展开。

    |   代码   | 对应符号 |  含义  |
    | :------: | :------: | :----: |
    |  `&lt;`  |    <     |  小于  |
    |  `&gt;`  |    >     |  大于  |
    | `&amp;`  |    &     |  和号  |
    | `&apos;` |    '     | 单引号 |
    | `&quot;` |    "     |  引号  |

4. PCDATA：parse character data，被解析的字符数据。可把PCDATA想象为XML元素的开始标签与结束标签之间的文本，PCDATA是会被解析器解析的文本，这些文本将被解析器检查实体以及标记。

5. CDATA：character data，字符数据，意为不会被解析器解析的文本。在这些文本中的内容不会被当作标记为对待，其中的实体不会被展开。

    ```xml
    <!-- 格式：<![CDATA[ 数据 ]]> -->
    
    <!-- CDATA区示例 -->
    <![CDATA[ if(a < b && b < c) {} ]]>
    <!-- 报错，字符错误，特殊字符不能直接出现 -->
    <code>if(a < b && b < c) {}</code>
    ```

## 5. 一些说明事项

### 5.1 XML 元素 vs 属性

没有什么规矩可以告诉我们什么时候该使用属性，而什么时候该使用子元素。“我的经验是在 HTML 中，属性用起来很便利，但是在 XML 中，应该尽量避免使用属性。如果信息感觉起来很像数据，那么请使用子元素吧。”

```xml
<!-- 
请看这个例子。在第一个例子中，sex 是一个属性；在第二个例子中，sex 则是一个子元素。两个例子均可提供相同的信息。
 -->

<person sex="female">
    <firstname>Anna</firstname>
    <lastname>Smith</lastname>
</person>
<person>
    <sex>female</sex>
    <firstname>Anna</firstname>
    <lastname>Smith</lastname>
</person> 
```

### 5.2 谁编写XML？用户，即软件使用者。谁解析XML？软件。

1. 实际上，使用XML的场景中，软件为半成品软件——框架，用户为程序员（因为：试想微信、QQ这样的成品软件，用户显然不是通过配置XML文档来使用的，而是通过按钮设置的）。
2. 同样地，由于XML的标签是任意的，软件需要为自己编写一个XML的约束文档，以便程序员查阅后编写正确的配置文件。

## 6. XML约束

XML中的约束（文档）：规定XML文档的书写规则。XML约束文档可分为两种类型：

- DTD：一种简单的约束技术
- Schema：一种复杂的约束技术

### 6.1 引入DTD文档到XML文档中：

- 内部DTD：将约束规则定义在XML文档中（不常用，了解即可)

- 外部DTD：将约束规则定义在外部的DTD文件中

    - 本地：

        ```xml
        <!DOCTYPE 根标签名 SYSTEM "DTD文件的位置">
        ```

    - 网络

        ```xml
        <!DOCTYPE 根标签名 PUBLIC "DTD文件名字" "DTD文件的位置URL">
        ```

### 6.2 引入Schema文档到XML文档中：

```xml
<students xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns="http://www.itcast.cn/xml" 
        xsi:schemaLocation="http://www.itcast.cn/xml student.xsd"> 
```

- 填写XML文档的根元素
- 引入xsi前缀：xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
- 引入xsd文件命名空间：xsi:schemaLocation="http://www.itcast.cn/xml  student.xsd"
- 为每一个xsd约束声明一个前缀，作为标识：xmlns="http://www.itcast.cn/xml"

作为框架的使用者（程序员）：

- 能够在XML中引入约束文档；
- 能够简单地读懂约束文档。

## 7. DTD文档

DTD（文档类型定义）的作用是定义XML文档的合法构建模块，它使用一系列的合法元素来定义文档结构。DTD可被成行地声明于XML文档中，也可作为一个外部引用。

### 7.1 内部的DOCTYPE声明（不常用）

语法：`<!DOCTYPE 根元素 [元素声明]>`

```xml
<?xml version="1.0"?>
<!--  Copyright w3school.com.cn -->
<!DOCTYPE note [
  <!ELEMENT note    (to,from,heading,body)>
<!ELEMENT to      (#PCDATA)>
<!ELEMENT from    (#PCDATA)>
<!ELEMENT heading (#PCDATA)>
<!ELEMENT body    (#PCDATA)>
]>
<note>
    <to>George</to>
    <from>John</from>
    <heading>Reminder</heading>
    <body>Don't forget the meeting!</body>
</note> 
```

> - **!DOCTYPE note** (第二行)定义此文档是 **note** 类型的文档。
> - **!ELEMENT note** (第三行)定义 **note** 元素有四个元素："to、from、heading,、body"
> - **!ELEMENT to** (第四行)定义 **to** 元素为 "#PCDATA" 类型
> - **!ELEMENT from** (第五行)定义 **from** 元素为 "#PCDATA" 类型
> - **!ELEMENT heading** (第六行)定义 **heading** 元素为 "#PCDATA" 类型
> - **!ELEMENT body** (第七行)定义 **body** 元素为 "#PCDATA" 类型

### 7.2 外部的文档声明（推荐）

- XML中引用外部DTD文档的语法

    | 位置 |                           语法                            |
    | :--: | :-------------------------------------------------------: |
    | 本地 |          `<!DOCTYPE 根元素 SYSTEM "DTD文件名">`           |
    | 网络 | `<!DOCTYPE 根元素 PUBLIC "DTD文件名" "DTD文件的位置URL">` |

- XML文档的内容

    ```xml
    <?xml version="1.0"?>
    <!DOCTYPE note SYSTEM "note.dtd">
    <note>
        <to>George</to>
        <from>John</from>
        <heading>Reminder</heading>
        <body>Don't forget the meeting!</body>
    </note> 
    ```

- 外部的“note.dtd”文件

    ```xml
    <!ELEMENT note (to,from,heading,body)>
    <!ELEMENT to (#PCDATA)>
    <!ELEMENT from (#PCDATA)>
    <!ELEMENT heading (#PCDATA)>
    <!ELEMENT body (#PCDATA)>
    ```

### 7.3 DTD元素声明

#### 7.3.1 基本语法

| 语法                             |
| -------------------------------- |
| `<!ELEMENT 元素名称 类别>`       |
| `<!ELEMENT 元素名称 (元素内容)>` |

#### 7.3.2 特殊声明

- 空元素：`<!ELEMENT 元素名称 EMPTY>`

- 只有PCDATA的元素：`<!ELEMENT 元素名称 (#PCDATA)>`

- 带有任何内容的元素：`<!ELEMENT 元素名称 ANY>`

- 带有子元素（序列）的元素。

    *当子元素按照由逗号分隔开的序列进行声明时，这些子元素必须按照相同的顺序出现在文档中。在一个完整的声明中，子元素也必须被声明，同时子元素也可拥有子元素。*

    - `<!ELEMENT 元素名称 (子元素名称 1)>`
    - `<!ELEMENT 元素名称 (子元素名称 1,子元素名称 2,.....)>`

- 声明只出现一次的元素

    `<!ELEMENT 元素名称 (子元素名称)>`

- 声明最少出现一次的元素

    `<!ELEMENT 元素名称 (子元素名称+)>`

- 声明出现零次/多次的元素

    `<!ELEMENT 元素名称 (子元素名称*)>`

- 声明出现零次/一次的元素

    `<!ELEMENT 元素名称 (子元素名称?)>`

- 声明“非…即…”类型的内容

    `<!ELEMENT note (to,from,header,(message|body))>`

- 声明混合类型的内容

    `<!ELEMENT note (#PCDATA|to|from|header|message)*>`

### 7.4 DTD属性声明

#### 7.4.1 基本语法

- 语法：`<!ATTLIST 元素名称 属性名称 属性类型 默认值>`

- 示例：

    | `<!ATTLIST payment type CDATA "check">` | DTD实例 |
    | --------------------------------------- | ------- |
    | `<payment type="check" />`              | XML实例 |

#### 7.4.2 属性类型的选项

|      **类型**      |            **描述**            |
| :----------------: | :----------------------------: |
|       CDATA        | 值为字符数据  (character data) |
| (*en1*\|*en2*\|..) |    此值是枚举列表中的一个值    |
|         ID         |         值为唯一的 id          |
|       IDREF        |     值为另外一个元素的  id     |
|       IDREFS       |       值为其他 id 的列表       |
|      NMTOKEN       |      值为合法的 XML 名称       |
|      NMTOKENS      |   值为合法的 XML 名称的列表    |
|       ENTITY       |          值是一个实体          |
|      ENTITIES      |        值是一个实体列表        |
|      NOTATION      |        此值是符号的名称        |
|        xml:        |    值是一个预定义的  XML 值    |

#### 7.4.3 默认值参数可使用下列值

|      值       |  属性的默认值  |
| :-----------: | :------------: |
|   #REQUIRED   | 属性值是必需的 |
|   #IMPLIED    | 属性不是必需的 |
| #FIXED  value | 属性值是固定的 |

### 7.5 列举属性值

语法：`<!ATTLIST 元素名称 属性名称 (en1|en2|..) 默认值>`

示例：

- DTD例子：`<!ATTLIST payment type  (check|cash) "cash">` 
- XML例子： `<payment  type="check" />`  

### 7.6 DTD实体声明

实体是用于定义引用普通文本或特殊字符的快捷方式的变量，实体可在内部或外部声明。

#### 7.6.1 内部实体声明

语法：`<!ENTITY 实体名称 "实体的值">`

示例：

| `<!ENTITY writer "Bill  Gates">`<br />`<!ENTITY copyright "Copyright W3School.com.cn">` | DTD例子 |
| :----------------------------------------------------------- | ------- |
| `<author>&writer;&copyright;</author>`                       | XML例子 |

#### 7.6.2 外部实体声明

语法：`<!ENTITY 实体名称 SYSTEM "URI/URL">`

示例：

| `<!ENTITY writer SYSTEM  "http://www.w3school.com.cn/dtd/entities.dtd">`     <br />`<!ENTITY copyright SYSTEM "http://www.w3school.com.cn/dtd/entities.dtd">` | DTD例子 |
| :----------------------------------------------------------- | ------- |
| `<author>&writer;&copyright;</author>`                       | XML例子 |

### 7.7 DTD文档示例

电视节目表DTD

```xml
<!DOCTYPE TVSCHEDULE [

<!ELEMENT TVSCHEDULE (CHANNEL+)>
<!ELEMENT CHANNEL (BANNER,DAY+)>
<!ELEMENT BANNER (#PCDATA)>
<!ELEMENT DAY (DATE,(HOLIDAY|PROGRAMSLOT+)+)>
<!ELEMENT HOLIDAY (#PCDATA)>
<!ELEMENT DATE (#PCDATA)>
<!ELEMENT PROGRAMSLOT (TIME,TITLE,DESCRIPTION?)>
<!ELEMENT TIME (#PCDATA)>
<!ELEMENT TITLE (#PCDATA)>
<!ELEMENT DESCRIPTION (#PCDATA)>

<!ATTLIST TVSCHEDULE NAME CDATA #REQUIRED>
<!ATTLIST CHANNEL CHAN CDATA #REQUIRED>
<!ATTLIST PROGRAMSLOT VTR CDATA #IMPLIED>
<!ATTLIST TITLE RATING CDATA #IMPLIED>
<!ATTLIST TITLE LANGUAGE CDATA #IMPLIED>

]>
```

## 8. Schema文档

### 8.1 简介

XML Schema是基于XML的DTD替代者，其描述的也是XML文档的结构。XML Schema语言也称作XML     Schema定义（XML Schema Definition），简称XSD。

XML相对DTD的优势：

- XML Schema 可针对未来的需求进行扩展
- XML Schema 更完善，功能更强大
- XML Schema 基于XML 编写
- XML Schema 支持数据类型
- XML Schema 支持命名空间

### 8.2 示例

- 一个XML文档

    ```xml
    <?xml version="1.0"?>
    <note>
        <to>George</to>
        <from>John</from>
        <heading>Reminder</heading>
        <body>Don't forget the meeting!</body>
    </note>
    ```

- DTD方案

    - DTD约束文件

        ```xml
        <!ELEMENT note (to, from, heading, body)>
        <!ELEMENT to (#PCDATA)>
        <!ELEMENT from (#PCDATA)>
        <!ELEMENT heading (#PCDATA)>
        <!ELEMENT body (#PCDATA)>
        ```

    - 采用DTD约束

        ```xml
        <?xml version="1.0"?>
        <!DOCTYPE note SYSTEM "http://www.w3school.com.cn/dtd/note.dtd">
        <note>
            <to>George</to>
            <from>John</from>
            <heading>Reminder</heading>
            <body>Don't forget the meeting!</body>
        </note>
        ```

- Schema方案

    - Schema约束文件

        ```xml
        <?xml version="1.0"?>
        <xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema" 
            targetNamespace="http://www.w3school.com.cn"
            xmlns="http://www.w3school.com.cn" 
            elementFormDefault="qualified">
            <xs:element name="note">
                <xs:complexType>
                    <xs:sequence>
                        <xs:element name="to" type="xs:string"/>
                        <xs:element name="from" type="xs:string"/>
                        <xs:element name="heading" type="xs:string"/>
                        <xs:element name="body" type="xs:string"/>
                    </xs:sequence>
                </xs:complexType>
            </xs:element>
        </xs:schema>
        ```

    - 采用Schema约束

        ```xml
        <?xml version="1.0"?>
        <note xmlns="http://www.w3school.com.cn"
            xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
            xsi:schemaLocation="http://www.w3school.com.cn note.xsd">
            <to>George</to>
            <from>John</from>
            <heading>Reminder</heading>
            <body>Don't forget the meeting!</body>
        </note>
        ```

### 8.3 Schema语法

`<schema>`元素可包含属性，一个schema声明通常类似这样：

```xml
<?xml version="1.0"?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema" 
    targetNamespace="http://www.w3school.com.cn"
    xmlns="http://www.w3school.com.cn" 
    elementFormDefault="qualified">
    
...
...
</xs:schema>
```

- 语句`xmlns:xs="http://www.w3.org/2001/XMLSchema"`表明schema中用到的元素和数据类型来自命名空间 http://www.w3.org/2001/XMLSchema ，同时它还规定了来自此命名空间的元素和数据类型应该使用前缀xs；
- 语句`targetNamespace="http://www.w3school.com.cn"`表明被此schema定义的元素(note, to,     from, heading, body)来自命名空间http://www.w3school.com.cn ；
- 语句`xmlns="http://www.w3school.com.cn"` 指出默认的命名空间是http://www.w3school.com.cn ；
- 语句`elementFormDefault="qualified">`指出任何XML实例文档所使用的且在此schema中声明过的元素必须被命名空间限定。

### 8.4 在XML文档中引用Schema

```xml
<?xml version="1.0"?>
<note xmlns="http://www.w3school.com.cn"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
    xsi:schemaLocation="http://www.w3school.com.cn note.xsd">
    <to>George</to>
    <from>John</from>
    <heading>Reminder</heading>
    <body>Don't forget the meeting!</body>
</note>
```

- 语句`xmlns="http://www.w3school.com.cn"`规定了默认命名空间的声明，此声明会告知schema验证器，在此XML文档中使用的所有元素都被声明于" http://www.w3school.com.cn "这个命名空间；
- 当拥有了XML Schema的实例命名空间…...

## 9. 解析XML

### 9.1 概念

1. **XML解析**：将XML文档中的数据读取到内存中。
2. **XML写入**：将内存中的数据保存到XML文档中，作为持久化的存储。

### 9.2 解析XML的方式

- DOM：将标记语言文档一次性加载进内存，在内存中形成一棵DOM树。
  1. 优点：操作方便，可以对文档进行CRUD的所有操作；
  2. 缺点：占内存
- SAX：逐行读取，基于事件驱动。
  1. 优点：几乎不占内存
  2. 缺点：只能读取，不能增删改

### 9.3 常见的XML解析器

| 解析器 |                          评价                           |
| :----: | :-----------------------------------------------------: |
|  JAXP  | sun公司提供的解析器，支持DOM和SAM两种思想，但“性能烂  ” |
| DOM4J  |                  一款非常优秀的解析器                   |
| Jsoup  |                    很优秀就完事儿了…                    |
|  PULL  |        Android操作系统内置的解析器，采用SAX方式         |

- Jsoup 使用步骤：
    - 导入jar包
    - 获取Document对象
    - 获取对应的标签Element对象
    - 获取数据

