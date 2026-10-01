import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Pagination } from 'antd';
import { ARTICLE_PAGE_SIZE, ARTICLES, getCategory, getTag } from '@/data/articles';
import ArticleRow from './ArticleRow';
import styles from './Search.module.less';

export default function Search() {
  const [params] = useSearchParams();
  const q = (params.get('q') ?? '').trim();
  const [page, setPage] = useState(1);

  const results = useMemo(() => {
    if (!q) return [];
    const needle = q.toLowerCase();
    return ARTICLES.filter((a) => {
      if (a.title.toLowerCase().includes(needle)) return true;
      if (a.summary.toLowerCase().includes(needle)) return true;
      const cat = getCategory(a.category);
      if (cat && cat.name.toLowerCase().includes(needle)) return true;
      return a.tags.some((t) => getTag(t)?.name.toLowerCase().includes(needle));
    });
  }, [q]);

  useEffect(() => {
    setPage(1);
  }, [q]);

  const total = results.length;
  const pageSize = ARTICLE_PAGE_SIZE;
  const start = (page - 1) * pageSize;
  const pageResults = results.slice(start, start + pageSize);

  const handlePageChange = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={styles.page}>
      <div className={styles.crumb}>
        <Link to="/">首页</Link>
        <span className={styles.crumbSep}>/</span>
        <span>搜索</span>
      </div>

      <header className={styles.header}>
        <h1 className={styles.title}>
          {q ? (
            <>
              搜索“<span className={styles.keyword}>{q}</span>”
            </>
          ) : (
            '搜索'
          )}
        </h1>
        <p className={styles.subtitle}>
          {q ? `找到 ${total} 篇相关文章` : '在顶部搜索框输入关键词'}
        </p>
      </header>

      {q && pageResults.length === 0 ? (
        <div className={styles.empty}>未找到与“{q}”相关的文章，换个关键词试试</div>
      ) : (
        <>
          <div className={styles.list}>
            {pageResults.map((a) => (
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
