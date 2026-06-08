import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  COMPLEXITY_CLASSES,
  N_DEFAULT,
  N_MAX,
  N_MIN,
  buildCurvePoints,
  formatGrowth,
  formatOps,
  growthFactor,
} from '@/components/shared/kb/complexityEngine';
import styles from '@/components/demos/ComplexityDemo.module.css';

const CHART = {w: 520, h: 200, pad: {l: 42, r: 12, t: 14, b: 28}};
const DEFAULT_VISIBLE = new Set(['const', 'log', 'linear', 'nlogn', 'quad']);

const GROWTH_HINTS = {
  'O(1)': 'Время не зависит от объёма данных.',
  'O(n)': 'Удвоение данных ≈ удвоение времени; ×10 данных ≈ ×10 времени.',
  'O(n²)': '×10 данных ≈ ×100 времени — типичная ловушка вложенных циклов.',
  'O(log n)': 'Удвоение n добавляет лишь один шаг — масштабируется отлично.',
  'O(n log n)': 'Практический порог "быстрых" алгоритмов на больших массивах.',
  'O(2ⁿ)': 'Каждый +1 к n удваивает работу — быстро становится неприемлемо.',
};

function ComplexityDemoInner() {
  const [n, setN] = useState(N_DEFAULT);
  const [focusId, setFocusId] = useState('linear');
  const [visible, setVisible] = useState(DEFAULT_VISIBLE);

  const focus = COMPLEXITY_CLASSES.find((c) => c.id === focusId) ?? COMPLEXITY_CLASSES[2];
  const ops = focus.fn(n);
  const factor = growthFactor(focus.fn, n);
  const overLimit = focus.maxN != null && n > focus.maxN;

  const curves = useMemo(() => {
    return COMPLEXITY_CLASSES.filter((c) => visible.has(c.id)).map((cls) => {
      const cap = cls.maxN != null ? Math.min(n, cls.maxN) : n;
      const pts = buildCurvePoints(cls.fn, cap, 40, cls.maxN ?? N_MAX);
      return {cls, pts};
    });
  }, [n, visible]);

  const plot = useMemo(() => {
    const allY = curves.flatMap(({pts}) => pts.map((p) => p.y));
    const yMin = allY.length ? Math.min(...allY) : 0;
    const yMax = allY.length ? Math.max(...allY) : 1;
    const innerW = CHART.w - CHART.pad.l - CHART.pad.r;
    const innerH = CHART.h - CHART.pad.t - CHART.pad.b;
    const xScale = (nv) => CHART.pad.l + ((nv - N_MIN) / (N_MAX - N_MIN)) * innerW;
    const yScale = (yv) => {
      const t = yMax === yMin ? 0.5 : (yv - yMin) / (yMax - yMin);
      return CHART.pad.t + innerH * (1 - t);
    };
    const nX = xScale(Math.min(n, N_MAX));
    return {xScale, yScale, nX, innerH};
  }, [curves, n]);

  const toggleVisible = (id) => {
    setVisible((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        if (next.size > 1) next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <DemoShell>
      <DemoCard
        title="Рост алгоритмической сложности"
        subtitle="Двигайте размер входа n и сравните, как растёт число операций у разных классов O"
      >
        <NSlider n={n} setN={setN} />

        <div className={styles.layout}>
          <div>
            <div className={styles.chartWrap}>
              <svg
                viewBox={`0 0 ${CHART.w} ${CHART.h}`}
                className={styles.chartSvg}
                role="img"
                aria-label="График роста сложности по n"
              >
                {[0, 0.25, 0.5, 0.75, 1].map((t) => {
                  const y = CHART.pad.t + plot.innerH * (1 - t);
                  return (
                    <line
                      key={t}
                      x1={CHART.pad.l}
                      y1={y}
                      x2={CHART.w - CHART.pad.r}
                      y2={y}
                      stroke="var(--demo-border)"
                      strokeWidth={0.5}
                      opacity={0.6}
                    />
                  );
                })}
                <text x={CHART.pad.l} y={CHART.h - 6} className={styles.axisLabel}>
                  n = {N_MIN}
                </text>
                <text x={CHART.w - CHART.pad.r} y={CHART.h - 6} textAnchor="end" className={styles.axisLabel}>
                  n = {N_MAX}
                </text>
                <text x={8} y={CHART.pad.t + 8} className={styles.axisLabel}>
                  log₁₀(операций)
                </text>
                <line
                  x1={plot.nX}
                  y1={CHART.pad.t}
                  x2={plot.nX}
                  y2={CHART.h - CHART.pad.b}
                  className={styles.nMarker}
                />
                <text x={plot.nX + 4} y={CHART.pad.t + 10} className={styles.axisLabel} fill="var(--ifm-color-primary)">
                  n={n}
                </text>
                {curves.map(({cls, pts}) => {
                  if (pts.length < 2) return null;
                  const d = pts
                    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${plot.xScale(p.n).toFixed(1)} ${plot.yScale(p.y).toFixed(1)}`)
                    .join(' ');
                  const active = focusId === cls.id;
                  return (
                    <path
                      key={cls.id}
                      d={d}
                      fill="none"
                      stroke={cls.color}
                      strokeWidth={active ? 2.5 : 1.5}
                      opacity={active ? 1 : 0.55}
                    />
                  );
                })}
                {curves.map(({cls, pts}) => {
                  const last = pts[pts.length - 1];
                  if (!last) return null;
                  return (
                    <circle
                      key={`${cls.id}-dot`}
                      cx={plot.xScale(last.n)}
                      cy={plot.yScale(last.y)}
                      r={focusId === cls.id ? 4 : 3}
                      fill={cls.color}
                    />
                  );
                })}
              </svg>
              <ComplexityLegend
                visible={visible}
                focusId={focusId}
                setFocusId={setFocusId}
                toggleVisible={toggleVisible}
              />
            </div>

            <table className={styles.table} style={{marginTop: '0.75rem'}}>
              <thead>
                <tr>
                  <th>Класс</th>
                  <th>Операций при n</th>
                  <th>Если n × 10</th>
                </tr>
              </thead>
              <tbody>
                {COMPLEXITY_CLASSES.filter((c) => visible.has(c.id)).map((cls) => {
                  const gf = growthFactor(cls.fn, n);
                  const limited = cls.maxN != null && n > cls.maxN;
                  return (
                    <tr
                      key={cls.id}
                      className={clsx(focusId === cls.id && styles.rowHighlight)}
                      onClick={() => setFocusId(cls.id)}
                      style={{cursor: 'pointer'}}
                    >
                      <td>
                        <span style={{color: cls.color, fontWeight: 600}}>{cls.notation}</span>
                      </td>
                      <td>{limited ? 'слишком много' : formatOps(cls.fn(n))}</td>
                      <td>{limited ? '—' : formatGrowth(gf)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className={styles.sidePanel}>
            <div className={styles.metricCard} style={{'--metric-accent': focus.color}}>
              <div className={styles.metricCardAccent}>
                <div className={styles.metricLabel}>{focus.label}</div>
                <div className={styles.metricValue} style={{color: focus.color}}>
                  {overLimit ? 'взрывной рост' : formatOps(ops)}
                </div>
                <div className={styles.metricSub}>
                  {focus.example}
                  {overLimit && focus.maxN != null && (
                    <>
                      <br />
                      При n &gt; {focus.maxN} график и числа не масштабируются — такие алгоритмы неприменимы на
                      больших данных.
                    </>
                  )}
                </div>
                <code className={styles.codeSnippet}>{focus.code}</code>
              </div>
            </div>

            <div className={styles.metricCard}>
              <div className={styles.metricLabel}>Рост при n → 10n</div>
              <div className={styles.metricValue}>{overLimit ? '—' : formatGrowth(factor)}</div>
              <div className={styles.metricSub}>{GROWTH_HINTS[focus.notation] ?? null}</div>
            </div>

            <div className={styles.hint}>
              Ось Y на графике — логарифм числа операций, чтобы уместить и O(n), и O(n²) на одном поле. Константы в
              Big-O отбрасываются: сравниваем <em>темп роста</em>, а не точные миллисекунды.
            </div>
          </div>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

function NSlider({n, setN}) {
  return (
    <div className={styles.sliderRow}>
      <label htmlFor="complexity-n">Размер входа n</label>
      <input
        id="complexity-n"
        type="range"
        className={styles.slider}
        min={N_MIN}
        max={N_MAX}
        step={10}
        value={n}
        onChange={(e) => setN(Number(e.target.value))}
      />
      <span className={styles.nValue}>{n}</span>
    </div>
  );
}

function ComplexityLegend({visible, focusId, setFocusId, toggleVisible}) {
  return (
    <div className={styles.legend}>
      {COMPLEXITY_CLASSES.map((cls) => (
        <button
          key={cls.id}
          type="button"
          className={clsx(
            styles.legendItem,
            visible.has(cls.id) && styles.legendItemActive,
            !visible.has(cls.id) && styles.legendItemMuted,
          )}
          onClick={() => {
            toggleVisible(cls.id);
            setFocusId(cls.id);
          }}
        >
          <span className={styles.legendDot} style={{background: cls.color}} />
          {cls.notation}
        </button>
      ))}
    </div>
  );
}

export default ComplexityDemoInner;
