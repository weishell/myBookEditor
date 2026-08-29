// 右键 / DocBar 拖拽按钮触发的上下文菜单
//
// 字体选择用 antd Popover 做二级菜单（右侧弹出），
// Popover 打开时同步 setHoveringMenu(true) 防止主菜单 200ms 后自动关闭。
// 非空文本块 hover 时显示"在下方插入"，点击后切换为块类型选择面板。

import { useEffect, useRef, useCallback, useState } from 'react';
import { useSlateStatic, ReactEditor } from 'slate-react';
import { Popover } from 'antd';
import { Editor, Element, Node, Transforms } from 'slate';
import { copyBlockToClipboard } from '@/utils/clipboard';
import { useMenu } from '@/plugins/menu-context';
import { setBlockFont } from '@/plugins/font';
import { BlockElementType, LilistType } from '@/enums';
import { BlockTypePicker, createBlockNode, isTextBlockType } from '@/plugins/block-picker';
import FontPicker from '@/components/FontPicker';
import {
  convertDocBarBlock,
  type DocBarConvertTarget,
  CONVERTIBLE_BLOCK_TYPES,
} from '@/plugins/docbar/docbar-commands';
import { getLilist, sortLilist } from '@/plugins/lilist';
import { blockTypeIconComponent } from '@/components/FloatBar/blockTypeIcons';
import styles from './ContextMenu.module.less';

