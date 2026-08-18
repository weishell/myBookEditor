// 编辑器全局 keydown 事件调度器（唯一入口）
//
// 职责：
//   1. 所有需要劫持的按键在这里集中登记、分发，按键类型各走各的 handler
//   2. 每个被接管的按键先打一条 [keydown] 日志（含按键组合 + 当前块类型），
//      便于确认劫持生效；后续替换为具体处理逻辑时逐个摘除
//
// 分发规则：
//   - 组合键（Ctrl/Cmd/Alt + 字符键）：登记日志后不拦截，先放行默认行为
//   - Enter / Tab / Shift+Tab / Backspace / Delete：已有专属 handler，转交执行
//   - 其余按键：不拦截，走 Slate 默认行为
import { Transforms, Editor, Range, Point } from 'slate';
import type { Location } from 'slate';
import { BlockElementType } from '@/enums';
import { getLilist, removeLilist } from '@/plugins/lilist';
import { handleEnter } from './handleEnter';
import { handleTabIndent } from './handleTab';

/** 当前选区所在块的 type（日志用，非块/无选区返回 undefined） */
const getCurrentBlockType = (editor: Editor): string | undefined => {
  try {
    const match = (editor as any).above({
      match: (n: any) => (editor as any).isBlock(n),
      mode: 'lowest',
    });
    return match ? (match[0] as any)?.type : undefined;
  } catch {
    return undefined;
  }
};

/** 拼出可读按键名，如 ctrl+shift+Enter */
const describeKey = (e: React.KeyboardEvent): string => {
  const parts: string[] = [];
  if (e.ctrlKey) parts.push('ctrl');
  if (e.metaKey) parts.push('cmd');
  if (e.altKey) parts.push('alt');
  if (e.shiftKey) parts.push('shift');
  parts.push(e.key);
  return parts.join('+');
};

/**
 * 判断按键是否已被本调度器接管（preventDefault）。
 * withDelete 等下游需要区分"本次删除是否被上游拦走"。
 */
export const isKeyConsumed = (e: React.KeyboardEvent): boolean => {
  // 组合键一律不拦（ctrl+z 撤销等走默认）
  if (e.ctrlKey || e.metaKey || e.altKey) return false;
  switch (e.key) {
    case 'Enter':
      return !e.shiftKey; // Shift+Enter 软换行暂不拦
    case 'Tab':
    case 'Backspace':
      return true;
    default:
      return false;
  }
};

/**
 * Ctrl+A / Cmd+A 全选：手动把 Slate 内部的 editor.selection 设置为整个编辑器范围。
 * 浏览器默认 Ctrl+A 只改 DOM 高亮，不同步 editor.selection，会导致后续 Backspace 只删一个字符
 */
const handleSelectAll = (editor: Editor, e: React.KeyboardEvent): boolean => {
  if (!(e.ctrlKey || e.metaKey) || e.key.toLowerCase() !== 'a') return false;
  try {
    const children = (editor as any).children as any[];
    if (!children || children.length === 0) return false;

    const firstPath: Location = [0];
    const lastPath: Location = [children.length - 1];
    let start: any;
    let end: any;
    try {
      start = (Editor as any).start(editor, firstPath);
      end = (Editor as any).end(editor, lastPath);
    } catch {
      start = { path: [0, 0], offset: 0 };
      const lastChild = children[children.length - 1];
      const text = lastChild && Array.isArray(lastChild.children) ? lastChild.children[0] : null;
      const offset = text && typeof text.text === 'string' ? text.text.length : 0;
      const lastTextPath =
        text && Array.isArray(lastChild.children) && lastChild.children.length > 0
          ? [children.length - 1, 0]
          : [children.length - 1];
      end = { path: lastTextPath, offset };
    }

    const at: any = { anchor: start, focus: end };
    if (!Range.isRange(at)) {
      try {
        Transforms.select(editor, (Editor as any).range(editor, []));
      } catch {
        /* ignore */
      }
    } else {
      Transforms.select(editor, at);
    }
    e.preventDefault();
    e.stopPropagation();
    return true;
  } catch {
    return false;
  }
};

/**
 * 列表项行首退格 → 退出列表（保留文字），与 Word / 飞书行为一致
 */
const handleLilistBackspace = (editor: Editor): boolean => {
  const { selection } = editor;
  if (!selection || !Range.isCollapsed(selection)) return false;

  const match = (editor as any).above({
    match: (n: any) => (editor as any).isBlock(n),
    mode: 'lowest',
  });
  if (!match) return false;

  const [node, path] = match;
  if (!getLilist(node)) return false;

  const start = (Editor as any).start(editor, path);
  if (!Point.equals(selection.anchor, start)) return false;

  removeLilist(editor, path);
  return true;
};

export const createKeyDownHandler = (editor: Editor) => {
  return (e: React.KeyboardEvent) => {
    const keyLabel = describeKey(e);
    const blockType = getCurrentBlockType(editor) as BlockElementType | undefined;

    // 组合键：Ctrl+A 全选需要手动同步 Slate selection，其余登记但不拦截
    if (e.ctrlKey || e.metaKey || e.altKey) {
      if (handleSelectAll(editor, e)) {
        console.log('[keydown] ctrl/cmd+A → 手动同步 Slate 全选', { blockType });
        return;
      }
      console.log('[keydown] 组合键（未拦截）', { key: keyLabel, blockType });
      return;
    }

    switch (e.key) {
      case 'Enter': {
        if (e.shiftKey) {
          console.log('[keydown] Shift+Enter（未拦截，走默认软换行）', { blockType });
          return;
        }
        console.log('[keydown] Enter → handleEnter', { blockType });
        e.preventDefault();
        handleEnter(editor);
        return;
      }
      case 'Tab': {
        console.log('[keydown] Tab → handleTabIndent', { blockType });
        handleTabIndent(editor, e);
        return;
      }
      case 'Backspace': {
        // 列表项行首退格 → 退出列表
        if (handleLilistBackspace(editor)) {
          console.log('[keydown] Backspace → 列表项行首，退出列表', { blockType });
          e.preventDefault();
          return;
        }
        console.log('[keydown] Backspace（暂走默认删除）', { blockType });
        return;
      }
      case 'Delete': {
        console.log('[keydown] Delete（暂走默认删除）', { blockType });
        return;
      }
      default:
        // 其余按键不拦截、不打日志（避免打字刷屏）
        return;
    }
  };
};
