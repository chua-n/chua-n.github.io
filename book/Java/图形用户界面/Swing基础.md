---
title: Swing基础
---

前面介绍了如何在屏幕上绘制普通的图形，但如果要绘制一个按钮，并使其可以对点击事件作出响应，就需要使用java Swing提供的组件。

其实前面我们已经用到的JFrame、JApplet、JLable都是Swing组件，它们分别代表窗口组件和Applet容器组件。

## 1. Swing与JFC、AWT

### 1.1 JFC与Swing

JFC是Java Foundation Classes（Java基础类）的缩写，是关于GUI组件和服务的完整集合。

作为J2SE的一个部分，JFC主要包含4个部分：

- AWT
- Java2D
- Accessibility
- Drag & Drop
- Swing

Swing是JFC的一部分，其提供按钮、窗口、表格等所需要的组件，是纯Java组件。

### 1.2 Swing与AWT

早期版本的AWT组件：

- 在java.awt包里，包括Button、Checkbox、Scrollbar等，都是Component类的子类
- 大部分含有native code，所以随操作系统平台的不会显示出不同的样子，而不能进行更改，是重量组组件
- 没有弹性、缺乏效率

较新的Swing组件：

- Java1.2推出，架构在AWG之上，是AWT的扩展而不是取代
- 其名称都是在原来AWT组件名称前加上J，例如JButton、JCheckBox、JScrollbar等，都是JComponent类的子类
- 完全由java语言编写，其外观和功能不依赖于任何由宿主平台的窗口系统所提供的代码，是轻量级组件
- 可提供更丰富的视觉感受，被越来越多地使用

## 2. 在Applet和Application中应用Swing

在Applet中应用Swing，就是要将Swing组件加载到Applet容器上（通常是JApplet），这通常在init方法中完成。

在Application中应用Swing，也是要将Swing组件加载到这个Application的顶层容器（通常是JFrame）中。

```java
package com.chuan.servlet.web;

import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

public class SwingApplication {
    public static void main(String[] args) {
        JFrame jFrame = new JFrame("Simple Swing Application");
        Container contentPane = jFrame.getContentPane();
        contentPane.setLayout(new GridLayout(2, 1));
        JButton button = new JButton("Click me");
        final JLabel label = new JLabel();
        contentPane.add(button);
        contentPane.add(label);
        button.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                String information = JOptionPane.showInputDialog("请输入一串字符");
                label.setText(information);
            }
        });
        jFrame.setSize(200, 100);
        jFrame.show();
        jFrame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
    }
}
```

<img src="https://chua-n.gitee.io/figure-bed/notebook/Java/20210722182318356.png" alt="20210722182318356" style="zoom:67%;" />

<img src="https://chua-n.gitee.io/figure-bed/notebook/Java/20210722182318356.png" alt="20210722182318356" style="zoom:67%;" />

<img src="https://chua-n.gitee.io/figure-bed/notebook/Java/image-20210722182352158.png" alt="image-20210722182352158" style="zoom:67%;" />

## 3. Swing组件的体系结构

绝大多数Swing组件的继承层次：

- java.lang.Object
    - java.awt.Component
        - java.awt.Container
            - javax.swing.JComponent

Component类：

- 包含paint、repaint方法，可以在屏幕上绘制组件
- 大多数GUI组件直接或间接扩展Component

Container类：

- 容纳相关组件
- 包括add方法，用来添加组件
- 包括setLayout方法，这个方法可用来设置布局，以帮助Container对象对其中的组件进行定位和设置组件大小

JComponent类——多数Swing组件的基类

- 可抽换的外观和感觉，即可根据需求定制外观和感觉
- 快捷键（通过键盘直接访问GUI组件）
- 一般的事件处理功能

## 4. Swing组件的容器层次

通常将javax.swing包里的Swing组件归为三个层次：

1. 顶层容器
2. 中间层容器
3. 原子组件

### 4.1 顶层容器

含有：

- JFrame：实现单个主窗口
- JDialog：实现一个二级窗口（对话框）
- JApplet：在浏览器窗口中实现一个applet显示区域

顶层容器必须和操作系统打交道，所以都是重量级组件。从继承结构上来看，它们分别是从原来AWT组件的Frame、Dialog、Applet继承而为。

每个使用Swing组件的JAVA程序都必须至少有一个顶层容器，别的组件都必须放在这个顶层容器之上才能显示出来。

### 4.2 中间层容器

中间层容器存在的目的仅仅是为了容纳别的组件，其分为两类：

- 一般用途的
    - JPanel
    - JScrollPane
    - JSplitPane
    - JTabbedPane
    - JToolBar
- 特殊用途的
    - JInternalFrame
    - JRootPane

中间层容器的JRootPane对象比较特殊，它由好几个部分构成，可以直接从顶层容器中获得，而其他对象需要新建。

### 4.3 原子组件

原子组件通常是在图形用户界面中和用户进行交互的组件，其基本功能是和用户交互信息，而不像前两种组件那样是用来容纳别的组件的。

根据功能的不同，原子组件可被分为三类：

- 显示不可编辑信息的：JLabel、JProgressBar、JToolTip
- 有控制功能、可以用来输入信息的：JButtion、JCheckBox、JRadioButton、JComboBox、JList、JMenu、JSlider、JSpinner、JTexComponent等
- 能提供格式化的信息并允许用户选择的：JColorChooser、JFileChooser、JTable、JTree

## 5. Swing组件的布局管理

如何将下级组件有序地摆在上一级容器中需要使用布局管理器（Interface LayoutManager）。

调用容器对象的`setLayout`方法，并以布局管理器对象为参数，例如：

```java
Container contentPane = frame.getContentPane();
contentPane.setLayout(new FlowLayout());
```

使用布局管理器可以更容易地进行布局，而且当改变窗口大小时，它还会自动更新版面来配合窗口的大小，不需要担心版面会因此混乱。

在Java中有很多实现`LayoutManager`接口的类，经常用到的有：

- `BorderLayout`：可以将组件放置到五个区域：东、西、南、北、中。上一节提到的内容面板（content pane）默认使用的即是BorderLayout。
- `FlowLayout`：JPanel默认使用的布局管理器，它只是简单地把组件放在一行，如果容器不是足够宽来容纳所有组件，就会自动开始新的一行。
- `GridLayout`：按照其构造方法中程序员提供的行数和列数将界面分为等大的若干块，组件被等大地按加载顺序放置其中。
- `CardLayout`：可以实现在一个区域不同的组件布局，就像在一套卡片中选取其中的任意一张一样。它经常由一个复选框控制这个区域显示哪一组组件，可通过组合框像选择卡片一样选择某一种布局。
- `GridBagLayout`：把组件放置在网格中，这一点类似于GridLayout，但它的优点在于不仅能设置组件摆放的位置，还能设置该组件占多少行/列，这是一种非常灵活的布局管理器。
- `BoxLayout`：将组件放在单一的行或列中，和FlowLayout不同的是，它可以考虑到组件的对齐方式，最大、最小、优选尺寸
- `SpringLayout`：是一种灵活的布局管理器，它能够精确指定组件之间的间距。组件之间的距离通过Spring类的对象来表示，每个spring有4个属性：最小值、最大值、优选值、实际值。每个组件的spring对象集合在一起就构成了SpringLayout.Constraints对象。

