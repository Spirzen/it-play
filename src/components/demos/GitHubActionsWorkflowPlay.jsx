import React, {useCallback, useRef, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  GHA_JOBS,
  GHA_MATRIX,
  GHA_TRIGGERS,
  simulateGhJobLog,
} from '@/components/shared/kb/devopsCiCdEngines';
import styles from './devopsCiCdDemo.module.css';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';

function GitHubActionsWorkflowPlayInner() {
  const [triggerId, setTriggerId] = useState(GHA_TRIGGERS[0].id);
  const [jobIdx, setJobIdx] = useState(0);
  const [matrix, setMatrix] = useState(false);
  const [running, setRunning] = useState(false);
  const [logs, setLogs] = useState([]);
  const timers = useRef([]);

  const trigger = GHA_TRIGGERS.find((t) => t.id === triggerId) ?? GHA_TRIGGERS[0];
  const job = GHA_JOBS[jobIdx];

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  const runWorkflow = () => {
    clearTimers();
    setRunning(true);
    setLogs([`workflow: CI (${trigger.label})`, `runs-on: ${job.runsOn}`]);
    let delay = 400;
    const jobsToRun = matrix
      ? GHA_MATRIX.flatMap((m) =>
          GHA_JOBS.map((j) => ({...j, matrixLabel: `${m.os} · Node ${m.node}`})),
        )
      : GHA_JOBS.map((j) => ({...j, matrixLabel: null}));

    jobsToRun.forEach((j) => {
      const id = setTimeout(() => {
        if (j.matrixLabel) setLogs((prev) => [...prev, '', `matrix: ${j.matrixLabel}`]);
        setLogs((prev) => [...prev, `job ${j.label} (${j.runsOn})`]);
        j.steps.forEach((step, si) => {
          const sid = setTimeout(() => {
            setLogs((prev) => [...prev, ...simulateGhJobLog([step])]);
            if (si === j.steps.length - 1 && j.id === 'deploy') setRunning(false);
          }, delay + si * 350);
          timers.current.push(sid);
        });
        delay += j.steps.length * 350 + 500;
        const idx = GHA_JOBS.findIndex((x) => x.id === j.id);
        if (idx >= 0) setJobIdx(idx);
      }, delay);
      timers.current.push(id);
      delay += 200;
    });
    const endId = setTimeout(() => setRunning(false), delay + 800);
    timers.current.push(endId);
  };

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="GitHub Actions: workflow в действии"
        subtitle="Триггер → jobs → steps на runner; опционально matrix по ОС"
      >
        <div className={toolStyles.chips} style={{marginBottom: '0.5rem'}}>
          {GHA_TRIGGERS.map((t) => (
            <button
              key={t.id}
              type="button"
              className={clsx(toolStyles.chip, triggerId === t.id && toolStyles.chipActive)}
              onClick={() => !running && setTriggerId(t.id)}
              disabled={running}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        <pre className={styles.mono} style={{marginBottom: '0.65rem'}}>
          {trigger.yaml}
        </pre>

        <div className={styles.flowSteps}>
          {GHA_JOBS.map((j, i) => (
            <button
              key={j.id}
              type="button"
              className={clsx(styles.flowStep, i === jobIdx && styles.flowStepActive)}
              onClick={() => !running && setJobIdx(i)}
              disabled={running}
            >
              {j.label}
              {j.needs.length > 0 && ' ← build'}
            </button>
          ))}
        </div>

        <div className={styles.panel}>
          <div className={styles.statRow}>
            <span>runs-on</span>
            <strong>{job.runsOn}</strong>
          </div>
          {job.if && (
            <div className={styles.statRow}>
              <span>if</span>
              <strong style={{fontSize: '0.72rem'}}>{job.if}</strong>
            </div>
          )}
          <ul style={{margin: '0.5rem 0 0', paddingLeft: '1.1rem', fontSize: '0.8rem'}}>
            {job.steps.map((s) => (
              <li key={s.name}>
                {s.uses ?? s.run}
              </li>
            ))}
          </ul>
        </div>

        <label className="it-demo__label" style={{display: 'flex', gap: '0.4rem', alignItems: 'center'}}>
          <input
            type="checkbox"
            checked={matrix}
            onChange={(e) => setMatrix(e.target.checked)}
            disabled={running}
          />
          Matrix: 3 ОС × jobs (9 runner-задач)
        </label>

        {logs.length > 0 && <div className={styles.logBox}>{logs.join('\n')}</div>}

        <button
          type="button"
          className="it-demo__btn it-demo__btn--primary"
          onClick={runWorkflow}
          disabled={running}
          style={{marginTop: '0.65rem'}}
        >
          {running ? 'Выполняется…' : 'Запустить workflow'}
        </button>
      </DemoCard>
    </DemoShell>
  );
}

export default GitHubActionsWorkflowPlayInner;
