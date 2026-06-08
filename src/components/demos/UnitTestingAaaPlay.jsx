import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {AAA_STEPS, calcAdd} from '@/components/shared/kb/testingPlayEngines';
import styles from '@/components/shared/kb/testingDemo.module.css';

function UnitTestingAaaPlayInner() {
  const [step, setStep] = useState(0);
  const a = 2;
  const b = 3;
  const result = step >= 1 ? calcAdd(a, b) : '?';
  const assertOk = step >= 2 && result === 5;

  return (
    <DemoShell className={styles.root}>
      <DemoCard title="Паттерн AAA" subtitle="Arrange → Act → Assert на функции сложения">
        <div className={styles.flowSteps}>
          {AAA_STEPS.map((s, i) => (
            <button
              key={s.id}
              type="button"
              className={clsx(styles.flowStep, i === step && styles.flowStepActive)}
              onClick={() => setStep(i)}
            >
              {s.label}
            </button>
          ))}
        </div>
        <div className={styles.codeBlock}>
          {step === 0 && `// Arrange\na = ${a}\nb = ${b}`}
          {step === 1 && `// Act\nresult = add(a, b)  // ${result}`}
          {step === 2 && `// Assert\nassert result === 5  // ${assertOk ? 'PASS' : 'FAIL'}`}
        </div>
        <p className={styles.cardHint}>{AAA_STEPS[step].hint}</p>
        <div style={{display: 'flex', gap: '0.45rem', justifyContent: 'center'}}>
          <button
            type="button"
            className="it-demo__btn it-demo__btn--secondary"
            disabled={step <= 0}
            onClick={() => setStep((s) => s - 1)}
          >
            ←
          </button>
          <button
            type="button"
            className="it-demo__btn it-demo__btn--primary"
            disabled={step >= 2}
            onClick={() => setStep((s) => s + 1)}
          >
            Следующий шаг →
          </button>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default UnitTestingAaaPlayInner;
