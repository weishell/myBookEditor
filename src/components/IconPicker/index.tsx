import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import styles from './IconPicker.module.less';

// ============================================================
// IconPicker - 基于 @emoji-mart v5 的表情图标选择器
// 对外接口保持 { kind, value } 结构以兼容旧数据
// ============================================================

export type IconKind = 'emoji';

export interface IconPickerValue {
  kind: 'emoji';
  /** emoji 字符（native） */
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

// ---------- 最近使用（localStorage，按 emoji id 存储） ----------
const RECENT_MAX = 16;

const readRecent = (storageKey?: string): string[] => {
  if (!storageKey) return [];
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.slice(0, RECENT_MAX) : [];
  } catch {
    return [];
  }
};

const writeRecent = (storageKey: string | undefined, list: string[]) => {
  if (!storageKey) return;
  try {
    localStorage.setItem(storageKey, JSON.stringify(list.slice(0, RECENT_MAX)));
  } catch {
    /* ignore */
  }
};

// ---------- 颜色转换 ----------
/** hex (#1890ff) → rgb triplet "24 144 255" */
const hexToRgb = (hex: string): string => {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `${r}, ${g}, ${b}`;
};

// ---------- 渲染工具 ----------
export function renderIconValue(val: IconPickerValue | null | undefined, size = 20) {
  if (!val || val.kind !== 'emoji' || !val.value) return null;
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

// ---------- 布局常量（与 less 中容器宽度匹配） ----------
const EMOJI_BUTTON_SIZE = 36;
const PER_LINE = 7;
/** 容器宽度 = 网格宽 + 内边距(24) + 侧边导航宽(16) = 7*36+24+16 = 292 */
const PICKER_WIDTH = PER_LINE * EMOJI_BUTTON_SIZE + 24 + 16;
const PICKER_HEIGHT = 440;

// ---------- 定位 ----------
const calcPosition = (
  anchor: HTMLElement | null,
  width = PICKER_WIDTH,
  height = PICKER_HEIGHT,
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
  if (left < 12) left = 12;
  return { top, left };
};

export default function IconPicker(props: IconPickerProps) {
  const { anchorEl, value, onSelect, onRemove, onClose, recentStorageKey, zIndex = 10002 } = props;

  const [recent, setRecent] = useState<string[]>(() => readRecent(recentStorageKey));
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

  // 点击外部关闭
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

  // 主题色联动：将 --theme-primary (hex) 转为 --rgb-accent (rgb triplet) 供 emoji-mart 使用
  useEffect(() => {
    const onThemeChange = () => {
      const hex = getComputedStyle(document.documentElement)
        .getPropertyValue('--theme-primary')
        .trim();
      if (!hex) return;
      const rgb = hexToRgb(hex);
      if (pickerRef.current) {
        pickerRef.current.style.setProperty('--rgb-accent', rgb);
      }
    };
    onThemeChange();
    // 监听主题色变化
    const observer = new MutationObserver(onThemeChange);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['style'] });
    return () => observer.disconnect();
  }, []);

  // 自定义 data：插入"最近"分类，过滤掉 flags
  const customData = useMemo(() => {
    if (recent.length === 0) return data;
    const newData: any = { ...(data as any) };
    const allEmojis = (data as any).emojis as Record<string, { id: string }>;
    const recentIds = recent
      .map((native) => {
        const found = Object.values(allEmojis).find((e: any) => e.native === native);
        return found ? found.id : null;
      })
      .filter(Boolean);
    if (recentIds.length === 0) return data;
    newData.categories = [
      { id: 'recent', name: '最近', emojis: recentIds },
      ...(data as any).categories.filter((c: any) => c.id !== 'flags'),
    ];
    return newData;
  }, [recent]);

  const handleEmojiSelect = (emoji: any) => {
    const v: IconPickerValue = { kind: 'emoji', value: emoji.native };
    onSelect(v);
    const next = [emoji.native, ...recent.filter((e) => e !== emoji.native)].slice(0, RECENT_MAX);
    setRecent(next);
    writeRecent(recentStorageKey, next);
  };

  const node = (
    <div
      ref={pickerRef}
      className={styles.iconPicker}
      style={{
        position: 'absolute',
        top: pos.top,
        left: pos.left,
        zIndex,
        width: PICKER_WIDTH,
      }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div className={styles.header}>
        <span className={styles.title}>选择图标</span>
        {!!value && !!onRemove && (
          <button
            type="button"
            className={styles.removeBtn}
            onMouseDown={(e) => e.preventDefault()}
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
          >
            移除
          </button>
        )}
      </div>
      <Picker
        data={customData}
        onEmojiSelect={handleEmojiSelect}
        theme="light"
        previewPosition="none"
        skinTonePosition="none"
        searchPosition="sticky"
        maxFrequentRows={0}
        emojiButtonSize={EMOJI_BUTTON_SIZE}
        emojiSize={24}
        navPosition="bottom"
        perLine={PER_LINE}
        i18n={{
          search: '搜索',
          notfound: '未找到',
          categories: {
            recent: '最近',
            people: '表情与人物',
            nature: '动物与自然',
            foods: '食物与饮料',
            activity: '活动',
            places: '旅行与地点',
            objects: '物体',
            symbols: '符号',
            flags: '旗帜',
          },
        }}
      />
    </div>
  );

  return createPortal(node, document.body);
}
