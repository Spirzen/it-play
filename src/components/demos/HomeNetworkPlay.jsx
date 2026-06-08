import React, {useCallback, useEffect, useRef, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {HOME_NODES, HOME_SCENARIOS} from '@/components/shared/kb/homeNetworkEngine';
import styles from '@/components/demos/HomeNetworkPlay.module.css';

function HomeNetworkPlayInner() {
  const [scenarioId, setScenarioId] = useState('files');
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timers = useRef([]);

  const scenario = HOME_SCENARIOS.find((s) => s.id === scenarioId) ?? HOME_SCENARIOS[0];
  const step = scenario.steps[stepIndex] ?? scenario.steps[0];
  const activeSet = new Set(step?.active ?? []);

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const play = () => {
    clearTimers();
    setPlaying(true);
    setStepIndex(0);
    const run = (i) => {
      setStepIndex(i);
      if (i < scenario.steps.length - 1) {
        timers.current.push(setTimeout(() => run(i + 1), 2200));
      } else {
        timers.current.push(setTimeout(() => setPlaying(false), 2200));
      }
    };
    timers.current.push(setTimeout(() => run(0), 200));
  };

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Домашняя сеть"
        subtitle="Топология LAN и типовые сценарии — файлы, печать, игры без интернета"
      >
        <div className={styles.tabs}>
          {HOME_SCENARIOS.map((s) => (
            <button
              key={s.id}
              type="button"
              className={clsx(styles.tab, scenarioId === s.id && styles.tabActive)}
              disabled={playing}
              onClick={() => {
                setScenarioId(s.id);
                setStepIndex(0);
              }}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className={styles.topology}>
          {HOME_NODES.map((n) => (
            <div
              key={n.id}
              className={clsx(
                styles.node,
                styles[`pos_${n.row}_${n.col}`],
                activeSet.has(n.id) && styles.nodeActive,
                n.id === 'internet' && !activeSet.has('internet') && scenarioId === 'offline' && styles.nodeDim,
              )}
            >
              <span className={styles.nodeIcon}>{n.icon}</span>
              <span className={styles.nodeLabel}>{n.label}</span>
            </div>
          ))}
        </div>

        <div className={styles.panel}>
          <p className={styles.panelTitle}>{scenario.title}</p>
          <p className={styles.stepLabel}>{step?.label}</p>
          <p className={styles.detail}>{step?.detail}</p>
        </div>

        <div className={styles.controls}>
          <button type="button" className={styles.btn} onClick={play} disabled={playing}>
            {playing ? 'Воспроизведение…' : '▶ Сценарий'}
          </button>
          <button
            type="button"
            className={styles.btn}
            disabled={playing || stepIndex === 0}
            onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
          >
            ←
          </button>
          <button
            type="button"
            className={styles.btn}
            disabled={playing || stepIndex >= scenario.steps.length - 1}
            onClick={() => setStepIndex((i) => Math.min(scenario.steps.length - 1, i + 1))}
          >
            →
          </button>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default HomeNetworkPlayInner;
