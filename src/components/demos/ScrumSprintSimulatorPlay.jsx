import React, {useMemo, useState} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  projectStyles as s,
  ProjectStack,
  ProjectPanel,
  ProjectMetrics,
  ProjectBurndown,
  ProjectTaskList,
  ProjectMessage,
  ProjectBtnRow,
  ProjectHint,
} from '@/components/shared/kb/projectPlayKit';

const SPRINT_DAYS = 10;
const INITIAL_TASKS = [
  {id: 't1', title: 'API авторизации', points: 5, done: false},
  {id: 't2', title: 'Форма входа', points: 3, done: false},
  {id: 't3', title: 'Unit-тесты auth', points: 2, done: false},
  {id: 't4', title: 'Документация API', points: 2, done: false},
];

function ScrumSprintSimulatorPlayInner() {
  const [day, setDay] = useState(0);
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [velocityHistory, setVelocityHistory] = useState([]);
  const [scopeCreepCount, setScopeCreepCount] = useState(0);
  const [message, setMessage] = useState('');

  const totalPoints = tasks.reduce((sum, t) => sum + t.points, 0);
  const donePoints = tasks.filter((t) => t.done).reduce((sum, t) => sum + t.points, 0);
  const remaining = totalPoints - donePoints;
  const idealRemaining = totalPoints - (totalPoints / SPRINT_DAYS) * day;

  const burndown = useMemo(
    () =>
      Array.from({length: SPRINT_DAYS + 1}, (_, d) => {
        if (d > day) return null;
        if (d === day) return remaining;
        const burned = ((totalPoints - remaining) * d) / Math.max(day, 1);
        return Math.max(0, Math.round(totalPoints - burned));
      }),
    [day, remaining, totalPoints],
  );

  const advanceDay = () => {
    if (day >= SPRINT_DAYS) return;
    const pending = tasks.filter((t) => !t.done);
    if (pending.length === 0) {
      setMessage('Все задачи закрыты — спринт завершён досрочно.');
      return;
    }
    const capacity = 2 + (scopeCreepCount > 0 ? -1 : 0);
    let burned = 0;
    const next = tasks.map((t) => ({...t}));
    for (const t of next) {
      if (!t.done && burned < capacity) {
        t.done = true;
        burned += t.points;
      }
    }
    setTasks(next);
    const newDay = day + 1;
    setDay(newDay);
    const vel = next.filter((t) => t.done).reduce((sum, t) => sum + t.points, 0);
    if (newDay === SPRINT_DAYS) {
      setVelocityHistory((h) => [...h, vel]);
      setMessage(`Спринт завершён. Velocity: ${vel} SP. ${scopeCreepCount ? 'Scope creep снизил темп.' : ''}`);
    } else {
      setMessage(
        `День ${newDay}: закрыто задач, осталось ${next.filter((t) => !t.done).reduce((sum, t) => sum + t.points, 0)} SP.`,
      );
    }
  };

  const addScopeCreep = () => {
    setTasks((prev) => [
      ...prev,
      {id: `creep-${scopeCreepCount}`, title: '«Мелочь» от заказчика', points: 3, done: false, creep: true},
    ]);
    setScopeCreepCount((c) => c + 1);
    setMessage('В спринт добавили задачу без пересмотра Sprint Goal — velocity просядет.');
  };

  const reset = () => {
    setDay(0);
    setTasks(INITIAL_TASKS);
    setVelocityHistory([]);
    setScopeCreepCount(0);
    setMessage('');
  };

  return (
    <DemoShell className={s.root}>
      <DemoCard title="Симулятор Scrum-спринта" subtitle={`${SPRINT_DAYS} дней · burndown и эффект scope creep`}>
        <ProjectStack>
          <ProjectMetrics
            items={[
              {label: `День ${day} / ${SPRINT_DAYS}`, value: `${remaining} SP`},
              {label: 'Идеал на сегодня', value: `~${Math.max(0, Math.round(idealRemaining))}`},
              {
                label: 'Scope creep',
                value: scopeCreepCount,
                tone: scopeCreepCount > 0 ? 'warn' : undefined,
              },
            ]}
          />

          <ProjectPanel title="Burndown (остаток SP)">
            <ProjectBurndown days={SPRINT_DAYS} points={burndown} total={totalPoints} day={day} />
          </ProjectPanel>

          <ProjectTaskList tasks={tasks} />

          {message && <ProjectMessage tone="ok">{message}</ProjectMessage>}

          <ProjectBtnRow>
            <button type="button" className="it-demo__btn it-demo__btn--primary" onClick={advanceDay} disabled={day >= SPRINT_DAYS}>
              Следующий день
            </button>
            <button type="button" className="it-demo__btn" onClick={addScopeCreep}>
              + Scope creep (3 SP)
            </button>
            <button type="button" className="it-demo__btn" onClick={reset}>
              Сброс
            </button>
          </ProjectBtnRow>

          {velocityHistory.length > 0 && (
            <ProjectHint>Velocity (история): {velocityHistory.join(', ')} SP</ProjectHint>
          )}
        </ProjectStack>
      </DemoCard>
    </DemoShell>
  );
}

export default ScrumSprintSimulatorPlayInner;
