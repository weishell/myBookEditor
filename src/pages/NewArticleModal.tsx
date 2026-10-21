// 新建文档弹框：只在本地可写模式（数据源=api）下由首页触发
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Modal, Select } from 'antd';
import { createArticle } from '@/data/bootstrap';
import { getAllCategories, getAllTags } from '@/data/articles';
import styles from './NewArticleModal.module.less';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function NewArticleModal({ open, onClose }: Props) {
  const navigate = useNavigate();
  const categories = getAllCategories();
  const tags = getAllTags();

  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [tagIds, setTagIds] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // 每次打开重置表单，避免上次的输入残留
  useEffect(() => {
    if (!open) return;
    setTitle('');
    setSummary('');
    setCategoryId(categories[0]?.id ?? '');
    setTagIds([]);
    setError('');
    setSubmitting(false);
    // categories 只在打开瞬间取一次即可
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const submit = async () => {
    const trimmed = title.trim();
    if (!trimmed) {
      setError('标题不能为空');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const created = await createArticle({
        title: trimmed,
        summary: summary.trim(),
        categoryId: categoryId || undefined,
        tagIds,
      });
      onClose();
      navigate(`/article/${created.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : '创建失败');
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      title="新建文档"
      okText="创建并打开"
      cancelText="取消"
      confirmLoading={submitting}
      onOk={submit}
      onCancel={onClose}
      width={480}
    >
      <div className={styles.form}>
        <label className={styles.field}>
          <span className={styles.label}>标题</span>
          <Input
            value={title}
            placeholder="给这篇文档起个名字"
            maxLength={80}
            autoFocus
            onChange={(e) => setTitle(e.target.value)}
            onPressEnter={submit}
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>摘要（可选）</span>
          <Input.TextArea
            value={summary}
            placeholder="一句话说明这篇文档讲什么"
            rows={2}
            maxLength={200}
            onChange={(e) => setSummary(e.target.value)}
          />
        </label>

        <div className={styles.row}>
          <label className={styles.field}>
            <span className={styles.label}>分类</span>
            <Select
              value={categoryId || undefined}
              placeholder="选择分类"
              style={{ width: '100%' }}
              onChange={setCategoryId}
              options={categories.map((c) => ({ value: c.id, label: `${c.icon} ${c.name}` }))}
            />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>标签</span>
            <Select
              mode="multiple"
              value={tagIds}
              placeholder="可多选"
              style={{ width: '100%' }}
              onChange={setTagIds}
              options={tags.map((t) => ({ value: t.id, label: t.name }))}
            />
          </label>
        </div>

        {error && <p className={styles.error}>{error}</p>}
      </div>
    </Modal>
  );
}
