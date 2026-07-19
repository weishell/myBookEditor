import type { Editor, Range, Node, Path, Element } from 'slate';
import { Node as SlateNode, Path as SlatePath } from 'slate';

/**
 * 编辑器验证工具类
 * 提供对 Slate 编辑器中选区、路径、节点等的合法性校验方法
 */
export class EditorValidator {
  private editor: Editor;

  constructor(editor: Editor) {
    this.editor = editor;
  }

  /**
   * 校验选区是否合法
   * @param selection - 待校验的选区对象
   * @returns 合法返回 true，否则返回 false
   *
   * 合法选区需要满足：
   * 1. selection 不为 null 和 undefined
   * 2. anchor 和 focus 都存在
   * 3. anchor 和 focus 的 path 都是有效的数组
   * 4. anchor 和 focus 的 offset 都是非负整数
   */
  validateSelection(selection: Range | null): boolean {
    if (!selection) return false;
    if (!selection.anchor || !selection.focus) return false;
    if (!this.validatePath(selection.anchor.path)) return false;
    if (!this.validatePath(selection.focus.path)) return false;
    if (typeof selection.anchor.offset !== 'number' || selection.anchor.offset < 0) return false;
    if (typeof selection.focus.offset !== 'number' || selection.focus.offset < 0) return false;
    return true;
  }

  /**
   * 校验选区是否为折叠状态（光标）
   * @param selection - 待校验的选区对象
   * @returns 是折叠状态返回 true，否则返回 false
   */
  isSelectionCollapsed(selection: Range | null): boolean {
    if (!this.validateSelection(selection)) return false;
    const { anchor, focus } = selection!;
    return (
      anchor.path.length === focus.path.length &&
      anchor.path.every((val, idx) => val === focus.path[idx]) &&
      anchor.offset === focus.offset
    );
  }

  /**
   * 校验路径是否存在于编辑器中
   * @param path - 待校验的路径数组
   * @returns 存在返回 true，否则返回 false
   *
   * 有效路径需要满足：
   * 1. path 是一个非空数组
   * 2. 数组中的每个元素都是非负整数
   * 3. 路径在编辑器文档树中存在对应节点
   */
  validatePath(path: Path): boolean {
    if (!Array.isArray(path) || path.length === 0) return false;
    for (const index of path) {
      if (typeof index !== 'number' || index < 0 || !Number.isInteger(index)) {
        return false;
      }
    }
    try {
      const node = SlateNode.get(this.editor, path);
      return node !== undefined;
    } catch {
      return false;
    }
  }

  /**
   * 校验路径是否指向一个元素节点（非文本节点）
   * @param path - 待校验的路径数组
   * @returns 是元素节点返回 true，否则返回 false
   */
  isElementAtPath(path: Path): boolean {
    if (!this.validatePath(path)) return false;
    const node = SlateNode.get(this.editor, path);
    return SlateNode.isElement(node);
  }

  /**
   * 校验路径是否指向一个文本节点
   * @param path - 待校验的路径数组
   * @returns 是文本节点返回 true，否则返回 false
   */
  isTextAtPath(path: Path): boolean {
    if (!this.validatePath(path)) return false;
    const node = SlateNode.get(this.editor, path);
    return SlateNode.isText(node);
  }

  /**
   * 校验是否存在前一个兄弟节点
   * @param path - 当前节点的路径
   * @returns 存在返回 true，否则返回 false
   *
   * 判断逻辑：
   * 1. 路径必须合法存在
   * 2. 当前节点在父节点中的索引必须大于 0
   */
  hasPreviousSibling(path: Path): boolean {
    if (!this.validatePath(path)) return false;
    const previousPath = SlatePath.previous(path);
    return this.validatePath(previousPath);
  }

  /**
   * 获取前一个兄弟节点
   * @param path - 当前节点的路径
   * @returns 前一个兄弟节点，如果不存在返回 null
   */
  getPreviousSibling(path: Path): Node | null {
    if (!this.hasPreviousSibling(path)) return null;
    const previousPath = SlatePath.previous(path);
    return SlateNode.get(this.editor, previousPath);
  }

  /**
   * 校验是否存在后一个兄弟节点
   * @param path - 当前节点的路径
   * @returns 存在返回 true，否则返回 false
   *
   * 判断逻辑：
   * 1. 路径必须合法存在
   * 2. 当前节点在父节点中的索引必须小于父节点 children 长度减 1
   */
  hasNextSibling(path: Path): boolean {
    if (!this.validatePath(path)) return false;
    const nextPath = SlatePath.next(path);
    return this.validatePath(nextPath);
  }

