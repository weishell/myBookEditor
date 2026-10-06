import React, { useCallback, useMemo, useRef, useState } from 'react';
import { ReactEditor, useSlateStatic } from 'slate-react';
import { useTranslation } from 'react-i18next';
import { ElementWrapper } from '@/plugins/element-wrapper/ElementWrapper';
import { BlockElementType } from '@/enums';
import {
  buildMonthGrid,
  buildWeekLayout,
  formatDate,
  addDays,
  todayKey,
  eventSpanDays,
  type DayCell,
  type EventSegment,
  type CalendarEvent as EventLike,
} from './calendar-utils';
import {
  normalizeCalendarAttrs,
  createEvent,
  writeCalendarAttrs,
  shiftMonth,
  addCalendarEvent,
  updateCalendarEvent,
  removeCalendarEvent,
  type CalendarAttrs,
  type CalendarElement,
} from './calendar-node';
import styles from './Calendar.module.less';

interface CalendarProps {
  attributes: any;
  children?: React.ReactNode;
  pluginId?: string;
  element: { attrs: CalendarAttrs } & Record<string, any>;
}

const MAX_LANES = 3;
const BAR_H = 18; // 与 less 里 --bar-h 保持一致

/** 按当前语言格式化「2026年10月」/ "October 2026" 式的月份标题 */
const formatMonthTitle = (tag: string, year: number, month: number): string =>
  new Intl.DateTimeFormat(tag || 'zh', { year: 'numeric', month: 'long' }).format(
    new Date(year, month - 1, 1),
  );

/** 按当前语言格式化日期（不含星期），如 2026年9月10日 / September 10, 2026 */
const formatLocaleDate = (tag: string, d: Date): string =>
  new Intl.DateTimeFormat(tag || 'zh', { year: 'numeric', month: 'long', day: 'numeric' }).format(
    d,
  );

/** 按当前语言格式化星期短名，如 周四 / Thu */
const formatLocaleWeekday = (tag: string, d: Date): string =>
  new Intl.DateTimeFormat(tag || 'zh', { weekday: 'short' }).format(d);

type PanelState =
  | { mode: 'create'; dayKey: string }
  | { mode: 'view'; eventId: string }
  | { mode: 'edit'; eventId: string }
  | null;

/** 双击判定间隔（毫秒）：两次点击同一格且在此间隔内 → 视为双击 */
const DBL_CLICK_MS = 350;

