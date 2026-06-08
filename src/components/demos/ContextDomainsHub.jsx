import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {CONTEXT_HUB} from '@/components/demos/ContextDomains';
import styles from './contextPlay.module.css';

function ContextDomainsHubInner() {
  const [active, setActive] = useState('government');
  const item = CONTEXT_HUB.find((h) => h.id === active);

  return (
    <DemoShell>
      <DemoCard
        title="Карта отраслей"
        subtitle="Выберите домен — увидите, какие ИТ-системы и стандарты типичны для предметной области"
      >
        <div className={styles.hubGrid}>
          {CONTEXT_HUB.map((h) => (
            <button
              key={h.id}
              type="button"
              className={clsx(styles.hubCard, active === h.id && styles.hubCardActive)}
              onClick={() => setActive(h.id)}
            >
              <span className={styles.hubIcon}>{h.icon}</span>
              <span className={styles.hubLabel}>{h.label}</span>
            </button>
          ))}
        </div>
        <div className={clsx(styles.panel, styles.hubDetail)}>
          <h5>{item.icon} {item.label}</h5>
          <p>
            <strong>Типичный ИТ-контекст:</strong> {item.it}
          </p>
          <p style={{marginTop: '0.35rem'}}>
            Откройте подраздел в сайдбаре — на странице "о разделе" есть интерактивное демо с деталями
            процессов и архитектуры для этой отрасли.
          </p>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default ContextDomainsHubInner;
