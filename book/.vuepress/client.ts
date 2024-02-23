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
  }) {
    router.beforeEach((
      to,
      from,
      next
    ) => {
      // 上报百度统计
      if (window._hmt && to.path) {
        if (from.path != to.path) { // 同页面发生的哈希切换不上报
          window._hmt.push(["_trackPageview", decodeURI(to.fullPath)]);
        }
      }
      next();
    });
  },
  setup() {},
  rootComponents: [],
});
