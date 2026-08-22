import { useMemo } from 'react';
import { useSelected } from 'slate-react';
import type { MentionElement as MentionElementT } from './mention-utils';
import styles from './Mention.module.less';

interface MentionProps {
  attributes: Record<string, any>;
  element: MentionElementT;
  readOnly?: boolean;
}

export const Mention = ({ attributes, element }: MentionProps) => {
  const selected = useSelected();
  const { name, kind } = element.attrs;

  const icon = useMemo(() => {
    if (kind === 'category') return '📁';
    return '📄';
  }, [kind]);

  return (
    <span
      {...attributes}
      className={`${styles.mention} ${selected ? styles.selected : ''}`}
      contentEditable={false}
      data-mention
      data-mention-id={element.id}
    >
      <span className={styles.icon}>{icon}</span>
      <span>@{name}</span>
    </span>
  );
};
