import React, { useState, useEffect, useRef } from 'react';
import { Transforms } from 'slate';
import { useSlateStatic, ReactEditor } from 'slate-react';
import { FileImage } from 'lucide-react';
import { BlockElementType } from '@/enums';
import { ElementWrapper } from '@/plugins/element-wrapper';
import { BuiltInCovers, type CoverItem } from './covers';
import IconPicker, { renderIconValue, type IconPickerValue } from '@/components/IconPicker';
import styles from './HeadingTitle.module.less';

interface HeadingTitleProps {
  attributes: Record<string, unknown>;
  children: React.ReactNode;
  pluginId?: string;
  element?: any;
}

interface TitleAttrs {
  coverUrl?: string;
  coverId?: string;
  icon?: string;
  author?: string;
  date?: string;
  [key: string]: unknown;
}

const parseIconAttr = (raw?: string): IconPickerValue | null => {
  if (!raw) return null;
  try {
    const v = JSON.parse(raw);
    if (v && typeof v.kind === 'string' && typeof v.value === 'string') {
      return v as IconPickerValue;
    }
    return null;
  } catch {
    return { kind: 'emoji', value: raw };
  }
};

export const HeadingTitle = ({ attributes, children, pluginId, element }: HeadingTitleProps) => {
  const editor = useSlateStatic();

  // anchor 使用 ref 保存，不触发 re-render
  const iconAnchorRef = useRef<HTMLButtonElement | null>(null);
  const coverAnchorRef = useRef<HTMLButtonElement | null>(null);

  const [showCoverPicker, setShowCoverPicker] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);

  const attrs: TitleAttrs = (element?.attrs as TitleAttrs) || {};
  const isEmpty =
    !element?.children?.length ||
    (element?.children?.[0]?.text === '' && element?.children?.length === 1);

  const currentIcon = parseIconAttr(attrs.icon);

  const path = (() => {
    try {
      if (!element) return undefined;
      return ReactEditor.findPath(editor as any, element);
    } catch {
      return undefined;
    }
  })();

  const updateAttrs = (patch: Partial<TitleAttrs>) => {
    if (!path) return;
    Transforms.setNodes(editor, { attrs: { ...attrs, ...patch } } as any, { at: path });
  };

  // 选择 / 移除图标
  const handleSelectIcon = (v: IconPickerValue) => {
    updateAttrs({ icon: JSON.stringify(v) });
    setShowIconPicker(false);
  };
  const handleRemoveIcon = () => {
    updateAttrs({ icon: '' });
    setShowIconPicker(false);
  };

  // 选择 / 移除封面
  const handleSelectCover = (cover: CoverItem) => {
    updateAttrs({ coverUrl: cover.url, coverId: cover.id });
    setShowCoverPicker(false);
  };
  const handleRemoveCover = () => {
    updateAttrs({ coverUrl: undefined, coverId: undefined });
    setShowCoverPicker(false);
  };

  // 打开 icon picker 时，保存 anchor 当前值
  const openIconPicker = () => {
    setShowIconPicker(true);
  };
  const openCoverPicker = () => {
    setShowCoverPicker(true);
  };

  const displayDate = attrs.date || new Date().toISOString().slice(0, 10);
  const displayAuthor = attrs.author || '青柠脉动';

  return (
    <ElementWrapper
      type={BlockElementType.HEADING_TITLE}
      pluginId={pluginId}
      attrs={attrs}
      isEmpty={isEmpty}
      attributes={attributes}
      className={styles.headingTitle}
    >
      {/* 封面区域 */}
      {attrs.coverUrl ? (
        <div className={styles.coverArea}>
          <img
            src={attrs.coverUrl}
            alt="cover"
            className={styles.coverImg}
            draggable={false}
            onMouseDown={(e) => e.preventDefault()}
          />
          <div className={styles.coverActions}>
            <button
              type="button"
              className={styles.actionBtn}
              title="更换封面"
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                openCoverPicker();
              }}
              onClick={(e) => e.stopPropagation()}
            >
              🔄
            </button>
            <button
              type="button"
              className={styles.actionBtn}
              title="移除封面"
              onMouseDown={(e) => e.preventDefault()}
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveCover();
              }}
            >
              ✕
            </button>
          </div>
        </div>
      ) : null}

      {/* 封面选择弹层 */}
      {showCoverPicker && coverAnchorRef.current && (
        <CoverPicker
          anchorEl={coverAnchorRef.current}
          value={attrs.coverId || null}
          onSelect={handleSelectCover}
          onRemove={handleRemoveCover}
          onClose={() => setShowCoverPicker(false)}
        />
      )}

      {/* 按钮行：添加图标 / 添加封面 */}
      <div className={styles.actionRow}>
        <button
          type="button"
          ref={(el) => {
            iconAnchorRef.current = el;
          }}
          className={styles.actionPill}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            openIconPicker();
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {currentIcon ? (
            renderIconValue(currentIcon, 16)
          ) : (
            <span style={{ fontSize: 16 }}>😀</span>
          )}
          <span>{currentIcon ? '更换图标' : '添加图标'}</span>
          {currentIcon && (
            <span
              className={styles.pillRemove}
              title="移除图标"
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleRemoveIcon();
              }}
              onClick={(e) => e.stopPropagation()}
            >
              ✕
            </span>
          )}
        </button>
        <button
          type="button"
          ref={(el) => {
            coverAnchorRef.current = el;
          }}
          className={styles.actionPill}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            openCoverPicker();
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <FileImage size={16} />
          <span>{attrs.coverUrl ? '更换封面' : '添加封面'}</span>
          {attrs.coverUrl && (
            <span
              className={styles.pillRemove}
              title="移除封面"
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleRemoveCover();
              }}
              onClick={(e) => e.stopPropagation()}
            >
              ✕
            </span>
          )}
        </button>
      </div>

      {/* 图标选择弹层 */}
      {showIconPicker && iconAnchorRef.current && (
        <IconPicker
          anchorEl={iconAnchorRef.current}
          value={currentIcon}
          onSelect={handleSelectIcon}
          onRemove={handleRemoveIcon}
          onClose={() => setShowIconPicker(false)}
          recentStorageKey="mb:iconpicker:recent"
          zIndex={10002}
        />
      )}

      {/* 标题 + 元信息 */}
      <div className={styles.titleRow}>
        {currentIcon && (
          <div
            className={styles.titleIcon}
            onMouseDown={(e) => e.preventDefault()}
            contentEditable={false}
            suppressContentEditableWarning
          >
            {renderIconValue(currentIcon, 44)}
          </div>
        )}
        <div className={styles.titleContent}>
          <h1
            className={styles.titleMain}
            data-placeholder="请输入文档标题"
            suppressContentEditableWarning
          >
            {children}
          </h1>
          <div className={styles.metaRow}>
            <span
              className={styles.metaItem}
              onMouseDown={(e) => e.preventDefault()}
              contentEditable={false}
              suppressContentEditableWarning
            >
              <span className={styles.metaIco}>👤</span>
              {displayAuthor}
            </span>
            <span className={styles.dotSep} />
            <span
              className={styles.metaItem}
              onMouseDown={(e) => e.preventDefault()}
              contentEditable={false}
              suppressContentEditableWarning
            >
              <span className={styles.metaIco}>📅</span>
              {displayDate}
            </span>
          </div>
        </div>
      </div>
    </ElementWrapper>
  );
};

