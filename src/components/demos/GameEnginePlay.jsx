import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {ENGINE_SUBSYSTEMS, FRAME_BUDGET_MS} from '@/components/shared/kb/gameDevEngine';
import styles from '@/components/demos/GameDevDemo.module.css';

const ALL_IDS = ENGINE_SUBSYSTEMS.map((s) => s.id);

function GameEnginePlayInner() {
  const [enabled, setEnabled] = useState(new Set(ALL_IDS));
  const [focus, setFocus] = useState('render');

  const toggle = (id) => {
    setEnabled((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const usedMs = useMemo(
    () => ENGINE_SUBSYSTEMS.filter((s) => enabled.has(s.id)).reduce((sum, s) => sum + s.ms, 0),
    [enabled],
  );
  const fps = usedMs > 0 ? Math.min(144, Math.round(1000 / usedMs)) : 0;
  const overBudget = usedMs > FRAME_BUDGET_MS;
  const detail = ENGINE_SUBSYSTEMS.find((s) => s.id === focus) ?? ENGINE_SUBSYSTEMS[0];

  return (
    <DemoShell className={styles.shell}>
      <DemoCard
        title="Подсистемы игрового движка"
        subtitle="Бюджет кадра 16.6 ms (60 FPS) — включайте системы и смотрите нагрузку"
      >
        <p
          className={clsx(styles.fpsGauge, overBudget ? styles.fpsBad : styles.fpsOk)}
          aria-live="polite"
        >
          {enabled.size === 0 ? '—' : fps} FPS
          <span style={{fontSize: '0.85rem', fontWeight: 600, marginLeft: '0.5rem'}}>
            ({usedMs.toFixed(1)} / {FRAME_BUDGET_MS} ms)
          </span>
        </p>

        {ENGINE_SUBSYSTEMS.map((s) => {
          const on = enabled.has(s.id);
          const pct = (s.ms / FRAME_BUDGET_MS) * 100;
          return (
            <div key={s.id} className={styles.budgetRow}>
              <button
                type="button"
                className={styles.budgetLabel}
                style={{
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  color: focus === s.id ? 'var(--ifm-color-primary)' : 'inherit',
                }}
                onClick={() => setFocus(s.id)}
              >
                <input
                  type="checkbox"
                  checked={on}
                  onChange={() => toggle(s.id)}
                  style={{marginRight: '0.35rem'}}
                  aria-label={s.label}
                />
                {s.label}
              </button>
              <div className={styles.budgetTrack}>
                <div
                  className={styles.budgetFill}
                  style={{
                    width: on ? `${Math.min(100, pct)}%` : '0%',
                    background:
                      s.unit === 'GPU' ? 'var(--ifm-color-primary)' : 'var(--ifm-color-info)',
                    opacity: on ? 1 : 0.25,
                  }}
                />
              </div>
              <span className={styles.budgetMs}>{on ? `${s.ms} ms` : '—'}</span>
            </div>
          );
        })}

        <div className={styles.panel} style={{marginTop: '0.75rem'}}>
          <p className={styles.panelTitle}>{detail.label}</p>
          <span className={styles.chip}>
            {detail.unit}
          </span>
          <p className={styles.hint}>{detail.desc}</p>
          {overBudget && (
            <p className={styles.hint}>
              <strong style={{color: 'var(--ifm-color-danger)'}}>
                Превышен бюджет кадра — нужны LOD, батчинг или вынос логики в фон.
              </strong>
            </p>
          )}
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default GameEnginePlayInner;