export const Calendar: React.FC<CalendarProps> = ({ attributes, children, pluginId, element }) => {
  const editor = useSlateStatic();
  const { t, i18n } = useTranslation();
  const localeTag = i18n.language || 'zh';
  // 星期表头（周一 → 周日），随语言变化
  const weekdayHeads = t('calendar.weekdays', { returnObjects: true }) as unknown as string[];
  // attrs 可能来自外部粘贴/旧版本文档，渲染前兜底一次（normalizeNode 也会修）
  const attrs = useMemo(() => normalizeCalendarAttrs(element.attrs), [element.attrs]);
  const [panel, setPanel] = useState<PanelState>(null);
  const lastDayClickRef = useRef<{ key: string; t: number } | null>(null);

  const grid = useMemo(
    () =>
      buildMonthGrid(attrs.year, attrs.month, {
        showLunar: attrs.showLunar,
        showTerm: attrs.showTerm,
      }),
    [attrs.year, attrs.month, attrs.showLunar, attrs.showTerm],
  );
  const rows = useMemo(() => buildWeekLayout(grid, attrs.events, MAX_LANES), [grid, attrs.events]);

  // 单元格：单击不动作（等待第二击），双击 → 新建日程
  const handleDayClick = useCallback((key: string) => {
    const now = Date.now();
    const last = lastDayClickRef.current;
    if (last && last.key === key && now - last.t < DBL_CLICK_MS) {
      lastDayClickRef.current = null;
      setPanel({ mode: 'create', dayKey: key });
    } else {
      lastDayClickRef.current = { key, t: now };
    }
  }, []);

  const getPath = useCallback(() => {
    try {
      return ReactEditor.findPath(editor, element as any);
    } catch {
      return null;
    }
  }, [editor, element]);

  const goMonth = (delta: number) => {
    const nm = shiftMonth(attrs.year, attrs.month, delta);
    const path = getPath();
    if (path) writeCalendarAttrs(editor, path, { ...attrs, year: nm.year, month: nm.month });
    setPanel(null);
  };

  const goToday = () => {
    const d = new Date();
    const path = getPath();
    if (path)
      writeCalendarAttrs(editor, path, {
        ...attrs,
        year: d.getFullYear(),
        month: d.getMonth() + 1,
      });
    setPanel(null);
  };

  const toggleFlag = (key: 'showLunar' | 'showTerm') => {
    const path = getPath();
    if (path) writeCalendarAttrs(editor, path, { ...attrs, [key]: !attrs[key] });
  };

  const handleSave = (payload: { title: string; start: string; end: string; color: string }) => {
    const path = getPath();
    if (!path) return;
    const ev = createEvent(payload.start, payload.end, payload.title, payload.color);
    addCalendarEvent(editor, path, attrs, ev);
    setPanel(null);
  };

  const handleUpdate = (
    id: string,
    payload: { title: string; start: string; end: string; color: string },
  ) => {
    const path = getPath();
    if (!path) return;
    const old = attrs.events.find((e) => e.id === id);
    if (!old) return;
    const updated = {
      ...old,
      title: payload.title.trim() || old.title,
      start: payload.start,
      end: payload.end,
      color: payload.color,
    };
    // 由 createEvent 里的 normalizeRange 语义：这里手动保证 start<=end
    if (updated.start > updated.end) {
      const t = updated.start;
      updated.start = updated.end;
      updated.end = t;
    }
    updateCalendarEvent(editor, path, attrs, updated);
    setPanel(null);
  };

  const handleDelete = (id: string) => {
    const path = getPath();
    if (path) removeCalendarEvent(editor, path, attrs, id);
    setPanel(null);
  };

  // 单击日程条 → 只读查看
  const viewEvent =
    panel?.mode === 'view' ? attrs.events.find((e) => e.id === panel.eventId) || null : null;
  const editEvent =
    panel?.mode === 'edit' ? attrs.events.find((e) => e.id === panel.eventId) || null : null;
  // 正在查看/编辑的日程 id（用于日程条高亮）
  const activeEventId =
    panel?.mode === 'view' || panel?.mode === 'edit' ? panel.eventId : undefined;

  return (
    <ElementWrapper type={BlockElementType.CALENDAR} pluginId={pluginId} attributes={attributes}>
      <div
        data-visual-root
        className={styles.calendar}
        contentEditable={false}
        suppressContentEditableWarning
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* 头部 */}
        <div className={styles.header}>
          <button
            type="button"
            className={styles.iconBtn}
            title={t('calendar.prevMonth')}
            onClick={() => goMonth(-1)}
          >
            ‹
          </button>
          <span className={styles.title}>
            {formatMonthTitle(localeTag, attrs.year, attrs.month)}
          </span>
          <button
            type="button"
            className={styles.iconBtn}
            title={t('calendar.nextMonth')}
            onClick={() => goMonth(1)}
          >
            ›
          </button>
          <button type="button" className={styles.todayBtn} onClick={goToday}>
            {t('calendar.today')}
          </button>
          <span className={styles.spacer} />
          <button
            type="button"
            className={`${styles.toggle} ${attrs.showLunar ? styles.toggleOn : ''}`}
            title={t('calendar.showLunar')}
            onClick={() => toggleFlag('showLunar')}
          >
            {t('calendar.lunar')}
          </button>
          <button
            type="button"
            className={`${styles.toggle} ${attrs.showTerm ? styles.toggleOn : ''}`}
            title={t('calendar.showTerm')}
            onClick={() => toggleFlag('showTerm')}
          >
            {t('calendar.term')}
          </button>
        </div>

        {/* 星期栏 */}
        <div className={styles.weekdays}>
          {weekdayHeads.map((w, i) => (
            <div key={i} className={i >= 5 ? styles.weekendHead : undefined}>
              {w}
            </div>
          ))}
        </div>

        {/* 6 个周行 */}
        <div className={styles.body}>
          {rows.map((row) => (
            <WeekRowView
              key={`${attrs.year}-${attrs.month}-${row.index}`}
              rowIndex={row.index}
              segments={row.segments}
              overflow={row.overflow}
              activeEventId={activeEventId}
              onView={(eventId) => setPanel({ mode: 'view', eventId })}
            >
              {row.days.map((cell) => (
                <DayCellView key={cell.key} cell={cell} onPickDay={handleDayClick} />
              ))}
            </WeekRowView>
          ))}
        </div>

        {/* 查看面板：单击日程条 → 展示日程数据 */}
        {panel?.mode === 'view' && viewEvent && (
          <EventDetail
            key={`v-${viewEvent.id}`}
            event={viewEvent}
            onEdit={() => setPanel({ mode: 'edit', eventId: viewEvent.id })}
            onDelete={() => handleDelete(viewEvent.id)}
            onClose={() => setPanel(null)}
          />
        )}

        {/* 新建 / 编辑面板 */}
        {panel && (panel.mode === 'create' || (panel.mode === 'edit' && editEvent)) && (
          <EventEditor
            key={panel.mode === 'edit' ? `e-${editEvent!.id}` : `c-${panel.dayKey}`}
            mode={panel.mode === 'create' ? 'create' : 'edit'}
            dayKey={panel.mode === 'create' ? panel.dayKey : undefined}
            event={editEvent}
            onSave={(p) =>
              panel.mode === 'edit' && editEvent ? handleUpdate(editEvent.id, p) : handleSave(p)
            }
            onDelete={
              panel.mode === 'edit' && editEvent ? () => handleDelete(editEvent.id) : undefined
            }
            onCancel={() => setPanel(null)}
          />
        )}
      </div>

      {children}
    </ElementWrapper>
  );
};

