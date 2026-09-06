// 内嵌网页块的 Slate 节点定义。
// URL 与高度挂在 attrs 上，随文档 JSON 一起序列化/持久化。

import { Editor, Transforms, type NodeEntry } from 'slate';
import { BlockElementType, ZERO_WIDTH_SPACE } from '@/enums';

export interface EmbedAttrs {
  /** 内嵌网页地址（空表示未填写，渲染占位提示） */
  url: string;
  /** iframe 高度（px），默认 400，可拖拽调整 */
  height: number;
}

export interface EmbedElement {
  type: typeof BlockElementType.EMBED;
  id?: string;
  attrs: EmbedAttrs;
  children: [{ text: string }];
}

export const DEFAULT_EMBED_HEIGHT = 400;
export const MIN_EMBED_HEIGHT = 120;
export const MAX_EMBED_HEIGHT = 2000;

export const DEFAULT_EMBED_ATTRS: EmbedAttrs = {
  url: '',
  height: DEFAULT_EMBED_HEIGHT,
};

export const isEmbedElement = (n: unknown): n is EmbedElement =>
  !!n && typeof n === 'object' && (n as { type?: unknown }).type === BlockElementType.EMBED;

/** 创建一个内嵌网页块（void，需含单个零宽文本子节点保证结构合法） */
export const createEmbedElement = (attrs?: Partial<EmbedAttrs>): EmbedElement => ({
  type: BlockElementType.EMBED,
  id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
  attrs: { ...DEFAULT_EMBED_ATTRS, ...attrs },
  children: [{ text: ZERO_WIDTH_SPACE }],
});

/** 兜底修复非法 attrs，供 normalizeNode 使用 */
export const normalizeEmbedAttrs = (raw: unknown): EmbedAttrs => {
  const a = (raw || {}) as Partial<EmbedAttrs>;
  const height = Number.isFinite(a.height)
    ? Math.min(MAX_EMBED_HEIGHT, Math.max(MIN_EMBED_HEIGHT, Number(a.height)))
    : DEFAULT_EMBED_HEIGHT;
  return {
    url: typeof a.url === 'string' ? a.url : '',
    height,
  };
};

/** 补全协议：输入 "baidu.com" → "https://baidu.com"；非法输入返回空串 */
export const normalizeEmbedUrl = (input: string): string => {
  const url = (input || '').trim();
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  if (/^[\w-]+(\.[\w-]+)+(\/|$|:\d)/.test(url)) return `https://${url}`;
  return url; // 其余原样保留（data: 等特殊协议交由调用方判断）
};

/**
 * 内嵌网页块扩展：
 *  - isVoid：整块不可编辑，内容由组件自绘
 *  - normalizeNode：保证 attrs 合法、子节点为单个零宽文本，
 *    防止异常删除/变更破坏结构后渲染崩溃
 */
export const withEmbed = (editor: Editor) => {
  const { isVoid, normalizeNode } = editor;

  editor.isVoid = (element) => {
    if (isEmbedElement(element)) return true;
    return isVoid(element);
  };

  editor.normalizeNode = (entry: NodeEntry) => {
    const [node, path] = entry;
    if (isEmbedElement(node)) {
      const next = normalizeEmbedAttrs(node.attrs);
      if (JSON.stringify(next) !== JSON.stringify(node.attrs)) {
        Transforms.setNodes(editor, { attrs: next } as any, { at: path, voids: true });
        return;
      }
      // 子节点必须是单个零宽文本
      if (node.children.length !== 1 || typeof node.children[0]?.text !== 'string') {
        Transforms.removeNodes(editor, { at: path, voids: true });
        Transforms.insertNodes(
          editor,
          {
            type: BlockElementType.EMBED,
            id: node.id,
            attrs: next,
            children: [{ text: ZERO_WIDTH_SPACE }],
          } as any,
          { at: path, select: false },
        );
        return;
      }
      if (node.children[0].text !== ZERO_WIDTH_SPACE) {
        Transforms.setNodes(editor, { text: ZERO_WIDTH_SPACE } as any, {
          at: [...path, 0],
          voids: true,
        });
        return;
      }
      return;
    }
    normalizeNode(entry);
  };

  return editor;
};
