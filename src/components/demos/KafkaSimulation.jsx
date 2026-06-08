import React, {useCallback, useEffect, useRef, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import styles from '@/components/demos/MessageBrokerDemo.module.css';
import {
  BrokerNode,
  BrokerTrack,
  SimulationLog,
  StatsBar,
  StepBar,
  useBrokerLog,
} from './messageBrokerShared';

const BROKERS_COUNT = 3;
const PARTITIONS_COUNT = 3;
const CONSUMERS_COUNT = 2;
const TOPIC = 'orders';

const STEPS = [
  {id: 'init', label: '1. Кластер', hint: '3 brokers'},
  {id: 'ready', label: '2. Запись', hint: 'Producer → partition'},
  {id: 'processing', label: '3. Чтение', hint: 'Consumer group'},
  {id: 'commit', label: '4. Offset', hint: 'commit sync'},
];

function partitionColor(messages) {
  if (messages.length === 0) return 'var(--mb-partition)';
  if (messages.some((m) => m.status === 'processing')) return '#bf360c';
  return '#e65100';
}

function KafkaSimulationInner() {
  const [phase, setPhase] = useState('init');
  const [partitions, setPartitions] = useState([]);
  const [consumers, setConsumers] = useState([]);
  const [activeConsumerId, setActiveConsumerId] = useState(null);
  const [packetTick, setPacketTick] = useState(0);
  const [animTrack, setAnimTrack] = useState(null);
  const [brokerSync, setBrokerSync] = useState(null);
  const [committedTotal, setCommittedTotal] = useState(0);
  const [lastPartition, setLastPartition] = useState('—');

  const {logs, addLog, clearLogs} = useBrokerLog();
  const timersRef = useRef([]);
  const busyRef = useRef(false);
  const initializedRef = useRef(false);

  const bumpPacket = useCallback(() => setPacketTick((n) => n + 1), []);

  const schedule = useCallback((fn, ms) => {
    const id = setTimeout(fn, ms);
    timersRef.current.push(id);
    return id;
  }, []);

  useEffect(() => {
    return () => timersRef.current.forEach(clearTimeout);
  }, []);

  const flashTrack = useCallback(
    (trackId, durationMs = 900) => {
      setAnimTrack(trackId);
      bumpPacket();
      schedule(() => setAnimTrack(null), durationMs);
    },
    [bumpPacket, schedule],
  );

  const initSystem = useCallback(() => {
    setPhase('init');
    addLog('🚀 Запуск кластера Apache Kafka (KRaft)…', 'info');

    schedule(() => {
      const initialPartitions = Array.from({length: PARTITIONS_COUNT}, (_, i) => ({
        id: i,
        leaderBrokerId: (i % BROKERS_COUNT) + 1,
        messages: [],
        nextOffset: 0,
      }));

      const initialConsumers = Array.from({length: CONSUMERS_COUNT}, (_, i) => ({
        id: `consumer-${i + 1}`,
        assignedPartitionIds: initialPartitions
          .filter((_, idx) => idx % CONSUMERS_COUNT === i)
          .map((p) => p.id),
        status: 'idle',
        color: i === 0 ? 'var(--mb-consumer-a)' : 'var(--mb-consumer-b)',
      }));

      setPartitions(initialPartitions);
      setConsumers(initialConsumers);
      setBrokerSync('all');
      schedule(() => setBrokerSync(null), 800);

      addLog(`✅ ${BROKERS_COUNT} брокера в строю`, 'success');
      addLog(`Топик "${TOPIC}": ${PARTITIONS_COUNT} партиции, replication-factor=3`, 'success');
      addLog('Consumer group "order-processors": rebalance завершён', 'info');
      initialPartitions.forEach((p) => {
        const c = initialConsumers.find((consumer) => consumer.assignedPartitionIds.includes(p.id));
        if (c) addLog(`   partition ${p.id} → ${c.id} (leader: broker-${p.leaderBrokerId})`, 'info');
      });

      setPhase('ready');
    }, 1400);
  }, [addLog, schedule]);

  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      initSystem();
    }
  }, [initSystem]);

  const processNext = useCallback(() => {
    if (busyRef.current) return;

    let targetPartition = null;
    let targetConsumer = null;

    for (const p of partitions) {
      if (p.messages.some((m) => m.status === 'pending')) {
        targetPartition = p;
        targetConsumer = consumers.find(
          (c) => c.assignedPartitionIds?.includes(p.id) && c.status === 'idle',
        );
        if (targetConsumer) break;
      }
    }

    if (!targetPartition || !targetConsumer) {
      setPhase('ready');
      setActiveConsumerId(null);
      return;
    }

    busyRef.current = true;
    setPhase('processing');

    const msgIndex = targetPartition.messages.findIndex((m) => m.status === 'pending');
    const currentMsg = targetPartition.messages[msgIndex];
    const offset = targetPartition.nextOffset + msgIndex;

    setActiveConsumerId(targetConsumer.id);
    flashTrack(`partition-${targetPartition.id}`, 1000);
    addLog(
      `${targetConsumer.id} poll partition ${targetPartition.id} @ offset ${offset} → "${currentMsg.shortId}"`,
      'info',
    );

    setPartitions((prev) =>
      prev.map((p) => {
        if (p.id !== targetPartition.id) return p;
        const updated = [...p.messages];
        updated[msgIndex] = {...updated[msgIndex], status: 'processing', consumerId: targetConsumer.id};
        return {...p, messages: updated};
      }),
    );

    setConsumers((prev) =>
      prev.map((c) => (c.id === targetConsumer.id ? {...c, status: 'processing'} : c)),
    );

    schedule(() => {
      setPhase('commit');
      addLog(
        `${targetConsumer.id} commit offset ${offset + 1} для partition ${targetPartition.id}`,
        'success',
      );
      setCommittedTotal((n) => n + 1);

      setPartitions((prev) =>
        prev.map((p) => {
          if (p.id !== targetPartition.id) return p;
          return {
            ...p,
            messages: p.messages.filter((_, idx) => idx !== msgIndex),
            nextOffset: p.nextOffset + 1,
          };
        }),
      );

      setConsumers((prev) =>
        prev.map((c) => (c.id === targetConsumer.id ? {...c, status: 'idle'} : c)),
      );
      setActiveConsumerId(null);
      busyRef.current = false;

      schedule(() => {
        setPhase('ready');
        setPartitions((current) => {
          const any = current.some((p) => p.messages.some((m) => m.status === 'pending'));
          if (any) schedule(() => processNext(), 500);
          return current;
        });
      }, 500);
    }, 1500);
  }, [addLog, consumers, flashTrack, partitions, schedule]);

  const handlePublish = (burst = 1) => {
    if (phase !== 'ready' && phase !== 'commit') return;
    if (busyRef.current) return;

    const count = burst === 3 ? 3 : 1;
    setPhase('ready');
    addLog(
      burst === 3
        ? `Producer: batch из ${count} записей в топик "${TOPIC}"…`
        : `Producer → топик "${TOPIC}" (key hash → partition)…`,
      'info',
    );
    flashTrack('producer-brokers', 900);

    schedule(() => {
      const targets = Array.from({length: count}, () => Math.floor(Math.random() * PARTITIONS_COUNT));

      setPartitions((prev) => {
        const next = prev.map((p) => ({...p, messages: [...p.messages]}));
        targets.forEach((partitionIdx, i) => {
          const id = `${Date.now()}-${i}`;
          const msg = {
            id,
            shortId: `evt-${id.slice(-4)}`,
            content: `Order #${Math.floor(Math.random() * 9000) + 1000}`,
            status: 'pending',
          };
          next[partitionIdx].messages.push(msg);
          const brokerId = next[partitionIdx].leaderBrokerId;
          addLog(
            `✅ "${msg.shortId}" → partition ${partitionIdx} (leader broker-${brokerId}, offset ${next[partitionIdx].nextOffset + next[partitionIdx].messages.length - 1})`,
            'success',
          );
          setBrokerSync(brokerId);
          schedule(() => setBrokerSync(null), 600);
        });
        return next;
      });

      setLastPartition(targets.map((t) => `P${t}`).join(', '));
      schedule(() => processNext(), 800);
    }, 900);
  };

  const resetSimulation = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    busyRef.current = false;
    initializedRef.current = false;
    clearLogs();
    setCommittedTotal(0);
    setLastPartition('—');
    setActiveConsumerId(null);
    setPartitions([]);
    setConsumers([]);
    schedule(() => {
      initializedRef.current = true;
      initSystem();
    }, 300);
  };

  const totalQueued = partitions.reduce(
    (sum, p) => sum + p.messages.filter((m) => m.status === 'pending').length,
    0,
  );
  const canPublish = phase === 'ready' && !busyRef.current && partitions.length > 0;

  return (
    <DemoShell>
      <DemoCard
        title="Архитектура Apache Kafka"
        subtitle="Producer → Brokers → Topic partitions → Consumer group (offset commit)"
      >
        <StepBar
          steps={STEPS}
          currentId={phase === 'init' ? 'init' : phase === 'processing' ? 'processing' : phase === 'commit' ? 'commit' : 'ready'}
        />

        <StatsBar
          items={[
            {label: 'В партициях', value: totalQueued},
            {label: 'Committed', value: committedTotal},
            {label: 'Последняя запись', value: lastPartition},
          ]}
        />

        <div className={styles.diagram}>
          <div className={styles.flowRowCompact}>
            <BrokerNode
              icon="📤"
              title="Producer"
              hint="send()"
              active={animTrack === 'producer-brokers'}
              accent="var(--mb-producer)"
            />
            <BrokerTrack
              active={animTrack === 'producer-brokers'}
              packetTick={packetTick}
              durationMs={900}
              color="var(--mb-producer)"
            />
            <div className={styles.brokersRow}>
              {Array.from({length: BROKERS_COUNT}).map((_, i) => {
                const brokerId = i + 1;
                const isLeader = partitions.some((p) => p.leaderBrokerId === brokerId);
                return (
                  <div
                    key={brokerId}
                    className={clsx(
                      styles.brokerChip,
                      isLeader && styles.brokerChipLeader,
                      brokerSync === brokerId && styles.brokerChipSync,
                    )}
                  >
                    <strong>Broker-{brokerId}</strong>
                    <div style={{fontSize: '0.68rem', opacity: 0.8}}>
                      {isLeader ? 'leader' : 'replica'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className={styles.queuePanel} style={{borderColor: 'color-mix(in srgb, var(--mb-partition) 50%, var(--demo-border))'}}>
            <p className={styles.queuePanelTitle} style={{color: 'var(--mb-partition)'}}>
              <span>Topic: {TOPIC}</span>
              <span className="it-demo__badge">{PARTITIONS_COUNT} partitions</span>
            </p>
            <div className={styles.partitionList}>
              {partitions.length === 0 ? (
                <p className={styles.queueEmpty}>Инициализация кластера…</p>
              ) : (
                partitions.map((p) => (
                  <div
                    key={p.id}
                    className={styles.partition}
                    style={{
                      background: partitionColor(p.messages),
                      borderLeftColor:
                        animTrack === `partition-${p.id}` ? '#fff' : 'rgba(255,255,255,0.35)',
                    }}
                  >
                    <div>
                      <strong>Partition {p.id}</strong>
                      <div className={styles.partitionMeta}>
                        leader: broker-{p.leaderBrokerId} · next offset: {p.nextOffset}
                      </div>
                    </div>
                    <span style={{fontSize: '0.75rem'}}>
                      {p.messages.length === 0
                        ? 'пусто'
                        : p.messages.some((m) => m.status === 'processing')
                          ? `🔄 ${p.messages.find((m) => m.status === 'processing')?.consumerId}`
                          : `📬 ${p.messages.length} msg`}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className={styles.consumerGroup}>
            <p className={styles.consumerGroupTitle}>Consumer group: order-processors</p>
            <div className={styles.consumersRow}>
              {consumers.map((c) => (
                <BrokerNode
                  key={c.id}
                  icon="👤"
                  title={c.id}
                  hint={
                    c.status === 'processing'
                      ? 'обработка…'
                      : c.assignedPartitionIds?.length
                        ? `P${c.assignedPartitionIds.join(', P')}`
                        : 'rebalance'
                  }
                  active={activeConsumerId === c.id}
                  accent={c.color}
                />
              ))}
            </div>
          </div>
        </div>

        <p className={styles.hint}>
          Каждая партиция — упорядоченный лог. Consumer group распределяет партиции между участниками;
          после обработки сдвигается offset (at-least-once).
        </p>

        <SimulationLog logs={logs} />

        <div className={styles.controls}>
          <button
            type="button"
            className="it-demo__btn it-demo__btn--primary"
            onClick={() => handlePublish(1)}
            disabled={!canPublish}
          >
            Отправить сообщение
          </button>
          <button
            type="button"
            className="it-demo__btn it-demo__btn--secondary"
            onClick={() => handlePublish(3)}
            disabled={!canPublish}
          >
            Пакет ×3
          </button>
          <button type="button" className="it-demo__btn it-demo__btn--secondary" onClick={resetSimulation}>
            Перезапустить кластер
          </button>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default KafkaSimulationInner;
