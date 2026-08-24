import React, { useRef, useCallback } from 'react';
import type { RenderElementProps } from 'slate-react';
import type { CustomElement } from '@/core/types';
import styles from './ColumnGroup.module.less';

interface ColumnGroupProps extends RenderElementProps {
  pluginId?: string;
  element: CustomElement;
}

/**
 * ColumnGroup 只提供 flex 容器。
 * children 让 Slate 自己渲染（Slate 通过 attributes.ref 把每个 column 的 DOM 挂到 group 内）。
 * divider / + / × 全部放在 Column 内部（用绝对定位），避免 Slate children 传递问题。
 */
export const ColumnGroup: React.FC<ColumnGroupProps> = ({ attributes, children, element }) => {
  const { ref: slateRef, ...otherAttributes } = attributes as {
    ref?: React.RefCallback<HTMLDivElement>;
  };
  const groupRef = useRef<HTMLDivElement | null>(null);

  const setRefs = useCallback(
    (el: HTMLDivElement | null) => {
      groupRef.current = el;
      if (typeof slateRef === 'function') {
        slateRef(el);
      } else if (slateRef && typeof slateRef === 'object' && 'current' in slateRef) {
        (slateRef as any).current = el;
      }
    },
    [slateRef],
  );

  return (
    <div
      ref={setRefs}
      {...otherAttributes}
      className={styles.group}
      data-plugin-id={element.id}
      data-block-type={element.type}
      data-block-attrs={element.attrs ? JSON.stringify(element.attrs) : undefined}
    >
      {children}
    </div>
  );
};
