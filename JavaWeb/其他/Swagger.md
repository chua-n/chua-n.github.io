> 本篇笔记写得不好，但似乎也没有必要......

## 1. 背景：前后端分离

在后端时代，前端只用管理静态页面。

- HTML -> 后端
- 模板引擎、JSP -> 后端是主力

前后端分离时代：

- 后端：后端控制层、服务层、数据访问层，后端团队
- 前端：前端控制层、视图层，前端团队
    - 前端通过伪造后端数据（json），能够不需要后端即将整个前端工程运行起来
- 前后端相对独立、松耦合，甚至可以部署在不同的服务器上

那么在前后端分离时代前后端如何进行交互？答案是API。

Swagger号称世界上最流行的API框架，其有如下特点：

- RestFul Api 文档在线自动生成，因而Api文档与Api定义是同步更新的
- 直接运行，可以在线测试Api接口
- 支持多种语言（Java, Php, ...）

## 2. Swagger简介及使用步骤

官网：https://swagger.io/ 。

Maven坐标：有两个，分别是`springfox-swagger2`, `springfox-swagger-ui`。

快速入门——SpringBoot集成Swagger：

1. 新建一个SpringBoot Web项目

2. 导入相关依赖

    ```xml
    <!-- https://mvnrepository.com/artifact/io.springfox/springfox-swagger2 -->
    <dependency>
        <groupId>io.springfox</groupId>
        <artifactId>springfox-swagger2</artifactId>
        <version>2.9.2</version>
    </dependency>
    <!-- https://mvnrepository.com/artifact/io.springfox/springfox-swagger-ui -->
    <dependency>
        <groupId>io.springfox</groupId>
        <artifactId>springfox-swagger-ui</artifactId>
        <version>2.9.2</version>
    </dependency>
    ```

3. 编写一个Hello工程

4. 配置Swagger：通过Config配置类

    ```java
    /**
     * 配置一些介绍信息。
     */
    @Configuration
    @EnableSwagger2
    public class SwaggerConfig {
        // 配置了Swagger的Docket的bean实例
        @Bean
        public Docket docket() {
            return new Docket(DocumentationType.SWAGGER_2).apiInfo(apiInfo());
        }
        
        // 配置Swagger信息
        private ApiInfo apiInfo() {
            // 作者信息
            Contact contact = new Contact("徐川", "https://www.chua-n.com/", "chua_n@qq.com");
            return new ApiInfo(
                "荒流的SwaggerAPI文档",
                "合抱之木，生于毫末",
                "v1.0",
                "https://www.chua-n.com/",
                contact,
                "Apache 2.0",
                "http://www.apache.org/licenses/LICENSE-2.0",
                new ArrayList()
            );
        }
    }
    ```

只要Swagger扫描包下接口的返回值中存在实体类，它就会被生成到Swagger Api文档中：

```java
@PostMapping(value = "/user")
public User user() {
    return new User();
}

@ApiOperation("Post测试类") // Swagger注解
@PostMapping(value = "/post")
public User post(@ApiParam("用户名") User user) { // Swagger注解
    // ...
    reutnr user;
}
```

在实际使用时，通过Swagger给一些比较难理解的属性/接口增加注释信息，生产的接口文档可以实时更新，并且在线测试。

## 3. Swagger配置

### 3.1 配置要扫描的接口

```java
@Configuration
@EnableSwagger2
public class SwaggerConfig {
    // 配置了Swagger的Docket的bean实例
    @Bean
    public Docket docket() {
        return new Docket(DocumentationType.SWAGGER_2)
            .apiInfo(apiInfo()).select()
            // RequestHandlerSelectors：配置要扫描接口的方式
            // basePackage: 指定要扫描的包
            // any(): 扫描全部
            // none(): 不扫描
            // withClassAnnotation: 扫描类上的注解，参数是一个注解的反射对象
            // withMethodAnnotation: 扫描方法上的注解
            .apis(RequestHandlerSelectors.basePackage("com.chuan.swagger.controller"))
			// paths(...)：过滤什么路径
            .paths(PathSelectors.ant("/chuan/**"))
            .build();
    }

    private ApiInfo apiInfo(){
        // ...
    }
}
```

### 3.2 配置Swagger只在开发环境生效

```java
@Configuration
@EnableSwagger2
public class SwaggerConfig {
    // 配置了Swagger的Docket的bean实例
    @Bean
    public Docket docket(Environment environment) {
        // 设置要显示Swagger的环境
        Profiles profiles = Profiles.of("dev", "test");
        // 通过environment.acceptsProfiles判断是否处在期望的环境中
        boolean flag = environment.acceptsProfiles(profiles);
        return new Docket(DocumentationType.SWAGGER_2)
            .apiInfo(apiInfo())
            .enable(flag) // 为false时不生成SwaggerApi文档
            .select()
            .apis(RequestHandlerSelectors.basePackage("com.chuan.swagger.controller"))
            .build();
    }

    private ApiInfo apiInfo(){
        // ...
    }
}
```

