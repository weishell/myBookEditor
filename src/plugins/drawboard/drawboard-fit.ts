// 画板内容适配：像素级自校准
//
// 为什么不靠纯几何计算包围盒：drawui 各类型 Shape 的坐标语义并不统一
// （盒状图形 x/y 是中心、line/arrow/draw 的 points 是页面绝对坐标、
// mind-map/uml 的宽高还可能过期），任何一处假设错了包围盒就会偏，
// 缩略图随之裁切或整块空白。
//
// 这里改成：先用几何估算一个"大致范围"，把它渲染到离屏探针画布上，
// 再扫描非透明像素反推出**真实**的页面包围盒。最终结果只依赖 drawui
// 自己画出来的像素，与坐标语义假设无关；被裁切就自动放大范围重探。
import { Renderer, Camera, layoutMindMap, calcUmlClassSize } from 'drawui-core';
import type { Shape } from 'drawui-core';

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Bounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

// 坐标/尺寸的合理上限：超过即为脏数据（甩飞的幻影图形）
const MAX_SANE_COORD = 1e6;

// 探针画布尺寸（CSS 像素）：够小以保证扫描开销可忽略，够大以保留 ink 细节
const PROBE_W = 512;
const PROBE_H = 384;
// 探针渲染留白：内容不贴边才说明完整落在画布内
const PROBE_PAD = 16;
// 最多放大重探次数
const MAX_PROBE = 8;
// 贴边判定容差（设备像素）
const EDGE_TOL = 1;
// 缩放钳制：缩略图不需要极端放大，也避免病态 zoom 让画布静默空白
const MIN_ZOOM = 1e-4;
const MAX_ZOOM = 8;

const isFiniteNum = (v: unknown): v is number => typeof v === 'number' && isFinite(v);

export const isSaneShape = (s: Record<string, any>): boolean => {
  const num = (v: unknown) => isFiniteNum(v) && Math.abs(v) <= MAX_SANE_COORD;
  if (!s || typeof s !== 'object') return false;
  if (!num(s.x) || !num(s.y)) return false;
  if (s.width !== undefined && (!num(s.width) || s.width < 0)) return false;
  if (s.height !== undefined && (!num(s.height) || s.height < 0)) return false;
  if (s.radius !== undefined && (!num(s.radius) || s.radius < 0)) return false;
  if (Array.isArray(s.points)) {
    for (const p of s.points) {
      if (!p || !num(p.x) || !num(p.y)) return false;
    }
  }
  return true;
};

/** 剔除坐标损坏的脏图形（drawui render 对 NaN 坐标也是静默不画） */
export function filterSaneShapes(shapes: Shape[]): Shape[] {
  const all = (shapes ?? []) as Array<Record<string, any>>;
  const sane = all.filter(isSaneShape);
  if (sane.length !== all.length) {
    console.warn(
      '[drawboard] skipped corrupted shapes:',
      all.filter((s) => !isSaneShape(s)),
    );
  }
  return (sane.length > 0 ? sane : all) as Shape[];
}

// 单个图形的页面包围盒（几何估算，仅作为像素探针的起点）
function getShapeBoxes(shapes: Shape[]): Bounds[] {
  const boxes: Bounds[] = [];
  for (const s of shapes as Array<Record<string, any>>) {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    if (s.type === 'circle' && isFiniteNum(s.radius)) {
      minX = s.x - s.radius;
      minY = s.y - s.radius;
      maxX = s.x + s.radius;
      maxY = s.y + s.radius;
    } else {
      const pts = s.points as Array<{ x: number; y: number }> | undefined;
      if (Array.isArray(pts) && pts.length) {
        for (const p of pts) {
          minX = Math.min(minX, p.x);
          minY = Math.min(minY, p.y);
          maxX = Math.max(maxX, p.x);
          maxY = Math.max(maxY, p.y);
        }
      } else {
        let w = isFiniteNum(s.width) ? s.width : 0;
        let h = isFiniteNum(s.height) ? s.height : 0;
        if (s.type === 'mind-map' && s.root) {
          // width/height 在增删节点后可能过期，用 layoutMindMap 现算权威尺寸
          try {
            const lay = layoutMindMap(s.root);
            if (lay && lay.width > 0 && lay.height > 0) {
              w = lay.width;
              h = lay.height;
            }
          } catch {
            /* 布局失败时退回 shape 自带宽高 */
          }
        } else if ((s.type === 'uml-class' || s.type === 'uml-interface') && !(w > 0 && h > 0)) {
          try {
            const size = calcUmlClassSize(s.className ?? '', s.attributes ?? [], s.methods ?? []);
            w = size.width;
            h = size.height;
          } catch {
            /* ignore */
          }
        }
        if (!(w > 0 && h > 0)) {
          w = 100;
          h = 40;
        }
        minX = s.x - w / 2;
        minY = s.y - h / 2;
        maxX = s.x + w / 2;
        maxY = s.y + h / 2;
      }
    }
    if (![minX, minY, maxX, maxY].every(isFinite)) continue;
    boxes.push({ minX, minY, maxX, maxY });
  }
  return boxes;
}

