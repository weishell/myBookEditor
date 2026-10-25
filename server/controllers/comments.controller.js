// 全文评论接口：只取出参数与响应，业务在 services/comments.service.js
import * as commentsService from '../services/comments.service.js';

export function list(req, res) {
  res.json(commentsService.getComments(req.params.articleId));
}

export function save(req, res) {
  res.json(commentsService.saveComments(req.params.articleId, req.body));
}
