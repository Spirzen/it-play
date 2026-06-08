import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import styles from '@/components/demos/OwaspTop10ExplorerPlay.module.css';

const ITEMS = [
  {
    id: 'a01',
    rank: 'A01',
    title: 'Broken Access Control',
    detail: 'Пользователь получает доступ к чужим объектам: IDOR, обход URL, отсутствие проверки ролей на API.',
    fix: 'Проверка прав на каждый запрос, deny-by-default, тесты на горизонтальную эскалацию.',
  },
  {
    id: 'a02',
    rank: 'A02',
    title: 'Cryptographic Failures',
    detail: 'Слабые алгоритмы, открытые секреты, HTTP вместо HTTPS, пароли без соли.',
    fix: 'TLS 1.2+, bcrypt/Argon2, ротация ключей, HSM для секретов.',
  },
  {
    id: 'a03',
    rank: 'A03',
    title: 'Injection',
    detail: 'Ввод интерпретируется как код: SQLi, XSS, CMDi, LDAPi.',
    fix: 'Параметризованные запросы, CSP, экранирование, валидация по белому списку.',
  },
  {
    id: 'a04',
    rank: 'A04',
    title: 'Insecure Design',
    detail: 'Уязвимость заложена в архитектуру: нет threat modeling, слабая модель доверия.',
    fix: 'Secure SDLC, STRIDE/DREAD, security user stories на этапе дизайна.',
  },
  {
    id: 'a05',
    rank: 'A05',
    title: 'Security Misconfiguration',
    detail: 'Дефолтные пароли, открытые bucket’ы, лишние порты, debug в проде.',
    fix: 'Hardening-чеклисты, IaC, автоматический скан конфигураций.',
  },
  {
    id: 'a06',
    rank: 'A06',
    title: 'Vulnerable Components',
    detail: 'Устаревшие библиотеки с известными CVE в зависимостях.',
    fix: 'SCA (Dependabot, OWASP Dependency-Check), политика обновлений.',
  },
  {
    id: 'a07',
    rank: 'A07',
    title: 'Auth Failures',
    detail: 'Слабые пароли, нет MFA, утечка сессий, credential stuffing.',
    fix: 'MFA, rate limit, secure cookies, блокировка после N попыток.',
  },
  {
    id: 'a08',
    rank: 'A08',
    title: 'Integrity Failures',
    detail: 'Небезопасные обновления, подмена CI/CD артефактов, отсутствие подписи.',
    fix: 'Подпись релизов, SRI для CDN, проверка цепочки поставки.',
  },
  {
    id: 'a09',
    rank: 'A09',
    title: 'Logging Failures',
    detail: 'Нет аудита, алерты не срабатывают, логи не защищены от подделки.',
    fix: 'Централизованные логи, SIEM, неизменяемое хранение, корреляция событий.',
  },
  {
    id: 'a10',
    rank: 'A10',
    title: 'SSRF',
    detail: 'Сервер выполняет запросы по URL от атакующего — доступ к внутренней сети.',
    fix: 'Блок-листы URL, без доступа к metadata (169.254.169.254), сегментация.',
  },
];

function OwaspTop10ExplorerPlayInner() {
  const [active, setActive] = useState(ITEMS[0].id);
  const item = ITEMS.find((x) => x.id === active) ?? ITEMS[0];

  return (
    <DemoShell>
      <DemoCard
        title="OWASP Top 10 — интерактивный обзор"
        subtitle="Выберите категорию: увидите суть риска и типовые меры защиты"
      >
        <div className={styles.grid} role="listbox" aria-label="OWASP Top 10">
          {ITEMS.map((it) => (
            <button
              key={it.id}
              type="button"
              role="option"
              aria-selected={active === it.id}
              className={clsx(styles.item, active === it.id && styles.itemActive)}
              onClick={() => setActive(it.id)}
            >
              <span className={styles.rank}>{it.rank}</span>
              <span className={styles.title}>{it.title}</span>
            </button>
          ))}
        </div>
        <p className={styles.detail}>
          <strong>
            {item.rank}: {item.title}
          </strong>
          <br />
          {item.detail}
        </p>
        <p className={styles.fix}>
          <strong>Защита:</strong> {item.fix}
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default OwaspTop10ExplorerPlayInner;
