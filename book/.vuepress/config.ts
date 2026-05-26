import { viteBundler } from "@vuepress/bundler-vite";
import { defineUserConfig } from "vuepress";
import * as fs from "node:fs";
import * as path from "node:path";
import theme from "./theme.js";

const sourceDir = "book";
const cnameFile = "CNAME";
const bundler = viteBundler();

export default defineUserConfig({
  base: "/",
  dest: `${sourceDir}/.vuepress/dist`,

  port: 7777,

  lang: "zh-CN",
  title: "荒流的笔趣屋",
  description: "这是我用 vuepress 工具生成的笔记，采用 vuepress-theme-hope 主题，简单好用，采用 Markdown 编写，像书本一样展示。",

  head: [
    [
      "script",
      {},
      `
      var _hmt = _hmt || [];
      (function() {
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?d41714388d97166c965a387883f8c5e0";
        var s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(hm, s);
      })();
      `
    ]
  ],

  markdown: {
    headers: {
      level: [2, 3, 4, 5, 6],
    }
  },

  theme,

  // 和 PWA 一起启用
  shouldPrefetch: false,

  bundler: {
    ...bundler,
    async build(app) {
      await bundler.build(app);
      fs.copyFileSync(
        path.resolve(process.cwd(), cnameFile),
        path.join(app.dir.dest(), cnameFile),
      );
    },
  },
});
