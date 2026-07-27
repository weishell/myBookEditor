import styles from './CodeLine.module.less';

interface CodeLineProps {
  attributes: Record<string, unknown>;
  children: React.ReactNode;
}

export const CodeLine = ({ attributes, children }: CodeLineProps) => {
  return (
    <div {...attributes} className={styles.codeLine}>
      <span
        className={styles.lineNumber}
        contentEditable={false}
        suppressContentEditableWarning={true}
      />
      <span className={styles.codeContent}>{children}</span>
    </div>
  );
};
