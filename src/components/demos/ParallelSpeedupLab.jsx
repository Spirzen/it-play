import React, {useMemo, useState} from 'react';

import DemoShell, {DemoCard} from '@/components/shared/DemoShell';


import styles from '@/components/demos/ParallelSpeedupLab.module.css';

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

function ParallelSpeedupLabInner() {
  const [parallelPart, setParallelPart] = useState(0.9);
  const [processors, setProcessors] = useState(8);
  const [problemGrowth, setProblemGrowth] = useState(1.8);

  const metrics = useMemo(() => {
    const p = clamp(parallelPart, 0.01, 0.999);
    const n = clamp(processors, 1, 256);
    const growth = clamp(problemGrowth, 1, 20);
    const serialPart = 1 - p;

    const amdahlSpeedup = 1 / (serialPart + p / n);
    const amdahlEfficiency = amdahlSpeedup / n;
    const maxSpeedup = 1 / serialPart;
    const gustafsonSpeedup = n - serialPart * (n - 1);
    const scaledSpeedup = 1 / (serialPart + p / (n * growth));

    return {
      serialPart,
      amdahlSpeedup,
      amdahlEfficiency,
      maxSpeedup,
      gustafsonSpeedup,
      scaledSpeedup,
    };
  }, [parallelPart, processors, problemGrowth]);

  const verdict =
    metrics.amdahlEfficiency >= 0.65
      ? 'Хорошая эффективность — текущая декомпозиция использует ядра достаточно полно.'
      : metrics.amdahlEfficiency >= 0.4
        ? 'Средняя эффективность — стоит снизить синхронизации и накладные расходы.'
        : 'Низкая эффективность — последовательная доля и overhead съедают масштабирование.';

  return (
    <DemoShell className={styles.root}>
      <header className={styles.header}>
        <h3 className={styles.title}>Лаборатория ускорения (Амдаль и Густафсон)</h3>
        <p className={styles.subtitle}>
          Меняйте долю параллелизма и число процессоров, чтобы увидеть, где заканчивается линейный рост.
        </p>
      </header>

      <div className={styles.controls}>
        <label className={styles.control}>
          <span>Параллельная часть задачи — {(parallelPart * 100).toFixed(1)}%</span>
          <input
            type="range"
            min="1"
            max="99.9"
            step="0.1"
            value={(parallelPart * 100).toFixed(1)}
            onChange={(e) => setParallelPart(Number(e.target.value) / 100)}
          />
        </label>

        <label className={styles.control}>
          <span>Процессоров (N) — {processors}</span>
          <input
            type="range"
            min="1"
            max="128"
            step="1"
            value={processors}
            onChange={(e) => setProcessors(Number(e.target.value))}
          />
        </label>

        <label className={styles.control}>
          <span>Рост размера задачи (weak scaling) — x{problemGrowth.toFixed(1)}</span>
          <input
            type="range"
            min="1"
            max="20"
            step="0.1"
            value={problemGrowth}
            onChange={(e) => setProblemGrowth(Number(e.target.value))}
          />
        </label>
      </div>

      <div className={styles.grid}>
        <article className={styles.card}>
          <h4>Амдаль (fixed workload)</h4>
          <div className={styles.metric}>S = {metrics.amdahlSpeedup.toFixed(2)}x</div>
          <div className={styles.note}>Efficiency = {(metrics.amdahlEfficiency * 100).toFixed(1)}%</div>
          <div className={styles.note}>Предел при N -&gt; inf — {metrics.maxSpeedup.toFixed(2)}x</div>
        </article>

        <article className={styles.card}>
          <h4>Густафсон-Барсис (scaled workload)</h4>
          <div className={styles.metric}>S = {metrics.gustafsonSpeedup.toFixed(2)}x</div>
          <div className={styles.note}>При росте задачи ограничение Амдаля ослабляется.</div>
          <div className={styles.note}>Scaled speedup с growth — {metrics.scaledSpeedup.toFixed(2)}x</div>
        </article>
      </div>

      <div className={styles.bars}>
        <div className={styles.barRow}>
          <span>Последовательная часть</span>
          <div className={styles.track}>
            <div className={styles.serial} style={{width: `${metrics.serialPart * 100}%`}} />
          </div>
          <strong>{(metrics.serialPart * 100).toFixed(1)}%</strong>
        </div>
        <div className={styles.barRow}>
          <span>Параллельная часть</span>
          <div className={styles.track}>
            <div className={styles.parallel} style={{width: `${parallelPart * 100}%`}} />
          </div>
          <strong>{(parallelPart * 100).toFixed(1)}%</strong>
        </div>
      </div>

      <div className={styles.verdict}>{verdict}</div>
    </DemoShell>
  );
}

export default ParallelSpeedupLabInner;
