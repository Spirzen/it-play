import React, {useCallback, useEffect, useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  createTurtleState,
  expandProgramSteps,
  getFilledRegions,
  QUICK_COMMANDS,
  runTurtleCommand,
  TURTLE_PROGRAMS,
  TURTLE_SPEEDS,
} from '@/components/shared/kb/turtleEngine';
import shared from '@/components/shared/kb/runtimeDemo.module.css';
import styles from '@/components/demos/TurtleGraphicsSimulator.module.css';

const VIEW = 400;
const CENTER = VIEW / 2;
const SCALE = 1.35;

function toScreen(x, y) {
  return {sx: CENTER + x * SCALE, sy: CENTER - y * SCALE};
}

function TurtleStage({state, pulse}) {
  const turtlePos = toScreen(state.x, state.y);
  const filled = getFilledRegions(state);

  return (
    <div className={styles.stage}>
      <svg
        className={styles.stageSvg}
        viewBox={`0 0 ${VIEW} ${VIEW}`}
        role="img"
        aria-label="Поле черепашьей графики"
      >
        <defs>
          <pattern id="turtleGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" className={styles.gridLine} />
          </pattern>
        </defs>
        <rect width={VIEW} height={VIEW} fill="url(#turtleGrid)" />
        <line
          x1={0}
          y1={CENTER}
          x2={VIEW}
          y2={CENTER}
          className={styles.axisLine}
        />
        <line
          x1={CENTER}
          y1={0}
          x2={CENTER}
          y2={VIEW}
          className={styles.axisLine}
        />

        {filled.map((region, idx) => {
          const pts = region.points
            .map((p) => {
              const {sx, sy} = toScreen(p.x, p.y);
              return `${sx},${sy}`;
            })
            .join(' ');
          return (
            <polygon
              key={`fill-${idx}`}
              points={pts}
              className={styles.fillRegion}
              fill={region.color}
            />
          );
        })}

        {state.segments.map((seg, idx) => {
          const a = toScreen(seg.from.x, seg.from.y);
          const b = toScreen(seg.to.x, seg.to.y);
          return (
            <line
              key={idx}
              x1={a.sx}
              y1={a.sy}
              x2={b.sx}
              y2={b.sy}
              className={styles.pathLine}
              stroke={seg.color}
              strokeWidth={seg.width}
            />
          );
        })}

        {state.visible && (
          <g
            className={clsx(styles.turtleIcon, pulse && styles.turtlePulse)}
            transform={`translate(${turtlePos.sx}, ${turtlePos.sy}) rotate(${-state.heading})`}
          >
            <polygon
              className={styles.turtleBody}
              points="0,-10 14,0 0,10 -6,0"
            />
          </g>
        )}
      </svg>
      <div className={styles.coordsBadge}>
        <div>
          <strong>x</strong> {state.x.toFixed(0)} &nbsp;
          <strong>y</strong> {state.y.toFixed(0)}
        </div>
        <div>
          <strong>угол</strong> {state.heading.toFixed(0)}° &nbsp;
          <span className={state.penDown ? styles.penDown : styles.penUp}>
            {state.penDown ? '● ручка вниз' : '○ ручка вверх'}
          </span>
        </div>
      </div>
    </div>
  );
}

