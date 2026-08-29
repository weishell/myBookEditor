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

export interface ContainerClamp {
  /** 文档容器左边（视口坐标）—— 浮栏 left 必须 ≥ this + MIN_MARGIN */
  left: number;
  /** 文档容器右边（视口坐标）—— 浮栏 right 必须 ≤ this - MIN_MARGIN */
  right: number;
}

/**
 * 根据当前选区计算 FloatBar 的目标位置。
 * 返回 null 表示选区不满足显示条件（折叠 / 取不到 range），调用方应收起浮栏。
 *
 * 约束层级（由外向内）：
 *   1. 视口：浮栏必须落在视口内 [MIN_MARGIN, viewport.w - TOOLBAR_WIDTH]
 *   2. 文档容器（可选）：若传了 containerClamp，浮栏还要落在容器内
 *      [container.left + MIN_MARGIN, container.right - TOOLBAR_WIDTH - MIN_MARGIN]
 *   3. 纵向：严格跟随选区上沿，不做任何钳制 —— 否则会出现"选区走了浮栏还挂着"的粘连感。
 */
export function computeFloatBarPosition(
  selection: Selection | null,
  viewport: { w: number; h: number },
  containerClamp?: ContainerClamp,
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

  // 横向：以选区中心为锚点
  const xRaw = rect.left + rect.width / 2 - TOOLBAR_HALF_WIDTH;

  // 横向取值范围 = 视口范围 ∩ 容器范围（两者都存在时取交集）
  let minX = MIN_MARGIN;
  let maxX = viewport.w - TOOLBAR_WIDTH;
  if (containerClamp) {
    minX = Math.max(minX, containerClamp.left + MIN_MARGIN);
    maxX = Math.min(maxX, containerClamp.right - TOOLBAR_WIDTH - MIN_MARGIN);
  }
  // 容器被横向缩到比浮栏还窄时理论上没法放，这里取中点兜底（实际不会出现）
  const x = minX > maxX ? Math.round((minX + maxX) / 2) : Math.max(minX, Math.min(xRaw, maxX));

  // 纵向：严格跟随选区上沿，不做任何钳制
  const y = rect.top - TOOLBAR_HEIGHT - VIEWPORT_GAP;

  return { x, y };
}
