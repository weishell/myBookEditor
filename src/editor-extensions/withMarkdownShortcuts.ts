import { Editor, Transforms, Range, Element, Path } from 'slate';
import { BlockElementType, ZERO_WIDTH_SPACE } from '@/enums';
import { convertBlockToLilist, isLilistHost, LilistType, MAX_LIST_NUMBER } from '@/plugins/lilist';

/** Markdown 代码围栏常用名 → 受支持语言 id（空/未知 → plaintext） */
const FENCE_LANG_ALIASES: Record<string, string> = {
  js: 'javascript',
  javascript: 'javascript',
  jsx: 'javascript',
  ts: 'typescript',
  typescript: 'typescript',
  tsx: 'typescript',
  py: 'python',
  python: 'python',
  java: 'java',
  css: 'css',
  json: 'json',
  html: 'markup',
  markup: 'markup',
  sql: 'sql',
  sh: 'bash',
  bash: 'bash',
  shell: 'bash',
  go: 'go',
  rust: 'rust',
  rs: 'rust',
};

/** 生成一个代码行节点（含行号所需零宽字符） */
const makeCodeLine = (text = ''): any => ({
  type: BlockElementType.CODE_LINE,
  id: `code-line-${crypto.randomUUID()}`,
  children: [{ text }, { text: ZERO_WIDTH_SPACE }],
});

export const withMarkdownShortcuts = (editor: Editor) => {
  const { insertText } = editor;

  editor.insertText = (text) => {
    // 只处理 markdown 触发字符：空格、反引号（`/全角｀）
    if (text !== ' ' && text !== '`' && text !== '\uFF40') {
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

    // 段落与 H 标题都可作为快捷触发源；其它块（代码/表格等）不触发
    const blockType = (node as any)?.type as BlockElementType | undefined;
    const effectiveType =
      blockType === undefined || blockType === null ? BlockElementType.PARAGRAPH : blockType;
    const isConvertible =
      effectiveType === BlockElementType.PARAGRAPH || effectiveType === BlockElementType.HEADING;
    if (!isConvertible) {
      insertText(text);
      return;
    }

    // 行内代码 markdown 快捷：输入 `code` 再补闭合反引号，把中间内容转为行内代码 mark。
    const isBacktick = text === '`' || text === '\uFF40';
    if (isBacktick) {
      const [textNode] = Editor.node(editor, anchor.path) as [any, number[]];
      const nodeText = textNode?.text || '';
      const beforeInNode = nodeText.slice(0, anchor.offset);
      const openIdx = Math.max(beforeInNode.lastIndexOf('`'), beforeInNode.lastIndexOf('\uFF40'));
      if (openIdx >= 0) {
        const content = beforeInNode.slice(openIdx + 1);
        // 开反引号后必须是至少一个字符的内容（不含反引号/换行），才判定为闭合
        if (/^[^`\uFF40\n]+$/.test(content) && content.length > 0) {
          // 1) 删除开头的反引号
          Transforms.select(editor, {
            anchor: { path: anchor.path, offset: openIdx },
            focus: { path: anchor.path, offset: openIdx + 1 },
          });
          Transforms.delete(editor);
          // 2) 对中间内容应用 code mark（此时内容从 offset openIdx 起）
          Transforms.select(editor, {
            anchor: { path: anchor.path, offset: openIdx },
            focus: { path: anchor.path, offset: openIdx + content.length },
          });
          editor.addMark('code', true);
          // 3) 光标回到内容末尾（闭合反引号原本所在处），且不插入本次反引号
          Transforms.collapse(editor, { edge: 'end' });
          return;
        }
      }
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

    // 检测代码围栏：``` 或 ```js 等，按语言id映射，未知/空 → plaintext
    const fenceMatch = beforeSpace.match(/^(`{3,}|\uFF40{3,})([A-Za-z0-9_-]*)$/);
    if (fenceMatch) {
      const langKey = (fenceMatch[2] || '').toLowerCase();
      const language = FENCE_LANG_ALIASES[langKey] || 'plaintext';

      // 删除围栏文本
      Transforms.delete(editor, {
        at: {
          anchor: { path: [...blockPath, 0], offset: 0 },
          focus: { path: [...blockPath, 0], offset: beforeSpace.length },
        },
      });

      // 用代码块整体替换当前段落（代码块需合法 CODE_LINE 子节点）
      const codeBlock = {
        type: BlockElementType.CODE_BLOCK,
        attrs: { language, wrap: true },
        children: [makeCodeLine()],
      };
      Transforms.insertNodes(editor, codeBlock as any, { at: blockPath, select: false });
      Transforms.removeNodes(editor, { at: Path.next(blockPath) } as any);
      try {
        Transforms.select(editor, Editor.start(editor, blockPath));
      } catch {
        /* ignore */
      }
      return;
    }

    // 检测待办事项语法：[ ] / [x] / []（无横线前缀）
    const bareTodoMatch = beforeSpace.match(/^\[(\s*[x]?)\]\s*$/i);
    if (bareTodoMatch) {
      const isChecked = (bareTodoMatch[1] || '').trim().toLowerCase() === 'x';
      Transforms.delete(editor, {
        at: {
          anchor: { path: [...blockPath, 0], offset: 0 },
          focus: { path: [...blockPath, 0], offset: beforeSpace.length },
        },
      });
      Transforms.setNodes(
        editor,
        { type: BlockElementType.TODO_LIST, attrs: { checked: isChecked } } as any,
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
      // 仅当宿主块支持有序列表（段落/标题）才转换，否则照常插入空格避免误删文本
      if (!isLilistHost(LilistType.OL, effectiveType)) {
        insertText(text);
        return;
      }
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
      // 无序列表仅段落支持（标题无序不在模型内），不支持时照常插入空格避免误删
      if (!isLilistHost(LilistType.UL, effectiveType)) {
        insertText(text);
        return;
      }
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
