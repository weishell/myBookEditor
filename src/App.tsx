import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Editor from '@/core';
import NotFound from '@/pages/NotFound';
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

function AppLayout() {
  const { mode } = useEditorMode();

  return (
    <BrowserRouter>
      <div className={styles.container}>
        <CursorTrail />
        <WallpaperHost />
        <header className={styles.header}>
          <div className={styles.logo}>MyBook Editor</div>
          <div className={styles.controls}>
            <SettingsSwitcher />
          </div>
        </header>
        <main className={styles.main}>
          <Routes>
            <Route path="/" element={<Editor readOnly={mode === 'read'} />} />
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
