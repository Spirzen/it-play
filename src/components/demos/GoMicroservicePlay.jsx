import React, {useCallback, useEffect, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  CHANNEL_SNIPPET,
  dispatchTask,
  initialGoroutineState,
  runMiddlewareChain,
  tickWorkers,
} from '@/components/shared/kb/goMicroserviceEngine';
import styles from '@/components/demos/GoMicroservicePlay.module.css';

function GoMicroservicePlayInner() {
  const [goroutine, setGoroutine] = useState(initialGoroutineState);
  const [lastDispatch, setLastDispatch] = useState(null);
  const [auth, setAuth] = useState(true);
  const [rateLimited, setRateLimited] = useState(false);
  const [mwResult, setMwResult] = useState(null);

  useEffect(() => {
    const id = setInterval(() => {
      setGoroutine((s) => {
        const hasWork = s.workers.some((w) => w.queue.length > 0);
        return hasWork ? tickWorkers(s) : s;
      });
    }, 900);
    return () => clearInterval(id);
  }, []);

  const sendRequest = useCallback(() => {
    const result = dispatchTask(goroutine);
    if (result.ok) {
      setGoroutine(result.state);
      setLastDispatch(`Задача "${result.task.label}" → ${result.state.workers[result.workerIdx].id} (work-stealing по длине очереди)`);
    } else {
      setLastDispatch(result.reason);
    }
  }, [goroutine]);

  const probeMiddleware = useCallback(() => {
    setMwResult(runMiddlewareChain({authenticated: auth, rateLimited}));
  }, [auth, rateLimited]);

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Go в микросервисе: горутины и HTTP-цепочка"
        subtitle="Планировщик забирает задачи у перегруженного воркера; middleware обрабатывает запрос до handler."
      >
        <div className={styles.grid2}>
          <div>
            <label className="it-demo__label">Пул горутин (2 воркера)</label>
            {goroutine.workers.map((w) => (
              <div key={w.id} className={styles.workerRow} style={{marginBottom: '0.5rem'}}>
                <div className={styles.workerHead}>
                  <span>{w.id}</span>
                  <span>{w.busy ? 'выполняет' : 'ожидает'}</span>
                </div>
                <div className={styles.queue}>
                  {w.queue.length === 0 ? (
                    <span style={{fontSize: '0.72rem', opacity: 0.6}}>пусто</span>
                  ) : (
                    w.queue.map((t) => (
                      <span
                        key={t.uid}
                        className={clsx(styles.chip, t.kind === 'io' && styles.chipIo, w.busy && styles.chipBusy)}
                      >
                        {t.label}
                      </span>
                    ))
                  )}
                </div>
              </div>
            ))}
            <div className={styles.stats}>
              <span>Обработано: {goroutine.done}</span>
              <span>Входящих: {goroutine.inbox.length}</span>
            </div>
            <div style={{marginTop: '0.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap'}}>
              <button type="button" className="it-demo__btn it-demo__btn--primary" onClick={sendRequest}>
                + HTTP-запрос
              </button>
              <button
                type="button"
                className="it-demo__btn it-demo__btn--secondary"
                onClick={() => {
                  setGoroutine(initialGoroutineState());
                  setLastDispatch(null);
                }}
              >
                Сброс
              </button>
            </div>
            {lastDispatch && (
              <p className="it-demo__hint" style={{marginTop: '0.5rem', marginBottom: 0}}>
                {lastDispatch}
              </p>
            )}
          </div>

          <div>
            <label className="it-demo__label">Middleware net/http</label>
            <label style={{display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem'}}>
              <input type="checkbox" checked={auth} onChange={(e) => setAuth(e.target.checked)} />
              Authorization: Bearer …
            </label>
            <label style={{display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', marginTop: '0.25rem'}}>
              <input
                type="checkbox"
                checked={rateLimited}
                onChange={(e) => setRateLimited(e.target.checked)}
              />
              Превышен rate limit
            </label>
            <button
              type="button"
              className="it-demo__btn it-demo__btn--primary"
              style={{marginTop: '0.5rem'}}
              onClick={probeMiddleware}
            >
              GET /api/v1/orders
            </button>
            {mwResult && (
              <div className={styles.mwLane}>
                {mwResult.steps.map((s) => (
                  <span
                    key={s.id}
                    className={clsx(styles.mwStep, s.ok ? styles.mwOk : styles.mwFail)}
                    title={s.hint}
                  >
                    {s.label} {s.ok ? '✓' : s.status}
                  </span>
                ))}
                {!mwResult.blocked && (
                  <span className={clsx(styles.mwStep, styles.mwOk)}>200 OK + JSON</span>
                )}
              </div>
            )}
            <pre className={styles.mono}>{CHANNEL_SNIPPET}</pre>
          </div>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default GoMicroservicePlayInner;
