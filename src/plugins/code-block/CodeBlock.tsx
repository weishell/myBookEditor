import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Transforms } from 'slate';
import { useSlate } from 'slate-react';
import { Select } from 'antd';
import { BlockElementType } from '@/enums';
import { ElementWrapper } from '@/plugins/element-wrapper';
import { SUPPORTED_LANGUAGES } from '@/utils/code-highlighter';

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
    children?: unknown[];
  };
}

export const CodeBlock = ({ attributes, children, pluginId, element }: ElementProps) => {
  const editor = useSlate();
  const [height, setHeight] = useState<number>(element?.attrs?.height || 150);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showCopySuccess, setShowCopySuccess] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const attrs = element?.attrs || {};
  const [localLanguage, setLocalLanguage] = useState<string>(attrs.language || 'javascript');
  const [localWrap, setLocalWrap] = useState<boolean>(attrs.wrap !== undefined ? attrs.wrap : true);

  const codeText = ((element as any)?.children || [])
    .map((child: any) => {
      if (child.type === BlockElementType.CODE_LINE) {
        return (child.children || []).map((c: { text?: string }) => c.text || '').join('');
      }
      return child.text || '';
    })
    .join('\n');

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

  const handleDragStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleLanguageChange = (newLanguage: string) => {
    setLocalLanguage(newLanguage);
    Transforms.setNodes(editor, { attrs: { ...attrs, language: newLanguage } } as any, {
      match: (n: any) => n === element,
    });
  };

  const handleWrapChange = (value: string) => {
    const newWrap = value === 'on';
    setLocalWrap(newWrap);
    Transforms.setNodes(editor, { attrs: { ...attrs, wrap: newWrap } } as any, {
      match: (n: any) => n === element,
    });
  };

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(codeText);
    setShowCopySuccess(true);
    setTimeout(() => setShowCopySuccess(false), 3000);
  }, [codeText]);

  const languageOptions = SUPPORTED_LANGUAGES.map((lang) => ({
    value: lang.id,
    label: lang.name,
  }));

  const wrapOptions = [
    { value: 'on', label: '自动换行' },
    { value: 'off', label: '取消换行' },
  ];

  const isToolbarVisible = isHovered;

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
          backgroundColor: '#f9fafb',
          overflow: 'hidden',
          boxShadow: 'none',
          maxWidth: '100%',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          contentEditable={false}
          suppressContentEditableWarning={true}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '4px 12px',
            backgroundColor: isToolbarVisible ? '#f9fafb' : '#ffffff',
            borderBottom: isToolbarVisible ? '1px solid #e5e7eb' : 'none',
            opacity: isToolbarVisible ? 1 : 0,
            pointerEvents: isToolbarVisible ? 'auto' : 'none',
            transition: 'opacity 0.2s ease, background-color 0.2s ease, border-color 0.2s ease',
            userSelect: 'none',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Select
              value={localLanguage}
              onChange={handleLanguageChange}
              options={languageOptions}
              style={{ width: 120 }}
              size="small"
              placeholder="选择语言"
              popupMatchSelectWidth={false}
              dropdownStyle={{ minWidth: 160 }}
              showSearch
              optionFilterProp="label"
              filterOption={(input, option) =>
                (option?.label as string)?.toLowerCase().includes(input.toLowerCase())
              }
            />

            <Select
              value={localWrap ? 'on' : 'off'}
              onChange={handleWrapChange}
              options={wrapOptions}
              style={{ width: 90 }}
              size="small"
              popupMatchSelectWidth={false}
            />
          </div>

          <div
            style={{
              cursor: 'pointer',
              color: showCopySuccess ? '#52c41a' : '#6b7280',
              fontSize: '12px',
              padding: '2px 6px',
              borderRadius: '3px',
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleCopy();
            }}
          >
            {showCopySuccess ? '已复制' : '复制'}
          </div>
        </div>

        <div
          style={{
            height: height - 32,
            overflowY: 'auto',
            overflowX: 'hidden',
          }}
        >
          <div
            {...(attributes as React.HTMLAttributes<HTMLDivElement>)}
            style={{
              padding: '8px 0',
              backgroundColor: '#f9fafb',
              outline: 'none',
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
              fontSize: '12px',
              lineHeight: '18px',
              color: '#374151',
              whiteSpace: localWrap ? 'pre-wrap' : 'pre',
              wordBreak: localWrap ? 'break-all' : 'normal',
              overflowX: 'hidden',
              width: '100%',
            }}
          >
            {children}
          </div>
        </div>

        <div
          contentEditable={false}
          suppressContentEditableWarning={true}
          style={{
            height: '6px',
            backgroundColor: '#f9fafb',
            cursor: 'ns-resize',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderTop: '1px solid #e5e7eb',
            opacity: isHovered ? 1 : 0,
            pointerEvents: isHovered ? 'auto' : 'none',
            transition: 'opacity 0.2s ease',
            userSelect: 'none',
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
