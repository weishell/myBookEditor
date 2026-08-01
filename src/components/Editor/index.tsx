import { useMemo, useCallback, useEffect } from 'react';
import { createEditor, Editor as SlateEditor } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import { MenuProvider, ContextMenu, SelectionProvider, DocBarProvider, DocBar } from '@/plugins';
import { withCodeBlock, withMarkdownShortcuts, withEditorBehaviors } from '@/editor-extensions';
import { initialValue } from '@/utils/initial-value';
import { createKeyboardHandler } from '@/events/keyboard';
import { codeDecorate } from '@/utils/code-decoration';
import FloatBar from '@/components/FloatBar';
import { renderElement } from './renderElement';
import { renderLeaf } from './renderLeaf';
import { PAGE_WIDTH_NORMAL } from '@/enums';

interface EditorProps {
  readOnly?: boolean;
}

export default function Editor({ readOnly = false }: EditorProps) {
  const editor = useMemo(
    () =>
      withEditorBehaviors(
        withMarkdownShortcuts(withCodeBlock(withHistory(withReact(createEditor())))),
      ),
    [],
  );

  useEffect(() => {
    SlateEditor.normalize(editor, { force: true });
  }, [editor]);

  const keyboardHandler = useMemo(() => createKeyboardHandler(editor), [editor]);
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!readOnly) {
        keyboardHandler(e);
      }
    },
    [keyboardHandler, readOnly],
  );
  const handleChange = useCallback(() => {}, []);

  return (
    <Slate editor={editor} initialValue={initialValue} onChange={handleChange}>
      <SelectionProvider>
        <MenuProvider>
          {!readOnly && <FloatBar />}
          {!readOnly && <ContextMenu />}
          <DocBarProvider>
            <DocBar />
            <div
              style={{
                maxWidth: PAGE_WIDTH_NORMAL,
                margin: '0 auto',
                padding: '40px 50px',
                border: '1px solid #e8e8e8',
                borderRadius: '8px',
                backgroundColor: '#fff',
                minHeight: '500px',
                pointerEvents: readOnly ? 'none' : 'auto',
              }}
            >
              <Editable
                renderElement={renderElement}
                renderLeaf={renderLeaf}
                placeholder="开始编写文档..."
                style={{
                  minHeight: '500px',
                  outline: 'none',
                }}
                decorate={codeDecorate}
                onKeyDown={handleKeyDown}
                readOnly={readOnly}
              />
            </div>
          </DocBarProvider>
        </MenuProvider>
      </SelectionProvider>
    </Slate>
  );
}
