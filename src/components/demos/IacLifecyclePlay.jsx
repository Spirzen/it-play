import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {IAC_DRIFT_RESOURCES, IAC_STYLES} from '@/components/shared/kb/devopsCiCdEngines';
import styles from './devopsCiCdDemo.module.css';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';

function IacLifecyclePlayInner() {
  const [styleId, setStyleId] = useState('declarative');
  const [phase, setPhase] = useState('code');
  const [scanDrift, setScanDrift] = useState(false);

  const style = IAC_STYLES.find((s) => s.id === styleId) ?? IAC_STYLES[0];

  const planLines = useMemo(() => {
    const rows = IAC_DRIFT_RESOURCES.map((r) => {
      if (!scanDrift && r.drift) return `  ~ ${r.label} (no change in code yet)`;
      if (scanDrift && r.drift) return `  ~ ${r.label}: fix SG — ${r.actual} → ${r.desired}`;
      return `    ${r.label}: no changes`;
    });
    const changes = scanDrift ? IAC_DRIFT_RESOURCES.filter((r) => r.drift).length : 0;
    return ['Plan:', ...rows, '', `Plan: ${changes} to change, 0 to destroy.`];
  }, [scanDrift]);

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Infrastructure as Code: цикл и дрейф"
        subtitle="Код в Git → plan → apply; периодическая сверка ловит ручные правки в облаке"
      >
        <div className={toolStyles.chips} style={{marginBottom: '0.5rem'}}>
          {IAC_STYLES.map((s) => (
            <button
              key={s.id}
              type="button"
              className={clsx(toolStyles.chip, styleId === s.id && toolStyles.chipActive)}
              onClick={() => setStyleId(s.id)}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className={styles.grid2}>
          <div>
            <label className="it-demo__label">Описание инфраструктуры</label>
            <pre className={styles.mono}>{style.code}</pre>
            <p className="it-demo__hint">{style.note}</p>
          </div>
          <div>
            <label className="it-demo__label">
              {phase === 'apply' ? 'Состояние после apply' : 'terraform plan / pulumi preview'}
            </label>
            <pre className={styles.mono}>{planLines.join('\n')}</pre>
            {scanDrift && (
              <p className="it-demo__hint" style={{color: '#e65100'}}>
                Configuration drift: SG изменён вручную в консоли AWS
              </p>
            )}
          </div>
        </div>

        <div className={styles.flowSteps}>
          {['code', 'plan', 'review', 'apply', 'state'].map((p) => (
            <button
              key={p}
              type="button"
              className={clsx(styles.flowStep, phase === p && styles.flowStepActive)}
              onClick={() => setPhase(p)}
            >
              {p}
            </button>
          ))}
        </div>

        <div className={styles.row}>
          <button
            type="button"
            className="it-demo__btn it-demo__btn--secondary it-demo__btn--sm"
            onClick={() => {
              setScanDrift(true);
              setPhase('plan');
            }}
          >
            Обнаружить drift
          </button>
          <button
            type="button"
            className="it-demo__btn it-demo__btn--sm"
            onClick={() => setPhase('plan')}
          >
            plan
          </button>
          <button
            type="button"
            className="it-demo__btn it-demo__btn--primary it-demo__btn--sm"
            onClick={() => {
              setPhase('apply');
              setScanDrift(false);
            }}
          >
            apply
          </button>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default IacLifecyclePlayInner;
