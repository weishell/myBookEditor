// 分类 / 标签接口
import * as taxonomyService from '../services/taxonomy.service.js';

export function meta(_req, res) {
  res.json(taxonomyService.getMeta());
}

/* ---------------- 分类 ---------------- */
export function createCategory(req, res) {
  res.status(201).json(taxonomyService.createCategory(req.body));
}

export function updateCategory(req, res) {
  res.json(taxonomyService.updateCategory(req.params.id, req.body));
}

export function deleteCategory(req, res) {
  res.json(taxonomyService.deleteCategory(req.params.id));
}

/** 封面：请求体是图片原始字节，文件名走 X-Filename 头 */
export function uploadCover(req, res) {
  res.json(taxonomyService.saveCategoryCover(req.params.id, req.get('X-Filename'), req.body));
}

/* ---------------- 标签 ---------------- */
export function createTag(req, res) {
  res.status(201).json(taxonomyService.createTag(req.body));
}

export function updateTag(req, res) {
  res.json(taxonomyService.updateTag(req.params.id, req.body));
}

export function deleteTag(req, res) {
  res.json(taxonomyService.deleteTag(req.params.id));
}
