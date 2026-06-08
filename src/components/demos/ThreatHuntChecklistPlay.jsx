import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import styles from '@/components/demos/ThreatHuntChecklistPlay.module.css';

const WINDOWS_STEPS = [
  {id: 'w1', title: 'Базовый снимок', hint: 'systeminfo, whoami /all, net user'},
  {id: 'w2', title: 'Автозагрузка', hint: 'reg Run keys, schtasks, services.msc'},
  {id: 'w3', title: 'Сеть', hint: 'netstat -ano, Get-NetTCPConnection'},
  {id: 'w4', title: 'Процессы', hint: 'tasklist /v, WMI Win32_Process'},
  {id: 'w5', title: 'Журналы', hint: 'Event ID 4624/4625, PowerShell 4104'},
  {id: 'w6', title: 'Целостность', hint: 'sigcheck, SFC /scannow при подозрении'},
];

const LINUX_STEPS = [
  {id: 'l1', title: 'Инвентарь', hint: 'uname -a, ps aux, ss -tulpn'},
  {id: 'l2', title: 'Пользователи', hint: '/etc/passwd, last, sudo -l'},
  {id: 'l3', title: 'Cron/systemd', hint: 'crontab -l, systemctl list-units'},
  {id: 'l4', title: '/proc', hint: 'cmdline, maps, скрытые PID'},
  {id: 'l5', title: 'Сеть', hint: 'iptables -L, lsof -i'},
  {id: 'l6', title: 'Логи', hint: 'auth.log, auditd, journalctl'},
];

function ThreatHuntChecklistPlayInner() {
  const [os, setOs] = useState('windows');
  const [done, setDone] = useState([]);
  const steps = os === 'windows' ? WINDOWS_STEPS : LINUX_STEPS;

  const progress = useMemo(
    () => Math.round((done.filter((id) => steps.some((s) => s.id === id)).length / steps.length) * 100),
    [done, steps],
  );

  const toggle = (id) => {
    setDone((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const reset = () => setDone([]);

  return (
    <DemoShell>
      <DemoCard
        title="Чек-лист анализа угроз ОС"
        subtitle="Windows и Linux — отмечайте этапы статического и динамического осмотра"
      >
        <div className={styles.tabs}>
          <button
            type="button"
            className={clsx(
              'it-demo__btn it-demo__btn--sm',
              os === 'windows' ? 'it-demo__btn--primary' : 'it-demo__btn--secondary',
            )}
            onClick={() => {
              setOs('windows');
              setDone([]);
            }}
          >
            Windows
          </button>
          <button
            type="button"
            className={clsx(
              'it-demo__btn it-demo__btn--sm',
              os === 'linux' ? 'it-demo__btn--primary' : 'it-demo__btn--secondary',
            )}
            onClick={() => {
              setOs('linux');
              setDone([]);
            }}
          >
            Linux
          </button>
        </div>

        <div className={styles.meter} aria-hidden>
          <div className={styles.meterFill} style={{width: `${progress}%`}} />
        </div>
        <p style={{margin: '0 0 0.75rem', fontSize: '0.85rem'}}>
          Прогресс: {progress}% ({os === 'windows' ? 'Win' : 'Linux'})
        </p>

        <div className={styles.steps}>
          {steps.map((s, i) => {
            const isDone = done.includes(s.id);
            return (
              <button
                key={s.id}
                type="button"
                className={clsx(styles.step, isDone && styles.stepDone)}
                onClick={() => toggle(s.id)}
              >
                <span className={styles.stepNum}>{isDone ? '✓' : i + 1}</span>
                <span className={styles.stepBody}>
                  <strong>{s.title}</strong>
                  <span>{s.hint}</span>
                </span>
              </button>
            );
          })}
        </div>

        <p className={styles.hint}>
          {progress === 100
            ? 'Базовый осмотр завершён. Сверьте находки с эталоном (golden image) и зафиксируйте в отчёте IR.'
            : 'Сочетайте статический осмотр (конфиг, файлы) с динамическим (процессы, сеть в реальном времени).'}
        </p>

        <div style={{display: 'flex', justifyContent: 'center', marginTop: '0.5rem'}}>
          <button type="button" className="it-demo__btn it-demo__btn--secondary" onClick={reset}>
            Сбросить
          </button>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default ThreatHuntChecklistPlayInner;
