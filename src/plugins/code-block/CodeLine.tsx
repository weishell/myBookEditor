import type { CustomElement } from '@/components/Editor/types';
import styles from './CodeLine.module.less';

interface CodeLineProps {
  attributes: Record<string, unknown>;
  children: React.ReactNode;
  element?: CustomElement;
}

export const CodeLine = ({ attributes, children, element }: CodeLineProps) => {
  const lineNumber = element?.attrs?.lineNumber as number | undefined;

  return (
    <div {...attributes} className={styles.codeLine}>
      <span
        className={styles.lineNumber}
        contentEditable={false}
        suppressContentEditableWarning={true}
      >
        {lineNumber}
      </span>
      <span className={styles.codeContent}>{children}</span>
    </div>
  );
};
