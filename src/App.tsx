import { useState } from 'react';
import {
  BrowserRouter,
  NavLink,
  Navigate,
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Editor from '@/core';
import NotFound from '@/pages/NotFound';
import Home from '@/pages/Home';
import ArticleList from '@/pages/ArticleList';
import Article from '@/pages/Article';
import Search from '@/pages/Search';
import Settings from '@/pages/Settings';
import AntdThemeBridge from '@/components/AntdThemeBridge';
import { InlineToastHost } from '@/components/InlineToast';
import { BackToTop } from '@/components/BackToTop/BackToTop';
import { Outline } from '@/components/Outline/Outline';
import { WallpaperHost } from '@/components/wallpapers';
import { EditorProvider, useEditorMode } from '@/context/EditorContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { CursorProvider } from '@/context/CursorContext';
import { FindReplaceProvider, FindReplacePanel } from '@/components/find-replace';
import CursorTrail from '@/components/CursorTrail';
import { SEED_COMMENTS } from '@/data/comments';
import styles from './App.module.less';

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
function HeaderNav() {
  const navClass = ({ isActive }: { isActive: boolean }) =>
    `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`;

  return (
    <nav className={styles.nav}>
      <NavLink to="/" end className={navClass}>
        首页
      </NavLink>
      <NavLink to="/articles" className={navClass}>
        全部文章
      </NavLink>
      <NavLink to="/settings" className={navClass}>
        设置
      </NavLink>
    </nav>
  );
}

function AppFrame() {
  const { mode } = useEditorMode();
  const { pathname } = useLocation();

  // 目录只属于正在看的那篇文档。除了不渲染 <Outline />（组件内部也会判断），
  // 这里连「给它留的那 240px 左栏」也一起收掉 —— 否则回到首页后会空出一条
  // 竖着的空白栏，看起来就像目录还挂着。
  const isDocRoute = pathname.startsWith('/article/') || pathname === '/demo';

  return (
    <div className={styles.container}>
      <CursorTrail />
      <WallpaperHost />
      <header className={styles.header}>
        <div className={styles.brand}>
          <Link to="/" className={styles.logo}>
            MyBook Editor
          </Link>
          <HeaderNav />
        </div>
        <div className={styles.controls}>
          <HeaderSearch />
        </div>
      </header>
      <main className={`${styles.main} ${isDocRoute ? styles.mainDoc : ''}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/category/:name" element={<ArticleList kind="category" />} />
          <Route path="/tag/:name" element={<ArticleList kind="tag" />} />
          <Route path="/articles" element={<ArticleList kind="all" />} />
          <Route path="/settings" element={<Settings />} />
          {/* 旧的 /appearance 已并入 /settings，保留跳转免得书签失效 */}
          <Route path="/appearance" element={<Navigate to="/settings" replace />} />
          <Route path="/article/:id" element={<Article />} />
          <Route
            path="/demo"
            element={
              <Editor readOnly={mode === 'read'} commentKey="demo" commentSeed={SEED_COMMENTS} />
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Outline />
      <BackToTop />
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        {/* 光标主题必须放在 ThemeProvider 内部，且要在最外层包裹 */}
        <CursorProvider>
          <AntdThemeBridge>
            <EditorProvider>
              <FindReplaceProvider>
                <BrowserRouter>
                  <AppFrame />
                </BrowserRouter>
                <FindReplacePanel />
                <InlineToastHost />
              </FindReplaceProvider>
            </EditorProvider>
          </AntdThemeBridge>
        </CursorProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}

export default App;
