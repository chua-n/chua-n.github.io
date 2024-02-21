---
title: SpringBoot
---

> 本章是关于SpringBoot的笔记内容。

这里介绍一个开发小工具。

## dev-tools

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

