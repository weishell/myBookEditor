import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Transforms } from 'slate';
import { ReactEditor, useSlateStatic, useSelected } from 'slate-react';
import { ElementWrapper } from '../element-wrapper/ElementWrapper';
import { BlockElementType } from '@/enums';
import ResizeHandle from '../resize-handle/ResizeHandle';
import styles from './Timeline.module.less';
import {
  insertTimelineItemAt,
  normalizeTimelineAttrs,
  removeTimelineItem,
  updateTimelineItem,
  writeTimelineAttrs,
  type TimelineAttrs,
  type TimelineItem,
} from './timeline-node';

interface TimelineProps {
  attributes: any;
  children?: React.ReactNode;
  pluginId: string;
  element: { attrs: TimelineAttrs } & Record<string, any>;
}

// 四色轮换（对齐飞书：蓝 / 绿 / 紫 / 青）
const NODE_COLORS = [
  { card: styles.cardBlue, dot: styles.dotBlue },
  { card: styles.cardGreen, dot: styles.dotGreen },
  { card: styles.cardPurple, dot: styles.dotPurple },
  { card: styles.cardCyan, dot: styles.dotCyan },
] as const;

const DEFAULT_WIDTH = 900;
const DEFAULT_HEIGHT = 300;

/**
 * 可编辑字段（非受控 contentEditable）
 *
 * 关键点：不能把 value 作为 children 渲染，否则每次输入触发重渲染后
 * React 会重写 DOM、光标跳回开头。这里改为「挂载时写入初始值 + 仅在
 * 外部值与 DOM 不一致时才回写」，自身输入引起的更新不会重置 DOM。
 */
interface EditableFieldProps {
  value: string;
  className: string;
  placeholder: string;
  onChange: (value: string) => void;
}

const EditableField: React.FC<EditableFieldProps> = ({
  value,
  className,
  placeholder,
  onChange,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // 自身输入时 DOM 已是最新值，此处相等则跳过，避免重置光标
    if (el.textContent !== value) {
      el.textContent = value;
    }
  }, [value]);

  return (
    <div
      ref={ref}
      className={className}
      data-placeholder={placeholder}
      contentEditable
      suppressContentEditableWarning
      onInput={(e) => {
        const el = e.currentTarget;
        if (!el.textContent) el.innerHTML = '';
        onChangeRef.current(el.textContent || '');
      }}
      onKeyDown={(e) => {
        // 阻止 Slate 接管块内按键（删除/回车不应删除整个时间轴块）
        e.stopPropagation();
      }}
    />
  );
};

/** 悬浮加号按钮（横向连接线段） */
const AddGapH: React.FC<{ onAdd: () => void; wide?: boolean }> = ({ onAdd, wide }) => {
  const [hover, setHover] = useState(false);
  return (
    <div
      className={`${styles.gapH} ${wide ? styles.gapWideH : ''}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {hover && (
        <button
          className={styles.gapAddBtn}
          onClick={onAdd}
          title={wide ? '添加节点' : '在此处插入节点'}
          contentEditable={false}
          onMouseDown={(e) => e.preventDefault()}
        >
          +
        </button>
      )}
    </div>
  );
};

/** 悬浮加号按钮（纵向连接线段） */
const AddGapV: React.FC<{ onAdd: () => void; wide?: boolean }> = ({ onAdd, wide }) => {
  const [hover, setHover] = useState(false);
  return (
    <div
      className={`${styles.gapV} ${wide ? styles.gapWideV : ''}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {hover && (
        <button
          className={styles.gapAddBtn}
          onClick={onAdd}
          title={wide ? '添加节点' : '在此处插入节点'}
          contentEditable={false}
          onMouseDown={(e) => e.preventDefault()}
        >
          +
        </button>
      )}
    </div>
  );
};

// ========== 图标 ==========

const SettingsIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const FullscreenIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
  </svg>
);

const CommentIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const TrashIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

// ========== 主组件 ==========

