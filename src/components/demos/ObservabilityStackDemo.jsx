import React, {useCallback, useEffect, useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  ALERT_RULES,
  INCIDENT_SCENARIOS,
  METRIC_TYPES,
  MONITORING_TARGETS,
  buildSparklinePath,
  generateSeries,
  promqlHint,
} from '@/components/shared/kb/observabilityEngine';
import styles from '@/components/demos/ObservabilityStackDemo.module.css';

function Sparkline({values, color}) {
  const w = 200;
  const h = 48;
  const path = buildSparklinePath(values, w, h);
  const area = `${path} L${w - 2},${h - 2} L2,${h - 2} Z`;
  return (
    <svg className={styles.spark} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <path className={styles.sparkFill} d={area} style={{fill: color ? `${color}22` : undefined}} />
      <path className={styles.sparkLine} d={path} style={{stroke: color}} />
    </svg>
  );
}

function ObservabilityStackDemoInner() {
  const [tab, setTab] = useState('overview');
  const [metricType, setMetricType] = useState('gauge');
  const [scenario, setScenario] = useState('normal');
  const [scraping, setScraping] = useState(false);
  const [scrapeTick, setScrapeTick] = useState(0);
  const [targets, setTargets] = useState(MONITORING_TARGETS);
  const [alerts, setAlerts] = useState({});

  const scen = INCIDENT_SCENARIOS[scenario];
  const cpuSeries = useMemo(
    () => generateSeries(24, scen.cpu, 8, scenario === 'spike' ? 18 : -1, 1.4),
    [scenario, scen.cpu],
  );
  const errSeries = useMemo(
    () => generateSeries(24, scen.errorRate, scen.errorRate * 0.3, scenario === 'db_down' ? 20 : -1, 3),
    [scenario, scen.errorRate],
  );

  const runScrape = useCallback(() => {
    setScraping(true);
    setTargets((prev) =>
      prev.map((t) => ({
        ...t,
        up: t.id === 'worker' ? false : Math.random() > 0.05,
        latencyMs: t.up ? Math.round(2 + Math.random() * 25) : 0,
      })),
    );
    setScrapeTick((n) => n + 1);
    setTimeout(() => setScraping(false), 800);
  }, []);

  useEffect(() => {
    const next = {};
    if (scen.cpu > 80) next.cpu = 'firing';
    if (scen.errorRate > 5) next.errors = 'firing';
    if (scenario === 'db_down') next.errors = 'firing';
    setAlerts(next);
  }, [scenario, scen]);

  const tabs = [
    {id: 'overview', label: 'Три столпа'},
    {id: 'metrics', label: 'Типы метрик'},
    {id: 'monitor', label: 'Pull-мониторинг'},
    {id: 'incident', label: 'Корреляция'},
  ];

  return (
    <DemoShell className={styles.shell}>
      <DemoCard
        title="Наблюдаемость: метрики, логи, мониторинг"
        subtitle="Интерактивная модель того, как Prometheus опрашивает сервисы, какие бывают метрики и как связать цифры с событиями при инциденте">
        <div className={styles.tabs}>
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              className={clsx(styles.tab, tab === t.id && styles.tabActive)}
              onClick={() => setTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'overview' && (
          <>
            <div className={styles.pillars}>
              <div
                className={clsx(styles.pillar, styles.pillarMetrics)}
                role="button"
                tabIndex={0}
                onClick={() => setTab('metrics')}
                onKeyDown={(e) => e.key === 'Enter' && setTab('metrics')}>
                <div className={styles.pillarIcon}>📈</div>
                <div className={styles.pillarName}>Метрики</div>
                <div className={styles.pillarDesc}>
                  Числа во времени: CPU, RPS, p95. Отвечают на "что" и "сколько".
                </div>
              </div>
              <div
                className={clsx(styles.pillar, styles.pillarLogs)}
                role="button"
                tabIndex={0}
                onClick={() => setTab('incident')}>
                <div className={styles.pillarIcon}>📋</div>
                <div className={styles.pillarName}>Логи</div>
                <div className={styles.pillarDesc}>
                  События с контекстом: кто, когда, почему. Отвечают на "почему".
                </div>
              </div>
              <div
                className={clsx(styles.pillar, styles.pillarMonitor)}
                role="button"
                tabIndex={0}
                onClick={() => setTab('monitor')}>
                <div className={styles.pillarIcon}>🔔</div>
                <div className={styles.pillarName}>Мониторинг</div>
                <div className={styles.pillarDesc}>
                  Сбор, хранение, алерты. Непрерывное "всё ли в норме?"
                </div>
              </div>
            </div>
            <p className={styles.hint}>
              Метрика показывает аномалию (рост ошибок), лог объясняет причину (connection refused), мониторинг
              будит дежурного до жалоб пользователей. Вместе — наблюдаемость (observability).
            </p>
          </>
        )}

        {tab === 'metrics' && (
          <div className={styles.layout}>
            <div className={styles.metricCards}>
              {METRIC_TYPES.map((m) => (
                <div
                  key={m.id}
                  role="button"
                  tabIndex={0}
                  className={clsx(styles.metricCard, metricType === m.id && styles.metricCardActive)}
                  onClick={() => setMetricType(m.id)}
                  onKeyDown={(e) => e.key === 'Enter' && setMetricType(m.id)}>
                  <div className={styles.metricType}>{m.label}</div>
                  <div className={styles.metricDesc}>{m.desc}</div>
                  <code>{m.example}</code>
                </div>
              ))}
            </div>
            <div className={styles.panel}>
              <h5 className={styles.panelTitle}>Пример в Prometheus</h5>
              <div className={styles.promql}>{promqlHint(metricType)}</div>
              <div className={styles.sparkWrap}>
                <Sparkline
                  values={
                    metricType === 'counter'
                      ? generateSeries(24, 10, 3).map((v, i) => v + i * 2)
                      : metricType === 'histogram'
                        ? generateSeries(24, 120, 40, 15, 2.5)
                        : generateSeries(24, 55, 12)
                  }
                  color="var(--obs-metrics)"
                />
              </div>
              <p className={styles.hint}>
                {metricType === 'gauge' && 'Gauge можно читать напрямую — "сейчас свободно 4 ГБ RAM".'}
                {metricType === 'counter' && 'Counter смотрят через rate() — "за последние 5 минут 120 req/s".'}
                {metricType === 'histogram' && 'Histogram даёт перцентили — среднее 80 ms, но p99 = 2 s убивает UX.'}
              </p>
            </div>
          </div>
        )}

        {tab === 'monitor' && (
          <>
            <div className={styles.controls}>
              <button type="button" className={styles.btn} onClick={runScrape} disabled={scraping}>
                {scraping ? 'Опрос…' : '▶ Scrape /metrics'}
              </button>
              <span className={styles.hint}>Pull-модель: Prometheus сам ходит на эндпоинты каждые 15–60 с</span>
            </div>
            <div className={styles.layout}>
              <div className={styles.panel}>
                <h5 className={styles.panelTitle}>Цели (targets) · тик {scrapeTick}</h5>
                <div className={styles.scrapeList}>
                  {targets.map((t) => (
                    <div key={t.id} className={styles.scrapeRow}>
                      <span className={t.up ? styles.statusUp : styles.statusDown}>{t.up ? 'UP' : 'DOWN'}</span>
                      <span>
                        <strong>{t.name}</strong> · {t.job}
                      </span>
                      <span style={{marginLeft: 'auto'}}>{t.up ? `${t.latencyMs} ms` : '—'}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className={styles.panel}>
                <h5 className={styles.panelTitle}>Правила алертов</h5>
                <div className={styles.alertList}>
                  {ALERT_RULES.map((a) => (
                    <div
                      key={a.id}
                      className={clsx(
                        styles.alertRow,
                        alerts[a.id] === 'firing' && styles.alertFiring,
                        alerts[a.id] !== 'firing' && a.severity === 'warning' && styles.alertWarn,
                      )}>
                      <span>{a.name}</span>
                      <span>{alerts[a.id] === 'firing' ? '🔴 FIRING' : '⚪ OK'}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {tab === 'incident' && (
          <>
            <div className={styles.scenarioBtns}>
              {Object.entries(INCIDENT_SCENARIOS).map(([key, s]) => (
                <button
                  key={key}
                  type="button"
                  className={clsx(styles.scenarioBtn, scenario === key && styles.scenarioBtnActive)}
                  onClick={() => setScenario(key)}>
                  {s.label}
                </button>
              ))}
            </div>
            <div className={styles.correlation}>
              <div className={styles.corrBlock}>
                <div className={styles.panelTitle}>CPU %</div>
                <div className={styles.corrValue}>{scen.cpu}%</div>
                <Sparkline values={cpuSeries} color="#e65100" />
              </div>
              <div className={styles.corrBlock}>
                <div className={styles.panelTitle}>Ошибки %</div>
                <div className={styles.corrValue}>{scen.errorRate}%</div>
                <Sparkline values={errSeries} color="#c62828" />
              </div>
              <div className={styles.corrBlock}>
                <div className={styles.panelTitle}>QPS</div>
                <div className={styles.corrValue}>{scen.qps}</div>
                <Sparkline values={generateSeries(24, scen.qps / 4, 15)} color="#1565c0" />
              </div>
            </div>
            <div className={styles.panel} style={{marginTop: '0.75rem'}}>
              <h5 className={styles.panelTitle}>Связанные логи (пример)</h5>
              <ul style={{margin: 0, paddingLeft: '1.1rem', fontSize: '0.78rem'}}>
                {scen.logs().map((l) => (
                  <li key={l.id}>
                    <span style={{color: l.level === 'error' || l.level === 'critical' ? '#c62828' : undefined}}>
                      [{l.level.toUpperCase()}]
                    </span>{' '}
                    {l.service}: {l.message}
                  </li>
                ))}
              </ul>
            </div>
            <p className={styles.hint}>
              При "БД недоступна" метрика error rate растёт, логи показывают connection refused — без логов вы
              только видите красный график, без метрик — тонете в миллионах строк.
            </p>
          </>
        )}
      </DemoCard>
    </DemoShell>
  );
}

export default ObservabilityStackDemoInner;
