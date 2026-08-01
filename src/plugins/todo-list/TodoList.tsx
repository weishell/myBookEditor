import React, { useCallback } from 'react';
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

  // 点击 checkbox：只切换勾选，不设光标
  // 选中就是选中操作，点击文字区域才出现光标
  const handleCheckboxMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const nodeId = element.id;
      if (!nodeId) return;

      const path = findNodePath(editor.children as Descendant[], nodeId);
      if (!path) return;

      Transforms.setNodes(
        editor,
        { attrs: { ...element.attrs, checked: !isChecked } },
        { at: path },
      );
    },
    [editor, element, isChecked],
  );

  return (
    <ElementWrapper
      type={BlockElementType.TODO_LIST}
      pluginId={pluginId}
      attrs={element?.attrs}
      attributes={attributes}
    >
      <div className={styles.container}>
        {/* checkbox 绝对定位，扩大点击区，阻止光标出现在方块附近 */}
        <div
          className={styles.checkboxWrapper}
          onMouseDown={handleCheckboxMouseDown}
          contentEditable={false}
          suppressContentEditableWarning={true}
        >
          <span
            className={styles.checkbox}
            style={{
              border: isChecked ? '2px solid #1890ff' : '2px solid #d9d9d9',
              backgroundColor: isChecked ? '#1890ff' : 'transparent',
            }}
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
        </div>

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
