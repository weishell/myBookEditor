// 初始化 data/ 与 6 篇起始文档（每分类一篇）
// 只在 data/articles 为空时写入，避免覆盖你后来自己建的内容
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DATA_DIR = path.join(ROOT, 'data');
const ARTICLES_DIR = path.join(DATA_DIR, 'articles');

for (const dir of ['', 'articles', 'drawboards', 'media/images', 'media/files', 'media/videos']) {
  fs.mkdirSync(path.join(DATA_DIR, dir), { recursive: true });
}

if (!fs.existsSync(path.join(DATA_DIR, 'meta.json'))) {
  console.error('缺少 data/meta.json，先补上分类与标签定义再跑 seed');
  process.exit(1);
}

const existing = fs.existsSync(ARTICLES_DIR)
  ? fs.readdirSync(ARTICLES_DIR).filter((f) => f.endsWith('.json'))
  : [];
if (existing.length > 0) {
  console.log(`data/articles 已有 ${existing.length} 篇，跳过 seed（不会覆盖现有内容）`);
  process.exit(0);
}

const p = (text) => ({ type: 'paragraph', id: crypto.randomUUID(), children: [{ text }] });
const h2 = (text) => ({
  type: 'heading',
  id: crypto.randomUUID(),
  attrs: { level: 2 },
  children: [{ text }],
});
const quote = (text) => ({
  type: 'blockquote',
  id: crypto.randomUUID(),
  attrs: { type: 'info' },
  children: [{ text }],
});

const now = new Date();
const iso = (daysAgo) =>
  new Date(now.getTime() - daysAgo * 86400000).toISOString().slice(0, 10) + 'T09:00:00.000Z';

const starters = [
  {
    id: 'welcome-to-mybook',
    title: '从这里开始：MyBook 写作台',
    summary: '一份说明：本地怎么存、线上怎么读，以及为什么数据是文件而不是数据库。',
    categoryId: 'tools',
    tagIds: ['notes', 'tools'],
    createdAt: iso(0),
  },
  {
    id: 'frontend-slate-notes',
    title: 'Slate 编辑器里踩过的几个坑',
    summary: '软换行、void 元素、跨块选区——都是文档里查不到、只能自己撞出来的细节。',
    categoryId: 'frontend',
    tagIds: ['frontend', 'react', 'ts'],
    createdAt: iso(1),
  },
  {
    id: 'backend-file-first',
    title: '文件是真相，数据库只是索引',
    summary: '为什么把正文留在 JSON、只用 SQLite 存元数据，以及这样做换来的是什么。',
    categoryId: 'backend',
    tagIds: ['backend', 'notes'],
    createdAt: iso(2),
  },
  {
    id: 'ai-writing-workflow',
    title: '把 AI 放进写作流程的三个位置',
    summary: '不是让模型替你写，而是让它在你卡住的地方接一手。',
    categoryId: 'ai',
    tagIds: ['ai', 'notes'],
    createdAt: iso(3),
  },
  {
    id: 'design-reading-rhythm',
    title: '长文的阅读节奏怎么调',
    summary: '行宽、行高、段间距与留白：让眼睛愿意往下走的那些数值。',
    categoryId: 'design',
    tagIds: ['design', 'viz'],
    createdAt: iso(4),
  },
  {
    id: 'growth-writing-habit',
    title: '把写作变成可以坚持的事',
    summary: '降低启动成本、固定收尾动作，比意志力可靠得多。',
    categoryId: 'growth',
    tagIds: ['growth', 'notes'],
    createdAt: iso(5),
  },
];

