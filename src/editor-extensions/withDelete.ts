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
import { Transforms, Node, Element, Editor, type Path, Range, Point } from 'slate';
import { v4 as uuidv4 } from 'uuid';
import { BlockElementType } from '@/enums';
import { getLilist, sortLilist } from '@/plugins/lilist';
import { relinkAfterDelete } from '@/plugins/hyperlink/hyperlink-utils';
import {
  isPathCoveredBySelection,
  isWholeSelectableContainerNode,
  isWholeSelectableNode,
} from '@/utils/whole-block-selection';

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

/**
 * 删除前收集受影响的列表组 id：选区所在块 + 前后相邻块（含自身 lilist）
 * 删除/合并后再对这些组回写编号：
 *  - 组内删项 → 后续项编号顺延回写
 *  - 两个同 id 组之间的块被删 → 两组连通后统一重排
 * fromIndex：增量起跑索引 = 选区块前一格（Backspace 行首合并会波及前一块），
 * 变更点之前的编号必然不变，多算一格只是零写入
 */
const collectAffectedListIds = (editor: Editor): { ids: string[]; fromIndex: number } => {
  const ids = new Set<string>();
  let fromIndex = 0;
  try {
    const { selection } = editor;
    if (!selection) return { ids: [], fromIndex: 0 };
    const index = (Range.start(selection) as any).path?.[0];
    if (typeof index !== 'number') return { ids: [], fromIndex: 0 };
    fromIndex = Math.max(0, index - 1);
    const children = (editor as any).children as any[];
    [index - 1, index, index + 1].forEach((i) => {
      const id = getLilist(children[i])?.list_id;
      if (id) ids.add(id);
    });
  } catch {
    /* ignore */
  }
  return { ids: [...ids], fromIndex };
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

  // =========================================================
  // Notion 式「先选中、再删除」：
  //  - Backspace 在块首 + 上一个块是非文本块/表格 → 第一次按：整块选中；第二次按：删除
  //  - Delete 在块尾 + 下一个块是非文本块/表格 → 对称行为
  //  - 光标已落在 void 块（即已处于选中态，方向键/上一步移入）→ 直接删除整块
  // =========================================================

  /** 是否为可「整体选中后删除」的块：非文本（void）块 / 表格 / 提示块 / 代码块 */
  const isWholeSelectable = (node: any): boolean => isWholeSelectableNode(editor, node);

  /** 删除 [idx] 整块后，把光标放到一个合理的位置（优先原位置的后一块块首，其次前一块块尾） */
  const moveSelectionAfterRemoval = (idx: number) => {
    try {
      const children = (editor as any).children as any[];
      let at: any = null;
      if (children[idx]) {
        at = Editor.start(editor, [idx]);
      } else if (idx > 0 && children[idx - 1]) {
        at = Editor.end(editor, [idx - 1]);
      } else if (children.length > 0) {
        at = Editor.start(editor, [0]);
      }
      if (at) Transforms.select(editor, at);
    } catch {
      /* ignore */
    }
  };

  /**
   * 情形一：当前选区正「选中一个完整的非文本块/表格/提示块」→ 删除该整块。
   *  - void 块（图片/日历/附件/图表…）：内部只有一个隐藏文本节点，选中态表现为
   *    collapsed 或区间落在块内 —— 只要两端都在这个块内就是「选中了它」，直接删除。
   *  - 复杂容器（表格/提示块/代码块）：必须恰好覆盖整块（start→end）才删，
   *    防止误删容器内部的局部选中文字。
   */
  const tryRemoveSelectedBlock = (): boolean => {
    const { selection } = editor;
    if (!selection) return false;
    const topIdx = (selection.anchor as any).path?.[0];
    if (typeof topIdx !== 'number' || topIdx < 0) return false;
    const node = (editor as any).children[topIdx];
    if (!isWholeSelectable(node)) return false;

    try {
      if (editor.isVoid(node)) {
        // void：无论 collapsed 还是 expanded，只要两端都在这个块内就是「选中了它」
        if (
          (selection.anchor as any).path?.[0] !== topIdx ||
          (selection.focus as any).path?.[0] !== topIdx
        ) {
          return false;
        }
        Transforms.removeNodes(editor, { at: [topIdx], voids: true } as any);
        moveSelectionAfterRemoval(topIdx);
        return true;
      }

      // 表格：必须恰好覆盖整表
      if (Range.isCollapsed(selection as any)) return false;
      const start = Editor.start(editor, [topIdx]);
      const end = Editor.end(editor, [topIdx]);
      const { anchor, focus } = selection as any;
      const covers =
        (Point.equals(anchor, start) && Point.equals(focus, end)) ||
        (Point.equals(focus, start) && Point.equals(anchor, end));
      if (!covers) return false;
      Transforms.removeNodes(editor, { at: [topIdx], voids: true } as any);
      moveSelectionAfterRemoval(topIdx);
      return true;
    } catch {
      return false;
    }
  };

  /**
   * 情形一·补充：选区横跨外部文字与「复杂容器」（表格/提示块/代码块），
   * 且容器被选区完整覆盖（withBlockSelection 已把容器内那端吸附到容器边界）。
   * 直接 Transforms.delete 只会删掉容器内部的文字、留下空壳 —— 必须整块移除容器本身。
   *
   * 返回值：
   *  - false        没有需要整块删除的容器，继续走后续流程
   *  - 'handled'    容器已删除且外部已无剩余选区（吸附点与外部端点重合），本次按键消费完毕
   *  - 'partial'    容器已删除，外部还剩一段选区 → 交回 tryExpandedDelete 继续删文字
   */
  const removeFullyCoveredContainers = (): false | 'handled' | 'partial' => {
    const { selection } = editor;
    if (!selection || Range.isCollapsed(selection as any)) return false;
    try {
      const children = (editor as any).children as any[];
      // 先用原始选区收集目标（从后往前删，路径才不会失效）
      const targets: number[] = [];
      for (let i = 0; i < children.length; i++) {
        if (!isWholeSelectableContainerNode(editor, children[i])) continue;
        if (!isPathCoveredBySelection(editor, [i])) continue;
        targets.push(i);
      }
      if (targets.length === 0) return false;

      // 只选了单个容器、且选区恰好等于整块范围 → tryRemoveSelectedBlock 已处理，不重复
      if (targets.length === 1) {
        const i = targets[0];
        const s = Editor.start(editor, [i]);
        const e = Editor.end(editor, [i]);
        const { anchor, focus } = selection as any;
        const exact =
          (Point.equals(anchor, s) && Point.equals(focus, e)) ||
          (Point.equals(focus, s) && Point.equals(anchor, e));
        if (exact) return false;
      }

      const { anchor, focus } = selection as any;
      const aIdx = anchor.path?.[0] ?? -1;
      const fIdx = focus.path?.[0] ?? -1;

      for (let k = targets.length - 1; k >= 0; k--) {
        try {
          Transforms.removeNodes(editor, { at: [targets[k]], voids: true } as any);
        } catch {
          /* ignore */
        }
      }

      // 删除容器后，落在容器内的端点会被 Slate 清掉（selection 可能变 null）。
      // 把两端点映射到删除后的文档，重建「外部剩余选区」：
      //  - 外部端点：只修正被删容器造成的目标层索引前移
      //  - 容器内端点（已吸附在容器边界）：映射到容器外侧相邻块的边界
      const mapPoint = (p: any, otherIdx: number): any => {
        const i0 = p?.path?.[0];
        if (typeof i0 !== 'number') return p;
        if (!targets.includes(i0)) {
          const delta = targets.filter((t) => t < i0).length;
          if (delta === 0) return p;
          return { path: [i0 - delta, ...p.path.slice(1)], offset: p.offset };
        }
        // 容器内端点
        const removedBefore = targets.filter((t) => t < i0).length;
        if (otherIdx < i0) {
          // 另一端在容器前 → 吸附点原是容器末尾 → 映射到前一块的块尾
          const prevIdx = i0 - removedBefore - 1;
          if (prevIdx >= 0) return Editor.end(editor, [prevIdx]);
          return Editor.start(editor, [0]);
        }
        // 另一端在容器后（或在另一容器之后）→ 吸附点原是容器开头 → 映射到当前块的块首
        const len = ((editor as any).children as any[]).length;
        const nextIdx = Math.min(i0 - removedBefore, len - 1);
        if (nextIdx < 0) return Editor.start(editor, [0]);
        return Editor.start(editor, [nextIdx]);
      };

      const nextAnchor = mapPoint(anchor, fIdx);
      const nextFocus = mapPoint(focus, aIdx);
      try {
        Transforms.select(editor, { anchor: nextAnchor, focus: nextFocus } as any);
      } catch {
        /* ignore */
      }

      const rebuilt = editor.selection;
      if (rebuilt && !Range.isCollapsed(rebuilt as any)) return 'partial';
      return 'handled';
    } catch {
      return false;
    }
  };

  /**
   * 情形二：光标在块首（或块尾）且紧邻块是非文本块/表格 → 整块选中它，不删除。
   * 返回 true 表示已消费本次按键（只选中）。
   */
  const trySelectAdjacentBlock = (direction: 'backward' | 'forward'): boolean => {
    const { selection } = editor;
    if (!selection || !Range.isCollapsed(selection as any)) return false;
    const point = selection.anchor;
    const topIdx = (point as any).path?.[0];
    if (typeof topIdx !== 'number') return false;
    try {
      const children = (editor as any).children as any[];
      if (direction === 'backward') {
        if (topIdx <= 0) return false;
        // 必须在整个顶层块的真正起点（跨过列表项/单元格等所有层级）
        if (!Editor.isStart(editor, point as any, [topIdx])) return false;
        const prev = children[topIdx - 1];
        if (!isWholeSelectable(prev)) return false;
        Transforms.select(editor, Editor.range(editor, [topIdx - 1]) as any);
      } else {
        if (topIdx + 1 >= children.length) return false;
        if (!Editor.isEnd(editor, point as any, [topIdx])) return false;
        const next = children[topIdx + 1];
        if (!isWholeSelectable(next)) return false;
        Transforms.select(editor, Editor.range(editor, [topIdx + 1]) as any);
      }
      return true;
    } catch {
      return false;
    }
  };

  editor.deleteBackward = (unit: any) => {
    // ① 选区正「选中一个完整的非文本块/表格」→ 直接删除整块（第二次 Backspace）
    if (tryRemoveSelectedBlock()) {
      relinkAfterDelete(editor);
      return;
    }
    // ② 块首 + 上一个块是非文本块/表格 → 第一次 Backspace：只选中，不删除
    if (trySelectAdjacentBlock('backward')) {
      return;
    }
    // lilist：删除前记录受影响的列表组，删除后从变更点起统一回写编号
    const affected = collectAffectedListIds(editor);
    const saved = saveTitleInfo(editor);
    // ③ 选区横跨外部文字与复杂容器（表格/提示块/代码块）→ 容器整块移除，不留空壳
    const containerResult = removeFullyCoveredContainers();
    if (containerResult === 'handled') {
      relinkAfterDelete(editor);
      return;
    }
    if (tryExpandedDelete()) {
      restoreTitleIfMissing(editor, saved);
      sortLilist(editor, affected.ids, affected.fromIndex);
      // 选区删除走的是 Transforms.delete，不会经过 editor.deleteFragment，
      // 这里补一次重新识别：选中 www.2.comf 里的 f 删掉 → 恢复成链接
      relinkAfterDelete(editor);
      return;
    }
    deleteBackward(unit);
    restoreTitleIfMissing(editor, saved);
    sortLilist(editor, affected.ids, affected.fromIndex);
  };

  editor.deleteForward = (unit: any) => {
    // ① 对称：选区正「选中一个完整的非文本块/表格」→ 直接删除整块（第二次 Delete）
    if (tryRemoveSelectedBlock()) {
      relinkAfterDelete(editor);
      return;
    }
    // ② 对称：块尾 + 下一个块是非文本块/表格 → 第一次 Delete：只选中，不删除
    if (trySelectAdjacentBlock('forward')) {
      return;
    }
    // lilist：删除前记录受影响的列表组，删除后从变更点起统一回写编号
    const affected = collectAffectedListIds(editor);
    const saved = saveTitleInfo(editor);
    // ③ 对称：选区横跨外部文字与复杂容器（表格/提示块/代码块）→ 容器整块移除，不留空壳
    const containerResult = removeFullyCoveredContainers();
    if (containerResult === 'handled') {
      relinkAfterDelete(editor);
      return;
    }
    if (tryExpandedDelete()) {
      restoreTitleIfMissing(editor, saved);
      sortLilist(editor, affected.ids, affected.fromIndex);
      // 同 deleteBackward：选区删除后补一次超链接重新识别
      relinkAfterDelete(editor);
      return;
    }
    deleteForward(unit);
    restoreTitleIfMissing(editor, saved);
    sortLilist(editor, affected.ids, affected.fromIndex);
  };

  return editor;
};
