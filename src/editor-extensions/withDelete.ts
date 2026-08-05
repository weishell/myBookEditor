// 删除劫持插件（withDelete）
//
// 两层防护（HEADING_TITLE 绝对不能被移除，只能清空文本）：
//  1. apply 层（最底层 op 拦截）：所有 `remove_node` / `merge_node` / `split_node`
//     只要触碰到"最后一个 HEADING_TITLE"就改写/跳过/清空内容，绝不真的把节点从 children 移除
//  2. deleteBackward / deleteForward + 自定义 expanded 删除：上层精确控制
//
// 保证结果：
//  - 全选删除 → 其他内容全部删除，标题清空 children 但 attrs(cover/author/icon/date) 保留
//  - 标题内删字符 → 正常删单个字符，删空了节点还在（attrs 全在）
//  - 局部选中删除 → 标题最多清空 children，不会被 remove
import { Transforms, Node, Element, type Editor, type Path, Range } from 'slate';
import { v4 as uuidv4 } from 'uuid';
import { BlockElementType } from '@/enums';

const DEFAULT_TITLE_ATTRS = {
  date: new Date().toISOString().slice(0, 10),
};

const countHeadingTitles = (editor: Editor): number => {
  let count = 0;
  try {
    for (const [node] of Node.elements(editor)) {
      if ((node as any).type === BlockElementType.HEADING_TITLE) count++;
    }
  } catch {
    /* ignore */
  }
  return count;
};

const findHeadingTitle = (editor: Editor): [any, Path] | null => {
  try {
    for (const entry of (editor as any).nodes({
      at: [],
      match: (n: any) => Element.isElement(n) && (n as any).type === BlockElementType.HEADING_TITLE,
    })) {
      return entry as [any, Path];
    }
  } catch {
    /* ignore */
  }
  return null;
};

/**
 * 清空指定 HEADING_TITLE 的文本内容 → children: [{ text: '' }]
 * 节点本身（Element 结构、id、attrs、type）一丝不动。
 */
const clearTitleChildren = (editor: Editor, path: Path) => {
  try {
    // 优先用 range(path) 删除文字；失败就直接 setNodes 重写 children
    const r: any = (editor as any).range(path);
    Transforms.delete(editor, { at: r });
  } catch {
    try {
      Transforms.setNodes(editor, { children: [{ text: '' }] } as any, { at: path, voids: true });
    } catch {
      /* ignore */
    }
  }
};

/**
 * 判断一个 path 是否指向 HEADING_TITLE 或其内部。
 * 注意：remove_node 只在 path.length === 1 时移除顶层 block。
 * 其他嵌套删除正常放行。
 */
// const isHeadingTitlePath = (editor: Editor, path: Path): boolean => {
//   if (!path || path.length === 0) return false;
//   const entry = findHeadingTitle(editor);
//   if (!entry) return false;
//   const titlePath = entry[1];
//   return path[0] === titlePath[0];
// };

interface TitleInfo {
  id: string;
  attrs: any;
}

const saveTitleInfo = (editor: Editor): TitleInfo | null => {
  const entry = findHeadingTitle(editor);
  if (!entry) return null;
  const [node] = entry;
  return {
    id: (node as any).id || uuidv4(),
    attrs: { ...DEFAULT_TITLE_ATTRS, ...((node as any).attrs || {}) },
  };
};

const restoreTitleIfMissing = (editor: Editor, saved: TitleInfo | null) => {
  if (countHeadingTitles(editor) > 0) return;
  try {
    Transforms.insertNodes(
      editor,
      {
        type: BlockElementType.HEADING_TITLE,
        id: saved?.id || uuidv4(),
        attrs: saved?.attrs || { ...DEFAULT_TITLE_ATTRS },
        children: [{ text: '' }],
      } as any,
      { at: [0] },
    );
  } catch {
    /* ignore */
  }
};

export const ensureHeadingTitle = (editor: Editor) => {
  restoreTitleIfMissing(editor, null);
};

