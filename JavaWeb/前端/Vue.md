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

    - 局部注册通过一个普通的js对象来定义组件

        ```js
        var ComponentA = { /* ... */ }
        var ComponentB = { /* ... */ }
        var ComponentC = { /* ... */ }
        
        new Vue({
          el: '#app',
          components: {
            'component-a': ComponentA,
            'component-b': ComponentB
          }
        })
        ```

        > 对于 `components` 对象中的每个 property 来说，其 property 名就是自定义元素的名字，其 property 值就是这个组件的选项对象。

    - 局部注册的组件在子组件（意即非根组件？）中不可用

        > 例如，如果你希望 `ComponentA` 在 `ComponentB` 中可用，则你需要这样写：
        >
        > ```js
        > var ComponentA = { /* ... */ }
        > 
        > var ComponentB = {
        >   components: {
        >     'component-a': ComponentA
        >   },
        >   // ...
        > }
        > ```

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

#### 4.3.1 prop的大小写

HTML 中的 attribute 名是大小写不敏感的，所以浏览器会把所有大写字符解释为小写字符。这意味着当你在 DOM 中使用模板时，camelCase (驼峰命名法) 的 prop 名需要使用其等价的 kebab-case (短横线分隔命名) 命名：

```js
Vue.component('blog-post', {
  // 在 JavaScript 中是 camelCase 的
  props: ['postTitle'],
  template: '<h3>{{ postTitle }}</h3>'
})
```

```html
<!-- 在 HTML 中是 kebab-case 的 -->
<blog-post post-title="hello!"></blog-post>
```

#### 4.3.2 prop的类型

通常你还希望每个 prop 都有指定的值类型，这时便可以以对象形式列出 prop，这些 property 的名称和值分别是 prop 各自的名称和类型：

```js
props: {
  title: String,
  likes: Number,
  isPublished: Boolean,
  commentIds: Array,
  author: Object,
  callback: Function,
  contactsPromise: Promise // or any other constructor
}
```

这样不仅为你的组件提供了文档，还会在它们遇到错误的类型时从浏览器的 JavaScript 控制台提示用户。

#### 4.3.3 给prop传值

静态与动态传值：

- 静态传值：传过去的是字符串

    ```html
    <blog-post title="My journey with Vue"></blog-post>
    ```

- 动态赋值——通过 `v-bind` ：传过去的是js表达式

    ```html
    <!-- 动态赋予一个变量的值 -->
    <blog-post v-bind:title="post.title"></blog-post>
    
    <!-- 动态赋予一个复杂表达式的值 -->
    <blog-post
      v-bind:title="post.title + ' by ' + post.author.name"
    ></blog-post>
    ```

需要强调的是，给props传值时，通过静态传值，传过去的实际是一个字符串；而通过动态传值，虽然也使用了引号，但传过去的实际是js表达式。比如：

```html
<!-- 即便 `42` 是静态的，使用 `v-bind` 告诉了 Vue 这是一个 js 表达式而不是一个字符串 -->
<blog-post v-bind:likes="42"></blog-post>

<!-- 即便 `false` 是静态的，使用 `v-bind` 告诉了 Vue 这是一个 js 表达式而不是一个字符串 -->
<blog-post v-bind:is-published="false"></blog-post>
```

当prop是布尔类型时，只要该prop出现在html标签内但没有显式赋值，都意味着其值为true。

```html
<!-- 该 prop 没有值时，意味着 `true` -->
<blog-post is-published></blog-post>
```

当要传入一个对象的所有property时，可以使用不带参数的`v-bind`。例如，对于一个给定的对象 `post`：

```js
post: {
  id: 1,
  title: 'My Journey with Vue'
}
```

下面的模板：

```html
<blog-post v-bind="post"></blog-post>
```

等价于：

```html
<blog-post
  v-bind:id="post.id"
  v-bind:title="post.title"
></blog-post>
```

#### 4.3.4 prop的单向数据流

所有的 prop 都会在其父子 prop 之间形成一个**单向下行绑定**：父级 prop 的更新会向下流动到子组件中，但是反过来则不行。

这样的设计可能防止在子组件中意外变更父级组件的状态，从而导致应用的数据流向难以理解。此外，如果你在一个子组件内部改变引用的父组件的 prop，Vue 会在浏览器的控制台中发出警告。

对于以下两种场景：

- 使用 prop 传递一个初始值，子组件接下来希望将其作为一个本地的 prop 数据来使用。此时最好定义一个本地的 data property 并将这个 prop 用作其初始值：

    ```js
    props: ['initialCounter'],
    data: function () {
      return {
        counter: this.initialCounter
      }
    }
    ```

