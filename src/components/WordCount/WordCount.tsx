// 正文字数气泡
//
// 挂在「回到顶部」按钮下方，只在有文档编辑器挂载时出现；
// 是否显示由设置页的开关控制（默认显示），关闭后完全隐藏。
import { useEditorMode } from '@/context/EditorContext';
import { useWordCount, useWordCountEnabled } from './store';
import styles from './WordCount.module.less';

export function WordCount() {
  const { editor } = useEditorMode();
  const count = useWordCount();
  const enabled = useWordCountEnabled();

  if (!enabled || !editor) return null;

  return (
    <div
      className={styles.pill}
      title="仅统计段落、标题、列表、代码块、提示块、引用块中的文字"
      aria-live="polite"
    >
      <span className={styles.value}>{count.toLocaleString('zh-CN')}</span>
      <span className={styles.unit}>字</span>
    </div>
  );
}
