Spring Security 是spring 家庭中的一个安全管理框架，相比于另外一个安全框架Shiro，Spring Security 提供了更丰富的功能，社区资源也更丰富。

一般来说，中大型的项目使用Spring Security来做安全框架，小项目用Shiro的比较多，因为相比于SpringSecurity，Shiro的上手更加简单。

一般Web应用需要进行认证和授权：

- 认证：验收当前访问系统的人是不是本系统的用户，并且要确定具体是哪个用户
- 授权：经过谁后判断当前用户是否有权限进行某个操作

认证和授权也是SpringSecurity作为安全框架的核心功能。

![image-20230131134649111](../../resources/images/notebook/JavaWeb/SpringSecurity/image-20230131134649111.png)