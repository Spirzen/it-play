import React, {useMemo, useState} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {simulateLoad} from '@/components/shared/kb/testingPlayEngines';
import styles from '@/components/shared/kb/testingDemo.module.css';

function LoadTestSimulatorPlayInner() {
  const [users, setUsers] = useState(100);
  const [stress, setStress] = useState(false);
  const [running, setRunning] = useState(false);
  const [tick, setTick] = useState(0);

  const metrics = useMemo(() => simulateLoad({users, stress}), [users, stress, tick]);

  const history = useMemo(() => {
    const pts = [];
    for (let i = 0; i < 12; i++) {
      const u = Math.round((users * (i + 1)) / 12);
      pts.push(simulateLoad({users: u, stress}).latencyMs);
    }
    return pts;
  }, [users, stress, tick]);

  const maxLat = Math.max(...history, 1);

  const run = () => {
    setRunning(true);
    let n = 0;
    const id = setInterval(() => {
      n += 1;
      setTick((t) => t + 1);
      if (n >= 8) {
        clearInterval(id);
        setRunning(false);
      }
    }, 400);
  };

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="JMeter: 100 виртуальных пользователей"
        subtitle="Ramp-up, RPS, перцентили и насыщение CPU"
      >
        <div className={styles.sliderRow}>
          <label>
            Потоки (пользователи): <strong>{users}</strong>
          </label>
          <input
            type="range"
            min={10}
            max={400}
            step={10}
            value={users}
            onChange={(e) => setUsers(Number(e.target.value))}
          />
        </div>
        <label style={{fontSize: '0.75rem', display: 'flex', gap: '0.35rem', alignItems: 'center'}}>
          <input type="checkbox" checked={stress} onChange={(e) => setStress(e.target.checked)} />
          Стресс-режим (нагрузка выше ёмкости)
        </label>

        <div className={styles.chart} aria-hidden>
          {history.map((h, i) => (
            <div
              key={i}
              className={styles.chartBar}
              style={{
                height: `${(h / maxLat) * 100}%`,
                background: h > metrics.latencyMs * 0.9 ? '#c62828' : 'var(--ifm-color-primary)',
              }}
            />
          ))}
        </div>

        <div className={styles.meterRow}>
          <span>Средний RT</span>
          <div className={styles.meterBar}>
            <div
              className={styles.meterFill}
              style={{width: `${Math.min(100, metrics.latencyMs / 8)}%`, background: '#1565c0'}}
            />
          </div>
          <span>{metrics.latencyMs} ms</span>
        </div>
        <div className={styles.meterRow}>
          <span>CPU</span>
          <div className={styles.meterBar}>
            <div
              className={styles.meterFill}
              style={{width: `${metrics.cpuPct}%`, background: metrics.cpuPct > 85 ? '#c62828' : '#2e7d32'}}
            />
          </div>
          <span>{metrics.cpuPct}%</span>
        </div>

        <div className={styles.detailBox}>
          RPS: <strong>{metrics.rps}</strong> · p95: {metrics.p95} ms · p99: {metrics.p99} ms · ошибки:{' '}
          <span className={metrics.errorPct > 0 ? styles.fail : styles.pass}>{metrics.errorPct.toFixed(1)}%</span>
          {metrics.overload && ' · точка насыщения пройдена'}
        </div>

        <button
          type="button"
          className="it-demo__btn it-demo__btn--primary"
          onClick={run}
          disabled={running}
        >
          {running ? 'Прогон…' : 'Старт тестового плана'}
        </button>
      </DemoCard>
    </DemoShell>
  );
}

export default LoadTestSimulatorPlayInner;
