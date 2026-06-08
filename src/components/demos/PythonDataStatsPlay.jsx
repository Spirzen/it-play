import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';

const COLUMNS = {
  sales: {label: 'Продажи', values: [120, 98, 145, 132, 210, 188, 95, 160]},
  visits: {label: 'Визиты', values: [40, 35, 52, 48, 61, 55, 30, 44]},
  age: {label: 'Возраст', values: [28, 34, 41, 29, 52, 38, 45, 31]},
};

function stats(values) {
  const n = values.length;
  const mean = values.reduce((a, b) => a + b, 0) / n;
  const sorted = [...values].sort((a, b) => a - b);
  const median =
    n % 2 === 0
      ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2
      : sorted[(n - 1) / 2];
  const variance = values.reduce((s, v) => s + (v - mean) ** 2, 0) / n;
  const std = Math.sqrt(variance);
  const mode = sorted.reduce(
    (best, v) => {
      const count = values.filter((x) => x === v).length;
      return count > best.count ? {value: v, count} : best;
    },
    {value: sorted[0], count: 0},
  );
  return {mean, median, std, min: sorted[0], max: sorted[n - 1], mode: mode.value};
}

function pearson(a, b) {
  const n = a.length;
  const ma = a.reduce((s, x) => s + x, 0) / n;
  const mb = b.reduce((s, x) => s + x, 0) / n;
  let num = 0;
  let da = 0;
  let db = 0;
  for (let i = 0; i < n; i++) {
    const xa = a[i] - ma;
    const xb = b[i] - mb;
    num += xa * xb;
    da += xa * xa;
    db += xb * xb;
  }
  const den = Math.sqrt(da * db);
  return den === 0 ? 0 : num / den;
}

function PythonDataStatsPlayInner() {
  const [col, setCol] = useState('sales');
  const [showCorr, setShowCorr] = useState(false);

  const values = COLUMNS[col].values;
  const s = useMemo(() => stats(values), [col]);
  const r = useMemo(() => pearson(COLUMNS.sales.values, COLUMNS.visits.values), []);

  return (
    <DemoShell>
      <DemoCard
        title="Описательная статистика в Python"
        subtitle="Сводные метрики и корреляция на учебной выборке"
      >
        <div className={toolStyles.chips} style={{marginBottom: '0.65rem'}}>
          {Object.entries(COLUMNS).map(([id, c]) => (
            <button
              key={id}
              type="button"
              className={clsx(toolStyles.chip, col === id && toolStyles.chipActive)}
              onClick={() => setCol(id)}
            >
              {c.label}
            </button>
          ))}
          <button
            type="button"
            className={clsx(toolStyles.chip, showCorr && toolStyles.chipActive)}
            onClick={() => setShowCorr((v) => !v)}
          >
            Корреляция
          </button>
        </div>

        {showCorr ? (
          <p style={{fontSize: '0.88rem', margin: 0}}>
            corr(Продажи, Визиты) = <strong>{r.toFixed(3)}</strong> — сильная положительная связь
            (не причинность).
          </p>
        ) : (
          <table style={{width: '100%', fontSize: '0.84rem', borderCollapse: 'collapse'}}>
            <tbody>
              {[
                ['mean', s.mean.toFixed(2)],
                ['median', s.median.toFixed(2)],
                ['std', s.std.toFixed(2)],
                ['min / max', `${s.min} / ${s.max}`],
                ['mode', String(s.mode)],
              ].map(([k, v]) => (
                <tr key={k}>
                  <td style={{padding: '0.25rem 0.5rem 0.25rem 0', fontFamily: 'monospace'}}>{k}</td>
                  <td style={{padding: '0.25rem 0'}}>{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </DemoCard>
    </DemoShell>
  );
}

export default PythonDataStatsPlayInner;
