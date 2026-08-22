import { Transforms, Editor, Range } from 'slate';
import { BlockElementType } from '@/enums';

export interface MentionAttrs {
  /** 显示名称（如"产品需求文档"） */
  name: string;
  /** 类型：category 分类 / doc 文章 */
  kind: 'category' | 'doc';
  /** 唯一标识（分类 id 或文档 id） */
  targetId: string;
  /** 跳转链接（可选） */
  url?: string;
}

export interface MentionElement {
  type: typeof BlockElementType.MENTION;
  id?: string;
  attrs: MentionAttrs;
  children: { text: string }[];
}

/** 创建一个艾特元素（行内 void，children 为空文本占位） */
export const createMentionElement = (attrs: MentionAttrs): MentionElement => ({
  type: BlockElementType.MENTION,
  id: `mention-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  attrs,
  children: [{ text: '' }],
});

/**
 * 在当前光标处插入艾特元素，并删除触发用的 @ + 搜索文本。
 * @param triggerRange @ 符号所在位置的 range（从 @ 到当前光标）
 */
export const insertMention = (editor: Editor, attrs: MentionAttrs, triggerRange: Range) => {
  // 先删除 @ 及其后的搜索文本
  Transforms.delete(editor, { at: triggerRange });
  // 插入艾特元素
  const mention = createMentionElement(attrs);
  Transforms.insertNodes(editor, mention as any, { at: triggerRange.anchor });
  // 把光标移到艾特后面
  try {
    const point = Editor.after(editor, triggerRange.anchor, { distance: 1 });
    if (point) {
      Transforms.select(editor, point);
    }
  } catch {
    // 忽略
  }
};

/**
 * 判断当前光标前一个字符是否为 @，且 @ 前面不是数字或英文字母。
 * 返回 @ 的位置（Range），不满足条件返回 null。
 */
export const getMentionTriggerRange = (editor: Editor): Range | null => {
  const { selection } = editor;
  if (!selection || !Range.isCollapsed(selection)) return null;

  const { anchor } = selection;
  // 取光标所在文本节点之前的内容
  const [node] = Editor.node(editor, anchor.path);
  if (!node || typeof (node as any).text !== 'string') return null;

  const text = (node as any).text as string;
  const cursorOffset = anchor.offset;

  // 往前找最近的 @
  const atIndex = text.lastIndexOf('@', cursorOffset - 1);
  if (atIndex === -1) return null;

  // @ 前面的字符
  const charBefore = atIndex === 0 ? '' : text[atIndex - 1];

  // 规则：前面是数字或英文字母 → 不触发（类似 email 地址的场景）
  if (charBefore && /[a-zA-Z0-9]/.test(charBefore)) return null;

  // 规则：@ 和光标之间不能有空格或换行（说明用户已经结束了 @ 输入）
  const searchText = text.slice(atIndex + 1, cursorOffset);
  if (/\s/.test(searchText)) return null;

  // 构造 @ 到光标位置的 range
  const range: Range = {
    anchor: { path: anchor.path, offset: atIndex },
    focus: { path: anchor.path, offset: cursorOffset },
  };
  return range;
};

/** 获取 @ 后面的搜索文本 */
export const getMentionSearchText = (editor: Editor, triggerRange: Range): string => {
  const startOffset = triggerRange.anchor.offset + 1; // 跳过 @
  const endOffset = triggerRange.focus.offset;
  if (endOffset <= startOffset) return '';
  const [node] = Editor.node(editor, triggerRange.anchor.path);
  const text = (node as any).text as string;
  return text.slice(startOffset, endOffset);
};
