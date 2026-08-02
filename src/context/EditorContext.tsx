import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { Editor } from 'slate';
import type { EditorMode } from '@/components/ModeSwitcher';

interface EditorContextType {
  mode: EditorMode;
  setMode: (mode: EditorMode) => void;
  /** 当前编辑器实例（由 BookEditor 注册，供 header 中的全局组件使用） */
  editor: Editor | null;
  setEditor: (editor: Editor | null) => void;
  /** 全局默认字体 family（全局层），编辑器容器以此渲染，block/text 层可覆盖 */
  globalFont: string;
  setGlobalFont: (font: string) => void;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export function EditorProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<EditorMode>('edit');
  const [editor, setEditor] = useState<Editor | null>(null);
  const [globalFont, setGlobalFont] = useState<string>('inherit');
  const value = useMemo(
    () => ({ mode, setMode, editor, setEditor, globalFont, setGlobalFont }),
    [mode, editor, globalFont],
  );

  return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>;
}

export function useEditorMode() {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error('useEditorMode must be used within an EditorProvider');
  }
  return context;
}
