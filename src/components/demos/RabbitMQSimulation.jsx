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

const STEPS = [
  {id: 'idle', label: '1. Подключение', hint: 'Consumer subscribe'},
  {id: 'ready', label: '2. Публикация', hint: 'Producer → Exchange'},
  {id: 'queued', label: '3. Очередь', hint: 'FIFO buffer'},
  {id: 'consuming', label: '4. Доставка', hint: 'Round-Robin'},
];

const ACCENT = {
  producer: 'var(--mb-producer)',
  exchange: 'var(--mb-exchange)',
  broker: 'var(--mb-broker)',
  consumer1: 'var(--mb-consumer-a)',
  consumer2: 'var(--mb-consumer-b)',
};

function RabbitMQSimulationInner() {
  const [phase, setPhase] = useState('idle');
  const [subscribed, setSubscribed] = useState(false);
  const [queueItems, setQueueItems] = useState([]);
  const [activeConsumer, setActiveConsumer] = useState(null);
  const [packetTick, setPacketTick] = useState(0);
  const [processedCount, setProcessedCount] = useState(0);
  const [animTrack, setAnimTrack] = useState(null);

  const {logs, addLog, clearLogs} = useBrokerLog();
  const consumerTurnRef = useRef(0);
  const timersRef = useRef([]);
  const busyRef = useRef(false);

  const bumpPacket = useCallback(() => setPacketTick((n) => n + 1), []);

  const schedule = useCallback((fn, ms) => {
    const id = setTimeout(fn, ms);
    timersRef.current.push(id);
    return id;
  }, []);

  useEffect(() => {
    return () => {
      timersRef.current.forEach(clearTimeout);
    };
  }, []);

  const flashTrack = useCallback(
    (trackId, durationMs = 900) => {
      setAnimTrack(trackId);
      bumpPacket();
      schedule(() => setAnimTrack(null), durationMs);
    },
    [bumpPacket, schedule],
  );

  const processNext = useCallback(() => {
    if (busyRef.current) return;

    setQueueItems((prev) => {
      const idx = prev.findIndex((item) => item.status === 'pending');
      if (idx === -1) {
        setPhase('ready');
        setActiveConsumer(null);
        return prev;
      }

      busyRef.current = true;
      setPhase('consuming');

      const consumerId = consumerTurnRef.current % 2 === 0 ? 'consumer1' : 'consumer2';
      consumerTurnRef.current += 1;
      const consumerName = consumerId === 'consumer1' ? 'Consumer-1' : 'Consumer-2';
      const msg = prev[idx];

      setActiveConsumer(consumerId);
      flashTrack('queue-consumer', 1100);
      addLog(`${consumerName} получает "${msg.shortId}" (prefetch=1)…`, 'info');

      const processing = prev.map((item, i) =>
        i === idx ? {...item, status: 'processing', consumerId} : item,
      );

      schedule(() => {
        setQueueItems((current) => {
          const next = current.filter((item) => item.id !== msg.id);
          const hasMore = next.some((item) => item.status === 'pending');
          schedule(() => {
            if (hasMore) {
              processNext();
            } else {
              setPhase('ready');
              addLog('Очередь пуста — можно отправить ещё сообщение.', 'info');
            }
          }, 400);
          return next;
        });
        addLog(`✅ ${consumerName}: ACK для "${msg.shortId}"`, 'success');
        setProcessedCount((c) => c + 1);
        setActiveConsumer(null);
        busyRef.current = false;
      }, 1400);

      return processing;
    });
  }, [addLog, flashTrack, schedule]);

  const handleSubscribe = () => {
    if (subscribed || phase !== 'idle') return;

    setPhase('idle');
    addLog('Consumer-1 и Consumer-2: AMQP handshake…', 'info');
    flashTrack('broker-queue', 800);

    schedule(() => {
      setSubscribed(true);
      setPhase('ready');
      addLog('✅ Оба потребителя подписаны на очередь orders (fair dispatch).', 'success');
      bumpPacket();
    }, 1200);
  };

  const handlePublish = (burst = 1) => {
    if (!subscribed || phase !== 'ready' || busyRef.current) return;

    const count = burst === 3 ? 3 : 1;
    setPhase('queued');
    addLog(
      burst === 3
        ? 'Producer: пакет из 3 сообщений → Exchange direct…'
        : 'Producer → Exchange "orders.direct" (routing key: orders)…',
      'info',
    );
    flashTrack('producer-exchange', 900);
    schedule(() => flashTrack('exchange-queue', 900), 500);

    const newItems = Array.from({length: count}, (_, i) => {
      const id = `${Date.now()}-${i}`;
      return {
        id,
        shortId: `msg-${id.slice(-4)}`,
        content: `Заказ #${Math.floor(Math.random() * 9000) + 1000}`,
        status: 'pending',
      };
    });

    schedule(() => {
      setQueueItems((prev) => [...prev, ...newItems]);
      newItems.forEach((m) =>
        addLog(`📥 "${m.shortId}" в очереди orders (${m.content})`, 'success'),
      );
      schedule(processNext, 600);
    }, 1000);
  };

  const resetSimulation = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    busyRef.current = false;
    consumerTurnRef.current = 0;
    setPhase('idle');
    setSubscribed(false);
    setQueueItems([]);
    setActiveConsumer(null);
    setProcessedCount(0);
    setAnimTrack(null);
    clearLogs();
    addLog('Симуляция сброшена.', 'info');
  };

  const pendingCount = queueItems.filter((i) => i.status === 'pending').length;
  const canPublish = subscribed && phase === 'ready' && !busyRef.current;

  return (
    <DemoShell>
      <DemoCard
        title="Схема работы RabbitMQ"
        subtitle="Producer → Exchange → Queue → Consumers (Round-Robin, ACK)"
      >
        <StepBar steps={STEPS} currentId={phase === 'idle' && !subscribed ? 'idle' : phase} />

        <StatsBar
          items={[
            {label: 'В очереди', value: pendingCount},
            {label: 'Обработано', value: processedCount},
            {label: 'Режим', value: subscribed ? 'Round-Robin' : '—'},
          ]}
        />

        <div className={styles.diagram}>
          <div className={styles.flowRow}>
            <BrokerNode
              icon="📤"
              title="Producer"
              hint="publish()"
              active={animTrack === 'producer-exchange' || phase === 'queued'}
              accent={ACCENT.producer}
            />
            <BrokerTrack
              active={animTrack === 'producer-exchange'}
              packetTick={packetTick}
              durationMs={900}
              color={ACCENT.producer}
            />
            <BrokerNode
              icon="🔀"
              title="Exchange"
              hint="direct · orders"
              active={animTrack === 'exchange-queue'}
              accent={ACCENT.exchange}
              badge="direct"
            />
            <BrokerTrack
              active={animTrack === 'exchange-queue'}
              packetTick={packetTick}
              durationMs={900}
              color={ACCENT.exchange}
            />
            <BrokerNode
              icon="🐰"
              title="RabbitMQ"
              hint="Broker"
              active={subscribed}
              accent={ACCENT.broker}
            />
          </div>

          <div className={styles.queuePanel}>
            <p className={styles.queuePanelTitle}>
              <span>Queue: orders</span>
              <span className="it-demo__badge it-demo__badge--active">{queueItems.length} msg</span>
            </p>
            <div className={styles.queueList}>
              {queueItems.length === 0 ? (
                <p className={styles.queueEmpty}>Очередь пуста — ждёт сообщений</p>
              ) : (
                queueItems.map((item) => (
                  <div
                    key={item.id}
                    className={clsx(
                      styles.messageChip,
                      item.status === 'processing' && styles.messageChipProcessing,
                    )}
                    style={{
                      background:
                        item.status === 'processing'
                          ? item.consumerId === 'consumer1'
                            ? 'var(--mb-consumer-a)'
                            : 'var(--mb-consumer-b)'
                          : 'var(--mb-queue)',
                    }}
                  >
                    <span>
                      {item.shortId} · {item.content}
                    </span>
                    {item.status === 'processing' && (
                      <span>{item.consumerId === 'consumer1' ? 'C1' : 'C2'}</span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          <BrokerTrack
            active={animTrack === 'queue-consumer'}
            packetTick={packetTick}
            durationMs={1100}
            color="var(--mb-queue)"
          />

          <div className={styles.consumersRow}>
            <BrokerNode
              icon="👤"
              title="Consumer-1"
              hint={subscribed ? (activeConsumer === 'consumer1' ? 'ACK…' : 'idle') : 'не подключён'}
              active={activeConsumer === 'consumer1'}
              dim={!subscribed}
              accent={ACCENT.consumer1}
            />
            <BrokerNode
              icon="👤"
              title="Consumer-2"
              hint={subscribed ? (activeConsumer === 'consumer2' ? 'ACK…' : 'idle') : 'не подключён'}
              active={activeConsumer === 'consumer2'}
              dim={!subscribed}
              accent={ACCENT.consumer2}
            />
          </div>
        </div>

        <p className={styles.hint}>
          Справедливое распределение: брокер отдаёт по одному сообщению свободному потребителю (prefetch).
          Следующее сообщение — другому consumer (Round-Robin).
        </p>

        <SimulationLog logs={logs} />

        <div className={styles.controls}>
          <button
            type="button"
            className="it-demo__btn it-demo__btn--primary"
            onClick={handleSubscribe}
            disabled={subscribed}
          >
            {subscribed ? '✓ Подключены' : 'Подключить consumers'}
          </button>
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
            Сброс
          </button>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default RabbitMQSimulationInner;
