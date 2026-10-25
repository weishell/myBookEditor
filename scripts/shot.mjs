// 视觉自验小工具：无头 Chrome + CDP 截图
//
// 为什么不用 chrome --screenshot：那种方式没法"先操作再截图"，
// 而很多问题（比如从文章返回首页后目录没消失）只有点一下才暴露出来。
// 这里直接用 DevTools 协议：导航 → 可选的点击/执行 JS → 等一会儿 → 截图。
//
// 用法：
//   node scripts/shot.mjs --url http://localhost:5173/ --out .shot.png
//   node scripts/shot.mjs --url http://localhost:5173/article/xxx --click 'a[href="/"]' --out .shot-back.png
//   node scripts/shot.mjs --url http://localhost:5173/ --eval "localStorage.setItem('k','v')" --out .shot.png
//   --size 1440x1000（默认）  --wait 800（点击后等待毫秒）
import { spawn } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';

const CHROME_CANDIDATES = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
];

function parseArgs(argv) {
  const args = { size: '1440x1000', wait: 800, port: 9333 };
  for (let i = 0; i < argv.length; i += 1) {
    const key = argv[i];
    if (!key.startsWith('--')) continue;
    const name = key.slice(2);
    const value = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : 'true';
    args[name] = value;
    if (value !== 'true') i += 1;
  }
  return args;
}

const args = parseArgs(process.argv.slice(2));
const [width, height] = (args.size || '1440x1000').split('x').map(Number);
const url = args.url || 'http://localhost:5173/';
const out = args.out || '.shot.png';

const chromePath = process.env.CHROME_PATH || CHROME_CANDIDATES[0];

// ⚠️ user-data-dir 必须是绝对路径，否则 Chrome 会静默退出、CDP 端口永远起不来
const profileDir = resolve(process.cwd(), args.profile || '.chrome-shot-profile');

const chrome = spawn(
  chromePath,
  [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--no-first-run',
    '--no-default-browser-check',
    '--remote-allow-origins=*',
    `--remote-debugging-port=${args.port}`,
    `--window-size=${width},${height}`,
    `--user-data-dir=${profileDir}`,
    'about:blank',
  ],
  { stdio: 'ignore' },
);

/** 等 CDP 端口就绪，拿到页面级 websocket 地址 */
async function waitForTarget() {
  for (let i = 0; i < 60; i += 1) {
    try {
      const res = await fetch(`http://127.0.0.1:${args.port}/json/list`);
      const list = await res.json();
      const page = list.find((item) => item.type === 'page');
      if (page?.webSocketDebuggerUrl) return page.webSocketDebuggerUrl;
    } catch {
      /* 端口还没起来，继续等 */
    }
    await delay(250);
  }
  throw new Error('CDP 端口未就绪');
}

const wsUrl = await waitForTarget();
const ws = new WebSocket(wsUrl);
const pending = new Map();
let seq = 0;
const events = new Map();

ws.addEventListener('message', (event) => {
  const msg = JSON.parse(event.data);
  if (msg.id && pending.has(msg.id)) {
    const { resolve, reject } = pending.get(msg.id);
    pending.delete(msg.id);
    if (msg.error) reject(new Error(JSON.stringify(msg.error)));
    else resolve(msg.result);
    return;
  }
  const waiters = events.get(msg.method);
  if (waiters?.length) waiters.shift()(msg.params);
});

function send(method, params = {}) {
  seq += 1;
  const id = seq;
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params }));
  });
}

function once(method) {
  return new Promise((resolve) => {
    const list = events.get(method) || [];
    list.push(resolve);
    events.set(method, list);
  });
}

await new Promise((resolve) => ws.addEventListener('open', resolve, { once: true }));
await send('Page.enable');
await send('Runtime.enable');
await send('Emulation.setDeviceMetricsOverride', {
  width,
  height,
  deviceScaleFactor: 1,
  mobile: false,
});

const loaded = once('Page.loadEventFired');
await send('Page.navigate', { url });
await loaded;
// 首屏的接口数据 / 字体 / 壁纸都要等一下，否则截到的是骨架
await delay(Number(args.wait));

if (args.eval) {
  const res = await send('Runtime.evaluate', {
    expression: args.eval,
    awaitPromise: true,
    returnByValue: true,
  });
  if (res.exceptionDetails) console.error('eval 出错:', res.exceptionDetails.text);
  // --dump：把表达式结果打到终端，方便确认样式/状态，而不是只靠肉眼看截图
  if (args.dump) console.log(JSON.stringify(res.result?.value, null, 2));
}

// --reload：eval 之后重新导航一次再截图。
// 用来验证 localStorage 这类"刷新后还在不在"的行为（跨进程复用 profile 不可靠，
// Chrome 被 kill 时不一定把 storage 落盘，所以同一个会话里 reload 才准）
if (args.reload) {
  const again = once('Page.loadEventFired');
  await send('Page.navigate', { url });
  await again;
  await delay(Number(args.wait));
}

if (args.click) {
  const expression = `(() => {
    const el = document.querySelector(${JSON.stringify(args.click)});
    if (!el) return 'NOT_FOUND';
    el.click();
    return 'OK';
  })()`;
  const res = await send('Runtime.evaluate', { expression, returnByValue: true });
  const status = res.result?.value;
  if (status !== 'OK') console.error('点击失败:', status, args.click);
  await delay(Number(args.wait));
}

const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
writeFileSync(out, Buffer.from(shot.data, 'base64'));
console.log(`${out} (${width}x${height})`);

// 用 CDP 正常关闭浏览器，别用 taskkill（那会连用户自己的 Chrome 一起杀掉）
ws.close();
chrome.kill();
process.exit(0);
