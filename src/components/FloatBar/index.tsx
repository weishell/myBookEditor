import { useState, useEffect, useCallback, useRef } from 'react';
import { useSlate } from 'slate-react';
import { toggleMark, toggleBlock, MarkTypes, setColor, setBackgroundColor } from '@/plugins';
import { BlockElementType } from '@/enums';

const FONT_COLORS = [
  '#000000',
  '#333333',
  '#666666',
  '#999999',
  '#cccccc',
  '#ffffff',
  '#ff0000',
  '#ff6600',
  '#ffcc00',
  '#33cc00',
  '#00ccff',
  '#0066ff',
  '#9900ff',
  '#ff00ff',
  '#ff99cc',
  '#009999',
  '#669900',
  '#996633',
];

const HIGHLIGHT_COLORS = [
  '',
  '#fff1b8',
  '#ffe082',
  '#ffd54f',
  '#ffcc80',
  '#ffebee',
  '#ffcdd2',
  '#ef9a9a',
  '#ffab91',
  '#d1c4e9',
  '#c5cae9',
  '#bbdefb',
  '#b3e5fc',
  '#b2dfdb',
  '#a5d6a7',
  '#c8e6c9',
  '#fff9c4',
  '#fff59d',
  '#f3e5f5',
  '#e1bee7',
  '#fce4ec',
];

export default function FloatBar() {
  const editor = useSlate();
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [colorPanelTab, setColorPanelTab] = useState<'text' | 'background'>('text');
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

  const handleFormatClick = (format: string, isMark: boolean) => {
    const selection = window.getSelection();
    if (selection && !selection.isCollapsed) {
      if (isMark) {
        toggleMark(editor, format);
      } else {
        toggleBlock(editor, format as BlockElementType);
      }
    }
    setActiveMenu(null);
  };

  const handleColorClick = (color: string) => {
    const selection = window.getSelection();
    if (selection && !selection.isCollapsed) {
      setColor(editor, color || null);
    }
    setActiveMenu(null);
  };

  const handleHighlightClick = (color: string) => {
    const selection = window.getSelection();
    if (selection && !selection.isCollapsed) {
      setBackgroundColor(editor, color || null);
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

  const ColorButton = ({
    onClick,
    hasDropdown,
  }: {
    onClick: () => void;
    hasDropdown?: boolean;
  }) => (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
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
        gap: '4px',
        color: '#333',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
    >
      <span style={{ color: '#ff6b6b' }}>A</span>
      <span
        style={{
          backgroundColor: '#fff1b8',
          padding: '2px 4px',
          borderRadius: '2px',
          fontSize: '12px',
        }}
      >
        A
      </span>
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
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleFormatClick(BlockElementType.HEADING_ONE, false);
                  setActiveMenu(null);
                }}
                style={{
                  width: '100%',
                  padding: '6px 12px',
                  textAlign: 'left',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  borderRadius: '4px',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
              >
                H1 标题
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleFormatClick(BlockElementType.HEADING_TWO, false);
                  setActiveMenu(null);
                }}
                style={{
                  width: '100%',
                  padding: '6px 12px',
                  textAlign: 'left',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  borderRadius: '4px',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
              >
                H2 标题
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleFormatClick(BlockElementType.HEADING_THREE, false);
                  setActiveMenu(null);
                }}
                style={{
                  width: '100%',
                  padding: '6px 12px',
                  textAlign: 'left',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  borderRadius: '4px',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
              >
                H3 标题
              </button>
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
        <div style={{ position: 'relative' }}>
          <ColorButton
            onClick={() => {
              setActiveMenu(activeMenu === 'color' ? null : 'color');
              setColorPanelTab('text');
            }}
            hasDropdown
          />
          {activeMenu === 'color' && (
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                marginTop: '4px',
                backgroundColor: '#fff',
                border: '1px solid #e8e8e8',
                borderRadius: '8px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                padding: '8px',
                minWidth: '180px',
                zIndex: 10001,
              }}
            >
              <div
                style={{ display: 'flex', borderBottom: '1px solid #e8e8e8', marginBottom: '8px' }}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setColorPanelTab('text');
                  }}
                  style={{
                    flex: 1,
                    padding: '6px 0',
                    textAlign: 'center',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: colorPanelTab === 'text' ? '600' : '400',
                    color: colorPanelTab === 'text' ? '#333' : '#999',
                    borderRadius: '4px 4px 0 0',
                    borderBottom: colorPanelTab === 'text' ? '2px solid #1890ff' : 'none',
                  }}
                >
                  字体颜色
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setColorPanelTab('background');
                  }}
                  style={{
                    flex: 1,
                    padding: '6px 0',
                    textAlign: 'center',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: colorPanelTab === 'background' ? '600' : '400',
                    color: colorPanelTab === 'background' ? '#333' : '#999',
                    borderRadius: '4px 4px 0 0',
                    borderBottom: colorPanelTab === 'background' ? '2px solid #1890ff' : 'none',
                  }}
                >
                  背景颜色
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(9, 1fr)', gap: '6px' }}>
                {(colorPanelTab === 'text' ? FONT_COLORS : HIGHLIGHT_COLORS).map((color) => (
                  <button
                    key={color}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (colorPanelTab === 'text') {
                        handleColorClick(color);
                      } else {
                        handleHighlightClick(color);
                      }
                    }}
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '4px',
                      backgroundColor: color || '#fff',
                      border: color ? '1px solid #e8e8e8' : '1px dashed #ccc',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.2)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  />
                ))}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (colorPanelTab === 'text') {
                    handleColorClick('');
                  } else {
                    handleHighlightClick('');
                  }
                }}
                style={{
                  width: '100%',
                  padding: '6px 12px',
                  marginTop: '8px',
                  textAlign: 'center',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  fontSize: '12px',
                  color: '#999',
                  borderRadius: '4px',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
              >
                恢复默认
              </button>
            </div>
          )}
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
