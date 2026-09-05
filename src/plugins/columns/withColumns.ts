import { Editor, Element, Transforms, Path, Range, Node as SlateNode } from 'slate';
import type { CustomElement } from '@/core/types';
import { BlockElementType } from '@/enums';
import { v4 as uuidv4 } from 'uuid';
import { createColumn, createEmptyParagraph, isColumnEmpty } from './column-operations';

/** 获取光标所在列的 path */
const getColumnPath = (editor: Editor): number[] | null => {
  const [match] = Array.from(
    (editor as any).nodes({
      match: (n: unknown) =>
        Element.isElement(n) && (n as CustomElement).type === BlockElementType.COLUMN,
    }),
  );
  return match ? ((match as any)[1] as number[]) : null;
};

export const withColumns = (editor: Editor) => {
  const { normalizeNode, insertBreak, deleteBackward } = editor;

  // 列内回车：在当前列末尾追加段落，而不是跳出分栏组
  editor.insertBreak = () => {
    const columnPath = getColumnPath(editor);
    if (!columnPath) {
      insertBreak();
      return;
    }

    const { selection } = editor;
    if (!selection || !Range.isCollapsed(selection)) {
      insertBreak();
      return;
    }

    // 获取当前块（可能是段落、标题等）
    const [blockNode, blockPath] = Editor.above(editor, {
      match: (n: any) => Editor.isBlock(editor, n),
      mode: 'lowest',
    }) || [null, null];

    if (!blockNode || !blockPath) {
      insertBreak();
      return;
    }

    // 如果当前块是 column 本身（空列，只有占位符），在列内插入空段落
    if ((blockNode as CustomElement).type === BlockElementType.COLUMN) {
      Transforms.insertNodes(editor, createEmptyParagraph(), { at: [...blockPath, 0] });
      return;
    }

    // 普通块：在当前块下方、当前列内插入同类型空块
    const blockType = (blockNode as CustomElement).type;
    const newBlock: CustomElement = {
      ...(blockNode as CustomElement),
      id: uuidv4(),
      attrs: { ...(blockNode as CustomElement).attrs },
      children: [{ text: '' }],
    } as CustomElement;

    // 对于 lilist 等，继承 attrs 可能导致问题，这里简单处理为段落
    if (blockType === BlockElementType.CODE_BLOCK) {
      newBlock.type = BlockElementType.PARAGRAPH;
      newBlock.attrs = {};
    }

    const insertPath = Path.next(blockPath);
    Transforms.insertNodes(editor, newBlock, { at: insertPath });
    Transforms.select(editor, Editor.start(editor, insertPath));
  };

  // 列内退格：当前列唯一一个块且为空时，删除该列
  editor.deleteBackward = (unit: any) => {
    const columnPath = getColumnPath(editor);
    if (columnPath) {
      const { selection } = editor;
      if (selection && Range.isCollapsed(selection)) {
        try {
          const [columnNode] = Editor.node(editor, columnPath);
          const column = columnNode as CustomElement;
          const blocks = column.children as CustomElement[];
          const isAtColumnStart =
            selection.anchor.path.length > columnPath.length &&
            selection.anchor.path[columnPath.length] === 0;
          const currentBlockIndex = selection.anchor.path[columnPath.length] ?? 0;
          const currentBlock = blocks[currentBlockIndex];

          if (
            isAtColumnStart &&
            currentBlock &&
            SlateNode.string(currentBlock as any).trim() === '' &&
            isColumnEmpty(column)
          ) {
            const groupPath = columnPath.slice(0, -1);
            const columnIndex = columnPath[columnPath.length - 1];

            // 删除整列
            const widths = [
              ...(((Editor.node(editor, groupPath)[0] as CustomElement).attrs as any)?.widths ||
                []),
            ];
            const children = (Editor.node(editor, groupPath)[0] as CustomElement)
              .children as CustomElement[];

            if (children.length <= 1) {
              // 只剩一列时删除整个分栏组
              Transforms.removeNodes(editor, { at: groupPath });
            } else {
              const remainingTotal = widths
                .filter((_, i) => i !== columnIndex)
                .reduce((sum, w) => sum + w, 0);
              const newWidths = widths
                .filter((_, i) => i !== columnIndex)
                .map((w) => Math.round((w / remainingTotal) * 100));
              const diff = 100 - newWidths.reduce((sum, w) => sum + w, 0);
              if (diff !== 0 && newWidths.length > 0) {
                newWidths[newWidths.length - 1] += diff;
              }

              Editor.withoutNormalizing(editor, () => {
                Transforms.removeNodes(editor, { at: columnPath });
                Transforms.setNodes(
                  editor,
                  { attrs: { widths: newWidths } },
                  // 严格限定为分栏组本身，避免把 attrs 下发到列内图表等后代元素导致其配置被覆盖
                  {
                    at: groupPath,
                    match: (n) =>
                      Element.isElement(n) &&
                      (n as CustomElement).type === BlockElementType.COLUMN_GROUP,
                  },
                );
              });
            }
            return;
          }
        } catch (err) {
          console.error('deleteBackward in column failed:', err);
        }
      }
    }
    deleteBackward(unit);
  };

  // normalize：确保 column-group 和 column 结构合法（宽度只存在 group.attrs.widths，避免循环）
  editor.normalizeNode = ([node, path]) => {
    const element = node as { type?: string };

    if (element.type === BlockElementType.COLUMN_GROUP) {
      const group = node as CustomElement;
      // 至少保留一列
      if (!group.children || group.children.length === 0) {
        Transforms.insertNodes(editor, createColumn(), { at: [...path, 0] });
        Transforms.setNodes(
          editor,
          { attrs: { ...(group.attrs || {}), widths: [100] } },
          { at: path },
        );
        return;
      }
      // 安全网：widths 数量必须与列数一致；仅在数量不符时修正（幂等，避免循环）
      const widths = [...((group.attrs as any)?.widths || [])] as number[];
      const childCount = group.children.length;
      if (widths.length !== childCount) {
        const base = Math.floor(100 / childCount);
        const newWidths = Array.from({ length: childCount }, (_, i) =>
          i === childCount - 1 ? 100 - base * (childCount - 1) : (widths[i] ?? base),
        );
        Transforms.setNodes(
          editor,
          { attrs: { ...(group.attrs || {}), widths: newWidths } },
          { at: path },
        );
        return;
      }
    }

    if (element.type === BlockElementType.COLUMN) {
      const column = node as CustomElement;
      // 至少保留一个子块
      if (!column.children || column.children.length === 0) {
        Transforms.insertNodes(editor, createEmptyParagraph(), { at: [...path, 0] });
        return;
      }
    }

    normalizeNode([node, path]);
  };

  return editor;
};
