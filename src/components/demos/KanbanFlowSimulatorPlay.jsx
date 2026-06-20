import React, {useCallback, useMemo, useState} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  projectStyles as s,
  ProjectStack,
  ProjectSlider,
  ProjectMetrics,
  ProjectKanbanBoard,
  ProjectMessage,
  ProjectBtnRow,
} from '@/components/shared/kb/projectPlayKit';

const COLS = ['ready', 'progress', 'review', 'done'];
const COL_LABELS = {ready: 'Ready', progress: 'In Progress', review: 'Review', done: 'Done'};

function makeTasks() {
  return [
    {id: 'k1', title: 'Фича: фильтр', col: 'ready', cls: 'standard', created: 0, started: null, doneAt: null},
    {id: 'k2', title: 'Баг: 404', col: 'ready', cls: 'standard', created: 0, started: null, doneAt: null},
    {id: 'k3', title: 'Техдолг: линтер', col: 'ready', cls: 'intangible', created: 1, started: null, doneAt: null},
    {id: 'k4', title: 'P1: prod down', col: 'ready', cls: 'expedite', created: 2, started: null, doneAt: null},
  ];
}

function KanbanFlowSimulatorPlayInner() {
  const [wipLimit, setWipLimit] = useState(2);
  const [tick, setTick] = useState(0);
  const [tasks, setTasks] = useState(makeTasks);
  const [log, setLog] = useState('Нажмите «Тик потока» — задачи двигаются по pull-правилам.');

  const wipCount = tasks.filter((t) => t.col === 'progress').length;
  const wipOver = wipCount > wipLimit;

  const metrics = useMemo(() => {
    const done = tasks.filter((t) => t.doneAt !== null);
    const leadTimes = done.map((t) => t.doneAt - t.created);
    const cycleTimes = done.filter((t) => t.started !== null).map((t) => t.doneAt - t.started);
    return {
      throughput: done.length,
      avgLead: leadTimes.length ? (leadTimes.reduce((a, b) => a + b, 0) / leadTimes.length).toFixed(1) : '—',
      avgCycle: cycleTimes.length ? (cycleTimes.reduce((a, b) => a + b, 0) / cycleTimes.length).toFixed(1) : '—',
      wip: wipCount,
    };
  }, [tasks, wipCount]);

  const columns = useMemo(
    () =>
      COLS.map((col) => ({
        id: col,
        label: `${COL_LABELS[col]}${col === 'progress' ? ` (${wipCount}/${wipLimit})` : ''}`,
        tasks: tasks
          .filter((t) => t.col === col)
          .map((t) => ({id: t.id, title: t.title, cls: t.cls})),
      })),
    [tasks, wipCount, wipLimit],
  );

  const advance = useCallback(() => {
    setTick((t) => t + 1);
    setTasks((prev) => {
      const next = prev.map((t) => ({...t}));
      const order = [...next].sort((a, b) => {
        const rank = {expedite: 0, standard: 1, intangible: 2};
        return rank[a.cls] - rank[b.cls] || a.created - b.created;
      });

      for (const t of order) {
        if (t.col === 'ready') {
          const wip = next.filter((x) => x.col === 'progress').length;
          if (wip < wipLimit || t.cls === 'expedite') {
            t.col = 'progress';
            t.started = tick + 1;
          }
        } else if (t.col === 'progress' && Math.random() > 0.35) {
          t.col = 'review';
        } else if (t.col === 'review' && Math.random() > 0.4) {
          t.col = 'done';
          t.doneAt = tick + 1;
        }
      }
      return next;
    });
    setLog(
      wipOver
        ? 'WIP превышен — задачи копятся в Ready, lead time растёт.'
        : 'Поток движется. Следите за expedite и очередью в Review.',
    );
  }, [tick, wipLimit, wipOver]);

  const reset = () => {
    setTasks(makeTasks());
    setTick(0);
    setLog('Сброс. Попробуйте WIP=1 vs WIP=5.');
  };

  return (
    <DemoShell className={s.root}>
      <DemoCard title="Симулятор Kanban-потока" subtitle="WIP, lead/cycle time, expedite">
        <ProjectStack>
          <ProjectSlider
            label={`WIP-лимит In Progress: ${wipLimit}`}
            value={wipLimit}
            min={1}
            max={6}
            onChange={(e) => setWipLimit(+e.target.value)}
          />

          <ProjectMetrics
            items={[
              {label: `WIP${wipOver ? ' ⚠' : ''}`, value: metrics.wip, tone: wipOver ? 'warn' : undefined},
              {label: 'Avg lead (тики)', value: metrics.avgLead},
              {label: 'Done', value: metrics.throughput, tone: metrics.throughput > 0 ? 'success' : undefined},
            ]}
          />

          <ProjectKanbanBoard columns={columns} wipOverColumn={wipOver ? 'progress' : undefined} />

          <ProjectMessage tone={wipOver ? 'warn' : 'info'}>{log}</ProjectMessage>

          <ProjectBtnRow>
            <button type="button" className="it-demo__btn it-demo__btn--primary" onClick={advance}>
              Тик потока (день {tick})
            </button>
            <button type="button" className="it-demo__btn" onClick={reset}>
              Сброс
            </button>
          </ProjectBtnRow>
        </ProjectStack>
      </DemoCard>
    </DemoShell>
  );
}

export default KanbanFlowSimulatorPlayInner;
