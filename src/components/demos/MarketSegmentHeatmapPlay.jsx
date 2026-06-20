import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {MARKET_SEGMENTS, segmentHeat} from '@/components/shared/kb/careerInteractiveEngines';
import {heatMeterClass, heatTextClass, toolStyles, styles} from '@/components/shared/kb/basicsPlayUi';

function MarketSegmentHeatmapPlayInner() {
  const [segmentId, setSegmentId] = useState('junior-dev');
  const segment = MARKET_SEGMENTS.find((s) => s.id === segmentId) ?? MARKET_SEGMENTS[0];
  const heat = segmentHeat(segment);
  const ratio = (segment.applicants / segment.vacancies).toFixed(1);

  return (
    <DemoShell>
      <DemoCard
        title="Тепловая карта рынка труда"
        subtitle="Ориентиры по сегментам — «лёгкий вход в IT» зависит от роли"
      >
        <div className={toolStyles.chips}>
          {MARKET_SEGMENTS.map((s) => (
            <button
              key={s.id}
              type="button"
              className={clsx(toolStyles.chip, segmentId === s.id && toolStyles.chipActive)}
              onClick={() => setSegmentId(s.id)}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className={styles.grid2} style={{marginTop: '0.85rem'}}>
          <div className="it-demo__stat">
            <div className="it-demo__statValue">{segment.applicants}</div>
            <div className="it-demo__statLabel">откликов (усл.)</div>
          </div>
          <div className="it-demo__stat">
            <div className="it-demo__statValue">{segment.vacancies}</div>
            <div className="it-demo__statLabel">вакансий (усл.)</div>
          </div>
        </div>

        <p className="it-demo__label" style={{marginTop: '0.75rem'}}>
          Соотношение <strong>{ratio}:1</strong> —{' '}
          <span className={heatTextClass(heat.level)}>{heat.label}</span>
        </p>
        <div className={styles.meter}>
          <div
            className={clsx(styles.meterFill, heatMeterClass(heat.level))}
            style={{width: `${Math.min(100, (segment.applicants / segment.vacancies) * 10)}%`}}
          />
        </div>
        <p className="it-demo__hint" style={{marginTop: '0.5rem'}}>{segment.note}</p>
      </DemoCard>
    </DemoShell>
  );
}

export default MarketSegmentHeatmapPlayInner;
