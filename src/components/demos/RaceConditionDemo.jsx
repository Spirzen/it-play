import React, {useCallback, useMemo, useRef, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  INITIAL_BALANCE,
  SCENARIOS,
  createRaceSimulator,
  getExpectedBalance,
} from '@/components/shared/kb/raceConditionEngine';
import styles from '@/components/demos/RaceConditionDemo.module.css';

const THREAD_COLORS = {1: '#3498db', 2: '#e74c3c', 3: '#2ecc71'};
const THREAD_ROLES = {1: 'депозит', 2: 'снятие', 3: 'перевод'};

const PHASE_CLASS = {
  idle: styles.phaseIdle,
  read: styles.phaseRead,
  compute: styles.phaseCompute,
  write: styles.phaseWrite,
  wait: styles.phaseWait,
  lock: styles.phaseLock,
  enter: styles.phaseLock,
};

const LOG_COLOR = {
  success: 'var(--demo-success)',
  error: 'var(--demo-error)',
  warning: 'var(--demo-warning)',
  info: 'var(--ifm-color-primary)',
};

function RaceConditionDemoInner() {
  const [scenario, setScenario] = useState('race');
  const [isRunning, setIsRunning] = useState(false);
  const [balance, setBalance] = useState(INITIAL_BALANCE);
  const [logs, setLogs] = useState([]);
  const [activeThreads, setActiveThreads] = useState({1: false, 2: false, 3: false});
  const [phases, setPhases] = useState({1: 'idle', 2: 'idle', 3: 'idle'});
  const [semaphoreSlots, setSemaphoreSlots] = useState(2);
  const [atomicCount, setAtomicCount] = useState(0);

  const simulatorRef = useRef(null);
  const expected = getExpectedBalance();
  const isCorrect = balance === expected;
  const meta = SCENARIOS[scenario];

  const resetUi = useCallback(() => {
    simulatorRef.current?.stop();
    setIsRunning(false);
    setBalance(INITIAL_BALANCE);
    setLogs([]);
    setActiveThreads({1: false, 2: false, 3: false});
    setPhases({1: 'idle', 2: 'idle', 3: 'idle'});
    setSemaphoreSlots(2);
    setAtomicCount(0);
  }, []);

  const runSimulation = useCallback(async () => {
    resetUi();
    setIsRunning(true);

    const sim = createRaceSimulator({
      onBalance: setBalance,
      onLog: (entry) =>
        setLogs((prev) =>
          [{...entry, id: Date.now() + Math.random(), time: new Date().toLocaleTimeString()}, ...prev].slice(
            0,
            60,
          ),
        ),
      onThreadActive: (threadId, active) =>
        setActiveThreads((prev) => ({...prev, [threadId]: active})),
      onThreadPhase: (threadId, phase) => setPhases((prev) => ({...prev, [threadId]: phase})),
      onSemaphoreSlots: setSemaphoreSlots,
      onAtomicCount: setAtomicCount,
    });

    simulatorRef.current = sim;
    await sim.run(scenario);
    setIsRunning(false);
  }, [scenario, resetUi]);

  const changeScenario = (id) => {
    if (isRunning) return;
    setScenario(id);
    resetUi();
  };

  const phaseLabel = useMemo(
    () => ({
      idle: 'ожидание',
      read: 'чтение',
      compute: 'вычисление',
      write: 'запись',
      wait: 'ожидает блокировку',
      lock: 'в критической секции',
      enter: 'вход',
    }),
    [],
  );

  return (
    <DemoShell className={styles.root}>
      <header className={styles.header}>
        <h3 className={styles.title}>Гонка данных и синхронизация</h3>
        <p className={styles.subtitle}>
          Шесть операций над общим балансом в трёх потоках — сравните результат без защиты и с мьютексом, семафором или
          атомарными операциями
        </p>
      </header>

      <div className={styles.modeBar}>
        {Object.values(SCENARIOS).map((s) => (
          <button
            key={s.id}
            type="button"
            className={clsx(styles.modeBtn, scenario === s.id && styles.modeBtnActive)}
            style={{'--scenario-accent': s.accent}}
            onClick={() => changeScenario(s.id)}
            disabled={isRunning}
          >
            {s.label}
          </button>
        ))}
      </div>

      <p className={styles.scenarioHint}>{meta.hint}</p>

      <div className={styles.grid}>
        <div className={styles.panel}>
          <h4 className={styles.panelTitle}>
            Счёт
            <span className={isCorrect ? styles.badgeOk : styles.badgeBad}>
              {isCorrect ? 'корректно' : 'расхождение'}
            </span>
          </h4>
          <div className={styles.balanceBox}>
            <div className={styles.balanceValue}>{balance} ₽</div>
            <div className={styles.balanceMeta}>Ожидается: {expected} ₽ · Δ {balance - expected} ₽</div>
          </div>

          {scenario === 'semaphore' && (
            <div className={styles.extraStat}>
              Свободных слотов семафора: <strong>{semaphoreSlots}</strong> / 2
            </div>
          )}
          {scenario === 'atomic' && (
            <div className={styles.extraStat}>
              Атомарных операций: <strong>{atomicCount}</strong>
            </div>
          )}

          <div className={styles.memoryLane}>
            <div className={styles.memoryTitle}>Фазы потоков (критическая секция)</div>
            <div className={styles.lanes}>
              {[1, 2, 3].map((tid) => (
                <div key={tid} className={styles.lane}>
                  <span className={styles.laneLabel}>Поток {tid}</span>
                  <div className={styles.laneTrack}>
                    <div
                      className={clsx(styles.laneSeg, PHASE_CLASS[phases[tid]] ?? styles.phaseIdle)}
                      title={phaseLabel[phases[tid]] ?? phases[tid]}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.legend}>
              {[
                ['read', styles.phaseRead, 'чтение'],
                ['compute', styles.phaseCompute, 'вычисление'],
                ['write', styles.phaseWrite, 'запись'],
                ['wait', styles.phaseWait, 'ожидание'],
                ['lock', styles.phaseLock, 'блокировка'],
              ].map(([key, cls, label]) => (
                <span key={key} className={styles.legendItem}>
                  <span className={clsx(styles.legendSwatch, cls)} />
                  {label}
                </span>
              ))}
            </div>
          </div>

          <h4 className={styles.panelTitle} style={{marginTop: '1rem'}}>
            Потоки
          </h4>
          <div className={styles.threadList}>
            {[1, 2, 3].map((tid) => (
              <div
                key={tid}
                className={clsx(styles.threadRow, activeThreads[tid] && styles.threadRowActive)}
              >
                <div className={styles.threadDot} style={{backgroundColor: `${THREAD_COLORS[tid]}22`}}>
                  {activeThreads[tid] ? '⚡' : '💤'}
                </div>
                <div className={styles.threadMeta}>
                  <div className={styles.threadName}>
                    Поток {tid} · {THREAD_ROLES[tid]}
                  </div>
                  <div className={styles.threadStatus}>
                    {activeThreads[tid] ? phaseLabel[phases[tid]] : 'ожидание'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.panel}>
          <h4 className={styles.panelTitle}>Лог операций</h4>
          <div className={styles.log}>
            {logs.length === 0 ? (
              <div className={styles.logEmpty}>Нажмите "Запустить", чтобы увидеть пересечение операций</div>
            ) : (
              logs.map((entry) => (
                <div key={entry.id} className={styles.logLine}>
                  <span className={styles.logTime}>[{entry.time}]</span>
                  <span style={{color: LOG_COLOR[entry.type] ?? LOG_COLOR.info}}>{entry.message}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className={styles.controls}>
        <button type="button" className="it-demo__btn it-demo__btn--primary" onClick={runSimulation} disabled={isRunning}>
          {isRunning ? 'Выполняется…' : 'Запустить симуляцию'}
        </button>
        <button type="button" className="it-demo__btn it-demo__btn--secondary" onClick={resetUi} disabled={isRunning}>
          Сбросить
        </button>
      </div>

      <div className={styles.note} style={{'--note-accent': meta.accent}}>
        <div className={styles.noteTitle}>{meta.label}</div>
        <p style={{margin: 0}}>{meta.hint}</p>
      </div>

      <div className={styles.note} style={{marginTop: '0.75rem', '--note-accent': '#8b949e'}}>
        <div className={styles.noteTitle}>Deadlock, starvation, livelock</div>
        <p style={{margin: 0}}>
          <strong>Deadlock</strong> — взаимное ожидание ресурсов; <strong>starvation</strong> — поток никогда не
          получает CPU/блокировку; <strong>livelock</strong> — потоки уступают друг другу, но работа не продвигается.
          Выбор примитива синхронизации зависит от гранулярности критической секции и допустимого параллелизма.
        </p>
      </div>
    </DemoShell>
  );
}

export default RaceConditionDemoInner;
