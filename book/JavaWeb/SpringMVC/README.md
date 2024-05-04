---
title: SpringMVC
---

本章为关于 SpringMVC 的相关内容。

这里先存放一些其他内容：

**POJO（Plain Ordinary Java Object）**，即简单的 Java 对象，实际就是普通的 JavaBean，是为了避免和 EJB 混淆所创造的简称。

- 使用 POJO 名称是为了避免和 [EJB](https://baike.baidu.com/item/EJB) 混淆起来，而且简称比较直接。**其中有一些属性及其 getter、setter 方法的类，没有业务逻辑**，有时可以作为 [VO](https://baike.baidu.com/item/vo/23210302#viewPageContent)(value-object) 或 [DTO](https://baike.baidu.com/item/dto/16016821)(Data Transform Object) 来使用。

- 当然，如果你有一个简单的运算属性也是可以的，但不允许有业务方法，也不能携带有 connection 之类的方法。
