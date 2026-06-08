import React, {useCallback, useEffect, useRef, useState} from 'react';

import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';


import {
  DEBUGGER_CODE,
  DEFAULT_BREAKPOINTS,
  OUTPUT_COLORS,
  TOKEN_CLASS,
  cloneContext,
  createInitialDebugContext,
  executeSingleLine,
  functionAtLine,
  tokenizeLine,
} from '@/components/shared/kb/debuggerEngine';
import styles from '@/components/demos/DebuggerEmulator.module.css';

const TOKEN_CSS = {
  [TOKEN_CLASS.kw]: styles.tokenKw,
  [TOKEN_CLASS.fn]: styles.tokenFn,
  [TOKEN_CLASS.v]: styles.tokenV,
  [TOKEN_CLASS.str]: styles.tokenStr,
  [TOKEN_CLASS.num]: styles.tokenNum,
  [TOKEN_CLASS.comment]: styles.tokenComment,
  [TOKEN_CLASS.p]: styles.tokenP,
};

function timeNow() {
  return new Date().toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

function DebuggerEmulatorInner() {
  const codeLines = useRef(DEBUGGER_CODE.split('\n')).current;

  const [breakpoints, setBreakpoints] = useState(() => new Set(DEFAULT_BREAKPOINTS));
  const [currentLine, setCurrentLine] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [variables, setVariables] = useState({});
  const [output, setOutput] = useState([]);
  const [callStack, setCallStack] = useState([]);
  const [sidebarTab, setSidebarTab] = useState('vars');

  const executionStateRef = useRef(createInitialDebugContext(codeLines));

  const addOutput = useCallback((text, type = 'info') => {
    setOutput((prev) =>
      [{text, type, timestamp: timeNow()}, ...prev].slice(0, 50),
    );
  }, []);

  const updateUI = useCallback(
    (context) => {
      setCurrentLine(context.programCounter);
      setVariables({...context.localVars});
      setCallStack([
        ...context.callStack.map((cs) => ({
          function: cs.functionName,
          line: cs.returnLine,
        })),
        {
          function: context.currentFunction || 'global',
          line: context.programCounter,
        },
      ]);
    },
    [],
  );

  const runLine = useCallback(
    (line, ctx) =>
      executeSingleLine(line, ctx, codeLines, (entry) =>
        addOutput(entry.text, entry.type),
      ),
    [codeLines, addOutput],
  );

  const runSilent = useCallback(
    (line, ctx) => executeSingleLine(line, ctx, codeLines),
    [codeLines],
  );

  const startDebug = useCallback(() => {
    const ctx = createInitialDebugContext(codeLines);
    executionStateRef.current = ctx;
    setCurrentLine(ctx.programCounter);
    setVariables({});
    setCallStack([{function: 'main', line: ctx.programCounter}]);
    setOutput([]);
    setIsRunning(true);
    setIsPaused(true);
    addOutput('Отладка запущена — entry point main()', 'start');
    addOutput('F10 — шаг, F5 — продолжить, клик по точке в gutter — breakpoint', 'info');
  }, [codeLines, addOutput]);

  const finishProgram = useCallback(() => {
    executionStateRef.current.isProgramFinished = true;
    setIsRunning(false);
    setIsPaused(false);
    setCurrentLine(null);
    addOutput('Выполнение программы завершено', 'success');
  }, [addOutput]);

  const step = useCallback(
    (stepType = 'into') => {
      if (!isPaused && !isRunning) {
        startDebug();
        return;
      }
      if (!isPaused) return;

      const context = executionStateRef.current;
      if (context.isProgramFinished) {
        addOutput('Программа завершена — нажмите Restart', 'warning');
        return;
      }

      if (stepType === 'over' && context.callStack.length > 0) {
        const depth = context.callStack.length;
        const temp = cloneContext(context);
        let pc = context.programCounter;
        const res = runSilent(pc, temp);
        if (!res.nextLine) {
          finishProgram();
          return;
        }
        pc = res.nextLine;
        while (pc && temp.callStack.length >= depth && !temp.isProgramFinished) {
          const r = runSilent(pc, temp);
          if (!r.nextLine) break;
          pc = r.nextLine;
        }
        context.programCounter = pc;
        context.callStack = temp.callStack;
        context.localVars = temp.localVars;
        context.currentFunction = temp.currentFunction;
        updateUI(context);
        setIsPaused(true);
        addOutput(`Step Over — строка ${pc}`, 'step');
        return;
      }

      if (stepType === 'out' && context.callStack.length > 0) {
        const targetDepth = context.callStack.length - 1;
        const temp = cloneContext(context);
        let pc = context.programCounter;
        while (pc && temp.callStack.length > targetDepth && !temp.isProgramFinished) {
          const r = runSilent(pc, temp);
          if (!r.nextLine) break;
          pc = r.nextLine;
        }
        context.programCounter = pc;
        context.callStack = temp.callStack;
        context.localVars = temp.localVars;
        context.currentFunction = temp.currentFunction;
        updateUI(context);
        setIsPaused(true);
        addOutput(`Step Out — строка ${pc}`, 'step');
        return;
      }

      const result = runLine(context.programCounter, context);
      if (!result.nextLine) {
        finishProgram();
        return;
      }

      context.programCounter = result.nextLine;
      if (breakpoints.has(context.programCounter)) {
        updateUI(context);
        setIsPaused(true);
        addOutput(`Breakpoint на строке ${context.programCounter}`, 'breakpoint');
        return;
      }

      updateUI(context);
      if (context.programCounter > codeLines.length) {
        finishProgram();
      } else {
        setIsPaused(true);
      }
    },
    [
      isPaused,
      isRunning,
      breakpoints,
      codeLines.length,
      startDebug,
      runLine,
      runSilent,
      updateUI,
      addOutput,
      finishProgram,
    ],
  );

  const continueExecution = useCallback(() => {
    if (!isPaused) return;
    const context = executionStateRef.current;
    let pc = context.programCounter;
    const temp = cloneContext(context);

    while (pc && !temp.isProgramFinished) {
      if (breakpoints.has(pc) && pc !== context.programCounter) {
        context.programCounter = pc;
        context.callStack = temp.callStack;
        context.localVars = temp.localVars;
        context.currentFunction = temp.currentFunction;
        updateUI(context);
        addOutput(`Breakpoint на строке ${pc}`, 'breakpoint');
        setIsPaused(true);
        return;
      }
      const res = runSilent(pc, temp);
      if (!res.nextLine || res.shouldStop) {
        if (res.shouldStop) temp.isProgramFinished = true;
        break;
      }
      pc = res.nextLine;
    }

    if (temp.isProgramFinished) {
      finishProgram();
    } else {
      context.programCounter = pc;
      context.callStack = temp.callStack;
      context.localVars = temp.localVars;
      context.currentFunction = temp.currentFunction;
      updateUI(context);
      setIsPaused(true);
      addOutput(`Continue — строка ${pc}`, 'step');
    }
  }, [isPaused, breakpoints, runSilent, updateUI, addOutput, finishProgram]);

  const toggleBreakpoint = (lineNumber, e) => {
    e?.stopPropagation?.();
    setBreakpoints((prev) => {
      const next = new Set(prev);
      if (next.has(lineNumber)) {
        next.delete(lineNumber);
        addOutput(`Breakpoint снят: строка ${lineNumber}`, 'breakpoint');
      } else {
        next.add(lineNumber);
        addOutput(`Breakpoint: строка ${lineNumber}`, 'breakpoint');
      }
      return next;
    });
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.target.matches('input, textarea')) return;
      if (e.key === 'F5') {
        e.preventDefault();
        if (isPaused) continueExecution();
        else startDebug();
      }
      if (e.key === 'F10') {
        e.preventDefault();
        step('into');
      }
      if (e.key === 'F11') {
        e.preventDefault();
        step('over');
      }
      if (e.key === 'Shift+F11') {
        e.preventDefault();
        step('out');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isPaused, continueExecution, startDebug, step]);

  const currentFn =
    currentLine != null ? functionAtLine(currentLine, codeLines) : null;

  return (
    <DemoShell>
      <DemoCard
        title="Эмулятор отладчика IDE"
        subtitle="Breakpoints, пошаговое выполнение, переменные и стек вызовов"
      >
        <div className={styles.ide}>
          <div className={styles.toolbar}>
            <button
              type="button"
              className={clsx(styles.toolBtn, styles.toolPrimary)}
              onClick={startDebug}
            >
              ▶ Start
            </button>
            <button
              type="button"
              className={clsx(styles.toolBtn, styles.toolSecondary)}
              onClick={() => step('into')}
              disabled={!isPaused && isRunning}
              title="F10"
            >
              ↓ Step
            </button>
            <button
              type="button"
              className={clsx(styles.toolBtn, styles.toolSecondary)}
              onClick={() => step('over')}
              disabled={!isPaused && isRunning}
              title="F11"
            >
              ⤵ Over
            </button>
            <button
              type="button"
              className={clsx(styles.toolBtn, styles.toolSecondary)}
              onClick={() => step('out')}
              disabled={!isPaused && isRunning}
              title="Shift+F11"
            >
              ⤴ Out
            </button>
            <span className={styles.toolSep} aria-hidden />
            <button
              type="button"
              className={clsx(styles.toolBtn, styles.toolSuccess)}
              onClick={continueExecution}
              disabled={!isPaused}
              title="F5"
            >
              ▶ Continue
            </button>
            <button
              type="button"
              className={clsx(styles.toolBtn, styles.toolWarning)}
              onClick={startDebug}
            >
              ↺ Restart
            </button>
            <span
              className={clsx(
                styles.statusPill,
                isPaused && styles.statusPaused,
              )}
            >
              {isRunning ? (isPaused ? '⏸ Paused' : '▶ Running') : '⏹ Stopped'}
              {currentFn && (
                <span className={styles.functionBadge}>{currentFn}()</span>
              )}
            </span>
          </div>

          <div className={styles.main}>
            <div className={styles.editor}>
              {codeLines.map((line, index) => {
                const lineNumber = index + 1;
                const hasBp = breakpoints.has(lineNumber);
                const isCurrent = currentLine === lineNumber;
                const tokens = tokenizeLine(line);

                return (
                  <div
                    key={lineNumber}
                    className={clsx(
                      styles.codeRow,
                      isCurrent && styles.codeRowCurrent,
                    )}
                  >
                    <div className={styles.gutter}>
                      <button
                        type="button"
                        className={clsx(styles.bpDot, hasBp && styles.bpDotOn)}
                        onClick={(e) => toggleBreakpoint(lineNumber, e)}
                        aria-label={
                          hasBp
                            ? `Снять breakpoint на строке ${lineNumber}`
                            : `Breakpoint на строке ${lineNumber}`
                        }
                      />
                      <span className={styles.lineNum}>{lineNumber}</span>
                    </div>
                    <code className={styles.codeContent}>
                      {tokens.map((tok, i) => (
                        <span key={i} className={TOKEN_CSS[tok.t]}>
                          {tok.v}
                        </span>
                      ))}
                    </code>
                  </div>
                );
              })}
            </div>

            <aside className={styles.sidebar}>
              <div className={styles.tabs}>
                {[
                  {id: 'vars', label: 'Variables'},
                  {id: 'stack', label: 'Call Stack'},
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    className={clsx(
                      styles.tab,
                      sidebarTab === t.id && styles.tabActive,
                    )}
                    onClick={() => setSidebarTab(t.id)}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              <div className={styles.panelBody}>
                {sidebarTab === 'vars' &&
                  (Object.keys(variables).length === 0 ? (
                    <p className={styles.panelEmpty}>Нет локальных переменных</p>
                  ) : (
                    Object.entries(variables).map(([name, value]) => (
                      <div key={name} className={styles.varRow}>
                        <span className={styles.varName}>{name}</span>
                        {' = '}
                        <span className={styles.varVal}>
                          {JSON.stringify(value)}
                        </span>
                      </div>
                    ))
                  ))}
                {sidebarTab === 'stack' &&
                  (callStack.length === 0 ? (
                    <p className={styles.panelEmpty}>Стек пуст</p>
                  ) : (
                    callStack.map((frame, idx) => (
                      <div
                        key={`${frame.function}-${idx}`}
                        className={clsx(
                          styles.stackFrame,
                          idx === callStack.length - 1 && styles.stackFrameActive,
                        )}
                      >
                        {frame.function}
                        {idx === callStack.length - 1 && ' ◀'}
                        <div style={{fontSize: '0.65rem', color: '#858585'}}>
                          line {frame.line}
                        </div>
                      </div>
                    ))
                  ))}
              </div>
            </aside>
          </div>

          <div className={styles.console}>
            <div className={styles.consoleHead}>
              <span className={styles.consoleTitle}>Debug Console</span>
              <button
                type="button"
                className={styles.consoleClear}
                onClick={() => setOutput([])}
              >
                Очистить
              </button>
            </div>
            {output.length === 0 ? (
              <p className={styles.panelEmpty}>Нажмите Start (F5) для начала</p>
            ) : (
              output.map((item, idx) => (
                <div
                  key={idx}
                  className={styles.logLine}
                  style={{color: OUTPUT_COLORS[item.type] ?? OUTPUT_COLORS.info}}
                >
                  [{item.timestamp}] {item.text}
                </div>
              ))
            )}
          </div>

          <p className={styles.tip}>
            Клик по красной точке в gutter — breakpoint. Горячие клавиши: F5 Continue,
            F10 Step, F11 Over, Shift+F11 Out. Breakpoints на 14–16 для демо main().
          </p>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default DebuggerEmulatorInner;
