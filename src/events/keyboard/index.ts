import { Transforms, Editor, Range, Point } from 'slate';
import type { Location } from 'slate';
import { handleEnter } from './handleEnter';
import { handleTabIndent } from './handleTab';
import { getLilist, removeLilist } from '@/plugins/lilist';

/**
 * Ctrl+A / Cmd+A 全选：手动把 Slate 内部的 editor.selection 设置为整个编辑器范围。
 * 之所以需要手动处理：
 *  - 浏览器默认 Ctrl+A 只会修改 DOM 高亮（window.getSelection），不会同步到 Slate 的 editor.selection
 *  - 如果不处理，后续按 Backspace/Delete，Slate 看到的 selection 仍是 collapsed 光标
 *    → 只会删一个字符，而不是删除全选内容
 */
const handleSelectAll = (editor: Editor, e: React.KeyboardEvent) => {
  if (!(e.ctrlKey || e.metaKey) || e.key.toLowerCase() !== 'a') return false;

  try {
    // 构造 editor 最顶层第一个节点的 start 到最后一个节点的 end 的 range
    const children = (editor as any).children as any[];
    if (!children || children.length === 0) return false;

    const firstPath: Location = [0];
    const lastPath: Location = [children.length - 1];

    // Editor.start / Editor.end / Transforms.select
    // 使用 (editor as any).start / (editor as any).end 避免 Slate 重载参数类型问题
    let start: any;
    let end: any;
    try {
      start = (Editor as any).start(editor, firstPath);
      end = (Editor as any).end(editor, lastPath);
    } catch {
      // fallback：直接用 path[0] 的 range
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
      // 兜底：直接 select 整个编辑器
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

  const match = Editor.above(editor, {
    match: (n: any) => Editor.isBlock(editor, n),
    mode: 'lowest',
  });
  if (!match) return false;

  const [node, path] = match;
  if (!getLilist(node)) return false;

  const start = Editor.start(editor, path);
  if (!Point.equals(selection.anchor, start)) return false;

  removeLilist(editor, path);
  return true;
};

export const createKeyboardHandler = (editor: Editor) => {
  return (e: React.KeyboardEvent) => {
    // 1. Ctrl/Cmd + A：Slate 内部全选
    if (handleSelectAll(editor, e)) return;

    // 2. Backspace：列表项行首退出列表
    if (e.key === 'Backspace' && !e.ctrlKey && !e.metaKey && !e.altKey) {
      if (handleLilistBackspace(editor)) {
        e.preventDefault();
        return;
      }
    }

    // 3. Tab
    if (e.key === 'Tab') {
      handleTabIndent(editor, e);
      return;
    }

    // 4. Enter
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleEnter(editor);
      return;
    }
  };
};
