import type { RenderLeafProps } from 'slate-react';
import { CODE_TOKEN_COLORS } from '@/utils/code-decoration';

const TOKEN_COLOR_ENTRIES = Object.entries(CODE_TOKEN_COLORS).map(([tokenType, color]) => ({
  color,
  leafKey: tokenType.replace('token ', ''),
}));

const artTextStyleCache = new Map<string, Record<string, unknown> | null>();

const getArtTextStyle = (artTextData: string) => {
  if (artTextStyleCache.has(artTextData)) {
    return artTextStyleCache.get(artTextData) ?? null;
  }

  try {
    const parsed = JSON.parse(artTextData) as Record<string, unknown>;
    artTextStyleCache.set(artTextData, parsed);
    return parsed;
  } catch {
    artTextStyleCache.set(artTextData, null);
    return null;
  }
};

export const renderLeaf = (props: RenderLeafProps) => {
  const { attributes, children, leaf } = props;

  let codeColor: string | undefined;
  for (const entry of TOKEN_COLOR_ENTRIES) {
    if (leaf[entry.leafKey as keyof typeof leaf]) {
      codeColor = entry.color;
      break;
    }
  }

  const style: React.CSSProperties = {};
  // Text 层字体 mark（优先级最高，覆盖 block 级和全局级）
  if ((leaf as any).fontFamily) {
    style.fontFamily = (leaf as any).fontFamily;
  }
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
  const textDecorations: string[] = [];
  if ((leaf as any).underline) textDecorations.push('underline');
  if ((leaf as any).strikethrough) textDecorations.push('line-through');
  if (textDecorations.length > 0) {
    style.textDecoration = textDecorations.join(' ');
  }

  // 艺术字样式
  const artTextData = (leaf as any).artText;
  if (typeof artTextData === 'string' && artTextData) {
    const artStyle = getArtTextStyle(artTextData);
    if (artStyle) {
      switch (artStyle.type) {
        case 'gradient': {
          const colors = Array.isArray(artStyle.colors)
            ? artStyle.colors
            : ['#ff0000', '#00ff00', '#0000ff'];
          const directionMap: Record<string, string> = {
            'left-to-right': 'to right',
            'right-to-left': 'to left',
            'top-to-bottom': 'to bottom',
            'bottom-to-top': 'to top',
            diagonal: 'to bottom right',
          };
          const directionKey =
            typeof artStyle.direction === 'string' ? artStyle.direction : 'left-to-right';
          const direction = directionMap[directionKey] || directionMap['left-to-right'];
          style.background = `linear-gradient(${direction}, ${colors.join(', ')})`;
          style.WebkitBackgroundClip = 'text';
          style.WebkitTextFillColor = 'transparent';
          style.backgroundClip = 'text';
          delete style.color;
          break;
        }
        case 'glow': {
          const color = typeof artStyle.glowColor === 'string' ? artStyle.glowColor : '#ff0000';
          const intensity =
            typeof artStyle.glowIntensity === 'number' ? artStyle.glowIntensity : 10;
          style.textShadow = `0 0 ${intensity}px ${color}, 0 0 ${intensity * 2}px ${color}`;
          break;
        }
        case 'shadow': {
          const color = typeof artStyle.shadowColor === 'string' ? artStyle.shadowColor : '#000000';
          const offsetX = typeof artStyle.shadowOffsetX === 'number' ? artStyle.shadowOffsetX : 2;
          const offsetY = typeof artStyle.shadowOffsetY === 'number' ? artStyle.shadowOffsetY : 2;
          const blur = typeof artStyle.shadowBlur === 'number' ? artStyle.shadowBlur : 4;
          style.textShadow = `${offsetX}px ${offsetY}px ${blur}px ${color}`;
          break;
        }
      }
    }
  }

  return (
    <span {...attributes} style={style}>
      {children}
    </span>
  );
};
