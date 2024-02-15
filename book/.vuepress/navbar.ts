import { navbar } from "vuepress-theme-hope";

export default navbar([
  {
    text: "首页",
    link: "/",
  },
  {
    text: "博客",
    // icon: "book",
    link: "https://chua-n.com/blog",
  },
  {
    text: "Java",
    children: [
      {
        text: "Java",
        link: "/Java/",
      },
      {
        text: "JavaWeb",
        link: "/JavaWeb/",
      },
    ]
  },
  {
    text: "JavaScript",
    link: "/JavaScript/",
  },
  {
    text: "Python",
    link: "/Python/",
  },
  {
    text: "数学",
    link: "/数学/",
  },
  {
    text: "DSA",
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
  },
  {
    text: "杂技",
    link: "/杂技/",
  },
  {
    text: "glodon",
    link: "glodon/",
  },
]);
