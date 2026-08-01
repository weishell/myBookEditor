import { useEffect, useRef, useCallback } from 'react';
import { useMenu } from '@/plugins/menu-context';
import styles from './ContextMenu.module.less';

export const ContextMenu = () => {
  const { visible, position, closeMenu, setHoveringMenu } = useMenu();
  const menuRef = useRef<HTMLDivElement>(null);

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
      if (newTop >= 0) {
        menu.style.top = `${newTop}px`;
      }
    }
  }, []);

  useEffect(() => {
    if (visible) {
      requestAnimationFrame(() => {
        adjustPosition();
      });
    }
  }, [visible, position, adjustPosition]);

  const handleMenuClick = () => {
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
            {}
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
