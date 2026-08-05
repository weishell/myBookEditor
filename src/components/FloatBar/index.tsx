import { useState, useEffect, useCallback, useRef } from 'react';
import { useSlate } from 'slate-react';
import { Element } from 'slate';
import {
  toggleMark,
  toggleBlock,
  MarkTypes,
  setColor,
  setBackgroundColor,
  setFontFamily,
} from '@/plugins';
import { BlockElementType } from '@/enums';
import ColorPicker from '@/components/ColorPicker';
import FontPicker from '@/components/FontPicker';
import { ArtTextMenu } from '@/plugins/art-text';
import { insertTable } from '@/plugins/table/table-operations';
import styles from './FloatBar.module.less';

/**
 * 判断当前选区是否位于 HEADING_TITLE 独立标题块中
 * —— 独立标题中需要屏蔽全部 FloatBar 功能
 */
const isSelectionInHeadingTitle = (editor: any): boolean => {
  const { selection } = editor;
  if (!selection) return false;
  try {
    const [match] = Array.from(
      editor.nodes({
        at: selection,
        mode: 'lowest',
        match: (n: unknown) =>
          !editor.isEditor(n) &&
          Element.isElement(n) &&
          (n as any).type === BlockElementType.HEADING_TITLE,
      }),
    );
    return !!match;
  } catch {
    return false;
  }
};

