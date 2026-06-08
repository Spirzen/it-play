import React, {useState} from 'react';

import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';


import DesktopAppChrome from '@/components/shared/kb/DesktopAppChrome';
import styles from '@/components/demos/MessengerSimulator.module.css';

const CONTACTS = [
  {id: 'team', name: 'Команда проекта', status: 'в сети'},
  {id: 'ba', name: 'Аналитик', status: 'был(а) 5 мин назад'},
  {id: 'support', name: 'Поддержка', status: 'в сети'},
];

const INITIAL = {
  team: [
    {from: 'them', text: 'Привет! Статус по ТЗ?', time: '10:02'},
    {from: 'me', text: 'Черновик готов, вышлю после ревью.', time: '10:05'},
  ],
  ba: [{from: 'them', text: 'Нужна диаграмма BPMN для заказчика.', time: '09:40'}],
  support: [{from: 'them', text: 'Тикет #442 закрыт.', time: 'вчера'}],
};

export function MessengerSimulatorInner({compact}) {
  const [active, setActive] = useState('team');
  const [messages, setMessages] = useState(INITIAL);
  const [draft, setDraft] = useState('');

  const thread = messages[active] || [];

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    const time = new Date().toLocaleTimeString('ru-RU', {hour: '2-digit', minute: '2-digit'});
    setMessages((prev) => ({
      ...prev,
      [active]: [...(prev[active] || []), {from: 'me', text, time}],
    }));
    setDraft('');
  };

  const chrome = (
    <DesktopAppChrome
      title="Мессенджер (симулятор)"
      accent="#5b6abf"
      status={<>Чат: {CONTACTS.find((c) => c.id === active)?.name} · сообщений: {thread.length}</>}
    >
      <div className={styles.layout}>
        <aside className={styles.contacts}>
          {CONTACTS.map((c) => (
            <button
              key={c.id}
              type="button"
              className={clsx(styles.contact, active === c.id && styles.contactActive)}
              onClick={() => setActive(c.id)}
            >
              <strong>{c.name}</strong>
              <span>{c.status}</span>
            </button>
          ))}
        </aside>
        <div className={styles.chat}>
          <div className={styles.messages}>
            {thread.map((m, i) => (
              <div key={i} className={clsx(styles.bubble, m.from === 'me' && styles.bubbleMe)}>
                <p>{m.text}</p>
                <time>{m.time}</time>
              </div>
            ))}
          </div>
          <div className={styles.compose}>
            <input
              placeholder="Сообщение…"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
            />
            <button type="button" onClick={send}>
              ➤
            </button>
          </div>
        </div>
      </div>
    </DesktopAppChrome>
  );

  if (compact) return chrome;

  return (
    <DemoShell>
      <DemoCard
        title="Симулятор мессенджера"
        subtitle="Контакты, поток сообщений и отправка — модель чата в реальном времени"
      >
        {chrome}
        <p className={styles.hint}>
          Клиент отправляет сообщение на сервер; сервер доставляет его получателю по WebSocket или
          push-каналу.
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default MessengerSimulatorInner;
