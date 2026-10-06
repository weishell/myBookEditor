// 块类型选择器 - 供"在下方插入"等场景复用（飞书风格）
// 基础组：按钮组（与左侧菜单顶部 toolbar 视觉一致）
// 常用组：列表项，非文本类占位禁用
//
// 文案全部走 i18n（blockPicker.*）：labelKey 存 key，渲染时再取词条——
// 模块级常量里拿不到 useTranslation，所以不能在定义处直接翻。
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BlockElementType } from '@/enums';
import { blockTypeIcon } from '@/components/FloatBar/blockTypeIcons';
import type { BlockType } from '@/components/FloatBar/blockType';
import { headingBlockLabel } from '@/utils/block-label';
import {
  CalendarIcon,
  ChartIcon,
  ColumnsIcon,
  CountdownIcon,
  DividerIcon,
  DrawboardIcon,
  DrawioIcon,
  FileIcon,
  GlobeIcon,
  ImageIcon,
  TableIcon,
  TimelineIcon,
  VideoIcon,
} from '@/components/icons/lineIcons';
import styles from './BlockTypePicker.module.less';

export interface BlockTypeOption {
  type: BlockElementType;
  /** i18n key；标题类会带上层级参数（见 labelOf） */
  labelKey: string;
  icon: React.ReactNode;
  level?: number;
  disabled?: boolean;
  mono?: boolean;
  isColumn?: boolean;
}

interface BlockTypePickerProps {
  onSelect: (type: BlockElementType, options?: { level?: number; columns?: number }) => void;
}

// 基础组（文本类，可用）：H1-H9 完整展示，与 ContextMenu 块类型区一致。
// 图标统一从 FloatBar 的 blockTypeIcons 走，跨组件单源（避免再分头维护 SVG）。
const BASIC_ITEMS: BlockTypeOption[] = [
  {
    type: BlockElementType.PARAGRAPH,
    labelKey: 'blockPicker.paragraph',
    icon: blockTypeIcon('paragraph'),
  },
  ...([1, 2, 3, 4, 5, 6, 7, 8, 9] as const).map<BlockTypeOption>((level) => ({
    type: BlockElementType.HEADING,
    labelKey: 'blockPicker.heading',
    level,
    icon: blockTypeIcon(`h${level}` as BlockType),
  })),
  // ↓ 后两行的顺序必须与「块菜单」和「FloatBar 合并菜单」完全一致，
  //   否则同一位置摆的是不同图标，看起来就像"没对齐"：
  //     有序 → 无序 → 任务 → 代码块 → 引用 → 提示块
  {
    type: BlockElementType.NUMBERED_LIST,
    labelKey: 'blockPicker.numberedList',
    icon: blockTypeIcon('numbered'),
  },
  {
    type: BlockElementType.BULLETED_LIST,
    labelKey: 'blockPicker.bulletedList',
    icon: blockTypeIcon('bulleted'),
  },
  {
    type: BlockElementType.TODO_LIST,
    labelKey: 'blockPicker.todoList',
    icon: blockTypeIcon('todo'),
  },
  {
    type: BlockElementType.CODE_BLOCK,
    labelKey: 'blockPicker.codeBlock',
    icon: blockTypeIcon('code-block'),
    mono: true,
  },
  {
    type: BlockElementType.BLOCKQUOTE,
    labelKey: 'blockPicker.blockquote',
    icon: blockTypeIcon('quote'),
  },
  {
    type: BlockElementType.HINT_BLOCK,
    labelKey: 'blockPicker.hintBlock',
    icon: blockTypeIcon('hint'),
  },
];

