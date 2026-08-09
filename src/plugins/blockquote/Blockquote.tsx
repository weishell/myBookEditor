import { useState, useRef, useCallback } from 'react';
import { useSlateStatic } from 'slate-react';
import { Transforms, Element } from 'slate';
import { BlockElementType, BlockquoteType } from '@/enums';
import { ElementWrapper } from '@/plugins/element-wrapper';
import { BlockquoteStatusSelector } from './BlockquoteStatusSelector';
import { BLOCKQUOTE_ICONS, BLOCKQUOTE_LABELS } from './icons';
import styles from './Blockquote.module.less';

interface ElementProps {
  attributes: Record<string, unknown>;
  children: React.ReactNode;
  pluginId?: string;
  element?: any;
}

export const Blockquote = ({ attributes, children, pluginId, element }: ElementProps) => {
  const editor = useSlateStatic();

  // 类型解析：新数据直接用 type 字段；旧数据用 status 字段做兼容映射
  const rawType = element?.attrs?.type as string | undefined;
  const rawStatus = element?.attrs?.status as string | undefined;

  let type: BlockquoteType;
  if (rawType && Object.values(BlockquoteType).includes(rawType as BlockquoteType)) {
    // 新格式：直接取 type 字段
    type = rawType as BlockquoteType;
  } else if (rawStatus) {
    // 旧格式兼容映射
    type =
      rawStatus === 'danger'
        ? BlockquoteType.WARNING
        : rawStatus === 'success'
          ? BlockquoteType.TIP
          : rawStatus === 'warning'
            ? BlockquoteType.NOTE
            : rawStatus === 'normal'
              ? BlockquoteType.INFO
              : BlockquoteType.INFO;
  } else {
    type = BlockquoteType.INFO;
  }

  // 标签：优先用 attrs.label，否则按类型默认
  const label: string = element?.attrs?.label || BLOCKQUOTE_LABELS[type] || '说明';

  const [hovered, setHovered] = useState(false);
  const [editingLabel, setEditingLabel] = useState(false);
  const [editValue, setEditValue] = useState(label);
  const inputRef = useRef<HTMLInputElement>(null);

  const saveLabel = useCallback(() => {
    const newLabel = editValue.trim();
    if (!newLabel || !pluginId) {
      setEditingLabel(false);
      return;
    }
    try {
      const raw = (editor as any).nodes({
        at: [],
        match: (n: any) => Element.isElement(n) && (n as any).type === BlockElementType.BLOCKQUOTE,
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
    type === BlockquoteType.INFO
      ? styles.typeInfo
      : type === BlockquoteType.NOTE
        ? styles.typeNote
        : type === BlockquoteType.WARNING
          ? styles.typeWarning
          : styles.typeTip;

  const Icon = BLOCKQUOTE_ICONS[type] || BLOCKQUOTE_ICONS[BlockquoteType.INFO];

  return (
    <ElementWrapper type={BlockElementType.BLOCKQUOTE} pluginId={pluginId} attrs={element?.attrs}>
      <blockquote
        {...(attributes as React.HTMLAttributes<HTMLQuoteElement>)}
        className={`${styles.blockquote} ${typeClass}`}
        data-type={type}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className={styles.header}>
          <span className={styles.typeIcon} aria-hidden>
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
      {hovered && pluginId && <BlockquoteStatusSelector pluginId={pluginId} currentType={type} />}
    </ElementWrapper>
  );
};
