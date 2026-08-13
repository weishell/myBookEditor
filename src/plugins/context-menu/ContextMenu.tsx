// 右键 / DocBar 拖拽按钮触发的上下文菜单
//
// 字体选择用 antd Popover 做二级菜单（右侧弹出），
// Popover 打开时同步 setHoveringMenu(true) 防止主菜单 200ms 后自动关闭。
// 非空文本块 hover 时显示"在下方插入"，点击后切换为块类型选择面板。

import { useEffect, useRef, useCallback, useState } from 'react';
import { useSlateStatic, ReactEditor } from 'slate-react';
import { Popover } from 'antd';
import { Editor, Element, Node, Transforms } from 'slate';
import { useMenu } from '@/plugins/menu-context';
import { setBlockFont } from '@/plugins/font';
import { BlockElementType } from '@/enums';
import { BlockTypePicker, createBlockNode, isTextBlockType } from '@/plugins/block-picker';
import FontPicker from '@/components/FontPicker';
import styles from './ContextMenu.module.less';

export const ContextMenu = () => {
  const { visible, position, closeMenu, forceCloseMenu, setHoveringMenu, targetId } = useMenu();
  const menuRef = useRef<HTMLDivElement>(null);
  const editor = useSlateStatic();
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

  const handleMenuClick = (action: string) => {
    console.warn(action);
    closeMenu();
  };

  // 所有功能目前只有 console.warn，全部标记为 disabled，字体除外（真正实现了 setBlockFont）
  const DISABLED_ACTIONS = [
    'text',
    'h1',
    'h2',
    'h3',
    'numbered-list',
    'bulleted-list',
    'checkbox',
    'code',
    'quote',
    'code-block',
    'link',
    'indent',
    'color',
    'comment',
    'cut',
    'copy',
    'delete',
  ];

  // DocBar 场景：按 element.id 直接遍历 Slate 文档树找路径
  // 使用 Editor.nodes() 从根节点遍历所有节点，因为 Node.get(editor, [])
  // 返回的 editor 对象不是 Element 类型（Editor.isEditor 返回 true），
  // 导致 Element.isElement(editor) 返回 false，递归搜索无法进入子节点
  const getTargetPath = (): number[] | undefined => {
    if (!targetId) return undefined;

    // 遍历所有节点，找到 id 匹配的 Element
    const entries = Array.from(Editor.nodes(editor, { at: [] }));
    for (const [node, path] of entries) {
      if (Element.isElement(node) && (node as any).id === targetId) {
        return path;
      }
    }
    return undefined;
  };

  // 字体选择回调：DocBar 场景只改当前 hover 的块
  const handleFontChange = (fontFamily: string) => {
    const targetPath = getTargetPath();
    setBlockFont(editor, fontFamily, targetPath);
    setFontOpen(false);
    closeMenu();
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
  const handleInsertBlock = (type: BlockElementType, options?: { level?: number }) => {
    const path = getTargetPath();
    if (!path) return;
    const insertPath = getInsertPathAfter(path);
    Transforms.insertNodes(editor, createBlockNode(type, options), { at: insertPath });
    Transforms.select(editor, Editor.start(editor, insertPath));
    ReactEditor.focus(editor);
    setInsertOpen(false);
    forceCloseMenu();
  };

  if (!visible) return null;

  // "在下方插入"仅对非空文本类块可用
  const targetPath = getTargetPath();
  const targetNode = targetPath ? (Node.get(editor, targetPath) as any) : null;
  const canInsertBelow =
    !!targetNode &&
    Element.isElement(targetNode) &&
    isTextBlockType(targetNode.type) &&
    Node.string(targetNode).trim() !== '';

  return (
    <>
      <div className={styles.overlay} onClick={closeMenu} />
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
            className={styles.btnPrimary}
            disabled={DISABLED_ACTIONS.includes('text')}
          >
            T
          </button>
          <button
            onClick={() => handleMenuClick('h1')}
            className={styles.btnToolBold}
            disabled={DISABLED_ACTIONS.includes('h1')}
          >
            H1
          </button>
          <button
            onClick={() => handleMenuClick('h2')}
            className={styles.btnToolBold}
            disabled={DISABLED_ACTIONS.includes('h2')}
          >
            H2
          </button>
          <button
            onClick={() => handleMenuClick('h3')}
            className={styles.btnToolBold}
            disabled={DISABLED_ACTIONS.includes('h3')}
          >
            H3
          </button>
          <button
            onClick={() => handleMenuClick('numbered-list')}
            className={styles.btnTool}
            disabled={DISABLED_ACTIONS.includes('numbered-list')}
          >
            ≡
          </button>
          <button
            onClick={() => handleMenuClick('bulleted-list')}
            className={styles.btnTool}
            disabled={DISABLED_ACTIONS.includes('bulleted-list')}
          >
            ≡
          </button>
        </div>
        <div className={styles.divider} />
        <div className={styles.toolbar}>
          <button
            onClick={() => handleMenuClick('checkbox')}
            className={styles.btnTool}
            disabled={DISABLED_ACTIONS.includes('checkbox')}
          >
            ☐
          </button>
          <button
            onClick={() => handleMenuClick('code')}
            className={styles.btnToolMono}
            disabled={DISABLED_ACTIONS.includes('code')}
          >
            {'{ }'}
          </button>
          <button
            onClick={() => handleMenuClick('quote')}
            className={styles.btnTool}
            disabled={DISABLED_ACTIONS.includes('quote')}
          >
            "
          </button>
          <button
            onClick={() => handleMenuClick('code-block')}
            className={styles.btnToolMono}
            disabled={DISABLED_ACTIONS.includes('code-block')}
          >
            &lt;/&gt;
          </button>
          <button
            onClick={() => handleMenuClick('link')}
            className={styles.btnTool}
            disabled={DISABLED_ACTIONS.includes('link')}
          >
            🔗
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
