import React, {useMemo, useState} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import shared from '@/components/demos/aiPlayShared.module.css';
import styles from '@/components/demos/BiasVarianceTargetPlay.module.css';

function genShots(complexity, seed) {
  const n = 28;
  const bias = (complexity - 5) * 7;
  const variance = complexity * 2;
  return Array.from({length: n}, (_, i) => ({
    x: 50 + bias + Math.sin(seed + i * 1.7) * variance,
    y: 50 + bias * 0.25 + Math.cos(seed + i * 2.3) * variance * 0.7,
  }));
}

function BiasVarianceTargetPlayInner() {
  const [complexity, setComplexity] = useState(5);
  const [seed, setSeed] = useState(1);

  const shots = useMemo(() => genShots(complexity, seed), [complexity, seed]);
  const meanX = shots.reduce((s, p) => s + p.x, 0) / shots.length;
  const meanY = shots.reduce((s, p) => s + p.y, 0) / shots.length;
  const spread = shots.reduce((s, p) => s + (p.x - meanX) ** 2 + (p.y - meanY) ** 2, 0) / shots.length;
  const biasDist = Math.hypot(meanX - 50, meanY - 50);

  const hint =
    complexity <= 3
      ? 'Простая модель — высокое смещение (куча мимо центра).'
      : complexity >= 8
        ? 'Сложная модель — высокая дисперсия (разброс, переобучение).'
        : 'Баланс — попадания ближе к центру при умеренном разбросе.';

  return (
    <DemoShell className={shared.root}>
      <DemoCard title="Bias–variance" subtitle="Сложность модели на мишени train/test">
        <label className={shared.sliderField}>
          <div className={shared.sliderHead}>
            <span>Сложность модели</span>
            <span className={shared.sliderValue}>{complexity}</span>
          </div>
          <input className={shared.range} type="range" min="1" max="10" value={complexity} onChange={(e) => setComplexity(+e.target.value)} />
        </label>

        <svg className={styles.svg} viewBox="0 0 100 100" role="img" aria-label="Мишень bias-variance">
          <circle cx="50" cy="50" r="40" className={styles.ring} />
          <circle cx="50" cy="50" r="25" className={styles.ring} />
          <circle cx="50" cy="50" r="3" className={styles.bullseye} />
          {shots.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="1.6" className={styles.shot} />
          ))}
        </svg>

        <div className={shared.statGrid}>
          <div className={shared.statBox}>
            <span className={shared.statValue}>{biasDist.toFixed(1)}</span>
            <span className={shared.statLabel}>смещение</span>
          </div>
          <div className={shared.statBox}>
            <span className={shared.statValue}>{spread.toFixed(1)}</span>
            <span className={shared.statLabel}>разброс</span>
          </div>
        </div>

        <div className={shared.controls}>
          <button type="button" className="it-demo__btn it-demo__btn--secondary" onClick={() => setSeed((s) => s + 1)}>
            Новая выборка
          </button>
        </div>

        <p className={shared.hint}>{hint}</p>
      </DemoCard>
    </DemoShell>
  );
}

export default BiasVarianceTargetPlayInner;
