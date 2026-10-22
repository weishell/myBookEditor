// 文章接口：只做参数取出与响应，业务在 services/articles.service.js
import * as articlesService from '../services/articles.service.js';

export function list(req, res) {
  res.json(articlesService.listArticles(req.query));
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

export function remove(req, res) {
  res.json(articlesService.removeArticle(req.params.id));
}
