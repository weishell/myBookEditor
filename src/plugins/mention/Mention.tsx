import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, MouseEvent } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useSelected } from 'slate-react';
import type { MentionElement as MentionElementT } from './mention-utils';
import { getDataState } from '@/data/store';
import { useTheme } from '@/context/ThemeContext';
import { getInlineMarkStyle } from '@/utils/inline-mark-style';
import styles from './Mention.module.less';

interface MentionProps {
  attributes: Record<string, any>;
  element: MentionElementT;
  readOnly?: boolean;
}

/** 悬停预览：定位信息（viewport 坐标） */
interface PreviewAnchor {
  left: number;
  /** above=true 时这里存的是弹层底边，靠 transform 往上翻 */
  top: number;
  above: boolean;
}

const PREVIEW_WIDTH = 300;
const PREVIEW_GAP = 8;
/** 悬停多久才弹出，避免鼠标划过去一路弹窗 */
const PREVIEW_DELAY = 260;

/** 把主题色转成带透明度的 rgba，用于标签底色（theme 色值都是 #rrggbb） */
const hexToRgba = (hex: string, alpha: number): string => {
  const normalized = hex.replace('#', '').trim();
  const full =
    normalized.length === 3
      ? normalized
          .split('')
          .map((c) => c + c)
          .join('')
      : normalized;
  const r = parseInt(full.slice(0, 2), 16) || 0;
  const g = parseInt(full.slice(2, 4), 16) || 0;
  const b = parseInt(full.slice(4, 6), 16) || 0;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

/** 日期只取年月日，悬停卡里不需要精确到时分秒 */
const formatDate = (value?: string): string => (value ? value.slice(0, 10) : '');

export const Mention = ({ attributes, element }: MentionProps) => {
  const selected = useSelected();
  const navigate = useNavigate();
  const { isDarkMode, themeColor } = useTheme();
  const { name, kind, targetId, icon: attrIcon, color } = element.attrs;

  const icon = useMemo(() => {
    if (attrIcon) return attrIcon;
    if (kind === 'category') return '📁';
    if (kind === 'tag') return '#';
    return '📄';
  }, [attrIcon, kind]);

  // 老文档里的艾特可能没存 url，这里按类型兜底拼出跳转地址
  const url = useMemo(() => {
    if (element.attrs.url) return element.attrs.url;
    if (kind === 'category') return `/category/${encodeURIComponent(targetId)}`;
    if (kind === 'tag') return `/tag/${encodeURIComponent(targetId)}`;
    return `/article/${encodeURIComponent(targetId)}`;
  }, [element.attrs.url, kind, targetId]);

  // 选中 @提及 后调「文字颜色 / 背景色」：mark 落在子文本节点上，
  // 这里取出来覆盖默认的主题色 / 蓝色底，颜色才会真正生效。
  const markStyle = getInlineMarkStyle(element, isDarkMode);

  // 标签底色跟着主题色走，并把透明度交给 CSS 变量，hover / 选中态不用再写死颜色
  const chipStyle = useMemo(() => {
    const base = isDarkMode ? 0.16 : 0.08;
    return {
      ...markStyle,
      '--mention-tint': hexToRgba(themeColor, base),
      '--mention-tint-hover': hexToRgba(themeColor, base + 0.06),
      '--mention-tint-selected': hexToRgba(themeColor, base + 0.14),
    } as CSSProperties;
  }, [markStyle, isDarkMode, themeColor]);

  // 悬停预览的数据：只有 @文章 才有内容可看，分类 / 标签不弹
  const docInfo = useMemo(() => {
    if (kind !== 'doc') return null;
    const { articles, categories } = getDataState();
    const article = articles.find((item) => item.id === targetId);
    if (!article) return null;
    const category = categories.find((item) => item.id === article.category);
    return {
      article,
      categoryName: category?.name ?? '',
    };
  }, [kind, targetId]);

  const [anchor, setAnchor] = useState<PreviewAnchor | null>(null);
  const hoverTimer = useRef<number | undefined>(undefined);

  const showPreview = (el: HTMLElement) => {
    if (!docInfo) return;
    if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => {
      const rect = el.getBoundingClientRect();
      // 下方空间不够就翻到标签上方，左右则夹在视口内
      const above = rect.bottom + 200 > window.innerHeight;
      const left = Math.min(
        Math.max(PREVIEW_GAP, rect.left),
        Math.max(PREVIEW_GAP, window.innerWidth - PREVIEW_WIDTH - PREVIEW_GAP),
      );
      setAnchor({
        left,
        top: above ? rect.top - PREVIEW_GAP : rect.bottom + PREVIEW_GAP,
        above,
      });
    }, PREVIEW_DELAY);
  };

  const hidePreview = () => {
    if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
    hoverTimer.current = undefined;
    setAnchor(null);
  };

  // 滚动 / 缩放后固定定位会错位，直接收起，比跟着跳更不打扰
  useEffect(() => {
    if (!anchor) return;
    const close = () => setAnchor(null);
    window.addEventListener('scroll', close, true);
    window.addEventListener('resize', close);
    return () => {
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close);
    };
  }, [anchor]);

  // 组件卸载时清掉未触发的定时器
  useEffect(
    () => () => {
      if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
    },
    [],
  );

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation();
    hidePreview();
    navigate(url);
  };

  return (
    <>
      <span
        {...attributes}
        className={`${styles.mention} ${selected ? styles.selected : ''}`}
        style={chipStyle}
        contentEditable={false}
        data-mention
        data-mention-id={element.id}
        onClick={handleClick}
        onMouseEnter={(e) => showPreview(e.currentTarget)}
        onMouseLeave={hidePreview}
      >
        <span className={styles.icon} style={color ? { color } : undefined}>
          {icon}
        </span>
        <span>@{name}</span>
      </span>
      {anchor &&
        docInfo &&
        createPortal(
          <div
            className={styles.preview}
            data-mention-preview
            style={{
              left: anchor.left,
              top: anchor.top,
              width: PREVIEW_WIDTH,
              transform: anchor.above ? 'translateY(-100%)' : undefined,
            }}
          >
            <div className={styles.previewTitle}>
              <span className={styles.previewIcon}>📄</span>
              <span className={styles.previewName}>{docInfo.article.title}</span>
            </div>
            {docInfo.categoryName && (
              <span className={styles.previewTag}>{docInfo.categoryName}</span>
            )}
            {docInfo.article.summary?.trim() && (
              <p className={styles.previewSummary}>{docInfo.article.summary.trim()}</p>
            )}
            <div className={styles.previewMeta}>
              <span>{formatDate(docInfo.article.updatedAt || docInfo.article.date)}</span>
              <span>{docInfo.article.reads} 次阅读</span>
            </div>
            <div className={styles.previewHint}>点击打开文章</div>
          </div>,
          document.body,
        )}
    </>
  );
};
