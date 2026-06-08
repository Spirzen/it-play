import React, {useCallback, useEffect, useRef, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {SCENARIOS} from '@/components/shared/kb/proxyServerEngine';
import styles from '@/components/demos/ProxyServerPlay.module.css';

function ProxyServerPlayInner() {
  const [scenarioId, setScenarioId] = useState('forward-hit');
  const [stepIndex, setStepIndex] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [spotlight, setSpotlight] = useState([]);
  const timers = useRef([]);

  const scenario = SCENARIOS.find((s) => s.id === scenarioId) ?? SCENARIOS[0];
  const currentStep = stepIndex >= 0 ? scenario.steps[stepIndex] : null;
  const isReverse = scenario.mode === 'reverse';

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const applyStep = (index) => {
    const step = scenario.steps[index];
    if (!step) return;
    setStepIndex(index);
    setSpotlight(step.spotlight);
  };

  const play = () => {
    clearTimers();
    setPlaying(true);
    setStepIndex(-1);
    const run = (i) => {
      applyStep(i);
      if (i < scenario.steps.length - 1) {
        timers.current.push(setTimeout(() => run(i + 1), 2400));
      } else {
        timers.current.push(setTimeout(() => setPlaying(false), 2400));
      }
    };
    timers.current.push(setTimeout(() => run(0), 280));
  };

  const active = (id) => spotlight.includes(id);

  return (
    <DemoShell className={styles.root}>
      <DemoCard title="Эмулятор прокси-сервера" subtitle="Forward-прокси, reverse-прокси и туннель CONNECT">
        <div className={styles.tabs}>
          {SCENARIOS.map((s) => (
            <button
              key={s.id}
              type="button"
              className={clsx(styles.tab, scenarioId === s.id && styles.tabActive)}
              onClick={() => {
                if (!playing) {
                  setScenarioId(s.id);
                  setStepIndex(-1);
                  setSpotlight([]);
                }
              }}
              disabled={playing}
            >
              {s.short}
            </button>
          ))}
        </div>
        <p className={styles.mode}>{isReverse ? 'Режим: reverse (точка входа)' : 'Режим: forward (исходящий)'}</p>
        <div className={styles.row}>
          <div className={clsx(styles.box, active('client') && styles.boxActive)}>Клиент</div>
          <span className={styles.arr}>→</span>
          <div className={clsx(styles.box, styles.boxProxy, active('proxy') && styles.boxActive)}>Прокси</div>
          {!isReverse && scenarioId !== 'connect' && (
            <>
              <span className={styles.arr}>→</span>
              <div className={clsx(styles.box, active('origin') && styles.boxActive)}>Origin</div>
            </>
          )}
          {isReverse && (
            <>
              <span className={styles.arr}>→</span>
              <div className={clsx(styles.box, active('origin') && styles.boxActive)}>Backend</div>
            </>
          )}
        </div>
        {currentStep && (
          <div className={styles.panel}>
            <strong>{currentStep.label}</strong>
            <p>{currentStep.detail}</p>
            <p className={styles.log}>{currentStep.log}</p>
          </div>
        )}
        <div className={styles.controls}>
          <button type="button" className="it-demo__btn it-demo__btn--primary" onClick={play} disabled={playing}>
            {playing ? '…' : 'Пройти'}
          </button>
          <button
            type="button"
            className="it-demo__btn it-demo__btn--secondary"
            onClick={() => applyStep(Math.max(0, stepIndex - 1))}
            disabled={playing || stepIndex <= 0}
          >
            ←
          </button>
          <button
            type="button"
            className="it-demo__btn it-demo__btn--secondary"
            onClick={() => applyStep(Math.min(scenario.steps.length - 1, stepIndex + 1))}
            disabled={playing || stepIndex >= scenario.steps.length - 1}
          >
            →
          </button>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default ProxyServerPlayInner;
