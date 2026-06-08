import React, {useCallback, useRef, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {RCA_CAUSES, TICKET_FLOW_STEPS} from '@/components/shared/kb/techSupportEngines';
import styles from '@/components/shared/kb/techSupportDemo.module.css';

function TechSupportTicketFlowPlayInner() {
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [rcaId, setRcaId] = useState('bug');
  const timers = useRef([]);

  const step = TICKET_FLOW_STEPS[stepIndex];
  const rca = RCA_CAUSES.find((c) => c.id === rcaId) ?? RCA_CAUSES[0];

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  const goTo = (i) => setStepIndex(Math.max(0, Math.min(TICKET_FLOW_STEPS.length - 1, i)));

  const play = () => {
    clearTimers();
    setPlaying(true);
    setStepIndex(0);
    TICKET_FLOW_STEPS.forEach((_, i) => {
      const id = setTimeout(() => {
        setStepIndex(i);
        if (i === TICKET_FLOW_STEPS.length - 1) setPlaying(false);
      }, i * 2200);
      timers.current.push(id);
    });
  };

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Путь тикета: от обращения до RCA"
        subtitle="Автотикет, база знаний, диагностика и корневая причина"
      >
        <div className={styles.flowSteps}>
          {TICKET_FLOW_STEPS.map((s, i) => (
            <React.Fragment key={s.id}>
              {i > 0 && <div className={styles.connector} aria-hidden />}
              <button
                type="button"
                className={clsx(styles.flowStep, i === stepIndex && styles.flowStepActive)}
                onClick={() => !playing && goTo(i)}
                disabled={playing}
              >
                <span className={styles.flowIcon}>{s.icon}</span>
                <div className={styles.flowBody}>
                  <p className={styles.flowLabel}>{s.label}</p>
                  <p className={styles.flowDetail}>{s.detail}</p>
                  {s.kbMatch != null && (
                    <p className={styles.flowDetail}>Совпадение KB: {s.kbMatch}%</p>
                  )}
                </div>
              </button>
            </React.Fragment>
          ))}
        </div>

        {step && (
          <div className={styles.detailBox}>
            <p className={styles.detailTitle}>
              Шаг {stepIndex + 1}: {step.label}
            </p>
            <p className={styles.detailText}>{step.detail}</p>
          </div>
        )}

        <p className="it-demo__label">Классификация причины (RCA)</p>
        <div className={styles.grid2}>
          {RCA_CAUSES.map((c) => (
            <button
              key={c.id}
              type="button"
              className={clsx(styles.card, rcaId === c.id && styles.cardActive)}
              onClick={() => setRcaId(c.id)}
            >
              <span className={styles.cardLabel}>{c.label}</span>
              <span className={styles.cardList} style={{listStyle: 'none', padding: 0}}>
                ~{c.pct}% обращений
              </span>
            </button>
          ))}
        </div>
        <p className={styles.detailText}>
          Выбрано: <strong>{rca.label}</strong> — при баге тикет уходит в разработку; при ошибке
          пользователя достаточно статьи KB.
        </p>

        <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.45rem', justifyContent: 'center'}}>
          <button
            type="button"
            className="it-demo__btn it-demo__btn--primary"
            onClick={play}
            disabled={playing}
          >
            {playing ? 'Воспроизведение…' : 'Пройти путь тикета'}
          </button>
          <button
            type="button"
            className="it-demo__btn it-demo__btn--secondary"
            onClick={() => goTo(stepIndex - 1)}
            disabled={playing || stepIndex <= 0}
          >
            ← Назад
          </button>
          <button
            type="button"
            className="it-demo__btn it-demo__btn--secondary"
            onClick={() => goTo(stepIndex + 1)}
            disabled={playing || stepIndex >= TICKET_FLOW_STEPS.length - 1}
          >
            Вперёд →
          </button>
        </div>

        <p className={styles.footer}>
          Повторяющиеся инциденты — кандидаты в Problem Management и в статьи базы знаний.
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default TechSupportTicketFlowPlayInner;
