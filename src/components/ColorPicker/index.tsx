// 颜色选择器（FloatBar 里的字体颜色/背景色按钮）
//
// 职责：
//   - 展示两组色块（字体色 / 高亮背景色），点击后通过回调把选中色
//     交回上层 FloatBar 写入 Slate marks（textColor / backgroundColor）。
//   - 色块按色系分组从深到浅排列，悬浮显示 antd Tooltip 展示 i18n 颜色名。
//   - Tooltip 采用 Z_INDEX_HIGHEST 档位 10010，高于面板 10001 避免被遮。
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tooltip } from 'antd';
import { Z_INDEX_HIGHEST } from '@/enums';
import styles from './ColorPicker.module.less';

interface ColorItem {
  id: string;
  value: string;
}

// 字体颜色：按色系分组排列，每组从深到浅，扁平化到一个网格
const FONT_COLORS: ColorItem[] = [
  // 无彩色
  { id: 'black', value: '#000000' },
  { id: 'darkGray', value: '#333333' },
  // 红色系
  { id: 'wine', value: '#c62828' },
  { id: 'red', value: '#ff0000' },
  // 橙色系
  { id: 'orangeRed', value: '#ff6600' },
  // 黄色系
  { id: 'golden', value: '#ffcc00' },
  { id: 'sandYellow', value: '#D1BA74' },
  // 绿色系
  { id: 'olive', value: '#669900' },
  { id: 'brightGreen', value: '#33cc00' },
  // 青色系
  { id: 'lightCyan', value: '#A0EEE1' },
  { id: 'iceBlue', value: '#BEE7E9' },
  // 蓝色系
  { id: 'lake', value: '#1377a8' },
  { id: 'blue', value: '#0066ff' },
  { id: 'skyBlue', value: '#00ccff' },
  // 紫色系
  { id: 'purple', value: '#9900ff' },
  { id: 'magenta', value: '#ff00ff' },
  // 棕色系
  { id: 'brown', value: '#996633' },
  { id: 'skin', value: '#ECAD9E' },
  { id: 'cream', value: '#E6CEAC' },
];

// 背景色：按色系分组排列，每组从深到浅，扁平化到一个网格
const BG_COLORS: ColorItem[] = [
  // 无色
  { id: 'none', value: '' },
  // 红色系
  { id: 'lightRed', value: '#ef9a9a' },
  { id: 'salmon', value: '#ffab91' },
  { id: 'bgPink', value: '#ffcdd2' },
  { id: 'paleRed', value: '#ffebee' },
  // 橙色系
  { id: 'lightOrange', value: '#ffcc80' },
  // 黄色系
  { id: 'goldenYellow', value: '#ffd54f' },
  { id: 'warmYellow', value: '#ffe082' },
  { id: 'lightYellow', value: '#fff1b8' },
  { id: 'wheat', value: '#fff59d' },
  { id: 'paleYellow', value: '#fff9c4' },
  // 绿色系
  { id: 'bgLightGreen', value: '#a5d6a7' },
  { id: 'paleGreen', value: '#c8e6c9' },
  { id: 'bgMint', value: '#b2dfdb' },
  // 蓝色系
  { id: 'lightBlue', value: '#bbdefb' },
  { id: 'brightBlue', value: '#b3e5fc' },
  { id: 'periwinkle', value: '#c5cae9' },
  // 紫色系
  { id: 'lightPurple', value: '#d1c4e9' },
  { id: 'purplePink', value: '#e1bee7' },
  { id: 'palePurple', value: '#f3e5f5' },
  // 粉色系
  { id: 'palePink', value: '#fce4ec' },
];

interface ColorPickerProps {
  onTextColorChange: (color: string | null) => void;
  onBackgroundColorChange: (color: string | null) => void;
}

export default function ColorPicker({
  onTextColorChange,
  onBackgroundColorChange,
}: ColorPickerProps) {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const handleTextColorClick = (color: string) => {
    onTextColorChange(color || null);
    setOpen(false);
  };

  const handleBackgroundColorClick = (color: string) => {
    onBackgroundColorChange(color || null);
    setOpen(false);
  };

  const handleReset = () => {
    onTextColorChange(null);
    onBackgroundColorChange(null);
    setOpen(false);
  };

  return (
    <div className={styles.picker}>
      <button
        className={styles.trigger}
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
      >
        <span className={styles.triggerIcon}>A</span>
        <span className={styles.arrow}>▼</span>
      </button>

      {open && (
        <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
          <div className={styles.sectionLabel}>{t('colorPicker.fontColor')}</div>
          <div className={styles.grid}>
            {FONT_COLORS.map((color) => (
              <Tooltip
                key={color.id}
                title={t(`colorPicker.fontColorNames.${color.id}`)}
                mouseLeaveDelay={0}
                zIndex={Z_INDEX_HIGHEST}
                placement="top"
              >
                <button
                  className={styles.fontSwatch}
                  style={{ color: color.value }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTextColorClick(color.value);
                  }}
                >
                  A
                </button>
              </Tooltip>
            ))}
          </div>

          <div className={styles.sectionLabel} style={{ marginTop: '12px' }}>
            {t('colorPicker.backgroundColor')}
          </div>
          <div className={styles.grid}>
            {BG_COLORS.map((color) => (
              <Tooltip
                key={color.id}
                title={t(`colorPicker.bgColorNames.${color.id}`)}
                mouseLeaveDelay={0}
                zIndex={Z_INDEX_HIGHEST}
                placement="top"
              >
                <button
                  className={`${styles.bgSwatch} ${!color.value ? styles.bgSwatchEmpty : ''}`}
                  style={{ backgroundColor: color.value || '#fff' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBackgroundColorClick(color.value);
                  }}
                />
              </Tooltip>
            ))}
          </div>

          <button
            className={styles.reset}
            onClick={(e) => {
              e.stopPropagation();
              handleReset();
            }}
          >
            {t('colorPicker.reset')}
          </button>
        </div>
      )}
    </div>
  );
}
