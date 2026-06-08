import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {simulateLoad} from '@/components/shared/kb/testingPlayEngines';
import styles from '@/components/shared/kb/testingDemo.module.css';

function LoadStressMetricsPlayInner() {
  const [mode, setMode] = useState('load');
  const [users, setUsers] = useState(800);

  const loadM = useMemo(() => simulateLoad({users: Math.round(users * 0.6), stress: false}), [users]);
  const stressM = useMemo(() => simulateLoad({users, stress: true}), [users]);
  const m = mode === 'load' ? loadM : stressM;

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Нагрузка vs стресс"
        subtitle="RPS, перцентили latency, ошибки и восстановление"
      >
        <div className={styles.grid2}>
          <button
            type="button"
            className={clsx(styles.card, mode === 'load' && styles.cardActive)}
            onClick={() => setMode('load')}
          >
            <span className={styles.cardLabel}>Нагрузочный</span>
            <p className={styles.cardHint}>Ожидаемая нагрузка, SLA в норме</p>
          </button>
          <button
            type="button"
            className={clsx(styles.card, mode === 'stress' && styles.cardActive)}
            onClick={() => setMode('stress')}
          >
            <span className={styles.cardLabel}>Стресс</span>
            <p className={styles.cardHint}>×10 трафика, ищем точку отказа</p>
          </button>
        </div>

        <div className={styles.sliderRow}>
          <label>Виртуальных пользователей: {users}</label>
          <input type="range" min={100} max={2000} step={50} value={users} onChange={(e) => setUsers(+e.target.value)} />
        </div>

        <table style={{width: '100%', fontSize: '0.75rem', borderCollapse: 'collapse'}}>
          <thead>
            <tr>
              <th align="left">Метрика</th>
              <th align="right">Значение</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>RPS</td>
              <td align="right">{m.rps}</td>
            </tr>
            <tr>
              <td>Latency (медиана)</td>
              <td align="right">{m.latencyMs} ms</td>
            </tr>
            <tr>
              <td>p95 / p99</td>
              <td align="right">
                {m.p95} / {m.p99} ms
              </td>
            </tr>
            <tr>
              <td>Ошибки 5xx</td>
              <td align="right" className={m.errorPct > 0 ? styles.fail : styles.pass}>
                {m.errorPct.toFixed(1)}%
              </td>
            </tr>
            <tr>
              <td>CPU</td>
              <td align="right">{m.cpuPct}%</td>
            </tr>
          </tbody>
        </table>
        {m.overload && (
          <p className={styles.formError}>Точка насыщения пройдена — нужен graceful degradation или масштабирование.</p>
        )}
        {!m.overload && mode === 'stress' && users < 1200 && (
          <p className={styles.cardHint}>Увеличьте пользователей, чтобы увидеть деградацию.</p>
        )}
      </DemoCard>
    </DemoShell>
  );
}

export default LoadStressMetricsPlayInner;
