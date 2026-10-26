// 媒体接口：上传 + 静态访问
// 静态访问必须支持 HTTP Range（206），否则 <video> 无法拖动进度、Safari 甚至会直接不播：
// 浏览器发 Range: bytes=0- 时，必须回 206 + Content-Range + 精确 Content-Length
import fs from 'node:fs';
import * as mediaService from '../services/media.service.js';
import { saveDrawboard as persistDrawboard } from '../services/drawboard.service.js';

/** POST /api/upload?kind=images|files|videos，请求体为原始字节，文件名走 X-Filename */
export function upload(req, res) {
  const result = mediaService.saveUpload(req.query.kind, req.get('X-Filename'), req.body);
  res.json({ ok: true, ...result });
}

/** POST /api/drawboards：保存画板数据（有 path 覆盖，无 path 新建） */
export function saveDrawboard(req, res) {
  res.json(persistDrawboard(req.body));
}

/** 解析单段 Range，支持 "bytes=0-1023" / "bytes=1024-" / "bytes=-500" */
function parseRange(header, size) {
  const match = /^bytes=(\d*)-(\d*)$/.exec(String(header).trim());
  if (!match) return null;

  const [, rawStart, rawEnd] = match;
  if (rawStart === '' && rawEnd === '') return null;

  let start;
  let end;
  if (rawStart === '') {
    // 后缀范围：最后 N 字节
    const suffix = Number(rawEnd);
    if (!Number.isFinite(suffix) || suffix <= 0) return null;
    start = Math.max(0, size - suffix);
    end = size - 1;
  } else {
    start = Number(rawStart);
    end = rawEnd === '' ? size - 1 : Number(rawEnd);
  }

  if (!Number.isFinite(start) || !Number.isFinite(end)) return null;
  if (start > end || start >= size) return { unsatisfiable: true };
  return { start, end: Math.min(end, size - 1) };
}

/** GET / HEAD /media/** */
export function serve(req, res) {
  const relative = req.path.replace(/^\//, '');
  const { file, mime, size, mtime } = mediaService.resolveMediaFile(relative);

  const baseHeaders = {
    'Content-Type': mime,
    'Accept-Ranges': 'bytes',
    'Cache-Control': 'public, max-age=3600',
    'Last-Modified': mtime.toUTCString(),
  };

  const rangeHeader = req.headers.range;
  if (!rangeHeader) {
    res.writeHead(200, { ...baseHeaders, 'Content-Length': size });
    if (req.method === 'HEAD') return res.end();
    return fs.createReadStream(file).pipe(res);
  }

  const range = parseRange(rangeHeader, size);
  if (!range || range.unsatisfiable) {
    res.writeHead(416, {
      ...baseHeaders,
      'Content-Range': `bytes */${size}`,
      'Content-Length': 0,
    });
    return res.end();
  }

  const { start, end } = range;
  res.writeHead(206, {
    ...baseHeaders,
    'Content-Range': `bytes ${start}-${end}/${size}`,
    'Content-Length': end - start + 1,
  });
  if (req.method === 'HEAD') return res.end();
  fs.createReadStream(file, { start, end }).pipe(res);
}
