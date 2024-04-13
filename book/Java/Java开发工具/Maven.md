---
title: Maven
---

## 1. Maven简介

Maven是Apache下的一个纯Java开发的开源项目，Maven是一个项目管理工具，它包含了一个 **项目对象模型(POM, Project Object Model)** 、一组标准集合、一个项目生命周期(project lifecycle)、一个依赖管理系统(Dependency Management System)，和用来运行定义在生命周期阶段中插件(plugin)目标的逻辑。

Maven是一个基于Java的工具，所以Maven的使用必须安装有JDK。

一个项目往往都要经历编译、测试、运行、打包、安装、部署等一系列过程，这个过程也被称为**项目的构建**，而maven可以使用一个命令一键构建整个工作。例如，常用的一些 maven 命令如下：

| 常用maven命令 |                             作用                             |
| :-----------: | :----------------------------------------------------------: |
|   mvn clean   |          清除项目编译信息（表现为删除target文件夹）          |
|  mvn compile  |                编译src/main/java下的java代码                 |
|   mvn test    | 编译src/test/java，且同时编译了src/main/java（相当于先执行了compile命令） |
|  mvn package  |       打包项目，此命令会把compile和test命令都执行一遍        |
|  mvn install  | 安装项目到本地仓库，此命令会也相当于会把compile, test, package挨个执行一遍 |
|  mvn deploy   | 发布项目，此命令也相当于把compile, test, package, install, deploy挨个执行一遍 |

> 每一个构建项目的命令都对应了Maven底层的一个插件。

