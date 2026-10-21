// 内置示例数据：只在「数据源不可用」时兜底（本地 API 没起、线上快照没生成）
// 与真实数据使用同一套形状，页面无需感知差异
import type { Descendant } from 'slate';
import { v4 as uuidv4 } from 'uuid';
import { BlockElementType } from '@/enums';
import type { Article, Category, Tag } from './types';

export const DEMO_CATEGORIES: Category[] = [
  {
    id: 'frontend',
    name: '前端开发',
    color: '#2f6fed',
    icon: '🖥️',
    desc: '框架、工程化与浏览器技术',
  },
  { id: 'backend', name: '后端架构', color: '#00a66c', icon: '⚙️', desc: '服务端、数据库与分布式' },
  { id: 'ai', name: '人工智能', color: '#7c3aed', icon: '🤖', desc: '模型应用与大模型实践' },
  { id: 'design', name: '设计创意', color: '#e05b3f', icon: '🎨', desc: '视觉、交互与产品设计' },
  { id: 'tools', name: '效率工具', color: '#d4a017', icon: '🧰', desc: '软件工具与工作流搭建' },
  { id: 'growth', name: '职场成长', color: '#c026a5', icon: '🌱', desc: '方法论、沟通与职业发展' },
];

export const DEMO_TAGS: Tag[] = [
  { id: 'frontend', name: '前端', color: '#2f6fed' },
  { id: 'backend', name: '后端', color: '#00a66c' },
  { id: 'ai', name: '人工智能', color: '#7c3aed' },
  { id: 'design', name: '设计', color: '#e05b3f' },
  { id: 'tools', name: '效率工具', color: '#d4a017' },
  { id: 'growth', name: '职场', color: '#c026a5' },
  { id: 'react', name: 'React', color: '#0ea5e9' },
  { id: 'ts', name: 'TypeScript', color: '#3178c6' },
  { id: 'perf', name: '性能优化', color: '#f59e0b' },
  { id: 'viz', name: '数据可视化', color: '#14b8a6' },
  { id: 'oss', name: '开源项目', color: '#6366f1' },
  { id: 'notes', name: '学习笔记', color: '#94a3b8' },
];

const TOPICS: Record<string, string[]> = {
  frontend: ['React', 'TypeScript', 'Vite', '性能优化', '工程化'],
  backend: ['Node.js', '数据库', '微服务', '云原生', '缓存'],
  ai: ['大模型应用', 'Prompt 工程', 'AI Agent', '机器学习', '多模态'],
  design: ['设计系统', '交互体验', '视觉排版', '动效设计', '用户研究'],
  tools: ['自动化工作流', '效率方法论', '生产力工具', '笔记系统', '时间管理'],
  growth: ['职场沟通', '项目管理', '技术写作', '职业规划', '团队协作'],
};

const VARIANTS = [
  (t: string) => `深入理解 ${t}`,
  (t: string) => `${t} 从入门到精通`,
  (t: string) => `${t} 实战指南`,
  (t: string) => `${t} 踩坑与避坑`,
  (t: string) => `${t} 原理剖析`,
  (t: string) => `${t} 最佳实践`,
  (t: string) => `${t} 进阶之路`,
  (t: string) => `${t} 源码解读`,
  (t: string) => `${t} 性能优化实战`,
  (t: string) => `${t} 项目落地案例`,
  (t: string) => `${t} 常见问题汇总`,
  (t: string) => `${t} 学习路线与资源`,
];

const SUMMARY_TAILS = [
  '从零搭建到线上部署，一步一个坑，帮你少走弯路。',
  '结合真实业务场景拆解核心原理，读这一篇就够了。',
  '不仅有代码示例，还有思路推演，适合对照练习。',
  '整理高频问题与解决方案，可作为日常速查手册。',
  '从一个最小示例出发，逐步扩展到生产级用法。',
  '深入源码层解析实现细节，助你彻底搞懂机制。',
];

const makeParagraph = (text: string): Descendant => ({
  type: BlockElementType.PARAGRAPH,
  id: uuidv4(),
  children: [{ text }],
});

const BASE_DATE = new Date('2026-09-30T00:00:00');

function buildContent(title: string, topic: string, seed: number): Descendant[] {
  const intro = `${title}：${topic} 是当前最值得投入的方向之一，本文用平实的语言把关键概念和落地路径讲清楚。`;
  const first = `先厘清几个核心概念：${topic} 的本质、适用场景与边界。很多人在第一步就陷入细节，本文先给整体框架，再逐个击破。`;
  const second =
    seed % 2 === 0
      ? '实践环节以一个小型示例贯穿始终。我们会从初始化项目开始，逐步补充功能、处理边界、优化体验，最终得到一个可以放进真实项目的产物。'
      : '接着进入动手环节，按照可复现的步骤演示完整过程。每一步都配有说明，遇到异常时也能快速定位原因，而不是盲目试错。';
  const third =
    seed % 3 === 0
      ? '最后总结几条经验：一是先跑通再优化，二是善用社区资源，三是持续复盘。文末附上相关工具与进一步阅读的清单。'
      : '最后做一个横向对比，把常见方案的取舍讲清楚。你会明白为什么有些方案在特定场景下更合适，以及如何根据自身情况做选择。';
  const nodes: Descendant[] = [makeParagraph(intro), makeParagraph(first)];
  if (seed % 2 === 1) {
    nodes.push({
      type: BlockElementType.HEADING,
      id: uuidv4(),
      attrs: { level: 2 },
      children: [{ text: '核心要点' }],
    });
  }
  nodes.push(makeParagraph(second), makeParagraph(third));
  return nodes;
}

const byDateDesc = (a: Article, b: Article) => (a.date < b.date ? 1 : -1);

function buildDemoArticles(): Article[] {
  let n = 0;
  const generated: Article[] = [];
  for (const cat of DEMO_CATEGORIES) {
    const topics = TOPICS[cat.id] ?? [];
    topics.forEach((topic, ti) => {
      for (let vi = 0; vi < VARIANTS.length; vi++) {
        const seed = n;
        const title = VARIANTS[vi](topic);
        const offset = ((seed * 37) % 400) + (seed % 5) * 400;
        const date = new Date(BASE_DATE.getTime() - offset * 24 * 3600000)
          .toISOString()
          .slice(0, 10);
        const tags = Array.from(
          new Set([
            cat.id,
            DEMO_TAGS[(seed * 7 + 3) % DEMO_TAGS.length].id,
            ...(seed % 3 === 0 ? [DEMO_TAGS[(seed * 11 + 5) % DEMO_TAGS.length].id] : []),
          ]),
        );
        generated.push({
          id: `${cat.id}-t${ti}-v${vi}`,
          title,
          summary: `「${title}」围绕 ${topic} 从基础概念讲到落地实践。${SUMMARY_TAILS[seed % SUMMARY_TAILS.length]}`,
          category: cat.id,
          tags,
          date,
          reads: ((seed * 137) % 9000) + 300,
          content: buildContent(title, topic, seed),
        });
        n++;
      }
    });
  }
  return generated.sort(byDateDesc);
}

export const DEMO_ARTICLES: Article[] = buildDemoArticles();