// ============ 周行 ============

interface WeekRowViewProps {
  rowIndex: number;
  segments: EventSegment[];
  overflow: number;
  activeEventId?: string;
  onView: (eventId: string) => void;
  children: React.ReactNode;
}

const WeekRowView: React.FC<WeekRowViewProps> = ({
  rowIndex,
  segments,
  overflow,
  activeEventId,
  onView,
  children,
}) => {
  const { t } = useTranslation();
  return (
    <div className={styles.weekRow}>
      {children}
      <div className={styles.eventLayer}>
        {segments.map((seg) => {
          const span = seg.endCol - seg.startCol + 1;
          const leftPct = (seg.startCol / 7) * 100;
          const widthPct = (span / 7) * 100;
          return (
            <div
              key={`${seg.event.id}-${rowIndex}`}
              className={[
                styles.eventBar,
                !seg.isStart ? styles.barContinuesLeft : '',
                !seg.isEnd ? styles.barContinuesRight : '',
                seg.event.id === activeEventId ? styles.barActive : '',
              ]
                .filter(Boolean)
                .join(' ')}
              style={{
                left: `calc(${leftPct}% + 2px)`,
                width: `calc(${widthPct}% - 4px)`,
                top: seg.lane * (BAR_H + 3) + 1,
                backgroundColor: seg.event.color,
              }}
              title={
                seg.event.start !== seg.event.end
                  ? t('calendar.eventRangeTitle', {
                      title: seg.event.title,
                      range: `${seg.event.start} ~ ${seg.event.end}`,
                    })
                  : seg.event.title
              }
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                onView(seg.event.id);
              }}
            >
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {seg.event.title}
              </span>
            </div>
          );
        })}
        {overflow > 0 && (
          <span className={styles.overflowTip} style={{ top: MAX_LANES * (BAR_H + 3) + 1 }}>
            +{overflow}
          </span>
        )}
      </div>
    </div>
  );
};

// ============ 日期格子 ============

interface DayCellViewProps {
  cell: DayCell;
  onPickDay: (dayKey: string) => void;
}

