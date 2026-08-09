// 全局字体切换器（FontSwitcher）—— 全局层
//
// 放在 App header 中，和 ThemeSwitcher / ModeSwitcher / LanguageSwitcher 并列。
// 点击展开字体下拉，选择后设置全局默认字体（EditorContext.globalFont）。
//
// 三层字体优先级：
//   1. Text 层（mark.fontFamily）—— FloatBar 控制，最高优先
//   2. 插件层（block attrs.fontFamily）—— DocBar ContextMenu 控制
//   3. 全局层（globalFont）—— 本组件控制，作为编辑器容器的默认 font-family
//
// 本组件只设 globalFont，不改任何 block 的 attrs，因此：
//   - 改全局字体会立即生效到所有"未单独设字体"的 block
//   - 已用 DocBar 单独设过字体的 block 不受影响
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dropdown, type MenuProps } from 'antd';
import { Transforms, Text } from 'slate';
import { FONT_LIST, DEFAULT_FONT_ID, loadFont, getFontById } from '@/plugins/font';
import { useEditorMode } from '@/context/EditorContext';
import styles from './FontSwitcher.module.less';

export default function FontSwitcher() {
  const { t } = useTranslation();
  const { editor, globalFont, setGlobalFont } = useEditorMode();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // 当前全局字体对应的 font id
  const currentFontId = FONT_LIST.find((f) => f.family === globalFont)?.id || DEFAULT_FONT_ID;

  // 清除全文 text 层的 fontFamily mark
  // 改全局字体时，抹去 text 层旧 mark，否则 mark 会覆盖全局新字体
  const clearAllTextFontMarks = () => {
    if (!editor) return;
    Transforms.unsetNodes(editor, 'fontFamily', {
      at: [],
      match: (n) => Text.isText(n),
    });
  };

  const handleFontClick = async (fontId: string) => {
    const font = getFontById(fontId);
    if (!font) return;

    // 默认字体 = 恢复继承
    if (font.id === DEFAULT_FONT_ID) {
      setGlobalFont('inherit');
      clearAllTextFontMarks();
      return;
    }

    // web 字体先加载
    if (font.category === 'web' && font.url) {
      setLoadingId(font.id);
      try {
        await loadFont(font);
      } catch (e) {
        console.error('字体加载失败:', font.id, e);
      } finally {
        setLoadingId(null);
      }
    }

    setGlobalFont(font.family);
    // 改全局字体时清除全文 text mark，让全局字体生效
    clearAllTextFontMarks();
  };

  const menuItems: MenuProps['items'] = FONT_LIST.map((font) => {
    const isActive = currentFontId === font.id;
    const isDefault = font.id === DEFAULT_FONT_ID;
    const isLoading = loadingId === font.id;

    return {
      key: font.id,
      label: (
        <span
          style={{
            fontFamily: isDefault ? undefined : font.family,
            color: isActive ? 'var(--theme-primary)' : undefined,
            fontWeight: isActive ? 500 : 400,
          }}
        >
          {isDefault ? t('fontSwitcher.names.default') : t(`fontSwitcher.names.${font.id}`)}
          {font.category === 'web' && (
            <span style={{ marginLeft: 8, fontSize: 10, color: '#999' }}>
              {isLoading ? '···' : 'Web'}
            </span>
          )}
        </span>
      ),
      onClick: () => handleFontClick(font.id),
      disabled: isLoading,
    };
  });

  return (
    <Dropdown menu={{ items: menuItems }} trigger={['click']} placement="bottomRight">
      <button className={styles.button} title={t('fontSwitcher.title')}>
        <span className={styles.icon}>Aa</span>
        <span className={styles.label}>
          {currentFontId !== DEFAULT_FONT_ID
            ? t(`fontSwitcher.names.${currentFontId}`)
            : t('fontSwitcher.names.default')}
        </span>
        <span className={styles.arrow}>▾</span>
      </button>
    </Dropdown>
  );
}
