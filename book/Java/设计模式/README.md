---
title: 设计模式
---

> 本章介绍各类设计模式。

总体来说设计模式分为三大类，共计23种：

- 创建型模式（Creational Patterns）：创建型模式关注点是如何创建对象，其核心思想是要把对象的创建和使用相分离，这样使得两者能相对独立地变换。创建型模式共5种：
    - 工厂模式（Factory Pattern）
    - 抽象工厂模式（Abstract Factory Pattern）
    - 单例模式（Singleton Pattern）
    - 建造者模式（Builder Pattern）
    - 原型模式（Prototype Pattern）
- 结构型模式（Structural Patterns）：结构型模式主要涉及如何组合各种对象，以便获得更好、更灵活的结构。虽然面向对象的继承机制提供了最基本的子类扩展父类的功能，但结构型模式不仅仅简单地使用继承，而更多地通过组合与运行期的动态组合等来实现更灵活的功能。结构型模式共7种：
    - 适配器模式（Adapter Pattern）
    - 装饰器模式（Decorator Pattern）
    - 代理模式（Proxy Pattern）
    - 外观模式（Facade Pattern）
    - 桥接模式（Bridge Pattern）
    - 组合模式（Composite Pattern）
    - 享元模式（Flyweight Pattern）
- 行为型模式（Behavioral Patterns）：行为型模式主要涉及对在不同的对象之间划分责任算法，其关注对象的行为及不同对象之间的交互。行为型模式共11种：
    - 策略模式（Strategy Pattern）
    - 模板模式（Template Pattern）
    - 观察者模式（Observer Pattern）
    - 迭代器模式（Iterator Pattern）
    - 责任链模式（Chain of Responsibility Pattern）
    - 命令模式（Command Pattern）
    - 备忘录模式（Memento Pattern）
    - 状态模式（State Pattern）
    - 访问者模式（Visitor Pattern）
    - 中介者模式（Mediator Pattern）
    - 解释器模式（Interpreter Pattern）

设计模式的六大原则：

1. 开闭原则（Open Close Principle）

    > **对扩展开放，对修改关闭**。
    >
    > 这里的意思是在增加新功能的时候，能不改代码就尽量不要改，如果只增加代码就完成了新功能，那是最好的。

2. 里氏代换原则（Liskov Substitution Principle）

    >  **任何基类可以出现的地方，子类一定可以出现。**
    >
    > 里氏代换原则是面向对象设计的基本原则之一，这也是继承复用的基石，只有当派生类可以替换掉基类，且软件的功能不受到影响时，基类才能真正被复用，同时派生类也能够在基类的基础上增加新的行为。

3. 依赖倒转原则（Dependence Inversion Principle）

    > 针对接口编程，依赖于抽象而不依赖于具体。

4. 接口隔离原则（Interface Segregation Principle）

    > **使用多个隔离的接口，比使用单个接口要好。**
    >
    > 还是一个降低类之间的耦合度的意思。

5. 迪米特法则（Demeter Principle）

    > **又称最少知道原则：一个对象应当对其他对象有尽可能少地了解，简称类间解耦**

6. 合成复用原则（Composite Reuse Principle）

    > **尽量使用对象组合、而不是使用继承来达到软件复用的目的。**

