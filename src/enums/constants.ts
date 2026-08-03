// 编辑器全局常量

// 零宽空格 - 用于代码块空行占位，防止 Slate normalize 清理空节点
export const ZERO_WIDTH_SPACE = '\u200B';

// 回到顶部按钮出现阈值（单位 px）
export const BACK_TO_TOP_THRESHOLD = 300;

// 标准页面宽度
export const PAGE_WIDTH_NORMAL = '1000px';
// 较宽页面宽度
export const PAGE_WIDTH_WIDE = '1200px';
// 较窄页面宽度
export const PAGE_WIDTH_NARROW = '800px';

// 主题类型定义
export interface EditorTheme {
  // 主题标识
  id: string;
  name: string;

  // 主色调
  primary: string;
  success: string;
  warning: string;
  danger: string;
  purple: string;

  // 文本颜色
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;

  // 背景颜色
  background: string;
  backgroundHover: string;
  backgroundLight: string;

  // 边框颜色
  border: string;
  borderLight: string;

  // 阴影
  shadow: string;
  shadowLarge: string;

  // 字体大小
  fontSizeXS: string;
  fontSizeSM: string;
  fontSizeBase: string;
  fontSizeMD: string;
  fontSizeLG: string;
  fontSizeXL: string;
  fontSize2XL: string;
  fontSize3XL: string;
  fontSize4XL: string;
}

// 主题方案 A - 默认蓝色（飞书风格）
export const ThemeA: EditorTheme = {
  id: 'theme-a',
  name: '默认',
  primary: '#1890ff',
  success: '#52c41a',
  warning: '#faad14',
  danger: '#f5222d',
  purple: '#722ed1',
  textPrimary: '#333',
  textSecondary: '#666',
  textTertiary: '#999',
  background: '#fff',
  backgroundHover: '#f5f5f5',
  backgroundLight: '#f3f4f6',
  border: '#e8e8e8',
  borderLight: '#e5e7eb',
  shadow: '0 2px 8px rgba(0,0,0,0.15)',
  shadowLarge: '0 4px 16px rgba(0,0,0,0.15)',
  fontSizeXS: '11px',
  fontSizeSM: '12px',
  fontSizeBase: '13px',
  fontSizeMD: '14px',
  fontSizeLG: '16px',
  fontSizeXL: '18px',
  fontSize2XL: '20px',
  fontSize3XL: '24px',
  fontSize4XL: '32px',
};

// 主题方案 B - 科技深蓝
export const ThemeB: EditorTheme = {
  id: 'theme-b',
  name: '科技蓝',
  primary: '#0050b3',
  success: '#389e0d',
  warning: '#d48806',
  danger: '#cf1322',
  purple: '#531dab',
  textPrimary: '#1f1f1f',
  textSecondary: '#434343',
  textTertiary: '#8c8c8c',
  background: '#fff',
  backgroundHover: '#f0f5ff',
  backgroundLight: '#e6f7ff',
  border: '#d9d9d9',
  borderLight: '#f0f0f0',
  shadow: '0 2px 8px rgba(0,0,0,0.12)',
  shadowLarge: '0 4px 16px rgba(0,0,0,0.12)',
  fontSizeXS: '11px',
  fontSizeSM: '12px',
  fontSizeBase: '13px',
  fontSizeMD: '14px',
  fontSizeLG: '16px',
  fontSizeXL: '18px',
  fontSize2XL: '20px',
  fontSize3XL: '24px',
  fontSize4XL: '32px',
};

// 主题方案 C - 优雅绿
export const ThemeC: EditorTheme = {
  id: 'theme-c',
  name: '优雅绿',
  primary: '#00b42a',
  success: '#52c41a',
  warning: '#faad14',
  danger: '#f5222d',
  purple: '#722ed1',
  textPrimary: '#262626',
  textSecondary: '#595959',
  textTertiary: '#8c8c8c',
  background: '#fff',
  backgroundHover: '#f6ffed',
  backgroundLight: '#f0fff0',
  border: '#e8e8e8',
  borderLight: '#f0f0f0',
  shadow: '0 2px 8px rgba(0,0,0,0.1)',
  shadowLarge: '0 4px 16px rgba(0,0,0,0.1)',
  fontSizeXS: '11px',
  fontSizeSM: '12px',
  fontSizeBase: '13px',
  fontSizeMD: '14px',
  fontSizeLG: '16px',
  fontSizeXL: '18px',
  fontSize2XL: '20px',
  fontSize3XL: '24px',
  fontSize4XL: '32px',
};

// 主题方案 D - 温暖橙
export const ThemeD: EditorTheme = {
  id: 'theme-d',
  name: '温暖橙',
  primary: '#fa8c16',
  success: '#52c41a',
  warning: '#faad14',
  danger: '#f5222d',
  purple: '#722ed1',
  textPrimary: '#3d3d3d',
  textSecondary: '#666666',
  textTertiary: '#999999',
  background: '#fff',
  backgroundHover: '#fff7e6',
  backgroundLight: '#fffaf0',
  border: '#e8e8e8',
  borderLight: '#f0f0f0',
  shadow: '0 2px 8px rgba(0,0,0,0.1)',
  shadowLarge: '0 4px 16px rgba(0,0,0,0.1)',
  fontSizeXS: '11px',
  fontSizeSM: '12px',
  fontSizeBase: '13px',
  fontSizeMD: '14px',
  fontSizeLG: '16px',
  fontSizeXL: '18px',
  fontSize2XL: '20px',
  fontSize3XL: '24px',
  fontSize4XL: '32px',
};

// 主题方案集合
export const EditorThemes: EditorTheme[] = [ThemeA, ThemeB, ThemeC, ThemeD];

// 默认主题
export const DefaultTheme = ThemeA;

// 获取主题方法
export const getThemeById = (id: string): EditorTheme => {
  return EditorThemes.find((theme) => theme.id === id) || DefaultTheme;
};

// 块元素图标颜色映射（基于主题 primary 色）
export const BlockIconColors: Record<string, string> = {
  heading: ThemeA.primary,
  paragraph: ThemeA.primary,
  blockquote: ThemeA.warning,
  code_block: ThemeA.purple,
  bulleted_list: ThemeA.success,
  numbered_list: ThemeA.success,
  list_item: ThemeA.success,
};
