// 字体相关的 Slate 操作（插件层）
//
// setBlockFont:    改光标所在块 / 选区内所有"叶子 block"
//                  无 selection 时用 fallbackPath（DocBar hover 的块路径）
// setTableFont:    改光标所在表格内所有叶子 block
// setDocumentFont: 改全文所有叶子 block（强制统一，和全局层 globalFont 不同）

import { Editor, Transforms, Element, Text } from 'slate';
import { BlockElementType } from '@/enums';
import { FONT_SUPPORTED_BLOCK_TYPES } from './font-list';

function isFontSupportedBlock(node: any): boolean {
  return Element.isElement(node) && FONT_SUPPORTED_BLOCK_TYPES.includes(node.type);
}

/**
 * 清除指定范围内所有 text 节点的 fontFamily mark
 * 用于设置 block / table 字体时，抹去 text 层的旧字体 mark，
 * 否则 text 层 mark 会覆盖 block 层新设的字体
 */
function clearTextFontMark(editor: Editor, at: any): void {
  Transforms.unsetNodes(editor, 'fontFamily', {
    at,
    match: (n) => Text.isText(n),
  });
}

export function getBlockFont(node: any): string | undefined {
  return node?.attrs?.fontFamily;
}

/**
 * 设置叶子 block 的字体
 * - 传了 fallbackPath 时（DocBar 场景）只改该路径对应的块，忽略 selection
 * - 未传 fallbackPath 时（右键菜单场景）作用于选区
 * - fallbackPath 为表格路径时，自动遍历表格内所有叶子块
 *
 * @param editor Slate editor
 * @param fontFamily CSS font-family 值，传空字符串表示清除字体
 * @param fallbackPath DocBar 场景的目标块路径（来自 targetId），优先于 selection
 */
export function setBlockFont(editor: Editor, fontFamily: string, fallbackPath?: number[]): void {
  // DocBar 场景优先用 fallbackPath（只改当前 hover 的块），否则用 selection
  const at: any = fallbackPath || editor.selection;
  if (!at) return;

  const entries = Array.from(
    Editor.nodes(editor, {
      at,
      match: (n) => isFontSupportedBlock(n),
      mode: 'all',
    }),
  );

  for (const [node, path] of entries) {
    const currentAttrs = (node as any).attrs || {};
    const newAttrs =
      fontFamily === ''
        ? { ...currentAttrs, fontFamily: undefined }
        : { ...currentAttrs, fontFamily };
    Transforms.setNodes(editor, { attrs: newAttrs } as Partial<Element>, { at: path });
  }

  // 清除选区内 text 层的 fontFamily mark，防止 mark 覆盖 block 层新字体
  clearTextFontMark(editor, at);
}

export function setTableFont(editor: Editor, fontFamily: string): void {
  const { selection } = editor;
  if (!selection) return;

  const [tableEntry] = Editor.nodes(editor, {
    at: selection,
    match: (n) => Element.isElement(n) && (n as any).type === BlockElementType.TABLE,
    mode: 'highest',
  });

  if (!tableEntry) {
    setBlockFont(editor, fontFamily);
    return;
  }

  const [, tablePath] = tableEntry;
  const entries = Array.from(
    Editor.nodes(editor, {
      at: tablePath,
      match: (n) => isFontSupportedBlock(n),
      mode: 'all',
    }),
  );

  for (const [node, path] of entries) {
    const currentAttrs = (node as any).attrs || {};
    const newAttrs =
      fontFamily === ''
        ? { ...currentAttrs, fontFamily: undefined }
        : { ...currentAttrs, fontFamily };
    Transforms.setNodes(editor, { attrs: newAttrs } as Partial<Element>, { at: path });
  }

  clearTextFontMark(editor, tablePath);
}

export function setDocumentFont(editor: Editor, fontFamily: string): void {
  const entries = Array.from(
    Editor.nodes(editor, {
      at: [],
      match: (n) => isFontSupportedBlock(n),
      mode: 'all',
    }),
  );

  for (const [node, path] of entries) {
    const currentAttrs = (node as any).attrs || {};
    const newAttrs =
      fontFamily === ''
        ? { ...currentAttrs, fontFamily: undefined }
        : { ...currentAttrs, fontFamily };
    Transforms.setNodes(editor, { attrs: newAttrs } as Partial<Element>, { at: path });
  }

  clearTextFontMark(editor, []);
}

export function isSelectionInTable(editor: Editor): boolean {
  const { selection } = editor;
  if (!selection) return false;

  const [tableEntry] = Editor.nodes(editor, {
    at: selection,
    match: (n) => Element.isElement(n) && (n as any).type === BlockElementType.TABLE,
    mode: 'highest',
  });

  return !!tableEntry;
}
