import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  computeProgress,
  getPlan,
  levelProgress,
} from '@/components/shared/kb/roleDevelopmentPlans';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';
import styles from '@/components/demos/RoleDevelopmentPlanPlay.module.css';

const TOUR_MS = 2800;

function milestoneKey(levelId, text) {
  return `${levelId}:${text}`;
}

function RoleDevelopmentPlanPlayInner({planId}) {
  const plan = getPlan(planId);
  const [activeId, setActiveId] = useState(plan?.levels[0]?.id ?? '');
  const [checked, setChecked] = useState(() => new Set());
  const [touring, setTouring] = useState(false);
  const [tourIndex, setTourIndex] = useState(0);
  const [log, setLog] = useState('');
  const tourRef = useRef(null);

  const levels = plan?.levels ?? [];
  const activeLevel = levels.find((l) => l.id === activeId) ?? levels[0];
  const totalPct = useMemo(() => computeProgress(levels, checked), [levels, checked]);

  const toggleMilestone = useCallback((levelId, text) => {
    const key = milestoneKey(levelId, text);
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const stopTour = useCallback(() => {
    setTouring(false);
    if (tourRef.current) clearInterval(tourRef.current);
    tourRef.current = null;
  }, []);

  const startTour = useCallback(() => {
    if (!levels.length) return;
    stopTour();
    setTouring(true);
    setTourIndex(0);
    setActiveId(levels[0].id);
    setLog(`▶ Тур: ${levels[0].short} — ${levels[0].goal}`);
    let idx = 0;
    tourRef.current = setInterval(() => {
      idx = (idx + 1) % levels.length;
      setTourIndex(idx);
      const lvl = levels[idx];
      setActiveId(lvl.id);
      setLog(`▶ ${lvl.short} (${lvl.duration}): ${lvl.goal}`);
    }, TOUR_MS);
  }, [levels, stopTour]);

  useEffect(() => () => stopTour(), [stopTour]);

  useEffect(() => {
    if (activeLevel && !touring) {
      const pct = levelProgress(activeLevel, checked);
      setLog(`◆ ${activeLevel.short}: ${pct}% этапа · цель — ${activeLevel.goal}`);
    }
  }, [activeId, activeLevel, checked, touring]);

  if (!plan) {
    return (
      <DemoShell>
        <DemoCard title="План не найден" subtitle={`Неизвестный planId: ${planId}`} />
      </DemoShell>
    );
  }

  return (
    <DemoShell>
      <DemoCard title={plan.title} subtitle={plan.subtitle}>
        <div className={styles.metrics}>
          <div className={styles.metric}>
            <span className={styles.metricValue}>{totalPct}%</span>
            <span className={styles.metricLabel}>Общий прогресс</span>
          </div>
          <div className={styles.metric}>
            <span className={styles.metricValue}>{levels.length}</span>
            <span className={styles.metricLabel}>{plan.timelineLabel}</span>
          </div>
          <div className={styles.metric}>
            <span className={styles.metricValue}>
              {activeLevel ? levelProgress(activeLevel, checked) : 0}%
            </span>
            <span className={styles.metricLabel}>Текущий этап</span>
          </div>
        </div>

        <div className={styles.progressBar} aria-hidden>
          <div className={styles.progressFill} style={{width: `${totalPct}%`}} />
        </div>

        <div className={styles.toolbar}>
          <div className={toolStyles.chips}>
            <button
              type="button"
              className={clsx(toolStyles.chip, touring && toolStyles.chipActive)}
              onClick={() => (touring ? stopTour() : startTour())}
            >
              {touring ? '⏹ Остановить тур' : '▶ Тур по плану'}
            </button>
            <button
              type="button"
              className={toolStyles.chip}
              onClick={() => setChecked(new Set())}
            >
              Сбросить отметки
            </button>
          </div>
        </div>

        <p className="it-demo__label">{plan.timelineLabel}</p>
        <div className={clsx(styles.rail, plan.spiral && styles.railSpiral)}>
          {levels.map((lvl, idx) => {
            const pct = levelProgress(lvl, checked);
            const isActive = activeId === lvl.id;
            return (
              <button
                key={lvl.id}
                type="button"
                className={clsx(styles.railNode, {
                  [styles.railNodeActive]: isActive,
                  [styles.railNodeTour]: touring && tourIndex === idx,
                })}
                style={{'--level-color': lvl.color}}
                onClick={() => {
                  stopTour();
                  setActiveId(lvl.id);
                }}
                title={lvl.goal}
              >
                <span className={styles.railLabel}>{lvl.label}</span>
                <span className={styles.railShort}>{lvl.short}</span>
                <span className={styles.railPct}>{pct}%</span>
              </button>
            );
          })}
        </div>

        {activeLevel && (
          <div className={styles.detail} style={{'--level-color': activeLevel.color}}>
            <div className={styles.goalCard}>
              <p className={styles.goalTitle}>
                {activeLevel.short}
                <span style={{fontWeight: 400, opacity: 0.75}}> · {activeLevel.duration}</span>
              </p>
              <p className={styles.goalMeta}>{activeLevel.goal}</p>
            </div>
            <div>
              <p className="it-demo__label">Контрольные точки</p>
              <ul className={styles.milestones}>
                {activeLevel.milestones.map((text) => {
                  const key = milestoneKey(activeLevel.id, text);
                  const done = checked.has(key);
                  return (
                    <li key={key} className={styles.milestone}>
                      <input
                        type="checkbox"
                        checked={done}
                        onChange={() => toggleMilestone(activeLevel.id, text)}
                        aria-label={text}
                      />
                      <span className={clsx(done && styles.milestoneDone)}>{text}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        )}

        <div className={styles.log}>{log}</div>
      </DemoCard>
    </DemoShell>
  );
}

/**
 * @param {{ planId: 'developer' | 'ba' | 'qa' | 'syseng' | 'security' | 'kids' }} props
 */
export default RoleDevelopmentPlanPlayInner;
