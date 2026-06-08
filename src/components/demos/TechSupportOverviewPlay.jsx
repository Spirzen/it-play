import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {SUPPORT_CHANNELS, SUPPORT_TASKS} from '@/components/shared/kb/techSupportEngines';
import styles from '@/components/shared/kb/techSupportDemo.module.css';

function TechSupportOverviewPlayInner() {
  const [taskId, setTaskId] = useState('fix');
  const [channelId, setChannelId] = useState('ticket');
  const [botMode, setBotMode] = useState(false);

  const task = SUPPORT_TASKS.find((t) => t.id === taskId) ?? SUPPORT_TASKS[0];
  const channel = SUPPORT_CHANNELS.find((c) => c.id === channelId) ?? SUPPORT_CHANNELS[0];

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Задачи и каналы техподдержки"
        subtitle="Пять уровней задач и сравнение способов обращения — как в статье"
      >
        <p className="it-demo__label">Уровни задач техподдержки</p>
        <div className={styles.grid2}>
          {SUPPORT_TASKS.map((t) => (
            <button
              key={t.id}
              type="button"
              className={clsx(styles.card, taskId === t.id && styles.cardActive)}
              onClick={() => setTaskId(t.id)}
            >
              <span className={styles.cardIcon}>{t.icon}</span>
              <span className={styles.cardLabel}>{t.label}</span>
              <ul className={styles.cardList}>
                {t.items.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </button>
          ))}
        </div>

        <div className={styles.detailBox}>
          <p className={styles.detailTitle}>{task.icon} {task.label}</p>
          <p className={styles.detailText}>
            Общая цель всех уровней — удовлетворённость клиента. Выбранный блок определяет, какие
            компетенции нужны линии L1–L3.
          </p>
        </div>

        <p className="it-demo__label">Каналы обращения</p>
        <div className={styles.grid2}>
          {SUPPORT_CHANNELS.map((c) => (
            <button
              key={c.id}
              type="button"
              className={clsx(styles.card, channelId === c.id && styles.cardActive)}
              onClick={() => setChannelId(c.id)}
            >
              <span className={styles.cardLabel}>{c.label}</span>
            </button>
          ))}
        </div>

        <div className={styles.meterRow}>
          <span>Скорость</span>
          <div className={styles.meterTrack}>
            <div className={styles.meterFill} style={{width: `${channel.speed}%`}} />
          </div>
          <strong>{channel.speed}%</strong>
        </div>
        <div className={styles.meterRow}>
          <span>Детализация</span>
          <div className={styles.meterTrack}>
            <div className={styles.meterFill} style={{width: `${channel.detail}%`}} />
          </div>
          <strong>{channel.detail}%</strong>
        </div>

        <div className={styles.detailBox}>
          <p className={styles.detailTitle}>{channel.label}</p>
          <p className={styles.detailText}>{channel.hint}</p>
        </div>

        <label className="it-demo__hint" style={{display: 'flex', alignItems: 'center', gap: '0.4rem'}}>
          <input type="checkbox" checked={botMode} onChange={(e) => setBotMode(e.target.checked)} />
          Сценарий "только бот" (без базы знаний)
        </label>
        {botMode && (
          <p className={styles.detailText} style={{color: '#c62828', fontWeight: 600, marginTop: '0.35rem'}}>
            Пользователь злится и всё равно звонит на L1 — гибкий подход: бот + KB + живые специалисты.
          </p>
        )}

        <p className={styles.footer}>
          Техподдержка — часть ITSM: процессы должны быть предсказуемыми, а не только "ответить
          быстрее".
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default TechSupportOverviewPlayInner;
