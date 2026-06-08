import React, {useCallback, useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {computePercentiles, simulateRequestLatencies} from '@/components/shared/kb/observabilityEngine';
import styles from '@/components/demos/WebMetricsDemo.module.css';

function WebMetricsDemoInner() {
  const [concurrency, setConcurrency] = useState(0.3);
  const [tick, setTick] = useState(0);
  const [history, setHistory] = useState(() => Array(20).fill(80));

  const samples = useMemo(
    () => simulateRequestLatencies(200, 80 + concurrency * 120, concurrency),
    [concurrency, tick],
  );
  const {p50, p95, p99, max} = useMemo(() => computePercentiles(samples), [samples]);

  const qps = Math.round(80 + concurrency * 280 + Math.sin(tick * 0.3) * 20);
  const tps = Math.round(qps * (0.92 - concurrency * 0.15));
  const errorPct = Math.round((concurrency > 0.75 ? 4 + Math.random() * 8 : 0.2 + concurrency * 1.5) * 10) / 10;

  const runLoad = useCallback(() => {
    setTick((t) => t + 1);
    setHistory((h) => [...h.slice(-19), Math.round(p95)]);
  }, [p95]);

  return (
    <DemoShell className={styles.shell}>
      <DemoCard
        title="Метрики веб-приложения"
        subtitle="QPS, TPS, перцентили задержки и влияние параллелизма — как оценивают производительность API">
        <div className={styles.sliderRow}>
          <label htmlFor="concurrency-slider">
            <strong>Нагрузка (concurrency)</strong>
          </label>
          <input
            id="concurrency-slider"
            type="range"
            min="0"
            max="100"
            value={Math.round(concurrency * 100)}
            className={styles.slider}
            onChange={(e) => setConcurrency(Number(e.target.value) / 100)}
          />
          <span>{Math.round(concurrency * 100)}%</span>
          <button type="button" className={styles.btn} onClick={runLoad}>
            Симулировать запросы
          </button>
        </div>

        <div className={styles.grid}>
          <div className={styles.stat}>
            <div className={styles.statLabel}>QPS</div>
            <div className={styles.statValue}>{qps}</div>
            <div className={styles.statSub}>запросов / сек</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statLabel}>TPS</div>
            <div className={styles.statValue}>{tps}</div>
            <div className={styles.statSub}>успешных транзакций</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statLabel}>Ошибки</div>
            <div className={styles.statValue} style={{color: errorPct > 3 ? '#c62828' : undefined}}>
              {errorPct}%
            </div>
            <div className={styles.statSub}>HTTP 5xx</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statLabel}>Активные</div>
            <div className={styles.statValue}>{Math.round(20 + concurrency * 180)}</div>
            <div className={styles.statSub}>соединений</div>
          </div>
        </div>

        <div className={styles.grid}>
          <div className={styles.stat}>
            <div className={styles.statLabel}>p50</div>
            <div className={styles.statValue}>{p50} ms</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statLabel}>p95</div>
            <div className={styles.statValue} style={{color: p95 > 500 ? '#c62828' : undefined}}>
              {p95} ms
            </div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statLabel}>p99</div>
            <div className={styles.statValue}>{p99} ms</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statLabel}>max</div>
            <div className={styles.statValue}>{max} ms</div>
          </div>
        </div>

        <div className={styles.chart}>
          {history.map((v, i) => (
            <div
              key={`${i}-${v}`}
              className={clsx(styles.bar, v > 500 && styles.barSlow)}
              style={{height: `${Math.min(100, (v / 800) * 100)}%`}}
              title={`p95: ${v} ms`}
            />
          ))}
        </div>
        <div className={styles.legend}>
          <span>График: p95 latency по последним прогонам</span>
          <span>SLO: p95 &lt; 500 ms</span>
        </div>

        <p className={styles.hint}>
          Высокий QPS при плохом p99 означает: большинство запросов быстрые, но "хвост" медленных портит опыт. TPS
          ниже QPS, если часть запросов не завершает бизнес-транзакцию. При concurrency &gt; 75% растут очереди и ошибки.
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default WebMetricsDemoInner;
