import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Transforms } from 'slate';
import { useSlateStatic } from 'slate-react';
import { Select } from 'antd';
import { BlockElementType } from '@/enums';
import { ElementWrapper } from '@/plugins/element-wrapper';
import { SUPPORTED_LANGUAGES } from '@/utils/code-highlighter';
import styles from './CodeBlock.module.less';

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
  const editor = useSlateStatic();
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
        className={styles.container}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          contentEditable={false}
          suppressContentEditableWarning={true}
          className={styles.toolbar}
          style={{
            backgroundColor: isToolbarVisible ? '#f9fafb' : '#ffffff',
            borderBottom: isToolbarVisible ? '1px solid #e5e7eb' : 'none',
            opacity: isToolbarVisible ? 1 : 0,
            pointerEvents: isToolbarVisible ? 'auto' : 'none',
          }}
        >
          <div className={styles.controlsWrapper}>
            <Select
              value={localLanguage}
              onChange={handleLanguageChange}
              options={languageOptions}
              style={{ width: 120 }}
              size="small"
              placeholder="选择语言"
              popupMatchSelectWidth={false}
              styles={{ popup: { root: { minWidth: 160 } } }}
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
            className={styles.copyButton}
            style={{
              color: showCopySuccess ? '#52c41a' : '#6b7280',
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
          className={styles.codeBodyWrapper}
          style={{
            height: height - 32,
          }}
        >
          <div
            {...(attributes as React.HTMLAttributes<HTMLDivElement>)}
            className={styles.codeContent}
            style={{
              whiteSpace: localWrap ? 'pre-wrap' : 'pre',
              wordBreak: localWrap ? 'break-all' : 'normal',
            }}
          >
            {children}
          </div>
        </div>

        <div
          contentEditable={false}
          suppressContentEditableWarning={true}
          className={styles.resizeHandle}
          style={{
            opacity: isHovered ? 1 : 0,
            pointerEvents: isHovered ? 'auto' : 'none',
          }}
          onMouseDown={handleDragStart}
        >
          <div className={styles.resizeHandleBar} />
        </div>
      </div>
    </ElementWrapper>
  );
};
