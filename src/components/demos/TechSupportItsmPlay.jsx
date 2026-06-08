import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {ITSM_BLOCKS, ITSM_FLOW} from '@/components/shared/kb/techSupportEngines';
import styles from '@/components/shared/kb/techSupportDemo.module.css';

function TechSupportItsmPlayInner() {
  const [blockId, setBlockId] = useState('incident');
  const [flowStep, setFlowStep] = useState(0);

  const block = ITSM_BLOCKS.find((b) => b.id === blockId) ?? ITSM_BLOCKS[0];

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="ITSM — управление ИТ-услугами"
        subtitle="Процессы ITIL 4 и путь тикета в ServiceNow / Jira Service Desk"
      >
        <p className="it-demo__label">Области ITSM</p>
        <div className={styles.grid2}>
          {ITSM_BLOCKS.map((b) => (
            <button
              key={b.id}
              type="button"
              className={clsx(styles.card, blockId === b.id && styles.cardActive)}
              onClick={() => setBlockId(b.id)}
            >
              <span className={styles.cardIcon}>{b.icon}</span>
              <span className={styles.cardLabel}>{b.label}</span>
              <ul className={styles.cardList}>
                {b.processes.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </button>
          ))}
        </div>

        <div className={styles.detailBox}>
          <p className={styles.detailTitle}>
            {block.icon} {block.label}
          </p>
          <p className={styles.detailText}>
            ITSM переводит поддержку из "пожаротушения" в регламентированные процессы с SLA и
            аналитикой. {block.processes.join(' · ')}.
          </p>
        </div>

        <p className="it-demo__label">Жизненный цикл обращения в системе</p>
        <div className={styles.flowSteps}>
          {ITSM_FLOW.map((line, i) => (
            <React.Fragment key={line}>
              {i > 0 && <div className={styles.connector} aria-hidden />}
              <button
                type="button"
                className={clsx(styles.flowStep, flowStep === i && styles.flowStepActive)}
                onClick={() => setFlowStep(i)}
              >
                <span className={styles.flowIcon}>{i + 1}</span>
                <div className={styles.flowBody}>
                  <p className={styles.flowDetail}>{line}</p>
                </div>
              </button>
            </React.Fragment>
          ))}
        </div>

        <p className={styles.footer}>
          Инцидент восстанавливает сервис; Problem Management устраняет корневую причину;
          Change Management снижает риски изменений через CAB.
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default TechSupportItsmPlayInner;
