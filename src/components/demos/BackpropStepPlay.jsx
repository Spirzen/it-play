import React, {useMemo, useState} from 'react';

import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';


import styles from '@/components/demos/BackpropStepPlay.module.css';

const STEPS = [
  {id: 'input', label: 'Вход x₁=0.5, x₂=0.8', phase: 'forward'},
  {id: 'h1', label: 'Скрытый h = σ(w·x+b)', phase: 'forward'},
  {id: 'out', label: 'Выход ŷ = σ(w·h+b)', phase: 'forward'},
  {id: 'loss', label: 'Loss L = (ŷ−y)², y=1', phase: 'backward'},
  {id: 'dout', label: '∂L/∂ŷ и градиент выхода', phase: 'backward'},
  {id: 'dh', label: '∂L/∂h — backprop во скрытый слой', phase: 'backward'},
];

function BackpropStepPlayInner() {
  const [step, setStep] = useState(0);
  const x1 = 0.5;
  const x2 = 0.8;
  const w1 = 0.4;
  const w2 = -0.3;
  const b1 = 0.1;
  const wh = 0.6;
  const bo = -0.2;
  const y = 1;

  const sig = (z) => 1 / (1 + Math.exp(-z));
  const h = useMemo(() => sig(w1 * x1 + w2 * x2 + b1), [x1, x2, w1, w2, b1]);
  const yHat = useMemo(() => sig(wh * h + bo), [h, wh, bo]);
  const loss = useMemo(() => (yHat - y) ** 2, [yHat, y]);

  const active = STEPS[step]?.id;

  return (
    <DemoShell className={styles.root}>
      <DemoCard title="Backprop по шагам" subtitle="2 слоя: forward → loss → backward">
        <div className={styles.net}>
          <span className={clsx(styles.node, active === 'input' && styles.nodeOn)}>x₁,x₂</span>
          <span className={styles.arrow}>→</span>
          <span className={clsx(styles.node, active === 'h1' && styles.nodeOn)}>h={h.toFixed(3)}</span>
          <span className={styles.arrow}>→</span>
          <span className={clsx(styles.node, active === 'out' && styles.nodeOn)}>ŷ={yHat.toFixed(3)}</span>
        </div>
        <p className={styles.metric}>Loss L = {loss.toFixed(4)}</p>
        <p className={styles.stepText}>{STEPS[step]?.label}</p>
        <p className={styles.phase}>
          Фаза: <strong>{STEPS[step]?.phase === 'backward' ? 'backward' : 'forward'}</strong>
        </p>
        <div className={styles.controls}>
          <button
            type="button"
            className="it-demo__btn it-demo__btn--primary"
            onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
            disabled={step >= STEPS.length - 1}
          >
            Следующий шаг
          </button>
          <button type="button" className="it-demo__btn it-demo__btn--secondary" onClick={() => setStep(0)}>
            Сброс
          </button>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default BackpropStepPlayInner;
