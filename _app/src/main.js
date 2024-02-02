import './style.css';

import 'docsify-edit-on-github';
import './setDocsify';
import 'docsify';
import 'docsify/lib/plugins/search'; // 全文搜索
import 'docsify/lib/plugins/zoom-image'; // 图片缩放
import 'docsify/lib/plugins/emoji'; // 表情
import 'docsify-copy-code'; // 复制到剪贴板
import 'docsify-count/dist/countable'; // 字数统计
import 'docsify-pagination/dist/docsify-pagination'; // 分页导航插件（上/下章节按钮）
import 'docsify-scroll-to-top/src/docsify-scroll-to-top'; // 回到顶部按钮
import './component/docsify-sidebar-collapse'; // 折叠

/* 支持markdown代码段高亮 */
import 'prismjs/components/prism-java.min';
import 'prismjs/components/prism-python.min';
import 'prismjs/components/prism-c.min';
import 'prismjs/components/prism-cpp.min';
import 'prismjs/components/prism-yaml.min';
import 'prismjs/components/prism-bash.min';
import 'prismjs/components/prism-powershell.min';
import 'prismjs/components/prism-sql.min';
import 'prismjs/components/prism-json.min';
import 'prismjs/components/prism-properties.min';
import 'prismjs/components/prism-http.min';
import 'prismjs/components/prism-nginx.min';

// TODO 此处引入 canvas_nest
import './component/fireworks'; // 引入鼠标点击时的烟花效果
