import React from 'react';
import { BlockElementType } from '@/enums';
import { ElementWrapper } from '@/plugins/element-wrapper';

interface ElementProps {
  attributes: Record<string, unknown>;
  children: React.ReactNode;
  pluginId?: string;
  element?: any;
}

export const Paragraph = ({ attributes, children, pluginId, element }: ElementProps) => {
  const isEmpty = element?.children?.[0]?.text === '' || element?.children?.[0]?.text === undefined;

  return (
    <ElementWrapper type={BlockElementType.PARAGRAPH} pluginId={pluginId} isEmpty={isEmpty}>
      <p
        {...(attributes as React.HTMLAttributes<HTMLParagraphElement>)}
        style={{ margin: '8px 0', lineHeight: '1.8' }}
      >
        {children}
      </p>
    </ElementWrapper>
  );
};
