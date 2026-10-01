import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Pagination } from 'antd';
import {
  ARTICLE_PAGE_SIZE,
  getArticlesByCategory,
  getArticlesByTag,
  getCategory,
  getTag,
} from '@/data/articles';
import ArticleRow from './ArticleRow';
import NotFound from './NotFound';
import styles from './ArticleList.module.less';

interface ListMeta {
  title: string;
  subtitle: string;
  color: string;
  icon: string;
}

export default function ArticleList({ kind }: { kind: 'category' | 'tag' }) {
  const { name = '' } = useParams();
  const [page, setPage] = useState(1);

  const articles = useMemo(
    () => (kind === 'category' ? getArticlesByCategory(name) : getArticlesByTag(name)),
    [kind, name],
  );

  const meta: ListMeta | null = useMemo(() => {
    if (kind === 'category') {
      const c = getCategory(name);
      return c ? { title: c.name, subtitle: c.desc, color: c.color, icon: c.icon } : null;
    }
    const t = getTag(name);
    return t ? { title: t.name, subtitle: `# ${t.name}`, color: t.color, icon: '#' } : null;
  }, [kind, name]);

  if (!meta) return <NotFound />;

  const total = articles.length;
  const pageSize = ARTICLE_PAGE_SIZE;
  const start = (page - 1) * pageSize;
  const pageArticles = articles.slice(start, start + pageSize);

  const handlePageChange = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={styles.page}>
      <div className={styles.crumb}>
        <Link to="/">首页</Link>
        <span className={styles.crumbSep}>/</span>
        <span style={{ color: meta.color }}>
          {kind === 'category' ? `分类 · ${meta.title}` : `标签 · ${meta.title}`}
        </span>
      </div>

      <header className={styles.header}>
        <div className={styles.headerIcon} style={{ background: meta.color }}>
          {meta.icon}
        </div>
        <div>
          <h1 className={styles.title}>{meta.title}</h1>
          <p className={styles.subtitle}>
            {meta.subtitle} · 共 {total} 篇，每页 {pageSize} 篇
          </p>
        </div>
      </header>

      {pageArticles.length === 0 ? (
        <div className={styles.empty}>该分类下暂时没有文章</div>
      ) : (
        <>
          <div className={styles.list}>
            {pageArticles.map((a) => (
              <ArticleRow key={a.id} article={a} />
            ))}
          </div>
          {total > pageSize && (
            <div className={styles.pager}>
              <Pagination
                current={page}
                total={total}
                pageSize={pageSize}
                onChange={handlePageChange}
                showSizeChanger={false}
                showTotal={(t) => `共 ${t} 篇`}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
