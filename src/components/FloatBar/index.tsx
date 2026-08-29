import { useState, useEffect, useCallback, useRef } from 'react';
import { useSlate } from 'slate-react';
import { Element } from 'slate';
import {
  toggleMark,
  toggleBlock,
  MarkTypes,
  setColor,
  setBackgroundColor,
  setFontFamily,
} from '@/plugins';
import { BlockElementType } from '@/enums';
import ColorPicker from '@/components/ColorPicker';
import FontPicker from '@/components/FontPicker';
import { ArtTextMenu } from '@/plugins/art-text';
import { insertTable } from '@/plugins/table/table-operations';
import { insertFormula, FormulaEditor } from '@/plugins';
import { insertHyperlink, HyperlinkEditor } from '@/plugins';
import styles from './FloatBar.module.less';
import { computeFloatBarPosition, TOOLBAR_WIDTH } from './layout';
import type { BlockType } from './blockType';
import { getActiveBlockType, resolveBlockTypeKey } from './blockType';
import { blockTypeIcon, blockTypeIconComponent } from './blockTypeIcons';

/**
 * 判断当前选区是否位于 HEADING_TITLE 独立标题块中
 * —— 独立标题中需要屏蔽全部 FloatBar 功能
 */
const isSelectionInHeadingTitle = (editor: any): boolean => {
  const { selection } = editor;
  if (!selection) return false;
  try {
    const [match] = Array.from(
      editor.nodes({
        at: selection,
        mode: 'lowest',
        match: (n: unknown) =>
          !editor.isEditor(n) &&
          Element.isElement(n) &&
          (n as any).type === BlockElementType.HEADING_TITLE,
      }),
    );
    return !!match;
  } catch {
    return false;
  }
};

// 重新导出，方便外部组件直接 import 此文件复用
export type { BlockType };
export { getActiveBlockType, resolveBlockTypeKey };

/** 合并菜单项 → toggleBlock 参数的映射 */
const CONVERT_TARGETS: Record<BlockType, { format: BlockElementType; level?: number }> = {
  paragraph: { format: BlockElementType.PARAGRAPH },
  h1: { format: BlockElementType.HEADING, level: 1 },
  h2: { format: BlockElementType.HEADING, level: 2 },
  h3: { format: BlockElementType.HEADING, level: 3 },
  h4: { format: BlockElementType.HEADING, level: 4 },
  h5: { format: BlockElementType.HEADING, level: 5 },
  h6: { format: BlockElementType.HEADING, level: 6 },
  h7: { format: BlockElementType.HEADING, level: 7 },
  h8: { format: BlockElementType.HEADING, level: 8 },
  h9: { format: BlockElementType.HEADING, level: 9 },
  numbered: { format: BlockElementType.NUMBERED_LIST },
  bulleted: { format: BlockElementType.BULLETED_LIST },
  todo: { format: BlockElementType.TODO_LIST },
  quote: { format: BlockElementType.BLOCKQUOTE },
  'code-block': { format: BlockElementType.CODE_BLOCK },
};

/**
 * 合并后的"块类型"下拉菜单（飞书同款：一行一项，主色高亮当前类型 + ✓ 对勾，
 * "其他标题"为右侧 hover 弹出的二级子菜单）。
 *
 * 内部用 React state 控制子菜单展开，避免 CSS :hover 跨越子菜单边界时掉层。
 */
interface BlockTypeDropdownProps {
  activeBlockKey: BlockType | null;
  onConvert: (key: BlockType) => void;
}

