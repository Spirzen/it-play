import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {INSTALL_STEPS, installProgress} from '@/components/shared/kb/osInstallFlowEngine';
import styles from '@/components/demos/OsInstallFlowPlay.module.css';

function OsInstallFlowPlayInner() {
  const [idx, setIdx] = useState(0);
  const [completed, setCompleted] = useState([]);
  const step = INSTALL_STEPS[idx];
  const progress = installProgress(completed);

  const markDone = () => {
    setCompleted((prev) => (prev.includes(step.id) ? prev : [...prev, step.id]));
    if (idx < INSTALL_STEPS.length - 1) setIdx((i) => i + 1);
  };

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Установка ОС: пошаговый конвейер"
        subtitle="От образа ISO до обновлений и драйверов — типичный путь администратора"
      >
        <div className={styles.track}>
          {INSTALL_STEPS.map((s, i) => (
            <button
              key={s.id}
              type="button"
              className={clsx(
                styles.dot,
                idx === i && styles.dotActive,
                completed.includes(s.id) && styles.dotDone,
              )}
              onClick={() => setIdx(i)}
              title={s.label}
            >
              {s.icon}
            </button>
          ))}
        </div>
        <div className={styles.barTrack}>
          <div className={styles.barFill} style={{width: `${progress.pct}%`}} />
        </div>

        <div className={styles.card}>
          <p className={styles.cardTitle}>
            {step.icon} {step.label}
          </p>
          <p className={styles.detail}>{step.detail}</p>
          <ul className={styles.checklist}>
            {step.checklist.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.btn}
            disabled={idx === 0}
            onClick={() => setIdx((i) => Math.max(0, i - 1))}
          >
            ← Назад
          </button>
          <button type="button" className={styles.btnPrimary} onClick={markDone}>
            {idx < INSTALL_STEPS.length - 1 ? 'Выполнено →' : 'Готово'}
          </button>
        </div>
        <p className={styles.hint}>
          Шаг {idx + 1} из {INSTALL_STEPS.length}. BOOT Menu и BIOS — в отдельном эмуляторе ниже в статье.
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default OsInstallFlowPlayInner;
