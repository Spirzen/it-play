import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import styles from '@/components/demos/DataLeakScenarioPlay.module.css';

const SCENARIOS = [
  {
    id: 'external',
    label: 'Внешняя атака',
    path: ['Интернет', 'Уязвимый API', 'БД клиентов', 'Pastebin / даркнет'],
    detail:
      'Эксплуатация CVE или подбор учётных данных → массовая выгрузка. Защита: WAF, MFA, патчи, мониторинг аномальных SELECT.',
  },
  {
    id: 'insider',
    label: 'Инсайдер',
    path: ['Сотрудник VPN', 'CRM / Git', 'USB / личная почта', 'Конкурент'],
    detail:
      'Легитимный доступ злоупотребляется. DLP на USB и почту, least privilege, UEBA, offboarding с отзывом ключей.',
  },
  {
    id: 'accident',
    label: 'Случайная',
    path: ['Менеджер', 'Письмо "всем"', 'Неверный получатель', 'Утечка в чат'],
    detail:
      'Человеческий фактор без злого умысла. Защита: предпросмотр вложений, метки "конфиденциально", обучение.',
  },
  {
    id: 'passive',
    label: 'Пассивная',
    path: ['Wi‑Fi / DNS', 'Сниффер', 'Метаданные', 'Профиль жертвы'],
    detail:
      'Без взлома сервера: перехват трафика, открытые S3. TLS везде, закрытые bucket’ы, DNSSEC где уместно.',
  },
  {
    id: 'apt',
    label: 'APT',
    path: ['Фишинг', 'Backdoor', 'Латеральное движение', 'Exfil по DNS'],
    detail:
      'Долгая кампания с маскировкой. SIEM, сегментация, threat hunting, изоляция подозрительных хостов.',
  },
];

export default function DataLeakScenarioPlay() {
  const [active, setActive] = useState(SCENARIOS[0].id);
  const scenario = SCENARIOS.find((s) => s.id === active) ?? SCENARIOS[0];

  return (
    <DemoShell>
      <DemoCard
        title="Путь утечки данных"
        subtitle="Выберите тип утечки — увидите цепочку от источника до последствий"
      >
        <div className={styles.types}>
          {SCENARIOS.map((s) => (
            <button
              key={s.id}
              type="button"
              className={clsx(styles.typeBtn, active === s.id && styles.typeBtnActive)}
              onClick={() => setActive(s.id)}
            >
              {s.label}
            </button>
          ))}
        </div>
        <div className={styles.path} aria-label="Цепочка утечки">
          {scenario.path.map((hop, i) => (
            <React.Fragment key={hop}>
              {i > 0 && <span className={styles.arrow}>→</span>}
              <span
                className={clsx(
                  styles.hop,
                  i === scenario.path.length - 1 && styles.hopDanger,
                )}
              >
                {hop}
              </span>
            </React.Fragment>
          ))}
        </div>
        <p className={styles.detail}>{scenario.detail}</p>
      </DemoCard>
    </DemoShell>
  );
}
