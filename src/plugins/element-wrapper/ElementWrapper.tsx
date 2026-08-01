import React, { useCallback } from 'react';
import { BlockElementType } from '@/enums';
import { INDENT_PX } from '@/utils/indent';

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

  return (
    <div
      ref={handleRef}
      {...restAttributes}
      data-plugin-id={pluginId}
      data-block-type={type}
      data-block-attrs={attrs ? JSON.stringify(attrs) : undefined}
      data-empty={isEmpty ? 'true' : undefined}
      className={className}
      style={{ position: 'relative', ...indentStyle }}
    >
      {children}
    </div>
  );
};
