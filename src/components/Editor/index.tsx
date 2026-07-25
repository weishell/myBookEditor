import { useMemo, useCallback, useEffect } from 'react';
import { createEditor, Editor as SlateEditor } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import {
  MenuProvider,
  ContextMenu,
  SelectionProvider,
  DocBarProvider,
  DocBar,
  withTable,
} from '@/plugins';
import { withCodeBlock, withMarkdownShortcuts } from '@/editor-extensions';
import { initialValue } from '@/utils/initial-value';
import { createKeyboardHandler } from '@/events/keyboard';
import { codeDecorate } from '@/utils/code-decoration';
import FloatBar from '@/components/FloatBar';
import { renderElement } from './renderElement';
import { renderLeaf } from './renderLeaf';

export default function Editor() {
  const editor = useMemo(
    () => withTable(withMarkdownShortcuts(withCodeBlock(withHistory(withReact(createEditor()))))),
    [],
  );

  useEffect(() => {
    // 强制 normalize，将 code-block 的文本节点转换为 code-line 元素
    SlateEditor.normalize(editor, { force: true });
  }, [editor]);
  const keyboardHandler = useMemo(() => createKeyboardHandler(editor), [editor]);
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      keyboardHandler(e);
    },
    [keyboardHandler],
  );

  return (
    <Slate editor={editor} initialValue={initialValue}>
      <SelectionProvider>
        <MenuProvider>
          <FloatBar />
          <ContextMenu />
          <DocBarProvider>
            <DocBar />
            <div
              style={{
                maxWidth: '900px',
                margin: '0 auto',
                padding: '40px 50px',
                border: '1px solid #e8e8e8',
                borderRadius: '8px',
                backgroundColor: '#fff',
                minHeight: '500px',
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
              />
            </div>
          </DocBarProvider>
        </MenuProvider>
      </SelectionProvider>
    </Slate>
  );
}
