import { arraySidebar } from "vuepress-theme-hope";
import { FOLDER_ICON, buildSimpleNavObj } from "./util";

export default arraySidebar([
  buildSimpleNavObj("概要"),
  buildSimpleNavObj("计网体系结构"),
  buildSimpleNavObj("应用层常见协议"),
  buildSimpleNavObj("网络加密"),
  buildSimpleNavObj("杂记"),
  {
    text: "HTTP",
    prefix: "HTTP/",
    collapsible: true,
    icon: FOLDER_ICON,
    children: [
      buildSimpleNavObj("HTTP 协议"),
      buildSimpleNavObj("用户身份认证"),
      buildSimpleNavObj("HTTPS"),
      buildSimpleNavObj("基于 HTTP 的追加协议"),
      buildSimpleNavObj("Web 服务器的类型"),
      buildSimpleNavObj("Web 攻击技术"),
    ],
  },
  buildSimpleNavObj("WebSocket"),
]);
