import { arraySidebar } from "vuepress-theme-hope";
import { buildSimpleNavObj } from "./util";

export default arraySidebar([
  buildSimpleNavObj("概要"),
  buildSimpleNavObj("计网体系结构"),
  buildSimpleNavObj("HTTP协议"),
  buildSimpleNavObj("WebSocket"),
]);
