// 提示块容器化核心 —— 内部行类型转换 / 回车 / 退出 / 编号
//
// 数据模型：hint-block 的 children 是块元素数组（段落/标题/待办，段落可携带
// attrs.lilist 表示内部有序/无序列表）。旧数据（children 直接是 text leaves）
// 由 withHintBlock 的 normalizeNode 自动包裹为段落，无需手动迁移。
//
// 核心规则（用户需求）：
//  1. 内部行可在 段落/H标题/有序/无序/任务列表 之间互转（只动内部行）；
//  2. 提示块整体禁止被转换成其他类型（整体禁转，只能通过空行回车/退格退出）。
import { Editor, Element, Node, Path, Point, Range, Transforms } from 'slate';
import { v4 as uuidv4 } from 'uuid';
import { BlockElementType } from '@/enums';
import { getLilist, MAX_LIST_NUMBER, type LilistAttr } from '@/plugins/lilist/lilist-model';

/** path 是否位于某个提示块内部（含提示块自身） */
export const isInsideHintPath = (editor: Editor, path: Path): boolean => {
  for (let i = 0; i < path.length; i++) {
    try {
      const n = Node.get(editor, path.slice(0, i + 1)) as any;
      if (Element.isElement(n) && (n as any).type === BlockElementType.HINT_BLOCK) return true;
    } catch {
      /* ignore */
    }
  }
  return false;
};

/** 选区所在的最内层提示块 [node, path]；不在提示块内返回 null */
export const getHintBlockAtSelection = (editor: Editor): [any, Path] | null => {
  if (!editor.selection) return null;
  try {
    const entry = Editor.above(editor, {
      match: (n: any) => Element.isElement(n) && (n as any).type === BlockElementType.HINT_BLOCK,
    });
    return entry ? ([entry[0] as any, entry[1] as Path] as [any, Path]) : null;
  } catch {
    return null;
  }
};

export const isInsideHintBlock = (editor: Editor): boolean => !!getHintBlockAtSelection(editor);

/** 构造内部空段落（可携带列表/缩进属性） */
export const createInnerParagraph = (lilist?: LilistAttr, indent = 0): any => ({
  type: BlockElementType.PARAGRAPH,
  id: uuidv4(),
  attrs: {
    ...(lilist ? { lilist } : {}),
    ...(indent ? { indent } : {}),
  },
  children: [{ text: '' }],
});

/* ------------------------------------------------------------------ */
/* 内部列表编号：作用域限定在单个提示块的 children 内，不与外部列表连通 */
/* ------------------------------------------------------------------ */

/** 对提示块内部所有列表组重排编号（规则同 sortLilist，但遍历容器子行） */
export const sortInnerLilist = (editor: Editor, hintPath: Path): void => {
  Editor.withoutNormalizing(editor, () => {
    const hint = Node.get(editor, hintPath) as any;
    const children = (hint?.children || []) as any[];
    const counters = new Map<number, number>();
    let prev: { id: string; type: string; hostType: string } | null = null;

    children.forEach((child, i) => {
      const lilist = getLilist(child);
      if (!lilist) {
        prev = null;
        counters.clear();
        return;
      }
      // 组连续性：相邻 + 同 list_id + 同列表类型 + 同宿主类型
      const sameGroup =
        prev &&
        prev.id === lilist.list_id &&
        prev.type === lilist.list_type &&
        prev.hostType === child.type;
      if (!sameGroup) counters.clear();
      prev = { id: lilist.list_id, type: lilist.list_type, hostType: child.type };

      if (lilist.list_type !== 'ol') return; // UL 无编号
      const indent: number = child?.attrs?.indent ?? 0;
      for (const key of [...counters.keys()]) {
        if (key > indent) counters.delete(key);
      }
      const number = lilist.list_custom
        ? Math.min(Math.max(lilist.list_number || 1, 1), MAX_LIST_NUMBER)
        : (counters.get(indent) ?? 0) + 1;
      counters.set(indent, number);
      if (lilist.list_number !== number) {
        Transforms.setNodes(
          editor,
          {
            attrs: { ...(child.attrs || {}), lilist: { ...lilist, list_number: number } },
          } as any,
          { at: [...hintPath, i] },
        );
      }
    });
  });
};

