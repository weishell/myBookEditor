import React from 'react';

interface DividerProps {
  attributes: Record<string, unknown>;
  children?: React.ReactNode;
  pluginId?: string;
}

export const Divider: React.FC<DividerProps> = ({ attributes }) => {
  return (
    <div
      {...(attributes as React.HTMLAttributes<HTMLDivElement>)}
      contentEditable={false}
      suppressContentEditableWarning={true}
      style={{
        height: '1px',
        backgroundColor: '#e5e7eb',
        margin: '16px 0',
        border: 'none',
        pointerEvents: 'none',
      }}
    />
  );
};
