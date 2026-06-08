import React, {useCallback, useEffect, useState} from 'react';

import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';


import {buildFunctionSteps, FUNCTION_CODE_LINES} from '@/components/shared/kb/functionSimEngine';
import shared from '@/components/shared/kb/runtimeDemo.module.css';

const TOKEN_CLASS = {
  comment: {color: 'var(--demo-muted)'},
  kw: {color: '#c586c0'},
  fn: {color: '#dcdcaa'},
  v: {color: '#9cdcfe'},
  p: {color: '#d4d4d4'},
};

function FunctionSimulatorInner() {
  const [callArg, setCallArg] = useState(5);
  const [step, setStep] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);

  const steps = buildFunctionSteps(callArg);
  const last = steps.length - 1;
  const current = steps[Math.min(step, last)];

  const reset = useCallback(() => {
    setStep(0);
    setAutoPlay(false);
  }, []);

  const goNext = useCallback(() => {
    setStep((s) => (s < last ? s + 1 : 0));
  }, [last]);

  const goPrev = useCallback(() => {
    setStep((s) => (s > 0 ? s - 1 : last));
  }, [last]);

  useEffect(() => {
    reset();
  }, [callArg, reset]);

  useEffect(() => {
    if (!autoPlay) return undefined;
    const id = window.setInterval(goNext, 1600);
    return () => window.clearInterval(id);
  }, [autoPlay, goNext]);

  const highlightFor = (lineId) => current.highlight === lineId;

  return (
    <DemoShell className={shared.root}>
      <DemoCard
        title="Симулятор выполнения функции"
        subtitle="Вызов, стек, вычисление и возврат значения"
      >
        <div className={shared.codePanel}>
          {FUNCTION_CODE_LINES.map((line) => {
            const active = highlightFor(line.id);
            const indent = line.indent ? {paddingLeft: '1.25rem'} : undefined;
            let text = line.parts
              .map((p) => p.v)
              .join('');
            if (line.id === 'call') {
              text = `num = double(${callArg})`;
            }
            return (
              <div
                key={line.id}
                className={clsx(shared.codeLine, active && shared.codeLineActive)}
                style={indent}
              >
                <span className={shared.lineNum}>{line.num}</span>
                <code>
                  {line.id === 'call' ? (
                    <>
                      <span style={TOKEN_CLASS.v}>num</span>
                      <span style={TOKEN_CLASS.p}> = </span>
                      <span style={TOKEN_CLASS.fn}>double</span>
                      <span style={TOKEN_CLASS.p}>({callArg})</span>
                    </>
                  ) : line.parts.length ? (
                    line.parts.map((p, i) => (
                      <span key={i} style={TOKEN_CLASS[p.t] ?? undefined}>
                        {p.v}
                      </span>
                    ))
                  ) : (
                    text
                  )}
                </code>
              </div>
            );
          })}
        </div>

        <div className="it-demo__grid it-demo__grid--2" style={{marginTop: '1rem'}}>
          <div className="it-demo__panel">
            <div className="it-demo__label">Стек вызовов</div>
            {current.callStack.length === 0 ? (
              <p style={{margin: 0, fontSize: '0.85rem', color: 'var(--demo-muted)'}}>
                Стек пуст — функция не активна
              </p>
            ) : (
              <div className={shared.stackCol}>
                {current.callStack.map((frame, idx) => (
                  <div key={idx} className={shared.stackFrame}>
                    <span style={{color: '#dcdcaa'}}>{frame.name}</span>
                    (x = {frame.param}) → {frame.line}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="it-demo__panel">
            <div className="it-demo__label">Поток данных</div>
            {(current.computation || current.returnValue != null) && (
              <div className={shared.flowRow}>
                {current.arg != null && (
                  <>
                    <div>
                      <div style={{fontSize: '0.72rem', color: 'var(--demo-muted)'}}>x</div>
                      <div className={shared.flowBubble} style={{background: 'var(--ifm-color-primary)', color: '#fff'}}>
                        {current.arg}
                      </div>
                    </div>
                    <span className={shared.flowArrow}>→</span>
                  </>
                )}
                {current.computation && (
                  <div>
                    <div style={{fontSize: '0.72rem', color: 'var(--demo-muted)'}}>вычисление</div>
                    <div
                      className={shared.flowBubble}
                      style={{
                        borderRadius: '8px',
                        width: 'auto',
                        padding: '0 0.75rem',
                        background: 'color-mix(in srgb, var(--demo-success) 20%, transparent)',
                      }}
                    >
                      {current.computation}
                    </div>
                  </div>
                )}
                {current.returnValue != null && (
                  <>
                    <span className={shared.flowArrow}>←</span>
                    <div>
                      <div style={{fontSize: '0.72rem', color: 'var(--demo-muted)'}}>return</div>
                      <div className={shared.flowBubble} style={{background: 'var(--ifm-color-emphasis-300)'}}>
                        {current.returnValue}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
            {!current.computation && current.returnValue == null && current.finalResult == null && (
              <p style={{margin: 0, fontSize: '0.85rem', color: 'var(--demo-muted)'}}>
                Запустите шаги, чтобы увидеть передачу аргумента и результат
              </p>
            )}
            {current.finalResult != null && (
              <div className="it-demo__alert it-demo__alert--success" style={{marginTop: '0.5rem'}}>
                ✓ num = {current.finalResult}
              </div>
            )}
          </div>
        </div>

        <div className="it-demo__panel" style={{marginTop: '1rem'}}>
          <span style={{color: 'var(--ifm-color-primary)', fontWeight: 600}}>Шаг {step + 1}:</span>{' '}
          {current.description}
        </div>

        <div className="it-demo__progress" style={{margin: '1rem 0 0.35rem'}}>
          <div className="it-demo__progress-bar" style={{width: `${((step + 1) / steps.length) * 100}%`}} />
        </div>

        <div className={shared.controls}>
          <button type="button" className="it-demo__btn it-demo__btn--secondary it-demo__btn--sm" onClick={goPrev}>
            ← Назад
          </button>
          <button type="button" className="it-demo__btn it-demo__btn--primary it-demo__btn--sm" onClick={goNext}>
            {step === last ? 'Сначала' : 'Далее →'}
          </button>
          <button
            type="button"
            className={clsx(
              'it-demo__btn it-demo__btn--sm',
              autoPlay ? 'it-demo__btn--primary' : 'it-demo__btn--secondary',
            )}
            onClick={() => setAutoPlay((v) => !v)}
          >
            {autoPlay ? '⏸ Пауза' : '▶ Авто'}
          </button>
          <label style={{display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem'}}>
            <span style={{color: 'var(--demo-muted)'}}>Аргумент:</span>
            <input
              type="number"
              className="it-demo__input"
              style={{width: '4.5rem', padding: '0.35rem 0.5rem'}}
              value={callArg}
              onChange={(e) => setCallArg(Number(e.target.value) || 0)}
              disabled={autoPlay}
            />
          </label>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default FunctionSimulatorInner;
