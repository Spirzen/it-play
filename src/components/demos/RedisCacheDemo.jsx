import React, {useCallback, useEffect, useRef, useState} from 'react';

import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';


import {FlowTrack} from '@/components/shared/kb/flowTrack';
import styles from '@/components/demos/RedisCacheDemo.module.css';

const USERS = {
  123: {id: 123, name: 'Анна К.', role: 'admin', lastLogin: '2026-05-20T10:00:00Z'},
  456: {id: 456, name: 'Иван П.', role: 'viewer', lastLogin: '2026-05-19T18:30:00Z'},
};

const USER_IDS = Object.keys(USERS);

function cacheKey(userId) {
  return `cache:user:${userId}`;
}

function formatTime(date) {
  return date.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    fractionalSecondDigits: 3,
  });
}

function formatJson(value) {
  return JSON.stringify(value, null, 2);
}

function delay(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function NodeHead({title, badge}) {
  return (
    <div className={styles.nodeHead}>
      <span>{title}</span>
      <span className="it-demo__badge">{badge}</span>
    </div>
  );
}

function CacheDiagram({
  nodeClass,
  track,
  packetTick,
  keyName,
  entry,
  entryValid,
  ttlLeft,
  userId,
}) {
  return (
    <div className={styles.diagram}>
      <div className={nodeClass('app')}>
        <NodeHead title="Приложение" badge="Node.js / API" />
        <div className={styles.nodeBody}>
          <p style={{margin: 0}}>
            <code>GET /api/user/{userId}</code>
          </p>
          <p className={styles.emptyHint} style={{marginTop: '0.5rem'}}>
            Сначала проверяет Redis, при промахе — PostgreSQL
          </p>
        </div>
      </div>

      <div className={styles.trackCol}>
        <FlowTrack
          active={track.active && track.segment === 'app-redis'}
          reverse={track.reverse}
          packetTick={packetTick}
          durationMs={400}
          color="#c62828"
        />
        <span
          className={clsx(styles.trackArrow, track.segment === 'app-redis' && styles.trackArrowActive)}
          aria-hidden
        >
          ⇄
        </span>
      </div>

      <div className={nodeClass('redis')}>
        <NodeHead title="Redis" badge="in-memory" />
        <div className={styles.nodeBody}>
          {!entry ? (
            <p className={styles.emptyHint}>Ключей пока нет — выполните запрос с промахом кэша</p>
          ) : (
            <ul className={styles.keyList}>
              <li className={clsx(styles.keyItem, !entryValid && styles.keyItemExpired)}>
                <div className={styles.keyName}>{keyName}</div>
                <pre className={styles.jsonPre}>{formatJson(entry.value)}</pre>
                {entryValid ? (
                  <span className={styles.ttlBadge}>TTL {ttlLeft} с</span>
                ) : (
                  <span className={styles.ttlBadge}>истёк</span>
                )}
              </li>
            </ul>
          )}
        </div>
      </div>

      <div className={styles.trackCol}>
        <FlowTrack
          active={track.active && track.segment === 'app-db'}
          reverse={track.reverse}
          packetTick={packetTick}
          durationMs={850}
          color="#1565c0"
        />
        <span
          className={clsx(styles.trackArrow, track.segment === 'app-db' && styles.trackArrowActive)}
          aria-hidden
        >
          →
        </span>
      </div>

      <div className={nodeClass('db')}>
        <NodeHead title="PostgreSQL" badge="дисковая СУБД" />
        <div className={styles.nodeBody}>
          <p style={{margin: 0}}>
            Таблица <code>users</code>
          </p>
          <pre className={styles.jsonPre}>{formatJson(USERS[userId])}</pre>
          <p className={styles.emptyHint} style={{marginTop: '0.35rem'}}>
            Медленный путь: парсинг SQL, диск, блокировки (~200+ мс в демо)
          </p>
        </div>
      </div>
    </div>
  );
}

function StatsPanel({stats, hitRate, lastResult}) {
  return (
    <div className={styles.statsGrid}>
      <div className={styles.statCard}>
        <span className={clsx(styles.statValue, styles.statHit)}>{stats.hits}</span>
        <span className={styles.statLabel}>cache hit</span>
      </div>
      <div className={styles.statCard}>
        <span className={clsx(styles.statValue, styles.statMiss)}>{stats.misses}</span>
        <span className={styles.statLabel}>cache miss</span>
      </div>
      <div className={styles.statCard}>
        <span className={styles.statValue}>{hitRate}%</span>
        <span className={styles.statLabel}>hit rate</span>
      </div>
      <div className={styles.statCard}>
        <span className={styles.statValue}>{stats.dbQueries}</span>
        <span className={styles.statLabel}>запросов к БД</span>
      </div>
      {lastResult && (
        <div className={styles.statCard} style={{gridColumn: '1 / -1'}}>
          <span className={styles.statValue}>{lastResult.ms} мс</span>
          <span className={styles.statLabel}>время последнего ответа</span>
        </div>
      )}
    </div>
  );
}

function ResultBanner({lastResult}) {
  return (
    <div
      className={clsx(
        styles.resultBanner,
        lastResult.type === 'hit' ? styles.resultHit : styles.resultMiss,
      )}
      role="status"
    >
      {lastResult.type === 'hit' ? (
        <>
          <strong>Cache hit</strong> — данные взяты из Redis за {lastResult.ms} мс. PostgreSQL не
          нагружался.
        </>
      ) : (
        <>
          <strong>Cache miss</strong> — ответ за {lastResult.ms} мс: чтение из PostgreSQL и запись в
          Redis с TTL.
        </>
      )}
    </div>
  );
}

function RedisCacheDemoInner() {
  const [userId, setUserId] = useState('123');
  const [ttlSec, setTtlSec] = useState(15);
  const [cache, setCache] = useState({});
  const [stats, setStats] = useState({hits: 0, misses: 0, dbQueries: 0});
  const [phase, setPhase] = useState('idle');
  const [activeNodes, setActiveNodes] = useState(new Set());
  const [track, setTrack] = useState({active: false, reverse: false, segment: null});
  const [packetTick, setPacketTick] = useState(0);
  const [logEntries, setLogEntries] = useState([]);
  const [lastResult, setLastResult] = useState(null);
  const [, setTick] = useState(0);
  const abortRef = useRef(false);

  const key = cacheKey(userId);
  const entry = cache[key];
  const now = Date.now();
  const entryValid = entry && entry.expiresAt > now;
  const ttlLeft = entryValid ? Math.ceil((entry.expiresAt - now) / 1000) : 0;

  const appendLog = useCallback((message) => {
    setLogEntries((prev) => [
      {id: `${Date.now()}-${prev.length}`, time: formatTime(new Date()), message},
      ...prev,
    ].slice(0, 10));
  }, []);

  const pulseTrack = useCallback((segment, reverse = false) => {
    setTrack({active: true, reverse, segment});
    setPacketTick((t) => t + 1);
  }, []);

  const stopTrack = useCallback(() => {
    setTrack({active: false, reverse: false, segment: null});
  }, []);

  const setNodes = useCallback((nodes) => {
    setActiveNodes(new Set(nodes));
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => t + 1), 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    abortRef.current = false;
    return () => {
      abortRef.current = true;
    };
  }, []);

  const resetAnimation = useCallback(() => {
    abortRef.current = true;
    setPhase('idle');
    setActiveNodes(new Set());
    stopTrack();
    window.setTimeout(() => {
      abortRef.current = false;
    }, 0);
  }, [stopTrack]);

  const clearCache = useCallback(() => {
    resetAnimation();
    setCache({});
    setLogEntries([]);
    setLastResult(null);
    appendLog('FLUSHDB — кэш очищен (демо)');
  }, [appendLog, resetAnimation]);

  const expireKey = useCallback(() => {
    setCache((prev) => {
      if (!prev[key]) return prev;
      return {...prev, [key]: {...prev[key], expiresAt: Date.now() - 1}};
    });
    appendLog(`TTL истёк для ${key} — следующий запрос пойдёт в БД`);
  }, [appendLog, key]);

  const runRequest = useCallback(async () => {
    if (phase === 'running') return;

    abortRef.current = false;
    setPhase('running');
    setLastResult(null);
    setLogEntries([]);
    setNodes(['app']);
    appendLog(`GET /api/user/${userId}`);

    const cached = cache[key];
    const isHit = cached && cached.expiresAt > Date.now();
    const start = performance.now();

    if (isHit) {
      appendLog(`GET ${key} → найдено в Redis`);
      setNodes(['app', 'redis']);
      pulseTrack('app-redis');
      await delay(420);
      if (abortRef.current) return;

      stopTrack();
      const elapsed = Math.round(performance.now() - start);
      setStats((s) => ({...s, hits: s.hits + 1}));
      setLastResult({type: 'hit', ms: elapsed, data: cached.value});
      appendLog(`[CACHE HIT] ответ за ${elapsed} мс — без обращения к PostgreSQL`);
      setNodes(['app']);
      setPhase('done');
      return;
    }

    setStats((s) => ({...s, misses: s.misses + 1}));
    appendLog(`GET ${key} → (nil) — промах кэша`);

    setNodes(['app', 'redis']);
    pulseTrack('app-redis');
    await delay(380);
    if (abortRef.current) return;
    stopTrack();

    appendLog('Запрос к PostgreSQL — тяжёлый SELECT…');
    setNodes(['app', 'db']);
    pulseTrack('app-db');
    await delay(900);
    if (abortRef.current) return;
    stopTrack();

    const data = USERS[userId];
    const expiresAt = Date.now() + ttlSec * 1000;
    setCache((prev) => ({
      ...prev,
      [key]: {value: data, expiresAt},
    }));
    setStats((s) => ({...s, dbQueries: s.dbQueries + 1}));

    appendLog(`SET ${key} … EX ${ttlSec}`);
    setNodes(['app', 'redis']);
    pulseTrack('app-redis', true);
    await delay(420);
    if (abortRef.current) return;
    stopTrack();

    const elapsed = Math.round(performance.now() - start);
    setLastResult({type: 'miss', ms: elapsed, data});
    appendLog(`[CACHE MISS] данные из БД сохранены в Redis (${elapsed} мс)`);
    setNodes(['app']);
    setPhase('done');
  }, [appendLog, cache, key, phase, pulseTrack, setNodes, stopTrack, ttlSec, userId]);

  const total = stats.hits + stats.misses;
  const hitRate = total > 0 ? Math.round((stats.hits / total) * 100) : 0;
  const isRunning = phase === 'running';

  const nodeClass = (role) =>
    clsx(styles.node, {
      [styles.nodeIdle]: phase === 'idle' && !activeNodes.has(role),
      [styles.nodeAppActive]: activeNodes.has('app') && role === 'app',
      [styles.nodeRedisActive]: activeNodes.has('redis') && role === 'redis',
      [styles.nodeDbActive]: activeNodes.has('db') && role === 'db',
    });

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Кэширование с Redis"
        subtitle="Cache hit и cache miss: приложение, in-memory кэш и основная СУБД"
      >
        <p className={styles.desc}>
          Запросите профиль пользователя несколько раз подряд. Первый раз данные придут из PostgreSQL
          и попадут в Redis с TTL; повторные запросы обслужит кэш за миллисекунды.
        </p>

        <CacheDiagram
          nodeClass={nodeClass}
          track={track}
          packetTick={packetTick}
          keyName={key}
          entry={entry}
          entryValid={entryValid}
          ttlLeft={ttlLeft}
          userId={userId}
        />

        <StatsPanel stats={stats} hitRate={hitRate} lastResult={lastResult} />

        {lastResult && <ResultBanner lastResult={lastResult} />}

        <div className={clsx('it-demo__row', styles.controls)}>
          <span className="it-demo__badge">user_id</span>
          {USER_IDS.map((id) => (
            <button
              key={id}
              type="button"
              disabled={isRunning}
              className={clsx(
                'it-demo__btn',
                'it-demo__btn--sm',
                userId === id ? 'it-demo__btn--primary' : 'it-demo__btn--secondary',
              )}
              onClick={() => {
                setUserId(id);
                setLastResult(null);
              }}
            >
              {id}
            </button>
          ))}

          <label className={styles.ttlRow}>
            TTL
            <input
              type="range"
              min={5}
              max={60}
              step={5}
              value={ttlSec}
              disabled={isRunning}
              onChange={(e) => setTtlSec(Number(e.target.value))}
            />
            <span>{ttlSec} с</span>
          </label>
        </div>

        <div className={clsx('it-demo__row', styles.controls)} style={{marginTop: '0.5rem'}}>
          <button
            type="button"
            className="it-demo__btn it-demo__btn--primary"
            disabled={isRunning}
            onClick={runRequest}
          >
            {phase === 'done' ? 'Ещё запрос' : 'Запросить профиль'}
          </button>
          <button
            type="button"
            className="it-demo__btn it-demo__btn--secondary"
            disabled={isRunning || !entry}
            onClick={expireKey}
          >
            Истечь TTL
          </button>
          <button
            type="button"
            className="it-demo__btn it-demo__btn--secondary"
            disabled={isRunning}
            onClick={clearCache}
          >
            Очистить кэш
          </button>
          {isRunning && <span className="it-demo__badge it-demo__badge--active">Выполняется…</span>}
        </div>

        {logEntries.length > 0 && (
          <div>
            <p className={styles.logTitle}>Журнал команд</p>
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
      </DemoCard>
    </DemoShell>
  );
}

export default RedisCacheDemoInner;
