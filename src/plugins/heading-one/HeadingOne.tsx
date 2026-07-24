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

export const HeadingOne = ({ attributes, children, pluginId, element }: ElementProps) => {
  const isSelected = useSelected();
  const isFocused = useFocused();

  // 判断标题内容是否为空
  const isEmpty = element?.children?.[0]?.text === '' || element?.children?.[0]?.text === undefined;

  return (
    <ElementWrapper type={BlockElementType.HEADING_ONE} pluginId={pluginId}>
      <h1
        {...(attributes as React.HTMLAttributes<HTMLHeadingElement>)}
        style={{ fontSize: '24px', fontWeight: 'bold', margin: '16px 0 8px', position: 'relative' }}
      >
        {/* 占位符：绝对定位覆盖在标题开头 */}
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
            H1
          </span>
        )}
        {children}
      </h1>
    </ElementWrapper>
  );
};
