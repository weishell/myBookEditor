import React from 'react';
import { BlockElementType } from '@/enums';
import { ElementWrapper } from '@/plugins/element-wrapper';
import styles from './Paragraph.module.less';

interface ElementProps {
  attributes: Record<string, unknown>;
  children: React.ReactNode;
  pluginId?: string;
  element?: any;
}

export const Paragraph = ({ attributes, children, pluginId, element }: ElementProps) => {
  const isEmpty = element?.children?.[0]?.text === '' || element?.children?.[0]?.text === undefined;

  return (
    <ElementWrapper
      type={BlockElementType.PARAGRAPH}
      pluginId={pluginId}
      attrs={element?.attrs}
      isEmpty={isEmpty}
    >
      <p
        {...(attributes as React.HTMLAttributes<HTMLParagraphElement>)}
        className={styles.paragraph}
      >
        {children}
      </p>
    </ElementWrapper>
  );
};
