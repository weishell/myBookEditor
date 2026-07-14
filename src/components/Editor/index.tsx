import { useMemo } from 'react';
import { createEditor, type Descendant } from 'slate';
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
import FloatBar from '@/components/FloatBar';

const initialValue: Descendant[] = [
  {
    type: BlockElementType.HEADING_ONE,
    plugin_id: 'heading-one-1',
    children: [{ text: '欢迎使用文档编辑器' }],
  },
  {
    type: BlockElementType.PARAGRAPH,
    plugin_id: 'paragraph-1',
    style: { lineHeight: '1.8' },
    attrs: {
      customData: 'intro-content',
    },
    children: [
      {
        text: '这是一个基于 Slate 构建的文档编辑器。支持富文本编辑，包括标题、段落、列表、引用等功能。',
      },
    ],
  },
  {
    type: BlockElementType.HEADING_TWO,
    plugin_id: 'heading-two-1',
    children: [{ text: '主要功能' }],
  },
  {
    type: BlockElementType.PARAGRAPH,
    plugin_id: 'paragraph-2',
    children: [
      {
        text: '支持多种标题级别、粗体斜体下划线格式化、有序列表和无序列表、代码块和行内代码、引用块等功能。',
      },
    ],
  },
  {
    type: BlockElementType.HEADING_TWO,
    plugin_id: 'heading-two-2',
    children: [{ text: '引用示例' }],
  },
  {
    type: BlockElementType.BLOCKQUOTE,
    plugin_id: 'blockquote-1',
    attrs: {
      cite: 'https://example.com',
    },
    children: [{ text: '这是一段引用文字。引用功能可以用来强调重要内容或引用他人观点。' }],
  },
  {
    type: BlockElementType.HEADING_TWO,
    plugin_id: 'heading-two-3',
    children: [{ text: '代码示例' }],
  },
  {
    type: BlockElementType.CODE_BLOCK,
    plugin_id: 'code-block-1',
    attrs: {
      language: 'javascript',
    },
    children: [{ text: 'console.log("Hello, World!");' }],
  },
  {
    type: BlockElementType.HEADING_THREE,
    plugin_id: 'heading-three-1',
    children: [{ text: '小标题示例' }],
  },
  {
    type: BlockElementType.PARAGRAPH,
    plugin_id: 'paragraph-3',
    children: [
      { text: '你可以使用工具栏中的按钮来格式化文本。选中文字后点击相应的格式按钮即可应用样式。' },
    ],
  },
];

const renderElement = ({ element, attributes, children }: RenderElementProps) => {
  const el = element as { type?: BlockElementType; plugin_id?: string; children: unknown[] };

  switch (el.type) {
    case BlockElementType.HEADING_ONE:
      return <HeadingOne attributes={attributes} children={children} pluginId={el.plugin_id} />;
    case BlockElementType.HEADING_TWO:
      return <HeadingTwo attributes={attributes} children={children} pluginId={el.plugin_id} />;
    case BlockElementType.HEADING_THREE:
      return <HeadingThree attributes={attributes} children={children} pluginId={el.plugin_id} />;
    case BlockElementType.BLOCKQUOTE:
      return <Blockquote attributes={attributes} children={children} pluginId={el.plugin_id} />;
    case BlockElementType.CODE_BLOCK:
      return <CodeBlock attributes={attributes} children={children} pluginId={el.plugin_id} />;
    case BlockElementType.LIST_ITEM:
      return <ListItem attributes={attributes} children={children} pluginId={el.plugin_id} />;
    case BlockElementType.NUMBERED_LIST:
      return <NumberedList attributes={attributes} children={children} pluginId={el.plugin_id} />;
    case BlockElementType.BULLETED_LIST:
      return <BulletedList attributes={attributes} children={children} pluginId={el.plugin_id} />;
    default:
      return <Paragraph attributes={attributes} children={children} pluginId={el.plugin_id} />;
  }
};

const renderLeaf = (props: RenderLeafProps) => {
  return <Leaf {...props} />;
};

export default function Editor() {
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

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
              />
            </div>
          </DocBarProvider>
        </MenuProvider>
      </SelectionProvider>
    </Slate>
  );
}
