// 「尾部幽灵空行」：仿飞书——最后一个 block 下方其实没有这个段落，
// 悬浮到该空白处时显示一个主题色 + 图标；点击空白处才真正插入一个空段落并聚焦。
import { useCallback, useEffect, useRef, useState } from 'react';
import { Editor, Transforms } from 'slate';
import { useSlateStatic, ReactEditor } from 'slate-react';
import { BlockElementType } from '@/enums';
import { createBlockNode } from '@/plugins/block-picker/block-nodes';
import { useTheme } from '@/context/ThemeContext';

const GHOST_GAP = 10; // 最后内容与幽灵线之间的间距
const ZONE_BOTTOM_MARGIN = 30; // 纸张底部留白，避免在 padding 外仍触发
const PAD_LEFT = 65; // 与 data-paper 的 padding-left 对齐（内容左边缘在纸张外侧 65px）
const PAD_RIGHT = 65;

interface GhostPos {
  left: number; // 视口坐标（position: fixed）
  top: number;
}

export const TrailingAddZone = () => {
  const editor = useSlateStatic();
  const { isDarkMode } = useTheme();
  const [ghost, setGhost] = useState<GhostPos | null>(null);
  const ghostRef = useRef<GhostPos | null>(ghost);
  ghostRef.current = ghost;

  const insertAndFocus = useCallback(() => {
    const node = createBlockNode(BlockElementType.PARAGRAPH);
    Editor.withoutNormalizing(editor, () => {
      Transforms.insertNodes(editor, node, { at: [editor.children.length] });
    });
    const targetPath = [editor.children.length - 1];
    try {
      Transforms.select(editor, Editor.start(editor, targetPath));
      ReactEditor.focus(editor);
    } catch {
      /* 节点刚插入，start 一定可取，异常则忽略 */
    }
  }, [editor]);

  // 计算某视口坐标是否落在「最后一个 block 下方空白区」
  const zoneAt = useCallback((clientX: number, clientY: number, paper: HTMLElement) => {
    const blocks = Array.from(paper.querySelectorAll('[data-plugin-id]')) as HTMLElement[];
    let bottom = 0;
    let lastIsEmptyParagraph = false;
    for (const b of blocks) {
      const r = b.getBoundingClientRect();
      if (r.bottom > bottom) {
        bottom = r.bottom;
        lastIsEmptyParagraph = b.getAttribute('data-empty') === 'true';
      }
    }
    // 若最后一个 block 本身就是空段落，已有可点击的空行，无需幽灵行
    if (lastIsEmptyParagraph) return null;

    const paperRect = paper.getBoundingClientRect();
    const base = bottom > 0 ? bottom : paperRect.top + 40; // 空文档时从内容区顶部开始
    const zoneTop = base + GHOST_GAP;
    const zoneBottom = paperRect.bottom - ZONE_BOTTOM_MARGIN;
    if (clientY < zoneTop || clientY > zoneBottom) return null;

    const contentLeft = paperRect.left + PAD_LEFT;
    const contentRight = paperRect.right - PAD_RIGHT;
    if (clientX < contentLeft - 60 || clientX > contentRight) return null;

    return { left: contentLeft - 30, top: base + 4 };
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const paper = (e.target as HTMLElement)?.closest?.('[data-paper]') as HTMLElement | null;
      if (!paper) {
        setGhost(null);
        return;
      }
      setGhost(zoneAt(e.clientX, e.clientY, paper));
    };

    const onDown = (e: MouseEvent) => {
      if (!ghostRef.current) return;
      const t = e.target as HTMLElement;
      // 只接管「空白处」的点击；点到块内容/交互控件不放行
      if (t.closest('[data-plugin-id]') || t.closest('[data-docbar-area]')) return;
      e.preventDefault();
      e.stopPropagation();
      insertAndFocus();
      setGhost(null);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mousedown', onDown, true);
    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mousedown', onDown, true);
    };
  }, [insertAndFocus, zoneAt]);

  if (!ghost) return null;

  const color = isDarkMode ? 'var(--dm-text-primary, #e5e7eb)' : 'var(--theme-primary)';

  return (
    <div
      data-ghost-add
      style={{
        position: 'fixed',
        left: ghost.left,
        top: ghost.top,
        width: 30,
        height: 30,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'default',
        pointerEvents: 'none',
        color,
        opacity: 0.55,
        transition: 'opacity 0.15s',
        zIndex: 90,
      }}
    >
      <svg width={22} height={22} viewBox="0 0 24 24" fill="none">
        <path d="M12 5v14M5 12h14" stroke={color} strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  );
};
