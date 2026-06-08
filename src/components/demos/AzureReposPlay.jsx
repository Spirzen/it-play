import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {AZURE_PR_STEPS, AZURE_REPOS_MODES} from '@/components/shared/kb/devopsCiCdEngines';
import styles from './devopsCiCdDemo.module.css';

function AzureReposPlayInner() {
  const [mode, setMode] = useState('git');
  const [step, setStep] = useState(0);

  const m = AZURE_REPOS_MODES.find((x) => x.id === mode);
  const pr = AZURE_PR_STEPS[step];

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Azure Repos: Git и путь к merge"
        subtitle="Сравните Git с TFVC и пройдите типовой Pull Request → CI → merge"
      >
        <div className={styles.chips}>
          {AZURE_REPOS_MODES.map((x) => (
            <button
              key={x.id}
              type="button"
              className={clsx(styles.chip, mode === x.id && styles.chipActive)}
              onClick={() => setMode(x.id)}
            >
              {x.label}
            </button>
          ))}
        </div>

        <div className={styles.grid2}>
          <div className={styles.panel}>
            <strong>{m.label}</strong>
            <ul style={{margin: '0.4rem 0 0', paddingLeft: '1.1rem', fontSize: '0.82rem'}}>
              {m.traits.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
          {mode === 'git' && (
            <div className={styles.panel}>
              <div className={styles.chips}>
                {AZURE_PR_STEPS.map((s, i) => (
                  <button
                    key={s.id}
                    type="button"
                    className={clsx(styles.chip, step === i && styles.chipActive)}
                    onClick={() => setStep(i)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <strong>{pr.title}</strong>
              <pre className={styles.mono}>{pr.cmd}</pre>
              <div className={styles.row}>
                <button
                  type="button"
                  className="it-demo__btn it-demo__btn--secondary it-demo__btn--sm"
                  disabled={step === 0}
                  onClick={() => setStep((s) => s - 1)}
                >
                  ←
                </button>
                <button
                  type="button"
                  className="it-demo__btn it-demo__btn--sm"
                  disabled={step >= AZURE_PR_STEPS.length - 1}
                  onClick={() => setStep((s) => s + 1)}
                >
                  →
                </button>
              </div>
            </div>
          )}
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default AzureReposPlayInner;
