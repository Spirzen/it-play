import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {PNL_PRESETS, calcPnL, formatRub} from '@/components/shared/kb/businessFinanceEngine';
import styles from '@/components/demos/BusinessFinancePlay.module.css';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';

const BAR_COLORS = {
  revenue: '#5c6bc0',
  cogs: '#ef6c00',
  gross: '#43a047',
  opex: '#8d6e63',
  net: '#2e7d32',
};

function BusinessFinancePlayInner() {
  const [presetId, setPresetId] = useState('saas');
  const [revenue, setRevenue] = useState(PNL_PRESETS[0].revenue);
  const [cogs, setCogs] = useState(PNL_PRESETS[0].cogs);
  const [opex, setOpex] = useState(PNL_PRESETS[0].opex);

  const pnl = useMemo(() => calcPnL({revenue, cogs, opex}), [revenue, cogs, opex]);
  const maxBar = Math.max(pnl.revenue, 1);

  const applyPreset = (p) => {
    setPresetId(p.id);
    setRevenue(p.revenue);
    setCogs(p.cogs);
    setOpex(p.opex);
  };

  const bars = [
    {key: 'revenue', label: 'Выручка', value: pnl.revenue},
    {key: 'cogs', label: 'Себестоимость (COGS)', value: pnl.cogs},
    {key: 'gross', label: 'Валовая прибыль', value: Math.max(0, pnl.gross)},
    {key: 'opex', label: 'Операционные расходы', value: pnl.opex},
    {key: 'net', label: 'Чистая прибыль', value: Math.max(0, pnl.net)},
  ];

  return (
    <DemoShell>
      <DemoCard
        title="P&L: выручка, себестоимость и прибыль"
        subtitle="Соберите отчёт о прибылях и убытках и посмотрите валовую и чистую маржу IT-компании"
      >
        <div className={toolStyles.chips} style={{marginBottom: '0.65rem'}}>
          {PNL_PRESETS.map((p) => (
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
        {PNL_PRESETS.find((p) => p.id === presetId)?.hint && (
          <p className="it-demo__hint" style={{marginTop: 0, marginBottom: '0.65rem'}}>
            {PNL_PRESETS.find((p) => p.id === presetId).hint}
          </p>
        )}

        <div className={styles.sliders}>
          <label className={styles.sliderRow}>
            <span>Выручка</span>
            <input
              type="range"
              min={500_000}
              max={20_000_000}
              step={100_000}
              value={revenue}
              onChange={(e) => {
                setPresetId('');
                setRevenue(Number(e.target.value));
              }}
            />
            <span>{formatRub(revenue)}</span>
          </label>
          <label className={styles.sliderRow}>
            <span>COGS</span>
            <input
              type="range"
              min={0}
              max={revenue}
              step={50_000}
              value={cogs}
              onChange={(e) => {
                setPresetId('');
                setCogs(Number(e.target.value));
              }}
            />
            <span>{formatRub(cogs)}</span>
          </label>
          <label className={styles.sliderRow}>
            <span>OPEX</span>
            <input
              type="range"
              min={0}
              max={revenue}
              step={50_000}
              value={opex}
              onChange={(e) => {
                setPresetId('');
                setOpex(Number(e.target.value));
              }}
            />
            <span>{formatRub(opex)}</span>
          </label>
        </div>

        <div className={styles.pnlBars}>
          {bars.map((b) => (
            <div key={b.key} className={styles.pnlRow}>
              <span>{b.label}</span>
              <div
                className={styles.pnlBar}
                style={{
                  width: `${(b.value / maxBar) * 100}%`,
                  background: BAR_COLORS[b.key],
                }}
              />
              <span className={styles.pnlValue}>{formatRub(b.value)}</span>
            </div>
          ))}
        </div>

        <div
          className={clsx(styles.verdict, pnl.profitable ? styles.verdictOk : styles.verdictLoss)}
        >
          {pnl.profitable
            ? `Чистая прибыль ${formatRub(pnl.net)} · маржа ${pnl.netMargin.toFixed(1)}% · наценка к COGS ${pnl.markup.toFixed(0)}%`
            : `Убыток ${formatRub(pnl.net)} — расходы превышают валовую прибыль`}
        </div>
        <p className="it-demo__hint" style={{marginBottom: 0}}>
          Валовая маржа: <strong>{pnl.grossMargin.toFixed(1)}%</strong> (выручка − COGS). Для продукта важно,
          окупается ли разработка и инфраструктура после покрытия себестоимости.
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default BusinessFinancePlayInner;
