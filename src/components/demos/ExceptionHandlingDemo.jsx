import React, {useCallback, useEffect, useState} from 'react';

import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';


import {SCENARIO_IDS, getScenario} from '@/components/shared/kb/exceptionDemoEngine';
import shared from '@/components/shared/kb/runtimeDemo.module.css';
import styles from '@/components/demos/ExceptionHandlingDemo.module.css';

const SYNTAX_CLASS = {
  comment: shared.syntaxComment,
  kw: shared.syntaxKw,
  fn: shared.syntaxFn,
  v: shared.syntaxVar,
  p: shared.syntaxPlain,
};

function StackPanel({frames}) {
  if (!frames.length) {
    return <p className={styles.emptyHint}>Стек пуст — выполнение остановлено</p>;
  }
  return frames.map((frame, idx) => {
    const statusClass =
      frame.status === 'active'
        ? styles.stackActive
        : frame.status === 'unwinding'
          ? styles.stackUnwinding
          : frame.status === 'popped'
            ? styles.stackPopped
            : styles.stackWaiting;
    const badge =
      frame.status === 'unwinding'
        ? 'раскрутка'
        : frame.status === 'popped'
          ? 'снят'
          : frame.status === 'waiting'
            ? 'ожидание'
            : null;
    return (
      <div key={`${frame.name}-${idx}`} className={clsx(styles.stackFrame, statusClass)}>
        <span>{frame.name}</span>
        {badge ? (
          <span style={{marginLeft: 'auto', fontSize: '0.68rem', opacity: 0.85}}>{badge}</span>
        ) : null}
      </div>
    );
  });
}

function ExceptionPanel({value, scenarioId}) {
  if (!value) {
    const hint =
      scenarioId === 'errorCode'
        ? 'Здесь появится значение error, если функция вернула ошибку'
        : 'Исключение ещё не создано';
    return <p className={styles.emptyHint}>{hint}</p>;
  }

  if (scenarioId === 'errorCode') {
    return (
      <ErrorValueCard value={value} />
    );
  }

  return (
    <div className={clsx(styles.exceptionCard, value.handled && styles.exceptionCardHandled)}>
      <div className={clsx(styles.exceptionType, value.handled && styles.exceptionTypeHandled)}>
        {value.type}
      </div>
      <ExceptionMessageDiv value={value} />
      {value.fields?.map((f) => (
        <div key={f.k} className={styles.exceptionField}>
          <span className={styles.exceptionFieldKey}>{f.k}:</span>
          <span>{f.v}</span>
        </div>
      ))}
      {value.handled ? (
        <p style={{margin: '0.45rem 0 0', fontSize: '0.72rem', color: '#1565c0'}}>→ передано в except</p>
      ) : null}
      {value.unhandled ? (
        <p style={{margin: '0.45rem 0 0', fontSize: '0.72rem', color: '#c62828'}}>
          → обработчик не найден
        </p>
      ) : null}
    </div>
  );
}

function ErrorValueCard({value}) {
  return (
    <div className={styles.errorValueCard}>
      <div style={{fontWeight: 700, color: '#2e7d32'}}>error</div>
      <div>{value.message}</div>
      {value.note ? <p className={styles.errorValueNote}>{value.note}</p> : null}
    </div>
  );
}

function ExceptionMessageDiv({value}) {
  return <div style={{wordBreak: 'break-word'}}>{value.message}</div>;
}

function ConsolePanel({lines}) {
  if (!lines.length) {
    return (
      <div className={styles.console}>
        <div className={styles.consoleEmpty}>Вывод программы появится на следующих шагах</div>
      </div>
    );
  }
  return (
    <div className={styles.console} role="log" aria-live="polite">
      {lines.map((line, i) => {
        const cls =
          line.type === 'error'
            ? styles.consoleError
            : line.type === 'trace'
              ? styles.consoleTrace
              : line.type === 'warn'
                ? styles.consoleWarn
                : styles.consoleInfo;
        return (
          <div key={i} className={cls}>
            {line.text}
          </div>
        );
      })}
    </div>
  );
}

