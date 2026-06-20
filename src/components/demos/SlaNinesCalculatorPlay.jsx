import React, {useMemo, useState} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  projectStyles as s,
  ProjectStack,
  ProjectSlider,
  ProjectChipRow,
  ProjectMetrics,
  ProjectPanel,
} from '@/components/shared/kb/projectPlayKit';

const PRESETS = [
  {label: '99%', nines: 2},
  {label: '99.9%', nines: 3},
  {label: '99.95%', nines: 3.3},
  {label: '99.99%', nines: 4},
  {label: '99.999%', nines: 5},
];

function availabilityFromNines(nines) {
  const digits = Math.floor(nines);
  const frac = nines - digits;
  let avail = 1;
  for (let i = 0; i < digits; i++) avail -= Math.pow(10, -(i + 2));
  if (frac > 0) avail -= frac * Math.pow(10, -(digits + 1));
  return Math.min(0.999999, Math.max(0.9, avail));
}

function SlaNinesCalculatorPlayInner() {
  const [nines, setNines] = useState(3);

  const availability = useMemo(() => availabilityFromNines(nines), [nines]);
  const downtimeYearMin = useMemo(() => (1 - availability) * 365 * 24 * 60, [availability]);
  const downtimeMonthMin = downtimeYearMin / 12;
  const downtimeWeekMin = downtimeYearMin / 52;

  const p1Budget = useMemo(() => {
    if (downtimeMonthMin < 5) return 'P1: минуты — только автоматический failover';
    if (downtimeMonthMin < 45) return 'P1: до ~40 мин/мес — нужен on-call 24/7';
    return 'P1: щедрый бюджет — но заказчик всё равно штрафует за нарушение';
  }, [downtimeMonthMin]);

  const yearDisplay =
    downtimeYearMin < 60 ? `${downtimeYearMin.toFixed(1)}` : `${(downtimeYearMin / 60).toFixed(1)}`;
  const yearUnit = downtimeYearMin < 60 ? 'мин/год' : 'ч/год';

  return (
    <DemoShell className={s.root}>
      <DemoCard title="Калькулятор SLA" subtitle="«Девятки» доступности и допустимый простой">
        <ProjectStack>
          <ProjectSlider
            label={`Доступность: ${availability.toFixed(nines >= 4 ? 5 : 4)} (${nines.toFixed(1)} nines)`}
            value={nines}
            min={2}
            max={5}
            step={0.1}
            onChange={(e) => setNines(+e.target.value)}
          />

          <ProjectChipRow
            chips={PRESETS.map((p) => ({
              label: p.label,
              active: Math.abs(nines - p.nines) < 0.05,
              onClick: () => setNines(p.nines),
            }))}
          />

          <ProjectMetrics
            items={[
              {label: yearUnit, value: yearDisplay},
              {label: 'мин/мес', value: downtimeMonthMin.toFixed(1)},
              {label: 'мин/нед', value: downtimeWeekMin.toFixed(1)},
            ]}
          />

          <ProjectPanel title="Связь с договором">
            <p className={s.panelMuted} style={{marginTop: '0.15rem'}}>
              {p1Budget}
            </p>
            <p className={s.panelMuted} style={{marginTop: '0.35rem'}}>
              SLA в договоре должен быть измерим (метрика + период + санкции). Архитектура «девяток» — в NFR.
            </p>
          </ProjectPanel>
        </ProjectStack>
      </DemoCard>
    </DemoShell>
  );
}

export default SlaNinesCalculatorPlayInner;
