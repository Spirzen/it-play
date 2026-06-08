import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  ACCESS_STYLES,
  CRUD_OPS,
  DEMO_DOC_LINES,
  FLOW_SCENARIOS,
  INITIAL_NOMENCLATURE,
  INITIAL_STOCK,
  METADATA_OBJECTS,
  NOMENCLATURE_COLUMNS,
  STORAGE_MODES,
  TRANSACTION_STEPS,
  bslForStyle,
  cloneNomenclature,
  queryTextForFilter,
  runCrud,
  runQuery,
  rowToTable,
  simulatePostDocument,
  sqlForOp,
} from '@/components/shared/kb/oneCDatabaseEngine';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';
import styles from '@/components/demos/JavaDatabasePlay.module.css';
import oneCStyles from '@/components/demos/OneCDatabasePlay.module.css';

const MODES = [
  {id: 'storage', label: 'Режим хранения'},
  {id: 'stack', label: 'Поток данных'},
  {id: 'objects', label: 'Объекты метаданных'},
  {id: 'crud', label: 'CRUD-лаборатория'},
  {id: 'query', label: 'Язык запросов'},
  {id: 'transaction', label: 'Транзакции'},
];

function NomenclatureTable({rows, highlightRefs = new Set()}) {
  return (
    <div className={styles.tableWrap}>
      <table className="it-demo__table">
        <thead>
          <tr>
            {NOMENCLATURE_COLUMNS.map((col) => (
              <th key={col}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={NOMENCLATURE_COLUMNS.length} style={{textAlign: 'center'}}>
                Нет записей по условию запроса
              </td>
            </tr>
          ) : (
            rows.map((row) => {
              const t = rowToTable(row);
              return (
                <tr
                  key={row.ref}
                  className={highlightRefs.has(row.ref) ? styles.rowHighlight : undefined}
                >
                  {NOMENCLATURE_COLUMNS.map((col) => (
                    <td key={col}>{t[col]}</td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

function StockTable({rows}) {
  return (
    <div className={clsx(styles.tableWrap, oneCStyles.stockTable)}>
      <table className="it-demo__table">
        <thead>
          <tr>
            <th>Склад</th>
            <th>Номенклатура</th>
            <th>Остаток</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={`${r.warehouse}-${r.item}`}>
              <td>{r.warehouse}</td>
              <td>{r.item}</td>
              <td>{r.qty}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StackDiagram({layers, spotlight, packet}) {
  const isActive = (id) => spotlight.includes(id);
  return (
    <div className={styles.stackDiagram} aria-label="Стек доступа к данным 1С">
      {layers.map((layer, i) => (
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
                {packet === 'request' ? 'SQL / IO' : packet === 'up' ? 'ответ' : 'запрос'}
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
  );
}

function StorageMode() {
  const [storageId, setStorageId] = useState('server');
  const mode = STORAGE_MODES[storageId];
  return (
    <>
      <div className={oneCStyles.storageToggle} role="tablist" aria-label="Режим хранения">
        {Object.values(STORAGE_MODES).map((m) => (
          <button
            key={m.id}
            type="button"
            role="tab"
            aria-selected={storageId === m.id}
            className={clsx(oneCStyles.storageBtn, storageId === m.id && oneCStyles.storageBtnActive)}
            onClick={() => setStorageId(m.id)}
          >
            {m.label}
          </button>
        ))}
      </div>
      <p className={styles.stepDetail} style={{textAlign: 'center', marginBottom: '0.65rem'}}>
        <strong>{mode.label}</strong> — {mode.subtitle}
      </p>
      <StackDiagram layers={mode.layers} spotlight={mode.layers.map((l) => l.id)} packet="down" />
      <p className={styles.stepDetail} style={{marginTop: '0.5rem'}}>
        {storageId === 'file'
          ? 'Один пользователь или тестовая база: защита через права ОС на файл. Транзакции эмулируются платформой.'
          : 'Масштабирование и резервное копирование — на стороне СУБД; сервер 1С держит сеансы и бизнес-логику.'}
      </p>
    </>
  );
}

function StackMode() {
  const [storageFilter, setStorageFilter] = useState('all');
  const scenarios = useMemo(() => {
    if (storageFilter === 'all') return FLOW_SCENARIOS;
    return FLOW_SCENARIOS.filter((s) => s.storage === storageFilter);
  }, [storageFilter]);
  const [scenarioId, setScenarioId] = useState(scenarios[0]?.id ?? '');
  const [stepIndex, setStepIndex] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [spotlight, setSpotlight] = useState([]);
  const [packet, setPacket] = useState(null);
  const timers = useRef([]);

  useEffect(() => {
    const first = scenarios[0];
    setScenarioId(first?.id ?? '');
    setStepIndex(-1);
    setSpotlight([]);
    setPacket(null);
    setPlaying(false);
  }, [storageFilter, scenarios]);

  const scenario = scenarios.find((s) => s.id === scenarioId) ?? scenarios[0];
  const layers = STORAGE_MODES[scenario?.storage ?? 'server']?.layers ?? [];

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
    if (!scenario) return;
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

  const currentStep = stepIndex >= 0 ? scenario?.steps[stepIndex] : null;

  return (
    <>
      <div className={oneCStyles.storageToggle}>
        {[
          {id: 'all', label: 'Все'},
          {id: 'server', label: 'Клиент–сервер'},
          {id: 'file', label: 'Файл'},
        ].map((f) => (
          <button
            key={f.id}
            type="button"
            className={clsx(oneCStyles.storageBtn, storageFilter === f.id && oneCStyles.storageBtnActive)}
            onClick={() => {
              setStorageFilter(f.id);
              reset();
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className={styles.modeTabs} role="tablist">
        {scenarios.map((s) => (
          <button
            key={s.id}
            type="button"
            className={clsx(styles.modeTab, scenarioId === s.id && styles.modeTabActive)}
            disabled={playing}
            onClick={() => {
              setScenarioId(s.id);
              reset();
            }}
          >
            {s.title}
          </button>
        ))}
      </div>

      {scenario && (
        <p className={styles.stepDetail} style={{textAlign: 'center', marginBottom: '0.65rem'}}>
          {scenario.subtitle}
        </p>
      )}

      <StackDiagram layers={layers} spotlight={spotlight} packet={packet} />

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
          disabled={playing || !scenario}
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
          disabled={playing || stepIndex >= (scenario?.steps.length ?? 1) - 1}
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
  const [activeId, setActiveId] = useState('catalog');
  const obj = METADATA_OBJECTS.find((o) => o.id === activeId) ?? METADATA_OBJECTS[0];
  return (
    <>
      <div className={oneCStyles.objectGrid}>
        {METADATA_OBJECTS.map((o) => (
          <button
            key={o.id}
            type="button"
            className={clsx(oneCStyles.objectCard, activeId === o.id && oneCStyles.objectCardActive)}
            onClick={() => setActiveId(o.id)}
          >
            <div className={oneCStyles.objectIcon}>{o.icon}</div>
            <p className={oneCStyles.objectTitle}>{o.label}</p>
            <p className={oneCStyles.objectRole}>{o.role}</p>
          </button>
        ))}
      </div>
      <div className={oneCStyles.metaDetail}>
        <p className={styles.stepTitle}>{obj.sample}</p>
        <p className={styles.stepDetail}>{obj.role}</p>
        <div className={oneCStyles.metaFields}>
          {obj.fields.map((f) => (
            <span key={f} className={oneCStyles.metaChip}>
              {f}
            </span>
          ))}
        </div>
        <pre className={styles.codePanel}>{obj.bsl}</pre>
      </div>
      {activeId === 'catalog' && <NomenclatureTable rows={INITIAL_NOMENCLATURE} />}
      {activeId === 'accReg' && <StockTable rows={INITIAL_STOCK} />}
    </>
  );
}

function CrudMode() {
  const [rows, setRows] = useState(() => cloneNomenclature(INITIAL_NOMENCLATURE));
  const [styleId, setStyleId] = useState('manager');
  const [opId, setOpId] = useState('read');
  const [storageId, setStorageId] = useState('server');
  const [highlightRefs, setHighlightRefs] = useState(new Set());
  const [message, setMessage] = useState(null);
  const [form, setForm] = useState({
    ref: 'r1',
    code: '000001',
    name: 'Ноутбук',
    article: 'NB-15',
    activeOnly: true,
  });

  const params = useMemo(
    () => ({
      ref: form.ref,
      code: form.code,
      name: form.name,
      article: form.article,
      activeOnly: form.activeOnly,
    }),
    [form],
  );

  const execute = () => {
    const result = runCrud(rows, opId, params);
    setRows(result.rows);
    setMessage(result.message);
    if (result.hits.length) {
      setHighlightRefs(new Set(result.hits.map((r) => r.ref)));
      window.setTimeout(() => setHighlightRefs(new Set()), 1400);
    }
  };

  return (
    <>
      <div className={oneCStyles.storageToggle}>
        {Object.values(STORAGE_MODES).map((m) => (
          <button
            key={m.id}
            type="button"
            className={clsx(oneCStyles.storageBtn, storageId === m.id && oneCStyles.storageBtnActive)}
            onClick={() => setStorageId(m.id)}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className={toolStyles.chips} style={{marginBottom: '0.5rem'}}>
        {ACCESS_STYLES.map((l) => (
          <button
            key={l.id}
            type="button"
            className={clsx(toolStyles.chip, styleId === l.id && toolStyles.chipActive)}
            onClick={() => setStyleId(l.id)}
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
            <label htmlFor="1c-db-ref">ref (для update/delete)</label>
            <select
              id="1c-db-ref"
              value={form.ref}
              onChange={(e) => {
                const ref = e.target.value;
                const row = rows.find((r) => r.ref === ref);
                setForm((f) => ({
                  ...f,
                  ref,
                  code: row?.code ?? f.code,
                  name: row?.name ?? f.name,
                  article: row?.article ?? f.article,
                }));
              }}
            >
              {rows.map((r) => (
                <option key={r.ref} value={r.ref}>
                  {r.code} — {r.name}
                </option>
              ))}
            </select>
          </div>
        )}
        {(opId === 'read' || opId === 'create' || opId === 'update') && (
          <>
            <div className={styles.crudField}>
              <label htmlFor="1c-db-code">Код</label>
              <input
                id="1c-db-code"
                value={form.code}
                onChange={(e) => setForm((f) => ({...f, code: e.target.value}))}
              />
            </div>
            <div className={styles.crudField}>
              <label htmlFor="1c-db-name">Наименование / фильтр</label>
              <input
                id="1c-db-name"
                value={form.name}
                onChange={(e) => setForm((f) => ({...f, name: e.target.value}))}
              />
            </div>
            <div className={styles.crudField}>
              <label htmlFor="1c-db-article">Артикул</label>
              <input
                id="1c-db-article"
                value={form.article}
                onChange={(e) => setForm((f) => ({...f, article: e.target.value}))}
              />
            </div>
          </>
        )}
        {opId === 'read' && (
          <label className={styles.crudField} style={{flexDirection: 'row', alignItems: 'center', gap: '0.4rem'}}>
            <input
              type="checkbox"
              checked={form.activeOnly}
              onChange={(e) => setForm((f) => ({...f, activeOnly: e.target.checked}))}
            />
            Только активные
          </label>
        )}
      </div>

      <div className={styles.controls}>
        <button type="button" className="it-demo__btn it-demo__btn--primary" onClick={execute}>
          {CRUD_OPS.find((o) => o.id === opId)?.verb}
        </button>
        <button
          type="button"
          className="it-demo__btn it-demo__btn--secondary"
          onClick={() => {
            setRows(cloneNomenclature(INITIAL_NOMENCLATURE));
            setMessage(null);
            setHighlightRefs(new Set());
          }}
        >
          Сбросить справочник
        </button>
      </div>

      {message && <p className={styles.messageError}>{message}</p>}

      <NomenclatureTable rows={rows} highlightRefs={highlightRefs} />

      <div className={styles.layout2}>
        <div>
          <span className={styles.panelLabel}>BSL — {ACCESS_STYLES.find((s) => s.id === styleId)?.label}</span>
          <pre className={styles.codePanel}>{bslForStyle(styleId, opId, params)}</pre>
        </div>
        <div>
          <span className={styles.panelLabel}>
            {storageId === 'server' ? 'SQL (СУБД, упрощённо)' : 'Файл .1CD'}
          </span>
          <pre className={styles.sqlPanel}>{sqlForOp(opId, params, storageId)}</pre>
        </div>
      </div>
    </>
  );
}

function QueryMode() {
  const [rows] = useState(() => cloneNomenclature(INITIAL_NOMENCLATURE));
  const [activeOnly, setActiveOnly] = useState(true);
  const [nameContains, setNameContains] = useState('');
  const result = useMemo(
    () => runQuery(rows, {activeOnly, nameContains}),
    [rows, activeOnly, nameContains],
  );
  const queryText = queryTextForFilter({activeOnly, nameContains});

  return (
    <>
      <p className={styles.stepDetail} style={{textAlign: 'center'}}>
        Измените условия — текст запроса и таблица результата обновятся сразу.
      </p>
      <div className={styles.crudForm}>
        <label className={styles.crudField} style={{flexDirection: 'row', alignItems: 'center', gap: '0.4rem'}}>
          <input
            type="checkbox"
            checked={activeOnly}
            onChange={(e) => setActiveOnly(e.target.checked)}
          />
          ГДЕ Активность = ИСТИНА
        </label>
        <div className={styles.crudField}>
          <label htmlFor="1c-q-name">ПОДОБНО в наименовании</label>
          <input
            id="1c-q-name"
            placeholder="например: монитор"
            value={nameContains}
            onChange={(e) => setNameContains(e.target.value)}
          />
        </div>
      </div>
      <pre className={styles.codePanel}>{queryText}</pre>
      <p className={styles.panelLabel}>Результат ({result.length} строк)</p>
      <NomenclatureTable rows={result} />
      <pre className={styles.codePanel} style={{marginTop: '0.65rem'}}>
        {`Запрос = Новый Запрос;
Запрос.Текст =
"${queryText.replace(/"/g, '""')}";
Результат = Запрос.Выполнить();
Выборка = Результат.Выбрать();`}
      </pre>
    </>
  );
}

function TransactionMode() {
  const [stepIdx, setStepIdx] = useState(0);
  const [stock, setStock] = useState(() => [...INITIAL_STOCK]);
  const [committed, setCommitted] = useState(false);
  const [locked, setLocked] = useState(false);
  const step = TRANSACTION_STEPS[stepIdx] ?? TRANSACTION_STEPS[0];

  const applyStep = (idx) => {
    setStepIdx(idx);
    const s = TRANSACTION_STEPS[idx];
    if (s?.id === 'begin') {
      setLocked(true);
      setCommitted(false);
    }
    if (s?.id === 'commit') {
      setStock(simulatePostDocument(stock, DEMO_DOC_LINES));
      setCommitted(true);
      setLocked(false);
    }
    if (s?.id === 'rollback') {
      setCommitted(false);
      setLocked(false);
    }
  };

  return (
    <>
      <div className={oneCStyles.txTimeline}>
        {TRANSACTION_STEPS.map((s, i) => (
          <button
            key={s.id}
            type="button"
            className={clsx(
              oneCStyles.txStep,
              i === stepIdx && oneCStyles.txStepOn,
              i < stepIdx && s.state === 'done' && oneCStyles.txStepDone,
              s.state === 'rollback' && oneCStyles.txStepRollback,
            )}
            onClick={() => applyStep(i)}
          >
            <span className={oneCStyles.txNum}>{i + 1}</span>
            <span>
              <p className={styles.lifecycleTitle}>{s.label}</p>
              <p className={styles.lifecycleDetail}>{s.detail}</p>
            </span>
          </button>
        ))}
      </div>

      <p className={styles.stepDetail}>
        Блокировки:
        {locked ? (
          <span className={oneCStyles.lockBadge}>запись заблокирована</span>
        ) : (
          <span className={clsx(oneCStyles.lockBadge, oneCStyles.lockBadgeOk)}>свободно</span>
        )}
        {committed && (
          <span className={clsx(oneCStyles.lockBadge, oneCStyles.lockBadgeOk)} style={{marginLeft: '0.35rem'}}>
            транзакция зафиксирована
          </span>
        )}
      </p>

      <pre className={styles.codePanel}>{step.code}</pre>

      <p className={styles.panelLabel}>Регистр накопления "ОстаткиТоваров" (до/после проведения)</p>
      <StockTable rows={stock} />

      <div className={styles.controls}>
        <button
          type="button"
          className="it-demo__btn it-demo__btn--secondary"
          onClick={() => {
            setStock([...INITIAL_STOCK]);
            setCommitted(false);
            setLocked(false);
            setStepIdx(0);
          }}
        >
          Сбросить остатки
        </button>
      </div>
    </>
  );
}

function OneCDatabasePlayInner({defaultMode = 'storage'}) {
  const [mode, setMode] = useState(defaultMode);

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="1С: база данных, запросы и CRUD"
        subtitle="Файл .1CD и клиент–сервер, объектная модель, язык запросов, доступ к данным и транзакции"
      >
        <div className={oneCStyles.accentBar} aria-hidden />
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

        {mode === 'storage' && <StorageMode />}
        {mode === 'stack' && <StackMode />}
        {mode === 'objects' && <ObjectsMode />}
        {mode === 'crud' && <CrudMode />}
        {mode === 'query' && <QueryMode />}
        {mode === 'transaction' && <TransactionMode />}

        <p className={styles.footer}>
          {mode === 'storage' &&
            'Метаданные конфигурации описывают структуру; данные — экземпляры справочников, документов и записей регистров.'}
          {mode === 'stack' &&
            'Разработчик пишет на BSL; платформа преобразует запросы в SQL (в серверном режиме) или работает с файлом напрямую.'}
          {mode === 'objects' &&
            'Справочники — постоянные сущности, документы — события во времени, регистры — срезы и остатки.'}
          {mode === 'crud' &&
            'В прикладном коде чаще менеджеры объектов (СоздатьЭлемент, Записать); язык запросов — для выборок и отчётов.'}
          {mode === 'query' &&
            'Параметры &Имя в тексте запроса безопаснее конкатенации строк; индексы ускоряют поля в ГДЕ и ГРУППИРОВКА ПО.'}
          {mode === 'transaction' &&
            'Проведение документа и движения регистра — одна транзакция: при ошибке ОтменитьТранзакцию() откатывает всё.'}
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default OneCDatabasePlayInner;
