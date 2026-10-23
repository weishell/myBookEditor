import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Modal } from 'antd';
import type { Descendant } from 'slate';
import BookEditor from '@/core';
import { useEditorMode } from '@/context/EditorContext';
import { getArticleById, getCategory, getTag } from '@/data/articles';
import { canWrite, getCachedContent } from '@/data/store';
import { deleteArticleById, loadArticleContent, saveArticleContent } from '@/data/bootstrap';
import NotFound from './NotFound';
import styles from './Article.module.less';

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

/** Slate 不接受空数组作为 initialValue，兜一个空段落 */
const EMPTY_DOC: Descendant[] = [
  { type: 'paragraph', id: 'empty', children: [{ text: '' }] } as unknown as Descendant,
];

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
          {writable && saveState !== 'idle' && (
            <span className={styles.saveHint} data-state={saveState}>
              {saveState === 'saving' ? '保存中…' : saveState === 'saved' ? '已保存' : '保存失败'}
            </span>
          )}
          {writable && (
            <button type="button" className={styles.deleteBtn} onClick={() => setConfirmOpen(true)}>
              删除
            </button>
          )}
        </div>
      </header>

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
        <p>文件会被移动到 data/.trash/，需要时可以手动恢复。</p>
      </Modal>
    </div>
  );
}