- 这个 prop 以一种原始的值传入且需要进行转换。此时最好使用这个 prop 的值来定义一个计算属性：

    ```js
    props: ['size'],
    computed: {
      normalizedSize: function () {
        return this.size.trim().toLowerCase()
      }
    }
    ```

#### 4.3.5 prop验证

 prop 的传值还可以进行更深层次的验证，例如：

```js
Vue.component('my-component', {
  props: {
    // 基础的类型检查 (`null` 和 `undefined` 会通过任何类型验证)
    propA: Number,
      
    // 多个可能的类型
    propB: [String, Number],
      
    // 必填的字符串
    propC: {
      type: String,
      required: true
    },
      
    // 带有默认值的数字
    propD: {
      type: Number,
      default: 100
    },
      
    // 带有默认值的对象
    propE: {
      type: Object,
      // 对象或数组默认值必须从一个工厂函数获取
      default: function () {
        return { message: 'hello' }
      }
    },
      
    // 自定义验证函数
    propF: {
      validator: function (value) {
        // 这个值必须匹配下列字符串中的一个
        return ['success', 'warning', 'danger'].indexOf(value) !== -1
      }
    }
  }
})
```

当 prop 验证失败的时候，(开发环境构建版本的) Vue 将会产生一个控制台的警告。

对于上述的type字段，它可以是

- 原生构造函数：

    - `String`
    - `Number`
    - `Boolean`
    - `Array`
    - `Object`
    - `Date`
    - `Function`
    - `Symbol`

- 自定义的构造函数：

    如，给定下列现成的构造函数：

    ```js
    function Person (firstName, lastName) {
      this.firstName = firstName
      this.lastName = lastName
    }
    ```

    你可以使用下述来验证 `author` prop 的值是否是通过 `new Person` 创建的：

    ```js
    Vue.component('blog-post', {
      props: {
        author: Person
      }
    })
    ```

#### 4.3.6 非prop的attribue？

......这说的什么玩意啊，官方文档也太烂了吧......

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

```js
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

#### 4.5.1 定义

Vue将`<slot>`元素作为承载分发内容的出口。

比如，这里是一个 `<navigation-link>` 模板：

```js
Vue.component('navigation-link', {
  // ...
  template: `
    <a
      v-bind:href="url"
      class="nav-link"
    >
      <slot></slot>
    </a>
  `
})
```

该模板在使用时，允许你像这样合成组件——当组件渲染时`<slot></slot>` 会被替换为“Your Profile”：

```html
<navigation-link url="/profile">
  Your Profile
</navigation-link>
```

> 如果 `<navigation-link>` 的 `template` 中没有包含一个 `<slot>` 元素，则该组件起始标签和结束标签之间的任何内容都会被抛弃。

实际上，除文本外，插槽内可以包含任何模板代码，即：

- 文本
- HTML
- 其他组件

#### 4.5.2 插槽默认值

对于一个含插槽的组件，在`<slot></slot>`闭合标签内设置的内容会在该组件不含内容时作为默认值自动渲染出来：

例如在一个 `<submit-button>` 组件中：

```html
<button type="submit">
  <slot></slot>
</button>
```

我们可能希望这个 `<button>` 内绝大多数情况下都渲染文本“Submit”，于是可以将它放在 `<slot>` 标签内：

```html
<button type="submit">
  <slot>Submit</slot>
</button>
```

此后当在一个父级组件中使用 `<submit-button>` 并且不提供任何插槽内容时：

```html
<submit-button></submit-button>
```

默认值“Submit”将会被自动渲染，该组件相当于：

```html
<button type="submit">
  Submit
</button>
```

#### 4.5.3 具名插槽

`<slot>` 元素有一个`name`属性，该属性可以用来定义具名插槽。例如：

```html
<div class="container">
  <header>
    <slot name="header"></slot>
  </header>
  <main>
    <slot></slot>
  </main>
  <footer>
    <slot name="footer"></slot>
  </footer>
</div>
```

> 不带 `name` 的 `<slot>` 出口拥有默认名“default”。

要向具名插槽提供内容，需要在一个 `<template>` 元素上使用 `v-slot` 指令，并以 `v-slot` 的参数的形式提供其名称：

```html
<base-layout>
  <template v-slot:header>
    <h1>Here might be a page title</h1>
  </template>

  <!-- 这些没有被包裹在带有`v-slot`的`<template>`中的内容都会被视为默认插槽的内容 -->
  <p>A paragraph for the main content.</p>
  <p>And another one.</p>

  <template v-slot:footer>
    <p>Here's some contact info</p>
  </template>
