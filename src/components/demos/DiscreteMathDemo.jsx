import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  DEMO_GRAPH,
  GRAPH_LAYOUT,
  SET_PRESETS,
  bfsSteps,
  difference,
  intersection,
  parseSet,
  setToDisplay,
  symmetricDiff,
  union,
} from '@/components/shared/kb/discreteMathEngine';
import styles from '@/components/demos/DiscreteMathDemo.module.css';

const SET_OPS = [
  {id: 'union', label: 'A ∪ B', fn: union, sym: '∪'},
  {id: 'inter', label: 'A ∩ B', fn: intersection, sym: '∩'},
  {id: 'diff', label: 'A \\ B', fn: difference, sym: '\\'},
  {id: 'sym', label: 'A △ B', fn: symmetricDiff, sym: '△'},
];

function SetsPanel() {
  const [presetId, setPresetId] = useState('roles');
  const [setA, setSetA] = useState(SET_PRESETS[0].a);
  const [setB, setSetB] = useState(SET_PRESETS[0].b);
  const [opId, setOpId] = useState('inter');

  const preset = SET_PRESETS.find((p) => p.id === presetId) ?? SET_PRESETS[0];
  const op = SET_OPS.find((o) => o.id === opId) ?? SET_OPS[1];

  const result = useMemo(() => {
    const a = parseSet(setA);
    const b = parseSet(setB);
    return setToDisplay(op.fn(a, b));
  }, [setA, setB, op]);

  const applyPreset = (id) => {
    const p = SET_PRESETS.find((x) => x.id === id);
    if (!p) return;
    setPresetId(id);
    setSetA(p.a);
    setSetB(p.b);
  };

  return (
    <div className={clsx(styles.grid, styles.setsGrid)}>
      <select
        className={styles.textarea}
        style={{minHeight: 'auto'}}
        value={presetId}
        onChange={(e) => applyPreset(e.target.value)}
      >
        {SET_PRESETS.map((p) => (
          <option key={p.id} value={p.id}>
            {p.label}
          </option>
        ))}
      </select>
      <div>
        <label>Множество A</label>
        <textarea className={styles.textarea} value={setA} onChange={(e) => setSetA(e.target.value)} />
      </div>
      <div>
        <label>Множество B</label>
        <textarea className={styles.textarea} value={setB} onChange={(e) => setSetB(e.target.value)} />
      </div>
      <div className={styles.opRow}>
        {SET_OPS.map((o) => (
          <button
            key={o.id}
            type="button"
            className={clsx(styles.opBtn, opId === o.id && styles.opBtnActive)}
            onClick={() => setOpId(o.id)}
          >
            {o.label}
          </button>
        ))}
      </div>
      <div className={styles.resultBox}>
        A {op.sym} B = {'{'}
        {result.join(', ') || '∅'}
        {'}'}
      </div>
      <p className={styles.note}>{preset.note}</p>
    </div>
  );
}

function GraphPanel() {
  const [stepIdx, setStepIdx] = useState(0);
  const steps = useMemo(
    () => bfsSteps(DEMO_GRAPH, DEMO_GRAPH.start, DEMO_GRAPH.goal),
    [],
  );
  const step = steps[Math.min(stepIdx, steps.length - 1)];
  const path = step?.path ?? [];
  const visited = new Set(step?.visited ?? []);
  const current = step?.current;
  const activeEdge = new Set();
  for (let i = 0; i < path.length - 1; i++) {
    activeEdge.add(`${path[i]}-${path[i + 1]}`);
    activeEdge.add(`${path[i + 1]}-${path[i]}`);
  }

  const stepText = () => {
    if (!step) return '';
    if (step.type === 'init') return `Старт BFS из "${DEMO_GRAPH.start}", цель — "${DEMO_GRAPH.goal}".`;
    if (step.type === 'visit') return `Посещаем "${step.current}". Очередь: [${step.queue.join(', ')}].`;
    if (step.type === 'enqueue') return `Кладём в очередь "${step.next}" из "${step.current}".`;
    if (step.type === 'found') return `Цель найдена. Кратчайший путь: ${step.path.join(' → ')}.`;
    if (step.type === 'notfound') return 'Цель недостижима в этом графе.';
    return '';
  };

  return (
    <div className={styles.grid}>
      <svg className={styles.graphSvg} viewBox="0 0 100 130" aria-label="Граф зависимостей">
        {DEMO_GRAPH.edges.map(([from, to]) => {
          const a = GRAPH_LAYOUT[from];
          const b = GRAPH_LAYOUT[to];
          const key = `${from}-${to}`;
          const onPath = activeEdge.has(key);
          return (
            <line
              key={key}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              className={onPath ? styles.edgeActive : styles.edge}
            />
          );
        })}
        {DEMO_GRAPH.nodes.map((n) => {
          const pos = GRAPH_LAYOUT[n.id];
          const isCur = current === n.id;
          const isGoal = n.id === DEMO_GRAPH.goal;
          const isVis = visited.has(n.id);
          return (
            <g key={n.id}>
              <circle
                cx={pos.x}
                cy={pos.y}
                r={7}
                className={clsx(
                  styles.node,
                  isCur && styles.nodeActive,
                  isGoal && styles.nodeGoal,
                  isVis && !isCur && styles.nodeActive,
                )}
              />
              <text x={pos.x} y={pos.y - 10} textAnchor="middle" className={styles.label}>
                {n.label}
              </text>
            </g>
          );
        })}
      </svg>
      <div className={styles.stepPanel}>{stepText()}</div>
      <div className={styles.controls}>
        <button type="button" className={styles.btn} disabled={stepIdx <= 0} onClick={() => setStepIdx(0)}>
          Сброс
        </button>
        <button
          type="button"
          className={styles.btn}
          disabled={stepIdx >= steps.length - 1}
          onClick={() => setStepIdx((i) => Math.min(i + 1, steps.length - 1))}
        >
          Шаг →
        </button>
      </div>
      <p className={styles.note}>
        BFS находит кратчайший путь в невзвешенном графе — основа маршрутизации, краулеров и анализа зависимостей
        модулей.
      </p>
    </div>
  );
}

function DiscreteMathDemoInner() {
  const [tab, setTab] = useState('sets');

  return (
    <DemoShell>
      <DemoCard title="Дискретная математика" subtitle="Операции над множествами и поиск в ширину на графе">
        <div className={styles.tabs}>
          <button
            type="button"
            className={clsx(styles.tab, tab === 'sets' && styles.tabActive)}
            onClick={() => setTab('sets')}
          >
            Множества
          </button>
          <button
            type="button"
            className={clsx(styles.tab, tab === 'graph' && styles.tabActive)}
            onClick={() => setTab('graph')}
          >
            Граф (BFS)
          </button>
        </div>
        {tab === 'sets' ? <SetsPanel /> : <GraphPanel />}
      </DemoCard>
    </DemoShell>
  );
}

export default DiscreteMathDemoInner;
