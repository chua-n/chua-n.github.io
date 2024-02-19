---
title: Hexo-Next + GitHub + Gitee 搭建个人博客
date: 2021-01-07 15:07:51
categories: Hexo
---

采用博客搭建框架 Hexo(v5.3.0)、选用博客主题 Next(v7.8.0)、利用 GitHub 的 Pages 功能作为后端服务、使用 Gitee 的 pages 功能作为博客图床，本文可以免费搭建出一个简洁大方的个人博客。此外，若想更进一步，希望通过个人定制化域名访问博客，可以选择在华为云/阿里云等域名服务商处购买个人域名后，进行简单的映射配置即可。

> 注：Hexo 博客采用 markdown 语法进行文章内容书写。

<!-- more -->

## 1. 基础设施

整个过程所需依赖工具如下（均免费）：

-   Node.js (版本：最低>=10.13, 建议>=12.0)
-   npm
-   Git
-   GitHub 账户
-   Gitee 账户

### 1.1. Node.js

Hexo 框架基于 Node.js，Next 主题是基于 Hexo 的优秀第三方主题，因此要安装 Hexo 首先需安装 Node.js。所谓 Node.js，它不是一门编程语言，而是编程语言 JavaScript（简称 js，运行在浏览器中的编程语言）的运行时环境，好比 JRE 之于 Java。有了 Node.js，js 的代码不必非要在 V8 JavaScript 引擎（Google Chrome 的内核）中运行了，可以通过这个 nodejs 来解析执行，通俗地讲，nodejs 对 chrome 内核进行了封装，因此可以脱离浏览器执行 js 代码。

