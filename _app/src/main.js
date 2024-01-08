// <head>
import '/static/css/themes/themes-vue.css'
import 'docsify-sidebar-collapse/dist/sidebar-folder.min.css'
import '/static/css/myStyle.css'
import '/static/css/codeColor.css'
import 'docsify-edit-on-github' // 点击编辑就报错

// <body>
import 'docsify'
import 'docsify-copy-code' // 复制到剪贴板
import 'docsify/lib/plugins/search' // 全文搜索 TODO 貌似与数学公式冲突？
import 'docsify/lib/plugins/zoom-image' // 图片缩放
import 'docsify/lib/plugins/emoji' // 表情
import 'docsify-count/dist/countable' // 字数统计
import 'docsify-pagination/dist/docsify-pagination' // 分页导航插件（上/下章节按钮）
import 'docsify-scroll-to-top/src/docsify-scroll-to-top' // 回到顶部按钮
import 'docsify-katex/dist/docsify-katex' // 数学公式
import '/static/js/docsify-sidebar-collapse'
// 支持markdown代码段高亮
import 'prismjs/components/prism-java'
import 'prismjs/components/prism-python.min'
import 'prismjs/components/prism-yaml.min'
import 'prismjs/components/prism-bash.min'
import 'prismjs/components/prism-powershell.min'
import 'prismjs/components/prism-sql.min'
import 'prismjs/components/prism-json.min'
import 'prismjs/components/prism-properties.min'
import 'prismjs/components/prism-http.min'
import 'prismjs/components/prism-nginx.min'
// 数学公式
import 'katex/dist/katex.min'
import 'marked'
import 'katex/dist/katex.min.css'
// TODO 此处引入 canvas_nest
import '/static/js/fireworks' // 引入鼠标点击时的烟花效果
