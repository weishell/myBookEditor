import { useState, useEffect } from 'react';
import { useSlateStatic } from 'slate-react';
import { Transforms, Element } from 'slate';
import { BlockElementType, BlockquoteType } from '@/enums';
import { BLOCKQUOTE_ICONS, BLOCKQUOTE_LABELS, BLOCKQUOTE_COLORS } from './icons';

interface BlockquoteStatusSelectorProps {
  pluginId: string;
  currentType: BlockquoteType;
}

const TYPE_OPTIONS: { value: BlockquoteType; label: string }[] = [
  { value: BlockquoteType.INFO, label: BLOCKQUOTE_LABELS[BlockquoteType.INFO] },
  { value: BlockquoteType.NOTE, label: BLOCKQUOTE_LABELS[BlockquoteType.NOTE] },
  { value: BlockquoteType.WARNING, label: BLOCKQUOTE_LABELS[BlockquoteType.WARNING] },
  { value: BlockquoteType.TIP, label: BLOCKQUOTE_LABELS[BlockquoteType.TIP] },
];

export function BlockquoteStatusSelector({ pluginId, currentType }: BlockquoteStatusSelectorProps) {
  const editor = useSlateStatic();
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const el = document.querySelector(`[data-plugin-id="${pluginId}"]`) as HTMLElement;
    if (el) {
      setRect(el.getBoundingClientRect());
    }
  }, [pluginId]);

  const handleChangeType = (type: BlockquoteType) => {
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
        const nodeId = (node as any).id;
        if (nodeId === pluginId) {
          const currentAttrs = (node as any).attrs || {};
          // 保留 label 如果用户自定义过，否则用新类型的默认标签
          const newLabel = currentAttrs.label || BLOCKQUOTE_LABELS[type];
          Transforms.setNodes(
            editor,
            { attrs: { ...currentAttrs, type, label: newLabel } } as any,
            { at: path },
          );
          break;
        }
      }
    } catch {
      /* ignore */
    }
  };

  if (!rect) return null;

  return (
    <div
      contentEditable={false}
      style={{
        position: 'fixed',
        top: rect.top - 40 + window.scrollY,
        right: window.innerWidth - rect.right + 12,
        zIndex: 10001,
        display: 'flex',
        gap: 4,
        padding: '4px 6px',
        background: '#fff',
        border: '1px solid #e8e8e8',
        borderRadius: 8,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      }}
      onMouseDown={(e) => e.preventDefault()}
    >
      {TYPE_OPTIONS.map((opt) => {
        const Icon = BLOCKQUOTE_ICONS[opt.value];
        const isActive = currentType === opt.value;
        const color = BLOCKQUOTE_COLORS[opt.value];
        return (
          <button
            key={opt.value}
            type="button"
            title={opt.label}
            onMouseDown={(e) => e.preventDefault()}
            onClick={(e) => {
              e.stopPropagation();
              handleChangeType(opt.value);
            }}
            style={{
              width: 28,
              height: 28,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: isActive ? `2px solid ${color}` : '1px solid #e8e8e8',
              borderRadius: 6,
              background: isActive ? `${color}15` : '#fff',
              cursor: 'pointer',
              fontSize: 14,
              padding: 0,
              transition: 'all 0.15s',
              color: isActive ? color : '#666',
            }}
          >
            <Icon size={16} />
          </button>
        );
      })}
    </div>
  );
}
