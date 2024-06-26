---
title: SpringBoot 配置
---

## 1. 读取配置：@ConfigurationProperties

### 1.1 @ConfigurationProperties

> 无须多言，`@Value`和`@ConfigurationProperties`在使用的时候，相应的类必须首先是一个 Spring 的 Bean。

在程序中需要获取 yml/properties 配置文件中的值时，当然可以使用 Spring 原生的`@Value`注解（其平常主要用来修饰字段类型），此外，SpringBoot 还提供了一个`@ConfigurationProperties`注解，可以用来修饰类类型，因而可以很方便地将多个配置项批量注入到一个类中：

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

> - 松散绑定：如 yml 中写的`last-name`，这个和`lastName`是一样的，`-`后面跟着的字母默认是大写的，这就是松散绑定；
> - JSR303 数据校验（挺简单的），即可以对字段增加一层过滤器验证，保证数据的合法性；
> - 复杂类型：yml 中可以封装对象，这种情况下使用`@Value`无法支持。

在使用过程中，`@Value`和`@ConfigurationProperties`的应用场景可以概述如下：

- 如果在某个业务中只需要获取配置文件中的某个值，可以使用一下`@Value`；
- 如果专门编写了一个 JavaBean 来和配置文件进行映射，最好使用`@ConfigurationProperties`。

### 1.2 @EnableConfigurationProperties

如上所述，在使用`@ConfigurationProperties`注解时，往往需要和`@Component`注解结合起来。而`@EnableConfigurationProperties`注解存在的意义，是避免`@Component`的使用，从而 Spring 在检测到某个类被`@ConfigurationProperties`修饰时，可以直接向其注入相应的配置值。

也就是说，`@ConfigurationProperties`的使用有两种方式：

- `@ConfigurationProperties` + `@Component`
- `@ConfigurationProperties` + `@EnableConfigurationProperties`

`@EnableConfigurationProperties`的源码定义为：

```java
package org.springframework.boot.context.properties;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Import(EnableConfigurationPropertiesRegistrar.class)
public @interface EnableConfigurationProperties {

   /**
    * The bean name of the configuration properties validator.
    * @since 2.2.0
    */
   String VALIDATOR_BEAN_NAME = "configurationPropertiesValidator";

   /**
    * Convenient way to quickly register
    * {@link ConfigurationProperties @ConfigurationProperties} annotated beans with
    * Spring. Standard Spring Beans will also be scanned regardless of this value.
    * @return {@code @ConfigurationProperties} annotated beans to register
    */
   Class<?>[] value() default {};

}
```

## 2. @ConditionalOnXxx

springboot 的 `org.springframework.boot.autoconfigure.condition` 包中提供了一系列衍生自 spring 的`@Conditional`注解的`@ConditionalOnXxx`注解：

|               注解                |   对应的`Condition`实现类   | 作用                                                         |
| :-------------------------------: | :-------------------------: | ------------------------------------------------------------ |
|       `@ConditionalOnBean`        |      `OnBeanCondition`      | spring 容器中包含对应的 Bean 时配置生效                         |
|       `@ConditionalOnClass`       |     `OnClassCondition`      | 类加载器中存在对应的类时配置生效                             |
|    `@ConditionalOnMissingBean`    |      `OnBeanCondition`      | spring 容器中缺少对应的 Bean 时配置生效，与@ConditionalOnBean 反义 |
|   `@ConditionalOnMissingClass`    |     `OnClassCondition`      | 类加载器中缺少对应的类时配置生效，与@ConditionalOnClass 反义  |
|  `@ConditionalOnSingleCandidate`  |      `OnBeanCondition`      | spring 容器中存在且只存在一个对应的 Bean 时生效                 |
|     `@ConditionalOnResource`      |    `OnResourceCondition`    | 存在指定的资源文件时生效                                     |
|     `@ConditionalOnProperty`      |    `OnPropertyCondition`    |                                                              |
|  `@ConditionalOnWebApplication`   | `OnWebApplicationCondition` |                                                              |
| `@ConditionalOnNotWebApplication` | `OnWebApplicationCondition` |                                                              |
|                ...                |             ...             | ......                                                       |

## 3. @AutoConfiguration

TODO

## 4. @AutoConfigureBefore/After/Order

> 参考链接：[使用@AutoConfigureBefore、After、Order 调整 Spring Boot 自动配置顺序](https://www.cnblogs.com/zimug/p/13264814.html)

|          注解          | 作用                                          |
| :--------------------: | --------------------------------------------- |
| `@AutoConfigureBefore` | 在指定的`@AutoConfiguration`之前加载          |
| `@AutoConfigureAfter`  | 在指定的`@AutoConfiguration`之后加载          |
| `@AutoConfigureOrder`  | 指定该`@AutoConfiguration`的加载顺序，默认值 0 |
