// 画板（drawui）全屏层：编辑模式下是 CanvasBoard 编辑器；阅读模式下是只读预览
import React, { useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { CanvasBoard } from 'drawui-react';
import type { Editor, Shape, EditorData } from 'drawui-core';
import { useTranslation } from 'react-i18next';
import { lockPageScroll } from '@/utils/scroll-lock';
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
  /**
   * 只读：阅读模式下仍挂载 CanvasBoard，但以 permission="read" 打开。
   * 画布可平移缩放看细节，不能选中/拖动/编辑，也不会出现「编辑」切换入口。
   */
  readOnly?: boolean;
}

const DrawboardEditor: React.FC<DrawboardEditorProps> = ({
  initialData,
  onDataChange,
  onSnapshot,
  onClose,
  readOnly = false,
}) => {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const onDataChangeRef = useRef(onDataChange);
  onDataChangeRef.current = onDataChange;
  const onSnapshotRef = useRef(onSnapshot);
  onSnapshotRef.current = onSnapshot;
  const editorRef = useRef<Editor | null>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const { t, i18n } = useTranslation();
  // 与外部语言联动：项目内 'zh'/'en' → drawui 的 BCP-47 标签
  const drawuiLanguage = i18n.language === 'en' ? 'en-US' : 'zh-CN';
  // 外部权限：阅读态只读，编辑态可编辑（可在画板内自行切换编辑/阅读）
  const permission = readOnly ? 'read' : 'edit';

  const doClose = useCallback(() => {
    // 只读打开时没有内容改动：既不回写数据（避免把平移/缩放当成内容变更），也不截图
    if (readOnly) {
      onCloseRef.current();
      return;
    }
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
    // 缩略图直接回显该截图，与编辑器所见完全一致；没有订阅者时不编码 PNG
    const body = bodyRef.current;
    if (body && onSnapshotRef.current) {
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
  }, [readOnly]);

  // 全屏期间锁住页面滚动，隐藏背景页的滚动条，避免误拖
  useEffect(() => lockPageScroll(), []);

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

  const header = (
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
        {t('drawboard.title')}
      </span>
      <span className={styles.headerHint}>
        {readOnly ? t('drawboard.readOnlyHint') : t('drawboard.escToExit')}
      </span>
      <button className={styles.headerClose} onClick={doClose} title={t('drawboard.exitTitle')}>
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
  );

  // 阅读态与编辑态共用同一个画布：只读时由 permission="read" 锁住编辑能力，
  // 仍可平移/缩放查看细节，不再退化成一张静态图片。
  return createPortal(
    <div className={styles.fullscreen}>
      {header}
      <div className={styles.body} ref={bodyRef}>
        {/* data 始终传入（空数组也传），触发 drawui 以外部数据初始化并关闭 localStorage 持久化 */}
        {/* key：权限在打开期间被提升（阅读文档切到编辑）时重新挂载，让内部模式回到编辑 */}
        <CanvasBoard
          key={readOnly ? 'read' : 'edit'}
          data={initialData ?? []}
          themeColor="#3b82f6"
          language={drawuiLanguage}
          permission={permission}
          showModeSwitch={!readOnly}
          onChange={(d: EditorData) => {
            // 阅读态下平移/缩放也会触发 onChange，不能当成内容变更回写文档
            if (readOnly || editorRef.current?.canEdit() === false) return;
            onDataChangeRef.current(d.shapes);
          }}
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
