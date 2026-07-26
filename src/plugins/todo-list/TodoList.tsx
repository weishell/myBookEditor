import React from 'react';
import { useSlateStatic } from 'slate-react';
import { Transforms, Element as SlateElement } from 'slate';
import type { Descendant } from 'slate';
import { BlockElementType } from '@/enums';
import { ElementWrapper } from '@/plugins/element-wrapper';
import styles from './TodoList.module.less';

interface ElementProps {
  attributes: Record<string, unknown>;
  children: React.ReactNode;
  pluginId?: string;
  element?: any;
}

// 递归查找节点路径
const findNodePath = (
  nodes: Descendant[],
  targetId: string,
  currentPath: number[] = [],
): number[] | null => {
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (SlateElement.isElement(node) && (node as any).id === targetId) {
      return [...currentPath, i];
    }
    if (SlateElement.isElement(node) && node.children) {
      const found = findNodePath(node.children as Descendant[], targetId, [...currentPath, i]);
      if (found) return found;
    }
  }
  return null;
};

export const TodoList: React.FC<ElementProps> = ({ attributes, children, pluginId, element }) => {
  const editor = useSlateStatic();
  const isChecked = element.attrs?.checked ?? false;

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const nodeId = element.id;
    if (!nodeId) return;

    // 直接遍历 editor.children 查找节点，不受选区影响
    const path = findNodePath(editor.children as Descendant[], nodeId);

    if (!path) {
      console.warn('TodoList: node not found, id:', nodeId);
      return;
    }

    Transforms.setNodes(editor, { attrs: { ...element.attrs, checked: !isChecked } }, { at: path });
  };

  return (
    <ElementWrapper type={BlockElementType.TODO_LIST} pluginId={pluginId} attrs={element.attrs}>
      <div {...(attributes as React.HTMLAttributes<HTMLDivElement>)} className={styles.container}>
        <span
          onMouseDown={handleMouseDown}
          className={styles.checkbox}
          style={{
            border: isChecked ? '2px solid #1890ff' : '2px solid #d9d9d9',
            backgroundColor: isChecked ? '#1890ff' : 'transparent',
          }}
          contentEditable={false}
        >
          {isChecked && (
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              className={styles.checkboxIcon}
            >
              <path
                d="M2 5L4 7L8 3"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </span>
        <span
          className={styles.text}
          style={{
            textDecoration: isChecked ? 'line-through' : 'none',
            color: isChecked ? '#999' : '#333',
            opacity: isChecked ? 0.6 : 1,
          }}
        >
          {children}
        </span>
      </div>
    </ElementWrapper>
  );
};
