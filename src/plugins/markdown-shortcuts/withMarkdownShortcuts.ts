import type { Editor } from 'slate';
import { Editor as SlateEditor, Transforms, Range, Element as SlateElement } from 'slate';
import { BlockElementType } from '@/enums';

export const withMarkdownShortcuts = (editor: Editor) => {
  const { insertText } = editor;

  editor.insertText = (text) => {
    // 只处理空格插入
    if (text !== ' ') {
      insertText(text);
      return;
    }

    console.log('markdown-shortcuts: insertText called with space');

    const { selection } = editor;
    if (!selection || !Range.isCollapsed(selection)) {
      console.log('markdown-shortcuts: selection not collapsed');
      insertText(text);
      return;
    }

    const { anchor } = selection;
    console.log('markdown-shortcuts: anchor path:', anchor.path);

    // 获取当前块级元素 - 使用 editor.nodes() 方法
    const blocks = Array.from(
      (editor as any).nodes({
        match: (n: any) => SlateElement.isElement(n) && SlateEditor.isBlock(editor, n),
        at: anchor.path,
      }),
    );

    console.log('markdown-shortcuts: blocks found:', blocks.length);

    if (!blocks || blocks.length === 0) {
      console.log('markdown-shortcuts: no block found');
      insertText(text);
      return;
    }

    const block = blocks[0] as [any, number[]];
    const node = block[0];
    const blockPath = block[1];
    console.log('markdown-shortcuts: node:', JSON.stringify(node));
    console.log('markdown-shortcuts: blockPath:', blockPath);

    // 检测块类型
    const blockType = (node as any)?.type;
    console.log('markdown-shortcuts: blockType:', blockType);

    // 只处理段落块（包括没有type字段的默认段落）
    const isParagraph = blockType === BlockElementType.PARAGRAPH || blockType === undefined;
    if (!isParagraph) {
      console.log('markdown-shortcuts: not a paragraph');
      insertText(text);
      return;
    }

    // 获取块内的完整文本内容
    const blockText = SlateEditor.string(editor, blockPath);
    console.log('markdown-shortcuts: blockText:', JSON.stringify(blockText));

    // 获取光标在块内的偏移位置
    const depth = blockPath.length;
    let cursorInBlockOffset = 0;

    // 累加所有前序文本节点的长度
    for (let i = 0; i < anchor.path[depth]; i++) {
      const child = (node as any).children[i];
      if (child && typeof child.text === 'string') {
        cursorInBlockOffset += child.text.length;
      }
    }
    cursorInBlockOffset += anchor.offset;
    console.log('markdown-shortcuts: cursorInBlockOffset:', cursorInBlockOffset);

    // 空格之前的内容
    const beforeSpace = blockText.slice(0, cursorInBlockOffset);
    console.log('markdown-shortcuts: beforeSpace:', JSON.stringify(beforeSpace));

    // 检测标题语法：# ~ ######
    if (/^#{1,6}$/.test(beforeSpace)) {
      const level = beforeSpace.length;
      let headingType: BlockElementType;

      switch (level) {
        case 1:
          headingType = BlockElementType.HEADING_ONE;
          break;
        case 2:
          headingType = BlockElementType.HEADING_TWO;
          break;
        case 3:
          headingType = BlockElementType.HEADING_THREE;
          break;
        default:
          headingType = BlockElementType.HEADING_THREE;
      }

      console.log('markdown-shortcuts: heading match, level:', level, 'type:', headingType);

      // 先删除 # 符号
      Transforms.delete(editor, {
        at: {
          anchor: { path: [...blockPath, 0], offset: 0 },
          focus: { path: [...blockPath, 0], offset: level },
        },
      });

      // 设置为标题类型
      Transforms.setNodes(editor, { type: headingType } as any, { at: blockPath });

      return;
    }

    // 检测分割线语法：---
    if (/^---$/.test(beforeSpace)) {
      console.log('markdown-shortcuts: divider match');

      // 删除 '---' 文本内容
      Transforms.delete(editor, {
        at: {
          anchor: { path: [...blockPath, 0], offset: 0 },
          focus: { path: [...blockPath, 0], offset: 3 },
        },
      });

      // 设置为分割线类型
      Transforms.setNodes(
        editor,
        { type: BlockElementType.DIVIDER, children: [{ text: '' }] } as any,
        { at: blockPath },
      );

      return;
    }

    // 默认行为：插入空格
    insertText(text);
  };

  return editor;
};