</base-layout>
```

当然，如果希望对默认插槽使用更明确的表示，可以使用`v-slot:default`：

```html
<base-layout>
  <template v-slot:header>
    <h1>Here might be a page title</h1>
  </template>

  <template v-slot:default>
    <p>A paragraph for the main content.</p>
    <p>And another one.</p>
  </template>

  <template v-slot:footer>
    <p>Here's some contact info</p>
  </template>
</base-layout>
```

上面两种写法都会渲染出以下内容：

```html
<div class="container">
  <header>
    <h1>Here might be a page title</h1>
  </header>
  <main>
    <p>A paragraph for the main content.</p>
    <p>And another one.</p>
  </main>
  <footer>
    <p>Here's some contact info</p>
  </footer>
</div>
```

> 注意， `v-slot` 只能添加在 `<template>` 上 (只有[一种例外情况](https://cn.vuejs.org/v2/guide/components-slots.html#独占默认插槽的缩写语法))。

#### 4.5.4 插槽的作用域

插槽跟模板的其它地方一样可以访问相同的实例 property ，但不能访问 `<navigation-link>` 的作用域。例如上述的 `url` 在插槽中是访问不到的：

```html
<navigation-link url="/profile">
  Logged in as {{ user.name }}
  Clicking here will send you to: {{ url }}
  <!--
  这里的 `url` 会是 undefined，因为其 (指该插槽的) 内容是
  _传递给_ <navigation-link> 的而不是
  在 <navigation-link> 组件内部定义的。
  -->
</navigation-link>
```

> 父级模板里的所有内容都是在父级作用域中编译的；子模板里的所有内容都是在子作用域中编译的。

如果确实需要让插槽的内容能够访问组件中的数据，可以将该数据作为`<slot>`元素的一个属性绑定上去，此时该属性被称为**插槽prop**。比如，对于一个 `<current-user>` 组件：

```js
Vue.component('current-user', {
  // ...
  template: `
    <span>
      <slot>{{ user.lastName }}</slot>
    </span>
  `
})
```

如果不使用模板的默认值，即希望使用firstName时，下述代码并不会正常工作，因为只有 `<current-user>` 组件可以访问到 `user`，而我们提供的内容是在父级渲染的：

```html
<current-user>
  {{ user.firstName }}
</current-user>
```

为了让 `user` 在父级的插槽内容中可用，可以将 `user` 作为 `<slot>` 元素的一个 attribute 绑定上去：

```html
<span>
  <slot v-bind:user="user">
    {{ user.lastName }}
  </slot>
</span>
```

如此一来我们便可以使用带值的 `v-slot` 来定义一个插槽 prop 的名字——比如下例中将包含所有插槽 prop 的对象命名为 `slotProps`：

```html
<current-user>
  <template v-slot:default="slotProps">
    {{ slotProps.user.firstName }}
  </template>
</current-user>
```

##### 简写

当只有默认插槽时（如上例），可以把表示插槽prop的`v-slot`直接用在组件上：

```html
<current-user v-slot:default="slotProps">
  {{ slotProps.user.firstName }}
</current-user>
```

上面的default可以进一步省略——不带参数的 `v-slot` 被假定对应默认插槽：

```html
<current-user v-slot="slotProps">
  {{ slotProps.user.firstName }}
</current-user>
```

---

注意默认插槽的缩写语法**不能**和具名插槽混用，这会导致作用域不明确：

```html
<!-- 无效，会导致警告 -->
<current-user v-slot="slotProps">
  {{ slotProps.user.firstName }}
  <template v-slot:other="otherSlotProps">
    slotProps is NOT available here
  </template>
</current-user>
```

因此，只要出现多个插槽，应该始终为所有的插槽使用完整的基于 `<template>` 的语法：

```html
<current-user>
  <template v-slot:default="slotProps">
    {{ slotProps.user.firstName }}
  </template>

  <template v-slot:other="otherSlotProps">
    ...
  </template>
</current-user>
```

#### 4.5.5 插槽prop的原理（说的什么玩意儿......）

插槽prop的内部原理是将你的插槽内容包裹在一个拥有单个参数的函数里：

```js
function (slotProps) {
  // 插槽内容
}
```

这意味着 `v-slot` 的值实际上可以是任何能够作为函数定义中的参数的 js 表达式。

所以在支持的环境下 ([单文件组件](https://cn.vuejs.org/v2/guide/single-file-components.html)或[现代浏览器](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#浏览器兼容))也可以使用 [ES2015 解构](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#解构对象)来传入具体的插槽 prop，如下：

```html
<current-user v-slot="{ user }">
  {{ user.firstName }}
