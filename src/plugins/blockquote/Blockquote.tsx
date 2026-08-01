import { BlockElementType } from '@/enums';
import { ElementWrapper } from '@/plugins/element-wrapper';
import styles from './Blockquote.module.less';

interface ElementProps {
  attributes: Record<string, unknown>;
  children: React.ReactNode;
  pluginId?: string;
  element?: any;
}

export const Blockquote = ({ attributes, children, pluginId, element }: ElementProps) => (
  <ElementWrapper type={BlockElementType.BLOCKQUOTE} pluginId={pluginId} attrs={element?.attrs}>
    <blockquote
      {...(attributes as React.HTMLAttributes<HTMLQuoteElement>)}
      className={styles.blockquote}
    >
      {children}
    </blockquote>
  </ElementWrapper>
);
