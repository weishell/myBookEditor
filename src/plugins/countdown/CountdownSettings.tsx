import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/context/ThemeContext';
import { durationToMs, type CountdownAttrs, type CountdownMode } from './countdown-utils';
import { lockPageScroll } from '@/utils/scroll-lock';
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
  const { t } = useTranslation();
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

  // 弹层期间锁住页面滚动，隐藏背景页的滚动条，避免误拖
  useEffect(() => lockPageScroll(), []);

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
        setError(t('countdown.errorInvalidDuration'));
        return;
      }
      targetDate = Date.now() + ms;
    } else {
      const ts = new Date(datetimeStr).getTime();
      if (Number.isNaN(ts)) {
        setError(t('countdown.errorInvalidDate'));
        return;
      }
      if (ts <= Date.now()) {
        setError(t('countdown.errorPastDate'));
        return;
      }
      targetDate = ts;
    }
    onConfirm({ mode, duration: { ...dur }, targetDate, notify });
  }, [mode, dur, datetimeStr, notify, onConfirm, t]);

  const panelStyle = isDarkMode
    ? { backgroundColor: '#1f2430', borderColor: '#2b3240' }
    : { backgroundColor: '#fff', borderColor: 'rgba(31,35,41,0.12)' };

  return (
    <div className={styles.mask} onMouseDown={(e) => e.target === e.currentTarget && onCancel()}>
      <div className={styles.panel} style={panelStyle}>
        <div className={styles.header}>
          <span className={styles.title}>{t('countdown.title')}</span>
          <button className={styles.close} onClick={onCancel} aria-label={t('countdown.close')}>
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
            <span className={styles.modeTitle}>{t('countdown.durationMode')}</span>

            <div className={styles.durationRow}>
              {(
                [
                  ['days', 'countdown.units.days'],
                  ['hours', 'countdown.units.hours'],
                  ['minutes', 'countdown.units.minutes'],
                  ['seconds', 'countdown.units.seconds'],
                ] as const
              ).map(([key, unitKey]) => (
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
                  <span className={styles.durationUnit}>{t(unitKey)}</span>
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
            <span className={styles.modeTitle}>{t('countdown.dateMode')}</span>

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
          <span>{t('countdown.notify')}</span>
        </label>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onCancel}>
            {t('countdown.cancel')}
          </button>
          <button className={styles.confirmBtn} onClick={handleConfirm}>
            {t('countdown.confirm')}
          </button>
        </div>
      </div>
    </div>
  );
};
