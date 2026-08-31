// 块节点构造工具 - 用于"在下方插入"等功能
// 根据块类型构造符合编辑器数据结构的节点（含 id、attrs、children 结构）
import { Element } from 'slate';
import { BlockElementType, LilistType, ZERO_WIDTH_SPACE } from '@/enums';
import { v4 as uuidv4 } from 'uuid';
import { createColumnGroup } from '@/plugins/columns';

export interface InsertBlockOptions {
  level?: number;
  columns?: number;
}

/** 文本类块类型集合（用于判断"在下方插入"是否可用） */
export const TEXT_BLOCK_TYPES: BlockElementType[] = [
  BlockElementType.PARAGRAPH,
  BlockElementType.HEADING,
  BlockElementType.HEADING_TITLE,
  BlockElementType.BLOCKQUOTE,
  BlockElementType.CODE_BLOCK,
  BlockElementType.LIST_ITEM,
  BlockElementType.BULLETED_LIST,
  BlockElementType.NUMBERED_LIST,
  BlockElementType.TODO_LIST,
];

export const isTextBlockType = (type?: string): type is BlockElementType =>
  !!type && TEXT_BLOCK_TYPES.includes(type as BlockElementType);

/** 构造可插入的块节点 */
export const createBlockNode = (type: BlockElementType, options?: InsertBlockOptions): Element => {
  const id = uuidv4();
  switch (type) {
    case BlockElementType.HEADING:
      return {
        type,
        id,
        attrs: { level: options?.level ?? 2 },
        children: [{ text: '' }],
      } as Element;
    case BlockElementType.BLOCKQUOTE:
      return {
        type,
        id,
        attrs: { type: 'info', label: '说明' },
        children: [{ text: '' }],
      } as Element;
    case BlockElementType.CODE_BLOCK:
      return {
        type,
        id,
        attrs: { language: 'javascript', wrap: true, height: 150 },
        children: [
          {
            type: BlockElementType.CODE_LINE,
            id: `${id}-line-0`,
            children: [{ text: '' }, { text: ZERO_WIDTH_SPACE }],
          },
        ],
      } as Element;
    case BlockElementType.TODO_LIST:
      return {
        type,
        id,
        attrs: { checked: false },
        children: [{ text: '' }],
      } as Element;
    case BlockElementType.COUNTDOWN:
      return {
        type,
        id,
        attrs: {
          mode: 'duration',
          duration: { days: 0, hours: 0, minutes: 0, seconds: 0 },
          targetDate: null,
          notify: true,
        },
        children: [{ text: ZERO_WIDTH_SPACE }],
      } as Element;
    case BlockElementType.FILE_BLOCK:
      return {
        type,
        id,
        attrs: {
          kind: 'file',
          src: '/sample.txt',
          name: 'sample.txt',
          size: 0,
          mimeType: 'text/plain',
          layer: 'card',
        },
        children: [{ text: '' }],
      } as Element;
    case BlockElementType.VIDEO_BLOCK:
      return {
        type,
        id,
        attrs: {
          kind: 'video',
          src: '',
          name: '新建视频.mp4',
          size: 0,
          mimeType: 'video/mp4',
          layer: 'card',
        },
        children: [{ text: '' }],
      } as Element;
    case BlockElementType.COLUMN_GROUP:
      return createColumnGroup(options?.columns ?? 2);
    case BlockElementType.BULLETED_LIST:
    case BlockElementType.NUMBERED_LIST: {
      // 列表已改为绑定在段落上的 lilist 属性（旧 wrapper 类型废弃）
      // 四字段必填；新建列表首项为自定义锚点（list_custom: true）
      return {
        type: BlockElementType.PARAGRAPH,
        id,
        attrs: {
          lilist: {
            list_type: type === BlockElementType.NUMBERED_LIST ? LilistType.OL : LilistType.UL,
            list_id: uuidv4(),
            list_number: 1,
            list_custom: true,
          },
        },
        children: [{ text: '' }],
      } as Element;
    }
    default:
      return { type, id, children: [{ text: '' }] } as Element;
  }
};
