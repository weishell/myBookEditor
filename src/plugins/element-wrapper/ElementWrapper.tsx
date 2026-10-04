import React, { useCallback } from 'react';
import { BlockElementType } from '@/enums';
import { INDENT_PX } from '@/utils/indent';
import { useWholeBlockSelected } from '@/utils/whole-block-selection';

interface ElementWrapperProps {
  type: BlockElementType;
  pluginId?: string;
  attrs?: any;
  isEmpty?: boolean;
  attributes?: Record<string, unknown>;
  className?: string;
  children: React.ReactNode;
}

export const ElementWrapper = ({
  type,
  pluginId,
  attrs,
  isEmpty,
  attributes,
  className,
  children,
}: ElementWrapperProps) => {
  // 「整块选中」：非文本块 / 表格 / 提示块等复杂组件整体被选中时，
  // 统一在包裹层打标（全局样式：选中描边 + 隐藏内部文字原生选区）。
  // 普通段落/标题等类型永不命中（判定按类型白名单）。
  const isWholeSelected = useWholeBlockSelected();

  const rawAttrs = (attributes as Record<string, any>) || {};
  const slateRef = rawAttrs.ref;
  const restAttributes: Record<string, unknown> = { ...rawAttrs };
  delete restAttributes.ref;

  const handleRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (!slateRef) return;
      if (typeof slateRef === 'function') {
        slateRef(node);
      } else if (slateRef && typeof slateRef === 'object' && 'current' in slateRef) {
        (slateRef as React.MutableRefObject<HTMLElement | null>).current = node;
      }
    },
    [slateRef],
  );

  // 缩进样式
  const indent = attrs?.indent ?? 0;
  const indentStyle = indent > 0 ? { marginLeft: `${indent * INDENT_PX}px` } : undefined;

  // 对齐样式（对齐文本类块内容；非本文块无 align 字段，不生效）
  const align = attrs?.align;
  const alignStyle =
    align && ['left', 'center', 'right'].includes(align) ? { textAlign: align } : undefined;

  // 字体样式（插件层 attrs.fontFamily，覆盖全局层，被 text 层 mark 覆盖）
  const fontFamily = attrs?.fontFamily;
  const fontStyle = fontFamily && fontFamily !== 'inherit' ? { fontFamily } : undefined;

  return (
    <div
      ref={handleRef}
      {...restAttributes}
      data-plugin-id={pluginId}
      data-block-type={type}
      data-block-attrs={attrs ? JSON.stringify(attrs) : undefined}
      data-empty={isEmpty ? 'true' : undefined}
      data-whole-selected={isWholeSelected ? 'true' : undefined}
      className={className}
      style={{ position: 'relative', ...indentStyle, ...fontStyle, ...alignStyle }}
    >
      {children}
    </div>
  );
};