// =============== CoverPicker（独立组件，避免每次重渲染覆盖状态） ===============
interface CoverPickerProps {
  anchorEl: HTMLElement;
  value: string | null;
  onSelect: (cover: CoverItem) => void;
  onRemove: () => void;
  onClose: () => void;
}

function CoverPicker({ anchorEl, value, onSelect, onRemove, onClose }: CoverPickerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(() => calcCoverPickerPos(anchorEl));

  useEffect(() => {
    const onScrollOrResize = () => setPos(calcCoverPickerPos(anchorEl));
    window.addEventListener('scroll', onScrollOrResize, true);
    window.addEventListener('resize', onScrollOrResize);
    return () => {
      window.removeEventListener('scroll', onScrollOrResize, true);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, [anchorEl]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (ref.current && !ref.current.contains(target) && !anchorEl.contains(target)) {
        onClose();
      }
    };
    const id = window.setTimeout(() => document.addEventListener('mousedown', onClick), 0);
    return () => {
      window.clearTimeout(id);
      document.removeEventListener('mousedown', onClick);
    };
  }, [anchorEl, onClose]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className={styles.coverPicker}
      style={{ position: 'fixed', top: pos.top, left: pos.left }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 10,
        }}
      >
        <div className={styles.pickerTitle}>选择封面</div>
        {value && (
          <button
            type="button"
            className={styles.pickerRemoveBtn}
            onMouseDown={(e) => e.preventDefault()}
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
          >
            移除当前封面
          </button>
        )}
      </div>
      <div className={styles.coverGrid}>
        {BuiltInCovers.map((cover) => (
          <div key={cover.id}>
            <div
              className={`${styles.coverItem} ${value === cover.id ? styles.active : ''}`}
              onMouseDown={(e) => e.preventDefault()}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(cover);
              }}
            >
              <img src={cover.url} alt={cover.name} draggable={false} />
            </div>
            <div className={styles.coverName}>{cover.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function calcCoverPickerPos(anchor: HTMLElement): { top: number; left: number } {
  const rect = anchor.getBoundingClientRect();
  const w = 420;
  const h = 360;
  let top = rect.bottom + 8 + window.scrollY;
  let left = rect.left + window.scrollX;
  if (rect.bottom + 8 + h > window.innerHeight + window.scrollY) {
    top = rect.top + window.scrollY - h - 8;
  }
  if (left + w > window.innerWidth + window.scrollX - 12) {
    left = window.innerWidth + window.scrollX - w - 12;
  }
  return { top, left };
}
