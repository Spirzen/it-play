import React, {useCallback, useEffect, useRef, useState} from 'react';

import clsx from 'clsx';
import DemoShell from '@/components/shared/DemoShell';

import styles from '@/components/demos/ConcurrencyPracticumDemo.module.css';

/** Учебные URL из практикума KB — задержки в мс (реальные), в демо ускорены. */
const PAGES = [
  {id: 'page1', label: 'page1', delayMs: 2000},
  {id: 'page2', label: 'page2', delayMs: 3500},
  {id: 'page3', label: 'page3', delayMs: 1500},
  {id: 'page4', label: 'page4', delayMs: 2500},
  {id: 'page5', label: 'page5', delayMs: 1000},
];

const TIME_SCALE = 0.18;
const TOTAL_SEQ_MS = PAGES.reduce((s, p) => s + p.delayMs, 0);
const TOTAL_PAR_MS = Math.max(...PAGES.map((p) => p.delayMs));

function emptyProgress() {
  return Object.fromEntries(PAGES.map((p) => [p.id, 0]));
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function animateProgress(setProgress, pageId, durationMs, runId, idRef) {
  return new Promise((resolve) => {
    const start = performance.now();
    const tick = () => {
      if (idRef.current !== runId) {
        resolve();
        return;
      }
      const elapsed = performance.now() - start;
      const pct = Math.min(100, (elapsed / durationMs) * 100);
      setProgress((prev) => ({...prev, [pageId]: pct}));
      if (pct >= 100) {
        resolve();
        return;
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}

function ConcurrencyPracticumDemoInner() {
  const [progress, setProgress] = useState(emptyProgress);
  const [mode, setMode] = useState(null);
  const [running, setRunning] = useState(false);
  const [liveMs, setLiveMs] = useState(0);
  const [results, setResults] = useState({sequential: null, parallel: null});
  const [gantt, setGantt] = useState({sequential: [], parallel: []});

  const runIdRef = useRef(0);
  const timerRef = useRef(null);
  const wallStartRef = useRef(0);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      cancelAnimationFrame(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    wallStartRef.current = performance.now();
    const tick = () => {
      setLiveMs(performance.now() - wallStartRef.current);
      timerRef.current = requestAnimationFrame(tick);
    };
    timerRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => () => stopTimer(), [stopTimer]);

  const reset = useCallback(() => {
    runIdRef.current += 1;
    stopTimer();
    setProgress(emptyProgress());
    setMode(null);
    setRunning(false);
    setLiveMs(0);
    setResults({sequential: null, parallel: null});
    setGantt({sequential: [], parallel: []});
  }, [stopTimer]);

  const recordGantt = useCallback((kind, pageId, startMs, durationMs, totalMs) => {
    setGantt((prev) => ({
      ...prev,
      [kind]: [
        ...prev[kind],
        {
          pageId,
          leftPct: (startMs / totalMs) * 100,
          widthPct: Math.max(1.5, (durationMs / totalMs) * 100),
        },
      ],
    }));
  }, []);

  const runSequential = useCallback(async () => {
    const id = ++runIdRef.current;
    setRunning(true);
    setMode('sequential');
    setProgress(emptyProgress());
    setResults((r) => ({...r, sequential: null}));
    setGantt((g) => ({...g, sequential: []}));
    startTimer();

    const demoTotal = TOTAL_SEQ_MS * TIME_SCALE;
    let offset = 0;

    for (const page of PAGES) {
      if (id !== runIdRef.current) return;
      const duration = page.delayMs * TIME_SCALE;
      recordGantt('sequential', page.id, offset, duration, demoTotal);
      await animateProgress(setProgress, page.id, duration, id, runIdRef);
      offset += duration;
    }

    if (id !== runIdRef.current) return;
    stopTimer();
    const elapsed = performance.now() - wallStartRef.current;
    setResults((r) => ({...r, sequential: elapsed}));
    setRunning(false);
  }, [recordGantt, startTimer, stopTimer]);

  const runParallel = useCallback(async () => {
    const id = ++runIdRef.current;
    setRunning(true);
    setMode('parallel');
    setProgress(emptyProgress());
    setResults((r) => ({...r, parallel: null}));
    setGantt((g) => ({...g, parallel: []}));
    startTimer();

    const demoTotal = TOTAL_PAR_MS * TIME_SCALE;
    for (const page of PAGES) {
      const duration = page.delayMs * TIME_SCALE;
      recordGantt('parallel', page.id, 0, duration, demoTotal);
    }

    await Promise.all(
      PAGES.map((page) =>
        animateProgress(setProgress, page.id, page.delayMs * TIME_SCALE, id, runIdRef),
      ),
    );

    if (id !== runIdRef.current) return;
    stopTimer();
    const elapsed = performance.now() - wallStartRef.current;
    setResults((r) => ({...r, parallel: elapsed}));
    setRunning(false);
  }, [recordGantt, startTimer, stopTimer]);

  const runCompare = useCallback(async () => {
    reset();
    await sleep(80);
    await runSequential();
    await sleep(400);
    runIdRef.current += 1;
    setProgress(emptyProgress());
    await sleep(80);
    await runParallel();
  }, [reset, runParallel, runSequential]);

  const maxResult = Math.max(results.sequential ?? 0, results.parallel ?? 0, 1);
  const speedup =
    results.sequential && results.parallel ? results.sequential / results.parallel : null;

  return (
    <DemoShell className={styles.root}>
      <header className={styles.header}>
        <h3 className={styles.title}>Пять загрузок — последовательно и параллельно</h3>
        <p className={styles.subtitle}>
          I/O-bound сценарий из практикума: задержки складываются в цикле, а при параллельном запуске
          время близко к самой долгой задаче (~{TOTAL_PAR_MS / 1000} с в учебных данных, здесь ускорено
          в {Math.round(1 / TIME_SCALE)}×).
        </p>
      </header>

      <div className={styles.timerRow}>
        <span className={styles.timerChip}>
          Режим: <strong>{mode === 'sequential' ? 'последовательно' : mode === 'parallel' ? 'параллельно' : '—'}</strong>
        </span>
        <span className={styles.timerChip}>
          Таймер: <strong>{(liveMs / 1000).toFixed(2)} с</strong>
        </span>
        <span className={styles.timerChip}>
          Теор. минимум: <strong>{(TOTAL_PAR_MS / 1000).toFixed(1)} с</strong>
        </span>
      </div>

      <div className={styles.taskList}>
        {PAGES.map((page) => (
          <div key={page.id} className={styles.taskRow}>
            <span className={styles.taskUrl}>example.com/{page.label}</span>
            <div className={styles.track}>
              <div
                className={clsx(
                  styles.fill,
                  mode === 'sequential' && styles.fillSeq,
                  mode === 'parallel' && styles.fillPar,
                )}
                style={{width: `${progress[page.id]}%`}}
              />
            </div>
            <span className={styles.taskMeta}>{(page.delayMs / 1000).toFixed(1)} с</span>
          </div>
        ))}
      </div>

      {(gantt.sequential.length > 0 || gantt.parallel.length > 0) && (
        <div className={styles.gantt}>
          <p className={styles.ganttTitle}>Временная шкала (когда идёт каждая «загрузка»)</p>
          {(['sequential', 'parallel']).map((kind) =>
            gantt[kind].length > 0 ? (
              <div key={kind}>
                {PAGES.map((page) => {
                  const bar = gantt[kind].find((b) => b.pageId === page.id);
                  if (!bar) return null;
                  return (
                    <div key={`${kind}-${page.id}`} className={styles.ganttRow}>
                      <span>{page.label}</span>
                      <div className={styles.ganttLane}>
                        <div
                          className={clsx(
                            styles.ganttBar,
                            kind === 'sequential' ? styles.ganttBarSeq : styles.ganttBarPar,
                          )}
                          style={{left: `${bar.leftPct}%`, width: `${bar.widthPct}%`}}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : null,
          )}
        </div>
      )}

      {results.sequential != null && results.parallel != null && (
        <div className={styles.compare}>
          <h4 className={styles.compareTitle}>Сравнение</h4>
          <div className={styles.barRow}>
            <span>Последовательно</span>
            <div className={styles.barTrack}>
              <div
                className={clsx(styles.barFill, styles.barSeq)}
                style={{width: `${(results.sequential / maxResult) * 100}%`}}
              />
            </div>
            <strong>{(results.sequential / 1000).toFixed(2)} с</strong>
          </div>
          <div className={styles.barRow}>
            <span>Параллельно</span>
            <div className={styles.barTrack}>
              <div
                className={clsx(styles.barFill, styles.barPar)}
                style={{width: `${(results.parallel / maxResult) * 100}%`}}
              />
            </div>
            <strong>{(results.parallel / 1000).toFixed(2)} с</strong>
          </div>
          <p className={styles.verdict}>
            Ускорение: <strong>{speedup?.toFixed(2)}×</strong>. При I/O-bound задачах потоки, горутины и
            asyncio дают похожий выигрыш — главное, не ждать сеть в одном потоке подряд.
          </p>
        </div>
      )}

      <div className={styles.controls}>
        <button
          type="button"
          className="it-demo__btn it-demo__btn--primary"
          onClick={runSequential}
          disabled={running}
        >
          ▶ Последовательно
        </button>
        <button
          type="button"
          className="it-demo__btn it-demo__btn--secondary"
          onClick={runParallel}
          disabled={running}
        >
          ▶ Параллельно
        </button>
        <button
          type="button"
          className="it-demo__btn it-demo__btn--secondary"
          onClick={runCompare}
          disabled={running}
        >
          Сравнить оба
        </button>
        <button type="button" className="it-demo__btn it-demo__btn--secondary" onClick={reset}>
          Сброс
        </button>
      </div>
    </DemoShell>
  );
}

export default ConcurrencyPracticumDemoInner;
