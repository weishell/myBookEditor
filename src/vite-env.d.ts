/// <reference types="vite/client" />

declare module '*.module.less' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.less' {
  const content: string;
  export default content;
}

// Prism 语言包是裸脚本、没有类型声明；这里声明为无导出模块，
// 供 code-highlighter 中的动态 import 使用。
declare module 'prismjs/components/*';
