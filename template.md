import React from 'react'
import { Editor, Transforms, Node, Path } from 'slate'
import { ReactEditor } from 'slate-react'
import { v4 } from 'uuid'
import { CommandFn } from '@/utils/slate-command'
import { EDITOR_ELEMENT_TYPE, ElementPlugin } from '@/constant/interfaces'
import { isObject } from '@/utils/data-type'
import { ELTYPE, ELTYPE_NUM, SOURCE_TYPE } from '@/constant/enums/eltype'
import { getElementStyle } from '@/utils/getStyle'
import { focusSelection } from '@/utils/slate-handle-type'
import { sleep } from '@/utils/sleep'
import { CommandType } from '@/constant/enums/command'
import { PrefixOlUlList } from '../common/olulList'
import { getOlUlDomClass } from '../common/olulList/utils'
import { olulListToOther } from '@/utils/slate-olul/index'
import ZeroWidthSpace from '@/components/zeroWidthSpace'
import { createHeadingStyle, hasHeadingContent, isMatchHeadingElement } from './utils'
import { withInputState } from '@/components/withInputState'
import styles from './style.module.less'
import { ALIGN_MAP, HEADING_LEVEL_MAP } from './constants'
import { isContentEditable } from '@/utils/sor/utils'
import store from '@/store'
import { paragraphLeavesFromCodeBlockProperty } from '@/plugins/code-block/utils/codeTransform'

// 生成 H1-H9 组件
const [H1, H2, H3, H4, H5, H6, H7, H8, H9] = [1, 2, 3, 4, 5, 6, 7, 8, 9].map(level =>
withInputState(createHeadingStyle(level))
)

// H1-H9 组件映射
const HEADING_COMPONENT_MAP: Record<string, React.ComponentType<any>> = {
[ELTYPE.HEADING_ONE]: H1,
[ELTYPE.HEADING_TWO]: H2,
[ELTYPE.HEADING_THREE]: H3,
[ELTYPE.HEADING_FOUR]: H4,
[ELTYPE.HEADING_FIVE]: H5,
[ELTYPE.HEADING_SIX]: H6,
[ELTYPE.HEADING_SEVEN]: H7,
[ELTYPE.HEADING_EIGHT]: H8,
[ELTYPE.HEADING_NINE]: H9
}

/**

- 标题插件命令处理
- @param editor 编辑器实例
- @param key 命令类型
- @param data 命令数据
- @returns 命令处理结果
  */
  const headingCommand: CommandFn = async (editor: any, key: any, data: any) => {
  const { commandType, path, finallyType } = data
  if (!isObject(data) || !path) return

try {
switch (commandType) {
case CommandType.ADD:
case CommandType.ADD_ABOVE:
Transforms.insertNodes(
editor,
{
block_id: v4(),
block_type: ELTYPE_NUM[finallyType as keyof typeof ELTYPE_NUM],
block_type_string: finallyType,
style: { align: 1, indent: 0 },
children: [{ text: '' }]
} as any,
{ at: path }
)
ReactEditor.blur(editor)
await sleep(10)
focusSelection(editor, path)
break

      case CommandType.UPDATE:
        const node = Node.getIf(editor, path) as any
        if (node?.block_type === ELTYPE_NUM.CODE_BLOCK) {
          const changePath = Path.parent(path)
          // 将代码块的代码高亮片段转换为段落节点
          const leaves = paragraphLeavesFromCodeBlockProperty(node) as any[]
          Transforms.removeNodes(editor, { at: changePath })
          Transforms.insertNodes(
            editor,
            {
              block_id: v4(),
              block_type: ELTYPE_NUM[finallyType as keyof typeof ELTYPE_NUM],
              block_type_string: finallyType,
              style: { align: 1 },
              children: leaves?.length ? leaves : [{ text: node?.property?.content ?? '' }]
            } as any,
            { at: changePath }
          )
        } else {
          // 检测当前是否已是目标标题类型
          const isSameHeading = node?.block_type_string === finallyType
          let targetType
          if (data?.shouldChange === false) {
            targetType = finallyType
          } else {
            targetType = isSameHeading ? 'PARAGRAPH' : finallyType
          }

          const tag = olulListToOther({
            editor,
            path: data.path,
            block_type: ELTYPE_NUM[finallyType as keyof typeof ELTYPE_NUM],
            block_type_string: finallyType,
            element: node,
            floatMd: (data?.floatMd ?? false) as boolean
          })
          if (tag) return

          const newNode = {
            block_id: v4(),
            block_type: ELTYPE_NUM[targetType as keyof typeof ELTYPE_NUM],
            block_type_string: targetType,
            style: node.style || { align: 1, indent: 0 },
            property: node.property || {},
            children: node.children
          }

          Transforms.setNodes(editor, newNode, { at: path })
        }
        ReactEditor.blur(editor)
        await sleep(10)
        if (node?.block_type === ELTYPE_NUM.CODE_BLOCK) {
          focusSelection(editor, path.slice(0, -1))
        } else {
          focusSelection(editor, path)
        }

        break
    }

} catch (error) {
console.error('Heading command error:', error)
}
}

/**

- 标题插件主函数
- @param editor 编辑器实例
- @param readonly 是否只读
- @returns 标题插件
  */
  export const HeadingPlugin = (editor: Editor, readonly): ElementPlugin => ({
  key: ELTYPE.HEADING,
  type: EDITOR_ELEMENT_TYPE.BLOCK,
  command: (editor, key, data) => headingCommand(editor, key, data),
  MatchLine: context => isMatchHeadingElement(context?.element?.block_type_string),
  RenderLine: ({ children, element, attributes }) => {
  try {
  // 获取标题组件
  const Component = HEADING_COMPONENT_MAP[element.block_type_string] || H1
  // 获取样式
  const alignIndex = Number(element.style?.align) - 1
  const baseStyle = getElementStyle(element)
  const textAlign = ALIGN_MAP[alignIndex] || 'left'
  const style = {
  ...baseStyle,
  borderRadius: '5px',
  textAlign
  }

  // 处理标题点击事件，非可编辑节点且不是来自 sor 节点，阻止默认行为
  const onPointerDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
  try {
  // 如果是只读模式，不处理
  if (readonly) return

         const isSorOperationMode = store.getState()?.editor?.isSorOperationMode
         // 只针对实例文档下处理
         if (isSorOperationMode) {
           // 如果点击的元素是来自 sor 节点，则不阻止默认行为
           const isSorContainer = (e.target as HTMLElement).closest('[data-sor-container="true"]')
           const isEditable = isContentEditable(element)
           if (!isEditable && !isSorContainer){
             e.preventDefault()
             e.stopPropagation()
             ReactEditor.blur(editor as any)
             Transforms.deselect(editor)
             return
           }
         }
       } catch (error) {
         console.error('[Heading onPointerDown]: 标题点击事件失败', error)
         e.preventDefault()
         e.stopPropagation()
       }

  }

  if (element?.property?.olul_obj?.olul_type) {
  const headingLevel = HEADING_LEVEL_MAP[element.block_type_string] || 1
  const baseSize = Math.max(26 - (headingLevel - 1) * 2, 16)
  const styleList = {
  ...baseStyle,
  borderRadius: '5px',
  textAlign,
  marginTop: `${baseSize}px`,
  marginBottom: `8px`
  }
  const componentStyle = {
  marginBlockStart: 9 - headingLevel + 'px',
  minWidth: 10,
  marginBlockEnd: 2
  }

       return (
         <div
           className={getOlUlDomClass(element)}
           style={styleList}
           onPointerDown={onPointerDown}
         >
           <ZeroWidthSpace />
           <span contentEditable={false} className={styles['app-paragraph-prefix']}>
             <PrefixOlUlList element={element} editor={editor} readonly={readonly} />
           </span>
           <Component
             {...attributes}
             id={element.block_id}
             data-slate-id={element.block_id}
             hasContent={hasHeadingContent(element)}
             style={componentStyle}
             isOrdered={true} // 添加这个prop来标识有序标题
           >
             <span className={styles['app-paragraph-content']}>{children}</span>
           </Component>
         </div>
       )

  } else {
  return (
  <Component
  {...attributes}
  style={style}
  textAlign={textAlign}
  id={element.block_id}
  data-slate-id={element.block_id}
  hasContent={hasHeadingContent(element)}
  className={styles['app-heading']}
  onPointerDown={onPointerDown}
  // tabIndex={0} // 添加 tabIndex 属性，使组件可聚焦 (不可用，导致聚焦问题，点击两次后，输入中文会删除父节点) >
  {children}
  </Component>
  )
  }
  } catch (error) {
  console.error('Heading render error:', error)
  return children
  }
  }
  })

import style from './style.module.less'
import { Editor, Node, Transforms, Range, Path } from 'slate'
import { CommandFn } from '@/utils/slate-command'
import { EDITOR_ELEMENT_TYPE, ElementPlugin } from '@/constant/interfaces'
import { isObject } from '@/utils/data-type'
import { insertEmptyParagraph } from '@/utils/slate-set-node'
import { ELTYPE, ELTYPE_NUM, TO_EDITOR_MODE } from '@/constant/enums/eltype'
import { getElementStyle } from '@/utils/getStyle'
import { CommandType } from '@/constant/enums/command'
import { v4 } from 'uuid'
import { sleep } from '@/utils/sleep'
import { focusSelection } from '@/utils/slate-handle-type'
import { PrefixOlUlList } from '../common/olulList'
import { getOlUlDomClass } from '../common/olulList/utils'
import { olulListToOther } from '@/utils/slate-olul/index'
import { LazyBlock } from '@/components/LazyLoading'
import { ReactEditor } from 'slate-react'
import { isNeedVirtualScroll } from '@/components/LazyLoading/utils/lazy-render'
import ZeroWidthSpace from '@/components/zeroWidthSpace'
import { isContentEditable } from '@/utils/sor/utils'
import store from '@/store'
import { paragraphLeavesFromCodeBlockProperty } from '@/plugins/code-block/utils/codeTransform'

/**

- 段落渲染组件
- @param context 段落上下文
- @param editor 编辑器
- @param readonly 是否只读
- @returns 段落渲染组件
  */
  const ParagraphLine = (context: any, editor: Editor, readonly: boolean) => {
  const { children, element, attributes } = context || {};

try {
// 元素属性
const elementAttrs = {
...attributes,
style: getElementStyle(element),
['data-slate-id']: element?.block_id
} as React.HTMLAttributes<HTMLDivElement>

    // 处理对齐样式
    const align = Number(element?.style?.align) || 1;
    switch (align) {
      case 2:
        elementAttrs.style.textAlign = 'center';
        break;
      case 3:
        elementAttrs.style.textAlign = 'right';
        break;
      default:
        elementAttrs.style.textAlign = 'left';
    }

    // 处理列表前缀
    const hasListType = !!element?.property?.olul_obj?.olul_type
    // 前缀具体类型，用来设置类名用
    const listType = element?.property?.olul_obj?.olul_type;
    let contentClassName = '';
    if (listType === ELTYPE.OLLIST) {
      contentClassName = style['app-ollist-content'];
    } else if (listType === ELTYPE.ULLIST) {
      contentClassName = style['app-ullist-content'];
    }


    // 段落主体样式
    const containerClass = hasListType
      ? getOlUlDomClass(element)
      : style['app-paragraph']

    // 当前段落是否含有内容
    const hasContent =
      element?.children?.length > 0 &&
      element?.children?.[0]?.text?.length > 0 &&
      element?.children?.[0]?.text.trim() !== '' ? true : false

    // 判断是否需要虚拟滚动
    const isLazyLoading = isNeedVirtualScroll(editor, element, hasContent, { elementType: ELTYPE.PARAGRAPH })

    const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
      try {
        // 如果是只读模式，不处理
        if (readonly) return

        const isSorOperationMode = store.getState()?.editor?.isSorOperationMode
        // 只针对实例文档下处理
        if (isSorOperationMode) {
          // 判断段落是否来自文档大标题
          let isFromArticleTitle = false
          const elementPath = ReactEditor.findPath(editor as unknown as ReactEditor, element)
          if (elementPath && elementPath.length === 2) {
            const articleTitleEntry = Editor.above(editor, {
              at: elementPath,
              match: (n: any) => n.block_type_string === ELTYPE.ARTICLE_TITLE
            })
            isFromArticleTitle = !!articleTitleEntry
          }

          // 如果段落来自文档大标题，不阻止原生事件
          if (isFromArticleTitle) return

          // 如果点击的元素是来自 sor 节点，则不阻止默认行为
          const isSorContainer = (e.target as HTMLElement).closest('[data-sor-container="true"]')
          const isEditable = isContentEditable(element)
          if (!isEditable && !isSorContainer){
            e.preventDefault()
            e.stopPropagation()
            ReactEditor.blur(editor as any)
            Transforms.deselect(editor)
            return
          }
        }
      } catch (error) {
        console.error('[ParagraphPlugin onPointerDown]: 段落点击事件失败', error)
        e.preventDefault()
        e.stopPropagation()
      }
    }

    return (
      <LazyBlock
        editor={editor}
        element={context.element}
        loadingType={ELTYPE.PARAGRAPH}
        isLazyLoading={isLazyLoading}
        isOlUlListBlock={hasListType}
      >
        <div
          {...elementAttrs}
          className={containerClass}
          onMouseDown={onMouseDown}
        >

          {/* 是否渲染列表前缀 */}
          {hasListType && (
            <>
              <ZeroWidthSpace />
              <span contentEditable={false} className={style['app-paragraph-prefix']}>
                <PrefixOlUlList element={element} editor={editor} readonly={readonly} />
              </span>
            </>
          )}

          {/* 渲染内容 */}
          <span className={contentClassName}>
            {children}
          </span>
        </div>
      </LazyBlock>
    );

} catch (error) {
console.error('[ParagraphPlugin RenderLine]: 段落渲染失败', error)
return <div>{children}</div>
}
}

/**

- 处理更新命令逻辑
- @param editor 编辑器实例
- @param data 命令数据
  */
  const handleUpdateCommand = async (editor: Editor, data) => {
  // 25-2-27 修改 -- slate-commands 会组装成数组pathArr 一个一个调用Command，所以这里需要判断path是否存在
  const currentNode = Node.getIf(editor, data.path)
  if (!currentNode) {
  console.error(`[paragraph command]: 未找到节点 | path: ${JSON.stringify(data.path)}`)
  return
  }

// 处理代码块转换为段落
// @ts-ignore
if (currentNode.block_type === ELTYPE_NUM.CODE_BLOCK) {
try {
// 将代码块的代码高亮片段转换为段落节点
const leaves = paragraphLeavesFromCodeBlockProperty(currentNode as any) as any[]

      Editor.withoutNormalizing(editor, () => {
        const parentPath = Path.parent(data.path)
        Transforms.removeNodes(editor, { at: parentPath })
        Transforms.insertNodes(
          editor,
          {
            block_id: v4(),
            block_type: ELTYPE_NUM.PARAGRAPH,
            block_type_string: ELTYPE.PARAGRAPH,
            style: {
              align: 1,
              folded: false,
              done: false,
              indent: 0
            },
            children:
              leaves?.length > 0
                ? leaves
                : [
                    {
                      // @ts-ignore
                      text: currentNode?.property?.content || ''
                    }
                  ]
          } as any,
          { at: parentPath }
        )
      })
    } catch (error) {
      console.error('[paragraph command]: 转换代码块失败', error)
    }
    return

}

// 处理列表转换为段落
const isConverted = olulListToOther({
editor,
path: data.path,
block_type: ELTYPE_NUM.PARAGRAPH,
block_type_string: ELTYPE.PARAGRAPH,
element: currentNode,
floatMd: data?.floatMd ?? false
})

if (isConverted) return

// 普通段落更新
try {
Transforms.setNodes(
editor,
{
...currentNode,
block_id: v4(),
block_type: ELTYPE_NUM.PARAGRAPH,
block_type_string: ELTYPE.PARAGRAPH
},
{ at: data.path }
)

    await sleep(10)
    focusSelection(editor, data.path)

} catch (error) {
console.error('[paragraph command]: 设置段落节点失败', error)
}
}

/**

- 处理添加命令逻辑
- @param editor 编辑器实例
- @param data 命令数据
  */
  const handleAddCommand = (editor: Editor, data) => {
  insertEmptyParagraph(editor, data.path)
  }

/**

- 段落命令处理主函数
- @param editor 编辑器实例
- @param key 命令类型
- @param data 命令数据
  */
  const command: CommandFn = async (editor, key, data) => {
  if (!isObject(data) || !data.path || !Array.isArray(data.path)) {
  return
  }

try {
switch (data.commandType) {
case CommandType.UPDATE:
await handleUpdateCommand(editor, data)
break
case CommandType.ADD:
case CommandType.ADD_ABOVE:
handleAddCommand(editor, data)
break
default:
console.warn(`[paragraph command]: 未处理的命令类型 | type: ${data.commandType}`)
}
} catch (error) {
console.error(`[paragraph command]: 段落命令执行失败 | type: ${data.commandType}`, error)
}
}

/**

- 段落插件
- @param editor 编辑器实例
- @param readonly 是否只读
- @returns 段落插件
  */
  export const ParagraphPlugin = (editor?: Editor, readonly?: boolean): ElementPlugin => {
  return {
  key: ELTYPE.PARAGRAPH,
  type: EDITOR_ELEMENT_TYPE.BLOCK,
  MatchLine: context => {
  return context?.element?.block_type_string === ELTYPE.PARAGRAPH
  },
  RenderLine: (context) => {
  // 当上层未传 readonly 时，使用全局编辑模式判断只读
  const editMode = store.getState()?.editor?.docConfig?.editMode
  const effectiveReadonly = readonly || editMode === TO_EDITOR_MODE.read
  return ParagraphLine(context, editor, effectiveReadonly)
  },
  command: (editor, key, data) => {
  command(editor, key, data)
  }
  }
  }

import { useCallback, useRef, useState, useMemo, CSSProperties } from 'react'
import styled from '@emotion/styled'
import { ELTYPE, OL_UL_LIST_ITEM, SOURCE_TYPE } from '@/constant/enums/eltype'
// import { convertNumber } from './utils'
import { message, Tooltip } from 'antd'
import style from './style.module.less'
import { IOLULATTR } from '@/constant/interfaces/olul'
import {
btnOlChangeNumber,
btnOlContinue,
btnOlHNewList,
btnOlNewList,
convertHtitle,
convertNumber,
convertUlprefix,
getOlSettingMessage
} from '@/utils/slate-olul/index'
import { OlListOptionModal } from './ui/OlListOptionModal'
import { milog } from '@/utils/milog'
import { sleep } from '@/utils/sleep'
import { getImportantLevel, getOlUlListById } from '@/utils/slate-olul/utils'
import { useTranslation } from 'react-i18next'
import { ReactEditor } from 'slate-react'
import { Node, Path } from 'slate'
import { AdvancedRenderElement } from '@/constant/interfaces'
import { settingEditorBlur } from '@/utils/slate-blur'
import { useSelector } from 'react-redux'
import { isInSyncBlock } from '@/utils/slate-sync-block'

const UlIcon = styled.span`  margin: 10px 6px 10px 0px;
  font-size: 26px;
  color: #1456f0;
  /* 禁止选中文本 */
  user-select: none;
  /* 禁止拖放 */
  -webkit-user-drag: none; /* Safari */
  user-drag: none;
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0); /* iOS Safari */
  -webkit-highlight: none; /* Chrome, Safari, Opera */`

const OLIcon = styled.span`  margin: 10px 6px 10px 0px;
  font-size: 16px;
  color: #1456f0;
  /* 禁止选中文本 */
  user-select: none;
  /* 禁止拖放 */
  -webkit-user-drag: none; /* Safari */
  user-drag: none;
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0); /* iOS Safari */
  -webkit-highlight: none; /* Chrome, Safari, Opera */`

/**

- 检测是否是顶层分栏，是的话要单独处理
- @param editor
- @param node
- @param path
- @returns
  */
  const isTopColumns = (editor, node,path,highlightPath) => {
  try {
  if (node?.block_type_string === ELTYPE.COLUMNS_CELL) {
  const parentPath = Path.parent(Path.parent(path))
  // 除第一个元素，其他需要单独处理
  if (parentPath?.length === 1) {
  // 高亮块位置计算
  const last = highlightPath.slice(-3)
  if (last[0] !== 0) {
  return true
  }
  }
  }
  return false
  } catch (error) {
  console.log(error)
  return false
  }
  }

