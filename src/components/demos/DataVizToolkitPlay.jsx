import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';
import styles from './dataToolsPlays.module.css';

const CHART_TYPES = [
  {
    id: 'line',
    label: 'Линейный',
    lib: 'Chart.js, ECharts, Plotly',
    use: 'Временные ряды, тренды метрик',
    data: [
      {label: 'Пн', v: 42},
      {label: 'Вт', v: 58},
      {label: 'Ср', v: 51},
      {label: 'Чт', v: 73},
      {label: 'Пт', v: 68},
    ],
  },
  {
    id: 'bar',
    label: 'Столбцы',
    lib: 'Matplotlib, Superset, Metabase',
    use: 'Сравнение категорий и KPI',
    data: [
      {label: 'Web', v: 120},
      {label: 'API', v: 85},
      {label: 'Mobile', v: 64},
      {label: 'Batch', v: 22},
    ],
  },
  {
    id: 'pie',
    label: 'Доля',
    lib: 'D3, RAWGraphs',
    use: 'Структура бюджета или сегментов (до ~6 долей)',
    data: [
      {label: 'Prod', v: 45},
      {label: 'Stage', v: 25},
      {label: 'Dev', v: 20},
      {label: 'Other', v: 10},
    ],
  },
  {
    id: 'scatter',
    label: 'Точки',
    lib: 'Seaborn, Bokeh',
    use: 'Корреляция двух числовых признаков',
    data: [
      {label: 'A', v: 30},
      {label: 'B', v: 55},
      {label: 'C', v: 48},
      {label: 'D', v: 72},
      {label: 'E', v: 38},
    ],
  },
];

function DataVizToolkitPlayInner() {
  const [active, setActive] = useState('bar');
  const [animate, setAnimate] = useState(true);
  const c = CHART_TYPES.find((x) => x.id === active) ?? CHART_TYPES[1];
  const max = useMemo(() => Math.max(...c.data.map((d) => d.v), 1), [c]);

  return (
    <DemoShell>
      <DemoCard
        title="Тип графика и задача"
        subtitle="Выберите визуализацию — посмотрите, как одни и те же метрики читаются по-разному"
      >
        <div className={toolStyles.chips} style={{marginBottom: '0.65rem', flexWrap: 'wrap'}}>
          {CHART_TYPES.map((item) => (
            <button
              key={item.id}
              type="button"
              className={clsx(toolStyles.chip, active === item.id && toolStyles.chipActive)}
              onClick={() => setActive(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <label className={styles.checkRow}>
          <input
            type="checkbox"
            checked={animate}
            onChange={(e) => setAnimate(e.target.checked)}
          />
          Анимация столбцов
        </label>

        <div
          className={clsx(
            styles.chartArea,
            c.id === 'pie' && styles.chartPie,
            c.id === 'scatter' && styles.chartScatter,
          )}
        >
          {c.id === 'pie' ? (
            <div className={styles.pieRing}>
              {c.data.map((d, i) => (
                <span
                  key={d.label}
                  className={styles.pieSlice}
                  style={{
                    '--pct': `${(d.v / c.data.reduce((a, x) => a + x.v, 0)) * 100}%`,
                    '--hue': `${i * 70 + 200}`,
                  }}
                >
                  {d.label} {d.v}%
                </span>
              ))}
            </div>
          ) : (
            c.data.map((d) => (
              <div key={d.label} className={styles.barCol}>
                <div
                  className={styles.barFill}
                  style={{
                    height: animate ? `${(d.v / max) * 100}%` : `${(d.v / max) * 100}%`,
                    transition: animate ? 'height 0.45s ease' : 'none',
                  }}
                  title={`${d.v}`}
                />
                <span className={styles.barLabel}>{d.label}</span>
              </div>
            ))
          )}
        </div>

        <p className={styles.lead}>
          <strong>{c.use}</strong> — {c.lib}
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default DataVizToolkitPlayInner;
