## 1. 顶层容器

顶层容器中JApplet由浏览器提供，因此不需要程序员创建，而另两个JFrame、JDialog需要自行创建。

JDialog对话框存在于java.swing包中，通过使用静态方法showXxxDialog就可以产生4种简单的对话框。

## 2. 中间层容器

### JPanel

是一种经常使用的轻量级中间容器。

在默认状态下，除了背景色外并不绘制任何东西。

可以很容易地为它设置边框和绘图特性，可以把它设置为顶层容器contentPane。有效地利用JPanel可以使版面管理更为容易。

可以使用布局管理器来规则它所容纳组件的位置和大小。

可以通过setLayout方法来改变其布局。

也可以在创建一个JPanel对象时就为它确定某种布局方式。

在默认状态下panel使用FlowLayout布局，将各组件布局在一行。

### JScrollPane

容器有滚动条，可以拖动滑块，就可以看到更多的内容。

滚动条由9个部分组成，包括一个中心显示地带、四个角、四条边。

### JSplitPane

......

### JTabbedPane

......

### JToolBar

......

### JInternalFrame

......

## 3. 原子组件

### JLabel

......

### 按钮类

AbstractButton抽象类是众多按钮来的基类，继承它的类包括：

- JButton
- JToggleButton：表示有两个选择状态的按钮
- CheckBox：多选按钮
- JRadioButton：单元按钮
- JMenultem：在菜单中使用
- JCheckBoxMenultem：多选按钮
- JRadioButtonMenultem：单选按钮
- JMenu：一般的菜单项

### 列表框JList

......

复选框架只需要很少的屏幕区域，而一组JRadioBox, JCheckBox, JList占据的空间比较大。

### 文本组件

### JTextArea

......

### JEditorPane, JTextPane

......

### JColorChooser

......

### JFileChooser

......

### JTable表格

......

### JTree

......

