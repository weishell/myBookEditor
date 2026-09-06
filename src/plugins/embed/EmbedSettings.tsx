// 内嵌网页设置弹框 —— 填写网址 + 高度，确认后写回块 attrs
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { normalizeEmbedUrl, type EmbedAttrs } from './embed-node';
import styles from './Embed.module.less';

interface EmbedSettingsProps {
  initial: EmbedAttrs;
  /** 确认回调：url 已补全协议；为空串表示清除 */
  onConfirm: (attrs: EmbedAttrs) => void;
  onCancel: () => void;
}

export const EmbedSettings: React.FC<EmbedSettingsProps> = ({ initial, onConfirm, onCancel }) => {
  const [url, setUrl] = useState(initial.url);
  const [height, setHeight] = useState(String(initial.height));
  const [error, setError] = useState('');

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onCancel]);

  const handleConfirm = () => {
    const nextUrl = normalizeEmbedUrl(url);
    if (!nextUrl) {
      setError('请输入有效的网站地址，例如：example.com 或 https://example.com');
      return;
    }
    const h = Math.min(2000, Math.max(120, Math.floor(Number(height)) || 400));
    onConfirm({ url: nextUrl, height: h });
  };

  return createPortal(
    <div className={styles.settingsMask} onMouseDown={onCancel}>
      <div
        className={styles.settingsPanel}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.settingsTitle}>内嵌网页</div>

        <label className={styles.fieldLabel}>网站地址</label>
        <input
          className={styles.urlInput}
          autoFocus
          placeholder="example.com 或 https://example.com"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            setError('');
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleConfirm();
          }}
        />

        <label className={styles.fieldLabel}>高度（px，120 - 2000）</label>
        <input
          className={styles.heightInput}
          type="number"
          min={120}
          max={2000}
          value={height}
          onChange={(e) => setHeight(e.target.value)}
        />

        {error && <div className={styles.settingsError}>{error}</div>}

        <div className={styles.settingsActions}>
          <button className={styles.btnGhost} onClick={onCancel}>
            取消
          </button>
          <button className={styles.btnPrimary} onClick={handleConfirm}>
            确定
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};
