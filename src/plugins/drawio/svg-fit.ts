// SVG 预览适配工具
// draw.io 导出的 SVG 的 viewBox 可能只覆盖部分画布：越界图形会被裁掉、
// 空白页区域又占地方。预览前按内容真实包围盒重算 viewBox，
// 配合 <img object-fit:contain> 即可"全部图形 + 居中 + 自动缩放"展示。

// 解码 svg data URL（支持 charset / base64 两种编码）
export const decodeSvgDataUrl = (url: string): string | null => {
  const comma = url.indexOf(',');
  if (comma < 0) return null;
  const meta = url.slice(0, comma);
  const body = url.slice(comma + 1);
  if (!/^data:image\/svg\+xml/i.test(meta)) return null;
  if (/;base64$/i.test(meta)) {
    try {
      const bin = atob(body);
      const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
      return new TextDecoder().decode(bytes);
    } catch {
      return null;
    }
  }
  try {
    return decodeURIComponent(body);
  } catch {
    return null;
  }
};

export const encodeSvgDataUrl = (svgText: string): string =>
  `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgText)}`;

// 按内容包围盒重算 viewBox：裁掉空白页区域、救回被原 viewBox 裁掉的越界图形
export const fitSvgToContent = (svgText: string, padding = 12): string => {
  try {
    const doc = new DOMParser().parseFromString(svgText, 'image/svg+xml');
    if (doc.getElementsByTagName('parsererror').length > 0) return svgText;
    const svg = doc.documentElement;
    if (!svg || svg.nodeName.toLowerCase() !== 'svg') return svgText;

    // getBBox 需要元素在渲染树中：挂一个 visibility:hidden 的宿主测量
    const host = document.createElement('div');
    host.style.cssText =
      'position:fixed;left:0;top:0;width:0;height:0;overflow:hidden;visibility:hidden;pointer-events:none;';
    host.appendChild(svg.cloneNode(true));
    document.body.appendChild(host);

    let bbox: { x: number; y: number; width: number; height: number } | null = null;
    try {
      const inner = host.firstElementChild as SVGSVGElement | null;
      if (inner) {
        // 不能对外层 <svg> 直接 getBBox：部分浏览器返回视口矩形而非子图形并集，
        // 导致裁不准（左缘依旧裁切、右/下留大片空白）。
        // 标准做法：把全部内容包进一个无变换的 <g>，对 <g> 求 getBBox（= 子图形几何并集）
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        while (inner.firstChild) g.appendChild(inner.firstChild);
        inner.appendChild(g);
        const b = g.getBBox();
        if (b && (b.width > 0 || b.height > 0)) {
          bbox = b;
        } else {
          // 兜底：逐个子元素求并集
          let x1 = Infinity;
          let y1 = Infinity;
          let x2 = -Infinity;
          let y2 = -Infinity;
          for (const child of Array.from(g.children)) {
            try {
              const cb = (child as SVGGraphicsElement).getBBox();
              if (!cb || (cb.width === 0 && cb.height === 0)) continue;
              x1 = Math.min(x1, cb.x);
              y1 = Math.min(y1, cb.y);
              x2 = Math.max(x2, cb.x + cb.width);
              y2 = Math.max(y2, cb.y + cb.height);
            } catch {
              /* 跳过不可测量节点 */
            }
          }
          if (x1 <= x2 && y1 <= y2) bbox = { x: x1, y: y1, width: x2 - x1, height: y2 - y1 };
        }
      }
    } catch {
      bbox = null;
    }
    document.body.removeChild(host);
    if (!bbox) return svgText;

    const x = bbox.x - padding;
    const y = bbox.y - padding;
    const w = bbox.width + padding * 2;
    const h = bbox.height + padding * 2;
    svg.setAttribute('viewBox', `${x} ${y} ${w} ${h}`);
    // 同步 intrinsic 尺寸，保证 <img> 的宽高比与内容一致
    svg.setAttribute('width', String(Math.round(w)));
    svg.setAttribute('height', String(Math.round(h)));
    svg.style.removeProperty('width');
    svg.style.removeProperty('height');
    return new XMLSerializer().serializeToString(svg);
  } catch {
    return svgText;
  }
};