const unionBoxes = (boxes: Bounds[]): Bounds | null => {
  if (boxes.length === 0) return null;
  return boxes.reduce((u, b) => ({
    minX: Math.min(u.minX, b.minX),
    minY: Math.min(u.minY, b.minY),
    maxX: Math.max(u.maxX, b.maxX),
    maxY: Math.max(u.maxY, b.maxY),
  }));
};

// 两个包围盒之间的间隔距离（相交为 0）
const boxGap = (a: Bounds, b: Bounds): number => {
  const dx = Math.max(a.minX - b.maxX, b.minX - a.maxX, 0);
  const dy = Math.max(a.minY - b.maxY, b.minY - a.maxY, 0);
  return Math.hypot(dx, dy);
};

// 聚类间隔阈值：超过此距离的图形视为不同簇（甩飞的幻影图形会自成小簇）
const CLUSTER_GAP = 5000;

// 簇评分：图形数多者优先；平手取离原点近者；再平手取跨度小者
const clusterKey = (g: Bounds[]): [number, number, number] => {
  const u = unionBoxes(g) as Bounds;
  const dx = u.minX > 0 ? u.minX : u.maxX < 0 ? -u.maxX : 0;
  const dy = u.minY > 0 ? u.minY : u.maxY < 0 ? -u.maxY : 0;
  return [g.length, Math.hypot(dx, dy), u.maxX - u.minX + (u.maxY - u.minY)];
};

const betterKey = (a: [number, number, number], b: [number, number, number]): boolean => {
  if (a[0] !== b[0]) return a[0] > b[0];
  if (a[1] !== b[1]) return a[1] < b[1];
  return a[2] < b[2];
};

// 单链路聚类后选最优簇：避免个别甩飞图形把包围盒撑大、健康图形被缩成角落小点
function pickFitBoxes(boxes: Bounds[]): Bounds[] {
  if (boxes.length <= 1) return boxes;
  const parent = boxes.map((_, i) => i);
  const find = (i: number): number => (parent[i] === i ? i : (parent[i] = find(parent[i])));
  for (let i = 0; i < boxes.length; i++) {
    for (let j = i + 1; j < boxes.length; j++) {
      if (boxGap(boxes[i], boxes[j]) <= CLUSTER_GAP) parent[find(i)] = find(j);
    }
  }
  const groups = new Map<number, Bounds[]>();
  boxes.forEach((b, i) => {
    const r = find(i);
    const g = groups.get(r) ?? [];
    g.push(b);
    groups.set(r, g);
  });
  let best: Bounds[] | null = null;
  let bestKey: [number, number, number] | null = null;
  groups.forEach((g) => {
    const k = clusterKey(g);
    if (!bestKey || betterKey(k, bestKey)) {
      best = g;
      bestKey = k;
    }
  });
  return best ?? boxes;
}

const normalizeRect = (r: Rect): Rect => ({
  x: isFiniteNum(r.x) ? r.x : 0,
  y: isFiniteNum(r.y) ? r.y : 0,
  width: isFiniteNum(r.width) && r.width > 0 ? r.width : 1,
  height: isFiniteNum(r.height) && r.height > 0 ? r.height : 1,
});

// 绕中心放大
const growRect = (r: Rect, f: number): Rect => {
  const w = r.width * f;
  const h = r.height * f;
  return { x: r.x + (r.width - w) / 2, y: r.y + (r.height - h) / 2, width: w, height: h };
};

/** 几何估算内容范围（像素探针的起点，可能偏） */
export function estimateContentRect(shapes: Shape[]): Rect | null {
  const b = unionBoxes(pickFitBoxes(getShapeBoxes(shapes ?? [])));
  if (!b) return null;
  return normalizeRect({
    x: b.minX,
    y: b.minY,
    width: b.maxX - b.minX,
    height: b.maxY - b.minY,
  });
}

/**
 * 把 rect 适配到 w×h 视口的相机。
 * drawui 相机矩阵 = translate(x,y) ∘ scale(zoom)，即 screen = zoom * page + cam.x/y
 * （与 Camera.fitBounds 同式）。
 */
