// 画板（drawui）块：文档内保留一个轻量预览卡。
// 图形数据（Shape[]）直接内联存储在文档节点的 attrs.data 中，按画板 id 区分，
// 不依赖 localStorage（一个页面可能包含多个画板，localStorage 无法按块隔离且易冲突）。
import { BlockElementType, ZERO_WIDTH_SPACE } from '@/enums';
import type { Shape } from 'drawui-core';

export interface DrawboardAttrs {
  [key: string]: unknown;
  width?: number;
  height?: number;
  /** 画板内图形数据（drawui 的 Shape[]），内联存储于文档节点，按画板 id 隔离，不使用 localStorage */
  data?: Shape[];
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
