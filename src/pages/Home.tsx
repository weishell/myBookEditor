import { useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { getAllArticles, getAllCategories, getAllTags, getArticleTotal } from '@/data/articles';
import { assetUrl } from '@/data/assets';
import { canWrite } from '@/data/store';
import NewArticleModal from './NewArticleModal';
import TaxonomyManager from '@/components/TaxonomyManager';
import styles from './Home.module.less';

export default function Home() {
  const categories = getAllCategories();
  const tags = getAllTags();
  const total = getArticleTotal();
  const latest = getAllArticles().slice(0, 5);
  const writable = canWrite();
  const [newOpen, setNewOpen] = useState(false);
  const [manageOpen, setManageOpen] = useState(false);
  // 维护面板改完分类/标签后自增，触发本页重新渲染（数据在 store 里已更新）
  const [, bumpVersion] = useState(0);

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <span className={styles.heroBadge}>MyBook 文章中心</span>
        <h1 className={styles.heroTitle}>好文章，值得慢慢读</h1>
        <p className={styles.heroDesc}>
          按分类浏览，或从标签直达感兴趣的话题。每一篇文章都是可编辑的富文档，打开即是编辑器。
        </p>
        <div className={styles.heroStats}>
          <span>{total} 篇文章</span>
          <span>{categories.length} 个分类</span>
          <span>{tags.length} 个标签</span>
        </div>
        <div className={styles.heroActions}>
          {writable && (
            <button
              type="button"
              className={styles.heroBtnPrimary}
              onClick={() => setNewOpen(true)}
            >
              ＋ 新建文档
            </button>
          )}
          {writable && (
            <button
              type="button"
              className={styles.heroBtnGhost}
              onClick={() => setManageOpen(true)}
            >
              管理分类 / 标签
            </button>
          )}
          <Link to="/demo" className={styles.heroBtn}>
            打开全功能示例文档
          </Link>
          <span className={styles.heroHint}>流程图、画板、图表、公式…所有能力都在里面</span>
        </div>
      </section>

      {latest.length > 0 && (
        <section className={styles.block}>
          <div className={styles.blockHeader}>
            <h2 className={styles.blockTitle}>最近更新</h2>
            <span className={styles.blockDesc}>
              {writable ? '本地索引库实时反映文件改动' : '来自构建时生成的数据快照'}
            </span>
          </div>
          <div className={styles.latestList}>
            {latest.map((a) => (
              <Link key={a.id} to={`/article/${a.id}`} className={styles.latestRow}>
                <span className={styles.latestTitle}>{a.title}</span>
                <span className={styles.latestDate}>{a.date}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className={styles.block}>
        <div className={styles.blockHeader}>
          <h2 className={styles.blockTitle}>文章分类</h2>
          <span className={styles.blockDesc}>选择一个方向，开始阅读</span>
        </div>
        <div className={styles.categoryGrid}>
          {categories.map((c) => (
            <Link
              key={c.id}
              to={`/category/${c.id}`}
              className={styles.categoryCard}
              style={{ '--card-color': c.color } as CSSProperties}
            >
              <span
                className={styles.categoryCover}
                style={{ backgroundImage: `url(${assetUrl(c.cover)})` }}
              />
              <span className={styles.categoryBody}>
                <span className={styles.categoryIcon}>{c.icon}</span>
                <span className={styles.categoryName}>{c.name}</span>
                <span className={styles.categoryDesc}>{c.desc}</span>
                <span className={styles.categoryCount}>{c.count} 篇</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.block}>
        <div className={styles.blockHeader}>
          <h2 className={styles.blockTitle}>热门标签</h2>
          <span className={styles.blockDesc}>点一个标签，看相关文章</span>
        </div>
        <div className={styles.tagCloud}>
          {tags.map((t) => (
            <Link
              key={t.id}
              to={`/tag/${t.id}`}
              className={styles.tagCard}
              style={{ '--card-color': t.color } as CSSProperties}
            >
              <span className={styles.tagName}># {t.name}</span>
              <span className={styles.tagCount}>{t.count}</span>
            </Link>
          ))}
        </div>
      </section>

      <NewArticleModal open={newOpen} onClose={() => setNewOpen(false)} />
      <TaxonomyManager
        open={manageOpen}
        onClose={() => setManageOpen(false)}
        onChanged={() => bumpVersion((v) => v + 1)}
      />
    </div>
  );
}
