import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  INDEX_TYPES,
  QUERY_PRESETS,
  USERS_TABLE,
  buildIndexEntries,
  indexUsable,
  simulateInsert,
  simulateQuery,
} from '@/components/shared/kb/dbIndexVisualizerEngine';
import styles from '@/components/demos/DbIndexVisualizerPlay.module.css';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';

function DbIndexVisualizerPlayInner() {
  const [indexId, setIndexId] = useState('email');
  const [queryId, setQueryId] = useState('eq_email');

  const indexType = INDEX_TYPES.find((t) => t.id === indexId) ?? INDEX_TYPES[1];
  const preset = QUERY_PRESETS.find((q) => q.id === queryId) ?? QUERY_PRESETS[0];

  const result = useMemo(
    () => simulateQuery(USERS_TABLE, indexType, preset.predicate, preset.id),
    [indexType, preset],
  );

  const indexEntries = useMemo(
    () => (indexType.columns.length ? buildIndexEntries(USERS_TABLE, indexType.columns) : []),
    [indexType],
  );

  const insertSim = useMemo(() => simulateInsert(indexType), [indexType]);
  const usable = indexUsable(indexType.columns, preset.predicate, preset.id);

  const maxCost = USERS_TABLE.length;

  return (
    <DemoShell>
      <DemoCard
        title="Визуализатор индексов БД"
        subtitle="Сравните Index Scan и Seq Scan: когда B-tree помогает, а когда оптимизатор читает всю таблицу"
      >
        <label className="it-demo__label">Тип индекса</label>
        <div className={toolStyles.chips} style={{marginBottom: '0.65rem'}}>
          {INDEX_TYPES.filter((t) => t.id !== 'none' || queryId !== 'composite_age_only').map((t) => (
            <button
              key={t.id}
              type="button"
              className={clsx(toolStyles.chip, indexId === t.id && toolStyles.chipActive)}
              onClick={() => setIndexId(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <label className="it-demo__label">Запрос</label>
        <div className={clsx(toolStyles.chips, styles.presetRow)}>
          {QUERY_PRESETS.map((q) => (
            <button
              key={q.id}
              type="button"
              className={clsx(toolStyles.chip, queryId === q.id && toolStyles.chipActive)}
              onClick={() => {
                setQueryId(q.id);
                if (q.requiresComposite && indexId !== 'composite') setIndexId('composite');
              }}
            >
              {q.label}
            </button>
          ))}
        </div>

        <div className={styles.sqlBox}>{preset.sql}</div>

        <div className={clsx(styles.planBanner, result.effective ? styles.planGood : styles.planBad)}>
          {result.plan} — {result.planRu}
          {!usable && indexType.columns.length > 0 ? ' (индекс не подходит к предикату)' : ''}
        </div>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <span>Строк прочитано</span>
            <strong>{result.rowsExamined}</strong>
          </div>
          <div className={styles.stat}>
            <span>Строк в результате</span>
            <strong>{result.rowsReturned}</strong>
          </div>
          <div className={styles.stat}>
            <span>Относительная стоимость</span>
            <strong>
              {result.relativeCost} / {maxCost}
            </strong>
          </div>
        </div>

        <div className={styles.grid}>
          <div>
            <p className={styles.panelTitle}>Таблица users (heap)</p>
            <div className={styles.panel}>
              {USERS_TABLE.map((row) => (
                <div
                  key={row.id}
                  className={clsx(
                    styles.rowLine,
                    result.scannedRowIds.includes(row.id) && styles.rowScanned,
                    result.matchedRowIds.includes(row.id) && styles.rowMatched,
                  )}
                >
                  <span>{row.id}</span>
                  <span>{row.email}</span>
                  <span>{row.age}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className={styles.panelTitle}>
              {indexType.columns.length
                ? `Индекс ${indexType.label} (отсортированные ключи)`
                : 'Индекс не создан'}
            </p>
            <div className={styles.panel}>
              {indexEntries.length ? (
                indexEntries.map((entry) => (
                  <div
                    key={entry.rowId}
                    className={clsx(
                      styles.indexEntry,
                      result.indexPath.some((p) => p.rowId === entry.rowId && p.active) &&
                        styles.indexActive,
                    )}
                  >
                    <span>{entry.label}</span>
                    <span>→ id {entry.rowId}</span>
                  </div>
                ))
              ) : (
                <p className="it-demo__hint" style={{margin: 0}}>
                  Создайте индекс, чтобы увидеть отдельную структуру рядом с таблицей.
                </p>
              )}
            </div>
          </div>
        </div>

        <p className="it-demo__hint" style={{marginTop: '0.65rem'}}>
          {preset.note || result.hint}
        </p>
      </DemoCard>

      <DemoCard title="Стоимость записи (INSERT)" subtitle="Индекс ускоряет чтение, но каждая вставка обновляет дерево ключей">
        <div className={styles.writeBar}>
          <div
            className={styles.writeSeg}
            style={{width: `${(insertSim.tableWrites / insertSim.relativeCost) * 100}%`, background: '#78909c'}}
          >
            Таблица
          </div>
          {insertSim.indexWrites > 0 && (
            <div
              className={styles.writeSeg}
              style={{
                width: `${(insertSim.indexWrites / insertSim.relativeCost) * 100}%`,
                background: '#5c6bc0',
              }}
            >
              Индекс ×{indexType.columns.length || 0}
            </div>
          )}
        </div>
        <p className="it-demo__hint" style={{marginTop: '0.5rem', marginBottom: 0}}>
          {insertSim.hint} Относительная стоимость INSERT: <strong>{insertSim.relativeCost}</strong> (без индекса — 1).
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default DbIndexVisualizerPlayInner;
