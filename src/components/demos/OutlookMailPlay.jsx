import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import styles from '@/components/demos/OutlookMailPlay.module.css';

const FOLDERS = [
  {id: 'inbox', label: 'Входящие', icon: '📥'},
  {id: 'sent', label: 'Отправленные', icon: '📤'},
  {id: 'drafts', label: 'Черновики', icon: '📝'},
  {id: 'spam', label: 'Нежелательная', icon: '⚠️'},
];

const MESSAGES = [
  {
    id: 'm1',
    folder: 'inbox',
    from: 'team-lead@company.ru',
    subject: 'Риск по сроку релиза',
    date: 'Сегодня 09:14',
    body: 'По задаче REL-42 наблюдается отклонение. Нужна эскалация с планом стабилизации до 16:00.',
    envelope: {mailFrom: 'team-lead@company.ru', rcptTo: ['you@company.ru']},
    headers: {spf: 'pass', dkim: 'pass'},
  },
  {
    id: 'm2',
    folder: 'inbox',
    from: 'MAILER-DAEMON@mx.provider.ru',
    subject: 'Недоставлено: отчёт Q1',
    date: 'Вчера 18:02',
    body: '550 5.1.1 User unknown — получатель user@old-domain.ru не существует.',
    envelope: {mailFrom: '<>', rcptTo: ['you@company.ru']},
    headers: {spf: 'none'},
  },
  {
    id: 'm3',
    folder: 'sent',
    from: 'you@company.ru',
    subject: 'Re: Запрос заказчика CR-118',
    date: '10.05 11:30',
    body: 'Передам запрос руководителю проекта. Для изменений нужен change request и оценка рисков.',
    envelope: {mailFrom: 'you@company.ru', rcptTo: ['pm@partner.ru']},
    headers: {spf: 'pass', dkim: 'pass'},
  },
];

const DEFAULT_SETUP = {
  email: 'user@example.com',
  incoming: 'imap.example.com',
  incomingPort: '993',
  incomingEnc: 'ssl',
  outgoing: 'smtp.example.com',
  outgoingPort: '587',
  outgoingEnc: 'starttls',
};

