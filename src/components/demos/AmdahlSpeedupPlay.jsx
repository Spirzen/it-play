import React, {useMemo, useState} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {CdHint, CdMetric, CdMetricGrid, CdRange, CdStack, CdVerdict} from '@/components/shared/kb/codeDevPlayKit';
import styles from '@/components/demos/CodeDevNewPlays.module.css';

function AmdahlSpeedupPlayInner() {
  const [p, setP] = useState(0.75);
  const [n, setN] = useState(8);

  const metrics = useMemo(() => {
    const serial = 1 - p;
    const speedup = 1 / (serial + p / n);
    const efficiency = speedup / n;
    const limit = 1 / serial;
    return {speedup, efficiency, limit, serial};
  }, [p, n]);

  const w = 420;
  const h = 150;
  const pad = 28;
  const maxN = 32;
  const line = [];
  for (let i = 1; i <= maxN; i += 1) {
    const s = 1 / (metrics.serial + p / i);
    const x = pad + ((i - 1) / (maxN - 1)) * (w - pad * 2);
    const y = h - pad - (s / metrics.limit) * (h - pad * 2);
    line.push(`${x},${y}`);
  }
  const dotX = pad + ((n - 1) / (maxN - 1)) * (w - pad * 2);
  const dotY = h - pad - (metrics.speedup / metrics.limit) * (h - pad * 2);

  return (
    <DemoShell>
      <DemoCard title="Закон Амдала" subtitle="Предел ускорения задаёт последовательная доля (1−p)">
        <CdStack>
          <CdRange label="Параллельная доля p" value={p * 100} displayValue={`${(p * 100).toFixed(0)}%`} min={5} max={99} onChange={(e) => setP(Number(e.target.value) / 100)} />
          <CdRange label="Число ядер N" value={n} displayValue={n} min={1} max={32} onChange={(e) => setN(Number(e.target.value))} />

          <CdMetricGrid>
            <CdMetric label={`Ускорение при ${n} ядрах`} value={`${metrics.speedup.toFixed(2)}×`} />
            <CdMetric label="Предел (N→∞)" value={`${metrics.limit.toFixed(2)}×`} tone="warning" />
            <CdMetric label="Efficiency" value={`${(metrics.efficiency * 100).toFixed(0)}%`} hint="доля использования ядер" />
          </CdMetricGrid>

          <svg viewBox={`0 0 ${w} ${h}`} className={styles.chart} role="img" aria-label="Кривая ускорения">
            <polyline fill="none" stroke="var(--ifm-color-primary)" strokeWidth="2.5" strokeLinecap="round" points={line.join(' ')} />
            <circle cx={dotX} cy={dotY} r={6} className={styles.amdahlDot} />
          </svg>

          <CdVerdict tone={metrics.efficiency >= 0.5 ? 'success' : 'warning'}>
            {metrics.efficiency >= 0.65
              ? 'Хорошая эффективность — ядра загружены достаточно полно.'
              : metrics.efficiency >= 0.35
                ? 'Средняя эффективность — снизьте синхронизации и serial fraction.'
                : 'Низкая эффективность — последовательная часть съедает масштабирование.'}
          </CdVerdict>
          <CdHint>Формула: S = 1 / ((1−p) + p/N). Даже при p=95% предел ≈ 20×.</CdHint>
        </CdStack>
      </DemoCard>
    </DemoShell>
  );
}

export default AmdahlSpeedupPlayInner;
