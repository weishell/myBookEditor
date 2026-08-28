import type { RenderLeafProps } from 'slate-react';
import { CODE_TOKEN_COLORS } from '@/utils/code-decoration';
import { useTheme } from '@/context/ThemeContext';
import { HYPERLINK_KEY, getLinkColor, HyperlinkLeaf } from '@/plugins/hyperlink';

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

// 判断是否是"接近黑"的深色（暗黑模式下需要柔和化，避免黑底黑字）
const DARK_TEXT_PATTERN =
  /^#(?:000000|010101|020202|030303|040404|050505|060606|070707|080808|090909|0a0a0a|0b0b0b|0c0c0c|0d0d0d|0e0e0e|0f0f0f|101010|111111|121212|131313|141414|151515|161616|171717|181818|191919|1a1a1a|1b1b1b|1c1c1c|1d1d1d|1e1e1e|1f1f1f|202020|212121|222222|232323|242424|252525|262626|272727|282828|292929|2a2a2a|2b2b2b|2c2c2c|2d2d2d|2e2e2e|2f2f2f|303030|313131|323232|333333|343434|353535|363636|373737|383838|393939|3a3a3a|3b3b3b|3c3c3c|3d3d3d|3e3e3e|3f3f3f)$/i;

// 判断是否是浅色背景（暗黑模式下和页面不协调的浅表头/白底单元格）
const LIGHT_BG_PATTERN =
  /^#(?:fff|fffff|ffffff|fefefe|fdfdfd|fcfcfc|fbfbfb|fafafa|f9f9f9|f8f8f8|f7f7f7|f6f6f6|f5f5f5|f4f4f4|f3f3f3|f2f2f2|f1f1f1|f0f0f0|efefef|eeeeee|ededed|ececec|ebebeb|eaeaea|e9e9e9|e8e8e8|e7e7e7|e6e6e6|e5e5e5)$/i;

// 柔和白：暗黑模式下替换原深色/黑色文字
const SOFT_WHITE = '#e5e7eb';
// 柔和浅白：次一级（对应原 #333 这种默认字色）
const SOFT_WHITE_SECONDARY = '#c8cdd6';
// 暗黑模式下表头/白底单元格的深色柔和背景
const DARK_CELL_BG = '#181f2c';

export { DARK_TEXT_PATTERN, LIGHT_BG_PATTERN, SOFT_WHITE, SOFT_WHITE_SECONDARY, DARK_CELL_BG };

export const RenderLeaf = (props: RenderLeafProps) => {
  const { attributes, children, leaf } = props;
  const { isDarkMode, themeColor } = useTheme();

  const linkUrl = (leaf as any)[HYPERLINK_KEY] as string | undefined;

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
  const userColor = (leaf as any).color as string | undefined;
  if (userColor) {
    // 暗黑模式下：若用户选的是黑色/近黑色 → 换成柔和白，避免黑底黑字
    if (isDarkMode && DARK_TEXT_PATTERN.test(userColor.trim())) {
      style.color = SOFT_WHITE;
    } else {
      style.color = userColor;
    }
  } else if (codeColor) {
    style.color = codeColor;
  } else if (linkUrl) {
    // 超链接叶子：显示链接色（仅当前叶子，不影响后续普通文本）
    style.color = getLinkColor(isDarkMode, themeColor);
  } else {
    // 默认字色（非用户指定）——暗黑模式下柔和浅白
    style.color = isDarkMode ? SOFT_WHITE_SECONDARY : '#333';
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

  const leafContent = (
    <span {...attributes} style={style}>
      {children}
    </span>
  );

  if (linkUrl) {
    return (
      <HyperlinkLeaf
        url={linkUrl}
        attributes={attributes as unknown as Record<string, unknown>}
        style={style}
      >
        {children}
      </HyperlinkLeaf>
    );
  }

  return leafContent;
};
