import React, {useCallback, useRef, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {PIPELINE_LIFECYCLE} from '@/components/shared/kb/devopsCiCdEngines';
import styles from './devopsCiCdDemo.module.css';

function PipelineLifecyclePlayInner() {
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timers = useRef([]);

  const phase = PIPELINE_LIFECYCLE[idx];

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  const play = () => {
    clearTimers();
    setPlaying(true);
    setIdx(0);
    PIPELINE_LIFECYCLE.forEach((_, i) => {
      const id = setTimeout(() => {
        setIdx(i);
        if (i === PIPELINE_LIFECYCLE.length - 1) setPlaying(false);
      }, i * 1400);
      timers.current.push(id);
    });
  };

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Жизненный цикл CI/CD-пайплайна"
        subtitle="8 этапов от Jira до Prometheus — автоматический CI со сборки, CD с релиза"
      >
        <div className={styles.flowSteps}>
          {PIPELINE_LIFECYCLE.map((p, i) => (
            <button
              key={p.id}
              type="button"
              className={clsx(styles.flowStep, i === idx && styles.flowStepActive)}
              onClick={() => !playing && setIdx(i)}
              disabled={playing}
            >
              {p.icon} {p.label.split(' ')[0]}
              {p.ci && <span className={styles.badgeCi}>CI</span>}
              {p.cd && <span className={styles.badgeCd}>CD</span>}
            </button>
          ))}
        </div>
        {phase && (
          <div className={styles.panel}>
            <strong>
              {idx + 1}. {phase.label}
            </strong>
            <p style={{margin: '0.4rem 0 0', fontSize: '0.85rem'}}>{phase.detail}</p>
            {!phase.ci && !phase.cd && idx < 2 && (
              <p className="it-demo__hint" style={{margin: '0.5rem 0 0'}}>
                Вне автоматизированного пайплайна — подготовка команды.
              </p>
            )}
          </div>
        )}
        <button
          type="button"
          className="it-demo__btn it-demo__btn--primary"
          onClick={play}
          disabled={playing}
        >
          {playing ? 'Воспроизведение…' : 'Пройти все этапы'}
        </button>
      </DemoCard>
    </DemoShell>
  );
}

export default PipelineLifecyclePlayInner;
