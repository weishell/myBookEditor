// 文章接口：只做参数取出与响应，业务在 services/articles.service.js
import * as articlesService from '../services/articles.service.js';

export function list(req, res) {
  res.json(articlesService.listArticles(req.query));
}

/** 全文搜索（含正文） */
export function search(req, res) {
  res.json(articlesService.searchArticles(req.query));
}

export function detail(req, res) {
  res.json(articlesService.getArticle(req.params.id));
}

export function create(req, res) {
  res.status(201).json(articlesService.createArticle(req.body));
}

export function update(req, res) {
  res.json(articlesService.updateArticle(req.params.id, req.body));
}

/** 自动保存：前端只提交正文数组 */
export function autosave(req, res) {
  res.json(articlesService.autosaveArticle(req.params.id, req.body?.content));
}

/** 阅读计数：进入文章页时调用，返回最新阅读量 */
export function recordRead(req, res) {
  res.json(articlesService.incrementReads(req.params.id));
}

export function remove(req, res) {
  res.json(articlesService.removeArticle(req.params.id));
}
