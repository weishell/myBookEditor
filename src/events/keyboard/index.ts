// 键盘事件模块统一出口
//
// handleKeyDown.ts 是编辑器全局 keydown 的唯一调度入口（core/index.tsx 使用）；
// handleEnter / handleTab 为具体按键的专属处理逻辑。
export { createKeyDownHandler, isKeyConsumed } from './handleKeyDown';
export { handleEnter } from './handleEnter';
export { handleTabIndent } from './handleTab';
