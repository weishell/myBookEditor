import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Search, X } from 'lucide-react';
import * as LUCIDE from 'lucide-react';
import {
  EMOJI_ITEMS,
  EMOJI_CATEGORIES,
  LUCIDE_ITEMS,
  LUCIDE_CATEGORIES,
  LUCIDE_KEYS,
  type IconItem,
  type IconKind,
} from './icon-lib';
import styles from './IconPicker.module.less';

export type { IconKind, IconItem };

export interface IconPickerValue {
  kind: IconKind;
  /** emoji: 原字符；lucide: 组件名（如 Home） */
  value: string;
}

export interface IconPickerProps {
  /** 锚点元素，用于定位 */
  anchorEl: HTMLElement | null;
  /** 当前已选，用于决定激活态 + 移除按钮显示 */
  value?: IconPickerValue | null;
  /** 选中回传 */
  onSelect: (value: IconPickerValue) => void;
  /** 点击移除（若提供） */
  onRemove?: () => void;
  /** 关闭 */
  onClose: () => void;
  /** 最近使用的 localStorage key */
  recentStorageKey?: string;
  /** z-index，默认 10002 */
  zIndex?: number;
}

// ---------- 最近使用（localStorage） ----------
const readRecent = (storageKey: string): IconPickerValue[] => {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.slice(0, 16) : [];
  } catch {
    return [];
  }
};
const writeRecent = (storageKey: string, v: IconPickerValue[]) => {
  try {
    localStorage.setItem(storageKey, JSON.stringify(v.slice(0, 16)));
  } catch {
    /* ignore */
  }
};
const matchesValue = (a: IconPickerValue, b: IconPickerValue) =>
  a.kind === b.kind && a.value === b.value;
const pushRecent = (
  list: IconPickerValue[],
  item: IconPickerValue,
  max = 16,
): IconPickerValue[] => {
  const filtered = list.filter((x) => !matchesValue(x, item));
  return [item, ...filtered].slice(0, max);
};

// ---------- 渲染工具 ----------
function LucideIconByName({
  name,
  size = 20,
  color,
}: {
  name: string;
  size?: number;
  color?: string;
}) {
  const Comp = (LUCIDE as unknown as Record<string, React.ComponentType<any>>)[name];
  if (!Comp || typeof Comp !== 'function') return null;
  return <Comp width={size} height={size} color={color} />;
}

