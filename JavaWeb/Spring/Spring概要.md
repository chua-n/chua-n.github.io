## 1. Spring简介

Spring是分层的Jave  SE/EE应用的全栈的轻量级开源框架，以**IoC**(Inverse of Control，反转控制 )和**AOP**(Aspect Oriented Programming，面向切面编程)为内核。

- 所谓**反转控制**：即可通过Spring提供的IOC容器，可以将对象的依赖关系交由Spring进行控制，避免硬编码所造成的过度耦合。

Spring提供了**展示层SpringMVC**和**持久层pring JDBCTemplate**以及**业务事务管理**等众多的企业级应用技术，还能整合开源世界众多著名的第三方框架和类库，逐渐成为使用最多的Java EE企业应用开源框架。

Spring的优势：

- 方便解耦，简化开发；
- AOP编程的支持；
- 声明式事务的支持；
- 方便程序的测试：方便使用Junit；
- 方便集成各种优秀框架；
- 降低JavaEE API（如JDBC、JavaMail、远程调用等）的使用难度；
- Java 源码是经典学习范例。

## 2. Spring体系结构

![9](https://chua-n.gitee.io/blog-images/notebooks/JavaWeb/Spring/9.png)

## 3. Spring开发步骤

Spring开发的一般步骤：

1. 导入Spring开发的基本包坐标；
2. 创建Bean类；
3. 创建配置文件applicationContext.xml（配置文件叫啥名无所谓，但建议以此为名）；
4. 在配置文件中进行Bean的配置；
5. 创建ApplicationContext对象（Spring的客户端），以getBean方法得到指定的Bean。

---

![10](https://chua-n.gitee.io/blog-images/notebooks/JavaWeb/Spring/10.png)

上述Spring的开发步骤：

1. 导入Spring开发的基本包坐标
2. 编写Dao接口和实现类
3. 创建Spring核心配置文件
4. 在Spring配置文件中配置UserDaoImpl
5. 使用Spring的API创建Bean实例

