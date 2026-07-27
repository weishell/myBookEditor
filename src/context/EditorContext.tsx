import { createContext, useContext, useState, type ReactNode } from 'react';
import type { EditorMode } from '@/components/ModeSwitcher';

interface EditorContextType {
  mode: EditorMode;
  setMode: (mode: EditorMode) => void;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export function EditorProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<EditorMode>('edit');

  return <EditorContext.Provider value={{ mode, setMode }}>{children}</EditorContext.Provider>;
}

export function useEditorMode() {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error('useEditorMode must be used within an EditorProvider');
  }
  return context;
}
