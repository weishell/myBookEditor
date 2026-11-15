// 视觉块（图表 / 流程图 / 图片 / 媒体 / 时间轴 / 内嵌网页）的块级评论。
//
// 为什么需要：这些块内部没有正文文本，无法用「选中文字 → 评论」的行内评论；
// 但它们恰恰是最常被讨论的内容（一张图、一张流程图）。只读模式下它们的编辑类
// 按钮（对齐 / 编辑 / 删除 / 缩放）必须全部隐藏，评论是唯一还该保留的操作，
// 所以工具条在只读时只剩这一个按钮。
//
// 这套逻辑最早写在画板（plugins/drawboard/Drawboard.tsx）里，这里抽出来复用，
// 语义与行内评论一致：会话的 rangeKey = block:<块 id>，见 inline-comment/store.ts。

import React, { useCallback, useMemo } from 'react';
import { useReadOnly } from 'slate-react';
import { useTranslation } from 'react-i18next';
import { useEditorMode } from '@/context/EditorContext';
import { CommentIcon } from '@/components/icons/lineIcons';
import { useInlineComments } from '../inline-comment';
import { blockRangeKey } from '../inline-comment/store';

/**
 * 视觉块是否处于只读态。
 * 两种来源都要算：Slate 的 readOnly（阅读模式，或数据源不可写）与全局 mode。
 * 注意不要直接用 useEditorMode().mode —— 数据源只读（static / 非 api）时
 * Editable 是 readOnly，但 mode 仍是 'edit'，此时同样不该出现编辑按钮。
 */
export function useVisualBlockReadOnly(): boolean {
  const readOnly = useReadOnly();
  const { mode } = useEditorMode();
  return readOnly || mode === 'read';
}

interface BlockCommentApi {
  /** 该块上未解决的评论数（用于按钮角标） */
  count: number;
  /** 打开/继续该块的评论面板（坐标取按钮位置，点击处弹出） */
  openComment: (e: React.MouseEvent<HTMLElement>) => void;
}

/**
 * 块级评论：同一个块重复点「评论」= 追加到已有会话（与重选同一段文字一致）。
 * @param blockId 块节点 id（Slate element.id）
 * @param label 引用文案（评论面板里显示"评论的是哪一块"）
 */
export function useBlockComment(blockId: string | undefined, label: string): BlockCommentApi {
  const { threads, toggleBlockComment } = useInlineComments();
  // 老数据可能没有 id：给一个只在本组件生命周期内稳定的兜底 key，
  // 至少同一次浏览里反复点能落在同一个会话上。
  const fallbackId = useMemo(() => `tmp-${Math.random().toString(36).slice(2, 10)}`, []);
  const id = blockId || fallbackId;

  const count = useMemo(
    () => threads.filter((t) => t.rangeKey === blockRangeKey(id) && !t.resolved).length,
    [threads, id],
  );

  const openComment = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      e.stopPropagation();
      const rect = e.currentTarget.getBoundingClientRect();
      toggleBlockComment(id, label, rect.left, rect.bottom + 6);
    },
    [id, label, toggleBlockComment],
  );

  return { count, openComment };
}

const badgeStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: 16,
  height: 16,
  marginLeft: 4,
  padding: '0 4px',
  borderRadius: 999,
  background: 'rgba(51,112,255,0.14)',
  color: 'var(--lw-primary, #3370ff)',
  fontSize: 11,
  fontWeight: 600,
  lineHeight: 1,
};

// 各插件的 toolbarButton 大多是固定 28×28 的纯图标按钮，这里放宽成自适应宽度，
// 否则「评论 + 数量」会被压扁溢出（只读模式下工具条只剩这一个按钮，宽一点无副作用）
const buttonStyle: React.CSSProperties = {
  width: 'auto',
  minWidth: 28,
  padding: '0 8px',
  boxSizing: 'border-box',
};

export interface BlockCommentButtonProps {
  count: number;
  onComment: (e: React.MouseEvent<HTMLButtonElement>) => void;
  /** 各插件自己的工具条按钮样式（保持现有视觉） */
  className?: string;
  /** 是否带「评论」文字：图片/媒体这类纯图标工具条传 false */
  withLabel?: boolean;
  iconSize?: number;
}

/** 工具条里的「评论」按钮：图标 + 可选文字 + 未解决数量角标 */
export const BlockCommentButton: React.FC<BlockCommentButtonProps> = ({
  count,
  onComment,
  className,
  withLabel = true,
  iconSize = 14,
}) => {
  const { t } = useTranslation();
  return (
    <button
      type="button"
      className={className}
      style={buttonStyle}
      title={t('blockMenu.comment')}
      // 工具条按钮统一：按下时不抢焦点，避免 contenteditable 失焦导致浮层被关
      onMouseDown={(e) => e.preventDefault()}
      onClick={onComment}
    >
      <CommentIcon size={iconSize} />
      {withLabel && <span>{t('blockMenu.comment')}</span>}
      {count > 0 && <span style={badgeStyle}>{count}</span>}
    </button>
  );
};
