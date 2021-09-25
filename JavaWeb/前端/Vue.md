## 0. 前言

vue里对js对象的属性似乎更喜欢称之为property，而不是attribute。

不同的是，对于html元素的属性，Vue称之为attribute。

嵌套路由（不懂的地方）：不仅路由地址要配在父地址内（配置children），子路由的`<router-view />`选项也应该出现在父路由`<router-view />`对应的组件内部。

## 1. Vue.js介绍

### 1.1 设计理念

Vue (读音 /vjuː/，类似于 **view**) 是一套用于构建用户界面的**渐进式框架**。与其它大型框架不同的是，Vue 被设计为可以自底向上逐层应用。Vue 的核心库只关注视图层，不仅易于上手，还便于与第三方库或既有项目整合。另一方面，当与[现代化的工具链](https://cn.vuejs.org/v2/guide/single-file-components.html)以及各种[支持类库](https://github.com/vuejs/awesome-vue#libraries--plugins)结合使用时，Vue 也完全能够为复杂的单页应用提供驱动。

Vue.js 的核心是一个允许采用简洁的模板语法来声明式地将数据渲染进 DOM 的系统，并且所有东西都是**响应式的**。

组件系统是 Vue 的另一个重要概念，因为它是一种抽象，允许我们使用小型、独立和通常可复用的组件构建大型应用。仔细想想，几乎任意类型的应用界面都可以抽象为一个组件树：

<img src="https://chua-n.gitee.io/blog-images/notebooks/JavaWeb/前端/components.png" alt="Component Tree" style="zoom:67%;" />

在 Vue 里，一个组件本质上是一个拥有预定义选项的一个 Vue 实例，每个 Vue 应用都是通过用 `Vue` 函数创建一个新的 **Vue 实例**开始的：

```js
var vm = new Vue({
  // 选项
})
```

> 虽然没有完全遵循 [MVVM 模型](https://zh.wikipedia.org/wiki/MVVM)，但是 Vue 的设计也受到了它的启发。因此在文档中经常会使用 `vm` (ViewModel 的缩写) 这个变量名表示 Vue 实例。

一个 Vue 应用由一个**根 Vue 实例**，以及可选的嵌套的、可复用的组件树组成，例如一个 todo 应用的组件树可以是这样的：

```shell
根实例
└─ TodoList
   ├─ TodoItem
   │  ├─ TodoButtonDelete
   │  └─ TodoButtonEdit
   └─ TodoListFooter
      ├─ TodosButtonClear
      └─ TodoListStatistics
```

### 1.2 安装vue

在用 Vue 构建大型应用时推荐使用 NPM 安装[[1\]](https://cn.vuejs.org/v2/guide/installation.html#footnote-1)。NPM 能很好地和诸如 [webpack](https://webpack.js.org/) 或 [Browserify](http://browserify.org/) 模块打包器配合使用。同时 Vue 也提供配套工具来开发[单文件组件](https://cn.vuejs.org/v2/guide/single-file-components.html)。

```shell
# 最新稳定版
$ npm install vue
```

- **完整版**：同时包含编译器和运行时的版本。
- **编译器**：用来将模板字符串编译成为 JavaScript 渲染函数的代码。
- **运行时**：用来创建 Vue 实例、渲染并处理虚拟 DOM 等的代码。基本上就是除去编译器的其它一切。
    - 运行时版本相比完整版体积要小大约 30%，

### 1.3 注意事项

箭头函数并没有 `this`，因此不要在选项 property 或回调上使用[箭头函数](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/Arrow_functions)，比如 `created: () => console.log(this.a)` 或 `vm.$watch('a', newValue => this.myMethod())`，这会导致`this` 一直向上级词法作用域查找，直至找到为止，故而经常导致 `Uncaught TypeError: Cannot read property of undefined` 或 `Uncaught TypeError: this.myMethod is not a function` 之类的错误。

## 2. Vue对象

### 2.1 创建Vue对象

当一个 Vue 实例被创建时，它将 `data` 对象中的所有的 property 加入到 Vue 的**响应式系统**中。当这些 property 的值发生改变时，视图将会产生“响应”，即匹配更新为新的值。

```js
// 我们的数据对象
var data = { a: 1 }

// 该对象被加入到一个 Vue 实例中
var vm = new Vue({
  data: data
})

// 获得这个实例上的 property
// 返回源数据中对应的字段
vm.a == data.a // => true

// 设置 property 也会影响到原始数据
vm.a = 2
data.a // => 2

// ……反之亦然
data.a = 3
vm.a // => 3
```

当这些数据改变时，视图会进行再渲染。值得注意的是只有当实例被创建时就已经存在于 `data` 中的 property 才是**响应式**的。

> 也就是说如果你添加一个新的 property，比如：
>
> ```js
> vm.b = 'hi'
> ```
>
> 那么对 `b` 的改动将不会触发任何视图的更新。如果你知道你会在晚些时候需要一个 property，但是一开始它为空或不存在，那么你仅需要设置一些初始值。比如：
>
> ```js
> data: {
>   newTodoText: '',
>   visitCount: 0,
>   hideCompletedTodos: false,
>   todos: [],
>   error: null
> }
> ```

不过，如果对一个数据对象`obj`使用了`Object.freeze(obj)`，这也会阻碍响应系统。

Vue实例还有一些自带的property与方法，它们都有前缀`$`，例如：

```js
var data = { a: 1 }
var vm = new Vue({
  el: '#example',
  data: data
})

vm.$data === data // => true
vm.$el === document.getElementById('example') // => true

// $watch 是一个实例方法
vm.$watch('a', function (newValue, oldValue) {
  // 这个回调将在 `vm.a` 改变后调用
})
```

### 2.2 生命周期钩子

每个 Vue 实例在被创建时都要经过一系列的初始化过程——例如，需要设置数据监听、编译模板、将实例挂载到 DOM 并在数据变化时更新 DOM 等。这个过程中会开放了一些叫做**生命周期钩子**的函数接口，以便给用户在不同阶段执行自己的代码的机会。

比如 [`created`](https://cn.vuejs.org/v2/api/#created) 钩子可以用来在一个实例被创建之后执行代码：

```js
new Vue({
  data: {
    a: 1
  },
  created: function () {
    // `this` 指向 vm 实例
    console.log('a is: ' + this.a)
  }
})
// => "a is: 1"
```

> 生命周期钩子的 `this` 上下文指向调用它的 Vue 实例。

<img src="https://chua-n.gitee.io/blog-images/notebooks/JavaWeb/前端/lifecycle.png" alt="Vue 实例生命周期" style="zoom:67%;" />

### 2.3 计算属性和侦听属性

#### 计算属性

模板内的表达式非常便利，但是设计它们的初衷是用于简单运算的，在模板中放入太多的逻辑会让模板过重且难以维护，所以，对于复杂的逻辑应当使用**计算属性**。

```html
<div id="example">
  <p>Original message: "{{ message }}"</p>
  <p>Computed reversed message: "{{ reversedMessage }}"</p>
</div>
```

```js
var vm = new Vue({
  el: '#example',
  data: {
    message: 'Hello'
  },
  computed: {
    // 计算属性的 getter
    reversedMessage: function () {
      // `this` 指向 vm 实例
      return this.message.split('').reverse().join('')
    }
  }
})
```

给计算属性提供的函数相当于该属性的`getter()`方法。在默认情况下，计算属性只有`getter`方法，不过在需要时也可以提供一个`setter`方法：

```js
// ...
computed: {
  fullName: {
    // getter
    get: function () {
      return this.firstName + ' ' + this.lastName
    },
    // setter
    set: function (newValue) {
      var names = newValue.split(' ')
      this.firstName = names[0]
      this.lastName = names[names.length - 1]
    }
  }
}
// ...
```

> 现在再运行 `vm.fullName = 'John Doe'` 时，setter 会被调用，`vm.firstName` 和 `vm.lastName` 也会相应地被更新。

在插入数据时相对直接使用函数而言，计算属性是是基于响应式依赖的，这意味着计算属性具有缓存性质，只有相关的响应式依赖发生改变时它们才会重新求值，而不像函数那样每次都调用。

#### 侦听属性

Vue 提供了一种更通用的方式来观察和响应 Vue 实例上的数据变动：**侦听属性**，其用`watch`来表示。当需要在数据变化时执行异步或开销较大的操作时，这个方式是最有用的。

```html
<div id="watch-example">
  <p>
    Ask a yes/no question:
    <input v-model="question">
  </p>
  <p>{{ answer }}</p>
</div>
```

```html
<!-- 因为 AJAX 库和通用工具的生态已经相当丰富，Vue 核心代码没有重复 -->
<!-- 提供这些功能以保持精简。这也可以让你自由选择自己更熟悉的工具。 -->
<script src="https://cdn.jsdelivr.net/npm/axios@0.12.0/dist/axios.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/lodash@4.13.1/lodash.min.js"></script>
<script>
var watchExampleVM = new Vue({
  el: '#watch-example',
  data: {
    question: '',
    answer: 'I cannot give you an answer until you ask a question!'
  },
  watch: {
    // 如果 `question` 发生改变，这个函数就会运行
    question: function (newQuestion, oldQuestion) {
      this.answer = 'Waiting for you to stop typing...'
      this.debouncedGetAnswer()
    }
  },
  created: function () {
    // `_.debounce` 是一个通过 Lodash 限制操作频率的函数。
    // 在这个例子中，我们希望限制访问 yesno.wtf/api 的频率
    // AJAX 请求直到用户输入完毕才会发出。想要了解更多关于
    // `_.debounce` 函数 (及其近亲 `_.throttle`) 的知识，
    // 请参考：https://lodash.com/docs#debounce
    this.debouncedGetAnswer = _.debounce(this.getAnswer, 500)
  },
  methods: {
    getAnswer: function () {
      if (this.question.indexOf('?') === -1) {
        this.answer = 'Questions usually contain a question mark. ;-)'
        return
      }
      this.answer = 'Thinking...'
      var vm = this
      axios.get('https://yesno.wtf/api')
        .then(function (response) {
          vm.answer = _.capitalize(response.data.answer)
        })
        .catch(function (error) {
          vm.answer = 'Error! Could not reach the API. ' + error
        })
    }
  }
})
</script>
```

在上述示例中，使用 `watch` 选项允许我们执行异步操作 (访问一个 API)，限制我们执行该操作的频率，并在我们得到最终结果前，设置中间状态。这些都是计算属性无法做到的。

除了 `watch` 选项之外，还可以使用命令式的 [vm.$watch API](https://cn.vuejs.org/v2/api/#vm-watch)。

## 3. Vue模板语法

Vue.js 使用了基于 HTML 的模板语法，允许开发者声明式地将 DOM 绑定至底层 Vue 实例的数据。所有 Vue.js 的模板都是合法的 HTML，所以能被遵循规范的浏览器和 HTML 解析器解析。在底层的实现上，Vue 将模板编译成虚拟 DOM 渲染函数。结合响应系统，Vue 能够智能地计算出最少需要重新渲染多少组件，并把 DOM 操作次数减到最少。

> 如果你熟悉虚拟 DOM 并且偏爱 JavaScript 的原始力量，你也可以不用模板，[直接写渲染 (render) 函数](https://cn.vuejs.org/v2/guide/render-function.html)，使用可选的 JSX 语法。

### 3.1 插值

#### 3.1.1 文本

- 双大括号`{{}}`语法：

    ```html
    `<span>Message: {{msg}}</span>`
    ```

    > 运行时会将括号内的内容实时替换为数据对象的`msg` property的值。

- `v-once`指令：

    ```html
    <span v-once>这个将不会改变: {{ msg }}</span>
    ```

    > 使用v-once指令意味着只能执行一次插值，此后数据改变时插值处的内容不会更新。

#### 3.1.2 输出被解析的HTML

双大括号会将数据解释为普通文本而非HTML代码，为了输出会被解析的 HTML，需要使用 [`v-html` 指令](https://cn.vuejs.org/v2/api/#v-html)：

```html
<p>Using mustaches: {{ rawHtml }}</p>
<p>Using v-html directive: <span v-html="rawHtml"></span></p>
```

> 这个 `span` 的内容将会被替换成为 property 值 `rawHtml`。

注意，不能企图使用 `v-html` 来复合局部模板，因为 Vue 不是基于字符串的模板引擎。相应地，你应该使用Vue组件。

#### 3.1.3 attribute

双大括号语法不能作用在 HTML 的属性（attribute）上，此时应该使用 [`v-bind` 指令](https://cn.vuejs.org/v2/api/#v-bind)：

```html
<div v-bind:id="dynamicId"></div>
```

值得注意的是，对于布尔属性（即只要它们存在就意味着值为 `true`），`v-bind` 的机制略有不同：

```html
<button v-bind:disabled="isButtonDisabled">Button</button>
```

如果 `isButtonDisabled` 的值是 `null`、`undefined` 或 `false`，则 `disabled` attribute 甚至不会被包含在渲染出来的 `<button>` 元素中。

#### 3.1.4 使用js表达式

实际上对于所有的数据绑定，Vue.js 都提供了完全的 JavaScript 表达式支持：

```html
{{ number + 1 }}

{{ ok ? 'YES' : 'NO' }}

{{ message.split('').reverse().join('') }}

<div v-bind:id="'list-' + id"></div>
```

> 这些表达式会在所属 Vue 实例的数据作用域下作为 JavaScript 被解析。

不过这里有个限制：每个绑定都只能包含**单个表达式**。所以下面的例子都不会生效：

```html
<!-- 这是语句，不是表达式 -->
{{ var a = 1 }}

<!-- 流控制也不会生效，请使用三元表达式 -->
{{ if (ok) { return message } }}
```

需要强调的是，模板表达式都被放在沙盒中，只能访问[全局变量的一个白名单](https://github.com/vuejs/vue/blob/v2.6.10/src/core/instance/proxy.js#L9)，如 `Math` 和 `Date` ，而不应该在模板表达式中试图访问用户定义的全局变量。

### 3.2 指令

指令 (Directives) 是带有 `v-` 前缀的、vue模板中html元素的特殊 attribute。一般情况下，指令是**单个 JavaScript 表达式**（v-for除外），如这里的`v-if` 指令将根据表达式 `seen` 的值的真假来插入/移除 `<p>` 元素：

```html
<p v-if="seen">现在你看到我了</p>
```

#### 3.2.1 指令的参数

有的指令能够接收一个参数，在指令后以冒号表示，如`v-bind`可以用于响应式地更新HTML的attribute：

```html
<a v-bind:href="url">...</a>
```

> 在这里 `href` 是参数，告知 `v-bind` 指令将该元素的 `href` attribute 与表达式 `url` 的值绑定。

#### 3.2.2 指令的动态参数

从 Vue 2.6.0 开始，可以用方括号括起来的 JavaScript 表达式作为一个指令的参数：

```html
<a v-bind:[attributeName]="url"> ... </a>
```

> 这里的 `attributeName` 会被作为一个 JavaScript 表达式进行动态求值，求得的值将会作为最终的参数来使用。
>
> 例如，如果你的 Vue 实例的数据对象有一个 property 叫做`attributeName`，当其值为 `"href"`时上述绑定将等价于 `v-bind:href`。

动态参数正常情况下会求出一个字符串，异常情况下值为 `null`。这个特殊的 `null` 值可以被显性地用于移除绑定。任何其它非字符串类型的值都将会触发一个警告。

##### 对动态参数表达式的约束

由于某些字符（如空格、引号）放在 HTML 元素的 attribute 名里是无效的，所以动态参数表达式有一些语法约束：

```html
<!-- 这会触发一个编译警告 -->
<a v-bind:['foo' + bar]="value"> ... </a>
```

变通的办法是使用没有空格或引号的表达式，或用计算属性替代这种复杂表达式。

此外，在 DOM 中使用模板时 (直接在一个 HTML 文件里撰写模板)，还需要避免使用大写字符来命名键名，因为浏览器会把 attribute 名全部强制转为小写：

```html
<!--
在 DOM 中使用模板时这段代码会被转换为 `v-bind:[someattr]`。
除非在实例中有一个名为“someattr”的 property，否则代码不会工作。
-->
<a v-bind:[someAttr]="value"> ... </a>
```

#### 3.2.3 修饰符

饰符符是以 `.` 指明的特殊后缀，用于指出一个指令应该以特殊方式绑定。

例如，`.prevent` 修饰符告诉 `v-on` 指令对于触发的事件调用 `event.preventDefault()`：

```html
<form v-on:submit.prevent="onSubmit">...</form>
```

#### 3.2.4 两个常用指令缩写

- `v-bind`：缩写为冒号`:`

    ```html
    <!-- 完整语法 -->
    <a v-bind:href="url">...</a>
    
    <!-- 缩写 -->
    <a :href="url">...</a>
    ```

- `v-on`：缩写为`@`

    ```html
    <!-- 完整语法 -->
    <a v-on:click="doSomething">...</a>
    
    <!-- 缩写 -->
    <a @click="doSomething">...</a>
    ```

### 3.3 Class与Style绑定

操作元素的 class 列表和内联样式是数据绑定的一个常见需求，由于它们都是 attribute，因而可以用 `v-bind` 进行处理：只需要通过表达式计算出字符串结果即可。不过，字符串拼接麻烦且易错，故而在将 `v-bind` 用于 `class` 和 `style` 时，Vue.js 做了专门的增强——表达式结果的类型除了字符串之外，还可以是对象或数组。

> 暂略，详见[Class 与 Style 绑定 — Vue.js (vuejs.org)](https://cn.vuejs.org/v2/guide/class-and-style.html)。

### 3.4 条件渲染

#### 3.4.1 v-if

`v-if` 指令用于条件性地渲染一块内容这，这块内容只会在指令的表达式返回 truthy 值的时候被渲染。

```HTML
<h1 v-if="awesome">Vue is awesome!</h1>
```

也可以用 `v-else` 添加一个“else 块”：

```HTML
<h1 v-if="awesome">Vue is awesome!</h1>
<h1 v-else>Oh no 😢</h1>
```

> `v-else` 元素必须紧跟在带 `v-if` 或者 `v-else-if` 的元素的后面，否则它将不会被识别。

也有`v-else-if`，顾名思义即可：

```html
<div v-if="type === 'A'">
  A
</div>
<div v-else-if="type === 'B'">
  B
</div>
<div v-else-if="type === 'C'">
  C
</div>
<div v-else>
  Not A/B/C
</div>
```

> 类似于 `v-else`，`v-else-if` 也必须紧跟在带 `v-if` 或者 `v-else-if` 的元素之后。

可以把一个 `<template>` 元素当做不可见的包裹元素，并在上面使用 `v-if`，此时最终的渲染结果将不包含 `<template>` 元素。

```html
<template v-if="ok">
    <h1>Title</h1>
    <p>Paragraph 1</p>
    <p>Paragraph 2</p>
</template>
```

#### 3.4.2 v-show

另一个用于根据条件展示元素的选项是 `v-show` 指令，其用法别无二致：

```html
<h1 v-show="ok">Hello!</h1>
```

不同的是带有 `v-show` 的元素始终会被渲染并保留在 DOM 中——`v-show` 只是简单地切换元素的 CSS 属性 `display`。

> 注意，`v-show` 不支持 `<template>` 元素，也不支持 `v-else`。

一般来说，`v-if` 有更高的切换开销，而 `v-show` 有更高的初始渲染开销。因此，如果需要非常频繁地切换，则使用 `v-show` 较好；如果在运行时条件很少改变，则使用 `v-if` 较好。

#### 3.4.3 key

Vue 被设定为尽可能高效地渲染元素，因而通常会复用已有元素而不是从头开始渲染。这么做除了使 Vue 变得非常快之外，还有其它一些好处。例如，如果你允许用户在不同的登录方式之间切换：

```html
<template v-if="loginType === 'username'">
  <label>Username</label>
  <input placeholder="Enter your username">
</template>
<template v-else>
  <label>Email</label>
  <input placeholder="Enter your email address">
</template>
```

那么在上面的代码中切换 `loginType` 将不会清除用户已经输入的内容。因为两个模板使用了相同的元素，`<input>` 不会被替换掉——仅仅是替换了它的 `placeholder`。

但是这样也不总是符合实际需求，所以 Vue 还提供了一种方式来表达“这两个元素是完全独立的，不要复用它们”这种理念，只需添加一个具有唯一值的 `key` attribute 即可：

```html
<template v-if="loginType === 'username'">
  <label>Username</label>
  <input placeholder="Enter your username" key="username-input">
</template>
<template v-else>
  <label>Email</label>
  <input placeholder="Enter your email address" key="email-input">
</template>
```

> 现在，每次切换时，输入框都将被重新渲染。但注意`<label>` 元素仍然会被高效地复用，因为它们没有添加 `key` attribute。

### 3.5 列表渲染

可以用 `v-for` 指令基于一个数组来渲染一个列表。

#### 3.5.1 常用用法

`v-for` 指令通常使用 `item in items` 形式的特殊语法，其中 `items` 是数据源数组，而 `item` 则是代表当前被迭代到的数组元素。

```html
<ul id="example-1">
  <li v-for="item in items" :key="item.message">
    {{ item.message }}
  </li>
</ul>
```

```js
var example1 = new Vue({
  el: '#example-1',
  data: {
    items: [
      { message: 'Foo' },
      { message: 'Bar' }
    ]
  }
})
```

#### 3.5.2 遍历时携带索引

`v-for` 还支持一个可选的第二个参数，即当前项的索引。

```html
<ul id="example-2">
  <li v-for="(item, index) in items">
    {{ parentMessage }} - {{ index }} - {{ item.message }}
  </li>
</ul>
```

```js
var example2 = new Vue({
  el: '#example-2',
  data: {
    parentMessage: 'Parent',
    items: [
      { message: 'Foo' },
      { message: 'Bar' }
    ]
  }
})
```

Tips：也可以用 `of` 替代 `in` 作为分隔符，这样设计只是因为它更接近 JavaScript 迭代器的语法：

```html
<div v-for="item of items"></div>
```

#### 3.5.3 使用`v-for`遍历对象的property

```html
<ul id="v-for-object" class="demo">
  <li v-for="value in object">
    {{ value }}
  </li>
</ul>
```

```js
new Vue({
  el: '#v-for-object',
  data: {
    object: {
      title: 'How to do lists in Vue',
      author: 'Jane Doe',
      publishedAt: '2016-04-10'
    }
  }
})
```

你也可以提供第二个的参数为 property 名称 (也就是键名)：

```html
<div v-for="(value, name) in object">
  {{ name }}: {{ value }}
</div>
```

还可以用第三个参数作为索引：

```html
<div v-for="(value, name, index) in object">
  {{ index }}. {{ name }}: {{ value }}
</div>
```

#### 3.5.4 key attribue（TMD说了些啥？）

当 Vue 正在更新使用 `v-for` 渲染的元素列表时，它默认使用“就地更新”的策略。如果数据项的顺序被改变，Vue 将不会移动 DOM 元素来匹配数据项的顺序，而是就地更新每个元素，并且确保它们在每个索引位置正确渲染。这个类似 Vue 1.x 的 `track-by="$index"`。

这个默认的模式是高效的，但是**只适用于不依赖子组件状态或临时 DOM 状态 (例如：表单输入值) 的列表渲染输出**。

为了给 Vue 一个提示，以便它能跟踪每个节点的身份，从而重用和重新排序现有元素，你需要为每项提供一个唯一 `key` attribute：

```html
<div v-for="item in items" v-bind:key="item.id">
  <!-- 内容 -->
</div>
```

建议尽可能在使用 `v-for` 时提供 `key` attribute，除非遍历输出的 DOM 内容非常简单，或者是刻意依赖默认行为以获取性能上的提升。

因为它是 Vue 识别节点的一个通用机制，`key` 并不仅与 `v-for` 特别关联。后面我们将在指南中看到，它还具有其它用途。

不要使用对象或数组之类的非基本类型值作为 `v-for` 的 `key`。请用字符串或数值类型的值。

更多 `key` attribute 的细节用法请移步至 [`key` 的 API 文档](https://cn.vuejs.org/v2/api/#key)。

#### 3.5.5 `v-for`中也可以调用方法

```html
<ul v-for="set in sets">
  <li v-for="n in even(set)">{{ n }}</li>
</ul>
```

```js
data: {
  sets: [[ 1, 2, 3, 4, 5 ], [6, 7, 8, 9, 10]]
},
methods: {
  even: function (numbers) {
    return numbers.filter(function (number) {
      return number % 2 === 0
    })
  }
}
```

#### 3.5.6 `v-for`循环固定的次数

`v-for` 也可以接受整数。在这种情况下，它会把模板重复对应次数。

```html
<div>
  <span v-for="n in 10">{{ n }} </span>
</div>
```

#### 3.5.7 `v-for` 与 `v-if` 一起使用时

当它们处于同一节点，`v-for` 的优先级比 `v-if` 更高，这意味着 `v-if` 将分别重复运行于每个 `v-for` 循环中。

当你只想为*部分*项渲染节点时，这种优先级的机制会十分有用，下面的代码将只渲染未完成的 todo：

```html
<li v-for="todo in todos" v-if="!todo.isComplete">
  {{ todo }}
</li>
```

而如果你的目的是有条件地跳过循环的执行，那么可以将 `v-if` 置于外层元素 (或`template`) 上：

```html
<ul v-if="todos.length">
  <li v-for="todo in todos">
    {{ todo }}
  </li>
</ul>
<p v-else>No todos left!</p>
```

### 3.6 事件处理——`v-on`

可以用 `v-on` 指令监听 DOM 事件，并在触发时运行一些 JavaScript 代码：

```html
<div id="example-1">
  <button v-on:click="counter += 1">Add 1</button>
  <p>The button above has been clicked {{ counter }} times.</p>
</div>
```

```js
var example1 = new Vue({
  el: '#example-1',
  data: {
    counter: 0
  }
})
```

> 当在内联语句中需要访问原始的 DOM 事件时，可以用特殊变量 `$event` 把它传入方法：
>
> ```html
> <button v-on:click="warn('Form cannot be submitted yet.', $event)">
>   Submit
> </button>
> ```
>
> ```js
> // ...
> methods: {
>   warn: function (message, event) {
>     // 现在我们可以访问原生事件对象
>     if (event) {
>       event.preventDefault()
>     }
>     alert(message)
>   }
> }
> ```

当事件处理逻辑比较复杂时，`v-on`还可以接收一个需要调用的方法名称：

```html
<div id="example-2">
  <!-- `greet` 是在下面定义的方法名 -->
  <button v-on:click="greet">Greet</button>
</div>
```

```js
var example2 = new Vue({
  el: '#example-2',
  data: {
    name: 'Vue.js'
  },
  // 在 `methods` 对象中定义方法
  methods: {
    greet: function (event) {
      // `this` 在方法里指向当前 Vue 实例
      alert('Hello ' + this.name + '!')
      // `event` 是原生 DOM 事件
      if (event) {
        alert(event.target.tagName)
      }
    }
  }
})

// 此时也可以用 JavaScript 直接调用该方法
example2.greet() // => 'Hello Vue.js!'
```

#### 事件修饰符

在事件处理程序中调用 `event.preventDefault()` 或 `event.stopPropagation()` 是非常常见的需求，尽管我们可以在方法中轻松实现这点，但更好的方式是：方法只有纯粹的数据逻辑，而不是去处理 DOM 事件细节。

为了解决这个问题，Vue.js 为 `v-on` 提供了**事件修饰符**，修饰符是由点开头的指令后缀来表示的。

- `.stop`
- `.prevent`
- `.capture`
- `.self`
- `.once`
- `.passive`
- ...

```html
<!-- 阻止单击事件继续传播 -->
<a v-on:click.stop="doThis"></a>

<!-- 提交事件不再重载页面 -->
<form v-on:submit.prevent="onSubmit"></form>

<!-- 修饰符可以串联 -->
<a v-on:click.stop.prevent="doThat"></a>

<!-- 只有修饰符 -->
<form v-on:submit.prevent></form>

<!-- 添加事件监听器时使用事件捕获模式 -->
<!-- 即内部元素触发的事件先在此处理，然后才交由内部元素进行处理 -->
<div v-on:click.capture="doThis">...</div>

<!-- 只当在 event.target 是当前元素自身时触发处理函数 -->
<!-- 即事件不是从内部元素触发的 -->
<div v-on:click.self="doThat">...</div>
```

注意，使用修饰符时，顺序很重要，相应的代码会以同样的顺序产生。因此，用 `v-on:click.prevent.self` 会阻止**所有的点击**，而 `v-on:click.self.prevent` 只会阻止对元素自身的点击。

### 3.7 表单输入绑定——`v-model`

可以用 `v-model` 指令在表单 `<input>`、`<textarea>` 及 `<select>` 元素上创建双向数据绑定，它会根据控件类型自动选取正确的方法来更新元素。`v-model` 本质上其实是语法糖——通过监听用户的输入事件以更新数据，并对一些极端场景进行一些特殊处理。

`v-model` 会忽略所有表单元素的 `value`、`checked`、`selected` attribute 的初始值而总是将 Vue 实例的数据作为数据来源。你应该通过 JavaScript 在组件的 `data` 选项中声明初始值。

`v-model` 在内部为不同的输入元素使用不同的 property 并抛出不同的事件：

- text 和 textarea 元素使用 `value` property 和 `input` 事件；
- checkbox 和 radio 使用 `checked` property 和 `change` 事件；
- select 字段将 `value` 作为 prop 并将 `change` 作为事件。

> 对于需要使用[输入法](https://zh.wikipedia.org/wiki/输入法) (如中文、日文、韩文等) 的语言，你会发现 `v-model` 不会在输入法组合文字过程中得到更新。如果你也想处理这个过程，请使用 `input` 事件。

示例：

```html
<span>Multiline message is:</span>
<p style="white-space: pre-line;">{{ message }}</p>
<br>
<textarea v-model="message" placeholder="add multiple lines"></textarea>
```

> 在文本区域插值 (`<textarea>{{text}}</textarea>`) 并不会生效，需要用 `v-model` 来代替。

`v-model`修饰符：

- `.lazy`：默认情况下，`v-model` 在每次 `input` 事件触发后将输入框的值与数据进行同步，但可以添加 `lazy` 修饰符转为在 `change` 事件_之后_进行同步。

- `.number`：如果想自动将用户的输入值转为数值类型，可以给 `v-model` 添加 `number` 修饰符：

    ```html
    <input v-model.number="age" type="number">
    ```

- `.trim`：自动过滤用户输入的首尾空白字符。

## 4. 组件

### 4.1 组件的含义

组件是可复用的 Vue 实例，且带有一个名字。例如下面定义了一个 `<button-counter>`组件：

```js
// 定义一个名为 button-counter 的新组件
Vue.component('button-counter', {
  data: function () {
    return {
      count: 0
    }
  },
  template: '<button v-on:click="count++">You clicked me {{ count }} times.</button>'
})
```

> 组件是可复用的 Vue 实例，所以它们与 `new Vue` 接收相同的选项，例如 `data`、`computed`、`watch`、`methods` 以及生命周期钩子等。

每用一次组件，就会有一个它的新**实例**被创建，因此下面定义的三个按钮会各自维护它独立的`count`：

```html
<div id="components-demo">
  <button-counter></button-counter>
  <button-counter></button-counter>
  <button-counter></button-counter>
</div>
```

<img src="https://chua-n.gitee.io/blog-images/notebooks/JavaWeb/前端/1.png" alt="image-20210924091336937" style="zoom:100%;" />

**一个组件的 `data` 选项必须是一个函数**，因此每个实例可以维护一份被返回对象的独立的拷贝：

```js
data: function () {
  return {
    count: 0
  }
}
```

如果 Vue 没有这条规则，点击一个按钮就可能会像如下代码一样影响到*其它所有实例*：

<img src="https://chua-n.gitee.io/blog-images/notebooks/JavaWeb/前端/2.png" alt="image-20210924091549466" style="zoom:100%;" />

注意每个组件必须只有一个根元素。

### 4.2 组件的组织

通常一个应用会以一棵嵌套的组件树的形式来组织，例如，你可能会有页头、侧边栏、内容区等组件，每个组件又包含了其它的像导航链接、博文之类的组件。

为了能在模板中使用，这些组件必须先注册以便 Vue 能够识别。有两种组件的注册类型：

- 全局注册

    - 全局注册通过 `Vue.component` 执行：

        ```js
        Vue.component('my-component-name', {
          // ... options ...
        })
        ```

    - 全局注册的组件可以用在其被注册之后的任何 (通过 `new Vue`) 新创建的 Vue 根实例，也包括其组件树中的所有子组件的模板中。

- 局部注册

### 4.3 通过`props`选项向子组件传递数据

`props` 是在组件上注册的一些自定义 attribute，当一个值传递给一个 `props` attribute 的时候，它就变成了那个组件实例的一个 property。

例如，为了给博文组件传递一个标题，我们可以将其包含在该组件 `props` 选项对应的数组中：

```js
Vue.component('blog-post', {
  props: ['title'],
  template: '<h3>{{ title }}</h3>'
})
```

此时在组件实例中便可以访问通过`props`传递的值，就像访问 `data` 中的值一样。

一个 prop 被注册之后，就可以像这样把数据作为一个自定义 attribute 传递进来：

```html
<blog-post title="My journey with Vue"></blog-post>
<blog-post title="Blogging with Vue"></blog-post>
<blog-post title="Why Vue is so fun"></blog-post>
```

不过，在一个典型的应用中，你可能在 `data` 里有一个博文的数组：

```js
new Vue({
  el: '#blog-post-demo',
  data: {
    posts: [
      { id: 1, title: 'My journey with Vue' },
      { id: 2, title: 'Blogging with Vue' },
      { id: 3, title: 'Why Vue is so fun' }
    ]
  }
})
```

并想要为每篇博文渲染一个组件，此时你会发现我们可以使用 `v-bind` 来动态传递 prop：

```html
<blog-post
  v-for="post in posts"
  v-bind:key="post.id"
  v-bind:title="post.title"
></blog-post>
```

当组件变得越来越复杂的时候，我们的博文不只需要标题和内容，还需要发布日期、评论等等，此时为每个相关的信息定义一个 prop 会变得很麻烦：

```html
<blog-post
  v-for="post in posts"
  v-bind:key="post.id"
  v-bind:title="post.title"
  v-bind:content="post.content"
  v-bind:publishedAt="post.publishedAt"
  v-bind:comments="post.comments"
></blog-post>
```

所以是时候重构一下这个 `<blog-post>` 组件了，让它变成接受一个单独的 `post` prop：

```html
<blog-post
  v-for="post in posts"
  v-bind:key="post.id"
  v-bind:post="post"
></blog-post>
```

```js
Vue.component('blog-post', {
  props: ['post'],
  template: `
    <div class="blog-post">
      <h3>{{ post.title }}</h3>
      <div v-html="post.content"></div>
    </div>
  `
})
```

现在，不论何时为 `post` 对象添加一个新的 property，它都会自动地在 `<blog-post>` 内可用。

### 4.4 监听子组件事件

父级组件可以像处理 native DOM 事件一样通过 `v-on` 监听子组件实例的任意事件：

```html
<blog-post
  ...
  v-on:enlarge-text="postFontSize += 0.1"
></blog-post>
```

同时子组件可以通过调用内建的 [**`$emit`** 方法](https://cn.vuejs.org/v2/api/#vm-emit)并传入事件名称来触发一个事件：

```html
<button v-on:click="$emit('enlarge-text')">
  Enlarge text
</button>
```

有了这个 `v-on:enlarge-text="postFontSize += 0.1"` 监听器，父级组件就会接收该事件并更新 `postFontSize` 的值。

#### 4.4.1 使用事件抛出一个值

有时我们需要用一个事件来抛出一个特定的值。例如我们可能想让 `<blog-post>` 组件决定它的文本要放大多少。这时可以使用 `$emit` 的第二个参数来提供这个值：

```html
<button v-on:click="$emit('enlarge-text', 0.1)">
  Enlarge text
</button>
```

然后当在父级组件监听这个事件的时候，我们可以通过 `$event` 访问到被抛出的这个值：

```html
<blog-post
  ...
  v-on:enlarge-text="postFontSize += $event"
></blog-post>
```

或者，如果这个事件处理函数是一个方法，那么这个值将会作为第一个参数传入这个方法：

```html
<blog-post
  ...
  v-on:enlarge-text="onEnlargeText"
></blog-post>
```

```js
methods: {
  onEnlargeText: function (enlargeAmount) {
    this.postFontSize += enlargeAmount
  }
}
```

#### 4.4.2 在组件上使用`v-model`

对于自定义事件，它也可以用于创建支持`v-model`的“自定义输入组件”。

实际上，

```html
<input v-model="searchText">
```

等价于

```html
<input
  v-bind:value="searchText"
  v-on:input="searchText = $event.target.value"
>
```

当用在组件上时，`v-model` 则会这样：

```html
<custom-input
  v-bind:value="searchText"
  v-on:input="searchText = $event"
></custom-input>
```

为了让这样的组件正常工作，这个组件内的 `<input>` 必须：

- 将其 `value` attribute 绑定到一个名叫 `value` 的 prop 上
- 在其 `input` 事件被触发时，将新的值通过自定义的 `input` 事件抛出

写成代码之后如下：

```html
Vue.component('custom-input', {
  props: ['value'],
  template: `
    <input
      v-bind:value="value"
      v-on:input="$emit('input', $event.target.value)"
    >
  `
})
```

此时 `v-model` 就可以在这个组件上正常运行了：

```html
<custom-input v-model="searchText"></custom-input>
```

### 4.5 插槽：分发内容

插槽是什么东西？

### 4.6 动态组件

有的时候，在不同组件之间进行动态切换是非常有用的，比如在一个多标签的界面里：

<img src="https://chua-n.gitee.io/blog-images/notebooks/JavaWeb/前端/3.png" alt="image-20210925094520351" style="zoom:100%;" />

上述内容可以通过 Vue 的 `<component>` 元素加一个特殊的 `is` attribute 来实现：

```html
<!-- 组件会在 `currentTabComponent` 改变时改变 -->
<component v-bind:is="currentTabComponent"></component>
```

在上述示例中，`currentTabComponent` 可以包括“已注册组件的名字”或“一个组件的选项对象”。

需要注意的是，这个 attribute 也可以用于常规 HTML 元素，但此时这些元素将被视为组件——这意味着所有的 attribute **都会作为 DOM attribute 被绑定**。对于像 `value` 这样的 property，若想让其如预期般工作，你需要使用 [`.prop` 修饰器](https://cn.vuejs.org/v2/api/#v-bind)。

### 4.7 注意事项

有些 HTML 元素对于哪些元素可以出现在其内部是有严格限制的，如 `<ul>`、`<ol>`、`<table>` 和 `<select>`；而有些元素，如 `<li>`、`<tr>` 和 `<option>`，只能出现在其它某些特定的元素内部。这会导致我们使用这些有约束条件的元素时遇到一些问题，例如：

```html
<table>
  <blog-post-row></blog-post-row>
</table>
```

这个自定义组件 `<blog-post-row>` 会被作为无效的内容提升到外部，并导致最终渲染结果出错。

幸好前述特殊的 `is` attribute 给了我们一个变通的办法：

```html
<table>
  <tr is="blog-post-row"></tr>
</table>
```

不过，如果我们从以下来源使用模板的话，这条限制是不存在的：

- 字符串 (例如：`template: '...'`)
- [单文件组件 (`.vue`)](https://cn.vuejs.org/v2/guide/single-file-components.html)
- [`<script type="text/x-template">`](https://cn.vuejs.org/v2/guide/components-edge-cases.html#X-Templates)

