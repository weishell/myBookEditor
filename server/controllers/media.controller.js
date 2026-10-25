// 媒体接口：上传 + 静态访问
import fs from 'node:fs';
import * as mediaService from '../services/media.service.js';

/** POST /api/upload?kind=images|files|videos，请求体为原始字节，文件名走 X-Filename */
export function upload(req, res) {
  const result = mediaService.saveUpload(req.query.kind, req.get('X-Filename'), req.body);
  res.json({ ok: true, ...result });
}

/** POST /api/drawboards，JSON 体 { data: Shape[], path?: 相对路径 } */
export function saveDrawboard(req, res) {
  const path = mediaService.saveDrawboard(req.body?.data, req.body?.path);
  res.json({ ok: true, path });
}

/** GET /media/**，直接流式返回文件 */
export function serve(req, res) {
  const relative = req.path.replace(/^\//, '');
  const { file, mime } = mediaService.resolveMediaFile(relative);
  res.writeHead(200, {
    'Content-Type': mime,
    'Cache-Control': 'public, max-age=60',
  });
  fs.createReadStream(file).pipe(res);
}
