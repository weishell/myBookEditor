import type { RenderElementProps } from 'slate-react';
import {
  HeadingTitle,
  Heading,
  Paragraph,
  Blockquote,
  CodeBlock,
  CodeLine,
  ListItem,
  NumberedList,
  BulletedList,
  Image,
  MediaBlock,
  Divider,
  TodoList,
  Table,
  TableRow,
  TableCell,
  Drawio,
  Formula,
  Mention,
  Countdown,
  ColumnGroup,
  Column,
  Calendar,
  Timeline,
} from '@/plugins';
import { BlockElementType } from '@/enums';

export const renderElement = ({ element, attributes, children }: RenderElementProps) => {
  const el = element as { type?: BlockElementType; id?: string; children: unknown[]; attrs?: any };

  switch (el.type) {
    case BlockElementType.HEADING_TITLE:
      return (
        <HeadingTitle attributes={attributes} children={children} pluginId={el.id} element={el} />
      );
    case BlockElementType.HEADING:
      return <Heading attributes={attributes} children={children} pluginId={el.id} element={el} />;
    case BlockElementType.BLOCKQUOTE:
      return (
        <Blockquote attributes={attributes} children={children} pluginId={el.id} element={el} />
      );
    case BlockElementType.CODE_BLOCK:
      return (
        <CodeBlock attributes={attributes} children={children} pluginId={el.id} element={el} />
      );
    case BlockElementType.CODE_LINE:
      return <CodeLine attributes={attributes} children={children} />;
    case BlockElementType.LIST_ITEM:
      return (
        <ListItem attributes={attributes} children={children} pluginId={el.id} element={element} />
      );
    case BlockElementType.NUMBERED_LIST:
      return (
        <NumberedList
          attributes={attributes}
          children={children}
          pluginId={el.id}
          element={element}
        />
      );
    case BlockElementType.BULLETED_LIST:
      return (
        <BulletedList
          attributes={attributes}
          children={children}
          pluginId={el.id}
          element={element}
        />
      );
    case BlockElementType.IMAGE_BLOCK:
      return (
        <Image
          attributes={attributes}
          children={children}
          pluginId={el.id || ''}
          element={el as any}
        />
      );
    case BlockElementType.DIVIDER:
      return (
        <Divider attributes={attributes} children={children} pluginId={el.id} element={el as any} />
      );
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
    case BlockElementType.DRAWIO:
      return (
        <Drawio
          attributes={attributes}
          children={children}
          pluginId={el.id || ''}
          element={el as any}
        />
      );
    case BlockElementType.FORMULA:
      return <Formula attributes={attributes} element={el as any} readOnly={false} />;
    case BlockElementType.MENTION:
      return <Mention attributes={attributes} element={el as any} readOnly={false} />;
    case BlockElementType.COUNTDOWN:
      return (
        <Countdown
          attributes={attributes}
          children={children}
          pluginId={el.id || ''}
          element={el as any}
        />
      );
    case BlockElementType.FILE_BLOCK:
    case BlockElementType.VIDEO_BLOCK:
      return (
        <MediaBlock
          attributes={attributes}
          children={children}
          pluginId={el.id || ''}
          element={el as any}
        />
      );
    case BlockElementType.COLUMN_GROUP:
      return (
        <ColumnGroup
          attributes={attributes}
          children={children}
          pluginId={el.id}
          element={el as any}
        />
      );
    case BlockElementType.COLUMN:
      return (
        <Column attributes={attributes} children={children} pluginId={el.id} element={el as any} />
      );
    case BlockElementType.CALENDAR:
      return (
        <Calendar
          attributes={attributes}
          children={children}
          pluginId={el.id || ''}
          element={el as any}
        />
      );
    case BlockElementType.TIMELINE:
      return (
        <Timeline
          attributes={attributes}
          children={children}
          pluginId={el.id || ''}
          element={el as any}
        />
      );
    default:
      return (
        <Paragraph attributes={attributes} children={children} pluginId={el.id} element={el} />
      );
  }
};
