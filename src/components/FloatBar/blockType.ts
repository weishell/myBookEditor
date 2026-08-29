// 合并菜单"当前块类型"判定工具（飞书同款行为：打开菜单时正确高亮当前块）
//
// 关键点：
//  - BookEditor 把 onChange 改成了 no-op，单靠 Slate 自身 context 不会触发重渲染，
//    调用方需要在 mouseup / selectionchange / 切换块时主动调用 setActive(getActiveBlockType(editor))。
//  - 跨多块选区时只取 selection.focus 所在的那个 block（飞书行为：高亮跟当前行走），
//    而不是整段 range 内所有 match 的块。

import { Element } from 'slate';
import { BlockElementType, LilistType } from '@/enums';

/**
 * 合并菜单项 key。覆盖飞书下拉里出现的全部"可转换块"。
 * 与 CONVERT_TARGETS 的键一一对应。
 */
export type BlockType =
  | 'paragraph'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'h7'
  | 'h8'
  | 'h9'
  | 'numbered'
  | 'bulleted'
  | 'todo'
  | 'quote'
  | 'code-block';

/**
 * 把单个 block 节点映射为合并菜单 key。
 *
 * 纯函数，便于单测。判断顺序如下（命中即返回）：
 *   1. PARAGRAPH 上挂的 lilist：'ol' → numbered，'ul' → bulleted；都没挂 → paragraph
 *   2. HEADING：按 attrs.level 返回 h1..h9；越界返回 null
 *   3. TODO_LIST / BLOCKQUOTE / CODE_BLOCK 直接映射
 *   4. 其它类型（HEADING_TITLE / 图片 / 表格等）返回 null —— 它们不出现在合并菜单里
 */
export function resolveBlockTypeKey(
  type: string | undefined,
  attrs?: { level?: number; lilist?: { list_type?: string } } | null,
): BlockType | null {
  if (!type) return null;

  if (type === BlockElementType.PARAGRAPH) {
    const lt = attrs?.lilist?.list_type;
    if (lt === LilistType.OL) return 'numbered';
    if (lt === LilistType.UL) return 'bulleted';
    return 'paragraph';
  }
  if (type === BlockElementType.HEADING) {
    const level = Number(attrs?.level);
    if (level >= 1 && level <= 9) {
      return (`h` + level) as BlockType;
    }
    return null;
  }
  if (type === BlockElementType.TODO_LIST) return 'todo';
  if (type === BlockElementType.BLOCKQUOTE) return 'quote';
  if (type === BlockElementType.CODE_BLOCK) return 'code-block';

  // 其它类型（HEADING_TITLE / IMAGE_BLOCK / TABLE / MENTION / ...）一律不参与激活态
  return null;
}

/**
 * 选中光标焦点所在 block 的类型 key；非"可转换块"或无选区时返回 null。
 *
 * 实现：用 selection.focus + mode 'highest' 拿焦点所在最高层 block element。
 */
export function getActiveBlockType(editor: any): BlockType | null {
  const sel = editor?.selection;
  if (!sel) return null;
  try {
    const entries = Array.from(
      editor.nodes({
        at: sel.focus,
        mode: 'highest',
        match: (n: unknown) => !(n as any).isEditor && Element.isElement(n),
      }),
    );
    const entry = entries[entries.length - 1] as [Element, number[]] | undefined;
    if (!entry) return null;
    const node = entry[0] as any;
    if (!node || (editor as any).isEditor?.(node)) return null;
    if (!(editor as any).isBlock(node)) return null;

    return resolveBlockTypeKey(node.type, node.attrs);
  } catch {
    return null;
  }
}