export function renderIconValue(val: IconPickerValue, size = 20, color = '#434343') {
  if (val.kind === 'emoji') {
    return (
      <span
        style={{
          fontSize: Math.round(size * 1.1),
          lineHeight: 1,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {val.value}
      </span>
    );
  }
  return <LucideIconByName name={val.value} size={size} color={color} />;
}

const calcPosition = (
  anchor: HTMLElement | null,
  width = 320,
  height = 360,
): { top: number; left: number } => {
  if (!anchor) return { top: 0, left: 0 };
  const rect = anchor.getBoundingClientRect();
  const margin = 8;
  let top = rect.bottom + window.scrollY + margin;
  let left = rect.left + window.scrollX;
  if (rect.bottom + margin + height > window.innerHeight + window.scrollY) {
    top = rect.top + window.scrollY - height - margin;
  }
  if (left + width > window.innerWidth + window.scrollX - 12) {
    left = window.innerWidth + window.scrollX - width - 12;
  }
  return { top, left };
};

export default function IconPicker(props: IconPickerProps) {
  const { anchorEl, value, onSelect, onRemove, onClose, recentStorageKey, zIndex = 10002 } = props;

  const [tab, setTab] = useState<IconKind>('emoji');
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [recent, setRecent] = useState<IconPickerValue[]>(() =>
    recentStorageKey ? readRecent(recentStorageKey) : [],
  );
  const [pos, setPos] = useState(() => calcPosition(anchorEl));
  const pickerRef = useRef<HTMLDivElement>(null);

  // 滚动/尺寸变化重新定位
  useEffect(() => {
    const onScrollOrResize = () => setPos(calcPosition(anchorEl));
    window.addEventListener('resize', onScrollOrResize);
    window.addEventListener('scroll', onScrollOrResize, true);
    return () => {
      window.removeEventListener('resize', onScrollOrResize);
      window.removeEventListener('scroll', onScrollOrResize, true);
    };
  }, [anchorEl]);

  // 点击外部关闭：使用 click 事件，而非 mousedown
  // —— mousedown 可能被按钮的 preventDefault + stopPropagation 阻断
  useEffect(() => {
    if (!pickerRef.current) return;
    const onClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        pickerRef.current &&
        !pickerRef.current.contains(target) &&
        anchorEl &&
        !anchorEl.contains(target)
      ) {
        onClose();
      }
    };
    document.addEventListener('click', onClick);
    return () => {
      document.removeEventListener('click', onClick);
    };
  }, [anchorEl, onClose]);

  // ESC 关闭
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const categories = useMemo(() => (tab === 'emoji' ? EMOJI_CATEGORIES : LUCIDE_CATEGORIES), [tab]);
  const rawItems = useMemo(() => (tab === 'emoji' ? EMOJI_ITEMS : LUCIDE_ITEMS), [tab]);

  const items = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    let list = rawItems;
    if (category !== 'all') list = list.filter((it) => it.category === category);
    if (kw) list = list.filter((it) => it.searchable.includes(kw));
    return list;
  }, [rawItems, keyword, category]);

  useEffect(() => {
    setCategory('all');
    setKeyword('');
  }, [tab]);

  const handleSelect = (it: IconItem) => {
    const v: IconPickerValue = { kind: it.kind, value: it.key };
    onSelect(v);
    if (recentStorageKey) {
      const next = pushRecent(recent, v, 16);
      setRecent(next);
      writeRecent(recentStorageKey, next);
    }
  };

  const pickerActive = (it: IconItem) =>
    !!value && value.kind === it.kind && value.value === it.key;

  const showRecent = tab === 'emoji' && category === 'all' && !keyword && recent.length > 0;

  const renderItem = (it: IconItem) => {
    const active = pickerActive(it);
    return (
      <button
        key={`${it.kind}-${it.key}`}
        type="button"
        className={`${styles.iconItem} ${active ? styles.active : ''}`}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => handleSelect(it)}
      >
        <span className={styles.tooltip}>
          {it.kind === 'lucide' ? it.key : it.searchable.split(' ')[0]}
        </span>
        {it.kind === 'emoji' ? (
          <span style={{ fontSize: 18, lineHeight: 1 }}>{it.key}</span>
        ) : (
          <LucideIconByName name={it.key} size={20} />
        )}
      </button>
    );
  };

  const node = (
    <div
      ref={pickerRef}
      className={styles.iconPicker}
      style={{ position: 'absolute', top: pos.top, left: pos.left, zIndex }}
    >
      {/* Tab + 移除 */}
      <div className={styles.tabBar}>
        <div className={styles.tabGroup}>
          <div
            className={`${styles.tabBtn} ${tab === 'emoji' ? styles.tabBtnActive : ''}`}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setTab('emoji')}
          >
            表情符号
          </div>
          <div
            className={`${styles.tabBtn} ${tab === 'lucide' ? styles.tabBtnActive : ''}`}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setTab('lucide')}
          >
            图标
          </div>
        </div>
        {!!value && !!onRemove && (
          <button
            type="button"
            className={styles.removeBtn}
            onMouseDown={(e) => e.preventDefault()}
            onClick={onRemove}
          >
            <X size={14} />
            移除
          </button>
        )}
      </div>

      {/* 搜索 */}
      <div className={styles.searchBar}>
        <Search className={styles.searchIcon} size={16} />
        <input placeholder="搜索" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
      </div>

      {/* 分类 */}
      <div className={styles.categoryTabs}>
        {categories.map((c) => (
          <span
            key={c.key}
            className={`${styles.tab} ${category === c.key ? styles.active : ''}`}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setCategory(c.key)}
          >
            {c.label}
          </span>
        ))}
      </div>

      {/* 最近使用 */}
      {showRecent && (
        <>
          <div className={styles.sectionTitle}>最近</div>
          <div className={styles.iconGrid}>
            {recent.slice(0, 7).map((v) => {
              const active = !!value && value.kind === v.kind && value.value === v.value;
              return (
                <button
                  key={`recent-${v.kind}-${v.value}`}
                  type="button"
                  className={`${styles.iconItem} ${active ? styles.active : ''}`}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => onSelect(v)}
                >
                  {v.kind === 'emoji' ? (
                    <span style={{ fontSize: 18, lineHeight: 1 }}>{v.value}</span>
                  ) : (
                    <LucideIconByName name={v.value} size={20} />
                  )}
                </button>
              );
            })}
          </div>
          <div className={styles.sectionTitle}>表情符号</div>
        </>
      )}

      {/* 网格 */}
      {items.length > 0 ? (
        <div className={styles.iconGrid}>{items.map(renderItem)}</div>
      ) : (
        <div className={styles.empty}>未找到匹配项</div>
      )}
    </div>
  );

  // 避免未使用警告
  void LUCIDE_KEYS.length;

  return createPortal(node, document.body);
}
