import { navbar } from "vuepress-theme-hope";

const isDevEnv = process.env.NODE_ENV === "development";
const navBars = [
  {
    text: "随笔",
    icon: "leaf",
    link: "/blog/",
  },
  {
    text: "Java",
    icon: "java",
    children: [
      {
        text: "Java",
        icon: "java",
        link: "/Java/",
      },
      {
        text: "JavaWeb",
        icon: "web",
        link: "/JavaWeb/",
      },
    ]
  },
  {
    text: "JavaScript",
    icon: "java-script",
    link: "/JavaScript/",
  },
  {
    text: "Python",
    icon: "python",
    link: "/Python/",
  },
  {
    text: "数学",
    icon: "math-pi",
    link: "/数学/",
  },
  {
    text: "DSA",
    icon: "algorithm",
    link: "/DSA/",
  },
  {
    text: "数据库",
    link: "/数据库/",
    icon: "database",
  },
  {
    text: "Linux",
    link: "/Linux/",
    icon: "linux",
  },
  {
    text: "杂技",
    icon: "other-tech",
    link: "/杂技/",
  },
];
if (isDevEnv) {
  navBars.push({
    text: "glodon",
    link: "glodon/",
    icon: ""
  });
}
export default navbar(navBars);
