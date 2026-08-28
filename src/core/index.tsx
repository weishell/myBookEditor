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
import CommentSection from '@/components/comments/CommentSection';
import {
  MenuProvider,
  ContextMenu,
  SelectionProvider,
  DocBarProvider,
  DocBar,
  withInlineFormula,
  withMention,
  withHyperlink,
  MentionController,
} from '@/plugins';
import {
  withCodeBlock,
  withMarkdownShortcuts,
  withEditorBehaviors,
  withDelete,
} from '@/editor-extensions';
import { withColumns } from '@/plugins';
import { initialValue } from '@/utils/initial-value';
import { createKeyDownHandler } from '@/events/keyboard';
import { codeDecorate } from '@/utils/code-decoration';
import FloatBar from '@/components/FloatBar';
import { useEditorMode } from '@/context/EditorContext';
import { useTheme } from '@/context/ThemeContext';
import { renderElement } from './renderElement';
import { RenderLeaf } from './renderLeaf';
import { PAGE_WIDTH_NORMAL } from '@/enums';

interface EditorProps {
  readOnly?: boolean;
}

export default function BookEditor({ readOnly = false }: EditorProps) {
  const { setEditor, globalFont } = useEditorMode();
  const { isDarkMode } = useTheme();
  const editor = useMemo(
    () =>
      withDelete(
        withEditorBehaviors(
          withHyperlink(
            withColumns(
              withMention(
                withInlineFormula(
                  withMarkdownShortcuts(withCodeBlock(withHistory(withReact(createEditor())))),
                ),
              ),
            ),
          ),
        ),
      ),
    [],
  );

  // 把 editor 实例注册到 EditorContext，供 header 中的全局组件使用；
  // 同时挂到 window/globalThis，调试时可在控制台直接打印 window.editor 看数据结构
  useEffect(() => {
    setEditor(editor);
    (window as any).editor = editor;
    (globalThis as any).editor = editor;
    return () => {
      setEditor(null);
      delete (window as any).editor;
      delete (globalThis as any).editor;
    };
  }, [editor, setEditor]);

  useEffect(() => {
    Editor.normalize(editor, { force: true });
  }, [editor]);

  const keyboardHandler = useMemo(() => createKeyDownHandler(editor), [editor]);
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!readOnly) {
        keyboardHandler(e);
      }
    },
    [keyboardHandler, readOnly],
  );
  // onChange 不再打印 editor 数据；需要看数据结构时控制台直接打 window.editor
  const handleChange = useCallback(() => {
    /* no-op */
  }, []);

  return (
    <Slate editor={editor} initialValue={initialValue} onChange={handleChange}>
      <SelectionProvider>
        <MenuProvider>
          {!readOnly && <FloatBar />}
          {!readOnly && <ContextMenu />}
          {!readOnly && <MentionController isDark={isDarkMode} />}
          <DocBarProvider>
            <DocBar />
            <div
              style={{
                maxWidth: PAGE_WIDTH_NORMAL,
                margin: '0 auto',
                padding: '40px 50px',
                // 暗黑模式：编辑纸去掉背景和边框，让底层壁纸透出来
                border: isDarkMode ? 'none' : '1px solid #e8e8e8',
                borderRadius: '8px',
                backgroundColor: isDarkMode ? 'transparent' : '#fff',
                boxShadow: isDarkMode ? 'none' : undefined,
                minHeight: '500px',
                pointerEvents: readOnly ? 'none' : 'auto',
                fontFamily: globalFont,
                transition: 'background-color 0.2s, border-color 0.2s, box-shadow 0.2s',
              }}
            >
              <Editable
                className="caret-theme"
                renderElement={renderElement}
                renderLeaf={RenderLeaf}
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
            {/* 全文评论：位于内容纸张下方，编辑/阅读模式均可交互 */}
            <CommentSection />
          </DocBarProvider>
        </MenuProvider>
      </SelectionProvider>
    </Slate>
  );
}
