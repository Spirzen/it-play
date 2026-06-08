import React, {useState} from 'react';

import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';


import DesktopAppChrome from '@/components/shared/kb/DesktopAppChrome';
import styles from '@/components/demos/VideoConferenceSimulator.module.css';

const PARTICIPANTS = [
  {id: 'you', name: 'Вы', role: 'Ведущий'},
  {id: 'a', name: 'Аналитик', role: 'Докладчик'},
  {id: 'b', name: 'Разработчик', role: 'Участник'},
  {id: 'c', name: 'Тестировщик', role: 'Участник'},
];

export function VideoConferenceSimulatorInner({compact}) {
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [sharing, setSharing] = useState(false);
  const [chat, setChat] = useState([
    {user: 'Аналитик', text: 'Покажу блок-схему на экране.'},
    {user: 'Вы', text: 'Включаю демонстрацию.'},
  ]);
  const [chatDraft, setChatDraft] = useState('');

  const sendChat = () => {
    if (!chatDraft.trim()) return;
    setChat((prev) => [...prev, {user: 'Вы', text: chatDraft.trim()}]);
    setChatDraft('');
  };

  const chrome = (
    <DesktopAppChrome
      title="Видеоконференция — Teams / Zoom (симулятор)"
      accent="#6264a7"
      toolbar={
        <>
          <button
            type="button"
            className={clsx(!micOn && styles.off)}
            onClick={() => setMicOn((v) => !v)}
          >
            {micOn ? '🎤 Микрофон' : '🔇 Выкл.'}
          </button>
          <button
            type="button"
            className={clsx(!camOn && styles.off)}
            onClick={() => setCamOn((v) => !v)}
          >
            {camOn ? '📷 Камера' : '🚫 Камера'}
          </button>
          <button
            type="button"
            className={clsx(sharing && styles.active)}
            onClick={() => setSharing((v) => !v)}
          >
            🖥 {sharing ? 'Стоп демо' : 'Демонстрация'}
          </button>
          <button type="button" className={styles.leave}>
            Покинуть
          </button>
        </>
      }
      status={
        <>
          Участников: {PARTICIPANTS.length} · {sharing ? 'Идёт показ экрана' : 'Галерея'} · чат:{' '}
          {chat.length} сообщ.
        </>
      }
    >
      <div className={styles.layout}>
        <div className={styles.grid}>
          {PARTICIPANTS.map((p) => (
            <div
              key={p.id}
              className={clsx(
                styles.tile,
                p.id === 'you' && !camOn && styles.tileMuted,
                sharing && p.id === 'you' && styles.tileShare,
              )}
            >
              <span className={styles.avatar}>{p.name.slice(0, 1)}</span>
              <strong>{p.name}</strong>
              <em>{p.role}</em>
              {p.id === 'you' && !micOn && <span className={styles.badge}>🔇</span>}
            </div>
          ))}
        </div>
        <aside className={styles.sideChat}>
          <h4>Чат встречи</h4>
          <ul>
            {chat.map((m, i) => (
              <li key={i}>
                <strong>{m.user}:</strong> {m.text}
              </li>
            ))}
          </ul>
          <div className={styles.chatInput}>
            <input
              value={chatDraft}
              onChange={(e) => setChatDraft(e.target.value)}
              placeholder="Комментарий…"
              onKeyDown={(e) => e.key === 'Enter' && sendChat()}
            />
            <button type="button" onClick={sendChat}>
              →
            </button>
          </div>
        </aside>
      </div>
    </DesktopAppChrome>
  );

  if (compact) return chrome;

  return (
    <DemoShell>
      <DemoCard
        title="Симулятор видеосвязи"
        subtitle="Галерея участников, микрофон, камера, демонстрация экрана и чат"
      >
        {chrome}
        <p className={styles.hint}>
          Видео и аудио идут по WebRTC; при плохой сети растёт задержка и падает качество (jitter,
          packet loss).
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default VideoConferenceSimulatorInner;
