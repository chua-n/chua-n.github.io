import katex from 'katex';

/**
 * 参考自 docsify-katex 插件
 */
export const mathExt = {
  name: 'math',
  level: 'inline',
  start(src) {
    return src.match(/\$/)?.index;
  },
  tokenizer(src, tokens) {
    const blockRule = /^\$\$((\\.|[^\$\\])+)\$\$/;
    const inlineRule = /^\$((\\.|[^\$\\])+)\$/;
    let match;
    if ((match = blockRule.exec(src))) {
      return {
        type: 'math',
        raw: match[0],
        text: match[1].trim(),
        mathLevel: 'block',
      };
    } else if ((match = inlineRule.exec(src))) {
      return {
        type: 'math',
        raw: match[0],
        text: match[1].trim(),
        mathLevel: 'inline',
      };
    }
  },
  renderer(token) {
    if (token.mathLevel === 'block') {
      return katex.renderToString(token.text, {
        throwOnError: false,
        displayMode: true,
      });
    } else if (token.mathLevel === 'inline') {
      return katex.renderToString(token.text, {
        throwOnError: false,
        displayMode: false,
      });
    }
  },
};
