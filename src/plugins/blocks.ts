import { Editor, Transforms, Element } from 'slate';
import { BlockElementType } from '@/enums';
import { toggleLilist, LilistType, getLilist } from '@/plugins/lilist';

interface ToggleBlockOptions {
  level?: number;
}

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

  if (format === BlockElementType.HEADING && options?.level) {
    Transforms.setNodes(
      editor,
      {
        type: isActive ? BlockElementType.PARAGRAPH : format,
        attrs: { level: options.level },
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
