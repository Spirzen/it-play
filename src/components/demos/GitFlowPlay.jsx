import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {GITFLOW_STEPS} from '@/components/shared/kb/gitFlowEngine';
import styles from '@/components/demos/GitFlowPlay.module.css';

const LANES = [
  {key: 'main', label: 'main', color: '#1565c0'},
  {key: 'develop', label: 'develop', color: '#6a1b9a'},
  {key: 'feature', label: 'feature/*', color: '#2e7d32'},
  {key: 'release', label: 'release/*', color: '#ef6c00'},
  {key: 'hotfix', label: 'hotfix/*', color: '#c62828'},
];

function GitFlowPlayInner() {
  const [idx, setIdx] = useState(0);
  const step = GITFLOW_STEPS[idx];

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="GitFlow: интернет-магазин"
        subtitle="Пройдите сценарий feature → release → hotfix из статьи"
      >
        <div className={styles.nav}>
          {GITFLOW_STEPS.map((s, i) => (
            <button
              key={s.id}
              type="button"
              className={clsx('it-demo__btn it-demo__btn--sm', idx === i && 'it-demo__btn--primary')}
              onClick={() => setIdx(i)}
            >
              {i + 1}
            </button>
          ))}
        </div>
        <h5 className={styles.stepTitle}>{step.title}</h5>

        <div className={styles.graph}>
          {LANES.map((lane) => (
            <div key={lane.key} className={styles.lane}>
              <span className={styles.laneLabel} style={{color: lane.color}}>
                {lane.label}
                {step.active === lane.key && ' ◀'}
              </span>
              <div className={styles.commits}>
                {(step.branches[lane.key] ?? []).map((c) => (
                  <span
                    key={c}
                    className={styles.commit}
                    style={{borderColor: lane.color}}
                    title={c}
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <pre className={styles.pre}>{step.commands.join('\n')}</pre>

        <div className={styles.footerNav}>
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
            disabled={idx >= GITFLOW_STEPS.length - 1}
            onClick={() => setIdx((i) => i + 1)}
          >
            Далее →
          </button>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default GitFlowPlayInner;
