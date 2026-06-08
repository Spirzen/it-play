import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {SRE_SLI_PRESETS, errorBudgetPercent} from '@/components/shared/kb/devopsCiCdEngines';
import styles from './devopsCiCdDemo.module.css';

function SreMetricsPlayInner() {
  const [presetId, setPresetId] = useState('availability');
  const preset = SRE_SLI_PRESETS.find((p) => p.id === presetId) ?? SRE_SLI_PRESETS[0];
  const [sli, setSli] = useState(preset.defaultSli);

  const budget = useMemo(() => errorBudgetPercent(sli, preset.slo), [sli, preset.slo]);
  const action =
    budget < 90 ? 'Релизы разрешены' : budget < 100 ? 'Замедлить релизы' : 'Стоп фич — чиним надёжность';

  const barClass =
    budget < 90 ? styles.budgetOk : budget < 100 ? styles.budgetWarn : styles.budgetExhausted;

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="SRE: SLI, SLO и бюджет ошибок"
        subtitle="Подвиньте фактический SLI — увидьте, когда команда должна переключиться на стабильность"
      >
        <div className={styles.chips}>
          {SRE_SLI_PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              className={styles.chip}
              style={
                presetId === p.id
                  ? {borderColor: 'var(--ifm-color-primary)', fontWeight: 600}
                  : undefined
              }
              onClick={() => {
                setPresetId(p.id);
                setSli(p.defaultSli);
              }}
            >
              {p.label}
            </button>
          ))}
        </div>

        <label className="it-demo__label">
          SLI ({preset.unit}): {sli}
          {preset.id === 'availability' ? '%' : ''}
        </label>
        <input
          type="range"
          className={styles.slider}
          min={preset.id === 'availability' ? 95 : 200}
          max={preset.id === 'availability' ? 100 : 600}
          step={preset.id === 'availability' ? 0.1 : 10}
          value={sli}
          onChange={(e) => setSli(Number(e.target.value))}
        />

        <div className={styles.grid2}>
          <div className={styles.statRow}>
            <span>SLO (цель)</span>
            <strong>
              {preset.slo}
              {preset.id === 'availability' ? '%' : ' ms'}
            </strong>
          </div>
          <div className={styles.statRow}>
            <span>Бюджет израсходован</span>
            <strong>{budget}%</strong>
          </div>
        </div>

        <div className={styles.budgetBar}>
          <div className={clsx(styles.budgetFill, barClass)} style={{width: `${Math.min(100, budget)}%`}} />
        </div>
        <p style={{margin: 0, fontWeight: 600, fontSize: '0.88rem'}}>{action}</p>
        {preset.budgetMinutes != null && (
          <p className="it-demo__hint" style={{marginTop: '0.5rem', marginBottom: 0}}>
            При SLO 99.9% допустимо ~{preset.budgetMinutes} мин простоя в месяц — error budget связывает
            бизнес и инженеров.
          </p>
        )}
      </DemoCard>
    </DemoShell>
  );
}

export default SreMetricsPlayInner;
