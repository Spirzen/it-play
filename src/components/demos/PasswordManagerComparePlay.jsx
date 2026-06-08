import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';
import styles from './miscToolsPlays.module.css';

const MODELS = [
  {
    id: 'cloud',
    label: 'Облачный vault',
    desc: 'Синхронизация между устройствами, автозаполнение в браузере',
    tools: ['Bitwarden', '1Password', 'Dashlane'],
    e2e: 'Да (zero-knowledge у лидеров)',
    risk: 'Доверие провайдеру + мастер-пароль',
  },
  {
    id: 'local',
    label: 'Локальная база',
    desc: 'Файл .kdbx на диске, без обязательного облака',
    tools: ['KeePass', 'KeePassXC', 'KeeWeb'],
    e2e: 'Вы контролируете файл и бэкапы',
    risk: 'Потеря файла = потеря всех паролей',
  },
  {
    id: 'team',
    label: 'Команда / self-host',
    desc: 'Общие секреты, аудит, роли',
    tools: ['Passbolt', '1Password Teams', 'Vault (HashiCorp)'],
    e2e: 'Зависит от развёртывания',
    risk: 'Нужна политика ротации и offboarding',
  },
  {
    id: '2fa',
    label: 'Только 2FA (TOTP)',
    desc: 'Не хранит пароли сайтов — одноразовые коды',
    tools: ['Aegis', 'andOTP', 'Authy', 'WinAuth'],
    e2e: 'Секрет TOTP на устройстве',
    risk: 'Потеря телефона без бэкапа кодов',
  },
];

function strengthScore(pwd) {
  let score = 0;
  if (pwd.length >= 12) score += 25;
  if (pwd.length >= 16) score += 15;
  if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score += 20;
  if (/\d/.test(pwd)) score += 15;
  if (/[^a-zA-Z0-9]/.test(pwd)) score += 25;
  return Math.min(100, score);
}

function strengthLabel(score) {
  if (score < 35) return {text: 'Слабый', color: 'var(--ifm-color-danger)'};
  if (score < 65) return {text: 'Средний', color: 'var(--ifm-color-warning)'};
  if (score < 85) return {text: 'Хороший', color: 'var(--ifm-color-info)'};
  return {text: 'Надёжный', color: 'var(--ifm-color-success)'};
}

function PasswordManagerComparePlayInner() {
  const [modelId, setModelId] = useState('cloud');
  const [pwd, setPwd] = useState('');
  const m = MODELS.find((x) => x.id === modelId) ?? MODELS[0];
  const score = useMemo(() => strengthScore(pwd), [pwd]);
  const label = strengthLabel(score);

  return (
    <DemoShell>
      <DemoCard
        title="Модели менеджеров паролей"
        subtitle="Сравните подход к хранению и проверьте силу мастер-пароля"
      >
        <div className={toolStyles.chips} style={{marginBottom: '0.65rem'}}>
          {MODELS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={clsx(toolStyles.chip, modelId === item.id && toolStyles.chipActive)}
              onClick={() => setModelId(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <p className={styles.lead}>{m.desc}</p>
        <div className={styles.grid2}>
          <div className={styles.card}>
            <h5>Примеры</h5>
            {m.tools.map((t) => (
              <span key={t} className={styles.badge} style={{marginRight: '0.3rem'}}>
                {t}
              </span>
            ))}
          </div>
          <div className={styles.card}>
            <h5>Шифрование / риск</h5>
            <p style={{margin: 0, fontSize: '0.82rem'}}>
              <strong>E2E:</strong> {m.e2e}
              <br />
              <strong>Риск:</strong> {m.risk}
            </p>
          </div>
        </div>

        <label className="it-demo__label" style={{marginTop: '0.75rem'}}>
          Проверка мастер-пароля (демо)
        </label>
        <input
          type="password"
          className={styles.search}
          placeholder="Введите пароль — не отправляется на сервер"
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
          autoComplete="off"
        />
        <div className={styles.meter}>
          <div
            className={styles.meterFill}
            style={{width: `${score}%`, background: label.color}}
          />
        </div>
        <p className="it-demo__hint" style={{margin: 0}}>
          Оценка: <strong style={{color: label.color}}>{label.text}</strong>
          {pwd.length > 0 && ` (${score}/100). `}
          В продакшене используйте генератор vault на 20+ случайных символов.
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default PasswordManagerComparePlayInner;
