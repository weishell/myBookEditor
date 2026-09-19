import { useState, useRef, useCallback, useEffect } from 'react';
import { useSlateStatic } from 'slate-react';
import { Transforms, Element } from 'slate';
import { BlockElementType, HintBlockType } from '@/enums';
import { ElementWrapper } from '@/plugins/element-wrapper';
import { HintBlockStatusSelector } from './HintBlockStatusSelector';
import { HINT_BLOCK_ICONS, HINT_BLOCK_LABELS } from './icons';
import styles from './HintBlock.module.less';

interface ElementProps {
  attributes: Record<string, unknown>;
  children: React.ReactNode;
  pluginId?: string;
  element?: any;
}

export const HintBlock = ({ attributes, children, pluginId, element }: ElementProps) => {
  const editor = useSlateStatic();

  // 类型解析：新数据直接用 type 字段；旧数据用 status 字段做兼容映射
  const rawType = element?.attrs?.type as string | undefined;
  const rawStatus = element?.attrs?.status as string | undefined;

  let type: HintBlockType;
  if (rawType && Object.values(HintBlockType).includes(rawType as HintBlockType)) {
    // 新格式：直接取 type 字段
    type = rawType as HintBlockType;
  } else if (rawStatus) {
    // 旧格式兼容映射
    type =
      rawStatus === 'danger'
        ? HintBlockType.WARNING
        : rawStatus === 'success'
          ? HintBlockType.TIP
          : rawStatus === 'warning'
            ? HintBlockType.NOTE
            : rawStatus === 'normal'
              ? HintBlockType.INFO
              : HintBlockType.INFO;
  } else {
    type = HintBlockType.INFO;
  }

  // 标签：优先用 attrs.label，否则按类型默认
  const label: string = element?.attrs?.label || HINT_BLOCK_LABELS[type] || '说明';

  const [editingLabel, setEditingLabel] = useState(false);
  const [editValue, setEditValue] = useState(label);
  // 类型切换面板：悬浮在类型图标上停留 1s 后展示
  const [showSelector, setShowSelector] = useState(false);
  const hoverTimerRef = useRef<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const clearHoverTimer = useCallback(() => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
  }, []);

  useEffect(() => clearHoverTimer, [clearHoverTimer]);

  const handleIconMouseEnter = useCallback(() => {
    clearHoverTimer();
    hoverTimerRef.current = window.setTimeout(() => {
      setShowSelector(true);
      hoverTimerRef.current = null;
    }, 1000);
  }, [clearHoverTimer]);

  const handleIconMouseLeave = useCallback(() => {
    // 只取消未触发的定时器，已展示的面板由面板自身 hover 维持
    clearHoverTimer();
  }, [clearHoverTimer]);

  const handleSelectorClose = useCallback(() => {
    setShowSelector(false);
  }, []);

  const saveLabel = useCallback(() => {
    const newLabel = editValue.trim();
    if (!newLabel || !pluginId) {
      setEditingLabel(false);
      return;
    }
    try {
      const raw = (editor as any).nodes({
        at: [],
        match: (n: any) => Element.isElement(n) && (n as any).type === BlockElementType.HINT_BLOCK,
      });
      const entries = Array.isArray(raw)
        ? (raw as Array<[any, number[]]>)
        : raw != null && typeof raw[Symbol.iterator] === 'function'
          ? Array.from(raw as Iterable<[any, number[]]>)
          : [];
      for (const [node, path] of entries) {
        if ((node as any).id === pluginId) {
          const currentAttrs = (node as any).attrs || {};
          Transforms.setNodes(editor, { attrs: { ...currentAttrs, label: newLabel } } as any, {
            at: path,
          });
          break;
        }
      }
    } catch {
      /* ignore */
    }
    setEditingLabel(false);
  }, [editValue, editor, pluginId]);

  const handleLabelClick = () => {
    setEditValue(label);
    setEditingLabel(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveLabel();
    } else if (e.key === 'Escape') {
      setEditingLabel(false);
    }
  };

  const typeClass =
    type === HintBlockType.INFO
      ? styles.typeInfo
      : type === HintBlockType.NOTE
        ? styles.typeNote
        : type === HintBlockType.WARNING
          ? styles.typeWarning
          : styles.typeTip;

  const Icon = HINT_BLOCK_ICONS[type] || HINT_BLOCK_ICONS[HintBlockType.INFO];

  return (
    <ElementWrapper type={BlockElementType.HINT_BLOCK} pluginId={pluginId} attrs={element?.attrs}>
      <blockquote
        {...(attributes as React.HTMLAttributes<HTMLQuoteElement>)}
        className={`${styles.hintBlock} ${typeClass}`}
        data-type={type}
      >
        <div
          className={styles.header}
          contentEditable={false}
          onMouseDown={(e) => e.preventDefault()}
        >
          <span
            className={styles.typeIcon}
            aria-hidden
            onMouseEnter={handleIconMouseEnter}
            onMouseLeave={handleIconMouseLeave}
          >
            <Icon size={18} />
          </span>
          {editingLabel ? (
            <input
              ref={inputRef}
              className={styles.labelInput}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={saveLabel}
              onKeyDown={handleKeyDown}
              onMouseDown={(e) => e.stopPropagation()}
              contentEditable={false}
            />
          ) : (
            <span className={styles.typeLabel} onClick={handleLabelClick} title="点击编辑标签">
              {label}
            </span>
          )}
        </div>
        <div className={styles.content}>{children}</div>
      </blockquote>
      {pluginId && showSelector && (
        <HintBlockStatusSelector
          pluginId={pluginId}
          currentType={type}
          onClose={handleSelectorClose}
        />
      )}
    </ElementWrapper>
  );
};
