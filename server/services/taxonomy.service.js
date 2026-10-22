// 分类 / 标签业务层：改 meta.json（真相）→ 同步索引
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { COVERS_DIR } from '../config.js';
import * as repo from '../repositories/taxonomy.repo.js';
import * as articleRepo from '../repositories/articles.repo.js';
import { readMetaFile, writeMetaFile } from '../storage/meta-file.js';
import { badRequest, conflict, notFound } from '../utils/http-error.js';
import {
  assertSafeId,
  assertUniqueName,
  cleanColor,
  cleanDesc,
  cleanIcon,
  cleanName,
  normalizeCover,
} from '../utils/validators.js';

const PALETTE = [
  '#2f6fed',
  '#00a66c',
  '#7c3aed',
  '#e05b3f',
  '#d4a017',
  '#c026a5',
  '#0ea5e9',
  '#14b8a6',
];

const newId = (prefix) => `${prefix}_${crypto.randomUUID().slice(0, 8)}`;

/** 写文件 + 同步索引，返回前端期望的 { categories, tags, ... } */
function persist(meta, extra = {}) {
  writeMetaFile(meta);
  repo.replaceTaxonomy(meta);
  return { categories: repo.findCategories(), tags: repo.findTags(), ...extra };
}

export function getMeta(extra = {}) {
  return { categories: repo.findCategories(), tags: repo.findTags(), ...extra };
}

/* ---------------- 分类 ---------------- */
export function createCategory(body = {}) {
  const meta = readMetaFile();
  const name = assertUniqueName(meta.categories, cleanName(body.name, '分类名称'), '分类');

  const category = {
    id: newId('cat'),
    name,
    color: cleanColor(body.color, PALETTE[meta.categories.length % PALETTE.length]),
    icon: cleanIcon(body.icon),
    desc: cleanDesc(body.desc),
    cover: null,
  };
  meta.categories.push(category);
  return persist(meta, { category });
}

export function updateCategory(id, body = {}) {
  assertSafeId(id);
  const meta = readMetaFile();
  const index = meta.categories.findIndex((c) => c.id === id);
  if (index < 0) throw notFound('分类不存在');

  const current = meta.categories[index];
  const next = {
    ...current,
    name:
      body.name === undefined
        ? current.name
        : assertUniqueName(meta.categories, cleanName(body.name, '分类名称'), '分类', id),
    color: body.color === undefined ? current.color : cleanColor(body.color, current.color),
    icon: body.icon === undefined ? current.icon : cleanIcon(body.icon, current.icon ?? '📄'),
    desc: body.desc === undefined ? current.desc : cleanDesc(body.desc),
    cover: body.cover === undefined ? (current.cover ?? null) : normalizeCover(body.cover),
  };
  meta.categories[index] = next;
  return persist(meta, { category: next });
}

export function deleteCategory(id) {
  assertSafeId(id);
  const meta = readMetaFile();
  const category = meta.categories.find((c) => c.id === id);
  if (!category) throw notFound('分类不存在');

  const used = articleRepo.countByCategory(id);
  if (used > 0) {
    throw conflict(`「${category.name}」下还有 ${used} 篇文档，先把它们改到别的分类`);
  }

  meta.categories = meta.categories.filter((c) => c.id !== id);
  return persist(meta);
}

/* ---------------- 标签 ---------------- */
export function createTag(body = {}) {
  const meta = readMetaFile();
  const name = assertUniqueName(meta.tags, cleanName(body.name, '标签名称'), '标签');

  const tag = {
    id: newId('tag'),
    name,
    color: cleanColor(body.color, PALETTE[meta.tags.length % PALETTE.length]),
  };
  meta.tags.push(tag);
  return persist(meta, { tag });
}

export function updateTag(id, body = {}) {
  assertSafeId(id);
  const meta = readMetaFile();
  const index = meta.tags.findIndex((t) => t.id === id);
  if (index < 0) throw notFound('标签不存在');

  const current = meta.tags[index];
  const next = {
    ...current,
    name:
      body.name === undefined
        ? current.name
        : assertUniqueName(meta.tags, cleanName(body.name, '标签名称'), '标签', id),
    color: body.color === undefined ? current.color : cleanColor(body.color, current.color),
  };
  meta.tags[index] = next;
  return persist(meta, { tag: next });
}

export function deleteTag(id) {
  assertSafeId(id);
  const meta = readMetaFile();
  const tag = meta.tags.find((t) => t.id === id);
  if (!tag) throw notFound('标签不存在');

  const used = articleRepo.countByTag(id);
  if (used > 0) throw conflict(`「${tag.name}」还有 ${used} 篇文档在用，先解除引用再删除`);

  meta.tags = meta.tags.filter((t) => t.id !== id);
  return persist(meta);
}

/* ---------------- 封面上传 ---------------- */
const ALLOWED_IMAGE_EXT = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg']);

export function saveCategoryCover(id, rawName, buffer) {
  assertSafeId(id);
  const meta = readMetaFile();
  const index = meta.categories.findIndex((c) => c.id === id);
  if (index < 0) throw notFound('分类不存在');
  if (!buffer?.length) throw badRequest('空文件');

  const ext = (path.extname(decodeURIComponent(String(rawName || ''))) || '.png').toLowerCase();
  const safeExt = ALLOWED_IMAGE_EXT.has(ext) ? ext : '.png';
  const fileName = `${id}-${Date.now()}${safeExt}`;

  fs.mkdirSync(COVERS_DIR, { recursive: true });
  fs.writeFileSync(path.join(COVERS_DIR, fileName), buffer);

  const cover = `media/images/covers/${fileName}`;
  const next = { ...meta.categories[index], cover };
  meta.categories[index] = next;
  return persist(meta, { category: next });
}
