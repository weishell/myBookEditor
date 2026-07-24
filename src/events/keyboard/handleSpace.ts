import type { Editor } from 'slate';
import { Editor as SlateEditor, Transforms, Range } from 'slate';
import { isHotkey } from 'is-hotkey';
import { BlockElementType } from '@/enums';

export const handleSpace = (editor: Editor, event: KeyboardEvent) => {
  if (!isHotkey(' ', event)) return false;

  const { selection } = editor;
  if (!selection || !Range.isCollapsed(selection)) return false;

  const { anchor } = selection;

  // 获取当前块级元素
  const [block] = SlateEditor.nodes(editor, {
    match: (n: any) => SlateEditor.isBlock(editor, n),
    at: anchor.path,
  });

  if (!block) return false;

  const [node, blockPath] = block;

  // 只检测段落块，代码块等其他块不处理
  const blockType = (node as any)?.type;
  if (blockType !== BlockElementType.PARAGRAPH) return false;

  // 获取块内的完整文本内容
  const blockText = SlateEditor.string(editor, blockPath);

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

    // 先删除 # 符号，再设置类型，避免路径变化影响删除操作
    Transforms.delete(editor, {
      at: {
        anchor: { path: [...blockPath, 0], offset: 0 },
        focus: { path: [...blockPath, 0], offset: level },
      },
    });

    Transforms.setNodes(editor, { type: headingType } as any, { at: blockPath });

    event.preventDefault();
    return true;
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
    Transforms.setNodes(editor, { type: BlockElementType.DIVIDER } as any, { at: blockPath });

    event.preventDefault();
    return true;
  }

  return false;
};
