// 右键 / DocBar 拖拽按钮触发的上下文菜单
//
// 字体选择用 antd Popover 做二级菜单（右侧弹出），
// Popover 打开时同步 setHoveringMenu(true) 防止主菜单 200ms 后自动关闭。

import { useEffect, useRef, useCallback, useState } from 'react';
import { useSlateStatic } from 'slate-react';
import { Popover } from 'antd';
import { Editor, Element } from 'slate';
import { useMenu } from '@/plugins/menu-context';
import { setBlockFont } from '@/plugins/font';
import FontPicker from '@/components/FontPicker';
import styles from './ContextMenu.module.less';

export const ContextMenu = () => {
  const { visible, position, closeMenu, setHoveringMenu, targetId } = useMenu();
  const menuRef = useRef<HTMLDivElement>(null);
  const editor = useSlateStatic();
  const [fontOpen, setFontOpen] = useState(false);

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
    if (!visible) setFontOpen(false);
  }, [visible]);

  const handleMenuClick = (action: string) => {
    console.warn(action);
    closeMenu();
  };

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

  if (!visible) return null;

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
          <button onClick={() => handleMenuClick('text')} className={styles.btnPrimary}>
            T
          </button>
          <button onClick={() => handleMenuClick('h1')} className={styles.btnToolBold}>
            H1
          </button>
          <button onClick={() => handleMenuClick('h2')} className={styles.btnToolBold}>
            H2
          </button>
          <button onClick={() => handleMenuClick('h3')} className={styles.btnToolBold}>
            H3
          </button>
          <button onClick={() => handleMenuClick('numbered-list')} className={styles.btnTool}>
            ≡
          </button>
          <button onClick={() => handleMenuClick('bulleted-list')} className={styles.btnTool}>
            ≡
          </button>
        </div>
        <div className={styles.divider} />
        <div className={styles.toolbar}>
          <button onClick={() => handleMenuClick('checkbox')} className={styles.btnTool}>
            ☐
          </button>
          <button onClick={() => handleMenuClick('code')} className={styles.btnToolMono}>
            {'{ }'}
          </button>
          <button onClick={() => handleMenuClick('quote')} className={styles.btnTool}>
            "
          </button>
          <button onClick={() => handleMenuClick('code-block')} className={styles.btnToolMono}>
            &lt;/&gt;
          </button>
          <button onClick={() => handleMenuClick('link')} className={styles.btnTool}>
            🔗
          </button>
        </div>
        <div className={styles.divider} />
        <button onClick={() => handleMenuClick('indent')} className={styles.btnAction}>
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
        <button onClick={() => handleMenuClick('color')} className={styles.btnAction}>
          <span className={styles.actionIcon}>🎨</span>
          <span>颜色</span>
          <span className={styles.actionArrow}>›</span>
        </button>
        <div className={styles.divider} />
        <button onClick={() => handleMenuClick('comment')} className={styles.btnAction}>
          <span className={styles.actionIcon}>💬</span>
          <span>评论</span>
        </button>
        <button onClick={() => handleMenuClick('cut')} className={styles.btnAction}>
          <span className={styles.actionIcon}>✂</span>
          <span>剪切</span>
        </button>
        <button onClick={() => handleMenuClick('copy')} className={styles.btnAction}>
          <span className={styles.actionIcon}>📋</span>
          <span>复制</span>
        </button>
        <button onClick={() => handleMenuClick('delete')} className={styles.btnAction}>
          <span className={styles.actionIcon}>🗑</span>
          <span>删除</span>
        </button>
      </div>
    </>
  );
};
