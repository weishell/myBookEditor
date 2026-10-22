// 统一错误处理：service 抛出的 HttpError 带 status，未预期的异常一律 500 并打日志
// 注意：错误响应固定 { error: string }，前端 fetchJson 就是按这个字段取提示的
export function notFoundHandler(req, res) {
  res.status(404).json({ error: `未知接口 ${req.method} ${req.originalUrl}` });
}

export function errorHandler(err, _req, res, next) {
  if (res.headersSent) return next(err);

  // express 内置 body 解析器的错误（超限 / JSON 非法）
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ error: '请求体过大（上限 20MB）' });
  }
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: '请求体不是合法 JSON' });
  }

  const status = Number(err.status) || 500;
  if (status >= 500) console.error('[api]', err);
  res.status(status).json({ error: err.message || '服务器内部错误' });
}
