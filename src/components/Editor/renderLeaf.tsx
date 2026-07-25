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

  // 艺术字样式
  const artTextData = (leaf as any).artText;
  if (artTextData) {
    try {
      const artStyle = JSON.parse(artTextData);
      switch (artStyle.type) {
        case 'gradient': {
          const colors = artStyle.colors || ['#ff0000', '#00ff00', '#0000ff'];
          const directionMap: Record<string, string> = {
            'left-to-right': 'to right',
            'right-to-left': 'to left',
            'top-to-bottom': 'to bottom',
            'bottom-to-top': 'to top',
            diagonal: 'to bottom right',
          };
          const direction = directionMap[artStyle.direction || 'left-to-right'];
          style.background = `linear-gradient(${direction}, ${colors.join(', ')})`;
          style.WebkitBackgroundClip = 'text';
          style.WebkitTextFillColor = 'transparent';
          style.backgroundClip = 'text';
          delete style.color;
          break;
        }
        case 'glow': {
          const color = artStyle.glowColor || '#ff0000';
          const intensity = artStyle.glowIntensity || 10;
          style.textShadow = `0 0 ${intensity}px ${color}, 0 0 ${intensity * 2}px ${color}`;
          break;
        }
        case 'shadow': {
          const color = artStyle.shadowColor || '#000000';
          const offsetX = artStyle.shadowOffsetX || 2;
          const offsetY = artStyle.shadowOffsetY || 2;
          const blur = artStyle.shadowBlur || 4;
          style.textShadow = `${offsetX}px ${offsetY}px ${blur}px ${color}`;
          break;
        }
      }
    } catch {
      // ignore parse errors
    }
  }

  return (
    <span {...attributes} style={style}>
      {children}
    </span>
  );
};
