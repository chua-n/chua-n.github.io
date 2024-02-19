import { hopeTheme } from "vuepress-theme-hope";
import navbar from "./navbar.js";
import sidebar from "./sidebar.js";
import { Page } from "vuepress";

export default hopeTheme({
  hostname: "https://chua-n.com",
  author: {
    name: "chua-n",
    url: "https://chua-n.com/blog/about/",
  },

  darkmode: "toggle",
  fullscreen: true,
  // pure: true,
  iconAssets: "//at.alicdn.com/t/c/font_4437669_f82u7rva7gq.css",
  // iconPrefix: ???
  logo: "https://chua-n.gitee.io/figure-bed/notebook/川.svg",
  favicon: "/favicon.ico",

  // 是否使用 RTL 布局
  rtl: false,

  // 导航栏
  navbar,
  navbarIcon: true,
  navbarLayout: {
    start: ["Brand"],
    center: ["Links"],
    end: ["Language", "Repo", "Outlook", "Search"]
  },
  // navTitle: "what the fuck?",
  repo: "chua-n/chua-n.github.io",
  navbarAutoHide: "mobile",

  // 侧边栏
  sidebar,
  headerDepth: 5,
  toc: true,
  print: true,

  // 路径导航
  breadcrumb: true,
  breadcrumbIcon: true,
  prevLink: true,
  nextLink: true,

  // 文章
  titleIcon: true,
  pageInfo: ["Author", "Original", "Date", "Category", "Tag", "ReadingTime", "Word", "PageView"],
  lastUpdated: true,
  contributors: true,
  editLink: true,
  // editLinkPattern: "???"
  docsBranch: "feature/goto-vuepress",
  docsDir: "book",

  // 页脚
  footer: "应无所住，而生其心",
  displayFooter: true,

  blog: {
    name: "荒流",
    description: "合抱之木，生于毫末",
    avatar: "https://chua-n.gitee.io/figure-bed/notebook/blog/avatar.png",
    roundAvatar: true,
    intro: "/about",
    medias: {
      Github: "https://github.com/chua-n",
      Gmail: "mailto:chua_n@qq.com",
    },
    sidebarDisplay: "mobile",
    articlePerPage: 5,
    articleInfo: ["Author", "Original", "Date", "Category", "Tag", "ReadingTime", "Word", "PageView"],
    timeline: "昨日不在",
  },

  // 加密配置
  encrypt: {
    config: {
      "/demo/encrypt.html": ["1234"],
      "/glodon/": "1234",
    },
  },

  // 多语言配置
  metaLocales: {
    editLink: "编辑此页",
  },

  // 如果想要实时查看任何改变，启用它。注: 这对更新性能有很大负面影响
  // hotReload: true,

  // 在这里配置主题提供的插件
  plugins: {
    // 你应该自行生成自己的评论服务
    comment: {
      provider: "Giscus",
      repo: "chua-n/chua-n.github.io",
      repoId: "MDEwOlJlcG9zaXRvcnkzODUxMDYyNTk=",
      category: "Announcements",
      categoryId: "DIC_kwDOFvRBU84CdT13",
    },

    components: {
      components: ["Badge", "VPCard"],
    },

    // 此处开启了很多功能用于演示，你应仅保留用到的功能。
    mdEnhance: {
      align: true,
      attrs: true,
      codetabs: true,
      component: true,
      demo: true,
      figure: true,
      imgLazyload: true,
      imgSize: true,
      include: true,
      linkify: true,
      mark: true,
      stylize: [
        {
          matcher: "Recommended",
          replacer: ({ tag }) => {
            if (tag === "em")
              return {
                tag: "Badge",
                attrs: { type: "tip" },
                content: "Recommended",
              };
          },
        },
      ],
      sub: true,
      sup: true,
      tabs: true,
      vPre: true,

      // 在启用之前安装 chart.js
      // chart: true,

      // insert component easily

      // 在启用之前安装 echarts
      // echarts: true,

      // 在启用之前安装 flowchart.ts
      // flowchart: true,

      // gfm requires mathjax-full to provide tex support
      // gfm: true,

      // 在启用之前安装 katex
      katex: {
        copy: true,
        mhchem: true,
      },

      // 在启用之前安装 mathjax-full
      // mathjax: true,

      // 在启用之前安装 mermaid
      // mermaid: true,

      // playground: {
      //   presets: ["ts", "vue"],
      // },

      // 在启用之前安装 reveal.js
      // revealJs: {
      //   plugins: ["highlight", "math", "search", "notes", "zoom"],
      // },

      // 在启用之前安装 @vue/repl
      // vuePlayground: true,

      // install sandpack-vue3 before enabling it
      // sandpack: true,
    },

    blog: {
      article: "/blog/",
      category: "/blog/category/",
      categoryItem: "/blog/category/:name/",
      tag: "/blog/tag/",
      tagItem: "/blog/tag/:name/",
      star: "/blog/star/",
      timeline: "/blog/timeline/",
      filter: (page: Page) => {
        // 博客只展示 blog 目录下的文件
        return page.filePathRelative && page.filePathRelative.startsWith("blog");
      }
    },

    search: true,

    feed: {
      atom: true,
      json: true,
      rss: true,
    },

    // 如果你需要 PWA。安装 vuepress-plugin-pwa2 并取消下方注释
    // pwa: {
    //   favicon: "/favicon.ico",
    //   cacheHTML: true,
    //   cachePic: true,
    //   appendBase: true,
    //   apple: {
    //     icon: "/assets/icon/apple-icon-152.png",
    //     statusBarColor: "black",
    //   },
    //   msTile: {
    //     image: "/assets/icon/ms-icon-144.png",
    //     color: "#ffffff",
    //   },
    //   manifest: {
    //     icons: [
    //       {
    //         src: "/assets/icon/chrome-mask-512.png",
    //         sizes: "512x512",
    //         purpose: "maskable",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-mask-192.png",
    //         sizes: "192x192",
    //         purpose: "maskable",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-512.png",
    //         sizes: "512x512",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-192.png",
    //         sizes: "192x192",
    //         type: "image/png",
    //       },
    //     ],
    //     shortcuts: [
    //       {
    //         name: "Demo",
    //         short_name: "Demo",
    //         url: "/demo/",
    //         icons: [
    //           {
    //             src: "/assets/icon/guide-maskable.png",
    //             sizes: "192x192",
    //             purpose: "maskable",
    //             type: "image/png",
    //           },
    //         ],
    //       },
    //     ],
    //   },
    // },
  },
});
