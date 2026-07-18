import React, { useState, useRef, useEffect, useCallback } from 'react';
import { BlockElementType } from '@/enums';
import { ElementWrapper } from '@/plugins/element-wrapper';
import { SUPPORTED_LANGUAGES, getLanguageName } from '@/utils/code-highlighter';

interface CodeBlockAttrs {
  language?: string;
  wrap?: boolean;
  height?: number;
}

interface ElementProps {
  attributes: Record<string, unknown>;
  children: React.ReactNode;
  pluginId?: string;
  element?: {
    attrs?: CodeBlockAttrs;
  };
}

export const CodeBlock = ({ attributes, children, pluginId, element }: ElementProps) => {
  const [height, setHeight] = useState<number>(element?.attrs?.height || 150);
  const [isDragging, setIsDragging] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showWrapMenu, setShowWrapMenu] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const attrs = element?.attrs || {};
  const language = attrs.language || 'javascript';
  const wrap = attrs.wrap !== undefined ? attrs.wrap : true;

  let codeText = '';
  const childrenArray = React.Children.toArray(children);
  childrenArray.forEach((child) => {
    if (typeof child === 'string') {
      codeText += child;
    } else if (typeof child === 'object' && child !== null && 'props' in child) {
      const childProps = (child as any).props;
      if (typeof childProps.children === 'string') {
        codeText += childProps.children;
      } else if (Array.isArray(childProps.children)) {
        childProps.children.forEach((c: any) => {
          if (typeof c === 'string') codeText += c;
        });
      }
    }
  });

  const lineCount = Math.max(codeText.split('\n').length, 1);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const newHeight = Math.max(80, Math.min(500, e.clientY - rect.top));
      setHeight(newHeight);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowLanguageMenu(false);
        setShowWrapMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDragStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleLanguageChange = useCallback(() => {
    setShowLanguageMenu(false);
  }, []);

  const handleWrapToggle = useCallback(() => {
    setShowWrapMenu(false);
  }, []);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(codeText);
  }, [codeText]);

  return (
    <ElementWrapper type={BlockElementType.CODE_BLOCK} pluginId={pluginId}>
      <div
        ref={containerRef}
        className="code-block-container"
        style={{
          position: 'relative',
          margin: '12px 0',
          borderRadius: '6px',
          border: '1px solid #e5e7eb',
          backgroundColor: '#ffffff',
          overflow: 'hidden',
          boxShadow: 'none',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '4px 12px',
            backgroundColor: '#f9fafb',
            borderBottom: '1px solid #e5e7eb',
          }}
        >
          <div
            ref={menuRef}
            style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <div
              style={{
                cursor: 'pointer',
                color: '#4b5563',
                fontSize: '12px',
                padding: '2px 6px',
                borderRadius: '3px',
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
              }}
              onClick={() => setShowLanguageMenu(!showLanguageMenu)}
            >
              {getLanguageName(language)}
            </div>

            {showLanguageMenu && (
              <div
                style={{
                  position: 'fixed',
                  marginTop: '4px',
                  backgroundColor: '#ffffff',
                  borderRadius: '8px',
                  boxShadow:
                    '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                  maxHeight: '240px',
                  overflowY: 'auto',
                  zIndex: 1000,
                  minWidth: '160px',
                  border: '1px solid #e5e7eb',
                }}
              >
                <input
                  type="text"
                  placeholder="搜索"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: 'none',
                    borderBottom: '1px solid #f3f4f6',
                    outline: 'none',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                  }}
                />
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <div
                    key={lang.id}
                    style={{
                      padding: '6px 12px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      color: lang.id === language ? '#1890ff' : '#374151',
                      backgroundColor: lang.id === language ? '#f0f5ff' : 'transparent',
                    }}
                    onClick={handleLanguageChange}
                  >
                    {lang.name}
                  </div>
                ))}
              </div>
            )}

            <div
              style={{
                cursor: 'pointer',
                color: wrap ? '#1890ff' : '#6b7280',
                fontSize: '12px',
                padding: '2px 6px',
                borderRadius: '3px',
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
              }}
              onClick={() => setShowWrapMenu(!showWrapMenu)}
            >
              自动换行
            </div>

            {showWrapMenu && (
              <div
                style={{
                  position: 'fixed',
                  marginTop: '4px',
                  backgroundColor: '#ffffff',
                  borderRadius: '8px',
                  boxShadow:
                    '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                  zIndex: 1000,
                  minWidth: '90px',
                  border: '1px solid #e5e7eb',
                }}
              >
                <div
                  style={{
                    padding: '6px 12px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    color: wrap ? '#1890ff' : '#374151',
                    backgroundColor: wrap ? '#f0f5ff' : 'transparent',
                  }}
                  onClick={handleWrapToggle}
                >
                  开启
                </div>
                <div
                  style={{
                    padding: '6px 12px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    color: !wrap ? '#1890ff' : '#374151',
                    backgroundColor: !wrap ? '#f0f5ff' : 'transparent',
                  }}
                  onClick={handleWrapToggle}
                >
                  关闭
                </div>
              </div>
            )}
          </div>

          <div
            style={{
              cursor: 'pointer',
              color: '#6b7280',
              fontSize: '12px',
              padding: '2px 6px',
              borderRadius: '3px',
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
            }}
            onClick={handleCopy}
          >
            复制
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            height: height - 32,
            overflow: 'auto',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '8px 0',
              backgroundColor: '#fafafa',
              borderRight: '1px solid #e5e7eb',
              textAlign: 'right',
              userSelect: 'none',
              minWidth: '32px',
              flexShrink: 0,
            }}
          >
            {Array.from({ length: lineCount }, (_, i) => (
              <div
                key={i}
                style={{
                  padding: '0 6px',
                  fontSize: '12px',
                  lineHeight: '18px',
                  color: '#9ca3af',
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                }}
              >
                {i + 1}
              </div>
            ))}
          </div>

          <pre
            {...(attributes as React.HTMLAttributes<HTMLPreElement>)}
            style={{
              margin: 0,
              padding: '8px 12px',
              flex: 1,
              overflowX: wrap ? 'hidden' : 'auto',
              whiteSpace: wrap ? 'pre-wrap' : 'pre',
              wordBreak: wrap ? 'break-all' : 'normal',
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
              fontSize: '12px',
              lineHeight: '18px',
              color: '#374151',
              backgroundColor: 'transparent',
              outline: 'none',
            }}
          >
            <code>{children}</code>
          </pre>
        </div>

        <div
          style={{
            height: '6px',
            backgroundColor: '#f9fafb',
            cursor: 'ns-resize',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderTop: '1px solid #e5e7eb',
          }}
          onMouseDown={handleDragStart}
        >
          <div
            style={{
              width: '24px',
              height: '2px',
              backgroundColor: '#d1d5db',
              borderRadius: '1px',
            }}
          />
        </div>
      </div>
    </ElementWrapper>
  );
};
