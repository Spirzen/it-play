import React, {useState, useRef, useEffect, useCallback, useMemo} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import flowStyles from '@/components/shared/kb/interactionDemo.module.css';

const STAGES = [
  {
    id: 'trigger',
    label: 'Событие',
    duration: 900,
    desc: 'Источник генерирует доменное событие — например, "Заказ создан".',
    log: '⚡ OrderCreated { id: 1042, total: 4990 }',
    active: ['source'],
  },
  {
    id: 'publish',
    label: 'Публикация',
    duration: 1100,
    desc: 'Событие попадает в шину (Kafka, RabbitMQ, EventBridge) — издатель не знает подписчиков.',
    log: '→ topic: orders.events — partition 3',
    active: ['source', 'bus'],
  },
  {
    id: 'react_a',
    label: 'Подписчик А',
    duration: 1600,
    desc: 'Сервис склада реагирует независимо: резервирует товар.',
    log: '◀ Warehouse: reserveStock(1042)',
    active: ['bus', 'subA'],
  },
  {
    id: 'react_b',
    label: 'Подписчик Б',
    duration: 1600,
    desc: 'Сервис уведомлений тоже получил событие — отправляет email.',
    log: '◀ Notify: sendEmail(user@example.com)',
    active: ['bus', 'subB'],
  },
];

const TOTAL_DURATION = STAGES.reduce((sum, s) => sum + s.duration, 0);

function formatTime(date) {
  return date.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    fractionalSecondDigits: 3,
  });
}

