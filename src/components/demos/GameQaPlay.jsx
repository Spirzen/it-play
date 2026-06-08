import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {QA_SAMPLE_BUGS, QA_TYPES} from '@/components/shared/kb/gameDevEngine';
import styles from '@/components/demos/GameDevDemo.module.css';

const SEV_LABELS = {
  blocker: 'Blocker',
  major: 'Major',
  minor: 'Minor',
  tuning: 'Tuning',
};

function GameQaPlayInner() {
  const [typeId, setTypeId] = useState('functional');
  const [triaged, setTriaged] = useState({});
  const qaType = QA_TYPES.find((t) => t.id === typeId) ?? QA_TYPES[0];
  const pending = QA_SAMPLE_BUGS.filter((b) => !triaged[b.id]);
  const active = pending.find((b) => b.type === typeId) ?? pending[0];

  const triage = (bugId, sev) => {
    setTriaged((prev) => ({...prev, [bugId]: sev}));
  };

  return (
    <DemoShell className={styles.shell}>
      <DemoCard
        title="Триаж багов в игровом QA"
        subtitle="Тип тестирования → severity → решение о релизе"
      >
        <div className={styles.tabs}>
          {QA_TYPES.map((t) => (
            <button
              key={t.id}
              type="button"
              className={clsx(styles.tab, typeId === t.id && styles.tabActive)}
              onClick={() => setTypeId(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className={styles.panel} style={{marginTop: '0.65rem'}}>
          <p className={styles.panelTitle}>{qaType.label}</p>
          <ul className={styles.checkList}>
            {qaType.checks.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
          <p className={styles.hint}>
            <strong>Порог:</strong> {qaType.severity}
          </p>
        </div>

        {active && (
          <>
            <p className={styles.hint} style={{marginTop: '0.75rem'}}>
              Следующий баг в очереди:
            </p>
            <div className={styles.bugCard}>
              <strong>{active.title}</strong>
              <p className={styles.hint} style={{margin: '0.25rem 0 0'}}>
                Категория: {QA_TYPES.find((t) => t.id === active.type)?.label}
              </p>
            </div>
            <div className={styles.sevGrid} style={{marginTop: '0.5rem'}}>
              {Object.entries(SEV_LABELS).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  className={styles.sevBucket}
                  onClick={() => triage(active.id, key)}
                >
                  {label}
                </button>
              ))}
            </div>
          </>
        )}

        <p className={styles.hint} style={{marginTop: '0.75rem'}}>
          Обработано: {Object.keys(triaged).length} / {QA_SAMPLE_BUGS.length}
        </p>
        <div className={styles.bugList}>
          {QA_SAMPLE_BUGS.map((b) => (
            <div
              key={b.id}
              className={clsx(styles.bugCard, triaged[b.id] && styles.bugCardDone)}
            >
              {b.title}
              {triaged[b.id] && (
                <span className={styles.chip} style={{marginLeft: '0.35rem'}}>
                  {SEV_LABELS[triaged[b.id]]}
                </span>
              )}
            </div>
          ))}
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default GameQaPlayInner;
