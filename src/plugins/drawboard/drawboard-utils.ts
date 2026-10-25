// 画板（drawui）块：文档内保留一个轻量预览卡。
// 图形数据单独存 data/media/drawboards/<file>.json，文档节点只保留相对路径 attrs.src；
// attrs.data 仅用于兼容旧文档（内联数据），新写入一律不再内联。
import { BlockElementType, ZERO_WIDTH_SPACE } from '@/enums';
import type { Shape } from 'drawui-core';

export interface DrawboardAttrs {
  [key: string]: unknown;
  width?: number;
  height?: number;
  /** 旧格式：内联的图形数据（drawui 的 Shape[]），仅读取兼容 */
  data?: Shape[];
  /** 图形数据文件的相对路径，如 media/drawboards/1690-xxx.json */
  src?: string;
  /** 预留：后续接入外部画布数据时，用该引用定位画布内容 */
  ref?: string;
  /** 块级对齐（left/center/right），作用于外层 flex wrapper */
  align?: 'left' | 'center' | 'right';
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
