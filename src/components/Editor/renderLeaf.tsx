import type { RenderLeafProps } from 'slate-react';
import { CODE_TOKEN_COLORS } from '@/utils/code-decoration';

export const renderLeaf = (props: RenderLeafProps) => {
  const { attributes, children, leaf } = props;

  let codeColor: string | undefined;
  for (const tokenType of Object.keys(CODE_TOKEN_COLORS)) {
    const type = tokenType.replace('token ', '');
    if (leaf[type as keyof typeof leaf]) {
      codeColor = CODE_TOKEN_COLORS[tokenType];
      break;
    }
  }

  const style: React.CSSProperties = {};
  // 用户手动设置的颜色优先级高于代码高亮
  if ((leaf as any).color) {
    style.color = (leaf as any).color;
  } else if (codeColor) {
    style.color = codeColor;
  } else {
    style.color = '#333';
  }
  // 高亮背景色
  if ((leaf as any).highlight) {
    style.backgroundColor = (leaf as any).highlight;
  }
  // 其他格式
  if ((leaf as any).bold) style.fontWeight = 'bold';
  if ((leaf as any).italic) style.fontStyle = 'italic';
  if ((leaf as any).underline) style.textDecoration = 'underline';
  if ((leaf as any).strikethrough) style.textDecoration = 'line-through';

  return (
    <span {...attributes} style={style}>
      {children}
    </span>
  );
};
