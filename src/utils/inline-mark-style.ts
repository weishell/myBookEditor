// 内联"自绘 + void"元素（公式 / @提及 等）读取颜色样式的小工具。
//
// 背景：这类元素 contentEditable=false、且 Slate 里是 isInline + isVoid，
//   - 渲染时【不渲染子文本】（见 core/renderElement.tsx：Formula / Mention 不接收 children）；
//   - Slate 的 addMark 默认不会进入 void 节点内部，text mark 写不进去也用不上。
// 因此它们的颜色不放在 text mark 上，而是放在元素自己的 attrs（color / highlight），
// 由 marks.ts 的 setColor / setBackgroundColor 负责写入，组件负责读出来渲染。
import { DARK_TEXT_PATTERN, SOFT_WHITE } from '@/core/renderLeaf';

export interface InlineMarkStyle {
  color?: string;
  backgroundColor?: string;
}

/**
 * 从元素 attrs 上取 color / highlight，转成可直接用的内联样式。
 * 与 RenderLeaf 保持一致：暗黑模式下"接近黑"的文字色柔和化为 SOFT_WHITE。
 */
export function getInlineMarkStyle(element: unknown, isDarkMode: boolean): InlineMarkStyle {
  const attrs = ((element as { attrs?: Record<string, unknown> } | null | undefined)?.attrs ??
    {}) as Record<string, unknown>;
  const style: InlineMarkStyle = {};

  const color = typeof attrs.color === 'string' ? attrs.color : undefined;
  if (color) {
    style.color = isDarkMode && DARK_TEXT_PATTERN.test(color.trim()) ? SOFT_WHITE : color;
  }

  const highlight = typeof attrs.highlight === 'string' ? attrs.highlight : undefined;
  if (highlight) {
    style.backgroundColor = highlight;
  }

  return style;
}
