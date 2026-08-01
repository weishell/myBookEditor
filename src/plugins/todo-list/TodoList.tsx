import React, { useCallback } from 'react';
import { ReactEditor, useSlateStatic } from 'slate-react';
import { Transforms } from 'slate';
import { BlockElementType } from '@/enums';
import { ElementWrapper } from '@/plugins/element-wrapper';
import styles from './TodoList.module.less';

interface ElementProps {
  attributes: Record<string, unknown>;
  children: React.ReactNode;
  pluginId?: string;
  element?: any;
}

export const TodoList: React.FC<ElementProps> = ({ attributes, children, pluginId, element }) => {
  const editor = useSlateStatic();
  const isChecked = element.attrs?.checked ?? false;

  // 点击 checkbox：只切换勾选，不设光标
  // 选中就是选中操作，点击文字区域才出现光标
  const handleCheckboxMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      // 清除光标选区，让编辑器失焦
      editor.deselect();

      let path;
      try {
        path = ReactEditor.findPath(editor, element);
      } catch {
        return;
      }

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
