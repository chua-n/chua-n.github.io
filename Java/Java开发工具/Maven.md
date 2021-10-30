> 一个比较好的参考链接[Maven 入门笔记 | 小丁的个人博客 (tding.top)](https://tding.top/archives/4736a5f5.html)

## 1. Maven简介

Maven是Apache下的一个纯Java开发的开源项目，Maven是一个项目管理工具，它包含了一个 **项目对象模型(POM, Project Object Model)** 、一组标准集合、一个项目生命周期(project lifecycle)、一个依赖管理系统(Dependency Management System)，和用来运行定义在生命周期阶段中插件(plugin)目标的逻辑。

Maven是一个基于Java的工具，所以Maven的使用必须安装有JDK。

---

一个项目往往都要经历编译、测试、运行、打包、安装、部署等一系列过程，这个过程也被称为**项目的构建**，而maven可以使用一个命令一键构建整个工作。

|  Maven命令  |                             作用                             |
| :---------: | :----------------------------------------------------------: |
|  mvn clean  |          清除项目编译信息（表现为删除target文件夹）          |
| mvn compile |                编译src/main/java下的java代码                 |
|  mvn test   | 编译src/test/java，且同时编译了src/main/java（相当于先执行了compile命令） |
| mvn package |       打包项目，此命令会把compile和test命令都执行一遍        |
| mvn install | 安装项目到本地仓库，此命令会也相当于会把compile, test, package挨个执行一遍 |
| mvn deploy  | 发布项目，此命令也相当于把compile, test, package, install, deploy挨个执行一遍 |

- clean：清理生命周期。
- compile, test, package, install, deploy：默认生命周期，这5个命令每个在执行的时候都会把其前面的命令挨个执行一遍。
- …：站点生命周期（不常用）。

## 2. Maven项目结构

对于一个项目，其构成一般分为4个部分：

- 核心代码部分
- 配置文件部分
- 测试代码部分
- 测试配置文件。

Maven提倡使用一个共同的标准目录结构，其遵循约定优于配置的原则，将项目的目录结构定义为下：

| 目录                                          | 含义                                    |
| --------------------------------------------- | --------------------------------------- |
| `${basedir}`                                  | 存放pom.xml配置文件和所有的子目录       |
| `${basedir}/src/main/java`                    | 核心代码部分                            |
| `${basedir}/src/main/resources`               | 配置文件部分                            |
| `${basedir}/src/test/java`                    | 测试代码部分                            |
| `${basedir}/src/test/resources`               | 测试配置文件                            |
| `${basedir}/src/main/webapp`（适用于web项目） | 页面资源，包含js,  css, 图片等等        |
| `${basedir}/target`                           | 打包输出目录                            |
| `${basedir}/target/classes`                   | 核心代码编译输出目录                    |
| `${basedir}/target/test-classes`              | 测试代码编译输出目录                    |
| `Test.java`                                   | Maven只会自动运行符合该命名规则的测试类 |
| `~/.m2/repository`                            | Maven默认的本地仓库目录位置，可更改     |

## 3. Maven仓库

Maven仓库是项目中依赖的第三方库，这个库所在的位置叫做仓库。

Maven仓库有三种类型：

1. 本地仓库：运行Maven时，其所需要的任何构件都是直接从本地仓库获取的。
2. 远程仓库：开发人员自己定制的仓库，也叫私服。
3. 中央仓库：由Maven社区提供的仓库，其中包含了绝大多数常用的库，需要通过网络才能访问。

若本地仓库没有没有需要的库，它会首先尝试从远程仓库下载构件至本地仓库，然后再使用本地仓库的构件；若远程仓库也没有，则从中央仓库下载；若中央仓库也没有，则报错。（顺序应该没错吧）

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

修改maven安装目录下的conf/settings.xml配置文件，在mirrors节点上，添加以下内容：

```xml
<mirror>
    <id>alimaven</id>
    <name>aliyun maven</name>
    <url>http://maven.aliyun.com/nexus/content/groups/public/</url>
    <mirrorOf>central</mirrorOf>
</mirror>
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

### 5.1 聚合

聚合用于快速构建maven工程，一次构建多个项目/模块。

- 创作一个空模块，打包类型定义为pom

    ```xml
    <packaging>pom</packaging>
    ```

- 定义当前模块进行构建操作时关联的其他模块名称

    ```xml
    <modules>
    	<module>../ssm_controller</module>
        <module>../ssm_service</module>
        <module>../ssm_dao</module>
        <module>../ssm_pojo</module>
    </modules>
    ```

注意事项：参与聚合操作的模块最终执行顺序与模块间的依赖关系有关，与配置顺序无关。

### 5.2 属性

- 自定义属性——等同于定义变量，方便统一维护

    - 定义格式：

        ```xml
        <!-- 定义自定义属性 -->
        <properties>
        	<spring.version>5.1.9.RELEASE</spring.version>
            <junit.version>4.12</junit.version>
        </properties>
        ```

    - 调用格式：

        ```xml
        <dependency>
        	<groupId>org.springframework</groupId>
            <artifactId>spring-context</artifactId>
            <version>${spring.version}</version>
        </dependency>
        ```

- 内置属性——使用maven内置属性用来快速配置

    - 调用格式：

        ```xml
        ${basedir}
        ${version}
        ```

- Setting属性——使用Maven配置文件setting.xml中的标签属性，用来动态配置。

    - 调用格式：

        ```xml
        ${settings.localRepository}
        ```

- Java系统属性——读取Java系统属性

    - 调用格式：

        ```xml
        ${user.home}
        ```

    - 系统属性查询方式

        ```cmd
        mvn help:system
        ```

- 环境变量属性

### 5.3 工程版本

通常分类：

- SNAPSHOT（快照版本）
    - 项目开发过程中，为方便团队成员合作，解决模块间相互依赖和时时更新的问题，开发者对每个模块进行构建的时候，输出的临时性版本叫快照版本（测试阶段版本）。
    - 快照版本会随着开发的进展不断更新。
- RELEASE（发布版本）
    - 项目开发到进入阶段里程碑后，向团队外部发布较为稳定的版本，这种版本对应的构件文件是稳定的，即使进行功能的后续开发，也不会改变当前发布版本内容，这种版本称为发布版本。

工程版本号约定：

- 约定规范：<主版本>.<次版本>.<增量版本>.<里程碑版本>
    - 主版本：表示项目重大架构的变更，如spring5相较于spring4的迭代
    - 次版本：表示有较大的功能增加和变化，或者全面系统地修复漏洞
    - 增量版本：表示有重大漏洞的修复
    - 里程碑版本：表示一个版本的里程碑（版本内部）。这样的版本同下一个正式版本相比，相对来说不是很稳定，有待更多的测试。
- 范例：5.1.9.RELEASE

### 5.4 scope属性

scope属性定义了项目和该jar包的依赖关系，其可选值为`compile`、`test`、`runtime`、`provided`、`system`：

- compile（默认）：编译时需要用到该jar包，Maven会把这种类型的依赖直接放入classpath。

- test：仅在测试时使用，正常运行时并不需要。最常用的`test`依赖就是JUnit：

    ```xml
    <dependency>
        <groupId>org.junit.jupiter</groupId>
        <artifactId>junit-jupiter-api</artifactId>
        <version>5.3.2</version>
        <scope>test</scope>
    </dependency>
    ```

- runtime：编译时不需要，但运行时需要。最典型的`runtime`依赖是JDBC驱动，例如MySQL驱动：

    ```xml
    <dependency>
        <groupId>mysql</groupId>
        <artifactId>mysql-connector-java</artifactId>
        <version>5.1.48</version>
        <scope>runtime</scope>
    </dependency>
    ```

- provided：“已提供”，指编译时需要，但运行时不需要。最典型的`provided`依赖是Servlet API，编译的时候需要，但是运行时，Servlet服务器内置了相关的jar，所以运行期不需要：

    ```xml
    <dependency>
        <groupId>javax.servlet</groupId>
        <artifactId>javax.servlet-api</artifactId>
        <version>4.0.0</version>
        <scope>provided</scope>
    </dependency>
    ```

- system：system范围依赖与provided类似，但是你必须显式的提供一个对于本地系统中JAR文件的路径。这么做是为了允许基于本地对象编译，而这些对象是系统类库的一部分。这样的构建应该是一直可用的，Maven 也不会在仓库中去寻找它。如果你将一个依赖范围设置成系统范围，你必须同时提供一个systemPath元素。

    > 注意system是不推荐使用的（建议尽量去从公共或定制的 Maven 仓库中引用依赖）。

    ```xml
    <dependency>
        <groupId>sun.jdk</groupId>
        <artifactId>tools</artifactId>
        <version>1.5.0</version>
        <scope>system</scope>
        <systemPath>${java.home}/../lib/tools.jar</systemPath>
    </dependency>
    ```





