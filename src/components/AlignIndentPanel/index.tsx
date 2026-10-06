// 对齐 / 缩进子面板（块操作菜单 ContextMenu 与浮动工具条 FloatBar 共用）
//
// 抽出来的动机：两个入口都要这套「对齐 + 缩进」，图标也随之单源，
// 避免两边各维护一份 SVG。
//
// 交互约定：
//  - 面板内改完值不自动收起（可连续调整对齐 + 缩进），由外层决定何时关闭；
//  - 按钮 onMouseDown 一律 preventDefault：FloatBar 场景要靠「不夺焦」保住正文选区，
//    否则点一下按钮 DOM 选区就没了。preventDefault 不影响 click 触发。
import { ALIGN_OPTIONS, type TextAlignValue } from '@/utils/alignment';
import { MAX_INDENT } from '@/utils/indent';
import styles from './AlignIndentPanel.module.less';

const alignLabel: Record<string, string> = {
  left: '左对齐',
  center: '居中对齐',
  right: '右对齐',
};

/** 对齐图标：四行横向线段，按对齐方式改变行的起点/长度（也用于工具条按钮） */
export const AlignIcon = ({
  align,
  active,
  size = 18,
}: {
  align: string;
  active?: boolean;
  size?: number;
}) => {
  const color = active ? '#fff' : 'currentColor';
  const baseW = 13;
  const full = [1, 1, 0.55, 1] as const; // 各行相对长度，模拟“长短行”
  const lines = full.map((f, i) => {
    const w = Math.round(baseW * f);
    const gap = (18 - w) / 2;
    let x = 2.5;
    if (align === 'center') x = gap;
    else if (align === 'right') x = 18 - w - 2.5;
    // left：左起即可
    const y = 3 + i * 4;
    return <rect key={i} x={x} y={y} width={w} height={2} rx={1} fill={color} />;
  });
  return (
    <svg width={size} height={size} viewBox="0 0 18 18">
      {lines}
    </svg>
  );
};

// 增加缩进：左侧竖条 + 向右箭头
const IndentIncIcon = ({ size = 18 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 18 18"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3.5 3.5v11M3.5 9h8.5M8.5 6.5l3 2.5-3 2.5" />
  </svg>
);

// 减少缩进：左侧竖条 + 向左箭头
const IndentDecIcon = ({ size = 18 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 18 18"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3.5 3.5v11M14.5 9H6M9.5 6.5l-3 2.5 3 2.5" />
  </svg>
);

export interface AlignIndentPanelProps {
  /** 当前块不支持对齐/缩进时为 true（整体禁用） */
  disabled: boolean;
  /** 当前对齐值（缺省视为左对齐） */
  align?: TextAlignValue;
  /** 当前缩进级别（多块选区时通常传首个块的值） */
  indent: number;
  /**
   * 多块选区时，缩进级别的最小 / 最大值（用于禁用态判断）：
   *  - 增加缩进：全部到达上限才禁用（用 indentMax）
   *  - 减少缩进：全部为 0 才禁用（用 indentMin）
   * 不传则退化为按 indent 单值判断。
   */
  indentMin?: number;
  indentMax?: number;
  /** 最大缩进级别，默认取全局 MAX_INDENT */
  maxIndent?: number;
  onAlign: (align: TextAlignValue) => void;
  /** delta 为 +1 / -1 */
  onIndentChange: (delta: number) => void;
}

const AlignIndentPanel = ({
  disabled,
  align,
  indent,
  indentMin,
  indentMax,
  maxIndent = MAX_INDENT,
  onAlign,
  onIndentChange,
}: AlignIndentPanelProps) => (
  <div className={styles.alignPanel}>
    <div className={styles.alignLabel}>对齐</div>
    <div className={styles.alignRow}>
      {ALIGN_OPTIONS.map((a) => {
        const active = align === a;
        return (
          <button
            key={a}
            type="button"
            className={active ? styles.alignBtnActive : styles.alignBtn}
            disabled={disabled}
            title={alignLabel[a]}
            onMouseDown={(e) => e.preventDefault()}
            onClick={(e) => {
              e.stopPropagation();
              onAlign(a);
            }}
          >
            <AlignIcon align={a} active={active} />
          </button>
        );
      })}
    </div>
    <div className={styles.alignDivider} />
    <div className={styles.alignLabel}>缩进</div>
    <div className={styles.alignRow}>
      <button
        type="button"
        className={styles.alignBtn}
        disabled={disabled || (indentMax ?? indent) >= maxIndent}
        title="增加缩进"
        onMouseDown={(e) => e.preventDefault()}
        onClick={(e) => {
          e.stopPropagation();
          onIndentChange(1);
        }}
      >
        <IndentIncIcon />
      </button>
      <button
        type="button"
        className={styles.alignBtn}
        disabled={disabled || (indentMin ?? indent) <= 0}
        title="减少缩进"
        onMouseDown={(e) => e.preventDefault()}
        onClick={(e) => {
          e.stopPropagation();
          onIndentChange(-1);
        }}
      >
        <IndentDecIcon />
      </button>
    </div>
  </div>
);

export default AlignIndentPanel;
