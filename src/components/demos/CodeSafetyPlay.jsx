import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {DISASTER_SCENARIOS, RECOVERY_TOOLS} from '@/components/shared/kb/codeSafetyEngine';
import styles from '@/components/demos/CodeSafetyPlay.module.css';

function CodeSafetyPlayInner() {
  const [scenarioId, setScenarioId] = useState('unsaved');
  const scenario = DISASTER_SCENARIOS.find((s) => s.id === scenarioId) ?? DISASTER_SCENARIOS[0];

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Защита кода от непредвиденных ситуаций"
        subtitle="Выберите сценарий потери — какие уровни защиты реально помогут"
      >
        <div className={styles.scenarios}>
          {DISASTER_SCENARIOS.map((s) => (
            <button
              key={s.id}
              type="button"
              className={clsx(styles.scenarioBtn, scenarioId === s.id && styles.scenarioBtnOn)}
              onClick={() => setScenarioId(s.id)}
            >
              {s.label}
            </button>
          ))}
        </div>
        <p className="it-demo__hint">{scenario.desc}</p>

        <div className={styles.tools}>
          {RECOVERY_TOOLS.map((t) => {
            const helps = scenario.recoveries[t.key];
            return (
              <div
                key={t.key}
                className={clsx(styles.toolCard, helps ? styles.toolOk : styles.toolFail)}
              >
                <span className={styles.toolIcon}>{t.icon}</span>
                <div>
                  <strong>{t.label}</strong>
                  <span>{helps ? 'Помогает восстановить' : 'Не спасёт в этом случае'}</span>
                </div>
              </div>
            );
          })}
        </div>

        <p className={styles.tip}>
          Комбинация автосохранения, локальной истории и регулярных коммитов в VCS закрывает почти все
          бытовые риски разработки.
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default CodeSafetyPlayInner;
