import { mathExt } from './component/mathExt';
import { marked } from 'marked';
import gitalkPlugin from './component/gitalk-plugin';

(function () {
    window.$docsify = {
        name: "封面",
        repo: "https://github.com/chua-n/notebook",
        maxLevel: 6, // 对文档标题渲染成目录的最大层级
        auto2top: true, //切换页面后是否自动跳转到页面顶部。
        // homepage: // 设置首页文件加载路径：适合不想将 README.md 作为入口文件渲染，或是文档存放在其他位置的情况使用
        relativePath: false, // 启用相对路径，默认为false
        coverpage: true, // 启用封面页：默认加载 _coverpage.md 文件，也可以自定义文件名
        onlyCover: true, // 封面单独成页，与主页不共享页面
        themeColor: "#6a005f", // 替换主题色
        topMargin: 0, // default: 0
        // basePath: '/book/',
        // routerMode: "history", // default: "hash"

        // 开启侧边栏
        // 侧边栏开启后默认不会再生成目录，可以通过设置生成目录的最大层级再次开启这个功能
        loadSidebar: true,
        subMaxLevel: 6,
        autoHeader: true,
        sidebarDisplayLevel: 0, // set sidebar display level

        // 开启导航栏
        loadNavbar: true,
        mergeNavbar: true, // 小屏设备下合并导航栏到侧边栏

        // 开启搜索功能
        search: {
            maxAge: 86400000, // 过期时间，单位毫秒，默认一天
            paths: "auto",
            placeholder: "搜索一下...",
            noData: "没找到该内容",
            // 搜索标题的最大程级, 1 - 6
            depth: 6,
        },

        // 字数统计
        count: {
            countable: true,
            fontsize: "0.9em",
            color: "rgb(90,90,90)",
            language: "chinese",
        },

        // 复制代码按钮 (defaults)
        copyCode: {
            buttonText: "copy",
            errorText: "error",
            successText: "copied",
        },

        scrollToTop: {
            auto: true,
            text: "Top",
            // right: 15,
            // bottom: 15,
            offset: 300,
        },

        plugins: [
            EditOnGithubPlugin.create(
                "https://github.com/chua-n/notebook/tree/main/",
                null,
                "编辑"
            ),
            gitalkPlugin,
        ],

        markdown: function (docsifyMarked, renderer) {
            // 不能用 docsifyMarked，不知道为什么
            marked.use({
                renderer: renderer,
                extensions: [mathExt], // 支持markdown文本里的数学公式
            });
            return marked;
        },
    };
}())
