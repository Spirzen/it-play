import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {WEBHOOK_EVENTS} from '@/components/shared/kb/devopsCiCdEngines';
import styles from './devopsCiCdDemo.module.css';

function WebhooksDeliveryPlayInner() {
  const [mode, setMode] = useState('webhook');
  const [eventId, setEventId] = useState(WEBHOOK_EVENTS[0].id);
  const [phase, setPhase] = useState(0);
  const [pollCount, setPollCount] = useState(0);

  const event = WEBHOOK_EVENTS.find((e) => e.id === eventId) ?? WEBHOOK_EVENTS[0];

  const fireWebhook = () => {
    setPhase(1);
    setTimeout(() => setPhase(2), 600);
    setTimeout(() => setPhase(3), 1200);
    setTimeout(() => setPhase(4), 1800);
    setTimeout(() => setPhase(0), 3200);
  };

  const pollOnce = () => {
    setPollCount((c) => c + 1);
    setPhase(0);
  };

  const webhookSteps = [
    {label: event.source, sub: 'событие'},
    {label: 'POST + HMAC', sub: 'подпись'},
    {label: 'Ваш API', sub: 'endpoint'},
    {label: '200 OK', sub: 'ack'},
  ];

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Webhooks vs polling"
        subtitle="Push-уведомление сразу после события — без лишних GET каждые N секунд"
      >
        <div className={styles.chips}>
          <button
            type="button"
            className={clsx(styles.chip, mode === 'webhook' && styles.chipActive)}
            onClick={() => {
              setMode('webhook');
              setPhase(0);
            }}
          >
            Webhook (push)
          </button>
          <button
            type="button"
            className={clsx(styles.chip, mode === 'polling' && styles.chipActive)}
            onClick={() => {
              setMode('polling');
              setPhase(0);
            }}
          >
            Polling (pull)
          </button>
        </div>

        <div className={styles.chips}>
          {WEBHOOK_EVENTS.map((e) => (
            <button
              key={e.id}
              type="button"
              className={clsx(styles.chip, eventId === e.id && styles.chipActive)}
              onClick={() => setEventId(e.id)}
            >
              {e.source}
            </button>
          ))}
        </div>

        {mode === 'webhook' ? (
          <>
            <div className={styles.hubRow}>
              {webhookSteps.map((s, i) => (
                <React.Fragment key={s.label}>
                  {i > 0 && <span className={styles.hubArrow}>→</span>}
                  <div
                    className={clsx(
                      styles.hubNode,
                      i === 0 && styles.hubSource,
                      i === 2 && styles.hubTarget,
                      phase === i + 1 && styles.hubPulse,
                    )}
                  >
                    <strong>{s.label}</strong>
                    <div style={{fontSize: '0.65rem'}}>{s.sub}</div>
                  </div>
                </React.Fragment>
              ))}
            </div>
            <pre className={styles.mono}>{event.payload}</pre>
            {phase >= 2 && phase < 4 && (
              <p className="it-demo__hint" style={{margin: '0.5rem 0'}}>
                Проверка X-Hub-Signature: HMAC-SHA256(payload, secret) ✓
              </p>
            )}
            <button type="button" className="it-demo__btn it-demo__btn--primary" onClick={fireWebhook}>
              Отправить webhook
            </button>
          </>
        ) : (
          <>
            <div className={styles.panel}>
              <div className={styles.statRow}>
                <span>Запросов "есть новое?"</span>
                <strong>{pollCount}</strong>
              </div>
              <div className={styles.statRow}>
                <span>Ответ сервера</span>
                <strong>{pollCount % 3 === 2 && pollCount > 0 ? '200 + событие' : '304 нет изменений'}</strong>
              </div>
            </div>
            <p style={{fontSize: '0.82rem'}}>
              Клиент будит API каждые 5 с — трафик и задержка растут, даже когда событий нет.
            </p>
            <button type="button" className="it-demo__btn it-demo__btn--secondary" onClick={pollOnce}>
              Опросить API (как cron)
            </button>
          </>
        )}
      </DemoCard>
    </DemoShell>
  );
}

export default WebhooksDeliveryPlayInner;
