// echarts 运行时加载器
//
// 为什么需要它：echarts + echarts-wordcloud + zrender 加起来约 376 kB（gzip），
// 只有「文档里真的存在图表块」时才用得上，但之前 Chart.tsx / chart-utils.ts
// 都是静态 import，导致任何一个带编辑器的页面都要先把整个图表引擎下载完。
//
// 改成动态 import 后有两个必须处理好的点：
//   1. 词云不是 echarts 内置系列，靠 `echarts-wordcloud` 的副作用 import 往全局注册，
//      所以必须「先注册、再 use」，不能并行。
//   2. 一个文档里可能有好几个图表块，各自都会触发加载 —— 用模块级 Promise 缓存，
//      保证只下载/执行一次。

export type EChartsModule = typeof import('echarts');

let loading: Promise<EChartsModule> | null = null;

/** 加载 echarts（含 wordcloud 扩展），重复调用只真正执行一次 */
export function loadEcharts(): Promise<EChartsModule> {
  if (!loading) {
    loading = (async () => {
      const echarts = await import('echarts');
      // 副作用 import：把 wordCloud 系列注册进 echarts 全局，必须在 setOption 之前完成
      await import('echarts-wordcloud');
      return echarts as EChartsModule;
    })().catch((err) => {
      // 加载失败不缓存失败态，下次挂载还能重试（例如断网后恢复）
      loading = null;
      throw err;
    });
  }
  return loading;
}