const bodies = {
  'welcome-to-mybook': [
    h2('这套东西怎么运作'),
    p('正文一篇一个 JSON 文件，放在 data/articles/ 下；SQLite 里只有标题、类型、标签、时间和文件相对地址。索引库删了也能从文件重建，所以永远不会出现「数据库里有、文件没了」的悬空记录。'),
    p('本地开发走 Node 起的 API，增删改查都是真写文件；发布到 Netlify 时前端直接读构建出来的同一批 JSON，既不需要服务器，也不需要 WASM。'),
    quote('一句话：文件负责内容，数据库负责查询，静态托管负责公开阅读。'),
    h2('你可以马上试试'),
    p('在首页点「新建文档」，填标题选类型就能开一篇；正文改完会自动保存，刷新不会丢。删除入口在文章页右上角。'),
  ],
  'frontend-slate-notes': [
    p('Slate 的类型系统很灵活，但几个常见操作和直觉不一样，记录下来省得下次再撞。'),
    h2('软换行不是 insertSoftBreak'),
    p('本项目用的 0.126 版本里，Editor.insertSoftBreak 实际是拆块，而不是插入换行符。想让 Shift+Enter 在段内换行，得直接 Transforms.insertText(editor, \'\\n\')，并且给文本节点加 white-space: pre-wrap，否则换行会被折叠成空格。'),
    h2('void 元素要用 voids: true'),
    p('公式、画板、图表这些自绘元素是 void，addMark 进不去。改它们的属性要走 Editor.nodes({ voids: true }) 配合 Transforms.setNodes({ voids: true })，否则看起来「按钮亮了但没生效」。'),
    h2('跨块选区别用 Editor.above'),
    p('跨多块时 Editor.above 返回 undefined，面板会误判成不可用。取选区涉及的块应该用 Editor.nodes({ at: selection, mode: \'highest\' })，并且 match 里要先用 Element.isElement 守卫，不然根节点也会被当成块命中。'),
  ],
  'backend-file-first': [
    p('大多数内容站的默认选择是「数据库存一切」，但这套工具只有一个作者、几百篇文档，把正文塞进数据库反而增加负担。'),
    h2('为什么正文不进库'),
    p('正文是嵌套的 Slate JSON，几十 KB 到几百 KB 不等。放进 SQLite 后，每次读取都要反序列化，diff 也变成二进制。放在文件里，编辑器改动直接落到文件，git 能看、能回滚、能迁走。'),
    h2('索引库换来什么'),
    p('SQL 处理筛选和排序比在内存里 filter 更省事：按分类、按标签、按关键词都能一句 SQL 解决，将来数据涨到几千篇也不用改前端。'),
    quote('库是可丢弃的缓存，文件是不可丢的资产。这个关系定下来，很多一致性问题就消失了。'),
  ],
  'ai-writing-workflow': [
    p('常见的误区是把整篇稿子丢给模型生成，结果拿到一篇通顺但没有观点的文字。更实用的做法是把它放在三个具体位置。'),
    h2('一、开头卡住时'),
    p('先写三句你想说但没说清的话，让模型帮你整理成段落骨架——它负责结构，你负责判断哪句是真的。'),
    h2('二、中途查证时'),
    p('遇到记不清的 API 行为、版本差异，让模型给出「可能的三个答案」，然后自己去源码或文档里确认。把它当成提出假设的助手，而不是结论来源。'),
    h2('三、收尾校对时'),
    p('让它只做一件事：指出你反复使用的词和过长句子。不要让它「润色全文」，那会把你的语气抹平。'),
  ],
  'design-reading-rhythm': [
    p('长文读不下去，往往不是内容问题，而是节奏问题。眼睛需要落脚点，段落需要呼吸。'),
    h2('行宽'),
    p('中文正文一行 30~40 字比较舒服。太宽时视线回扫会丢行，太窄则频繁换行打断思路。项目里正文最大宽度 760px 就是按这个经验定的。'),
    h2('行高与段距'),
    p('行高 1.8 左右，段间距明显大于行距，读者才能一眼分清「换行」和「换段」。标题上方留白要大于下方，视觉上才会和下文归组。'),
    h2('对比度不必拉满'),
    p('正文纯黑配纯白反而刺眼。深灰文字配略微偏暖的纸面，长时间阅读更轻松——这也是最近给壁纸加纸纹的出发点。'),
  ],
  'growth-writing-habit': [
    p('写作最难的不是写，是开始。把启动成本降到「打开就能写」，比每天给自己打气有效得多。'),
    h2('降低启动成本'),
    p('别从空白页开始。留一句上次没写完的话，或者一个待回答的问题，第二天打开就有抓手。'),
    h2('固定收尾动作'),
    p('每次停笔前，写一行「下次从这里继续」。这行字是给未来的自己留的钩子，比任何计划表都管用。'),
    p('最后一条：允许自己写得很烂。烂稿可以改，空白改不了。'),
  ],
};

for (const item of starters) {
  const article = {
    ...item,
    reads: 0,
    status: 'published',
    updatedAt: item.createdAt,
    content: bodies[item.id] ?? [p('开始写点什么吧。')],
  };
  fs.writeFileSync(
    path.join(ARTICLES_DIR, `${item.id}.json`),
    `${JSON.stringify(article, null, 2)}\n`,
    'utf8',
  );
}

console.log(`✅ 已写入 ${starters.length} 篇起始文档到 data/articles/`);
