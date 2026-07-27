import styles from './ModeSwitcher.module.less';

export type EditorMode = 'edit' | 'read';

interface ModeSwitcherProps {
  mode: EditorMode;
  onChange: (mode: EditorMode) => void;
}

export default function ModeSwitcher({ mode, onChange }: ModeSwitcherProps) {
  const toggleMode = () => {
    onChange(mode === 'edit' ? 'read' : 'edit');
  };

  return (
    <button
      className={styles.button}
      onClick={toggleMode}
      title={mode === 'edit' ? '切换到阅读模式' : '切换到编辑模式'}
    >
      <span className={styles.icon}>{mode === 'edit' ? '✏️' : '📖'}</span>
      <span className={styles.text}>{mode === 'edit' ? '阅读' : '编辑'}</span>
    </button>
  );
}
