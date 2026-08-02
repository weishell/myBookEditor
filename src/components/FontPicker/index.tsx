// 字体选择面板（FontPicker）—— 可复用组件
//
// 职责：
//   - 展示内置字体列表（系统字体 + web 字体）
//   - 每个字体项用该字体自身渲染字体名，方便预览效果
//   - 点击后回调 onFontChange，由调用方决定作用域（块级/表格/text mark）
//   - web 字体点击前自动 loadFont，加载完再回调
//
// 复用场景：
//   - DocBar 的 ContextMenu（插件层：块级 / 表格级字体切换）
//   - FloatBar（Text 层：选区文字字体 mark）
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tooltip } from 'antd';
import { FONT_LIST, DEFAULT_FONT_ID, loadFont, type FontDefinition } from '@/plugins/font';
import styles from './FontPicker.module.less';

interface FontPickerProps {
  /** 当前激活的字体 family（用于高亮） */
  activeFamily?: string;
  /** 字体选择回调，传空字符串表示清除字体（恢复默认） */
  onFontChange: (fontFamily: string) => void;
}

export default function FontPicker({ activeFamily, onFontChange }: FontPickerProps) {
  const { t } = useTranslation();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleFontClick = async (font: FontDefinition) => {
    if (font.id === DEFAULT_FONT_ID) {
      onFontChange('');
      return;
    }

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

    onFontChange(font.family);
  };

  return (
    <div className={styles.picker}>
      {FONT_LIST.map((font) => {
        const isActive = activeFamily === font.family;
        const isDefault = font.id === DEFAULT_FONT_ID;
        const isLoading = loadingId === font.id;

        return (
          <Tooltip
            key={font.id}
            title={
              isDefault
                ? t('fontSwitcher.reset')
                : font.category === 'web'
                  ? t('fontSwitcher.webFont')
                  : t('fontSwitcher.systemFont')
            }
            mouseLeaveDelay={0}
            placement="right"
          >
            <button
              className={`${styles.item} ${isActive ? styles.itemActive : ''}`}
              onClick={() => handleFontClick(font)}
              disabled={isLoading}
              style={{ fontFamily: isDefault ? undefined : font.family }}
            >
              <span className={styles.name}>{t(`fontSwitcher.names.${font.id}`)}</span>
              {isLoading && <span className={styles.loading}>···</span>}
              {font.category === 'web' && !isLoading && <span className={styles.badge}>Web</span>}
            </button>
          </Tooltip>
        );
      })}
    </div>
  );
}
