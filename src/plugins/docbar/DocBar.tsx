import { useState, useCallback, useEffect, useRef } from 'react'
import { useDocBar } from '@/plugins/docbar-context'
import { useMenu } from '@/plugins/menu-context'
import { useSelection } from '@/plugins/selection-context'
import { BlockElementType } from '@/enums'

const getElementIcon = (type: BlockElementType): string => {
  switch (type) {
    case BlockElementType.HEADING_ONE:
    case BlockElementType.HEADING_TWO:
    case BlockElementType.HEADING_THREE:
      return 'H'
    case BlockElementType.BLOCKQUOTE:
      return '"'
    case BlockElementType.CODE_BLOCK:
      return '&lt;/&gt;'
    case BlockElementType.BULLETED_LIST:
    case BlockElementType.NUMBERED_LIST:
    case BlockElementType.LIST_ITEM:
      return '☰'
    default:
      return 'T'
  }
}

const getElementColor = (type: BlockElementType): string => {
  switch (type) {
    case BlockElementType.HEADING_ONE:
    case BlockElementType.HEADING_TWO:
    case BlockElementType.HEADING_THREE:
      return '#1890ff'
    case BlockElementType.BLOCKQUOTE:
      return '#faad14'
    case BlockElementType.CODE_BLOCK:
      return '#722ed1'
    case BlockElementType.BULLETED_LIST:
    case BlockElementType.NUMBERED_LIST:
    case BlockElementType.LIST_ITEM:
      return '#52c41a'
    default:
      return '#999'
  }
}

export const DocBar = () => {
  const { activeElement } = useDocBar()
  const { openMenu, closeMenu, hoveringMenu } = useMenu()
  const { hasSelection } = useSelection()
  const [iconHovered, setIconHovered] = useState(false)
  const timerRef = useRef<number | null>(null)
  const lastElementRef = useRef<typeof activeElement>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (hasSelection) {
      setIconHovered(false)
      closeMenu()
    }
  }, [hasSelection, closeMenu])

  useEffect(() => {
    if (activeElement) {
      lastElementRef.current = activeElement
    }
  }, [activeElement])

  useEffect(() => {
    if (hoveringMenu) {
      return
    }
    if (!activeElement && !iconHovered) {
      timerRef.current = window.setTimeout(() => {
        closeMenu()
      }, 100)
    }
  }, [activeElement, iconHovered, hoveringMenu, closeMenu])

  const handleIconMouseEnter = useCallback((e: React.MouseEvent) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
    setIconHovered(true)
    const rect = e.currentTarget.getBoundingClientRect()
    openMenu(lastElementRef.current?.id || '', rect.left + rect.width + 8, rect.top)
  }, [openMenu])

  const handleIconMouseLeave = useCallback(() => {
    setIconHovered(false)
    if (!hoveringMenu) {
      timerRef.current = window.setTimeout(() => {
        closeMenu()
      }, 200)
    }
  }, [hoveringMenu, closeMenu])

  const shouldShow = (activeElement || iconHovered || hoveringMenu) && !hasSelection

  const currentElement = activeElement || lastElementRef.current

  if (!shouldShow || !currentElement) {
    return null
  }

  return (
    <div
      data-docbar-area
      style={{
        position: 'fixed',
        left: currentElement.rect.left - 52,
        top: currentElement.rect.top + 4,
        height: '24px',
        display: 'flex',
        alignItems: 'center',
        zIndex: 1000,
        pointerEvents: 'auto',
      }}
      onMouseEnter={handleIconMouseEnter}
      onMouseLeave={handleIconMouseLeave}
    >
      <div
        style={{
          width: '24px',
          height: '24px',
          border: 'none',
          background: '#fff',
          borderRadius: '4px 0 0 4px',
          cursor: 'pointer',
          fontSize: '12px',
          color: getElementColor(currentElement.type),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.15s ease',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          padding: '0',
        }}
      >
        {getElementIcon(currentElement.type)}
      </div>
      <div
        style={{
          width: '24px',
          height: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#999',
          fontSize: '10px',
          cursor: 'move',
          borderRadius: '0 4px 4px 0',
          background: '#fff',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          transition: 'all 0.15s ease',
        }}
      >
        ⋮⋮
      </div>
    </div>
  )
}