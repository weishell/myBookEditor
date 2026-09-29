// 全屏覆盖层打开时锁住页面滚动并隐藏页面滚动条，关闭时恢复。
// 全屏层铺满视口会遮住背景，因此无需像居中弹框那样用 paddingRight 补偿滚动条宽度。
export function lockPageScroll() {
  const prev = document.body.style.overflow;
  document.body.style.overflow = 'hidden';
  return () => {
    document.body.style.overflow = prev;
  };
}