/**

- 高亮块位置计算
- 场景：如果在表格和分栏中要单独适配
- @param editor
- @param path
- @returns
  */
  const highlightPostion = (editor, path) => {
  try {
  let _path = Path.next(path)
  let previous = [-1]
  while (_path) {
  const node = Node.getIf(editor, _path) as AdvancedRenderElement
  if (
  node?.block_type_string === ELTYPE.TABLE_CELL ||
  node?.block_type_string === ELTYPE.COLUMNS_CELL
  ) {
  const tag = isTopColumns(editor, node, _path,Path.parent(path))
  if (tag) return false
  return true
  } else {
  previous = _path
  _path = Path.parent(_path)
  }
  }
  } catch (error) {
  return false
  }
  }

/**

- 分栏额外处理
- @param editor
- @param path
- @returns
  */
  const columnPostion = (editor, path) => {
  try {

  const parentPath = Path.parent(Path.parent(path))
  if (parentPath?.length > 1) {
  // 特殊场景处理：分栏在表格中且不是第一个元素
  const columnPath = Path.parent(parentPath)
  const last = columnPath[columnPath.length - 1]
  const childrenPosition = path[path.length - 1]
  if ( last > 0 && childrenPosition > 0 ) {
  return false
  }

  }

  let _path = Path.next(path)
  let previous = [-1]
  while (_path) {
  const node = Node.getIf(editor, _path) as AdvancedRenderElement
  if (node?.block_type_string === ELTYPE.TABLE_CELL) {
  return true
  } else {
  previous = _path
  _path = Path.parent(_path)
  }
  }
  } catch (error) {
  return false
  }
  }

const getParent = (editor, element) => {
try {
const path = ReactEditor.findPath(editor, element) ?? null

    const parent = path ? (Node.getIf(editor, Path.parent(path)) as AdvancedRenderElement) : null
    return { path, parent }

} catch (error) {
return { path: null, parent: null }
}
}

const getSpecialCell = parentType => {
return parentType === ELTYPE.TABLE_CELL || parentType === ELTYPE.COLUMNS_CELL
}

/**

- 是否是分栏和表格中第一个元素节点
  */
  const isSpecialCellFirstChild = (editor, element) => {
  try {
  const { path, parent } = getParent(editor, element)
  if (!parent) return false
  const parentType = parent?.block_type_string
  const isSpecialCell = getSpecialCell(parentType)
  if (parentType === ELTYPE.HIGHLIGHT_ICON) {
  const tag = highlightPostion(editor, path)
  if (tag) return true
  }
  if (parentType === ELTYPE.COLUMNS_CELL) {
  const tag = columnPostion(editor, path)
  if (tag) return true
  }

  if (!isSpecialCell) return false

  // 检查当前节点是否是父节点的第一个子节点
  const parentPath = Path.parent(path)
  const children = Node.children(editor, parentPath)
  const firstChild = children?.next?.()?.value
  return firstChild && Path.equals(firstChild?.[1], path)
  } catch (error) {
  return false
  }
  }

const Content = props => {
const { element, editor, isOl = true, readonly } = props
const [saveId, setSaveId] = useState('')
const { t } = useTranslation()
// 是否是 sor 实例模式文档
const isSorOperationMode = useSelector((state: any) => state.editor?.isSorOperationMode)

// 实例文档下：类模板段落或位于同步块内时，禁用有序列表序号点击与设置弹层
const shouldLockOlPrefix = useMemo(() => {
try {
if (!isSorOperationMode) return false
if (element?.property?.source === SOURCE_TYPE.CLASS_TEMPLATE) return true

      const path = ReactEditor.findPath(editor, element)
      return isInSyncBlock(editor, path)
    } catch {
      return false
    }

}, [isSorOperationMode, editor, element])

// 类模板列表前缀区：禁止选中文本
const prefixClassTemplateDomLock = shouldLockOlPrefix
? ({
userSelect: 'none',
WebkitUserSelect: 'none',
MozUserSelect: 'none',
msUserSelect: 'none'
} as CSSProperties)
: undefined

/**

- 设置编号
  */
  const setNumberFun = useCallback(
  async (e) => {
  e.stopPropagation()
  e.preventDefault()
  const rect = itemRef?.current?.getBoundingClientRect()
  const viewportHeight = window.innerHeight
  const elementBottom = rect.bottom
  const distance = viewportHeight - elementBottom
  if (distance < 150) {
  setPostion({ x: rect.right, y: rect.top - 116 })
  } else {
  setPostion({ x: rect.right, y: rect.bottom - 6 })
  }

  const messageOption = getOlSettingMessage(editor, element)

  // 如果是普通有序列表

  if (element.block_type_string === ELTYPE.PARAGRAPH) {
  setDisabledOptions({
  continue: messageOption.isContinue,
  newList: !messageOption.isFirstNumber
  })
  } else {
  const match = getOlUlListById(editor, element?.property?.olul_obj?.olul_list_id)
  // 存在更高级的H标题，这样就可以设置当前等级重新设置有序标题列表
  const hasImportant = getImportantLevel(match, element.block_type)
  setDisabledOptions({
  continue: messageOption.isContinue,
  newList: !messageOption.isFirstNumber || hasImportant,
  hasImportant
  })
  }

  if (messageOption?.id) {
  setSaveId(messageOption.id)
  } else {
  setSaveId('')
  }
  // 为了避免错误触发需要延时等待
  await sleep(20)
  setVisible(true)
  settingEditorBlur(editor)
  },
  [editor, element]
  )

/**

- 关闭弹窗
- 同时清空选区，避免受到快捷键干扰
  */
  const onClose = useCallback(() => {
  setVisible(false)
  settingEditorBlur(editor)
  }, [editor])

/**

- 继续之前的有序列表编号
  */
  const onContinue = useCallback(() => {
  btnOlContinue(editor, element, saveId)
  onClose()
  }, [editor, element, saveId])

/**

- 重新开始一个新的有序列表编号
  */
  const onNewList = useCallback(() => {
  let hasImportant = false
  if (element.block_type_string !== ELTYPE.PARAGRAPH) {
  const match = getOlUlListById(editor, element?.property?.olul_obj?.olul_list_id)
  hasImportant = getImportantLevel(match, element.block_type)
  }
  if (!hasImportant) {
  btnOlNewList(editor, element)
  onClose()
  }
  }, [element, editor])

/**

- 重新开始一个标题的有序列表编号
  */
  const onNewListH = useCallback(
  tag => {
  btnOlHNewList(editor, element, tag)
  onClose()
  },
  [element, editor]
  )

/**

- 修改当前有序列表编号
  */
  const onModifyNumber = useCallback(
  value => {
  btnOlChangeNumber(editor, element, value)
  onClose()
  },
  [editor, element]
  )
  const onHtitle = useCallback(() => {
  const listId = element?.property?.olul_obj?.olul_list_id
  const match = getOlUlListById(editor, listId)
  }, [editor, element])

const [visible, setVisible] = useState(false)

const itemRef = useRef()
const [position, setPostion] = useState({ x: 0, y: 0 })
const [disabledOptions, setDisabledOptions] = useState<any>({
continue: true,
newList: true
})
const shouldSkipPositionClass = isSpecialCellFirstChild(editor, element)

return (
<>
<Tooltip
title={
// 优化选中时会对tooltip造成影响
isOl && !readonly && !shouldLockOlPrefix ? (
<span
style={{
                userSelect: 'none',
                WebkitUserSelect: 'none', // Safari
                MozUserSelect: 'none', // Firefox
                msUserSelect: 'none' // IE/Edge
              }} >
{t('setthenumber')}
</span>
) : (
''
)
}
placement='top'
// getPopupContainer={trigger => trigger.parentElement}
getPopupContainer={() => document.body} >
<span
style={prefixClassTemplateDomLock}
onPointerDown={isOl && !shouldLockOlPrefix ? setNumberFun : (e) => {
e.stopPropagation()
e.preventDefault()
}}
data-slate-void
className={`${style.prefixnumber}${
            !isOl
              ? ` ${style.ulClass}`
              : shouldSkipPositionClass
              ? ` ${style[`prefixol-other-${element.block_type}`]}`              :` ${style[`prefixol-${element.block_type}`]}`
}`}
          ref={itemRef}
        >
          <span
            data-slate-spacer
            className={`${style[`prefixolul-${element.block_type}`]}`}
style={prefixClassTemplateDomLock} >
{props.children}
</span>
</span>
</Tooltip>
{visible && !readonly && !shouldLockOlPrefix && (
<OlListOptionModal
{...{
visible,
position,
offset: { x: 10, y: 10 },
onClose,
onContinue,
onNewList,
onNewListH,
onHtitle,
onModifyNumber,
disabledOptions,
defaultValue: element?.property?.olul_obj?.olul_prefix_no ?? 1,
element
}}
/>
)}
</>
)
}

// 增加判断类型：
// - 如果当前的父级是段落
// - 如果当前的父级是H标题
export const PrefixOlUlList = ({ element, editor, readonly }) => {
const block_type_string = element.block_type_string
const indent = element?.style?.indent ?? 0
const olul_obj = element?.property?.olul_obj as IOLULATTR
if (olul_obj?.olul_type === ELTYPE.ULLIST) {
if (block_type_string === ELTYPE.PARAGRAPH) {
return (
<Content {...{ element, editor, isOl: false }} readonly={readonly}>
{convertUlprefix(indent)}
</Content>
)
} else {
return <></>
}
} else {
if (block_type_string === ELTYPE.PARAGRAPH) {
return (
<Content {...{ element, editor }} readonly={readonly}>
{convertNumber(indent, olul_obj.olul_prefix_no, olul_obj.olul_type)}
</Content>
)
} else {
return (
<Content {...{ element, editor }} readonly={readonly}>
{convertHtitle(olul_obj)}
</Content>
)
}
}
}

import { useState, useEffect, useRef, CSSProperties, useCallback } from 'react'
import styles from './ListOptionModal.module.less'
import { ContinueIcon } from './ContinueIcon'
import { NewListIcon } from './NewListIcon'
import { ModifyIcon } from './ModifyIcon'
import ReactDOM from 'react-dom'
import { useClickAway } from 'ahooks'
import { sleep } from '@/utils/sleep'
import { InputNumber, message } from 'antd'
import { milog } from '@/utils/milog'
import { MAX_OL_NUMBER } from '@/utils/slate-olul/utils'
import { useTranslation } from 'react-i18next'
import { ELTYPE } from '@/constant/enums/eltype'
import { AdvancedRenderElement } from '@/constant/interfaces'
import { getSearchObjFromUrl } from '@/utils/url-parse'
import { RightOutlined } from '@ant-design/icons'

interface Position {
x: number
y: number
}

interface ListOptionModalProps {
visible: boolean
position?: Position
offset?: { x: number; y: number }
width?: number
defaultValue?: number
onClose: () => void
onHtitle: () => void
onContinue: () => void
onNewList: () => void
onNewListH: (val: boolean) => void
onModifyNumber: (val: number) => void // 修改为接受新编号参数
element: AdvancedRenderElement
disabledOptions?: {
continue: boolean
newList: boolean
hasImportant?: boolean
}
}

const PortalComponent = ({ isVisible, children,onBackdropPointerDown }) => {
return isVisible
? ReactDOM.createPortal(
<div
onPointerDown={e => {
// 只有点到最外层透明区域才关闭
if (e.target === e.currentTarget) {
onBackdropPointerDown?.()
}
}}
style={{
            position: 'fixed',
            inset: 0,
            width: '100%',
            height: '100%',
            zIndex: '10000',
            background: 'transparent'
          }} >
{children}
</div>,
document.body
)
: null
}

export const OlListOptionModal = ({
visible,
position = { x: 0, y: 0 },
offset = { x: 10, y: 10 },
onClose,
onContinue,
onNewList,
onNewListH,
onModifyNumber,
onHtitle,
element,
defaultValue = 1,
disabledOptions = {
continue: true,
newList: true
}
}: ListOptionModalProps) => {
const { t } = useTranslation()
const wrapperRef = useRef<HTMLDivElement>(null)
const inputRef = useRef<HTMLInputElement>(null)
const [adjustedPosition, setAdjustedPosition] = useState<Position>(position)
const [showModifyInput, setShowModifyInput] = useState(false)
const [isH, setIsH] = useState(false)
const [hPrefix, setHPrefix] = useState('')
const closeRef = useRef(false)

const newNumber = useRef(defaultValue)

const [width, setWidth] = useState<number | 'auto'>(200)
const [isComposing, setIsComposing] = useState(false)

const [secondPop, setSecondPop] = useState(false)

const [secondPopValue, setSecondPopValue] = useState({
content1: '',
content2: ''
})

// 国际化，后续如果有其他语言，这里需要统一处理
useEffect(() => {
const lang = getSearchObjFromUrl()?.lang ?? 'zh'
const first = `<span style='color:#1456f0;padding:0 4px'>1.</span>`
const second = `<span style='color:#1456f0;padding:0 4px'>${element?.property?.olul_obj?.olul_prefix_no_string}.1</span>`
switch (lang) {
case 'zh':
setSecondPopValue({
content1: `从${first}开始`,
content2: `从${second}开始`
})
break
case 'en':
setSecondPopValue({
content1: `Start at${first}`,
content2: `Start at${second}`
})
break
}
}, [element])

useEffect(() => {
if (showModifyInput && isH) {
setWidth('auto')
} else if (showModifyInput) {
setWidth(340)
} else {
setWidth(215)
}
}, [showModifyInput, isH])
// 定位计算
useEffect(() => {
if (visible && wrapperRef.current) {
const { width: modalWidth, height: modalHeight } = wrapperRef.current.getBoundingClientRect()
const viewportWidth = window.innerWidth
const viewportHeight = window.innerHeight

      let newX = position.x + offset.x
      let newY = position.y + offset.y

      // 智能边界处理
      if (newX + modalWidth > viewportWidth) {
        newX = position.x - modalWidth - offset.x
      }
      if (newY + modalHeight > viewportHeight) {
        newY = position.y - modalHeight - offset.y
      }

      setAdjustedPosition({
        x: Math.max(10, newX),
        y: Math.max(10, newY)
      })
    }

}, [visible, position, offset, width])

// 点击外部关闭弹窗
// useClickAway(() => {
// onClose()
// setIsH(false)
// setShowModifyInput(false)
// setHPrefix('')
// setSecondPop(false)
// }, [wrapperRef])

// 处理修改编号值点击
const handleModifyClick = useCallback(async () => {
onHtitle()
if (element?.block_type_string !== ELTYPE.PARAGRAPH) {
setIsH(true)
setHPrefix(element?.property?.olul_obj?.olul_prefix_no_string)
} else {
setIsH(false)
setHPrefix('')
}
await sleep(20)
setShowModifyInput(true)
}, [element])

// 处理确认修改
const handleConfirmModify = useCallback(() => {
if (!isNaN(newNumber.current) && newNumber.current > 0) {
if (newNumber.current !== defaultValue || newNumber.current > MAX_OL_NUMBER) {
onModifyNumber(newNumber.current > MAX_OL_NUMBER ? MAX_OL_NUMBER : newNumber.current)
}

      setShowModifyInput(false)
      setHPrefix('')
      setIsH(false)
      setSecondPop(false)
      onClose()
    } else {
      setShowModifyInput(false)
      setHPrefix('')
      setIsH(false)
      setSecondPop(false)
      onClose()
    }

}, [newNumber.current, onModifyNumber, onClose, defaultValue])

// 输入框自动聚焦
useEffect(() => {
if (showModifyInput && inputRef.current) {
inputRef.current.focus()
inputRef.current.select()
}
}, [showModifyInput])

useEffect(() => {}, [element, disabledOptions])

if (!visible) return null

return (
<PortalComponent
isVisible={visible}
onBackdropPointerDown={() => {
onClose()
setIsH(false)
setShowModifyInput(false)
setHPrefix('')
setSecondPop(false)
}}>
{/* 原始选项弹窗 _/}
{!showModifyInput && (
<div
ref={wrapperRef}
className={styles.popoverWrapper}
style={
{
'--popover-width': width === 'auto' ? 'auto' : `${width}px`,
left: `${adjustedPosition.x}px`,
top: `${adjustedPosition.y}px`
} as CSSProperties
} >
<div className={styles.menuItemWrapper}>
{/_ 继续编号 */}
<div
className={`${styles.menuItem} ${disabledOptions.continue ? '' : styles.disabled}`}
onClick={disabledOptions.continue ? onContinue : undefined} >
<ContinueIcon />
<span>{t('continuenumbering')}</span>
</div>

            {/* 新建列表 */}
            <div
              className={`${styles.menuItem} ${disabledOptions.newList ? '' : styles.disabled}`}
              onClick={disabledOptions.newList ? onNewList : undefined}
              onMouseEnter={() => {
                // 在这里控制右侧是否出现弹框
                if (disabledOptions?.hasImportant) {
                  setSecondPop(true)
                  closeRef.current = false
                } else {
                  setSecondPop(false)
                }
              }}
              onMouseLeave={async () => {
                await sleep(300)
                if (closeRef.current) {
                  closeRef.current = false
                } else {
                  setSecondPop(false)
                }
              }}
            >
              <NewListIcon />
              <span className={styles.content}>{t('startanewlist')}</span>
              {secondPop && <RightOutlined className={styles.rightIcon} />}
              {secondPop && (
                <div
                  className={styles.newListOption}
                  onMouseEnter={() => {
                    closeRef.current = true
                  }}
                  onMouseLeave={() => {
                    closeRef.current = false
                  }}
                >
                  <div
                    className={styles.menuItem}
                    dangerouslySetInnerHTML={{ __html: secondPopValue.content1 }}
                    onClick={() => {
                      onNewListH(true)
                    }}
                  ></div>
                  <div
                    className={`${styles.menuItem} ${
                      element?.property?.olul_obj?.olul_prefix_no > 1 ? '' : styles.disabled
                    }`}
                    dangerouslySetInnerHTML={{ __html: secondPopValue.content2 }}
                    onClick={() => {
                      onNewListH(false)
                    }}
                  ></div>
                </div>
              )}
            </div>

            {/* 修改编号 */}
            <div className={`${styles.menuItem}`} onClick={handleModifyClick}>
              <ModifyIcon />
              <span>{t('restartnumbering')}</span>
            </div>
          </div>
        </div>
      )}

      {/* 修改编号输入弹窗 */}
      {showModifyInput && (
        <div
          ref={wrapperRef}
          className={styles.modifyInputWrapper}
          style={
            {
              '--popover-width': `${width}px`,
              left: `${adjustedPosition.x}px`,
              top: `${adjustedPosition.y}px`
            } as CSSProperties
          }
        >
          <div className={styles.modifyInputContainer}>
            <span className={styles.modifyLabel}>{t('thenewnumberis')}</span>
            {hPrefix && <span className={styles.hPrefix}>{hPrefix}.</span>}
            <InputNumber
              ref={inputRef}
              min={1}
              // max={MAX_OL_NUMBER}
              precision={0}
              defaultValue={defaultValue}
              onChange={val => {
                // 只在非输入法组合状态下处理 onChange
                if (!isComposing) {
                  newNumber.current = val
                }
              }}
              formatter={value => `${value}`.replace(/[^\d]/g, '')}
              // parser={value => (value ? parseInt(value, 10) || 1 : 1)}
              className={styles.modifyInput}
              onKeyDown={e => {
                // 允许数字键、导航键和控制键
                const isNumber = /\d/.test(e.key)
                const isControl = e.ctrlKey || e.metaKey || e.altKey
                const isNavigation = [
                  'Backspace',
                  'Delete',
                  'ArrowLeft',
                  'ArrowRight',
                  'Tab',
                  'Enter',
                  'Escape'
                ].includes(e.key)

                if (!(isNumber || isControl || isNavigation)) {
                  e.preventDefault()
                }
              }}
              onPaste={e => {
                // 阻止非数字内容粘贴
                const clipboardData = e.clipboardData || window.clipboardData
                const pastedText = clipboardData.getData('text')
                if (!/^\d+$/.test(pastedText)) {
                  e.preventDefault()
                }
              }}
              onCompositionStart={() => {
                // 标记输入法开始
                setIsComposing(true)
              }}
              onCompositionEnd={e => {
                // 标记输入法结束并处理输入内容
                setIsComposing(false)
                const value = e.target.value.replace(/[^\d]/g, '')
                // 手动触发 onChange
                e.target.value = value
                if (value) {
                  newNumber.current = parseInt(value, 10)
                }
              }}
              onPressEnter={handleConfirmModify}
            />

            <button className={styles.confirmButton} onClick={handleConfirmModify}>
              {t('confirm')}
            </button>
          </div>
        </div>
      )}
    </PortalComponent>

)
}

import { Transforms, Node, Path, withoutNormalizing, Editor } from "slate"
import { getHistoryLength, getOlListIndex, getOlUlListById, getOlUlListCurrentNo, IH_OLLIST_OPTION } from "./utils"
import { v4 } from 'uuid'
import { ELTYPE, ELTYPE_NUM } from "@/constant/enums/eltype"
import { getPreviousPath } from "../slate-get-node"
import { IOLULATTR } from "@/constant/interfaces/olul"
import { AdvancedRenderElement } from "@/constant/interfaces"
import { olulListSort } from "./sort"

