import { useState, useEffect, useCallback } from 'react';
import { useSlateStatic } from 'slate-react';
import { Transforms, Element } from 'slate';
import { useTranslation } from 'react-i18next';
import { BlockElementType, HintBlockType } from '@/enums';
import { HINT_BLOCK_ICONS, HINT_BLOCK_COLORS } from './icons';

interface HintBlockStatusSelectorProps {
  pluginId: string;
  currentType: HintBlockType;
  onClose?: () => void;
}

const TYPE_VALUES: HintBlockType[] = [
  HintBlockType.INFO,
  HintBlockType.NOTE,
  HintBlockType.WARNING,
  HintBlockType.TIP,
];

export function HintBlockStatusSelector({
  pluginId,
  currentType,
  onClose,
}: HintBlockStatusSelectorProps) {
  const editor = useSlateStatic();
  const { t } = useTranslation();
  const [rect, setRect] = useState<DOMRect | null>(null);

  const measure = useCallback(() => {
    const el = document.querySelector(`[data-plugin-id="${pluginId}"]`) as HTMLElement;
    if (el) {
      setRect(el.getBoundingClientRect());
    }
  }, [pluginId]);

  useEffect(() => {
    measure();
    // 面板使用视口坐标（fixed），滚动/缩放时跟随更新
    window.addEventListener('scroll', measure, true);
    window.addEventListener('resize', measure);
    return () => {
      window.removeEventListener('scroll', measure, true);
      window.removeEventListener('resize', measure);
    };
  }, [measure]);

  const handleChangeType = (type: HintBlockType) => {
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
        const nodeId = (node as any).id;
        if (nodeId === pluginId) {
          const currentAttrs = (node as any).attrs || {};
          // 保留 label 如果用户自定义过，否则用新类型的默认标签（跟随当前语言）
          const newLabel = currentAttrs.label || t(`hintBlock.labels.${type}`);
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
    onClose?.();
  };

  if (!rect) return null;

  return (
    <div
      contentEditable={false}
      style={{
        position: 'fixed',
        top: rect.top + 2,
        left: rect.left + 44,
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
      onMouseLeave={() => onClose?.()}
    >
      {TYPE_VALUES.map((value) => {
        const Icon = HINT_BLOCK_ICONS[value];
        const isActive = currentType === value;
        const color = HINT_BLOCK_COLORS[value];
        return (
          <button
            key={value}
            type="button"
            title={t(`hintBlock.labels.${value}`)}
            onMouseDown={(e) => e.preventDefault()}
            onClick={(e) => {
              e.stopPropagation();
              handleChangeType(value);
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
