import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Editor from '@/core';
import NotFound from '@/pages/NotFound';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import ModeSwitcher from '@/components/ModeSwitcher';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import FontSwitcher from '@/components/FontSwitcher';
import AntdThemeBridge from '@/components/AntdThemeBridge';
import { InlineToastHost } from '@/components/InlineToast';
import { BackToTop } from '@/components/BackToTop/BackToTop';
import { Outline } from '@/components/Outline/Outline';
import { WallpaperHost } from '@/components/wallpapers';
import { EditorProvider, useEditorMode } from '@/context/EditorContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { LanguageProvider } from '@/context/LanguageContext';
import styles from './App.module.less';

function AppLayout() {
  const { mode, setMode } = useEditorMode();

  return (
    <BrowserRouter>
      <div className={styles.container}>
        <WallpaperHost />
        <header className={styles.header}>
          <div className={styles.logo}>MyBook Editor</div>
          <div className={styles.controls}>
            <FontSwitcher />
            <ThemeSwitcher />
            <ModeSwitcher mode={mode} onChange={setMode} />
            <LanguageSwitcher />
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
        {/* Antd 主题桥必须放在 ThemeProvider 内部，这样才能 useTheme() 拿到 isDarkMode/themeColor */}
        <AntdThemeBridge>
          <EditorProvider>
            <AppLayout />
            <InlineToastHost />
          </EditorProvider>
        </AntdThemeBridge>
      </ThemeProvider>
    </LanguageProvider>
  );
}

export default App;