/**

- 添加或者更新H标题的有序列表
- @param params
- @returns
  */
  export const addOrUpdateHList = (params: IH_OLLIST_OPTION) => {
  try {
  const { editor, element, path, value } = params
  const typeNumber = element?.block_type
  let oldHistory = getHistoryLength(editor)
  // 可能的列表id
  let listId = ''

       let saveMessage = {
           hasPrevious: false,
           path: []
       }



       // 再判断下方相邻，如果有再判断上方是否也有不相邻的同类型列表，如果有的话，则融入其中,没有的话开始新的列表
       // 需要注意iscustom的处理

       // 如果都没适配，再判断是否上方存在列表，序号相邻则直接合并，不相邻的话则开启新的列表

       // 如果上方列表能合并，再判断下方列表是否能合并，能的话则合并

       // 如果上方合并不了，则只判断能否加入下方，此时需要注意iscustom

       // 先判断上方相邻 如果有就合并
       let obj = checkPreviousHNode({
           editor,
           path,
           defaultValue: value,
           element,
           saveMessage
       })

       listId = obj.id
       // 这里考虑是否插在列表中间，中间就直接返回了，不是的话则继续往下走
       if (obj?.isStop) {
           olulListSort([listId], editor, oldHistory)
           return true
       }

       // 判断下方相邻，处理后续节点
       listId = checkNextHNode({
           editor,
           path,
           element,
           value,
           message: obj
       })


       // 若不存在listId，则创建一个新的列表
       if (!listId) {
           let id = v4()
           if (saveMessage?.hasPrevious) {
               const node = Node.getIf(editor, saveMessage?.path) as AdvancedRenderElement;
               id = node?.property?.olul_obj?.olul_list_id ?? id;

           }
           if (!element.block_type_string) {
               console.error('节点数据不符合规范，无法添加有序列表')
               return
           }
           Transforms.setNodes(editor, {
               block_type: ELTYPE_NUM[element.block_type_string],
               property: {
                   olul_obj: {
                       olul_type: ELTYPE.OLLIST,
                       olul_is_custom: true,
                       olul_list_id: id,
                       olul_prefix_no: value,
                       olul_prefix_no_string: ''

                   }
               }
           } as any, { at: path });
           olulListSort([id], editor, oldHistory - 1)
       } else {
           olulListSort([listId], editor, oldHistory - 1)
       }


       return true

  } catch (error) {
  console.log(error)
  return false
  }
  }

const checkPreviousHNode = (params) => {

    try {
        const { editor, path, defaultValue, element, saveMessage } = params
        const previousPath = getPreviousPath(path);
        const block_type_string = element?.block_type_string;
        const block_type = element?.block_type;
        if (!previousPath) {
            return { id: '', isStop: false };
        }
        const result = previousLoop({
            path: path,
            editor,
            block_type,
            saveMessage
        })
        return result
    } catch (error) {
        console.log('[checkPreviousHNode]', error)
        return {
            id: '',
            isStop: false
        }
    }

}

/**

- 修改Id和自定义的编号
- @param param0
- @returns
  */
  const changeIdandCoustom = ({ editor, _node, _path, newId }) => {
  const match = getOlUlListById(editor, _node?.property?.olul_obj?.olul_list_id)
  if (!match?.length) return
  for (let i = 0; i < match.length; i++) {
  const [node, path] = match[i] as any
  Transforms.setNodes(editor, {
  property: {
  ...(_node?.property || {}),
  olul_obj: {
  ...(node?.property?.olul_obj || {}),
  olul_list_id: newId,
  olul_is_custom: false
  }
  }
  } as any, {
  at: path
  })
  // if (Path.equals(path, _path)) {
  // Transforms.setNodes(editor, {
  // property: {
  // ..._node?.property,
  // olul_obj: {
  // ...node?.property?.olul_obj,
  // olul_list_id: newId,
  // olul_is_custom: false
  // }
  // }
  // } as any, {
  // at: path
  // })
  // } else {
  // Transforms.setNodes(editor, {
  // property: {
  // ..._node?.property,
  // olul_obj: {
  // ...node?.property?.olul_obj,
  // olul_list_id: newId,
  // olul_is_custom: false
  // }
  // }
  // } as any, {
  // at: path
  // })
  // }

  }

}

/** *
*/
const handleNext = ({ editor, _node, _path, message, value, path }) => {
try {
if (message.id) {
const defaultValue = message.defaultValue
if (_node?.property?.olul_obj?.olul_prefix_no - defaultValue === 1) {
changeIdandCoustom({ editor, _node, _path, newId: message.id })
}
return message.id
} else {
if (value === -1) {
Transforms.setNodes(editor, {
property: {
...(_node?.property||{}),
olul_is_custom: true,
}
} as any, {
at: path
})
Transforms.setNodes(editor, {
property: {
...(_node?.property||{}),
olul_is_custom: false,
}
} as any, {
at: _path
})
} else {
Transforms.setNodes(editor, {
property: {
...(_node?.property||{}),
olul_is_custom: true,
olul_prefix_no: value,
}
} as any, {
at: path
})
}
return _node?.property?.olul_obj?.olul_list_id
}

    } catch (error) {
        return true
    }

}

/** *

- @param param0
  */
  const nextLoop = ({ path, editor, element, message, value }) => {
  try {
  let _path = Path.next(path);
  let _listId = message.id
  while (_path) {
  const _node = Node.getIf(editor, _path) as AdvancedRenderElement;
  if (!_node) break
  const _nodeType = _node?.block_type
  const _nodeTypeString = _node?.block_type_string
  const _nodeId = _node?.property?.olul_obj?.olul_list_id ?? ''
  if (_node?.property?.olul_obj?.olul_type === ELTYPE.OLLIST && _nodeTypeString !== ELTYPE.PARAGRAPH) {
  if (element?.block_type === _nodeType) {
  _listId = handleNext({ editor, _node, message, value, _path, path })
  break
  } else if (element?.block_type < _nodeType) {
  _path = Path.next(_path);
  if (!_path) break
  } else {
  break
  }
  } else {
  _path = Path.next(_path);
  if (!_path) break
  }
  }
  return _listId
  } catch (error) {
  return message.id
  }
  }

/** *

- @param params
  */
  const checkNextHNode = (params) => {
  try {
  const { editor, path, value, element, message } = params
  let listId = nextLoop({ path, editor, element, message, value })
  return listId
  } catch (error) {
  console.log(error)
  return ''
  }
  }

/**

- docbar连续编号操作
  */
  export const checkAddListForH = (params) => {
  try {
  const { editor, path, element } = params
  let saveMessage = {
  hasPrevious: false,
  path: []
  }
  // 循环查找，找到上一个节点，绑定上去
  let obj = opPreviousLoop({ ...params, saveMessage })

       if (obj?.isStop) {
           return {
               isSameList: true,
               id: obj.id,
               isShouldCoustom: false,
           }
       }

       let hasPreviousId = !!obj?.id

       let listId = checkNextHNode({ ...params, message: obj, value: -1 })
       if (listId) {
           return {
               isSameList: true,
               id: listId,
               isShouldCoustom: hasPreviousId ? false : true,
           }
       }


       if (!listId && saveMessage.hasPrevious) {
           const node = Node.getIf(editor, saveMessage.path) as AdvancedRenderElement;
           listId = node?.property?.olul_obj?.olul_list_id ?? '';
           return {
               isSameList: true,
               id: listId,
               isShouldCoustom: !!listId ? true : false,
           }
       }

       return {
           isSameList: false,
           id: '',
           isShouldCoustom: false,
       }

  } catch (error) {
  return {
  isSameList: false,
  id: '',
  isShouldCoustom: false,
  }
  }
  }

/**

- 通用处理前置节点
- @param params
- @returns
  */
  const commonPreviousLoop = (params: any, isOpVersion: boolean) => {
  const { editor, path, element, saveMessage, block_type: externalBlockType } = params;
  const actualBlockType = isOpVersion ? element.block_type : externalBlockType;

  let _path = getPreviousPath(path);
  let result: any = { id: '', isStop: false };

  while (_path) {
  const _node = Node.getIf(editor, _path) as AdvancedRenderElement;
  const _nodeType = _node?.block_type;
  const _nodeTypeString = _node?.block_type_string;
  const _nodeId = _node?.property?.olul_obj?.olul_list_id ?? '';

       if (_node?.property?.olul_obj?.olul_type === ELTYPE.OLLIST && _nodeTypeString !== ELTYPE.PARAGRAPH) {
           if (actualBlockType === _nodeType) {
               // 公共处理逻辑 - 合并列表
               const { value, isMiddle } = getOlUlListCurrentNo(
                   getOlUlListById(editor, _nodeId),
                   path
               );
               const option: IOLULATTR = {
                   olul_type: ELTYPE.OLLIST,
                   olul_is_custom: false,
                   olul_list_id: _nodeId,
                   olul_prefix_no: value,
               };

               option.olul_prefix_no_string = _node.property.olul_obj?.olul_prefix_no_string ?? '';
               Transforms.setNodes(editor, {
                   property: { olul_obj: option }
               } as any, { at: path });

               result.id = _nodeId;
               result.isStop = isMiddle;
               result.defaultValue = _node.property.olul_obj?.olul_prefix_no + 1;
               break;
           } else if (actualBlockType < _nodeType) {
               // 公共处理逻辑 - 当前位置的H节点 属于更靠前的等级
               saveMessage.hasPrevious = true;
               saveMessage.path = _path;
               _path = getPreviousPath(_path);
               if (!_path) break;
           } else {
               // 差异处理逻辑 - 当前位置的H节点 属于更靠后的等级
               if (isOpVersion) {
                   saveMessage.hasPrevious = true;
                   saveMessage.path = _path;
                   const { value, isMiddle } = getOlUlListCurrentNo(
                       getOlUlListById(editor, _nodeId),
                       path
                   );
                   result.isStop = isMiddle;
                   result.id = _nodeId;
                   result.defalueValue = 1
               }
               break;
           }
       } else {
           // 公共处理逻辑 - 非目标节点
           _path = getPreviousPath(_path);
           if (!_path) break;
       }

  }
  return result;
  }

/**

- H标题的其他操作 前置节点
- @param params
- @returns
  */
  const opPreviousLoop = (params) => {
  try {
  return commonPreviousLoop(params, true);
  } catch (error) {
  // 错误处理逻辑
  return { id: '', isStop: false };
  }
  }

/**

- H标题的输入数字的场景 前置节点
- @param params
- @returns
  */
  const previousLoop = (params) => {
  return commonPreviousLoop(params, false);
  }

import { ELTYPE, ELTYPE_NUM } from "@/constant/enums/eltype"
import { getOlListIndex, getOlUlListById, getOlUlListCurrentNo, getOlUlListSort, ICREATE_LIST_ITEM_OPTION, IDIRECTION_POSITION, inWrap, ISEARCH_LIST_OPTION, isValidListNumber, MAX_OL_NUMBER, removeDownCoustomPath, setOlUlStyle } from "./utils"
import { v4 } from 'uuid'
import { Transforms, Range, Node, Editor, Path, next } from "slate"
import { sleep } from "../sleep"
import { focusSelection } from "../slate-handle-type"
import { message } from "antd"
import { AdvancedRenderElement } from "@/constant/interfaces"
import { getPreviousPath } from "../slate-get-node"
import { IOLULATTR } from "@/constant/interfaces/olul"
import { olulListSort } from "./sort"
import { addOrUpdateHList } from "./add-h-list"
import { insertEmptyParagraph } from "../slate-set-node"

/**

- 新增一个有序无序的特殊段落或者H标题
- @param params
  */
  export const addEmptyOlUlList = async (params: ICREATE_LIST_ITEM_OPTION) => {
  try {
  const { editor, path, isFocus, currentNode, addPluginType, isCustom = false, newIndent = -1, isEnd = false } = params

       // 当下方插入的场景需要直接给段落的插件上赋值
       let isUpdate = !!currentNode
       // 当不存在的节点，需要补充olul特殊的属性才能实现
       let isAddOlUlList = !!addPluginType

       const indent = newIndent !== -1 ? newIndent : currentNode?.style.indent ?? 0

       const pOption = {
           block_id: v4(),
           block_type: isUpdate ? currentNode?.block_type : ELTYPE_NUM.PARAGRAPH,
           block_type_string: isUpdate ? currentNode?.block_type_string : ELTYPE.PARAGRAPH,
           style: {
               ...setOlUlStyle(currentNode,isEnd),
               indent,
           },
           property: {
               ...(currentNode?.property||{}),
               olul_obj: {
                   ...(currentNode?.property?.olul_obj||{}),
                   olul_is_custom: isCustom
               },
               ...(isAddOlUlList && {
                   olul_obj: {
                       olul_type: addPluginType,
                       olul_is_custom: isCustom,
                       olul_list_id: v4(),
                       olul_prefix_no: 1,
                   }
               })
           },
           children: [
               {
                   text: ''
               }
           ]
       }

       if (path) {
           Transforms.insertNodes(editor, pOption, {
               at: path
           })
           await sleep(10)
           isFocus && focusSelection(editor, path)
       } else {
           Transforms.insertNodes(editor, pOption, { at: [editor?.children?.length] })
       }

  } catch (error) {
  message.error(JSON.stringify(error?.message))
  }
  }

/**

- 有序列表调整编号
- @param editor
- @returns
  */
  export const adjustOlList = (editor): boolean => {
  try {
  const { selection } = editor;
  if (!selection || !Range.isCollapsed(selection)) return false;

       const [node, path] = Editor.node(editor, selection);
       const parentPath = Path.parent(path);
       const currentNode = Node.getIf(editor, parentPath) as any;
       const wrapNode = Node.getIf(editor, Path.parent(parentPath)) as any;

       // 条件1：已经是列表或标题则直接返回
       if (currentNode?.property?.olul_obj?.olul_type === ELTYPE.OLLIST || wrapNode?.block_type_string === ELTYPE.ARTICLE_TITLE) {
           return false;
       }

       // if (![ELTYPE.PARAGRAPH].includes(currentNode?.block_type_string)) {
       //     return false
       // }

       // 拦截todolist等快捷键内部使用
       if ([ELTYPE.TODO_LIST].includes(currentNode?.block_type_string)) {
           return false
       }


       // 条件2：未匹配到列表格式直接返回
       const textContent = Node.string(node);
       const listMatch = /^([1-9]\d*)\./.exec(textContent);
       if (!listMatch) return false;
       const deleteRange = {
           anchor: { path, offset: 0 },
           focus: selection?.focus
       };
       const contentToDelete = Editor.string(editor, deleteRange);
       // 再次校验，因为空格插入时触发了这个操作，无法判断某些场景如100.a这个a是要加的空格前还是后
       const isValid = isValidListNumber(contentToDelete)
       if(!isValid) return false
       // 删除匹配的列表标记
       Transforms.delete(editor, { at: deleteRange});

       // 处理核心逻辑
       return processListConversion(editor, {
           listMatch,
           parentPath,
           currentNode,
       });

  } catch (error) {
  return false;
  }
  };

/**

- 调整编号的实际操作
- @param editor
- @param params
- @returns
  */
  export const processListConversion = (editor, params: {
  listMatch: any,
  parentPath: Path,
  currentNode: any,
  isOl?: boolean,

}): boolean => {
let oldHistory = editor?.history?.undos?.length
const { listMatch, parentPath, currentNode, isOl = true } = params;

    let oldId = currentNode?.property?.olul_obj?.olul_list_id
    let value = parseInt(listMatch[1], 10);
    if (value > MAX_OL_NUMBER) value = MAX_OL_NUMBER;
    const block_type_string = currentNode?.block_type_string;

    const listType = isOl ? ELTYPE.OLLIST : ELTYPE.ULLIST;

    if (listType === ELTYPE.ULLIST && block_type_string !== ELTYPE.PARAGRAPH) {
        Transforms.setNodes(editor, {
            block_type_string: ELTYPE.PARAGRAPH,
            block_type: ELTYPE_NUM.PARAGRAPH,
        } as any, { at: parentPath });
    } else if (block_type_string !== ELTYPE.PARAGRAPH) {
        const tag = addOrUpdateHList({ editor, value, path: parentPath, element: currentNode })
        return true
    }


    let controlObj = {
        value: 0,
        direction: IDIRECTION_POSITION.OTHER
    }

    let giveNextId = '';




    const obj = checkPreviousNode({
        editor,
        parentPath,
        currentNode,
        listType,
        defalueValue: value,
        controlObj

    })
    giveNextId = obj.id
    if (obj.isStop) {
        olulListSort([giveNextId, oldId], editor, oldHistory)
        return
    }


    // 处理后续节点（完全保持原始逻辑）
    giveNextId = checkNextNode({
        editor,
        parentPath,
        currentNode,
        value,
        giveNextId,
        listType
    })


    if (!giveNextId) {
        // 查看如果当前节点是插在一个之前存在列表的中间，则需要自动归并
        const result = inOlListMiddle(editor, currentNode, parentPath, listType)
        if (result) return
    }


    // 当前相邻的兄弟节点如果不是列表的一部分，那么就往上和往下查找，如果找到一个indent和自己相同，对比数值是否连续，连续则合并成一个列表，不连续则不管
    if (!giveNextId) {
        giveNextId = notSibling(editor, currentNode, parentPath, value, listType, controlObj)
    }


    if (controlObj.direction === IDIRECTION_POSITION.UP) {
        otherScene({
            editor,
            path: parentPath,
            element: currentNode,
            listType,
            value: controlObj.value,
            giveNextId
        })
    }

    // 处理无兄弟节点的情况（完全保持原始逻辑）
    if (!giveNextId) {
        // 第一个节点，新列表，需要设置olul_is_custom为true
        Transforms.setNodes(editor, {
            property: {
                olul_obj: {
                    olul_type: listType,
                    olul_is_custom: true,
                    olul_list_id: v4(),
                    olul_prefix_no: value,
                }
            }
        } as any, { at: parentPath });
        olulListSort([oldId], editor, oldHistory - 1)
    } else {
        // 重排序
        olulListSort([giveNextId, oldId], editor, oldHistory)
    }

    const nextPath = Path.next(parentPath)
    const nextNode = Node.getIf(editor, nextPath) as AdvancedRenderElement
    if (!nextNode) {
        const result = inWrap(editor, parentPath)
        if (result) {
            return true
        }
        insertEmptyParagraph(editor, nextPath, false)
        setTimeout(() => {
            focusSelection(editor, parentPath, 'end')
        }, 10);
    }

    return true;

};

/**

- 非前后兄弟节点处理
- @param editor
- @param currentNode
- @param currentPath
- @param value
- @returns
  */
  const notSibling = (editor: any, currentNode: any, currentPath: number[], value: number, listType: ELTYPE.OLLIST | ELTYPE.ULLIST, controlObj?: any) => {

  try {

       // 当前相邻的兄弟节点如果不是列表的一部分，那么就往上和往下查找，如果找到一个indent和自己相同，对比数值是否连续，连续则合并成一个列表，不连续则不管


       const previousPath = getPreviousPath(currentPath)
       let _giveNextId = ''
       if (previousPath) {
           _giveNextId = searchOlULList({
               editor,
               path: currentPath,
               value,
               position: IDIRECTION_POSITION.UP,
               currentNode,
               listType,
               controlObj
           })
       }
       const nextPath = Path.next(currentPath)
       if (nextPath) {
           _giveNextId = searchOlULList({
               editor,
               path: currentPath,
               value,
               position: IDIRECTION_POSITION.DOWN,
               currentNode,
               giveNextId: _giveNextId,
               listType
           })
       }
       return _giveNextId

  } catch (error) {
  console.log('[notSibling]报错:', error)
  return ''
  }

}

// 辅助函数1：获取相邻节点路径
const getAdjacentPath = (isUP: boolean, path: Path): Path | null => {
return isUP ? getPreviousPath(path) : Path.next(path);
};

// 辅助函数2：检查节点是否匹配列表条件
const isMatchingListNode = (
node: any,
currentNode: any,
listType: string
): boolean => {
return (
node?.property?.olul_obj?.olul_type === listType &&
node?.block_type_string === currentNode?.block_type_string &&
node?.style?.indent === currentNode?.style?.indent
);
};

// 辅助函数3：检查编号是否匹配
const isNumberMatching = (
value: number,
siblingNode: any,
isUP: boolean
): boolean => {
const resultVal = isUP ? 1 : -1;
return value - Number(siblingNode?.property?.olul_obj?.olul_prefix_no) === resultVal;
};

const setCurrentNodeListProperty = (params) => {
const {
editor, listType, path, value, id, iscustom
} = params
Transforms.setNodes(editor, {
property: {
olul_obj: {
olul_type: listType,
olul_is_custom: iscustom,
olul_list_id: id,
olul_prefix_no: value,
}
}
} as any, { at: path });
}

