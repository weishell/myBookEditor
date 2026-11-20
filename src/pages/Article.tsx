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
import { clearDraft, flushDraft, hasDraft, loadDraft, queueDraft, type Draft } from '@/data/draft';
import NotFound from './NotFound';
import styles from './Article.module.less';

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

/** Slate 不接受空数组作为 initialValue，兜一个空段落 */
const EMPTY_DOC: Descendant[] = [
  { type: 'paragraph', id: 'empty', children: [{ text: '' }] } as unknown as Descendant,
];

/** 上一篇/下一篇标题最多展示 15 个字，超出用省略号（完整标题放在 title 里） */
const NEIGHBOR_TITLE_LIMIT = 15;

/** 草稿时间只到分钟：定位到「今天 18:24」够用户判断是不是自己刚打的 */
function formatDraftTime(ts: number): string {
  const d = new Date(ts);
  const pad = (n: number) => String(n).padStart(2, '0');
  const time = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  return d.toDateString() === new Date().toDateString()
    ? `今天 ${time}`
    : `${d.getMonth() + 1}月${d.getDate()}日 ${time}`;
}

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
  // 本机草稿：只要服务器没确认保存，这里就一定有一份最新正文（见 data/draft.ts 的不变量）
  const [draft, setDraft] = useState<Draft | null>(null);
  // 用户点了「恢复草稿」：换 key 让编辑器重挂，才能吃到新的 initialValue
  const [restored, setRestored] = useState<{ tick: number; content: Descendant[] } | null>(null);
  // 删除后编辑器卸载会触发一次"补交保存"，这里拦住，避免对已删除的文档发 PATCH
  const skipSaveRef = useRef(false);

  useEffect(() => {
    const cached = getCachedContent(id);
    setLoaded(cached ? { id, content: cached } : null);
    setLoadError('');
    setSaveState('idle');
    setConfirmOpen(false);
    // 切文档：草稿与"已恢复"状态都得跟着换，否则会把上一篇的草稿挂到这一篇上
    setDraft(loadDraft(id));
    setRestored(null);

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
      // 先落本机再发请求。请求可能失败（后端 500）、可能挂起几十秒、也可能在
      // 提交途中页面就崩了——这三种情况下，正文只留在内存里就等于没了。
      queueDraft(id, value);
      setSaveState('saving');
      try {
        await saveArticleContent(id, value);
        // 服务器确认了才清草稿，这是 draft.ts 那条不变量成立的前提
        clearDraft(id);
        setDraft(null);
        setSaveState('saved');
      } catch {
        // 等不到节流定时器，立刻写盘并把恢复入口挂出来
        flushDraft(id);
        setDraft(loadDraft(id));
        setSaveState('error');
      }
    },
    [id, writable],
  );

  // 关标签页/刷新时：本机还留着草稿 = 服务器没确认，让浏览器拦一下。
  // pagehide 是移动端唯一可靠的时机（beforeunload 在 iOS 上经常不触发），
  // 这里只补一次挂起的写入，不做拦截。
  useEffect(() => {
    if (!writable) return undefined;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!hasDraft(id)) return;
      e.preventDefault();
      e.returnValue = '';
    };
    const onPageHide = () => flushDraft();
    window.addEventListener('beforeunload', onBeforeUnload);
    window.addEventListener('pagehide', onPageHide);
    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload);
      window.removeEventListener('pagehide', onPageHide);
    };
  }, [id, writable]);

  /**
   * 恢复草稿：灌进编辑器**并立刻提交一次**。
   * 只灌不提交的话，横幅消失了但服务器仍是旧内容，下次进页面又会弹一遍——用户会以为已经处理完了。
   * 用户点「恢复」就是选这份内容，所以这里直接覆盖服务器；失败时 handleSave 会把草稿再写回去、横幅重现。
   */
  const handleRestoreDraft = () => {
    if (!draft) return;
    setRestored((prev) => ({ tick: (prev?.tick ?? 0) + 1, content: draft.content }));
    setDraft(null);
    void handleSave(draft.content);
  };

  /** 丢弃草稿：用户确认服务器那份才是要的 */
  const handleDiscardDraft = () => {
    clearDraft(id);
    setDraft(null);
  };

  const handleDelete = async () => {
    skipSaveRef.current = true;
    setDeleting(true);
    try {
      await deleteArticleById(id);
      // 文档进回收站了，本机草稿留着只会在恢复时对一篇"已删除的文章"弹提示
      clearDraft(id);
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
  // 恢复过草稿就以草稿为准；否则用服务器正文
  const docContent = restored ? restored.content : content;

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

      {/* 本机草稿提示：出现在「上次没存上」时，两个出口都要给——只提示不给出路等于拦路 */}
      {draft && writable && (
        <div className={styles.draftBar} role="status">
          <span className={styles.draftDot} aria-hidden />
          <span className={styles.draftText}>
            上次编辑没能保存到服务器，已在本机留了一份草稿
            {draft.savedAt ? `（${formatDraftTime(draft.savedAt)}）` : ''}。
          </span>
          <span className={styles.draftActions}>
            <button type="button" className={styles.draftPrimary} onClick={handleRestoreDraft}>
              恢复草稿
            </button>
            <button type="button" className={styles.draftGhost} onClick={handleDiscardDraft}>
              丢弃
            </button>
          </span>
        </div>
      )}

      <div className={styles.editorWrap}>
        {docContent ? (
          <BookEditor
            // key 带 tick：恢复草稿时强制重挂，否则 initialValue 只在首帧生效
            key={`${article.id}:${restored?.tick ?? 0}`}
            initialValue={docContent.length ? docContent : EMPTY_DOC}
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