export const ContextMenu = () => {
  // 注意：这里刻意不取 closeMenu —— 它是"延迟 200ms + 仅当鼠标不在菜单上才真关"的
  // 语义，用来做"鼠标移开自动关闭"。点击菜单项一律走 forceCloseMenu（见 closeAfterAction）。
  const { visible, position, forceCloseMenu, setHoveringMenu, targetId } = useMenu();
  const menuRef = useRef<HTMLDivElement>(null);
  const editor = useSlateStatic();

  // DocBar 场景：按 element.id 直接遍历 Slate 文档树找路径
  const getTargetPath = (): number[] | undefined => {
    if (!targetId) return undefined;
    const entries = Array.from(Editor.nodes(editor, { at: [] }));
    for (const [node, path] of entries) {
      if (Element.isElement(node) && (node as any).id === targetId) {
        return path;
      }
    }
    return undefined;
  };

  const targetPath = getTargetPath();
  const targetNode = targetPath ? (Node.get(editor, targetPath) as any) : null;

  const [fontOpen, setFontOpen] = useState(false);
  const [insertOpen, setInsertOpen] = useState(false);

  const adjustPosition = useCallback(() => {
    if (!menuRef.current) return;
    const menu = menuRef.current;
    const rect = menu.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const maxHeight = windowHeight - 40;
    if (rect.height > maxHeight) {
      menu.style.maxHeight = `${maxHeight}px`;
      menu.style.overflowY = 'auto';
    } else {
      menu.style.maxHeight = 'none';
      menu.style.overflowY = 'visible';
    }
    if (rect.bottom > windowHeight) {
      const newTop = windowHeight - rect.height - 20;
      if (newTop >= 0) menu.style.top = `${newTop}px`;
    }
  }, []);

  useEffect(() => {
    if (visible) requestAnimationFrame(adjustPosition);
  }, [visible, position, adjustPosition]);

  // 菜单关闭时重置内部状态
  useEffect(() => {
    if (!visible) {
      setFontOpen(false);
      setInsertOpen(false);
    }
  }, [visible]);

  // 菜单打开期间：滚轮不能穿透到页面。
  //
  // 背景：浮层（主菜单 + antd Popover 子面板）浮在页面之上，但 wheel 事件仍会
  // 冒泡到 document 触发页面滚动 —— 在菜单上滚一下鼠标、下面的文档跟着跑。
  //
  // 规则：
  //  - 事件发生在浮层内部且该浮层自身可滚动 → 放它内部滚（长菜单要能滚到底）；
  //    滚到顶/底边界后 preventDefault，避免"滚动链接"继续带动页面。
  //  - 其余情况（遮罩上、浮层不可滚动）→ 直接 preventDefault，页面不动。
  //
  // 注意必须 { passive: false }：现代浏览器在 document 上把 wheel 默认设为
  // passive，不显式声明的话 preventDefault 会被忽略并告警。
  useEffect(() => {
    if (!visible) return;

    const findScrollableLayer = (target: EventTarget | null): HTMLElement | null => {
      const el = target instanceof HTMLElement ? target : null;
      if (!el) return null;
      // antd Popover 是 portal 到 body 的，不在 menuRef 里，单独判断
      const popover = el.closest('.ant-popover') as HTMLElement | null;
      if (popover) return popover;
      const menu = menuRef.current;
      if (menu && menu.contains(el)) return menu;
      return null;
    };

    const handleWheel = (e: WheelEvent) => {
      const layer = findScrollableLayer(e.target);
      // 不在浮层内（例如在遮罩上滚）→ 直接吃掉，页面不动
      if (!layer) {
        e.preventDefault();
        return;
      }
      // 浮层可滚动时让它内部滚；到顶/底后再滚就要拦住，否则带动页面
      const canScroll = layer.scrollHeight > layer.clientHeight + 1;
      if (!canScroll) {
        e.preventDefault();
        return;
      }
      const atTop = layer.scrollTop <= 0;
      const atBottom = layer.scrollTop + layer.clientHeight >= layer.scrollHeight - 1;
      if ((e.deltaY < 0 && atTop) || (e.deltaY > 0 && atBottom)) {
        e.preventDefault();
      }
    };

    document.addEventListener('wheel', handleWheel, { passive: false });
    return () => document.removeEventListener('wheel', handleWheel);
  }, [visible]);

  // 复制：选中块并写入系统剪贴板（不直接插入）。
  // 真正的"粘贴"由 editor.insertFragment 处理（解析 x-slate-fragment、逐层重生成 id）。
  const handleCopy = () => {
    const path = getTargetPath();
    if (!path) return;
    copyBlockToClipboard(editor, path);
  };

  /**
   * 删除当前目标块。
   * 特例：被删的是有序列表（lilist.list_type === 'ol'）项时，删除后同 list_id
   * 后续项会因编号空缺而错位，必须用 sortLilist 触发一次组内重排。
   * 无序列表 / 普通段落删除后不涉及编号，无需重排。
   */
  const handleDelete = () => {
    const path = getTargetPath();
    if (!path) return;
    const node = Node.get(editor, path) as any;
    const lilist = getLilist(node);
    const listId = lilist?.list_id;
    const isOrdered = lilist?.list_type === LilistType.OL;
    const deletedIndex = path[0];

    Editor.withoutNormalizing(editor, () => {
      Transforms.removeNodes(editor, { at: path });
      if (isOrdered && listId) {
        // children 数组中，被删位置之后的同 list_id 块要从 deletedIndex 重新编号
        sortLilist(editor, [listId], deletedIndex);
      }
    });
  };

  /**
   * 点击菜单项后的收尾：立即关闭菜单 + 清 hovering 标记。
   *
   * 为什么不能直接 forceCloseMenu 了事：菜单被卸载后它的 onMouseLeave 不会再触发，
   * hoveringMenu 会残留 true，而 DocBar 的"鼠标离开后 200ms 自动关闭"逻辑依赖它，
   * 残留会让下次自动关闭失效。所以这里顺手置 false。
   */
  const closeAfterAction = () => {
    setHoveringMenu(false);
    forceCloseMenu();
  };

  const handleMenuClick = (action: string) => {
    // 注意：点击菜单项后一律用 closeAfterAction 而不是 closeMenu。
    // closeMenu 是"延迟 200ms + 仅当鼠标不在菜单上才真关"，而点击时鼠标必定在菜单上，
    // 结果就是点了不关、要再点别处才消失（用户反馈的 bug）。
    if (action === 'copy') {
      handleCopy();
      closeAfterAction();
      return;
    }
    if (action === 'delete') {
      handleDelete();
      closeAfterAction();
      return;
    }

    const convertActions = new Set<string>([
      'text',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'h7',
      'h8',
      'h9',
      'numbered-list',
      'bulleted-list',
      'checkbox',
      'quote',
      'code-block',
    ]);
    if (convertActions.has(action)) {
      const targetPath = getTargetPath();
      if (targetPath) {
        convertDocBarBlock(editor, action as DocBarConvertTarget, targetPath);
      }
      closeAfterAction();
      return;
    }

    console.warn(action);
    closeAfterAction();
  };

  // 类型转换按钮对"可转换块"启用；其余按钮按当前实现状态保持禁用。
  // 'delete' 也归入转换类条件：可转换块（PARAGRAPH/HEADING/BLOCKQUOTE/TODO_LIST/CODE_BLOCK）
  // 都可以被用户删除。
  const CONVERT_ACTIONS = [
    'text',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'h7',
    'h8',
    'h9',
    'numbered-list',
    'bulleted-list',
    'checkbox',
    'quote',
    'code-block',
  ];

  const isConvertibleBlock = !!targetNode && CONVERTIBLE_BLOCK_TYPES.includes(targetNode.type);

  const DISABLED_ACTIONS = [
    'code',
    'indent',
    'color',
    'comment',
    'cut',
    ...(!isConvertibleBlock ? ['delete', ...CONVERT_ACTIONS] : []),
  ];

  // 当前目标块的"激活态"判定：基于 hover 块的 type + attrs 独立判断，
  // 每个按钮各算各的，自然支持多 active 并存（典型场景：H3 段落挂有序列表
  // → H3 和「有序列表」两个按钮同时蓝底高亮；图2 红框标注）。
  const targetAttrs = targetNode?.attrs;
  const targetType = targetNode?.type;
  const targetLilist = targetAttrs?.lilist;
  const isConvertActive = (action: DocBarConvertTarget): boolean => {
    if (!targetNode) return false;
    switch (action) {
      case 'text':
        return targetType === BlockElementType.PARAGRAPH && !targetLilist;
      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
      case 'h5':
      case 'h6':
      case 'h7':
      case 'h8':
      case 'h9': {
        const level = Number(action.slice(1));
        return targetType === BlockElementType.HEADING && targetAttrs?.level === level;
      }
      case 'numbered-list':
        return !!targetLilist && targetLilist.list_type === LilistType.OL;
      case 'bulleted-list':
        return !!targetLilist && targetLilist.list_type === LilistType.UL;
      case 'checkbox':
        return targetType === BlockElementType.TODO_LIST;
      case 'quote':
        return targetType === BlockElementType.BLOCKQUOTE;
      case 'code-block':
        return targetType === BlockElementType.CODE_BLOCK;
      default:
        return false;
    }
  };

  // 字体选择回调：DocBar 场景只改当前 hover 的块
  const handleFontChange = (fontFamily: string) => {
    const targetPath = getTargetPath();
    setBlockFont(editor, fontFamily, targetPath);
    setFontOpen(false);
    closeAfterAction();
  };

  // list-item 的父容器是列表：在父列表之后插入，避免破坏列表结构
  const getInsertPathAfter = (path: number[]): number[] => {
    const node = Node.get(editor, path) as any;
    if (node?.type === BlockElementType.LIST_ITEM) {
      for (let i = path.length - 2; i >= 0; i--) {
        const parent = Node.get(editor, path.slice(0, i + 1)) as any;
        if (
          parent?.type === BlockElementType.BULLETED_LIST ||
          parent?.type === BlockElementType.NUMBERED_LIST
        ) {
          const parentPath = path.slice(0, i + 1);
          return [...parentPath.slice(0, -1), parentPath[parentPath.length - 1] + 1];
        }
      }
    }
    return [...path.slice(0, -1), path[path.length - 1] + 1];
  };

  // 在目标块下方插入新块并聚焦
  const handleInsertBlock = (
    type: BlockElementType,
    options?: { level?: number; columns?: number },
  ) => {
    const path = getTargetPath();
    if (!path) return;
    const insertPath = getInsertPathAfter(path);
    Transforms.insertNodes(editor, createBlockNode(type, options), { at: insertPath });
    Transforms.select(editor, Editor.start(editor, insertPath));
    ReactEditor.focus(editor);
    setInsertOpen(false);
    closeAfterAction();
  };

  if (!visible) return null;

  // "在下方插入"仅对非空文本类块可用
  const canInsertBelow =
    !!targetNode &&
    Element.isElement(targetNode) &&
    isTextBlockType(targetNode.type) &&
    Node.string(targetNode).trim() !== '';

  return (
    <>
      <div className={styles.overlay} onClick={forceCloseMenu} />
      <div
        ref={menuRef}
        className={styles.menu}
        style={{ left: position.x, top: position.y }}
        onClick={(e) => e.stopPropagation()}
        onMouseEnter={() => setHoveringMenu(true)}
        onMouseLeave={() => setHoveringMenu(false)}
      >
        <div className={styles.toolbar}>
          <button
            onClick={() => handleMenuClick('text')}
            className={isConvertActive('text') ? styles.btnPrimary : styles.btnToolBold}
            disabled={DISABLED_ACTIONS.includes('text')}
          >
            T
          </button>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => handleMenuClick(`h${n}` as DocBarConvertTarget)}
              className={
                isConvertActive(`h${n}` as DocBarConvertTarget)
                  ? styles.btnPrimary
                  : styles.btnToolBold
              }
              disabled={DISABLED_ACTIONS.includes(`h${n}`)}
            >
              H{n}
            </button>
          ))}
        </div>
        <div className={styles.toolbar}>
          {[6, 7, 8, 9].map((n) => (
            <button
              key={n}
              onClick={() => handleMenuClick(`h${n}` as DocBarConvertTarget)}
              className={
                isConvertActive(`h${n}` as DocBarConvertTarget)
                  ? styles.btnPrimary
                  : styles.btnToolBold
              }
              disabled={DISABLED_ACTIONS.includes(`h${n}`)}
            >
              H{n}
            </button>
          ))}
          <button
            onClick={() => handleMenuClick('numbered-list')}
            className={isConvertActive('numbered-list') ? styles.btnPrimary : styles.btnTool}
            disabled={DISABLED_ACTIONS.includes('numbered-list')}
            title="有序列表"
          >
            {(() => {
              const Cmp = blockTypeIconComponent('numbered');
              return Cmp ? <Cmp size={16} /> : null;
            })()}
          </button>
          <button
            onClick={() => handleMenuClick('bulleted-list')}
            className={isConvertActive('bulleted-list') ? styles.btnPrimary : styles.btnTool}
            disabled={DISABLED_ACTIONS.includes('bulleted-list')}
            title="无序列表"
          >
            {(() => {
              const Cmp = blockTypeIconComponent('bulleted');
              return Cmp ? <Cmp size={16} /> : null;
            })()}
          </button>
        </div>
        <div className={styles.divider} />
        <div className={styles.toolbar}>
          <button
            onClick={() => handleMenuClick('checkbox')}
            className={isConvertActive('checkbox') ? styles.btnPrimary : styles.btnTool}
            disabled={DISABLED_ACTIONS.includes('checkbox')}
            title="任务"
          >
            {(() => {
              const Cmp = blockTypeIconComponent('todo');
              return Cmp ? <Cmp size={16} /> : null;
            })()}
          </button>
          <button
            onClick={() => handleMenuClick('code-block')}
            className={isConvertActive('code-block') ? styles.btnPrimary : styles.btnToolMono}
            disabled={DISABLED_ACTIONS.includes('code-block')}
            title="代码块"
          >
            {(() => {
              const Cmp = blockTypeIconComponent('code-block');
              return Cmp ? <Cmp size={16} /> : null;
            })()}
          </button>
          <button
            onClick={() => handleMenuClick('quote')}
            className={isConvertActive('quote') ? styles.btnPrimary : styles.btnTool}
            disabled={DISABLED_ACTIONS.includes('quote')}
            title="引用"
          >
            {(() => {
              const Cmp = blockTypeIconComponent('quote');
              return Cmp ? <Cmp size={16} /> : null;
            })()}
          </button>
        </div>
        <div className={styles.divider} />
        <button
          onClick={() => handleMenuClick('indent')}
          className={styles.btnAction}
          disabled={DISABLED_ACTIONS.includes('indent')}
        >
          <span className={styles.actionIcon}>☰</span>
          <span>缩进和对齐</span>
          <span className={styles.actionArrow}>›</span>
        </button>
        <Popover
          open={fontOpen}
          onOpenChange={(open) => {
            setFontOpen(open);
            setHoveringMenu(open);
          }}
          content={
            <div
              onMouseEnter={() => setHoveringMenu(true)}
              onMouseLeave={() => setHoveringMenu(false)}
            >
              <FontPicker onFontChange={handleFontChange} />
            </div>
          }
          trigger="click"
          placement="right"
        >
          <button
            className={`${styles.btnAction} ${fontOpen ? styles.btnActionActive : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              setFontOpen(!fontOpen);
              setHoveringMenu(true);
            }}
          >
            <span className={styles.actionIcon}>Aa</span>
            <span>字体</span>
            <span className={styles.actionArrow}>{fontOpen ? '⌄' : '›'}</span>
          </button>
        </Popover>
        <button
          onClick={() => handleMenuClick('color')}
          className={styles.btnAction}
          disabled={DISABLED_ACTIONS.includes('color')}
        >
          <span className={styles.actionIcon}>🎨</span>
          <span>颜色</span>
          <span className={styles.actionArrow}>›</span>
        </button>
        <div className={styles.divider} />
        <button
          onClick={() => handleMenuClick('comment')}
          className={styles.btnAction}
          disabled={DISABLED_ACTIONS.includes('comment')}
        >
          <span className={styles.actionIcon}>💬</span>
          <span>评论</span>
        </button>
        <button
          onClick={() => handleMenuClick('cut')}
          className={styles.btnAction}
          disabled={DISABLED_ACTIONS.includes('cut')}
        >
          <span className={styles.actionIcon}>✂</span>
          <span>剪切</span>
        </button>
        <button
          onClick={() => handleMenuClick('copy')}
          className={styles.btnAction}
          disabled={DISABLED_ACTIONS.includes('copy')}
        >
          <span className={styles.actionIcon}>📋</span>
          <span>复制</span>
        </button>
        <button
          onClick={() => handleMenuClick('delete')}
          className={styles.btnAction}
          disabled={DISABLED_ACTIONS.includes('delete')}
        >
          <span className={styles.actionIcon}>🗑</span>
          <span>删除</span>
        </button>
        {canInsertBelow && (
          <>
            <div className={styles.divider} />
            <Popover
              open={insertOpen}
              onOpenChange={(open) => {
                setInsertOpen(open);
                setHoveringMenu(open);
              }}
              // antd Popover 默认给内容容器 padding 12-16px，会让 BlockTypePicker
              // 内部看着比左侧 DocBar 块类型区宽一圈。归零让 picker 自身控制。
              overlayInnerStyle={{ padding: 0 }}
              content={
                <div
                  onMouseEnter={() => setHoveringMenu(true)}
                  onMouseLeave={() => setHoveringMenu(false)}
                >
                  <BlockTypePicker onSelect={handleInsertBlock} />
                </div>
              }
              trigger="click"
              placement="right"
            >
              <button
                className={`${styles.btnAction} ${insertOpen ? styles.btnActionActive : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setInsertOpen(!insertOpen);
                  setHoveringMenu(true);
                }}
              >
                <span className={styles.actionIcon}>＋</span>
                <span>在下方插入</span>
                <span className={styles.actionArrow}>{insertOpen ? '⌄' : '›'}</span>
              </button>
            </Popover>
          </>
        )}
      </div>
    </>
  );
};
