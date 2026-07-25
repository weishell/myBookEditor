import { useState, useEffect, useCallback, useRef } from 'react';
import { useSlate } from 'slate-react';
import { toggleMark, toggleBlock, MarkTypes, setColor, setBackgroundColor } from '@/plugins';
import { BlockElementType } from '@/enums';
import ColorPicker from '@/components/ColorPicker';
import { ArtTextMenu } from '@/plugins/art-text';

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

  if (!visible) return null;

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
  }: {
    icon: React.ReactNode;
    label?: string;
    onClick: () => void;
    hasDropdown?: boolean;
    className?: string;
  }) => (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={className}
      style={{
        padding: '6px 8px',
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        fontSize: '14px',
        borderRadius: '4px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '2px',
        color: '#333',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
    >
      {icon}
      {label && <span style={{ fontSize: '12px' }}>{label}</span>}
      {hasDropdown && <span style={{ fontSize: '10px', color: '#999' }}>▼</span>}
    </button>
  );

  return (
    <div className="float-bar">
      <div
        style={{
          position: 'fixed',
          left: position.x,
          top: position.y,
          backgroundColor: '#fff',
          border: '1px solid #e8e8e8',
          borderRadius: '8px',
          padding: '2px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
          display: 'flex',
          alignItems: 'center',
          gap: '0',
          zIndex: 10000,
        }}
      >
        <div style={{ position: 'relative' }}>
          <ToolButton
            icon="T"
            onClick={() => setActiveMenu(activeMenu === 'text' ? null : 'text')}
            hasDropdown
          />
          {activeMenu === 'text' && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                marginTop: '4px',
                backgroundColor: '#fff',
                border: '1px solid #e8e8e8',
                borderRadius: '8px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                padding: '4px',
                minWidth: '200px',
                zIndex: 10001,
              }}
            >
              <div
                style={{ padding: '4px 8px', fontSize: '12px', color: '#999', fontWeight: '600' }}
              >
                标题
              </div>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((level) => (
                <button
                  key={level}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFormatClick(BlockElementType.HEADING, false, level);
                    setActiveMenu(null);
                  }}
                  style={{
                    width: '100%',
                    padding: '4px 12px',
                    textAlign: 'left',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    fontSize: `${Math.max(10, 18 - level)}px`,
                    fontWeight: 'bold',
                    borderRadius: '4px',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
                >
                  H{level} 标题
                </button>
              ))}
              <div style={{ height: '1px', backgroundColor: '#e8e8e8', margin: '4px 0' }} />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleFormatClick(BlockElementType.PARAGRAPH, false);
                  setActiveMenu(null);
                }}
                style={{
                  width: '100%',
                  padding: '6px 12px',
                  textAlign: 'left',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  fontSize: '13px',
                  borderRadius: '4px',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
              >
                正文
              </button>
            </div>
          )}
        </div>
        <div style={{ position: 'relative' }}>
          <ToolButton
            icon="☰"
            onClick={() => setActiveMenu(activeMenu === 'list' ? null : 'list')}
            hasDropdown
          />
          {activeMenu === 'list' && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                marginTop: '4px',
                backgroundColor: '#fff',
                border: '1px solid #e8e8e8',
                borderRadius: '8px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                padding: '4px',
                minWidth: '160px',
                zIndex: 10001,
              }}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleFormatClick(BlockElementType.BULLETED_LIST, false);
                  setActiveMenu(null);
                }}
                style={{
                  width: '100%',
                  padding: '6px 12px',
                  textAlign: 'left',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  fontSize: '13px',
                  borderRadius: '4px',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
              >
                • 无序列表
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleFormatClick(BlockElementType.NUMBERED_LIST, false);
                  setActiveMenu(null);
                }}
                style={{
                  width: '100%',
                  padding: '6px 12px',
                  textAlign: 'left',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  fontSize: '13px',
                  borderRadius: '4px',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
              >
                1. 有序列表
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleFormatClick(BlockElementType.TODO_LIST, false);
                  setActiveMenu(null);
                }}
                style={{
                  width: '100%',
                  padding: '6px 12px',
                  textAlign: 'left',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  fontSize: '13px',
                  borderRadius: '4px',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
              >
                ☑ 待办事项
              </button>
            </div>
          )}
        </div>
        <div
          style={{ width: '1px', height: '20px', backgroundColor: '#e8e8e8', margin: '0 4px' }}
        />
        <ToolButton
          icon={<span style={{ fontWeight: 'bold' }}>B</span>}
          onClick={() => handleFormatClick(MarkTypes.BOLD, true)}
        />
        <ToolButton
          icon={<span style={{ fontStyle: 'italic' }}>I</span>}
          onClick={() => handleFormatClick(MarkTypes.ITALIC, true)}
        />
        <ToolButton
          icon={<span style={{ textDecoration: 'underline' }}>U</span>}
          onClick={() => handleFormatClick(MarkTypes.UNDERLINE, true)}
        />
        <div
          style={{ width: '1px', height: '20px', backgroundColor: '#e8e8e8', margin: '0 4px' }}
        />
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
        <div
          style={{ width: '1px', height: '20px', backgroundColor: '#e8e8e8', margin: '0 4px' }}
        />
        <div style={{ position: 'relative' }}>
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
        <div
          style={{ width: '1px', height: '20px', backgroundColor: '#e8e8e8', margin: '0 4px' }}
        />
        <ToolButton icon="{" onClick={() => handleFormatClick(MarkTypes.CODE, true)} />
        <ToolButton
          icon="“"
          onClick={() => handleFormatClick(BlockElementType.BLOCKQUOTE, false)}
        />
        <ToolButton
          icon="</>"
          onClick={() => handleFormatClick(BlockElementType.CODE_BLOCK, false)}
        />
        <div
          style={{ width: '1px', height: '20px', backgroundColor: '#e8e8e8', margin: '0 4px' }}
        />
        <ToolButton icon="🔗" onClick={() => {}} />
        <ToolButton icon="💬" onClick={() => {}} />
      </div>
    </div>
  );
}
