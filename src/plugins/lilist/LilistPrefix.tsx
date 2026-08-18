import { useState } from 'react';
import { Tooltip } from 'antd';
import { BlockElementType } from '@/enums';
import { convertNumber, getLilist, LilistType } from './lilist-model';
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
 * 列表前缀渲染：有序直接读 attrs.lilist.list_number（由 sortLilist 回写，不现算），
 * 无序按缩进显示符号。前缀格式统一走 convertNumber 转换器：
 * 编号随缩进层级按 数字/英文/罗马 循环交替。
 * H 标题有序特例：层级编号，直接读 list_path（H1 = 1.，H2 = 1.1，对齐飞书标题编号）。
 * 有序编号支持交互：悬浮提示“设置编号”，点击打开编号设置弹框（对齐飞书）。
 */
export const LilistPrefix = ({ element }: LilistPrefixProps) => {
  const [popover, setPopover] = useState<PopoverState | null>(null);
  const lilist = getLilist(element);
  if (!lilist) return null;

  const isOl = lilist.list_type === LilistType.OL;
  const isHeading = element?.type === BlockElementType.HEADING;
  const indent = element?.attrs?.indent ?? 0;
  const number = isOl ? lilist.list_number || 1 : 1;
  // 标题层级编号：H1 带尾点（1.），更深层级显示完整路径（1.1 / 1.1.1）
  const label =
    isOl && isHeading && lilist.list_path
      ? (element?.attrs?.level ?? 1) === 1
        ? `${lilist.list_path}.`
        : lilist.list_path
      : convertNumber(indent, number, lilist.list_type);

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

  const prefixSpan = (
    <span
      className={`${styles.prefix} ${isOl ? styles.olNumber : styles.ulBullet}`}
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
          currentNumber={popover.number}
          onClose={() => setPopover(null)}
        />
      )}
    </>
  );
};
