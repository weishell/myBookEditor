import { useState } from 'react';
import { Tooltip } from 'antd';
import { useSlateStatic, ReactEditor } from 'slate-react';
import { changeLilistNumber } from './lilist-commands';
import { computeListNumber, convertNumber, getLilist, LilistType } from './lilist-model';
import { LilistSettingPopover } from './LilistSettingPopover';
import styles from './LilistPrefix.module.less';

interface LilistPrefixProps {
  element: any;
}

interface PopoverState {
  rect: { left: number; top: number; bottom: number };
  number: number;
}

/**
 * 列表前缀渲染：有序显示实时计算的编号，无序按缩进显示符号。
 * 前缀格式统一走 convertNumber 转换器：编号随缩进层级按 数字/英文/罗马 循环交替。
 * 刻意不做 memo：编号依赖前方兄弟节点状态，每次编辑器变更必须重算，否则会显示陈旧编号。
 * 有序编号支持交互：悬浮提示"设置编号"，点击打开编号设置弹框（对齐飞书）。
 */
export const LilistPrefix = ({ element }: LilistPrefixProps) => {
  const editor = useSlateStatic();
  const [popover, setPopover] = useState<PopoverState | null>(null);
  const [editing, setEditing] = useState(false);
  const lilist = getLilist(element);
  if (!lilist) return null;

  const isOl = lilist.list_type === LilistType.OL;
  const indent = element?.attrs?.indent ?? 0;
  let label = '';
  let number = 1;
  if (isOl) {
    try {
      const path = ReactEditor.findPath(editor, element);
      number = computeListNumber(editor, path);
      label = convertNumber(indent, number, lilist.list_type);
    } catch {
      label = convertNumber(indent, 1, lilist.list_type);
    }
  } else {
    label = convertNumber(indent, 1, lilist.list_type);
  }

  const handleClick = (e: React.MouseEvent<HTMLSpanElement>) => {
    if (!isOl) return;
    e.preventDefault();
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setPopover({
      rect: { left: rect.left, top: rect.top, bottom: rect.bottom },
      number,
    });
  };

  // 修改编号值：行内编辑提交（Enter / 失焦提交，Esc 取消）
  const commitEdit = (raw: string) => {
    setEditing(false);
    const v = parseInt(raw, 10);
    if (isNaN(v) || v === number) return;
    try {
      changeLilistNumber(editor, ReactEditor.findPath(editor, element), v);
    } catch {
      /* ignore */
    }
  };

  // 行内编辑态：编号本身变为输入框（飞书同款交互）
  if (isOl && editing) {
    return (
      <span className={styles.prefix} contentEditable={false} data-lilist-prefix="ol">
        <input
          className={styles.inlineInput}
          defaultValue={number}
          autoFocus
          onFocus={(e) => e.currentTarget.select()}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            e.stopPropagation();
            if (e.key === 'Enter') commitEdit(e.currentTarget.value);
            if (e.key === 'Escape') setEditing(false);
          }}
          onBlur={(e) => commitEdit(e.currentTarget.value)}
        />
        .
      </span>
    );
  }

  const prefixSpan = (
    <span
      className={`${styles.prefix} ${isOl ? styles.olNumber : ''}`}
      contentEditable={false}
      data-lilist-prefix={lilist.list_type}
      onClick={handleClick}
    >
      {label}
    </span>
  );

  return (
    <>
      {isOl ? (
        <Tooltip title="设置编号" mouseEnterDelay={0.35}>
          {prefixSpan}
        </Tooltip>
      ) : (
        prefixSpan
      )}
      {popover && (
        <LilistSettingPopover
          element={element}
          anchorRect={popover.rect}
          onEditNumber={() => setEditing(true)}
          onClose={() => setPopover(null)}
        />
      )}
    </>
  );
};
