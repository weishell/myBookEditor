import { Transforms, Element, Editor } from 'slate';
import { BlockElementType, ZERO_WIDTH_SPACE } from '@/enums';

/** 递归提取任意节点（文本 / 段落等元素）的全部叶子文本 */
const collectLeafText = (n: any): string => {
  if (n == null) return '';
  if (typeof n.text === 'string') return n.text;
  if (Array.isArray(n.children)) return n.children.map(collectLeafText).join('');
  return '';
};

export const withCodeBlock = (editor: Editor) => {
  const { normalizeNode, deleteBackward, insertBreak, insertData } = editor;

  editor.normalizeNode = ([node, path]) => {
    if (Element.isElement(node) && (node as any).type === BlockElementType.CODE_BLOCK) {
      const children = (node as any).children || [];
      // 只要存在非 CODE_LINE 的子节点（裸文本节点 / 段落等元素）就统一重建
      const needRebuild = children.some(
        (child: any) => !Element.isElement(child) || child.type !== BlockElementType.CODE_LINE,
      );

      if (needRebuild) {
        const newChildren: any[] = [];

        children.forEach((child: any) => {
          // 已是 CODE_LINE 的保留原样，避免重复转换/无限循环
          if (Element.isElement(child) && child.type === BlockElementType.CODE_LINE) {
            newChildren.push(child);
            return;
          }

          const text = Element.isElement(child) ? collectLeafText(child) : child.text || '';
          text.split('\n').forEach((lineText: string) => {
            newChildren.push({
              type: BlockElementType.CODE_LINE,
              id: `${(node as any).id}-line-${crypto.randomUUID()}`,
              children: [{ text: lineText }, { text: ZERO_WIDTH_SPACE }],
            });
          });
        });

        Transforms.setNodes(editor, { children: newChildren }, { at: path });
        return;
      }
    }

    normalizeNode([node, path]);
  };

  editor.deleteBackward = (unit) => {
    const { selection } = editor;
    if (!selection || !editor.selection) {
      deleteBackward(unit);
      return;
    }

    const lineResults = (editor as any).nodes({
      at: selection,
      match: (n: any) => Element.isElement(n) && n.type === BlockElementType.CODE_LINE,
    });

    const lineNodes = Array.from(lineResults) as [any, number[]][];
    if (lineNodes.length > 0) {
      const [node, nodePath] = lineNodes[0];
      const text = (node.children[0] as any)?.text || '';
      if (text.length === 0 && nodePath[nodePath.length - 1] > 0) {
        Transforms.delete(editor, { at: nodePath });
        return;
      }
    }

    deleteBackward(unit);
  };

  editor.insertBreak = () => {
    const { selection } = editor;
    if (!selection || !editor.selection) {
      insertBreak();
      return;
    }

    const codeBlockResults = (editor as any).nodes({
      at: selection,
      match: (n: any) => Element.isElement(n) && n.type === BlockElementType.CODE_BLOCK,
    });

    const codeBlockNodes = Array.from(codeBlockResults) as [any, number[]][];
    if (codeBlockNodes.length > 0) {
      const [codeBlockNode, codeBlockPath] = codeBlockNodes[0];

      const lineResults = (editor as any).nodes({
        at: selection,
        match: (n: any) => Element.isElement(n) && n.type === BlockElementType.CODE_LINE,
      });

      const lineNodes = Array.from(lineResults) as [any, number[]][];

      const newLine = {
        type: BlockElementType.CODE_LINE,
        id: `${codeBlockNode.id}-line-${crypto.randomUUID()}`,
        children: [{ text: '' }, { text: ZERO_WIDTH_SPACE }],
      };

      let insertPath: number[];
      if (lineNodes.length > 0) {
        const [, linePath] = lineNodes[0];
        insertPath = [...linePath];
        insertPath[insertPath.length - 1]++;
      } else {
        insertPath = [...codeBlockPath, 0];
      }

      Transforms.insertNodes(editor, newLine, { at: insertPath });
      Transforms.select(editor, {
        anchor: { path: [...insertPath, 0], offset: 0 },
        focus: { path: [...insertPath, 0], offset: 0 },
      });

      return;
    }

    const blockquoteResults = (editor as any).nodes({
      at: selection,
      match: (n: any) => Element.isElement(n) && n.type === BlockElementType.BLOCKQUOTE,
    });

    const blockquoteNodes = Array.from(blockquoteResults) as [any, number[]][];
    if (blockquoteNodes.length > 0) {
      const [blockquoteNode, blockquotePath] = blockquoteNodes[0];

      const blockText = Editor.string(editor, blockquotePath);
      const { anchor } = selection;

      const depth = blockquotePath.length;
      let cursorOffset = 0;
      for (let i = 0; i < anchor.path[depth]; i++) {
        const child = (blockquoteNode as any).children[i];
        if (child && typeof child.text === 'string') {
          cursorOffset += child.text.length;
        }
      }
      cursorOffset += anchor.offset;

      if (cursorOffset === blockText.length) {
        const newParagraph = {
          type: BlockElementType.PARAGRAPH,
          id: `paragraph-${crypto.randomUUID()}`,
          children: [{ text: '' }],
        };

        const insertPath = [...blockquotePath];
        insertPath[insertPath.length - 1]++;

        Transforms.insertNodes(editor, newParagraph, { at: insertPath });
        Transforms.select(editor, {
          anchor: { path: [...insertPath, 0], offset: 0 },
          focus: { path: [...insertPath, 0], offset: 0 },
        });

        return;
      }
    }

    insertBreak();
  };

  editor.insertData = (data) => {
    const { selection } = editor;
    if (!selection || !editor.selection) {
      insertData(data);
      return;
    }

    const codeBlockResults = (editor as any).nodes({
      at: selection,
      match: (n: any) => Element.isElement(n) && n.type === BlockElementType.CODE_BLOCK,
    });

    const codeBlockNodes = Array.from(codeBlockResults) as [any, number[]][];
    if (codeBlockNodes.length > 0) {
      const text = data.getData('text/plain') || '';
      if (!text) {
        return;
      }

      const lines = text.split('\n');
      const lineResults = (editor as any).nodes({
        at: selection,
        match: (n: any) => Element.isElement(n) && n.type === BlockElementType.CODE_LINE,
      });
      const lineNodes = Array.from(lineResults) as [any, number[]][];

      if (lineNodes.length > 0) {
        const [, linePath] = lineNodes[0];
        const currentLine = lineNodes[0][0];
        const currentText = (currentLine.children[0] as any)?.text || '';
        const { anchor } = selection;
        const depth = linePath.length;
        let cursorOffset = 0;
        for (let i = 0; i < anchor.path[depth]; i++) {
          const child = currentLine.children[i];
          if (child && typeof child.text === 'string') {
            cursorOffset += child.text.length;
          }
        }
        cursorOffset += anchor.offset;

        const firstLineText = lines[0];
        const newText =
          currentText.slice(0, cursorOffset) + firstLineText + currentText.slice(cursorOffset);

        Transforms.setNodes(
          editor,
          { children: [{ text: newText }, { text: ZERO_WIDTH_SPACE }] },
          { at: linePath },
        );

        if (lines.length > 1) {
          const remainingLines = lines.slice(1);
          const [codeBlockNode] = codeBlockNodes[0];

          remainingLines.forEach((lineText, index) => {
            const newLine = {
              type: BlockElementType.CODE_LINE,
              id: `${codeBlockNode.id}-line-${crypto.randomUUID()}`,
              children: [{ text: lineText }, { text: ZERO_WIDTH_SPACE }],
            };
            const insertPath = [...linePath];
            insertPath[insertPath.length - 1] += index + 1;
            Transforms.insertNodes(editor, newLine, { at: insertPath });
          });
        }

        return;
      }
    }

    insertData(data);
  };

  return editor;
};