// 常用组（非文本类）- 列表项风格。
// 图标统一走 @/components/icons/lineIcons（与 DocBar / 块菜单同源），不再用 emoji ——
// emoji 在不同系统渲染出的形态/大小都不一样，是"各个风格"的主要来源。
const COMMON_ITEMS: BlockTypeOption[] = [
  {
    type: BlockElementType.IMAGE_BLOCK,
    labelKey: 'blockPicker.image',
    icon: <ImageIcon size={16} />,
  },
  { type: BlockElementType.FILE_BLOCK, labelKey: 'blockPicker.file', icon: <FileIcon size={16} /> },
  {
    type: BlockElementType.VIDEO_BLOCK,
    labelKey: 'blockPicker.video',
    icon: <VideoIcon size={16} />,
  },
  { type: BlockElementType.TABLE, labelKey: 'blockPicker.table', icon: <TableIcon size={16} /> },
  {
    type: BlockElementType.COLUMN_GROUP,
    labelKey: 'blockPicker.columns',
    icon: <ColumnsIcon size={16} />,
    isColumn: true,
  },
  {
    type: BlockElementType.COUNTDOWN,
    labelKey: 'blockPicker.countdown',
    icon: <CountdownIcon size={16} />,
  },
  { type: BlockElementType.CHART, labelKey: 'blockPicker.chart', icon: <ChartIcon size={16} /> },
  {
    type: BlockElementType.CALENDAR,
    labelKey: 'blockPicker.calendar',
    icon: <CalendarIcon size={16} />,
  },
  {
    type: BlockElementType.TIMELINE,
    labelKey: 'blockPicker.timeline',
    icon: <TimelineIcon size={16} />,
  },
  { type: BlockElementType.EMBED, labelKey: 'blockPicker.embed', icon: <GlobeIcon size={16} /> },
  {
    type: BlockElementType.DRAWBOARD,
    labelKey: 'blockPicker.drawboard',
    icon: <DrawboardIcon size={16} />,
  },
  { type: BlockElementType.DRAWIO, labelKey: 'blockPicker.drawio', icon: <DrawioIcon size={16} /> },
  {
    type: BlockElementType.DIVIDER,
    labelKey: 'blockPicker.divider',
    icon: <DividerIcon size={16} />,
  },
];

const COLUMN_PRESETS = [2, 3, 4, 5];

export const BlockTypePicker: React.FC<BlockTypePickerProps> = ({ onSelect }) => {
  const { t } = useTranslation();
  const [showColumnPicker, setShowColumnPicker] = useState(false);

  // 标题类把层级塞进文案：中文「一级标题」，其它语言「Heading 1」（与 FloatBar 共用同一拼装）
  const labelOf = (item: BlockTypeOption): string =>
    item.level ? headingBlockLabel(t, item.level) : t(item.labelKey);

  const handleItemClick = (item: BlockTypeOption) => {
    if (item.isColumn) {
      setShowColumnPicker(true);
      return;
    }
    onSelect(item.type, item.level ? { level: item.level } : undefined);
  };

  const handleColumnSelect = (columns: number) => {
    onSelect(BlockElementType.COLUMN_GROUP, { columns });
    setShowColumnPicker(false);
  };

  if (showColumnPicker) {
    return (
      <div className={styles.picker}>
        <div className={styles.groupLabel}>{t('blockPicker.columnCount')}</div>
        <div className={styles.columnPicker}>
          {COLUMN_PRESETS.map((count) => (
            <button
              key={count}
              className={styles.columnPreset}
              onClick={() => handleColumnSelect(count)}
              title={t('blockPicker.columnCountTitle', { n: count })}
            >
              <div className={styles.columnPreview}>
                {Array.from({ length: count }, (_, i) => (
                  <div key={i} className={styles.columnPreviewBar} />
                ))}
              </div>
            </button>
          ))}
        </div>
        <button className={styles.columnBack} onClick={() => setShowColumnPicker(false)}>
          ← {t('blockPicker.back')}
        </button>
      </div>
    );
  }

  return (
    <div className={styles.picker}>
      <div className={styles.groupLabel}>{t('blockPicker.basic')}</div>
      <div className={styles.toolbar}>
        {BASIC_ITEMS.map((item) => (
          <button
            key={`${item.type}-${item.level ?? ''}`}
            className={`${styles.btn} ${item.mono ? styles.btnMono : ''} ${
              item.level ? styles.btnBold : ''
            }`}
            title={labelOf(item)}
            onClick={() => handleItemClick(item)}
          >
            {item.icon}
          </button>
        ))}
      </div>
      <div className={styles.groupDivider} />
      <div className={styles.groupLabel}>{t('blockPicker.common')}</div>
      <div className={styles.group}>
        {COMMON_ITEMS.map((item) => (
          <button
            key={`${item.type}-${item.level ?? ''}`}
            className={styles.item}
            disabled={item.disabled}
            onClick={() => handleItemClick(item)}
          >
            <span className={styles.itemIcon}>{item.icon}</span>
            <span>{labelOf(item)}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
