// 粘贴画板块时复制资源文件
//
// 画板的图形数据不在文档里，节点只存 attrs.src（media/drawboards/<file>.json）。
// 服务端保存是「有 path 就覆盖」，所以复制粘贴出来的副本如果沿用同一个 src，
// 编辑副本会直接把原图数据覆盖掉 —— 这是会丢数据的。这里在插入之后异步复制一份，
// 再把副本节点的 src 换成新路径。
//
// 为什么放在 insertFragment 之后而不是粘贴流程里：
//   - 编辑器内部复制粘贴走的是 slate 原生 insertData → editor.insertFragment，
//     只有挂在 insertFragment 上才能同时覆盖「内部复制粘贴」和「HTML 粘贴」两条路。
//   - id 已经被 withEditorBehaviors.regenerateIds 换过，用新 id 回定位最稳。
import { Element, Transforms, type Descendant } from 'slate';
import { HistoryEditor } from 'slate-history';
import { BlockElementType } from '@/enums';
import { copyDrawboard } from '@/data/media';
import type { CustomElement } from '@/core/types';

interface PendingBoard {
  id: string;
  src: string;
}

/** 从待插入的 fragment 里收集所有带 attrs.src 的画板块（调用前 id 必须已经换新） */
export const collectPastedDrawboards = (nodes: Descendant[]): PendingBoard[] => {
  const out: PendingBoard[] = [];

  const walk = (list: unknown[]) => {
    for (const n of list) {
      if (!n || typeof n !== 'object') continue;
      const node = n as { type?: string; id?: string; attrs?: any; children?: unknown[] };
      if (
        node.type === BlockElementType.DRAWBOARD &&
        typeof node.id === 'string' &&
        typeof node.attrs?.src === 'string' &&
        node.attrs.src
      ) {
        out.push({ id: node.id, src: node.attrs.src });
      }
      if (Array.isArray(node.children)) walk(node.children);
    }
  };

  walk(nodes as unknown[]);
  return out;
};

/**
 * 异步复制画板资源并回写 src。
 * 复制失败就保留原 src —— 内容还在，只是和原块共用文件（不能因此把块丢掉）。
 */
export const copyPastedDrawboards = (editor: any, pending: PendingBoard[]) => {
  if (pending.length === 0) return;

  void (async () => {
    for (const { id, src } of pending) {
      try {
        const nextSrc = await copyDrawboard(src);
        if (!nextSrc || nextSrc === src) continue;

        // 插入后 path 未知，按换新过的 id 回定位；找不到说明已被撤销/删除，跳过
        const entry = Array.from(
          (editor as any).nodes({
            at: [],
            match: (n: unknown) => Element.isElement(n) && (n as CustomElement).id === id,
          }),
        )[0] as [CustomElement, number[]] | undefined;
        if (!entry) continue;

        const [node, path] = entry;
        // 不写历史：撤销应当把「粘贴」整体撤掉，而不是留下一串 src 替换记录
        HistoryEditor.withoutSaving(editor, () => {
          Transforms.setNodes(editor, { attrs: { ...(node.attrs || {}), src: nextSrc } } as any, {
            at: path,
            voids: true,
          });
        });
      } catch {
        /* 复制失败：保留原 src，不影响已插入的内容 */
      }
    }
  })();
};
