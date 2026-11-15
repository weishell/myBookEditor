import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Modal } from 'antd';
import type { Descendant } from 'slate';
import BookEditor from '@/core';
import { useEditorMode } from '@/context/EditorContext';
import {
  getArticleById,
  getArticleNeighbors,
  getCategory,
  type ArticleIndex,
} from '@/data/articles';
import { canWrite, getCachedContent } from '@/data/store';
import {
  deleteArticleById,
  loadArticleContent,
  recordArticleRead,
  saveArticleContent,
} from '@/data/bootstrap';
import NotFound from './NotFound';
import styles from './Article.module.less';

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

/** Slate 不接受空数组作为 initialValue，兜一个空段落 */
const EMPTY_DOC: Descendant[] = [
  { type: 'paragraph', id: 'empty', children: [{ text: '' }] } as unknown as Descendant,
];

/** 上一篇/下一篇标题最多展示 15 个字，超出用省略号（完整标题放在 title 里） */
const NEIGHBOR_TITLE_LIMIT = 15;

function truncateTitle(title: string): string {
  const chars = Array.from(title);
  return chars.length > NEIGHBOR_TITLE_LIMIT
    ? `${chars.slice(0, NEIGHBOR_TITLE_LIMIT).join('')}…`
    : title;
}

/**
 * 上一篇 / 下一篇卡片：有的方向没有文章时保留占位，页面底部左右对称不会塌掉。
 * 跨分类跳转时用分类色标出目标分类，避免"点下去才发现换了类型"。
 */
function NeighborCard({
  direction,
  article,
}: {
  direction: 'prev' | 'next';
  article: ArticleIndex | null;
}) {
  const isPrev = direction === 'prev';
  const category = article ? getCategory(article.category) : undefined;
  const className = [styles.navCard, isPrev ? '' : styles.navNext, article ? '' : styles.navEmpty]
    .filter(Boolean)
    .join(' ');

  const body = (
    <>
      <span className={styles.navLabel}>
        {isPrev && <span className={styles.navArrow}>←</span>}
        <span>{isPrev ? '上一篇' : '下一篇'}</span>
        {category && (
          <span className={styles.navCat} style={{ color: category.color }}>
            {category.name}
          </span>
        )}
        {!isPrev && <span className={styles.navArrow}>→</span>}
      </span>
      <span className={styles.navTitle} title={article?.title}>
        {article ? truncateTitle(article.title) : isPrev ? '已经是第一篇了' : '已经是最后一篇了'}
      </span>
    </>
  );

  if (!article) return <div className={className}>{body}</div>;

  return (
    // 切文档后回到页首，否则会停留在上一篇的滚动位置
    <Link
      to={`/article/${article.id}`}
      className={className}
      onClick={() => window.scrollTo({ top: 0 })}
    >
      {body}
    </Link>
  );
}

export default function Article() {
  const { id = '' } = useParams();
  const article = getArticleById(id);
  const { mode } = useEditorMode();
  const navigate = useNavigate();
  const writable = canWrite();

  // 正文不进快照，进页面时才按篇加载（已加载过的会命中缓存）。
  // 连同 id 一起存：切换文章时不会先闪一帧上一篇的正文
  const [loaded, setLoaded] = useState<{ id: string; content: Descendant[] } | null>(() => {
    const cached = getCachedContent(id);
    return cached ? { id, content: cached } : null;
  });
  const content = loaded && loaded.id === id ? loaded.content : null;
  const [loadError, setLoadError] = useState('');
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  // 删除后编辑器卸载会触发一次"补交保存"，这里拦住，避免对已删除的文档发 PATCH
  const skipSaveRef = useRef(false);

  useEffect(() => {
    const cached = getCachedContent(id);
    setLoaded(cached ? { id, content: cached } : null);
    setLoadError('');
    setSaveState('idle');
    setConfirmOpen(false);

    if (cached || !getArticleById(id)) return;
    let alive = true;
    loadArticleContent(id)
      .then((next) => {
        if (alive) setLoaded({ id, content: next });
      })
      .catch((err: unknown) => {
        if (alive) setLoadError(err instanceof Error ? err.message : '正文加载失败');
      });
    return () => {
      alive = false;
    };
  }, [id]);

  // 真实阅读量：进入文章页记一次（服务端写 SQLite + 文章文件；线上静态站点忽略）
  useEffect(() => {
    if (!getArticleById(id)) return;
    void recordArticleRead(id);
  }, [id]);

  // 编辑器内部已做 400ms 防抖，这里只管提交 + 状态提示
  const handleSave = useCallback(
    async (value: Descendant[]) => {
      if (!writable || skipSaveRef.current) return;
      setSaveState('saving');
      try {
        await saveArticleContent(id, value);
        setSaveState('saved');
      } catch {
        setSaveState('error');
      }
    },
    [id, writable],
  );

  const handleDelete = async () => {
    skipSaveRef.current = true;
    setDeleting(true);
    try {
      await deleteArticleById(id);
      setConfirmOpen(false);
      navigate('/');
    } catch (err) {
      setDeleting(false);
      setConfirmOpen(false);
      setLoadError(err instanceof Error ? err.message : '删除失败');
    }
  };

  if (!article) return <NotFound />;

  const cat = getCategory(article.category);
  const { prev, next } = getArticleNeighbors(article.id);

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
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
        {/* 只读模式没有可写操作：保存提示与删除按钮一并隐藏 */}
        {writable && mode !== 'read' && (
          <div className={styles.actions}>
            {saveState !== 'idle' && (
              <span className={styles.saveHint} data-state={saveState}>
                {saveState === 'saving' ? '保存中…' : saveState === 'saved' ? '已保存' : '保存失败'}
              </span>
            )}
            <button type="button" className={styles.deleteBtn} onClick={() => setConfirmOpen(true)}>
              删除
            </button>
          </div>
        )}
      </div>

      <div className={styles.editorWrap}>
        {content ? (
          <BookEditor
            key={article.id}
            initialValue={content.length ? content : EMPTY_DOC}
            readOnly={mode === 'read' || !writable}
            persistKey=""
            commentKey={article.id}
            onSave={handleSave}
          />
        ) : loadError ? (
          <div className={styles.stateBox}>
            <p>正文加载失败：{loadError}</p>
            <p className={styles.stateHint}>确认本地 API 已启动（pnpm dev:server）</p>
          </div>
        ) : (
          <div className={styles.stateBox}>正文加载中…</div>
        )}
      </div>

      <nav className={styles.docNav} aria-label="相邻文档">
        <NeighborCard direction="prev" article={prev} />
        <NeighborCard direction="next" article={next} />
      </nav>

      <Modal
        open={confirmOpen}
        title="删除这篇文档？"
        okText="删除"
        cancelText="取消"
        okButtonProps={{ danger: true }}
        confirmLoading={deleting}
        onOk={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      >
        <p>文件会被移到回收站（data/.trash/），可在顶部「回收站」里恢复。</p>
      </Modal>
    </div>
  );
}