![Maven概念模型](https://figure-bed.chua-n.com/Java/Maven概念模型.png)

## 2. Maven项目

### 2.1 创建Maven项目

Maven 提供了大量不同类型的 Archetype 模板，通过它们可以快速地创建 Java 项目，其中最简单的模板就是 maven-archetype-quickstart，它只需要用户提供项目最基本的信息，就能生成项目的基本结构及 POM 文件。

如，通过以下命令，即可创建一套完整的 Maven 项目目录结构：

> 参数说明：
>
> - `-DgroupId`: 项目组 ID，通常为组织名或公司网址的反写。
> - `-DartifactId`: 项目名。
> - `-DarchetypeArtifactId`: 指定 ArchetypeId，maven-archetype-quickstart 用于快速创建一个简单的 Maven 项目。
> - `-DinteractiveMode`: 是否使用交互模式。

```powershell
D:\temp>mvn archetype:generate -DgroupId=com.chuan -DartifactId=helloMaven -DarchetypeArtifactId=maven-archetype-quickst
art -DinteractiveMode=false
[INFO] Scanning for projects...
[INFO]
[INFO] ------------------< org.apache.maven:standalone-pom >-------------------
[INFO] Building Maven Stub Project (No POM) 1
[INFO] --------------------------------[ pom ]---------------------------------
[INFO]
[INFO] >>> maven-archetype-plugin:3.2.1:generate (default-cli) > generate-sources @ standalone-pom >>>
[INFO]
[INFO] <<< maven-archetype-plugin:3.2.1:generate (default-cli) < generate-sources @ standalone-pom <<<
[INFO]
[INFO]
[INFO] --- maven-archetype-plugin:3.2.1:generate (default-cli) @ standalone-pom ---
[INFO] Generating project in Batch mode
[WARNING] No archetype found in remote catalog. Defaulting to internal catalog
Downloading from alimaven: http://maven.aliyun.com/nexus/content/groups/public/org/apache/maven/archetypes/maven-archetype-quickstart/1.0/maven-archetype-quickstart-1.0.pom
Downloaded from alimaven: http://maven.aliyun.com/nexus/content/groups/public/org/apache/maven/archetypes/maven-archetype-quickstart/1.0/maven-archetype-quickstart-1.0.pom (703 B at 1.9 kB/s)
Downloading from alimaven: http://maven.aliyun.com/nexus/content/groups/public/org/apache/maven/archetypes/maven-archetype-quickstart/1.0/maven-archetype-quickstart-1.0.jar
Downloaded from alimaven: http://maven.aliyun.com/nexus/content/groups/public/org/apache/maven/archetypes/maven-archetype-quickstart/1.0/maven-archetype-quickstart-1.0.jar (4.3 kB at 18 kB/s)
[INFO] ----------------------------------------------------------------------------
[INFO] Using following parameters for creating project from Old (1.x) Archetype: maven-archetype-quickstart:1.0
[INFO] ----------------------------------------------------------------------------
[INFO] Parameter: basedir, Value: D:\temp
[INFO] Parameter: package, Value: com.chuan
[INFO] Parameter: groupId, Value: com.chuan
[INFO] Parameter: artifactId, Value: helloMaven
[INFO] Parameter: packageName, Value: com.chuan
[INFO] Parameter: version, Value: 1.0-SNAPSHOT
[INFO] project created from Old (1.x) Archetype in dir: D:\temp\helloMaven
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time:  3.397 s
[INFO] Finished at: 2022-12-01T21:47:52+08:00
[INFO] ------------------------------------------------------------------------

D:\temp>
```

### 2.2 项目结构

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

### 2.3 maven 坐标

在 Maven 中，任何一个依赖、插件或者项目构建的输出，都可以称为**构件**。在 Maven 世界中存在着数十万甚至数百万构件，在引入坐标概念之前，当用户需要使用某个构件时，只能去对应的网站寻找，严重地影响研发效率。为了解决这个问题，Maven 引入了 Maven 坐标的概念。

Maven 坐标规定：世界上任何一个构件都可以使用 Maven 坐标并作为其唯一标识，Maven 坐标包括 groupId、artifactId、version、packaging 等元素，只要用户提供了正确的坐标元素，Maven 就能找到对应的构件。 

Maven 坐标主要由以下元素组成：

- groupId：项目组 ID，定义当前 Maven 项目隶属的组织或公司，通常是唯一的。它的取值一般是项目所属公司或组织的网址或 URL 的反写，例如 com.chuan.www；
- artifactId：制品 ID，通常是项目的名称；
- version：版本号；
- packaging：可选，项目的打包方式，默认值为 jar。

对于上述helloMaven项目，其坐标为：

```xml
<project>
  <groupId>com.chuan</groupId>
  <artifactId>helloMaven</artifactId>
  <packaging>jar</packaging>
  <version>1.0-SNAPSHOT</version>
</project>
```

### 2.4 maven 依赖

如果一个 Maven 构建所产生的构件（例如 Jar 文件）被其他项目引用，那么该构件就是其他项目的依赖。显然，依据 maven 坐标即可引入依赖。

例如，某个项目使用 servlet-api 作为其依赖，可通过在POM中进行如下配置来引入：

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v4_0_0.xsd">
	...
    <dependencies>
        <dependency>
            <groupId>javax.servlet</groupId>
            <artifactId>servlet-api</artifactId>
            <version>2.5</version>
            <scope>provided</scope>
        </dependency>
    </dependencies>
</project>
```

`dependencies` 元素可以包含一个或者多个 `dependency` 子元素，用以声明一个或者多个项目依赖，每个依赖都可以包含以下元素：

- `groupId`、`artifactId` 和 `version`：依赖的基本坐标，对于任何一个依赖来说，基本坐标是必不可少的；
- `type`：依赖的类型，对应于项目坐标定义的 `packaging`。大部分情况下，该元素不必声明，其默认值是 jar。
- `scope`：依赖的范围。
- `optional`：标记依赖是否可选。
- `exclusions`：用来排除传递性依赖。

### 2.5 版本号

Maven 仓库按照版本类型分为两种，Snapshot 快照仓库和 Release 发行仓库。

- Snapshot 快照仓库用于保存开发过程中的不稳定 SNAPSHOT 版本；
- Release 发行仓库则用来保存稳定的 RELEASE 版本。

Maven 会根据模块的版本号（pom.xml 文件中的 version 元素）中是否带有 `-SNAPSHOT` 来判断是 SNAPSHOT 版本还是正式 RELEASE 版本。

SNAPSHOT 版本和 RELEASE 版本区别如下表：

|            区别            |                        SNAPSHOT 版本                         |                         RELEASE 版本                         |
| :------------------------: | :----------------------------------------------------------: | :----------------------------------------------------------: |
|            定义            |                    版本号中带有 -SNAPSHOT                    |                   版本号中不带有 -SNAPSHOT                   |
|          发布仓库          |                      Snapshot 快照仓库                       |                       Release 发行仓库                       |
| 是否从远程仓库自动获取更新 | 在不更改版本号的前提下，直接编译打包时，Maven 会自动从远程仓库上下载最新的快照版本 | 在不更改版本号的前提下，直接编译打包时，如果本地仓库已经存在该版本的模块，则 Maven 不会主动去远程仓库下载 |
|           稳定性           |     快照版本往往对应了大量带有时间戳的构件，具有不稳定性     |            发布版本只对应了唯一的构件，具有稳定性            |
|          使用场景          |           快照版本只应该在组织内部的项目中依赖使用           | Maven 项目使用的组织外的依赖项都应该时发布版本的，不应该使用任何的快照版本依赖，否则会造成潜在的风险 |
|     发布前是否需要修改     | 当项目经过完善的测试后，需要上线时，应该将项目从快照版本更改为发布版本 |                          不需要修改                          |

> 默认情况下对于快照版本的构件，Maven 会每天从仓库中获取一次更新，用户也可以在任何 Maven 命令中使用 -U 参数强制 Maven 检查更新：
>
> ```bash
> mvn clean package -U
> ```

工程版本号约定：

- 约定规范：<主版本>.<次版本>.<增量版本>.<里程碑版本>
  - 主版本：表示项目重大架构的变更，如spring5相较于spring4的迭代
  - 次版本：表示有较大的功能增加和变化，或者全面系统地修复漏洞
  - 增量版本：表示有重大漏洞的修复
  - 里程碑版本：表示一个版本的里程碑（版本内部）。这样的版本同下一个正式版本相比，相对来说不是很稳定，有待更多的测试。
- 范例：5.1.9.RELEASE

## 3. Maven仓库

Maven仓库是指用于统一存放项目中依赖的构件的地方。当然，本项目构建完成生成的构件，也可以安装或者部署到仓库中，供其他项目使用。

Maven仓库有三种类型：

1. 本地仓库：运行Maven时，其所需要的任何构件都是直接从本地仓库获取的。
2. （私有）远程仓库：开发人员自己定制的仓库，也叫私服。
3. [中央仓库](https://mvnrepository.com/)：由Maven社区提供的仓库，其中包含了绝大多数常用的库，需要通过网络才能访问。

若本地仓库没有没有需要的库，它会首先尝试从远程仓库下载构件至本地仓库，然后再使用本地仓库的构件；若远程仓库也没有，则从中央仓库下载；若中央仓库也没有，则报错。优先级如下：
$$
本地仓库 > 私服（profile）> 远程仓库（repository）和镜像（mirror） > 中央仓库（central）
$$

### 3.1 本地仓库

Maven 本地仓库实际上就是本地计算机上的一个目录（文件夹），它会在第一次执行 Maven 命令时被创建。

当 Maven 项目第一次进行构建时，会自动从远程仓库搜索依赖项，并将其下载到本地仓库中。当项目再进行构建时，会直接从本地仓库搜索依赖项并引用，而不会再次向远程仓库获取。

默认情况下，无论windows或linux，本地仓库均被创建在用户家目录下的.m2/repository/的目录。

因为默认位置常常在C盘，通常我们会修改本地仓库的目录。通过maven安装目录下的conf/settings.xml配置文件的`localRepository`元素进行配置即可，例如：

```xml
<localRepository>D:\maven\repository</localRepository>
```

### 3.2 中央仓库

中央仓库具有如下特点：

- 这个仓库由 Maven 社区管理
- 不需要配置
- 需要通过网络才能访问

虽然中央仓库属于远程仓库的范畴，但由于它的特殊性，一般会把它与其他远程仓库区分开。我们常说的远程仓库，一般不包括中央仓库。

#### 添加并使用阿里云的中央仓库源

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

以上配置中，mirrorOf 的取值为 central，表示该配置为中央仓库的镜像，所有对于中央仓库的请求都会转到该镜像。当然，我们也可以使用以上方式配置其他仓库的镜像。另外三个元素 id、name 和 url 分别表示镜像的唯一标识、名称和地址。

#### mirrorOf标签

为了满足一些较为复杂的需求，Maven 还支持一些更为高级的配置：

- `<mirrorOf>*</mirrorOf>`：匹配所有远程仓库，所有对于远程仓库的请求都会被拦截，并跳转到 url 元素指定的地址
- `<mirrorOf>external:*</mirrorOf>`：匹配所有远程仓库，使用 localhost 和 file:// 协议的除外。即，匹配所有不在本机上的远程仓库。
- `<mirrorOf>repo1,repo2</mirrorOf>`：匹配仓库 repo1 和 repo2，使用逗号分隔多个远程仓库。
- `<mirrorOf>*,!repo1</miiroOf>`：匹配所有远程仓库，repo1 除外，使用感叹号将仓库从匹配中排除。

### 3.3 远程仓库

远程仓库的概念，通常指由开发人员自己定制的仓库。远程仓库有多种配置方式，如项目的POM中通过repository标签：

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <groupId>net.biancheng.www</groupId>
    <artifactId>maven</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <dependencies>
        <dependency>
            <groupId>com.bangcheng.common-lib</groupId>
            <artifactId>common-lib</artifactId>
            <version>1.0.0</version>
        </dependency>
    </dependencies>
    <repositories>
        <repository>
            <id>bianchengbang.lib1</id>
            <url>http://download.bianchengbang.org/maven2/lib1</url>
        </repository>
        <repository>
            <id>bianchengbang.lib2</id>
            <url>http://download.bianchengbang.org/maven2/lib2</url>
        </repository>
    </repositories>
</project>
```

## 4. Maven生命周期

Maven 从大量项目和构建工具中学习和反思，总结了一套高度完美的、易扩展的生命周期。这个生命周期将项目的清理、初始化、编译、测试、打包、集成测试、验证、部署和站点生成等几乎所有构建过程进行了抽象和统一。

### 4.1 生命周期与插件

Maven 生命周期本身只是一个抽象的概念，其实际工作（如源代码编译）都通过调用 Maven 插件中的插件目标（plugin goal）来完成。

生命周期中的每个构建过程都可以绑定一个或多个插件目标，且 Maven 为大多数的构建步骤都绑定了默认的插件。例如，针对源代码编译的插件是 maven-compiler-plugin、针对集成测试的插件是 maven-surefire-plugin 等。

### 4.2 三套生命周期

Maven 拥有三套标准的生命周期：

- clean：用于清理项目
- default：用于构建项目
- site：用于建立项目站点

每套生命周期包含一系列的构建**阶段（phase）**，这些阶段是有顺序的，且后面的阶段依赖于前面的阶段。用户与 Maven 最直接的交互方式就是调用这些生命周期阶段，通过将阶段名传递给 mvn 命令，就可以调用构建阶段，例如`mvn install`。

与构建阶段的前后依赖关系不同，三套生命周期本身是相互独立的，用户可以只调用 clean 生命周期的某个阶段，也可以只调用 default 生命周期的某个阶段，而不会对其他生命周期造成任何影响。 

其实我们类比一下就明白了：

- lifecycle 相当于 Java 的 package，它包含一个或多个phase；
- phase 相当于 Java 的 class，它包含一个或多个goal；
- goal 相当于 class 的 method，它其实才是真正干活的。每个phase会执行自己默认的一个或多个goal，显然 goal 是最小任务单元。

大多数情况，我们只要指定phase，就会执行这些 phase 默认绑定的 goal，只有少数情况，我们可以直接指定运行一个goal，例如，启动Tomcat服务器：`mvn tomcat:run`。

### 4.3 clean 生命周期

 clean 生命周期包括以下 3 个阶段：

- pre-clean（清理前）
- clean（清理）
- post-clean（清理后）

### 4.4 default 生命周期

default 生命周期定义了项目真正构建时所需要的所有步骤，它是所有生命周期中最核心，最重要的部分。

default 生命周期包含非常多的阶段，如下表：

|         阶段          |                             描述                             |
| :-------------------: | :----------------------------------------------------------: |
|       validate        |          验证项目是否正确以及所有必要信息是否可用。          |
|      initialize       |                       初始化构建状态。                       |
|   generate-sources    |               生成编译阶段需要的所有源码文件。               |
|    process-sources    |                处理源码文件，例如过滤某些值。                |
|  generate-resources   |               生成项目打包阶段需要的资源文件。               |
|   process-resources   |      处理资源文件，并复制到输出目录，为打包阶段做准备。      |
|        compile        |                编译源代码，并移动到输出目录。                |
|    process-classes    |                   处理编译生成的字节码文件                   |
| generate-test-sources |                生成编译阶段需要的测试源代码。                |
| process-test-sources  |             处理测试资源，并复制到测试输出目录。             |
|     test-compile      |            编译测试源代码并移动到测试输出目录中。            |
|         test          |        使用适当的单元测试框架（例如 JUnit）运行测试。        |
|    prepare-package    |             在真正打包之前，执行一些必要的操作。             |
|        package        | 获取编译后的代码，并按照可发布的格式进行打包，例如 JAR、WAR 或者 EAR 文件。 |
| pre-integration-test  |    在集成测试执行之前，执行所需的操作，例如设置环境变量。    |
|   integration-test    |        处理和部署所需的包到集成测试能够运行的环境中。        |
| post-integration-test |       在集成测试被执行后执行必要的操作，例如清理环境。       |
|        verify         |          对集成测试的结果进行检查，以保证质量达标。          |
|        install        |         安装打包的项目到本地仓库，以供其他项目使用。         |
|        deploy         |  拷贝最终的包文件到远程仓库中，以共享给其他开发人员和项目。  |

### 4.5 site 生命周期

sit 生命周期的目的是建立和部署项目站点，Maven 能够根据 POM 包含的信息，自动生成一个友好的站点，该站点包含一些与该项目相关的文档。

site 生命周期包含以下 4 个阶段：

- pre-site
- site
- post-site
- site-deploy

## 5. Maven 插件

Maven 实际上是一个依赖插件执行的框架，它执行的每个任务实际上都由插件完成的。Maven 的核心发布包中并不包含任何 Maven 插件，它们以独立构件的形式存在， 只有在 Maven 需要使用某个插件时，才会去仓库中下载。

Maven 提供了如下 2 种类型的插件：

| 插件类型          | 描述                                                       |
| ----------------- | ---------------------------------------------------------- |
| Build plugins     | 在项目构建过程中执行，在 pom.xml 中的 build 元素中配置     |
| Reporting plugins | 在网站生成过程中执行，在 pom.xml 中的 reporting 元素中配置 |

### 5.1 插件目标

对于 Maven 插件而言，为了提高代码的复用性，通常一个 Maven 插件能够实现多个功能，每一个功能都是一个插件目标，即 Maven 插件是插件目标的集合。我们可以把插件理解为一个类，而插件目标是类中的方法，调用插件目标就能实现对应的功能。

插件目标的通用写法为：`[插件名]:[插件目标名]`。例如，maven-compiler-plugin 插件的 compile 目标的通用写法如下：

```bash
maven-compiler-plugin:compile
```

而使用 Maven 命令执行插件的目标的语法为：`mvn [插件名]:[目标名]`。例如，调用 maven-compiler-plugin 插件的 compile 目标，命令如下：

```bash
mvn compiler:compile
```

### 5.2 插件绑定

为了完成某个具体的构建任务，Maven 生命周期的阶段需要和 Maven 插件的目标相互绑定。例如，代码编译任务对应了default 生命周期的 compile 阶段，而 maven-compiler-plugin 插件的 compile 目标能够完成这个任务，因此将它们进行绑定就能达到代码编译的目的。

#### 5.2.1 内置绑定

Maven 默认为一些核心的生命周期阶段绑定了插件目标，当用户调用这些阶段时，对应的插件目标就会自动执行相应的任务。

| 生命周期 |          阶段          |                 插件目标                  |             执行的任务             |
| :------: | :--------------------: | :---------------------------------------: | :--------------------------------: |
|  clean   |       pre-clean        |                                           |                                    |
|          |         clean          |         maven-clean-plugin:clean          |       清理 Maven 的输出目录        |
|          |       post-clean       |                                           |                                    |
|   site   |        pre-site        |                                           |                                    |
|          |          site          |          maven-site-plugin:site           |            生成项目站点            |
|          |       post-site        |                                           |                                    |
|          |      site-deploy       |         maven-site-plugin:deploy          |            部署项目站点            |
| default  |   process-resources    |     maven-resources-plugin:resources      |       复制资源文件到输出目录       |
|          |        compile         |       maven-compiler-plugin:compile       |         编译代码到输出目录         |
|          | process-test-resources |   maven-resources-plugin:testResources    |   复制测试资源文件到测试输出目录   |
|          |      test-compile      |     maven-compiler-plugin:testCompile     |     编译测试代码到测试输出目录     |
|          |          test          |        maven-surefire-plugin:test         |            执行测试用例            |
|          |        package         | maven-jar-plugin:jar/maven-jar-plugin:war |        创建项目 jar/war 包         |
|          |        install         |       maven-install-plugin:install        |  将项目输出的包文件安装到本地仓库  |
|          |         deploy         |        maven-deploy-plugin:deploy         | 将项目输出的包文件部署到到远程仓库 |

> 上表中，default 生命周期中只列出了绑定了插件目标的阶段，它还有很多其他的阶段，但这些阶段默认没有绑定任何插件目标，因此它们也没有任何实际的行为。

执行 Maven 命令时即可看到该构建过程包含了哪些插件目标。例如，在 Maven 项目中执行 `mvn clean install` 命令，能看到如下输出，图中标记的部分就是执行此命令时所调用的插件目标：

![Maven 内置插件目标](https://figure-bed.chua-n.com/Java/142H4N00-0.png)

#### 5.2.2 自定义绑定

除了内置绑定之外，用户也可以自己选择将某个插件目标绑定到 Maven 生命周期的某个阶段上，这种绑定方式就是**自定义绑定**。自定义绑定能够让 Maven 在构建过程中执行更多更丰富的任务。

例如，我们想要在 clean 生命周期的 clean 阶段中显示自定义文本信息，则只需要在项目的 POM 中 ，通过 build 元素的子元素 plugins，将 maven-antrun-plugin:run 目标绑定到 clean 阶段上，并使用该插件输出自定义文本信息即可：

```xml
<project>
    ...
    <build>
        <plugins>
            <!-- 绑定插件 maven-antrun-plugin -->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-antrun-plugin</artifactId>
                <version>1.8</version>
                <executions>
                    <execution>
                        <!--自定义 id -->
                        <id>www.biancheng.net clean</id>
                        <!--插件目标绑定的构建阶段 -->
                        <phase>clean</phase>
                        <!--插件目标 -->
                        <goals>
                            <goal>run</goal>
                        </goals>
                        <!--配置 -->
                        <configuration>
                            <!-- 执行的任务 -->
                            <tasks>
                                <!--自定义文本信息 -->
                                <echo>清理阶段，编程帮 欢迎您的到来，网址：www.biancheng.net</echo>
                            </tasks>
                        </configuration>
                    </execution>               
                </executions>
            </plugin>
        </plugins>
    </build>
    ...
</project>
```

以上配置中除了插件的坐标信息之外，还通过 executions 元素定义了一些执行配置。executions 下的每一个 executin 子元素都可以用来配置执行一个任务。

execution 下各个元素含义如下：

- id：任务的唯一标识；
- phase：插件目标需要绑定的生命周期阶段；
- goals：用于指定一组插件目标，其子元素 goal 用于指定一个插件目标；
- configuration：该任务的配置，其子元素 tasks 用于指定该插件目标执行的任务（？）；

执行命令 mvn clean ，结果如下。

```shell
[INFO] Scanning for projects...
[INFO]
[INFO] ------------------< net.biancheng.www:helloIdeaMaven >------------------
[INFO] Building helloIdeaMaven 2.6-SNAPSHOT
[INFO] --------------------------------[ jar ]---------------------------------
[INFO]
[INFO] --- maven-clean-plugin:3.1.0:clean (default-clean) @ helloIdeaMaven ---
[INFO] Deleting D:\eclipse workSpace 3\helloIdeaMaven\target
[INFO]
[INFO] --- maven-antrun-plugin:1.8:run (www.biancheng.net clean) @ helloIdeaMaven ---
[WARNING] Parameter tasks is deprecated, use target instead
[INFO] Executing tasks
main:
     [echo] 清理阶段，编程帮 欢迎您的到来，网址：www.biancheng.net
[INFO] Executed tasks
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time:  0.753 s
[INFO] Finished at: 2021-04-08T10:22:49+08:00
[INFO] ------------------------------------------------------------------------
```

### 5.3 插件示例：maven-assembly-plugin

> 官方文档：[Apache Maven Assembly Plugin – Introduction](https://maven.apache.org/plugins/maven-assembly-plugin/)。

对于普通的maven项目，其在执行`mvn package`命令时，只会将本项目的代码打入jar包，而本项目所依赖的jar包是不会进入其中的，因此在部署的时候还需要将相关的依赖jar同时移值到服务器上，如果你希望避免这样的麻烦，可以 maven-assembly-plugin 插件。这个插件可以让你在打本项目jar包的同时，将本项目的依赖同时打入最终的jar（说到这里，你可能想起了Spring Boot提供的maven插件spring-boot-maven-plugin，是类似的）。

Assembly 插件的主要作用是，允许用户将项目本身的输出与它的依赖项、模块、站点文档及其他文件一起组装成一个可分发的 jar 包。

一个使用示例是：

- pom.xml

  ```xml
  <?xml version="1.0" encoding="UTF-8"?>
  <project xmlns="http://maven.apache.org/POM/4.0.0"
           xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
           xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  
      <dependencies>
          ...
      </dependencies>
  
      <build>
          ...
          <plugins>
              <plugin>
                  <artifactId>maven-assembly-plugin</artifactId>
                  <executions>
                      <execution>
                          <id>make-assembly</id>
                          <!--绑定package打包-->
                          <phase>package</phase>
                          <goals>
                              <goal>single</goal>
                          </goals>
                          <configuration>
                              <descriptor>src/main/resources/assembly.xml</descriptor><!--配置描述文件路径-->
                          </configuration>
                      </execution>
                  </executions>
              </plugin>
              ...
          </plugins>
      </build>
  </project>
  ```

- assembly.xml

  ```xml
  <assembly>
      <id>plugin</id>
      <formats>
          <format>jar</format>
      </formats>
      <!--是否包含基础目录-->
      <includeBaseDirectory>false</includeBaseDirectory>
      <dependencySets>
          <dependencySet>
              <!--指定依赖jar包-->
              <includes>
                  <include>org.apache.poi:ooxml-schemas</include>
                  <include>com.glodon.gatling:gatling-efficiency-utils</include>
              </includes>
              <!--移除标准版依赖的jar包-->
              <excludes>
                  <exclude>org.apache.poi:poi-ooxml-schemas</exclude>
              </excludes>
              <!--是否把本项目添加到依赖文件夹下-->
              <useProjectArtifact>true</useProjectArtifact>
              <!--输出目录-->
              <outputDirectory>/</outputDirectory>
              <!--是否解压-->
              <unpack>true</unpack>
          </dependencySet>
      </dependencySets>
      <fileSets>
          <fileSet>
              <!--项目源码输出目录-->
              <directory>${project.build.directory}/classes</directory>
              <outputDirectory>/</outputDirectory>
          </fileSet>
      </fileSets>
  </assembly>
  ```

## 6. Maven 依赖传递

如下图所示，项目 A 依赖于项目 B，B 又依赖于项目 C，此时 B 是 A 的直接依赖，C 是 A 的间接依赖。

![依赖传递](https://figure-bed.chua-n.com/Java/1212441G0-0.png)

Maven 的依赖传递机制是指：不管 Maven 项目存在多少间接依赖，POM 中都只需要定义其直接依赖，不必定义任何间接依赖，Maven 会自动读取当前项目各个直接依赖的 POM，将那些必要的间接依赖以传递性依赖的形式引入到当前项目中。Maven 的依赖传递机制能够帮助用户一定程度上简化 POM 的配置。

通过这种依赖传递关系，可以使依赖关系树迅速增长到一个很大的量级，很有可能会出现依赖重复、依赖冲突等情况，Maven 针对这些情况提供了如下功能进行处理：

- 依赖范围（Dependency scope）
- 依赖仲裁（Dependency mediation）
- 排除依赖（Excluded dependencies）
- 可选依赖（Optional dependencies）

### 6.1 依赖范围

Maven 在对项目进行编译、测试和运行时，会分别使用三套不同的 classpath，Maven 项目构建时，在不同阶段引入到 classpath 中的依赖是不同的。

- 编译时，Maven 会将与编译相关的依赖引入到编译 classpath 中；
- 测试时，Maven 会将与测试相关的的依赖引入到测试 classpath 中；
- 运行时，Maven 会将与运行相关的依赖引入到运行 classpath 中。

我们可以在 POM 的依赖声明中使用 `scope` 元素来控制依赖与三种 classpath 之间的关系，这就是**依赖范围**。

Maven 具有以下 6 中常见的依赖范围：

- `compile`（默认）：编译依赖范围，scope 元素的缺省值。使用此依赖范围的 Maven 依赖，对于三种 classpath 均有效，即该 Maven 依赖在上述三种 classpath 均会被引入。例如，log4j 在编译、测试、运行过程都是必须的。

- `test`：测试依赖范围。使用此依赖范围的 Maven 依赖，只对测试 classpath 有效。例如，Junit 依赖只有在测试阶段才需要。

  ```xml
  <dependency>
      <groupId>org.junit.jupiter</groupId>
      <artifactId>junit-jupiter-api</artifactId>
      <version>5.3.2</version>
      <scope>test</scope>
  </dependency>
  ```

- `runtime`：运行时依赖范围。使用此依赖范围的 Maven 依赖，只对测试 classpath、运行 classpath 有效。例如，JDBC 驱动实现依赖，其在编译时只需 JDK 提供的 JDBC 接口即可，只有测试、运行阶段才需要实现了 JDBC 接口的驱动。

  ```xml
  <dependency>
      <groupId>mysql</groupId>
      <artifactId>mysql-connector-java</artifactId>
      <version>5.1.48</version>
      <scope>runtime</scope>
  </dependency>
  ```

- `provided`：已提供依赖范围。使用此依赖范围的 Maven 依赖，只对编译 classpath 和测试 classpath 有效。例如，servlet-api 依赖对于编译、测试阶段而言是需要的，但是运行阶段，由于外部容器已经提供，故不需要 Maven 重复引入该依赖。

  ```xml
  <dependency>
      <groupId>javax.servlet</groupId>
      <artifactId>javax.servlet-api</artifactId>
      <version>4.0.0</version>
      <scope>provided</scope>
  </dependency>
  ```

- `system`：系统依赖范围，其效果与 provided 的依赖范围一致。其用于添加非 Maven 仓库的本地依赖，通过依赖元素 dependency 中的 systemPath 元素指定本地依赖的路径。鉴于使用其会导致项目的可移植性降低，一般不推荐使用。

  ```xml
  <dependency>
      <groupId>sun.jdk</groupId>
      <artifactId>tools</artifactId>
      <version>1.5.0</version>
      <scope>system</scope>
      <systemPath>${java.home}/../lib/tools.jar</systemPath>
  </dependency>
  ```

- `import`：导入依赖范围，该依赖范围只能与 dependencyManagement 元素配合使用，其功能是将目标 pom.xml 文件中 dependencyManagement 的配置导入合并到当前 pom.xml 的 dependencyManagement 中。

#### 依赖范围对传递依赖的影响

项目 A 依赖于项目 B，B 又依赖于项目 C，此时我们可以将 A 对于 B 的依赖称之为第一直接依赖，B 对于 C 的依赖称之为第二直接依赖。

B 是 A 的直接依赖，C 是 A 的间接依赖，根据 Maven 的依赖传递机制，间接依赖 C 会以传递性依赖的形式引入到 A 中，但这种引入并不是无条件的，它会受到依赖范围的影响。

传递性依赖的依赖范围受第一直接依赖和第二直接依赖的范围影响，如下表所示：

|              | **compile** | **test** | **provided** | **runtime** |
| :----------: | :---------: | :------: | :----------: | :---------: |
| **compile**  |   compile   |    -     |      -       |   runtime   |
|   **test**   |    test     |    -     |      -       |    test     |
| **provided** |  provided   |    -     |   provided   |  provided   |
| **runtime**  |   runtime   |    -     |      -       |   runtime   |

> 注：上表中，左边第一列表示第一直接依赖的依赖范围，上边第一行表示第二直接依赖的依赖范围。交叉部分的单元格的取值为传递性依赖的依赖范围，若交叉单元格取值为“-”，则表示该传递性依赖不能被传递。

通过上表，可以总结出以下规律：

- 当第二直接依赖的范围是 compile 时，传递性依赖的范围与第一直接依赖的范围一致；
- 当第二直接依赖的范围是 test 时，传递性依赖不会被传递；
- 当第二直接依赖的范围是 provided 时，只传递第一直接依赖的范围也为 provided 的依赖，且传递性依赖的范围也为 provided；
- 当第二直接依赖的范围是 runtime 时，传递性依赖的范围与第一直接依赖的范围一致，但 compile 例外，此时传递性依赖的范围为 runtime。

### 6.2 依赖仲裁

Maven 的依赖传递机制可以简化依赖的声明，用户只需要关心项目的直接依赖，而不必关心这些直接依赖会引入哪些间接依赖。但当一个间接依赖存在多条引入路径时，为了避免出现依赖重复的问题，Maven 会通过依赖仲裁来确定间接依赖的引入路径。

依赖仲裁依次遵循以下两条原则：

- 引入路径短者优先
- 先声明者优先

#### 6.2.1 引入路径短者优先

引入路径短者优先，顾名思义，当一个间接依赖存在多条引入路径时，引入路径短的会被解析使用。

例如，A 存在这样的依赖关系：

- A→B→C→D(1.0)
- A→X→D(2.0)

D 是 A 的间接依赖，但两条引入路径上有两个不同的版本，很显然不能同时引入，否则造成重复依赖的问题。

根据 Maven 依赖调节的第一个原则：引入路径短者优先，D(1.0)的路径长度为 3，D(2.0)的路径长度为 2，因此间接依赖 D(2.0)将从 A→X→D(2.0) 路径引入到 A 中。

#### 6.2.2 先声明者优先

先声明者优先，顾名思义，在引入路径长度相同的前提下，POM 文件中依赖声明的顺序决定了间接依赖会不会被解析使用，顺序靠前的优先使用。

例如，A 存在以下依赖关系：

- A→B→D(1.0)
- A→X→D(2.0)

D 是 A 的间接依赖，其两条引入路径的长度都是 2，此时 Maven 依赖调节的第一原则已经无法解决，需要使用第二原则：先声明者优先。

A 的 POM 文件中配置如下：

```xml
<dependencies>
    ...      
    <dependency>
        ...
        <artifactId>B</artifactId>       
        ...
    </dependency>
    ...
    <dependency>
        ...
        <artifactId>X</artifactId>
        ...
    </dependency>
    ...
</dependencies>
```

有以上配置可以看出，由于 B 的依赖声明比 X 靠前，所以间接依赖 D(1.0)将从 A→B→D(1.0) 路径引入到 A 中。

### 6.3 排除依赖

假设存在这样的依赖关系，A 依赖于 B，B 依赖于 X，B 又依赖于 Y。B 实现了两个特性，其中一个特性依赖于 X，另一个特性依赖于 Y，然而两个特性是互斥的关系，用户无法同时使用两个特性，所以 A 需要排除 X，此时就可以在 A 中将间接依赖 X 排除。

排除依赖是通过在 A 中引入 B 依赖的 dependency 标签中使用 exclusions 元素实现的，该元素下可以包含若干个 exclusion 子元素，用于排除若干个间接依赖，示例代码如下：

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
	...
    <artifactId>A</artifactId>
    ...
    <dependencies>
        <dependency>
            ...
            <artifactId>B</artifactId>
            <exclusions>
                <!-- 设置具体的排除 -->
                <exclusion>
                    <groupId>com.chuan.www</groupId>
                    <artifactId>X</artifactId>
                </exclusion>
            </exclusions>
        </dependency>
    </dependencies>
</project>
```

关于 exclusions 元素及排除依赖说明如下：

- 排除依赖是控制当前项目是否使用其直接依赖传递下来的接间依赖；
- exclusions 元素下可以包含若干个 exclusion 子元素，用于排除若干个间接依赖；
- exclusion 元素用来设置具体排除的间接依赖，该元素包含两个子元素：groupId 和 artifactId，用来唯一确定需要排除的间接依赖的坐标信息。

### 6.4 可选依赖

与上文的应用场景相同，也是 A 希望排除间接依赖 X，一种新的手段是，我们还可以在 B 中将 X 设置为可选依赖。

具体方式为，在 B 的 POM 中在关于 X 的依赖声明中使用 `optional` 元素，将其设置成可选依赖，示例配置如下：

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v4_0_0.xsd">
    ...
    <artifactId>B</artifactId>
    ...
    <dependencies>
        <dependency>
            <groupId>net.biancheng.www</groupId>
            <artifactId>X</artifactId>
            <version>1.0-SNAPSHOT</version>
            <!-- 设置可选依赖 -->
            <optional>true</optional>
        </dependency>
    </dependencies>
</project>
```

关于 optional 元素及可选依赖说明如下：

- optional 默认值为 false，表示当前依赖可以向下传递称为间接依赖；
- 若 optional 元素取值为 true，则表示当前依赖不能向下传递成为间接依赖。

## 7. pom 继承

Maven 在设计时，借鉴了 Java 面向对象中的继承思想，提出了 POM 继承思想。

### 7.1 parent元素

当一个项目包含多个模块时，可以在该项目中创建一个父模块，并在其 POM 中声明依赖，同时使其他模块的 POM 通过继承父模块的 POM 来获得对相关依赖的声明。对于父模块而言，其目的是统一管理，消除子模块 POM 中的重复配置，其中完全可以不包含任何实际代码，因此父模块 POM 的打包类型必须是 pom。

例如，一个父级POM的设置可如下：

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    
    <groupId>com.chuan</groupId>
    <artifactId>java-playground</artifactId>
    <version>1.0-SNAPSHOT</version>
    <!-- 定义父类 POM 打包类型为pom -->
    <packaging>pom</packaging>
   
    <dependencies>
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.13.2</version>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <version>1.18.24</version>
        </dependency>
    </dependencies>
</project>
```

子模块的 POM 中使用 `parent` 元素来声明父模块，`parent` 的子元素如下表：

|     元素     | 是否必需 |                             描述                             |
| :----------: | :------: | :----------------------------------------------------------: |
|   groupId    |    是    |                              /                               |
|  artifactId  |    是    |                              /                               |
|   version    |    是    |                              /                               |
| relativePath |    否    | 父模块 POM 的相对路径，默认值为 `../pom.xml`。 项目构建时，Maven 会先根据 relativePath 查找父模块 POM，如果找不到，再从本地仓库或远程仓库中查找。 |

此外，子模块的 POM 中，当前模块的 groupId 和 version 元素可以省略，但这并不意味着当前模块没有 groupId 和 version，子模块会隐式的从父模块中继承这两个元素，即由父模块控制子模块的groupId 以及 version，这样可以简化 POM 的配置。

该父模块的某个子模块的设置可如下：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <!-- 使用parent标签引入父POM -->
    <parent>
        <artifactId>java-playground</artifactId>
        <groupId>com.chuan</groupId>
        <version>1.0-SNAPSHOT</version>
    </parent>
    <modelVersion>4.0.0</modelVersion>

    <artifactId>play-json</artifactId>

    <dependencies>
        <!--fastjson-->
        <dependency>
            <groupId>com.alibaba</groupId>
            <artifactId>fastjson</artifactId>
            <version>2.0.14</version>
        </dependency>
    </dependencies>
</project>
```

### 7.2 super POM

无论 POM 文件中是否显示的声明，所有的 POM 均会继承自一个父 POM，这个继承体系中根节点的 POM 被称为 Super POM，它包含了一些可以被继承的默认设置。

### 7.3 effective POM

Maven 最终执行相关任务时，会将继承关系中的所有POM叠加到一起形成一个最终生效的POM，在Maven实际运行过程中，执行构建操作就是按照这个有效POM来运行的，这个实际发生作用的POM称之为 effective pom。

在一个maven项目下执行以下命令 ，就可以查看当前的 effective pom：

```bash
mvn help:effective-pom
```

### 7.4 可继承的POM元素

由上已知 groupId、version 以及项目的依赖配置 dependencies 是可以被继承的，除了这 3 个元素之外，还有哪些元素可以被继承呢？

|          元素          |                             描述                             |
| :--------------------: | :----------------------------------------------------------: |
|        groupId         |                项目组 ID，项目坐标的核心元素                 |
|        version         |                 项目版本，项目坐标的核心元素                 |
|      description       |                        项目的描述信息                        |
|      organization      |                        项目的组织信息                        |
|     inceptionYear      |                        项目的创始年份                        |
|          url           |                        项目的URL地址                         |
|       developers       |                       项目的开发者信息                       |
|      contributors      |                       项目的贡献者信息                       |
| distributionManagement |                        项目的部署配置                        |
|    issueManagement     |                    项目的缺陷跟踪系统信息                    |
|      ciManagement      |                    项目的持续集成系统信息                    |
|          scm           |                    项目的版本控制系统信息                    |
|      mailingLists      |                      项目的邮件列表信息                      |
|       properties       |                      自定义的Maven属性                       |
|      dependencies      |                        项目的依赖配置                        |
|  dependencyManagement  |                      项目的依赖管理配置                      |
|      repositories      |                        项目的仓库配置                        |
|         build          | 包括项目的源码目录配置、输出目录配置、插件配置、插件管理配置等 |
|       reporting        |          包括项目的报告输出目录配置、报告插件配置等          |

## 8. pom.xml

POM（Project Object Model，项目对象模型）是 Maven 工程的基本工作单元，是一个XML文件，包含了项目的基本信息，用于描述项目如何构建、声明项目依赖，等等。

执行任务或目标时，Maven 会在当前目录中查找 POM。它读取 POM，获取所需的配置信息，然后执行目标。

POM 中可以指定以下配置：

- 项目依赖
- 插件
- 执行目标
- 项目构建 profile
- 项目版本
- 项目开发者列表
- 相关邮件列表信息

### 8.1 属性

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

### 8.2 dependencyManagement

我们知道，子模块可以通过继承获得父模块中声明的全部依赖，这样虽然避免了在各个子模块 POM 中重复进行依赖声明，但也极有可能造成子模块中引入一些不必要的依赖。为此 Maven 引入了 dependencyManagement 标签来对依赖进行管理。

dependencyManagement 具有以下 2 大特性：

- 在该元素下声明的依赖不会实际引入到模块中，只有在 dependencies 元素下同样声明了该依赖，才会引入到模块中。
- 该元素能够约束 dependencies 下依赖的使用：
  - 即 dependencies 声明的依赖若未指定版本，则使用 dependencyManagement 中指定的版本；
  - 否则将覆盖 dependencyManagement 中的版本。

以下为例，由于 dependencyManagement 元素中已经定义完整的依赖声明，所以在 dependencies 元素中声明的依赖只配置了 groupId 和 artifactId，省略了 version 和 scope：

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">

    <modelVersion>4.0.0</modelVersion>
    
    <groupId>com.chuan</groupId>
    <artifactId>root</artifactId>
    <version>1.0</version>

    <!-- 该标签只用来控制版本，不能将依赖引入 -->
    <dependencyManagement>
        <dependencies>
            ...
            <dependency>
                <groupId>log4j</groupId>
                <artifactId>log4j</artifactId>
                <version>1.2.17</version>
            </dependency>
            <dependency>
                <groupId>junit</groupId>
                <artifactId>junit</artifactId>
                <version>4.9</version>
                <!-- <scope>test</scope> -->
            </dependency>
        </dependencies>
    </dependencyManagement>

    <!-- 声明依赖：可省略 version 和 scope -->
    <dependencies>
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
        </dependency>
    </dependencies>
</project>
```

在实际的开发过程中，dependencyManagement 很少会单独使用，通常它需要与 Maven 继承或依赖范围 import 配合使用才能展现它的优势。

由于 dependencyManagement 元素是可以被继承的，因此我们可以在父模块 POM 中使用 dependencyManagement 元素声明所有子模块的依赖，然后在各个子模块 POM 使用 dependencies 元素声明实际用到的依赖即可。这样既可以让子模块能够继承父模块的依赖配置，还能避免将不必要的依赖引入到子模块中。

#### import

前文已有讲述，scope元素的值可以设置为 import，其功能是将目标 pom.xml 中的 dependencyManagement 配置导入合并到当前 pom.xml 的 dependencyManagement 中。如下，

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    
    <!-- 由于不是继承，所以必须重新添加 groupId 和 version -->
    <groupId>com.chuan</groupId>
    <artifactId>child1</artifactId>
    <version>1.0</version>

    <dependencyManagement>
        <dependencies>
            <!-- 导入依赖管理配置 -->
            <dependency>
                <groupId>com.chuan</groupId>
                <artifactId>root</artifactId>
                <version>1.0</version>
                <!-- 依赖范围为 import -->
                <scope>import</scope>
                <!-- 类型一般为pom -->
                <type>pom</type>
            </dependency>
        </dependencies>
    </dependencyManagement>
    
    <!-- 声明依赖 -->
    <dependencies>
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
        </dependency>
    </dependencies>
</project>
```

若存在多个模块，它们使用的依赖版本都是一致的，就可以定义一个使用 dependencyManagement 专门管理依赖的 POM，然后在各个模块中导入这些依赖管理配置。

### 8.3 聚合

> 在实际的开发过程中，我们所接触的项目一般都由多个模块组成。在构建项目时，如果每次都按模块一个一个地进行构建会十分得麻烦，Maven 的聚合功能很好的解决了这个问题。

使用 Maven 聚合功能对项目进行构建时，需要在该项目中额外创建一个的聚合模块，然后通过这个模块构建整个项目的所有模块。聚合模块仅仅是帮助快速聚合其他模块的工具，其本身并无任何实质内容，因此聚合模块中只有一个 POM 文件，不像其他的模块一样包含 src/main/java、src/test/java 等多个目录。

与父模块相似，聚合模块的打包方式（packaging）也是 pom，用户可以在聚合模块的 POM 中通过 modules 下的 module 子元素来添加需要聚合的模块的目录路径：

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

聚合模块在构建时，Maven 会先解析聚合模块的 POM，得到需要构建的模块，然后根据这些模块之间的关系分析出构建顺序，最后根据这个顺序依次构建各个模块。因此，参与聚合操作的模块最终执行顺序与模块间的依赖关系有关，与配置顺序无关。

构建完成后输出的是一个项目构建的小结报告，该报告中包括各个模块构建成功与否、构建花费的时间、以及整个构建构成所花费的时间等信息。

#### 继承与聚合的关系

在实际的项目中，一个模块往往既是聚合模块又是其他项目的父模块，那么 Maven 又是如何区分继承与聚合的呢？

Maven 的继承和聚合的目的不同，继承的目的是为了消除 POM 中的重复配置，聚合的目的是为了方便快速的构建项目。

- 对于继承中的父模块来说，它跟本不知道那些模块继承了它，但子模块都知道自己的父模块是谁。
- 对于聚合模块来说，它知道哪些模块被聚合了，但那些被聚合的模块根本不知道聚合模块的存在。

两者最大的共同点体现在结构和形式上，最直观的就是两者的打包方式都是 pom，两者除了 POM 外都没有实际的代码内容。

### 8.4 pluginManagement

与 dependencyManagement 对依赖进行管理类似，Maven 提供了一个名为 pluginManagement 的元素帮助用户管理 Maven 插件。

pluginManagement 元素与 dependencyManagement 元素的原理十分相似，在 pluginManagement 元素中可以声明插件及插件配置，但不会发生实际的插件调用行为，只有在 POM 中配置了真正的 plugin 元素，且其 groupId 和 artifactId 与 pluginManagement 元素中配置的插件匹配时，pluginManagement 元素的配置才会影响到实际的插件行为。

pluginManagement 同样是可继承的。当项目中的多个模块存在相同的插件时，应当将插件配置移动到父模块的 pluginManagement 元素中；即使各个模块对于同一插件的具体配置不尽相同，也建议在父模块中使用 pluginManagement 元素对插件版本进行统一声明。

### 8.5 profile

一个项目通常都会有多个不同的运行环境，例如开发环境，测试环境、生产环境等。而不同环境的构建过程很可能是不同的，例如数据源配置、插件、以及依赖的版本等。每次将项目部署到不同的环境时，都需要修改相应的配置，这样重复的工作，不仅浪费劳动力，还容易出错。为了解决这一问题，Maven 引入了 profile 的概念，通过它可以为不同的环境定制不同的构建过程。

profile 可以分为 3 个类型，它们的作用范围也各不相同：

|    类型     |                        位置                         |             有效范围              |
| :---------: | :-------------------------------------------------: | :-------------------------------: |
|   Global    | Maven 安装目录（%MAVEN_HOME%）/conf/settings.xml 中 |    对本机上所有 Maven 项目有效    |
|  Per User   |   用户主目录（％USER_HOME％）/.m2/settings.xml 中   | 对本机上该用户所有 Maven 项目有效 |
| Per Project |               Maven 项目的 pom.xml 中               |         只对当前项目有效          |

#### 声明profile

Maven 通过 profiles 元素来声明一组 profile 配置，该元素下可以包含多个 profile 子元素，每个 profile 元素表示一个 profile 配置。每个 profile 元素中通常都要包含一个 id 子元素，该元素是调用当前 profile 的标识。

定义 profile 的一般形式如下：

```xml
<profiles>
    <profile>
        <id>profile id</id>
        ....
    </profile>
    <profile>
        <id>profile id</id>
        ....
    </profile>
</profiles>
```

除此之外，profile 中还可以声明一些其他的 POM 元素，但不同位置的 profile 所能声明的 POM 元素是不同的：

- 在 pom.xml 中声明的 profile，由于其能够随着 pom.xml 一起存在，它被提交到代码仓库中，被 Maven 安装到本地仓库或远程仓库中，所以它能够修改或增加很多 POM 元素，其中其常操作的元素如下表：

  <img src="https://figure-bed.chua-n.com/Java/image-20221203085844029.png" alt="image-20221203085844029" style="zoom:50%;" />

- 在 setting.xml 中声明的 profile 是无法保证能够随着 pom.xml 一起被分发的，因此 Maven 不允许用户在该类型的 profile 修改或增加依赖或插件等配置信息，它只能声明以下范围较为宽泛的元素：

  - repositories：仓库配置；
  - pluginRepositories：插件仓库配置；
  - properties：键值对，该键值对可以在 pom.xml 中使用。

#### 激活profile

profile 可以通过以下 6 种方式激活：

- 默认激活：通过在 profile 内的 activation 标签内使用 activeByDefault 标签，如下：

  ```xml
  <activation>
      <activeByDefault>true</activeByDefault>
  </activation>
  ```

- 命令行激活：在 mvn 命令中使用参数 -P 加上 profile 的 id 来激活 profile，多个 id 之间使用逗号隔开。例如，激活 test1 和 test2 两个 profile, 命令如下：

  ```bash
  mvn clean install -Ptest1,test2
  ```

- 系统属性激活：用户可以配置当某个系统属性存在且为特定的值时，激活指定的 profile。

  - 例如，我们在 id 为 prod 的 profile 元素中添加以下配置，表示当系统属性 user 存在，且值等于 prod 时，自动激活该 profile：

    ```xml
    <profile>
        <id>prod</id>
        ...
        <activation>
            <property>
                <name>user</name>
                <value>prod</value>
            </property>
        </activation>
    </profile>
    ```

  - 执行 mvn 命令时使用 -D 选项来指定系统属性从而激活该 profile 即可：

    ```bash
    mvn clean test -Duser=prod
    ```

- 文件存在与否激活：Maven 可以根据某些文件存在与否，来决定是否激活 profile。例如，在 id 为 prod 的 profile 中添加以下配置，该配置表示当 env.prod.properties 文件存在，且 env.test.properties 文件不存在时，激活该 profile：

  ```xml
  <activation>
      <file>
          <exists>./src/main/resources/env.prod.properties</exists>
          <missing>./src/main/resources/env.test.properties</missing>
      </file>
  </activation>
  ```

- settings.xml 文件显式激活：

  ```xml
  <activeProfiles>
      <activeProfile>test</activeProfile>
  </activeProfiles>
  ```

- 操作系统环境激活：仍然在 prfile 标签内是通过activation标签，如下：

  ```xml
  <activation>
      <os>
          <name>Windows 10</name>
          <family>Windows</family>
          <arch>amd64</arch>
          <version>10.0</version>
      </os>
  </activation>
  ```

#### 示例demo

在 pom.xml 中定义三个不同的 profile，将 maven-antrun-plugin:run 目标绑定到 default 生命周期的 test 阶段上，以实现在不同的 profile 中进行不同的操作。

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    ...

    <dependencies>
        ...
    </dependencies>

    <profiles>
        <!--test 环境配置  -->
        <profile>
            <id>test</id>
            <activation>
                <property>
                    <name>env</name>
                    <value>test</value>
                </property>
            </activation>
            <build>
                <plugins>
                    <plugin>
                        <groupId>org.apache.maven.plugins</groupId>
                        <artifactId>maven-antrun-plugin</artifactId>
                        <version>1.3</version>
                        <executions>
                            <execution>
                                <phase>test</phase>
                                <goals>
                                    <goal>run</goal>
                                </goals>
                                <configuration>
                                    <tasks>
                                        <!--输出  -->
                                        <echo>
                                            使用 env.test.properties，将其配置信息复制到 user.properties 中
                                        </echo>
                                        <!-- 在 target\calsses 目录下生成user.properties -->
                                        <!--  env.test.properties 的内容复制到user.properties中-->
                                        <copy file="src/main/resources/env.test.properties"
                                              tofile="${project.build.outputDirectory}/user.properties"/>
                                    </tasks>
                                </configuration>
                            </execution>
                        </executions>
                    </plugin>
                </plugins>
            </build>
        </profile>
        
        <!-- 默认环境配置 -->
        <profile>
            <id>normal</id>
            <build>
                <plugins>
                    <plugin>
                        <groupId>org.apache.maven.plugins</groupId>
                        <artifactId>maven-antrun-plugin</artifactId>
                        <version>1.3</version>
                        <executions>
                            <execution>
                                <phase>test</phase>
                                <goals>
                                    <goal>run</goal>
                                </goals>
                                <configuration>
                                    <tasks>
                                        <echo>
                                            使用 env.properties，将其配置信息复制到 user.properties 中
                                        </echo>
                                        <!-- 在target\calsses 目录下生成user.properties -->
                                        <!--  env.properties 的内容复制到user.properties中-->
                                        <copy file="src/main/resources/env.properties"
                                              tofile="${project.build.outputDirectory}/user.properties"/>
                                    </tasks>
                                </configuration>
                            </execution>
                        </executions>
                    </plugin>
                </plugins>
            </build>
        </profile>
        
        <!--生产环境配置  -->
        <profile>
            <id>prod</id>
            <build>
                <plugins>
                    <plugin>
                        <groupId>org.apache.maven.plugins</groupId>
                        <artifactId>maven-antrun-plugin</artifactId>
                        <version>1.3</version>
                        <executions>
                            <execution>
                                <phase>test</phase>
                                <goals>
                                    <goal>run</goal>
                                </goals>
                                <configuration>
                                    <tasks>
                                        <echo>
                                            使用 env.prod.properties，将其配置信息复制到 user.properties 中
                                        </echo>
                                        <!-- 在target\calsses 目录下生成user.properties -->
                                        <!--  env.prod.properties 的内容复制到user.properties中-->
                                        <copy file="src/main/resources/env.prod.properties"
                                              tofile="${project.build.outputDirectory}/user.properties"/>
                                    </tasks>
                                </configuration>
                            </execution>
                        </executions>
                    </plugin>
                </plugins>
            </build>
        </profile>
    </profiles>
</project>
```

### 8.6 标签大全

详见

- [Maven POM | 菜鸟教程 (runoob.com)](https://www.runoob.com/maven/maven-pom.html)
- [Maven 入门笔记 | 小丁的个人博客 (tding.top)](https://tding.top/archives/4736a5f5.html)

## 9. settings.xml

settings.xml是maven的全局配置文件。而pom.xml文件是所在项目的局部配置。settings.xml中包含类似本地仓储位置、修改远程仓储服务器、认证信息等配置。

顶级元素概览：

```xml
<settings xmlns="http://maven.apache.org/SETTINGS/1.0.0"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.0.0
                          https://maven.apache.org/xsd/settings-1.0.0.xsd">
  <localRepository/>
  <interactiveMode/>
  <usePluginRegistry/>
  <offline/>
  <pluginGroups/>
  <servers/>
  <mirrors/>
  <proxies/>
  <profiles/>
  <activeProfiles/>
</settings>
```

### 9.1 LocalRepository

作用：该值表示构建系统本地仓库的路径。其默认值：~/.m2/repository。

```xml
<localRepository>${user.home}/.m2/repository</localRepository>
```

### 9.2 InteractiveMode

作用：表示maven是否需要和用户交互以获得输入。如果maven需要和用户交互以获得输入，则设置成true，反之则应为false。默认为true。

```xml
<interactiveMode>true</interactiveMode>
```

### 9.3 UsePluginRegistry

作用：maven是否需要使用plugin-registry.xml文件来管理插件版本。

如果需要让maven使用文件~/.m2/plugin-registry.xml来管理插件版本，则设为true；默认为false。

```xml
<usePluginRegistry>false</usePluginRegistry>
```

### 9.4 Offline

作用：表示maven是否需要在离线模式下运行。如果构建系统需要在离线模式下运行，则为true，默认为false。

当由于网络设置原因或者安全因素，构建服务器不能连接远程仓库的时候，该配置就十分有用。

```xml
<offline>false</offline>
```

### 9.5 PluginGroups

作用：当插件的 groupId 没有显式提供时，供搜寻插件 groupId 的列表。该元素包含一个 pluginGroup 元素列表，每个子元素包含了一个 groupId。

当我们使用某个插件，并且没有在命令行为其提供 groupId 的时候，Maven就会使用该列表。默认情况下该列表包含了`org.apache.maven.plugins`和`org.codehaus.mojo`。

```xml
<settings xmlns="http://maven.apache.org/SETTINGS/1.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.0.0
                      https://maven.apache.org/xsd/settings-1.0.0.xsd">
  ...
  <pluginGroups>
    <!--plugin的组织Id（groupId） -->
    <pluginGroup>org.codehaus.mojo</pluginGroup>
  </pluginGroups>
  ...
</settings>
```

### 9.6 Servers

大部分远程仓库无须认证就可以访问，但是有时候处于安全方面的因素考虑，需要提供认证信息才能访问一些远程仓库，处于安全考虑，认证信息一般只放在 `settings.xml` 中，通过 server 进行配置：

> 这里的关键是 id，这个 id 必须与需要认证的 repository 元素的 id 完全一致才行，换句话说，正是这个 id 将认证信息和仓库配置联系在了一起。

```xml
<settings xmlns="http://maven.apache.org/SETTINGS/1.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.0.0
                      https://maven.apache.org/xsd/settings-1.0.0.xsd">
  ...
  <!--配置服务端的一些设置。一些设置如安全证书不应该和pom.xml一起分发。这种类型的信息应该存在于构建服务器上的settings.xml文件中。 -->
  <servers>
    <!--服务器元素包含配置服务器时需要的信息 -->
    <server>
      <!--这是server的id（注意不是用户登陆的id），此 id 与 repository 元素的id相匹配。 -->
      <id>server001</id>
      <!--鉴权用户名。鉴权用户名和鉴权密码表示服务器认证所需要的登录名和密码。 -->
      <username>my_login</username>
      <!--鉴权密码 。鉴权用户名和鉴权密码表示服务器认证所需要的登录名和密码。密码加密功能已被添加到2.1.0 +。详情请访问 https://maven.apache.org/guides/mini/guide-encryption.html#How_to_encrypt_server_passwords -->
      <password>my_password</password>
      <!--鉴权时使用的私钥位置。和前两个元素类似，私钥位置和私钥密码指定了一个私钥的路径（默认是${user.home}/.ssh/id_dsa）以及如果需要的话，一个密语。将来passphrase和password元素可能会被提取到外部，但目前它们必须在settings.xml文件以纯文本的形式声明。 -->
      <privateKey>${usr.home}/.ssh/id_dsa</privateKey>
      <!--鉴权时使用的私钥密码。 -->
      <passphrase>some_passphrase</passphrase>
      <!--文件被创建时的权限。如果在部署的时候会创建一个仓库文件或者目录，这时候就可以使用权限（permission）。这两个元素合法的值是一个三位数字，其对应了unix文件系统的权限，如664，或者775。 -->
      <filePermissions>664</filePermissions>
      <!--目录被创建时的权限。 -->
      <directoryPermissions>775</directoryPermissions>
    </server>
  </servers>
  ...
</settings>
```

### 9.7 Mirrors

为仓库列表配置的下载镜像列表。

```xml
<settings xmlns="http://maven.apache.org/SETTINGS/1.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.0.0
                      https://maven.apache.org/xsd/settings-1.0.0.xsd">
  ...
  <mirrors>
    <!-- 给定仓库的下载镜像。 -->
    <mirror>
      <!-- 该镜像的唯一标识符。id用来区分不同的mirror元素。 -->
      <id>planetmirror.com</id>
      <!-- 镜像名称 -->
      <name>PlanetMirror Australia</name>
      <!-- 该镜像的URL。构建系统会优先考虑使用该URL，而非使用默认的服务器URL。 -->
      <url>http://downloads.planetmirror.com/pub/maven2</url>
      <!-- 被镜像的服务器的id。例如，如果我们要设置了一个Maven中央仓库（http://repo.maven.apache.org/maven2/）的镜像，就需要将该元素设置成central。这必须和中央仓库的id central完全一致。 -->
      <mirrorOf>central</mirrorOf>
    </mirror>
  </mirrors>
  ...
</settings>
```

### 9.8 Proxies

作用：用来配置不同的代理。

```xml
<settings xmlns="http://maven.apache.org/SETTINGS/1.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.0.0
                      https://maven.apache.org/xsd/settings-1.0.0.xsd">
  ...
  <proxies>
    <!--代理元素包含配置代理时需要的信息 -->
    <proxy>
      <!--代理的唯一定义符，用来区分不同的代理元素。 -->
      <id>myproxy</id>
      <!--该代理是否是激活的那个。true则激活代理。当我们声明了一组代理，而某个时候只需要激活一个代理的时候，该元素就可以派上用处。 -->
      <active>true</active>
      <!--代理的协议。 协议://主机名:端口，分隔成离散的元素以方便配置。 -->
      <protocol>http</protocol>
      <!--代理的主机名。协议://主机名:端口，分隔成离散的元素以方便配置。 -->
      <host>proxy.somewhere.com</host>
      <!--代理的端口。协议://主机名:端口，分隔成离散的元素以方便配置。 -->
      <port>8080</port>
      <!--代理的用户名，用户名和密码表示代理服务器认证的登录名和密码。 -->
      <username>proxyuser</username>
      <!--代理的密码，用户名和密码表示代理服务器认证的登录名和密码。 -->
      <password>somepassword</password>
      <!--不该被代理的主机名列表。该列表的分隔符由代理服务器指定；例子中使用了竖线分隔符，使用逗号分隔也很常见。 -->
      <nonProxyHosts>*.google.com|ibiblio.org</nonProxyHosts>
    </proxy>
  </proxies>
  ...
</settings>
```

### 9.9 Profiles

作用：根据环境参数来调整构建配置的列表。

`settings.xml`中的`profile`元素是`pom.xml`中`profile`元素的**裁剪版本**。它包含了`id`、`activation`、`repositories`、`pluginRepositories`和 `properties`元素。这里的profile元素只包含这五个子元素是因为这里只关心构建系统这个整体（这正是settings.xml文件的角色定位），而非单独的项目对象模型设置。

如果一个`settings.xml`中的`profile`被激活，它的值会覆盖任何其它定义在`pom.xml`中带有相同id的`profile`。

```xml
<settings xmlns="http://maven.apache.org/SETTINGS/1.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.0.0
                      https://maven.apache.org/xsd/settings-1.0.0.xsd">
  ...
  <profiles>
    <profile>
      <!-- profile的唯一标识 -->
      <id>test</id>
      <!-- 自动触发profile的条件逻辑 -->
      <activation />
      <!-- 扩展属性列表 -->
      <properties />
      <!-- 远程仓库列表 -->
      <repositories />
      <!-- 插件仓库列表 -->
      <pluginRepositories />
    </profile>
  </profiles>
  ...
</settings>
```

#### activation

作用：自动触发`profile`的条件逻辑。

如`pom.xml`中的`profile`一样，`profile`的作用在于它能够在某些特定的环境中自动使用某些特定的值；这些环境通过`activation`元素指定。

`activation`元素并不是激活`profile`的唯一方式。`settings.xml`文件中的`activeProfile`元素可以包含`profile`的`id`。`profile`也可以通过在命令行，使用`-P`标记和逗号分隔的列表来显式的激活（如`-P test`）。

```xml
<activation>
  <!--profile默认是否激活的标识 -->
  <activeByDefault>false</activeByDefault>
  <!--当匹配的jdk被检测到，profile被激活。例如，1.4激活JDK1.4，1.4.0_2，而!1.4激活所有版本不是以1.4开头的JDK。 -->
  <jdk>1.5</jdk>
  <!--当匹配的操作系统属性被检测到，profile被激活。os元素可以定义一些操作系统相关的属性。 -->
  <os>
    <!--激活profile的操作系统的名字 -->
    <name>Windows XP</name>
    <!--激活profile的操作系统所属家族(如 'windows') -->
    <family>Windows</family>
    <!--激活profile的操作系统体系结构 -->
    <arch>x86</arch>
    <!--激活profile的操作系统版本 -->
    <version>5.1.2600</version>
  </os>
  <!--如果Maven检测到某一个属性（其值可以在POM中通过${name}引用），其拥有对应的name = 值，Profile就会被激活。如果值字段是空的，那么存在属性名称字段就会激活profile，否则按区分大小写方式匹配属性值字段 -->
  <property>
    <!--激活profile的属性的名称 -->
    <name>mavenVersion</name>
    <!--激活profile的属性的值 -->
    <value>2.0.3</value>
  </property>
  <!--提供一个文件名，通过检测该文件的存在或不存在来激活profile。missing检查文件是否存在，如果不存在则激活profile。另一方面，exists则会检查文件是否存在，如果存在则激活profile。 -->
  <file>
    <!--如果指定的文件存在，则激活profile。 -->
    <exists>${basedir}/file2.properties</exists>
    <!--如果指定的文件不存在，则激活profile。 -->
    <missing>${basedir}/file1.properties</missing>
  </file>
</activation>
```

> 注：在maven工程的pom.xml所在目录下执行`mvn help:active-profiles`命令可以查看中央仓储的profile是否在工程中生效。

#### properties

**作用**：对应`profile`的扩展属性列表。
maven属性和ant中的属性一样，可以用来存放一些值。这些值可以在`pom.xml`中的任何地方使用标记`${X}`来使用，这里X是指属性的名称。属性有五种不同的形式，并且都能在settings.xml文件中访问。

```xml
<!-- 
  1. env.X: 在一个变量前加上"env."的前缀，会返回一个shell环境变量。例如,"env.PATH"指代了$path环境变量（在Windows上是%PATH%）。 
  2. project.x：指代了POM中对应的元素值。例如: <project><version>1.0</version></project>通过${project.version}获得version的值。 
  3. settings.x: 指代了settings.xml中对应元素的值。例如：<settings><offline>false</offline></settings>通过 ${settings.offline}获得offline的值。 
  4. Java System Properties: 所有可通过java.lang.System.getProperties()访问的属性都能在POM中使用该形式访问，例如 ${java.home}。 
  5. x: 在<properties/>元素中，或者外部文件中设置，以${someVar}的形式使用。
 -->
<properties>
  <user.install>${user.home}/our-project</user.install>
</properties>
```

注：如果该profile被激活，则可以在`pom.xml`中使用`${user.install}`。

#### repositories

作用：远程仓库列表，它是maven用来填充构建系统本地仓库所使用的一组远程仓库。

- 可以声明多个 repository。
- id 必须是唯一的，尤其注意，Maven 自带的中央仓库使用的 id 为 `central`，如果其他仓库声明也用该 id，就会覆盖中央仓库的配置。

```xml
<repositories>
  <!--包含需要连接到远程仓库的信息 -->
  <repository>
    <!--远程仓库唯一标识 -->
    <id>codehausSnapshots</id>
    <!--远程仓库名称 -->
    <name>Codehaus Snapshots</name>
    <!--如何处理远程仓库里发布版本的下载 -->
    <releases>
      <!--true或者false表示该仓库是否为下载某种类型构件（发布版，快照版）开启。 -->
      <enabled>false</enabled>
      <!--该元素指定更新发生的频率。Maven会比较本地POM和远程POM的时间戳。这里的选项是：always（一直），daily（默认，每日），interval：X（这里X是以分钟为单位的时间间隔），或者never（从不）。 -->
      <updatePolicy>always</updatePolicy>
      <!--当Maven验证构件校验文件失败时该怎么做-ignore（忽略），fail（失败），或者warn（警告）。 -->
      <checksumPolicy>warn</checksumPolicy>
    </releases>
    <!--如何处理远程仓库里快照版本的下载。有了releases和snapshots这两组配置，POM就可以在每个单独的仓库中，为每种类型的构件采取不同的策略。例如，可能有人会决定只为开发目的开启对快照版本下载的支持。参见repositories/repository/releases元素 -->
    <snapshots>
      <enabled />
      <updatePolicy />
      <checksumPolicy />
    </snapshots>
    <!--远程仓库URL，按protocol://hostname/path形式 -->
    <url>http://snapshots.maven.codehaus.org/maven2</url>
    <!--用于定位和排序构件的仓库布局类型-可以是default（默认）或者legacy（遗留）。Maven 2为其仓库提供了一个默认的布局；然而，Maven 1.x有一种不同的布局。我们可以使用该元素指定布局是default（默认）还是legacy（遗留）。 -->
    <layout>default</layout>
  </repository>
</repositories>
```

#### pluginRepositories

作用：发现插件的远程仓库列表。和`repository`类似，只是`repository`是管理jar包依赖的仓库，`pluginRepositories`则是管理插件的仓库。

maven插件是一种特殊类型的构件。由于这个原因，插件仓库独立于其它仓库。`pluginRepositories`元素的结构和`repositories`元素的结构类似。每个`pluginRepository`元素指定一个Maven可以用来寻找新插件的远程地址。

```xml
<pluginRepositories>
  <!-- 包含需要连接到远程插件仓库的信息.参见profiles/profile/repositories/repository元素的说明 -->
  <pluginRepository>
    <releases>
      <enabled />
      <updatePolicy />
      <checksumPolicy />
    </releases>
    <snapshots>
      <enabled />
      <updatePolicy />
      <checksumPolicy />
    </snapshots>
    <id />
    <name />
    <url />
    <layout />
  </pluginRepository>
</pluginRepositories>
```

### 9.10 ActiveProfiles

作用：手动激活profiles的列表，按照`profile`被应用的顺序定义`activeProfile`。

该元素包含了一组`activeProfile`元素，每个`activeProfile`都含有一个profile id。任何在`activeProfile`中定义的profile id，不论环境设置如何，其对应的 `profile`都会被激活。如果没有匹配的`profile`，则什么都不会发生。

例如，env-test是一个activeProfile，则在pom.xml（或者profile.xml）中对应id的profile会被激活。如果运行过程中找不到这样一个profile，Maven则会像往常一样运行。

```xml
<settings xmlns="http://maven.apache.org/SETTINGS/1.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.0.0
                      https://maven.apache.org/xsd/settings-1.0.0.xsd">
  ...
  <activeProfiles>
    <!-- 要激活的profile id -->
    <activeProfile>env-test</activeProfile>
  </activeProfiles>
  ...
</settings>
```
