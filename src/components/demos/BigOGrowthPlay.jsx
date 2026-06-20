import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {CdHint, CdRange, CdStack} from '@/components/shared/kb/codeDevPlayKit';
import {BIG_O_CLASSES} from '@/components/shared/kb/graphAlgorithmsEngine';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';
import styles from '@/components/demos/CodeDevNewPlays.module.css';

function BigOGrowthPlayInner() {
  const [n, setN] = useState(32);
  const [active, setActive] = useState(() => new Set(['n', 'n2', 'nlogn']));

  const values = useMemo(() => {
    const nn = Math.max(n, 2);
    return BIG_O_CLASSES.map((c) => ({...c, v: c.fn(nn)}));
  }, [n]);

  const maxV = Math.max(...values.filter((c) => active.has(c.id)).map((c) => c.v), 1);

  const toggle = (id) => {
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const w = 480;
  const h = 180;
  const pad = 28;

  const polyline = (cls) => {
    const pts = [];
    for (let i = 2; i <= 256; i *= 1.12) {
      const x = pad + (Math.log(i) / Math.log(256)) * (w - pad * 2);
      const v = cls.fn(Math.round(i));
      const y = h - pad - (v / maxV) * (h - pad * 2);
      pts.push(`${x},${Math.max(pad, y)}`);
    }
    return pts.join(' ');
  };

  return (
    <DemoShell>
      <DemoCard
        title="Рост классов сложности"
        subtitle="Сравните форму кривых при увеличении n — константы скрыты, важен порядок роста"
      >
        <CdStack>
          <div className={toolStyles.chips}>
            {BIG_O_CLASSES.map((c) => (
              <button
                key={c.id}
                type="button"
                className={clsx(toolStyles.chip, active.has(c.id) && toolStyles.chipActive)}
                onClick={() => toggle(c.id)}
                style={
                  active.has(c.id)
                    ? {borderColor: c.color, color: c.color, background: `color-mix(in srgb, ${c.color} 14%, var(--ifm-background-surface-color))`}
                    : undefined
                }
              >
                {c.label}
              </button>
            ))}
          </div>

          <CdRange label="Размер входа n" value={n} displayValue={n} min={4} max={256} onChange={(e) => setN(Number(e.target.value))} />

          <svg viewBox={`0 0 ${w} ${h}`} className={styles.chart} role="img" aria-label="График сложности">
            <line x1={pad} y1={h - pad} x2={w - pad} y2={h - pad} stroke="var(--ifm-color-emphasis-300)" strokeWidth="1" />
            <line x1={pad} y1={pad} x2={pad} y2={h - pad} stroke="var(--ifm-color-emphasis-300)" strokeWidth="1" />
            {BIG_O_CLASSES.filter((c) => active.has(c.id)).map((c) => (
              <polyline key={c.id} fill="none" stroke={c.color} strokeWidth={2.5} strokeLinecap="round" points={polyline(c)} />
            ))}
          </svg>

          <div className={styles.barRow}>
            {values
              .filter((c) => active.has(c.id))
              .map((c) => (
                <div key={c.id} className={styles.barCol}>
                  <div className={styles.bar} style={{height: `${Math.max(4, (c.v / maxV) * 100)}%`, background: c.color}} title={String(Math.round(c.v))} />
                  <span className={styles.barLabel}>{c.label}</span>
                </div>
              ))}
          </div>
          <CdHint>При n=256 разница между O(n log n) и O(n²) — на порядки; на графике это видно по расхождению кривых.</CdHint>
        </CdStack>
      </DemoCard>
    </DemoShell>
  );
}

export default BigOGrowthPlayInner;
