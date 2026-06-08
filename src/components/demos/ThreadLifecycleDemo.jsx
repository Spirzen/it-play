import React, {useCallback, useEffect, useRef, useState} from 'react';

import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';


import {PROCESS_DEMO, THREAD_DEMO, sleep} from '@/components/shared/kb/concurrencyLifecycleEngine';
import styles from '@/components/demos/ConcurrencyLifecycleDemo.module.css';

const THREAD_COLORS = {main: '#3498db', worker: '#e74c3c'};

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

function StepControls({stepIdx, total, playing, onPlay, onBack, onForward, onReset}) {
  return (
    <>
      <p className={styles.stepCounter}>
        Шаг {stepIdx + 1} из {total}
      </p>
      <div className={styles.controls}>
        <button
          type="button"
          className="it-demo__btn it-demo__btn--primary"
          onClick={onPlay}
          disabled={playing}
        >
          {playing ? 'Выполняется…' : '▶ Пошагово автоматически'}
        </button>
        <button
          type="button"
          className="it-demo__btn it-demo__btn--secondary"
          disabled={stepIdx <= 0 || playing}
          onClick={onBack}
        >
          ← Назад
        </button>
        <button
          type="button"
          className="it-demo__btn it-demo__btn--secondary"
          disabled={stepIdx >= total - 1 || playing}
          onClick={onForward}
        >
          Вперёд →
        </button>
        <button type="button" className="it-demo__btn it-demo__btn--secondary" onClick={onReset}>
          Сброс
        </button>
      </div>
    </>
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

  return {
    stepIdx,
    setStepIdx,
    playing,
    reset,
    play,
    step: steps[stepIdx],
  };
}

function ThreadLifecycleDemoInner() {
  const {stepIdx, setStepIdx, playing, reset, play, step} = useStepPlayback(THREAD_DEMO.steps);
  const threads = [
    {id: 'main', label: 'Главный поток', role: 'UI / main()'},
    {id: 'worker', label: 'Worker-поток', role: 'export_report()'},
  ];

  return (
    <DemoShell className={styles.root}>
      <header className={styles.header}>
        <h3 className={styles.title}>Как создаётся и живёт поток</h3>
        <p className={styles.subtitle}>
          Реальный паттерн threading: один процесс, общая память, start/join и lock. Нажмите «Пошагово» —
          увидите, что делает ОС на каждой строке.
        </p>
      </header>

      <ProgressDots total={THREAD_DEMO.steps.length} current={stepIdx} />

      <div className={styles.layout}>
        <CodePanel
          lines={THREAD_DEMO.codeLines}
          highlight={step.highlight}
          language={THREAD_DEMO.language}
        />

        <div className={styles.panel}>
          <div className={styles.panelHead}>
            <span>Память процесса и потоки</span>
          </div>
          <div className={styles.vizBody}>
            <h4 className={styles.stepTitle}>{step.title}</h4>
            <p className={styles.stepMeta}>{step.codeNote}</p>

            <div className={styles.entityRow}>
              {threads.map((t) => {
                const active = step.activeThreads?.includes(t.id);
                const exists = step.activeThreads?.includes(t.id) || t.id === 'main';
                return (
                  <div
                    key={t.id}
                    className={clsx(
                      styles.entity,
                      active && styles.entityActive,
                      !exists && t.id === 'worker' && styles.entityIdle,
                    )}
                    style={active ? {borderColor: THREAD_COLORS[t.id]} : undefined}
                  >
                    <div className={styles.entityRole} style={{color: THREAD_COLORS[t.id]}}>
                      {t.label}
                    </div>
                    <div className={styles.entityMem}>{t.role}</div>
                  </div>
                );
              })}
            </div>

            <p className={styles.sectionLabel}>Общая память процесса</p>
            <ul className={styles.memList}>
              {step.memory.shared.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            {step.memory.isolated?.length > 0 && (
              <>
                <p className={styles.sectionLabel}>У каждого потока своё</p>
                <ul className={styles.memList}>
                  {step.memory.isolated.map((item) => (
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

      <StepControls
        stepIdx={stepIdx}
        total={THREAD_DEMO.steps.length}
        playing={playing}
        onPlay={play}
        onBack={() => setStepIdx((i) => Math.max(0, i - 1))}
        onForward={() => setStepIdx((i) => Math.min(THREAD_DEMO.steps.length - 1, i + 1))}
        onReset={reset}
      />
    </DemoShell>
  );
}

export default ThreadLifecycleDemoInner;
