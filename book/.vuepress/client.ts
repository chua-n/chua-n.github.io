import "vuepress-theme-hope/presets/shinning-feature-panel.scss"; // 为项目主页的特性添加闪光效果
import "vuepress-theme-hope/presets/left-blog-info.scss"; // 将博主信息移动至文章列表的左侧
import "vuepress-theme-hope/presets/bounce-icon.scss"; // 为页面图标添加鼠标悬停的跳动效果
// @ts-ignore
import { defineClientConfig } from "vuepress/client";

export default defineClientConfig({
  enhance({
    app,
    router,
    siteData
  }) {},
  setup() {},
  rootComponents: [],
});
