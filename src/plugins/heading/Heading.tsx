import React from 'react';
import { useSelected, useFocused } from 'slate-react';
import { BlockElementType } from '@/enums';
import { ElementWrapper } from '@/plugins/element-wrapper';

interface ElementProps {
  attributes: Record<string, unknown>;
  children: React.ReactNode;
  pluginId?: string;
  element?: any;
}

// H1-H9 样式配置，参考飞书文档编辑器
const HEADING_STYLES: Record<
  number,
  { fontSize: string; lineHeight: number; marginBottom: number }
> = {
  1: { fontSize: '32px', lineHeight: 1.4, marginBottom: 16 },
  2: { fontSize: '24px', lineHeight: 1.5, marginBottom: 14 },
  3: { fontSize: '20px', lineHeight: 1.5, marginBottom: 12 },
  4: { fontSize: '18px', lineHeight: 1.6, marginBottom: 10 },
  5: { fontSize: '16px', lineHeight: 1.6, marginBottom: 8 },
  6: { fontSize: '14px', lineHeight: 1.6, marginBottom: 8 },
  7: { fontSize: '13px', lineHeight: 1.7, marginBottom: 6 },
  8: { fontSize: '12px', lineHeight: 1.7, marginBottom: 6 },
  9: { fontSize: '11px', lineHeight: 1.7, marginBottom: 6 },
};

export const Heading = ({ attributes, children, pluginId, element }: ElementProps) => {
  const isSelected = useSelected();
  const isFocused = useFocused();
  const level = element?.attrs?.level || 1;
  const style = HEADING_STYLES[level] || HEADING_STYLES[1];

  const isEmpty = element?.children?.[0]?.text === '' || element?.children?.[0]?.text === undefined;

  return (
    <ElementWrapper type={BlockElementType.HEADING} pluginId={pluginId} attrs={element?.attrs}>
      <h1
        {...(attributes as React.HTMLAttributes<HTMLHeadingElement>)}
        style={{
          fontSize: style.fontSize,
          fontWeight: 'bold',
          lineHeight: style.lineHeight,
          margin: `0 0 ${style.marginBottom}px`,
          position: 'relative',
        }}
      >
        {isSelected && isFocused && isEmpty && (
          <span
            contentEditable={false}
            suppressContentEditableWarning={true}
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              color: '#999',
              opacity: 0.5,
              pointerEvents: 'none',
            }}
          >
            H{level}
          </span>
        )}
        {children}
      </h1>
    </ElementWrapper>
  );
};