const Timeline: React.FC<TimelineProps> = ({ attributes, children, pluginId, element }) => {
  const editor = useSlateStatic();
  // normalizeNode 已兜底，这里再兜一层防止异常数据导致渲染崩溃
  const attrs: TimelineAttrs = normalizeTimelineAttrs(element.attrs);
  const isSelected = useSelected();

  const [showToolbar, setShowToolbar] = useState(false);
  const [bounds, setBounds] = useState<DOMRect | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const hideTimerRef = useRef<number | null>(null);
  const settingsRef = useRef<HTMLDivElement>(null);
  const attrsRef = useRef(attrs);
  attrsRef.current = attrs;

  const width = attrs.width || DEFAULT_WIDTH;
  const height = attrs.height || DEFAULT_HEIGHT;
  const items = attrs.items;
  const direction = attrs.direction;
  const sideMode = attrs.sideMode;

  // Bounds 更新
  const updateBounds = useCallback(() => {
    if (containerRef.current) {
      setBounds(containerRef.current.getBoundingClientRect());
    }
  }, []);

  useEffect(() => {
    updateBounds();
    window.addEventListener('resize', updateBounds);
    window.addEventListener('scroll', updateBounds, true);
    return () => {
      window.removeEventListener('resize', updateBounds);
      window.removeEventListener('scroll', updateBounds, true);
    };
  }, [updateBounds]);

  useEffect(() => {
    if (containerRef.current) {
      const observer = new ResizeObserver(() => updateBounds());
      observer.observe(containerRef.current);
      return () => observer.disconnect();
    }
  }, [updateBounds]);

  const getElementPath = useCallback(() => {
    try {
      return ReactEditor.findPath(editor, element as any);
    } catch {
      return null;
    }
  }, [editor, element]);

  const updateAttrs = useCallback(
    (patch: Partial<TimelineAttrs>) => {
      const path = getElementPath();
      if (!path) return;
      writeTimelineAttrs(editor, path, { ...attrsRef.current, ...patch } as TimelineAttrs);
    },
    [editor, getElementPath],
  );

  const handleResize = useCallback(
    (newWidth: number, newHeight: number) => {
      updateAttrs({ width: newWidth, height: newHeight });
    },
    [updateAttrs],
  );

  // 工具栏显隐
  const showToolbarHandler = useCallback(() => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
    setShowToolbar(true);
  }, []);

  const hideToolbarHandler = useCallback(() => {
    if (isSelected) return;
    hideTimerRef.current = window.setTimeout(() => {
      setShowToolbar(false);
      hideTimerRef.current = null;
    }, 300);
  }, [isSelected]);

  // 在指定位置插入节点（悬浮中间连接线 = 中间插入，末尾 = 追加）
  const handleInsertAt = useCallback(
    (index: number) => {
      const path = getElementPath();
      if (!path) return;
      insertTimelineItemAt(editor, path, attrsRef.current, index);
    },
    [editor, getElementPath],
  );

  const handleDeleteItem = useCallback(
    (itemId: string) => {
      const path = getElementPath();
      if (!path) return;
      removeTimelineItem(editor, path, attrsRef.current, itemId);
      if (selectedItemId === itemId) setSelectedItemId(null);
    },
    [editor, getElementPath, selectedItemId],
  );

  const handleItemChange = useCallback(
    (itemId: string, field: 'title' | 'detail' | 'time', value: string) => {
      const path = getElementPath();
      if (!path) return;
      updateTimelineItem(editor, path, attrsRef.current, itemId, field, value);
    },
    [editor, getElementPath],
  );

  const toggleDirection = useCallback(() => {
    updateAttrs({ direction: direction === 'horizontal' ? 'vertical' : 'horizontal' });
  }, [direction, updateAttrs]);

  const toggleSideMode = useCallback(() => {
    updateAttrs({ sideMode: sideMode === 'alternate' ? 'same' : 'alternate' });
  }, [sideMode, updateAttrs]);

  const handleRemove = useCallback(() => {
    const path = getElementPath();
    if (!path) return;
    Transforms.removeNodes(editor, { at: path });
  }, [editor, getElementPath]);

  // 点击外部关闭设置面板
  useEffect(() => {
    if (!showSettings) return;
    const handleClick = (e: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
        setShowSettings(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showSettings]);

  // ===== 卡片 / 时间标签 =====

  const renderCard = (item: TimelineItem, ci: number) => (
    <div
      className={`${styles.card} ${NODE_COLORS[ci].card} ${
        selectedItemId === item.id ? styles.cardSelected : ''
      }`}
      onClick={() => setSelectedItemId(item.id)}
    >
      <EditableField
        className={styles.cardTitle}
        value={item.title}
        placeholder="输入标题"
        onChange={(v) => handleItemChange(item.id, 'title', v)}
      />
      <EditableField
        className={styles.cardDetail}
        value={item.detail}
        placeholder="输入详情"
        onChange={(v) => handleItemChange(item.id, 'detail', v)}
      />
      <button
        className={styles.deleteBtn}
        onClick={(e) => {
          e.stopPropagation();
          handleDeleteItem(item.id);
        }}
        title="删除节点"
        onMouseDown={(e) => e.preventDefault()}
      >
        <TrashIcon />
      </button>
    </div>
  );

  const renderTime = (item: TimelineItem) => (
    <EditableField
      className={styles.timeLabel}
      value={item.time}
      placeholder="输入时间"
      onChange={(v) => handleItemChange(item.id, 'time', v)}
    />
  );

  // ===== 横向节点：grid 三行，卡片与时间分居轴两侧 =====
  const renderNodeH = (item: TimelineItem, index: number) => {
    const ci = index % NODE_COLORS.length;
    // 卡片在上半区（同侧恒为上；交替按奇偶）
    const cardOnTop = sideMode === 'same' ? true : index % 2 === 0;
    return (
      <div className={styles.nodeH}>
        <div className={styles.halfTop}>{cardOnTop ? renderCard(item, ci) : renderTime(item)}</div>
        <div className={styles.dotRow}>
          <span className={`${styles.dot} ${NODE_COLORS[ci].dot}`} />
        </div>
        <div className={styles.halfBottom}>
          {cardOnTop ? renderTime(item) : renderCard(item, ci)}
        </div>
      </div>
    );
  };

  // ===== 纵向节点：grid 三列，卡片与时间分居轴两侧 =====
  const renderNodeV = (item: TimelineItem, index: number) => {
    const ci = index % NODE_COLORS.length;
    const cardOnLeft = sideMode === 'same' ? true : index % 2 === 0;
    return (
      <div className={styles.nodeV}>
        <div className={styles.colLeft}>{cardOnLeft ? renderCard(item, ci) : renderTime(item)}</div>
        <div className={styles.dotCol}>
          <span className={`${styles.dot} ${NODE_COLORS[ci].dot}`} />
        </div>
        <div className={styles.colRight}>
          {cardOnLeft ? renderTime(item) : renderCard(item, ci)}
        </div>
      </div>
    );
  };

  const renderHorizontal = () => (
    <div className={styles.canvasH}>
      <div className={styles.trackH}>
        {items.map((item, index) => (
          <React.Fragment key={item.id}>
            {renderNodeH(item, index)}
            {/* 节点之间的连接线段：默认显示圆点虚线（动态：有节点就有、无节点就无），
                悬浮时变蓝色高亮 + 出现 + 按钮。中间段 = 中间插入；末尾宽段 = 追加 */}
            <AddGapH onAdd={() => handleInsertAt(index + 1)} wide={index === items.length - 1} />
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  const renderVertical = () => (
    <div className={styles.canvasV}>
      <div className={styles.trackV}>
        {items.map((item, index) => (
          <React.Fragment key={item.id}>
            {renderNodeV(item, index)}
            <AddGapV onAdd={() => handleInsertAt(index + 1)} wide={index === items.length - 1} />
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  return (
    <ElementWrapper type={BlockElementType.TIMELINE} pluginId={pluginId} attributes={attributes}>
      <div
        ref={wrapperRef}
        className={styles.wrapper}
        onMouseEnter={showToolbarHandler}
        onMouseLeave={hideToolbarHandler}
      >
        {/* 编辑器级悬浮工具栏 */}
        {showToolbar && !isSelected && (
          <div
            className={styles.toolbar}
            onMouseEnter={showToolbarHandler}
            onMouseLeave={hideToolbarHandler}
          >
            <button onClick={handleRemove} className={styles.toolbarButton} title="删除">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#666"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            </button>
          </div>
        )}

        {/* 外层 frame = 定位容器；topRightBar 在这里 absolute，不受内部滚动影响 */}
        <div className={styles.frame} style={{ width, height }}>
          {/* 右上角操作栏（不滚动） */}
          <div className={styles.topRightBar}>
            <button className={styles.commentBtn} title="组件内评论">
              <CommentIcon />
              <span className={styles.commentText}>组件内评论</span>
            </button>
            <button className={styles.iconBtn} title="全屏">
              <FullscreenIcon />
            </button>
            <button
              className={styles.iconBtn}
              title="设置"
              onClick={() => setShowSettings(!showSettings)}
            >
              <SettingsIcon />
            </button>
          </div>

          {/* 设置面板（不滚动） */}
          {showSettings && (
            <div ref={settingsRef} className={styles.settingsPanel}>
              <div className={styles.settingsItem} onClick={toggleSideMode}>
                <span className={styles.settingsLabel}>交替</span>
                {sideMode === 'alternate' && <span className={styles.checkIcon}>✓</span>}
              </div>
              <div className={styles.settingsItem} onClick={toggleSideMode}>
                <span className={styles.settingsLabel}>同侧</span>
                {sideMode === 'same' && <span className={styles.checkIcon}>✓</span>}
              </div>
              <div className={styles.settingsDivider} />
              <div className={styles.settingsItem} onClick={toggleDirection}>
                <span className={styles.settingsLabel}>水平排列</span>
                {direction === 'horizontal' && <span className={styles.checkIcon}>✓</span>}
              </div>
              <div className={styles.settingsItem} onClick={toggleDirection}>
                <span className={styles.settingsLabel}>垂直排列</span>
                {direction === 'vertical' && <span className={styles.checkIcon}>✓</span>}
              </div>
            </div>
          )}

          {/* 滚动容器：内容超出时出现滚动条 */}
          <div
            ref={containerRef}
            className={`${styles.container} ${isSelected ? styles.containerSelected : ''}`}
            contentEditable={false}
            suppressContentEditableWarning={true}
          >
            {/* 时间轴内容 */}
            {direction === 'horizontal' ? renderHorizontal() : renderVertical()}
          </div>
        </div>

        {/* 缩放手柄 */}
        {(isSelected || showToolbar) && bounds && (
          <ResizeHandle
            bounds={bounds}
            onResize={handleResize}
            // ResizeHandle 内部按 newWidth / aspectRatio 推导高度，
            // 必须传真实比例（传 0 会得到 Infinity，导致高度被 normalize 打回默认值）
            aspectRatio={bounds.height > 0 ? bounds.width / bounds.height : 1}
            initialWidth={bounds.width}
            initialHeight={bounds.height}
          />
        )}
      </div>

      {children}
    </ElementWrapper>
  );
};

export default Timeline;
