import React, {useCallback, useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {BUILD_STEPS, PART_LABELS, stepProgress} from '@/components/shared/kb/pcAssemblyEngine';
import styles from '@/components/demos/PcAssemblyPlay.module.css';

const SLOT_LAYOUT = [
  {id: 'psu', grid: 'psu'},
  {id: 'mb', grid: 'mb'},
  {id: 'cpu', grid: 'cpu'},
  {id: 'cooler', grid: 'cooler'},
  {id: 'ram', grid: 'ram'},
  {id: 'm2', grid: 'm2'},
  {id: 'gpu', grid: 'gpu'},
];

function PcAssemblyPlayInner() {
  const [completed, setCompleted] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);

  const progress = useMemo(() => stepProgress(completed), [completed]);
  const currentStep = BUILD_STEPS[currentIdx];
  const installedParts = useMemo(() => {
    const last = BUILD_STEPS.filter((s) => completed.includes(s.id)).pop();
    return last?.parts ?? [];
  }, [completed]);

  const completeStep = useCallback(() => {
    const step = BUILD_STEPS[currentIdx];
    if (!step) return;
    setCompleted((prev) => (prev.includes(step.id) ? prev : [...prev, step.id]));
    setCurrentIdx((i) => Math.min(BUILD_STEPS.length - 1, i + 1));
  }, [currentIdx]);

  const goTo = (idx) => {
    setCurrentIdx(Math.max(0, Math.min(BUILD_STEPS.length - 1, idx)));
  };

  const reset = () => {
    setCompleted([]);
    setCurrentIdx(0);
  };

  const isInstalled = (partId) => installedParts.includes(partId);

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Визуальная сборка компьютера"
        subtitle="Пошагово установите компоненты в корпус — порядок как в статье"
      >
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{width: `${progress.pct}%`}} />
        </div>
        <p className={styles.progressText}>
          Шаг {progress.done} из {progress.total} ({progress.pct}%)
        </p>

        <div className={styles.case}>
          <div className={styles.caseLabel}>Корпус (вид сверху)</div>
          <div className={styles.slots}>
            {SLOT_LAYOUT.map((slot) => (
              <div
                key={slot.id}
                className={clsx(
                  styles.slot,
                  styles[`slot_${slot.grid}`],
                  isInstalled(slot.id) && styles.slotDone,
                  currentStep?.parts.includes(slot.id) && !isInstalled(slot.id) && styles.slotNext,
                )}
              >
                <span className={styles.slotIcon}>
                  {BUILD_STEPS.find((s) => s.parts.includes(slot.id) && !s.parts.includes('case'))?.icon ??
                    '▫'}
                </span>
                <span className={styles.slotName}>{PART_LABELS[slot.id] ?? slot.id}</span>
              </div>
            ))}
          </div>
          {currentStep?.cables.length > 0 && (
            <div className={styles.cables}>
              Кабели: {currentStep.cables.map((c) => c.replace('_', '-')).join(', ')}
            </div>
          )}
        </div>

        <div className={styles.stepCard}>
          <span className={styles.stepNum}>Шаг {currentStep.order}</span>
          <h4 className={styles.stepTitle}>
            {currentStep.icon} {currentStep.title}
          </h4>
          <p className={styles.stepHint}>{currentStep.hint}</p>
        </div>

        <ul className={styles.checklist}>
          {BUILD_STEPS.map((s, i) => (
            <li key={s.id}>
              <button
                type="button"
                className={clsx(
                  styles.checkItem,
                  completed.includes(s.id) && styles.checkDone,
                  i === currentIdx && styles.checkCurrent,
                )}
                onClick={() => goTo(i)}
              >
                <span className={styles.checkMark}>{completed.includes(s.id) ? '✓' : s.order}</span>
                {s.title}
              </button>
            </li>
          ))}
        </ul>

        <div className={styles.controls}>
          <button
            type="button"
            className="it-demo__btn it-demo__btn--primary"
            onClick={completeStep}
            disabled={completed.includes(currentStep.id) && currentIdx >= BUILD_STEPS.length - 1}
          >
            {completed.includes(currentStep.id) ? 'Следующий шаг →' : 'Выполнить шаг'}
          </button>
          <button type="button" className="it-demo__btn it-demo__btn--secondary" onClick={() => goTo(currentIdx - 1)} disabled={currentIdx <= 0}>
            ← Назад
          </button>
          <button type="button" className="it-demo__btn it-demo__btn--secondary" onClick={reset}>
            Начать заново
          </button>
        </div>

        {progress.pct === 100 && (
          <p className={styles.doneMsg}>
            Сборка завершена. Перед включением: тумблер PSU = I, монитор в видеокарту, проверьте 8-pin CPU.
          </p>
        )}
      </DemoCard>
    </DemoShell>
  );
}

export default PcAssemblyPlayInner;
