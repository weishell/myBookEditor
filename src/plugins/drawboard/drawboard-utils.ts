// 画板（drawui）块：文档内保留一个轻量预览卡，内容在后续版本外部化存储（文档只留 id/url 引向画布）。
import { BlockElementType, ZERO_WIDTH_SPACE } from '@/enums';

export interface DrawboardAttrs {
  width?: number;
  height?: number;
  /** 预留：后续接入外部画布数据时，用该引用定位画布内容 */
  ref?: string;
}

export interface DrawboardElement {
  type: typeof BlockElementType.DRAWBOARD;
  id: string;
  attrs: DrawboardAttrs;
  children: [{ text: string }];
}

export const createDrawboardElement = (): DrawboardElement => ({
  type: BlockElementType.DRAWBOARD,
  id: crypto.randomUUID(),
  attrs: { width: 720, height: 400 },
  children: [{ text: ZERO_WIDTH_SPACE }],
});

export const isDrawboardElement = (n: unknown): boolean =>
  !!(n && (n as { type?: string }).type === BlockElementType.DRAWBOARD);
