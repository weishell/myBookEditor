// 站点顶栏（logo + 主导航 + 搜索）
//
// 交互约定（2026-11-14）：
//  - 顶部（scrollTop = 0）时它就是普通文档流里的顶栏，跟着页面一起滚走；
//  - 顶栏完整滚出视口后，右侧浮出一个小圆按钮（≡）；
//  - 点小按钮 → 顶栏以 fixed 浮层从顶部落下，右侧按钮变成 ×（点它 / 点遮罩 / 按 Esc 收起）；
//  - 浮层展开时只要页面一滚动就自动收起，回到小按钮 —— 不挡阅读。
//
// 为什么不用 position: sticky 常驻：用户在长文档里阅读时不需要一直看着导航，
// 只剩角落一个小按钮更安静；需要时再点开。
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CloseIcon, MenuIcon } from '@/components/icons/lineIcons';
import styles from './AppHeader.module.less';

/** 顶栏搜索框：回车跳转到 /search?q=… */
function HeaderSearch() {
  const [value, setValue] = useState('');
  const navigate = useNavigate();
  const { t } = useTranslation();

  const submit = () => {
    const q = value.trim();
    if (q) navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <div className={styles.searchBox}>
      <svg
        className={styles.searchIcon}
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="M20 20l-3.2-3.2" />
      </svg>
      <input
        value={value}
        placeholder={t('header.searchPlaceholder')}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') submit();
        }}
      />
    </div>
  );
}

/** 顶栏导航：设置是独立路由页，不再用下拉浮层 */
function HeaderNav({ onNavigate }: { onNavigate: () => void }) {
  const navClass = ({ isActive }: { isActive: boolean }) =>
    `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`;

  return (
    <nav className={styles.nav}>
      <NavLink to="/" end className={navClass} onClick={onNavigate}>
        首页
      </NavLink>
      <NavLink to="/articles" className={navClass} onClick={onNavigate}>
        全部文章
      </NavLink>
      <NavLink to="/trash" className={navClass} onClick={onNavigate}>
        回收站
      </NavLink>
      <NavLink to="/settings" className={navClass} onClick={onNavigate}>
        设置
      </NavLink>
    </nav>
  );
}

export function AppHeader() {
  const headerRef = useRef<HTMLElement>(null);
  const { pathname } = useLocation();
  /** 顶栏真实高度：既是"是否已滚出视口"的阈值，也是浮起时的占位高度 */
  const [headerHeight, setHeaderHeight] = useState(0);
  /** 顶栏已滚出视口 → 显示右侧小按钮 */
  const [docked, setDocked] = useState(false);
  /** 浮层展开中 */
  const [open, setOpen] = useState(false);
  const openRef = useRef(false);
  openRef.current = open;
  /** 展开的时刻：浮层从流内变 fixed 会让浏览器重排，可能带出一次 scroll 抖动，
   *  开头的 260ms 内不把这种抖动当成"用户滑动" */
  const openAtRef = useRef(0);

  // 量高度（字体/语言/窄屏换行都会变，用 ResizeObserver 跟住）
  useLayoutEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const measure = () => setHeaderHeight(el.offsetHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // 滚动：决定小按钮是否出现；浮层展开时一滚动就直接收起
  useEffect(() => {
    const computeDocked = () => {
      const y = window.scrollY || document.documentElement.scrollTop || 0;
      // 留 8px 余量：顶栏还露出半截时不急着弹按钮
      setDocked(y > Math.max(headerHeight - 8, 16));
    };
    const onScroll = () => {
      if (openRef.current) {
        if (Date.now() - openAtRef.current > 260) setOpen(false);
        return;
      }
      computeDocked();
    };
    // 注意：这里只能算位置，不能走 onScroll —— 否则每次重绑（高度变化）都会把刚打开的浮层关掉
    computeDocked();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [headerHeight]);

  useEffect(() => {
    if (open) openAtRef.current = Date.now();
  }, [open]);

  // 换页就收起（点导航后浮层不该还挂着）
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Esc 收起
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        setOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const close = useCallback(() => setOpen(false), []);

  return (
    <>
      <header ref={headerRef} className={`${styles.header} ${open ? styles.headerOpen : ''}`}>
        <div className={styles.brand}>
          <Link to="/" className={styles.logo} onClick={close}>
            MyBook Editor
          </Link>
          <HeaderNav onNavigate={close} />
        </div>
        <div className={styles.controls}>
          <HeaderSearch />
          {open && (
            <button
              type="button"
              className={styles.inlineClose}
              onClick={close}
              title="收起导航"
              aria-label="收起导航"
            >
              <CloseIcon size={16} />
            </button>
          )}
        </div>
      </header>

      {/* 浮起时顶栏脱离文档流，用等高占位撑住页面，避免内容整体上跳 */}
      {open && <div style={{ height: headerHeight }} aria-hidden />}

      {/* 顶栏滚出视口后的折叠入口 */}
      {docked && !open && (
        <button
          type="button"
          className={styles.dockBtn}
          onClick={() => setOpen(true)}
          title="展开导航"
          aria-label="展开导航"
          aria-expanded={false}
        >
          <MenuIcon size={17} />
        </button>
      )}

      {/* 点空白收起 */}
      {open && <div className={styles.scrim} onClick={close} aria-hidden />}
    </>
  );
}

export default AppHeader;
