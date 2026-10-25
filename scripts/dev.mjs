// 一键起本地全栈：后端(3001) + 前端 vite(5173)
// 背景：以前 "dev" 只起 vite，忘了 dev:server 时页面会静默回退到内置示例数据——
// 只读、没法建分类/标签、搜不到文章，全是这一个原因。所以把两者绑在一起起。
import { spawn } from 'node:child_process';
import path from 'node:path';
import process from 'node:process';

const root = path.resolve(import.meta.dirname, '..');
const children = [];

function start(name, args) {
  const child = spawn(process.execPath, args, {
    cwd: root,
    env: process.env,
    stdio: 'inherit',
  });
  child.on('exit', (code) => {
    // 一个挂了就整体退出，避免"前端活着但后端死了"的假可用状态
    if (!shuttingDown) {
      console.error(`\n[dev] ${name} 退出（code=${code ?? 'signal'}），整体关闭。`);
      shutdown(1);
    }
  });
  children.push(child);
  return child;
}

let shuttingDown = false;
function shutdown(code = 0) {
  if (shuttingDown) return;
  shuttingDown = true;
  for (const child of children) {
    try {
      child.kill();
    } catch {
      /* 进程可能已退出 */
    }
  }
  process.exit(code);
}

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));

console.log('[dev] 启动本地后端 (3001) + 前端 vite (5173)…');
start('server', ['--watch', 'server/index.js']);
start('vite', [path.join(root, 'node_modules', 'vite', 'bin', 'vite.js')]);
