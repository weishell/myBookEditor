import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Editor from '@/core';
import NotFound from '@/pages/NotFound';
import Home from '@/pages/Home';
import ArticleList from '@/pages/ArticleList';
import Article from '@/pages/Article';
import Search from '@/pages/Search';
import SettingsSwitcher from '@/components/SettingsSwitcher';
import AntdThemeBridge from '@/components/AntdThemeBridge';
import { InlineToastHost } from '@/components/InlineToast';
import { BackToTop } from '@/components/BackToTop/BackToTop';
import { Outline } from '@/components/Outline/Outline';
import { WallpaperHost } from '@/components/wallpapers';
import { EditorProvider, useEditorMode } from '@/context/EditorContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { CursorProvider } from '@/context/CursorContext';
import { FindReplaceProvider, FindReplacePanel } from '@/components/SettingsSwitcher/find-replace';
import CursorTrail from '@/components/CursorTrail';
import styles from './App.module.less';

/** 顶栏搜索框：回车跳转到 /search?q=… */
function HeaderSearch() {
  const [value, setValue] = useState('');
  const navigate = useNavigate();

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
        placeholder="搜索文章、标签…"
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') submit();
        }}
      />
    </div>
  );
}

function AppLayout() {
  const { mode } = useEditorMode();

  return (
    <BrowserRouter>
      <div className={styles.container}>
        <CursorTrail />
        <WallpaperHost />
        <header className={styles.header}>
          <Link to="/" className={styles.logo}>
            MyBook Editor
          </Link>
          <div className={styles.headerCenter}>
            <HeaderSearch />
          </div>
          <div className={styles.controls}>
            <SettingsSwitcher />
          </div>
        </header>
        <main className={styles.main}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/category/:name" element={<ArticleList kind="category" />} />
            <Route path="/tag/:name" element={<ArticleList kind="tag" />} />
            <Route path="/article/:id" element={<Article />} />
            <Route path="/demo" element={<Editor readOnly={mode === 'read'} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Outline />
        <BackToTop />
      </div>
    </BrowserRouter>
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
                <AppLayout />
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