/** 内部列表：接入前方相邻同类型列表或新建独立组 */
const connectInnerLilist = (editor: Editor, hintPath: Path, path: Path, ltype: string): void => {
  const idx = path[path.length - 1];
  const prev = idx > 0 ? (Node.get(editor, [...hintPath, idx - 1]) as any) : null;
  const prevL = getLilist(prev);
  const connect =
    prev && prev.type === BlockElementType.PARAGRAPH && prevL?.list_type === ltype ? prevL : null;
  const node = Node.get(editor, path) as any;
  const base = { ...(node?.attrs || {}) };
  delete base.checked; // 待办转列表时清掉勾选语义
  Transforms.setNodes(
    editor,
    {
      type: BlockElementType.PARAGRAPH,
      attrs: {
        ...base,
        lilist: {
          list_type: ltype,
          list_id: connect ? connect.list_id : uuidv4(),
          list_number: 1,
          list_custom: !connect,
        },
      },
    } as any,
    { at: path },
  );
};

/* ------------------------------------------------------------------ */
/* 内部行类型转换（toggleBlock 的提示块内部分发目标）                    */
/* ------------------------------------------------------------------ */

export const toggleInnerBlock = (
  editor: Editor,
  format: BlockElementType,
  options?: { level?: number },
): void => {
  const hint = getHintBlockAtSelection(editor);
  const { selection } = editor;
  if (!hint || !selection) return;
  const [, hintPath] = hint;

  // 目标行：提示块的直接子行（最内层块）
  const targets = (
    Array.from(
      (editor as any).nodes({
        at: (editor as any).unhangRange(selection),
        match: (n: any) => Element.isElement(n) && Editor.isBlock(editor, n),
        mode: 'lowest',
      }),
    ) as [any, Path][]
  ).filter(([, p]) => p.length === hintPath.length + 1);
  if (!targets.length) return;

  // 有序/无序 → 内部列表
  if (format === BlockElementType.NUMBERED_LIST || format === BlockElementType.BULLETED_LIST) {
    const ltype = format === BlockElementType.NUMBERED_LIST ? 'ol' : 'ul';
    const allActive = targets.every(([n]) => getLilist(n)?.list_type === ltype);
    Editor.withoutNormalizing(editor, () => {
      targets.forEach(([, p]) => {
        if (allActive) {
          // 取消列表 → 回到普通段落
          const node = Node.get(editor, p) as any;
          const attrs = { ...(node?.attrs || {}) };
          delete attrs.lilist;
          Transforms.setNodes(editor, { attrs } as any, { at: p });
        } else {
          connectInnerLilist(editor, hintPath, p, ltype);
        }
      });
    });
    sortInnerLilist(editor, hintPath);
    return;
  }

  // 任务列表
  if (format === BlockElementType.TODO_LIST) {
    Editor.withoutNormalizing(editor, () => {
      targets.forEach(([node, p]) => {
        const isActive = (node as any).type === BlockElementType.TODO_LIST;
        const base = { ...(node?.attrs || {}) };
        delete base.lilist;
        delete base.level;
        Transforms.setNodes(
          editor,
          {
            type: isActive ? BlockElementType.PARAGRAPH : BlockElementType.TODO_LIST,
            attrs: isActive ? base : { ...base, checked: false },
          } as any,
          { at: p },
        );
      });
    });
    return;
  }

  // H 标题
  if (format === BlockElementType.HEADING && options?.level) {
    Editor.withoutNormalizing(editor, () => {
      targets.forEach(([node, p]) => {
        const isActive =
          (node as any).type === BlockElementType.HEADING &&
          (node as any).attrs?.level === options.level;
        const base = { ...(node?.attrs || {}) };
        delete base.lilist;
        delete base.checked;
        Transforms.setNodes(
          editor,
          {
            type: isActive ? BlockElementType.PARAGRAPH : BlockElementType.HEADING,
            attrs: isActive ? base : { ...base, level: options.level },
          } as any,
          { at: p },
        );
      });
    });
    return;
  }

  // 段落（含未知目标回落）
  Editor.withoutNormalizing(editor, () => {
    targets.forEach(([, p]) => {
      const node = Node.get(editor, p) as any;
      const base = { ...(node?.attrs || {}) };
      delete base.lilist;
      delete base.checked;
      delete base.level;
      Transforms.setNodes(editor, { type: BlockElementType.PARAGRAPH, attrs: base } as any, {
        at: p,
      });
    });
  });
};

/* ------------------------------------------------------------------ */
/* 回车 / 退出                                                          */
/* ------------------------------------------------------------------ */

/**
 * 手动拆分提示块内的当前行：光标后半部分的 leaves 移入新块，
 * 新块继承类型/attrs（段落/标题/待办/列表），提示块本身不动。
 * 不用 splitNodes(height) —— 其拆分点位在容器场景下不可控。
 */