// 辅助函数5：关闭自定义
const closeCoustom = (params) => {
const { editor, node, path } = params
Transforms.setNodes(editor, {
property: {
...(node?.property || {}),
olul_obj: {
...(node?.property?.olul_obj || {}),
olul_is_custom: false,
}
}
} as any, { at: path })
}

const resetListId = (params) => {
const { editor, path, node, id } = params
Transforms.setNodes(editor, {
property: {
olul_obj: {
...(node?.property?.olul_obj || {}),
olul_list_id: id,
}
}
} as any, { at: path });
}

const handleListProperty = ({
editor, _hasId, listType, path, value, _giveNextId, siblingNode, isUP, controlObj, _path
}) => {
if (_hasId) {
setCurrentNodeListProperty({ listType, path, value, id: _giveNextId, iscustom: false, editor })
const match = getOlUlListById(editor, siblingNode?.property?.olul_obj?.olul_list_id)
for (let i = 0; i < match.length; i++) {
const [node, path] = match[i] as any
resetListId({ editor, path, node, id: _giveNextId })
}
} else {
if (isUP) {
setCurrentNodeListProperty({ listType, path, value, id: siblingNode?.property?.olul_obj?.olul_list_id, iscustom: false, editor })
controlObj.direction = IDIRECTION_POSITION.UP
controlObj.value = value
} else {
setCurrentNodeListProperty({ listType, path, value, id: siblingNode?.property?.olul_obj?.olul_list_id, iscustom: true, editor })
closeCoustom({ editor, node: siblingNode, path: _path })
}
}
}

/**

- 辅助函数：判断是否应该停止循环
- @param isUP
- @param _path
- @returns
  */
  const shouldWhileStop = (isUP, _path) => {
  let tag = false
  let newPath = _path
  if (isUP) {
  const tempPath = getPreviousPath(_path)
  if (tempPath) {
  newPath = tempPath
  } else {
  tag = true

       }

  } else {
  newPath = Path.next(_path)
  }
  return {
  path: newPath,
  tag
  }
  }

const handleListPropertyWrap = ({ value, siblingNode, isUP, _giveNextId, editor, _hasId, listType, path, controlObj, _path }) => {
let giveNextId = _giveNextId
if (isNumberMatching(value, siblingNode, isUP)) {
giveNextId = !_giveNextId ? siblingNode?.property?.olul_obj?.olul_list_id : _giveNextId;
handleListProperty({ editor, _hasId, listType, path, value, _giveNextId, siblingNode, isUP, controlObj, _path })
}
return giveNextId
}

/**

- 寻找对应的节点：
- 1.  如果是向上查找，则需要找到一个indent和自己相同，对比数值是否连续，连续则合并成一个列表，不连续则不管
- 2.  如果是向下查找，则需要找到一个indent和自己相同，对比数值是否连续，连续则合并成一个列表，
- @param params
- @returns
  */
  const searchOlULList = (params: ISEARCH_LIST_OPTION) => {

  try {
  const { editor, path, currentNode, value, position, giveNextId = '', listType, controlObj } = params
  let isUP = position === IDIRECTION_POSITION.UP
  let _giveNextId = giveNextId
  let _hasId = !!giveNextId
  let _path = getAdjacentPath(isUP, path);
  while (_path) {
  const siblingNode = Node.getIf(editor, _path) as AdvancedRenderElement
  if (!siblingNode) break

           if (isMatchingListNode(siblingNode, currentNode, listType)) {
               _giveNextId = handleListPropertyWrap({ value, siblingNode, isUP, _giveNextId, editor, _hasId, listType, path, controlObj, _path })
               break
           } else if (siblingNode?.style?.indent < currentNode?.style?.indent && siblingNode?.property?.olul_obj?.olul_type === listType) {
               break
           } else {
               const result = shouldWhileStop(isUP, _path)
               if (result.tag) {
                   break
               } else {
                   _path = result.path
               }
           }

       }
       return _giveNextId

  } catch (error) {
  return ''
  }

}

/**

- 插入一个列表中间的场景：自动成为该列表的一部分
- @param editor
- @param element
- @param path
- @returns
  */
  const inOlListMiddle = (editor, element, path, listType) => {
  try {
  const previousPath = getPreviousPath(path)
  const block_type_string = element.block_type_string;

       if (previousPath) {
           let _path = previousPath
           while (_path) {
               const previousNode = Node.getIf(editor, _path) as AdvancedRenderElement
               if (previousNode?.property?.olul_obj?.olul_type === listType && previousNode?.block_type_string === block_type_string) {
                   if (previousNode?.style?.indent === element?.style?.indent) {
                       const previousId = previousNode?.property?.olul_obj?.olul_list_id

                       const match = getOlUlListById(editor, previousId)
                       const previousIndex = getOlListIndex(match, previousNode?.block_id)

                       const lastElementPosition = match[match.length - 1]?.[1].at(-1)

                       const currentPosition = path.at(-1)

                       if (lastElementPosition > currentPosition) {
                           Transforms.setNodes(editor, {
                               property: {
                                   olul_obj: {
                                       ...(previousNode?.property?.olul_obj||{}),
                                       olul_is_custom: false
                                   }
                               }
                           } as any, {
                               at: path
                           })

                           olulListSort([previousId], editor)
                           return true
                       } else {
                           return false
                       }


                   } else {
                       const _previousPath = getPreviousPath(_path)
                       if (_previousPath) {
                           _path = _previousPath
                       } else {
                           break
                       }
                   }
               } else {
                   const _previousPath = getPreviousPath(_path)
                   if (_previousPath) {
                       _path = _previousPath
                   } else {
                       break
                   }
               }

           }
       }
       return false

  } catch (error) {
  console.log(error)
  return false
  }
  }

/**

- 其余场景补充
  */
  const otherScene = (params) => {
  try {
  const { editor, path, element, listType, value, giveNextId } = params;
  let _path = Path.next(path)
  let elemntIndent = element?.style?.indent ?? 0
  while (_path) {
  const _node = Node.getIf(editor, _path) as AdvancedRenderElement
  if (!_node) break
  if (_node.property?.olul_obj?.olul_type === listType) {
  if (_node?.style?.indent === elemntIndent) {
  if (_node.property?.olul_obj?.olul_prefix_no - value === 1) {
  Transforms.setNodes(editor, {
  property: {
  ..._node.property,
  olul_obj: {
  ..._node.property.olul_obj,
  olul_is_custom: false,
  olul_list_id: giveNextId,
  }
  }
  } as any, { at: _path })

                       // 更新剩下所有的id选项
                       const list = getOlUlListById(editor, _node.property.olul_obj.olul_list_id);
                       const currentIndex = getOlListIndex(list, _node.property.olul_obj.olul_list_id)

                       for (let i = currentIndex + 1; i < list.length; i++) {
                           Transforms.setNodes(editor, {
                               property: {
                                   ...(list?.[i]?.[0]?.property || {}),
                                   olul_obj: {
                                       ...(list?.[i]?.[0]?.property?.olul_obj || {}),
                                       olul_list_id: giveNextId,
                                   }
                               }
                           } as any, { at: list?.[i]?.[1] })
                       }
                       break
                   } else {
                       break
                   }
               } else if (_node?.style?.indent < elemntIndent) {
                   break
               } else {
                   _path = Path.next(_path)
                   if (!_path) break
               }
           } else {
               _path = Path.next(_path)
               if (!_path) break
           }
       }

  } catch (error) {
  console.log(error)
  }
  }

/**

- 处理相邻前序节点
- @param param0
- @returns
  */
  const checkPreviousNode = ({
  editor,
  parentPath,
  currentNode,
  listType,
  defalueValue,
  controlObj
  }) => {
  try {
  let _giveNextId = '';
  const previousPath = getPreviousPath(parentPath);
  const block_type_string = currentNode?.block_type_string;
  const isParagraph = ELTYPE.PARAGRAPH === block_type_string;
  let isStop = false;

       if (!previousPath) {
           return { id: '', isStop: false };
       }

       // 公共方法：向上查找符合条件的节点
       const findValidPreviousNode = (startPath: Path) => {
           let _path = startPath;
           while (_path) {
               const node = Node.getIf(editor, _path) as AdvancedRenderElement;
               if (node?.property?.olul_obj?.olul_type === listType && node?.block_type_string === block_type_string) {
                   return node;
               }
               _path = getPreviousPath(_path);
           }
           return null;
       };

       // 公共方法：设置列表属性
       const setOlProperty = (targetNode: AdvancedRenderElement, prefixNo: number, listId: string, isMiddle: boolean) => {
           isStop = isMiddle;
           const option: IOLULATTR = {
               olul_type: listType,
               olul_is_custom: false,
               olul_list_id: listId,
               olul_prefix_no: prefixNo,
           };

           if (!isParagraph) {
               option.olul_prefix_no_string = targetNode?.property?.olul_obj?.olul_prefix_no_string ?? '';
           }
           controlObj.direction = IDIRECTION_POSITION.UP
           controlObj.value = prefixNo;

           Transforms.setNodes(editor, {
               property: { olul_obj: option }
           } as any, { at: parentPath });
           return listId;
       };

       const previousNode = Node.getIf(editor, previousPath) as AdvancedRenderElement;
       const isIndentZero = currentNode?.style?.indent === 0;

       // 处理缩进为0的情况
       if (isIndentZero) {
           const isValidPrevious = previousNode?.property?.olul_obj?.olul_type === listType &&
               previousNode?.block_type_string === block_type_string;

           if (isValidPrevious) {
               const previousOl = previousNode?.property?.olul_obj as IOLULATTR;
               const { value, isMiddle } = getOlUlListCurrentNo(
                   getOlUlListById(editor, previousOl?.olul_list_id),
                   parentPath
               );
               _giveNextId = setOlProperty(previousNode, value, previousOl?.olul_list_id, isMiddle);
           } else {
               const foundNode = findValidPreviousNode(previousPath);
               if (foundNode) {
                   const foundOl = foundNode?.property?.olul_obj as IOLULATTR;
                   const { value, isMiddle } = getOlUlListCurrentNo(
                       getOlUlListById(editor, foundOl?.olul_list_id),
                       parentPath
                   );

                   if (isMiddle || value === defalueValue) {
                       _giveNextId = setOlProperty(foundNode, value, foundOl?.olul_list_id, isMiddle);
                   }
               }
           }
       }
       // 处理非0缩进的情况
       else if (previousNode?.property?.olul_obj?.olul_type === listType &&
           previousNode?.block_type_string === block_type_string) {

           const previousOl = previousNode?.property.olul_obj as IOLULATTR;
           _giveNextId = setOlProperty(
               previousNode,
               Number(previousOl.olul_prefix_no) + 1,
               previousOl.olul_list_id,
               false
           );
       }

       return { id: _giveNextId, isStop };

  } catch (error) {
  console.log(error);
  return { id: '', isStop: false };
  }
  };

/**

- 处理相邻后序节点
  */
  const checkNextNode = ({
  editor,
  parentPath,
  currentNode,
  giveNextId,
  value,
  listType
  }) => {
  try {
  const nextPath = Path.next(parentPath);
  const nextNode = Node.getIf(editor, nextPath) as AdvancedRenderElement
  const block_type_string = currentNode?.block_type_string;
  const isParagraph = ELTYPE.PARAGRAPH === block_type_string

       let _giveNextId = giveNextId;
       if (nextNode?.property?.olul_obj?.olul_type === listType && nextNode?.block_type_string === block_type_string) {
           const nextIndent = nextNode?.style?.indent ?? 0;
           if (isParagraph || nextIndent === currentNode?.style?.indent) {
               const nextOl = nextNode.property.olul_obj as IOLULATTR;
               if (_giveNextId) {
                   const nextList = getOlUlListById(editor, nextOl?.olul_list_id);
                   nextList.forEach(([node, path]) => {
                       Transforms.setNodes(editor, {
                           property: {
                               olul_obj: {
                                   ...(node?.property?.olul_obj || {}),
                                   olul_is_custom: false,
                                   olul_list_id: _giveNextId
                               }
                           }
                       } as any, { at: path });
                   });
               } else {
                   _giveNextId = nextOl?.olul_list_id

                   const option: any = {
                       olul_type: listType,
                       olul_is_custom: true,
                       olul_list_id: nextOl?.olul_list_id,
                       olul_prefix_no: value,
                   }

                   if (isParagraph) {
                       //
                   } else {
                       option.olul_prefix_no_string = nextOl?.olul_prefix_no_string ?? ''
                   }

                   Transforms.setNodes(editor, {
                       property: {
                           olul_obj: option
                       }
                   } as any, { at: parentPath });

                   Transforms.setNodes(editor, {
                       property: {
                           ...nextNode.property,
                           olul_obj: {
                               ...nextNode.property.olul_obj,
                               olul_is_custom: false,
                           }
                       }
                   } as any, { at: nextPath })
               }
           }
       }
       return _giveNextId;

  } catch (error) {
  console.log(error)
  return '';
  }

}

/**

- 无序列表调整编号
- @param editor
- @returns
  */
  export const adjustUlList = (editor): boolean => {
  try {
  const { selection } = editor;
  if (!selection || !Range.isCollapsed(selection)) return false;

       const [node, path] = Editor.node(editor, selection);

       const parentPath = Path.parent(path);
       const currentNode = Node.getIf(editor, parentPath) as AdvancedRenderElement;
       const wrapNode = Node.getIf(editor, Path.parent(parentPath)) as AdvancedRenderElement

       // 条件1：已经是列表或标题则直接返回
       if (currentNode?.property?.olul_obj?.olul_type === ELTYPE.ULLIST ||
           wrapNode?.block_type_string === ELTYPE.ARTICLE_TITLE) {
           return false;
       }

       // 拦截todolist等快捷键内部使用
       if ([ELTYPE.TODO_LIST].includes(currentNode?.block_type_string as ELTYPE)) {
           return false;
       }


       return processListConversion(editor, {
           listMatch: [1, 1],
           parentPath,
           currentNode,
           isOl: false,
       });

  } catch (error) {
  return false;
  }
  };

const checkAddListForNext = ({ editor, nextNode, path }) => {
const match = getOlUlListById(editor, nextNode?.property?.olul_obj?.olul_list_id)
if (match?.length) {
const nowNode = Node.getIf(editor, path) as AdvancedRenderElement;
const nowIndex = nowNode?.style?.indent ?? 0
let currentIndex = getOlListIndex(match, nextNode?.block_id)
if (currentIndex >= 0) {
for (let i = currentIndex; i < match.length; i++) {
const [node, path] = match[i] as any;
// 遇到同层级的取消掉它的自定义属性
if (nowIndex === node?.style?.indent) {
Transforms.setNodes(editor, {
property: {
olul_obj: {
...(node?.property?.olul_obj || {}),
olul_is_custom: false
}
}
} as any, { at: path })
break;
} else if (nowIndex > node?.style?.indent) {
// 当遇到比自己层级小的，也就是父级同级别的直接结束
break
}
}
}

    }

}

/**

- docbar连续编号操作
  */
  export const checkAddList = (params) => {
  try {
  const { editor, path, type } = params;
  const previousPath = getPreviousPath(path);
  let previousNode = null
  if (previousPath) {
  previousNode = Node.getIf(editor, previousPath) as AdvancedRenderElement;
  }
  const nextNode = Node.getIf(editor, Path.next(path)) as AdvancedRenderElement;
  // 上方元素可以承接就连接
  if (previousNode?.property?.olul_obj?.olul_type === type && previousNode?.block_type_string === ELTYPE.PARAGRAPH) {
  return {
  isSameList: true,
  id: previousNode.property.olul_obj?.olul_list_id
  }
  } else if (nextNode?.property?.olul_obj?.olul_type === type && nextNode?.block_type_string === ELTYPE.PARAGRAPH) {
  // 不行的话就再看看下方可不可以承接
  checkAddListForNext({ editor, nextNode, path })
  return {
  isSameList: true,
  id: nextNode.property.olul_obj?.olul_list_id,
  }

       }
       //备份
       return {
           isSameList: false
       }

  } catch (error) {
  return {
  isSameList: false
  }
  }
  }

/**

- 自定义列表是否要去链接前面的列表
- @param params
- @returns
  */
  export const iscustomListContinue = (params) => {
  try {
  const { editor, node, path, type, value } = params;
  let _path = getPreviousPath(path)
  const nodeIndex = node?.style?.indent ?? 0
  const nodeValue = value

       while (_path) {
           const previousNode = Node.getIf(editor, _path) as AdvancedRenderElement;
           const previousNodeValue = previousNode?.property?.olul_obj?.olul_prefix_no ?? 0
           if (!previousNode) break
           const previousIndex = previousNode?.style?.indent ?? 0;
           if (previousNode?.property?.olul_obj?.olul_type === type) {
               if (previousIndex === nodeIndex && nodeValue - previousNodeValue === 1) {
                   return {
                       isSameList: true,
                       id: previousNode.property.olul_obj?.olul_list_id
                   }
               } else if (previousIndex < nodeIndex) {
                   return {
                       isSameList: false
                   }
               } else if (previousIndex > nodeIndex) {
                   _path = getPreviousPath(_path)
                   if (!_path) break
               } else {
                   return {
                       isSameList: false
                   }
               }
           } else {
               _path = getPreviousPath(_path)
               if (!_path) break
           }


       }

       return {
           isSameList: false
       }

  } catch (error) {
  return {
  isSameList: false
  }
  }
  }

import isHotkey from 'is-hotkey'

/**

- 此文件处理的是文本变更时哪些需要给予列表更新，哪些需要阻止列表无效更新，造成历史记录紊乱，此文件当with-histroy不再使用时，开始使用
  */

/**

- 需要忽略的快捷键列表（兼容 Mac 和 Windows）
  */
  const IGNORED_HOTKEYS = [
  // 数字快捷键
  ...Array.from({ length: 10 }, (_, i) => `mod+${i}`),
  ...Array.from({ length: 10 }, (_, i) => `mod+alt+${i}`), // 这部分已经在快捷键做过处理无需要继续更新了
  ...Array.from({ length: 10 }, (_, i) => `mod+shift+${i}`), // 待观察，按道理应该是实现了，需要判断有无特殊情况

// 字母快捷键（A-Z）
...'abcdefghijklmnopqrstuvwxyz'.split('').map(char => `mod+${char}`),
...'abcdefghijklmnopqrstuvwxyz'.split('').map(char => `mod+shift+${char}`),

// 常用快捷键
'mod+s', // 保存
'mod+z', // 撤销
'mod+shift+z', // 重做
'mod+y', // 重做 (Windows) 这是可以直接拿历史记录的，就没必要触发更新了
'mod+c', // 复制
'mod+v', // 粘贴
'mod+x', // 剪切 需要观察剪切逻辑是否自身已经做了更新列表的操作
'mod+a', // 全选
'mod+f', // 查找
'mod+p', // 打印

// 格式相关
'mod+b', // 加粗
'mod+i', // 斜体
'mod+u', // 下划线

// 特殊按键
'Escape',
//'Tab', // Tab 和 Shift+Tab 会造成缩进和减少缩进，也会影响到有序列表的数据
//'Shift+Tab',

// 功能键
...Array.from({ length: 12 }, (_, i) => `F${i + 1}`)
]

/**

- 判断按键是否为功能键或快捷键
- @param event
- @returns 返回true和false
  */
  const isFunctionOrHotkey = (event: React.KeyboardEvent): boolean => {
  try {
  const { key, ctrlKey, metaKey, altKey } = event

  // 功能键（F1-F12）
  if (key.startsWith('F') && key.length > 1) {
  const fnNumber = parseInt(key.slice(1))
  if (fnNumber >= 1 && fnNumber <= 12) {
  return true
  }
  }

  // 导航键
  const navigationKeys = [
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'Home',
  'End',
  'PageUp',
  'PageDown'
  ]
  if (navigationKeys.includes(key)) {
  return true
  }

  // 系统键
  const systemKeys = [
  'Escape',
  'Insert',
  'PrintScreen',
  'ScrollLock',
  'Pause',
  'ContextMenu',
  'CapsLock',
  'NumLock'
  ]
  if (systemKeys.includes(key)) {
  return true
  }

  // 任何带有控制键的组合都是快捷键
  if (ctrlKey || metaKey || altKey) {
  return true
  }

  return false
  } catch (error) {
  console.log(error)
  return false
  }
  }

/**

- 检查是否应该忽略当前按键操作
- @param event
- @returns 返回true和false
  */

// 提供给olul-other.ts后续切换历史记录时使用
export const shouldIgnoreKey = (event: React.KeyboardEvent): boolean => {
try {
// 检查是否是忽略列表中的快捷键
if (IGNORED_HOTKEYS.some(hotkey => isHotkey(hotkey, event))) {
return true
}

    // 检查是否是功能键或快捷键
    if (isFunctionOrHotkey(event)) {
      return true
    }

    return false

} catch (error) {
console.log(error)
return false
}
}

