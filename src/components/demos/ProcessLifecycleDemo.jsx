import React, {useCallback, useEffect, useRef, useState} from 'react';

import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';


import {PROCESS_DEMO, sleep} from '@/components/shared/kb/concurrencyLifecycleEngine';
import styles from '@/components/demos/ConcurrencyLifecycleDemo.module.css';

const PROC_COLORS = {parent: '#3498db', child: '#9b59b6'};

function CodePanel({lines, highlight, language}) {
  return (
    <div className={styles.panel}>
      <div className={styles.panelHead}>
        <span>Код</span>
        <span className={styles.langBadge}>{language}</span>
      </div>
      <pre className={styles.codeBlock}>
        {lines.map((line, idx) => {
          const isHi = highlight?.includes(idx);
          const isDim = highlight && highlight.length > 0 && !isHi && line.trim() !== '';
          return (
            <code
              key={idx}
              className={clsx(
                styles.codeLine,
                isHi && styles.codeLineHi,
                isDim && styles.codeLineDim,
              )}
            >
              {line === '' ? ' ' : line}
            </code>
          );
        })}
      </pre>
    </div>
  );
}

function ProgressDots({total, current}) {
  return (
    <div className={styles.progress} aria-hidden>
      {Array.from({length: total}, (_, i) => (
        <span
          key={i}
          className={clsx(
            styles.progressDot,
            i < current && styles.progressDotDone,
            i === current && styles.progressDotCurrent,
          )}
        />
      ))}
    </div>
  );
}

function useStepPlayback(steps, autoDelay = 2400) {
  const [stepIdx, setStepIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const runId = useRef(0);

  const reset = useCallback(() => {
    runId.current += 1;
    setPlaying(false);
    setStepIdx(0);
  }, []);

  const play = useCallback(async () => {
    const id = ++runId.current;
    setPlaying(true);
    setStepIdx(0);
    for (let i = 0; i < steps.length; i += 1) {
      if (id !== runId.current) return;
      setStepIdx(i);
      await sleep(autoDelay);
    }
    if (id === runId.current) setPlaying(false);
  }, [steps.length, autoDelay]);

  useEffect(() => () => {
    runId.current += 1;
  }, []);

  return {stepIdx, setStepIdx, playing, reset, play, step: steps[stepIdx]};
}

function ProcessLifecycleDemoInner() {
  const {stepIdx, setStepIdx, playing, reset, play, step} = useStepPlayback(PROCESS_DEMO.steps);

  return (
    <DemoShell className={styles.root}>
      <header className={styles.header}>
        <h3 className={styles.title}>Как создаётся и живёт процесс</h3>
        <p className={styles.subtitle}>
          multiprocessing: изолированная память, обмен через Queue (IPC). Сравните с потоком — здесь нет общей
          переменной balance.
        </p>
      </header>

      <ProgressDots total={PROCESS_DEMO.steps.length} current={stepIdx} />

      <div className={styles.layout}>
        <CodePanel
          lines={PROCESS_DEMO.codeLines}
          highlight={step.highlight}
          language={PROCESS_DEMO.language}
        />

        <div className={styles.panel}>
          <div className={styles.panelHead}>
            <span>Два адресных пространства</span>
          </div>
          <div className={styles.vizBody}>
            <h4 className={styles.stepTitle}>{step.title}</h4>
            <p className={styles.stepMeta}>{step.codeNote}</p>

            <div className={styles.entityRow}>
              {step.processes.map((p) => (
                <div
                  key={p.id}
                  className={clsx(
                    styles.entity,
                    p.active && styles.entityActive,
                    !p.active && styles.entityIdle,
                  )}
                  style={p.active ? {borderColor: PROC_COLORS[p.id]} : undefined}
                >
                  <div className={styles.entityRole} style={{color: PROC_COLORS[p.id]}}>
                    {p.role}
                  </div>
                  <ul className={styles.memList}>
                    {p.memory.map((m) => (
                      <li key={m}>{m}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {step.ipc?.length > 0 && (
              <>
                <p className={styles.sectionLabel}>Канал IPC</p>
                <ul className={styles.ipcList}>
                  {step.ipc.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </>
            )}

            <div className={clsx(styles.noteBox, styles.noteOs)}>
              <strong>ОС:</strong> {step.osNote}
            </div>
          </div>
        </div>
      </div>

      <p className={styles.stepCounter}>
        Шаг {stepIdx + 1} из {PROCESS_DEMO.steps.length}
      </p>
      <div className={styles.controls}>
        <button
          type="button"
          className="it-demo__btn it-demo__btn--primary"
          onClick={play}
          disabled={playing}
        >
          {playing ? 'Выполняется…' : '▶ Пошагово автоматически'}
        </button>
        <button
          type="button"
          className="it-demo__btn it-demo__btn--secondary"
          disabled={stepIdx <= 0 || playing}
          onClick={() => setStepIdx((i) => Math.max(0, i - 1))}
        >
          ← Назад
        </button>
        <button
          type="button"
          className="it-demo__btn it-demo__btn--secondary"
          disabled={stepIdx >= PROCESS_DEMO.steps.length - 1 || playing}
          onClick={() => setStepIdx((i) => Math.min(PROCESS_DEMO.steps.length - 1, i + 1))}
        >
          Вперёд →
        </button>
        <button type="button" className="it-demo__btn it-demo__btn--secondary" onClick={reset}>
          Сброс
        </button>
      </div>
    </DemoShell>
  );
}

export default ProcessLifecycleDemoInner;
