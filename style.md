# 项目开发经验教训记录

## 2026-07-25 — TodoList 节点查找问题

### 问题描述

在实现 TodoList 组件的复选框点击切换功能时，使用 `editor.nodes()` 查找节点失败，`nodes found: 0`。

#### 根因分析

`editor.nodes()` 方法依赖编辑器的**当前选区**来定位节点。由于在 `onMouseDown` 中调用了 `e.preventDefault()` 阻止了默认行为（包括选区更新），导致查找时选区仍是旧的位置，因此找不到目标节点。

#### 解决方案

改用递归函数直接遍历 `editor.children` 数组查找匹配的节点，不依赖选区：

```typescript
const findNodePath = (
  nodes: Descendant[],
  targetId: string,
  currentPath: number[] = [],
): number[] | null => {
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (SlateElement.isElement(node) && (node as any).id === targetId) {
      return [...currentPath, i];
    }
    if (SlateElement.isElement(node) && node.children) {
      const found = findNodePath(node.children as Descendant[], targetId, [...currentPath, i]);
      if (found) return found;
    }
  }
  return null;
};
```

#### 经验教训

1. **`editor.nodes()` 依赖选区**：当选区被阻止更新时（如 `e.preventDefault()`），无法正确查找节点
2. **直接遍历 `editor.children` 更可靠**：对于需要精确匹配的场景，直接遍历数据结构不受选区影响
3. **调试时先验证节点是否存在**：使用 alert 或 console 输出找到的节点数量，快速定位问题