function TurtleGraphicsSimulatorInner() {
  const [mode, setMode] = useState('program');
  const [programKey, setProgramKey] = useState('square');
  const [step, setStep] = useState(0);
  const [turtle, setTurtle] = useState(() => createTurtleState());
  const [log, setLog] = useState([]);
  const [running, setRunning] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const [speedKey, setSpeedKey] = useState('normal');
  const [pulse, setPulse] = useState(false);
  const [sandboxSteps, setSandboxSteps] = useState([]);

  const program = TURTLE_PROGRAMS[programKey];
  const programSteps = useMemo(() => expandProgramSteps(program), [program]);
  const activeSteps = mode === 'sandbox' ? sandboxSteps : programSteps;
  const speed = TURTLE_SPEEDS.find((s) => s.key === speedKey) ?? TURTLE_SPEEDS[1];
  const done = step >= activeSteps.length;
  const codeLines = program.code.split('\n');
  const currentStep = activeSteps[Math.min(step, activeSteps.length - 1)];

  const reset = useCallback(() => {
    setStep(0);
    setTurtle(createTurtleState());
    setLog([]);
    setRunning(false);
    setAutoPlay(false);
    setSandboxSteps([]);
  }, []);

  const changeProgram = (key) => {
    setProgramKey(key);
    setMode('program');
    reset();
  };

  const applyStep = useCallback(() => {
    let finished = false;
    setStep((current) => {
      if (current >= activeSteps.length) {
        finished = true;
        return current;
      }
      const cmd = activeSteps[current];
      setTurtle((prev) => {
        const {state, label} = runTurtleCommand(prev, cmd);
        setLog((logPrev) => [...logPrev, label || `${cmd.type}()`]);
        return state;
      });
      setPulse(true);
      window.setTimeout(() => setPulse(false), 280);
      const next = current + 1;
      finished = next >= activeSteps.length;
      return next;
    });
    return finished;
  }, [activeSteps]);

  const runSandboxCommand = (cmd) => {
    const {state, label} = runTurtleCommand(turtle, cmd);
    setTurtle(state);
    setSandboxSteps((prev) => [...prev, cmd]);
    setLog((prev) => [...prev, label]);
    setPulse(true);
    window.setTimeout(() => setPulse(false), 280);
  };

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
    const finished = applyStep();
    if (finished) setRunning(false);
  };

  useEffect(() => {
    if (!autoPlay || done) return undefined;
    const id = window.setInterval(() => {
      const finished = applyStep();
      if (finished) {
        setAutoPlay(false);
        setRunning(false);
      }
    }, speed.ms);
    return () => window.clearInterval(id);
  }, [autoPlay, done, applyStep, speed.ms]);

  const highlightLine =
    currentStep && !done ? currentStep.lineIndex : done ? -1 : program.highlightLines[0];

  return (
    <DemoShell className={clsx(shared.root, styles.root)}>
      <DemoCard
        title="Симулятор Turtle"
        subtitle="Черепашья графика: команды, координаты и рисование фигур по шагам"
      >
        <div className="it-demo__tabs">
          {Object.values(TURTLE_PROGRAMS).map((p) => (
            <button
              key={p.id}
              type="button"
              className={clsx(
                'it-demo__tab',
                mode === 'program' && programKey === p.id && 'it-demo__tab--active',
              )}
              onClick={() => changeProgram(p.id)}
            >
              {p.label}
            </button>
          ))}
          <button
            type="button"
            className={clsx('it-demo__tab', mode === 'sandbox' && 'it-demo__tab--active')}
            onClick={() => {
              setMode('sandbox');
              reset();
            }}
          >
            Песочница
          </button>
        </div>

        <div className="it-demo__panel" style={{marginBottom: '0.75rem'}}>
          <strong>{mode === 'sandbox' ? 'Свободные команды' : program.title}</strong>
          <p style={{margin: '0.35rem 0 0', fontSize: '0.85rem', color: 'var(--demo-muted)'}}>
            {mode === 'sandbox'
              ? 'Нажимайте команды справа — черепашка выполнит их сразу, как в Python.'
              : program.description}
          </p>
        </div>

        <div className={styles.layout}>
          <div>
            {mode === 'program' && (
              <div className={shared.codePanel}>
                {codeLines.map((line, idx) => (
                  <div
                    key={idx}
                    className={clsx(
                      shared.codeLine,
                      highlightLine === idx && (running || step > 0) && shared.codeLineActive,
                      done && shared.codeLineDone,
                    )}
                  >
                    <span className={shared.lineNum}>{idx + 1}</span>
                    <code>{line || ' '}</code>
                  </div>
                ))}
              </div>
            )}
            <TurtleStage state={turtle} pulse={pulse} />
          </div>

          <div>
            <div className="it-demo__panel">
              <div className="it-demo__label">Журнал команд</div>
              <div className={styles.log}>
                {log.length === 0 ? (
                  <span style={{color: 'var(--demo-muted)'}}>Пока пусто</span>
                ) : (
                  log.map((entry, idx) => (
                    <div
                      key={idx}
                      className={clsx(
                        styles.logEntry,
                        idx === log.length - 1 && styles.logEntryActive,
                      )}
                    >
                      → {entry}
                    </div>
                  ))
                )}
              </div>
            </div>

            {mode === 'sandbox' && (
              <div className="it-demo__panel" style={{marginTop: '0.75rem'}}>
                <div className="it-demo__label">Базовые команды</div>
                <div className={styles.cmdGrid}>
                  {QUICK_COMMANDS.map((cmd) => (
                    <button
                      key={cmd.label}
                      type="button"
                      className={styles.cmdChip}
                      onClick={() => runSandboxCommand(cmd)}
                    >
                      {cmd.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {mode === 'program' && (
              <>
                <div className="it-demo__progress" style={{margin: '0.85rem 0 0.35rem'}}>
                  <div
                    className="it-demo__progress-bar"
                    style={{
                      width: `${activeSteps.length ? (step / activeSteps.length) * 100 : 0}%`,
                    }}
                  />
                </div>
                <div
                  style={{
                    textAlign: 'center',
                    fontSize: '0.75rem',
                    color: 'var(--demo-muted)',
                    marginBottom: '0.65rem',
                  }}
                >
                  {step} / {activeSteps.length}
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
                  <button
                    type="button"
                    className="it-demo__btn it-demo__btn--secondary it-demo__btn--sm"
                    onClick={reset}
                  >
                    Сброс
                  </button>
                </div>
              </>
            )}

            {mode === 'sandbox' && (
              <div className={shared.controls} style={{marginTop: '0.75rem'}}>
                <button
                  type="button"
                  className="it-demo__btn it-demo__btn--secondary it-demo__btn--sm"
                  onClick={reset}
                >
                  Сброс
                </button>
              </div>
            )}

            <div className={shared.speedRow} style={{marginTop: '0.65rem'}}>
              <span>Скорость:</span>
              {TURTLE_SPEEDS.map((s) => (
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
        </div>

        {mode === 'program' && (
          <div className={shared.hint} style={{marginTop: '1rem'}}>
            <strong>Как читать симуляцию:</strong>
            <ul>
              {program.hints.map((h) => (
                <li key={h}>{h}</li>
              ))}
              <li>
                Ось X — вправо, Y — вверх (как в математике и в модуле{' '}
                <code>turtle</code>).
              </li>
              <li>
                <code>forward</code> / <code>backward</code>, <code>left</code> /{' '}
                <code>right</code>, <code>penup</code> / <code>pendown</code> — основа
                всех фигур из примеров.
              </li>
            </ul>
          </div>
        )}
      </DemoCard>
    </DemoShell>
  );
}

export default TurtleGraphicsSimulatorInner;
