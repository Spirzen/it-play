import React, {useMemo, useState} from 'react';

import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';


import styles from '@/components/demos/ResponsiveViewportPlay.module.css';

const BREAKPOINTS = [
  {id: 'mobile', min: 0, max: 479, label: 'до 480px — mobile'},
  {id: 'tablet', min: 480, max: 767, label: '480–767px — tablet'},
  {id: 'desktop', min: 768, max: 9999, label: '768px+ — desktop'},
];

function getActive(width) {
  return BREAKPOINTS.find((b) => width >= b.min && width <= b.max) ?? BREAKPOINTS[0];
}

function ResponsiveViewportPlayInner() {
  const [width, setWidth] = useState(360);
  const active = useMemo(() => getActive(width), [width]);

  return (
    <DemoShell className={styles.root}>
      <DemoCard title="Viewport и media queries" subtitle="Сдвиньте ширину — подсветится активный breakpoint">
        <label className={styles.control}>
          <span className="it-demo__label">Ширина viewport: {width}px</span>
          <input type="range" min={280} max={900} value={width} onChange={(e) => setWidth(Number(e.target.value))} />
        </label>
        <div className={styles.viewport} style={{width}}>
          <span className={styles.chip}>{width}px</span>
          <p className={styles.layoutText}>
            {active.id === 'mobile' && '1 колонка'}
            {active.id === 'tablet' && '2 колонки'}
            {active.id === 'desktop' && '3 колонки'}
          </p>
        </div>
        <ul className={styles.bpList}>
          {BREAKPOINTS.map((b) => (
            <li key={b.id} className={clsx(styles.bp, active.id === b.id && styles.bpActive)}>
              @media (min-width: {b.min}px) — {b.label}
            </li>
          ))}
        </ul>
        <p className={styles.active}>Активно: <strong>{active.label}</strong></p>
      </DemoCard>
    </DemoShell>
  );
}

export default ResponsiveViewportPlayInner;
