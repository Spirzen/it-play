import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';

import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';


import {
  ACCESS_LAYERS,
  BOOK_COLUMNS,
  CRUD_OPS,
  FLOW_SCENARIOS,
  INITIAL_BOOKS,
  LIFECYCLE_STEPS,
  STACK_LAYERS,
  cloneBooks,
  kotlinCodeForLayer,
  runCrud,
  sqlForOp,
} from '@/components/shared/kb/kotlinDatabaseEngine';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';
import styles from '@/components/demos/JavaDatabasePlay.module.css';

const MODES = [
  {id: 'stack', label: 'Стек JDBC'},
  {id: 'crud', label: 'CRUD-лаборатория'},
  {id: 'layers', label: 'Слои доступа'},
  {id: 'lifecycle', label: 'Жизненный цикл'},
];

function BooksTable({books, highlightIds = new Set()}) {
  return (
    <div className={styles.tableWrap}>
      <table className="it-demo__table">
        <thead>
          <tr>
            {BOOK_COLUMNS.map((col) => (
              <th key={col}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {books.length === 0 ? (
            <tr>
              <td colSpan={BOOK_COLUMNS.length} style={{textAlign: 'center'}}>
                Таблица пуста
              </td>
            </tr>
          ) : (
            books.map((row) => (
              <tr
                key={row.id}
                className={highlightIds.has(row.id) ? styles.rowHighlight : undefined}
              >
                {BOOK_COLUMNS.map((col) => (
                  <td key={col}>
                    {col === 'available' ? (row[col] ? 'true' : 'false') : String(row[col] ?? '')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function StackMode() {
  const [scenarioId, setScenarioId] = useState('select');
  const [stepIndex, setStepIndex] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [spotlight, setSpotlight] = useState([]);
  const [packet, setPacket] = useState(null);
  const timers = useRef([]);

  const scenario = FLOW_SCENARIOS.find((s) => s.id === scenarioId) ?? FLOW_SCENARIOS[0];
  const currentStep = stepIndex >= 0 ? scenario.steps[stepIndex] : null;

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  const schedule = useCallback((fn, ms) => {
    const id = setTimeout(fn, ms);
    timers.current.push(id);
    return id;
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const reset = useCallback(() => {
    clearTimers();
    setPlaying(false);
    setStepIndex(-1);
    setSpotlight([]);
    setPacket(null);
  }, [clearTimers]);

  const applyStep = useCallback(
    (index) => {
      const step = scenario.steps[index];
      if (!step) return;
      setStepIndex(index);
      setSpotlight(step.spotlight);
      setPacket(step.packet ?? null);
    },
    [scenario.steps],
  );

  const playScenario = useCallback(() => {
    clearTimers();
    reset();
    setPlaying(true);
    const run = (i) => {
      applyStep(i);
      if (i < scenario.steps.length - 1) {
        schedule(() => run(i + 1), 2200);
      } else {
        schedule(() => setPlaying(false), 2200);
      }
    };
    schedule(() => run(0), 250);
  }, [applyStep, clearTimers, reset, scenario.steps, schedule]);

  const stepManual = (delta) => {
    if (playing) return;
    const next = Math.max(0, Math.min(scenario.steps.length - 1, stepIndex + delta));
    applyStep(next);
  };

  const isActive = (layerId) => spotlight.includes(layerId);

  return (
    <>
      <div className={styles.modeTabs} role="tablist" aria-label="Сценарии потока">
        {FLOW_SCENARIOS.map((s) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={scenarioId === s.id}
            disabled={playing}
            className={clsx(styles.modeTab, scenarioId === s.id && styles.modeTabActive)}
            onClick={() => {
              if (playing) return;
              setScenarioId(s.id);
              reset();
            }}
          >
            {s.title}
          </button>
        ))}
      </div>

      <p className={styles.stepDetail} style={{textAlign: 'center', marginBottom: '0.75rem'}}>
        <strong>{scenario.title}</strong> — {scenario.subtitle}
      </p>

      <div className={styles.stackDiagram} aria-label="Стек Kotlin — JDBC — СУБД">
        {STACK_LAYERS.map((layer, i) => (
          <React.Fragment key={layer.id}>
            {i > 0 && (
              <div className={styles.connector} aria-hidden>
                <span
                  className={clsx(
                    styles.connectorLine,
                    (packet === 'down' || packet === 'request') &&
                      isActive(layer.id) &&
                      styles.connectorPulseDown,
                    packet === 'up' && isActive(layer.id) && styles.connectorPulseUp,
                  )}
                />
                <span className={styles.connectorLabel}>
                  {packet === 'request' ? 'SQL' : packet === 'up' ? 'ответ' : 'вызов'}
                </span>
              </div>
            )}
            <section className={clsx(styles.layer, isActive(layer.id) && styles.layerActive)}>
              <header className={styles.layerHeader}>
                <span className={styles.layerLabel}>{layer.label}</span>
                <span className={styles.layerShort}>{layer.short}</span>
              </header>
              <p className={styles.layerRole}>{layer.role}</p>
            </section>
          </React.Fragment>
        ))}
      </div>

      {currentStep && (
        <div className={styles.stepCard}>
          <span className={styles.stepBadge}>
            Шаг {stepIndex + 1} / {scenario.steps.length}
          </span>
          <p className={styles.stepTitle}>{currentStep.label}</p>
          <p className={styles.stepDetail}>{currentStep.detail}</p>
          {currentStep.code && <pre className={styles.codePanel}>{currentStep.code}</pre>}
        </div>
      )}

      <div className={styles.controls}>
        <button
          type="button"
          className="it-demo__btn it-demo__btn--primary"
          onClick={playScenario}
          disabled={playing}
        >
          {playing ? 'Воспроизведение…' : '▶ Пройти сценарий'}
        </button>
        <button
          type="button"
          className="it-demo__btn it-demo__btn--secondary"
          onClick={() => stepManual(-1)}
          disabled={playing || stepIndex <= 0}
        >
          ← Назад
        </button>
        <button
          type="button"
          className="it-demo__btn it-demo__btn--secondary"
          onClick={() => stepManual(1)}
          disabled={playing || stepIndex >= scenario.steps.length - 1}
        >
          Вперёд →
        </button>
        {stepIndex >= 0 && (
          <button type="button" className="it-demo__btn it-demo__btn--secondary" onClick={reset}>
            Сброс
          </button>
        )}
      </div>

      <div className={styles.stepDots} aria-hidden>
        {scenario.steps.map((_, i) => (
          <span
            key={i}
            className={clsx(
              styles.stepDot,
              i <= stepIndex && styles.stepDotDone,
              i === stepIndex && styles.stepDotCurrent,
            )}
          />
        ))}
      </div>
    </>
  );
}

function CrudMode() {
  const [books, setBooks] = useState(() => cloneBooks(INITIAL_BOOKS));
  const [layerId, setLayerId] = useState('jdbc');
  const [opId, setOpId] = useState('read');
  const [highlightIds, setHighlightIds] = useState(new Set());
  const [message, setMessage] = useState(null);
  const [form, setForm] = useState({
    id: '2',
    title: 'Atomic Kotlin',
    author: 'Bruce Eckel',
    isbn: '978-0981872534',
    published_year: '2019',
    available: true,
  });

  const params = useMemo(
    () => ({
      id: form.id ? Number(form.id) : null,
      title: form.title,
      author: form.author,
      isbn: form.isbn,
      published_year: form.published_year,
      available: form.available,
    }),
    [form],
  );

  const sql = sqlForOp(opId, params);
  const kotlinCode = kotlinCodeForLayer(layerId, opId, params);

  const execute = () => {
    const result = runCrud(books, opId, params);
    setBooks(result.books);
    setMessage(result.message);
    if (result.rows.length) {
      setHighlightIds(new Set(result.rows.map((r) => r.id)));
      window.setTimeout(() => setHighlightIds(new Set()), 1400);
    }
  };

  const resetDb = () => {
    setBooks(cloneBooks(INITIAL_BOOKS));
    setMessage(null);
    setHighlightIds(new Set());
  };

  return (
    <>
      <div className={toolStyles.chips} style={{marginBottom: '0.5rem'}}>
        {ACCESS_LAYERS.map((l) => (
          <button
            key={l.id}
            type="button"
            className={clsx(toolStyles.chip, layerId === l.id && toolStyles.chipActive)}
            onClick={() => setLayerId(l.id)}
            title={l.desc}
          >
            {l.label}
          </button>
        ))}
      </div>

      <div className={styles.crudToolbar}>
        {CRUD_OPS.map((op) => (
          <button
            key={op.id}
            type="button"
            className={clsx(
              'it-demo__btn it-demo__btn--sm',
              opId === op.id ? 'it-demo__btn--primary' : 'it-demo__btn--secondary',
            )}
            onClick={() => setOpId(op.id)}
          >
            {op.label}
          </button>
        ))}
      </div>

      <div className={styles.crudForm}>
        {(opId === 'read' || opId === 'update' || opId === 'delete') && (
          <div className={styles.crudField}>
            <label htmlFor="kotlin-db-id">id книги (пусто = все available)</label>
            <input
              id="kotlin-db-id"
              type="number"
              min="1"
              value={form.id}
              onChange={(e) => setForm((f) => ({...f, id: e.target.value}))}
            />
          </div>
        )}
        {(opId === 'create' || opId === 'update') && (
          <>
            <div className={styles.crudField}>
              <label htmlFor="kotlin-db-title">title</label>
              <input
                id="kotlin-db-title"
                value={form.title}
                onChange={(e) => setForm((f) => ({...f, title: e.target.value}))}
              />
            </div>
            <div className={styles.crudField}>
              <label htmlFor="kotlin-db-author">author</label>
              <input
                id="kotlin-db-author"
                value={form.author}
                onChange={(e) => setForm((f) => ({...f, author: e.target.value}))}
              />
            </div>
            {opId === 'create' && (
              <>
                <div className={styles.crudField}>
                  <label htmlFor="kotlin-db-isbn">isbn</label>
                  <input
                    id="kotlin-db-isbn"
                    value={form.isbn}
                    onChange={(e) => setForm((f) => ({...f, isbn: e.target.value}))}
                  />
                </div>
                <div className={styles.crudField}>
                  <label htmlFor="kotlin-db-year">published_year</label>
                  <input
                    id="kotlin-db-year"
                    value={form.published_year}
                    onChange={(e) => setForm((f) => ({...f, published_year: e.target.value}))}
                  />
                </div>
              </>
            )}
            {opId === 'update' && (
              <div className={styles.crudField}>
                <label htmlFor="kotlin-db-avail">available</label>
                <select
                  id="kotlin-db-avail"
                  value={form.available ? 'true' : 'false'}
                  onChange={(e) =>
                    setForm((f) => ({...f, available: e.target.value === 'true'}))
                  }
                >
                  <option value="true">true</option>
                  <option value="false">false</option>
                </select>
              </div>
            )}
          </>
        )}
      </div>

      <div className={styles.controls}>
        <button type="button" className="it-demo__btn it-demo__btn--primary" onClick={execute}>
          Выполнить {CRUD_OPS.find((o) => o.id === opId)?.verb}
        </button>
        <button type="button" className="it-demo__btn it-demo__btn--secondary" onClick={resetDb}>
          Сбросить таблицу
        </button>
      </div>

      {message && <p className={styles.messageError}>{message}</p>}

      <BooksTable books={books} highlightIds={highlightIds} />

      <div className={styles.layout2}>
        <div>
          <span className={styles.panelLabel}>SQL (что уходит в СУБД)</span>
          <pre className={styles.sqlPanel}>{sql}</pre>
        </div>
        <div>
          <span className={styles.panelLabel}>
            Kotlin — {ACCESS_LAYERS.find((l) => l.id === layerId)?.label}
          </span>
          <pre className={styles.codePanel}>{kotlinCode}</pre>
        </div>
      </div>
    </>
  );
}

function LayersMode() {
  const [opId, setOpId] = useState('read');
  const params = {
    id: 2,
    title: 'Atomic Kotlin',
    author: 'Bruce Eckel',
    isbn: '978-0981872534',
    available: false,
  };

  return (
    <>
      <div className={styles.crudToolbar}>
        {CRUD_OPS.map((op) => (
          <button
            key={op.id}
            type="button"
            className={clsx(
              'it-demo__btn it-demo__btn--sm',
              opId === op.id ? 'it-demo__btn--primary' : 'it-demo__btn--secondary',
            )}
            onClick={() => setOpId(op.id)}
          >
            {op.label}
          </button>
        ))}
      </div>

      <p className={styles.stepDetail} style={{textAlign: 'center', marginBottom: '0.65rem'}}>
        Одна операция — три уровня абстрации. Внизу всё равно JDBC и SQL.
      </p>

      <div className={styles.layerCompare}>
        {ACCESS_LAYERS.map((layer) => (
          <div key={layer.id} className={styles.layerCard}>
            <p className={styles.layerCardTitle}>{layer.label}</p>
            <p className={styles.layerRole} style={{marginBottom: '0.35rem'}}>
              {layer.desc}
            </p>
            <pre>{kotlinCodeForLayer(layer.id, opId, params)}</pre>
          </div>
        ))}
      </div>

      <p className={styles.panelLabel} style={{marginTop: '0.75rem'}}>
        Итоговый SQL (пример для JDBC)
      </p>
      <pre className={styles.sqlPanel}>{sqlForOp(opId, params)}</pre>
    </>
  );
}

function LifecycleMode() {
  const [stepIdx, setStepIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timers = useRef([]);

  const step = LIFECYCLE_STEPS[stepIdx] ?? LIFECYCLE_STEPS[0];

  useEffect(() => {
    if (!playing) return undefined;
    const id = window.setInterval(() => {
      setStepIdx((i) => {
        if (i >= LIFECYCLE_STEPS.length - 1) {
          setPlaying(false);
          return 0;
        }
        return i + 1;
      });
    }, 1800);
    timers.current.push(id);
    return () => clearInterval(id);
  }, [playing]);

  return (
    <>
      <div className={styles.lifecycleList}>
        {LIFECYCLE_STEPS.map((s, i) => (
          <button
            key={s.id}
            type="button"
            className={clsx(styles.lifecycleStep, i === stepIdx && styles.lifecycleStepOn)}
            onClick={() => {
              setPlaying(false);
              setStepIdx(i);
            }}
          >
            <span className={styles.lifecycleNum}>{i + 1}</span>
            <span className={styles.lifecycleBody}>
              <p className={styles.lifecycleTitle}>{s.label}</p>
              <p className={styles.lifecycleDetail}>{s.detail}</p>
            </span>
          </button>
        ))}
      </div>

      <pre className={styles.codePanel}>{step.code}</pre>

      <div className={styles.controls}>
        <button
          type="button"
          className="it-demo__btn it-demo__btn--primary"
          onClick={() => setPlaying((p) => !p)}
        >
          {playing ? 'Пауза' : '▶ Автопрокрутка'}
        </button>
        <button
          type="button"
          className="it-demo__btn it-demo__btn--secondary"
          onClick={() => setStepIdx((i) => Math.max(0, i - 1))}
        >
          ←
        </button>
        <button
          type="button"
          className="it-demo__btn it-demo__btn--secondary"
          onClick={() => setStepIdx((i) => Math.min(LIFECYCLE_STEPS.length - 1, i + 1))}
        >
          →
        </button>
      </div>

      <div className={styles.stackDiagram} style={{marginTop: '0.75rem'}}>
        {STACK_LAYERS.map((layer) => (
          <section
            key={layer.id}
            className={clsx(styles.layer, step.layers?.includes(layer.id) && styles.layerActive)}
            style={{marginBottom: '0.35rem'}}
          >
            <span className={styles.layerLabel}>{layer.label}</span>
          </section>
        ))}
      </div>
    </>
  );
}

function KotlinDatabasePlayInner() {
  const [mode, setMode] = useState('stack');

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Kotlin и база данных"
        subtitle="JDBC, HikariCP, CRUD и сравнение JDBC · Exposed · Ktorm"
      >
        <div className={styles.modeTabs} role="tablist" aria-label="Режимы демо">
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              role="tab"
              aria-selected={mode === m.id}
              className={clsx(styles.modeTab, mode === m.id && styles.modeTabActive)}
              onClick={() => setMode(m.id)}
            >
              {m.label}
            </button>
          ))}
        </div>

        {mode === 'stack' && <StackMode />}
        {mode === 'crud' && <CrudMode />}
        {mode === 'layers' && <LayersMode />}
        {mode === 'lifecycle' && <LifecycleMode />}

        <p className={styles.footer}>
          {mode === 'stack' &&
            'Kotlin использует java.sql через JVM: приложение не обращается к PostgreSQL напрямую. Пул HikariCP переиспользует TCP-соединения.'}
          {mode === 'crud' &&
            'PreparedStatement и DSL Exposed/Ktorm параметризуют значения — это защита от SQL-инъекций. Секреты — только в конфиге или vault.'}
          {mode === 'layers' &&
            'Exposed и Ktorm сокращают boilerplate, но сгенерированный SQL нужно понимать (N+1, лишние JOIN).'}
          {mode === 'lifecycle' &&
            'Закрывайте ресурсы через use { }: ResultSet → Statement → Connection. Блокирующий JDBC — на Dispatchers.IO.'}
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default KotlinDatabasePlayInner;
