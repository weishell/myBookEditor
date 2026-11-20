// 表格的编辑行为（回车）
//
// ⚠️ 这个扩展目前**没有挂到编辑器链上**（core/index.tsx 里没有 withTable，
//    插件元数据里的 `extensions: [withTable]` 也没有任何代码消费）。
//    原因：这里的 insertBreak 实现有缺陷 —— 它总是拿 cell 的第一个段落
//    （`[...cellPath, 0]`）判断，不看光标当前在 cell 内的哪个段落，
//    于是「在 cell 第 2 段回车」会变成「在 cell 顶部插入新段落」。
//    要接入必须先修这个问题。
//
// 表格的**结构自愈**已经从本文件摘出去，单独放在 ./withTableStructure 并挂到了链上；
// 改补齐逻辑请去那个文件，别在这里加 normalizeNode（这里加了也不会跑）。
import { Editor, Element, Transforms, Range } from 'slate';
import type { CustomElement } from '@/core/types';
import { BlockElementType } from '@/enums';
import { v4 as uuidv4 } from 'uuid';

type NodeEntry = [CustomElement, number[]];

const isInTable = (editor: Editor) => {
  const [table] = Array.from(
    (editor as any).nodes({
      match: (n: unknown) =>
        Element.isElement(n) && (n as CustomElement).type === BlockElementType.TABLE,
    }),
  );
  return !!table;
};

const getCellPath = (editor: Editor): number[] | null => {
  const nodes: NodeEntry[] = Array.from(
    (editor as any).nodes({
      match: (n: unknown) =>
        Element.isElement(n) && (n as CustomElement).type === BlockElementType.TABLE_CELL,
    }),
  );
  const cell = nodes[0];
  return cell ? cell[1] : null;
};

export const withTable = (editor: Editor) => {
  const { insertBreak } = editor;

  editor.insertBreak = () => {
    if (!isInTable(editor)) {
      insertBreak();
      return;
    }

    const cellPath = getCellPath(editor);
    if (!cellPath) {
      insertBreak();
      return;
    }

    const { selection } = editor;
    if (!selection || !Range.isCollapsed(selection)) {
      insertBreak();
      return;
    }

    const [paragraph] = Editor.node(editor, [...cellPath, 0]);
    const paragraphElement = paragraph as CustomElement;

    if (paragraphElement.children.length === 0 || !paragraphElement.children[0]) {
      return;
    }

    Transforms.insertNodes(
      editor,
      {
        type: BlockElementType.PARAGRAPH,
        id: uuidv4(),
        attrs: {},
        children: [{ text: '' }],
      } as CustomElement,
      {
        at: [...cellPath, 1],
      },
    );

    Transforms.select(editor, {
      anchor: { path: [...cellPath, 1, 0], offset: 0 },
      focus: { path: [...cellPath, 1, 0], offset: 0 },
    });
  };

  return editor;
};
