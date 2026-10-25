// 全文评论业务层：只做校验与读写，存储细节在 storage/comment-files.js
import { readComments, writeComments } from '../storage/comment-files.js';
import { badRequest } from '../utils/http-error.js';
import { assertSafeId } from '../utils/validators.js';

export function getComments(articleId) {
  assertSafeId(articleId);
  return { comments: readComments(articleId) };
}

export function saveComments(articleId, body = {}) {
  assertSafeId(articleId);
  const comments = Array.isArray(body) ? body : body.comments;
  if (!Array.isArray(comments)) throw badRequest('comments 必须是数组');
  writeComments(articleId, comments);
  return { ok: true, comments };
}
