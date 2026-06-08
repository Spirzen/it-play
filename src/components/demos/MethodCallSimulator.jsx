import React, {useCallback, useEffect, useRef, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  METHOD_STEPS,
  METHOD_PHASES,
  initialMethodState,
  applyMethodStep,
  phaseForStep,
} from '@/components/shared/kb/methodCallEngine';
import shared from '@/components/shared/kb/runtimeDemo.module.css';
import styles from '@/components/demos/MethodCallSimulator.module.css';

const MAX_STEP = 20;

function MethodCallSimulatorInner() {
  const [state, setState] = useState(initialMethodState);
  const [logs, setLogs] = useState(['Готов к симуляции вызова obj.calculateSum(10, 20).']);
  const [busy, setBusy] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const [simulateException, setSimulateException] = useState(false);
  const runId = useRef(0);

  const currentMeta = METHOD_STEPS.find((s) => s.id === state.step) ?? METHOD_STEPS[0];
  const currentPhase = phaseForStep(state.step);

  const appendLogs = (entries) => {
    setLogs((prev) => [...entries.map((t) => `[${timeNow()}] ${t}`), ...prev].slice(0, 14));
  };

  const goNext = useCallback(() => {
    if (busy || state.step >= MAX_STEP) return;
    const nextId = state.step + 1;
    setBusy(true);
    const result = applyMethodStep(state, nextId, {simulateException});
    setState(result);
    appendLogs(result.logs);
    window.setTimeout(() => setBusy(false), 400);
  }, [busy, state, simulateException]);

  const reset = () => {
    runId.current += 1;
    setAutoPlay(false);
    setState(initialMethodState());
    setLogs(['Симуляция сброшена.']);
    setBusy(false);
  };

  const jumpToPhase = (phaseId) => {
    const phase = METHOD_PHASES.find((p) => p.id === phaseId);
    if (!phase || busy) return;
    const target = phase.steps[phase.steps.length - 1];
    if (target <= state.step) return;
    let s = {...state};
    const newLogs = [];
    for (let i = state.step + 1; i <= target; i++) {
      const r = applyMethodStep(s, i, {simulateException});
      s = r;
      newLogs.push(...r.logs);
    }
    setState(s);
    appendLogs(newLogs);
  };

  useEffect(() => {
    if (!autoPlay || busy || state.step >= MAX_STEP) return undefined;
    const id = window.setInterval(goNext, 900);
    return () => window.clearInterval(id);
  }, [autoPlay, busy, state.step, goNext]);

  return (
    <DemoShell className={shared.root}>
      <DemoCard
        title="Визуализатор вызова метода"
        subtitle="От записи в коде до возврата: стек, CPU, куча"
      >
        <div className="it-demo__progress" style={{marginBottom: '0.35rem'}}>
          <div
            className="it-demo__progress-bar"
            style={{width: `${(state.step / MAX_STEP) * 100}%`}}
          />
        </div>
        <div style={{textAlign: 'right', fontSize: '0.75rem', color: 'var(--demo-muted)', marginBottom: '0.75rem'}}>
          Шаг {state.step} / {MAX_STEP}
        </div>

        <div className={styles.phaseBar}>
          {METHOD_PHASES.map((p) => {
            const last = p.steps[p.steps.length - 1];
            const done = state.step >= last;
            const active = currentPhase.id === p.id;
            return (
              <button
                key={p.id}
                type="button"
                className={clsx(
                  styles.phaseChip,
                  done && styles.phaseChipDone,
                  active && styles.phaseChipActive,
                )}
                onClick={() => jumpToPhase(p.id)}
                disabled={busy || done}
                title={`Перейти к фазе "${p.label}"`}
              >
                {p.label}
              </button>
            );
          })}
        </div>

        <div className={styles.grid}>
          <StackZone callStack={state.callStack} activeFrame={state.activeFrame} />
          <CpuZone
            registers={state.registers}
            pipeline={state.pipeline}
            activeFrame={state.activeFrame}
            exceptionMode={state.exceptionMode}
            jitHot={state.jitHot}
          />
          <HeapZone objects={state.heapObjects} />
        </div>

        <div className={styles.stepCard}>
          <h5>{currentMeta.title}</h5>
          <p>{currentMeta.desc}</p>
        </div>

        <div className={shared.controls}>
          <button
            type="button"
            className="it-demo__btn it-demo__btn--primary it-demo__btn--sm"
            onClick={goNext}
            disabled={busy || state.step >= MAX_STEP}
          >
            {state.step >= MAX_STEP ? 'Завершено' : 'Следующий шаг →'}
          </button>
          <button
            type="button"
            className={clsx(
              'it-demo__btn it-demo__btn--sm',
              autoPlay ? 'it-demo__btn--primary' : 'it-demo__btn--secondary',
            )}
            onClick={() => setAutoPlay((v) => !v)}
            disabled={state.step >= MAX_STEP}
          >
            {autoPlay ? '⏸ Пауза' : '▶ Авто'}
          </button>
          <button type="button" className="it-demo__btn it-demo__btn--danger it-demo__btn--sm" onClick={reset}>
            Сброс
          </button>
          <label style={{display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem'}}>
            <input
              type="checkbox"
              checked={simulateException}
              onChange={(e) => setSimulateException(e.target.checked)}
            />
            Исключение на шаге 12
          </label>
        </div>

        <div className="it-demo__label">Журнал</div>
        <div className="it-demo__log">
          {logs.map((line, idx) => (
            <div key={idx} className="it-demo__log-entry">
              {line}
            </div>
          ))}
        </div>
      </DemoCard>
    </DemoShell>
  );
}

function StackZone({callStack, activeFrame}) {
  return (
    <div className={clsx(styles.zone, styles.zoneStack)}>
      <div className={styles.zoneTitle}>Стек (Stack)</div>
      <div className={shared.stackCol}>
        {callStack.length === 0 ? (
          <span style={{fontSize: '0.8rem', color: 'var(--demo-muted)'}}>Пусто</span>
        ) : (
          callStack.map((frame, idx) => (
            <div
              key={idx}
              className={clsx(
                shared.stackFrame,
                activeFrame && idx === callStack.length - 1 && styles.stackFrameActive,
              )}
            >
              <strong>Frame #{idx + 1}</strong>
              <div style={{fontSize: '0.72rem', marginTop: '0.2rem'}}>
                args: {frame.args?.join(', ') ?? '—'}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function CpuZone({registers, pipeline, activeFrame, exceptionMode, jitHot}) {
  const stages = ['fetch', 'decode', 'execute', 'writeback'];
  return (
    <div className={clsx(styles.zone, styles.zoneCpu)}>
      <div className={styles.zoneTitle}>CPU</div>
      <div className={styles.regRow}>
        <span>RIP</span>
        <code>{registers.RIP}</code>
      </div>
      <div className={styles.regRow}>
        <span>RSP</span>
        <code>{registers.RSP}</code>
      </div>
      <div className={styles.regRow}>
        <span>RAX</span>
        <code style={{color: registers.RAX !== '0x0000' ? 'var(--demo-success)' : undefined}}>
          {registers.RAX}
        </code>
      </div>
      <div className={styles.pipeline}>
        {stages.map((s) => (
          <span key={s} className={clsx(styles.pipeStage, pipeline.includes(s) && styles.pipeStageOn)}>
            {s}
          </span>
        ))}
      </div>
      <div style={{marginTop: '0.5rem', fontSize: '0.78rem'}}>
        <span className={clsx('it-demo__badge', activeFrame && 'it-demo__badge--active')}>
          {activeFrame ? 'В методе' : 'Ожидание'}
        </span>
        {exceptionMode && (
          <span className="it-demo__badge" style={{marginLeft: '0.35rem', color: 'var(--demo-error)'}}>
            Exception
          </span>
        )}
        {jitHot > 0 && (
          <span style={{marginLeft: '0.35rem', fontSize: '0.72rem', color: 'var(--demo-muted)'}}>
            JIT hot: {jitHot}
          </span>
        )}
      </div>
    </div>
  );
}

function HeapZone({objects}) {
  return (
    <div className={clsx(styles.zone, styles.zoneHeap)}>
      <div className={styles.zoneTitle}>Куча (Heap)</div>
      {objects.length === 0 ? (
        <span style={{fontSize: '0.8rem', color: 'var(--demo-muted)'}}>Нет объектов</span>
      ) : (
        objects.map((obj, i) => (
          <div key={i} className={shared.stackFrame} style={{marginBottom: '0.35rem'}}>
            <strong>{obj.type}</strong> @ {obj.addr}
            <div style={{fontSize: '0.72rem'}}>value = {obj.fields?.value ?? '—'}</div>
          </div>
        ))
      )}
    </div>
  );
}

function timeNow() {
  return new Date().toLocaleTimeString();
}

export default MethodCallSimulatorInner;
