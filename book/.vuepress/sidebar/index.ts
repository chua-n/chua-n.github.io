import { sidebar } from "vuepress-theme-hope";
import java from "./java";
import javaWeb from "./javaWeb";
import javaScript from "./javaScript";
import python from "./python";
import math from "./math";
import dsa from "./dsa";
import database from "./database";
import linux from "./linux";
import otherTech from "./otherTech";

export default sidebar({
  "/": [],
  "/Java/": java,
  "/JavaWeb/": javaWeb,
  "/JavaScript/": javaScript,
  "/Python/": python,
  "/数学/": math,
  "/DSA/": dsa,
  "/数据库/": database,
  "/Linux/": linux,
  "/杂技/": otherTech,
});
