import React, {useMemo, useState} from 'react';

import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';


import styles from '@/components/demos/ResourceMetricsDemo.module.css';

const SCENARIOS = {
  normal: {
    label: 'Норма',
    cpu: 28,
    mem: 54,
    disk: 62,
    net: 35,
    iops: 420,
    latency: 8,
    notes: 'Штатная нагрузка',
  },
  leak: {
    label: 'Утечка памяти',
    cpu: 42,
    mem: 91,
    disk: 58,
    net: 40,
    iops: 380,
    latency: 12,
    notes: 'RAM растёт, swap активен',
  },
  disk: {
    label: 'Диск перегружен',
    cpu: 55,
    mem: 60,
    disk: 94,
    net: 30,
    iops: 2100,
    latency: 85,
    notes: 'Высокий iowait, очередь I/O',
  },
  ddos: {
    label: 'Сетевой всплеск',
    cpu: 72,
    mem: 48,
    disk: 45,
    net: 88,
    iops: 500,
    latency: 4,
    notes: 'Пакеты/с, retransmits',
  },
};

function GaugeRing({value, color, label}) {
  const r = 36;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <svg className={styles.ring} viewBox="0 0 88 88">
      <circle cx="44" cy="44" r={r} fill="none" stroke="var(--ifm-color-emphasis-200)" strokeWidth="8" />
      <circle
        cx="44"
        cy="44"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="8"
        strokeDasharray={c}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 44 44)"
      />
      <text x="44" y="48" textAnchor="middle" fontSize="14" fontWeight="700" fill="currentColor">
        {value}%
      </text>
      <title>{label}</title>
    </svg>
  );
}

function ResourceMetricsDemoInner() {
  const [scenario, setScenario] = useState('normal');
  const s = SCENARIOS[scenario];

  const warn = useMemo(
    () => ({
      cpu: s.cpu > 80,
      mem: s.mem > 85,
      disk: s.disk > 90,
      net: s.net > 75,
    }),
    [s],
  );

  return (
    <DemoShell className={styles.shell}>
      <DemoCard
        title="Ресурсы и метрики хоста"
        subtitle="CPU, память, диск и сеть — что измеряют и какие симптомы указывают на проблему">
        <div className={styles.scenarios}>
          {Object.entries(SCENARIOS).map(([key, sc]) => (
            <button
              key={key}
              type="button"
              className={clsx(styles.scenarioBtn, scenario === key && styles.scenarioActive)}
              style={scenario === key ? {borderColor: 'var(--rm-cpu)'} : undefined}
              onClick={() => setScenario(key)}>
              {sc.label}
            </button>
          ))}
        </div>

        <div className={styles.gauges}>
          <div className={styles.gauge}>
            <div className={styles.gaugeHeader}>
              <span className={styles.gaugeTitle} style={{color: 'var(--rm-cpu)'}}>
                CPU
              </span>
              <span className={styles.gaugeValue} style={{color: warn.cpu ? '#c62828' : undefined}}>
                {s.cpu}%
              </span>
            </div>
            <GaugeRing value={s.cpu} color="var(--rm-cpu)" label="CPU" />
            <div className={styles.barTrack}>
              <div className={styles.barFill} style={{width: `${s.cpu}%`, background: 'var(--rm-cpu)'}} />
            </div>
          </div>
          <div className={styles.gauge}>
            <div className={styles.gaugeHeader}>
              <span className={styles.gaugeTitle} style={{color: 'var(--rm-mem)'}}>
                Память
              </span>
              <span className={styles.gaugeValue} style={{color: warn.mem ? '#c62828' : undefined}}>
                {s.mem}%
              </span>
            </div>
            <GaugeRing value={s.mem} color="var(--rm-mem)" label="RAM" />
            <div className={styles.barTrack}>
              <div className={styles.barFill} style={{width: `${s.mem}%`, background: 'var(--rm-mem)'}} />
            </div>
          </div>
          <div className={styles.gauge}>
            <div className={styles.gaugeHeader}>
              <span className={styles.gaugeTitle} style={{color: 'var(--rm-disk)'}}>
                Диск
              </span>
              <span className={styles.gaugeValue} style={{color: warn.disk ? '#c62828' : undefined}}>
                {s.disk}%
              </span>
            </div>
            <GaugeRing value={s.disk} color="var(--rm-disk)" label="Disk" />
            <div className={styles.barTrack}>
              <div className={styles.barFill} style={{width: `${s.disk}%`, background: 'var(--rm-disk)'}} />
            </div>
          </div>
          <div className={styles.gauge}>
            <div className={styles.gaugeHeader}>
              <span className={styles.gaugeTitle} style={{color: 'var(--rm-net)'}}>
                Сеть
              </span>
              <span className={styles.gaugeValue}>{s.net}%</span>
            </div>
            <GaugeRing value={s.net} color="var(--rm-net)" label="Network" />
            <div className={styles.barTrack}>
              <div className={styles.barFill} style={{width: `${s.net}%`, background: 'var(--rm-net)'}} />
            </div>
          </div>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Метрика</th>
              <th>Значение</th>
              <th>Интерпретация</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>IOPS</td>
              <td>{s.iops}</td>
              <td>{s.iops > 1500 ? 'Перегрузка диска' : 'В пределах нормы'}</td>
            </tr>
            <tr>
              <td>Latency (disk)</td>
              <td>{s.latency} ms</td>
              <td>{s.latency > 50 ? 'Очередь запросов, фрагментация' : 'Быстрый отклик'}</td>
            </tr>
            <tr>
              <td>Сценарий</td>
              <td colSpan={2}>{s.notes}</td>
            </tr>
          </tbody>
        </table>

        <p className={styles.hint}>
          CPU 95% без роста RPS — подозрение на утечку или бесконечный цикл. Память + swap — нехватка RAM. Высокий
          IOPS при низком throughput — мелкие случайные чтения. Смотрите метрики вместе, а не по одной.
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default ResourceMetricsDemoInner;
