import type { Editor } from 'slate';
import { Transforms, Element as SlateElement } from 'slate';
import { BlockElementType } from '@/enums';

export const withCodeBlock = (editor: Editor) => {
  const { normalizeNode, deleteBackward, insertBreak } = editor;

  editor.normalizeNode = ([node, path]) => {
    if (SlateElement.isElement(node) && (node as any).type === BlockElementType.CODE_BLOCK) {
      const children = (node as any).children || [];
      const hasTextNodes = children.some((child: any) => !SlateElement.isElement(child));

      if (hasTextNodes) {
        const newChildren: any[] = [];
        let lineNum = 0;

        children.forEach((child: any) => {
          if (!SlateElement.isElement(child)) {
            const text = child.text || '';
            const lines = text.split('\n');

            lines.forEach((lineText: string) => {
              lineNum++;
              newChildren.push({
                type: BlockElementType.CODE_LINE,
                id: `${(node as any).id}-line-${crypto.randomUUID()}`,
                attrs: { lineNumber: lineNum },
                children: [{ text: lineText }, { text: '\u200B' }],
              });
            });
          } else {
            newChildren.push(child);
          }
        });

        const hasChanged = newChildren.some(
          (child: any) => child.type === BlockElementType.CODE_LINE,
        );

        if (hasChanged) {
          Transforms.setNodes(editor, { children: newChildren }, { at: path });
          return;
        }
      }

      const codeLineChildren = children.filter(
        (child: any) => SlateElement.isElement(child) && child.type === BlockElementType.CODE_LINE,
      );

      codeLineChildren.forEach((child: any, index: number) => {
        if (child.attrs?.lineNumber !== index + 1) {
          const childIndex = children.indexOf(child);
          Transforms.setNodes(
            editor,
            { attrs: { ...child.attrs, lineNumber: index + 1 } },
            { at: [...path, childIndex] },
          );
        }
      });
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
      match: (n: any) => SlateElement.isElement(n) && n.type === BlockElementType.CODE_LINE,
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
      match: (n: any) => SlateElement.isElement(n) && n.type === BlockElementType.CODE_BLOCK,
    });

    const codeBlockNodes = Array.from(codeBlockResults) as [any, number[]][];
    if (codeBlockNodes.length > 0) {
      const [codeBlockNode, codeBlockPath] = codeBlockNodes[0];

      const lineResults = (editor as any).nodes({
        at: selection,
        match: (n: any) => SlateElement.isElement(n) && n.type === BlockElementType.CODE_LINE,
      });

      const lineNodes = Array.from(lineResults) as [any, number[]][];

      const newLine = {
        type: BlockElementType.CODE_LINE,
        id: `${codeBlockNode.id}-line-${crypto.randomUUID()}`,
        attrs: { lineNumber: 1 },
        children: [{ text: '' }, { text: '\u200B' }],
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

    insertBreak();
  };

  return editor;
};
