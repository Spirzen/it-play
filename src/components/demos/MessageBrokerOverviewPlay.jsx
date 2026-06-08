import React, {useCallback, useEffect, useRef, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  BrokerNode,
  BrokerTrack,
  SimulationLog,
  useBrokerLog,
} from './messageBrokerShared';
import styles from '@/components/demos/MessageBrokerDemo.module.css';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';

const MODES = {
  rabbit: {
    id: 'rabbit',
    label: 'RabbitMQ',
    nodes: [
      {id: 'producer', icon: '📤', title: 'Producer', hint: 'publish → exchange'},
      {id: 'broker', icon: '🐰', title: 'RabbitMQ', hint: 'exchange → queue (FIFO)'},
      {id: 'consumer', icon: '📥', title: 'Consumer', hint: 'ack после обработки'},
    ],
    tracks: ['p-b', 'b-c'],
    accent: ['var(--mb-producer)', 'var(--mb-broker)', 'var(--mb-consumer-a)'],
  },
  kafka: {
    id: 'kafka',
    label: 'Kafka',
    nodes: [
      {id: 'producer', icon: '📤', title: 'Producer', hint: 'запись в topic'},
      {id: 'broker', icon: '📚', title: 'Topic / Partition', hint: 'лог на диске, порядок в партиции'},
      {id: 'consumer', icon: '📥', title: 'Consumer Group', hint: 'чтение по offset'},
    ],
    tracks: ['p-b', 'b-c'],
    accent: ['var(--mb-producer)', 'var(--mb-partition)', 'var(--mb-consumer-b)'],
  },
};

function MessageBrokerOverviewPlayInner() {
  const [mode, setMode] = useState('rabbit');
  const [phase, setPhase] = useState(0);
  const [packetTick, setPacketTick] = useState(0);
  const [animTrack, setAnimTrack] = useState(null);
  const {logs, addLog, clearLogs} = useBrokerLog(20);
  const timersRef = useRef([]);
  const cfg = MODES[mode];

  const schedule = useCallback((fn, ms) => {
    const id = setTimeout(fn, ms);
    timersRef.current.push(id);
  }, []);

  useEffect(() => () => timersRef.current.forEach(clearTimeout), []);

  const runDemo = useCallback(() => {
    clearLogs();
    setPhase(0);
    setAnimTrack(null);
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    const msgId = Math.floor(Math.random() * 9000) + 1000;
    addLog(`Сообщение #${msgId} от Producer`, 'info');

    cfg.tracks.forEach((trackId, i) => {
      schedule(() => {
        setPhase(i + 1);
        setAnimTrack(trackId);
        setPacketTick((n) => n + 1);
        const node = cfg.nodes[i + 1];
        addLog(`${node.title}: ${node.hint}`, i === cfg.tracks.length - 1 ? 'success' : 'info');
      }, 700 * (i + 1));
    });

    schedule(() => {
      setAnimTrack(null);
      setPhase(cfg.nodes.length);
      addLog('Доставка подтверждена (ack / commit offset)', 'success');
    }, 700 * (cfg.tracks.length + 1));
  }, [addLog, cfg, clearLogs, schedule]);

  return (
    <DemoShell>
      <DemoCard
        title="Брокер сообщений: схема доставки"
        subtitle="Сравните цепочку RabbitMQ (очередь) и Kafka (топик с партициями)."
      >
        <div className={toolStyles.chips} style={{marginBottom: '0.75rem'}}>
          {Object.values(MODES).map((m) => (
            <button
              key={m.id}
              type="button"
              className={clsx(toolStyles.chip, mode === m.id && toolStyles.chipActive)}
              onClick={() => {
                setMode(m.id);
                setPhase(0);
                clearLogs();
              }}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div className={styles.root}>
          <div className={styles.flowRowCompact}>
            <BrokerNode
              icon={cfg.nodes[0].icon}
              title={cfg.nodes[0].title}
              hint={cfg.nodes[0].hint}
              active={phase >= 1}
              accent={cfg.accent[0]}
            />
            <BrokerTrack
              active={animTrack === cfg.tracks[0]}
              packetTick={packetTick}
              color={cfg.accent[0]}
              durationMs={650}
            />
            <BrokerNode
              icon={cfg.nodes[1].icon}
              title={cfg.nodes[1].title}
              hint={cfg.nodes[1].hint}
              active={phase >= 2}
              accent={cfg.accent[1]}
            />
            <BrokerTrack
              active={animTrack === cfg.tracks[1]}
              packetTick={packetTick}
              color={cfg.accent[1]}
              durationMs={650}
            />
            <BrokerNode
              icon={cfg.nodes[2].icon}
              title={cfg.nodes[2].title}
              hint={cfg.nodes[2].hint}
              active={phase >= 3}
              accent={cfg.accent[2]}
            />
          </div>
        </div>

        <div style={{marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap'}}>
          <button type="button" className="it-demo__btn it-demo__btn--primary" onClick={runDemo}>
            Отправить сообщение
          </button>
          <button
            type="button"
            className="it-demo__btn it-demo__btn--secondary"
            onClick={() => {
              clearLogs();
              setPhase(0);
            }}
          >
            Сброс
          </button>
        </div>

        <SimulationLog logs={logs} />
      </DemoCard>
    </DemoShell>
  );
}

export default MessageBrokerOverviewPlayInner;
