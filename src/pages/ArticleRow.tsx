import { Link } from 'react-router-dom';
import { getCategory, getTag, type Article } from '@/data/articles';
import styles from './ArticleRow.module.less';

export default function ArticleRow({ article }: { article: Article }) {
  const cat = getCategory(article.category);
  return (
    <Link to={`/article/${article.id}`} className={styles.row}>
      <div className={styles.rowTitle}>{article.title}</div>
      <div className={styles.rowSummary}>{article.summary}</div>
      <div className={styles.rowMeta}>
        {cat && (
          <span className={styles.catBadge} style={{ color: cat.color }}>
            <span className={styles.catDot} style={{ background: cat.color }} />
            {cat.name}
          </span>
        )}
        {article.tags.map((t) => {
          const tag = getTag(t);
          return tag ? (
            <span key={t} className={styles.tagChip}>
              # {tag.name}
            </span>
          ) : null;
        })}
        <span className={styles.rowDate}>{article.date}</span>
        <span className={styles.rowReads}>{article.reads} 次阅读</span>
      </div>
    </Link>
  );
}