const DayCellView: React.FC<DayCellViewProps> = ({ cell, onPickDay }) => {
  const { t } = useTranslation();
  const isLegal = cell.festivals.some((f) => f.legal);
  const sub = cell.subLabel;

  const cls = [
    styles.cell,
    cell.offset !== 0 ? styles.cellPad : '',
    cell.isWeekend ? styles.cellWeekend : '',
    isLegal ? styles.cellFestival : '',
  ]
    .filter(Boolean)
    .join(' ');

  const numCls = [
    styles.dayNum,
    cell.offset !== 0 ? styles.dayNumPad : '',
    cell.isWeekend && !cell.isToday ? styles.dayNumWeekend : '',
    cell.isToday ? styles.dayNumToday : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={cls}
      data-date={cell.key}
      title={
        cell.subLabel?.text
          ? t('calendar.doubleClickCreateWith', { day: cell.day, sub: cell.subLabel.text })
          : t('calendar.doubleClickCreate')
      }
      onClick={(e) => {
        e.stopPropagation();
        onPickDay(cell.key);
      }}
    >
      <div className={styles.cellHead}>
        <span className={numCls}>{cell.day}</span>
        {sub && (
          <span
            className={[
              styles.subLabel,
              sub.festival ? styles.subFestival : '',
              sub.term ? styles.subTerm : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {sub.festival?.emoji && (
              <span className={styles.festivalEmoji}>{sub.festival.emoji}</span>
            )}
            {sub.text}
          </span>
        )}
      </div>
    </div>
  );
};

// ============ 日程查看面板（单击日程条打开，只读） ============

const EventDetail: React.FC<{
  event: EventLike;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
}> = ({ event, onEdit, onDelete, onClose }) => {
  const { t, i18n } = useTranslation();
  const localeTag = i18n.language || 'zh';
  const multi = event.start !== event.end;
  const span = multi ? Math.max(2, eventSpanDays(event)) : 1;

  // 2026-09-10 → 「2026年9月10日（周四）」样式（随语言）
  const formatDetailDate = (key: string): string => {
    const d = parseYMD(key);
    if (!d) return key;
    return t('calendar.detailDate', {
      date: formatLocaleDate(localeTag, d),
      week: formatLocaleWeekday(localeTag, d),
    });
  };

  return (
    <div className={styles.panel}>
      <div className={styles.detailHeader}>
        <span className={styles.detailDot} style={{ backgroundColor: event.color }} />
        <span className={styles.panelTitle} style={{ marginBottom: 0 }}>
          {event.title}
        </span>
      </div>

      <div className={styles.detailMeta}>
        <span className={styles.detailMetaLabel}>{t('calendar.date')}</span>
        <span className={styles.detailMetaValue}>
          {multi ? (
            <>
              {formatDetailDate(event.start)}
              <span className={styles.detailSep}>{t('calendar.to')}</span>
              {formatDetailDate(event.end)}
            </>
          ) : (
            formatDetailDate(event.start)
          )}
        </span>
      </div>

      {multi && (
        <div className={styles.detailMeta}>
          <span className={styles.detailMetaLabel}>{t('calendar.span')}</span>
          <span className={styles.detailMetaValue}>{t('calendar.spanDays', { n: span })}</span>
        </div>
      )}

      <div className={styles.detailActions}>
        <button type="button" className={styles.btnGhost} onClick={onClose}>
          {t('calendar.close')}
        </button>
        <span className={styles.spacer} />
        <button type="button" className={styles.btnPrimary} onClick={onEdit}>
          {t('calendar.edit')}
        </button>
        <button type="button" className={styles.btnDanger} onClick={onDelete}>
          {t('calendar.delete')}
        </button>
      </div>
    </div>
  );
};

// ============ 新建 / 编辑日程面板 ============

const EVENT_COLORS = ['#3370ff', '#41b584', '#f2a54a', '#e85a71', '#7b6cf0', '#3aa0c9'];

interface EventEditorProps {
  mode: 'create' | 'edit';
  dayKey?: string;
  event?: EventLike | null;
  onSave: (p: { title: string; start: string; end: string; color: string }) => void;
  onDelete?: () => void;
  onCancel: () => void;
}

const EventEditor: React.FC<EventEditorProps> = ({
  mode,
  dayKey,
  event,
  onSave,
  onDelete,
  onCancel,
}) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState(() => event?.title || '');
  const [start, setStart] = useState(() => event?.start || dayKey || todayKey());
  const [end, setEnd] = useState(() => event?.end || dayKey || todayKey());
  const [color, setColor] = useState(() => event?.color || EVENT_COLORS[0]);

  // 换日快捷按钮：默认单日（date ~ date），可点「+1天」「+1周」「整月」
  const pickDay = (day: string, spanDays: number) => {
    const d = parseYMD(day);
    if (!d) return;
    setStart(day);
    setEnd(formatDate(addDays(d, spanDays - 1)));
  };

  const canSave = title.trim().length > 0 || true; // 允许空标题，保存时兜底为「新日程」

  return (
    <div
      className={styles.panel}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <div className={styles.panelTitle}>
        {mode === 'create' ? t('calendar.createTitle') : t('calendar.editTitle')}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>{t('calendar.titleLabel')}</label>
        <input
          className={styles.input}
          value={title}
          placeholder={t('calendar.titlePlaceholder')}
          autoFocus
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              onSave({ title, start, end, color });
            }
          }}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>{t('calendar.rangeLabel')}</label>
        <div className={styles.dateRow}>
          <input
            type="date"
            className={styles.dateInput}
            value={start}
            onChange={(e) => {
              const v = e.target.value;
              if (!v) return;
              setStart(v);
              if (v > end) setEnd(v);
            }}
          />
          <span className={styles.dateSep}>{t('calendar.to')}</span>
          <input
            type="date"
            className={styles.dateInput}
            value={end}
            onChange={(e) => {
              const v = e.target.value;
              if (!v) return;
              setEnd(v);
              if (v < start) setStart(v);
            }}
          />
        </div>
        {start !== end && (
          <div className={styles.hint}>
            {t('calendar.crossDayHint', {
              n: calcDays(start, end),
              range: `${start} ~ ${end}`,
            })}
          </div>
        )}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>{t('calendar.quick')}</label>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <QuickBtn label={t('calendar.quickDay')} onClick={() => pickDay(start, 1)} />
          <QuickBtn
            label={t('calendar.quickPlusDay')}
            onClick={() => setEnd(formatDate(addDays(parseYMD(end) || new Date(), 1)))}
          />
          <QuickBtn
            label={t('calendar.quickPlusWeek')}
            onClick={() => setEnd(formatDate(addDays(parseYMD(end) || new Date(), 7)))}
          />
          <QuickBtn
            label={t('calendar.quickMonth')}
            onClick={() => setEnd(formatDate(addDays(parseYMD(start) || new Date(), 30)))}
          />
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>{t('calendar.colorLabel')}</label>
        <div className={styles.colors}>
          {EVENT_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              className={`${styles.colorDot} ${color === c ? styles.colorActive : ''}`}
              style={{ backgroundColor: c }}
              onClick={() => setColor(c)}
              aria-label={c}
            />
          ))}
        </div>
      </div>

      <div className={styles.panelActions}>
        <button
          type="button"
          className={styles.btnPrimary}
          disabled={!canSave}
          onClick={() => onSave({ title, start, end, color })}
        >
          {mode === 'create' ? t('calendar.add') : t('calendar.save')}
        </button>
        {mode === 'edit' && onDelete && (
          <button type="button" className={styles.btnDanger} onClick={onDelete}>
            {t('calendar.delete')}
          </button>
        )}
        <button type="button" className={styles.btnGhost} onClick={onCancel}>
          {t('calendar.cancel')}
        </button>
      </div>
    </div>
  );
};

const QuickBtn: React.FC<{ label: string; onClick: () => void }> = ({ label, onClick }) => (
  <button
    type="button"
    style={{
      height: 22,
      padding: '0 8px',
      border: '1px solid #dee0e3',
      borderRadius: 4,
      background: 'transparent',
      fontSize: 11,
      color: 'inherit',
      cursor: 'pointer',
    }}
    onClick={onClick}
  >
    {label}
  </button>
);

const parseYMD = (s: string): Date | null => {
  const m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(s);
  if (!m) return null;
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
};

const calcDays = (a: string, b: string): number => {
  const sa = parseYMD(a);
  const sb = parseYMD(b);
  if (!sa || !sb) return 1;
  return Math.round((sb.getTime() - sa.getTime()) / 86400000) + 1;
};

export type { CalendarElement };
