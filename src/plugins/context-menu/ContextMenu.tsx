import { useEffect, useRef, useCallback } from 'react';
import { useMenu } from '@/plugins/menu-context';

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

  const handleMenuClick = (action: string) => {
    console.log('Menu action:', action);
    closeMenu();
  };

  if (!visible) return null;

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 999,
        }}
        onClick={closeMenu}
      />
      <div
        ref={menuRef}
        style={{
          position: 'fixed',
          left: position.x,
          top: position.y,
          backgroundColor: '#fff',
          border: '1px solid #e8e8e8',
          borderRadius: '8px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
          padding: '0',
          zIndex: 1001,
          minWidth: '180px',
        }}
        onClick={(e) => e.stopPropagation()}
        onMouseEnter={() => setHoveringMenu(true)}
        onMouseLeave={() => setHoveringMenu(false)}
      >
        <div style={{ padding: '4px', display: 'flex', flexWrap: 'wrap', gap: '2px' }}>
          <button
            onClick={() => handleMenuClick('text')}
            style={{
              width: '36px',
              height: '32px',
              border: 'none',
              background: '#1890ff',
              color: '#fff',
              cursor: 'pointer',
              textAlign: 'center',
              fontSize: '12px',
              fontWeight: 'bold',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#40a9ff')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#1890ff')}
          >
            T
          </button>
          <button
            onClick={() => handleMenuClick('h1')}
            style={{
              width: '36px',
              height: '32px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              textAlign: 'center',
              fontSize: '12px',
              color: '#333',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            H1
          </button>
          <button
            onClick={() => handleMenuClick('h2')}
            style={{
              width: '36px',
              height: '32px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              textAlign: 'center',
              fontSize: '12px',
              color: '#333',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            H2
          </button>
          <button
            onClick={() => handleMenuClick('h3')}
            style={{
              width: '36px',
              height: '32px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              textAlign: 'center',
              fontSize: '12px',
              color: '#333',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            H3
          </button>
          <button
            onClick={() => handleMenuClick('numbered-list')}
            style={{
              width: '36px',
              height: '32px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              textAlign: 'center',
              fontSize: '14px',
              color: '#333',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            ≡
          </button>
          <button
            onClick={() => handleMenuClick('bulleted-list')}
            style={{
              width: '36px',
              height: '32px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              textAlign: 'center',
              fontSize: '14px',
              color: '#333',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            ≡
          </button>
        </div>
        <div style={{ height: '1px', backgroundColor: '#e8e8e8' }} />
        <div style={{ padding: '4px', display: 'flex', flexWrap: 'wrap', gap: '2px' }}>
          <button
            onClick={() => handleMenuClick('checkbox')}
            style={{
              width: '36px',
              height: '32px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              textAlign: 'center',
              fontSize: '14px',
              color: '#333',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            ☐
          </button>
          <button
            onClick={() => handleMenuClick('code')}
            style={{
              width: '36px',
              height: '32px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              textAlign: 'center',
              fontSize: '12px',
              color: '#333',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'monospace',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            {}
          </button>
          <button
            onClick={() => handleMenuClick('quote')}
            style={{
              width: '36px',
              height: '32px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              textAlign: 'center',
              fontSize: '14px',
              color: '#333',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            "
          </button>
          <button
            onClick={() => handleMenuClick('code-block')}
            style={{
              width: '36px',
              height: '32px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              textAlign: 'center',
              fontSize: '12px',
              color: '#333',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'monospace',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            &lt;/&gt;
          </button>
          <button
            onClick={() => handleMenuClick('link')}
            style={{
              width: '36px',
              height: '32px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              textAlign: 'center',
              fontSize: '14px',
              color: '#333',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            🔗
          </button>
        </div>
        <div style={{ height: '1px', backgroundColor: '#e8e8e8' }} />
        <button
          onClick={() => handleMenuClick('indent')}
          style={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            padding: '8px 12px',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            textAlign: 'left',
            fontSize: '13px',
            color: '#333',
            borderRadius: '0',
            gap: '8px',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <span style={{ fontSize: '14px' }}>☰</span>
          <span>缩进和对齐</span>
          <span style={{ marginLeft: 'auto', fontSize: '12px', color: '#999' }}>›</span>
        </button>
        <button
          onClick={() => handleMenuClick('color')}
          style={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            padding: '8px 12px',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            textAlign: 'left',
            fontSize: '13px',
            color: '#333',
            borderRadius: '0',
            gap: '8px',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <span style={{ fontSize: '14px' }}>🎨</span>
          <span>颜色</span>
          <span style={{ marginLeft: 'auto', fontSize: '12px', color: '#999' }}>›</span>
        </button>
        <div style={{ height: '1px', backgroundColor: '#e8e8e8' }} />
        <button
          onClick={() => handleMenuClick('comment')}
          style={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            padding: '8px 12px',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            textAlign: 'left',
            fontSize: '13px',
            color: '#333',
            borderRadius: '0',
            gap: '8px',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <span style={{ fontSize: '14px' }}>💬</span>
          <span>评论</span>
        </button>
        <button
          onClick={() => handleMenuClick('cut')}
          style={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            padding: '8px 12px',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            textAlign: 'left',
            fontSize: '13px',
            color: '#333',
            borderRadius: '0',
            gap: '8px',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <span style={{ fontSize: '14px' }}>✂</span>
          <span>剪切</span>
        </button>
        <button
          onClick={() => handleMenuClick('copy')}
          style={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            padding: '8px 12px',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            textAlign: 'left',
            fontSize: '13px',
            color: '#333',
            borderRadius: '0',
            gap: '8px',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <span style={{ fontSize: '14px' }}>📋</span>
          <span>复制</span>
        </button>
        <button
          onClick={() => handleMenuClick('delete')}
          style={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            padding: '8px 12px',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            textAlign: 'left',
            fontSize: '13px',
            color: '#333',
            borderRadius: '0',
            gap: '8px',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <span style={{ fontSize: '14px' }}>🗑</span>
          <span>删除</span>
        </button>
      </div>
    </>
  );
};
