import { useState } from 'react';
import { BlockElementType } from '@/enums';
import { ElementWrapper } from '@/plugins/element-wrapper';
import { BlockquoteStatusSelector } from './BlockquoteStatusSelector';
import styles from './Blockquote.module.less';

export type BlockquoteStatus = 'normal' | 'danger' | 'warning' | 'success';

interface ElementProps {
  attributes: Record<string, unknown>;
  children: React.ReactNode;
  pluginId?: string;
  element?: any;
}

export const Blockquote = ({ attributes, children, pluginId, element }: ElementProps) => {
  const status: BlockquoteStatus = element?.attrs?.status || 'normal';
  const [hovered, setHovered] = useState(false);
  const statusClass =
    status === 'normal'
      ? styles.statusNormal
      : status === 'danger'
        ? styles.statusDanger
        : status === 'warning'
          ? styles.statusWarning
          : styles.statusSuccess;

  return (
    <ElementWrapper type={BlockElementType.BLOCKQUOTE} pluginId={pluginId} attrs={element?.attrs}>
      <blockquote
        {...(attributes as React.HTMLAttributes<HTMLQuoteElement>)}
        className={`${styles.blockquote} ${statusClass}`}
        data-status={status}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <span className={styles.statusIcon} aria-hidden>
          {status === 'danger' && '⛔'}
          {status === 'warning' && '⚠️'}
          {status === 'success' && '✅'}
          {status === 'normal' && '💡'}
        </span>
        <div className={styles.content}>{children}</div>
      </blockquote>
      {hovered && pluginId && (
        <BlockquoteStatusSelector pluginId={pluginId} currentStatus={status} />
      )}
    </ElementWrapper>
  );
};