import { AdvancedRenderElement, AllEditer } from "@/constant/interfaces";
import { ReactEditor } from "slate-react";
import { Node } from 'slate'
import { getPreviousPath } from "../slate-get-node";
import { ELTYPE } from "@/constant/enums/eltype";
import { getImportantLevel, getOlUlListById, tryMoveToPreviousPath } from "./utils";

/**

- 用来判断是是否是连续编号的兄弟节点
- @param param0
- @returns
  */
  const isBroNode = ({ value, siblingNode }) => {
  let loopContinue = false
  let loopId = ''
  if (value - Number(siblingNode?.property?.olul_obj?.olul_prefix_no) !== 1) {
  loopContinue = true
  loopId = siblingNode?.property?.olul_obj?.olul_list_id
  } else {
  loopContinue = false
  loopId = siblingNode?.property?.olul_obj?.olul_list_id
  }
  return {
  loopContinue,
  loopId
  }
  }

const haspreviousNode = (_path) => {
const tempPath = getPreviousPath(_path)
if (tempPath) {
return {
path: tempPath,
tag: true
}
} else {
return {
tag: false
}
}
}

const loopList = ({ _path, editor, currentNode, currentIndent, value, isContinue, _id }) => {
let loopContinue = isContinue
let loopId = _id
let message: any = null
while (_path) {
const siblingNode = Node.getIf(editor, _path) as AdvancedRenderElement
if (!siblingNode) break
// 如果是H标题的有序列表，则不依照缩进去控制是否重连了
if (siblingNode?.property?.olul_obj?.olul_type === ELTYPE.OLLIST && currentNode?.block_type_string === siblingNode?.block_type_string) {
// 兼容数据缺失 indent场景 ，默认补 0
if ((siblingNode?.style?.indent ?? 0) === currentIndent) {
let obj = isBroNode({ value, siblingNode })
loopContinue = obj.loopContinue
loopId = obj.loopId
break;
} else if (currentIndent < (siblingNode?.style?.indent ?? 0) || currentIndent === 0) {
message = tryMoveToPreviousPath(_path)
} else {
break
}
} else {
message = tryMoveToPreviousPath(_path)
}
if (message.result) {
_path = message.path
} else {
break
}

    }
    return {
        loopContinue,
        loopId
    }

}

/**

- 用来控制设置列表的弹框是否某些选项禁用
- @param editor
- @param currentNode
- @param defalueValue 如果设置了defaultValue，那么就使用defaultValue，这是另外的场景适配
- @returns
  */
  export const getOlSettingMessage = (editor: AllEditer, currentNode: AdvancedRenderElement, defalueValue?) => {
  try {
  let path = ReactEditor.findPath(editor, currentNode) ?? null
  if (!path?.length) return
  if (currentNode?.block_type_string !== ELTYPE.PARAGRAPH) {
  if (defalueValue) {
  return getHMessage(editor, currentNode, path, defalueValue)
  }
  return getHMessage(editor, currentNode, path)
  }
  let value = defalueValue ?? Number(currentNode?.property?.olul_obj?.olul_prefix_no)
  let isFirstNumber = value === 1
  let isContinue = false
  let _id = ''
  let _path = getPreviousPath(path)
  let currentIndent = currentNode?.style?.indent ?? 0
  const obj = loopList({ _path, editor, currentNode, currentIndent, value, isContinue, _id })
  isContinue = obj.loopContinue
  _id = obj.loopId
  return {
  isContinue, //为true，表示当前节点的编号需要点击按钮会和前列表自动合并
  isFirstNumber,// 用来判断是否需要新列表编号的按钮的标识
  id: _id //旧的ID
  }

  } catch (error) {
  return {
  isContinue: false,
  isFirstNumber: false,
  id: undefined
  }
  }

}

/**

- 处理H标题的循环函数
- @param param0
- @returns
  */

const loopHList = ({ _path, editor, currentNode, value, isContinue, _id }) => {
let loopContinue = isContinue
let loopId = _id
let message: any = null
while (_path) {
const siblingNode = Node.getIf(editor, _path) as AdvancedRenderElement
if (!siblingNode) break
if (siblingNode?.property?.olul_obj?.olul_type === ELTYPE.OLLIST && currentNode?.block_type_string !== ELTYPE.PARAGRAPH) {
if (siblingNode?.block_type === currentNode?.block_type) {
let obj = isBroNode({ value, siblingNode })
loopContinue = obj.loopContinue
loopId = obj.loopId
break
} else if (currentNode?.block_type < siblingNode?.block_type) {
message = tryMoveToPreviousPath(_path)
} else {
break
}
} else {
message = tryMoveToPreviousPath(_path)
}
if (message.result) {
_path = message.path
} else {
break
}
}
return {
loopContinue,
loopId
}
}

/**

- 处理H标题的列表弹框控制器
- @param editor
- @param currentNode
- @param path
- @param defalueValue
- @returns isContinue 是否需要和前一个列表合并
- @returns id 旧的ID
  */
  export const getHMessage = (editor: AllEditer, currentNode: AdvancedRenderElement, path, defalueValue?) => {
  try {
  if (!currentNode?.property?.olul_obj) {
  return {
  isContinue: false,
  id: undefined,
  isFirstNumber: false,
  isImportantH: false
  }
  }
  let value = defalueValue ?? Number(currentNode.property.olul_obj?.olul_prefix_no)
  let isContinue = false
  let _id = ''
  let _path = getPreviousPath(path)
  let isFirstNumber = value === 1
  let isImportantH = false
  const match = getOlUlListById(editor, currentNode.property.olul_obj?.olul_list_id)
  isImportantH = getImportantLevel(match, currentNode?.block_type)
  const result = loopHList({ _path, editor, currentNode, value, isContinue, _id })
  isContinue = result.loopContinue
  _id = result.loopId
  return {
  isContinue,
  id: _id,
  isFirstNumber: isFirstNumber,
  isImportantH

       }

  } catch (error) {
  return {
  isContinue: false,
  id: undefined,
  isFirstNumber: false,
  isImportantH: false
  }
  }
  }

import { AdvancedRenderElement, AllEditer } from "@/constant/interfaces";
import { getHistoryLength, IUPDATE_INDENT_FOR_TS } from "./utils";
import { Path, Node, Transforms, Editor } from 'slate'
import { olulListSort } from "./sort";
import { message } from "antd";
import i18n from "@/languages/i18n";
import { APP_INDENT_SIZE } from "@/constant";

// 自定义错误类
class SilentRollbackError extends Error { }

/**

- shift+tab
- tab
- enter
- 联动更新列表
- @param params
  */
  export const updateIndentForTS = (params: IUPDATE_INDENT_FOR_TS) => {
  const { editor, currentIndex, matchList, listId, indent, op } = params;
  const opIndentDelta = op === 'reduce' ? -2 : 2;
  const MAX_INDENT = APP_INDENT_SIZE * 2;
  const MIN_INDENT = 0;
  let messageKey = 0

  // 事务管理器
  const transaction = {
  backups: [] as Array<{ path: Path; originalIndent: number }>,
  changes: [] as Array<() => void>
  };

  try {
  // 0. 当前节点路径
  // 备注：这里不要依赖 DocToolbar 透传的 context.element。
  // 在「只序号->改位置->再输入」场景里，context 可能是旧引用，
  // 会导致缩进计算命中旧节点，表现为点击后偶现无效。
  // 这里仅依赖当前 editor 树上的 path -> node 读取实时数据。
  const oldHistory = getHistoryLength(editor as AllEditer);
  const currentPath = matchList?.[currentIndex]?.[1];
  // 备注：拿不到路径时直接结束，避免后续 setNodes 触发异常回滚。
  if (!currentPath) return;

       // 1. 收集所有需要修改的节点路径（包含当前节点和子节点）
       const targets: Path[] = [currentPath]; // 当前节点必须处理

       for (let i = currentIndex + 1; i < matchList?.length; i++) {
           const [item, path] = matchList[i];
           if ((item?.style?.indent ?? 0) <= indent) break;
           targets.push(path);
       }

       // 2. 原子性备份所有目标节点的缩进值
       targets.forEach(path => {
           // 备注：统一从 editor 当前树取最新节点，确保缩进基于实时数据计算。
           const node = Node.getIf(editor, path) as AdvancedRenderElement;
           transaction.backups.push({
               path,
               originalIndent: node?.style?.indent ?? 0
           });
       });

       // 3. 预生成变更操作并检查合法性
       targets.forEach((path, index) => {
           const backup = transaction.backups[index];
           const newIndent = backup.originalIndent + opIndentDelta;

           // // 合法性检查
           // if (newIndent > MAX_INDENT || newIndent < MIN_INDENT) {
           //     throw new Error(`缩进值 ${newIndent} 超出允许范围（${MIN_INDENT}-${MAX_INDENT}）`);
           // }

           // 分离合法性检查
           if (newIndent > MAX_INDENT) {
               throw new Error(`当前内容块已达最大缩进层级`);
           }
           if (newIndent < MIN_INDENT) {
               throw new SilentRollbackError(); // 使用自定义错误
           }

           let len = transaction.changes.length;
           // 生成修改函数（当前节点使用 block 参数）
           transaction.changes.push(() => {
               const node = Node.getIf(editor, path) as AdvancedRenderElement;
               if (!node) return;
               if (len === 0) {
                   Transforms.setNodes(editor, {
                       property: {
                           ...(node?.property || {}),
                           olul_obj: {
                               ...(node?.property?.olul_obj || {}),
                               olul_is_custom: false
                           }
                       },
                       style: { ...(node?.style || {}), indent: newIndent }
                   } as any, { at: path });
               } else {
                   Transforms.setNodes(editor, {
                       style: { ...(node?.style || {}), indent: newIndent }
                   } as any, { at: path });
               }

           });
       });
       // 4. 原子性执行所有变更
       Editor.withoutNormalizing(editor, () => {
           transaction.changes.forEach(change => change());
       });

       // 5. 触发列表重排序
       olulListSort([listId], editor, oldHistory);

  } catch (error) {
  // 6. 事务回滚：恢复所有备份
  Editor.withoutNormalizing(editor, () => {
  transaction.backups.forEach(({ path, originalIndent }) => {
  const node = Node.getIf(editor, path) as AdvancedRenderElement;
  Transforms.setNodes(editor, {
  style: { ...(node?.style || {} ), indent: originalIndent }
  } as any, { at: path });
  });
  });

       if (!(error instanceof SilentRollbackError)) {
           if (messageKey !== 0) {
               message.destroy('customMessage' + messageKey)
           }
           messageKey++
           const key = 'customMessage' + messageKey

           message.warning({ content: i18n.t('unableindent'), key })
       }

  }
  };

import { getBlockNode, getPreviousPath } from "../slate-get-node"
import { checkBackspace, getMousePosition, getOlUlListMatch, IMOUSE_POSITION, inWrap, omit } from "./utils"
import isHotkey from 'is-hotkey'
import { AdvancedRenderElement } from "@/constant/interfaces"
import { Editor, insertText, Node, Path, Transforms } from "slate"
import { olulListSort } from "./sort"
import { sleep } from "../sleep"
import { focusSelection, isEmptyLine } from "../slate-handle-type"
import { IOLULATTR } from "@/constant/interfaces/olul"
import { insertEmptyParagraph } from "../slate-set-node"
import { SOURCE_TYPE, IDOCTYPE, TO_SOR_TYPE } from "@/constant/enums/eltype"
import store from "@/store"
import { coopSplitHistory } from "../coop/coop-history"

const backspaceOp = async ({ event, editor, previousPath, path, block }) => {
const previousEmptyLine = isEmptyLine(editor, previousPath)
const currentEmptyLine = isEmptyLine(editor, path)

    const previousNode = Node.getIf(editor, previousPath) as AdvancedRenderElement
    const isOlUlList = previousNode?.property?.olul_obj?.olul_type
    if (previousEmptyLine && isOlUlList && currentEmptyLine) {
        event.stopPropagation()
        event.preventDefault()
        await sleep(50)
        focusSelection(editor, previousPath, 'start')
        Transforms.removeNodes(editor, {
            at: path
        })
    } else if (previousEmptyLine && isOlUlList) {
        event.stopPropagation()
        event.preventDefault()
        insertPreviousNode(editor, block, previousPath, previousNode?.property?.olul_obj?.olul_list_id)
        await sleep(50)
        focusSelection(editor, previousPath, 'start')
    }

    if (currentEmptyLine) {
        const result = inWrap(editor, path)
        if (result) return
        const newNode = Node.getIf(editor, path)
        if (!newNode) {
            insertEmptyParagraph(editor, path, false)
        }
    }

}

/**

- 处理有序无序列表的删除操作前置方法
- @param param0
- @returns
  */
  const backspaceOpForOlUlList = ({ mousePosition, olulListMatch, event, path, editor, block }) => {
  const isBackspace = checkBackspace(event)
  if (mousePosition === IMOUSE_POSITION.BOL && isBackspace && !olulListMatch?.length) {
  coopSplitHistory(editor)

       const previousPath = getPreviousPath(path)
       if (previousPath?.length) {
           backspaceOp({ event, editor, previousPath, path, block })
       }

  }
  }

/**

- 处理有序无序列表的删除操作 delete前置方法
- @param param0
- @returns
  */
  const deleteOpForOlUlList = ({ mousePosition, editor, path, event }) => {
  let tag = false
  if (mousePosition !== IMOUSE_POSITION.SELECTION && isHotkey('delete', event)) {
  // 特殊处理，当光标位于其他
  const emptyLine = isEmptyLine(editor, path)
  const nextPath = Path.next(path);

       const nextNode = Node.getIf(editor, Path.next(path)) as AdvancedRenderElement
       if (emptyLine || mousePosition === IMOUSE_POSITION.EOL) {
           if (nextNode?.property?.olul_obj?.olul_list_id) {
               // 这里不走默认的方法，是因为默认的方案会造成undo操作被意外拆解
               event.stopPropagation()
               event.preventDefault()


               insertPreviousNode(editor, nextNode, path, nextNode?.property?.olul_obj?.olul_list_id)
               tag = true
           }
       }

  }
  return tag
  }

const cursorOp = ({ mousePosition, event, editor, currentNode, path, olul_obj, oldHistory }) => {
try {
const isBackspace = checkBackspace(event)
if (isBackspace) {
if (mousePosition === IMOUSE_POSITION.BOL) {
event.stopPropagation()
event.preventDefault()
const filteredProperties = omit(currentNode.property, ['olul_obj']);
Transforms.setNodes(editor, {
property: filteredProperties
} as any, { at: path })

                olulListSort([olul_obj?.olul_list_id], editor, oldHistory)
            }
            // 暂时不需要处理
            // else if (mousePosition === IMOUSE_POSITION.EOL) {

            // } else if (mousePosition === IMOUSE_POSITION.MID) {

            // }
        } else if (isHotkey('delete', event)) {
            // if (mousePosition === IMOUSE_POSITION.BOL) {
            //     message.info('delete -1')

            // } else if (mousePosition === IMOUSE_POSITION.EOL) {
            //     message.info('delete -2')

            // } else if (mousePosition === IMOUSE_POSITION.MID) {
            //     message.info('delete -3')

            // }
        }
    } catch (error) {
        console.log(error)
    }

}

/**

- 处理有序无序列表的删除操作
- @param editor
- @param event
- @returns
  */
  export const handleOlUlListDelete = async (editor, event) => {
  const match = getBlockNode(editor)
  const { block, path } = match
  const currentNode = Node.getIf(editor, path) as AdvancedRenderElement
  const mousePosition = getMousePosition(editor, path)
  let oldHistory = editor?.history?.undos?.length ?? 0

  const olulListMatch = getOlUlListMatch(editor)
  backspaceOpForOlUlList({ mousePosition, olulListMatch, event, path, editor, block })
  const tag = deleteOpForOlUlList({ mousePosition, editor, path, event })

  if (!olulListMatch?.length || tag) return

  const olul_obj = currentNode?.property?.olul_obj as IOLULATTR

  if (mousePosition === IMOUSE_POSITION.SELECTION) {
  return false
  } else {
  cursorOp({ mousePosition, event, editor, currentNode, path, olul_obj, oldHistory })
  }

}

/**

- 内容插入或者合并到前一个节点中的具体操作
- @param editor
- @param nextNode
- @param path
- @param id
  */
  export const insertPreviousNode = (editor, nextNode, path, id) => {
  try {
  const oldHistory = editor?.history?.undos?.length
  const nextNodeChildren = JSON.parse(JSON.stringify(nextNode.children || []));
  if (!Editor.hasPath(editor, path)) return null
  const insertPath = Editor.end(editor, path);
  // 插入子节点并记录插入后的路径
  let newChildrenPath: Path;
  Editor.withoutNormalizing(editor, () => {
  Transforms.insertNodes(editor, nextNodeChildren, {
  at: insertPath,
  select: false, // 禁止自动选区
  });
  // 获取新插入子节点的路径（最后一个子节点）

           const nodeLen = Node.getIf(editor, path)?.children?.length
           if (nodeLen >= 0) {
                    newChildrenPath = [
               ...path,
               nodeLen - 1
           ];
           // 删除原下一个节点（路径已变化，需重新计算）
           const newNextPath = Path.next(path);
           Transforms.removeNodes(editor, { at: newNextPath });
           olulListSort([id], editor, oldHistory)
           }

       });

  } catch (error) {
  console.log(error)
  }

}

import { AdvancedRenderElement, AllEditer } from "@/constant/interfaces"
import { ReactEditor } from "slate-react"
import { getImportantLevel, getLevelToIndexMap, getOlListIndex, getOlUlListById, hBlockTypeString } from "./utils"
import { olulListSort } from "./sort"
import { v4 } from 'uuid'
import { getHMessage, getOlSettingMessage } from "./ol-control"
import { ELTYPE } from "@/constant/enums/eltype"
import { Transforms } from "slate"
import { iscustomListContinue } from "./add-list"

/**

- 开始编号位置
- @param element 节点
- @param currentIndex 当前节点在列表中的索引
- @returns 更新起始位置
  */
  const getStartIndex = (element: AdvancedRenderElement, currentIndex: number) => {
  try {
  return hBlockTypeString.includes(element?.block_type_string as ELTYPE) ? currentIndex : 0
  } catch (error) {
  return 0
  }
  }

/**

- 重连按钮方法
- @param editor
- @param element 选中的元素，通过它获取所有listid相同的元素，参与合并
- @param id 连接的新id
- @returns
  */
  export const btnOlContinue = (editor: AllEditer, element: AdvancedRenderElement, id: string) => {
  try {
  let oldId = element?.property?.olul_obj?.olul_list_id
  const match = getOlUlListById(editor, oldId)
  let oldHistory = editor?.history?.undos?.length
  if (!match?.length) return

       const currentIndex = getOlListIndex(match, element?.block_id)
       const startIndex =getStartIndex(element,currentIndex)
       for (let i = startIndex; i < match.length; i++) {
           const [node, path] = match[i] as any
           if (i === currentIndex) {
               Transforms.setNodes(editor,
                   {
                       property: {
                           ...(node?.property || {}),
                           olul_obj: {
                               ...(node?.property?.olul_obj || {}),
                               olul_list_id: id,
                               olul_is_custom: false,
                           }
                       }
                   } as any,
                   { at: path })
           } else {
               Transforms.setNodes(editor,
                   {
                       property: {
                           ...(node?.property || {}),
                           olul_obj: {
                               ...(node?.property?.olul_obj || {}),
                               olul_list_id: id,
                           }
                       }
                   } as any,
                   { at: path })
           }


       }
       olulListSort([id], editor, oldHistory)

  } catch (error) {
  console.log(error)
  }

}

const btnOlNewListLoop = ({ listIndex, match, remeberIndent, editor, newId }) => {
for (let i = listIndex; i < match.length; i++) {
const [node, path] = match[i] as any
const temIndent = node?.style?.indent ?? 0
if (temIndent === remeberIndent) {

            if (node?.property?.olul_obj?.olul_is_custom === true && i > listIndex) {
                break
            }

            Transforms.setNodes(editor, {
                property: {
                    ...(node?.property || {}),
                    olul_obj: {
                        ...(node?.property?.olul_obj || {}),
                        olul_list_id: temIndent === 0 ? newId : node?.property?.olul_obj?.olul_list_id,
                        olul_is_custom: listIndex === i ? true : false,
                        olul_prefix_no: i - listIndex + 1
                    }
                }
            } as any, {
                at: path
            })
        } else if (temIndent < remeberIndent) {
            break
        } else {
            Transforms.setNodes(editor, {
                property: {
                    ...(node?.property || {}),
                    olul_obj: {
                        ...(node?.property?.olul_obj || {}),
                        olul_list_id: remeberIndent === 0 ? newId : node?.property?.olul_obj?.olul_list_id
                    }
                }
            } as any, {
                at: path
            })
        }

    }

}