export default function FloatBar() {
  const editor = useSlate();
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const timerRef = useRef<number | null>(null);

  const calculatePosition = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      setVisible(false);
      return;
    }

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    const x = rect.left + rect.width / 2 - 180;
    const y = rect.top - 44;

    setPosition({ x: Math.max(20, Math.min(x, window.innerWidth - 380)), y: Math.max(20, y) });
    setVisible(true);
  }, []);

  useEffect(() => {
    const handleMouseUp = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = window.setTimeout(() => {
        calculatePosition();
      }, 50);
    };

    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) {
        setVisible(false);
      }
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.float-bar')) {
        setVisible(false);
        setActiveMenu(null);
      }
    };

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('selectionchange', handleSelectionChange);
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('selectionchange', handleSelectionChange);
      document.removeEventListener('click', handleClick);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [calculatePosition]);

  // 选区在 HEADING_TITLE 独立标题中：完全不显示 FloatBar（禁用所有格式化能力
  if (!visible || isSelectionInHeadingTitle(editor)) return null;

  const handleFormatClick = (format: string, isMark: boolean, level?: number) => {
    const selection = window.getSelection();
    if (selection && !selection.isCollapsed) {
      if (isMark) {
        toggleMark(editor, format);
      } else {
        toggleBlock(editor, format as BlockElementType, level ? { level } : undefined);
      }
    }
    setActiveMenu(null);
  };

  const ToolButton = ({
    icon,
    label,
    onClick,
    hasDropdown,
    className,
    disabled,
  }: {
    icon: React.ReactNode;
    label?: string;
    onClick: () => void;
    hasDropdown?: boolean;
    className?: string;
    disabled?: boolean;
  }) => (
    <button
      onClick={(e) => {
        e.stopPropagation();
        if (!disabled) onClick();
      }}
      className={`${styles.toolButton} ${className || ''} ${disabled ? styles.disabled : ''}`}
      disabled={disabled}
    >
      {icon}
      {label && <span className={styles.toolButtonLabel}>{label}</span>}
      {hasDropdown && <span className={styles.dropdownArrow}>▼</span>}
    </button>
  );

  return (
    <div className="float-bar">
      <div
        className={styles.toolbar}
        style={{
          left: position.x,
          top: position.y,
        }}
      >
        <div className={styles.wrapper}>
          <ToolButton
            icon="T"
            onClick={() => setActiveMenu(activeMenu === 'text' ? null : 'text')}
            hasDropdown
          />
          {activeMenu === 'text' && (
            <div className={`${styles.dropdown} ${styles.dropdownText}`}>
              <div className={styles.menuTitle}>标题</div>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((level) => (
                <button
                  key={level}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFormatClick(BlockElementType.HEADING, false, level);
                    setActiveMenu(null);
                  }}
                  className={styles.menuItemHeading}
                  style={{
                    fontSize: `${Math.max(10, 18 - level)}px`,
                  }}
                >
                  H{level} 标题
                </button>
              ))}
              <div className={styles.dividerHorizontal} />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleFormatClick(BlockElementType.PARAGRAPH, false);
                  setActiveMenu(null);
                }}
                className={styles.menuItem}
              >
                正文
              </button>
            </div>
          )}
        </div>
        <div className={styles.wrapper}>
          <ToolButton
            icon="☰"
            onClick={() => setActiveMenu(activeMenu === 'list' ? null : 'list')}
            hasDropdown
          />
          {activeMenu === 'list' && (
            <div className={`${styles.dropdown} ${styles.dropdownList}`}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleFormatClick(BlockElementType.BULLETED_LIST, false);
                  setActiveMenu(null);
                }}
                className={styles.menuItem}
              >
                • 无序列表
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleFormatClick(BlockElementType.NUMBERED_LIST, false);
                  setActiveMenu(null);
                }}
                className={styles.menuItem}
              >
                1. 有序列表
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleFormatClick(BlockElementType.TODO_LIST, false);
                  setActiveMenu(null);
                }}
                className={styles.menuItem}
              >
                ☑ 待办事项
              </button>
            </div>
          )}
        </div>
        <div className={styles.divider} />
        <ToolButton
          icon={<span className={styles.iconBold}>B</span>}
          onClick={() => handleFormatClick(MarkTypes.BOLD, true)}
        />
        <ToolButton
          icon={<span className={styles.iconItalic}>I</span>}
          onClick={() => handleFormatClick(MarkTypes.ITALIC, true)}
        />
        <ToolButton
          icon={<span className={styles.iconUnderline}>U</span>}
          onClick={() => handleFormatClick(MarkTypes.UNDERLINE, true)}
        />
        <div className={styles.divider} />
        <ColorPicker
          onTextColorChange={(color) => {
            const selection = window.getSelection();
            if (selection && !selection.isCollapsed) {
              setColor(editor, color);
            }
          }}
          onBackgroundColorChange={(color) => {
            const selection = window.getSelection();
            if (selection && !selection.isCollapsed) {
              setBackgroundColor(editor, color);
            }
          }}
        />
        <div className={styles.divider} />
        <div className={styles.wrapper}>
          <ToolButton
            icon="Aa"
            label=""
            onClick={() => setActiveMenu(activeMenu === 'font' ? null : 'font')}
            hasDropdown
          />
          {activeMenu === 'font' && (
            <div className={`${styles.dropdown} ${styles.dropdownFont}`}>
              <FontPicker
                onFontChange={(family) => {
                  const selection = window.getSelection();
                  if (selection && !selection.isCollapsed) {
                    setFontFamily(editor, family || null);
                  }
                  setActiveMenu(null);
                }}
              />
            </div>
          )}
        </div>
        <div className={styles.divider} />
        <div className={styles.wrapper}>
          <ToolButton
            icon="🎨"
            onClick={() => setActiveMenu(activeMenu === 'art' ? null : 'art')}
            hasDropdown
          />
          <ArtTextMenu
            editor={editor}
            visible={activeMenu === 'art'}
            position={{ x: position.x + 180, y: position.y + 36 }}
            onClose={() => setActiveMenu(null)}
          />
        </div>
        <div className={styles.divider} />
        <ToolButton icon="{" onClick={() => handleFormatClick(MarkTypes.CODE, true)} />
        <ToolButton
          icon="“"
          onClick={() => handleFormatClick(BlockElementType.BLOCKQUOTE, false)}
        />
        <ToolButton
          icon="</>"
          onClick={() => handleFormatClick(BlockElementType.CODE_BLOCK, false)}
        />
        <div className={styles.divider} />
        <ToolButton
          icon={
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="3" y1="9" x2="21" y2="9" />
              <line x1="9" y1="3" x2="9" y2="21" />
            </svg>
          }
          onClick={() => {
            insertTable(editor, 3, 3);
            setVisible(false);
          }}
        />
        <ToolButton icon="🔗" onClick={() => {}} disabled />
        <ToolButton icon="💬" onClick={() => {}} disabled />
      </div>
    </div>
  );
}
