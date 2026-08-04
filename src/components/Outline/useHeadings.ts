import { useState, useEffect, useCallback } from 'react';
import type { Editor, Node } from 'slate';
import { BlockElementType } from '@/enums';

export interface HeadingItem {
  id: string;
  level: number;
  text: string;
  path: number[];
}

// 从编辑器中提取所有 H1-H6 标题
export function useHeadings(editor: Editor | null) {
  const [headings, setHeadings] = useState<HeadingItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  const extractHeadings = useCallback((editorInstance: Editor) => {
    const nodes = editorInstance.children as Node[];
    const result: HeadingItem[] = [];

    const walk = (nodes: Node[], path: number[]) => {
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i] as any;
        const currentPath = [...path, i];

        if (node.type === BlockElementType.HEADING) {
          const level = node.attrs?.level || 1;
          if (level >= 1 && level <= 6) {
            const text = extractText(node);
            if (text) {
              result.push({
                id: node.id || `heading-${currentPath.join('-')}`,
                level,
                text,
                path: currentPath,
              });
            }
          }
        }

        if (node.children && Array.isArray(node.children)) {
          walk(node.children, currentPath);
        }
      }
    };

    walk(nodes, []);
    return result;
  }, []);

  // 监听编辑器内容变化，更新标题列表
  useEffect(() => {
    if (!editor) return;

    const updateHeadings = () => {
      const newHeadings = extractHeadings(editor);
      setHeadings(newHeadings);

      // 滚动时找到当前可见的标题
      updateActiveHeading(newHeadings);
    };

    // 初始提取
    updateHeadings();

    // 监听滚动
    const handleScroll = () => {
      updateActiveHeading(headings);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Slate onChange 时更新
    const { onChange } = editor;
    editor.onChange = () => {
      onChange();
      updateHeadings();
    };

    return () => {
      window.removeEventListener('scroll', handleScroll);
      editor.onChange = onChange;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor]);

  // 根据滚动位置更新当前活跃标题
  const updateActiveHeading = useCallback((headingList: HeadingItem[]) => {
    if (headingList.length === 0) return;

    const scrollY = window.scrollY + 100;
    let current = headingList[0].id;

    for (const h of headingList) {
      const el = findHeadingElement(h.id);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY;
        if (top <= scrollY) {
          current = h.id;
        }
      }
    }

    setActiveId(current);
  }, []);

  // 滚动到指定标题
  const scrollToHeading = useCallback((id: string) => {
    const el = findHeadingElement(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
      setActiveId(id);
    }
  }, []);

  return { headings, activeId, scrollToHeading };
}

// 提取节点文本
function extractText(node: any): string {
  if (!node.children) return '';
  return node.children
    .map((child: any) => {
      if (child.text) return child.text;
      if (child.children) return extractText(child);
      return '';
    })
    .join('');
}

// 通过 id 查找 DOM 元素
function findHeadingElement(id: string): HTMLElement | null {
  // 查找带有对应 data-plugin-id 的 heading 元素
  const elements = document.querySelectorAll(`[data-plugin-id="${id}"]`);
  for (const el of elements) {
    const heading = el.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) return heading as HTMLElement;
    return el as HTMLElement;
  }
  return null;
}
