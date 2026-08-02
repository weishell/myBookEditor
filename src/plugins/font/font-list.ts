// 字体定义与列表
//
// 分两类：
//   - system: 系统已装字体，零下载，直接用 CSS font-family 引用
//   - web:    项目自带的 woff2 字体文件，首次使用时通过 font-loader 加载并缓存到 IndexedDB
//
// 新增字体：在 FONT_LIST 追加一项，web 类需要 import 字体文件 URL
import { BlockElementType } from '@/enums';

// 金书宋、东方大楷两个 web 字体文件（Vite 会处理为带 hash 的 URL）
import jinshusongUrl from '@/assets/fonts/ChillJinshuSongGBKTextRegular.woff2';
import dongfangdakaiUrl from '@/assets/fonts/AlimamaDongFangDaKai-Regular.woff2';

export type FontCategory = 'system' | 'web';

export interface FontDefinition {
  /** 字体唯一 id，用作 i18n key 后缀和 IndexedDB key */
  id: string;
  /** CSS font-family 值 */
  family: string;
  /** web 字体文件 URL；system 字体留空 */
  url?: string;
  /** 字体来源 */
  category: FontCategory;
}

/**
 * 内置字体列表
 * - 默认（继承）放在第一项，family 为 inherit 表示不覆盖
 * - 系统字体覆盖常见中文字体名，兼容跨平台 fallback
 * - web 字体使用项目自带 woff2 文件
 */
export const FONT_LIST: FontDefinition[] = [
  { id: 'default', family: 'inherit', category: 'system' },
  { id: 'songti', family: '"SimSun", "Songti SC", "STSong", serif', category: 'system' },
  { id: 'heiti', family: '"SimHei", "Heiti SC", "STHeiti", sans-serif', category: 'system' },
  { id: 'kaiti', family: '"KaiTi", "Kaiti SC", "STKaiti", serif', category: 'system' },
  { id: 'fangsong', family: '"FangSong", "STFangsong", serif', category: 'system' },
  { id: 'yahei', family: '"Microsoft YaHei", "微软雅黑", sans-serif', category: 'system' },
  {
    id: 'jinshusong',
    family: '"ChillJinshuSong", "金书宋", serif',
    url: jinshusongUrl,
    category: 'web',
  },
  {
    id: 'dongfangdakai',
    family: '"AlimamaDongFangDaKai", "东方大楷", serif',
    url: dongfangdakaiUrl,
    category: 'web',
  },
];

/** 默认字体（继承） */
export const DEFAULT_FONT_ID = 'default';

/** 根据 id 查字体定义 */
export function getFontById(id: string): FontDefinition | undefined {
  return FONT_LIST.find((f) => f.id === id);
}

/**
 * 支持设置字体的块类型（"文本叶子 block"）
 * 容器节点（table / table-row）不在此列，字体设在 cell 内的 paragraph 上。
 */
export const FONT_SUPPORTED_BLOCK_TYPES: BlockElementType[] = [
  BlockElementType.PARAGRAPH,
  BlockElementType.HEADING,
  BlockElementType.BLOCKQUOTE,
  BlockElementType.CODE_BLOCK,
  BlockElementType.CODE_LINE,
  BlockElementType.LIST_ITEM,
  BlockElementType.TODO_LIST,
  BlockElementType.TABLE_CELL,
];
