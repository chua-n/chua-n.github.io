## 不懂的地方

嵌套路由：不仅路由地址要配在父地址内（配置children），子路由的`<router-view />`选项也应该出现在父路由`<router-view />`对应的组件内部。

## 其他

vue里对js对象的属性似乎更喜欢称之为property，而不是attribute。

不同的是，对于html元素的属性，Vue称之为attribute。

## Vue前端作业待改进

- 页面布局逻辑

    - 可以改为事件监听去更改tree-grid，在`create()`里用`this.$on`

    ![鹏哥](D:\工作\北京两周\前端作业（第一周）\鹏哥.png)

- vue文件命名小写

- 可以用drawio绘图（vscode有插件）

- 关注vue的父子组件的事件传递

