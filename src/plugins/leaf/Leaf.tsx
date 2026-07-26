import type { RenderLeafProps } from 'slate-react';
import styles from './Leaf.module.less';

export const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  let styledChildren = children;

  if ((leaf as { bold?: boolean }).bold) {
    styledChildren = <strong>{styledChildren}</strong>;
  }

  if ((leaf as { italic?: boolean }).italic) {
    styledChildren = <em>{styledChildren}</em>;
  }

  if ((leaf as { underline?: boolean }).underline) {
    styledChildren = <u>{styledChildren}</u>;
  }

  if ((leaf as { code?: boolean }).code) {
    styledChildren = <code className={styles.code}>{styledChildren}</code>;
  }

  return <span {...attributes}>{styledChildren}</span>;
};