function OutlookMailPlayInner() {
  const [tab, setTab] = useState('mail');
  const [folder, setFolder] = useState('inbox');
  const [selectedId, setSelectedId] = useState('m1');
  const [composing, setComposing] = useState(false);
  const [draft, setDraft] = useState({to: '', subject: '', body: ''});
  const [sent, setSent] = useState([]);
  const [setup, setSetup] = useState(DEFAULT_SETUP);
  const [testResult, setTestResult] = useState(null);

  const folderMessages = useMemo(() => {
    const base = MESSAGES.filter((m) => m.folder === folder);
    const extra = sent.filter((m) => m.folder === folder);
    return [...extra, ...base];
  }, [folder, sent]);

  const selected =
    folderMessages.find((m) => m.id === selectedId) ?? folderMessages[0] ?? null;

  const sendMail = () => {
    if (!draft.to.trim() || !draft.subject.trim()) return;
    const msg = {
      id: `local-${Date.now()}`,
      folder: 'sent',
      from: setup.email,
      subject: draft.subject,
      date: 'Только что',
      body: draft.body,
      envelope: {mailFrom: setup.email, rcptTo: [draft.to]},
      headers: {spf: 'pass', dkim: 'pass'},
    };
    setSent((s) => [msg, ...s]);
    setFolder('sent');
    setSelectedId(msg.id);
    setComposing(false);
    setDraft({to: '', subject: '', body: ''});
  };

  const testConnection = () => {
    const badPort =
      (setup.outgoingEnc === 'ssl' && setup.outgoingPort !== '465') ||
      (setup.outgoingEnc === 'starttls' && setup.outgoingPort !== '587');
    setTestResult(
      badPort
        ? 'Ошибка 0x800CCC0B: порт и тип шифрования не совпадают (465+SSL или 587+STARTTLS).'
        : 'Подключение успешно: IMAP и SMTP отвечают. Письмо можно отправить через MTA.',
    );
  };

  return (
    <DemoShell>
      <DemoCard
        title="Симулятор Microsoft Outlook"
        subtitle="MUA: папки, чтение письма, отправка и ручная настройка IMAP/SMTP"
      >
        <div className={styles.shell}>
          <div className={styles.ribbon}>
            <button type="button" onClick={() => setComposing(true)}>
              Создать
            </button>
            <button type="button" onClick={() => setTab('mail')}>
              Ответить
            </button>
            <button type="button" onClick={() => setTab('setup')}>
              Учётная запись
            </button>
          </div>

          <div className={styles.tabs}>
            <button
              type="button"
              className={clsx(styles.tab, tab === 'mail' && styles.tabActive)}
              onClick={() => setTab('mail')}
            >
              Почта
            </button>
            <button
              type="button"
              className={clsx(styles.tab, tab === 'setup' && styles.tabActive)}
              onClick={() => setTab('setup')}
            >
              Настройка ящика
            </button>
          </div>

          {tab === 'mail' && !composing && (
            <div className={styles.mailGrid}>
              <nav className={styles.folders}>
                {FOLDERS.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    className={clsx(styles.folderBtn, folder === f.id && styles.folderActive)}
                    onClick={() => {
                      setFolder(f.id);
                      const first = [...sent, ...MESSAGES].find((m) => m.folder === f.id);
                      if (first) setSelectedId(first.id);
                    }}
                  >
                    {f.icon} {f.label}
                  </button>
                ))}
              </nav>

              <div className={styles.list}>
                {folderMessages.length === 0 && (
                  <p className="it-demo__hint" style={{padding: '0.5rem'}}>
                    Папка пуста
                  </p>
                )}
                {folderMessages.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    className={clsx(styles.listItem, selected?.id === m.id && styles.listActive)}
                    onClick={() => setSelectedId(m.id)}
                  >
                    <strong>{m.subject}</strong>
                    <small>
                      {m.from} · {m.date}
                    </small>
                  </button>
                ))}
              </div>

              <div className={styles.read}>
                {selected ? (
                  <>
                    <h4>{selected.subject}</h4>
                    <div className={styles.meta}>
                      <div>
                        <strong>From:</strong> {selected.from}
                      </div>
                      <div>
                        <strong>SPF/DKIM:</strong> {selected.headers.spf} / {selected.headers.dkim}
                      </div>
                    </div>
                    <p>{selected.body}</p>
                    <div className={styles.envelope}>
                      <strong>SMTP-конверт (для MTA):</strong>
                      <br />
                      MAIL FROM: {selected.envelope.mailFrom}
                      <br />
                      RCPT TO: {selected.envelope.rcptTo.join(', ')}
                      <br />
                      <span style={{color: 'var(--ifm-color-content-secondary)'}}>
                        Заголовок From: может отличаться от MAIL FROM при рассылках и CRM.
                      </span>
                    </div>
                  </>
                ) : (
                  <p className="it-demo__hint">Выберите письмо</p>
                )}
              </div>
            </div>
          )}

          {tab === 'mail' && composing && (
            <div className={styles.compose}>
              <label>
                Кому
                <input
                  value={draft.to}
                  onChange={(e) => setDraft((d) => ({...d, to: e.target.value}))}
                  placeholder="colleague@company.ru"
                />
              </label>
              <label>
                Тема
                <input
                  value={draft.subject}
                  onChange={(e) => setDraft((d) => ({...d, subject: e.target.value}))}
                />
              </label>
              <label>
                Текст
                <textarea
                  rows={6}
                  value={draft.body}
                  onChange={(e) => setDraft((d) => ({...d, body: e.target.value}))}
                />
              </label>
              <div style={{display: 'flex', gap: '0.4rem'}}>
                <button type="button" className="it-demo__btn it-demo__btn--primary" onClick={sendMail}>
                  Отправить (→ MTA по SMTP)
                </button>
                <button
                  type="button"
                  className="it-demo__btn it-demo__btn--secondary"
                  onClick={() => setComposing(false)}
                >
                  Отмена
                </button>
              </div>
            </div>
          )}

          {tab === 'setup' && (
            <div className={styles.setup}>
              <div className={styles.setupBlock}>
                <h5>Входящая (IMAP)</h5>
                <div className={styles.setupRow}>
                  <label>Сервер</label>
                  <input
                    value={setup.incoming}
                    onChange={(e) => setSetup((s) => ({...s, incoming: e.target.value}))}
                  />
                </div>
                <div className={styles.setupRow}>
                  <label>Порт</label>
                  <select
                    value={setup.incomingPort}
                    onChange={(e) => setSetup((s) => ({...s, incomingPort: e.target.value}))}
                  >
                    <option value="993">993 (SSL)</option>
                    <option value="143">143 (STARTTLS)</option>
                  </select>
                </div>
              </div>
              <div className={styles.setupBlock}>
                <h5>Исходящая (SMTP)</h5>
                <div className={styles.setupRow}>
                  <label>Сервер</label>
                  <input
                    value={setup.outgoing}
                    onChange={(e) => setSetup((s) => ({...s, outgoing: e.target.value}))}
                  />
                </div>
                <div className={styles.setupRow}>
                  <label>Порт</label>
                  <select
                    value={setup.outgoingPort}
                    onChange={(e) => setSetup((s) => ({...s, outgoingPort: e.target.value}))}
                  >
                    <option value="587">587</option>
                    <option value="465">465</option>
                  </select>
                </div>
                <div className={styles.setupRow}>
                  <label>Шифрование</label>
                  <select
                    value={setup.outgoingEnc}
                    onChange={(e) => setSetup((s) => ({...s, outgoingEnc: e.target.value}))}
                  >
                    <option value="starttls">STARTTLS (порт 587)</option>
                    <option value="ssl">SSL/TLS (порт 465)</option>
                  </select>
                </div>
              </div>
              <div className={styles.setupBlock} style={{gridColumn: '1 / -1'}}>
                <h5>Учётная запись</h5>
                <div className={styles.setupRow}>
                  <label>Email (имя пользователя)</label>
                  <input
                    value={setup.email}
                    onChange={(e) => setSetup((s) => ({...s, email: e.target.value}))}
                  />
                </div>
                <button
                  type="button"
                  className="it-demo__btn it-demo__btn--primary it-demo__btn--sm"
                  onClick={testConnection}
                >
                  Проверить подключение
                </button>
                {testResult && (
                  <p className={testResult.startsWith('Ошибка') ? styles.testErr : styles.testOk}>
                    {testResult}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default OutlookMailPlayInner;