const splitInnerBlock = (editor: Editor, blockPath: Path): void => {
  const cursor = Range.start(editor.selection!);
  const leafPath = cursor.path; // [...blockPath, leafIdx]
  const leafIdx = leafPath[leafPath.length - 1];
  const offset = cursor.offset;
  const block = Node.get(editor, blockPath) as any;
  const leaves = (block.children || []) as any[];
  const leaf = leaves[leafIdx] as any;
  const text: string = leaf?.text ?? '';
  const secondLeaves = [{ ...leaf, text: text.slice(offset) }, ...leaves.slice(leafIdx + 1)];

  const newPath = Path.next(blockPath);
  Editor.withoutNormalizing(editor, () => {
    Transforms.insertNodes(editor, { ...block, id: uuidv4(), children: secondLeaves } as any, {
      at: newPath,
      select: false,
    });
    // 原块：删光标后的兄弟 leaves，再删光标后的文本
    for (let i = leaves.length - 1; i > leafIdx; i--) {
      Transforms.removeNodes(editor, { at: [...blockPath, i] });
    }
    if (offset < text.length) {
      Transforms.delete(editor, {
        at: {
          anchor: { path: leafPath, offset },
          focus: { path: leafPath, offset: text.length },
        },
      });
    }
    Transforms.select(editor, Editor.start(editor, newPath));
  });
};

/** 提示块内回车（折叠光标；非折叠选区由调用方先删除） */
export const handleInnerEnter = (editor: Editor): void => {
  const { selection } = editor;
  if (!selection) return;
  const hint = getHintBlockAtSelection(editor);
  if (!hint) return;
  const [hintNode, hintPath] = hint;

  const match = Editor.above(editor, {
    match: (n: any) => Editor.isBlock(editor, n),
    mode: 'lowest',
  });
  if (!match) return;
  const [block, blockPath] = match as [any, Path];
  if (blockPath.length !== hintPath.length + 1) return; // 只处理直接子行

  const childCount = ((hintNode as any).children || []).length;
  const index = blockPath[blockPath.length - 1];
  const isLastChild = index === childCount - 1;
  const cursor = Range.start(selection);
  const atEnd = Point.equals(cursor, Editor.end(editor, blockPath));
  const isEmpty = Node.string(block as any).trim() === '';

  // 空行 + 块尾 → 退出提示块
  if (isEmpty && isLastChild) {
    if (childCount === 1) {
      // 唯一空行 → 整块原地转段落（id 保留）
      Transforms.setNodes(editor, { type: BlockElementType.PARAGRAPH, attrs: {} } as any, {
        at: hintPath,
      });
      return;
    }
    Editor.withoutNormalizing(editor, () => {
      Transforms.removeNodes(editor, { at: blockPath });
      const after = Path.next(hintPath);
      Transforms.insertNodes(
        editor,
        {
          type: BlockElementType.PARAGRAPH,
          id: uuidv4(),
          children: [{ text: '' }],
        } as any,
        { at: after },
      );
      Transforms.select(editor, Editor.start(editor, after));
    });
    return;
  }

  // 列表行：非空 → 拆行续列表；空行（非块尾）→ 退列表变段落
  const lilist = getLilist(block);
  if (lilist) {
    if (isEmpty) {
      const attrs = { ...(block as any).attrs };
      delete attrs.lilist;
      Transforms.setNodes(editor, { attrs } as any, { at: blockPath });
      sortInnerLilist(editor, hintPath);
      return;
    }
    splitInnerBlock(editor, blockPath);
    const newPath = Path.next(blockPath);
    const newNode = Node.get(editor, newPath) as any;
    const newL = getLilist(newNode);
    if (newL) {
      // 续行项不是锚点，编号顺延
      Transforms.setNodes(
        editor,
        { attrs: { ...(newNode.attrs || {}), lilist: { ...newL, list_custom: false } } } as any,
        { at: newPath },
      );
    }
    sortInnerLilist(editor, hintPath);
    return;
  }

  // 标题行尾 → 下方补段落（同外部规则）
  if ((block as any).type === BlockElementType.HEADING && atEnd) {
    const newPath = Path.next(blockPath);
    Transforms.insertNodes(editor, createInnerParagraph(), { at: newPath });
    Transforms.select(editor, Editor.start(editor, newPath));
    return;
  }

  // 其余（段落/待办/标题行中/行首）：容器内拆行，类型与 attrs 天然继承
  splitInnerBlock(editor, blockPath);
};
