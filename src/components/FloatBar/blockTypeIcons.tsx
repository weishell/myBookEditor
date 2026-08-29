// 块类型菜单的统一图标集（飞书款线性 SVG，跟 DocBar 同源）
// 主工具栏的"块类型"按钮 + 合并下拉里所有项都从这里取，保证视觉一致。

import type { BlockType } from './blockType';

// 通用线性图标样式（对齐 DocBar / 飞书简洁线性风格）
const lineProps = {
  fill: 'none',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

interface IconProps {
  color?: string;
  size?: number;
}

/** 段落：T 字（与 ContextMenu 块类型区字符按钮完全一致 —— 用 span 而非 SVG） */
const TIcon = () => <span style={{ fontSize: 12, fontWeight: 'bold' }}>T</span>;

/**
 * 标题：H{level} 字。
 *
 * 必须是普通 span，不能用 SVG <text> + viewBox 缩放 —— 早期用过 SVG
 * 写法，fontSize=12 在 18px 容器里实际只渲染 9px（12 × 18/24 = 9），
 * 比左邻 btnToolBold 字符按钮（12px）明显小一截。改用 span 后字号由
 * CSS 直接控制，跟左侧完全一致。
 */
const HIcon = ({ level = 1 }: { level?: number }) => (
  <span style={{ fontSize: 12, fontWeight: 'bold' }}>H{level}</span>
);

/** 任务：方框 + 勾 */
const TodoIcon = ({ color = 'currentColor', size = 16 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...lineProps} stroke={color}>
    <rect x="5.5" y="5.5" width="13" height="13" rx="2" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

/** 引用：双引号 */
const QuoteIcon = ({ color = 'currentColor', size = 16 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...lineProps} stroke={color}>
    <path d="M10.5 7.5c-2.6 0-4.5 1.9-4.5 4.4V17h4.6v-4.6H8.4c0-1.2.7-2 2.1-2" />
    <path d="M18.5 7.5c-2.6 0-4.5 1.9-4.5 4.4V17h4.6v-4.6h-2.2c0-1.2.7-2 2.1-2" />
  </svg>
);

/** 代码块：</> 折线 */
const CodeIcon = ({ color = 'currentColor', size = 16 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...lineProps} stroke={color}>
    <path d="M8 8l-4 4 4 4M16 8l4 4-4 4" />
  </svg>
);

/** 有序列表 + 无序列表：复用 lilist 包里的实现（跟 DocBar 完全一致） */
import { OlListIcon, UlListIcon } from '@/plugins/lilist';
export { OlListIcon, UlListIcon };

/**
 * 当前块类型 → 工具栏图标。
 * 返回 null 时主工具栏的"块类型"按钮 fallback 到 'T' 文本。
 */
export function blockTypeIcon(key: BlockType | null): React.ReactNode {
  if (!key) return null;
  if (key === 'paragraph') return <TIcon />;
  if (key === 'numbered') return <OlListIcon />;
  if (key === 'bulleted') return <UlListIcon />;
  if (key === 'todo') return <TodoIcon />;
  if (key === 'quote') return <QuoteIcon />;
  if (key === 'code-block') return <CodeIcon />;
  // h1..h9
  const m = /^h([1-9])$/.exec(key);
  if (m) return <HIcon level={Number(m[1])} />;
  return null;
}

/**
 * 给下拉条目用的"图标组件"（function component，可接收 color/size 等 props），
 * 返回 null 表示无图标（该项只展示文字，例如"其他标题"父项）。
 */
export function blockTypeIconComponent(key: BlockType): React.ComponentType<IconProps> | null {
  if (key === 'paragraph') return TIcon;
  if (key === 'numbered') return OlListIcon as unknown as React.ComponentType<IconProps>;
  if (key === 'bulleted') return UlListIcon as unknown as React.ComponentType<IconProps>;
  if (key === 'todo') return TodoIcon;
  if (key === 'quote') return QuoteIcon;
  if (key === 'code-block') return CodeIcon;
  const m = /^h([1-9])$/.exec(key);
  if (m) {
    const level = Number(m[1]);
    // T/H 字符按钮的 size/color 不由 SVG 控制，全交给父级 CSS 决定（与
    // ContextMenu 块类型区字符按钮完全一致）。Cmp 接受 IconProps 但不消费，
    // 仅用于满足 ComponentType<IconProps> 签名。
    const Cmp: React.ComponentType<IconProps> = () => <HIcon level={level} />;
    Cmp.displayName = `H${level}`;
    return Cmp;
  }
  return null;
}
