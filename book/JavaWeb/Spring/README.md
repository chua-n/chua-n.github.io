---
title: Spring
date: 2020-11-08
---

> 本章介绍Spring框架。

### TODO

- 自动织入和注解`@Autowired`的区别？`@Autowired`也不需要构造方法啊

    [Field injection is not recommended（Spring团队不推荐使用Field注入）](https://blog.csdn.net/Li_Ya_Fei/article/details/104448398)

- Arbitary Method Injection

    - 实现原理？
    - 实现`MethodReplacer`接口时，方法体中不能调用`m.invoke(o, args)`，会产生递归而导致栈溢出。
    - 无法通过反射获取一些字段？
    - 无法通过注解配置来实现？

- Lifecycle与生命周期回调的关系及执行先后顺序？

- Environment Abstraction 具体理解

- ScopeMetadataResolver 作用是？

- InjectionPoint是个啥？

- CGLib动态代理是咋回事，这不是能实现AOP的自我嵌套调用吗？

- 与AOP无关的、额外的关于Java类继承的机制问题：方法覆盖是怎样一回事？——覆盖父类方法后，为什么不走 @Beta 的 @within 切面了？

- 向下深入

- 多容器

### Spring简介

Spring是分层的Jave  SE/EE应用的全栈的轻量级开源框架，以<font size=5>**IoC**(Inverse of Control，控制反转 )</font>和<font size=5>**AOP**(Aspect Oriented Programming，面向切面编程)</font>为内核。

> 所谓**控制反转**：即可通过Spring提供的IOC容器，可以将对象的依赖关系交由Spring进行控制，避免硬编码所造成的过度耦合。故而控制反转的一个重要特性是依赖注入。

Spring提供了**展示层SpringMVC**和**持久层Spring JDBCTemplate**以及**业务事务管理**等众多的企业级应用技术，还能整合开源世界众多著名的第三方框架和类库，逐渐成为使用最多的Java EE企业应用开源框架。

Spring的优势：

- 方便解耦，简化开发；
- AOP编程的支持；
- 声明式事务的支持；
- 方便程序的测试：方便使用Junit；
- 方便集成各种优秀框架；
- 降低JavaEE API（如JDBC、JavaMail、远程调用等）的使用难度；
- Java 源码是经典学习范例。

### Spring体系结构

![9](https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/Spring/9.png)

The following diagram shows a high-level view of how Spring works. Your application classes are
combined with configuration metadata so that, after the ApplicationContext is created and
initialized, you have a fully configured and executable system or application.

![image-20220509232513242](https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/Spring/image-20220509232513242.png)

### Spring开发步骤

Spring开发的一般步骤：

1. 导入Spring开发的基本包坐标；
2. 创建Bean类；
3. 创建配置文件applicationContext.xml（配置文件叫啥名无所谓，但建议以此为名）；
4. 在配置文件中进行Bean的配置；
5. 创建ApplicationContext对象（Spring的客户端），以getBean方法得到指定的Bean。

<img src="https://chua-n.gitee.io/figure-bed/notebook/JavaWeb/Spring/10.png" alt="10" style="zoom:50%;" />