export const withDelete = (editor: Editor) => {
  const { apply, deleteBackward, deleteForward } = editor;

  // =========================================================
  // apply 层：根拦截！所有 Slate 操作都走 apply，这里保证最后一个 HEADING_TITLE 不被删
  // =========================================================
  editor.apply = (op: any) => {
    const titleCount = countHeadingTitles(editor);
    const hasOnlyOneTitle = titleCount === 1;
    const titleEntry = hasOnlyOneTitle ? findHeadingTitle(editor) : null;
    const titleIdx = titleEntry ? titleEntry[1][0] : -1;

    switch (op.type) {
      // ----------------- remove_node：最常见的删标题 op -----------------
      case 'remove_node': {
        // 只关心顶层 block（path.length === 1）
        if (op.path && op.path.length === 1 && titleIdx >= 0 && op.path[0] === titleIdx) {
          // ！！即将 remove 的就是最后一个 HEADING_TITLE！！
          // 不执行 apply，而是清空它的 children（保留 attrs/id）
          try {
            clearTitleChildren(editor, titleEntry![1]);
          } catch {
            /* ignore */
          }
          return; // 跳过原 op
        }
        break;
      }

      // ----------------- merge_node：两个块合并 -----------------
      // 如果位置在 titleIdx（即要把"标题"合并到下一块，或下一块合并到标题）→ 清空标题文本
      case 'merge_node': {
        if (op.path && op.path.length === 1 && titleIdx >= 0) {
          // merge_node 的语义不直观，最保险：只要 merge 涉及标题，就取消合并，把标题清空为空
          // 判断方式：path[0] === titleIdx 或 path[0] === titleIdx - 1
          const i = op.path[0];
          if (i === titleIdx || i === titleIdx - 1) {
            try {
              clearTitleChildren(editor, titleEntry![1]);
            } catch {
              /* ignore */
            }
            return; // 跳过 merge_node，避免标题被合并进其他节点
          }
        }
        break;
      }

      // ----------------- split_node：拆分节点（标题末尾 Enter 可能触发）-----------------
      // 一般不会删标题，但如果 split 触发后会导致后面 remove，我们也做轻量防护
      case 'split_node': {
        // 如果拆分的是 HEADING_TITLE 顶层节点：不拆（避免标题变成两个标题/段落，attrs 丢失）
        if (op.path && op.path.length === 1 && titleIdx >= 0 && op.path[0] === titleIdx) {
          // Enter 在标题末尾：正常 Slate 会 split 成第二段段落。
          // 我们允许 split，但 split 后新的块不能是 HEADING_TITLE
          // → 这里不拦截 split，让 withHistory/Enter 正常处理，
          //   再通过 ensureHeadingTitle 把第一个块（如果被改成别的）纠正回来
          // 只做简单保护：如果 properties 里 type === HEADING_TITLE，就不允许 split
          if (op.properties && (op.properties as any).type === BlockElementType.HEADING_TITLE) {
            // 一般 split_node.properties 是 { type: ... } 如果强行把标题一分为二为两个标题，就阻止
            return;
          }
        }
        break;
      }
    }

    // 正常执行 op
    apply(op);
  };

  // =========================================================
  // 自定义 expanded 删除（Ctrl+A / 鼠标多选）
  // 精确控制：HEADING_TITLE 只清空文本，其他块整段移除
  // =========================================================
  const isBlockFullyInsideSelection = (blockIndex: number, sel: Range): boolean => {
    const { anchor, focus } = sel as any;
    const s = anchor.path[0] <= focus.path[0] ? anchor : focus;
    const e = anchor.path[0] <= focus.path[0] ? focus : anchor;
    const sIdx = s.path[0];
    const eIdx = e.path[0];
    if (blockIndex < sIdx || blockIndex > eIdx) return false;
    if (blockIndex > sIdx && blockIndex < eIdx) return true;
    if (blockIndex === sIdx && sIdx === eIdx) {
      // 同一块 expanded 就认为覆盖整个 block
      return true;
    }
    if (blockIndex === sIdx) {
      return true;
    }
    return true;
  };

  const tryExpandedDelete = (): boolean => {
    const { selection } = editor;
    if (!selection) return false;
    if (Range.isCollapsed(selection as any)) return false;

    const titleEntry = findHeadingTitle(editor);
    if (!titleEntry) {
      try {
        Transforms.delete(editor);
        return true;
      } catch {
        return false;
      }
    }
    const [, titlePath] = titleEntry;
    const titleIdx = titlePath[0];

    const { anchor, focus } = selection as any;
    const s = anchor.path[0] <= focus.path[0] ? anchor : focus;
    const e = anchor.path[0] <= focus.path[0] ? focus : anchor;
    const touchesTitle = s.path[0] <= titleIdx && e.path[0] >= titleIdx;

    if (!touchesTitle) {
      try {
        Transforms.delete(editor);
        return true;
      } catch {
        return false;
      }
    }

    try {
      const children = (editor as any).children as any[];
      if (!children || children.length === 0) return false;

      // 从后往前，移除所有"非标题 + 完全在选区内"的 block
      // 即使 removeNodes 想把标题也带进来，下层 apply 的拦截也会兜住，但这里直接跳过更稳
      for (let i = children.length - 1; i >= 0; i--) {
        if (i === titleIdx) continue;
        if (!isBlockFullyInsideSelection(i, selection as any)) continue;
        try {
          Transforms.removeNodes(editor, { at: [i], voids: true } as any);
        } catch {
          /* ignore */
        }
      }

      // 单独处理标题：清空到空文本
      const titleNode = (editor as any).children[titleIdx];
      const titleStr = titleNode ? Node.string(titleNode as any) : '';
      const coversWholeTitle =
        s.path[0] < titleIdx ||
        e.path[0] > titleIdx ||
        (s.path[0] === titleIdx &&
          e.path[0] === titleIdx &&
          s.offset === 0 &&
          e.offset >= titleStr.length);

      if (coversWholeTitle) {
        clearTitleChildren(editor, titlePath);
      } else {
        try {
          Transforms.delete(editor, { at: selection } as any);
        } catch {
          /* ignore */
        }
      }
      return true;
    } catch {
      // fallback
      const saved = saveTitleInfo(editor);
      try {
        Transforms.delete(editor);
      } catch {
        /* ignore */
      }
      restoreTitleIfMissing(editor, saved);
      return true;
    }
  };

  editor.deleteBackward = (unit: any) => {
    const saved = saveTitleInfo(editor);
    if (tryExpandedDelete()) {
      restoreTitleIfMissing(editor, saved);
      return;
    }
    deleteBackward(unit);
    restoreTitleIfMissing(editor, saved);
  };

  editor.deleteForward = (unit: any) => {
    const saved = saveTitleInfo(editor);
    if (tryExpandedDelete()) {
      restoreTitleIfMissing(editor, saved);
      return;
    }
    deleteForward(unit);
    restoreTitleIfMissing(editor, saved);
  };

  return editor;
};
