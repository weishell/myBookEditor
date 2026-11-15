import { BrowserRouter, Navigate, Routes, Route, useLocation } from 'react-router-dom';
import Editor from '@/core';
import NotFound from '@/pages/NotFound';
import Home from '@/pages/Home';
import ArticleList from '@/pages/ArticleList';
import Article from '@/pages/Article';
import Search from '@/pages/Search';
import Settings from '@/pages/Settings';
import RecycleBin from '@/pages/RecycleBin';
import AntdThemeBridge from '@/components/AntdThemeBridge';
import { InlineToastHost } from '@/components/InlineToast';
import { AppHeader } from '@/components/AppHeader';
import { BackToTop } from '@/components/BackToTop/BackToTop';
import { WordCount } from '@/components/WordCount/WordCount';
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
      {/* 顶栏自带折叠逻辑：滚出视口后收成右上角小按钮，点开才浮出（见 components/AppHeader） */}
      <AppHeader />
      <main className={`${styles.main} ${isDocRoute ? styles.mainDoc : ''}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/category/:name" element={<ArticleList kind="category" />} />
          <Route path="/tag/:name" element={<ArticleList kind="tag" />} />
          <Route path="/articles" element={<ArticleList kind="all" />} />
          <Route path="/trash" element={<RecycleBin />} />
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
      <WordCount />
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
