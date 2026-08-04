// 删除/退格劫持插件（withDelete）
//
// 用途：
// 1. 拦截删除行为，保证文档始终至少保留一个 HEADING_TITLE 独立标题块
//    —— 如果最后删除的是唯一剩下的标题块，则取消删除，保留空标题
// 2. 保留后续自定义删除逻辑接入点
import { Transforms, Node, Element, type Editor } from 'slate';
import { v4 as uuidv4 } from 'uuid';
import { BlockElementType } from '@/enums';

/**
 * 统计文档中 HEADING_TITLE 独立标题块的数量
 */
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

/**
 * 判断当前即将被 backward / forward 删除的块是否是 HEADING_TITLE，
 * 并且它是整个文档中唯一的一个。
 *
 * 方法：在执行删除之前，尝试计算删除后文档中 HEADING_TITLE 数量是否会变成 0。
 * 如果会 → 直接取消删除（不执行原行为），必要时把该标题重置为空标题。
 */
const wouldRemoveLastHeadingTitle = (
  editor: Editor,
  direction: 'backward' | 'forward',
): boolean => {
  const { selection } = editor;
  if (!selection) return false;
  const titleCount = countHeadingTitles(editor);
  if (titleCount !== 1) return false;

  // 找到当前位置所在/相邻的 HEADING_TITLE
  try {
    const [currentNode] = Array.from(
      (editor as any).nodes({
        at: selection,
        mode: 'lowest',
        match: (n: any) =>
          !(n as any).isEditor &&
          Element.isElement(n) &&
          (n as any).type === BlockElementType.HEADING_TITLE,
      }),
    );
    if (!currentNode) {
      // 不在标题上：检查 collapse 且在开头时 backward 会删除前一个元素，或末尾 forward 删除下一个
      if (editor.selection && (editor.selection as any).isCollapsed) {
        const [start] = (editor as any).edges(selection);
        const prevEntry =
          direction === 'backward'
            ? (editor as any).previous({ at: start.path, mode: 'block' })
            : (editor as any).next({ at: start.path, mode: 'block' });
        if (
          prevEntry &&
          prevEntry[0] &&
          (prevEntry[0] as any).type === BlockElementType.HEADING_TITLE
        ) {
          // 且空，可能会合并掉该标题
          const block = prevEntry[0];
          const text = Node.string(block);
          const isStartOfBlock = (() => {
            if (direction !== 'backward') return false;
            try {
              const [first] = (editor as any).positions(start.path, { at: start.path });
              return first.offset === start.offset && start.path[start.path.length - 1] === 0;
            } catch {
              return false;
            }
          })();
          if (text.length === 0 || isStartOfBlock) return true;
        }
      }
      return false;
    }

    const node = (currentNode as any)[0];
    const text = Node.string(node as any);

    // 选区跨选时直接判定会删
    if (!(editor.selection as any).isCollapsed) return true;

    // 空标题下按 backspace / delete → 即将合并或移除
    if (text.length === 0) return true;

    // 光标在文本 0 偏移按 backspace → 即将与上一块合并（若上一块也空，可能删到）
    if (direction === 'backward') {
      const [start] = (editor as any).edges(selection);
      if (start.offset === 0) return true;
    }
    // 光标在末尾按 delete → 与下一块合并
    if (direction === 'forward') {
      const [, end] = (editor as any).edges(selection);
      if (end.offset === text.length) return true;
    }
  } catch {
    return false;
  }
  return false;
};

/**
 * 兜底：归一化文档 —— 若文档中完全没有 HEADING_TITLE，则在最前面插入一个空标题
 * 用于：粘贴、全选删除、外部 JSON 导入后等场景
 */
export const ensureHeadingTitle = (editor: Editor) => {
  if (countHeadingTitles(editor) > 0) return;
  try {
    const emptyTitle: any = {
      type: BlockElementType.HEADING_TITLE,
      id: uuidv4(),
      attrs: { date: new Date().toISOString().slice(0, 10) },
      children: [{ text: '' }],
    };
    Transforms.insertNodes(editor, emptyTitle, { at: [0] });
  } catch {
    /* ignore */
  }
};

export const withDelete = (editor: Editor) => {
  const { deleteBackward, deleteForward, apply } = editor;

  // 归一化：任何应用操作之后检查是否仍保留至少一个标题
  editor.apply = (op: any) => {
    apply(op);
    // 仅在可能影响结构的操作后兜底检查（插入节点 / 移除节点 / 合并节点 / 拆分节点 / 替换节点）
    const structuralOps = new Set(['insert_node', 'remove_node', 'merge_node', 'split_node']);
    if (structuralOps.has(op.type)) {
      try {
        ensureHeadingTitle(editor);
      } catch {
        /* ignore */
      }
    }
  };

  editor.deleteBackward = (unit) => {
    if (wouldRemoveLastHeadingTitle(editor, 'backward')) {
      return; // 拒绝删除最后的独立标题
    }
    deleteBackward(unit);
    ensureHeadingTitle(editor);
  };

  editor.deleteForward = (unit) => {
    if (wouldRemoveLastHeadingTitle(editor, 'forward')) {
      return; // 拒绝删除最后的独立标题
    }
    deleteForward(unit);
    ensureHeadingTitle(editor);
  };

  return editor;
};
