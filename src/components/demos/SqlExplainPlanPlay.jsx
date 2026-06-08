import React, {useCallback, useEffect, useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  ORDERS_TABLE,
  TARGET_CUSTOMER,
  buildIndexEntries,
  simulatePlan,
} from '@/components/shared/kb/sqlExplainPlanEngine';
import styles from '@/components/demos/SqlExplainPlanPlay.module.css';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';

function SqlExplainPlanPlayInner() {
  const [hasIndex, setHasIndex] = useState(false);
  const [limit, setLimit] = useState(null);
  const [playStep, setPlayStep] = useState(-1);
  const [playing, setPlaying] = useState(false);

  const result = useMemo(() => simulatePlan({hasIndex, limit}), [hasIndex, limit]);
  const indexEntries = useMemo(() => buildIndexEntries(ORDERS_TABLE), []);

  const sql = limit
    ? `EXPLAIN SELECT * FROM orders\nWHERE customer_id = ${TARGET_CUSTOMER}\nLIMIT ${limit};`
    : `EXPLAIN SELECT * FROM orders\nWHERE customer_id = ${TARGET_CUSTOMER};`;

  const activeRowIds = useMemo(() => {
    if (playStep < 0) return new Set();
    const slice = result.timeline.slice(0, playStep + 1);
    return new Set(slice.map((t) => t.rowid));
  }, [playStep, result.timeline]);

  const matchedIds = useMemo(() => new Set(result.matched.map((r) => r.rowid)), [result.matched]);

  const runAnimation = useCallback(() => {
    setPlaying(true);
    setPlayStep(-1);
    const n = result.timeline.length;
    let i = 0;
    const tick = () => {
      setPlayStep(i);
      i += 1;
      if (i < n) setTimeout(tick, 520);
      else setTimeout(() => setPlaying(false), 600);
    };
    setTimeout(tick, 200);
  }, [result.timeline.length]);

  useEffect(() => {
    setPlayStep(-1);
    setPlaying(false);
  }, [hasIndex, limit]);

  const costPct = Math.round((result.relativeCost / result.fullScanCost) * 100);

  return (
    <DemoShell>
      <DemoCard
        title="План выполнения SQL"
        subtitle="Сравните Seq Scan и поиск по индексу — как EXPLAIN показывает шаги оптимизатора"
      >
        <label className="it-demo__label">Индекс idx_customer_id</label>
        <div className={toolStyles.chips} style={{marginBottom: '0.65rem'}}>
          <button
            type="button"
            className={clsx(toolStyles.chip, !hasIndex && toolStyles.chipActive)}
            onClick={() => setHasIndex(false)}
          >
            Без индекса
          </button>
          <button
            type="button"
            className={clsx(toolStyles.chip, hasIndex && toolStyles.chipActive)}
            onClick={() => setHasIndex(true)}
          >
            CREATE INDEX …
          </button>
        </div>

        <label className="it-demo__label">Ограничение результата</label>
        <div className={toolStyles.chips} style={{marginBottom: '0.65rem'}}>
          <button
            type="button"
            className={clsx(toolStyles.chip, limit === null && toolStyles.chipActive)}
            onClick={() => setLimit(null)}
          >
            Все строки
          </button>
          <button
            type="button"
            className={clsx(toolStyles.chip, limit === 3 && toolStyles.chipActive)}
            onClick={() => setLimit(3)}
          >
            LIMIT 3
          </button>
        </div>

        <div className={styles.sqlBox}>{sql}</div>

        <div className={clsx(styles.planBanner, hasIndex ? styles.planGood : styles.planBad)}>
          {result.planLabel} — {result.planRu}
        </div>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <span>Строк просмотрено</span>
            <strong>{result.rowsExamined}</strong>
          </div>
          <div className={styles.stat}>
            <span>В результате</span>
            <strong>{result.rowsReturned}</strong>
          </div>
          <div className={styles.stat}>
            <span>Относительная стоимость</span>
            <strong>
              {result.relativeCost} / {result.fullScanCost}
            </strong>
          </div>
        </div>

        <div className={styles.costBar}>
          <div
            className={styles.costFill}
            style={{
              width: `${costPct}%`,
              background: hasIndex ? '#43a047' : '#e53935',
            }}
          >
            {costPct}%
          </div>
        </div>

        <div className={styles.layout} style={{marginTop: '0.75rem'}}>
          <div>
            <p className={styles.panelTitle}>Шаги плана (opcode)</p>
            <ul className={styles.stepList}>
              {result.steps.map((s, i) => (
                <li
                  key={`${s.opcode}-${i}`}
                  className={clsx(
                    styles.stepItem,
                    playStep >= 0 && i === Math.min(playStep, result.steps.length - 1) && styles.stepActive,
                  )}
                >
                  <div className={styles.stepOpcode}>{s.opcode}</div>
                  <div>{s.comment}</div>
                </li>
              ))}
            </ul>
            <div className={styles.controls}>
              <button
                type="button"
                className="it-demo__btn it-demo__btn--primary"
                onClick={runAnimation}
                disabled={playing}
              >
                {playing ? 'Выполняется…' : 'Проиграть план'}
              </button>
            </div>
          </div>

          <div>
            <p className={styles.panelTitle}>
              {hasIndex ? 'Таблица + индекс (customer_id → rowid)' : 'Таблица orders (полное сканирование)'}
            </p>
            {hasIndex && (
              <div className={styles.panel} style={{maxHeight: 100, marginBottom: '0.4rem'}}>
                {indexEntries.map((e) => (
                  <div
                    key={e.rowid}
                    className={clsx(
                      styles.rowLine,
                      activeRowIds.has(e.rowid) && styles.rowExamined,
                      e.customer_id === TARGET_CUSTOMER && matchedIds.has(e.rowid) && styles.rowMatched,
                    )}
                    style={{gridTemplateColumns: '4rem 3rem'}}
                  >
                    <span>{e.customer_id}</span>
                    <span>→ {e.rowid}</span>
                  </div>
                ))}
              </div>
            )}
            <div className={styles.panel}>
              {ORDERS_TABLE.map((row) => (
                <div
                  key={row.rowid}
                  className={clsx(
                    styles.rowLine,
                    activeRowIds.has(row.rowid) && styles.rowExamined,
                    matchedIds.has(row.rowid) && styles.rowMatched,
                  )}
                >
                  <span>{row.rowid}</span>
                  <span>{row.customer_id}</span>
                  <span>{row.customer_name}</span>
                  <span>{row.order_total} ₽</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="it-demo__hint" style={{marginTop: '0.65rem', marginBottom: 0}}>
          {result.hint}
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default SqlExplainPlanPlayInner;
