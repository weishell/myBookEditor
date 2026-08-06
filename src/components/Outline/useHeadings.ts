import { useState, useEffect, useCallback, useRef } from 'react';
import type { Editor, Node } from 'slate';
import { BlockElementType } from '@/enums';

export interface HeadingItem {
  id: string;
  level: number;
  text: string;
  path: number[];
}

export function useHeadings(editor: Editor | null) {
  const [headings, setHeadings] = useState<HeadingItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const headingsRef = useRef<HeadingItem[]>([]);
  const activeIdRef = useRef<string>('');
  // 点击目录发起的"程序化滚动"进行中 → 跳过滚动监听的 active 更新，避免中间经过的标题被依次点亮
  const programmaticScrollRef = useRef<{ active: boolean; targetId: string; unlockAt: number }>({
    active: false,
    targetId: '',
    unlockAt: 0,
  });
  const unlockTimerRef = useRef<number | null>(null);

  const extractHeadings = useCallback((editorInstance: Editor): HeadingItem[] => {
    const nodes = editorInstance.children as Node[];
    const result: HeadingItem[] = [];

    const walk = (nodeList: Node[], path: number[]) => {
      for (let i = 0; i < nodeList.length; i++) {
        const node = nodeList[i] as any;
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

  // 根据滚动位置更新当前活跃标题（手动滚动才生效）
  const updateActiveHeading = useCallback(() => {
    // 程序化滚动期间，不允许被滚动中途的位置覆盖 activeId
    if (programmaticScrollRef.current.active) {
      const now = Date.now();
      if (now < programmaticScrollRef.current.unlockAt) {
        return;
      }
      // 超时兜底：到了时间即使没收到 scrollend / 回调也解锁
      programmaticScrollRef.current.active = false;
    }

    const headingList = headingsRef.current;
    if (headingList.length === 0) return;

    const scrollY = window.scrollY + 120;
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

    if (current !== activeIdRef.current) {
      activeIdRef.current = current;
      setActiveId(current);
    }
  }, []);

  // 释放程序化滚动锁（平滑滚动结束后恢复联动高亮）
  const releaseProgrammaticLock = useCallback(() => {
    programmaticScrollRef.current.active = false;
    if (unlockTimerRef.current !== null) {
      window.clearTimeout(unlockTimerRef.current);
      unlockTimerRef.current = null;
    }
    // 释放后，再做一次定位校正，确保最终高亮和实际停留位置一致
    window.requestAnimationFrame(() => updateActiveHeading());
  }, [updateActiveHeading]);

  // 滚动到指定标题（直接停在目标，不会依次高亮中间标题）
  const scrollToHeading = useCallback(
    (id: string) => {
      const el = findHeadingElement(id);
      if (!el) return;

      // 1) 先直接高亮目标，后续滚动期间 updateActiveHeading 会被 programmaticScrollRef 锁住，不会被覆盖
      activeIdRef.current = id;
      setActiveId(id);

      // 2) 锁：在接下来的 N ms 里，忽略 scroll 触发的 active 更新
      const duration = 550; // 约等于 smooth 滚动时长（经验值）
      programmaticScrollRef.current = {
        active: true,
        targetId: id,
        unlockAt: Date.now() + duration + 100,
      };
      if (unlockTimerRef.current !== null) {
        window.clearTimeout(unlockTimerRef.current);
      }
      unlockTimerRef.current = window.setTimeout(() => {
        releaseProgrammaticLock();
      }, duration + 120);

      // 3) 精准定位：优先用 scrollIntoView（对齐稳定），再用 window.scrollTo 微调顶部留白
      //    先尝试用 block: 'start' 让标题顶到视口，再统一向上留 100px padding
      try {
        el.scrollIntoView({ block: 'start', behavior: 'smooth' });
        // scrollIntoView 后再做一次 scrollTo 来校正"顶部留白"，避免贴边
        const onScrollEnd = () => {
          window.removeEventListener('scrollend', onScrollEnd);
          const targetTop = el.getBoundingClientRect().top + window.scrollY - 100;
          window.scrollTo({ top: targetTop, behavior: 'auto' });
          releaseProgrammaticLock();
        };
        window.addEventListener('scrollend', onScrollEnd, { once: true });
      } catch {
        // 兜底：老浏览器无 scrollIntoView 行为时直接走 scrollTo
        const top = el.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    },
    [releaseProgrammaticLock],
  );

  useEffect(() => {
    if (!editor) return;

    headingsRef.current = extractHeadings(editor);
    setHeadings(headingsRef.current);
    updateActiveHeading();

    let rafId: number | null = null;
    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = null;
        updateActiveHeading();
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    const { onChange } = editor;
    editor.onChange = () => {
      onChange();
      const newHeadings = extractHeadings(editor);
      headingsRef.current = newHeadings;
      setHeadings(newHeadings);
      updateActiveHeading();
    };

    return () => {
      window.removeEventListener('scroll', handleScroll);
      editor.onChange = onChange;
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
      if (unlockTimerRef.current !== null) {
        window.clearTimeout(unlockTimerRef.current);
      }
    };
  }, [editor, extractHeadings, updateActiveHeading]);

  return { headings, activeId, scrollToHeading };
}

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

function findHeadingElement(id: string): HTMLElement | null {
  const elements = document.querySelectorAll(`[data-plugin-id="${id}"]`);
  for (const el of elements) {
    const heading = el.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) return heading as HTMLElement;
    return el as HTMLElement;
  }
  return null;
}
