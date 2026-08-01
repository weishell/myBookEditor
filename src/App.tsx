import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Editor from '@/components/Editor';
import NotFound from '@/pages/NotFound';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import ModeSwitcher from '@/components/ModeSwitcher';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import { InlineToastHost } from '@/components/InlineToast';
import { EditorProvider, useEditorMode } from '@/context/EditorContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { LanguageProvider } from '@/context/LanguageContext';
import styles from './App.module.less';

function AppLayout() {
  const { mode, setMode } = useEditorMode();

  return (
    <BrowserRouter>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.logo}>MyBook Editor</div>
          <div className={styles.controls}>
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
