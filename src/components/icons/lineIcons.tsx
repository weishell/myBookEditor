// 全站统一的「线性图标」集（飞书风格）
//
// 规格（所有图标必须一致，否则又会回到"各写各的风格"）：
//   24×24 viewBox、fill: none、strokeWidth 1.8、圆头端点/连接、stroke = color（默认 currentColor）
//
// 为什么有这个文件：这些图标原先散落在三个地方 ——
//   1. DocBar.tsx 里私有的一整套（事实标准）
//   2. FloatBar/blockTypeIcons.tsx 里又抄了一份块类型图标
//   3. 块菜单 / 块类型面板 / 斜杠菜单里则混着 emoji 与文字字符（🎨 💬 ✂ 📋 🗑 🌐 ⊞ ▦ ⏳ …）
// 于是同样一个"表格"在不同面板长得完全不一样。这里把 DocBar 那套抽出来作为唯一来源，
// 其余全部改用它 —— DocBar / FloatBar / 块菜单 / 块类型面板 / 斜杠菜单从此同源同风格。
//
// 刻意保留为**文字**的图标：T / H1-H9 / Aa（字母本身就是图标，飞书同款），不算另一种风格。

export interface SvgIconProps {
  /** 笔画颜色；默认 currentColor，跟随外层 CSS 的 color */
  color?: string;
  size?: number;
}

// 通用线性图标样式
const lineProps = {
  fill: 'none',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

/* ============================ 块类型 ============================ */

/** 段落：字母 T */
export const ParagraphIcon = ({ color = 'currentColor', size = 20 }: SvgIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <text x="12" y="17" fontSize="13.5" fill={color} textAnchor="middle" fontWeight="bold">
      T
    </text>
  </svg>
);

/** 标题：字母 H{level} */
export const HeadingIcon = ({
  color = 'currentColor',
  size = 20,
  level = 1,
}: SvgIconProps & { level?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <text
      x="12"
      y="17"
      fontSize={level > 9 ? 9.5 : 11.5}
      fill={color}
      textAnchor="middle"
      fontWeight="bold"
    >
      H{level}
    </text>
  </svg>
);

/** 文档标题：T 形线性图标 */
export const DocTitleIcon = ({ color = 'currentColor', size = 18 }: SvgIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...lineProps} stroke={color}>
    <path d="M7 5.5h10M12 5.5v13" />
  </svg>
);

/** 加号（空块 / 在下方插入）；默认 22 与 DocBar 空块图标一致 */
export const PlusIcon = ({ color = 'currentColor', size = 22 }: SvgIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 5v14M5 12h14" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

/** 引用：双引号 */
export const QuoteIcon = ({ color = 'currentColor', size = 18 }: SvgIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...lineProps} stroke={color}>
    <path d="M10.5 7.5c-2.6 0-4.5 1.9-4.5 4.4V17h4.6v-4.6H8.4c0-1.2.7-2 2.1-2" />
    <path d="M18.5 7.5c-2.6 0-4.5 1.9-4.5 4.4V17h4.6v-4.6h-2.2c0-1.2.7-2 2.1-2" />
  </svg>
);

/** 提示块：方框 + 星标 */
export const HintIcon = ({ color = 'currentColor', size = 18 }: SvgIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...lineProps} stroke={color}>
    <rect x="4" y="3.5" width="16" height="17" rx="3" />
    <path
      d="M12 8.5l.9 1.8 2 .3-1.45 1.4.35 2-1.8-.95-1.8.95.35-2L9.1 10.6l2-.3z"
      strokeLinejoin="round"
    />
  </svg>
);

/** 代码块：{} 花括号 */
export const CodeBlockIcon = ({ color = 'currentColor', size = 18 }: SvgIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...lineProps} stroke={color}>
    <path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5c0 1.1.9 2 2 2h1" />
    <path d="M16 21h1a2 2 0 0 0 2-2v-5c0-1.1.9-2 2-2a2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1" />
  </svg>
);

/** 任务列表：方框 + 勾 */
export const TodoIcon = ({ color = 'currentColor', size = 18 }: SvgIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...lineProps} stroke={color}>
    <rect x="5.5" y="5.5" width="13" height="13" rx="2" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

/** 表格：表格线 */
export const TableIcon = ({ color = 'currentColor', size = 18 }: SvgIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...lineProps} stroke={color}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="2" />
    <path d="M3.5 9.5h17M3.5 15.5h17M9.5 3.5v17M15.5 3.5v17" />
  </svg>
);

