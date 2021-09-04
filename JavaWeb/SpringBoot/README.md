> 本章是关于SpringBoot的笔记内容。

这里介绍两个开发小工具。

## 1. lombok

### 坐标：

```xml
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
</dependency>
```

> 在IDEA中使用lombok时还需要安装安装lombok插件，不过IDEA已经默认集成了。？

### 作用

lombok是一个插件工具类包，其提供了一些注解去简化实体类中的构造方法、get/set方法等的编写。

| 注解    | 作用                                                      |
| ------- | --------------------------------------------------------- |
| @Data   | 自动提供getter,  setter, hashCode, equals, toString等方法 |
| @Getter | 自动提供getter方法                                        |
| @Setter | 自动提供setter方法                                        |
| @Slf4j  | 自动在Bean中提供log变量，使用slf4j的日志功能。            |

如上所述，使用lombok提供的注解可以大大简化POJO类的编写。

- POJO类

    ```java
    package com.itheima;
    
    import lombok.Data;
    
    @Data
    public class Person {
        private String name;
        private int age;
    }
    ```

- 测试类

    ```java
    package com.itheima;
    
    public class TestPerson {
        public static void main(String[] args) {
            Person person = new Person();
            person.setName("chuan");
            person.setAge(25);
            // 正常输出
            System.out.println(person.getName());
            System.out.println(person.getAge());
        }
    }
    ```

## 2. dev-tools

dev-tools工具可实现springboot的热部署，只要在pom.xml中添加一个功能坐标即可：

```xml
<!-- 热部署配置 -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-devtools</artifactId>
</dependency>
```

> 项目或者页面修改以后：Ctrl+F9（需要吗？）

默认配置下，针对`/static`、`/public`和`/templates`目录中的文件修改，不会自动重启，因为禁用缓存后，这些文件的修改可以实时更新。

