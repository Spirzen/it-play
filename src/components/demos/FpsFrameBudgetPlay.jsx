import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {FPS_OPERATIONS, fpsFromBudget} from '@/components/shared/kb/mediaInteractiveEngines';
import {FPS_SEGMENT_COLORS, styles} from '@/components/shared/kb/basicsPlayUi';

const BUDGET_MS = 16.7;

function FpsFrameBudgetPlayInner() {
  const [enabled, setEnabled] = useState(() => Object.fromEntries(FPS_OPERATIONS.map((o) => [o.id, true])));

  const activeOps = useMemo(
    () => FPS_OPERATIONS.filter((o) => enabled[o.id]),
    [enabled],
  );

  const totalMs = useMemo(
    () => activeOps.reduce((s, o) => s + o.ms, 0),
    [activeOps],
  );
  const fps = fpsFromBudget(totalMs, BUDGET_MS);
  const over = totalMs > BUDGET_MS;
  const toggle = (id) => setEnabled((e) => ({...e, [id]: !e[id]}));

  return (
    <DemoShell>
      <DemoCard
        title="Бюджет кадра 16,7 мс"
        subtitle="Соберите нагрузку кадра — цель ~60 FPS в реальном времени"
      >
        {FPS_OPERATIONS.map((op) => (
          <label key={op.id} className={styles.opRow} htmlFor={`fps-${op.id}`}>
            <span>
              <input id={`fps-${op.id}`} type="checkbox" checked={enabled[op.id]} onChange={() => toggle(op.id)} />
              {op.label}
            </span>
            <span className={styles.opMs}>{op.ms.toFixed(1)} мс</span>
          </label>
        ))}

        <div className={styles.fpsStack} aria-hidden>
          {activeOps.map((op, i) => (
            <div
              key={op.id}
              className={styles.fpsSegment}
              style={{
                width: `${totalMs ? (op.ms / totalMs) * 100 : 0}%`,
                background: FPS_SEGMENT_COLORS[i % FPS_SEGMENT_COLORS.length],
              }}
              title={`${op.label}: ${op.ms} мс`}
            />
          ))}
        </div>

        <div className={styles.meter}>
          <div
            className={clsx(styles.meterFill, over ? styles.barFillError : styles.barFill)}
            style={{width: `${Math.min(100, (totalMs / BUDGET_MS) * 100)}%`}}
          />
        </div>

        <div className={styles.grid2} style={{marginTop: '0.65rem'}}>
          <div className="it-demo__stat">
            <div className="it-demo__statValue">{totalMs.toFixed(1)}</div>
            <div className="it-demo__statLabel">мс на кадр</div>
          </div>
          <div className="it-demo__stat">
            <div className={clsx('it-demo__statValue', over && styles.heatHot)}>~{fps}</div>
            <div className="it-demo__statLabel">FPS (оценка)</div>
          </div>
        </div>

        <p className={clsx(styles.verdict, over ? styles.verdictBad : styles.verdictOk)} style={{marginTop: '0.65rem'}}>
          {over
            ? `Кадр не укладывается в ${BUDGET_MS} мс — ожидайте просадки ниже 60 FPS.`
            : `Бюджет в норме — теоретически до ~${fps} FPS при стабильной нагрузке.`}
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default FpsFrameBudgetPlayInner;
