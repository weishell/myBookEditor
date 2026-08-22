import { Transforms, Element, type Editor, type NodeEntry } from 'slate';
import { v4 as uuidv4 } from 'uuid';
import { BlockElementType } from '@/enums';

/** 行内公式元素（text 为空，真实 LaTeX 内容存放在 attrs.value） */
export interface FormulaElement {
  type: typeof BlockElementType.FORMULA;
  id: string;
  attrs: { value: string };
  children: [{ text: string }];
}

/** 包一层判断，避免调用方强转 */
export const isFormulaElement = (node: unknown): node is FormulaElement =>
  Element.isElement(node) && (node as any).type === BlockElementType.FORMULA;

/** 创建行内公式元素 */
export const createFormulaElement = (value: string): FormulaElement => ({
  type: BlockElementType.FORMULA,
  id: uuidv4(),
  attrs: { value },
  children: [{ text: '' }],
});

/**
 * 在光标处插入行内公式。
 * FloatBar 场景下可能存在展开选区，插入会替换该选区。
 */
export const insertFormula = (editor: Editor, value: string) => {
  const trimmed = value.trim();
  if (!trimmed || !editor.selection) return;
  // 展开选区先删除，再以 void 元素接替光标位置
  Transforms.insertNodes(editor, createFormulaElement(trimmed) as any, {
    at: (editor as any).selection,
    select: true,
  });
};

/** 更新一个已存在的行内公式（点击编辑后保存） */
export const updateFormula = (editor: Editor, entry: NodeEntry, value: string) => {
  const [node, path] = entry;
  const trimmed = value.trim();
  if (!trimmed) return;
  if (!isFormulaElement(node)) return;
  Transforms.setNodes(editor, { attrs: { value: trimmed } } as Partial<FormulaElement>, {
    at: path,
  });
};
