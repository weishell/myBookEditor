// 分类 / 标签维护面板（仅本地可写模式）
// 交互尽量"就地编辑"：改名在失焦时提交，颜色点一下即保存，避免层层弹框
import { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Input, Modal, Popconfirm } from 'antd';
import {
  createCategory,
  createTag,
  deleteCategory,
  deleteTag,
  updateCategory,
  updateTag,
  uploadCategoryCover,
} from '@/data/bootstrap';
import { getAllCategories, getAllTags } from '@/data/articles';
import { assetUrl } from '@/data/assets';
import type { CategoryWithCount, TagWithCount } from '@/data/types';
import styles from './TaxonomyManager.module.less';

const SWATCHES = [
  '#2f6fed',
  '#00a66c',
  '#7c3aed',
  '#e05b3f',
  '#d4a017',
  '#c026a5',
  '#0ea5e9',
  '#14b8a6',
];

interface Props {
  open: boolean;
  onClose: () => void;
  /** 数据被改动后通知外部重渲染（Home 的分类卡片要跟着变） */
  onChanged?: () => void;
}

export default function TaxonomyManager({ open, onClose, onChanged }: Props) {
  const [tab, setTab] = useState<'category' | 'tag'>('category');
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [tags, setTags] = useState<TagWithCount[]>([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [newTag, setNewTag] = useState('');

  // onChanged 通常是内联箭头函数，放进 deps 会让 refresh 每次都变 → effect 反复触发。
  // 用 ref 持有它，refresh 保持稳定
  const onChangedRef = useRef(onChanged);
  onChangedRef.current = onChanged;

  const refresh = useCallback(() => {
    setCategories(getAllCategories());
    setTags(getAllTags());
    onChangedRef.current?.();
  }, []);

  useEffect(() => {
    if (!open) return;
    refresh();
    setError('');
  }, [open, refresh]);

  // 所有写操作走同一套：清错误 → 提交 → 刷新列表 → 失败显示服务端原因
  const run = async (task: () => Promise<unknown>) => {
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      await task();
      refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : '操作失败');
    } finally {
      setBusy(false);
    }
  };

  const addCategory = () => {
    const name = newCategory.trim();
    if (!name) return;
    void run(async () => {
      await createCategory({ name });
      setNewCategory('');
    });
  };

  const addTag = () => {
    const name = newTag.trim();
    if (!name) return;
    void run(async () => {
      await createTag({ name });
      setNewTag('');
    });
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={720}
      title="分类与标签"
      destroyOnHidden
    >
      <div className={styles.tabs}>
        <button
          type="button"
          className={tab === 'category' ? styles.tabActive : styles.tab}
          onClick={() => {
            setTab('category');
            setError('');
          }}
        >
          分类 <span className={styles.tabCount}>{categories.length}</span>
        </button>
        <button
          type="button"
          className={tab === 'tag' ? styles.tabActive : styles.tab}
          onClick={() => {
            setTab('tag');
            setError('');
          }}
        >
          标签 <span className={styles.tabCount}>{tags.length}</span>
        </button>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {tab === 'category' ? (
        <>
          <p className={styles.hint}>
            改名在输入框失焦后保存；点色块即换色；封面可上传（不传则用默认封面）。分类下还有文档时不能删除。
          </p>
          <div className={styles.list}>
            {categories.map((c) => (
              <div key={c.id} className={styles.row}>
                <label className={styles.coverPicker} title="点击更换封面">
                  <img src={assetUrl(c.cover)} alt="" className={styles.coverImg} />
                  <span className={styles.coverMask}>更换</span>
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      e.currentTarget.value = '';
                      if (file) void run(() => uploadCategoryCover(c.id, file));
                    }}
                  />
                </label>

                <div className={styles.main}>
                  <div className={styles.nameLine}>
                    <Input
                      key={`${c.id}-${c.name}`}
                      defaultValue={c.name}
                      maxLength={24}
                      disabled={busy}
                      className={styles.nameInput}
                      onPressEnter={(e) => e.currentTarget.blur()}
                      onBlur={(e) => {
                        const name = e.target.value.trim();
                        if (name && name !== c.name) void run(() => updateCategory(c.id, { name }));
                      }}
                    />
                    <Input
                      key={`${c.id}-${c.icon}`}
                      defaultValue={c.icon}
                      maxLength={4}
                      disabled={busy}
                      className={styles.iconInput}
                      title="图标（emoji）"
                      onPressEnter={(e) => e.currentTarget.blur()}
                      onBlur={(e) => {
                        const icon = e.target.value.trim();
                        if (icon && icon !== c.icon) void run(() => updateCategory(c.id, { icon }));
                      }}
                    />
                    <Input
                      key={`${c.id}-${c.desc}`}
                      defaultValue={c.desc}
                      maxLength={60}
                      disabled={busy}
                      className={styles.descInput}
                      placeholder="一句话描述（可选）"
                      onPressEnter={(e) => e.currentTarget.blur()}
                      onBlur={(e) => {
                        const desc = e.target.value.trim();
                        if (desc !== c.desc) void run(() => updateCategory(c.id, { desc }));
                      }}
                    />
                  </div>
                  <div className={styles.metaLine}>
                    <div className={styles.swatches}>
                      {SWATCHES.map((color) => (
                        <button
                          key={color}
                          type="button"
                          className={
                            c.color.toLowerCase() === color ? styles.swatchActive : styles.swatch
                          }
                          style={{ background: color }}
                          title={color}
                          onClick={() => void run(() => updateCategory(c.id, { color }))}
                        />
                      ))}
                    </div>
                    <span className={styles.count}>{c.count} 篇</span>
                  </div>
                </div>

                <Popconfirm
                  title="删除这个分类？"
                  description={
                    c.count > 0 ? `还有 ${c.count} 篇文档在用，删不掉哦` : '删除后不可恢复'
                  }
                  okText="删除"
                  cancelText="取消"
                  okButtonProps={{ danger: true }}
                  onConfirm={() => void run(() => deleteCategory(c.id))}
                >
                  <Button danger type="text" size="small" disabled={busy}>
                    删除
                  </Button>
                </Popconfirm>
              </div>
            ))}
          </div>

          <div className={styles.addRow}>
            <Input
              value={newCategory}
              placeholder="新增分类名称"
              maxLength={24}
              onChange={(e) => setNewCategory(e.target.value)}
              onPressEnter={addCategory}
            />
            <Button
              type="primary"
              onClick={addCategory}
              loading={busy}
              disabled={!newCategory.trim()}
            >
              添加
            </Button>
          </div>
        </>
      ) : (
        <>
          <p className={styles.hint}>标签改名同样在失焦后保存；有文档在用的标签不能删除。</p>
          <div className={styles.list}>
            {tags.map((t) => (
              <div key={t.id} className={styles.tagRow}>
                <div className={styles.swatches}>
                  {SWATCHES.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={
                        t.color.toLowerCase() === color ? styles.swatchActive : styles.swatch
                      }
                      style={{ background: color }}
                      title={color}
                      onClick={() => void run(() => updateTag(t.id, { color }))}
                    />
                  ))}
                </div>
                <Input
                  key={`${t.id}-${t.name}`}
                  defaultValue={t.name}
                  maxLength={24}
                  disabled={busy}
                  className={styles.tagNameInput}
                  onPressEnter={(e) => e.currentTarget.blur()}
                  onBlur={(e) => {
                    const name = e.target.value.trim();
                    if (name && name !== t.name) void run(() => updateTag(t.id, { name }));
                  }}
                />
                <span className={styles.count}>{t.count} 篇</span>
                <Popconfirm
                  title="删除这个标签？"
                  description={
                    t.count > 0 ? `还有 ${t.count} 篇文档在用，删不掉哦` : '删除后不可恢复'
                  }
                  okText="删除"
                  cancelText="取消"
                  okButtonProps={{ danger: true }}
                  onConfirm={() => void run(() => deleteTag(t.id))}
                >
                  <Button danger type="text" size="small" disabled={busy}>
                    删除
                  </Button>
                </Popconfirm>
              </div>
            ))}
          </div>

          <div className={styles.addRow}>
            <Input
              value={newTag}
              placeholder="新增标签名称"
              maxLength={24}
              onChange={(e) => setNewTag(e.target.value)}
              onPressEnter={addTag}
            />
            <Button type="primary" onClick={addTag} loading={busy} disabled={!newTag.trim()}>
              添加
            </Button>
          </div>
        </>
      )}

      <div className={styles.footer}>
        <span className={styles.footerHint}>改动实时写入 data/meta.json；发布时随构建导出</span>
        <Button onClick={onClose}>完成</Button>
      </div>
    </Modal>
  );
}
