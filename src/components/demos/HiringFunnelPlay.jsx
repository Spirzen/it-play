import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {HIRING_STAGES, simulateHiringFunnel} from '@/components/shared/kb/careerInteractiveEngines';
import {styles} from '@/components/shared/kb/basicsPlayUi';

function HiringFunnelPlayInner() {
  const [batch, setBatch] = useState(200);
  const [active, setActive] = useState('ats');

  const stages = useMemo(() => simulateHiringFunnel(batch), [batch]);
  const activeStage = HIRING_STAGES.find((s) => s.id === active);
  const finalCount = stages[stages.length - 1]?.count ?? 0;

  return (
    <DemoShell>
      <DemoCard
        title="Воронка найма в IT"
        subtitle="Сколько кандидатов доходит до каждого этапа при типичных конверсиях"
      >
        <div className={styles.rangeRow}>
          <label className="it-demo__label" htmlFor="funnel-batch" style={{margin: 0, textTransform: 'none'}}>
            Откликов
          </label>
          <input
            id="funnel-batch"
            className="it-demo__range"
            type="range"
            min={50}
            max={500}
            step={10}
            value={batch}
            onChange={(e) => setBatch(Number(e.target.value))}
          />
          <strong>{batch}</strong>
        </div>

        <div className={styles.funnelList}>
          {stages.map((stage) => (
            <button
              key={stage.id}
              type="button"
              className={styles.funnelStep}
              onClick={() => setActive(stage.id)}
            >
              <span className={styles.funnelLabel}>{stage.label}</span>
              <div className={styles.funnelBarWrap}>
                <div
                  className={clsx(styles.funnelBar, active !== stage.id && styles.funnelBarMuted)}
                  style={{width: `${Math.max(22, stage.pct)}%`}}
                >
                  {stage.count} · {stage.pct}%
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className={styles.grid2}>
          <div className="it-demo__stat">
            <div className="it-demo__statValue">{finalCount}</div>
            <div className="it-demo__statLabel">до оффера</div>
          </div>
          {activeStage && (
            <div className={styles.funnelDetail}>
              <strong>{activeStage.label}</strong>
              <p className="it-demo__hint" style={{margin: '0.35rem 0 0'}}>{activeStage.tip}</p>
            </div>
          )}
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default HiringFunnelPlayInner;
