// 全局"防异常光标"守卫
//
// 问题：只写 contentEditable={false} 只能阻止输入，阻止不了光标落位。
// 浏览器在 mousedown 时仍会把光标/选区折叠到非可编辑区域（或其最近的可编辑锚点），
// Slate 再把这段 DOM 选区翻译成 Slate 选区 —— 于是非文本插件里出现莫名其妙的闪烁光标，
// 后续输入/方向键行为也跟着错乱。
//
// 方案：在 document 捕获阶段拦截 mousedown。只要按下点落在
//   - 非可编辑区域（[contenteditable=false] / [data-non-editable] / [data-slate-void]）
//   - 且不是需要真实焦点的控件（input / textarea / select / 可编辑区）
// 就 preventDefault()，浏览器不再移动光标、也不开始文本选择。
// 只阻止默认行为、不阻止传播，所以按钮/拖拽/右键等 React 逻辑照常工作。
//
// 覆盖范围：所有 Slate 可编辑区内的非文本插件（图片/图表/日历/倒计时/drawio/公式/提及/
// 时间轴/嵌入/分割线…）以及它们内部的一切装饰层（工具栏、把手、表头、圆点…），
// 插件无需各自实现。表格这类"内部含可编辑文本"的元素不受影响（只约束其装饰层）。
import { useEffect } from 'react';
import { NON_EDITABLE_SELECTOR } from './nonText';

export function useNonEditableCaretGuard(enabled: boolean = true) {
  useEffect(() => {
    if (!enabled) return;

    const onMouseDownCapture = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t || typeof t.closest !== 'function') return;

      // 只处理 Slate 可编辑区内部的按下（data-slate-editor 由 slate-react 挂在 Editable 根节点）
      const editorRoot = t.closest('[data-slate-editor]');
      if (!editorRoot) return;

      // 表单控件需要真实焦点/光标 → 放行
      if (t.closest('input, textarea, select')) return;

      // 嵌套可编辑区（插件内部的输入框等）也放行。
      // 注意：Editable 根节点自身就带 contenteditable="true"，若直接用
      // closest('[contenteditable="true"]') 会命中根节点，导致守卫对全编辑器失效。
      const nestedEditable = t.closest('[contenteditable="true"]');
      if (nestedEditable && nestedEditable !== editorRoot) return;

      // 非可编辑区域 → 阻止光标落位
      if (t.closest(NON_EDITABLE_SELECTOR)) {
        e.preventDefault();
      }
    };

    document.addEventListener('mousedown', onMouseDownCapture, true);
    return () => document.removeEventListener('mousedown', onMouseDownCapture, true);
  }, [enabled]);
}

export default useNonEditableCaretGuard;