function ReactiveInteractionInner() {
  const [phase, setPhase] = useState('idle');
  const [stageIndex, setStageIndex] = useState(-1);
  const [progress, setProgress] = useState(0);
  const [logEntries, setLogEntries] = useState([]);

  const timerRef = useRef(null);
  const progressRef = useRef(null);
  const startTimeRef = useRef(0);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (progressRef.current) {
      clearInterval(progressRef.current);
      progressRef.current = null;
    }
  }, []);

  const appendLog = useCallback((message) => {
    setLogEntries((prev) => [
      {id: `${Date.now()}-${prev.length}`, time: formatTime(new Date()), message},
      ...prev,
    ].slice(0, 8));
  }, []);

  const reset = useCallback(() => {
    clearTimer();
    setPhase('idle');
    setStageIndex(-1);
    setProgress(0);
    setLogEntries([]);
  }, [clearTimer]);

  const startAnimation = useCallback(() => {
    if (phase === 'running') return;

    clearTimer();
    setPhase('running');
    setStageIndex(0);
    setProgress(0);
    setLogEntries([]);
    startTimeRef.current = Date.now();
    appendLog('Генерация события');

    let currentIndex = 0;

    const runStage = () => {
      if (currentIndex >= STAGES.length) {
        clearTimer();
        setPhase('done');
        setStageIndex(STAGES.length - 1);
        setProgress(100);
        appendLog('✓ Все подписчики обработали событие');
        return;
      }

      const stage = STAGES[currentIndex];
      setStageIndex(currentIndex);
      appendLog(stage.log);

      timerRef.current = setTimeout(() => {
        currentIndex += 1;
        runStage();
      }, stage.duration);
    };

    progressRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      setProgress(Math.min(100, Math.round((elapsed / TOTAL_DURATION) * 100)));
    }, 80);

    runStage();
  }, [phase, clearTimer, appendLog]);

  useEffect(() => () => clearTimer(), [clearTimer]);

  const currentStage = stageIndex >= 0 ? STAGES[stageIndex] : null;
  const isRunning = phase === 'running';

  const activeSet = useMemo(() => {
    if (!currentStage) return new Set();
    return new Set(currentStage.active);
  }, [currentStage]);

  const stepClass = (index) =>
    clsx('it-demo__step', {
      'it-demo__step--active': isRunning && stageIndex === index,
      'it-demo__step--done':
        (isRunning && stageIndex > index) || (phase === 'done' && index < STAGES.length),
    });

  return (
    <DemoShell className={flowStyles.root}>
      <DemoCard
        title="Реактивное взаимодействие"
        subtitle="Event-Driven: издатель публикует событие, подписчики реагируют независимо."
      >
        <div
          className={clsx(flowStyles.node, flowStyles.nodeActiveEvent, {
            [flowStyles.nodeIdle]: phase === 'idle',
            [flowStyles.nodeActiveEvent]: activeSet.has('source'),
          })}
          style={{marginBottom: '0.5rem'}}
        >
          <div className={flowStyles.nodeIcon} aria-hidden>
            ⚡
          </div>
          <p className={flowStyles.nodeTitle}>Источник события</p>
          <p className={flowStyles.nodeHint}>Order Service</p>
        </div>

        <div
          className={clsx(flowStyles.eventHub, {
            [flowStyles.eventHubActive]: activeSet.has('bus'),
          })}
        >
          📡 Шина событий (Event Bus)
        </div>

        <div className={flowStyles.busRow}>
          <div
            className={clsx(flowStyles.subscriber, {
              [flowStyles.subscriberActive]: activeSet.has('subA'),
            })}
          >
            <div className={flowStyles.nodeIcon} aria-hidden>
              📦
            </div>
            <p className={flowStyles.nodeTitle}>Система А</p>
            <p className={flowStyles.nodeHint}>Склад</p>
          </div>
          <div
            className={clsx(flowStyles.subscriber, {
              [flowStyles.subscriberActiveGreen]: activeSet.has('subB'),
            })}
          >
            <div className={flowStyles.nodeIcon} aria-hidden>
              ✉️
            </div>
            <p className={flowStyles.nodeTitle}>Система Б</p>
            <p className={flowStyles.nodeHint}>Уведомления</p>
          </div>
        </div>

        {currentStage && <p className={flowStyles.stageDesc}>{currentStage.desc}</p>}

        <div className="it-demo__steps" style={{marginTop: '1rem'}} aria-label="Этапы">
          {STAGES.map((stage, index) => (
            <div key={stage.id} className={stepClass(index)}>
              <div style={{fontWeight: 700, marginBottom: '0.2rem'}}>{index + 1}</div>
              {stage.label}
            </div>
          ))}
        </div>

        <div style={{marginTop: '1rem'}}>
          <div
            className="it-demo__row"
            style={{justifyContent: 'space-between', marginBottom: '0.35rem'}}
          >
            <span style={{fontSize: '0.8rem', color: 'var(--demo-muted)'}}>Прогресс</span>
            <span style={{fontSize: '0.8rem', fontWeight: 600}}>{progress}%</span>
          </div>
          <div className="it-demo__progress">
            <div className="it-demo__progress-bar" style={{width: `${progress}%`}} />
          </div>
        </div>

        {logEntries.length > 0 && (
          <div style={{marginTop: '1rem'}}>
            <p
              style={{
                margin: '0 0 0.35rem',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: 'var(--demo-muted)',
              }}
            >
              Журнал событий
            </p>
            <div className="it-demo__log" role="log" aria-live="polite">
              {logEntries.map((entry) => (
                <div key={entry.id} className="it-demo__log-entry">
                  <span style={{color: 'var(--demo-muted)', marginRight: '0.5rem'}}>
                    [{entry.time}]
                  </span>
                  {entry.message}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className={clsx('it-demo__row', flowStyles.controls)}>
          {phase !== 'running' && (
            <button
              type="button"
              className="it-demo__btn it-demo__btn--primary"
              onClick={phase === 'done' ? reset : startAnimation}
            >
              {phase === 'done' ? 'Повторить' : 'Сгенерировать событие'}
            </button>
          )}
          {phase === 'running' && (
            <span className="it-demo__badge it-demo__badge--active">Обработка…</span>
          )}
          {phase === 'done' && (
            <span className="it-demo__badge it-demo__badge--active">Завершено</span>
          )}
        </div>

        <div className="it-demo__alert it-demo__alert--info" style={{marginTop: '1rem'}}>
          В отличие от запрос–ответ, издатель не ждёт ответа от подписчиков — связь слабая и
          асинхронная.
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default ReactiveInteractionInner;
