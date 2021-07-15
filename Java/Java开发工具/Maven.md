## 1. Maven简介

Maven是Apache下的一个纯Java开发的开源项目，Maven是一个项目管理工具，它包含了一个**项目对象模型(POM, Project     Object Model)**、一组标准集合、一个项目生命周期(project     lifecycle)、一个依赖管理系统(Dependency     Management System)，和用来运行定义在生命周期阶段中插件(plugin)目标的逻辑。

Maven是一个基于Java的工具，所以Maven的使用必须安装有JDK。

---

一个项目往往都要经历编译、测试、运行、打包、安装、部署等一系列过程，这个过程也被称为**项目的构建**，而maven可以使用一个命令一键构建整个工作。

|  Maven命令   |                             作用                             |
| :----------: | :----------------------------------------------------------: |
|  mvn  clean  |          清除项目编译信息（表现为删除target文件夹）          |
| mvn compile  |                编译src/main/java下的java代码                 |
|  mvn  test   | 编译src/test/java，且同时编译了src/main/java（相当于先执行了compile命令） |
| mvn  package |       打包项目，此命令会把compile和test命令都执行一遍        |
| mvn  install | 安装项目到本地仓库，此命令会也相当于会把compile, test, package挨个执行一遍 |
| mvn  deploy  | 发布项目，此命令也相当于把compile, test, package, install, deploy挨个执行一遍 |

- clean：清理生命周期。
- compile,     test, package, install, deploy：默认生命周期，这5个命令每个在执行的时候都会把其前面的命令挨个执行一遍。
- …：站点生命周期（不常用）。

## 2. Maven项目结构

对于一个项目，其构成一般分为4个部分：

- 核心代码部分
- 配置文件部分
- 测试代码部分
- 测试配置文件。

Maven提倡使用一个共同的标准目录结构，其遵循约定优于配置的原则，将项目的目录结构定义为下：

| 目录                                        | 含义                                    |
| ------------------------------------------- | --------------------------------------- |
| ${basedir}                                  | 存放pom.xml配置文件和所有的子目录       |
| ${basedir}/src/main/java                    | 核心代码部分                            |
| ${basedir}/src/main/resources               | 配置文件部分                            |
| ${basedir}/src/test/java                    | 测试代码部分                            |
| ${basedir}/src/test/resources               | 测试配置文件                            |
| ${basedir}/src/main/webapp（适用于web项目） | 页面资源，包含js,  css, 图片等等        |
| ${basedir}/target                           | 打包输出目录                            |
| ${basedir}/target/classes                   | 核心代码编译输出目录                    |
| ${basedir}/target/test-classes              | 测试代码编译输出目录                    |
| Test.java                                   | Maven只会自动运行符合该命名规则的测试类 |
| ~/.m2/repository                            | Maven默认的本地仓库目录位置，可更改     |

## 3. Maven仓库

Maven仓库是项目中依赖的第三方库，这个库所在的位置叫做仓库。

Maven仓库有三种类型：

1. 本地仓库：运行Maven时，其所需要的任何构件都是直接从本地仓库获取的。
2. 远程仓库：开发人员自己定制的仓库，也叫私服。
3. 中央仓库：由Maven社区提供的仓库，其中包含了绝大多数常用的库，需要通过网络才能访问。

若本地仓库没有没有需要的库，它会首先尝试从远程仓库下载构件至本地仓库，然后再使用本地仓库的构件；若远程仓库也没有，则从中央仓库下载；若中内仓库也没有，则报错。（顺序应该没错吧）

### 3.1 修改本地仓库的位置

默认情况下，无论windows或linux，本地仓库均被创建在用户家目录下的.m2/repository/的目录：

> 根据maven安装目录下的conf/settings.xml配置文件，如下说明了本地仓库的配置情况 

```xml
  <!-- localRepository
   | The path to the local repository maven will use to store artifacts.
   |
   | Default: ${user.home}/.m2/repository
  <localRepository>/path/to/local/repo</localRepository>
  -->
```

修改本地仓库的目录：因为默认位置常常在C盘，不太好。在上述配置文件中添加如下语句即可：

```xml
<localRepository>D:\maven\repository</localRepository>
```

### 3.2 添加并使用阿里云的中央仓库源：

Maven仓库默认在国外，国内使用难免很慢，可以更换为阿里云的仓库。

1. 修改maven安装目录下的conf/settings.xml配置文件，在mirrors节点上，添加以下内容：

    ```xml
    		    <mirror>
    		      <id>alimaven</id>
    		      <name>aliyun maven</name>
    		      <url>http://maven.aliyun.com/nexus/content/groups/public/</url>
    		      <mirrorOf>central</mirrorOf>
    		    </mirror>
    ```

    

2. 在maven项目的pom.xml文件里添加如下内容:

    ```xml
    		<repositories>
    		    <repository>
    		        <id>alimaven</id>
    		        <name>aliyun maven</name>
    		        <url>http://maven.aliyun.com/nexus/content/groups/public/</url>
    		        <releases>
    		            <enabled>true</enabled>
    		        </releases>
    		        <snapshots>
    		            <enabled>false</enabled>
    		        </snapshots>
    		    </repository>
    		</repositories>
    ```

## 4. Maven概念模型

![Maven概念模型](https://chua-n.gitee.io/blog-images/notebooks/Java/Maven概念模型.png)

项目对象模型：

- 项目自身信息
- 项目运行所依赖的jar包信息
- 项目运行环境信息，如jdk, tomcat信息

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <groupId>org.example</groupId>
    <artifactId>mybatisFirstDemo</artifactId>
    <version>1.0-SNAPSHOT</version>
    <packaging>jar</packaging>
```

---

依赖管理模型：

- 公司/组织的名称：groupId
- 项目名称：artifactId
- 版本号：version

```xml
<dependency>
    <groupId>org.mybatis</groupId>
    <artifactId>mybatis</artifactId>
    <version>3.5.5</version>
</dependency>
```

---

默认生命周期：

- compile
- test
- package
- install
- deploy

> 每一个构建项目的命令都对应了Maven底层的一个插件。

## 5. pom.xml

