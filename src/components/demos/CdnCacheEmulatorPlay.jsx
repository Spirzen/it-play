import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  REGIONS,
  SCENARIOS,
  hitRatioSimulation,
  totalLatencyForStep,
} from '@/components/shared/kb/cdnCacheEmulatorEngine';
import styles from '@/components/demos/CdnCacheEmulatorPlay.module.css';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';

function CdnCacheEmulatorPlayInner() {
  const [scenarioId, setScenarioId] = useState('hit');
  const [regionId, setRegionId] = useState('eu');
  const [stepIndex, setStepIndex] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [spotlight, setSpotlight] = useState([]);
  const [simRequests, setSimRequests] = useState(100);
  const [simHitPct, setSimHitPct] = useState(72);
  const timers = useRef([]);

  const scenario = SCENARIOS.find((s) => s.id === scenarioId) ?? SCENARIOS[0];
  const region = REGIONS.find((r) => r.id === regionId) ?? REGIONS[0];
  const currentStep = stepIndex >= 0 ? scenario.steps[stepIndex] : null;
  const latencyMs = useMemo(
    () => totalLatencyForStep(scenarioId, stepIndex, regionId),
    [scenarioId, stepIndex, regionId],
  );
  const ratio = useMemo(() => hitRatioSimulation(simRequests, simHitPct), [simRequests, simHitPct]);

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  const schedule = useCallback((fn, ms) => {
    const id = setTimeout(fn, ms);
    timers.current.push(id);
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const reset = useCallback(() => {
    clearTimers();
    setPlaying(false);
    setStepIndex(-1);
    setSpotlight([]);
  }, [clearTimers]);

  const applyStep = useCallback(
    (index) => {
      const step = scenario.steps[index];
      if (!step) return;
      setStepIndex(index);
      setSpotlight(step.spotlight);
    },
    [scenario.steps],
  );

  const playScenario = useCallback(() => {
    clearTimers();
    reset();
    setPlaying(true);
    const run = (i) => {
      applyStep(i);
      if (i < scenario.steps.length - 1) {
        schedule(() => run(i + 1), 2400);
      } else {
        schedule(() => setPlaying(false), 2400);
      }
    };
    schedule(() => run(0), 280);
  }, [applyStep, clearTimers, reset, scenario.steps, schedule]);

  const selectScenario = (id) => {
    if (playing) return;
    setScenarioId(id);
    reset();
  };

  const stepManual = (delta) => {
    if (playing) return;
    const next = Math.max(0, Math.min(scenario.steps.length - 1, stepIndex + delta));
    applyStep(next);
  };

  const isActive = (id) => spotlight.includes(id);

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Эмулятор CDN и кеширования"
        subtitle="Путь запроса: клиент → edge (PoP) → origin. Сравните HIT, MISS, revalidate и bypass"
      >
        <div className={styles.scenarioTabs} role="tablist">
          {SCENARIOS.map((s) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={scenarioId === s.id}
              className={clsx(styles.scenarioTab, scenarioId === s.id && styles.scenarioTabActive)}
              onClick={() => selectScenario(s.id)}
              disabled={playing}
            >
              {s.short}
            </button>
          ))}
        </div>

        <p className={styles.scenarioHint}>{scenario.subtitle}</p>

        <div className={toolStyles.toolbar}>
          <span className={styles.toolbarLabel}>Регион edge:</span>
          <div className={toolStyles.chips}>
            {REGIONS.map((r) => (
              <button
                key={r.id}
                type="button"
                className={clsx(toolStyles.chip, regionId === r.id && toolStyles.chipActive)}
                onClick={() => setRegionId(r.id)}
                disabled={playing}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.diagram}>
          <div className={clsx(styles.zone, styles.zoneClient, isActive('client') && styles.zoneActive)}>
            <span className={styles.zoneTitle}>Клиент</span>
            <span className={styles.zoneSub}>Браузер / приложение</span>
          </div>
          <div className={styles.arrowRow}>
            <span className={styles.arrow}>↓</span>
            {scenario.cacheStatus && (
              <span className={clsx(styles.cacheBadge, styles[`badge_${scenario.cacheStatus}`])}>
                {scenario.cacheStatus}
              </span>
            )}
          </div>
          <div className={clsx(styles.zone, styles.zoneEdge, isActive('edge') && styles.zoneActive)}>
            <span className={styles.zoneTitle}>Edge CDN</span>
            <span className={styles.zoneSub}>{region.edge}</span>
          </div>
          <div className={styles.arrowRow}>
            <span className={styles.arrow}>
              {scenarioId === 'hit' ? '—' : '↓'}
            </span>
          </div>
          <div
            className={clsx(
              styles.zone,
              styles.zoneOrigin,
              isActive('origin') && styles.zoneActive,
              scenarioId === 'hit' && styles.zoneDim,
            )}
          >
            <span className={styles.zoneTitle}>Origin</span>
            <span className={styles.zoneSub}>origin.example.com</span>
          </div>
        </div>

        {currentStep && (
          <div className={styles.stepPanel}>
            <p className={styles.stepPhase}>{currentStep.phase}</p>
            <p className={styles.stepTitle}>{currentStep.label}</p>
            <p className={styles.stepDetail}>{currentStep.detail}</p>
            {currentStep.log && <p className={styles.stepLog}>{currentStep.log}</p>}
            {latencyMs != null && (
              <p className={styles.latency}>Суммарная задержка ≈ {latencyMs} мс (регион {region.label})</p>
            )}
          </div>
        )}

        <div className={styles.controls}>
          <button
            type="button"
            className="it-demo__btn it-demo__btn--primary"
            onClick={playScenario}
            disabled={playing}
          >
            {playing ? 'Воспроизведение…' : 'Пройти сценарий'}
          </button>
          <button
            type="button"
            className="it-demo__btn it-demo__btn--secondary"
            onClick={() => stepManual(-1)}
            disabled={playing || stepIndex <= 0}
          >
            ← Назад
          </button>
          <button
            type="button"
            className="it-demo__btn it-demo__btn--secondary"
            onClick={() => stepManual(1)}
            disabled={playing || stepIndex >= scenario.steps.length - 1}
          >
            Вперёд →
          </button>
          {stepIndex >= 0 && (
            <button type="button" className="it-demo__btn it-demo__btn--secondary" onClick={reset}>
              Сброс
            </button>
          )}
        </div>

        <div className={styles.simPanel}>
          <p className={styles.simTitle}>Модель hit-ratio на edge</p>
          <label className={styles.simRow}>
            Запросов: {simRequests}
            <input
              type="range"
              min={20}
              max={500}
              step={10}
              value={simRequests}
              onChange={(e) => setSimRequests(Number(e.target.value))}
            />
          </label>
          <label className={styles.simRow}>
            Доля HIT: {simHitPct}%
            <input
              type="range"
              min={0}
              max={100}
              value={simHitPct}
              onChange={(e) => setSimHitPct(Number(e.target.value))}
            />
          </label>
          <p className={styles.simResult}>
            Из {simRequests} запросов: <strong>{ratio.hits}</strong> из кэша,{' '}
            <strong>{ratio.misses}</strong> к origin — нагрузка на origin снижена примерно на {simHitPct}%
          </p>
        </div>

        <p className={styles.footer}>
          CDN — распределённые reverse-прокси на границе сети. Браузерный кэш работает по тем же заголовкам
          (`Cache-Control`, `ETag`), но только на устройстве пользователя.
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default CdnCacheEmulatorPlayInner;
