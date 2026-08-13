// 块类型选择器 - 供"在下方插入"等场景复用（飞书风格）
// 基础组：按钮组（与左侧菜单顶部 toolbar 视觉一致）
// 常用组：列表项，非文本类占位禁用
import React from 'react';
import { BlockElementType } from '@/enums';
import styles from './BlockTypePicker.module.less';

export interface BlockTypeOption {
  type: BlockElementType;
  label: string;
  icon: string;
  level?: number;
  disabled?: boolean;
  mono?: boolean;
}

interface BlockTypePickerProps {
  onSelect: (type: BlockElementType, options?: { level?: number }) => void;
}

// 基础组（文本类，可用）- 按钮组风格
const BASIC_ITEMS: BlockTypeOption[] = [
  { type: BlockElementType.PARAGRAPH, label: '正文', icon: 'T' },
  { type: BlockElementType.HEADING, label: '一级标题', icon: 'H1', level: 1 },
  { type: BlockElementType.HEADING, label: '二级标题', icon: 'H2', level: 2 },
  { type: BlockElementType.HEADING, label: '三级标题', icon: 'H3', level: 3 },
  { type: BlockElementType.BULLETED_LIST, label: '无序列表', icon: '≡' },
  { type: BlockElementType.NUMBERED_LIST, label: '有序列表', icon: '1.' },
  { type: BlockElementType.TODO_LIST, label: '待办事项', icon: '☐' },
  { type: BlockElementType.BLOCKQUOTE, label: '引用块', icon: '❝' },
  { type: BlockElementType.CODE_BLOCK, label: '代码块', icon: '</>', mono: true },
];

// 常用组（非文本类，占位禁用）- 列表项风格
const COMMON_ITEMS: BlockTypeOption[] = [
  { type: BlockElementType.IMAGE_BLOCK, label: '图片', icon: '🖼', disabled: true },
  { type: BlockElementType.TABLE, label: '表格', icon: '⊞', disabled: true },
  { type: BlockElementType.DRAWIO, label: '流程图', icon: '⇄', disabled: true },
  { type: BlockElementType.DIVIDER, label: '分隔线', icon: '—', disabled: true },
];

export const BlockTypePicker: React.FC<BlockTypePickerProps> = ({ onSelect }) => (
  <div className={styles.picker}>
    <div className={styles.groupLabel}>基础</div>
    <div className={styles.toolbar}>
      {BASIC_ITEMS.map((item) => (
        <button
          key={`${item.type}-${item.level ?? ''}`}
          className={`${styles.btn} ${item.mono ? styles.btnMono : ''} ${
            item.level ? styles.btnBold : ''
          }`}
          title={item.label}
          onClick={() => onSelect(item.type, item.level ? { level: item.level } : undefined)}
        >
          {item.icon}
        </button>
      ))}
    </div>
    <div className={styles.groupDivider} />
    <div className={styles.groupLabel}>常用</div>
    <div className={styles.group}>
      {COMMON_ITEMS.map((item) => (
        <button
          key={`${item.type}-${item.level ?? ''}`}
          className={styles.item}
          disabled={item.disabled}
          onClick={() => onSelect(item.type, item.level ? { level: item.level } : undefined)}
        >
          <span className={styles.itemIcon}>{item.icon}</span>
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  </div>
);
