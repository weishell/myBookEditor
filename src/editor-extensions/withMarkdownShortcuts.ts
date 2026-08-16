import { Editor, Transforms, Range, Element } from 'slate';
import { BlockElementType } from '@/enums';
import { convertBlockToLilist, LilistType, MAX_LIST_NUMBER } from '@/plugins/lilist';

export const withMarkdownShortcuts = (editor: Editor) => {
  const { insertText } = editor;

  editor.insertText = (text) => {
    // 只处理空格插入
    if (text !== ' ') {
      insertText(text);
      return;
    }

    const { selection } = editor;
    if (!selection || !Range.isCollapsed(selection)) {
      insertText(text);
      return;
    }

    const { anchor } = selection;

    // 使用 Editor.above 获取离选区最近的块级祖先
    // 在表格单元格内时，这会返回单元格内的段落，而不是表格本身
    const result = Editor.above(editor, {
      match: (n: any) => Element.isElement(n) && Editor.isBlock(editor, n),
      at: anchor.path,
    });

    if (!result) {
      insertText(text);
      return;
    }

    const [node, blockPath] = result as [any, number[]];
    const blockType = (node as any)?.type;

    // 只处理段落块（包括没有type字段的默认段落）
    const isParagraph =
      blockType === BlockElementType.PARAGRAPH || blockType === undefined || blockType === null;
    if (!isParagraph) {
      insertText(text);
      return;
    }

    // 获取块内的完整文本内容
    const blockText = Editor.string(editor, blockPath);

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

    // 空格之前的内容
    const beforeSpace = blockText.slice(0, cursorInBlockOffset);

    // 检测标题语法：# ~ ######### (H1-H9)
    if (/^#{1,9}$/.test(beforeSpace)) {
      const level = beforeSpace.length;

      // 先删除 # 符号
      Transforms.delete(editor, {
        at: {
          anchor: { path: [...blockPath, 0], offset: 0 },
          focus: { path: [...blockPath, 0], offset: level },
        },
      });

      // 设置为标题类型，使用 attrs.level 指定级别
      Transforms.setNodes(editor, { type: BlockElementType.HEADING, attrs: { level } } as any, {
        at: blockPath,
      });

      return;
    }

    // 检测分割线语法：---
    if (/^---$/.test(beforeSpace)) {
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

    // 检测待办事项语法：- [ ] 或 - [x]
    const todoMatch = beforeSpace.match(/^-\s*\[([ x])\]\s*$/);
    if (todoMatch) {
      const isChecked = todoMatch[1] === 'x';

      // 删除语法文本
      Transforms.delete(editor, {
        at: {
          anchor: { path: [...blockPath, 0], offset: 0 },
          focus: { path: [...blockPath, 0], offset: beforeSpace.length },
        },
      });

      // 设置为待办事项类型
      Transforms.setNodes(
        editor,
        { type: BlockElementType.TODO_LIST, attrs: { checked: isChecked } } as any,
        { at: blockPath },
      );

      return;
    }

    // 检测有序列表语法：数字 + .（如 "1."、"3."），任意位数数字都支持
    const olMatch = beforeSpace.match(/^(\d+)\.$/);
    if (olMatch) {
      // 起始数字超过上限（MAX_LIST_NUMBER）时从 1 开始
      const parsed = parseInt(olMatch[1], 10);
      const startNumber = parsed > MAX_LIST_NUMBER ? 1 : parsed;

      // 删除数字标记
      Transforms.delete(editor, {
        at: {
          anchor: { path: [...blockPath, 0], offset: 0 },
          focus: { path: [...blockPath, 0], offset: beforeSpace.length },
        },
      });

      // 绑定 lilist 有序列表（起始数字 > 1 时自动作为自定义锚点）
      convertBlockToLilist(editor, blockPath, LilistType.OL, startNumber);
      return;
    }

    // 检测无序列表语法：-（注意排在 --- 分割线、- [ ] 待办之后）
    if (/^-$/.test(beforeSpace)) {
      Transforms.delete(editor, {
        at: {
          anchor: { path: [...blockPath, 0], offset: 0 },
          focus: { path: [...blockPath, 0], offset: 1 },
        },
      });

      convertBlockToLilist(editor, blockPath, LilistType.UL);
      return;
    }

    // 默认行为：插入空格
    insertText(text);
  };

  return editor;
};
