import React, {useState} from 'react';

import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';


import styles from '@/components/demos/SystemAnalystRoleDemo.module.css';

const VIEWS = [
  {
    id: 'system',
    label: 'Системный',
    desc: 'Границы, интеграции, NFR, архитектурные ограничения',
    example: 'Микросервис Order API ↔ PostgreSQL, SLA 200ms',
  },
  {
    id: 'functional',
    label: 'Функциональный',
    desc: 'Что должна делать система: действия, сценарии, API',
    example: 'POST /orders — создать заказ, валидация остатков',
  },
  {
    id: 'process',
    label: 'Процессный',
    desc: 'Как течёт работа между ролями и системами',
    example: 'BPMN: оплата → резерв → отгрузка',
  },
];

const INTEGRATIONS = [
  {from: 'Shop', to: 'Payment GW', protocol: 'REST', status: 'ok'},
  {from: 'Shop', to: 'WMS', protocol: 'Kafka', status: 'warn'},
  {from: 'Shop', to: 'CRM', protocol: 'SOAP', status: 'ok'},
];

function SystemAnalystRoleDemoInner() {
  const [view, setView] = useState('system');
  const [selected, setSelected] = useState(null);

  const current = VIEWS.find((v) => v.id === view);

  return (
    <DemoShell>
      <DemoCard
        title="Роль системного аналитика"
        subtitle="Три угла анализа и карта интеграций системы"
      >
        <div className={styles.tabs}>
          {VIEWS.map((v) => (
            <button
              key={v.id}
              type="button"
              className={clsx(styles.tab, view === v.id && styles.tabActive)}
              onClick={() => setView(v.id)}
            >
              {v.label}
            </button>
          ))}
        </div>
        <p className={styles.desc}>{current.desc}</p>
        <code className={styles.example}>{current.example}</code>

        <h4 className={styles.sub}>Карта интеграций (клик — детали)</h4>
        <div className={styles.integrations}>
          <div className={styles.hub}>Shop Core</div>
          {INTEGRATIONS.map((i) => (
            <button
              key={`${i.from}-${i.to}`}
              type="button"
              className={clsx(
                styles.link,
                i.status === 'warn' && styles.linkWarn,
                selected === i.to && styles.linkActive,
              )}
              onClick={() => setSelected(i.to)}
            >
              <span>{i.to}</span>
              <small>{i.protocol}</small>
            </button>
          ))}
        </div>
        {selected && (
          <p className={styles.detail}>
            Интеграция с <strong>{selected}</strong>: контракт в OpenAPI/AsyncAPI, идемпотентность,
            обработка таймаутов.
          </p>
        )}
      </DemoCard>
    </DemoShell>
  );
}

export default SystemAnalystRoleDemoInner;