</current-user>
```

这可以使模板更简洁，尤其是在该插槽提供了多个 prop 的时候。它同样开启了 prop 重命名等其它可能，比如将 `user` 重命名为 `person`：

```html
<current-user v-slot="{ user: person }">
  {{ person.firstName }}
</current-user>
```

你甚至可以定义默认内容用于插槽 prop 是 undefined 的情形：

```html
<current-user v-slot="{ user = { firstName: 'Guest' } }">
  {{ user.firstName }}
</current-user>
```

#### 4.5.6 其他

##### 动态插槽名

[动态指令参数](https://cn.vuejs.org/v2/guide/syntax.html#动态参数)也可以用在 `v-slot` 上，来定义动态的插槽名：

```html
<base-layout>
  <template v-slot:[dynamicSlotName]>
    ...
  </template>
</base-layout>
```

##### 具名插槽的缩写

跟 `v-on` 和 `v-bind` 一样，`v-slot` 也有缩写，即把参数之前的所有内容 (`v-slot:`) 替换为字符 `#`。

例如 `v-slot:header` 可以被重写为 `#header`：

```html
<base-layout>
  <template #header>
    <h1>Here might be a page title</h1>
  </template>

  <p>A paragraph for the main content.</p>
  <p>And another one.</p>

  <template #footer>
    <p>Here's some contact info</p>
  </template>
</base-layout>
```

此外，和其它指令一样，该缩写只在其有参数的时候才可用，因此以下语法是无效的：

```html
<!-- 这样会触发一个警告 -->
<current-user #="{ user }">
  {{ user.firstName }}
</current-user>
```

##### 花样用法

插槽 prop 允许我们将插槽转换为可复用的模板，这些模板可以基于输入的 prop 渲染出不同的内容。

这在设计封装数据逻辑同时允许父级组件自定义部分布局的可复用组件时是最有用的，例如，我们要实现一个 `<todo-list>` 组件，它是一个列表且包含布局和过滤逻辑：

```html
<ul>
  <li
    v-for="todo in filteredTodos"
    v-bind:key="todo.id"
  >
    {{ todo.text }}
  </li>
</ul>
```

我们可以将每个 todo 作为父级组件的插槽，以此通过父级组件对其进行控制，然后将 `todo` 作为一个插槽 prop 进行绑定：

```html
<ul>
  <li
    v-for="todo in filteredTodos"
    v-bind:key="todo.id"
  >
    <!--
    我们为每个 todo 准备了一个插槽，
    将 `todo` 对象作为一个插槽的 prop 传入。
    -->
    <slot name="todo" v-bind:todo="todo">
      <!-- 后备内容 -->
      {{ todo.text }}
    </slot>
  </li>
</ul>
```

现在当我们使用 `<todo-list>` 组件的时候，我们可以选择为 todo 定义一个不一样的 `<template>` 作为替代方案，并且可以从子组件获取数据：

```html
<todo-list v-bind:todos="todos">
  <template v-slot:todo="{ todo }">
    <span v-if="todo.isComplete">✓</span>
    {{ todo.text }}
  </template>
</todo-list>
```

