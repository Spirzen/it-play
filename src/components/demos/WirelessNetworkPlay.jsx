import React, {useCallback, useEffect, useRef, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {SCENARIOS, TECH} from '@/components/shared/kb/wirelessNetworkEngine';
import styles from '@/components/demos/WirelessNetworkPlay.module.css';

function WirelessNetworkPlayInner() {
  const [scenarioId, setScenarioId] = useState('wifi-join');
  const [stepIndex, setStepIndex] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [spotlight, setSpotlight] = useState([]);
  const [signal, setSignal] = useState(null);
  const timers = useRef([]);

  const scenario = SCENARIOS.find((s) => s.id === scenarioId) ?? SCENARIOS[0];
  const tech = TECH[scenario.tech] ?? TECH.wifi;
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
    setSignal(step.signal ?? null);
  };

  const play = () => {
    clearTimers();
    setPlaying(true);
    const run = (i) => {
      applyStep(i);
      if (i < scenario.steps.length - 1) timers.current.push(setTimeout(() => run(i + 1), 2500));
      else timers.current.push(setTimeout(() => setPlaying(false), 2500));
    };
    timers.current.push(setTimeout(() => run(0), 280));
  };

  const active = (id) => spotlight.includes(id);

  const nodeLabel = (id) => {
    const map = {
      device: '📱 Устройство',
      ap: '📡 Точка доступа',
      router: '🌐 Роутер',
      peer: '🔵 Peer',
      phone: '📱 Телефон',
      tower1: '🗼 Сота A',
      tower2: '🗼 Сота B',
      tag: '🏷️ NFC-метка',
    };
    return map[id] ?? id;
  };

  return (
    <DemoShell className={styles.root}>
      <DemoCard title="Беспроводные сети" subtitle="Wi-Fi, Bluetooth, LTE и NFC — сравнение и типовый сценарий">
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
                  setSignal(null);
                }
              }}
              disabled={playing}
            >
              {s.short}
            </button>
          ))}
        </div>
        <div className={styles.techCard}>
          <span className={styles.techIcon}>{tech.icon}</span>
          <div>
            <strong>{tech.label}</strong>
            <p>
              {tech.band} · {tech.range} · {tech.speed}
            </p>
          </div>
        </div>
        <div className={styles.nodes}>
          {['device', 'ap', 'router', 'peer', 'phone', 'tower1', 'tower2', 'tag']
            .filter((id) => scenario.steps.some((st) => st.spotlight.includes(id)))
            .map((id) => (
              <div key={id} className={clsx(styles.node, active(id) && styles.nodeActive)}>
                {nodeLabel(id)}
              </div>
            ))}
        </div>
        {signal != null && (
          <p className={styles.signal}>
            Уровень сигнала: <strong>{signal} dBm</strong>
          </p>
        )}
        {currentStep && (
          <div className={styles.panel}>
            <strong>{currentStep.label}</strong>
            <p>{currentStep.detail}</p>
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

export default WirelessNetworkPlayInner;