const BlockTypeDropdown = ({ activeBlockKey, onConvert }: BlockTypeDropdownProps) => {
  const [submenu, setSubmenu] = useState<'more' | null>(null);

  const closeSubmenu = () => setSubmenu(null);
  const openSubmenu = () => setSubmenu('more');

  const Item = ({
    Icon,
    label,
    target,
  }: {
    Icon: React.ComponentType<{ color?: string; size?: number }>;
    label: string;
    target: BlockType;
  }) => {
    const active = activeBlockKey === target;
    return (
      <button
        className={`${styles.menuItem} ${active ? styles.menuItemActive : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          onConvert(target);
        }}
      >
        <span className={styles.menuItemIcon}>
          <Icon size={16} />
        </span>
        <span className={styles.menuItemLabel}>{label}</span>
        {active && <span className={styles.menuItemCheck}>✓</span>}
      </button>
    );
  };

  // "其他标题"父项本身不可点（不能等同于某个具体级别），只承载子菜单
  const moreActive =
    activeBlockKey === 'h4' ||
    activeBlockKey === 'h5' ||
    activeBlockKey === 'h6' ||
    activeBlockKey === 'h7' ||
    activeBlockKey === 'h8' ||
    activeBlockKey === 'h9';

  return (
    <div className={`${styles.dropdown} ${styles.dropdownBlock}`}>
      <Item Icon={blockTypeIconComponent('paragraph')!} label="正文" target="paragraph" />
      <Item Icon={blockTypeIconComponent('h1')!} label="一级标题" target="h1" />
      <Item Icon={blockTypeIconComponent('h2')!} label="二级标题" target="h2" />
      <Item Icon={blockTypeIconComponent('h3')!} label="三级标题" target="h3" />

      <div
        className={`${styles.menuItemWithSub} ${submenu === 'more' ? styles.open : ''}`}
        onMouseEnter={openSubmenu}
        onMouseLeave={closeSubmenu}
      >
        <div className={`${styles.menuItem} ${moreActive ? styles.menuItemActive : ''}`}>
          <span className={styles.menuItemIcon}>
            {/* "Hn" 用文字版（无需独立 SVG），跟其它图标 16px 占位对齐 */}
            <span style={{ fontSize: 11, fontWeight: 'bold', color: 'currentColor' }}>Hn</span>
          </span>
          <span className={styles.menuItemLabel}>其他标题</span>
          {moreActive && <span className={styles.menuItemCheck}>✓</span>}
          <span className={styles.submenuArrow}>›</span>
        </div>
        {submenu === 'more' && (
          <div className={styles.submenu}>
            <Item Icon={blockTypeIconComponent('h4')!} label="四级标题" target="h4" />
            <Item Icon={blockTypeIconComponent('h5')!} label="五级标题" target="h5" />
            <Item Icon={blockTypeIconComponent('h6')!} label="六级标题" target="h6" />
            <Item Icon={blockTypeIconComponent('h7')!} label="七级标题" target="h7" />
            <Item Icon={blockTypeIconComponent('h8')!} label="八级标题" target="h8" />
            <Item Icon={blockTypeIconComponent('h9')!} label="九级标题" target="h9" />
          </div>
        )}
      </div>

      <div className={styles.dividerHorizontal} />
      <Item Icon={blockTypeIconComponent('numbered')!} label="有序列表" target="numbered" />
      <Item Icon={blockTypeIconComponent('bulleted')!} label="无序列表" target="bulleted" />
      <Item Icon={blockTypeIconComponent('todo')!} label="任务" target="todo" />

      <div className={styles.dividerHorizontal} />
      <Item Icon={blockTypeIconComponent('code-block')!} label="代码块" target="code-block" />
      <Item Icon={blockTypeIconComponent('quote')!} label="引用" target="quote" />
    </div>
  );
};

export default function FloatBar() {
  const editor = useSlate();
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  // 当前选区所在的块类型 key（用于合并菜单中主题色高亮 + ✓ 标记）。
  // 用本地 state 而不是 useSlate 派生：BookEditor 把 onChange 改成了 no-op，
  // 单靠 Slate 自身 context 不会触发重渲染。这里在 mouseup/selectionchange 里
  // 主动刷新，配合 onClick 触发块切换后的下一次 mouseup 自然同步。
  const [activeBlockKey, setActiveBlockKey] = useState<BlockType | null>(null);
  const [formulaOpen, setFormulaOpen] = useState(false);
  const [linkOpen, setLinkOpen] = useState(false);
  const toolbarRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);

  const calculatePosition = useCallback(() => {
    const selection = window.getSelection();
    // 文档纸张容器约束（<div data-paper> 在 core/index.tsx 里）；
    // 浮栏必须落在文档区域内，不跑到侧边栏/壁纸上去。
    // 每次重算都重新 querySelector，确保 DOM 变化（比如纸张宽度自适应窗口）时
    // 约束也始终是最新值。开销可忽略（RAF 节流 + 极少触发）。
    let containerClamp: { left: number; right: number } | undefined;
    if (typeof document !== 'undefined') {
      const paper = document.querySelector<HTMLElement>('[data-paper]');
      if (paper) {
        const r = paper.getBoundingClientRect();
        // 容器不可见或宽 < 浮栏宽度时跳过容器约束，退回单纯视口钳制
        if (r.width > TOOLBAR_WIDTH) {
          containerClamp = { left: r.left, right: r.right };
        }
      }
    }
    const next = computeFloatBarPosition(
      selection,
      { w: window.innerWidth, h: window.innerHeight },
      containerClamp,
    );
    if (!next) {
      setVisible(false);
      return;
    }
    setPosition(next);
    setVisible(true);
  }, []);

  const refreshActive = useCallback(() => {
    setActiveBlockKey(getActiveBlockType(editor));
  }, [editor]);

  useEffect(() => {
    const handleMouseUp = () => {
      // 公式/超链接编辑器打开时：不因选区变化收起 FloatBar（否则会连带卸载弹层）
      if (formulaOpen || linkOpen) return;
      // 等下一帧再算位置：确保选区/DOM 已稳定；同帧多次触发自动合并，不用拍脑袋的毫秒数
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null;
        calculatePosition();
        refreshActive();
      });
    };

    const handleSelectionChange = () => {
      // 公式/超链接编辑器打开时：保持 FloatBar 可见（避免点击输入框导致选区丢失而隐藏）
      if (formulaOpen || linkOpen) return;
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) {
        setVisible(false);
        return;
      }
      refreshActive();
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // 公式/超链接编辑器弹层也算浮层区域，点击不关闭 FloatBar
      if (
        !target.closest('.float-bar') &&
        !target.closest('[data-formula-editor]') &&
        !target.closest('[data-hyperlink-editor]')
      ) {
        setVisible(false);
        setActiveMenu(null);
        setFormulaOpen(false);
        setLinkOpen(false);
      }
    };

    let scrollRafId: number | null = null;
    const handleScroll = () => {
      if (scrollRafId !== null) return;
      scrollRafId = window.requestAnimationFrame(() => {
        scrollRafId = null;
        if (visible) {
          calculatePosition();
        }
      });
    };

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('selectionchange', handleSelectionChange);
    document.addEventListener('click', handleClick);
    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', handleScroll);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('selectionchange', handleSelectionChange);
      document.removeEventListener('click', handleClick);
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleScroll);
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
      if (scrollRafId !== null) {
        window.cancelAnimationFrame(scrollRafId);
      }
    };
    // refreshActive 也要进 deps：它是 useCallback([editor])，editor 引用稳定，
    // 所以不会导致监听器反复重挂；但 lint 规则要求闭包里用到的值都列出来。
  }, [calculatePosition, refreshActive, visible, formulaOpen, linkOpen]);

  // 选区在 HEADING_TITLE 独立标题中：完全不显示 FloatBar（禁用所有格式化能力）
  // 公式/超链接弹层打开时始终渲染，避免 FloatBar 提前 return null 导致弹层被卸载消失
  if ((!visible || isSelectionInHeadingTitle(editor)) && !formulaOpen && !linkOpen) return null;

  const handleFormatClick = (format: string, isMark: boolean, level?: number) => {
    const selection = window.getSelection();
    if (selection && !selection.isCollapsed) {
      if (isMark) {
        toggleMark(editor, format);
      } else {
        toggleBlock(editor, format as BlockElementType, level ? { level } : undefined);
      }
    }
    setActiveMenu(null);
  };

  const ToolButton = ({
    icon,
    label,
    onClick,
    hasDropdown,
    className,
    disabled,
  }: {
    icon: React.ReactNode;
    label?: string;
    onClick: () => void;
    hasDropdown?: boolean;
    className?: string;
    disabled?: boolean;
  }) => (
    <button
      onClick={(e) => {
        e.stopPropagation();
        if (!disabled) onClick();
      }}
      className={`${styles.toolButton} ${className || ''} ${disabled ? styles.disabled : ''}`}
      disabled={disabled}
    >
      {icon}
      {label && <span className={styles.toolButtonLabel}>{label}</span>}
      {hasDropdown && <span className={styles.dropdownArrow}>▼</span>}
    </button>
  );

  return (
    <div className="float-bar">
      <div
        ref={toolbarRef}
        className={styles.toolbar}
        style={{
          left: position.x,
          top: position.y,
        }}
      >
        <div className={styles.wrapper}>
          <ToolButton
            // 主工具栏的"块类型"按钮：跟随当前选区所在块动态变化（H5 → H5 图、
            // 有序列表 → OlListIcon，等等），无选区时 fallback 到 'T' 文本。
            icon={blockTypeIcon(activeBlockKey) ?? 'T'}
            onClick={() => setActiveMenu(activeMenu === 'block' ? null : 'block')}
            hasDropdown
          />
          {activeMenu === 'block' && (
            <BlockTypeDropdown
              activeBlockKey={activeBlockKey}
              onConvert={(key) => {
                const m = CONVERT_TARGETS[key];
                toggleBlock(editor, m.format, m.level ? { level: m.level } : undefined);
                // 主动同步高亮：core 把 onChange 改成了 no-op，不依赖 Slate 自身通知
                setActiveBlockKey(getActiveBlockType(editor));
                setActiveMenu(null);
              }}
            />
          )}
        </div>
        <div className={styles.divider} />
        <ToolButton
          icon={<span className={styles.iconBold}>B</span>}
          onClick={() => handleFormatClick(MarkTypes.BOLD, true)}
        />
        <ToolButton
          icon={<span className={styles.iconItalic}>I</span>}
          onClick={() => handleFormatClick(MarkTypes.ITALIC, true)}
        />
        <ToolButton
          icon={<span className={styles.iconUnderline}>U</span>}
          onClick={() => handleFormatClick(MarkTypes.UNDERLINE, true)}
        />
        <div className={styles.divider} />
        <ColorPicker
          onTextColorChange={(color) => {
            const selection = window.getSelection();
            if (selection && !selection.isCollapsed) {
              setColor(editor, color);
            }
          }}
          onBackgroundColorChange={(color) => {
            const selection = window.getSelection();
            if (selection && !selection.isCollapsed) {
              setBackgroundColor(editor, color);
            }
          }}
        />
        <div className={styles.divider} />
        <div className={styles.wrapper}>
          <ToolButton
            icon="Aa"
            label=""
            onClick={() => setActiveMenu(activeMenu === 'font' ? null : 'font')}
            hasDropdown
          />
          {activeMenu === 'font' && (
            <div className={`${styles.dropdown} ${styles.dropdownFont}`}>
              <FontPicker
                onFontChange={(family) => {
                  const selection = window.getSelection();
                  if (selection && !selection.isCollapsed) {
                    setFontFamily(editor, family || null);
                  }
                  setActiveMenu(null);
                }}
              />
            </div>
          )}
        </div>
        <div className={styles.divider} />
        <div className={styles.wrapper}>
          <ToolButton
            icon="🎨"
            onClick={() => setActiveMenu(activeMenu === 'art' ? null : 'art')}
            hasDropdown
          />
          <ArtTextMenu
            editor={editor}
            visible={activeMenu === 'art'}
            position={{ x: position.x + 180, y: position.y + 36 }}
            onClose={() => setActiveMenu(null)}
          />
        </div>
        <div className={styles.divider} />
        <ToolButton icon="{" onClick={() => handleFormatClick(MarkTypes.CODE, true)} />
        <ToolButton
          icon="“"
          onClick={() => handleFormatClick(BlockElementType.BLOCKQUOTE, false)}
        />
        <ToolButton
          icon="</>"
          onClick={() => handleFormatClick(BlockElementType.CODE_BLOCK, false)}
        />
        <ToolButton
          icon="∑"
          onClick={() => {
            setActiveMenu(null);
            setFormulaOpen(true);
          }}
        />
        <div className={styles.divider} />
        <ToolButton
          icon={
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="3" y1="9" x2="21" y2="9" />
              <line x1="9" y1="3" x2="9" y2="21" />
            </svg>
          }
          onClick={() => {
            insertTable(editor, 3, 3);
            setVisible(false);
          }}
        />
        <ToolButton
          icon="🔗"
          onClick={() => {
            setActiveMenu(null);
            setLinkOpen(true);
          }}
        />
        <ToolButton icon="💬" onClick={() => {}} disabled />
      </div>
      {formulaOpen && (
        <FormulaEditor
          initialValue=""
          anchorRef={toolbarRef}
          onCommit={(value) => {
            insertFormula(editor, value);
            setFormulaOpen(false);
            setVisible(false);
          }}
          onCancel={() => setFormulaOpen(false)}
        />
      )}
      {linkOpen && (
        <HyperlinkEditor
          initialText={window.getSelection()?.toString().trim() ?? ''}
          initialUrl=""
          anchorRef={toolbarRef}
          onCommit={(text, url) => {
            insertHyperlink(editor, { text, url });
            setLinkOpen(false);
            setVisible(false);
          }}
          onCancel={() => {
            setLinkOpen(false);
            setVisible(false);
          }}
        />
      )}
    </div>
  );
}