/** 图片：框 + 山 + 太阳 */
export const ImageIcon = ({ color = 'currentColor', size = 18 }: SvgIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...lineProps} stroke={color}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <path d="M21 15.5l-5-5L5 21" />
  </svg>
);

/** 文件：折角文档 */
export const FileIcon = ({ color = 'currentColor', size = 18 }: SvgIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...lineProps} stroke={color}>
    <path d="M14 2.5H6a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2.5V8h5.5" />
  </svg>
);

/** 视频：屏幕 + 播放三角 */
export const VideoIcon = ({ color = 'currentColor', size = 18 }: SvgIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...lineProps} stroke={color}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M10.2 9.4l4.8 2.6-4.8 2.6z" strokeLinejoin="round" />
  </svg>
);

/** 分栏：外框 + 中分线 */
export const ColumnsIcon = ({ color = 'currentColor', size = 18 }: SvgIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...lineProps} stroke={color}>
    <rect x="3" y="3.5" width="18" height="17" rx="2" />
    <path d="M12 3.5v17" />
  </svg>
);

/** 内嵌网页：地球 */
export const GlobeIcon = ({ color = 'currentColor', size = 18 }: SvgIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...lineProps} stroke={color}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18" />
    <path d="M12 3c2.6 2.4 4 5.6 4 9s-1.4 6.6-4 9c-2.6-2.4-4-5.6-4-9s1.4-6.6 4-9z" />
  </svg>
);

/** 分隔线：一条横线 */
export const DividerIcon = ({ color = 'currentColor', size = 18 }: SvgIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M3 12h18" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

/** 流程图：菱形 + 两个矩形 + 连线 */
export const DrawioIcon = ({ color = 'currentColor', size = 18 }: SvgIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...lineProps} stroke={color}>
    <rect x="9" y="2.5" width="6" height="6" rx="1" transform="rotate(45 12 5.5)" />
    <rect x="3" y="15.5" width="7" height="6" rx="1" />
    <rect x="14" y="15.5" width="7" height="6" rx="1" />
    <path d="M12 8.5v3M12 11.5H6.5v4M12 11.5h5.5v4" />
  </svg>
);

/** 倒计时：沙漏 */
export const CountdownIcon = ({ color = 'currentColor', size = 18 }: SvgIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...lineProps} stroke={color}>
    <path d="M5 22h14M5 2h14" />
    <path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" />
    <path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" />
  </svg>
);

/** 日历：方框 + 双耳 + 日期点 */
export const CalendarIcon = ({ color = 'currentColor', size = 18 }: SvgIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...lineProps} stroke={color}>
    <rect x="3.5" y="5" width="17" height="15" rx="2" />
    <path d="M3.5 10h17M8 3v4M16 3v4" />
    <circle cx="8" cy="14" r="1" fill={color} stroke="none" />
    <circle cx="12" cy="14" r="1" fill={color} stroke="none" />
    <circle cx="16" cy="14" r="1" fill={color} stroke="none" />
  </svg>
);

/** 时间轴：虚线 + 三个实心点 */
export const TimelineIcon = ({ color = 'currentColor', size = 18 }: SvgIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...lineProps} stroke={color}>
    <path d="M3 12h18" strokeDasharray="2 2" />
    <circle cx="6" cy="12" r="1.6" fill={color} stroke="none" />
    <circle cx="12" cy="12" r="1.6" fill={color} stroke="none" />
    <circle cx="18" cy="12" r="1.6" fill={color} stroke="none" />
  </svg>
);

/** 图表：三根柱状条 */
export const ChartIcon = ({ color = 'currentColor', size = 18 }: SvgIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...lineProps} stroke={color}>
    <path d="M6 20V10M12 20V4M18 20v-7" strokeWidth="2" />
  </svg>
);

/** 画板：三个方框组合 */
export const DrawboardIcon = ({ color = 'currentColor', size = 18 }: SvgIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...lineProps} stroke={color}>
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="8" y="14" width="9" height="7" rx="1" />
  </svg>
);

/** 拖拽手柄：三横 */
export const DragHandleIcon = ({ color = 'currentColor', size = 16 }: SvgIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...lineProps} stroke={color}>
    <path d="M9 6h6M9 12h6M9 18h6" />
  </svg>
);

