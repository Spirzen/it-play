import React, {useState, useRef, useEffect, useCallback, useMemo} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import styles from '@/components/demos/AsynchronousInteraction.module.css';

const STAGES = [
  {
    id: 'initiate',
    label: 'Отправка запроса',
    duration: 1200,
    desc: 'Клиент помещает сообщение в очередь и сразу освобождает поток — не ждёт ответа.',
    packetTrack: 0,
    log: '→ Очередь: POST /orders (correlation-id: a7f2)',
    activeNodes: ['client', 'queue'],
  },
  {
    id: 'async_wait',
    label: 'Обработка на сервере',
    duration: 3800,
    desc: 'Сервер забирает задачу из очереди. Клиент в это время продолжает свою работу.',
    packetTrack: 1,
    log: '⚙ Worker-3: обработка заказа #1042…',
    activeNodes: ['queue', 'server'],
    clientFree: true,
  },
  {
    id: 'notify',
    label: 'Получение ответа',
    duration: 1200,
    desc: 'Результат доставляется клиенту через callback, webhook или polling.',
    packetTrack: 1,
    packetReverse: true,
    log: '← Callback: заказ #1042 — статус "выполнен"',
    activeNodes: ['server', 'client'],
  },
];

const CLIENT_TASKS = [
  'Рендер списка заказов',
  'Валидация полей формы',
  'Подгрузка превью изображений',
  'Автосохранение черновика',
  'Обновление счётчика уведомлений',
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

function Track({active, reverse, packetTick, durationMs, color}) {
  return (
    <div className={styles.track}>
      <div className={styles.trackInner}>
        <div className={clsx(styles.trackLine, {[styles.trackLineActive]: active})}>
          {active && (
            <span
              key={packetTick}
              className={clsx(
                styles.packet,
                styles.packetVisible,
                reverse && styles.packetReverse,
              )}
              style={{
                background: color,
                '--packet-duration': `${durationMs}ms`,
              }}
              aria-hidden
            />
          )}
        </div>
        <span className={styles.trackArrow} aria-hidden>
          {reverse ? '←' : '→'}
        </span>
      </div>
    </div>
  );
}

function Diagram({nodeClass, currentStage, packetTick, isRunning}) {
  const stage = currentStage;
  const track0Active = isRunning && stage?.packetTrack === 0 && !stage?.packetReverse;
  const track1Active = isRunning && stage?.packetTrack === 1 && !stage?.packetReverse;
  const track1Reverse = isRunning && stage?.packetTrack === 1 && stage?.packetReverse;

  return (
    <div className={styles.diagram}>
      <div className={nodeClass('client')}>
        <div className={styles.nodeIcon} aria-hidden>
          💻
        </div>
        <p className={styles.nodeTitle}>Клиент</p>
        <p className={styles.nodeHint}>Инициатор запроса</p>
      </div>

      <Track
        active={track0Active}
        packetTick={packetTick}
        durationMs={STAGES[0].duration}
        color="var(--ifm-color-primary)"
      />

      <div className={nodeClass('queue')}>
        <div className={styles.nodeIcon} aria-hidden>
          📬
        </div>
        <p className={styles.nodeTitle}>Очередь</p>
        <p className={styles.nodeHint}>RabbitMQ, Kafka, SQS…</p>
      </div>

      <Track
        active={track1Active || track1Reverse}
        reverse={track1Reverse}
        packetTick={packetTick}
        durationMs={STAGES[2].duration}
        color="#00897b"
      />

      <div className={nodeClass('server')}>
        <div className={styles.nodeIcon} aria-hidden>
          ☁️
        </div>
        <p className={styles.nodeTitle}>Сервер</p>
        <p className={styles.nodeHint}>Обработчик сообщений</p>
      </div>

      {stage?.id === 'notify' && (
        <p className={styles.returnHint}>
          ↩ ответ возвращается по обратному пути (callback / webhook)
        </p>
      )}
    </div>
  );
}

function AsynchronousInteractionInner() {
  const [phase, setPhase] = useState('idle');
  const [stageIndex, setStageIndex] = useState(-1);
  const [progress, setProgress] = useState(0);
  const [logEntries, setLogEntries] = useState([]);
  const [clientTaskIndex, setClientTaskIndex] = useState(0);
  const [clientActions, setClientActions] = useState(0);
  const [packetTick, setPacketTick] = useState(0);

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
    setClientTaskIndex(0);
    setClientActions(0);
    setPacketTick(0);
  }, [clearTimer]);

  const startAnimation = useCallback(() => {
    if (phase === 'running') return;

    clearTimer();
    setPhase('running');
    setStageIndex(0);
    setProgress(0);
    setLogEntries([]);
    setClientTaskIndex(0);
    setClientActions(0);
    setPacketTick((t) => t + 1);
    startTimeRef.current = Date.now();
    appendLog('Демо запущено');

    let currentIndex = 0;

    const runStage = () => {
      if (currentIndex >= STAGES.length) {
        clearTimer();
        setPhase('done');
        setStageIndex(STAGES.length - 1);
        setProgress(100);
        appendLog('✓ Цикл завершён — клиент получил результат');
        return;
      }

      const stage = STAGES[currentIndex];
      setStageIndex(currentIndex);
      setPacketTick((t) => t + 1);
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
  const showClientPanel = isRunning && currentStage?.clientFree;

  useEffect(() => {
    if (!showClientPanel) return undefined;

    const taskInterval = setInterval(() => {
      setClientTaskIndex((i) => (i + 1) % CLIENT_TASKS.length);
      setClientActions((n) => n + 1);
    }, 700);

    return () => clearInterval(taskInterval);
  }, [showClientPanel]);

  const activeNodes = useMemo(() => {
    if (!currentStage) return new Set();
    return new Set(currentStage.activeNodes);
  }, [currentStage]);

  const stepClass = (index) =>
    clsx('it-demo__step', {
      'it-demo__step--active': isRunning && stageIndex === index,
      'it-demo__step--done':
        (isRunning && stageIndex > index) || (phase === 'done' && index < STAGES.length),
    });

  const nodeClass = (type) =>
    clsx(styles.node, {
      [styles.nodeIdle]: phase === 'idle',
      [styles.nodeActiveClient]: activeNodes.has('client') && type === 'client',
      [styles.nodeActiveQueue]: activeNodes.has('queue') && type === 'queue',
      [styles.nodeActiveServer]: activeNodes.has('server') && type === 'server',
    });

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Асинхронное взаимодействие"
        subtitle="Инициатор не блокируется: сообщение уходит в очередь, обработка и ответ происходят независимо по времени."
      >
        <Diagram
          nodeClass={nodeClass}
          currentStage={currentStage}
          packetTick={packetTick}
          isRunning={isRunning}
        />

        {showClientPanel && (
          <div className={styles.clientPanel} role="status" aria-live="polite">
            <p className={styles.clientPanelTitle}>Клиент не заблокирован</p>
            <p className={styles.clientTask}>▸ {CLIENT_TASKS[clientTaskIndex]}</p>
            <p className={styles.clientStats}>
              Параллельных действий за время ожидания: <strong>{clientActions}</strong>
            </p>
          </div>
        )}

        {currentStage && <p className={styles.stageDesc}>{currentStage.desc}</p>}

        <div className="it-demo__steps" style={{marginTop: '1rem'}} aria-label="Этапы взаимодействия">
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
            <span style={{fontSize: '0.8rem', color: 'var(--demo-muted)'}}>Прогресс цикла</span>
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

        <div className={clsx('it-demo__row', styles.controls)}>
          {phase !== 'running' && (
            <button
              type="button"
              className="it-demo__btn it-demo__btn--primary"
              onClick={phase === 'done' ? reset : startAnimation}
            >
              {phase === 'done' ? 'Повторить эксперимент' : 'Отправить запрос'}
            </button>
          )}
          {phase === 'running' && (
            <span className="it-demo__badge it-demo__badge--active">Выполняется…</span>
          )}
          {phase === 'done' && (
            <span className="it-demo__badge it-demo__badge--active">Завершено</span>
          )}
        </div>

        {phase === 'idle' && (
          <div className="it-demo__alert it-demo__alert--info" style={{marginTop: '1rem'}}>
            Сравните с синхронным демо выше: здесь клиент не "замирает", пока сервер обрабатывает
            запрос.
          </div>
        )}
      </DemoCard>
    </DemoShell>
  );
}

export default AsynchronousInteractionInner;