/**

- 拆分列表方法
-
- @param editor
- @param element
- @returns
  */
  export const btnOlNewList = (editor: AllEditer, element: AdvancedRenderElement) => {
  try {
  if (element?.block_type_string !== ELTYPE.PARAGRAPH) {
  btnOlHNewList(editor, element)
  return
  }
  const oldHistory = editor?.history?.undos?.length
  let blockId = element?.block_id
  const listId = element?.property?.olul_obj?.olul_list_id
  const match = getOlUlListById(editor, listId)
  const listIndex = getOlListIndex(match, blockId)
  if (listIndex === -1) return
  let newId = v4()
  let remeberIndent = match?.[listIndex]?.[0]?.style?.indent ?? 0
  btnOlNewListLoop({ listIndex, match, remeberIndent, editor, newId })
  olulListSort([newId, listId], editor, oldHistory)

  } catch (error) {
  console.log(error)
  }

}

const changeNumberBro = ({ node, i, listIndex, editor, isContinue, remeberIndent, newId, oldId, result, value, path }) => {
if (node?.property?.olul_obj?.olul_is_custom === true && i > listIndex) {
return true
}
if (i === listIndex) {
Transforms.setNodes(editor, {
property: {
...(node?.property || {}),
olul_obj: {
...(node?.property?.olul_obj || {}),
olul_list_id: isContinue && remeberIndent === 0 ? newId : oldId,
olul_is_custom: result?.isSameList ? false : true,
olul_prefix_no: i - listIndex + value
}
}
} as any, {
at: path
})
} else {
Transforms.setNodes(editor, {
property: {
...(node?.property || {}),
olul_obj: {
...(node?.property?.olul_obj || {}),
olul_list_id: isContinue && remeberIndent === 0 ? newId : oldId,
olul_prefix_no: i - listIndex + value
}
}
} as any, {
at: path
})
}
}

const changeNumberLoop = ({ listIndex, match, remeberIndent, editor, isContinue, newId, oldId, result, value }) => {
for (let i = listIndex; i < match.length; i++) {
const [node, path] = match[i] as any
const temIndent = node?.style?.indent ?? 0
if (temIndent === remeberIndent) {
const tag = changeNumberBro({ node, i, listIndex, editor, isContinue, remeberIndent, newId, oldId, result, value, path })
if (tag) break
} else if (temIndent < remeberIndent) {
break
} else {
Transforms.setNodes(editor, {
property: {
...(node?.property || {}),
olul_obj: {
...(node?.property?.olul_obj || {}),
olul_list_id: isContinue && remeberIndent === 0 ? newId : oldId,
}
}
} as any, {
at: path
})
}

    }

}

/**

- 修改列表编号
- @param editor
- @param element
- @param value
- @returns
  */
  export const btnOlChangeNumber = (editor: AllEditer, element: AdvancedRenderElement, value) => {
  try {
  let blockId = element?.block_id
  const listId = element?.property?.olul_obj?.olul_list_id
  const match = getOlUlListById(editor, listId)
  const listIndex = getOlListIndex(match, blockId)

       const messageOption = getOlSettingMessage(editor, element, value)
       const oldId = messageOption.id || listId
       const isContinue = messageOption.isContinue

       if (listIndex === -1) return

       const isParagraph = element?.block_type_string === ELTYPE.PARAGRAPH

       if (!isParagraph) {
           btnOlHChangeNumber({ editor, element, value, match, listIndex })
           return
       }

       const result = iscustomListContinue({
           editor,
           node: element,
           path: ReactEditor.findPath(editor, element) ?? null,
           type: element?.property?.olul_obj?.olul_type ?? null,
           value
       })

       // console.log(result)
       let newId = v4()

       if (result.isSameList) {
           newId = result.id
       }

       let remeberIndent = match?.[listIndex]?.[0]?.style?.indent ?? 0
       changeNumberLoop({ listIndex, match, remeberIndent, editor, isContinue, newId, oldId, result, value })
       olulListSort([newId, oldId], editor)

  } catch (error) {

  }

}

const btnOlHContinue = () => {
try {

    } catch (error) {

    }

}

const btnOlHNewListLoop = ({ listIndex, match, editor, newId, useNewId, element }) => {
const oldType = element.block_type
for (let i = listIndex; i < match?.length; i++) {
const [node, path] = match[i] as any
if (oldType === node.block_type) {
if (node?.property?.olul_obj?.olul_is_custom === true && i > listIndex) {
break
}

            Transforms.setNodes(editor, {
                property: {
                    ...(node?.property || {}),
                    olul_obj: {
                        ...(node?.property?.olul_obj || {}),
                        olul_list_id: useNewId ? newId : node?.property?.olul_obj?.olul_list_id,
                        olul_is_custom: listIndex === i ? true : false,
                        olul_prefix_no: i - listIndex + 1
                    }
                }
            } as any, {
                at: path
            })

        } else if (oldType > node?.block_type) {
            break
        } else {
            Transforms.setNodes(editor, {
                property: {
                    ...(node?.property || {}),
                    olul_obj: {
                        ...(node?.property?.olul_obj || {}),
                        olul_list_id: useNewId ? newId : node?.property?.olul_obj?.olul_list_id
                    }
                }
            } as any, {
                at: path
            })
        }
    }

}

/**

- H标题的新列表开始机制
- @param editor
- @param element
  */
  export const btnOlHNewList = (editor, element, useNewId = true) => {
  try {
  const oldHistory = editor?.history?.undos?.length
  let blockId = element?.block_id
  const listId = element?.property?.olul_obj?.olul_list_id
  const match = getOlUlListById(editor, listId)
  const listIndex = getOlListIndex(match, blockId)
  if (listIndex === -1) return
  let newId = v4()
  btnOlHNewListLoop({ listIndex, match, editor, newId, useNewId, element })
  olulListSort([newId, listId], editor, oldHistory)

  } catch (error) {

  }
  }

const changeNumberId = (hasImportantLevel, newId, node) => {
if (hasImportantLevel) {
return node?.property?.olul_obj?.olul_list_id
} else {
return newId
}
}
const changeNumberCoustom = (listIndex, i, node) => {
if (listIndex === i) {
return true
} else {
return node?.property?.olul_obj?.olul_is_custom
}
}

const changeNumberPrefix = (listIndex, i, value, node) => {
if (listIndex === i) {
return value
} else {
return node?.property?.olul_obj?.olul_prefix_no
}
}

/**

- 处理H标题列表
- @param param0
  */
  const getMergedHList = ({ listIndex, match, newId, value, editor, element, shouldMerge }) => {
  const oldType = element?.block_type
  const hasImportantLevel = getImportantLevel(match, oldType)

  if (shouldMerge) {
  for (let i = listIndex; i < match?.length; i++) {
  const [node, path] = match[i] as any
  if (oldType <= node?.block_type) {
  Transforms.setNodes(editor, {
  property: {
  ...(node?.property || {}),
  olul_obj: {
  ...(node?.property?.olul_obj || {}),
  olul_list_id: changeNumberId(hasImportantLevel, newId, node),
  olul_is_custom: false
  }
  }
  } as any, {
  at: path
  })
  } else {
  break
  }
  }
  } else {
  for (let i = listIndex; i < match?.length; i++) {
  const [node, path] = match[i] as any
  if (oldType <= node?.block_type) {
  Transforms.setNodes(editor, {
  property: {
  ...(node?.property || {}),
  olul_obj: {
  ...(node?.property?.olul_obj || {}),
  olul_list_id: changeNumberId(hasImportantLevel, newId, node),
  olul_is_custom: changeNumberCoustom(listIndex, i, node),
  olul_prefix_no: changeNumberPrefix(listIndex, i, value, node)
  }
  }
  } as any, {
  at: path
  })
  } else {
  break
  }
  }
  }
  }

const changeNumberHLoop = ({ listIndex, match, newId, value, editor, path, element, shouldMerge }) => {
try {
const oldId = element?.property?.olul_obj?.olul_list_id
if (oldId === newId) {
Transforms.setNodes(editor, {
property: {
...(element?.property || {}),
olul_obj: {
...(element?.property?.olul_obj || {}),
olul_prefix_no: value,
olul_is_custom: false
}
}
} as any, { at: path })
} else {
getMergedHList({ listIndex, match, newId, value, editor, element, shouldMerge })
}
} catch (error) {

    }

}

/**

- 这里注意的是，不管是第几层，都给新id，除非新值和原值一样，能链接上，才给旧id
- 因为考虑到后续的粘贴复制
- @param param0
  */
  const btnOlHChangeNumber = ({ editor, element, value, match, listIndex }) => {
  try {
  let newId = v4()
  // 如果是继续，那么就用旧id
  let path = ReactEditor.findPath(editor, element) ?? null
  const result = getHMessage(editor, element, path, value)
  // 如果不用连接成一个列表，证明之前就是一个列表，那么id就不能用随机值了
  if (!result.isContinue) newId = result?.id || v4()
  let shouldMerge = !!(!result.isContinue && result.id)
  changeNumberHLoop({ listIndex, match, newId, value, editor, path, element, shouldMerge })
  olulListSort([newId, element?.property?.olul_obj?.olul_list_id], editor)
  } catch (error) {

  }
  }

import { ReactEditor, DOMEditor } from "slate-react"
import { checkIsLastLine, getCurrentNodeType, getElementisH, getInsertPath, hBlockTypeString, inWrap, isListMiddle, omit, setCursorPosition, textBlockTypes } from "./utils"
import { olulListSort, saveListHistory } from "./sort"
import { IOLULATTR } from "@/constant/interfaces/olul"
import { v4 } from 'uuid'
import { Editor, Node, Path, Transforms } from 'slate'
import { AdvancedRenderElement } from "@/constant/interfaces"
import { focusSelection } from "../slate-handle-type"
import { cloneDeep } from "lodash-es"
import { ELTYPE, ELTYPE_NUM } from "@/constant/enums/eltype"
import { checkAddList, processListConversion } from "./add-list"
import { milog } from "../milog"
import { CommandType } from "@/constant/enums/command"
import { HistoryEditor } from 'slate-history'
import { getInsertAbovePath, insertEmptyParagraph } from "../slate-set-node"
import { sleep } from "../sleep"
import { checkAddListForH } from "./add-h-list"
import { message } from "antd"
import { addParagraphOlUlItem, updateOlUlItem } from "./olul-merge"
import store from '@/store'
import { updateDocToolBarContext } from '@/store/features/docToolBarSlice'
import { paragraphLeavesFromCodeBlockProperty } from '@/plugins/code-block/utils/codeTransform'

/**

- 根据转换类型和节点信息返回有效的列表id
- @param type 转换列表类型
- @param node 节点
- @param ulId ul列表id
- @param olId ol列表id
- @param hId 有序标题id
- @returns
  */
  const getListId = (
  type: ELTYPE.ULLIST | ELTYPE.OLLIST,
  node: AdvancedRenderElement,
  ulId: string,
  olId: string,
  hId: string
  ) => {
  try {
  if (type === ELTYPE.ULLIST) return ulId
  if (hBlockTypeString.includes(node?.block_type_string as ELTYPE)) return hId
  if (textBlockTypes.includes(node?.block_type_string as ELTYPE)) return olId
  return ''
  } catch (error) {
  return ''
  }
  }

/**

- 返回节点新的type和type_string
- @param type 转换的列表类型
- @param node 节点
- @returns
  */
  const getNodeBlock = (type:ELTYPE.ULLIST | ELTYPE.OLLIST,node:AdvancedRenderElement) => {
  try {

       if (type === ELTYPE.ULLIST) {
           return {
               block_type: ELTYPE_NUM.PARAGRAPH,
               block_type_string: ELTYPE.PARAGRAPH,
           }
       } else {
           let isParagraph = [ELTYPE.PARAGRAPH, ELTYPE.TODO_LIST].includes(node?.block_type_string as ELTYPE)
           const isH = hBlockTypeString.includes(node?.block_type_string as ELTYPE)

           if (isParagraph || isH) {
               return {
                   block_type: isParagraph ? ELTYPE_NUM.PARAGRAPH : node?.block_type,
                   block_type_string: isParagraph ? ELTYPE.PARAGRAPH : node?.block_type_string
               }
           } else {
               return {}
           }


       }

  } catch (error) {
  return {}
  }
  }

/**

- 旧节点是代码块转换方案
- @param editor 编辑器
- @param path 路径
- @param type 转换类型
  */
  const oldTypeisCodeblock = async ({ editor, path, type }) => {
  let oldlen = editor?.history?.undos?.length  
  const node = Node.getIf(editor, path) as AdvancedRenderElement
  const changePath = Path.parent(path)
  // 将代码块的代码高亮片段转换为段落节点
  const leaves = paragraphLeavesFromCodeBlockProperty(node) as any[]
  Editor.withoutNormalizing(editor, () => {
  Transforms.removeNodes(editor, { at: changePath })
  Transforms.insertNodes(
  editor,
  {
  children: leaves?.length ? leaves : [{ text: node?.property?.content ?? '' }],
  block_type: ELTYPE_NUM.PARAGRAPH,
  block_type_string: ELTYPE.PARAGRAPH,
  block_id: v4(),
  style: node.style ?? {indent: 0},
  } as any,
  { at: changePath }
  )
  })

await sleep(50)
const element = Node.getIf(editor, changePath) as AdvancedRenderElement
updateOlUlItem({
editor,
listType: type,
element,
oldLen:oldlen
})

await sleep(10)
focusSelection(editor, changePath)
}

/**

- 高亮块转换方案
- @param0 editor 编辑器
- @param1 element 元素节点
- @param2 type 转换类型
- @param3 path 路径
  */
  const isHighLight = ({ editor, element, type, path }) => {
  const historyLen = editor?.history?.undos?.length ?? 0

  // 当高亮块里面都是有序无序时且需要转换的类型和当前的类型相同 需要转换成断落
  if (
  (element.children?.[0]?.children?.every(n => n?.property?.olul_obj?.olul_type === ELTYPE.ULLIST) && type === ELTYPE.ULLIST)
  ||
  (element.children?.[0]?.children?.every(n => n?.property?.olul_obj?.olul_type === ELTYPE.OLLIST) && type === ELTYPE.OLLIST)
  ) {

       // 移除有序无序属性 转换成断落
       // const childArr = element.children[0].children.map(n => ({
       //     block_id: n.block_id,
       //     // block_type: ELTYPE_NUM.PARAGRAPH,
       //     // block_type_string: ELTYPE.PARAGRAPH,
       //     children: n.children,
       //     property: { doc_bar_disabled: true },
       //     style: n.style
       // }))
       Editor.withoutNormalizing(editor, () => {
           element.children[0].children.forEach((n, i) => {
               const node = n as AdvancedRenderElement
               const filteredProperties = omit(node?.property, ['olul_obj'])
               Transforms.setNodes(editor, {
                   property: filteredProperties
               } as any, { at: [...path, 0, i] })
           })

           // // 删除高亮块子项
           // childArr.forEach(() => {
           //     Transforms.removeNodes(editor, { at: [...path, 0, 0] })
           // })
           // // 插入断落
           // childArr.forEach((n, i) => {
           //     Transforms.insertNodes(
           //         editor,
           //         { ...n },
           //         { at: [...path, 0, i] }
           //     )
           // })
           saveListHistory(editor, historyLen)
       })

  } else {
  // 需要将高亮块内的文本全部转换成有序无序 并且排序

       // const listId = v4()


       const ulId = v4()
       const olId = v4()
       const hId = v4()




       // const childArr = element.children[0].children.map(n => ({
       //     block_id: n.block_id,
       //     block_type: ELTYPE_NUM.PARAGRAPH,
       //     block_type_string: ELTYPE.PARAGRAPH,
       //     children: n.children,
       //     property: {
       //         doc_bar_disabled: true,
       //         olul_obj: {
       //             olul_is_custom: false,
       //             olul_list_id: listId,
       //             olul_prefix_no: 1,
       //             olul_type: type
       //         }
       //     },
       //     style: n.style
       // }))

       // Update editor content
       Editor.withoutNormalizing(editor, () => {


           element?.children?.[0]?.children?.forEach((n, i) => {
               const node = n as AdvancedRenderElement
               Transforms.setNodes(editor, {
                   ...getNodeBlock(type,n),
                   property: {
                       ...(node?.property || {}),
                       olul_obj: {
                           olul_is_custom: false,
                           olul_list_id: getListId(type,n,ulId,olId,hId),
                           olul_prefix_no: 1,
                           olul_type: type
                       }
                   }
               } as any, { at: [...path, 0, i] })
           })

           // 删除高亮块子项
           // childArr.forEach(() => {
           //     Transforms.removeNodes(editor, { at: [...path, 0, 0] })
           // })
           // // 添加高亮块子项成为组装好的有序无序node
           // childArr.forEach((n, i) => {
           //     Transforms.insertNodes(
           //         editor,
           //         { ...n },
           //         { at: [...path, 0, i] }
           //     )
           // })

           // 排序
           olulListSort([ulId,olId,hId], editor, historyLen)
       })

  }
  }

/**

- 全是同类型节点转换方案
- @param param0
  */
  const isSameType = ({ editor, element, path }) => {
  const listId = element?.property?.olul_obj?.olul_list_id
  let oldHistory = editor?.history?.undos?.length ?? 0
  const filteredProperties = omit(element?.property, ['olul_obj']);
  Transforms.setNodes(editor, {
  property: filteredProperties,
  } as any, { at: path })
  olulListSort([listId], editor, oldHistory)
  focusSelection(editor, path)
  }

// const getResultForUpdate = (editor, path, type, isH, element) => {
// if (isH) {
// return checkAddListForH({ editor, path, type, element })
// } else {
// return checkAddList({ editor, path, type })
// }
// }

// const shouldCoustom = (result: any) => {
// try {
// let isSameList = result.isSameList
// let isShouldCoustom = result?.isShouldCoustom
// if (typeof isShouldCoustom === 'boolean') {
// return isShouldCoustom
// } else {
// return isSameList
// }

// } catch (error) {
// return false
// }
// }

/**

- 更新节点方案
- @param param0
  */
  // const updateList = async ({ editor, path, type, element }) => {
  // const listId = v4()
  // let oldHistory = editor?.history?.undos?.length ?? 0
  // const isH = getElementisH(element)
  // let result = getResultForUpdate(editor, path, type, isH, element)
  // let option: any = {
  // olul_type: type,
  // olul_is_custom: shouldCoustom(result),
  // olul_list_id: result.isSameList ? result.id : listId,
  // olul_prefix_no: 1,
  // }
  // Transforms.setNodes(editor, {
  // children: element.children,
  // block_type: isH ? element.block_type : ELTYPE_NUM.PARAGRAPH,
  // block_type_string: isH ? element.block_type_string : ELTYPE.PARAGRAPH,
  // block_id: v4(),
  // style: element.style,
  // property: {
  // ...element.property,
  // olul_obj: option
  // }
  // }, { at: path })
  // olulListSort([result.isSameList ? result.id : listId, element.property?.olul_obj?.olul_list_id], editor, oldHistory)
  // const nextNode = Node.getIf(editor, Path.next(path)) as AdvancedRenderElement
  // if (!nextNode) {
  // const result = inWrap(editor, path)
  // focusSelection(editor, path)
  // if (result) {
  // return
  // }
  // insertEmptyParagraph(editor, Path.next(path), false)
  // }
  // await sleep(10)
  // focusSelection(editor, path)
  // }

/**

- 其他方案如斜杠快捷键转换
- @param param0
  */
  const otherToList = async ({ editor, path, type, element }) => {
  const oldLen = editor?.history?.undos?.length ?? 0
  if (type === ELTYPE.ULLIST) {
  updateOlUlItem({ editor, listType: ELTYPE.ULLIST, path, element, oldLen })
  } else {
  const obj = getNodeBlock(ELTYPE.OLLIST, element)
  updateOlUlItem({
  editor,
  listType: ELTYPE.OLLIST,
  path,
  element,
  message: { newType: obj?.block_type },
  oldLen
  })
  }
  const nextNode = Node.getIf(editor, Path.next(path)) as AdvancedRenderElement
  if (!nextNode) {

       const result = inWrap(editor, path)
       await sleep(10)
       if (result) {
           focusSelection(editor, path)
           return
       }
       insertEmptyParagraph(editor, Path.next(path), false)
       focusSelection(editor, path)

  } else {
  await sleep(10)
  focusSelection(editor, path)
  }
  return
  // const result = checkAddList({ editor, path, type })
  // const listId = v4()
  // let oldHistory = editor?.history?.undos?.length ?? 0

  // Transforms.setNodes(editor, {
  // //TODO 后续会删掉的，目前为了适配
  // block_type: ELTYPE_NUM.PARAGRAPH,
  // block_type_string: ELTYPE.PARAGRAPH,
  // property: {
  // ...element.property,
  // olul_obj: {
  // olul_type: type,
  // olul_is_custom: result.isSameList ? false : true,
  // olul_list_id: result.isSameList ? result.id : listId,
  // olul_prefix_no: 1,
  // }
  // }
  // } as any, { at: path })
  // olulListSort([result.isSameList ? result.id : listId], editor, oldHistory)
  // const nextNode = Node.getIf(editor, Path.next(path)) as AdvancedRenderElement
  // if (!nextNode) {

  // const result = inWrap(editor, path)
  // await sleep(10)
  // focusSelection(editor, path)
  // if (result) {
  // return
  // }
  // insertEmptyParagraph(editor, Path.next(path))

  // } else {
  // await sleep(10)
  // focusSelection(editor, path)
  // }
  }

