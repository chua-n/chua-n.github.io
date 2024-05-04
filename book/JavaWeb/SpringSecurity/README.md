---
title: SpringSecurity
---

> 就是 Spring Security 啊。

## Spring Security Oauth 项目已废弃

### 项目文档和代码仓库被移除

Spring Security 团队已停止维护 Spring Security OAuth。旧的 Spring Security OAuth 项目终止到 **2.5.2.RELEASE** 版本，该项目将不会再进行任何的迭代。目前该项目的官方文档已经正式从 spring.io 移除，文档已经指向 404，这是连文档也没有了。新增了 OAuth2 授权服务器 Spring Authorization Server 的文档。不仅仅文档被移除，连项目的仓库也被迁移到 Spring 的过期项目仓库`spring-attic`并被标记为 read-only。Spring Security OAuth 的 Spring Boot 自动配置代码仓库也一并被迁移，也就是说 Spring Boot 相关的自动配置也被移除。

### 废弃的依赖项

以下清单中的依赖，其任何版本都是过期的，都需要迁移：

```xml
        <dependency>		
                <groupId>org.springframework.security.oauth</groupId>
                <artifactId>spring-security-oauth-parent</artifactId>
        </dependency>
        <dependency>		
                <groupId>org.springframework.security.oauth</groupId>
                <artifactId>spring-security-oauth</artifactId>
        </dependency>
        <dependency>		
                <groupId>org.springframework.security.oauth</groupId>
                <artifactId>spring-security-oauth2</artifactId>
        </dependency>
        <dependency>
		 	<groupId>org.springframework.security</groupId>
	        <artifactId>spring-security-jwt</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.security.oauth.boot</groupId>
            <artifactId>spring-security-oauth2-autoconfigure</artifactId>
        </dependency>
```

### 新的 OAuth2 替代方案

Spring Security 5 中集成了 OAuth2 Client 和 Resource Server 两个模块。如果有迁移的需要，建议迁移至最新的 Spring Security 5.7.x，方便向 Spring 6 过渡。以 Spring Boot 为例，首先要集成 Spring Security：

```xml
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
```

集成 OAuth2 Client 依赖（OAuth2 Client 依赖于 Spring Security，不能单独使用）：

```xml
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-oauth2-client</artifactId>
        </dependency>
```

集成 Resource Server 依赖（Resource Server 同样也依赖于 Spring Security，不能单独使用）：

```xml
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-oauth2-resource-server</artifactId>
        </dependency>
```