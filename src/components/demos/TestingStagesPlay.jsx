import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {STAGE_ORDER} from '@/components/shared/kb/testingPlayEngines';
import styles from '@/components/shared/kb/testingDemo.module.css';

function TestingStagesPlayInner() {
  const [active, setActive] = useState(0);
  const stage = STAGE_ORDER[active];

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Порядок этапов тестирования"
        subtitle="От изолированного модуля к приёмке заказчиком"
      >
        <div className={styles.pipeline}>
          {STAGE_ORDER.map((s, i) => (
            <React.Fragment key={s.id}>
              {i > 0 && <span className={styles.pipeArrow}>→</span>}
              <button
                type="button"
                className={clsx(
                  styles.pipeNode,
                  i === active && styles.pipeNodeActive,
                  i < active && styles.pipeNodeDone,
                )}
                onClick={() => setActive(i)}
              >
                {s.label}
              </button>
            </React.Fragment>
          ))}
        </div>
        <div className={styles.detailBox}>
          <strong>{stage.label}</strong>
          <p style={{margin: '0.35rem 0 0'}}>{stage.when}</p>
          <p className={styles.cardHint}>
            Симуляция пользователя усиливается к правому краю цепочки: на приёмке проверяют сценарии
            use case глазами заказчика.
          </p>
        </div>
        <div style={{display: 'flex', gap: '0.45rem', justifyContent: 'center'}}>
          <button
            type="button"
            className="it-demo__btn it-demo__btn--secondary"
            disabled={active <= 0}
            onClick={() => setActive((a) => a - 1)}
          >
            ← Раньше
          </button>
          <button
            type="button"
            className="it-demo__btn it-demo__btn--primary"
            disabled={active >= STAGE_ORDER.length - 1}
            onClick={() => setActive((a) => a + 1)}
          >
            Дальше →
          </button>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default TestingStagesPlayInner;
