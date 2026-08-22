import { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useSlate, ReactEditor } from 'slate-react';
import { Range } from 'slate';
import { getMentionTriggerRange, getMentionSearchText, insertMention } from './mention-utils';
import type { MentionItem } from './mention-data';
import { MentionPicker } from './MentionPicker';

interface MentionControllerProps {
  isDark?: boolean;
}

/**
 * 艾特控制器：
 *  - 每次编辑器内容变化后检测光标前是否有合法的 @ 触发符
 *  - 显示/隐藏 MentionPicker
 *  - 处理选中后插入 mention 元素
 */
export const MentionController = ({ isDark = false }: MentionControllerProps) => {
  const editor = useSlate();
  const [visible, setVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRangeRef = useRef<Range | null>(null);
  const rafRef = useRef<number | null>(null);

  /** 更新弹框状态：检测触发、计算位置、更新搜索词 */
  const updateMentionState = useCallback(() => {
    const range = getMentionTriggerRange(editor);
    triggerRangeRef.current = range;

    if (!range) {
      setVisible(false);
      return;
    }

    const text = getMentionSearchText(editor, range);
    setSearchText(text);

    // 用 DOM range 计算 @ 位置的屏幕坐标
    try {
      const domRange = ReactEditor.toDOMRange(editor, range);
      const rect = domRange.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 6,
        left: rect.left,
      });
    } catch {
      // 定位失败就保持上一次位置
    }

    setVisible(true);
  }, [editor]);

  // 每次渲染后检查一次（useSlate 会订阅编辑器变化导致重渲染）
  useEffect(() => {
    if (rafRef.current !== null) {
      window.cancelAnimationFrame(rafRef.current);
    }
    rafRef.current = window.requestAnimationFrame(() => {
      rafRef.current = null;
      updateMentionState();
    });
    return () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  });

  /** 选中一个条目：插入艾特元素 */
  const handleSelect = useCallback(
    (item: MentionItem) => {
      const range = triggerRangeRef.current;
      if (!range) return;
      insertMention(
        editor,
        {
          name: item.name,
          kind: item.kind,
          targetId: item.id,
        },
        range,
      );
      setVisible(false);
      triggerRangeRef.current = null;
    },
    [editor],
  );

  const handleClose = useCallback(() => {
    setVisible(false);
    triggerRangeRef.current = null;
  }, []);

  if (!visible) return null;

  return createPortal(
    <MentionPicker
      searchText={searchText}
      position={position}
      isDark={isDark}
      onSelect={handleSelect}
      onClose={handleClose}
    />,
    document.body,
  );
};
