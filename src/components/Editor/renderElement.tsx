import type { RenderElementProps } from 'slate-react';
import {
  Heading,
  Paragraph,
  Blockquote,
  CodeBlock,
  CodeLine,
  ListItem,
  NumberedList,
  BulletedList,
  Image,
  Divider,
  TodoList,
  Table,
  TableRow,
  TableCell,
} from '@/plugins';
import { BlockElementType } from '@/enums';

export const renderElement = ({ element, attributes, children }: RenderElementProps) => {
  const el = element as { type?: BlockElementType; id?: string; children: unknown[]; attrs?: any };

  switch (el.type) {
    case BlockElementType.HEADING:
      return <Heading attributes={attributes} children={children} pluginId={el.id} element={el} />;
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
    case BlockElementType.IMAGE_BLOCK:
      return (
        <Image attributes={attributes} pluginId={el.id || ''} element={el as { attrs: any }} />
      );
    case BlockElementType.DIVIDER:
      return <Divider attributes={attributes} pluginId={el.id} />;
    case BlockElementType.TODO_LIST:
      return <TodoList attributes={attributes} children={children} pluginId={el.id} element={el} />;
    case BlockElementType.TABLE:
      return (
        <Table attributes={attributes} children={children} pluginId={el.id} element={el as any} />
      );
    case BlockElementType.TABLE_ROW:
      return (
        <TableRow
          attributes={attributes}
          children={children}
          pluginId={el.id}
          element={el as any}
        />
      );
    case BlockElementType.TABLE_CELL:
      return (
        <TableCell
          attributes={attributes}
          children={children}
          pluginId={el.id}
          element={el as any}
        />
      );
    default:
      return <Paragraph attributes={attributes} children={children} pluginId={el.id} />;
  }
};
