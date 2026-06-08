import React, {useState} from 'react';

import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';


import {PIPELINE_STAGES} from '@/components/shared/kb/gameDevEngine';
import styles from '@/components/demos/GameDevDemo.module.css';

function GameDevPipelineDemoInner() {
  const [idx, setIdx] = useState(0);
  const stage = PIPELINE_STAGES[Math.min(idx, PIPELINE_STAGES.length - 1)];
  const progress = ((idx + 1) / PIPELINE_STAGES.length) * 100;

  return (
    <DemoShell className={styles.shell}>
      <DemoCard
        title="Конвейер разработки игры"
        subtitle="Шесть этапов от идеи до live-ops — артефакты, роли и типичные риски"
      >
        <div className={styles.pipeline}>
          {PIPELINE_STAGES.map((s, i) => (
            <button
              key={s.id}
              type="button"
              className={clsx(
                styles.pipeStep,
                idx === i && styles.pipeStepActive,
                i < idx && styles.pipeStepDone,
              )}
              onClick={() => setIdx(i)}
            >
              {s.label}
            </button>
          ))}
        </div>
        <input
          type="range"
          className={styles.slider}
          min={0}
          max={PIPELINE_STAGES.length - 1}
          value={idx}
          onChange={(e) => setIdx(Number(e.target.value))}
          aria-label="Этап разработки"
        />
        <div className={styles.panel}>
          <p className={styles.panelTitle}>
            {stage.label}{' '}
            <span className={styles.chip}>{stage.phase}</span>
          </p>
          <div className={styles.chipRow}>
            <span className={styles.chip}>~{stage.weeks}</span>
            {stage.roles.map((r) => (
              <span key={r} className={styles.chip}>
                {r}
              </span>
            ))}
          </div>
          <p className={styles.hint}>
            <strong>Артефакты:</strong>
          </p>
          <ul className={styles.checkList}>
            {stage.deliverables.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
          <p className={styles.hint}>
            <strong>Риск этапа:</strong> {stage.risk}
          </p>
        </div>
        <div
          className={styles.barTrack}
          style={{marginTop: '0.65rem', height: '0.35rem'}}
          aria-hidden
        >
          <div
            className={styles.barFill}
            style={{width: `${progress}%`, background: 'var(--ifm-color-primary)'}}
          />
        </div>
        <p className={styles.hint}>
          Этап {idx + 1} из {PIPELINE_STAGES.length}. В профессиональном геймдеве этапы перекрываются:
          QA начинается ещё в продакшне.
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default GameDevPipelineDemoInner;
