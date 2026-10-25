import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Pagination } from 'antd';
import { ARTICLE_PAGE_SIZE, getAllArticles, getCategory, getTag } from '@/data/articles';
import { getDataState } from '@/data/store';
import ArticleRow from './ArticleRow';
import styles from './Search.module.less';

/** 服务端全文搜索结果：比索引多 snippet（正文命中片段）与 matchedIn */
interface SearchResult {
  id: string;
  title: string;
  summary: string;
  category: string;
  tags: string[];
  date: string;
  reads: number;
  updatedAt?: string;
  snippet?: string;
  matchedIn?: 'title' | 'summary' | 'body';
}

export default function Search() {
  const [params] = useSearchParams();
  const q = (params.get('q') ?? '').trim();
  const [page, setPage] = useState(1);
  // api 数据源才走服务端全文搜索；static/demo 用本地索引过滤兜底
  const isApi = getDataState().source === 'api';
  const [serverResults, setServerResults] = useState<SearchResult[] | null>(null);

  useEffect(() => {
    setPage(1);
  }, [q]);

  useEffect(() => {
    if (!q || !isApi) {
      setServerResults(null);
      return;
    }
    let alive = true;
    fetch(`/api/articles/search?q=${encodeURIComponent(q)}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(String(res.status)))))
      .then((list: SearchResult[]) => {
        if (alive) setServerResults(Array.isArray(list) ? list : []);
      })
      .catch(() => {
        if (alive) setServerResults(null); // 失败退回本地过滤
      });
    return () => {
      alive = false;
    };
  }, [q, isApi]);

  const results = useMemo(() => {
    if (!q) return [];
    const needle = q.toLowerCase();
    if (isApi && serverResults) {
      // 服务端搜的是标题/摘要/正文；分类名、标签名命中的文章在这里补上，避免比旧的本地搜索更弱
      const seen = new Set(serverResults.map((r) => r.id));
      const extra = getAllArticles().filter(
        (a) =>
          !seen.has(a.id) &&
          ((getCategory(a.category)?.name.toLowerCase().includes(needle) ?? false) ||
            a.tags.some((t) => getTag(t)?.name.toLowerCase().includes(needle))),
      );
      return [...serverResults, ...extra];
    }
    return getAllArticles().filter((a) => {
      if (a.title.toLowerCase().includes(needle)) return true;
      if (a.summary.toLowerCase().includes(needle)) return true;
      const cat = getCategory(a.category);
      if (cat && cat.name.toLowerCase().includes(needle)) return true;
      return a.tags.some((t) => getTag(t)?.name.toLowerCase().includes(needle));
    });
  }, [q, isApi, serverResults]);

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
          {q
            ? `找到 ${total} 篇相关文章`
            : '在顶部搜索框输入关键词，可搜标题、摘要、分类、标签与正文'}
        </p>
      </header>

      {q && pageResults.length === 0 ? (
        <div className={styles.empty}>未找到与“{q}”相关的文章，换个关键词试试</div>
      ) : (
        <>
          <div className={styles.list}>
            {pageResults.map((a) => (
              <div key={a.id}>
                <ArticleRow
                  article={a}
                  snippet={'snippet' in a ? String(a.snippet ?? '') || undefined : undefined}
                />
              </div>
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
