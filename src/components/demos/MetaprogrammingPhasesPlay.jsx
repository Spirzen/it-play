import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {META_PHASES} from '@/components/shared/kb/metaprogrammingPhasesEngine';
import styles from '@/components/demos/MetaprogrammingPhasesPlay.module.css';

function MetaprogrammingPhasesPlayInner() {
  const [phaseId, setPhaseId] = useState('compile');
  const phase = META_PHASES.find((p) => p.id === phaseId) ?? META_PHASES[1];

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Фазы метапрограммирования"
        subtitle="Когда код порождает или меняет другой код — и какие риски на каждом этапе"
      >
        <div className={styles.timeline}>
          {META_PHASES.map((p) => (
            <button
              key={p.id}
              type="button"
              className={clsx(styles.phaseBtn, phaseId === p.id && styles.phaseBtnActive)}
              style={{
                borderColor: p.color,
                background:
                  phaseId === p.id
                    ? `color-mix(in srgb, ${p.color} 18%, var(--ifm-background-surface-color))`
                    : undefined,
              }}
              onClick={() => setPhaseId(p.id)}
            >
              <span className={styles.phaseLabel}>{p.label}</span>
              <span className={styles.phaseWhen}>{p.when}</span>
            </button>
          ))}
        </div>

        <p className={styles.risk}>
          Риск: <strong>{phase.risk}</strong>
        </p>

        <ul className={styles.examples}>
          {phase.examples.map((ex) => (
            <li key={ex}>{ex}</li>
          ))}
        </ul>

        <div className={styles.io}>
          <div>
            <span className="it-demo__label">До</span>
            <pre className={styles.code}>{phase.input}</pre>
          </div>
          <span className={styles.arrow} aria-hidden>
            →
          </span>
          <div>
            <span className="it-demo__label">После</span>
            <pre className={styles.code}>{phase.output}</pre>
          </div>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default MetaprogrammingPhasesPlayInner;
