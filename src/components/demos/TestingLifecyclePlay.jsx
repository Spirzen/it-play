import React, {useCallback, useRef, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {LIFECYCLE_PHASES} from '@/components/shared/kb/testingPlayEngines';
import styles from '@/components/shared/kb/testingDemo.module.css';

function TestingLifecyclePlayInner() {
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timers = useRef([]);

  const phase = LIFECYCLE_PHASES[idx];

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  const play = () => {
    clearTimers();
    setPlaying(true);
    setIdx(0);
    LIFECYCLE_PHASES.forEach((_, i) => {
      const id = setTimeout(() => {
        setIdx(i);
        if (i === LIFECYCLE_PHASES.length - 1) setPlaying(false);
      }, i * 1800);
      timers.current.push(id);
    });
  };

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Жизненный цикл тестирования (ISO/IEEE 29119)"
        subtitle="Пять фаз: от стратегии до закрытия цикла"
      >
        <div className={styles.flowSteps}>
          {LIFECYCLE_PHASES.map((p, i) => (
            <button
              key={p.id}
              type="button"
              className={clsx(styles.flowStep, i === idx && styles.flowStepActive)}
              onClick={() => !playing && setIdx(i)}
              disabled={playing}
            >
              {p.icon} {p.label.split(' ')[0]}
            </button>
          ))}
        </div>
        {phase && (
          <div className={styles.detailBox}>
            <strong>
              Фаза {idx + 1}: {phase.label}
            </strong>
            <p style={{margin: '0.35rem 0 0'}}>{phase.detail}</p>
          </div>
        )}
        <button type="button" className="it-demo__btn it-demo__btn--primary" onClick={play} disabled={playing}>
          {playing ? 'Воспроизведение…' : 'Пройти цикл'}
        </button>
      </DemoCard>
    </DemoShell>
  );
}

export default TestingLifecyclePlayInner;
