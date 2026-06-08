import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  CANARY_STEPS,
  DEPLOY_STRATEGIES,
  ROLLING_POOL_SIZE,
  rollingNodes,
} from '@/components/shared/kb/devopsCiCdEngines';
import styles from './devopsCiCdDemo.module.css';

function DeployStrategiesPlayInner() {
  const [strategy, setStrategy] = useState('bluegreen');
  const [activeEnv, setActiveEnv] = useState('blue');
  const [canaryPct, setCanaryPct] = useState(5);
  const [rollingDone, setRollingDone] = useState(0);

  const meta = DEPLOY_STRATEGIES.find((s) => s.id === strategy);
  const rolling = useMemo(() => rollingNodes(ROLLING_POOL_SIZE, rollingDone), [rollingDone]);

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Стратегии развёртывания"
        subtitle="Blue/Green, Canary и Rolling — переключите режим и поэкспериментируйте с трафиком"
      >
        <div className={styles.chips}>
          {DEPLOY_STRATEGIES.map((s) => (
            <button
              key={s.id}
              type="button"
              className={clsx(styles.chip, strategy === s.id && styles.chipActive)}
              onClick={() => {
                setStrategy(s.id);
                setRollingDone(0);
                setCanaryPct(5);
              }}
            >
              {s.icon} {s.label}
            </button>
          ))}
        </div>

        <p style={{margin: '0 0 0.65rem', fontSize: '0.85rem'}}>{meta.summary}</p>

        {strategy === 'bluegreen' && (
          <div className={styles.panel}>
            <div className={styles.envPair}>
              <div
                className={clsx(styles.envBox, styles.envBlue, activeEnv === 'blue' && styles.envActive)}
              >
                <strong>Blue</strong>
                <div>v1.0 — весь трафик</div>
              </div>
              <button
                type="button"
                className="it-demo__btn it-demo__btn--primary it-demo__btn--sm"
                onClick={() => setActiveEnv((e) => (e === 'blue' ? 'green' : 'blue'))}
              >
                Переключить LB →
              </button>
              <div
                className={clsx(styles.envBox, styles.envGreen, activeEnv === 'green' && styles.envActive)}
              >
                <strong>Green</strong>
                <div>v1.1 — {activeEnv === 'green' ? '100% трафика' : 'прогрев'}</div>
              </div>
            </div>
          </div>
        )}

        {strategy === 'canary' && (
          <div className={styles.panel}>
            <label className="it-demo__label">Доля трафика на новую версию: {canaryPct}%</label>
            <input
              type="range"
              className={styles.slider}
              min={0}
              max={100}
              value={canaryPct}
              onChange={(e) => setCanaryPct(Number(e.target.value))}
            />
            <div className={styles.trafficBar}>
              <div className={styles.trafficOld} style={{width: `${100 - canaryPct}%`}}>
                v1 {100 - canaryPct}%
              </div>
              <div className={styles.trafficNew} style={{width: `${canaryPct}%`}}>
                v2 {canaryPct}%
              </div>
            </div>
            <div className={styles.chips}>
              {CANARY_STEPS.map((p) => (
                <button
                  key={p}
                  type="button"
                  className={clsx(styles.chip, canaryPct === p && styles.chipActive)}
                  onClick={() => setCanaryPct(p)}
                >
                  {p}%
                </button>
              ))}
            </div>
          </div>
        )}

        {strategy === 'rolling' && (
          <div className={styles.panel}>
            <div className={styles.pool}>
              {rolling.map((n) => (
                <div
                  key={n.id}
                  className={clsx(
                    styles.instance,
                    n.state === 'new' && styles.instanceNew,
                    n.state === 'old' && styles.instanceOld,
                    n.state === 'updating' && styles.instanceUpdating,
                  )}
                  title={`Сервер ${n.id}`}
                >
                  #{n.id}
                  <br />
                  {n.version}
                </div>
              ))}
            </div>
            <button
              type="button"
              className="it-demo__btn it-demo__btn--primary it-demo__btn--sm"
              style={{marginTop: '0.5rem'}}
              disabled={rollingDone >= ROLLING_POOL_SIZE}
              onClick={() => setRollingDone((d) => Math.min(ROLLING_POOL_SIZE, d + 1))}
            >
              Следующий инстанс →
            </button>
            <button
              type="button"
              className="it-demo__btn it-demo__btn--secondary it-demo__btn--sm"
              style={{marginLeft: '0.35rem'}}
              onClick={() => setRollingDone(0)}
            >
              Сброс
            </button>
          </div>
        )}

        <div className={styles.grid2} style={{marginTop: '0.75rem'}}>
          <div className={styles.statRow}>
            <span>Откат</span>
            <strong>{meta.rollback}</strong>
          </div>
          <div className={styles.statRow}>
            <span>Стоимость</span>
            <strong>{meta.cost}</strong>
          </div>
          <div className={styles.statRow}>
            <span>Риск</span>
            <strong>{meta.risk}</strong>
          </div>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default DeployStrategiesPlayInner;
