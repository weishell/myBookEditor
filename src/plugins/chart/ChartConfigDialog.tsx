import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ChartKind,
  getKindMeta,
  getVariantMeta,
  type ChartAttrs,
  type ChartDataRow,
} from './chart-utils';
import styles from './ChartConfig.module.less';

interface ChartConfigDialogProps {
  /** 确定要使用的 kind + variant（插入流程由类型选择弹框传入） */
  kind: ChartKind;
  variant: string;
  initial?: Partial<ChartAttrs>;
  onConfirm: (attrs: ChartAttrs) => void;
  onCancel: () => void;
}

const COLORS = ['#3370ff', '#f6bd16', '#5fc09a', '#8d7bf0', '#f2766e', '#4aa3f2'];

/** 配置页（先占位）：标题 / 描述 / 数据表，点确定直接生成图形 */
export const ChartConfigDialog: React.FC<ChartConfigDialogProps> = ({
  kind,
  variant,
  initial,
  onConfirm,
  onCancel,
}) => {
  const kindMeta = useMemo(() => getKindMeta(kind), [kind]);
  const variantMeta = useMemo(() => getVariantMeta(kind, variant), [kind, variant]);
  const isGauge = kind === ChartKind.GAUGE;

  const [title, setTitle] = useState(initial?.title ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [rows, setRows] = useState<ChartDataRow[]>(
    (initial?.data?.length ? initial.data : (kindMeta?.defaultData ?? [])).map((r) => ({ ...r })),
  );
  // 数据录入方式：手动逐条 / 粘贴 JSON
  const [dataMode, setDataMode] = useState<'manual' | 'json'>('manual');
  const [jsonText, setJsonText] = useState('');
  const [jsonError, setJsonError] = useState('');

  // 仪表盘：当前值 / 量程 / 单位
  const [gaugeValue, setGaugeValue] = useState<string>(String(initial?.gaugeValue ?? 82));
  const [gaugeMin, setGaugeMin] = useState<string>(String(initial?.gaugeMin ?? 0));
  const [gaugeMax, setGaugeMax] = useState<string>(String(initial?.gaugeMax ?? 100));
  const [gaugeUnit, setGaugeUnit] = useState(initial?.gaugeUnit ?? '%');

  const applyJson = () => {
    try {
      const parsed: unknown = JSON.parse(jsonText.trim());
      if (!Array.isArray(parsed)) throw new Error('顶层必须是数组');
      const next = parsed
        .map((it): ChartDataRow | null => {
          if (!it || typeof it !== 'object') return null;
          const o = it as Record<string, unknown>;
          const name = String(o.name ?? o.label ?? o.key ?? '');
          const val = Number(o.value ?? o.count ?? 0);
          if (!name) return null;
          return { name, value: Number.isNaN(val) ? 0 : val };
        })
        .filter(Boolean) as ChartDataRow[];
      if (!next.length) throw new Error('未解析到有效数据');
      setRows(next);
      setJsonError('');
    } catch (err) {
      setJsonError(err instanceof Error ? err.message : 'JSON 解析失败');
    }
  };

  const toJson = () => {
    setJsonText(JSON.stringify(rows, null, 2));
    setJsonError('');
  };

  const panelRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const onDocMouseDown = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node) && !hover) {
        onCancel();
      }
    };
    document.addEventListener('mousedown', onDocMouseDown);
    return () => document.removeEventListener('mousedown', onDocMouseDown);
  }, [hover, onCancel]);

  // Esc 关闭
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onCancel]);

  const updateRow = (i: number, key: keyof ChartDataRow, val: string) => {
    setRows((prev) => {
      const next = prev.map((r) => ({ ...r }));
      if (key === 'name') next[i].name = val;
      else {
        const n = Number(val);
        next[i].value = Number.isNaN(n) ? 0 : n;
      }
      return next;
    });
  };

  const handleConfirm = () => {
    const num = (s: string) => {
      const n = Number(s);
      return Number.isNaN(n) ? 0 : n;
    };
    onConfirm({
      kind,
      variant,
      title,
      description,
      data: isGauge
        ? [{ name: '当前值', value: num(gaugeValue) }]
        : rows.filter((r) => r.name.trim() !== ''),
      width: 720,
      height: 320,
      ...(isGauge
        ? {
            gaugeValue: num(gaugeValue),
            gaugeMin: num(gaugeMin),
            gaugeMax: num(gaugeMax),
            gaugeUnit: gaugeUnit || '%',
          }
        : {}),
    });
  };

  return (
    <div className={styles.overlay} onMouseDown={(e) => e.stopPropagation()}>
      <div
        ref={panelRef}
        className={styles.panel}
        style={{ ['--qc' as string]: COLORS[0] }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div className={styles.header}>
          <span className={styles.headerIcon}>{kindMeta?.icon ?? '📊'}</span>
          <div className={styles.headerText}>
            <div className={styles.title}>
              {kindMeta?.label ?? '图表'}
              <span className={styles.variantTag}>{variantMeta?.label ?? variant}</span>
            </div>
            <div className={styles.sub}>配置图表内容，点击"确定"生成图形</div>
          </div>
        </div>

        <div className={styles.body}>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>标题</span>
            <input
              className={styles.input}
              value={title}
              placeholder="请输入图表标题"
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </label>

          <label className={styles.field}>
            <span className={styles.fieldLabel}>描述</span>
            <input
              className={styles.input}
              value={description}
              placeholder="可选：图表的补充说明"
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>

          {isGauge && (
            <div className={styles.field}>
              <span className={styles.fieldLabel}>数值</span>
              <div className={styles.gaugeGrid}>
                <label className={styles.gaugeItem}>
                  <span>当前值</span>
                  <input
                    className={styles.input}
                    type="number"
                    value={gaugeValue}
                    onChange={(e) => setGaugeValue(e.target.value)}
                  />
                </label>
                <label className={styles.gaugeItem}>
                  <span>最小值</span>
                  <input
                    className={styles.input}
                    type="number"
                    value={gaugeMin}
                    onChange={(e) => setGaugeMin(e.target.value)}
                  />
                </label>
                <label className={styles.gaugeItem}>
                  <span>最大值</span>
                  <input
                    className={styles.input}
                    type="number"
                    value={gaugeMax}
                    onChange={(e) => setGaugeMax(e.target.value)}
                  />
                </label>
                <label className={styles.gaugeItem}>
                  <span>单位</span>
                  <input
                    className={styles.input}
                    value={gaugeUnit}
                    onChange={(e) => setGaugeUnit(e.target.value)}
                    placeholder="%"
                  />
                </label>
              </div>
              <div className={styles.gaugeHint}>点击"确定"后，指针会动画移动到当前值位置</div>
            </div>
          )}

          {!isGauge && (
            <div className={styles.field}>
              <span className={styles.fieldLabel}>数据</span>
              <div className={styles.modeSwitch}>
                <button
                  className={`${styles.modeBtn} ${dataMode === 'manual' ? styles.modeActive : ''}`}
                  onClick={() => setDataMode('manual')}
                >
                  手动逐条
                </button>
                <button
                  className={`${styles.modeBtn} ${dataMode === 'json' ? styles.modeActive : ''}`}
                  onClick={() => {
                    toJson();
                    setDataMode('json');
                  }}
                >
                  粘贴 JSON
                </button>
              </div>

              {dataMode === 'manual' ? (
                <div className={styles.dataTable}>
                  <div className={styles.dataHead}>
                    <span>名称</span>
                    <span>数值</span>
                    <span />
                  </div>
                  {rows.map((r, i) => (
                    <div className={styles.dataRow} key={i}>
                      <input
                        className={styles.dataInput}
                        value={r.name}
                        placeholder={`项目${i + 1}`}
                        onChange={(e) => updateRow(i, 'name', e.target.value)}
                      />
                      <input
                        className={`${styles.dataInput} ${styles.num}`}
                        type="number"
                        value={r.value}
                        onChange={(e) => updateRow(i, 'value', e.target.value)}
                      />
                      <button
                        className={styles.rowDel}
                        onClick={() => setRows((p) => p.filter((_, idx) => idx !== i))}
                        title="删除该行"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    className={styles.addRow}
                    onClick={() => setRows((p) => [...p, { name: '', value: 0 }])}
                  >
                    ＋ 添加一项
                  </button>
                </div>
              ) : (
                <div className={styles.jsonBox}>
                  <textarea
                    className={styles.jsonArea}
                    value={jsonText}
                    placeholder={
                      '[\n  { "name": "一月", "value": 320 },\n  { "name": "二月", "value": 210 }\n]'
                    }
                    onChange={(e) => {
                      setJsonText(e.target.value);
                      setJsonError('');
                    }}
                    spellCheck={false}
                  />
                  {jsonError && <div className={styles.jsonError}>{jsonError}</div>}
                  <button
                    className={styles.jsonApply}
                    onClick={applyJson}
                    disabled={!jsonText.trim()}
                  >
                    解析并应用
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <button className={styles.btnCancel} onClick={onCancel}>
            取消
          </button>
          <button className={styles.btnOk} onClick={handleConfirm}>
            确定
          </button>
        </div>
      </div>
    </div>
  );
};