这只是作用域插槽用武之地的冰山一角，想了解更多现实生活中的作用域插槽的用法，我们推荐浏览诸如 [Vue Virtual Scroller](https://github.com/Akryum/vue-virtual-scroller)、[Vue Promised](https://github.com/posva/vue-promised) 和 [Portal Vue](https://github.com/LinusBorg/portal-vue) 等库。

### 4.6 动态组件

有的时候，在不同组件之间进行动态切换是非常有用的，比如在一个多标签的界面里：

<img src="https://chua-n.gitee.io/blog-images/notebooks/JavaWeb/前端/3.png" alt="image-20210925094520351" style="zoom:100%;" />

上述内容可以通过 Vue 的 `<component>` 元素加一个特殊的 `is` attribute 来实现：

```html
<!-- 组件会在 `currentTabComponent` 改变时改变 -->
<component v-bind:is="currentTabComponent"></component>
<!-- `currentTabComponent` 可以包括“已注册组件的名字”或“一个组件的选项对象”。 -->
```

需要注意的是，这个 attribute 也可以用于常规 HTML 元素，但此时这些元素将被视为组件——这意味着所有的 attribute **都会作为 DOM attribute 被绑定**。对于像 `value` 这样的 property，若想让其如预期般工作，你需要使用 [`.prop` 修饰器](https://cn.vuejs.org/v2/api/#v-bind)。

默认情况下，在这些组件之间切换时，新标签会重新渲染——Vue创建了一个新的`currentTabComponent`实例，如果希望这些标签的组件实例能够在它们第一次被创建的时候就缓存下来，可以用一个`<keep-alive>`元素将动态组件包裹起来：

```html
<!-- 失活的组件将会被缓存！-->
<keep-alive>
  <component v-bind:is="currentTabComponent"></component>
</keep-alive>
```

> 注意这个 `<keep-alive>` 要求被切换到的组件都有自己的名字，不论是通过组件的 `name` 选项还是局部/全局注册。

### 4.7 异步组件

在大型应用中，我们可能需要将应用分割成小一些的代码块，并且只在需要的时候才从服务器加载一个模块。为应对这种场景，Vue 允许你以一个工厂函数的方式定义组件，该工厂函数在解析你的组件定义时会异步执行，Vue 只有在这个组件需要被渲染的时候才会触发该工厂函数，且会把结果缓存起来供未来重渲染。

例如，下面的示例中工厂函数会收到一个 `resolve` 回调，这个回调函数会在你从服务器得到组件定义的时候被调用（你也可以调用 `reject(reason)` 来表示加载失败）：

```js
Vue.component('async-example', function (resolve, reject) {
  setTimeout(function () {
    // 向 `resolve` 回调传递组件定义
    resolve({
      template: '<div>I am async!</div>'
    })
  }, 1000)
})
```

上面的 `setTimeout` 是为了演示用的，如何获取组件取决于程序员，一个推荐的做法是将异步组件和 webpack 的 code-splitting 功能一起配合使用：

```js
Vue.component('async-webpack-example', function (resolve) {
  // 这个特殊的 `require` 语法将会告诉 webpack
  // 自动将你的构建代码切割成多个包，这些包
  // 会通过 Ajax 请求加载
  require(['./my-async-component'], resolve)
})
```

此外，你也可以在工厂函数中返回一个 `Promise`。因而把 webpack 2 和 ES2015 语法加在一起的话，可以这样使用动态导入：

```js
Vue.component(
  'async-webpack-example',
  // 这个动态导入会返回一个 `Promise` 对象。
  () => import('./my-async-component')
)
```

> 当使用[局部注册](https://cn.vuejs.org/v2/guide/components-registration.html#局部注册)的时候，你也可以直接提供一个返回 `Promise` 的函数：
>
> ```js
> new Vue({
>   // ...
>   components: {
>     'my-component': () => import('./my-async-component')
>   }
> })
> ```

### 4.8 注意事项

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

## 5. 组件

当直接在 DOM 中使用一个组件 (而不是在字符串模板或[单文件组件](https://cn.vuejs.org/v2/guide/single-file-components.html)) 的时候，我们强烈推荐遵循 [W3C 规范](https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name)中的自定义组件名 (字母全小写且必须包含一个连字符)。这会帮助你避免和当前以及未来的 HTML 元素相冲突。

定义组件名的方式有两种：

- 短横线——当使用 kebab-case (短横线分隔命名) 定义一个组件时，引用该元素时必须也使用 kebab-case，例如 `<my-component-name>`。

    ```js
    Vue.component('my-component-name', { /* ... */ })
    ```

- 驼峰法（首字母大写）——当使用 PascalCase (首字母大写命名) 定义一个组件时，引用该元素时两种命名法都可以使用。

    ```js
    Vue.component('MyComponentName', { /* ... */ })
    ```

    > `<my-component-name>` 和 `<MyComponentName>` 都可以使用。
    >
    > 不过，直接在 DOM (即非字符串的模板) 中使用时只有 kebab-case 是有效的。

### 5.1 模块系统

通过 `import`/`require` 可以使用一个模块系统。

#### 局部注册

往往我们推荐创建一个`components`目录，并将每个组件放置在其各自的文件中，然后在局部注册之前通过import语句导入每个你想使用的组件。

例如，在一个`ComponentC.js`或`ComponentC.vue`文件中：

```js
import ComponentA from './ComponentA'
import ComponentB from './ComponentB'

export default {
  components: {
    ComponentA,
    ComponentB
  },
  // ...
}
```

此时 `ComponentA` 和 `ComponentB` 便可以在 `ComponentC` 的模板中使用了。

#### 全局注册

有些组件会被各个组件频繁地使用，它们有时被称为“基础组件”，因此为了方便，可能通过webpack的`require.context`方法对组件进行全局注册。

比如，以下在`src/main.js`这样的应用入口文件中全局导入基础组件：

```js
import Vue from 'vue'
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'

const requireComponent = require.context(
  // 其组件目录的相对路径
  './components',
    
  // 是否查询其子目录
  false,
    
  // 匹配基础组件文件名的正则表达式
  /Base[A-Z]\w+\.(vue|js)$/
)

requireComponent.keys().forEach(fileName => {
  // 获取组件配置
  const componentConfig = requireComponent(fileName)

  // 获取组件的 PascalCase 命名
  const componentName = upperFirst(
    camelCase(
      // 获取和目录深度无关的文件名
      fileName
        .split('/')
        .pop()
        .replace(/\.\w+$/, '')
    )
  )

  // 全局注册组件
  Vue.component(
    componentName,
    // 如果这个组件选项是通过 `export default` 导出的，
    // 那么就会优先使用 `.default`，
    // 否则回退到使用模块的根。
    componentConfig.default || componentConfig
  )
})
```

> 记住全局注册的行为必须在根 Vue 实例 (通过 `new Vue`) 创建之前发生。

### 5.2 组件的`v-model`

一个组件上的 `v-model` 默认会利用该组件名为 `value` 的 prop 和名为 `input` 的事件，但是像单选框、复选框等类型的输入控件可能会将 `value` attribute 用于[不同的目的](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox#Value)。`model` 选项可以用来避免这样的冲突：

```js
Vue.component('base-checkbox', {
  model: {
    prop: 'checked',
    event: 'change'
  },
  props: {
    checked: Boolean
  },
  template: `
    <input
      type="checkbox"
      v-bind:checked="checked"
      v-on:change="$emit('change', $event.target.checked)"
    >
  `
})
```

现在在这个组件上使用 `v-model` 的时候：

```html
<base-checkbox v-model="lovingVue"></base-checkbox>
```

这里的 `lovingVue` 的值将会传入这个名为 `checked` 的 prop，同时当 `<base-checkbox>` 触发一个 `change` 事件并附带一个新的值的时候，这个 `lovingVue` 的 property 将会被更新。

> 注意你仍然需要在组件的 `props` 选项里声明 `checked` 这个 prop。

### 5.3 事件

#### 5.3.1 自定义事件的命名

对于自定义事件，始终推荐使用 kebab-case 的事件名。

> 不同于组件和 prop，事件名不会被用作一个 JavaScript 变量名或 property 名，所以就没有理由使用 camelCase 或 PascalCase 了。并且 `v-on` 事件监听器在 DOM 模板中会被自动转换为全小写 (因为 HTML 是大小写不敏感的)，所以 `v-on:myEvent` 将会变成 `v-on:myevent`——导致 `myEvent` 不可能被监听到。

#### 5.3.2 `$listeners`属性

当需要在一个组件的根元素上直接监听一个原生事件时，你当然可以使用 `v-on` 的 `.native` 修饰符：

```html
<base-input v-on:focus.native="onFocus"></base-input>
```

此时，当监听的是一个类似 `<input>` 的非常特定的元素时，实际情况可能并不如意。比如上述 `<base-input>` 组件可能做了如下重构——根元素实际上是一个 `<label>` 元素：

```html
<label>
  {{ label }}
  <input
    v-bind="$attrs"
    v-bind:value="value"
    v-on:input="$emit('input', $event.target.value)"
  >
</label>
```

这种情况下父级的 `.native` 监听器将静默失败——它不会产生任何报错，但是 `onFocus` 处理函数不会被调用。

为了解决这个问题，Vue 提供了一个 `$listeners` property，它是一个对象，里面包含了作用在这个组件上的所有监听器，即：

```js
{
  focus: function (event) { /* ... */ }
  input: function (value) { /* ... */ },
}
```

有了`$listeners`，就可以配合 `v-on="$listeners"` 将所有的事件监听器指向这个组件的某个特定的子元素。

比如，对于类似 `<input>` 、希望它可以配合 `v-model` 来工作的组件来说，为这些监听器创建一个类似下述 `inputListeners` 的计算属性通常是非常有用的：

```js
Vue.component('base-input', {
  inheritAttrs: false,
  props: ['label', 'value'],
  computed: {
    inputListeners: function () {
      var vm = this
      // `Object.assign` 将所有的对象合并为一个新对象
      return Object.assign({},
        // 我们从父级添加所有的监听器
        this.$listeners,
        // 然后我们添加自定义监听器，
        // 或覆写一些监听器的行为
        {
          // 这里确保组件配合 `v-model` 的工作
          input: function (event) {
            vm.$emit('input', event.target.value)
          }
        }
      )
    }
  },
  template: `
    <label>
      {{ label }}
      <input
        v-bind="$attrs"
        v-bind:value="value"
        v-on="inputListeners"
      >
    </label>
  `
})
```

这样 `<base-input>` 组件是一个**完全透明的包裹器**了，也就是说它可以完全像一个普通的 `<input>` 元素一样来使用：所有跟它相同的 attribute 和监听器都可以工作，不必再使用 `.native` 监听器。

#### 5.3.4 `.sync`修饰符

在有些情况下，我们可能需要对一个 prop 进行“双向绑定”，通常推荐以 `update:myPropName` 的模式触发事件来实现。举个例子，在一个包含 `title` prop 的假设的组件中，我们可以用以下方法表达对其赋新值的意图：

```js
this.$emit('update:title', newTitle)
```

然后父组件可以监听那个事件并根据需要更新一个本地的数据 property，比如：

```html
<text-document
  v-bind:title="doc.title"
  v-on:update:title="doc.title = $event"
></text-document>
```

故而，为了方便起见，我们为这种模式提供一个缩写，即 `.sync` 修饰符：

```html
<text-document v-bind:title.sync="doc.title"></text-document>
```

当我们用一个对象同时设置多个 prop 的时候，也可以将这个 `.sync` 修饰符和 `v-bind` 配合使用：

```
<text-document v-bind.sync="doc"></text-document>
```

这样会把 `doc` 对象中的每一个 property (如 `title`) 都作为一个独立的 prop 传进去，然后各自添加用于更新的 `v-on` 监听器。

> 注意：
>
> - 带有 `.sync` 修饰符的 `v-bind` **不能**和表达式一起使用 (例如 `v-bind:title.sync=”doc.title + ‘!’”` 是无效的)。取而代之的是，你只能提供你想要绑定的 property 名，类似 `v-model`。
> - 将 `v-bind.sync` 用在一个字面量的对象上，例如 `v-bind.sync=”{ title: doc.title }”`，是无法正常工作的，因为在解析一个像这样的复杂表达式的时候，有很多边缘情况需要考虑。

### 5.4 访问元素/组件

> 在绝大多数情况下，我们最好不要触达另一个组件实例内部或手动操作 DOM 元素，不过也确实在一些情况下做这些事情是合适的。

#### 5.4.1 访问根实例：`$root`

在每个 `new Vue` 实例的子组件中，其根实例可以通过 `$root` property 进行访问。例如，对于一个根实例

```js
// Vue 根实例
new Vue({
  data: {
    foo: 1
  },
  computed: {
    bar: function () { /* ... */ }
  },
  methods: {
    baz: function () { /* ... */ }
  }
})
```

所有的子组件都可以将这个实例作为一个全局 store 来访问或使用：

```js
// 获取根组件的数据
this.$root.foo

// 写入根组件的数据
this.$root.foo = 2

// 访问根组件的计算属性
this.$root.bar

// 调用根组件的方法
this.$root.baz()
```

> 注：对于 demo 或非常小型的有少量组件的应用来说这是很方便的。不过这个模式扩展到中大型应用来说就不然了。因此在绝大多数情况下，我们强烈推荐使用 [Vuex](https://github.com/vuejs/vuex) 来管理应用的状态。

#### 5.4.2 访问父实例：`$parent`

和 `$root` 类似，`$parent` property 可以用来从一个子组件访问父组件的实例。`$parent`提供了一种可以在后期随时触达父级组件的机会，以替代将数据以 prop 的方式传入子组件的方式。

> 在绝大多数情况下，触达父级组件会使得你的应用更难调试和理解，尤其是当你变更了父级组件的数据的时候——当我们稍后回看那个组件时，很难找出那个变更是从哪里发起的。

另外在一些可能适当的时候，你需要特别地共享一些组件库。举个例子，在和 JavaScript API 进行交互而不渲染 HTML 的抽象组件内，诸如这些假设性的 Google 地图组件：

```html
<google-map>
  <google-map-markers v-bind:places="iceCreamShops"></google-map-markers>
</google-map>
```

这个 `<google-map>` 组件可以定义一个 `map` property，所有的子组件都需要访问它。在这种情况下 `<google-map-markers>` 可能想要通过类似 `this.$parent.getMap` 的方式访问那个地图，以便为其添加一组标记。

请留意，尽管如此，通过这种模式构建出来的那个组件的内部仍然是容易出现问题的。比如，设想一下我们添加一个新的 `<google-map-region>` 组件，当 `<google-map-markers>` 在其内部出现的时候，只会渲染那个区域内的标记：

```html
<google-map>
  <google-map-region v-bind:shape="cityBoundaries">
    <google-map-markers v-bind:places="iceCreamShops"></google-map-markers>
  </google-map-region>
</google-map>
```

那么在 `<google-map-markers>` 内部你可能发现自己需要一些类似这样的 hack：

```js
var map = this.$parent.map || this.$parent.$parent.map
```

很快它就会失控。这也是我们针对需要向任意更深层级的组件提供上下文信息时推荐[依赖注入](https://cn.vuejs.org/v2/guide/components-edge-cases.html#依赖注入)的原因。

#### 5.4.3 访问子组件实例/子元素：`$ref`

尽管存在 prop 和事件，有的时候你可能仍需要在 js 里直接访问一个子组件。为了达到这个目的，你可以通过 `ref` 这个 attribute 为子组件赋予一个 ID 引用。例如：

```html
<base-input ref="usernameInput"></base-input>
```

现在，在你已经定义了这个 `ref` 的组件里，你可以使用：

```js
this.$refs.usernameInput
```

来访问这个 `<base-input>` 实例，以便不时之需。

---

示例：比如程序化地从一个父级组件聚焦这个输入框。在刚才那个例子中，该 `<base-input>` 组件也可以使用一个类似的 `ref` 提供对内部这个指定元素的访问，例如：

```html
<input ref="input">
```

甚至可以通过其父级组件定义方法：

```js
methods: {
  // 用来从父级组件聚焦输入框
  focus: function () {
    this.$refs.input.focus()
  }
}
```

这样就允许父级组件通过下面的代码聚焦 `<base-input>` 里的输入框：

```js
this.$refs.usernameInput.focus()
```

---

当 `ref` 和 `v-for` 一起使用的时候，你得到的 ref 将会是一个包含了对应数据源的这些子组件的数组。

`$refs` 只会在组件渲染完成之后生效，并且它们不是响应式的。这仅作为一个用于直接操作子组件的“逃生舱”——你应该避免在模板或计算属性中访问 `$refs`。

#### 5.4.4 依赖注入

使用 `$parent` 无法很好地扩展到更深层级的父级嵌套组件上，这便是依赖注入的用武之地了。依赖注入用到了两个新的实例选项：`provide` 和 `inject`。

- `provide` 选项允许我们指定我们想要**提供**给后代组件的数据/方法。

-  `inject` 选项用于在后代组件里接收指定的 property：

    ```js
    inject: ['getMap']
    ```

比如，之前在我们描述[访问父级组件实例](https://cn.vuejs.org/v2/guide/components-edge-cases.html#访问父级组件实例)的时候，展示过一个类似这样的例子：

```html
<google-map>
  <google-map-region v-bind:shape="cityBoundaries">
    <google-map-markers v-bind:places="iceCreamShops"></google-map-markers>
  </google-map-region>
</google-map>
```

在这个组件里，所有 `<google-map>` 的后代都需要访问一个 `getMap` 方法，以便知道要跟哪个地图进行交互。此时`provide`和`inject`分别如下：

```js
provide: function () {
  return {
    getMap: this.getMap
  }
}
```

```
inject: ['getMap']
```

> 相比 `$parent` 来说，这个用法可以让我们在*任意*后代组件中访问 `getMap`，而不需要暴露整个 `<google-map>` 实例。这允许我们更好的持续研发该组件，而不需要担心我们可能会改变/移除一些子组件依赖的东西。同时这些组件之间的接口是始终明确定义的，就和 `props` 一样。

不过，依赖注入还是有负面影响的：

- 它将你应用程序中的组件与它们当前的组织方式耦合起来，使重构变得更加困难。

- 同时所提供的 property 是非响应式的。

    > 这是出于设计的考虑，因为使用它们来创建一个中心化规模化的数据跟[使用 `$root`](https://cn.vuejs.org/v2/guide/components-edge-cases.html#访问根实例)做这件事都是不够好的。如果你想要共享的这个 property 是你的应用特有的，而不是通用化的，或者如果你想在祖先组件中更新所提供的数据，那么这意味着你可能需要换用一个像 [Vuex](https://github.com/vuejs/vuex) 这样真正的状态管理方案了。

### 5.5 组件的循环引用

#### 5.5.1 递归组件

组件是可以在它们自己的模板中调用自身的，不过它们只能通过 `name` 选项来做这件事：

```js
name: 'unique-name-of-my-component'
```

当使用 `Vue.component` 全局注册一个组件时，这个全局的 ID 会自动设置为该组件的 `name` 选项：

```js
Vue.component('unique-name-of-my-component', {
  // ...
})
```

稍有不慎，递归组件就可能导致无限循环：

```js
name: 'stack-overflow',
template: '<div><stack-overflow></stack-overflow></div>'
```

类似上述的组件将会导致“max stack size exceeded”错误，所以请确保递归调用是条件性的 (例如使用一个最终会得到 `false` 的 `v-if`)。

#### 5.5.2 组件之间的循环引用

......好像没必要单独记录