  /**
   * 获取后一个兄弟节点
   * @param path - 当前节点的路径
   * @returns 后一个兄弟节点，如果不存在返回 null
   */
  getNextSibling(path: Path): Node | null {
    if (!this.hasNextSibling(path)) return null;
    const nextPath = SlatePath.next(path);
    return SlateNode.get(this.editor, nextPath);
  }

  /**
   * 根据路径获取对应的节点，进行合法性校验
   * @param path - 节点路径
   * @returns 对应的节点，如果路径无效返回 null
   *
   * 校验逻辑：
   * 1. 路径格式校验（数组、非负整数）
   * 2. 使用 SlateNode.get 尝试获取节点
   * 3. 捕获可能的异常并返回 null
   */
  getNodeByPath(path: Path): Node | null {
    if (!Array.isArray(path) || path.length === 0) return null;
    for (const index of path) {
      if (typeof index !== 'number' || index < 0 || !Number.isInteger(index)) {
        return null;
      }
    }
    try {
      const node = SlateNode.get(this.editor, path);
      return node || null;
    } catch {
      return null;
    }
  }

  /**
   * 根据节点查找其路径，进行合法性校验
   * @param node - 待查找的节点对象
   * @returns 节点的路径数组，如果节点不存在返回 null
   *
   * 校验逻辑：
   * 1. 节点必须存在且是有效的对象
   * 2. 遍历编辑器文档树查找节点
   * 3. 验证返回的路径是否有效
   */
  findPathByNode(node: Node): Path | null {
    if (!node || typeof node !== 'object') return null;

    let foundPath: Path | null = null;

    const traverse = (currentNode: Node, currentPath: Path) => {
      if (currentNode === node) {
        foundPath = currentPath;
        return true;
      }

      if (SlateNode.isElement(currentNode) && currentNode.children) {
        for (let i = 0; i < currentNode.children.length; i++) {
          if (traverse(currentNode.children[i], [...currentPath, i])) {
            return true;
          }
        }
      }

      return false;
    };

    try {
      traverse(this.editor as unknown as Node, []);
      if (foundPath && this.validatePath(foundPath)) {
        return foundPath;
      }
    } catch {
      // ignore
    }

    return null;
  }

  /**
   * 校验节点是否为编辑器的顶层子节点（一级子节点）
   * @param path - 节点路径
   * @returns 是顶层子节点返回 true，否则返回 false
   */
  isTopLevelNode(path: Path): boolean {
    if (!this.validatePath(path)) return false;
    return path.length === 1;
  }

  /**
   * 校验路径是否在编辑器的范围内
   * @param path - 待校验的路径
   * @returns 在范围内返回 true，否则返回 false
   */
  isPathInEditor(path: Path): boolean {
    return this.validatePath(path);
  }

  /**
   * 获取父节点路径
   * @param path - 当前节点路径
   * @returns 父节点路径，如果已经是根节点返回 null
   */
  getParentPath(path: Path): Path | null {
    if (!this.validatePath(path) || path.length === 0) return null;
    const parentPath = SlatePath.parent(path);
    return parentPath.length > 0 || (parentPath.length === 0 && this.validatePath(parentPath))
      ? parentPath
      : null;
  }

  /**
   * 获取父节点
   * @param path - 当前节点路径
   * @returns 父节点，如果不存在返回 null
   */
  getParentNode(path: Path): Element | null {
    const parentPath = this.getParentPath(path);
    if (!parentPath) return null;
    const node = this.getNodeByPath(parentPath);
    return node !== null && SlateNode.isElement(node) ? node : null;
  }

  /**
   * 校验节点是否具有指定的属性
   * @param path - 节点路径
   * @param attrName - 属性名称
   * @returns 具有该属性返回 true，否则返回 false
   */
  nodeHasAttribute(path: Path, attrName: string): boolean {
    const node = this.getNodeByPath(path);
    if (!node || !SlateNode.isElement(node)) return false;
    return attrName in node;
  }

  /**
   * 获取节点的指定属性值
   * @param path - 节点路径
   * @param attrName - 属性名称
   * @returns 属性值，如果不存在返回 undefined
   */
  getNodeAttribute<T = unknown>(path: Path, attrName: string): T | undefined {
    const node = this.getNodeByPath(path);
    if (!node || !SlateNode.isElement(node)) return undefined;
    return (node as unknown as Record<string, T>)[attrName];
  }
}
