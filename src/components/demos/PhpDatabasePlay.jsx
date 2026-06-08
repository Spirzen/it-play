import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  ACCESS_LAYERS,
  CRUD_OPS,
  FORM_FLOW_SCENARIOS,
  INITIAL_SUBSCRIBERS,
  LIFECYCLE_STEPS,
  PDO_FLOW_SCENARIOS,
  STACK_LAYERS,
  SUBSCRIBER_COLUMNS,
  cloneSubscribers,
  phpCodeForLayer,
  runCrud,
  sqlForOp,
  validateFormInput,
} from '@/components/shared/kb/phpDatabaseEngine';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';
import styles from '@/components/demos/JavaDatabasePlay.module.css';
import formStyles from '@/components/demos/PhpDatabasePlay.module.css';

const MODES = [
  {id: 'form', label: 'Форма → БД'},
  {id: 'stack', label: 'Поток PDO'},
  {id: 'crud', label: 'CRUD-лаборатория'},
  {id: 'layers', label: 'Слои доступа'},
  {id: 'lifecycle', label: 'Жизненный цикл PDO'},
];

function SubscribersTable({rows, highlightIds = new Set()}) {
  return (
    <div className={styles.tableWrap}>
      <table className="it-demo__table">
        <thead>
          <tr>
            {SUBSCRIBER_COLUMNS.map((col) => (
              <th key={col}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={SUBSCRIBER_COLUMNS.length} style={{textAlign: 'center'}}>
                Таблица пуста
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr
                key={row.id}
                className={highlightIds.has(row.id) ? styles.rowHighlight : undefined}
              >
                {SUBSCRIBER_COLUMNS.map((col) => (
                  <td key={col}>{String(row[col] ?? '')}</td>
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

      <div className={styles.stackDiagram} aria-label="Стек браузер — PHP — PDO — MySQL">
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
                  {packet === 'request' ? 'SQL' : packet === 'up' ? 'ответ' : 'данные'}
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

function FormMode() {
  const [subscribers, setSubscribers] = useState(() => cloneSubscribers(INITIAL_SUBSCRIBERS));
  const [name, setName] = useState('Иван');
  const [email, setEmail] = useState('ivan@mail.ru');
  const [errors, setErrors] = useState([]);
  const [phase, setPhase] = useState('idle');
  const [stepIndex, setStepIndex] = useState(-1);
  const [spotlight, setSpotlight] = useState([]);
  const [packet, setPacket] = useState(null);
  const [flash, setFlash] = useState(null);
  const [lastInsertedId, setLastInsertedId] = useState(null);
  const timers = useRef([]);
  const scenario = FORM_FLOW_SCENARIOS[0];

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

  const isActive = (layerId) => spotlight.includes(layerId);

  const resetAnim = () => {
    clearTimers();
    setPhase('idle');
    setStepIndex(-1);
    setSpotlight([]);
    setPacket(null);
  };

  const applyStep = (index) => {
    const step = scenario.steps[index];
    if (!step) return;
    setStepIndex(index);
    setSpotlight(step.spotlight);
    setPacket(step.packet ?? null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const v = validateFormInput({name, email});
    if (!v.ok) {
      setErrors(v.errors);
      setFlash(null);
      resetAnim();
      return;
    }
    setErrors([]);
    setFlash(null);
    clearTimers();
    setPhase('running');

    const run = (i) => {
      applyStep(i);
      if (i === 4) {
        const result = runCrud(subscribers, 'create', {name: v.name, email: v.email});
        if (result.message) {
          setErrors([result.message]);
          setPhase('error');
          return;
        }
        setSubscribers(result.rows);
        const newId = result.hits[0]?.id;
        setLastInsertedId(newId ?? null);
        setFlash(`Запись #${newId} сохранена в subscribers`);
      }
      if (i < scenario.steps.length - 1) {
        schedule(() => run(i + 1), 1600);
      } else {
        schedule(() => setPhase('done'), 1600);
      }
    };
    schedule(() => run(0), 200);
  };

  const currentStep = stepIndex >= 0 ? scenario.steps[stepIndex] : null;

  return (
    <>
      <div className={formStyles.formLayout}>
        <form className={formStyles.demoForm} onSubmit={handleSubmit} noValidate>
          <p className={formStyles.formHint}>
            Мини-форма имитирует POST: после "Отправить" данные проходят по стеку до MySQL.
          </p>
          <div className={styles.crudField}>
            <label htmlFor="php-form-name">name</label>
            <input
              id="php-form-name"
              name="name"
              value={name}
              onChange={(ev) => setName(ev.target.value)}
              disabled={phase === 'running'}
            />
          </div>
          <div className={styles.crudField}>
            <label htmlFor="php-form-email">email</label>
            <input
              id="php-form-email"
              name="email"
              type="email"
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
              disabled={phase === 'running'}
            />
          </div>
          {errors.length > 0 && (
            <ul className={formStyles.errorList} role="alert">
              {errors.map((err) => (
                <li key={err}>{err}</li>
              ))}
            </ul>
          )}
          {flash && <p className={formStyles.successMsg}>{flash}</p>}
          <button
            type="submit"
            className="it-demo__btn it-demo__btn--primary"
            disabled={phase === 'running'}
          >
            {phase === 'running' ? 'Обработка…' : 'Отправить (POST)'}
          </button>
        </form>

        <div className={formStyles.stackCompact}>
          {STACK_LAYERS.map((layer, i) => (
            <React.Fragment key={layer.id}>
              {i > 0 && (
                <span
                  className={clsx(
                    formStyles.miniArrow,
                    packet && isActive(layer.id) && formStyles.miniArrowPulse,
                  )}
                  aria-hidden
                >
                  ↓
                </span>
              )}
              <div
                className={clsx(formStyles.miniLayer, isActive(layer.id) && formStyles.miniLayerOn)}
              >
                {layer.label}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      {currentStep && phase !== 'idle' && (
        <div className={styles.stepCard}>
          <span className={styles.stepBadge}>
            Шаг {stepIndex + 1} / {scenario.steps.length}
          </span>
          <p className={styles.stepTitle}>{currentStep.label}</p>
          <p className={styles.stepDetail}>{currentStep.detail}</p>
          {currentStep.code && <pre className={styles.codePanel}>{currentStep.code}</pre>}
        </div>
      )}

      <SubscribersTable
        rows={subscribers}
        highlightIds={lastInsertedId ? new Set([lastInsertedId]) : new Set()}
      />

      <div className={styles.controls}>
        <button
          type="button"
          className="it-demo__btn it-demo__btn--secondary"
          onClick={() => {
            setSubscribers(cloneSubscribers(INITIAL_SUBSCRIBERS));
            setErrors([]);
            setFlash(null);
            setLastInsertedId(null);
            resetAnim();
          }}
        >
          Сбросить таблицу
        </button>
        <button
          type="button"
          className="it-demo__btn it-demo__btn--secondary"
          onClick={() => {
            resetAnim();
            setPhase('idle');
          }}
        >
          Сбросить анимацию
        </button>
      </div>
    </>
  );
}

function CrudMode() {
  const [rows, setRows] = useState(() => cloneSubscribers(INITIAL_SUBSCRIBERS));
  const [layerId, setLayerId] = useState('pdo');
  const [opId, setOpId] = useState('read');
  const [highlightIds, setHighlightIds] = useState(new Set());
  const [message, setMessage] = useState(null);
  const [form, setForm] = useState({
    id: '2',
    name: 'Борис',
    email: 'boris@example.com',
  });

  const params = useMemo(
    () => ({
      id: form.id ? Number(form.id) : null,
      name: form.name,
      email: form.email,
    }),
    [form],
  );

  const sql = sqlForOp(opId, params);
  const phpCode = phpCodeForLayer(layerId, opId, params);

  const execute = () => {
    const result = runCrud(rows, opId, params);
    setRows(result.rows);
    setMessage(result.message);
    if (result.hits.length) {
      setHighlightIds(new Set(result.hits.map((r) => r.id)));
      window.setTimeout(() => setHighlightIds(new Set()), 1400);
    }
  };

  const resetDb = () => {
    setRows(cloneSubscribers(INITIAL_SUBSCRIBERS));
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
            <label htmlFor="php-db-id">id (пусто + email = поиск по email)</label>
            <input
              id="php-db-id"
              type="number"
              min="1"
              value={form.id}
              onChange={(e) => setForm((f) => ({...f, id: e.target.value}))}
            />
          </div>
        )}
        {(opId === 'read' || opId === 'create' || opId === 'update') && (
          <>
            <div className={styles.crudField}>
              <label htmlFor="php-db-name">name</label>
              <input
                id="php-db-name"
                value={form.name}
                onChange={(e) => setForm((f) => ({...f, name: e.target.value}))}
              />
            </div>
            <div className={styles.crudField}>
              <label htmlFor="php-db-email">email</label>
              <input
                id="php-db-email"
                value={form.email}
                onChange={(e) => setForm((f) => ({...f, email: e.target.value}))}
              />
            </div>
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

      <SubscribersTable rows={rows} highlightIds={highlightIds} />

      <div className={styles.layout2}>
        <div>
          <span className={styles.panelLabel}>SQL (MySQL)</span>
          <pre className={styles.sqlPanel}>{sql}</pre>
        </div>
        <div>
          <span className={styles.panelLabel}>
            PHP — {ACCESS_LAYERS.find((l) => l.id === layerId)?.label}
          </span>
          <pre className={styles.codePanel}>{phpCode}</pre>
        </div>
      </div>
    </>
  );
}

function LayersMode() {
  const [opId, setOpId] = useState('read');
  const params = {id: 2, name: 'Борис', email: 'boris@example.com'};

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
        Одна операция — три стиля доступа. В продакшене используйте только PDO или mysqli с
        параметрами.
      </p>

      <div className={styles.layerCompare}>
        {ACCESS_LAYERS.map((layer) => (
          <div
            key={layer.id}
            className={clsx(styles.layerCard, layer.id === 'unsafe' && formStyles.unsafeCard)}
          >
            <p className={styles.layerCardTitle}>{layer.label}</p>
            <p className={styles.layerRole} style={{marginBottom: '0.35rem'}}>
              {layer.desc}
            </p>
            <pre>{phpCodeForLayer(layer.id, opId, params)}</pre>
          </div>
        ))}
      </div>

      <p className={styles.panelLabel} style={{marginTop: '0.75rem'}}>
        Итоговый SQL (параметризованный вариант для PDO)
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
        {STACK_LAYERS.filter((l) => l.id !== 'browser').map((layer) => (
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

function PhpDatabasePlayInner({defaultMode = 'form'}) {
  const [mode, setMode] = useState(defaultMode);

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="PHP: форма, PDO и MySQL"
        subtitle="От $_POST до prepare/execute: подключение, CRUD, слои доступа и жизненный цикл PDO"
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

        {mode === 'form' && <FormMode />}
        {mode === 'stack' && (
          <StackMode
            scenarios={[...FORM_FLOW_SCENARIOS, ...PDO_FLOW_SCENARIOS]}
            defaultScenarioId="register"
          />
        )}
        {mode === 'crud' && <CrudMode />}
        {mode === 'layers' && <LayersMode />}
        {mode === 'lifecycle' && <LifecycleMode />}

        <p className={styles.footer}>
          {mode === 'form' &&
            'Браузер отправляет POST; PHP валидирует $_POST и передаёт значения в PDO только как параметры ?. После успеха — PRG (redirect), чтобы F5 не дублировал INSERT.'}
          {mode === 'stack' &&
            'PDO не подставляет строки в SQL: prepare() фиксирует шаблон, execute() передаёт данные отдельно.'}
          {mode === 'crud' &&
            'INSERT с дубликатом email вернёт ошибку UNIQUE — в коде ловите PDOException и показывайте понятное сообщение, не текст исключения.'}
          {mode === 'layers' &&
            'Конкатенация $_POST в SQL — учебный антипример. В реальных проектах — только prepare + execute.'}
          {mode === 'lifecycle' &&
            'ATTR_ERRMODE_EXCEPTION избавляет от проверки каждого вызова вручную; транзакции группируют связанные изменения.'}
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default PhpDatabasePlayInner;
