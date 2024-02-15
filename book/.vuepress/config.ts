import { WebpackConfiguration, webpackBundler } from '@vuepress/bundler-webpack'
import { defineUserConfig } from "vuepress";
import theme from "./theme.js";

export default defineUserConfig({
  base: "/",

  lang: "zh-CN",
  title: "文档演示",
  description: "vuepress-theme-hope 的文档演示",

  theme,

  // 和 PWA 一起启用
  // shouldPrefetch: false,

  // 修改 webpack 配置
  bundler: webpackBundler({
    configureWebpack: (config: WebpackConfiguration, isServer: boolean, isBuild: boolean) => {
      config.devtool = 'eval-source-map'; // 开发环境调试时浏览器展示源码（好像不生效）
    }
  }),
});
