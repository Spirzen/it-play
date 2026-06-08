import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  CIS_PHASES,
  DELIVERY_MODELS,
  ROLLOUT_STRATEGIES,
} from '@/components/shared/kb/itBusinessModelEngine';
import styles from '@/components/demos/ItBusinessModelPlay.module.css';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';

function ItBusinessModelPlayInner() {
  const [modelId, setModelId] = useState('inhouse');
  const [phaseId, setPhaseId] = useState('need');
  const [rolloutId, setRolloutId] = useState('pilot');

  const model = DELIVERY_MODELS.find((m) => m.id === modelId) ?? DELIVERY_MODELS[0];
  const phase = CIS_PHASES.find((p) => p.id === phaseId) ?? CIS_PHASES[0];
  const rollout = ROLLOUT_STRATEGIES.find((r) => r.id === rolloutId) ?? ROLLOUT_STRATEGIES[0];

  return (
    <DemoShell>
      <DemoCard
        title="Модели поставки и жизненный цикл КИС"
        subtitle="Сравните in-house, аутсорс, коробку и low-code; пройдите этапы от потребности до внедрения"
      >
        <label className="it-demo__label">Модель разработки</label>
        <div className={styles.modelGrid}>
          {DELIVERY_MODELS.map((m) => (
            <button
              key={m.id}
              type="button"
              className={clsx(styles.modelCard, modelId === m.id && styles.modelCardActive)}
              onClick={() => setModelId(m.id)}
            >
              <strong>{m.label}</strong>
              <div style={{fontSize: '0.75rem', color: 'var(--ifm-color-content-secondary)'}}>
                {m.timeMonths[0]}–{m.timeMonths[1]} мес.
              </div>
            </button>
          ))}
        </div>

        <div className={styles.metrics}>
          <div className={styles.metric}>
            <strong>{model.costIndex}</strong>
            Индекс затрат
          </div>
          <div className={styles.metric}>
            <strong>{model.control}%</strong>
            Контроль
          </div>
          <div className={styles.metric}>
            <strong>{model.flexibility}%</strong>
            Гибкость
          </div>
        </div>
        <p className="it-demo__hint">{model.summary}</p>

        <label className="it-demo__label" style={{marginTop: '0.75rem'}}>
          Этапы создания корпоративной ИС
        </label>
        <div className={styles.phases}>
          {CIS_PHASES.map((p) => (
            <button
              key={p.id}
              type="button"
              className={clsx(styles.phaseBtn, phaseId === p.id && styles.phaseBtnActive)}
              onClick={() => setPhaseId(p.id)}
            >
              {p.label}
            </button>
          ))}
        </div>
        <ul className={styles.taskList}>
          {phase.tasks.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>

        <label className="it-demo__label" style={{marginTop: '0.75rem'}}>
          Стратегия внедрения
        </label>
        <div className={clsx(toolStyles.chips, styles.rollout)}>
          {ROLLOUT_STRATEGIES.map((r) => (
            <button
              key={r.id}
              type="button"
              className={clsx(
                toolStyles.chip,
                styles.rolloutChip,
                rolloutId === r.id && styles.rolloutChipActive,
              )}
              onClick={() => setRolloutId(r.id)}
            >
              {r.label}
            </button>
          ))}
        </div>
        <p className="it-demo__hint" style={{marginBottom: 0}}>
          <strong>{rollout.label}</strong>: риск {rollout.risk}, скорость перехода — {rollout.speed}. Для КИС чаще
          начинают с пилота в одном подразделении, затем масштабируют.
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default ItBusinessModelPlayInner;
