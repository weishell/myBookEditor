import { Editor, Transforms, Element, Node as SlateNode, Path } from 'slate';
import { BlockElementType, ZERO_WIDTH_SPACE } from '@/enums';
import { toggleLilist, LilistType, getLilist } from '@/plugins/lilist';
import { isInsideHintBlock, toggleInnerBlock } from '@/plugins/hint-block/hint-block-container';

interface ToggleBlockOptions {
  level?: number;
}

/**
 * 选区范围内是否包含提示块（含光标在内部的情形）。
 * 提示块整体禁止被转换成其他类型（也不允许重复切换），转换只发生在其内部行上。
 */
const selectionHasHintBlock = (editor: Editor): boolean => {
  const { selection } = editor;
  if (!selection) return false;
  try {
    const nodes = Array.from(
      (editor as any).nodes({
        at: (editor as any).unhangRange(selection),
        match: (n: unknown) =>
          !(n as any).isEditor &&
          Element.isElement(n) &&
          (n as any).type === BlockElementType.HINT_BLOCK,
      }),
    );
    return nodes.length > 0;
  } catch {
    return false;
  }
};

/**
 * 判断当前选区是否包含 HEADING_TITLE 独立标题块
 * —— 独立标题块不能通过 FloatBar / DocBar 进行插件类型切换
 */
const hasHeadingTitle = (editor: Editor): boolean => {
  const { selection } = editor;
  if (!selection) return false;
  const nodes = Array.from(
    (editor as any).nodes({
      at: (editor as any).unhangRange(selection),
      match: (n: unknown) =>
        !(n as any).isEditor &&
        Element.isElement(n) &&
        (n as any).type === BlockElementType.HEADING_TITLE,
    }),
  );
  return nodes.length > 0;
};

export const toggleBlock = (
  editor: Editor,
  format: BlockElementType,
  options?: ToggleBlockOptions,
) => {
  // 规则1：目标是 HEADING_TITLE 时不允许（只能通过初始化或normalize保证唯一）
  if (format === BlockElementType.HEADING_TITLE) return;
  // 规则2：当前选区在 HEADING_TITLE 上时，禁止切换为其他块
  if (hasHeadingTitle(editor)) return;

  // 提示块容器规则：
  //  - 光标在提示块内部 → 只转换内部行（段落/标题/列表/待办），提示块本身不动
  //  - 提示块整体（选区覆盖到它）禁止被转换：已存在提示块时任何 toggle 都不生效
  if (isInsideHintBlock(editor)) {
    if (format === BlockElementType.HINT_BLOCK) return;
    toggleInnerBlock(editor, format, options);
    return;
  }
  if (selectionHasHintBlock(editor)) return;

  // 有序/无序列表走 lilist 绑定模型（旧的 wrapper 类型已废弃）
  if (format === BlockElementType.NUMBERED_LIST) {
    toggleLilist(editor, LilistType.OL);
    return;
  }
  if (format === BlockElementType.BULLETED_LIST) {
    toggleLilist(editor, LilistType.UL);
    return;
  }

  const isActive = isBlockActive(editor, format, options);

  if (format === BlockElementType.CODE_BLOCK) {
    // 直接切换回段落
    if (isActive) {
      Transforms.setNodes(editor, { type: BlockElementType.PARAGRAPH } as Partial<Element>, {
        match: (n: unknown) => Element.isElement(n) && (editor as any).isBlock(n),
      });
      return;
    }
    // 代码块必须包含合法的 CODE_LINE 子节点（否则行号无法渲染）。
    // setNodes 直接覆盖 children 在跳类型时会被 Slate 途中机制还原，故采用“删除原块 + 原位插入新代码块”。
    const matches = Array.from(
      (editor as any).nodes({
        mode: 'highest',
        match: (n: any) =>
          Element.isElement(n) &&
          (n as any).type !== BlockElementType.HEADING_TITLE &&
          (editor as any).isBlock(n),
      }),
    ) as [any, number[]][];
    Editor.withoutNormalizing(editor, () => {
      for (let i = matches.length - 1; i >= 0; i--) {
        const [n, p] = matches[i];
        const rawText = SlateNode.string(n) || '';
        const textLines = rawText.split(/\r?\n/);
        const codeLines = textLines.map((lt) => ({
          type: BlockElementType.CODE_LINE,
          id: `code-line-${crypto.randomUUID()}`,
          children: [{ text: lt }, { text: ZERO_WIDTH_SPACE }],
        }));
        if (codeLines.length === 0) {
          codeLines.push({
            type: BlockElementType.CODE_LINE,
            id: `code-line-${crypto.randomUUID()}`,
            children: [{ text: '' }, { text: ZERO_WIDTH_SPACE }],
          });
        }
        Transforms.insertNodes(
          editor,
          {
            type: BlockElementType.CODE_BLOCK,
            attrs: { language: 'javascript', wrap: true },
            children: codeLines,
          } as any,
          { at: p, select: false },
        );
        Transforms.removeNodes(editor, { at: Path.next(p) } as any);
      }
    });
    try {
      const firstPath = matches[0]?.[1];
      if (firstPath) {
        Transforms.select(editor, Editor.start(editor, firstPath));
      }
    } catch {
      /* ignore */
    }
    return;
  }

  if (format === BlockElementType.HEADING && options?.level) {
    Transforms.setNodes(
      editor,
      {
        type: isActive ? BlockElementType.PARAGRAPH : format,
        attrs: { level: options.level },
      } as Partial<Element>,
      { match: (n) => Element.isElement(n) && (editor as any).isBlock(n) },
    );
  } else if (format === BlockElementType.HINT_BLOCK) {
    // 提示块需要携带默认 attrs（type/label 驱动渲染），切换时给予默认值
    Transforms.setNodes(
      editor,
      {
        type: isActive ? BlockElementType.PARAGRAPH : format,
        attrs: { type: 'info', label: '说明' },
      } as Partial<Element>,
      { match: (n) => Element.isElement(n) && (editor as any).isBlock(n) },
    );
  } else {
    Transforms.setNodes(
      editor,
      { type: isActive ? BlockElementType.PARAGRAPH : format } as Partial<Element>,
      { match: (n) => Element.isElement(n) && (editor as any).isBlock(n) },
    );
  }
};

export const isBlockActive = (
  editor: Editor,
  format: BlockElementType,
  options?: ToggleBlockOptions,
) => {
  const { selection } = editor;
  if (!selection) return false;

  // lilist 列表的高亮判断：看宿主块的 attrs.lilist
  if (format === BlockElementType.NUMBERED_LIST || format === BlockElementType.BULLETED_LIST) {
    const targetType = format === BlockElementType.NUMBERED_LIST ? LilistType.OL : LilistType.UL;
    const lilistNodes = Array.from(
      (editor as any).nodes({
        at: (editor as any).unhangRange(selection),
        match: (n: unknown) =>
          !(n as any).isEditor && Element.isElement(n) && getLilist(n)?.list_type === targetType,
        mode: 'highest',
      }),
    );
    return lilistNodes.length > 0;
  }

  const nodes = Array.from(
    (editor as any).nodes({
      at: (editor as any).unhangRange(selection),
      match: (n: unknown) => {
        if (!(n as any).isEditor && Element.isElement(n)) {
          const node = n as { type?: BlockElementType; attrs?: { level?: number } };
          if (format === BlockElementType.HEADING && options?.level) {
            return node.type === format && node.attrs?.level === options.level;
          }
          return node.type === format;
        }
        return false;
      },
    }),
  );

  return nodes.length > 0;
};
