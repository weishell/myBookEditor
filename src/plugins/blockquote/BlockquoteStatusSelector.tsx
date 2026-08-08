import { useState, useEffect } from 'react';
import { useSlateStatic } from 'slate-react';
import { Transforms, Element } from 'slate';
import { BlockElementType } from '@/enums';
import type { BlockquoteStatus } from './Blockquote';

interface BlockquoteStatusSelectorProps {
  pluginId: string;
  currentStatus: BlockquoteStatus;
}

const STATUS_OPTIONS: { value: BlockquoteStatus; label: string; icon: string; color: string }[] = [
  { value: 'normal', label: '主题', icon: '💡', color: '#1890ff' },
  { value: 'warning', label: '警告', icon: '⚠️', color: '#faad14' },
  { value: 'danger', label: '危险', icon: '⛔', color: '#ff4d4f' },
  { value: 'success', label: '成功', icon: '✅', color: '#52c41a' },
];

export function BlockquoteStatusSelector({
  pluginId,
  currentStatus,
}: BlockquoteStatusSelectorProps) {
  const editor = useSlateStatic();
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const el = document.querySelector(`[data-plugin-id="${pluginId}"]`) as HTMLElement;
    if (el) {
      setRect(el.getBoundingClientRect());
    }
  }, [pluginId]);

  const handleChangeStatus = (status: BlockquoteStatus) => {
    try {
      // (editor as any).nodes() 返回 Generator<[Node, Path]>，TS strict 下经 Array.from 会推断成 unknown[]。
      // 先收窄成数组，再显式声明元素类型为 [Node, Path] 元组，才能在 for..of 里解构。
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
          Transforms.setNodes(editor, { attrs: { ...currentAttrs, status } } as any, { at: path });
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
        top: rect.top - 36 + window.scrollY,
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
      {STATUS_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          title={opt.label}
          onMouseDown={(e) => e.preventDefault()}
          onClick={(e) => {
            e.stopPropagation();
            handleChangeStatus(opt.value);
          }}
          style={{
            width: 26,
            height: 26,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: currentStatus === opt.value ? `2px solid ${opt.color}` : '1px solid #e8e8e8',
            borderRadius: 6,
            background: currentStatus === opt.value ? `${opt.color}15` : '#fff',
            cursor: 'pointer',
            fontSize: 14,
            padding: 0,
            transition: 'all 0.15s',
          }}
        >
          {opt.icon}
        </button>
      ))}
    </div>
  );
}
