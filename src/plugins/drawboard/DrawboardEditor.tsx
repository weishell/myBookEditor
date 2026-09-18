// 画板（drawui）全屏编辑器 - 全屏即编辑态
import React, { useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { CanvasBoard } from 'drawui-react';
import type { Editor, Shape, EditorData } from 'drawui-core';
import 'drawui-react/styles.css';
import styles from './Drawboard.module.less';

interface DrawboardEditorProps {
  /** 当前画板的初始图形数据（来自文档节点 attrs.data），用于回显已有图形 */
  initialData?: Shape[];
  /** 图形变化实时回调：用于文档内缩略图回显，以及关闭时落盘 */
  onDataChange: (shapes: Shape[]) => void;
  /** 关闭前对主画布整幅截图（PNG dataURL）：缩略图直接回显编辑器当前视图 */
  onSnapshot?: (dataUrl: string) => void;
  onClose: () => void;
}

const DrawboardEditor: React.FC<DrawboardEditorProps> = ({
  initialData,
  onDataChange,
  onSnapshot,
  onClose,
}) => {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const onDataChangeRef = useRef(onDataChange);
  onDataChangeRef.current = onDataChange;
  const onSnapshotRef = useRef(onSnapshot);
  onSnapshotRef.current = onSnapshot;
  const editorRef = useRef<Editor | null>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  const doClose = useCallback(() => {
    // 关闭时取编辑器内最终数据，确保最后一笔也写回宿主（onChange 可能漏掉最后一次）
    const ed = editorRef.current;
    if (ed) {
      try {
        onDataChangeRef.current(ed.getData().shapes);
      } catch {
        /* ignore */
      }
    }
    // 主画布整幅截图：取门户内面积最大的 canvas（小地图等辅助 canvas 面积小），
    // 缩略图直接回显该截图，与编辑器所见完全一致
    const body = bodyRef.current;
    if (body) {
      let main: HTMLCanvasElement | null = null;
      let maxArea = 0;
      for (const c of Array.from(body.querySelectorAll('canvas'))) {
        const area = c.width * c.height;
        if (area > maxArea) {
          maxArea = area;
          main = c;
        }
      }
      if (main && main.width > 0) {
        try {
          onSnapshotRef.current?.(main.toDataURL('image/png'));
        } catch {
          /* 截图失败不影响关闭与数据落盘 */
        }
      }
    }
    onCloseRef.current();
  }, []);

  // Esc 退出全屏
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        doClose();
      }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [doClose]);

  return createPortal(
    <div className={styles.fullscreen}>
      <div className={styles.header}>
        <span className={styles.headerTitle}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="8" y="14" width="9" height="7" rx="1" />
            <line x1="6.5" y1="10" x2="6.5" y2="14" />
            <line x1="17.5" y1="10" x2="17.5" y2="14" />
          </svg>
          画板
        </span>
        <span className={styles.headerHint}>Esc 退出编辑</span>
        <button className={styles.headerClose} onClick={doClose} title="退出 (Esc)">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
      <div className={styles.body} ref={bodyRef}>
        {/* data 始终传入（空数组也传），触发 drawui 以外部数据初始化并关闭 localStorage 持久化 */}
        <CanvasBoard
          data={initialData ?? []}
          themeColor="#3b82f6"
          language="zh-CN"
          onChange={(d: EditorData) => onDataChangeRef.current(d.shapes)}
          onReady={(editor: Editor) => {
            editorRef.current = editor;
          }}
        />
      </div>
    </div>,
    document.body,
  );
};

export default DrawboardEditor;
