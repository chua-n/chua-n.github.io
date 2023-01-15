## 1. 读取配置：`@ConfigurationProperties`

在程序中需要获取yml/properties配置文件中的值时，当然可以使用Spring原生的`@Value`注解（其平常主要用来修饰字段类型），此外，SpringBoot还提供了一个`@ConfigurationProperties`注解，可以用来修饰类类型，因而可以很方便地将多个配置项批量注入到一个类中：

```java
package org.springframework.boot.context.properties;

@Target({ElementType.TYPE, ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Indexed
public @interface ConfigurationProperties {
    @AliasFor("prefix")
    String value() default "";

    @AliasFor("value")
    String prefix() default "";

    boolean ignoreInvalidFields() default false;

    boolean ignoreUnknownFields() default true;
}
```

|                      |    `@Value`    | `@ConfigurationProperties` |
| :------------------: | :------------: | :------------------------: |
|         功能         | 一个一个地指定 |  批量注入配置文件中的属性  |
| 松散绑定（松散语法） |     不支持     |            支持            |
|         SpEL         |      支持      |           不支持           |
|   JSR303 数据校验    |     不支持     |            支持            |
|     复杂类型封装     |     不支持     |            支持            |

> - 松散绑定：如yml中写的`last-name`，这个和`lastName`是一样的，`-`后面跟着的字母默认是大写的，这就是松散绑定；
> - JSR303数据校验（挺简单的），即可以对字段增加一层过滤器验证，保证数据的合法性；
> - 复杂类型：yml中可以封装对象，这种情况下使用`@Value`无法支持。

在使用过程中，`@Value`和`@ConfigurationProperties`的应用场景可以概述如下：

- 如果在某个业务中只需要获取配置文件中的某个值，可以使用一下`@Value`；
- 如果专门编写了一个JavaBean来和配置文件进行映射，最好使用`@ConfigurationProperties`。

## 2. @ConditionalOnXxx

springboot 的 `org.springframework.boot.autoconfigure.condition` 包中提供了一系列衍生自spring的`@Conditional`注解的`@ConditionalOnXxx`注解：

|               注解                |   对应的`Condition`实现类   | 作用                                                         |
| :-------------------------------: | :-------------------------: | ------------------------------------------------------------ |
|       `@ConditionalOnBean`        |      `OnBeanCondition`      | spring容器中包含对应的Bean时配置生效                         |
|       `@ConditionalOnClass`       |     `OnClassCondition`      | 类加载器中存在对应的类时配置生效                             |
|    `@ConditionalOnMissingBean`    |      `OnBeanCondition`      | spring容器中缺少对应的Bean时配置生效，与@ConditionalOnBean反义 |
|   `@ConditionalOnMissingClass`    |     `OnClassCondition`      | 类加载器中缺少对应的类时配置生效，与@ConditionalOnClass反义  |
|  `@ConditionalOnSingleCandidate`  |      `OnBeanCondition`      | spring容器中存在且只存在一个对应的Bean时生效                 |
|     `@ConditionalOnResource`      |    `OnResourceCondition`    | 存在指定的资源文件时生效                                     |
|     `@ConditionalOnProperty`      |    `OnPropertyCondition`    |                                                              |
|  `@ConditionalOnWebApplication`   | `OnWebApplicationCondition` |                                                              |
| `@ConditionalOnNotWebApplication` | `OnWebApplicationCondition` |                                                              |
|                ...                |             ...             | ......                                                       |

## 3. @AutoConfiguration

TODO

## 4. @AutoConfigureBefore/After/Order

|          注解          | 作用                                          |
| :--------------------: | --------------------------------------------- |
| `@AutoConfigureBefore` | 在指定的`@AutoConfiguration`之前加载          |
| `@AutoConfigureAfter`  | 在指定的`@AutoConfiguration`之后加载          |
| `@AutoConfigureOrder`  | 指定该`@AutoConfiguration`的加载顺序，默认值0 |

