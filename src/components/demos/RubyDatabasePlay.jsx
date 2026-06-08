import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  ACCESS_LAYERS,
  CRUD_OPS,
  FLOW_SCENARIOS,
  INITIAL_USERS,
  LIFECYCLE_STEPS,
  RAILS_FLOW_SCENARIOS,
  STACK_LAYERS,
  USER_COLUMNS,
  cloneUsers,
  rubyCodeForLayer,
  runCrud,
  sqlForOp,
} from '@/components/shared/kb/rubyDatabaseEngine';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';
import styles from '@/components/demos/JavaDatabasePlay.module.css';

const MODES = [
  {id: 'stack', label: 'Поток pg → PostgreSQL'},
  {id: 'crud', label: 'CRUD-лаборатория'},
  {id: 'layers', label: 'Слои доступа'},
  {id: 'lifecycle', label: 'Жизненный цикл'},
  {id: 'rails', label: 'ActiveRecord'},
];

function UsersTable({users, highlightIds = new Set()}) {
  return (
    <div className={styles.tableWrap}>
      <table className="it-demo__table">
        <thead>
          <tr>
            {USER_COLUMNS.map((col) => (
              <th key={col}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan={USER_COLUMNS.length} style={{textAlign: 'center'}}>
                Таблица пуста
              </td>
            </tr>
          ) : (
            users.map((row) => (
              <tr
                key={row.id}
                className={highlightIds.has(row.id) ? styles.rowHighlight : undefined}
              >
                {USER_COLUMNS.map((col) => (
                  <td key={col}>
                    {col === 'active' ? (row[col] ? 'true' : 'false') : String(row[col] ?? '')}
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

function StackMode({scenarios, defaultScenarioId}) {
  const [scenarioId, setScenarioId] = useState(defaultScenarioId);
  const [stepIndex, setStepIndex] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [spotlight, setSpotlight] = useState([]);
  const [packet, setPacket] = useState(null);
  const timers = useRef([]);

  const scenario = scenarios.find((s) => s.id === scenarioId) ?? scenarios[0];
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
        {scenarios.map((s) => (
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

      <div className={styles.stackDiagram} aria-label="Стек Ruby — драйвер — СУБД">
        {STACK_LAYERS.map((layer, i) => (
          <React.Fragment key={layer.id}>
            {i > 0 && (
              <div className={styles.connector} aria-hidden>
                <span
                  className={clsx(
                    styles.connectorLine,
                    (packet === 'down' || packet === 'request') && isActive(layer.id) && styles.connectorPulseDown,
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

function CrudMode({defaultLayer}) {
  const [users, setUsers] = useState(() => cloneUsers(INITIAL_USERS));
  const [layerId, setLayerId] = useState(defaultLayer);
  const [opId, setOpId] = useState('read');
  const [highlightIds, setHighlightIds] = useState(new Set());
  const [message, setMessage] = useState(null);
  const [form, setForm] = useState({
    id: '2',
    name: 'Анна',
    email: 'anna@example.com',
    active: true,
  });

  const params = useMemo(
    () => ({
      id: form.id ? Number(form.id) : null,
      name: form.name,
      email: form.email,
      active: form.active,
    }),
    [form],
  );

  const sql = sqlForOp(opId, params);
  const rbCode = rubyCodeForLayer(layerId, opId, params);

  const execute = () => {
    const result = runCrud(users, opId, params);
    setUsers(result.users);
    setMessage(result.message);
    if (result.rows.length) {
      setHighlightIds(new Set(result.rows.map((r) => r.id)));
      window.setTimeout(() => setHighlightIds(new Set()), 1400);
    }
  };

  const resetDb = () => {
    setUsers(cloneUsers(INITIAL_USERS));
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
            <label htmlFor="rb-db-id">id пользователя (пусто = все active)</label>
            <input
              id="rb-db-id"
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
              <label htmlFor="rb-db-name">name</label>
              <input
                id="rb-db-name"
                value={form.name}
                onChange={(e) => setForm((f) => ({...f, name: e.target.value}))}
              />
            </div>
            <div className={styles.crudField}>
              <label htmlFor="rb-db-email">email</label>
              <input
                id="rb-db-email"
                value={form.email}
                onChange={(e) => setForm((f) => ({...f, email: e.target.value}))}
              />
            </div>
            {opId === 'update' && (
              <div className={styles.crudField}>
                <label htmlFor="rb-db-active">active</label>
                <select
                  id="rb-db-active"
                  value={form.active ? 'true' : 'false'}
                  onChange={(e) =>
                    setForm((f) => ({...f, active: e.target.value === 'true'}))
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

      <UsersTable users={users} highlightIds={highlightIds} />

      <div className={styles.layout2}>
        <div>
          <span className={styles.panelLabel}>SQL (что уходит в PostgreSQL)</span>
          <pre className={styles.sqlPanel}>{sql}</pre>
        </div>
        <div>
          <span className={styles.panelLabel}>
            Ruby — {ACCESS_LAYERS.find((l) => l.id === layerId)?.label}
          </span>
          <pre className={styles.codePanel}>{rbCode}</pre>
        </div>
      </div>
    </>
  );
}

function LayersMode() {
  const [opId, setOpId] = useState('read');
  const params = {
    id: 2,
    name: 'Анна',
    email: 'anna@example.com',
    active: false,
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
        Одна операция — три уровня: pg, Sequel, ActiveRecord. Внизу всё равно SQL и драйвер.
      </p>

      <div className={styles.layerCompare}>
        {ACCESS_LAYERS.map((layer) => (
          <div key={layer.id} className={styles.layerCard}>
            <p className={styles.layerCardTitle}>{layer.label}</p>
            <p className={styles.layerRole} style={{marginBottom: '0.35rem'}}>
              {layer.desc}
            </p>
            <pre>{rubyCodeForLayer(layer.id, opId, params)}</pre>
          </div>
        ))}
      </div>

      <p className={styles.panelLabel} style={{marginTop: '0.75rem'}}>
        Итоговый SQL (пример для pg)
      </p>
      <pre className={styles.sqlPanel}>{sqlForOp(opId, params)}</pre>
    </>
  );
}

function LifecycleMode() {
  const [stepIdx, setStepIdx] = useState(0);
  const [playing, setPlaying] = useState(false);

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

function RubyDatabasePlayInner({defaultMode}) {
  const [mode, setMode] = useState(defaultMode ?? 'stack');

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Ruby и база данных"
        subtitle="pg, пул connection_pool, Sequel, ActiveRecord — подключение, CRUD и поток запроса"
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

        {mode === 'stack' && <StackMode scenarios={FLOW_SCENARIOS} defaultScenarioId="select" />}
        {mode === 'crud' && <CrudMode defaultLayer="pg" />}
        {mode === 'layers' && <LayersMode />}
        {mode === 'lifecycle' && <LifecycleMode />}
        {mode === 'rails' && (
          <StackMode scenarios={RAILS_FLOW_SCENARIOS} defaultScenarioId="crud_save" />
        )}

        <p className={styles.footer}>
          {mode === 'stack' &&
            'Ruby не открывает сокет к PostgreSQL сам — гем pg реализует протокол. Параметры $1 отделяют данные от текста SQL.'}
          {mode === 'crud' &&
            'В pg нет autocommit "как в Rails" — явный transaction или pool.with_connection. В ActiveRecord commit при save внутри транзакции.'}
          {mode === 'layers' &&
            'Sequel даёт SQL-DSL без объектной "магии"; ActiveRecord — полный цикл find/save. Оба внизу используют pg.'}
          {mode === 'lifecycle' &&
            'res.clear освобождает память драйвера после больших выборок. Не открывайте PG.connect на каждый запрос в вебе.'}
          {mode === 'rails' &&
            'Relation ленив: SQL уходит в БД при each/first. includes(:posts) снимает N+1 — смотрите лог development.log.'}
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default RubyDatabasePlayInner;
