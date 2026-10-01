import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { ALL_CATEGORIES, ALL_TAGS, ARTICLE_TOTAL } from '@/data/articles';
import styles from './Home.module.less';

export default function Home() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <span className={styles.heroBadge}>MyBook 文章中心</span>
        <h1 className={styles.heroTitle}>好文章，值得慢慢读</h1>
        <p className={styles.heroDesc}>
          按分类浏览，或从标签直达感兴趣的话题。每一篇文章都是可编辑的富文档，打开即是编辑器。
        </p>
        <div className={styles.heroStats}>
          <span>{ARTICLE_TOTAL} 篇文章</span>
          <span>{ALL_CATEGORIES.length} 个分类</span>
          <span>{ALL_TAGS.length} 个标签</span>
        </div>
        <div className={styles.heroActions}>
          <Link to="/demo" className={styles.heroBtn}>
            打开全功能示例文档
          </Link>
          <span className={styles.heroHint}>流程图、画板、图表、公式…所有能力都在里面</span>
        </div>
      </section>

      <section className={styles.block}>
        <div className={styles.blockHeader}>
          <h2 className={styles.blockTitle}>文章分类</h2>
          <span className={styles.blockDesc}>选择一个方向，开始阅读</span>
        </div>
        <div className={styles.categoryGrid}>
          {ALL_CATEGORIES.map((c) => (
            <Link
              key={c.id}
              to={`/category/${c.id}`}
              className={styles.categoryCard}
              style={{ '--card-color': c.color } as CSSProperties}
            >
              <span className={styles.categoryIcon}>{c.icon}</span>
              <span className={styles.categoryName}>{c.name}</span>
              <span className={styles.categoryDesc}>{c.desc}</span>
              <span className={styles.categoryCount}>{c.count} 篇</span>
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
          {ALL_TAGS.map((t) => (
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
    </div>
  );
}
