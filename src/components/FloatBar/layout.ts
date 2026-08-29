// FloatBar 定位算法（纯函数，无 React/Slate 依赖，便于单测）
//
// 抽出动机：原先算法内嵌在组件里，改一次难以验证；抽成纯函数后可以
// 直接 tsc + node 跑回归测试，覆盖"滚动跟随"等边界。

// 工具栏尺寸常量（用于定位算法）
export const TOOLBAR_HEIGHT = 44;
export const TOOLBAR_HALF_WIDTH = 180; // 浮栏一半宽（用于把锚点居中）
export const TOOLBAR_WIDTH = TOOLBAR_HALF_WIDTH * 2 + 20; // 380
export const VIEWPORT_GAP = 8; // 工具栏与选区的间距
export const MIN_MARGIN = 20; // 横向视口安全距（仅横向使用）

export interface FloatBarLayout {
  x: number;
  y: number;
}

/**
 * 根据当前选区计算 FloatBar 的目标位置。
 * 返回 null 表示选区不满足显示条件（折叠 / 取不到 range），调用方应收起浮栏。
 *
 * 核心约束：**纵向严格跟随选区，不做任何钳制。**
 *   页面滚动时选区的 rect.top 会持续变化，滚出视口后变成负数；浮栏必须原样跟随，
 *   这样它才会跟着选区一起自然移出视口（position: fixed + 负 top = 在视口外）。
 *   一旦对 y 做 `Math.max(下限, y)` 这类钳制，浮栏就会"钉"在那个下限上，
 *   产生"选区已经滚走了、浮栏还挂在视口顶部"的粘连感 —— 这正是要修的 bug。
 *   所以纵向既不做下限钳制，也不在"顶部空间不够"时翻到选区下方
 *   （翻转会让它改用 rect.bottom 定位，等于在顶部多停留一段，又变成钉住）。
 *
 * 横向仍然钳制：页面不会横向滚动，而浮栏宽 TOOLBAR_WIDTH，
 * 选区贴近左右边缘时需要收进视口内，否则会被裁掉一截。
 */
export function computeFloatBarPosition(
  selection: Selection | null,
  viewportWidth: number,
): FloatBarLayout | null {
  if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
    return null;
  }

  const range = selection.getRangeAt(0);
  let rect = range.getBoundingClientRect();

  // 退化情况：选中的 range 没有宽高（纯换行/不可见节点等），getBoundingClientRect
  // 会返回 0×0，强行用左上角定位会把浮栏钉到视口角落。这里改用 clientRects 第一个矩形。
  if (rect.width === 0 && rect.height === 0) {
    const rects = range.getClientRects();
    if (rects.length > 0) rect = rects[0];
  }

  // 横向：以选区中心为锚点，收进 [MIN_MARGIN, viewportWidth - TOOLBAR_WIDTH]
  const x = rect.left + rect.width / 2 - TOOLBAR_HALF_WIDTH;
  // 纵向：严格跟随选区上沿，不做任何钳制
  const y = rect.top - TOOLBAR_HEIGHT - VIEWPORT_GAP;

  return {
    x: Math.max(MIN_MARGIN, Math.min(x, viewportWidth - TOOLBAR_WIDTH)),
    y,
  };
}
