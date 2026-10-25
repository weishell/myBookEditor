import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Modal, Pagination } from 'antd';
import { getCategory } from '@/data/articles';
import { canWrite } from '@/data/store';
import { listTrash, purgeTrash, restoreTrash } from '@/data/bootstrap';
import type { TrashEntry } from '@/data/types';
import styles from './RecycleBin.module.less';

/** 与文章列表保持一致：每页 50 篇 */
const PAGE_SIZE = 50;

type Notice = { tone: 'ok' | 'warn'; text: string } | null;

/** ISO → 本地时间（精确到分钟），坏数据原样返回 */
function formatTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}`;
}

export default function RecycleBin() {
  const writable = canWrite();
  const [keyword, setKeyword] = useState('');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<TrashEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [pendingPurge, setPendingPurge] = useState<string[] | null>(null);
  const [notice, setNotice] = useState<Notice>(null);
  // 恢复/删除后用它触发重新拉取，比手动维护列表更不容易和分页打架
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    if (!writable) {
      setLoading(false);
      return;
    }
    let alive = true;
    setLoading(true);
    setError('');

    listTrash({ q: query, page, pageSize: PAGE_SIZE })
      .then((res) => {
        if (!alive) return;
        const maxPage = Math.max(1, Math.ceil(res.total / PAGE_SIZE));
        // 删完最后一页后自动回退，避免停在空白的第 N 页
        if (page > maxPage) {
          setPage(maxPage);
          return;
        }
        setItems(res.items);
        setTotal(res.total);
        setSelected([]);
      })
      .catch((err: unknown) => {
        if (alive) setError(err instanceof Error ? err.message : '回收站加载失败');
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [writable, query, page, nonce]);

  const allSelected = useMemo(
    () => items.length > 0 && items.every((item) => selected.includes(item.name)),
    [items, selected],
  );

  const toggleAll = () => {
    setSelected(allSelected ? [] : items.map((item) => item.name));
  };

  const toggleOne = (name: string) => {
    setSelected((prev) => (prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]));
  };

  const submitSearch = (e: FormEvent) => {
    e.preventDefault();
    setPage(1);
    setQuery(keyword.trim());
    setNotice(null);
  };

  const clearSearch = () => {
    setKeyword('');
    setQuery('');
    setPage(1);
    setNotice(null);
  };

  const doRestore = async (names: string[]) => {
    if (names.length === 0) return;
    setBusy(true);
    setNotice(null);
    try {
      const res = await restoreTrash(names);
      const ok = res.restored?.length ?? 0;
      const bad = res.failed?.length ?? 0;
      setNotice({
        tone: bad ? 'warn' : 'ok',
        text: bad
          ? `已恢复 ${ok} 篇，${bad} 篇失败：${res.failed.map((f) => f.error).join('；')}`
          : `已恢复 ${ok} 篇文档`,
      });
      setNonce((n) => n + 1);
    } catch (err) {
      setNotice({ tone: 'warn', text: err instanceof Error ? err.message : '恢复失败' });
    } finally {
      setBusy(false);
    }
  };

  const doPurge = async (names: string[]) => {
    if (names.length === 0) return;
    setBusy(true);
    setNotice(null);
    try {
      const res = await purgeTrash(names);
      const ok = res.deleted?.length ?? 0;
      const bad = res.failed?.length ?? 0;
      setNotice({
        tone: bad ? 'warn' : 'ok',
        text: bad
          ? `已彻底删除 ${ok} 篇，${bad} 篇失败：${res.failed.map((f) => f.error).join('；')}`
          : `已彻底删除 ${ok} 篇文档`,
      });
      setPendingPurge(null);
      setNonce((n) => n + 1);
    } catch (err) {
      setNotice({ tone: 'warn', text: err instanceof Error ? err.message : '删除失败' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.crumb}>
        <Link to="/">首页</Link>
        <span className={styles.crumbSep}>/</span>
        <span className={styles.crumbCurrent}>回收站</span>
      </div>

      <header className={styles.header}>
        <div className={styles.headerIcon}>🗑️</div>
        <div>
          <h1 className={styles.title}>回收站</h1>
          <p className={styles.subtitle}>
            删除的文档会先放在这里 · 共 {total} 篇，每页 {PAGE_SIZE} 篇
          </p>
        </div>
      </header>

      {!writable ? (
        <div className={styles.emptyState}>
          回收站只在本地的可写模式下可用
          <p className={styles.emptyHint}>
            当前是只读数据源，删不了也恢复不了。启动本地 API（pnpm dev:server）后再回来。
          </p>
          <Link to="/articles" className={styles.emptyLink}>
            返回全部文章
          </Link>
        </div>
      ) : (
        <>
          <form className={styles.searchBar} onSubmit={submitSearch}>
            <svg
              className={styles.searchIcon}
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.2-3.2" />
            </svg>
            <input
              value={keyword}
              placeholder="搜索标题、摘要或正文关键词"
              onChange={(e) => setKeyword(e.target.value)}
            />
            {keyword && (
              <button type="button" className={styles.clearBtn} onClick={clearSearch} title="清空">
                ×
              </button>
            )}
            <button type="submit" className={styles.searchBtn}>
              搜索
            </button>
          </form>

          {query && (
            <div className={styles.searchHint}>
              关键词「{query}」的搜索结果 · {total} 篇
            </div>
          )}

          {notice && (
            <div className={styles.notice} data-tone={notice.tone}>
              {notice.text}
            </div>
          )}

          {items.length > 0 && (
            <div className={styles.toolbar}>
              <label className={styles.checkAll}>
                <input type="checkbox" checked={allSelected} onChange={toggleAll} />
                全选本页
              </label>
              <span className={styles.selectedCount}>已选 {selected.length} 篇</span>
              <button
                type="button"
                className={styles.restoreBtn}
                disabled={selected.length === 0 || busy}
                onClick={() => doRestore(selected)}
              >
                批量恢复
              </button>
              <button
                type="button"
                className={styles.purgeBtn}
                disabled={selected.length === 0 || busy}
                onClick={() => setPendingPurge(selected)}
              >
                彻底删除
              </button>
            </div>
          )}

          {loading ? (
            <div className={styles.emptyState}>加载中…</div>
          ) : error ? (
            <div className={styles.emptyState}>
              回收站加载失败：{error}
              <p className={styles.emptyHint}>确认本地 API 已启动（pnpm dev:server）</p>
            </div>
          ) : items.length === 0 ? (
            <div className={styles.emptyState}>
              {query ? '没有找到匹配的文档' : '回收站是空的'}
              {query && (
                <p className={styles.emptyHint}>
                  换个关键词试试，或
                  <button type="button" className={styles.linkBtn} onClick={clearSearch}>
                    清空搜索
                  </button>
                </p>
              )}
            </div>
          ) : (
            <div className={styles.list}>
              {items.map((item) => {
                const cat = getCategory(item.category);
                const checked = selected.includes(item.name);
                return (
                  <div key={item.name} className={styles.row} data-selected={checked}>
                    <label className={styles.check}>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleOne(item.name)}
                      />
                    </label>
                    <div className={styles.rowMain}>
                      <div className={styles.rowTitle}>{item.title}</div>
                      {item.summary && <div className={styles.rowSummary}>{item.summary}</div>}
                      {item.snippet && <div className={styles.rowSnippet}>{item.snippet}</div>}
                      <div className={styles.rowMeta}>
                        {cat && (
                          <span className={styles.catBadge} style={{ color: cat.color }}>
                            <span className={styles.catDot} style={{ background: cat.color }} />
                            {cat.name}
                          </span>
                        )}
                        <span>删除于 {formatTime(item.deletedAt)}</span>
                        {item.date && <span>创建于 {item.date}</span>}
                      </div>
                    </div>
                    <div className={styles.rowActions}>
                      <button
                        type="button"
                        className={styles.restoreBtn}
                        disabled={busy}
                        onClick={() => doRestore([item.name])}
                      >
                        恢复
                      </button>
                      <button
                        type="button"
                        className={styles.purgeBtn}
                        disabled={busy}
                        onClick={() => setPendingPurge([item.name])}
                      >
                        彻底删除
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {total > PAGE_SIZE && (
            <div className={styles.pager}>
              <Pagination
                current={page}
                total={total}
                pageSize={PAGE_SIZE}
                onChange={(p) => {
                  setPage(p);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                showSizeChanger={false}
                showTotal={(t) => `共 ${t} 篇`}
              />
            </div>
          )}
        </>
      )}

      <Modal
        open={Boolean(pendingPurge)}
        title={`彻底删除 ${pendingPurge?.length ?? 0} 篇文档？`}
        okText="彻底删除"
        cancelText="取消"
        okButtonProps={{ danger: true }}
        confirmLoading={busy}
        onOk={() => pendingPurge && doPurge(pendingPurge)}
        onCancel={() => setPendingPurge(null)}
      >
        <p>这些文件会从 data/.trash/ 直接移除，删除后无法恢复。</p>
      </Modal>
    </div>
  );
}
