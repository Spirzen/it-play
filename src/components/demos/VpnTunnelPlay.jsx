import React, {useCallback, useEffect, useRef, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {PROTOCOLS, SCENARIOS} from '@/components/shared/kb/vpnTunnelEngine';
import styles from '@/components/demos/VpnTunnelPlay.module.css';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';

function VpnTunnelPlayInner() {
  const [scenarioId, setScenarioId] = useState('handshake');
  const [protocolId, setProtocolId] = useState('wireguard');
  const [stepIndex, setStepIndex] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [spotlight, setSpotlight] = useState([]);
  const [encrypted, setEncrypted] = useState(false);
  const timers = useRef([]);

  const scenario = SCENARIOS.find((s) => s.id === scenarioId) ?? SCENARIOS[0];
  const protocol = PROTOCOLS.find((p) => p.id === protocolId) ?? PROTOCOLS[0];
  const currentStep = stepIndex >= 0 ? scenario.steps[stepIndex] : null;

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  const schedule = useCallback((fn, ms) => {
    timers.current.push(setTimeout(fn, ms));
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const reset = useCallback(() => {
    clearTimers();
    setPlaying(false);
    setStepIndex(-1);
    setSpotlight([]);
    setEncrypted(false);
  }, [clearTimers]);

  const applyStep = useCallback(
    (index) => {
      const step = scenario.steps[index];
      if (!step) return;
      setStepIndex(index);
      setSpotlight(step.spotlight);
      setEncrypted(Boolean(step.encrypted));
    },
    [scenario.steps],
  );

  const playScenario = useCallback(() => {
    clearTimers();
    reset();
    setPlaying(true);
    const run = (i) => {
      applyStep(i);
      if (i < scenario.steps.length - 1) schedule(() => run(i + 1), 2600);
      else schedule(() => setPlaying(false), 2600);
    };
    schedule(() => run(0), 300);
  }, [applyStep, clearTimers, reset, scenario.steps, schedule]);

  const isActive = (id) => spotlight.includes(id);

  return (
    <DemoShell className={styles.root}>
      <DemoCard title="Эмулятор VPN-туннеля" subtitle="Туннелирование, шифрование и маршруты — без инструкций по обходу блокировок">
        <div className={styles.scenarioTabs}>
          {SCENARIOS.map((s) => (
            <button
              key={s.id}
              type="button"
              className={clsx(styles.scenarioTab, scenarioId === s.id && styles.scenarioTabActive)}
              onClick={() => {
                if (!playing) {
                  setScenarioId(s.id);
                  reset();
                }
              }}
              disabled={playing}
            >
              {s.short}
            </button>
          ))}
        </div>
        <div className={toolStyles.toolbar}>
          <div className={toolStyles.chips}>
            {PROTOCOLS.map((p) => (
              <button
                key={p.id}
                type="button"
                className={clsx(toolStyles.chip, protocolId === p.id && toolStyles.chipActive)}
                onClick={() => setProtocolId(p.id)}
                disabled={playing}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
        <p className={styles.cipher}>Шифр: {protocol.cipher}</p>
        <div className={styles.diagram}>
          <div className={clsx(styles.node, isActive('client') && styles.nodeActive)}>💻 Клиент</div>
          <div className={clsx(styles.tunnel, encrypted && styles.tunnelOn)}>
            {encrypted ? '🔒 Туннель' : '— канал —'}
          </div>
          <div className={clsx(styles.node, isActive('gateway') && styles.nodeActive)}>🚪 VPN-шлюз</div>
          {(scenarioId !== 'split' || isActive('corp') || isActive('internet')) && (
            <>
              <div className={styles.branch}>
                <div className={clsx(styles.node, isActive('corp') && styles.nodeActive)}>🏢 Корп. LAN</div>
                <div
                  className={clsx(
                    styles.node,
                    isActive('internet') && styles.nodeActive,
                    currentStep?.leak && styles.nodeLeak,
                  )}
                >
                  🌐 Интернет
                </div>
              </div>
            </>
          )}
        </div>
        {currentStep && (
          <div className={styles.stepPanel}>
            <p className={styles.stepTitle}>{currentStep.label}</p>
            <p className={styles.stepDetail}>{currentStep.detail}</p>
            {currentStep.log && <p className={styles.stepLog}>{currentStep.log}</p>}
          </div>
        )}
        <div className={styles.controls}>
          <button type="button" className="it-demo__btn it-demo__btn--primary" onClick={playScenario} disabled={playing}>
            {playing ? '…' : 'Пройти сценарий'}
          </button>
          <button
            type="button"
            className="it-demo__btn it-demo__btn--secondary"
            onClick={() => !playing && applyStep(Math.max(0, stepIndex - 1))}
            disabled={playing || stepIndex <= 0}
          >
            ←
          </button>
          <button
            type="button"
            className="it-demo__btn it-demo__btn--secondary"
            onClick={() => !playing && applyStep(Math.min(scenario.steps.length - 1, stepIndex + 1))}
            disabled={playing || stepIndex >= scenario.steps.length - 1}
          >
            →
          </button>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default VpnTunnelPlayInner;
