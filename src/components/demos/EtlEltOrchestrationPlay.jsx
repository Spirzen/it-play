import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';
import styles from '@/components/demos/IntegrationDataFlowPlay.module.css';

const ETL_STAGES = [
  {id: 'extract', label: 'Extract', note: 'Чтение из CRM, ERP, API'},
  {id: 'transform', label: 'Transform', note: 'Очистка и бизнес-правила на сервере ETL'},
  {id: 'load', label: 'Load', note: 'Запись в DWH'},
];

const ELT_STAGES = [
  {id: 'extract', label: 'Extract', note: 'Те же источники'},
  {id: 'load', label: 'Load', note: 'Сырой слой в облачном DWH'},
  {id: 'transform', label: 'Transform', note: 'SQL/dbt внутри хранилища'},
];

const ORCH = [
  {id: 'sched', label: 'Планировщик', note: 'cron 06:00 — старт DAG'},
  {id: 'extract', label: 'extract_data', note: 'SELECT sales WHERE date > yesterday'},
  {id: 'clean', label: 'clean_data', note: 'depends: extract_data'},
  {id: 'load', label: 'load_to_dwh', note: 'depends: clean_data'},
  {id: 'report', label: 'generate_report', note: 'only_on_success'},
];

function EtlEltOrchestrationPlayInner() {
  const [approach, setApproach] = useState('etl');
  const [stageIdx, setStageIdx] = useState(0);
  const [orchIdx, setOrchIdx] = useState(0);

  const stages = approach === 'etl' ? ETL_STAGES : ELT_STAGES;
  const stage = stages[Math.min(stageIdx, stages.length - 1)];
  const orch = ORCH[Math.min(orchIdx, ORCH.length - 1)];

  const orchNodes = useMemo(() => ORCH.map((t) => t.id), []);

  return (
    <DemoShell>
      <DemoCard title="ETL, ELT и оркестрация" subtitle="Сравните порядок этапов и шаги DAG">
        <div className={toolStyles.chips} style={{marginBottom: '0.65rem'}}>
          <button
            type="button"
            className={clsx(toolStyles.chip, approach === 'etl' && toolStyles.chipActive)}
            onClick={() => {
              setApproach('etl');
              setStageIdx(0);
            }}
          >
            ETL
          </button>
          <button
            type="button"
            className={clsx(toolStyles.chip, approach === 'elt' && toolStyles.chipActive)}
            onClick={() => {
              setApproach('elt');
              setStageIdx(0);
            }}
          >
            ELT
          </button>
          <button
            type="button"
            className={clsx(toolStyles.chip, approach === 'orch' && toolStyles.chipActive)}
            onClick={() => {
              setApproach('orch');
              setOrchIdx(0);
            }}
          >
            Оркестрация
          </button>
        </div>

        {approach === 'orch' ? (
          <>
            <div className={styles.pipeline}>
              {orchNodes.map((id, i) => (
                <React.Fragment key={id}>
                  {i > 0 && (
                    <span className={styles.arrow} aria-hidden>
                      →
                    </span>
                  )}
                  <div
                    className={clsx(styles.node, i === orchIdx && styles.nodeActive)}
                    style={{cursor: 'default'}}
                  >
                    {ORCH[i].label}
                  </div>
                </React.Fragment>
              ))}
            </div>
            <p className={styles.payload}>{orch.note}</p>
            <button
              type="button"
              className="it-demo__btn it-demo__btn--primary"
              onClick={() =>
                setOrchIdx((i) => (i >= ORCH.length - 1 ? 0 : i + 1))
              }
            >
              {orchIdx >= ORCH.length - 1 ? 'Сброс DAG' : 'Следующая задача'}
            </button>
          </>
        ) : (
          <>
            <div className={styles.pipeline}>
              {stages.map((s, i) => (
                <React.Fragment key={s.id}>
                  {i > 0 && (
                    <span className={styles.arrow} aria-hidden>
                      →
                    </span>
                  )}
                  <div
                    className={clsx(styles.node, i === stageIdx && styles.nodeActive)}
                    style={{cursor: 'default'}}
                  >
                    {s.label}
                  </div>
                </React.Fragment>
              ))}
            </div>
            <p className={styles.payload}>{stage.note}</p>
            <button
              type="button"
              className="it-demo__btn it-demo__btn--primary"
              onClick={() =>
                setStageIdx((i) => (i >= stages.length - 1 ? 0 : i + 1))
              }
            >
              {stageIdx >= stages.length - 1 ? 'Сброс' : 'Следующий этап'}
            </button>
          </>
        )}
      </DemoCard>
    </DemoShell>
  );
}

export default EtlEltOrchestrationPlayInner;