/* ============================ 操作 ============================ */

/** 缩进和对齐：左侧箭头 + 长短横线 */
export const IndentAlignIcon = ({ color = 'currentColor', size = 18 }: SvgIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...lineProps} stroke={color}>
    <path d="M3 5h18M3 19h18M10 9.5h11M10 14.5h11" />
    <path d="M3 9.5l3 2.5-3 2.5z" strokeLinejoin="round" />
  </svg>
);

/** 颜色：颜料滴 */
export const DropletIcon = ({ color = 'currentColor', size = 18 }: SvgIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...lineProps} stroke={color}>
    <path d="M12 3.2l5.2 5.2a7.3 7.3 0 1 1-10.4 0z" />
  </svg>
);

/** 艺术字：星芒 */
export const SparklesIcon = ({ color = 'currentColor', size = 18 }: SvgIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...lineProps} stroke={color}>
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6.2 6.2l2.6 2.6M15.2 15.2l2.6 2.6M17.8 6.2l-2.6 2.6M8.8 15.2l-2.6 2.6" />
  </svg>
);

/** 评论：对话气泡 */
export const CommentIcon = ({ color = 'currentColor', size = 18 }: SvgIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...lineProps} stroke={color}>
    <path d="M21 6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10l4 4v-4a2 2 0 0 0 2-2V6z" />
  </svg>
);

/** 剪切：剪刀 */
export const ScissorsIcon = ({ color = 'currentColor', size = 18 }: SvgIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...lineProps} stroke={color}>
    <circle cx="6" cy="6" r="2.6" />
    <circle cx="6" cy="18" r="2.6" />
    <path d="M19.5 4.5L8.4 15.6M13.8 13.8l5.7 5.7M8.4 8.4l3.6 3.6" />
  </svg>
);

/** 重置：逆时针环形箭头 */
export const ResetIcon = ({ color = 'currentColor', size = 18 }: SvgIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...lineProps} stroke={color}>
    <polyline points="2.5 4.5 2.5 10 8 10" />
    <path d="M4 15a9 9 0 1 0 1.4-8.6L2.5 10" />
  </svg>
);

/** 裁剪：四角 L 形选区（飞书风格）。区别于 ScissorsIcon（剪刀）：本图标强调"选区"。 */
export const CropIcon = ({ color = 'currentColor', size = 18 }: SvgIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...lineProps} stroke={color}>
    <path d="M6 2v6H2" />
    <path d="M18 2v6h4" />
    <path d="M6 22v-6H2" />
    <path d="M18 22v-6h4" />
    <path d="M8 10h8a2 2 0 0 1 2 2v6" />
    <rect x="8" y="10" width="8" height="8" rx="1" fill="none" />
  </svg>
);

/** 复制：两张叠纸 */
export const CopyIcon = ({ color = 'currentColor', size = 18 }: SvgIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...lineProps} stroke={color}>
    <rect x="9" y="9" width="12" height="12" rx="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

/** 删除：垃圾桶 */
export const TrashIcon = ({ color = 'currentColor', size = 18 }: SvgIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...lineProps} stroke={color}>
    <path d="M3.5 6.5h17M9 6.5V4.5h6v2M18.5 6.5l-.9 13a2 2 0 0 1-2 1.9H8.4a2 2 0 0 1-2-1.9l-.9-13" />
    <path d="M10 10.5v7M14 10.5v7" />
  </svg>
);

/** 链接：链环 */
export const LinkIcon = ({ color = 'currentColor', size = 18 }: SvgIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...lineProps} stroke={color}>
    <path d="M10 13.5a4.6 4.6 0 0 0 6.9.5l2.6-2.6a4.6 4.6 0 0 0-6.5-6.5l-1.5 1.5" />
    <path d="M14 10.5a4.6 4.6 0 0 0-6.9-.5l-2.6 2.6a4.6 4.6 0 0 0 6.5 6.5l1.5-1.5" />
  </svg>
);

/** 行内代码：尖括号对（与代码块的 {} 区分） */
export const InlineCodeIcon = ({ color = 'currentColor', size = 18 }: SvgIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...lineProps} stroke={color}>
    <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" />
  </svg>
);

/** 公式：Σ */
export const SigmaIcon = ({ color = 'currentColor', size = 18 }: SvgIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...lineProps} stroke={color}>
    <path d="M18 4.5H6l6 7.5-6 7.5h12" />
  </svg>
);
