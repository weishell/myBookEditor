import React from 'react';

interface CodeLineAttrs {
  lineNumber?: number;
}

interface CodeLineProps {
  attributes: Record<string, unknown>;
  children: React.ReactNode;
  pluginId?: string;
  element?: {
    attrs?: CodeLineAttrs;
    children?: unknown[];
  };
}

export const CodeLine = ({ attributes, children, element }: CodeLineProps) => {
  const lineNumber = element?.attrs?.lineNumber || 1;

  return (
    <div
      className="ace-line"
      data-line-num={lineNumber}
      style={{
        display: 'flex',
        minWidth: '100%',
      }}
    >
      <span
        className="code-line-num"
        contentEditable={false}
        suppressContentEditableWarning={true}
        style={{
          flexShrink: 0,
          width: 40,
          paddingRight: 8,
          marginRight: 8,
          borderRight: '1px solid #e5e7eb',
          backgroundColor: '#f3f4f6',
          color: '#9ca3af',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
          fontSize: 12,
          lineHeight: '18px',
          textAlign: 'right',
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      >
        {lineNumber}
      </span>
      <div
        className="code-line-wrapper"
        {...(attributes as React.HTMLAttributes<HTMLDivElement>)}
        style={{
          flex: 1,
          paddingLeft: 12,
        }}
      >
        {children}
      </div>
    </div>
  );
};
