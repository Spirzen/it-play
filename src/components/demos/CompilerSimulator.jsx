import React, {useState, useRef, useCallback} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  DEFAULT_CODE,
  EXAMPLE_CODES,
  COMPILE_PHASES,
  compileProgram,
  interpretProgram,
} from '@/components/shared/kb/compilerEngine';
import styles from '@/components/demos/CompilerSimulator.module.css';

const EXAMPLES = [
  {key: 'simple', label: 'Простой'},
  {key: 'strings', label: 'Строки'},
  {key: 'calc', label: 'Калькулятор'},
  {key: 'error', label: 'С ошибкой'},
];

function CompilerSimulatorInner() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [mode, setMode] = useState('interpret');
  const [status, setStatus] = useState('idle');
  const [currentLine, setCurrentLine] = useState(-1);
  const [logs, setLogs] = useState([]);
  const [errorDetails, setErrorDetails] = useState('');
  const [variables, setVariables] = useState({});
  const [output, setOutput] = useState([]);
  const [compiledBinary, setCompiledBinary] = useState(null);
  const [compilePhase, setCompilePhase] = useState(-1);

  const textareaRef = useRef(null);
  const lineNumsRef = useRef(null);

  const lines = code.split('\n');

  const reset = useCallback(() => {
    setStatus('idle');
    setCurrentLine(-1);
    setLogs([]);
    setErrorDetails('');
    setOutput([]);
    setVariables({});
    setCompiledBinary(null);
    setCompilePhase(-1);
  }, []);

  const handleScroll = () => {
    if (lineNumsRef.current && textareaRef.current) {
      lineNumsRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const loadExample = (key) => {
    setCode(EXAMPLE_CODES[key]);
    reset();
  };

  const runSimulation = async () => {
    reset();
    setStatus(mode === 'compile' ? 'compiling' : 'running');

    if (mode === 'compile') {
      const phaseLogs = [];
      for (let i = 0; i < COMPILE_PHASES.length; i++) {
        setCompilePhase(i);
        phaseLogs.push({
          type: 'info',
          text: `${COMPILE_PHASES[i].icon} ${COMPILE_PHASES[i].label}…`,
        });
        setLogs([...phaseLogs]);
        await new Promise((r) => setTimeout(r, 350));
      }

      const {errors, warnings, declaredVariables} = compileProgram(lines);

      if (errors.length > 0) {
        setCurrentLine(errors[0].index);
        setErrorDetails(errors[0].message);
        setLogs([
          ...phaseLogs,
          {type: 'error', text: `Ошибка: строка ${errors[0].index + 1} — ${errors[0].message}`},
        ]);
        setStatus('error');
        return;
      }

      const finalLogs = [
        ...phaseLogs,
        ...warnings.map((w) => ({
          type: 'info',
          text: `⚠️ Строка ${w.index + 1}: ${w.message}`,
        })),
        {type: 'success', text: 'Компиляция успешна'},
        {type: 'info', text: `Символы: ${declaredVariables.join(', ') || '—'}`},
      ];
      setLogs(finalLogs);
      setCompiledBinary({
        size: `${Math.max(64, code.length * 2 + declaredVariables.length * 16)} байт`,
        timestamp: new Date().toLocaleTimeString(),
        variables: declaredVariables.length,
      });
      setStatus('success');
      setCurrentLine(lines.length);
      return;
    }

    setLogs([{type: 'info', text: 'Запуск интерпретатора…'}]);

    try {
      const result = await interpretProgram(lines, {
        delayMs: 280,
        onProgress: ({lineIndex, vars, output: out, logs: progLogs}) => {
          setCurrentLine(lineIndex);
          setVariables(vars);
          setOutput(out);
          setLogs([{type: 'info', text: 'Выполнение…'}, ...progLogs.map((l) => ({type: l.type, text: l.text}))]);
        },
      });
      setVariables(result.vars);
      setOutput(result.outputLines);
      setLogs([
        ...result.logs.map((l) => ({type: l.type, text: l.text})),
        {type: 'success', text: 'Программа завершена'},
      ]);
      setStatus('success');
      setCurrentLine(lines.length);
    } catch (err) {
      setCurrentLine(err.index);
      setErrorDetails(err.message);
      if (err.vars) setVariables(err.vars);
      if (err.outputLines) setOutput(err.outputLines);
      setLogs([
        ...(err.logs || []).map((l) => ({type: l.type, text: l.text})),
        {type: 'error', text: `Строка ${err.index + 1}: ${err.message}`},
        ...(err.outputLines?.length
          ? [{type: 'info', text: `Выполнено строк до ошибки: ${err.index}`}]
          : []),
      ]);
      setStatus('error');
    }
  };

  const busy = status === 'compiling' || status === 'running';

  return (
    <DemoShell className={mode === 'compile' ? styles.modeCompile : styles.modeInterpret}>
      <DemoCard
        title="Компилятор и интерпретатор"
        subtitle="Псевдо-JavaScript: let для переменных, console.log для вывода"
      >
        <div className={styles.modeBar}>
          <button
            type="button"
            className={clsx(
              'it-demo__btn it-demo__btn--sm',
              mode !== 'interpret' && 'it-demo__btn--secondary',
              mode === 'interpret' && styles.modeActive,
            )}
            onClick={() => {
              setMode('interpret');
              reset();
            }}
          >
            Интерпретация
          </button>
          <button
            type="button"
            className={clsx(
              'it-demo__btn it-demo__btn--sm',
              mode !== 'compile' && 'it-demo__btn--secondary',
              mode === 'compile' && styles.modeActive,
            )}
            onClick={() => {
              setMode('compile');
              reset();
            }}
          >
            Компиляция
          </button>
          <p className={styles.modeHint}>
            {mode === 'interpret'
              ? 'Код выполняется построчно — переменные появляются по ходу работы.'
              : 'Весь файл проверяется сразу — неизъявленные переменные дают ошибку компиляции.'}
          </p>
        </div>

        <div className="it-demo__row" style={{marginBottom: '0.5rem', justifyContent: 'space-between'}}>
          <span className="it-demo__label">Исходный код</span>
          <div className="it-demo__row">
            {EXAMPLES.map((ex) => (
              <button
                key={ex.key}
                type="button"
                className="it-demo__btn it-demo__btn--secondary it-demo__btn--sm"
                onClick={() => loadExample(ex.key)}
              >
                {ex.label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.editorWrap}>
          <div ref={lineNumsRef} className={styles.lineNums} aria-hidden>
            {lines.map((_, idx) => (
              <div
                key={idx}
                className={clsx(
                  currentLine === idx && styles.lineNumActive,
                  status === 'error' && currentLine === idx && styles.lineNumError,
                )}
              >
                {idx + 1}
              </div>
            ))}
          </div>
          <textarea
            ref={textareaRef}
            className={styles.editor}
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              reset();
            }}
            onScroll={handleScroll}
            spellCheck={false}
            aria-label="Редактор кода"
          />
        </div>

        <p style={{fontSize: '0.75rem', color: 'var(--demo-muted)', margin: '0.35rem 0 0.75rem'}}>
          Синтаксис: <code>let x = 10</code>, <code>console.log(выражение)</code>, арифметика (
          <code>+ − * /</code>), конкатенация строк через <code>+</code>. Пример «С ошибкой» — сравните
          частичное выполнение и полную проверку при компиляции.
        </p>

        {mode === 'compile' && status === 'compiling' && (
          <div className={styles.phaseTrack} aria-live="polite">
            {COMPILE_PHASES.map((ph, i) => (
              <span
                key={ph.id}
                className={clsx(
                  styles.phaseChip,
                  i < compilePhase && styles.phaseChipDone,
                  i === compilePhase && styles.phaseChipActive,
                )}
              >
                {ph.icon} {ph.label}
              </span>
            ))}
          </div>
        )}

        <div className="it-demo__row">
          <button
            type="button"
            className="it-demo__btn it-demo__btn--primary"
            disabled={busy}
            onClick={runSimulation}
          >
            {busy
              ? mode === 'compile'
                ? 'Компиляция…'
                : 'Выполнение…'
              : mode === 'compile'
                ? 'Компилировать'
                : 'Запустить'}
          </button>
          {status !== 'idle' && (
            <button type="button" className="it-demo__btn it-demo__btn--secondary" onClick={reset}>
              Сброс
            </button>
          )}
        </div>

        <div className="it-demo__panel" style={{marginTop: '1rem'}}>
          <div className="it-demo__section-title">
            {mode === 'compile' ? 'Результат компиляции' : 'Выполнение'}
          </div>
          <div style={{padding: '0.75rem', minHeight: '8rem'}}>
            {status === 'idle' && (
              <p style={{color: 'var(--demo-muted)', fontStyle: 'italic', margin: 0}}>
                Нажмите "{mode === 'compile' ? 'Компилировать' : 'Запустить'}"
              </p>
            )}

            {logs.length > 0 && (
              <div className="it-demo__log">
                {logs.map((entry, idx) => (
                  <div
                    key={idx}
                    className="it-demo__log-entry"
                    style={{
                      color:
                        entry.type === 'error'
                          ? 'var(--demo-error)'
                          : entry.type === 'success'
                            ? 'var(--demo-success)'
                            : undefined,
                    }}
                  >
                    {entry.text}
                  </div>
                ))}
              </div>
            )}

            {output.length > 0 && mode === 'interpret' && (status === 'success' || status === 'error') && (
              <div style={{marginTop: '0.75rem'}}>
                <strong style={{fontSize: '0.8rem'}}>Вывод:</strong>
                {output.map((line, i) => (
                  <div
                    key={i}
                    style={{
                      fontFamily: 'var(--ifm-font-family-monospace)',
                      padding: '0.35rem 0.5rem',
                      marginTop: '0.25rem',
                      background: 'rgba(46, 125, 50, 0.1)',
                      borderRadius: '4px',
                    }}
                  >
                    {line}
                  </div>
                ))}
              </div>
            )}

            {Object.keys(variables).length > 0 && mode === 'interpret' && (status === 'success' || status === 'error') && (
              <div className={styles.varsGrid}>
                {Object.entries(variables).map(([name, value]) => (
                  <div key={name} className={styles.varCell}>
                    <span className={styles.varName}>{name}</span> ={' '}
                    {typeof value === 'string' ? `"${value}"` : String(value)}
                  </div>
                ))}
              </div>
            )}

            {compiledBinary && mode === 'compile' && status === 'success' && (
              <div className={styles.binaryCard}>
                <strong>Исполняемый файл</strong>
                <br />
                Размер: {compiledBinary.size} · Сборка: {compiledBinary.timestamp} · Переменных:{' '}
                {compiledBinary.variables}
              </div>
            )}

            {status === 'error' && errorDetails && (
              <div className="it-demo__alert it-demo__alert--error" style={{marginTop: '0.75rem'}}>
                <strong>{mode === 'compile' ? 'Ошибка компиляции' : 'Ошибка выполнения'}:</strong>{' '}
                {errorDetails}
              </div>
            )}
          </div>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default CompilerSimulatorInner;
