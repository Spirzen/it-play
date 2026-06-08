import React, {useCallback, useRef, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import styles from '@/components/demos/ProcessThreadVisualizer.module.css';

const TOTAL_TASKS = 100;
const THREAD_IDS = ['thread1', 'thread2', 'thread3'];
const TASKS_PER_THREAD = Math.ceil(TOTAL_TASKS / THREAD_IDS.length);

const THREAD_META = {
  main: {label: 'Основной поток', color: '#3498db'},
  thread1: {label: 'Поток 1 · ввод/вывод', color: '#e74c3c'},
  thread2: {label: 'Поток 2 · обработка', color: '#2ecc71'},
  thread3: {label: 'Поток 3 · вычисления', color: '#f39c12'},
};

const SINGLE_DELAY = 28;
const MULTI_DELAY = 14;

function ProcessThreadVisualizerInner() {
  const [mode, setMode] = useState('single');
  const [isRunning, setIsRunning] = useState(false);
  const [singleProgress, setSingleProgress] = useState(0);
  const [multiProgress, setMultiProgress] = useState({thread1: 0, thread2: 0, thread3: 0});
  const [singleResult, setSingleResult] = useState(null);
  const [multiResult, setMultiResult] = useState(null);
  const [activeThread, setActiveThread] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const runId = useRef(0);

  const reset = useCallback(() => {
    runId.current += 1;
    setIsRunning(false);
    setSingleProgress(0);
    setMultiProgress({thread1: 0, thread2: 0, thread3: 0});
    setSingleResult(null);
    setMultiResult(null);
    setActiveThread(null);
    setTimeline([]);
  }, []);

  const runSingle = useCallback(() => {
    const id = ++runId.current;
    const start = performance.now();
    setIsRunning(true);
    setSingleResult(null);
    setSingleProgress(0);
    setTimeline([]);

    let current = 0;
    const step = () => {
      if (id !== runId.current) return;
      if (current >= TOTAL_TASKS) {
        setActiveThread(null);
        setSingleResult({time: ((performance.now() - start) / 1000).toFixed(2), tasks: TOTAL_TASKS});
        setIsRunning(false);
        return;
      }
      current += 1;
      setSingleProgress(current);
      setActiveThread('main');
      setTimeline((t) => [...t.slice(-(TOTAL_TASKS - 1)), 'main']);
      setTimeout(() => {
        setActiveThread(null);
        setTimeout(step, SINGLE_DELAY);
      }, SINGLE_DELAY / 2);
    };
    step();
  }, []);

  const runMulti = useCallback(() => {
    const id = ++runId.current;
    const start = performance.now();
    setIsRunning(true);
    setMultiResult(null);
    setMultiProgress({thread1: 0, thread2: 0, thread3: 0});
    setTimeline([]);

    const progress = {thread1: 0, thread2: 0, thread3: 0};
    let completed = 0;

    const threadStep = (threadId) => {
      if (id !== runId.current) return;
      if (progress[threadId] >= TASKS_PER_THREAD || completed >= TOTAL_TASKS) {
        if (completed >= TOTAL_TASKS) {
          setActiveThread(null);
          setMultiResult({
            time: ((performance.now() - start) / 1000).toFixed(2),
            tasks: TOTAL_TASKS,
            threads: THREAD_IDS.length,
          });
          setIsRunning(false);
        }
        return;
      }
      progress[threadId] += 1;
      completed += 1;
      setMultiProgress({...progress});
      setActiveThread(threadId);
      setTimeline((t) => [...t.slice(-(TOTAL_TASKS - 1)), threadId]);
      setTimeout(() => threadStep(threadId), MULTI_DELAY);
    };

    THREAD_IDS.forEach((tid) => threadStep(tid));
  }, []);

  const start = useCallback(() => {
    if (isRunning) return;
    if (mode === 'single') runSingle();
    else runMulti();
  }, [isRunning, mode, runSingle, runMulti]);

  const compareBoth = useCallback(() => {
    if (isRunning) return;
    const id = ++runId.current;

    const runSeq = () =>
      new Promise((resolve) => {
        const start = performance.now();
        let current = 0;
        const step = () => {
          if (id !== runId.current) return;
          if (current >= TOTAL_TASKS) {
            resolve(((performance.now() - start) / 1000).toFixed(2));
            return;
          }
          current += 1;
          setSingleProgress(current);
          setActiveThread('main');
          setTimeout(() => {
            setActiveThread(null);
            setTimeout(step, SINGLE_DELAY);
          }, SINGLE_DELAY / 2);
        };
        setSingleProgress(0);
        setSingleResult(null);
        step();
      });

    const runPar = () =>
      new Promise((resolve) => {
        const start = performance.now();
        const progress = {thread1: 0, thread2: 0, thread3: 0};
        let completed = 0;
        const threadStep = (threadId) => {
          if (id !== runId.current) return;
          if (progress[threadId] >= TASKS_PER_THREAD || completed >= TOTAL_TASKS) {
            if (completed >= TOTAL_TASKS) resolve(((performance.now() - start) / 1000).toFixed(2));
            return;
          }
          progress[threadId] += 1;
          completed += 1;
          setMultiProgress({...progress});
          setActiveThread(threadId);
          setTimeout(() => threadStep(threadId), MULTI_DELAY);
        };
        setMultiProgress({thread1: 0, thread2: 0, thread3: 0});
        setMultiResult(null);
        THREAD_IDS.forEach((tid) => threadStep(tid));
      });

    setIsRunning(true);
    setMode('single');
    runSeq().then((singleTime) => {
      setSingleResult({time: singleTime, tasks: TOTAL_TASKS});
      setMode('multi');
      return runPar();
    }).then((multiTime) => {
      setMultiResult({time: multiTime, tasks: TOTAL_TASKS, threads: 3});
      setActiveThread(null);
      setIsRunning(false);
    });
  }, []);

  const changeMode = (next) => {
    if (isRunning) return;
    setMode(next);
    reset();
  };

  const renderCore = (threadId, progress, max) => {
    const meta = THREAD_META[threadId];
    const pct = Math.min(100, Math.round((progress / max) * 100));
    const active = activeThread === threadId;
    return (
      <div key={threadId} className={clsx(styles.core, active && styles.coreActive)}>
        <div className={styles.coreName}>
          <span>{meta.label}</span>
          {active && <span className={styles.corePulse}>активен</span>}
        </div>
        <div className={styles.bar}>
          <div className={styles.barFill} style={{width: `${pct}%`, backgroundColor: meta.color}}>
            {pct > 12 ? `${pct}%` : ''}
          </div>
        </div>
        <div className={styles.barMeta}>
          {progress} / {max} задач
        </div>
      </div>
    );
  };

  const renderTimeline = () => (
    <div className={styles.timeline} aria-hidden={timeline.length === 0}>
      {timeline.map((tid, i) => (
        <div
          key={`${i}-${tid}`}
          className={clsx(styles.timelineSeg, i === timeline.length - 1 && styles.timelineSegLit)}
          style={{backgroundColor: THREAD_META[tid]?.color ?? '#999'}}
          title={THREAD_META[tid]?.label}
        />
      ))}
    </div>
  );

  const speedup =
    singleResult && multiResult ? (Number(singleResult.time) / Number(multiResult.time)).toFixed(2) : null;
  const showBothResults = Boolean(singleResult && multiResult);

  return (
    <DemoShell className={styles.root}>
      <header className={styles.header}>
        <h3 className={styles.title}>Процессы и потоки</h3>
        <p className={styles.subtitle}>
          Сравните последовательное и параллельное выполнение {TOTAL_TASKS} однотипных задач на одном "ядре" и трёх
          потоках
        </p>
      </header>

      <div className={styles.modeBar}>
        <button
          type="button"
          className={clsx('it-demo__btn', mode === 'single' && 'it-demo__btn--primary')}
          onClick={() => changeMode('single')}
          disabled={isRunning}
        >
          Однопоточный
        </button>
        <button
          type="button"
          className={clsx('it-demo__btn', mode === 'multi' && 'it-demo__btn--primary')}
          onClick={() => changeMode('multi')}
          disabled={isRunning}
        >
          Многопоточный (3)
        </button>
      </div>

      <div className={clsx(styles.panel, mode !== 'single' && !showBothResults && styles.dimmed)}>
        <div className={styles.panelHead}>
          <h4 className={styles.panelTitle}>Однопоточная модель</h4>
          <span className={clsx(styles.badge, styles.badgeSeq)}>последовательно</span>
        </div>
        <div className={styles.cpuCore}>{renderCore('main', singleProgress, TOTAL_TASKS)}</div>
        {mode === 'single' && renderTimeline()}
        {singleResult && (
          <div className={styles.stats}>
            <strong>Результат:</strong> {singleResult.time} с · {singleResult.tasks} задач
          </div>
        )}
      </div>

      <div className={clsx(styles.panel, mode !== 'multi' && !showBothResults && styles.dimmed)}>
        <div className={styles.panelHead}>
          <h4 className={styles.panelTitle}>Многопоточная модель</h4>
          <span className={clsx(styles.badge, styles.badgePar)}>параллельно</span>
        </div>
        <div className={styles.cpuCore}>
          {THREAD_IDS.map((tid) => renderCore(tid, multiProgress[tid], TASKS_PER_THREAD))}
        </div>
        {mode === 'multi' && renderTimeline()}
        {multiResult && (
          <div className={styles.stats}>
            <strong>Результат:</strong> {multiResult.time} с · {multiResult.tasks} задач · {multiResult.threads}{' '}
            потока
          </div>
        )}
      </div>

      <div className={styles.controls}>
        <button type="button" className="it-demo__btn it-demo__btn--primary" onClick={start} disabled={isRunning}>
          {isRunning ? 'Выполняется…' : `Запустить (${mode === 'single' ? '1 поток' : '3 потока'})`}
        </button>
        <button
          type="button"
          className="it-demo__btn it-demo__btn--secondary"
          onClick={reset}
          disabled={isRunning && singleProgress === 0 && multiProgress.thread1 === 0}
        >
          Сброс
        </button>
        <button type="button" className="it-demo__btn" onClick={compareBoth} disabled={isRunning}>
          Сравнить оба режима
        </button>
      </div>

      {speedup && (
        <div className={styles.compareGrid}>
          <div className={styles.compareCard}>
            <div className={styles.compareValue}>{singleResult.time} с</div>
            <div className={styles.compareLabel}>однопоточный</div>
          </div>
          <div className={styles.compareCard}>
            <div className={styles.compareValue}>{multiResult.time} с</div>
            <div className={styles.compareLabel}>многопоточный</div>
          </div>
          <div className={styles.compareCard}>
            <div className={styles.compareValue}>×{speedup}</div>
            <div className={styles.compareLabel}>ускорение</div>
          </div>
        </div>
      )}

      {speedup && (
        <div className={styles.speedup}>
          Многопоточный режим завершился примерно в <strong>{speedup}</strong> раза быстрее при той же нагрузке (
          {singleResult.time} с против {multiResult.time} с).
        </div>
      )}

      <div className={styles.hint}>
        <strong>Как читать демо:</strong> в однопоточном режиме задачи идут строго по очереди; в многопоточном три
        потока делят работу и выполняют её одновременно (в браузере — через таймеры, для наглядности). Лента внизу
        панели — "снимок" того, какой поток был активен на каждом шаге.
      </div>
    </DemoShell>
  );
}

export default ProcessThreadVisualizerInner;
