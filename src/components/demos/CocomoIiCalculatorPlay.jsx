import React, {useMemo, useState} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  projectStyles as s,
  ProjectStack,
  ProjectSlider,
  ProjectFactorGrid,
  ProjectMetrics,
  ProjectHint,
} from '@/components/shared/kb/projectPlayKit';

const FACTORS = [
  {id: 'prec', label: 'Прецедентность', desc: 'Новая предметная область', weight: 1.33},
  {id: 'flex', label: 'Гибкость процесса', desc: 'Жёсткий госконтракт', weight: 1.07},
  {id: 'arch', label: 'Архитектура / риски', desc: 'Высокая надёжность', weight: 1.26},
  {id: 'team', label: 'Команда', desc: 'Смешанный опыт', weight: 1.1},
];

function CocomoIiCalculatorPlayInner() {
  const [ksloc, setKsloc] = useState(50);
  const [factorLevel, setFactorLevel] = useState({prec: 1, flex: 1, arch: 1, team: 1});
  const [teamSize, setTeamSize] = useState(6);

  const effort = useMemo(() => {
    const scale =
      FACTORS.reduce((acc, f) => acc * (1 + (factorLevel[f.id] - 1) * (f.weight - 1)), 1) || 1;
    const base = 2.4 * Math.pow(ksloc, 1.05);
    return base * scale;
  }, [ksloc, factorLevel]);

  const calendarMonths = useMemo(() => (effort / Math.max(1, teamSize)) * 0.85, [effort, teamSize]);
  const cost = useMemo(() => effort * 280000, [effort]);

  const toggleFactor = (id) => {
    setFactorLevel((f) => ({...f, [id]: f[id] === 1 ? 2 : 1}));
  };

  return (
    <DemoShell className={s.root}>
      <DemoCard title="COCOMO II (упрощённо)" subtitle="KSLOC → человеко-месяцы и календарный срок">
        <ProjectStack>
          <ProjectSlider
            label={`Размер: ${ksloc} KSLOC (${ksloc * 1000} строк)`}
            value={ksloc}
            min={10}
            max={200}
            step={5}
            onChange={(e) => setKsloc(+e.target.value)}
          />
          <ProjectSlider
            label={`Размер команды: ${teamSize} чел.`}
            value={teamSize}
            min={3}
            max={20}
            onChange={(e) => setTeamSize(+e.target.value)}
          />

          <p className="it-demo__label">Факторы масштаба (клик — вкл/выкл риск)</p>
          <ProjectFactorGrid factors={FACTORS} active={factorLevel} onToggle={toggleFactor} />

          <ProjectMetrics
            items={[
              {label: 'чел.-мес', value: effort.toFixed(0)},
              {label: 'календ. мес', value: calendarMonths.toFixed(1)},
              {label: 'оценка (условно)', value: `${(cost / 1e6).toFixed(1)}M ₽`},
            ]}
          />

          <ProjectHint>
            Упрощённая модель для обучения. Для тендера используйте экспертную оценку + историю похожих проектов.
            Story points в спринте COCOMO не заменяют — это оценка всего этапа.
          </ProjectHint>
        </ProjectStack>
      </DemoCard>
    </DemoShell>
  );
}

export default CocomoIiCalculatorPlayInner;
