import React, {useCallback, useEffect, useRef, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import styles from '@/components/demos/MarshalingDemo.module.css';

const SAMPLE_OBJECT = {
  type: 'User',
  fields: [
    {name: 'id', type: 'number', value: 42},
    {name: 'name', type: 'string', value: 'Анна'},
    {name: 'email', type: 'string', value: 'anna@example.com'},
    {name: 'tags', type: 'string[]', value: ['admin', 'beta']},
  ],
};

const VALID_JSON = JSON.stringify(
  {
    id: 42,
    name: 'Анна',
    email: 'anna@example.com',
    tags: ['admin', 'beta'],
  },
  null,
  2,
);

const BROKEN_JSON = `{
  "id": 42,
  "name": "Анна",
  "email": "anna@example.com",
  "tags": ["admin", "beta"
}`;

const STEPS = [
  {
    id: 'marshal',
    label: 'Маршалинг',
    desc: 'Объект в памяти отправителя преобразуется в универсальный текст JSON — без указателей и служебных полей среды выполнения.',
    duration: 2200,
    activePanel: 'sender',
    log: 'JSON.stringify(user) → поток байтов UTF-8',
  },
  {
    id: 'transfer',
    label: 'Передача',
    desc: 'Самодостаточный пакет уходит по сети, в очередь или в файл. Получатель пока не знает внутреннего устройства отправителя.',
    duration: 1800,
    activePanel: 'wire',
    log: '→ HTTP body / Kafka message / savegame.dat',
  },
  {
    id: 'unmarshal',
    label: 'Анмаршалинг',
    desc: 'Получатель читает JSON, проверяет структуру и создаёт свой экземпляр объекта в памяти — уже в формате своей программы.',
    duration: 2200,
    activePanel: 'receiver',
    log: 'JSON.parse(payload) → new User(...)',
  },
];

const TOTAL_DURATION = STEPS.reduce((sum, s) => sum + s.duration, 0);

function formatValue(value, type) {
  if (type === 'string') {
    return `"${value}"`;
  }
  if (type === 'string[]') {
    return `[${value.map((v) => `"${v}"`).join(', ')}]`;
  }
  return String(value);
}

function ObjectView({object}) {
  return (
    <div className={styles.panelBody}>
      <div>
        <span className={styles.typeName}>{object.type}</span>
        {' {'}
      </div>
      {object.fields.map((field) => (
        <div key={field.name} className={styles.field}>
          <span className={styles.fieldName}>{field.name}</span>
          <span className={styles.fieldType}> ({field.type})</span>
          {': '}
          <span className={styles.fieldValue}>{formatValue(field.value, field.type)}</span>
        </div>
      ))}
      <div>{'}'}</div>
    </div>
  );
}

function ReceiverPanel({stageIndex, phase, unmarshalError}) {
  if (unmarshalError) {
    return (
      <div className={styles.panelBody}>
        <p className={styles.errorText}>
          <strong>Ошибка анмаршалинга</strong>
          <br />
          {unmarshalError}
        </p>
      </div>
    );
  }

  if (phase === 'done' || (stageIndex === 2 && phase === 'running')) {
    if (phase === 'done') {
      return <ObjectView object={SAMPLE_OBJECT} />;
    }
    return (
      <div className={styles.panelBody}>
        <p className={styles.receiverEmpty}>Восстановление…</p>
      </div>
    );
  }

  return (
    <div className={styles.panelBody}>
      <p className={styles.receiverEmpty}>Объект появится после анмаршалинга</p>
    </div>
  );
}

function MarshalingDemoInner() {
  const [phase, setPhase] = useState('idle');
  const [stageIndex, setStageIndex] = useState(-1);
  const [progress, setProgress] = useState(0);
  const [logEntries, setLogEntries] = useState([]);
  const [corruptWire, setCorruptWire] = useState(false);
  const [unmarshalError, setUnmarshalError] = useState(null);
  const timersRef = useRef([]);
  const progressIntervalRef = useRef(null);

  const wireText = corruptWire ? BROKEN_JSON : VALID_JSON;
  const currentStep = stageIndex >= 0 ? STEPS[stageIndex] : null;
  const showWire = stageIndex >= 0;

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
    if (progressIntervalRef.current != null) {
      window.clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, []);

  const addLog = useCallback((message) => {
    const time = new Date().toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    setLogEntries((prev) => [{id: `${Date.now()}-${prev.length}`, time, message}, ...prev].slice(0, 8));
  }, []);

  const reset = useCallback(() => {
    clearTimers();
    setPhase('idle');
    setStageIndex(-1);
    setProgress(0);
    setLogEntries([]);
    setUnmarshalError(null);
  }, [clearTimers]);

  const startAnimation = useCallback(() => {
    clearTimers();
    setPhase('running');
    setStageIndex(0);
    setProgress(0);
    setLogEntries([]);
    setUnmarshalError(null);
    addLog(STEPS[0].log);

    let elapsed = 0;
    STEPS.forEach((step, index) => {
      if (index > 0) {
        const stageStart = elapsed;
        timersRef.current.push(
          window.setTimeout(() => {
            setStageIndex(index);
            addLog(step.log);
            if (index === 2 && corruptWire) {
              setUnmarshalError('SyntaxError: Unexpected end of JSON input');
            }
          }, stageStart),
        );
      }
      elapsed += step.duration;
    });

    progressIntervalRef.current = window.setInterval(() => {
      setProgress((prev) => Math.min(prev + 2, 100));
    }, TOTAL_DURATION / 50);

    timersRef.current.push(
      window.setTimeout(() => {
        if (progressIntervalRef.current != null) {
          window.clearInterval(progressIntervalRef.current);
          progressIntervalRef.current = null;
        }
        setProgress(100);
        setPhase('done');
        if (!corruptWire) {
          addLog('Объект восстановлен — типы и поля совпадают с контрактом API');
        } else {
          addLog('Анмаршалинг прерван: формат повреждён или не соответствует схеме');
        }
      }, TOTAL_DURATION),
    );
  }, [addLog, clearTimers, corruptWire]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const panelClass = (role) =>
    clsx(styles.panel, {
      [styles.panelIdle]: phase === 'idle',
      [styles.panelSenderActive]: currentStep?.activePanel === 'sender' && role === 'sender',
      [styles.panelWireActive]: currentStep?.activePanel === 'wire' && role === 'wire',
      [styles.panelReceiverActive]:
        currentStep?.activePanel === 'receiver' && role === 'receiver' && !unmarshalError,
      [styles.panelError]: role === 'receiver' && unmarshalError,
    });

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Маршалинг и анмаршалинг"
        subtitle="Как объект в памяти превращается в поток данных и обратно"
      >
        <div className={styles.stepBar} aria-label="Этапы">
          {STEPS.map((step, index) => (
            <span
              key={step.id}
              className={clsx(styles.stepChip, {
                [styles.stepChipActive]: stageIndex === index && phase === 'running',
                [styles.stepChipDone]: stageIndex > index || phase === 'done',
              })}
            >
              {index + 1}. {step.label}
            </span>
          ))}
        </div>

        <p className={styles.desc}>
          {phase === 'idle'
            ? 'Нажмите "Запустить", чтобы пройти путь от объекта в памяти отправителя до копии у получателя.'
            : currentStep?.desc ?? 'Готово — можно повторить сценарий или включить повреждённый JSON.'}
        </p>

        <div className={styles.panels}>
          <div className={panelClass('sender')}>
            <div className={styles.panelHead}>Память отправителя</div>
            <ObjectView object={SAMPLE_OBJECT} />
          </div>

          <div className={styles.connector} aria-hidden>
            <span
              className={clsx(styles.connectorArrow, {
                [styles.connectorArrowActive]: currentStep?.activePanel === 'sender',
              })}
            >
              →
            </span>
            {currentStep?.id === 'transfer' && <span className={clsx(styles.packet, styles.packetVisible)} />}
            <span
              className={clsx(styles.connectorArrow, {
                [styles.connectorArrowActive]: currentStep?.activePanel === 'wire',
              })}
            >
              →
            </span>
          </div>

          <div className={panelClass('wire')}>
            <div className={styles.panelHead}>Поток данных (JSON)</div>
            <div className={styles.panelBody}>
              {!showWire ? (
                <p className={styles.wireEmpty}>Здесь появится результат маршалинга</p>
              ) : (
                <pre className={styles.wireJson}>{wireText}</pre>
              )}
            </div>
          </div>

          <div className={styles.connector} aria-hidden>
            <span
              className={clsx(styles.connectorArrow, {
                [styles.connectorArrowActive]: currentStep?.activePanel === 'wire',
              })}
            >
              →
            </span>
            {currentStep?.id === 'unmarshal' && <span className={clsx(styles.packet, styles.packetVisible)} />}
            <span
              className={clsx(styles.connectorArrow, {
                [styles.connectorArrowActive]: currentStep?.activePanel === 'receiver',
              })}
            >
              →
            </span>
          </div>

          <div className={panelClass('receiver')}>
            <div className={styles.panelHead}>Память получателя</div>
            <ReceiverPanel stageIndex={stageIndex} phase={phase} unmarshalError={unmarshalError} />
          </div>
        </div>

        <div className={styles.options}>
          <label className={styles.optionLabel}>
            <input
              type="checkbox"
              checked={corruptWire}
              disabled={phase === 'running'}
              onChange={(e) => {
                setCorruptWire(e.target.checked);
                if (phase === 'idle') {
                  setUnmarshalError(null);
                }
              }}
            />
            Повреждённый JSON на линии передачи
          </label>
        </div>

        {phase === 'running' && (
          <div
            className="it-demo__progress"
            style={{marginBottom: '0.75rem'}}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div className="it-demo__progress-bar" style={{width: `${progress}%`}} />
          </div>
        )}

        {logEntries.length > 0 && (
          <div style={{marginTop: '0.5rem'}}>
            <p className={styles.logTitle}>Журнал</p>
            <div className="it-demo__log" role="log" aria-live="polite">
              {logEntries.map((entry) => (
                <div key={entry.id} className="it-demo__log-entry">
                  <span className={styles.logTime}>[{entry.time}]</span>
                  {entry.message}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className={clsx('it-demo__row', styles.controls)} style={{marginTop: '1rem'}}>
          {phase !== 'running' && (
            <button
              type="button"
              className="it-demo__btn it-demo__btn--primary"
              onClick={startAnimation}
            >
              {phase === 'done' ? 'Повторить' : 'Запустить'}
            </button>
          )}
          {phase === 'running' && (
            <span className="it-demo__badge it-demo__badge--active">Выполняется…</span>
          )}
          {phase === 'done' && !unmarshalError && (
            <span className="it-demo__badge it-demo__badge--active">Объект восстановлен</span>
          )}
          {phase === 'done' && unmarshalError && (
            <span className={styles.errorBadge}>Ошибка формата</span>
          )}
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default MarshalingDemoInner;
