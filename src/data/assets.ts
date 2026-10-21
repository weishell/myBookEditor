// 静态资源地址拼接：库里只存相对地址，前缀统一在这里处理
export const DEFAULT_CATEGORY_COVER = '/covers/category-default.svg';

/**
 * 把「media/images/covers/x.png」这类相对地址变成可用 URL。
 * 现在前缀为空（开发走 Vite 代理、线上是静态根），将来换 CDN 只改这里。
 */
export const assetUrl = (relPath?: string | null): string =>
  relPath ? `/${relPath.replace(/^\/+/, '')}` : DEFAULT_CATEGORY_COVER;
