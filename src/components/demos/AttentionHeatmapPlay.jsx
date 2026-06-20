import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import shared from '@/components/demos/aiPlayShared.module.css';
import styles from '@/components/demos/AttentionHeatmapPlay.module.css';

const TOKENS = ['Машинное', 'обучение', 'учится', 'на', 'данных'];

const MATRIX = [
  [0.42, 0.18, 0.12, 0.08, 0.2],
  [0.15, 0.38, 0.22, 0.1, 0.15],
  [0.1, 0.2, 0.35, 0.15, 0.2],
  [0.08, 0.12, 0.15, 0.45, 0.2],
  [0.12, 0.15, 0.18, 0.12, 0.43],
];

function heatStyle(w) {
  const alpha = 0.12 + w * 0.78;
  return {
    background: `color-mix(in srgb, var(--ifm-color-primary) ${Math.round(alpha * 100)}%, transparent)`,
    borderColor: `color-mix(in srgb, var(--ifm-color-primary) ${Math.round((0.25 + w * 0.55) * 100)}%, transparent)`,
  };
}

function AttentionHeatmapPlayInner() {
  const [focus, setFocus] = useState(0);
  const weights = MATRIX[focus];
  const maxIdx = weights.indexOf(Math.max(...weights));

  return (
    <DemoShell className={shared.root}>
      <DemoCard title="Self-attention" subtitle="Клик по токену — веса внимания на остальные позиции">
        <div className={shared.chipRow}>
          {TOKENS.map((t, i) => (
            <button key={t} type="button" className={clsx(shared.chip, focus === i && shared.chipActive)} onClick={() => setFocus(i)}>
              {t}
            </button>
          ))}
        </div>

        <div className={styles.grid}>
          {TOKENS.map((t, i) => (
            <div key={t} className={styles.cell} style={heatStyle(weights[i])} title={`${(weights[i] * 100).toFixed(0)}%`}>
              <span className={styles.cellTok}>{t}</span>
              <span className={styles.cellW}>{(weights[i] * 100).toFixed(0)}%</span>
            </div>
          ))}
        </div>

        <p className={shared.hint}>
          Query «<strong>{TOKENS[focus]}</strong>» сильнее всего смотрит на «<strong>{TOKENS[maxIdx]}</strong>». В модели: softmax(Q·Kᵀ/√d)·V.
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default AttentionHeatmapPlayInner;
