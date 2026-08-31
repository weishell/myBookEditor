import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { durationToMs, type CountdownAttrs, type CountdownMode } from './countdown-utils';
import styles from './CountdownSettings.module.less';

interface CountdownSettingsProps {
  initial: CountdownAttrs;
  onConfirm: (attrs: CountdownAttrs) => void;
  onCancel: () => void;
}

const toLocalInput = (ms: number | null): string => {
  const d = new Date(ms ?? Date.now() + 24 * 3600000);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export const CountdownSettings: React.FC<CountdownSettingsProps> = ({
  initial,
  onConfirm,
  onCancel,
}) => {
  const { isDarkMode } = useTheme();
  const [mode, setMode] = useState<CountdownMode>(initial.mode || 'duration');
  const [dur, setDur] = useState({
    days: initial.duration?.days ?? 0,
    hours: initial.duration?.hours ?? 0,
    minutes: initial.duration?.minutes ?? 0,
    seconds: initial.duration?.seconds ?? 0,
  });
  const [datetimeStr, setDatetimeStr] = useState(() => toLocalInput(initial.targetDate));
  const [notify, setNotify] = useState(initial.notify !== false);
  const [error, setError] = useState('');

  // ESC 关闭
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onCancel]);

  const numberFieldClasses = useMemo(
    () => `${styles.numberInput} ${isDarkMode ? styles.numberInputDark : ''}`,
    [isDarkMode],
  );

  const setNum = useCallback((key: keyof typeof dur, num: string) => {
    const raw = num.replace(/\D/g, '');
    setDur((prev) => ({ ...prev, [key]: Math.min(Number(raw) || 0, 999) }));
  }, []);

  const handleConfirm = useCallback(() => {
    let targetDate: number | null = null;
    if (mode === 'duration') {
      const ms = durationToMs(dur);
      if (ms <= 0) {
        setError('倒计时时长需大于 0');
        return;
      }
      targetDate = Date.now() + ms;
    } else {
      const ts = new Date(datetimeStr).getTime();
      if (Number.isNaN(ts)) {
        setError('请选择有效的日期时间');
        return;
      }
      if (ts <= Date.now()) {
        setError('目标时间需在未来');
        return;
      }
      targetDate = ts;
    }
    onConfirm({ mode, duration: { ...dur }, targetDate, notify });
  }, [mode, dur, datetimeStr, notify, onConfirm]);

  const panelStyle = isDarkMode
    ? { backgroundColor: '#1f2430', borderColor: '#2b3240' }
    : { backgroundColor: '#fff', borderColor: 'rgba(31,35,41,0.12)' };

  return (
    <div className={styles.mask} onMouseDown={(e) => e.target === e.currentTarget && onCancel()}>
      <div className={styles.panel} style={panelStyle}>
        <div className={styles.header}>
          <span className={styles.title}>倒计时设置</span>
          <button className={styles.close} onClick={onCancel} aria-label="关闭">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* 模式选择 */}
        <div className={styles.modeGroup}>
          <label
            className={`${styles.modeOption} ${mode === 'duration' ? styles.modeOptionActive : ''}`}
            style={
              mode === 'duration' && !isDarkMode
                ? { borderColor: 'var(--theme-primary,#3370ff)' }
                : undefined
            }
          >
            <input
              type="radio"
              name="cd-mode"
              checked={mode === 'duration'}
              onChange={() => setMode('duration')}
            />
            <span className={styles.modeTitle}>输入倒计时时长</span>

            <div className={styles.durationRow}>
              {(
                [
                  ['days', '天'],
                  ['hours', '时'],
                  ['minutes', '分'],
                  ['seconds', '秒'],
                ] as const
              ).map(([key, unit]) => (
                <span key={key} className={styles.durationField}>
                  <input
                    type="text"
                    inputMode="numeric"
                    className={numberFieldClasses}
                    value={dur[key]}
                    disabled={mode !== 'duration'}
                    onChange={(e) => setNum(key, e.target.value)}
                    onFocus={(e) => e.target.select()}
                  />
                  <span className={styles.durationUnit}>{unit}</span>
                </span>
              ))}
            </div>
          </label>

          <label
            className={`${styles.modeOption} ${mode === 'datetime' ? styles.modeOptionActive : ''}`}
            style={
              mode === 'datetime' && !isDarkMode
                ? { borderColor: 'var(--theme-primary,#3370ff)' }
                : undefined
            }
          >
            <input
              type="radio"
              name="cd-mode"
              checked={mode === 'datetime'}
              onChange={() => setMode('datetime')}
            />
            <span className={styles.modeTitle}>倒计时到指定日期</span>

            <input
              type="datetime-local"
              className={numberFieldClasses}
              style={{ marginTop: 8, width: '100%', padding: '6px 8px' }}
              value={datetimeStr}
              disabled={mode !== 'datetime'}
              onChange={(e) => setDatetimeStr(e.target.value)}
            />
          </label>
        </div>

        {/* 提醒勾选 */}
        <label className={styles.notifyRow}>
          <input type="checkbox" checked={notify} onChange={(e) => setNotify(e.target.checked)} />
          <span>倒计时结束时显示气泡提醒</span>
        </label>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onCancel}>
            取消
          </button>
          <button className={styles.confirmBtn} onClick={handleConfirm}>
            确定
          </button>
        </div>
      </div>
    </div>
  );
};
