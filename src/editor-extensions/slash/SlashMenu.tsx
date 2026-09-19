// 斜杠命令弹层 + 命令执行。
//
// 触发由 withSlashCommand 负责，这里只做「展示 + 键盘交互 + 执行」：
//   - 展示：portal 定位在光标附近，飞书风浮层（分组：基础/常用）。
//   - 键盘：捕获阶段拦截 ↑/↓/Enter/Esc，↑↓ 移动高亮、Enter 确认、Esc 关闭。
//   - 执行：转换类走 convertDocBarBlock（复用 DocBar 语义）；插入类走
//     createBlockNode/insertTable/openAndInsertImages（复用右键菜单语义）。
import { createElement, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { Editor, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';
import { BlockElementType } from '@/enums';
import { convertDocBarBlock, type DocBarConvertTarget } from '@/plugins/docbar/docbar-commands';
import { createBlockNode } from '@/plugins/block-picker';
import { openAndInsertImages } from '@/plugins/image/uploadImage';
import { insertTable } from '@/plugins/table/table-operations';
import { blockTypeIconComponent } from '@/components/FloatBar/blockTypeIcons';
import { slashStore, getSlashEditor } from './slash-store';
import styles from './SlashMenu.module.less';

type SlashCmd =
  | {
      kind: 'convert';
      target: DocBarConvertTarget;
      label: string;
      icon: React.ReactNode;
      mono?: boolean;
      group: 'basic';
    }
  | {
      kind: 'insert';
      target: BlockElementType;
      label: string;
      icon: React.ReactNode;
      group: 'common';
    };

/** DocBarConvertTarget → 图标 key 映射（blockTypeIconComponent 用 BlockType key） */
const ICON_KEY: Record<DocBarConvertTarget, string> = {
  text: 'paragraph',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  h7: 'h7',
  h8: 'h8',
  h9: 'h9',
  'numbered-list': 'numbered',
  'bulleted-list': 'bulleted',
  checkbox: 'todo',
  quote: 'quote',
  hint: 'hint',
  'code-block': 'code-block',
};

const convertItem = (target: DocBarConvertTarget, label: string): SlashCmd => {
  // blockTypeIconComponent 返回组件类型（function/class），需先渲染成 ReactNode，
  // 否则 ComponentType 不能直接赋给 ReactNode（TS2322）。
  const IconCmp = blockTypeIconComponent(ICON_KEY[target] as any);
  return {
    kind: 'convert',
    target,
    label,
    group: 'basic',
    icon: IconCmp ? createElement(IconCmp) : <span>{label}</span>,
  };
};

const BASIC_CMDS: SlashCmd[] = [
  convertItem('text', '文本'),
  convertItem('h1', '一级标题'),
  convertItem('h2', '二级标题'),
  convertItem('h3', '三级标题'),
  convertItem('h4', '四级标题'),
  convertItem('h5', '五级标题'),
  convertItem('numbered-list', '有序列表'),
  convertItem('bulleted-list', '无序列表'),
  convertItem('checkbox', '待办任务'),
  convertItem('code-block', '代码块'),
  convertItem('quote', '引用'),
  convertItem('hint', '提示块'),
];

const COMMON_CMDS: SlashCmd[] = [
  {
    kind: 'insert',
    group: 'common',
    target: BlockElementType.IMAGE_BLOCK,
    label: '图片',
    icon: '🖼',
  },
  { kind: 'insert', group: 'common', target: BlockElementType.TABLE, label: '表格', icon: '⊞' },
  {
    kind: 'insert',
    group: 'common',
    target: BlockElementType.EMBED,
    label: '内嵌网页',
    icon: '🌐',
  },
  { kind: 'insert', group: 'common', target: BlockElementType.DIVIDER, label: '分隔线', icon: '—' },
];

const ALL_CMDS = [...BASIC_CMDS, ...COMMON_CMDS];

const matchCmd = (cmd: SlashCmd, query: string): boolean => {
  if (!query) return true;
  const q = query.toLowerCase();
  return cmd.label.toLowerCase().includes(q) || cmd.target.toLowerCase().includes(q);
};

/** 当前位置之后插入新块的 path（与右键菜单语义一致） */
const nextPathAfter = (path: number[]): number[] => [
  ...path.slice(0, -1),
  path[path.length - 1] + 1,
];

export const SlashMenu = () => {
  const state = useSyncExternalStore(slashStore.subscribe, slashStore.get, slashStore.get);
  const [active, setActive] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);

  // 过滤后的命令（保持 基础->常用 原有顺序）
  const visibleCmds = useMemo(
    () => ALL_CMDS.filter((c) => matchCmd(c, state.query)),
    [state.query],
  );
  // 第一个"常用"项在 visibleCmds 里的位置，用于分组渲染时对齐高亮下标
  const commonStart = useMemo(
    () => visibleCmds.findIndex((c) => c.group === 'common'),
    [visibleCmds],
  );

  // query 变化时把高亮夹紧到可见范围内
  useEffect(() => {
    setActive((a) => (visibleCmds.length ? Math.min(a, visibleCmds.length - 1) : 0));
  }, [visibleCmds.length]);

  // 菜单打开期间的全局键盘拦截（捕获阶段，先于 Editable 的 bubble 处理）
  useEffect(() => {
    if (!state.open) return;
    const onKey = (e: KeyboardEvent) => {
      if (visibleCmds.length === 0) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        e.stopPropagation();
        setActive((a) => (a + 1) % visibleCmds.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        e.stopPropagation();
        setActive((a) => (a - 1 + visibleCmds.length) % visibleCmds.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        e.stopPropagation();
        const cmd = visibleCmds[active];
        if (cmd) execute(cmd);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        slashStore.close();
      }
    };
    document.addEventListener('keydown', onKey, true);
    const onPointer = (e: PointerEvent) => {
      if (menuRef.current && e.target instanceof Node && menuRef.current.contains(e.target)) return;
      slashStore.close();
    };
    document.addEventListener('pointerdown', onPointer, true);
    const onScroll = () =>
      window.requestAnimationFrame(() => {
        if (!menuRef.current) return;
        const sel = window.getSelection();
        if (sel && sel.rangeCount) {
          const r = sel.getRangeAt(0).getBoundingClientRect();
          menuRef.current.style.left = `${Math.max(8, r.left)}px`;
          menuRef.current.style.top = `${Math.min(window.innerHeight - 340, r.bottom + 6)}px`;
        }
      });
    window.addEventListener('scroll', onScroll, true);
    return () => {
      document.removeEventListener('keydown', onKey, true);
      document.removeEventListener('pointerdown', onPointer, true);
      window.removeEventListener('scroll', onScroll, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.open, visibleCmds.length, active]);

  if (!state.open) return null;

  const baseX = state.rect ? Math.max(8, state.rect.left) : 24;
  const baseY = state.rect
    ? Math.min(window.innerHeight - 340, state.rect.top + state.rect.height + 4)
    : 24;

  const basics = commonStart < 0 ? visibleCmds : visibleCmds.slice(0, commonStart);
  const commons = commonStart < 0 ? [] : visibleCmds.slice(commonStart);

  return createPortal(
    <div
      ref={menuRef}
      className={styles.menu}
      style={{ left: baseX, top: baseY }}
      onClick={(e) => e.stopPropagation()}
    >
      {basics.length > 0 && (
        <>
          <div className={styles.groupLabel}>基础</div>
          <div className={styles.group}>
            {basics.map((cmd, i) => (
              <CmdItem
                key={`b-${cmd.target}`}
                cmd={cmd}
                isActive={active === i}
                onHover={() => setActive(i)}
                onClick={execute}
              />
            ))}
          </div>
        </>
      )}
      {basics.length > 0 && commons.length > 0 && <div className={styles.divider} />}
      {commons.length > 0 && (
        <>
          <div className={styles.groupLabel}>常用</div>
          <div className={styles.group}>
            {commons.map((cmd, j) => {
              const idx = commonStart + j;
              return (
                <CmdItem
                  key={`c-${cmd.target}`}
                  cmd={cmd}
                  isActive={active === idx}
                  onHover={() => setActive(idx)}
                  onClick={execute}
                />
              );
            })}
          </div>
        </>
      )}
      {visibleCmds.length === 0 && <div className={styles.empty}>没有匹配的块类型</div>}
    </div>,
    document.body,
  );
};

const CmdItem = ({
  cmd,
  isActive,
  onHover,
  onClick,
}: {
  cmd: SlashCmd;
  isActive: boolean;
  onHover: () => void;
  onClick: (cmd: SlashCmd) => void;
}) => (
  <button
    className={`${styles.item} ${isActive ? styles.itemActive : ''}`}
    onMouseEnter={onHover}
    onClick={(e) => {
      e.stopPropagation();
      onClick(cmd);
    }}
  >
    <span className={styles.itemIcon}>{cmd.icon}</span>
    <span className={styles.itemLabel}>{cmd.label}</span>
  </button>
);

// ---------- 执行 ----------

const execute = (cmd: SlashCmd) => {
  const ed = getSlashEditor();
  const st = slashStore.get();
  const blockPath = st.blockPath;
  const slashPoint = st.slashPoint;
  if (!ed || !blockPath || !slashPoint) return;

  const anchor = ed.selection?.anchor;
  // 1) 删掉已在文档里输入的 "/query"
  Editor.withoutNormalizing(ed, () => {
    if (anchor) {
      try {
        Transforms.delete(ed, { at: { anchor: slashPoint, focus: anchor } });
      } catch {
        /* 光标已不在原位，忽略删除 */
      }
    }
  });
  slashStore.close();

  try {
    if (cmd.kind === 'convert') {
      convertDocBarBlock(ed, cmd.target, blockPath);
    } else {
      applyInsert(ed, cmd, blockPath);
    }
    ReactEditor.focus(ed);
  } catch {
    /* ignore */
  }
};

const applyInsert = (
  ed: Editor,
  cmd: Extract<SlashCmd, { kind: 'insert' }>,
  blockPath: number[],
) => {
  switch (cmd.target) {
    case BlockElementType.IMAGE_BLOCK:
      void openAndInsertImages(ed, nextPathAfter(blockPath));
      return;
    case BlockElementType.TABLE:
      insertTable(ed, 3, 3);
      return;
    case BlockElementType.EMBED:
    case BlockElementType.DIVIDER:
    default: {
      const node = createBlockNode(cmd.target, {}) as any;
      Transforms.setNodes(ed, node, { at: blockPath });
    }
  }
};