function ExceptionHandlingDemoInner() {
  const [scenarioId, setScenarioId] = useState('handled');
  const [step, setStep] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);

  const scenario = getScenario(scenarioId);
  const steps = scenario.steps;
  const last = steps.length - 1;
  const current = steps[Math.min(step, last)];

  const reset = useCallback(() => {
    setStep(0);
    setAutoPlay(false);
  }, []);

  useEffect(() => {
    reset();
  }, [scenarioId, reset]);

  const goNext = useCallback(() => {
    setStep((s) => (s < last ? s + 1 : 0));
  }, [last]);

  const goPrev = useCallback(() => {
    setStep((s) => (s > 0 ? s - 1 : last));
  }, [last]);

  useEffect(() => {
    if (!autoPlay) return undefined;
    const id = window.setInterval(goNext, 1800);
    return () => window.clearInterval(id);
  }, [autoPlay, goNext]);

  const panelTitle = scenarioId === 'errorCode' ? 'Значение error' : 'Объект исключения';
  const value = current.exception ?? current.errorValue;

  return (
    <DemoShell className={shared.root}>
      <DemoCard
        title="Ошибка, исключение и раскрутка стека"
        subtitle="Пошагово: как выглядит сбой, стек вызовов и итог для программы"
      >
        <div className={styles.scenarioBar} role="tablist" aria-label="Сценарий">
          {SCENARIO_IDS.map((id) => {
            const sc = getScenario(id);
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={scenarioId === id}
                className={clsx(styles.scenarioBtn, scenarioId === id && styles.scenarioBtnActive)}
                disabled={autoPlay}
                onClick={() => setScenarioId(id)}
              >
                {sc.label}
                <span style={{opacity: 0.75}}> · {sc.short}</span>
              </button>
            );
          })}
        </div>

        <div className={shared.codePanel}>
          <div
            style={{
              padding: '0.35rem 0.75rem',
              fontSize: '0.72rem',
              color: 'var(--demo-muted)',
              borderBottom: '1px solid var(--demo-border)',
            }}
          >
            {scenario.language}
          </div>
          {scenario.lines.map((line) => {
            const active = current.highlight === line.id;
            const indent = line.indent ? {paddingLeft: `${0.75 + line.indent * 1.1}rem`} : undefined;
            return (
              <div
                key={line.id}
                className={clsx(shared.codeLine, active && shared.codeLineActive)}
                style={indent}
              >
                <span className={shared.lineNum}>{line.num}</span>
                <code>
                  {line.parts.map((p, i) => (
                    <span key={i} className={SYNTAX_CLASS[p.t] ?? shared.syntaxPlain}>
                      {p.v}
                    </span>
                  ))}
                </code>
              </div>
            );
          })}
        </div>

        <div className={styles.grid}>
          <div className="it-demo__panel">
            <div className="it-demo__label">Стек вызовов</div>
            <StackPanel frames={current.stack} />
          </div>
          <div className="it-demo__panel">
            <div className="it-demo__label">{panelTitle}</div>
            <ExceptionPanel value={value} scenarioId={scenarioId} />
          </div>
        </div>

        <div style={{marginTop: '0.85rem'}}>
          <div className="it-demo__label">Консоль / журнал</div>
          <ConsolePanel lines={current.console} />
        </div>

        {current.outcome === 'crash' ? (
          <div className={styles.crashBanner} role="alert">
            <p className={styles.crashTitle}>Необработанное исключение</p>
            <p className={styles.crashSub}>
              Процесс завершён: несохранённые данные могут быть потеряны. В продакшене такие
              сбои ловят на границе приложения и логируют с полным контекстом.
            </p>
          </div>
        ) : null}
        {current.outcome === 'ok' ? (
          <div className={clsx('it-demo__alert it-demo__alert--success', styles.outcomeOk)}>
            ✓{' '}
            {scenarioId === 'errorCode'
              ? 'Ошибка обработана явной проверкой err — выполнение продолжается.'
              : 'Исключение перехвачено — программа не завершилась аварийно.'}
          </div>
        ) : null}

        <div className="it-demo__panel" style={{marginTop: '1rem'}}>
          <span style={{color: 'var(--ifm-color-primary)', fontWeight: 600}}>
            Шаг {step + 1} / {steps.length}:
          </span>{' '}
          {current.desc}
        </div>

        <div className="it-demo__progress" style={{margin: '1rem 0 0.35rem'}}>
          <div
            className="it-demo__progress-bar"
            style={{width: `${((step + 1) / steps.length) * 100}%`}}
          />
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
          <button type="button" className="it-demo__btn it-demo__btn--secondary it-demo__btn--sm" onClick={reset}>
            Сброс
          </button>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default ExceptionHandlingDemoInner;
