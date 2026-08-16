import { useSlateStatic, ReactEditor } from 'slate-react';
import { computeListNumber, convertNumber, getLilist, LilistType } from './lilist-model';
import styles from './LilistPrefix.module.less';

interface LilistPrefixProps {
  element: any;
}

/**
 * 列表前缀渲染：有序显示实时计算的编号，无序按缩进显示符号。
 * 前缀格式统一走 convertNumber 转换器：编号随缩进层级按 数字/英文/罗马 循环交替。
 * 刻意不做 memo：编号依赖前方兄弟节点状态，每次编辑器变更必须重算，否则会显示陈旧编号。
 */
export const LilistPrefix = ({ element }: LilistPrefixProps) => {
  const editor = useSlateStatic();
  const lilist = getLilist(element);
  if (!lilist) return null;

  const indent = element?.attrs?.indent ?? 0;
  let label = '';
  if (lilist.list_type === LilistType.OL) {
    try {
      const path = ReactEditor.findPath(editor, element);
      label = convertNumber(indent, computeListNumber(editor, path), lilist.list_type);
    } catch {
      label = convertNumber(indent, 1, lilist.list_type);
    }
  } else {
    label = convertNumber(indent, 1, lilist.list_type);
  }

  return (
    <span className={styles.prefix} contentEditable={false} data-lilist-prefix={lilist.list_type}>
      {label}
    </span>
  );
};
