import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Editor from '@/components/Editor';
import NotFound from '@/pages/NotFound';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import ModeSwitcher, { type EditorMode } from '@/components/ModeSwitcher';
import { EditorProvider } from '@/context/EditorContext';
import styles from './App.module.less';

function App() {
  const [mode, setMode] = useState<EditorMode>('edit');

  return (
    <EditorProvider>
      <BrowserRouter>
        <div className={styles.container}>
          <header className={styles.header}>
            <div className={styles.logo}>MyBook Editor</div>
            <div className={styles.controls}>
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
    </EditorProvider>
  );
}

export default App;
