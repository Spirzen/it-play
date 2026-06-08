import React, {useCallback, useEffect, useRef, useState} from 'react';

import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';


import {PROMISE_DEMO, sleep} from '@/components/shared/kb/concurrencyLifecycleEngine';
import styles from '@/components/demos/ConcurrencyLifecycleDemo.module.css';

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

function useStepPlayback(steps, autoDelay = 2200) {
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

function PromiseAsyncDemoInner() {
  const {stepIdx, setStepIdx, playing, reset, play, step} = useStepPlayback(PROMISE_DEMO.steps);

  return (
    <DemoShell className={styles.root}>
      <header className={styles.header}>
        <h3 className={styles.title}>Асинхронность на Promise — один поток JS</h3>
        <p className={styles.subtitle}>
          fetch + .then: сеть ждётся в Web API, а console.log('B') выполняется сразу. Без новых потоков ОС — только
          event loop и очереди.
        </p>
      </header>

      <ProgressDots total={PROMISE_DEMO.steps.length} current={stepIdx} />

      <div className={styles.layout}>
        <CodePanel
          lines={PROMISE_DEMO.codeLines}
          highlight={step.highlight}
          language={PROMISE_DEMO.language}
        />

        <div className={styles.panel}>
          <div className={styles.panelHead}>
            <span>Call Stack · Web API · Microtasks</span>
          </div>
          <div className={styles.vizBody}>
            <h4 className={styles.stepTitle}>{step.title}</h4>
            <p className={styles.stepMeta}>{step.codeNote}</p>

            <div className={styles.runtimeGrid}>
              <div className={styles.runtimeCol}>
                <p className={styles.runtimeColTitle}>Call Stack</p>
                <div className={styles.queueList}>
                  {(step.stack ?? []).length === 0 ? (
                    <span style={{fontSize: '0.72rem', color: 'var(--demo-muted)'}}>пусто</span>
                  ) : (
                    step.stack.map((frame) => (
                      <div key={frame} className={clsx(styles.queueItem, styles.queueItemActive)}>
                        {frame}
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className={styles.runtimeCol}>
                <p className={styles.runtimeColTitle}>Web API</p>
                {step.webApi ? (
                  <div className={styles.webApiBox}>{step.webApi}</div>
                ) : (
                  <span style={{fontSize: '0.72rem', color: 'var(--demo-muted)'}}>нет активных</span>
                )}
              </div>

              <div className={styles.runtimeCol}>
                <p className={styles.runtimeColTitle}>Microtask Queue</p>
                <div className={styles.queueList}>
                  {(step.micro ?? []).length === 0 ? (
                    <span style={{fontSize: '0.72rem', color: 'var(--demo-muted)'}}>пусто</span>
                  ) : (
                    step.micro.map((task) => (
                      <div key={task} className={clsx(styles.queueItem, styles.queueItemActive)}>
                        {task}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className={styles.consoleRow}>
              <span className={styles.consoleLabel}>console →</span>
              {step.console.map((line) => (
                <span key={line} className={styles.consoleChip}>
                  {line}
                </span>
              ))}
            </div>

            <div className={clsx(styles.noteBox, styles.noteOs)}>
              <strong>Runtime:</strong> {step.osNote}
            </div>
          </div>
        </div>
      </div>

      <p className={styles.stepCounter}>
        Шаг {stepIdx + 1} из {PROMISE_DEMO.steps.length}
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
          disabled={stepIdx >= PROMISE_DEMO.steps.length - 1 || playing}
          onClick={() => setStepIdx((i) => Math.min(PROMISE_DEMO.steps.length - 1, i + 1))}
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

export default PromiseAsyncDemoInner;
