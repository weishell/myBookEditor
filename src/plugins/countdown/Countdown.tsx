import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Transforms } from 'slate';
import { ReactEditor, useSlateStatic } from 'slate-react';
import { ElementWrapper } from '../element-wrapper/ElementWrapper';
import { BlockElementType } from '@/enums';
import { useTheme } from '@/context/ThemeContext';
import { CountdownSettings } from './CountdownSettings';
import { computeRemaining, formatRemaining, type CountdownAttrs } from './countdown-utils';
import styles from './Countdown.module.less';

interface CountdownProps {
  attributes: any;
  children?: React.ReactNode;
  pluginId: string;
  element: { attrs: CountdownAttrs } & Record<string, any>;
}

export const ABBR = ['天', '时', '分', '秒'] as const;

// 铅笔（编辑入口，放在卡片右侧）
const PencilIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z" />
  </svg>
);

export const Countdown: React.FC<CountdownProps> = ({
  attributes,
  children,
  pluginId,
  element,
}) => {
  const editor = useSlateStatic();
  const { attrs } = element;
  const { isDarkMode, themeColor } = useTheme();

  const [nowMs, setNowMs] = useState(() => Date.now());
  const [editing, setEditing] = useState(false);
  const [bubble, setBubble] = useState(false);
  const notifiedRef = useRef(false);
  const bubbleTimerRef = useRef<number | null>(null);
  const attrsRef = useRef(attrs);
  attrsRef.current = attrs;

  // 每秒刷新剩余时间
  useEffect(() => {
    const timer = window.setInterval(() => setNowMs(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const remaining = computeRemaining(attrs.targetDate, nowMs);
  const formatted = formatRemaining(remaining);
  const units = [formatted.days, formatted.hours, formatted.minutes, formatted.seconds];

  // 到点后（若开启提醒）弹一次气泡
  useEffect(() => {
    if (remaining.finished && attrsRef.current.notify && !notifiedRef.current) {
      notifiedRef.current = true;
      setBubble(true);
      if (bubbleTimerRef.current !== null) window.clearTimeout(bubbleTimerRef.current);
      bubbleTimerRef.current = window.setTimeout(() => setBubble(false), 3000);
    }
  }, [remaining.finished]);

  useEffect(
    () => () => {
      if (bubbleTimerRef.current !== null) window.clearTimeout(bubbleTimerRef.current);
    },
    [],
  );

  const getPath = useCallback(() => {
    try {
      return ReactEditor.findPath(editor, element as any);
    } catch {
      return null;
    }
  }, [editor, element]);

  const handleConfirm = useCallback(
    (next: CountdownAttrs) => {
      const path = getPath();
      if (path) {
        Transforms.setNodes(editor, { attrs: next } as any, { at: path });
      }
      setEditing(false);
    },
    [editor, getPath],
  );

  const accent = isDarkMode ? '#5b8ff9' : themeColor;

  return (
    <ElementWrapper type={BlockElementType.COUNTDOWN} pluginId={pluginId} attributes={attributes}>
      <div
        className={`${styles.card} ${remaining.finished ? styles.cardFinished : ''}`}
        style={{ borderColor: isDarkMode ? '#2b3240' : 'rgba(31,35,41,0.14)' }}
        contentEditable={false}
        suppressContentEditableWarning={true}
      >
        <div className={styles.units}>
          {units.map((value, i) => (
            <React.Fragment key={i}>
              {i > 0 && (
                <span className={styles.separator} style={{ color: accent }}>
                  :
                </span>
              )}
              <div className={styles.unit}>
                <div className={styles.block} style={{ background: accent }}>
                  <span className={styles.num} key={value}>
                    {value}
                  </span>
                </div>
                <span className={styles.label}>{ABBR[i]}</span>
              </div>
            </React.Fragment>
          ))}
        </div>

        {remaining.finished && (
          <span className={styles.finishedTag} style={{ color: accent }}>
            已结束
          </span>
        )}

        <button
          className={styles.editBtn}
          title="编辑倒计时"
          onClick={(e) => {
            e.stopPropagation();
            setEditing(true);
          }}
        >
          <PencilIcon />
        </button>
      </div>

      {children}

      {editing &&
        createPortal(
          <CountdownSettings
            initial={attrs}
            onConfirm={handleConfirm}
            onCancel={() => setEditing(false)}
          />,
          document.body,
        )}

      {bubble &&
        createPortal(
          <div className={styles.bubble} style={{ ['--bc' as string]: accent }}>
            <span className={styles.bubbleIcon}>⏰</span> 倒计时结束
          </div>,
          document.body,
        )}
    </ElementWrapper>
  );
};
