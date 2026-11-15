// 结构守卫（withStructureGuard）
//
// 背景：Slate 不是 schema-first。它内置的 normalize 只有 4 条规则，而且默认规则会
// 「静默销毁」不符合判定的子节点：
//   - 块容器里出现 Text/inline → removeNodes（内容直接消失）
//   - 行内容器里出现块元素   → unwrapNodes（外壳、id、attrs 全丢）
//   - 元素 children 为空      → 塞一个 { text: '' }，让元素变成「行内容器」
// 对本项目这种「容器块随意嵌套」的文档，后果就是某个操作之后 children / id 凭空消失。
//
// 这一层只做「补」，不做「删」，所以幂等、不会与各插件自己的 normalize 打架：
//   ① 容器块 children 为空 → 立刻补一个合法子节点并 return。
//      必须抢在 Slate 默认规则之前（本扩展挂在链的最外层）。
//   ② 容器块里混入非元素子节点（旧数据 / 粘贴残留）→ 包成段落，而不是被 remove。
//
// 另外两个显式工具（不挂在 normalize 里，避免逐节点 O(n) 扫描）：
//   - ensureUniqueIds(editor)：split_node 会整份克隆属性（含 id），产生的重复 id 在这里修掉
//   - inspectStructure(children)：只读体检；dev 下配合 installStructureInspector 定位「是哪个 op 干的」
import { Editor, Element, Node, Transforms, type Descendant, type Path } from 'slate';
import { v4 as uuidv4 } from 'uuid';
import { BlockElementType } from '@/enums';
import type { CustomElement } from '@/core/types';

/** 必须「至少有一个合法子节点」的容器块 */
const CONTAINER_TYPES = new Set<string>([
  BlockElementType.HINT_BLOCK,
  BlockElementType.COLUMN_GROUP,
  BlockElementType.COLUMN,
  BlockElementType.TABLE,
  BlockElementType.TABLE_ROW,
  BlockElementType.TABLE_CELL,
]);

/** 表格三兄弟的子节点类型是固定的，只做「补空」，不做「包段落」 */
const RIGID_TYPES = new Set<string>([
  BlockElementType.TABLE,
  BlockElementType.TABLE_ROW,
  BlockElementType.TABLE_CELL,
]);

const paragraph = (children: Descendant[] = [{ text: '' }] as Descendant[]): CustomElement => ({
  type: BlockElementType.PARAGRAPH,
  id: uuidv4(),
  attrs: {},
  children,
});

/** 为某类容器造一个「最小合法子节点」（表 → 行 → 格子 → 段落，逐层嵌套） */
const createEmptyChild = (type: string): CustomElement => {
  switch (type) {
    case BlockElementType.TABLE:
      return {
        type: BlockElementType.TABLE_ROW,
        id: uuidv4(),
        attrs: {},
        children: [createEmptyChild(BlockElementType.TABLE_CELL)],
      };
    case BlockElementType.TABLE_ROW:
      return {
        type: BlockElementType.TABLE_CELL,
        id: uuidv4(),
        attrs: {},
        children: [paragraph()],
      };
    case BlockElementType.COLUMN_GROUP:
      return {
        type: BlockElementType.COLUMN,
        id: uuidv4(),
        attrs: {},
        children: [paragraph()],
      };
    default:
      // HINT_BLOCK / COLUMN / TABLE_CELL 的直接子节点都是普通块
      return paragraph();
  }
};

