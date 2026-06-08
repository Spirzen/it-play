import React, {useMemo, useState} from 'react';

import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';


import {JOB_DSL_PRESETS, SEED_FLOW, getPreset} from '@/components/shared/kb/groovyJobDslEngine';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';
import styles from '@/components/demos/JobDslPlayground.module.css';

function JobDslPlaygroundInner() {
  const [presetId, setPresetId] = useState('pipeline');
  const [flowStep, setFlowStep] = useState(0);

  const preset = useMemo(() => getPreset(presetId), [presetId]);

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Job DSL Playground"
        subtitle="Выберите пресет — справа появятся jobs и views, которые создаст seed-скрипт"
      >
        <div className={toolStyles.chips} style={{marginBottom: '0.65rem'}}>
          {JOB_DSL_PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              className={clsx(toolStyles.chip, presetId === p.id && toolStyles.chipActive)}
              onClick={() => setPresetId(p.id)}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className={styles.grid}>
          <div>
            <label className={styles.label} htmlFor="job-dsl-editor">
              Groovy Job DSL
            </label>
            <pre id="job-dsl-editor" className={styles.codePanel} tabIndex={0}>
              {preset.dsl}
            </pre>
            <p className={styles.note}>{preset.notes}</p>
          </div>

          <div>
            <p className={styles.label}>Результат на Jenkins controller</p>
            <ul className={styles.jobList}>
              {preset.jobs.map((job) => (
                <li key={job.name} className={styles.jobItem}>
                  <span className={styles.jobType}>{job.type}</span>
                  <strong>{job.name}</strong>
                  <span className={styles.jobDetail}>{job.detail}</span>
                </li>
              ))}
              {(preset.views ?? []).map((view) => (
                <li key={view.name} className={styles.jobItem}>
                  <span className={styles.jobTypeView}>View</span>
                  <strong>{view.name}</strong>
                  <span className={styles.jobDetail}>{view.detail}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </DemoCard>

      <DemoCard title="Seed job — поток" subtitle="Как DSL из Git попадает в дерево jobs">
        <div className={styles.flowRow}>
          {SEED_FLOW.map((step, i) => (
            <button
              key={step.id}
              type="button"
              className={clsx(styles.flowStep, flowStep === i && styles.flowStepActive)}
              onClick={() => setFlowStep(i)}
            >
              <span className={styles.flowNum}>{i + 1}</span>
              {step.label}
            </button>
          ))}
        </div>
        <p className={styles.flowDetail}>{SEED_FLOW[flowStep].detail}</p>
      </DemoCard>
    </DemoShell>
  );
}

export default JobDslPlaygroundInner;
