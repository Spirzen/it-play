import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';
import styles from './dataToolsPlays.module.css';

const PROVIDERS = [
  {
    id: 'gdrive',
    name: 'Google Drive',
    free: '15 ГБ',
    e2e: 'Нет (шифрование у Google)',
    selfHost: false,
    api: 'Drive API, rclone',
    note: 'Связка с Google Workspace и Docs.',
  },
  {
    id: 'onedrive',
    name: 'OneDrive',
    free: '5 ГБ',
    e2e: 'Нет',
    selfHost: false,
    api: 'Graph API, rclone',
    note: 'Files On-Demand в Windows 10/11.',
  },
  {
    id: 'dropbox',
    name: 'Dropbox',
    free: '2 ГБ',
    e2e: 'Нет',
    selfHost: false,
    api: 'REST API, rclone',
    note: 'Smart Sync, интеграции с SaaS.',
  },
  {
    id: 'mega',
    name: 'Mega',
    free: '20 ГБ',
    e2e: 'E2E по умолчанию',
    selfHost: false,
    api: 'megatools, rclone',
    note: 'Клиентское шифрование ключом пользователя.',
  },
  {
    id: 'nextcloud',
    name: 'Nextcloud',
    free: 'Ваш диск',
    e2e: 'Опционально (приложения)',
    selfHost: true,
    api: 'WebDAV, OCS API',
    note: 'Полный контроль: LDAP, OnlyOffice, Talk.',
  },
  {
    id: 'tresorit',
    name: 'Tresorit',
    free: '3 ГБ (trial)',
    e2e: 'Zero-knowledge',
    selfHost: false,
    api: 'Ограниченный enterprise API',
    note: 'Фокус на compliance и GDPR.',
  },
];

const CRITERIA = [
  {key: 'free', label: 'Бесплатно'},
  {key: 'e2e', label: 'Шифрование'},
  {key: 'selfHost', label: 'Self-hosted'},
  {key: 'api', label: 'API / CLI'},
];

function CloudStorageComparePlayInner() {
  const [active, setActive] = useState('nextcloud');
  const p = PROVIDERS.find((x) => x.id === active) ?? PROVIDERS[4];

  return (
    <DemoShell>
      <DemoCard
        title="Сравнение облачных хранилищ"
        subtitle="Бесплатный объём, модель доверия и возможность развернуть у себя"
      >
        <div className={toolStyles.chips} style={{marginBottom: '0.75rem', flexWrap: 'wrap'}}>
          {PROVIDERS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={clsx(toolStyles.chip, active === item.id && toolStyles.chipActive)}
              onClick={() => setActive(item.id)}
            >
              {item.name}
            </button>
          ))}
        </div>
        <table className={styles.compareTable}>
          <tbody>
            {CRITERIA.map((c) => (
              <tr key={c.key}>
                <th>{c.label}</th>
                <td>
                  {c.key === 'selfHost'
                    ? p.selfHost
                      ? 'Да — свой сервер'
                      : 'Только SaaS'
                    : String(p[c.key])}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className={styles.lead} style={{marginTop: '0.65rem'}}>
          {p.note}
        </p>
        <p className="it-demo__hint" style={{marginBottom: 0}}>
          Универсальный CLI: <code>rclone config</code> — один инструмент для десятков провайдеров.
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default CloudStorageComparePlayInner;