export const withStructureGuard = (editor: Editor) => {
  const { normalizeNode } = editor;

  editor.normalizeNode = ([node, path]) => {
    if (Element.isElement(node)) {
      const type = (node as CustomElement).type;

      if (type && CONTAINER_TYPES.has(type)) {
        const kids = ((node as CustomElement).children || []) as Descendant[];

        // ① 空容器：先补位再 return。
        //    如果让默认规则处理，它会塞 { text: '' }，这个节点下一轮就被判成行内容器，
        //    此后插进去的任何块级子节点都会被 unwrap —— 不可逆，且极难排查。
        if (kids.length === 0) {
          Transforms.insertNodes(editor, createEmptyChild(type) as any, { at: [...path, 0] });
          return;
        }

        // ② 非元素子节点（脏数据）：包进段落保住内容，别交给默认规则 remove
        if (!RIGID_TYPES.has(type)) {
          const badIdx = kids.findIndex((c) => !Element.isElement(c));
          if (badIdx !== -1) {
            const stray = kids[badIdx];
            Editor.withoutNormalizing(editor, () => {
              Transforms.removeNodes(editor, { at: [...path, badIdx] });
              Transforms.insertNodes(editor, paragraph([stray]) as any, { at: [...path, badIdx] });
            });
            return;
          }
        }
      }
    }

    normalizeNode([node, path]);
  };

  return editor;
};

export type StructureIssue = {
  path: Path;
  type: string;
  reason: 'empty-children' | 'duplicate-id' | 'missing-id';
};

/** 只读体检：返回结构问题列表，不修改文档 */
export const inspectStructure = (children: Descendant[]): StructureIssue[] => {
  const issues: StructureIssue[] = [];
  const seen = new Set<string>();

  const walk = (nodes: Descendant[], base: Path) => {
    nodes.forEach((node, i) => {
      if (!Element.isElement(node)) return;
      const el = node as CustomElement;
      const path = [...base, i];

      const id = el.id;
      if (!id) issues.push({ path, type: el.type, reason: 'missing-id' });
      else if (seen.has(id)) issues.push({ path, type: el.type, reason: 'duplicate-id' });
      else seen.add(id);

      if (CONTAINER_TYPES.has(el.type) && (!el.children || el.children.length === 0)) {
        issues.push({ path, type: el.type, reason: 'empty-children' });
      }

      if (Array.isArray(el.children)) walk(el.children as Descendant[], path);
    });
  };

  walk(children, []);
  return issues;
};

/**
 * 修复重复/缺失 id。split_node 会把整份属性（含 id）克隆到新节点，
 * 不处理的话块级评论 key（block:<id>）和按 id 找节点的代码都会串位。
 * 只改 id，不动结构，返回修复条数。
 */
export const ensureUniqueIds = (editor: Editor): number => {
  const seen = new Set<string>();
  const broken: Path[] = [];

  for (const [node, path] of Node.elements(editor)) {
    if ((node as { text?: string }).text !== undefined) continue;
    const id = (node as CustomElement).id;
    if (!id || seen.has(id)) broken.push(path);
    else seen.add(id);
  }

  if (broken.length === 0) return 0;

  Editor.withoutNormalizing(editor, () => {
    for (const path of broken) {
      // 前面的修复不会改结构，path 仍然有效；保险起见再判一次存在性
      if (!Node.has(editor, path)) continue;
      Transforms.setNodes(editor, { id: uuidv4() } as any, { at: path, voids: true });
    }
  });

  return broken.length;
};

/**
 * 仅开发环境：包一层 apply，任何一次操作后结构变脏就打印出来，
 * 用来定位「到底是哪个 op 把 children 弄丢的」。生产构建里是空函数。
 */
export const installStructureInspector = (editor: Editor) => {
  if (!import.meta.env.DEV) return editor;
  if ((editor as any).__structureInspector) return editor;
  (editor as any).__structureInspector = true;

  // 控制台里可直接调：__slateTools.inspectStructure(editor.children) / __slateTools.ensureUniqueIds(editor)
  (window as any).__slateTools = { inspectStructure, ensureUniqueIds };

  const { apply } = editor;
  let warned = 0;

  editor.apply = ((op: any) => {
    apply(op);
    // 报过 20 次就不刷屏了（真出问题也够定位）
    if (warned >= 20) return;
    const issues = inspectStructure(editor.children as Descendant[]);
    if (issues.length > 0) {
      warned += 1;
      console.warn(`[structure] 操作 ${op.type} 之后结构异常：`, issues);
    }
  }) as Editor['apply'];

  return editor;
};
