import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';

import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';


import {
  ACCESS_LAYERS,
  CRUD_OPS,
  INITIAL_ROWS,
  LIFECYCLE_CLASSIC,
  LIFECYCLE_DOTNET,
  OBJECT_STEPS_CLASSIC,
  OBJECT_STEPS_DOTNET,
  PARADIGMS,
  ROW_COLUMNS,
  cloneRows,
  codeForLayer,
  getScenarios,
  getStack,
  runCrud,
  sqlForOp,
} from '@/components/shared/kb/adoDataAccessEngine';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';
import baseStyles from '@/components/demos/JavaDatabasePlay.module.css';
import styles from '@/components/demos/AdoDataAccessPlay.module.css';

const MODES = [
  {id: 'stack', label: 'Стек доступа'},
  {id: 'objects', label: 'Модель объектов'},
  {id: 'crud', label: 'CRUD-лаборатория'},
  {id: 'lifecycle', label: 'Жизненный цикл'},
];

const OBJECT_NODES_CLASSIC = [
  {id: 'connection', label: 'Connection', role: 'Сеанс с источником'},
  {id: 'command', label: 'Command', role: 'SQL / процедура'},
  {id: 'parameter', label: 'Parameter', role: 'Плейсхолдеры'},
  {id: 'recordset', label: 'Recordset', role: 'Курсор строк'},
  {id: 'field', label: 'Field', role: 'Столбец записи'},
];

const OBJECT_NODES_DOTNET = [
  {id: 'connection', label: 'SqlConnection', role: 'Соединение'},
  {id: 'command', label: 'SqlCommand', role: 'Запрос'},
  {id: 'parameter', label: 'SqlParameter', role: 'Параметры'},
  {id: 'reader', label: 'SqlDataReader', role: 'Поток чтения'},
  {id: 'adapter', label: 'SqlDataAdapter', role: 'Fill / Update'},
  {id: 'dataset', label: 'DataSet', role: 'Кэш в памяти'},
];

