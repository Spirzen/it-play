import React, {useMemo, useState} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {DEFAULT_METRICS, scoreSupportHealth} from '@/components/shared/kb/techSupportEngines';
import styles from '@/components/shared/kb/techSupportDemo.module.css';

const METRIC_DEFS = [
  {key: 'mttr', label: 'MTTR (ч)', hint: 'Среднее время решения', min: 0.5, max: 24, step: 0.5},
  {key: 'frt', label: 'FRT (мин)', hint: 'Первый ответ', min: 1, max: 120, step: 1},
  {key: 'sla', label: 'SLA %', hint: 'Соблюдение сроков', min: 50, max: 100, step: 1},
  {key: 'csat', label: 'CSAT (1–5)', hint: 'Удовлетворённость', min: 1, max: 5, step: 0.1},
  {key: 'nps', label: 'NPS', hint: '−100…+100', min: -50, max: 80, step: 1},
  {key: 'rwe', label: 'RwE %', hint: 'Решено на L1', min: 20, max: 95, step: 1},
];

function TechSupportMetricsPlayInner() {
  const [metrics, setMetrics] = useState(DEFAULT_METRICS);
  const health = useMemo(() => scoreSupportHealth(metrics), [metrics]);

  const setMetric = (key, value) => {
    setMetrics((m) => ({...m, [key]: Number(value)}));
  };

  const healthColor =
    health >= 75 ? '#2e7d32' : health >= 50 ? '#ed6c02' : '#c62828';

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="KPI техподдержки"
        subtitle="Подкрутите метрики и посмотрите интегральную оценку сервиса"
      >
        <div className={styles.healthRing}>
          <span className={styles.healthValue} style={{color: healthColor}}>
            {health}
          </span>
          <span className={styles.healthLabel}>индекс качества поддержки</span>
        </div>

        {METRIC_DEFS.map((def) => (
          <div key={def.key} className={styles.sliderRow}>
            <label>
              <span title={def.hint}>{def.label}</span>
              <strong>{metrics[def.key]}</strong>
            </label>
            <input
              type="range"
              min={def.min}
              max={def.max}
              step={def.step}
              value={metrics[def.key]}
              onChange={(e) => setMetric(def.key, e.target.value)}
            />
          </div>
        ))}

        <div className={styles.detailBox}>
          <p className={styles.detailTitle}>Как читать показатели</p>
          <p className={styles.detailText}>
            <strong>MTTR</strong> — полное закрытие инцидента; снижать "любой ценой" опасно.
            <strong> FRT</strong> — восприятие скорости, даже если решение долгое.
            <strong> CSAT</strong> чувствителен к эмоциям; <strong>NPS</strong> — долгосрочная
            лояльность. <strong>RwE</strong> растёт при сильной базе знаний и обучении L1.
          </p>
        </div>

        <p className={styles.footer}>
          Зрелые организации сочетают KPI и качественный feedback на ежемесячных разборах сервисов.
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default TechSupportMetricsPlayInner;
