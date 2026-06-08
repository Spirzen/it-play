import React, {useCallback, useEffect, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import styles from '@/components/demos/BytecodeVmPlay.module.css';

const MODES = [
  {id: 'interpret', label: 'Интерпретация', speed: 1, note: 'Каждый opcode — цикл "считай-выполни"'},
  {id: 'jit', label: 'JIT', speed: 4, note: 'Горячий метод компилируется в машинный код'},
  {id: 'aot', label: 'AOT', speed: 8, note: 'Машинный код готов до запуска'},
];

const BYTECODE = [
  {op: 'iconst_2', stack: [2], desc: 'Константа 2 на стек'},
  {op: 'iconst_3', stack: [2, 3], desc: 'Константа 3'},
  {op: 'iadd', stack: [5], desc: 'Сложение вершин стека'},
  {op: 'istore_0', stack: [], desc: 'Результат в локальную переменную'},
  {op: 'return', stack: [], desc: 'Выход из метода'},
];

function BytecodeVmPlayInner() {
  const [mode, setMode] = useState('interpret');
  const [pc, setPc] = useState(0);
  const [stack, setStack] = useState([]);
  const [hotCount, setHotCount] = useState(0);
  const [jitCompiled, setJitCompiled] = useState(false);
  const [log, setLog] = useState('Запустите выполнение — шаг за шагом по байт-коду.');
  const [running, setRunning] = useState(false);

  const modeMeta = MODES.find((m) => m.id === mode) ?? MODES[0];

  const reset = useCallback(() => {
    setPc(0);
    setStack([]);
    setHotCount(0);
    setJitCompiled(false);
    setLog('Сброс. Стековая VM готова.');
    setRunning(false);
  }, []);

  useEffect(() => {
    reset();
  }, [mode, reset]);

  const step = useCallback(() => {
    if (pc >= BYTECODE.length) {
      setHotCount((h) => {
        const next = h + 1;
        if (mode === 'jit' && next >= 2) setJitCompiled(true);
        return next;
      });
      setPc(0);
      setStack([]);
      setLog(
        mode === 'jit' && hotCount + 1 >= 2
          ? 'Метод "горячий" — JIT сгенерировал нативный код.'
          : 'Метод завершён. Следующий проход — снова с начала.',
      );
      return;
    }
    const instr = BYTECODE[pc];
    setStack(instr.stack);
    const prefix =
      mode === 'aot'
        ? '[native] '
        : mode === 'jit' && jitCompiled
          ? '[JIT] '
          : '[interp] ';
    setLog(`${prefix}${instr.op}: ${instr.desc}`);
    setPc((p) => p + 1);
  }, [pc, mode, jitCompiled, hotCount]);

  useEffect(() => {
    if (!running) return undefined;
    const delay = mode === 'aot' ? 280 : mode === 'jit' && jitCompiled ? 350 : 700;
    const id = window.setInterval(step, delay);
    return () => window.clearInterval(id);
  }, [running, step, mode, jitCompiled]);

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Выполнение байт-кода на VM"
        subtitle="Стековая модель, интерпретация, JIT и AOT — один и тот же метод"
      >
        <div className="it-demo__tabs">
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              className={clsx('it-demo__tab', mode === m.id && 'it-demo__tab--active')}
              onClick={() => setMode(m.id)}
            >
              {m.label}
            </button>
          ))}
        </div>
        <p className={styles.note}>{modeMeta.note}</p>

        <div className={styles.layout}>
          <div className={styles.codeCol}>
            <div className={styles.codeHead}>Байт-код метода add()</div>
            {BYTECODE.map((line, i) => (
              <div key={line.op} className={clsx(styles.instr, pc === i && styles.instrActive)}>
                <span className={styles.op}>{line.op}</span>
              </div>
            ))}
            {mode === 'jit' && (
              <div className={clsx(styles.jitBadge, jitCompiled && styles.jitBadgeOn)}>
                {jitCompiled ? '✓ Скомпилировано C2' : `Профиль: ${hotCount}/2 проходов до JIT`}
              </div>
            )}
            {mode === 'aot' && <div className={styles.jitBadgeOn}>✓ AOT: .exe / native image</div>}
          </div>

          <div className={styles.stackCol}>
            <div className={styles.codeHead}>Операндный стек</div>
            <div className={styles.stackArea}>
              {stack.length === 0 ? (
                <span className={styles.empty}>пусто</span>
              ) : (
                stack.map((v, idx) => (
                  <div key={`${v}-${idx}`} className={styles.stackSlot}>
                    {v}
                  </div>
                ))
              )}
            </div>
            <div className={styles.speed}>
              Относительная скорость: <strong>×{modeMeta.speed}</strong>
              {mode === 'jit' && !jitCompiled && ' (до компиляции ×1)'}
            </div>
          </div>
        </div>

        <p className={styles.log}>{log}</p>
        <div className="it-demo__actions">
          <button type="button" className="it-demo__btn it-demo__btn--primary" onClick={step}>
            Шаг
          </button>
          <button
            type="button"
            className="it-demo__btn"
            onClick={() => setRunning((r) => !r)}
          >
            {running ? 'Пауза' : 'Авто'}
          </button>
          <button type="button" className="it-demo__btn" onClick={reset}>
            Сброс
          </button>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default BytecodeVmPlayInner;
