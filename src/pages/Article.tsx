import { Link, useParams } from 'react-router-dom';
import BookEditor from '@/core';
import { useEditorMode } from '@/context/EditorContext';
import { getArticleById, getCategory, getTag } from '@/data/articles';
import NotFound from './NotFound';
import styles from './Article.module.less';

export default function Article() {
  const { id = '' } = useParams();
  const article = getArticleById(id);
  const { mode } = useEditorMode();

  if (!article) return <NotFound />;

  const cat = getCategory(article.category);

  return (
    <div className={styles.page}>
      <div className={styles.crumb}>
        <Link to="/">首页</Link>
        <span className={styles.crumbSep}>/</span>
        {cat && (
          <>
            <Link to={`/category/${cat.id}`} style={{ color: cat.color }}>
              {cat.name}
            </Link>
            <span className={styles.crumbSep}>/</span>
          </>
        )}
        <span className={styles.crumbCurrent}>正文</span>
      </div>

      <header className={styles.meta}>
        {cat && (
          <Link to={`/category/${cat.id}`} className={styles.catBadge} style={{ color: cat.color }}>
            <span className={styles.catDot} style={{ background: cat.color }} />
            {cat.icon} {cat.name}
          </Link>
        )}
        <h1 className={styles.title}>{article.title}</h1>
        <p className={styles.summary}>{article.summary}</p>
        <div className={styles.subMeta}>
          <span>{article.date}</span>
          <span>{article.reads} 次阅读</span>
          {article.tags.map((t) => {
            const tag = getTag(t);
            return tag ? (
              <Link
                key={t}
                to={`/tag/${t}`}
                className={styles.tagChip}
                style={{ color: tag.color }}
              >
                # {tag.name}
              </Link>
            ) : null;
          })}
        </div>
      </header>

      <div className={styles.editorWrap}>
        <BookEditor key={article.id} initialValue={article.content} readOnly={mode === 'read'} />
      </div>
    </div>
  );
}
