import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {CICD_AUTH_STEPS} from '@/components/shared/kb/devopsCiCdEngines';
import styles from './devopsCiCdDemo.module.css';

function CicdAuthFlowPlayInner() {
  const [idx, setIdx] = useState(0);
  const step = CICD_AUTH_STEPS[idx];

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Аутентификация и авторизация в CI/CD"
        subtitle="От OIDC-триггера до audit trail — кто может деплоить куда"
      >
        <div className={styles.flowSteps}>
          {CICD_AUTH_STEPS.map((s, i) => (
            <button
              key={s.id}
              type="button"
              className={clsx(styles.flowStep, i === idx && styles.flowStepActive)}
              onClick={() => setIdx(i)}
            >
              {i + 1}. {s.title}
            </button>
          ))}
        </div>
        <div className={styles.panel}>
          <div className={styles.statRow}>
            <span>Участник</span>
            <strong>{step.actor}</strong>
          </div>
          <p style={{margin: '0.5rem 0 0', fontSize: '0.85rem'}}>{step.detail}</p>
        </div>
        <div className={styles.row}>
          <button
            type="button"
            className="it-demo__btn it-demo__btn--secondary it-demo__btn--sm"
            disabled={idx === 0}
            onClick={() => setIdx((i) => i - 1)}
          >
            ← Назад
          </button>
          <button
            type="button"
            className="it-demo__btn it-demo__btn--sm"
            disabled={idx >= CICD_AUTH_STEPS.length - 1}
            onClick={() => setIdx((i) => i + 1)}
          >
            Далее →
          </button>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default CicdAuthFlowPlayInner;