/**

- docbar和斜杠快捷键转换主函数 其他类型点击转换成olul
  */
  export const docbarOtherToOlUl = async(params) => {
  // editor path element

  try {
  // type 指的是有序无序的类型
  const { editor, context, commands, type, isAdd = CommandType.UPDATE } = params
  if (context) {

           const { element } = context
           let path = ReactEditor.findPath(editor, element)
           console.log('pathpath', path)

           if (isAdd === CommandType.ADD || isAdd === CommandType.ADD_ABOVE) {
               path = getInsertPath(editor, path)
               if (isAdd === CommandType.ADD_ABOVE) {
                   path = getInsertAbovePath(editor, path)
               }
               addParagraphOlUlItem({
                   editor,
                   path,
                   listType: type,
                   element,
                   insertAbove: isAdd === CommandType.ADD_ABOVE
               })
               return
           }

           const oldType = getCurrentNodeType(element)

           if (oldType === ELTYPE.CODE_BLOCK) {
               oldTypeisCodeblock({ editor, path, type })

           } else if (oldType === ELTYPE.HIGHLIGHT) {
               isHighLight({ editor, path, type, element })
               const node = Node.getIf(editor, path)
               if (node) {
                   store.dispatch(updateDocToolBarContext({ element: node }))
               }
           } else if (oldType === type) {
               isSameType({ editor, path, element })
           } else {
               updateOlUlItem({ editor, listType: type, element })
               // updateList({ editor, path, type, element })

           }

           checkIsLastLine(editor, path)
           await sleep(20)
           focusSelection(editor, path)
       } else {
           // 斜杠快捷键 当选中项是有序无序才走这里
           const { selection } = editor
           const { anchor } = selection
           const path = anchor.path.slice(0, -1)
           const element = Node.getIf(editor, path) as AdvancedRenderElement
           const oldType = getCurrentNodeType(element)
           if (oldType === type) {
               return
           } else {
               otherToList({ editor, path, type, element })
           }

       }

  } catch (error) {
  console.log(error)
  }

}

/**

- 有序无序转其他内容 不一定会移除olul，如果是转H标题的话
- 如果转其他类型则移除olul特殊属性
- 更新列表
- @param editor
- @param block_type
- @param block_type_string
- @param path
- @param element
- @returns
  */
  export const olulListToOther = ({ editor, block_type, block_type_string, path, element,floatMd=false }) => {
  try {
  if(floatMd)return false
  const oldHistory = editor?.history?.undos?.length
  const olulType = element?.property?.olul_obj?.olul_type
  if (olulType === ELTYPE.OLLIST) {
  if (hBlockTypeString.includes(block_type_string)) {
  updateHList({ editor, block_type, path, element, block_type_string })
  } else {
  deleteOlUlItem({ element, editor, block_type, block_type_string, path, oldHistory })
  }
  return true
  } else if (olulType === ELTYPE.ULLIST) {
  deleteOlUlItem({ element, editor, block_type, block_type_string, path, oldHistory })
  return true
  } else {
  return false
  }

  } catch (error) {
  return false
  }

}

/**

- 删除olul属性，变成正常节点
- @param element 节点
- @param editor 编辑器实例
- @param block_type 转换后的类型
- @param block_type_string 转换后的类型字符串
- @param path 节点路径
- @param oldHistory 历史记录
  */
  const deleteOlUlItem = async ({ element, editor, block_type, block_type_string, path, oldHistory }) => {
  try {
  let id = element?.property?.olul_obj?.olul_list_id
  const base = cloneDeep(element)
  delete base?.property?.olul_obj
  Transforms.setNodes(editor, {
  ...(base || {}),
  block_id: v4(),
  block_type,
  block_type_string,
  }, { at: path })
  olulListSort([id], editor, oldHistory)
  setCursorPosition({ editor, path })
  } catch (error) {
  console.log(error)
  }
  }

/**

- 更新hlist
- @param editor
- @param block_type
- @param path
- @param param0
  */

const updateHList = ({ editor, block_type, block_type_string, path, element }) => {
try {
const oldHistory = editor?.history?.undos?.length
let elementType = element?.block_type
if (elementType === block_type) {
// 同类型的转为普通的有序列表
updateOlUlItem({ editor, listType: ELTYPE.OLLIST, element,message:{newType:ELTYPE.PARAGRAPH} })
} else {

              updateOlUlItem({ editor, listType: ELTYPE.OLLIST,path, element,message:{newType:block_type_string} })
            // Transforms.setNodes(editor, {
            //     block_type: block_type,
            //     block_type_string: block_type_string,
            //     property: {
            //         ...element.property,
            //         olul_obj: {
            //             ...element.property.olul_obj,
            //             olul_is_custom: false,
            //             olul_list_id: v4()
            //         }
            //     }
            // } as any, { at: path })
            // olulListSort([element?.property?.olul_obj?.olul_list_id], editor, oldHistory)
        }
        setCursorPosition({ editor, path })
    } catch (error) {
        console.log(error)
    }

}
import {
getMousePosition,
getNextIndent,
getOlUlListById,
getOlUlListMatch,
IMOUSE_POSITION,
omit,
setOlUlStyle
} from './utils'
import { getBlockNode } from '../slate-get-node'
import { Node, Path, Range, Transforms, Editor, Text } from 'slate'
import { IOLULATTR } from '@/constant/interfaces/olul'
import { olulListSort } from './sort'
import { AdvancedRenderElement } from '@/constant/interfaces'
import { addEmptyOlUlList } from './add-list'
import { ELTYPE, ELTYPE_NUM } from '@/constant/enums/eltype'
import { focusSelection, isEmptyLine } from '../slate-handle-type'
import { sleep } from '../sleep'
import { insertEmptyParagraph } from '../slate-set-node'
import { updateIndentForTS } from './ol-update-shifttab'

// 有序无序列表回车处理函数
export const handleOlUlListEnter = async (editor: Editor, list: any[]) => {
try {
const match = getBlockNode(editor)
const { block, path } = match
const mousePosition = getMousePosition(editor, path)

    const olulListMatch = getOlUlListMatch(editor)
    if (!olulListMatch?.length) return

    if (mousePosition === IMOUSE_POSITION.SELECTION) {
      // 选区直接放 在统一的地方去处理更新即可
      return false
    } else {
      // 光标拦截处理
      const currentNode = Node.getIf(editor, path) as AdvancedRenderElement
      const olul_obj = currentNode?.property?.olul_obj as IOLULATTR

      // 行首回车
      if (mousePosition === IMOUSE_POSITION.BOL) {
        // 这里需要额外加上空行的判断, 如果是空行，需要额外处理
        const emptyLine = isEmptyLine(editor, path)
        // 空白行
        if (emptyLine && currentNode?.style?.indent === 0) {
          const filteredProperties = omit(currentNode?.property, ['olul_obj'])
          Transforms.setNodes(
            editor,
            {
              property: filteredProperties
            } as any,
            { at: path }
          )
        } else if (emptyLine && currentNode?.style?.indent > 0) {
          // 空白行有缩进
          // 如果缩进不是0，那么则需要调整缩进的大小

          const matchList = getOlUlListById(editor, olul_obj?.olul_list_id)

          // 获取当前的block是matchList中的第几个
          const currentIndex = matchList.findIndex(item => item?.[0]?.block_id === block?.block_id)
          updateIndentForTS({
            editor,
            currentIndex,
            matchList,
            listId: olul_obj?.olul_list_id,
            indent: currentNode?.style?.indent,
            op: 'reduce',
            block
          })
        } else {
          // 正常行首
          const isCustom = currentNode?.property?.olul_obj?.olul_is_custom ?? false

          addEmptyOlUlList({ editor, path, isFocus: true, currentNode, isCustom })

          // 当前增加了自定义属性，则需要将下一行的自定义属性去掉
          if (isCustom) {
            Transforms.setNodes(
              editor,
              {
                property: {
                  ...(currentNode?.property || {}),
                  olul_obj: {
                    ...(currentNode?.property?.olul_obj || {}),
                    olul_is_custom: false
                  }
                }
              } as any,
              { at: Path.next(path) }
            )
          }
        }

        olulListSort([olul_obj?.olul_list_id], editor,-1,0)
        // 延迟一下，让光标移动到新插入的节点上
        await sleep(50)
        if (!emptyLine) {
          focusSelection(editor, Path.next(path), 'start')
        }
      } else if (mousePosition === IMOUSE_POSITION.EOL) {
        // 行尾回车
        const currentNode = Node.getIf(editor, path) as AdvancedRenderElement

        if (currentNode?.block_type_string !== ELTYPE.PARAGRAPH) {
          insertEmptyParagraph(editor, Path.next(path))
          focusSelection(editor, Path.next(path), 'start')
          return
        }

        const temIndent = getNextIndent(editor, path, olul_obj.olul_list_id)

        let flag = false
        if (temIndent !== -1 && currentNode?.style?.indent < temIndent) {
          flag = true
        }
        const newIndent = flag ? temIndent : currentNode?.style?.indent ?? 0

        addEmptyOlUlList({
          editor,
          path: Path.next(path),
          isFocus: true,
          currentNode,
          newIndent,
          isEnd: true
        })
        olulListSort([olul_obj?.olul_list_id], editor,-1,0)
        // 延迟一下，让光标移动到新插入的节点上
        await sleep(50)
        focusSelection(editor, Path.next(path), 'start')
      } else if (mousePosition === IMOUSE_POSITION.MID) {
        // 行中回车
        const { selection } = editor
        if (!selection) return

        // 获取当前节点的父容器路径

        // 获取实际文本节点路径（处理嵌套结构）
        const textNodePath = [...path, 0]
        const textNode = Node.getIf(editor, textNodePath) as Text
        const textContent = textNode?.text || ''

        const temIndent = getNextIndent(editor, path, olul_obj?.olul_list_id)

        let flag = false
        if (temIndent !== -1 && currentNode?.style?.indent < temIndent) {
          flag = true
        }
        const newIndent = flag ? temIndent : currentNode?.style?.indent ?? 0
        const isFirstText = selection?.anchor?.path[selection?.anchor?.path?.length - 1] === 0
        // 精确获取光标前的内容
        const [start] = Range.edges(selection)
        const beforeText = textContent.slice(0, start?.offset)
        // 行中特殊场景：虽然位于行中，但是光标前方都是space空内容
        if (/^\s*$/.test(beforeText) && isFirstText) {
          Editor.withoutNormalizing(editor, () => {
            // 删除前导空白
            Transforms.delete(editor, {
              at: {
                anchor: { path: textNodePath, offset: 0 },
                focus: { path: textNodePath, offset: start?.offset }
              }
            })

            // 在父级容器中插入新列表项
            Transforms.insertNodes(
              editor,
              {
                block_type_string: ELTYPE.PARAGRAPH,
                block_type: ELTYPE_NUM.PARAGRAPH,
                property: {
                  olul_obj: {
                    ...(olul_obj || {}),
                    olul_prefix_no: olul_obj?.olul_prefix_no
                  }
                },
                style: {
                  ...setOlUlStyle(currentNode),
                  indent: currentNode?.style?.indent
                },
                children: [{ text: '' }]
              } as any,
              {
                at: path,
                select: true
              }
            )

            Transforms.setNodes(
              editor,
              {
                property: {
                  olul_obj: {
                    ...(olul_obj || {}),
                    olul_is_custom: false
                  }
                }
              } as any,
              { at: Path.next(path) }
            )

            if (temIndent !== -1) {
              Transforms.setNodes(
                editor,
                {
                  style: {
                    indent: newIndent
                  }
                } as any,
                { at: Path.next(path) }
              )
            }
          })

          // 更新排序逻辑
          olulListSort([olul_obj?.olul_list_id], editor,-1,0)
          await sleep(50)
          focusSelection(editor, Path.next(path), 'start')

          // 更新排序逻辑
        } else {
          Editor.withoutNormalizing(editor, () => {
            // 切割当前行
            Transforms.splitNodes(editor, {
              mode: 'lowest',
              always: true
            })

            // 继承列表属性到新节点
            const newPath = Path.next(path)
            Transforms.setNodes(
              editor,
              {
                property: {
                  ...(currentNode?.property || {}),
                  olul_obj: {
                    ...(olul_obj || {}),
                    olul_is_custom: false,
                    olul_prefix_no: olul_obj?.olul_prefix_no + 1 // 序号递增
                  }
                },
                style: {
                  ...setOlUlStyle(currentNode),
                  indent: newIndent
                }
              } as any,
              { at: newPath }
            )
          })
        }

        olulListSort([olul_obj?.olul_list_id], editor,-1,0)
        await sleep(50)
        focusSelection(editor, Path.next(path), 'start')
      }

      return true
    }

} catch (error) {
console.log('[有序无序快捷键enter]报错:', error)
}
}

import { Editor, Transforms } from 'slate'
import { olulListSort } from './sort'
import {
affectedListId,
getOlUlListMatch,
getSelectionNode,
handleType,
IOLUL_TYPE,
omit
} from './utils'
import { v4 } from 'uuid'
import { ELTYPE, ELTYPE_NUM } from '@/constant/enums/eltype'
import { moreLineByHTitle } from './olul-merge'
import { message } from 'antd'

/**

- 这里是有序无序转为其他的插件=>
- 1.  ~~去除property中的特殊属性olul_obj~~
- 2.  更新涉及到的列表的顺序
- 3.  功能根据H标题的需求进行调整，不再是有序无序简单转换
- @param params
  */
  export const floatMdOlUlToOther = params => {
  try {
  const { editor, curSelection = '', type } = params
  const historyLen = editor?.history?.undos?.length
  let listIdArr = []
  let switchArr = []
  Editor.withoutNormalizing(editor, () => {
  let selection = curSelection ? curSelection : editor?.selection ?? []
  const match = getOlUlListMatch(editor, true)

  const nodeEntries = getSelectionNode(editor, selection)
  console.log(nodeEntries)
  // 只H标题才传，其他的不管
  if (type) {
  switchArr = updateNode(editor, nodeEntries, type)
  } else {
  // 当转换到比如tuodilist时，就不会传type，这里只是去一次olul_obj，然后全部交给默认逻辑处理
  removeProperty(editor, nodeEntries)
  }

  // 需要判断选中的是否是同一种类型的文本
  // 如果是同一种类型的

  // 需要判断哪些是列表哪些不是列表
  if (match?.length) {
  listIdArr = affectedListId(match)
  }
  })
  listIdArr = listIdArr.concat(switchArr)
  setTimeout(() => {
  olulListSort(listIdArr, editor, historyLen)
  }, 30)
  } catch (error) {
  console.log(error)
  }
  }

/**

- 删除property中的olul_obj
- @param editor
- @param nodeEntries
  */
  const removeProperty = (editor, nodeEntries) => {
  try {
  for (const [node, path] of nodeEntries) {
  if (node?.property?.olul_obj) {
  const filteredProperties = omit(node?.property, ['olul_obj'])
  Transforms.setNodes(editor, { property: filteredProperties } as any, { at: path })
  }
  }
  } catch (error) {
  console.log(error)
  }
  }

/**

- 更新节点
- @param editor
- @param nodeEntries
- @param type 传递的节点的block_type_string
  */
  const updateNode = (editor, nodeEntries, type) => {
  try {
  console.log(type)
  const newNormalId = v4()
  const newHId = v4()

  // 判断选区，上下位置，然后尝试是否重连
  const elementType = getOlListType(nodeEntries, type)
  const isReserve = shouldReserve(nodeEntries, type)
  moreLineByHTitle({ editor, nodeEntries, type, elementType,isReserve })
  return

  // 选区内所有的将要被转为H的元素和转为P的分成两个不同的id去处理
  Editor.withoutNormalizing(editor, () => {
  for (let [node, path] of nodeEntries) {
  const nodeType = node?.block_type
  if (nodeType === type && node?.property?.olul_obj) {
  // 不能在这里直接加block_type block_type_string
  Transforms.setNodes(
  editor,
  {
  // block_type: ELTYPE_NUM.PARAGRAPH,
  // block_type_string: ELTYPE.PARAGRAPH,
  property: {
  ...node.property,
  olul_obj: {
  ...node.property.olul_obj,
  olul_list_id: newNormalId,
  olul_is_custom: false
  }
  }
  } as any,
  { at: path }
  )
  } else if (node?.property?.olul_obj) {
  console.log(node.block_type, newHId)
  Transforms.setNodes(
  editor,
  {
  // block_type: ELTYPE_NUM[type],
  // block_type_string: ELTYPE[ELTYPE_NUM[type]],
  property: {
  ...node.property,
  olul_obj: {
  ...node.property.olul_obj,
  olul_list_id: newHId,
  olul_is_custom: false
  }
  }
  } as any,
  { at: path }
  )
  }
  }
  })
  return [newHId, newNormalId]
  } catch (error) {
  console.log(error)
  return []
  }
  }

const getOlListType = (nodeEntries, type) => {
try {
let set = new Set()
const isReserve = shouldReserve(nodeEntries, type)
for (let [node, path] of nodeEntries) {
const tag = node?.property?.olul_obj?.olul_type === ELTYPE.OLLIST
if (isReserve && tag) {
set.add(IOLUL_TYPE.NORMAL)
} else if (!isReserve && tag) {
set.add(IOLUL_TYPE.H)
}
// if (node?.block_type === type && tag ) {
// set.add(IOLUL_TYPE.NORMAL)
// } else if(tag){
// set.add(IOLUL_TYPE.H)
// }
}
return handleType(set as any)
} catch (error) {
return IOLUL_TYPE.NONE
}
}

const shouldReserve = (nodeEntries: any[], type: any): boolean => {
try {
// 遍历所有节点
for (const [node] of nodeEntries) {
// 如果遇到一个节点的类型与传入类型不同，立即返回false
if (node?.block_type !== type) {
return false
}
}
// 所有节点类型都匹配时返回true
return true
} catch (error) {
// 发生错误时默认不反转
return false
}
}

import { Editor, Transforms } from 'slate'
import { getLevelToIndexMap, getOlUlListsByIds, getOlUlListSort, hBlockTypeString, updateValSpecial } from './utils'
import { milog } from '../milog'
import { sleep } from '../sleep'
import { ELTYPE } from '@/constant/enums/eltype'
import { message } from 'antd'
import { AdvancedRenderElement } from '@/constant/interfaces'
import { isPublicHistory } from '@/constant/enums/coop'

/**

- 其他场景
- @param param0
- @returns
  */
  const otherNode = ({ node, arr, editor, last, path, firstIndentNumber }) => {
  let result = firstIndentNumber
  if (node?.property?.olul_obj?.olul_is_custom && (node?.style?.indent ?? 0) !== 0) {
  arr.push({
  prefix_number: node.property.olul_obj?.olul_prefix_no,
  indent: node?.style?.indent ?? 0,
  })
  } else {
  Transforms.setNodes(
  editor,
  {
  property: {
  ...(node?.property || {}),
  olul_obj: {
  ...(node?.property?.olul_obj || {}),
  olul_prefix_no: last.prefix_number + 1,
  },
  },
  style: node?.style ?? {
  indent: 0,
  }
  } as any,
  { at: path }
  )
  arr.push({
  prefix_number: last.prefix_number + 1,
  indent: node?.style?.indent ?? 0,
  })
  }

  if (last.indent === 0) {
  result = last.prefix_number + 1
  }
  return result
  }

/**

- 存在父级的场景
- @param param0
  */
  const isParentNode = ({ arr, last, node, editor, path }) => {
  arr.push(last)
  if (node?.property?.olul_obj?.olul_is_custom) {
  arr.push({
  prefix_number: node?.property?.olul_obj?.olul_prefix_no,
  indent: node?.style?.indent ?? 0
  })
  } else {
  Transforms.setNodes(
  editor,
  {
  property: {
  ...(node?.property || {}),
  olul_obj: {
  ...(node?.property?.olul_obj || {}),
  olul_prefix_no: 1,
  }
  },
  style: node?.style ?? {
  indent: 0,
  }
  } as any,
  { at: path }
  )
  arr.push({
  prefix_number: 1,
  indent: node?.style?.indent ?? 0,
  })
  }
  }

