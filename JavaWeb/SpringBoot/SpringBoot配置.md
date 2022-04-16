## 1. 概述

SpringBoot 是基于约定的，所以很多配置都有默认值，但如果想使用自己的配置替换默认配置的话，就可以使用 application.properties 或者 application.yml 进行配置。

SpringBoot 默认会从 Resources 目录下加载 application.properties 或 application.yml 文件，优先级：properties > yaml > yml。

配置文件与配置类的属性映射：使用`@Value`或使用`@ConfigurationProperties`。

|                      | `@ConfigurationProperties` |    `@Value`    |
| :------------------: | :------------------------: | :------------: |
|         功能         |  批量注入配置文件中的属性  | 一个一个地指定 |
| 松散绑定（松散语法） |            支持            |     不支持     |
|         SpEL         |           不支持           |      支持      |
|   JSR303 数据校验    |            支持            |     不支持     |
|     复杂类型封装     |            支持            |     不支持     |

> 注释：
>
> - 松散绑定：如yml中写的last-name，这个和lastName是一样的，- 后面跟着的字母默认是大写的，这就是松散绑定；
> - JSR303数据校验（挺简单的），即可以对字段增加一层过滤器验证，保证数据的合法性；
> - 复杂类型：yml中可以封装对象，使用@Value就不支持。
>
> 结论：
>
> - 配置yml和配置properties都可以获取到值，强烈推荐yml；
> - 如果在某个业务中只需要获取配置文件中的某个值，可以使用一下@Value；
> - 如果专门编写了一个JavaBean来和配置文件进行映射，最好使用@ConfigurationProperties。

yml配置文件还可以编写占位符生成随机数：

```yaml
person:
    name: qinjiang${random.uuid} # 随机uuid
    age: ${random.int} # 随机int
    happy: false
    birth: 2000/01/01
    maps: { k1: v1, k2: v2 }
    lists:
        - code
        - girl
        - music
    dog:
        name: ${person.hello:other}_旺财
        age: 1
```

## 2. 多配置文件

在编写主配置文件时，文件名可以是`application-{profile}.properties/yml`，用来指定多个环境版本，只需通过一个配置来选择需要激活的环境。

对于properties文件：

- 如，多个环境如下：
    -  application-test.properties：代表测试环境配置  
    -   application-dev.properties：代表开发环境配置
- Springboot不会直接启动这些配置文件，它默认使用application.properties主配置文件，当需要使用某个环境时就直接application.properties中激活：`spring.profiles.active=dev`

对于yml文件，同properties，但是不需要创建多个配置文件，可以使用yaml的多文档块功能，更加方便了（不过只在配置量少的时候推荐这种使用）：

```yml
server:
    port: 8081
#选择要激活的环境块
spring:
    profiles:
        active: test
---
server:
    port: 8082
spring:
    profiles: dev # 配置环境的名称
---
server:
    port: 8083
spring:
    profiles: test # 配置环境的名称
```

> 注：如果yml和properties同时都配置了某一项内容（如端口），并且没有激活其他环境，默认会使用properties文件的配置。

## 3. 配置文件的加载路径

springboot配置文件的加载位置：springboot启动会扫描以下位置的application.properties/yml文件作为springboot的默认配置文件，优先级从高到低，高优先级的配置会覆盖低优先级的配置，不过springboot会从这四个位置全部加载主配置文件进行配置互补：

1. 项目路径下的config/文件夹的配置；
2. 项目路径下的配置文件；
3. 资源路径下的config/文件夹的配置；
4. 资源路径下的配置文件；

## 4. 智能提示小插件

可以添加一个依赖使编写springboot配置文件的时候，对自己的类（非springboot官方配置）也能开启智能提示：

```xml
<!--@ConfigurationProperties注解的执行器配置-->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-configuration-processor</artifactId>
    <optional>true</optional>
</dependency>
```