export function cameraForRect(rect: Rect, w: number, h: number, pad: number): Camera {
  const r = normalizeRect(rect);
  const zoomRaw = Math.min((w - 2 * pad) / r.width, (h - 2 * pad) / r.height);
  const cam = new Camera();
  cam.zoom = Math.min(Math.max(zoomRaw, MIN_ZOOM), MAX_ZOOM);
  cam.x = (w - r.width * cam.zoom) / 2 - r.x * cam.zoom;
  cam.y = (h - r.height * cam.zoom) / 2 - r.y * cam.zoom;
  return cam;
}

// 扫描画布上的非透明像素，返回 ink 包围盒（设备像素）
function scanInk(canvas: HTMLCanvasElement): Bounds | null {
  if (canvas.width <= 0 || canvas.height <= 0) return null;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return null;
  let img: ImageData;
  try {
    img = ctx.getImageData(0, 0, canvas.width, canvas.height);
  } catch {
    return null;
  }
  const px = img.data;
  const w = img.width;
  const h = img.height;
  let minX = w;
  let minY = h;
  let maxX = -1;
  let maxY = -1;
  for (let y = 0; y < h; y++) {
    let i = y * w * 4 + 3;
    for (let x = 0; x < w; x++, i += 4) {
      if (px[i] > 0) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX < 0 || maxY < 0) return null;
  return { minX, minY, maxX, maxY };
}

// 模块级共享探针（离屏 canvas + Renderer），避免每次测量都新建
let probeCanvas: HTMLCanvasElement | null = null;
let probeRenderer: Renderer | null = null;

function getProbe(): { canvas: HTMLCanvasElement; renderer: Renderer } | null {
  try {
    if (!probeCanvas) {
      probeCanvas = document.createElement('canvas');
      probeRenderer = new Renderer(probeCanvas);
    }
    if (!probeRenderer) return null;
    return { canvas: probeCanvas, renderer: probeRenderer };
  } catch {
    return null;
  }
}

/**
 * 像素级测量内容真实页面包围盒。
 * 流程：按估算范围渲染到探针画布 → 扫描 ink → 若 ink 贴边说明被裁切，
 * 放大范围重探；未贴边则把 ink 反投影回页面坐标，即为精确包围盒。
 * 返回 null 表示无法测量（调用方退回几何估算）。
 */
export function measureContentRect(shapes: Shape[], estimate: Rect | null): Rect | null {
  if (!shapes || shapes.length === 0) return null;
  const probe = getProbe();
  if (!probe) return estimate ? normalizeRect(estimate) : null;
  const { canvas, renderer } = probe;

  let rect = normalizeRect(
    estimate ?? { x: -PROBE_W, y: -PROBE_H, width: PROBE_W * 2, height: PROBE_H * 2 },
  );
  renderer.resize(PROBE_W, PROBE_H);
  renderer.setShowGrid(false);
  const dpr = canvas.width / PROBE_W || 1;

  let emptyTries = 0;
  for (let i = 0; i < MAX_PROBE; i++) {
    const cam = cameraForRect(rect, PROBE_W, PROBE_H, PROBE_PAD);
    try {
      renderer.render(shapes as any, cam, new Set<string>());
    } catch (err) {
      console.warn('[drawboard] probe render failed', err);
      return estimate ? normalizeRect(estimate) : null;
    }
    const ink = scanInk(canvas);
    if (!ink) {
      // 一点 ink 都没有：要么图形全不可见，要么估算范围偏得离谱。
      // 连续几次仍为空就放弃测量，交给调用方退回估算。
      if (++emptyTries >= 3) return estimate ? normalizeRect(estimate) : null;
      rect = growRect(rect, 4);
      continue;
    }
    emptyTries = 0;
    const touchesEdge =
      ink.minX <= EDGE_TOL ||
      ink.minY <= EDGE_TOL ||
      ink.maxX >= canvas.width - 1 - EDGE_TOL ||
      ink.maxY >= canvas.height - 1 - EDGE_TOL;
    if (!touchesEdge) {
      // 设备像素 → CSS 屏幕 → 页面：page = (screen - cam) / zoom
      const sx0 = ink.minX / dpr;
      const sy0 = ink.minY / dpr;
      const sx1 = ink.maxX / dpr;
      const sy1 = ink.maxY / dpr;
      const z = cam.zoom || 1;
      return normalizeRect({
        x: (sx0 - cam.x) / z,
        y: (sy0 - cam.y) / z,
        width: (sx1 - sx0) / z,
        height: (sy1 - sy0) / z,
      });
    }
    rect = growRect(rect, 2);
  }
  // 迭代用尽仍贴边：退回最后一次范围（至少比初始估算更完整）
  return normalizeRect(rect);
}

/** 一步到位：几何估算 + 像素自校准 */
export function resolveContentRect(shapes: Shape[]): Rect | null {
  const sane = filterSaneShapes(shapes);
  if (sane.length === 0) return null;
  return measureContentRect(sane, estimateContentRect(sane));
}
