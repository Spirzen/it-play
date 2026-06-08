import React, {useCallback, useRef, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {GITLAB_EXECUTORS, GITLAB_STAGES, gitlabStageStatus} from '@/components/shared/kb/devopsCiCdEngines';
import styles from './devopsCiCdDemo.module.css';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';

function GitLabCiPipelinePlayInner() {
  const [executorId, setExecutorId] = useState('docker');
  const [runIdx, setRunIdx] = useState({stage: -1, job: -1});
  const [playing, setPlaying] = useState(false);
  const timers = useRef([]);

  const executor = GITLAB_EXECUTORS.find((e) => e.id === executorId) ?? GITLAB_EXECUTORS[0];

  const activeJob =
    runIdx.stage >= 0 && runIdx.stage < GITLAB_STAGES.length
      ? GITLAB_STAGES[runIdx.stage]?.jobs[runIdx.job]
      : null;

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  const playPipeline = () => {
    clearTimers();
    setPlaying(true);
    setRunIdx({stage: 0, job: 0});
    let delay = 0;
    GITLAB_STAGES.forEach((stage, si) => {
      stage.jobs.forEach((job, ji) => {
        const id = setTimeout(() => setRunIdx({stage: si, job: ji}), delay);
        timers.current.push(id);
        delay += job.manual ? 2200 : 1100;
      });
    });
    const end = setTimeout(() => {
      setRunIdx({stage: GITLAB_STAGES.length, job: 0});
      setPlaying(false);
    }, delay + 400);
    timers.current.push(end);
  };

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="GitLab CI: stages и runners"
        subtitle="Стадии идут последовательно; jobs внутри стадии — параллельно (если нет needs)"
      >
        <div className={toolStyles.chips} style={{marginBottom: '0.5rem'}}>
          {GITLAB_EXECUTORS.map((e) => (
            <button
              key={e.id}
              type="button"
              className={clsx(toolStyles.chip, executorId === e.id && toolStyles.chipActive)}
              onClick={() => setExecutorId(e.id)}
            >
              {e.label}
            </button>
          ))}
        </div>
        <p style={{margin: '0 0 0.65rem', fontSize: '0.82rem'}}>{executor.desc}</p>

        <div className={styles.row} style={{alignItems: 'flex-start'}}>
          {GITLAB_STAGES.map((stage, si) => (
            <div key={stage.id} className={styles.stageCol}>
              <div className={styles.stageTitle}>{stage.id}</div>
              {stage.jobs.map((job, ji) => {
                const st = gitlabStageStatus(si, ji, runIdx.stage, runIdx.job);
                return (
                  <span
                    key={job.id}
                    className={clsx(
                      styles.jobPill,
                      st === 'done' && styles.jobDone,
                      st === 'running' && styles.jobRun,
                      st === 'pending' && styles.jobWait,
                    )}
                  >
                    {job.id}
                    {job.manual && ' ⏸ manual'}
                    {job.needs && ' ↳ needs'}
                  </span>
                );
              })}
            </div>
          ))}
        </div>

        {activeJob && (
          <div className={styles.panel} style={{marginTop: '0.65rem'}}>
            <strong>script ({activeJob.id}):</strong>
            <pre className={styles.mono}>{activeJob.script?.join('\n') ?? ''}</pre>
          </div>
        )}

        <button
          type="button"
          className="it-demo__btn it-demo__btn--primary"
          onClick={playPipeline}
          disabled={playing}
        >
          {playing ? 'Пайплайн…' : 'Запустить .gitlab-ci.yml'}
        </button>
        <p className="it-demo__hint" style={{marginBottom: 0, marginTop: '0.5rem'}}>
          Runner с executor "{executor.label}" подхватывает job из очереди GitLab.
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default GitLabCiPipelinePlayInner;