function RowsTable({rows, highlightIds = new Set()}) {
  return (
    <div className={baseStyles.tableWrap}>
      <table className="it-demo__table">
        <thead>
          <tr>
            {ROW_COLUMNS.map((col) => (
              <th key={col}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={ROW_COLUMNS.length} style={{textAlign: 'center'}}>
                Таблица пуста
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr
                key={row.id}
                className={highlightIds.has(row.id) ? baseStyles.rowHighlight : undefined}
              >
                {ROW_COLUMNS.map((col) => (
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

function ParadigmToggle({paradigm, onChange, disabled}) {
  return (
    <div className={styles.paradigmBar} role="tablist" aria-label="Парадигма доступа">
      {PARADIGMS.map((p) => (
        <button
          key={p.id}
          type="button"
          role="tab"
          aria-selected={paradigm === p.id}
          disabled={disabled}
          className={clsx(styles.paradigmBtn, paradigm === p.id && styles.paradigmBtnActive)}
          onClick={() => onChange(p.id)}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}

function StackMode() {
  const [paradigm, setParadigm] = useState('classic');
  const scenarios = getScenarios(paradigm);
  const stack = getStack(paradigm);
  const [scenarioId, setScenarioId] = useState(scenarios[0]?.id ?? '');
  const [stepIndex, setStepIndex] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [spotlight, setSpotlight] = useState([]);
  const [packet, setPacket] = useState(null);
  const timers = useRef([]);

  useEffect(() => {
    const first = getScenarios(paradigm)[0];
    setScenarioId(first?.id ?? '');
    setStepIndex(-1);
    setSpotlight([]);
    setPacket(null);
    setPlaying(false);
  }, [paradigm]);

  const scenario = scenarios.find((s) => s.id === scenarioId) ?? scenarios[0];
  const currentStep = stepIndex >= 0 ? scenario?.steps[stepIndex] : null;

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  const schedule = useCallback((fn, ms) => {
    const id = setTimeout(fn, ms);
    timers.current.push(id);
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
      const step = scenario?.steps[index];
      if (!step) return;
      setStepIndex(index);
      setSpotlight(step.spotlight);
      setPacket(step.packet ?? null);
    },
    [scenario?.steps],
  );

  const playScenario = useCallback(() => {
    if (!scenario?.steps.length) return;
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
  }, [applyStep, clearTimers, reset, scenario, schedule]);

  const stepManual = (delta) => {
    if (playing || !scenario) return;
    const next = Math.max(0, Math.min(scenario.steps.length - 1, stepIndex + delta));
    applyStep(next);
  };

  const isActive = (layerId) => spotlight.includes(layerId);

  if (!scenario) return null;

  return (
    <>
      <ParadigmToggle paradigm={paradigm} onChange={setParadigm} disabled={playing} />

      <div className={baseStyles.modeTabs} role="tablist" aria-label="Сценарии">
        {scenarios.map((s) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={scenarioId === s.id}
            disabled={playing}
            className={clsx(baseStyles.modeTab, scenarioId === s.id && baseStyles.modeTabActive)}
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

      <p className={baseStyles.stepDetail} style={{textAlign: 'center', marginBottom: '0.75rem'}}>
        <strong>{scenario.title}</strong> — {scenario.subtitle}
      </p>

      <div className={baseStyles.stackDiagram} aria-label="Стек доступа к данным">
        {stack.map((layer, i) => (
          <React.Fragment key={layer.id}>
            {i > 0 && (
              <div className={baseStyles.connector} aria-hidden>
                <span
                  className={clsx(
                    baseStyles.connectorLine,
                    (packet === 'down' || packet === 'request') &&
                      isActive(layer.id) &&
                      baseStyles.connectorPulseDown,
                    packet === 'up' && isActive(layer.id) && baseStyles.connectorPulseUp,
                  )}
                />
                <span className={baseStyles.connectorLabel}>
                  {packet === 'request' ? 'SQL' : packet === 'up' ? 'ответ' : 'вызов'}
                </span>
              </div>
            )}
            <section className={clsx(baseStyles.layer, isActive(layer.id) && baseStyles.layerActive)}>
              <header className={baseStyles.layerHeader}>
                <span className={baseStyles.layerLabel}>{layer.label}</span>
                <span className={baseStyles.layerShort}>{layer.short}</span>
              </header>
              <p className={baseStyles.layerRole}>{layer.role}</p>
            </section>
          </React.Fragment>
        ))}
      </div>

      {currentStep && (
        <div className={baseStyles.stepCard}>
          <span className={baseStyles.stepBadge}>
            Шаг {stepIndex + 1} / {scenario.steps.length}
          </span>
          <p className={baseStyles.stepTitle}>{currentStep.label}</p>
          <p className={baseStyles.stepDetail}>{currentStep.detail}</p>
          {currentStep.code && <pre className={baseStyles.codePanel}>{currentStep.code}</pre>}
        </div>
      )}

      <div className={baseStyles.controls}>
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
    </>
  );
}

function ObjectsMode() {
  const [paradigm, setParadigm] = useState('classic');
  const steps = paradigm === 'classic' ? OBJECT_STEPS_CLASSIC : OBJECT_STEPS_DOTNET;
  const nodes = paradigm === 'classic' ? OBJECT_NODES_CLASSIC : OBJECT_NODES_DOTNET;
  const [stepIdx, setStepIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const step = steps[stepIdx] ?? steps[0];

  useEffect(() => {
    setStepIdx(0);
    setPlaying(false);
  }, [paradigm]);

  useEffect(() => {
    if (!playing) return undefined;
    const id = window.setInterval(() => {
      setStepIdx((i) => {
        if (i >= steps.length - 1) {
          setPlaying(false);
          return 0;
        }
        return i + 1;
      });
    }, 2000);
    return () => clearInterval(id);
  }, [playing, steps.length]);

  return (
    <>
      <ParadigmToggle paradigm={paradigm} onChange={setParadigm} disabled={playing} />

      <div className={styles.objectGrid} aria-label="Объекты модели">
        {nodes.map((node) => (
          <div
            key={node.id}
            className={clsx(
              styles.objectNode,
              step.active?.includes(node.id) && styles.objectNodeActive,
            )}
          >
            <p className={styles.objectNodeLabel}>{node.label}</p>
            <p className={styles.objectNodeRole}>{node.role}</p>
          </div>
        ))}
      </div>

      <div className={baseStyles.stepCard}>
        <span className={baseStyles.stepBadge}>
          Шаг {stepIdx + 1} / {steps.length}
        </span>
        <p className={baseStyles.stepTitle}>{step.label}</p>
        <p className={baseStyles.stepDetail}>{step.detail}</p>
        <pre className={baseStyles.codePanel}>{step.code}</pre>
      </div>

      <div className={baseStyles.controls}>
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
          onClick={() => setStepIdx((i) => Math.min(steps.length - 1, i + 1))}
        >
          →
        </button>
      </div>
    </>
  );
}

function CrudMode() {
  const [rows, setRows] = useState(() => cloneRows(INITIAL_ROWS));
  const [layerId, setLayerId] = useState('adonet');
  const [opId, setOpId] = useState('read');
  const [highlightIds, setHighlightIds] = useState(new Set());
  const [message, setMessage] = useState(null);
  const [form, setForm] = useState({
    id: '2',
    name: 'Dana Lee',
    department: 'Engineering',
  });

  const params = useMemo(
    () => ({
      id: form.id ? Number(form.id) : null,
      name: form.name,
      department: form.department,
    }),
    [form],
  );

  const sql = sqlForOp(opId, params);
  const code = codeForLayer(layerId, opId, params);

  const execute = () => {
    const result = runCrud(rows, opId, params);
    setRows(result.rows);
    setMessage(result.message);
    if (result.result.length) {
      setHighlightIds(new Set(result.result.map((r) => r.id)));
      window.setTimeout(() => setHighlightIds(new Set()), 1400);
    }
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

      <div className={baseStyles.crudToolbar}>
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

      <div className={baseStyles.crudForm}>
        {(opId === 'read' || opId === 'update' || opId === 'delete') && (
          <div className={baseStyles.crudField}>
            <label htmlFor="ado-db-id">id (пусто = department Engineering)</label>
            <input
              id="ado-db-id"
              type="number"
              min="1"
              value={form.id}
              onChange={(e) => setForm((f) => ({...f, id: e.target.value}))}
            />
          </div>
        )}
        {(opId === 'create' || opId === 'update') && (
          <>
            <div className={baseStyles.crudField}>
              <label htmlFor="ado-db-name">name</label>
              <input
                id="ado-db-name"
                value={form.name}
                onChange={(e) => setForm((f) => ({...f, name: e.target.value}))}
              />
            </div>
            <div className={baseStyles.crudField}>
              <label htmlFor="ado-db-dept">department</label>
              <input
                id="ado-db-dept"
                value={form.department}
                onChange={(e) => setForm((f) => ({...f, department: e.target.value}))}
              />
            </div>
          </>
        )}
      </div>

      <div className={baseStyles.controls}>
        <button type="button" className="it-demo__btn it-demo__btn--primary" onClick={execute}>
          Выполнить {CRUD_OPS.find((o) => o.id === opId)?.verb}
        </button>
        <button
          type="button"
          className="it-demo__btn it-demo__btn--secondary"
          onClick={() => {
            setRows(cloneRows(INITIAL_ROWS));
            setMessage(null);
            setHighlightIds(new Set());
          }}
        >
          Сбросить таблицу
        </button>
      </div>

      {message && <p className={baseStyles.messageError}>{message}</p>}

      <RowsTable rows={rows} highlightIds={highlightIds} />

      <div className={baseStyles.layout2}>
        <div>
          <span className={baseStyles.panelLabel}>SQL</span>
          <pre className={baseStyles.sqlPanel}>{sql}</pre>
        </div>
        <div>
          <span className={baseStyles.panelLabel}>
            Код — {ACCESS_LAYERS.find((l) => l.id === layerId)?.label}
          </span>
          <pre className={baseStyles.codePanel}>{code}</pre>
        </div>
      </div>
    </>
  );
}

function LifecycleMode() {
  const [paradigm, setParadigm] = useState('classic');
  const steps = paradigm === 'classic' ? LIFECYCLE_CLASSIC : LIFECYCLE_DOTNET;
  const stack = getStack(paradigm);
  const [stepIdx, setStepIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const step = steps[stepIdx] ?? steps[0];

  useEffect(() => {
    setStepIdx(0);
    setPlaying(false);
  }, [paradigm]);

  useEffect(() => {
    if (!playing) return undefined;
    const id = window.setInterval(() => {
      setStepIdx((i) => {
        if (i >= steps.length - 1) {
          setPlaying(false);
          return 0;
        }
        return i + 1;
      });
    }, 1800);
    return () => clearInterval(id);
  }, [playing, steps.length]);

  return (
    <>
      <ParadigmToggle paradigm={paradigm} onChange={setParadigm} disabled={playing} />

      <div className={baseStyles.lifecycleList}>
        {steps.map((s, i) => (
          <button
            key={s.id}
            type="button"
            className={clsx(baseStyles.lifecycleStep, i === stepIdx && baseStyles.lifecycleStepOn)}
            onClick={() => {
              setPlaying(false);
              setStepIdx(i);
            }}
          >
            <span className={baseStyles.lifecycleNum}>{i + 1}</span>
            <span className={baseStyles.lifecycleBody}>
              <p className={baseStyles.lifecycleTitle}>{s.label}</p>
              <p className={baseStyles.lifecycleDetail}>{s.detail}</p>
            </span>
          </button>
        ))}
      </div>

      <pre className={baseStyles.codePanel}>{step.code}</pre>

      <div className={baseStyles.controls}>
        <button
          type="button"
          className="it-demo__btn it-demo__btn--primary"
          onClick={() => setPlaying((p) => !p)}
        >
          {playing ? 'Пауза' : '▶ Автопрокрутка'}
        </button>
      </div>

      <div className={baseStyles.stackDiagram} style={{marginTop: '0.75rem'}}>
        {stack.map((layer) => (
          <section
            key={layer.id}
            className={clsx(
              baseStyles.layer,
              step.layers?.includes(layer.id) && baseStyles.layerActive,
            )}
            style={{marginBottom: '0.35rem'}}
          >
            <span className={baseStyles.layerLabel}>{layer.label}</span>
          </section>
        ))}
      </div>
    </>
  );
}

function AdoDataAccessPlayInner() {
  const [mode, setMode] = useState('stack');

  return (
    <DemoShell className={baseStyles.root}>
      <DemoCard
        title="ADO и ADO.NET"
        subtitle="От COM Recordset до SqlDataReader и DataSet: подключение, объекты, CRUD"
      >
        <div className={baseStyles.modeTabs} role="tablist" aria-label="Режимы демо">
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              role="tab"
              aria-selected={mode === m.id}
              className={clsx(baseStyles.modeTab, mode === m.id && baseStyles.modeTabActive)}
              onClick={() => setMode(m.id)}
            >
              {m.label}
            </button>
          ))}
        </div>

        {mode === 'stack' && <StackMode />}
        {mode === 'objects' && <ObjectsMode />}
        {mode === 'crud' && <CrudMode />}
        {mode === 'lifecycle' && <LifecycleMode />}

        <p className={baseStyles.footer}>
          {mode === 'stack' &&
            'Классический ADO идёт через OLE DB; ADO.NET — нативный managed-стек без COM Recordset.'}
          {mode === 'objects' &&
            'Connection + Command — общая идея; Recordset сменился на DataReader и DataSet.'}
          {mode === 'crud' &&
            'Параметризованные запросы обязательны в обеих моделях — защита от SQL-инъекций.'}
          {mode === 'lifecycle' &&
            'В .NET предпочитайте using и async; в legacy ADO — явный Close и Set obj = Nothing.'}
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default AdoDataAccessPlayInner;
