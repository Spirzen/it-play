import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {ECOSYSTEMS, PUBLISH_STEPS} from '@/components/shared/kb/packagePublishEngine';
import styles from '@/components/demos/PackagePublishPlay.module.css';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';

function PackagePublishPlayInner() {
  const [ecoId, setEcoId] = useState('npm');
  const [step, setStep] = useState(0);
  const eco = ECOSYSTEMS.find((e) => e.id === ecoId) ?? ECOSYSTEMS[0];
  const current = PUBLISH_STEPS[step];

  return (
    <DemoShell>
      <DemoCard
        title="Публикация библиотеки"
        subtitle="Пройдите путь от идеи до реестра пакетов"
      >
        <div className={toolStyles.chips}>
          {ECOSYSTEMS.map((e) => (
            <button
              key={e.id}
              type="button"
              className={clsx(toolStyles.chip, ecoId === e.id && toolStyles.chipActive)}
              onClick={() => setEcoId(e.id)}
            >
              {e.label}
            </button>
          ))}
        </div>

        <div className={styles.steps}>
          {PUBLISH_STEPS.map((s, i) => (
            <button
              key={s.id}
              type="button"
              className={clsx(styles.step, i === step && styles.stepActive, i < step && styles.stepDone)}
              onClick={() => setStep(i)}
            >
              {s.label}
            </button>
          ))}
        </div>

        <p className={styles.done}>{current.done}</p>

        {step >= 2 && (
          <pre className={styles.manifest}>{eco.manifest}</pre>
        )}

        {step >= 2 && (
          <div className={styles.cmd}>
            <code>{eco.pack}</code>
            {step >= 4 && (
              <>
                <span aria-hidden> → </span>
                <code>{eco.publish}</code>
              </>
            )}
          </div>
        )}

        <p className="it-demo__hint" style={{margin: 0}}>
          Реестр: {eco.registry}. Версию обновляйте по semver при каждом релизе.
        </p>

        <div className={styles.nav}>
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
            disabled={step >= PUBLISH_STEPS.length - 1}
            onClick={() => setStep((s) => s + 1)}
          >
            Далее →
          </button>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default PackagePublishPlayInner;
