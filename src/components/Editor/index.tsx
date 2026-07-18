import { useMemo, useCallback } from 'react';
import { createEditor } from 'slate';
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
  ListItem,
  NumberedList,
  BulletedList,
  Leaf,
  MenuProvider,
  ContextMenu,
  SelectionProvider,
  DocBarProvider,
  DocBar,
} from '@/plugins';
import { BlockElementType } from '@/enums';
import { initialValue } from '@/utils/initial-value';
import { createKeyboardHandler } from '@/events/keyboard';
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
      return <CodeBlock attributes={attributes} children={children} pluginId={el.id} />;
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
  return <Leaf {...props} />;
};

export default function Editor() {
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  const handleKeyDown = useCallback(createKeyboardHandler(editor), [editor]);

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
                onKeyDown={handleKeyDown}
              />
            </div>
          </DocBarProvider>
        </MenuProvider>
      </SelectionProvider>
    </Slate>
  );
}
