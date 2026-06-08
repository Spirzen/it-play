import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import useBreakpoint from '@/components/shared/kb/useBreakpoint';
import {
  PROTOCOLS,
  applyPacketResult,
  emptyStats,
  nextPacketId,
  simulateRoundTrip,
  summarizeStats,
} from '@/components/shared/kb/networkEmulatorEngine';
import styles from '@/components/demos/NetworkEmulatorPlay.module.css';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';

const BURST_SIZE = 10;
const FLIGHT_MS = 420;
const RETURN_MS = 420;

function formatLogEntry(protocol, result, seq) {
  if (result.lost) {
    return {seq, tag: 'LOST', cls: styles.logLost, text: `#${seq} ${protocol.toUpperCase()} — пакет потерян, ответа нет`};
  }
  if (result.retransmitted) {
    return {
      seq,
      tag: 'RTX',
      cls: styles.logRetry,
      text: `#${seq} ${protocol.toUpperCase()} — повторная отправка, RTT ${result.rttMs} мс`,
    };
  }
  return {seq, tag: 'OK', cls: styles.logOk, text: `#${seq} ${protocol.toUpperCase()} — RTT ${result.rttMs} мс`};
}

function NetworkEmulatorPlayInner() {
  const {isMobile} = useBreakpoint();
  const [protocol, setProtocol] = useState('tcp');
  const [latency, setLatency] = useState(40);
  const [jitter, setJitter] = useState(15);
  const [lossPct, setLossPct] = useState(8);
  const [stats, setStats] = useState(emptyStats);
  const [log, setLog] = useState([]);
  const [packets, setPackets] = useState([]);
  const [running, setRunning] = useState(false);
  const [continuous, setContinuous] = useState(false);
  const timersRef = useRef([]);

  const summary = useMemo(() => summarizeStats(stats), [stats]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const reset = useCallback(() => {
    clearTimers();
    setRunning(false);
    setContinuous(false);
    setStats(emptyStats());
    setLog([]);
    setPackets([]);
  }, [clearTimers]);

  const sendOne = useCallback(() => {
    const seq = nextPacketId();
    const id = `pkt-${seq}`;
    const hopOpts = {protocol, baseLatency: latency, jitter, lossPct};
    const result = simulateRoundTrip(hopOpts);

    setStats((s) => applyPacketResult(s, result));

    if (result.lost) {
      setPackets((prev) => [...prev, {id, seq, phase: 'lost', left: 50, label: `#${seq}`}]);
      setLog((prev) => [formatLogEntry(protocol, result, seq), ...prev].slice(0, 24));
      const t = setTimeout(() => setPackets((prev) => prev.filter((p) => p.id !== id)), 700);
      timersRef.current.push(t);
      return;
    }

    setPackets((prev) => [
      ...prev,
      {
        id,
        seq,
        phase: 'out',
        left: 8,
        label: `#${seq}`,
        retransmit: result.retransmitted,
      },
    ]);

    const t1 = setTimeout(() => {
      setPackets((prev) =>
        prev.map((p) =>
          p.id === id ? {...p, phase: 'return', left: 92, label: `${result.rttMs}ms`} : p,
        ),
      );
      setLog((prev) => [formatLogEntry(protocol, result, seq), ...prev].slice(0, 24));
    }, FLIGHT_MS);

    const t2 = setTimeout(() => {
      setPackets((prev) => prev.filter((p) => p.id !== id));
    }, FLIGHT_MS + RETURN_MS);

    timersRef.current.push(t1, t2);
  }, [protocol, latency, jitter, lossPct]);

  const runBurst = useCallback(async () => {
    if (running) return;
    setRunning(true);
    for (let i = 0; i < BURST_SIZE; i += 1) {
      sendOne();
      // eslint-disable-next-line no-await-in-loop
      await new Promise((r) => {
        const t = setTimeout(r, isMobile ? 280 : 200);
        timersRef.current.push(t);
      });
    }
    setRunning(false);
  }, [running, sendOne, isMobile]);

  useEffect(() => {
    if (!continuous) return undefined;
    const id = setInterval(sendOne, isMobile ? 900 : 650);
    return () => clearInterval(id);
  }, [continuous, sendOne, isMobile]);

  const packetClass = (p) => {
    if (p.phase === 'lost' || p.phase === 'lost-return') return styles.packetLost;
    if (p.retransmit) return styles.packetRetransmit;
    if (p.phase === 'return') return styles.packetReturn;
    return styles.packetFlight;
  };

  return (
    <DemoShell>
      <DemoCard
        title="Эмулятор сети: задержка, джиттер и потери"
        subtitle="Сравните поведение TCP (повторная отправка) и UDP (потеря без восстановления) — как при ping и нестабильном канале"
      >
        <div className={toolStyles.chips} style={{marginBottom: '0.75rem'}}>
          {Object.values(PROTOCOLS).map((p) => (
            <button
              key={p.id}
              type="button"
              className={clsx(toolStyles.chip, protocol === p.id && toolStyles.chipActive)}
              onClick={() => {
                setProtocol(p.id);
                reset();
              }}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className={styles.sliders}>
          <label className={styles.sliderRow}>
            <span>Задержка</span>
            <input
              type="range"
              min={5}
              max={300}
              value={latency}
              onChange={(e) => setLatency(Number(e.target.value))}
            />
            <strong>{latency} мс</strong>
          </label>
          <label className={styles.sliderRow}>
            <span>Джиттер</span>
            <input
              type="range"
              min={0}
              max={80}
              value={jitter}
              onChange={(e) => setJitter(Number(e.target.value))}
            />
            <strong>±{jitter} мс</strong>
          </label>
          <label className={styles.sliderRow}>
            <span>Потери</span>
            <input
              type="range"
              min={0}
              max={50}
              value={lossPct}
              onChange={(e) => setLossPct(Number(e.target.value))}
            />
            <strong>{lossPct}%</strong>
          </label>
        </div>

        <div className={toolStyles.toolbar}>
          <button
            type="button"
            className="it-demo__btn it-demo__btn--primary it-demo__btn--sm"
            disabled={running}
            onClick={runBurst}
          >
            Ping ×{BURST_SIZE}
          </button>
          <button
            type="button"
            className={clsx(
              'it-demo__btn it-demo__btn--sm',
              continuous ? 'it-demo__btn--primary' : 'it-demo__btn--secondary',
            )}
            onClick={() => setContinuous((c) => !c)}
          >
            {continuous ? 'Стоп поток' : 'Непрерывный пинг'}
          </button>
          <button type="button" className="it-demo__btn it-demo__btn--secondary it-demo__btn--sm" onClick={sendOne}>
            Один пакет
          </button>
          <button type="button" className="it-demo__btn it-demo__btn--secondary it-demo__btn--sm" onClick={reset}>
            Сброс
          </button>
        </div>

        <div className={styles.lane}>
          <div className={styles.host}>
            <strong>Клиент</strong>
            <span>ваш хост</span>
          </div>
          <div className={styles.track}>
            <div className={styles.trackLine} />
            {packets.map((p) => (
              <div
                key={p.id}
                className={clsx(styles.packet, packetClass(p))}
                style={{
                  left: `${p.left}%`,
                  transitionDuration: p.phase === 'return' ? `${RETURN_MS}ms` : `${FLIGHT_MS}ms`,
                }}
              >
                {p.label}
              </div>
            ))}
          </div>
          <div className={styles.host}>
            <strong>Сервер</strong>
            <span>удалённый узел</span>
          </div>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Средний RTT</div>
            <div
              className={clsx(
                styles.statValue,
                summary.avg != null && summary.avg > latency * 2
                  ? styles.statValueWarn
                  : styles.statValueGood,
              )}
            >
              {summary.avg != null ? `${summary.avg} мс` : '—'}
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Потери</div>
            <div
              className={clsx(
                styles.statValue,
                summary.lossPct > 15 ? styles.statValueBad : summary.lossPct > 5 ? styles.statValueWarn : styles.statValueGood,
              )}
            >
              {summary.sent ? `${summary.lossPct}%` : '—'}
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Повторы (TCP)</div>
            <div className={styles.statValue}>{summary.retransmitted || '—'}</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>min / p95 / max</div>
            <div className={styles.statValue} style={{fontSize: '0.88rem'}}>
              {summary.min != null
                ? `${summary.min} / ${summary.p95} / ${summary.max} мс`
                : '—'}
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Доставлено</div>
            <div className={styles.statValue}>
              {summary.sent ? `${summary.received}/${summary.sent}` : '—'}
            </div>
          </div>
        </div>

        <div className={styles.log}>
          {log.length === 0 ? (
            <div className="it-demo__hint" style={{padding: '0.5rem'}}>
              Запустите ping — в журнале появятся RTT, потери и повторные отправки TCP.
            </div>
          ) : (
            log.map((row) => (
              <div key={`${row.seq}-${row.text}`} className={styles.logRow}>
                <span className={row.cls}>{row.tag}</span>
                <span>#{row.seq}</span>
                <span>{row.text.replace(/^#\d+ \w+ — /, '')}</span>
              </div>
            ))
          )}
        </div>

        <p className="it-demo__hint" style={{marginBottom: 0, marginTop: '0.75rem'}}>
          {protocol === 'tcp'
            ? 'TCP при потере сегмента ждёт таймаут и отправляет копию снова — RTT растёт, но данные доходят. Именно поэтому веб и почта терпят "плохой Wi‑Fi".'
            : 'UDP не восстанавливает потери: датаграмма пропала — приложение должно решать само (как в VoIP или игре). Зато нет ожидания ACK.'}
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default NetworkEmulatorPlayInner;
