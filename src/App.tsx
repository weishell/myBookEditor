import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Editor from '@/core';
import NotFound from '@/pages/NotFound';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import ModeSwitcher from '@/components/ModeSwitcher';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import FontSwitcher from '@/components/FontSwitcher';
import { InlineToastHost } from '@/components/InlineToast';
import { BackToTop } from '@/components/BackToTop/BackToTop';
import { Outline } from '@/components/Outline/Outline';
import DarkWallpaper from '@/components/DarkWallpaper';
import { EditorProvider, useEditorMode } from '@/context/EditorContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { LanguageProvider } from '@/context/LanguageContext';
import styles from './App.module.less';

function AppLayout() {
  const { mode, setMode } = useEditorMode();

  return (
    <BrowserRouter>
      <div className={styles.container}>
        <DarkWallpaper />
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
        <EditorProvider>
          <AppLayout />
          <InlineToastHost />
        </EditorProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}

export default App;
