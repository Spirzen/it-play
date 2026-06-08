import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {FRAME_BUDGET_MS, OPT_TECHNIQUES} from '@/components/shared/kb/gameDevEngine';
import styles from '@/components/demos/GameDevDemo.module.css';

const BASE_LOAD = 18.4;

function GameOptimizationPlayInner() {
  const [opts, setOpts] = useState(new Set());

  const toggle = (id) => {
    setOpts((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const usedMs = useMemo(() => {
    const save = OPT_TECHNIQUES.filter((o) => opts.has(o.id)).reduce((s, o) => s + o.saveMs, 0);
    return Math.max(6, BASE_LOAD - save);
  }, [opts]);

  const fps = Math.round(1000 / usedMs);
  const ok = usedMs <= FRAME_BUDGET_MS;

  return (
    <DemoShell className={styles.shell}>
      <DemoCard
        title="Оптимизация под 60 FPS"
        subtitle="Базовая нагрузка &quot;города&quot; 18.4 ms — включайте техники и возвращайтесь в бюджет"
      >
        <p className={clsx(styles.fpsGauge, ok ? styles.fpsOk : styles.fpsBad)} aria-live="polite">
          {fps} FPS <span style={{fontSize: '0.9rem'}}>({usedMs.toFixed(1)} ms)</span>
        </p>
        <div className={styles.barTrack} style={{height: '0.5rem', marginBottom: '0.75rem'}}>
          <div
            className={styles.barFill}
            style={{
              width: `${Math.min(100, (usedMs / FRAME_BUDGET_MS) * 100)}%`,
              background: ok ? 'var(--ifm-color-success)' : 'var(--ifm-color-danger)',
            }}
          />
        </div>

        <div className={styles.compList}>
          {OPT_TECHNIQUES.map((o) => {
            const on = opts.has(o.id);
            return (
              <button
                key={o.id}
                type="button"
                className={clsx(styles.compItem, on && styles.compItemOn)}
                onClick={() => toggle(o.id)}
              >
                <span className={clsx(styles.compDot, on && styles.compDotOn)} />
                <div style={{textAlign: 'left', flex: 1}}>
                  <strong style={{fontSize: '0.82rem'}}>
                    {o.label}{' '}
                    <span style={{color: 'var(--ifm-color-success)', fontWeight: 600}}>
                      −{o.saveMs} ms
                    </span>
                  </strong>
                  <p className={styles.hint} style={{margin: '0.15rem 0 0'}}>
                    {o.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        <p className={styles.hint}>
          Суммарная экономия: {(BASE_LOAD - usedMs).toFixed(1)} ms. Цель — уложиться в{' '}
          {FRAME_BUDGET_MS} ms (60 FPS).
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default GameOptimizationPlayInner;
