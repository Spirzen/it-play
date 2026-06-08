import React, {useCallback, useEffect, useRef, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {SCENARIOS} from '@/components/shared/kb/cookieSessionEngine';
import styles from '@/components/demos/CookieSessionPlay.module.css';

function CookieSessionPlayInner() {
  const [scenarioId, setScenarioId] = useState('login');
  const [stepIndex, setStepIndex] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [spotlight, setSpotlight] = useState([]);
  const [cookieVal, setCookieVal] = useState(null);
  const timers = useRef([]);

  const scenario = SCENARIOS.find((s) => s.id === scenarioId) ?? SCENARIOS[0];
  const currentStep = stepIndex >= 0 ? scenario.steps[stepIndex] : null;

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
    setCookieVal(step.cookie);
  };

  const play = () => {
    clearTimers();
    setPlaying(true);
    setStepIndex(-1);
    const run = (i) => {
      applyStep(i);
      if (i < scenario.steps.length - 1) timers.current.push(setTimeout(() => run(i + 1), 2400));
      else timers.current.push(setTimeout(() => setPlaying(false), 2400));
    };
    timers.current.push(setTimeout(() => run(0), 280));
  };

  const active = (id) => spotlight.includes(id);

  return (
    <DemoShell className={styles.root}>
      <DemoCard title="Cookie и сессия" subtitle="Set-Cookie, автоматическая отправка Cookie и завершение сеанса">
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
                  setCookieVal(null);
                }
              }}
              disabled={playing}
            >
              {s.short}
            </button>
          ))}
        </div>
        <div className={styles.diagram}>
          <div className={clsx(styles.zone, active('browser') && styles.zoneActive)}>
            <span>🌐 Браузер</span>
            <code className={styles.jar}>
              {cookieVal ? `Cookie: session_id=${cookieVal}` : 'cookie-jar пуст'}
            </code>
          </div>
          <div className={styles.httpLine}>
            {stepIndex >= 0 ? 'HTTP ⇄' : '—'}
          </div>
          <div className={clsx(styles.zone, active('server') && styles.zoneActive)}>🖥️ Сервер</div>
          {scenarioId === 'third-party' && (
            <div className={clsx(styles.zone, styles.tracker, active('tracker') && styles.zoneActive)}>
              📊 tracker.net
            </div>
          )}
        </div>
        {currentStep && (
          <div className={styles.panel}>
            <strong>{currentStep.label}</strong>
            <p className={styles.mono}>{currentStep.detail}</p>
            <p>{currentStep.log}</p>
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

export default CookieSessionPlayInner;
