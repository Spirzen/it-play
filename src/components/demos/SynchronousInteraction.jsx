import React, {useState, useRef, useEffect, useCallback, useMemo} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import styles from '@/components/demos/SynchronousInteraction.module.css';

const STAGES = [
  {
    id: 'initiate',
    label: 'Отправка запроса',
    duration: 1200,
    desc: 'Клиент отправляет HTTP-запрос напрямую на сервер. Поток выполнения уже занят ожиданием.',
    packetTrack: 0,
    log: '→ GET /api/user/123 — соединение установлено',
    activeNodes: ['client', 'server'],
  },
  {
    id: 'wait',
    label: 'Ожидание ответа',
    duration: 3500,
    desc: 'Пока сервер обрабатывает запрос, клиент заблокирован: интерфейс не отвечает, другие действия невозможны.',
    packetTrack: 0,
    packetPaused: true,
    log: '⏸ Клиент ждёт… сервер обрабатывает запрос',
    activeNodes: ['client', 'server'],
    clientBlocked: true,
  },
  {
    id: 'receive',
    label: 'Получение ответа',
    duration: 1200,
    desc: 'Ответ получен по тому же соединению — клиент разблокируется и продолжает работу.',
    packetTrack: 0,
    packetReverse: true,
    log: '← 200 OK — тело ответа получено',
    activeNodes: ['client', 'server'],
  },
];

const FROZEN_UI = [
  'Клик по кнопке "Сохранить"',
  'Прокрутка списка заказов',
  'Ввод в поле поиска',
  'Переход на другую страницу',
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

function Track({active, reverse, paused, packetTick, durationMs, waiting}) {
  return (
    <div className={styles.track}>
      <div className={styles.trackInner}>
        <div
          className={clsx(styles.trackLine, {
            [styles.trackLineActive]: active && !waiting,
            [styles.trackLineWaiting]: waiting,
          })}
        >
          {active && (
            <span
              key={packetTick}
              className={clsx(styles.packet, styles.packetVisible, {
                [styles.packetReverse]: reverse,
                [styles.packetPaused]: paused,
              })}
              style={{
                background: paused ? 'var(--sync-wait)' : 'var(--ifm-color-primary)',
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

function Diagram({nodeClass, currentStage, packetTick, isRunning, clientBlocked}) {
  const stage = currentStage;
  const trackActive = isRunning && stage?.packetTrack === 0;
  const isReverse = stage?.packetReverse;
  const isPaused = stage?.packetPaused;

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
        active={trackActive}
        reverse={isReverse}
        paused={isPaused}
        waiting={clientBlocked}
        packetTick={packetTick}
        durationMs={isReverse ? STAGES[2].duration : STAGES[0].duration}
      />

      <div className={nodeClass('server')}>
        <div className={styles.nodeIcon} aria-hidden>
          ☁️
        </div>
        <p className={styles.nodeTitle}>Сервер</p>
        <p className={styles.nodeHint}>REST API, gRPC…</p>
      </div>

      {stage?.id === 'receive' && (
        <p className={styles.returnHint}>↩ ответ по тому же синхронному каналу</p>
      )}
    </div>
  );
}

function SynchronousInteractionInner() {
  const [phase, setPhase] = useState('idle');
  const [stageIndex, setStageIndex] = useState(-1);
  const [progress, setProgress] = useState(0);
  const [logEntries, setLogEntries] = useState([]);
  const [waitSeconds, setWaitSeconds] = useState(0);
  const [packetTick, setPacketTick] = useState(0);

  const timerRef = useRef(null);
  const progressRef = useRef(null);
  const waitRef = useRef(null);
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
    if (waitRef.current) {
      clearInterval(waitRef.current);
      waitRef.current = null;
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
    setWaitSeconds(0);
    setPacketTick(0);
  }, [clearTimer]);

  const startAnimation = useCallback(() => {
    if (phase === 'running') return;

    clearTimer();
    setPhase('running');
    setStageIndex(0);
    setProgress(0);
    setLogEntries([]);
    setWaitSeconds(0);
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
        appendLog('✓ Ответ получен — клиент разблокирован');
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
  const showBlockedPanel = isRunning && currentStage?.clientBlocked;

  useEffect(() => {
    if (!showBlockedPanel) {
      setWaitSeconds(0);
      return undefined;
    }

    const start = Date.now();
    waitRef.current = setInterval(() => {
      setWaitSeconds(((Date.now() - start) / 1000).toFixed(1));
    }, 100);

    return () => {
      if (waitRef.current) {
        clearInterval(waitRef.current);
        waitRef.current = null;
      }
    };
  }, [showBlockedPanel, stageIndex]);

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
      [styles.nodeBlocked]: showBlockedPanel,
      [styles.nodeActiveClient]:
        activeNodes.has('client') && type === 'client' && !showBlockedPanel,
      [styles.nodeActiveServer]:
        activeNodes.has('server') && type === 'server' && !showBlockedPanel,
    });

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Синхронное взаимодействие"
        subtitle="Инициатор ждёт ответа: пока сервер думает, клиент заблокирован и не может продолжать работу."
      >
        <Diagram
          nodeClass={nodeClass}
          currentStage={currentStage}
          packetTick={packetTick}
          isRunning={isRunning}
          clientBlocked={showBlockedPanel}
        />

        {showBlockedPanel && (
          <div className={styles.clientPanel} role="status" aria-live="polite">
            <p className={styles.clientPanelTitle}>Клиент заблокирован</p>
            <p className={styles.clientFrozen}>✕ {FROZEN_UI[0]}</p>
            <p className={styles.clientFrozen}>✕ {FROZEN_UI[1]}</p>
            <p className={styles.clientStats}>
              Время ожидания ответа: <strong>{waitSeconds} с</strong> — поток занят
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
            Ниже — асинхронное демо: там клиент не блокируется, пока сервер обрабатывает запрос.
          </div>
        )}
      </DemoCard>
    </DemoShell>
  );
}

export default SynchronousInteractionInner;
