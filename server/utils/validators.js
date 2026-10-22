// 入参校验与清洗：把「什么样的值算合法」集中到这里，controller / service 直接复用
import path from 'node:path';
import { badRequest } from './http-error.js';

/** 允许作为资源 id 的字符（uuid / 短横线 / 下划线 / 字母数字） */
export function assertSafeId(id) {
  if (!/^[A-Za-z0-9_-]{1,64}$/.test(String(id ?? ''))) {
    throw badRequest('非法 id');
  }
  return String(id);
}

/** 颜色只接受 #rgb / #rrggbb，其余回退到默认色 */
export function cleanColor(value, fallback = '#2f6fed') {
  const text = String(value ?? '').trim();
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(text) ? text : fallback;
}

/** 图标：单个 emoji 或短文本，最长 4 个字符 */
export function cleanIcon(value, fallback = '📄') {
  const text = String(value ?? '').trim();
  if (!text) return fallback;
  return Array.from(text).slice(0, 4).join('');
}

/** 描述：去掉换行，长度上限 80 */
export function cleanDesc(value, fallback = '') {
  const text = String(value ?? '')
    .replace(/\s+/g, ' ')
    .trim();
  if (!text) return fallback;
  return text.slice(0, 80);
}

/** 名称：非空、去首尾空格、长度上限 40 */
export function cleanName(value, label = '名称') {
  const text = String(value ?? '').trim();
  if (!text) throw badRequest(`${label}不能为空`);
  if (text.length > 40) throw badRequest(`${label}过长（最多 40 字）`);
  return text;
}

/** 名称唯一校验（分类 / 标签共用），excludeId 用于重命名时排除自身 */
export function assertUniqueName(list, name, label, excludeId = '') {
  const taken = list.some((item) => item.name === name && item.id !== excludeId);
  if (taken) throw badRequest(`${label}「${name}」已存在`);
  return name;
}

/** 封面地址：沿用前端既有约定——必须以 media/ 开头的相对地址，空值表示清除 */
export function normalizeCover(value) {
  if (value === null || value === undefined || value === '') return null;
  const text = String(value).trim();
  if (!text.startsWith('media/')) throw badRequest('封面必须是 media/ 开头的相对地址');
  return text;
}

/** 生成安全文件名：保留中文与常见符号，去掉路径分隔符，限制长度 */
export function safeFileName(rawName, fallbackExt = '.bin') {
  const decoded = decodeURIComponent(String(rawName || 'untitled'));
  const ext = path.extname(decoded).toLowerCase() || fallbackExt;
  const base = path
    .basename(decoded, ext)
    .replace(/[^\w\u4e00-\u9fa5-]/g, '_')
    .slice(0, 48);
  return { base: base || 'file', ext };
}
