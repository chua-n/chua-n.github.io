## 单元测试简介

单元测试分类：

1. 黑盒测试：不需要写代码，给定输入值，看程序是否能够输出期望的值；

2. 白盒测试：需要写代码，关注程序具体的执行流程。

黑盒测试人员的测试过程基本只需要使用鼠标点点点，是市面上大多数测试人员的现状。

Junit 单元测试是白盒测试的一种手段。

## Junit 使用

Junit 使用步骤：

1. 导入 junit 依赖；

    > Junit5相较于Junit4发生了较大变化，其API及在pom.xml导入的坐标发生改变。
    >
    > 详见 [JUnit 5官网](https://junit.org/junit5/) 及 [JUnit 5 User Guide](https://junit.org/junit5/docs/current/user-guide/#running-tests-build-maven) ，JUni5 可能还需要配置maven插件。

    - JUnit4

        ```xml
        <dependency>
          <groupId>junit</groupId>
          <artifactId>junit</artifactId>
          <version>4.13</version>
          <scope>test</scope>
        </dependency>
        ```

    - JUnit5

        ```xml
        <dependency>
            <groupId>org.junit.jupiter</groupId>
            <artifactId>junit-jupiter-api</artifactId>
            <version>5.7.2</version>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.junit.jupiter</groupId>
            <artifactId>junit-jupiter-engine</artifactId>
            <version>5.7.2</version>
            <scope>test</scope>
        </dependency>
        ```

2. 定义一个测试类（测试用例），建议测试类名为“被测试的类名+Test”，同时包名为 xxx.xxx.xxx.test。

3. 定义测试方法，其可以独立运行。建议方法名命名为“test+测试的方法名”，返回值设定为 void，参数列表定义为空。

4. 给方法加注解@Test。

---

Junit 测试判断结果：根据颜色判断，绿色通过，红色失败，一般会使用断言操作来处理结果。

---

两个特殊的注解：

| 注解    |                             作用                             |
| :------ | :----------------------------------------------------------: |
| @Before |        其修饰的方法会在所有测试方法执行之前被自动执行        |
| @After  | 其修饰的方法会在所有测试方法执行之后自动被执行，无论测试方法内部是否发生异常其都会执行 |

