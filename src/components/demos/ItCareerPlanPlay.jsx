import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  CAREER_ROLES,
  HORIZONS,
  MARKET_SIGNALS,
  SKILL_AXES,
  buildActionPlan,
  defaultSkills,
  gapAnalysis,
  marketModifier,
  rankedRoles,
} from '@/components/shared/kb/itCareerPlanEngine';
import styles from '@/components/demos/ItCareerPlanPlay.module.css';

function ItCareerPlanPlayInner() {
  const [skills, setSkills] = useState(defaultSkills);
  const [targetRole, setTargetRole] = useState('dev');
  const [horizon, setHorizon] = useState('mid');
  const [signals, setSignals] = useState(['remote', 'ai']);

  const ranking = useMemo(() => rankedRoles(skills), [skills]);
  const gaps = useMemo(() => gapAnalysis(skills, targetRole), [skills, targetRole]);
  const horizonMonths = HORIZONS.find((h) => h.id === horizon)?.months ?? 36;
  const plan = useMemo(() => buildActionPlan(gaps, horizonMonths), [gaps, horizonMonths]);
  const modifier = useMemo(() => marketModifier(signals), [signals]);
  const topFit = ranking[0]?.fit ?? 0;

  const setSkill = (id, value) => {
    setSkills((prev) => ({...prev, [id]: Number(value)}));
  };

  const toggleSignal = (id) => {
    setSignals((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  };

  return (
    <DemoShell>
      <DemoCard
        title="Конструктор карьерного плана"
        subtitle="Оцените навыки, выберите целевую роль и получите черновик шагов на выбранный горизонт"
      >
        <div className={styles.chips}>
          {HORIZONS.map((h) => (
            <button
              key={h.id}
              type="button"
              className={clsx(styles.chip, horizon === h.id && styles.chipOn)}
              onClick={() => setHorizon(h.id)}
            >
              {h.label}
            </button>
          ))}
        </div>

        <p className="it-demo__hint" style={{marginTop: 0}}>
          Тренды рынка (влияют на приоритет обучения): коэфф. {modifier.toFixed(2)}
        </p>
        <div className={styles.chips}>
          {MARKET_SIGNALS.map((s) => (
            <button
              key={s.id}
              type="button"
              className={clsx(styles.chip, signals.includes(s.id) && styles.chipOn)}
              onClick={() => toggleSignal(s.id)}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className={styles.grid}>
          <div className={styles.radar}>
            <p className="it-demo__label">Ваш профиль навыков (0–100)</p>
            {SKILL_AXES.map((axis) => (
              <label key={axis.id} className={styles.axisRow} title={axis.hint}>
                <span>{axis.label}</span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={skills[axis.id]}
                  onChange={(e) => setSkill(axis.id, e.target.value)}
                />
                <strong>{skills[axis.id]}</strong>
              </label>
            ))}
          </div>

          <div>
            <p className="it-demo__label">Совпадение с ролями</p>
            <div className={styles.roles}>
              {ranking.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  className={clsx(styles.roleCard, targetRole === r.id && styles.roleCardActive)}
                  onClick={() => setTargetRole(r.id)}
                >
                  <span>{r.label}</span>
                  <span className={styles.fit}>{r.fit}%</span>
                </button>
              ))}
            </div>
            <p className="it-demo__hint" style={{marginTop: '0.5rem'}}>
              Сейчас ближе всего: <strong>{ranking[0]?.label}</strong> ({topFit}%).
              Целевая роль для плана: {CAREER_ROLES.find((r) => r.id === targetRole)?.label}.
            </p>
          </div>
        </div>

        {gaps.length > 0 && (
          <div className={styles.gaps}>
            <p className="it-demo__label">Разрыв до целевой роли</p>
            {gaps.map((g) => (
              <div key={g.axis} className={styles.gapItem}>
                {g.axis}: {g.current} → {g.target} (приоритет: {g.priority})
              </div>
            ))}
          </div>
        )}

        <div className={styles.plan}>
          <p className="it-demo__label">Черновик плана действий</p>
          {plan.map((step) => (
            <div key={step.id} className={styles.planStep}>
              <strong>{step.title}</strong> — {step.detail} (~{step.weeks} нед.)
            </div>
          ))}
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default ItCareerPlanPlayInner;
