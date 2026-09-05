import React, { useEffect, useState } from 'react';
import { CHART_KINDS, type ChartKind, type ChartKindMeta } from './chart-utils';
import styles from './ChartTypePicker.module.less';

interface ChartTypePickerProps {
  onPick: (kind: ChartKind, variant: string) => void;
  onCancel: () => void;
}

/** 类型选择弹框：图文卡片列出各图表大类，选中大类后再选子类型 */
export const ChartTypePicker: React.FC<ChartTypePickerProps> = ({ onPick, onCancel }) => {
  const [selected, setSelected] = useState<ChartKindMeta | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onCancel]);

  return (
    <div className={styles.overlay}>
      <div className={styles.panel}>
        <div className={styles.header}>
          <span className={styles.headerTitle}>插入图表</span>
          <button className={styles.closeBtn} onClick={onCancel} title="关闭">
            ×
          </button>
        </div>

        {!selected ? (
          <div className={styles.kindGrid}>
            {CHART_KINDS.map((k) => (
              <button key={k.kind} className={styles.kindCard} onClick={() => setSelected(k)}>
                <span className={styles.kindIcon}>{k.icon}</span>
                <span className={styles.kindLabel}>{k.label}</span>
                <span className={styles.kindDesc}>{k.desc}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className={styles.variantBody}>
            <div className={styles.variantBreadcrumb}>
              <button className={styles.backBtn} onClick={() => setSelected(null)}>
                ← 返回
              </button>
              <span className={styles.currentKind}>{selected.label}</span>
            </div>
            <div className={styles.variantGrid}>
              {selected.variants.map((v) => (
                <button
                  key={v.type}
                  className={styles.variantCard}
                  onClick={() => onPick(selected.kind, v.type)}
                >
                  <span className={styles.variantIcon}>{selected.icon}</span>
                  <span className={styles.variantName}>{v.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
