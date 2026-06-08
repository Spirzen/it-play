import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {INTEGRATION_SERVICES, runIntegrationChain} from '@/components/shared/kb/testingPlayEngines';
import styles from '@/components/shared/kb/testingDemo.module.css';

function IntegrationFlowPlayInner() {
  const [step, setStep] = useState(-1);
  const msgs = step >= 0 ? runIntegrationChain(step) : [];

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Цепочка интеграции"
        subtitle="Заказ → CRM → оплата: формат данных и порядок вызовов"
      >
        <div className={styles.grid3}>
          {INTEGRATION_SERVICES.map((s, i) => (
            <button
              key={s.id}
              type="button"
              className={clsx(styles.card, step >= i && styles.cardActive)}
              onClick={() => setStep(i)}
            >
              <span className={styles.cardLabel}>{s.label}</span>
              <p className={styles.cardHint}>{s.sends}</p>
            </button>
          ))}
        </div>
        {msgs.map((m, i) => (
          <div key={i} className={clsx(styles.msg, m.ok ? styles.msgOk : styles.msgFail)}>
            <span>{m.ok ? '✓' : '✗'}</span>
            <span>
              {m.from} → {m.to}: {m.text}
            </span>
          </div>
        ))}
        <button
          type="button"
          className="it-demo__btn it-demo__btn--primary"
          onClick={() => setStep((s) => (s >= 2 ? -1 : s + 1))}
        >
          {step < 0 ? 'POST /api/orders' : step < 2 ? 'Следующий шаг' : 'Сброс'}
        </button>
        <p className={styles.cardHint}>
          На интеграции ловят расхождение форматов (user_id vs userId) и неверный порядок вызовов (pay до checkCart).
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default IntegrationFlowPlayInner;
