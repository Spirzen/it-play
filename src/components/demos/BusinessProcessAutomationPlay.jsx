import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  BPM_PRESETS,
  VACATION_STEPS,
  formatDuration,
  totalMinutes,
} from '@/components/shared/kb/businessProcessAutomationEngine';
import styles from '@/components/demos/BusinessProcessAutomationPlay.module.css';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';

function BusinessProcessAutomationPlayInner() {
  const [presetId, setPresetId] = useState('bpm');
  const [stepIndex, setStepIndex] = useState(-1);
  const mode = BPM_PRESETS.find((p) => p.id === presetId)?.mode ?? 'auto';

  const manualTotal = useMemo(() => totalMinutes(VACATION_STEPS, 'manual'), []);
  const autoTotal = useMemo(() => totalMinutes(VACATION_STEPS, 'auto'), []);
  const currentTotal = useMemo(
    () =>
      stepIndex < 0
        ? 0
        : VACATION_STEPS.slice(0, stepIndex + 1).reduce(
            (s, st) => s + (mode === 'manual' ? st.manualMin : st.autoMin),
            0,
          ),
    [mode, stepIndex],
  );

  const advance = () => {
    setStepIndex((i) => (i >= VACATION_STEPS.length - 1 ? -1 : i + 1));
  };

  const reset = () => setStepIndex(-1);

  return (
    <DemoShell>
      <DemoCard
        title="Автоматизация: заявка на отпуск"
        subtitle="Пройдите этапы BPM и сравните время ручного документооборота с цифровым маршрутом"
      >
        <div className={toolStyles.chips} style={{marginBottom: '0.65rem'}}>
          {BPM_PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              className={clsx(toolStyles.chip, presetId === p.id && toolStyles.chipActive)}
              onClick={() => {
                setPresetId(p.id);
                reset();
              }}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className={styles.flow}>
          {VACATION_STEPS.map((step, i) => {
            const done = stepIndex >= i;
            const active = stepIndex === i;
            return (
              <button
                key={step.id}
                type="button"
                className={clsx(
                  styles.step,
                  done && styles.stepDone,
                  active && styles.stepActive,
                  stepIndex >= 0 && !done && !active && styles.stepPending,
                )}
                onClick={advance}
              >
                <span>{done ? '✓' : i + 1}</span>
                <span>
                  <strong>{step.label}</strong>
                  <br />
                  <span style={{color: 'var(--ifm-color-content-secondary)', fontSize: '0.75rem'}}>
                    {step.actor}
                  </span>
                </span>
                <span className={styles.badge}>
                  {formatDuration(mode === 'manual' ? step.manualMin : step.autoMin)}
                </span>
              </button>
            );
          })}
        </div>

        <button type="button" className="it-demo__btn it-demo__btn--secondary it-demo__btn--sm" onClick={reset}>
          Сбросить процесс
        </button>

        <div className={styles.compare}>
          <div className={styles.compareCard}>
            <strong>Ручной процесс</strong>
            {formatDuration(manualTotal)} на полный цикл
          </div>
          <div className={styles.compareCard}>
            <strong>BPM / ECM</strong>
            {formatDuration(autoTotal)} · экономия ~
            {Math.round((1 - autoTotal / manualTotal) * 100)}%
          </div>
        </div>

        <p className="it-demo__hint" style={{marginTop: '0.65rem', marginBottom: 0}}>
          {stepIndex < 0
            ? 'Нажимайте на шаги, чтобы пройти маршрут. Система сама проверяет баланс отпуска и шлёт уведомления.'
            : `Пройдено этапов: ${stepIndex + 1} · накопленное время: ${formatDuration(currentTotal)}`}
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default BusinessProcessAutomationPlayInner;
