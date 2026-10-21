// 极简路由器：只支持 `:param` 形式的路径参数
// 不用 Express 是为了零依赖 —— Netlify 构建时不会为了本地后端多装一堆包；
// 路由仍按 REST 组织，将来要换 Express 只改这一层。
export function createRouter() {
  const routes = [];

  const add = (method, pattern, handler) => {
    routes.push({ method, parts: pattern.split('/').filter(Boolean), handler });
  };

  const match = (method, pathname) => {
    const segments = pathname.split('/').filter(Boolean);
    for (const route of routes) {
      if (route.method !== method || route.parts.length !== segments.length) continue;
      const params = {};
      let ok = true;
      for (let i = 0; i < route.parts.length; i += 1) {
        const part = route.parts[i];
        if (part.startsWith(':')) {
          params[part.slice(1)] = decodeURIComponent(segments[i]);
        } else if (part !== segments[i]) {
          ok = false;
          break;
        }
      }
      if (ok) return { handler: route.handler, params };
    }
    return null;
  };

  return {
    get: (pattern, handler) => add('GET', pattern, handler),
    post: (pattern, handler) => add('POST', pattern, handler),
    put: (pattern, handler) => add('PUT', pattern, handler),
    patch: (pattern, handler) => add('PATCH', pattern, handler),
    delete: (pattern, handler) => add('DELETE', pattern, handler),
    match,
  };
}
