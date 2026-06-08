import React, {useCallback, useEffect, useRef, useState} from 'react';

import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';


import {LOOPS, LOOP_SPEEDS} from '@/components/shared/kb/loopsEngine';
import shared from '@/components/shared/kb/runtimeDemo.module.css';

function LoopsSimulatorInner() {
  const [loopKey, setLoopKey] = useState('for');
  const [step, setStep] = useState(0);
  const [output, setOutput] = useState([]);
  const [running, setRunning] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const [speedKey, setSpeedKey] = useState('normal');
  const runId = useRef(0);

  const loop = LOOPS[loopKey];
  const speed = LOOP_SPEEDS.find((s) => s.key === speedKey) ?? LOOP_SPEEDS[1];
  const done = step >= loop.iterations;
  const codeLines = loop.code.split('\n');

  const reset = useCallback(() => {
    runId.current += 1;
    setStep(0);
    setOutput([]);
    setRunning(false);
    setAutoPlay(false);
  }, []);

  const changeLoop = (key) => {
    setLoopKey(key);
    reset();
  };

  const runStep = useCallback(() => {
    let finished = false;
    setStep((current) => {
      if (current >= loop.iterations) {
        finished = true;
        return current;
      }
      const next = current + 1;
      const result =
        loopKey === 'collection' ? loop.run(next, loop.items) : loop.run(next);
      setOutput((prev) => [...prev, result]);
      finished = next >= loop.iterations;
      return next;
    });
    return finished;
  }, [loop, loopKey]);

  const handleRunAll = () => {
    reset();
    setRunning(true);
    setAutoPlay(true);
  };

  const handleStep = () => {
    if (done) {
      reset();
      return;
    }
    const finished = runStep();
    if (finished) setRunning(false);
  };

  useEffect(() => {
    if (!autoPlay || done) return undefined;
    const id = window.setInterval(() => {
      const finished = runStep();
      if (finished) {
        setAutoPlay(false);
        setRunning(false);
      }
    }, speed.ms);
    return () => window.clearInterval(id);
  }, [autoPlay, done, runStep, speed.ms]);

  return (
    <DemoShell className={shared.root}>
      <DemoCard
        title="Симулятор циклов"
        subtitle="Пошагово: for, while и обход коллекции for…of"
      >
        <div className="it-demo__tabs">
          {Object.values(LOOPS).map((l) => (
            <button
              key={l.id}
              type="button"
              className={clsx('it-demo__tab', loopKey === l.id && 'it-demo__tab--active')}
              onClick={() => changeLoop(l.id)}
            >
              {l.label}
            </button>
          ))}
        </div>

        <div className="it-demo__panel" style={{marginBottom: '1rem'}}>
          <strong>{loop.title}</strong>
          <p style={{margin: '0.35rem 0 0', fontSize: '0.85rem', color: 'var(--demo-muted)'}}>
            {loop.description}
          </p>
        </div>

        <div className={shared.codePanel}>
          {codeLines.map((line, idx) => {
            const active =
              loop.highlightLines.includes(idx) && step > 0 && (running || done);
            return (
              <div
                key={idx}
                className={clsx(
                  shared.codeLine,
                  active && shared.codeLineActive,
                  done && shared.codeLineDone,
                )}
              >
                <span className={shared.lineNum}>{idx + 1}</span>
                <code>{line || ' '}</code>
              </div>
            );
          })}
        </div>

        <div className="it-demo__panel">
          <div style={{fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem'}}>
            {running && !done ? 'Выполнение…' : done ? 'Цикл завершён' : 'Запустите или шагайте вручную'}
          </div>

          <div className={shared.iterRow}>
            {Array.from({length: loop.iterations}).map((_, idx) => (
              <IterCell
                key={idx}
                n={idx + 1}
                done={idx < step}
                active={idx === step - 1 && running && !done}
              />
            ))}
          </div>

          {output.length > 0 && (
            <div className="it-demo__log" style={{marginTop: '0.75rem'}}>
              {output.map((row, idx) => (
                <div key={idx} className="it-demo__log-entry">
                  <span style={{color: 'var(--ifm-color-primary)'}}>→ {idx + 1}:</span> {row.message}
                  {row.detail && (
                    <span style={{color: 'var(--demo-muted)', marginLeft: '0.35rem'}}>({row.detail})</span>
                  )}
                </div>
              ))}
              {done && (
                <DoneBanner>{loop.finalMessage(output)}</DoneBanner>
              )}
            </div>
          )}
        </div>

        <div className="it-demo__progress" style={{margin: '1rem 0 0.35rem'}}>
          <div
            className="it-demo__progress-bar"
            style={{width: `${(step / loop.iterations) * 100}%`}}
          />
        </div>
        <div style={{textAlign: 'center', fontSize: '0.75rem', color: 'var(--demo-muted)'}}>
          {step} / {loop.iterations}
        </div>

        <div className={shared.controls}>
          <button
            type="button"
            className="it-demo__btn it-demo__btn--primary it-demo__btn--sm"
            onClick={handleRunAll}
            disabled={running && !done}
          >
            ▶ Запустить
          </button>
          <button
            type="button"
            className="it-demo__btn it-demo__btn--secondary it-demo__btn--sm"
            onClick={handleStep}
          >
            {done ? 'Сначала' : 'Шаг →'}
          </button>
          <button type="button" className="it-demo__btn it-demo__btn--secondary it-demo__btn--sm" onClick={reset}>
            Сброс
          </button>
          <div className={shared.speedRow}>
            <span>Скорость:</span>
            {LOOP_SPEEDS.map((s) => (
              <button
                key={s.key}
                type="button"
                className={clsx(
                  'it-demo__btn it-demo__btn--sm',
                  speedKey === s.key ? 'it-demo__btn--primary' : 'it-demo__btn--secondary',
                )}
                onClick={() => setSpeedKey(s.key)}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className={shared.hint}>
          <strong>Как работает {loop.label}:</strong>
          <ul>
            {loop.hints.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

function IterCell({n, done, active}) {
  return (
    <div
      className={clsx(
        shared.iterCell,
        done && shared.iterCellDone,
        active && shared.iterCellActive,
      )}
    >
      {n}
    </div>
  );
}

function DoneBanner({children}) {
  return (
    <div
      className="it-demo__alert it-demo__alert--success"
      style={{marginTop: '0.5rem', textAlign: 'center', fontWeight: 600}}
    >
      {children}
    </div>
  );
}

export default LoopsSimulatorInner;
