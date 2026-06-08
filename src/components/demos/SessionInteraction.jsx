import React, {useState, useRef, useEffect, useCallback, useMemo} from 'react';

import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';


import {FlowTrack} from '@/components/shared/kb/flowTrack';
import flowStyles from '@/components/shared/kb/interactionDemo.module.css';

const STAGES = [
  {
    id: 'initiate',
    label: 'Запрос',
    duration: 1200,
    desc: 'Клиент отправляет первый HTTP-запрос без идентификатора сессии.',
    packetTrack: 0,
    log: '→ GET /dashboard — Cookie: (пусто)',
    activeNodes: ['client'],
  },
  {
    id: 'create',
    label: 'Создание сессии',
    duration: 1800,
    desc: 'Сервер создаёт запись сессии в хранилище и генерирует уникальный Session ID.',
    packetTrack: 0,
    packetPaused: true,
    log: '⚙ store.createSession() → sid=a8f3…',
    activeNodes: ['server'],
    createsSession: true,
  },
  {
    id: 'return_token',
    label: 'Выдача ID',
    duration: 1200,
    desc: 'Session ID возвращается клиенту через Set-Cookie или тело ответа.',
    packetTrack: 0,
    packetReverse: true,
    log: '← Set-Cookie: SESSIONID=a8f3…; HttpOnly',
    activeNodes: ['client', 'server'],
  },
  {
    id: 'active',
    label: 'Активная сессия',
    duration: 2500,
    desc: 'Последующие запросы автоматически несут Session ID — сервер узнаёт пользователя.',
    packetTrack: 0,
    packetReverse: true,
    packetPaused: true,
    log: '→ GET /profile — Cookie: SESSIONID=a8f3…',
    activeNodes: ['client', 'server'],
    showToken: true,
  },
  {
    id: 'terminate',
    label: 'Завершение',
    duration: 1000,
    desc: 'Сессия истекла или пользователь вышел — идентификатор больше не принимается.',
    packetTrack: 0,
    log: '✕ session.destroy() — 401 Unauthorized',
    activeNodes: [],
    terminated: true,
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

function randomSessionId() {
  return Array.from({length: 24}, () => Math.floor(Math.random() * 16).toString(16)).join('');
}

function SessionInteractionInner() {
  const [phase, setPhase] = useState('idle');
  const [stageIndex, setStageIndex] = useState(-1);
  const [progress, setProgress] = useState(0);
  const [logEntries, setLogEntries] = useState([]);
  const [packetTick, setPacketTick] = useState(0);
  const [sessionId, setSessionId] = useState('');

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
    setPacketTick(0);
    setSessionId('');
  }, [clearTimer]);

  const startAnimation = useCallback(() => {
    if (phase === 'running') return;

    clearTimer();
    setPhase('running');
    setStageIndex(0);
    setProgress(0);
    setLogEntries([]);
    setPacketTick((t) => t + 1);
    setSessionId('');
    startTimeRef.current = Date.now();
    appendLog('Начало жизненного цикла сессии');

    let currentIndex = 0;

    const runStage = () => {
      if (currentIndex >= STAGES.length) {
        clearTimer();
        setPhase('done');
        setStageIndex(STAGES.length - 1);
        setProgress(100);
        appendLog('✓ Сессия завершена');
        return;
      }

      const stage = STAGES[currentIndex];
      setStageIndex(currentIndex);
      setPacketTick((t) => t + 1);
      if (stage.createsSession) {
        setSessionId(randomSessionId());
      }
      if (stage.terminated) {
        setSessionId('');
      }
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

  const activeNodes = useMemo(() => {
    if (!currentStage) return new Set();
    return new Set(currentStage.activeNodes);
  }, [currentStage]);

  const nodeClass = (type) =>
    clsx(flowStyles.node, {
      [flowStyles.nodeIdle]: phase === 'idle',
      [flowStyles.nodeActiveClient]: activeNodes.has('client') && type === 'client',
      [flowStyles.nodeActiveServer]: activeNodes.has('server') && type === 'server',
    });

  const stepClass = (index) =>
    clsx('it-demo__step', {
      'it-demo__step--active': isRunning && stageIndex === index,
      'it-demo__step--done':
        (isRunning && stageIndex > index) || (phase === 'done' && index < STAGES.length),
    });

  const trackForward =
    isRunning && currentStage?.packetTrack === 0 && !currentStage?.packetReverse;
  const trackReverse = isRunning && currentStage?.packetReverse;

  return (
    <DemoShell className={flowStyles.root}>
      <DemoCard
        title="Жизненный цикл сессии"
        subtitle="Сервер выдаёт Session ID, клиент сохраняет и передаёт его в каждом запросе."
      >
        <div className={flowStyles.diagram}>
          <div className={nodeClass('client')}>
            <div className={flowStyles.nodeIcon} aria-hidden>
              🖥️
            </div>
            <p className={flowStyles.nodeTitle}>Клиент</p>
            <p className={flowStyles.nodeHint}>Браузер / приложение</p>
          </div>

          <FlowTrack
            active={trackForward || trackReverse}
            reverse={trackReverse}
            packetTick={packetTick}
            durationMs={currentStage?.duration ?? 1200}
            color={
              trackReverse ? 'var(--flow-accent)' : 'var(--ifm-color-primary)'
            }
            paused={currentStage?.packetPaused}
            waiting={currentStage?.packetPaused && !trackReverse}
          />

          <div className={nodeClass('server')}>
            <div className={flowStyles.nodeIcon} aria-hidden>
              ☁️
            </div>
            <p className={flowStyles.nodeTitle}>Сервер</p>
            <p className={flowStyles.nodeHint}>Хранилище сессий</p>
          </div>
        </div>

        <div
          className={clsx(flowStyles.tokenBox, {
            [flowStyles.tokenBoxIdle]: !sessionId,
          })}
        >
          {sessionId ? (
            <>
              <strong>Session ID: </strong>
              {sessionId}
            </>
          ) : (
            'Session ID ещё не выдан'
          )}
        </div>

        {currentStage && <p className={flowStyles.stageDesc}>{currentStage.desc}</p>}

        <div className="it-demo__steps" style={{marginTop: '1rem'}} aria-label="Этапы сессии">
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
              Журнал
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
              {phase === 'done' ? 'Повторить' : 'Начать сессию'}
            </button>
          )}
          {phase === 'running' && (
            <span className="it-demo__badge it-demo__badge--active">Выполняется…</span>
          )}
          {phase === 'done' && (
            <span className="it-demo__badge it-demo__badge--active">Завершено</span>
          )}
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default SessionInteractionInner;
