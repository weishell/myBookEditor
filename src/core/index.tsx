// 编辑器核心（core/BookEditor）
//
// 职责：
//   1. 创建并组合所有 Slate withXxx 编辑器扩展（历史、代码块、Markdown、
//      编辑器行为劫持、删除劫持等），最外层 withDelete 确保删除逻辑最先拦截。
//   2. 初始化 Slate / Editable，挂载渲染 renderElement/renderLeaf，
//      并装配 DocBar / FloatBar / ContextMenu 等全局工具层。
//   3. 装配全局键盘事件分发与代码块 decorate。
//
// 设计：从 components/Editor 抽离，作为项目的编辑器运行核心，便于单独测试、
//       替换上层 UI 壳子或二次开发包装。
import { useMemo, useCallback, useEffect } from 'react';
import { createEditor, Editor } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import { MenuProvider, ContextMenu, SelectionProvider, DocBarProvider, DocBar } from '@/plugins';
import {
  withCodeBlock,
  withMarkdownShortcuts,
  withEditorBehaviors,
  withDelete,
} from '@/editor-extensions';
import { initialValue } from '@/utils/initial-value';
import { createKeyboardHandler } from '@/events/keyboard';
import { codeDecorate } from '@/utils/code-decoration';
import FloatBar from '@/components/FloatBar';
import { useEditorMode } from '@/context/EditorContext';
import { renderElement } from './renderElement';
import { renderLeaf } from './renderLeaf';
import { PAGE_WIDTH_NORMAL } from '@/enums';

interface EditorProps {
  readOnly?: boolean;
}

export default function BookEditor({ readOnly = false }: EditorProps) {
  const { setEditor, globalFont } = useEditorMode();
  const editor = useMemo(
    () =>
      withDelete(
        withEditorBehaviors(
          withMarkdownShortcuts(withCodeBlock(withHistory(withReact(createEditor())))),
        ),
      ),
    [],
  );

  // 把 editor 实例注册到 EditorContext，供 header 中的全局组件使用
  useEffect(() => {
    setEditor(editor);
    return () => setEditor(null);
  }, [editor, setEditor]);

  useEffect(() => {
    Editor.normalize(editor, { force: true });
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
  const handleChange = useCallback(() => {
    console.warn('onChange', editor.children, editor);
  }, [editor]);

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
                fontFamily: globalFont,
              }}
            >
              <Editable
                className="caret-theme"
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
