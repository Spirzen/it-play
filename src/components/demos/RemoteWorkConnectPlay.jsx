import React, {useCallback, useEffect, useRef, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {CONNECTION_SCENARIOS, getScenario} from '@/components/shared/kb/remoteWorkConnectEngine';
import styles from '@/components/demos/RemoteWorkConnectPlay.module.css';

const NODE_LABELS = {
  worker: '👤 Сотрудник\n(дом)',
  'home-net': '🏠 Домашняя\nсеть',
  vpn: '🔒 VPN',
  firewall: '🛡️ Firewall',
  'corp-lan': '🏢 Корп.\nсегмент',
  servers: '🖥️ Серверы\nGit · CI · RDP',
  saas: '☁️ SaaS\nSlack · Zoom',
  'vdi-gw': '🖥️ Шлюз VDI',
  'vdi-vm': '💻 Виртуальный\nрабочий стол',
  idp: '🔑 IdP / SSO',
  'zt-proxy': '🚪 ZT Proxy',
  policy: '📋 Политики',
  siem: '📊 SIEM /\nлоги',
};

function RemoteWorkConnectPlayInner() {
  const [scenarioId, setScenarioId] = useState('standard');
  const [stepIndex, setStepIndex] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [spotlight, setSpotlight] = useState([]);
  const timers = useRef([]);

  const scenario = getScenario(scenarioId);
  const currentStep = stepIndex >= 0 ? scenario.steps[stepIndex] : null;

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const reset = () => {
    clearTimers();
    setPlaying(false);
    setStepIndex(-1);
    setSpotlight([]);
  };

  const applyStep = (index) => {
    const step = scenario.steps[index];
    if (!step) return;
    setStepIndex(index);
    setSpotlight(step.spotlight ?? []);
  };

  const play = () => {
    clearTimers();
    reset();
    setPlaying(true);
    const run = (i) => {
      applyStep(i);
      if (i < scenario.steps.length - 1) {
        timers.current.push(setTimeout(() => run(i + 1), 2800));
      } else {
        timers.current.push(setTimeout(() => setPlaying(false), 2800));
      }
    };
    timers.current.push(setTimeout(() => run(0), 200));
  };

  const active = (id) => spotlight.includes(id);

  const nodesForScenario = () => {
    if (scenarioId === 'standard') {
      return ['worker', 'vpn', 'firewall', 'corp-lan', 'servers', 'saas'];
    }
    if (scenarioId === 'vdi') {
      return ['worker', 'vdi-gw', 'firewall', 'vdi-vm', 'corp-lan', 'servers'];
    }
    return ['worker', 'idp', 'zt-proxy', 'policy', 'corp-lan', 'servers', 'siem'];
  };

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Как удалёнщик подключается к серверам компании"
        subtitle="Три типовых схемы: VPN, виртуальный рабочий стол и Zero Trust"
      >
        <div className={styles.tabs}>
          {CONNECTION_SCENARIOS.map((s) => (
            <button
              key={s.id}
              type="button"
              className={clsx(styles.tab, scenarioId === s.id && styles.tabActive)}
              disabled={playing}
              onClick={() => {
                setScenarioId(s.id);
                reset();
              }}
            >
              {s.short}
            </button>
          ))}
        </div>

        <p className="it-demo__hint" style={{marginTop: 0}}>
          <strong>{scenario.title}</strong> — {scenario.subtitle}
        </p>

        <div className={styles.diagram} aria-label="Схема подключения удалённого сотрудника">
          {nodesForScenario().map((id, i, arr) => (
            <React.Fragment key={id}>
              <div className={clsx(styles.node, active(id) && styles.nodeActive)}>
                {(NODE_LABELS[id] ?? id).split('\n').map((line, j) => (
                  <span key={j}>
                    {line}
                    {j === 0 && (NODE_LABELS[id] ?? '').includes('\n') ? <br /> : null}
                  </span>
                ))}
              </div>
              {i < arr.length - 1 && <div className={styles.arrow}>→</div>}
            </React.Fragment>
          ))}
        </div>

        {currentStep && (
          <div className={styles.stepPanel}>
            <p className={styles.stepTitle}>{currentStep.label}</p>
            <p className={styles.stepDetail}>{currentStep.detail}</p>
          </div>
        )}

        <div className={styles.controls}>
          <button type="button" className="it-demo__btn it-demo__btn--primary" onClick={play} disabled={playing}>
            {playing ? 'Воспроизведение…' : 'Показать по шагам'}
          </button>
          <button
            type="button"
            className="it-demo__btn it-demo__btn--secondary"
            disabled={playing || stepIndex <= 0}
            onClick={() => applyStep(Math.max(0, stepIndex - 1))}
          >
            ← Назад
          </button>
          <button
            type="button"
            className="it-demo__btn it-demo__btn--secondary"
            disabled={playing || stepIndex >= scenario.steps.length - 1}
            onClick={() => applyStep(Math.min(scenario.steps.length - 1, stepIndex + 1))}
          >
            Вперёд →
          </button>
          <button type="button" className="it-demo__btn it-demo__btn--secondary" onClick={reset}>
            Сброс
          </button>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default RemoteWorkConnectPlayInner;
