import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  BANT_FIELDS,
  FUNNEL_PRESETS,
  FUNNEL_STAGES,
  defaultRates,
  evaluateBant,
  overallConversion,
  runFunnelSimulation,
} from '@/components/shared/kb/marketingFunnelEngine';
import styles from '@/components/demos/MarketingFunnelPlay.module.css';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';

const SEGMENT_COLORS = ['#5c6bc0', '#7e57c2', '#9575cd', '#ab47bc', '#8e24aa', '#6a1b9a'];

function MarketingFunnelPlayInner() {
  const [presetId, setPresetId] = useState('b2b');
  const [rates, setRates] = useState(defaultRates);
  const [leadBatch, setLeadBatch] = useState(200);
  const [bant, setBant] = useState({budget: true, authority: false, need: true, timeline: false});

  const stages = useMemo(() => runFunnelSimulation(leadBatch, rates), [leadBatch, rates]);
  const conversion = useMemo(() => overallConversion(stages), [stages]);
  const bantResult = useMemo(() => evaluateBant(bant), [bant]);
  const maxCount = stages[0]?.count || 1;

  const applyPreset = (preset) => {
    setPresetId(preset.id);
    setRates([...preset.rates]);
  };

  const setRate = (index, value) => {
    setRates((prev) => {
      const next = [...prev];
      next[index] = Number(value);
      return next;
    });
    setPresetId('');
  };

  return (
    <DemoShell>
      <DemoCard
        title="Воронка продаж и квалификация BANT"
        subtitle="Задайте конверсию на этапах IT-сделки и проверьте, проходит ли лид в отдел продаж"
      >
        <div className={styles.presetRow}>
          <div className={toolStyles.chips}>
            {FUNNEL_PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                className={clsx(toolStyles.chip, presetId === p.id && toolStyles.chipActive)}
                onClick={() => applyPreset(p)}
              >
                {p.label}
              </button>
            ))}
          </div>
          {FUNNEL_PRESETS.find((p) => p.id === presetId)?.hint && (
            <p className="it-demo__hint" style={{marginTop: '0.45rem', marginBottom: 0}}>
              {FUNNEL_PRESETS.find((p) => p.id === presetId).hint}
            </p>
          )}
        </div>

        <label className="it-demo__label">Стартовых лидов в месяц</label>
        <div className={styles.rateRow} style={{marginBottom: '0.65rem'}}>
          <span />
          <input
            type="range"
            min={50}
            max={500}
            step={10}
            value={leadBatch}
            onChange={(e) => setLeadBatch(Number(e.target.value))}
          />
          <strong>{leadBatch}</strong>
        </div>

        <div className={styles.rates}>
          {FUNNEL_STAGES.map((stage, i) =>
            i === 0 ? null : (
              <label key={stage.id} className={styles.rateRow}>
                <span>{stage.short}</span>
                <input
                  type="range"
                  min={5}
                  max={95}
                  value={rates[i]}
                  onChange={(e) => setRate(i, e.target.value)}
                />
                <span>{rates[i]}%</span>
              </label>
            ),
          )}
        </div>

        <div className={styles.funnel}>
          {stages.map((step, i) => (
            <div key={step.id} className={styles.funnelStep}>
              <span>{step.label}</span>
              <div
                className={styles.funnelBar}
                style={{
                  width: `${Math.max(8, (step.count / maxCount) * 100)}%`,
                  background: `linear-gradient(90deg, ${SEGMENT_COLORS[i]}, ${SEGMENT_COLORS[Math.min(i + 1, SEGMENT_COLORS.length - 1)]})`,
                }}
              />
              <span className={styles.funnelCount}>{step.count}</span>
            </div>
          ))}
        </div>

        <div className={styles.summaryRow}>
          <span>
            Конверсия лид → сделка: <strong>{conversion}%</strong>
          </span>
          <span>
            Отсев на квалификации:{' '}
            <strong>
              {stages[0].count - stages[1].count} ({Math.round((1 - stages[1].count / stages[0].count) * 100)}%)
            </strong>
          </span>
        </div>

        <hr style={{margin: '1rem 0', border: 'none', borderTop: '1px solid var(--ifm-color-emphasis-200)'}} />

        <p className="it-demo__label" style={{marginBottom: '0.35rem'}}>
          Квалификация текущего лида (BANT)
        </p>
        <div className={styles.bantGrid}>
          {BANT_FIELDS.map((field) => (
            <label key={field.id} className={styles.bantItem}>
              <input
                type="checkbox"
                checked={Boolean(bant[field.id])}
                onChange={(e) => setBant((prev) => ({...prev, [field.id]: e.target.checked}))}
              />
              <span>{field.label}</span>
            </label>
          ))}
        </div>
        <div
          className={clsx(styles.bantVerdict, bantResult.qualified ? styles.bantOk : styles.bantWarn)}
        >
          {bantResult.score}/4 — {bantResult.label}
        </div>

        <p className="it-demo__hint" style={{marginBottom: 0, marginTop: '0.75rem'}}>
          Воронка показывает, где "утекают" лиды; BANT отсекает неготовых до дорогой работы отдела продаж.
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default MarketingFunnelPlayInner;
