很多Swing组件都要使用一些相同的特性，包括：

- Action对象
- 边框
- 外观和感觉

## 1. Action

Action接口是对ActionListener接口的一个有用的扩展，它的继承关系为`public interface Action extends ActionListener`。

创建Action对象：

- 通常先要创建一个继承抽象类AbstractAction类的子类，然后再实例化这个子类。
- AbstractAction抽象类提供了Action接口的默认实现，而且还提供了一些获取和设置Action域属性的方法。我们在继承它创建自己需要的子类的时候，只需要通过这些方法。
- 设置需要的属性值。
- 定义actionPerformed方法。

## 2. 边框Border

每个继承自JComponent的Swing组件都可以有若干个边框。边框可以用来：

- 绘制线条
- 为组件提供标题
- 为组件提供周边的空白区域

使用组件的setBorder方法为组件添加边框，该方法需要一个Border类型的对象。

通过可以使用BorderFactory类提供的很多静态方法产生一个常用的Border对象。

如果不能够满足要求，可以直接使用javax.swing.border包里的API来定义自己的边框。

## 3. 设置外观和感觉

前述设置不能影响顶层容器JFrame和JDialog，因为它们是重量级组件，均是依赖于操作系统的，当使用的系统不同，所显示的顶层容器就会有所不同。针对这两个顶层容器，有一个静态方法专门为其设置外观感觉。

`static void setDefaultLookAndFeelDecorated(boolean xxx)`：

- 参数是true时，选用默认的外观感觉
- 参数是false时，选用操作平台的外观感觉

## 4. GUI与线程

在某些情况下应该使用线程：

- GUI界面初始化中有一个很耗时的任务要完成，则可以把该任务放到主线程之外进行；
- 点击一个按钮进入一段事件处理程序中，而这段程序本身很耗时，若该程序不结束，GUI无法响应别的事件。此时可以把这段事件处理程序放到另一个线程中，如后台线程。
- 定期重复执行某项操作。
- 等待从其他程序传来的消息。

