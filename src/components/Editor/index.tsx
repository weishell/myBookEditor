import { useMemo, useCallback, useEffect } from 'react';
import { createEditor, Editor as SlateEditor } from 'slate';
import {
  Slate,
  Editable,
  withReact,
  type RenderElementProps,
  type RenderLeafProps,
} from 'slate-react';
import { withHistory } from 'slate-history';
import {
  HeadingOne,
  HeadingTwo,
  HeadingThree,
  Paragraph,
  Blockquote,
  CodeBlock,
  CodeLine,
  withCodeBlock,
  ListItem,
  NumberedList,
  BulletedList,
  MenuProvider,
  ContextMenu,
  SelectionProvider,
  DocBarProvider,
  DocBar,
} from '@/plugins';
import { BlockElementType } from '@/enums';
import { initialValue } from '@/utils/initial-value';
import { createKeyboardHandler } from '@/events/keyboard';
import { codeDecorate, CODE_TOKEN_COLORS } from '@/utils/code-decoration';
import FloatBar from '@/components/FloatBar';

const renderElement = ({ element, attributes, children }: RenderElementProps) => {
  const el = element as { type?: BlockElementType; id?: string; children: unknown[] };

  switch (el.type) {
    case BlockElementType.HEADING_ONE:
      return <HeadingOne attributes={attributes} children={children} pluginId={el.id} />;
    case BlockElementType.HEADING_TWO:
      return <HeadingTwo attributes={attributes} children={children} pluginId={el.id} />;
    case BlockElementType.HEADING_THREE:
      return <HeadingThree attributes={attributes} children={children} pluginId={el.id} />;
    case BlockElementType.BLOCKQUOTE:
      return <Blockquote attributes={attributes} children={children} pluginId={el.id} />;
    case BlockElementType.CODE_BLOCK:
      return (
        <CodeBlock attributes={attributes} children={children} pluginId={el.id} element={el} />
      );
    case BlockElementType.CODE_LINE:
      return <CodeLine attributes={attributes} children={children} pluginId={el.id} element={el} />;
    case BlockElementType.LIST_ITEM:
      return <ListItem attributes={attributes} children={children} pluginId={el.id} />;
    case BlockElementType.NUMBERED_LIST:
      return <NumberedList attributes={attributes} children={children} pluginId={el.id} />;
    case BlockElementType.BULLETED_LIST:
      return <BulletedList attributes={attributes} children={children} pluginId={el.id} />;
    default:
      return <Paragraph attributes={attributes} children={children} pluginId={el.id} />;
  }
};

const renderLeaf = (props: RenderLeafProps) => {
  const { attributes, children, leaf } = props;

  let codeColor: string | undefined;
  for (const tokenType of Object.keys(CODE_TOKEN_COLORS)) {
    const type = tokenType.replace('token ', '');
    if (leaf[type as keyof typeof leaf]) {
      codeColor = CODE_TOKEN_COLORS[tokenType];
      break;
    }
  }

  const style: React.CSSProperties = {};
  // 用户手动设置的颜色优先级高于代码高亮
  if ((leaf as any).color) {
    style.color = (leaf as any).color;
  } else if (codeColor) {
    style.color = codeColor;
  } else {
    style.color = '#333';
  }
  // 高亮背景色
  if ((leaf as any).highlight) {
    style.backgroundColor = (leaf as any).highlight;
  }
  // 其他格式
  if ((leaf as any).bold) style.fontWeight = 'bold';
  if ((leaf as any).italic) style.fontStyle = 'italic';
  if ((leaf as any).underline) style.textDecoration = 'underline';
  if ((leaf as any).strikethrough) style.textDecoration = 'line-through';

  return (
    <span {...attributes} style={style}>
      {children}
    </span>
  );
};

export default function Editor() {
  const editor = useMemo(() => withCodeBlock(withHistory(withReact(createEditor()))), []);

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
                maxWidth: '800px',
                margin: '0 auto',
                padding: '40px 48px 40px 72px',
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