windows 系统在 [nodejs 官网](https://nodejs.org/zh-cn/)下载安装包，linux 系统这里以 ubuntu 为例，使用命令 `sudo apt install nodejs` 即可安装（不过版本为 v10.19.0，勉强满足要求）。

### 1.2. npm

npm(node package management)，即 nodejs 的包管理器（nodejs 通常也称作 node），好比 pip 之于 python 吧。

如果你在上步是通过 windows 安装的 nodejs，那么 npm 工具已经随 nodejs 安装好了，不必再进行操作；如果你是 linux 下进行的安装，再执行额外的命令`sudo apt install npm`吧，我这里自动安装的版本是 v6.14.4。

### 1.3. Git

安装版本控制工具 Git，是一个编程界几乎无人不知无人不晓的工具了，安装流程咨询搜索引擎或参考[廖雪峰的这一页教程](https://www.liaoxuefeng.com/wiki/896043488029600/896067074338496)即可，这里不再赘述，不过提醒你配置好在 Git 中的姓名和邮箱。

### 1.4. GitHub 和 Gitee 账户

两者名称中打头的“Git”即缘自上一步提及的 Git，GitHub 和 Gitee 是用 Git 管理你的代码的云端存储仓库，Gitee 其实是 GitHub 的国内山寨版，风格、界面、操作几乎一模一样。

GitHub 和 Gitee 都提供免费的 pages 服务，所谓的 [pages](https://www.baidu.com/link?url=els0W6Bd92GOMdr_r84LrqCpKPR10Iy_jiKgK1SPYhO5zBOOffTngA99ocKeFqOt_buq2pOAN9XbUUcIkgROBSsFwM_dThgGt6HE6-m1UCDhQ3taP2udYnjBoeivseBP&wd=&eqid=a1a54f2a0000076f000000035ff6c65a) 是一个免费的静态网页托管服务，可以用来托管博客、项目官网等静态网页，本文所谈的博客搭建正是基于 GitHub 的 pages。简而言之，你用这个 pages 服务搭好你的博客内容后，你就拥有了一个博客主页：username.github.io 或 username.gitee.io，其中 username 是注册的 GitHub 或 Gitee 账户的用户名，比如笔者的博客网址就是 [chua-n.github.io](https://chua-n.github.io/)。至于为什么不用 Gitee 的 pages，只是因为它现在不再支持免费的自定义域名，而我希望使用自定义域名来访问我的博客，比如在浏览器输入地址 www.chua-n.com ，也可以进入我的博客，和 chua-n.github.io 是一模一样的。

那为什么用了 GitHub 还要使用 Gitee 呢？原因在于 GitHub 毕竟是国外的产品，服务器在中国境外，作为全世界 IT 工程师的核心交流社区虽未被墙，但在其中访问图片资源的时候效率极其低下，博客中的图片经常加载不出来，因此国内网络上有很多寻找各种“图床”（一个在网络上存储你的图片的地方，以便你在博客中引用该图片时能够正常显示，可理解为公开的网盘吧）的帖子，这些帖子最常提到的图床有七牛云（免费 10G 空间）、腾讯云（不了解）、微博相册（不了解）等等，它们往往有空间有限、面临收费或正在收费、每日上/下载流量有限等问题。因此笔者脑门一激灵，想着 GitHub 和 Gitee 均作为重要的开源免费社区，既然图片能免费存在 GitHub 上，只是影响博客加载效率，何不单独将图片存储在 Gitee 中再引用呢？于是又用到了 Gitee。

说了这么多，其实这一步实际去做的就两件事，分别注册一个 [GitHub](https://github.com/) 和 [Gitee](https://gitee.com/) 账户即可。

## 2. 搭建博客框架

以下内容涉及到命令行的，Windows 下均建议在 git bash 中运行，不建议 cmd。

### 2.1. 安装 Hexo 并创建博客目录

> 这一步亦可参考[官网介绍](https://hexo.io/zh-cn/docs/setup)。

```bash
# 安装Hexo
npm install -g hexo-cli
# 在本地你希望的地方创建一个空文件夹，取任意名，这里命名为blog
mkdir blog
# 使用Hexo初始化刚刚创建的博客目录
hexo init blog
# 进入博客目录并使用npm安装所需依赖
cd blog
npm install
```

此步完成后，你的 blog 文件夹下的目录结构应该如下，其中比较重要的目录/文件已添加`#`注释。

```bash
blog/
├── _config.landscape.yml # hexo默认主题landscape的配置文件：一般不需关注
├── _config.yml # 网站（博客）的配置文件：可以在此配置大部分参数
├── node_modules # node模块文件夹：存放安装的hexo扩展
│   ├── JSONStream
│   ├── a-sync-waterfall
│   ├── abbrev
│   ├── accepts
│   ├── amdefine
│   ├── ansi-regex
│   ├── ansi-styles
│   ├── ...
├── package-lock.json
├── package.json # 博客使用的包的信息：如hexo的版本、npm扩展的版本
├── scaffolds # 模板文件夹：新建相应文稿时会套用这里存储的模板
│   ├── draft.md # 草稿模板：文章草稿，不会发表在博客中
│   ├── page.md # 页面模板：创建新页面时使用，如tags/categoreis/about
│   └── post.md # 正式文章模板：会展示在博客中
├── source # 资源文件夹：存储你的博客文章、图片等
│   └── _posts # 存放博客文章的地方
│       └── hello-world.md # 默认生成的第一篇博文
└── themes # 主题文件夹：存放你下载的各种主题，如后面要使用的next
```

至此，博客其实已具雏形，命令行输入

```bash
hexo server
```

即可在本地浏览器中输入网站 http://localhost:4000 浏览你的博客，由于没有自己的文章，默认只有一篇 hexo 自带的博文`blog/source/_posts/hello-world.md`，所以主页显示如下:
![](https://chua-n.gitee.io/figure-bed/notebook/blog/hexo搭博客/hexo-default.jpeg)

### 2.2. 设置站点信息

此时博客展示出的内容均是 Hexo 默认内容，尚未体现出个人属性，下面简单更改一些内容作为尝鲜。

更改博客根目录下的`_config.yml`文件，找到开头的站点配置选项如下：

```yml
# Site
title: Hexo
subtitle: ""
description: ""
keywords:
author: John Doe
language: en
timezone: ""
```

选项分别代表所建网站的**名字、附标题、描述语句、关键词、拥有者、语言、时区**，可以根据含义更改为自己需要的信息，比如我这里更改如下：

```yml
# Site
title: 这里是川！
subtitle: ""
description: 合抱之木，生于毫末。
keywords: NaniNani
author: 荒流
language: zh-CN
timezone: Asia/Shanghai
```

为了稍微体验一下博文的书写，再捎带更改一下 Hexo 自带的文章 hello-world.md，在文件的最后**隔开一行**后添加如下内容：

````markdown
## 我创作的内容

暂时也没啥好写的，就体验一下**代码展示**吧。

```python
import random


def fitPi(trialTimes: int) -> float:
    """Calculate Pi by probabilistic statistics.
    """
    nInCircle = 0
    for _ in range(trialTimes):
        x = random.uniform(-1, 1)
        y = random.uniform(-1, 1)
        if x**2 + y**2 <= 1:
            nInCircle += 1
    pi = 4 * nInCircle / trialTimes
    return pi


if __name__ == "__main__":
    pi = fitPi(1000000)
    print(pi)
```
````

更改完成后，重新生成博客站点静态文件并启动后台服务：

```bash
hexo generate
hexo server
```

效果如下：
![](https://chua-n.gitee.io/figure-bed/notebook/blog/hexo搭博客/hexo-written.jpeg)

### 2.3. Hexo 基本命令

上面已经用到了几条 hexo 命令，这里概括介绍玩 hexo 的 5 条常用命令，它们足够满足日常需求。如果需要更多的 Hexo 细节使用指南，可以参考[官网](https://hexo.io/zh-cn/docs/commands)。

-   `hexo init [folder]`
    将一个文件夹 folder 初始化为 hexo 博客目录
-   `hexo generate`
    根据你配置的 config 与写的 markdown 文章生成构建网站的 html 页面，此时博客目录下产生 public 文件夹，存放这些生成的内容
-   `hexo server`
    将生成的博客网页挂载在本地主机 IP 的 4000 端口上，此时可在浏览器内通过 http://localhost:4000 访问你的博客
-   `hexo deploy`
    将生成的网页部署到你设定的公网地址，一般就是你的 GitHub pages 地址
-   `hexo clean`
    清除缓存文件(db.json)和已生成的 public 目录下的静态文件，此命令主要用在某些情况下（尤其是更换了博客主题后），你发现无论如何更改站点配置博客内容也不发生变化的时候

### 2.4. 下载并开启 Next 主题

Hexo 自带的主题不好看，笔者选择使用 Next 主题。在博客路径下通过 Git 拉取 Next 主题的源代码，并放置于`themes/`目录下：

```bash
git clone https://github.com/theme-next/hexo-theme-next themes/next
```

然后通过博客根目录下的`_config.yml`配置文件更改主题：打开配置文件，搜索并找到 theme 配置选项，差不多在 101 行的位置：

```yml
 98 # Extensions
 99 ## Plugins: https://hexo.io/plugins/
100 ## Themes: https://hexo.io/themes/
101 theme: landscape
```

将 Hexo 默认的 landscape 主题改为 next 即可：

```yml
 98 # Extensions
 99 ## Plugins: https://hexo.io/plugins/
100 ## Themes: https://hexo.io/themes/
101 theme: next
```

此时再来预览一下 Next 主题下的你的博客：

```bash
hexo clean # 因为这里切换了主题，最好先clean一下缓存
hexo generate
hexo server
```

![](https://chua-n.gitee.io/figure-bed/notebook/blog/hexo搭博客/next.jpeg)

依然很丑？没关系，它已经种下了美的种子，后面会被逐步雕刻起来的，而且不会有多麻烦。

## 3. 部署到互联网

之前的步骤已经可以在本地看到你的博客了，下面开始利用 GitHub Pages 将博客发布到互联网上，并创建 Gitee Pages 作为博客图床。

### 3.1. 创建 GitHub Pages

网上教程很多，可自己求助搜索引擎（或参考[官网介绍](https://pages.github.com/)），同样不多费口舌，只是强调一番：若只是创建一个 pages 服务，仓库的名字虽然可以是任意的，但此时此刻，还是建议你最好将仓库的名字命名为 _username.github.io_ ，除非你明确知道不这么做意味着什么。

总而言之，于我而言，因为我的 GitHub 账户名为 chua-n，这一步我创建了一个[名为 chua-n.github.io 的仓库](https://github.com/chua-n/chua-n.github.io)，至于有没有把这个仓库下载到本地倒无甚所谓。

### 3.2. 创建 Gitee Pages

操作同上，只是这里不再强制你将仓库名命名为*username.gitee.io*，事实上，这里建议你不要这么做，因为这个仓库只是作为一个图床向博客提供引用权限，更建议你以类似*blog-images*的方式命名，比如[我这样的](https://gitee.com/chua-n/blog-images)。

与上相反，Gitee 的这个仓库则需要将其下载到本地了，因为后边需要在本地上向上传输图片。我这里暂时将下载到本地的仓库文件夹放置到搭建好的 Hexo 博客目录下，其实放哪里无所谓，我只是为了方便管理。

```bash
$ cd blog # 进入博客根目录
$ git clone https://gitee.com/chua-n/blog-images.git # 将Gitee仓库下载到本地
# 查看博客目录结构（可能你没有安装 tree 命令，可忽略这条命令手动查看）
$ tree -L 1 blog/
blog/
├── _config.landscape.yml
├── _config.yml
├── blog-images # 我的Gitee仓库对应的文件夹
├── db.json
├── node_modules
├── package-lock.json
├── package.json
├── public
├── scaffolds
├── source
└── themes

6 directories, 5 files
```

### 3.3. 对博客进行相应配置

> 这一步也可参考[官方文档](https://hexo.bootcss.com/docs/one-command-deployment.html)的 Git 部分。

#### 3.3.1. 配置 deploy 选项

打开根目录下的`_config.yml`配置文件，搜索并找到`deploy`选项，如下：

```yml
# Deployment
## Docs: https://hexo.io/docs/one-command-deployment
deploy:
    type: ""
```

修改为:

```yml
# Deployment
## Docs: https://hexo.io/docs/one-command-deployment
deploy:
    type: git
    repository: git@github.com:username/username.github.io.git
    branch: main
```

其中 `repository` 为你的 GitHub Pages 仓库的 SSH 链接，正常只需将其中的 username 改为你的账户名即可，比如我的`git@github.com:chua-n/chua-n.github.io.git`；`branch` 选项的值一般填 `main` 或 `master`，因为我是新创建的博客，Git 已经把 git 主分支名默认为 main，但很多以前建博客的帖子会填 master，无关紧要（当然如果你明确 git 分支管理的技术，可以任意填你设定的分支名）。

#### 3.3.2. 添加 SSH key

因为上步配置`deploy`选项时用到了 GitHub 仓库的 SSH 链接，要在本地电脑上使用连接这个链接必须给 GitHub 添加你的电脑对应的 SSH key。所谓 SSH key，是 [SSH 网络传输协议](https://baike.baidu.com/item/ssh/10407?fr=aladdin)的密钥，SSH 连接的两端必须拥有对方的密钥才能确保“对方是对方”而不是别人，也就是你要想连接 GitHub 的远程仓库，GitHub 的服务器必须确保这个试图进行连接的操作是你发起的，而不是恶意的第三方，以保障你仓库的安全。

添加 SSH key 的教程亦有很多，可参见[廖雪峰](https://www.liaoxuefeng.com/wiki/896043488029600/896954117292416).

> 附：关于 SSH key 还可阅读[这里的简介](http://www.findme.wang/blog/detail/id/376.html)。

#### 3.3.3. 安装部署插件

在博客根目录下运行：

```bash
npm install hexo-deployer-git --save
```

### 3.4. 启动

博客根目录下使用`hexo deploy`命令，即可将本地搭好的博客一键部署到 GitHub pages 上，此时任意人通过浏览器访问你的 pages 地址，即`username.github.io`即可看到互联网上你的博客，与`hexo server`在本地的显示效果一致。

值得一提的是，`hexo deploy`命令执行时，Hexo 会将`public`目录下的文件和目录推送到你配置的仓库和分支中，并且**完全覆盖**该分支下的已有内容。

## 4. 美化主题

根目录和每个主题文件夹下都有一个`_config.yml`配置文件，分别管理站点信息和主题信息，为了后面的描述方便，从现在起我们定义两个概念：

-   **站点配置文件**：博客根目录/\_config.yml
-   **主题配置文件**：博客根目录/themes/next/\_config.yml

同时，修改配置文件时，不再啰里吧嗦地去说“搜索并修改###参数、大概在###行”，仅会强调修改的是哪个配置文件。

后面的内容比较琐碎，慢工出细活~

> 附：Next 主题的[官方文档](http://theme-next.iissnan.com/)也值得学习。

### 4.1. 博客的基本信息

位于站点配置文件，在“2.2 节设置站点信息”处其实已有说明。

### 4.2. 选择 Next 样式

Next 主题本身还提供了 4 种样式方案，默认为`muse`，可以通过**主题配置文件**修改为自己喜欢的风格，这里我选择`Gemini`，把其它选项注释掉即可：

```yml
# Schemes
#scheme: Muse
#scheme: Mist
#scheme: Pisces
scheme: Gemini
```

### 4.3. 开启其他页面选项

在博客的主体中，除了有主页 home，归档 archive 之外，还有一些页面可供选择，如标签 tags 页面、分类 categories 页面、自我介绍 about 页面等，可通过在**主题配置文件**的`menu`选项中取消相关注释开启该页面，每一行后面的`||`符号是该页面选项上对应的 logo 图标。

```yml
menu:
    home: / || fa fa-home
    about: /about/ || fa fa-user
    tags: /tags/ || fa fa-tags
    categories: /categories/ || fa fa-th
    archives: /archives/ || fa fa-archive
    #schedule: /schedule/ || fa fa-calendar
    #sitemap: /sitemap.xml || fa fa-sitemap
    #commonweal: /404/ || fa fa-heartbeat
```

### 4.4. 创建 tags/categories/about 页面

以 tags 页面为例，三者方式几乎一致。

```bash
hexo new page tags
```

然后打开`source/tags/index.md`：

```markdown
---
title: tags
date: 2021-01-08 22:02:34
---
```

其中 title 选项叫什么不要紧，重要的是添加一个 type 选项说明这个页面的类型是 tags/categories/about：

```markdown
---
title: tags
date: 2021-01-08 22:02:34
type: tags
---
```

tags 页面和 categores 页面是通过**自动汇总每一篇博文中定义的标签或分类**进行展示的，对于 about 页面，直接在它对应的 `index.md` 里添加自我介绍的内容即可在 about 页面进行展示。

### 4.5. 编辑社交链接

在**主题配置文件**的 social 选项中通过注释/反注释进行开启/关闭，也可自己添加其他社交链接并选择一个合适的 logo。

```yml
# Social Links
# Usage: `Key: permalink || icon`
# Key is the link label showing to end users.
# Value before `||` delimiter is the target permalink, value after `||` delimiter is the name of Font Awesome icon.
social:
    GitHub: https://github.com/chua-n || fab fa-github
    E-Mail: mailto:chua_n@qq.com || fa fa-envelope
    #Weibo: https://weibo.com/yourname || fab fa-weibo
    #Google: https://plus.google.com/yourname || fab fa-google
    #Twitter: https://twitter.com/yourname || fab fa-twitter
    #FB Page: https://www.facebook.com/yourname || fab fa-facebook
    #StackOverflow: https://stackoverflow.com/yourname || fab fa-stack-overflow
    #YouTube: https://youtube.com/yourname || fab fa-youtube
    #Instagram: https://instagram.com/yourname || fab fa-instagram
    #Skype: skype:yourname?call|chat || fab fa-skype
    # Bilibili: https://space.bilibili.com/33035816 || fab fa-youtube
```

### 4.6. 更改字体

> 有说可能需要修改相关 css 文件，但我这里测试的结果是不需要这么复杂，直接修改**主题配置文件**即可，有可能是我配置的文件在默认的字库提供范围之内吧。

对于中文字体，我当前比较青睐“思源宋体”，因此将全局字体设置为`Noto Serif SC`，我的其他配置如下，这里的配置选项介绍建议参考[官网](http://theme-next.iissnan.com/theme-settings.html#fonts-customization)。

```yml
font:
    enable: true # 开启font选项

    # Uri of fonts host, e.g. https://fonts.googleapis.com (Default).
    host: https://fonts.loli.net # 国内谷歌字体的镜像源

    # Font options:
    # `external: true` will load this font family from `host` above.
    # `family: Times New Roman`. Without any quotes.
    # `size: x.x`. Use `em` as unit. Default: 1 (16px)

    # Global font settings used for all elements inside <body>.
    global:
        external: true
        family: Noto Serif SC
        size:

    # Font settings for site title (.site-title).
    title:
        external: true
        family:
        size:

    # Font settings for headlines (<h1> to <h6>).
    headings:
        external: true
        family: Roboto Slab
        size:

    # Font settings for posts (.post-body).
    posts:
        external: true
        family:

    # Font settings for <code> and code blocks.
    codes:
        external: true
        family: PT Mono
```

### 4.7. 代码块高亮

**主题配置文件**中的`codeblock`选项可选择高亮主题，这里选择默认的`normal`，并开启复制按钮。

```yml
codeblock:
    # Code Highlight theme
    # Available values: normal | night | night eighties | night blue | night bright | solarized | solarized dark | galactic
    # See: https://github.com/chriskempson/tomorrow-theme
    highlight_theme: normal
    # Add copy button on codeblock
    copy_button:
        enable: true
        # Show text copy result.
        show_result: false
        # Available values: default | flat | mac
        style:
```

### 4.8. 阅读进度条

**主题配置文件**中开启`reading_progress`选项：

```yml
# Reading progress bar
reading_progress:
    enable: true
    # Available values: top | bottom
    position: top
    color: "#37c6c0"
    height: 3px
```

### 4.9. 书签

**主题配置文件**中开启`bookmark`选项：

```yml
# Bookmark Support
bookmark:
    enable: true
    # Customize the color of the bookmark.
    color: "#222"
    # If auto, save the reading progress when closing the page or clicking the bookmark-icon.
    # If manual, only save it by clicking the bookmark-icon.
    save: auto
```

### 4.10. 字数统计、阅读时长估计

安装插件`hexo-symbols-count-time`：

```bash
npm install hexo-symbols-count-time
```

**站点配置文件**的末尾加上配置选项：

```yml
# hexo-symbols-count-time
symbols_count_time:
    symbols: true # 在每篇文章中显示词数
    time: true # 每篇文章的阅读时间估计
    total_symbols: true # 在站点底部显示全部文章的词数
    total_time: true # 在站点底部显示全部文章的阅读时间估计
```

**主题配置文件**中默认添加了相关配置选项，我这里没有对其进行改动：

```yml
# Post wordcount display settings
# Dependencies: https://github.com/theme-next/hexo-symbols-count-time
symbols_count_time:
    separated_meta: true
    item_text_post: true
    item_text_total: false
```

### 4.11. 数学公式支持

在**主题配置文件**中开启`mathjax`选项，并在需要启用数学公式的文章开头加入`mathjax: true`配置语句即可启动对数学公式的支持。

-   主题配置文件

    ```yml
    # Math Formulas Render Support
    math:
        # Default (true) will load mathjax / katex script on demand.
        # That is it only render those page which has `mathjax: true` in Front-matter.
        # If you set it to false, it will load mathjax / katex srcipt EVERY PAGE.
        per_page: true

        # hexo-renderer-pandoc (or hexo-renderer-kramed) required for full MathJax support.
        mathjax:
            enable: true
            # See: https://mhchem.github.io/MathJax-mhchem/
            mhchem: false
    ```

-   使用全面支持`mathjax`的新插件：
    Next 支持数学公式，但其自带的渲染插件`hexo-renderer-marked`对`mathjax`的支持不全，且有时会跟 markdown 的$\LaTeX$公式语法有冲突，因此一般使用新插件`hexo-renderer-kramed`：

    ```bash
    npm uninstall hexo-renderer-marked --save
    npm install hexo-renderer-kramed --save
    ```

    > 注：有说还需要更改`hexo-renderer-kramed`插件的 js 文件的，这里暂没有发现更改的必要，测试了一些这些帖子中所说的问题似乎已被修复。

-   新建一篇文章进行测试：

    ```bash
    # 在source/_posts/目录创建了test-math.md
    $ hexo new "test math"
    # 查看一下该文章的初始化内容
    $ cat source/_posts/test-math.md
    ---
    title: test math
    date: 2021-01-08 23:43:35
    tags:
    ---
    ```

    编辑 test-math.md 并添加以下内容，其中关键是要在开头的配置选项中加入`mathjax: true`：

    ```markdown
    ---
    title: 测试一下数学公式的使用
    date: 2021-01-08 23:43:35
    tags: math
    mathjax: true
    ---

    ## 做一道题吧

    题目：请证明$3=0$。

    证明：

    > 对于方程
    >
    > $$
    >    x^2+x+1=0\tag{1}
    > $$
    >
    > 显然有$x \neq 0$，那么两边同除以$x$可得：
    >
    > $$
    >    x + 1 + \frac{1}{x} = 0 \tag{2}
    > $$
    >
    > 由两式相减，即$(1)-(2)$，可得
    >
    > $$
    >    x^2-\frac{1}{x}=0 \tag{3}
    > $$
    >
    > 上式两边同乘$x$，则有
    >
    > $$
    >    x^3 - 1 = 0 \tag{4}
    > $$
    >
    > 故而解得$x=1$，将根$x=1$代入式$(1)$，则有$1+1+1=0$，所以
    >
    > $$
    >    3=0
    > $$
    >
    > 证明完毕。
    ```

    效果如下：![](https://chua-n.gitee.io/figure-bed/notebook/blog/hexo搭博客/test-math.png)

### 4.12. 阅读量统计

应该是 Next 主题不断更新适配的缘故，无须很多博客中提到的那么多操作，直接开启**主题配置文件**中的不蒜子参数即可：

```yml
# Show Views / Visitors of the website / page with busuanzi.
# Get more information on http://ibruce.info/2015/04/04/busuanzi
busuanzi_count:
    enable: true
    total_visitors: true
    total_visitors_icon: fa fa-user
    total_views: true
    total_views_icon: fa fa-eye
    post_views: true
    post_views_icon: fa fa-eye
```

### 4.13. 本地搜索功能

安装插件：

```bash
# 在博客根目录下输入命令
npm install hexo-generator-searchdb
```

在**主题配置文件**中开启 `local_search` 选项：

```yml
# Local Search
# Dependencies: https://github.com/theme-next/hexo-generator-searchdb
local_search:
    enable: true
    # If auto, trigger search by changing input.
    # If manual, trigger search by pressing enter key or search button.
    trigger: auto
    # Show top n results per article, show all results by setting to -1
    top_n_per_article: 1
    # Unescape html strings to the readable one.
    unescape: false
    # Preload the search data when the page loads.
    preload: false
```

### 4.14. 动态背景 canvas_nest

创建文件`souce/_data/footer.swig`，添加以下内容：

```
<script color="24,24,24" opacity="0.5" zIndex="-1" count="99" src="https://cdn.jsdelivr.net/npm/canvas-nest.js@1/dist/canvas-nest.js"></script>
```

开启**主题配置文件**中的相应`footer`选项（取消注释即可）：

```yml
# Define custom file paths.
# Create your custom files in site directory `source/_data` and uncomment needed files below.
custom_file_path:
    #head: source/_data/head.swig
    #header: source/_data/header.swig
    #sidebar: source/_data/sidebar.swig
    #postMeta: source/_data/post-meta.swig
    #postBodyEnd: source/_data/post-body-end.swig
    footer: source/_data/footer.swig
    #bodyEnd: source/_data/body-end.swig
    #variable: source/_data/variables.styl
    #mixin: source/_data/mixins.styl
    #style: source/_data/styles.styl
```

### 4.15. RSS 订阅

安装插件：

```bash
npm install hexo-generator-feed --save
```

在**站点配置文件**中添加如下配置参数：

```yml
# RSS
feed:
    type: atom # RSS的类型(atom/rss2)
    path: atom.xml
    limit: 20 # 展示文章的数量，若为0或false表示展示全部
    hub: # URL of the PubSubHubbub hubs (如果使用不到可以为空)
    content: # 为true可以在RSS中包含文章的全部内容，默认为false
    content_limit: # 摘要中使用的帖子内容的默认长度，仅在内容设置为false且未显示自定义帖子描述时才使用
    content_limit_delim: " "
    order_by: -date # 订阅内容的顺序，默认为-date
```

在**主题配置文件**的`social`选项下添加如下配置：

```yml
social:
    # ...
    RSS: /atom.xml || fa fa-rss
```

### 4.16. 其他

好好阅读**站点配置文件**与**主题配置文件**中的参数设定，还有很多可以操纵的细节，不一一表述了。

## 5. Gitee 图床的使用

本质上就是把图片上传到 Gitee Pages 仓库，在文章中引用图片链接即可。比如我先在我的`blog-images/`文件夹（即我下载下来的 Gitee Pages 仓库）中随便放入一张图片*avatar.png*，然后推送到远程：

```bash
# 进入本地Pages仓库目录
cd blog-images/
git add .
git commit -m "add images"
git push
```

并在 Gitee Pages 仓库中重新部署 Pages 服务：![](https://chua-n.gitee.io/figure-bed/notebook/blog/hexo搭博客/update-gitee-pages.png)

即可在书写 markdown 博客时通过链接格式`http://username.gitee.io/gitee_pages_repo_name/path_to_the_image`引用这张图片，对于我刚刚上传的这张图片，其链接为`https://chua-n.gitee.io/figure-bed/notebook/blog/avatar.png`。

我直接在这里引用示意一下，书写 markdown 语句`![](https://chua-n.gitee.io/figure-bed/notebook/blog/avatar.png)`，显示如下![](https://chua-n.gitee.io/figure-bed/notebook/blog/avatar.png)

> 需要强调的是，目前 Gitee 做图床有一个比较麻烦的地方，每一次上传新的图片后，需要手动更新一下 Pages 服务，不然无法按照上述格式链接到新上传的图片，因为它们没有被部署到 Pages。

## 6. 定义个性化域名

暂略……

## 7. 参考链接

1. [Hexo 官方文档](https://hexo.io/zh-cn/docs/)
2. [Next 官方文档](http://theme-next.iissnan.com/)
3. [Han's Blog](http://www.chenlianhan.com/)
4. [一休儿的博客](https://io-oi.me/tech/hexo-next-optimization/)
5. [评论插件 Valine](https://tding.top/archives/ed8b904f.html)
