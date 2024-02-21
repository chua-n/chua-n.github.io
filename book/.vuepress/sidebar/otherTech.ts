import { arraySidebar } from "vuepress-theme-hope";
import { buildSimpleNavObj } from "./util";

export default arraySidebar([
  {
    text: "计算机组成原理",
    prefix: "计算机组成原理/",
    // collapsible: true,
    icon: "CPU",
    children: []
  },
  {
    text: "计算机网络",
    prefix: "计算机网络/",
    collapsible: true,
    icon: "computer-network",
    children: [
      buildSimpleNavObj("概要"),
      buildSimpleNavObj("计网体系结构"),
      buildSimpleNavObj("HTTP协议"),
      buildSimpleNavObj("WebSocket"),
    ]
  },
  {
    text: "操作系统",
    prefix: "操作系统/",
    // collapsible: true,
    icon: "operating-system",
    children: []
  },
  {
    text: "C++",
    prefix: "C++/",
    // collapsible: true,
    icon: "cpp",
    children: []
  },
  {
    text: "Git",
    prefix: "Git/",
    collapsible: true,
    icon: "git",
    children: [
      buildSimpleNavObj("一、Git起步"),
      buildSimpleNavObj("二、版本控制"),
      buildSimpleNavObj("三、远程仓库"),
      buildSimpleNavObj("四、标签管理"),
      buildSimpleNavObj("五、Git分支"),
    ]
  },
  buildSimpleNavObj("Docker", "docker"),
  buildSimpleNavObj("Nginx", "nginx"),
  {
    text: "CV",
    prefix: "CV/",
    collapsible: true,
    icon: "computer-vision-simple",
    children: [
      buildSimpleNavObj("基础概念"),
      buildSimpleNavObj("空间域处理"),
      buildSimpleNavObj("频率域滤波"),
      buildSimpleNavObj("图像复原与重建"),
      buildSimpleNavObj("形态学图像处理"),
      buildSimpleNavObj("彩色图像处理"),
      buildSimpleNavObj("小波变换"),
    ]
  },
]);
