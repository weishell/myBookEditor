// 回收站接口：列举/搜索、批量恢复、批量彻底删除
import * as trashService from '../services/trash.service.js';

export function list(req, res) {
  res.json(trashService.listTrash(req.query));
}

export function restore(req, res) {
  res.json(trashService.restoreTrash(req.body?.names));
}

export function purge(req, res) {
  res.json(trashService.purgeTrash(req.body?.names));
}
