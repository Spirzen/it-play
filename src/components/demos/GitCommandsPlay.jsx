import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {GIT_WORKFLOW, applyWorkflowStep} from '@/components/shared/kb/gitCommandsEngine';
import styles from '@/components/demos/GitCommandsPlay.module.css';

function GitCommandsPlayInner() {
  const [stepIdx, setStepIdx] = useState(0);
  const {step, files, log} = applyWorkflowStep(stepIdx);

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Повседневный цикл Git"
        subtitle="Пройдите шаги init → status → add → commit → push"
      >
        <div className={styles.steps}>
          {GIT_WORKFLOW.map((s, i) => (
            <button
              key={s.id}
              type="button"
              className={clsx(styles.stepBtn, i <= stepIdx && styles.stepDone, i === stepIdx && styles.stepActive)}
              onClick={() => setStepIdx(i)}
            >
              <code>{s.cmd}</code>
            </button>
          ))}
        </div>
        <p className="it-demo__hint">{step?.desc}</p>

        <div className={styles.panels}>
          <div>
            <span className="it-demo__label">Рабочая копия</span>
            <ul className={styles.fileList}>
              {files.map((f) => (
                <li key={f.name}>
                  <span>{f.name}</span>
                  <span className={styles.badge}>{f.status}</span>
                  {f.inIndex && <span className={styles.staged}>staged</span>}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <span className="it-demo__label">Терминал</span>
            <pre className={styles.term}>{log.join('\n')}</pre>
          </div>
        </div>

        <button
          type="button"
          className="it-demo__btn it-demo__btn--sm"
          disabled={stepIdx >= GIT_WORKFLOW.length - 1}
          onClick={() => setStepIdx((i) => Math.min(i + 1, GIT_WORKFLOW.length - 1))}
        >
          Выполнить следующую команду →
        </button>
      </DemoCard>
    </DemoShell>
  );
}

export default GitCommandsPlayInner;
