// 系统接口：健康检查 / 索引重建
import { dbFileInfo } from '../db/index.js';
import { rebuildIndex } from '../db/rebuild.js';
import * as articlesService from '../services/articles.service.js';
import * as taxonomyService from '../services/taxonomy.service.js';

export function health(_req, res) {
  const meta = taxonomyService.getMeta();
  res.json({
    ok: true,
    source: 'files+sqlite-index',
    database: dbFileInfo(),
    counts: {
      articles: articlesService.countArticles(),
      categories: meta.categories.length,
      tags: meta.tags.length,
    },
  });
}

/** 手动重建索引：改过 data/articles 里的文件后调用，或索引库损坏时用 */
export function rebuild(_req, res) {
  res.json({ ok: true, ...rebuildIndex() });
}
