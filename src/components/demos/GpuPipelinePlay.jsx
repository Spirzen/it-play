import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {GPU_PIPELINE_STEPS} from '@/components/shared/kb/mediaInteractiveEngines';
import {styles} from '@/components/shared/kb/basicsPlayUi';

function GpuPipelinePlayInner() {
  const [step, setStep] = useState(0);
  const current = GPU_PIPELINE_STEPS[step];
  const progress = ((step + 1) / GPU_PIPELINE_STEPS.length) * 100;

  return (
    <DemoShell>
      <DemoCard
        title="Графический конвейер GPU"
        subtitle="Путь кадра от вершин до пикселя на экране"
      >
        <div className={styles.rangeRow} style={{gridTemplateColumns: '1fr 3rem', marginBottom: '0.65rem'}}>
          <div className={styles.barTrack}>
            <div className={styles.barFill} style={{width: `${progress}%`}} />
          </div>
          <strong>{step + 1}/{GPU_PIPELINE_STEPS.length}</strong>
        </div>

        <div className={styles.pipeline}>
          {GPU_PIPELINE_STEPS.map((s, i) => (
            <button
              key={s.id}
              type="button"
              className={clsx(styles.pipelineStep, i === step && styles.pipelineStepActive)}
              onClick={() => setStep(i)}
            >
              <span className={styles.stepNum}>{i + 1}</span>
              <span>
                <strong>{s.label}</strong>
                <div className="it-demo__hint">{s.detail}</div>
              </span>
            </button>
          ))}
        </div>

        <div className={styles.panelAccent} style={{marginTop: '0.65rem'}}>
          Сейчас: <strong>{current.label}</strong>
        </div>

        <div className={styles.pipelineNav}>
          <button type="button" className="it-demo__btn it-demo__btn--secondary it-demo__btn--sm" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
            ← Назад
          </button>
          <button type="button" className="it-demo__btn it-demo__btn--primary it-demo__btn--sm" disabled={step >= GPU_PIPELINE_STEPS.length - 1} onClick={() => setStep((s) => s + 1)}>
            Далее →
          </button>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default GpuPipelinePlayInner;