const isBroNode = ({ node, arr, editor, lastElement, path }) => {
if (node?.property?.olul_obj?.olul_is_custom && (node?.style?.indent ?? 0) !== 0) {
arr.push({
prefix_number: node?.property?.olul_obj?.olul_prefix_no,
indent: node?.style?.indent ?? 0,
})
} else {
Transforms.setNodes(editor, {
property: {
...(node?.property || {}),
olul_obj: {
...(node?.property?.olul_obj || {}),
olul_prefix_no: lastElement.prefix_number + 1
}
},
style: node?.style ?? {
indent: 0,
}
} as any, { at: path })
arr.push({
prefix_number: lastElement.prefix_number + 1,
indent: node?.style?.indent ?? 0,
})
}
}

/**

- 存在子集的场景
- @param param0
- @returns
  */
  const isChildrenNode = ({ arr, node, editor, path, originIndentNumber }) => {
  let saveArr = []
  let firstIndentNumber = originIndentNumber
  // 遍历存储的数组
  while (arr.length) {
  // 获取最后一项
  let lastElement = arr.pop()
  // 如果是兄弟节点
  if (lastElement.indent === (node?.style?.indent ?? 0)) {
  // 如果当前节点的coustom为true，就自己开始重新编号，不是，则继承上一个编号

           isBroNode({ node, arr, editor, lastElement, path })

           // 如果是第一层，则会拆开列表，这里就不会出现custom的情况，不需要额外处理
           if (lastElement.indent === 0) {
               firstIndentNumber++
           }


           break

       } else if (arr.length === 0) {
           // 完全找不到，则就是第一层级，通过之前记住的firstIndentNumber，来计算最新的值
           Transforms.setNodes(
               editor,
               {
                   property: {
                       ...(node?.property || {}),
                       olul_obj: {
                           ...(node?.property?.olul_obj || {}),
                           olul_prefix_no: updateValSpecial(node, firstIndentNumber)
                       }
                   },
                   style: node?.style ?? {
                       indent: 0,
                   }
               } as any,
               { at: path }
           )

           arr.push({
               prefix_number: updateValSpecial(node, firstIndentNumber),
               indent: node?.style?.indent ?? 0,
           })
           if ((node?.style?.indent ?? 0) === 0) {
               firstIndentNumber++
           }
           break
       } else if (lastElement.indent < (node?.style?.indent ?? 0)) {
           saveArr.push(lastElement)
       }

  }
  arr.push(...saveArr.reverse())
  return firstIndentNumber
  }

/**

- for循环处理列表
- @param param0
  */
  const olulListLoop = ({ match, arr, editor, originNumber, originIndentNumber }) => {
  let startNumber = originNumber
  let firstIndentNumber = originIndentNumber
  for (let i = 0; i < match?.length; i++) {

       const [node, path] = match[i] as any
       if (hBlockTypeString.includes(node?.block_type_string)) {
           continue
       }
       // 列表中第一项
       if (arr.length === 0) {
           Transforms.setNodes(editor,
               {
                   property: {
                       ...(node?.property || {}),
                       olul_obj: {
                           ...(node?.property?.olul_obj || {}),
                           olul_prefix_no: startNumber + i,
                           olul_is_custom: i === 0 ? true : false
                       },

                   },
                   style: node?.style ?? {
                       indent: 0,
                   }
               } as any,
               { at: path })
           arr.push({
               prefix_number: startNumber + i,
               indent: node?.style?.indent ?? 0,
           })
       } else {
           // 取出当前数组的最接近目标的上一个列表节点
           const last = arr[arr.length - 1]
           // 前一个节点如果不是当前节点的父节点和兄弟节点
           if (last.indent > (node?.style?.indent ?? 0)) {
               firstIndentNumber = isChildrenNode({ arr, node, editor, path, originIndentNumber: firstIndentNumber })
           } else if (last.indent < (node?.style?.indent ?? 0)) {
               isParentNode({ arr, last, node, editor, path })
           } else {
               firstIndentNumber = otherNode({ arr, last, node, editor, path, firstIndentNumber })
           }
       }

  }
  }

/**

- 排序核心逻辑：其他的只管给正确的indent，剩下的操作在这里完成
- 需要约束可否缩进，可否变更当前的序号等等
- @param idList
- @param editor
- @param oldHistory
  */

export const olulListSort = async (idList: string[], editor, oldHistory = -1, delay = 30) => {
try {
// 改成可配置延时
// 协同后，在不需要延时的地方直接放弃延时
// 需要延时的如选区选中多个不同类型的block转换为列表，既要修改序号的属性也要去修改对应的插件，二者并不在一起处理
// 可能还会有些场景覆盖不到，但这是最小改动
// 想要完全和飞书一致，需要把更新操作转移到这里，在这里既要修改序号的属性也要去修改对应的插件，二者并不在一起处理，耦合在一起
if (delay) {
await sleep(delay)
}
// 去重
idList = Array.from(new Set(idList)).filter(id => id && id.trim() !== '');
if (!idList.length) return

        // 单次遍历批量查找所有 list_id 对应的节点，替代原来 N 次 getOlUlListById 全量遍历
        const allMatches = getOlUlListsByIds(editor, idList)

        Editor.withoutNormalizing(editor, () => {
            idList?.forEach((id, index) => {
                const match = allMatches.get(id)
                if (!match?.length) return


                const firstNode = match?.[0]?.[0] as AdvancedRenderElement
                if (firstNode?.block_type_string !== ELTYPE.PARAGRAPH) {
                    olListSortForH(match, editor, oldHistory)
                    return
                }


                let startNumber = Number(match?.[0]?.[0]?.property?.olul_obj?.olul_prefix_no)

                let firstIndentNumber = 0


                const isCustomItem = match?.[0]?.[0]?.property?.olul_obj?.olul_is_custom
                const isFirstIndent = (match?.[0]?.[0]?.style?.indent ?? 0) === 0

                const arr = []
                if (isFirstIndent) {
                    firstIndentNumber = startNumber
                }
                if (!isCustomItem) {
                    startNumber = 1
                }

                // milog.green('startNumber', startNumber)
                olulListLoop({ match, arr, editor, originNumber: startNumber, originIndentNumber: firstIndentNumber })


            })
            saveListHistory(editor, oldHistory)
        })

    } catch (error) {
        console.log('[有序无序更新列表]', error)
    }

}

const resetPrefixArr = (prefixArr, index) => {
try {
const len = prefixArr.length
for (let j = index + 1; j < len; j++) {
prefixArr[j] = 1;
}
return prefixArr;
} catch (error) {
return prefixArr;
}
}

const updateFirstHItem = ({ editor, node, collection, index, arr, path }) => {
try {
Editor.withoutNormalizing(editor, () => {
if (node?.property?.olul_obj?.olul_is_custom) {
collection[index] = node.property.olul_obj?.olul_prefix_no
resetPrefixArr(collection, index)
Transforms.setNodes(editor, {
property: {
...(node?.property || {}),
olul_obj: {
...(node?.property?.olul_obj || {}),
olul_prefix_no_string: collection.slice(0, index).join('.'),
}
}
} as any, { at: path })
arr.push({
prefix_number: node?.property?.olul_obj?.olul_prefix_no,
hsize: node?.block_type
})
} else {
collection[index] = 1
resetPrefixArr(collection, index)
Transforms.setNodes(editor, {
property: {
...(node?.property || {}),
olul_obj: {
...(node?.property?.olul_obj || {}),
olul_prefix_no_string: collection.slice(0, index).join('.'),
olul_prefix_no: 1,
}
}
} as any, { at: path })
arr.push({
prefix_number: 1,
hsize: node?.block_type
})
}
})
} catch (error) {
console.log(error)
}
}

const isSameLeaveH = ({ node, editor, collection, index, path, arr, lastElement }) => {
Editor.withoutNormalizing(editor, () => {
if (node?.property?.olul_obj?.olul_is_custom) {
collection[index] = node.property.olul_obj?.olul_prefix_no
resetPrefixArr(collection, index)
Transforms.setNodes(editor, {
property: {
...node.property,
olul_obj: {
...node.property.olul_obj,
olul_prefix_no: node.property.olul_obj?.olul_prefix_no,
olul_prefix_no_string: collection.slice(0, index).join('.'),
}
}
} as any, { at: path })
arr.push({
prefix_number: node.property.olul_obj?.olul_prefix_no,
hsize: node?.block_type,
})
} else {
collection[index] = lastElement.prefix_number + 1
resetPrefixArr(collection, index)
Transforms.setNodes(editor, {
property: {
...(node?.property || {}),
olul_obj: {
...(node?.property?.olul_obj || {}),
olul_prefix_no: lastElement.prefix_number + 1,
olul_prefix_no_string: collection.slice(0, index).join('.'),
}
}
} as any, { at: path })
arr.push({
prefix_number: lastElement.prefix_number + 1,
hsize: node?.block_type,
})
}
})
}

const notFindSameLeaveH = ({ editor, node, collection, index, path, arr }) => {
Editor.withoutNormalizing(editor, () => {
if (node?.property?.olul_obj?.olul_is_custom) {
collection[index] = node.property.olul_obj?.olul_prefix_no
resetPrefixArr(collection, index)
Transforms.setNodes(editor, {
property: {
...node.property,
olul_obj: {
...node.property.olul_obj,
olul_prefix_no_string: collection.slice(0, index).join('.'),
}
}
} as any, { at: path })
arr.push({
prefix_number: node.property.olul_obj?.olul_prefix_no,
hsize: node?.block_type,
})
} else {
collection[index] = 1
resetPrefixArr(collection, index)
Transforms.setNodes(editor, {
property: {
...(node?.property || {}),
olul_obj: {
...(node?.property?.olul_obj || {}),
olul_prefix_no_string: collection.slice(0, index).join('.'),
olul_prefix_no: 1,
}
}
} as any, { at: path })
arr.push({
prefix_number: 1,
hsize: node?.block_type,
})
}
})
}

const isImportantH = ({ editor, node, collection, index, path, arr }) => {
try {
Editor.withoutNormalizing(editor, () => {
if (node?.property?.olul_obj?.olul_is_custom) {
collection[index] = node.property.olul_obj?.olul_prefix_no
resetPrefixArr(collection, index)
Transforms.setNodes(editor, {
property: {
...node.property,
olul_obj: {
...node.property.olul_obj,
olul_prefix_no_string: collection.slice(0, index).join('.'),
}
}
} as any, { at: path })
arr.push({
prefix_number: node.property.olul_obj?.olul_prefix_no,
hsize: node?.block_type,
})
} else {
collection[index] = 1
resetPrefixArr(collection, index)
Transforms.setNodes(editor, {
property: {
...(node?.property || {}),
olul_obj: {
...(node?.property?.olul_obj || {}),
olul_prefix_no_string: collection.slice(0, index).join('.'),
olul_prefix_no: 1,
}
}
} as any, { at: path })
arr.push({
prefix_number: 1,
hsize: node?.block_type,
})
}
})
} catch (error) {
console.log(error)
}
}

const isHChildrenNode = ({ editor, node, arr, collection, index, path }) => {
try {
while (arr.length) {
let lastElement = arr.pop()
if (lastElement.hsize === node.block_type) {
isSameLeaveH({ node, editor, collection, index, path, arr, lastElement })
break;
} else if (lastElement.hsize < node.block_type) {
arr.push(lastElement)
isImportantH({ editor, node, collection, index, path, arr })
break
} else if (arr.length === 0) {
notFindSameLeaveH({ editor, node, collection, index, path, arr })
break;
}

        }
    } catch (error) {
        console.log(error)
    }

}

const olListHLoop = ({ levelToIndexMap, editor, match }) => {
// 获取当前节点前方的不小于它层级的H标题，根据他们的序号设置新的prefix_no_string，注意的是coustom场景
try {
Editor.withoutNormalizing(editor, () => {
const collection = new Array(levelToIndexMap.size).fill(1)
const arr = []
console.log('getLevelToIndexMap', levelToIndexMap)

        for (let i = 0; i < match.length; i++) {
            const [node, path] = match[i] as any
            console.log(node)

            // 获取当前节点的索引位置
            const index = levelToIndexMap.get(node.block_type)
            // 获取当前节点的原始前缀值
            // const originalPrefix = node.property.olul_obj.olul_prefix_no;
            // 更新prefixArr
            // collection[index] = originalPrefix; // 设置当前位置的值

            // 重置该索引之后的所有值为1
            // resetPrefixArr(collection, index)


            if (i === 0) {
                updateFirstHItem({ editor, node, collection, index, arr, path })
            } else {
                const last = arr[arr.length - 1]
                if (last.hsize > node.block_type) {
                    isHChildrenNode({ editor, node, arr, collection, index, path })
                } else if (last.hsize < node.block_type) {
                    isImportantH({ editor, node, collection, index, path, arr })
                } else if (last.hsize === node.block_type) {
                    isSameLeaveH({ node, editor, collection, index, path, arr, lastElement: last })
                }

            }


            }
        })
    } catch (error) {
        console.log(error)
    }

}

/**

- 排序核心逻辑
- 1.  首先判断当前列表中有多少个类型的H标题，用来添加前缀用的
- 2.  创建Map进行映射处理
- 3.  里面的自定义编号需要注意不修改
- @param match
- @param editor
- @param oldHistory
  */
  const olListSortForH = async (match, editor, oldHistory) => {
  try {
  await sleep(30)
  Editor.withoutNormalizing(editor, () => {
  let result = getOlUlListSort(match)
  result = result.sort((a: number, b: number) => { return a - b })
  // 创建映射：层级 -> 在result中的索引位置
  const levelToIndexMap = getLevelToIndexMap(result)
  olListHLoop({ levelToIndexMap, editor, match })
  saveListHistory(editor, oldHistory)

       })

  } catch (error) {
  console.log(error)
  }

}

/**

- 历史记录调整
- 场景：有序列表的序号修改舍弃中间态，直接调整到最新的状态
- 如果走多人协同，这块直接不需要处理，数据已经不在editor.history上了
- @param editor 编辑器实例
- @param oldLen 旧的历史记录长度
  */
  export const saveListHistory = (editor, oldLen?) => {
  try {
  // 不是多人共用历史记录，直接返回
  if(!isPublicHistory) return
  if (oldLen >= 0) {
  const undoArr = editor?.history?.undos ?? []
  const newLen = undoArr?.length ?? 0
  if (newLen > oldLen) {
  const arr = []
  undoArr.slice(oldLen).forEach(item => {
  arr.push(...item)
  })
  editor.history.undos = undoArr.slice(0, oldLen)
  editor.history.undos.push(arr)
  }
  }
  } catch (error) {
  console.log('[有序无序]历史记录方案错误', error)
  }
  }
  1
  a
  b
  c

1
i
a
a 现在给a缩进会导致产生两个a，这样改可以吗：const isChildrenNode = ({ arr, node, editor, path, originIndentNumber }) => {
let firstIndentNumber = originIndentNumber
const currentIndent = node?.style?.indent ?? 0

    while (arr.length) {
        const lastElement = arr.pop()

        // 当前节点和栈顶是同级
        if (lastElement.indent === currentIndent) {
            isBroNode({
                node,
                arr,
                editor,
                lastElement,
                path
            })

            if (lastElement.indent === 0) {
                firstIndentNumber++
            }

            break
        }

        // 找到了当前节点的父级
        if (lastElement.indent < currentIndent) {
            isParentNode({
                arr,
                last: lastElement,
                node,
                editor,
                path
            })

            break
        }

        // lastElement.indent > currentIndent
        // 说明当前栈顶已经比当前节点深，继续 pop。
        // 这个节点已经不属于当前节点的路径，不再恢复。
    }

    // 栈已经完全找不到父级
    if (arr.length === 0) {
        const prefixNumber = updateValSpecial(node, firstIndentNumber)

        Transforms.setNodes(
            editor,
            {
                property: {
                    ...(node?.property || {}),
                    olul_obj: {
                        ...(node?.property?.olul_obj || {}),
                        olul_prefix_no: prefixNumber
                    }
                },
                style: node?.style ?? {
                    indent: 0,
                }
            } as any,
            { at: path }
        )

        arr.push({
            prefix_number: prefixNumber,
            indent: currentIndent,
        })

        if (currentIndent === 0) {
            firstIndentNumber++
        }
    }

    return firstIndentNumber

}

// 根据需求转换数字为对应的 罗马字符/英文字符

import { ELTYPE, OL_UL_LIST_ITEM } from "@/constant/enums/eltype"
import { message } from "antd"
import { milog } from "../milog"
import { AdvancedRenderElement } from "@/constant/interfaces"

// 策略类型定义
type PrefixStrategy = {
[key: number]: string | ((value: string) => string);
};

// 有序列表策略
const OL_STRATEGY: PrefixStrategy = {
0: (value) => `${value}.`,
2: (value) => initToEnglish(Number(value)),
4: (value) => intToRoman(Number(value))
};

const OL_STRATEGY_Type: any = {
0: OL_UL_LIST_ITEM.LIST_NUMBER,
2: OL_UL_LIST_ITEM.LIST_ENGLISH,
4: OL_UL_LIST_ITEM.LIST_ROMAN
}

// 无序列表策略
const UL_STRATEGY: PrefixStrategy = {
0: '•',
2: '◦',
4: '▪'
};

const UL_STRATEGY_Type: PrefixStrategy = {
0: OL_UL_LIST_ITEM.List_DOT,
2: OL_UL_LIST_ITEM.LIST_CIRCLE,
4: OL_UL_LIST_ITEM.LIST_RECT
};

// 待删除，暂时保留
// export const getOlUlListPrefix = (node: AdvancedRenderElement | undefined, obj: any) => {
// try {
// if (node) {
// const indent = node?.style?.indent ?? 0;
// const resultVal = indent % 6;
// if (node.block_type_string !== ELTYPE.PARAGRAPH) return '';
// const isOlList = obj.listType === ELTYPE.OLLIST;
// const strategy = isOlList ? OL_STRATEGY_Type : UL_STRATEGY;
// return strategy[resultVal] ?? '';
// } else {
// const { listType, indent } = obj;
// const resultVal = indent % 6;
// const isOlList = listType === ELTYPE.OLLIST;
// const strategy = isOlList ? OL_STRATEGY_Type : UL_STRATEGY;
// return strategy[resultVal] ?? '';
// }

// } catch (error) {
// console.log(error)
// }

// }

/**

- 转换前缀方法
- @param indent 层级
- @param value 数值
- @param type 类型
- @returns
  */
  export const convertNumber = (
  indent: number,
  value: string | number,
  type: ELTYPE.OLLIST | ELTYPE.ULLIST
  ): string => {
  const resultVal = indent % 6;
  const strategy = type === ELTYPE.OLLIST ? OL_STRATEGY : UL_STRATEGY;
  const handler = strategy[resultVal];

  if (typeof handler === 'function') {
  return handler(value);
  }
  return handler || ''; // 处理静态值情况
  };

export const convertUlprefix = (indent: number, value?: string) => {
const resultVal = indent % 6;
const handler = UL_STRATEGY[resultVal];
return handler || '';
}

// 转为罗马字符
function intToRoman(num: number) {
const romanValues: [number, string][] = [
[1000, 'm'],
[900, 'cm'],
[500, 'd'],
[400, 'cd'],
[100, 'c'],
[90, 'xc'],
[50, 'l'],
[40, 'xl'],
[10, 'x'],
[9, 'ix'],
[5, 'v'],
[4, 'iv'],
[1, 'i']
]
if (isNaN(num) || num < 0 || num > 3999) return 'Invalid input' // 限制输入范围
var result = ''
for (var i = 0; i < romanValues.length; i++) {
while (num >= romanValues[i][0]) {
result += romanValues[i][1]
num -= romanValues[i][0]
}
}
return result + '.'
}

// 转为英文字符
function initToEnglish(num: number) {
let result = ''
while (num > 0) {
num-- // 调整为从1开始计数
let remainder = num % 26 // 计算余数
result = String.fromCharCode(97 + remainder) + result // 转换为小写字母并添加到结果前面
num = Math.floor(num / 26) // 更新num为商，用于下一次迭代
}
return result.length === 0 ? 'a.' : result + '.' // 如果结果为空，则返回'a'
}

/**

- H标题有序列表使用
- @param obj
- @returns
  */
  export const convertHtitle = (obj) => {
  if (obj?.olul_prefix_no_string) {
  return obj?.olul_prefix_no_string + '.' + obj?.olul_prefix_no
  }
  return obj?.olul_prefix_no + '.'
  }
