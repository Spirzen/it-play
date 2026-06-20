import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  CdGraphWrap,
  CdHint,
  CdMetric,
  CdMetricGrid,
  CdStack,
  CdStepControls,
  graphEdgePath,
} from '@/components/shared/kb/codeDevPlayKit';
import {DIJKSTRA_GRAPH, dijkstraSteps} from '@/components/shared/kb/graphAlgorithmsEngine';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';
import styles from '@/components/demos/CodeDevNewPlays.module.css';

function DijkstraPathPlayInner() {
  const [start, setStart] = useState('A');
  const [stepIdx, setStepIdx] = useState(0);
  const {steps, dist} = useMemo(() => dijkstraSteps(DIJKSTRA_GRAPH, start), [start]);
  const step = steps[Math.min(stepIdx, steps.length - 1)];
  const activeEdge = step?.type === 'relax' ? step.edge : null;

  const hint =
    step?.type === 'relax'
      ? `релаксация ${step.edge.from}→${step.edge.to} (−${step.edge.w})`
      : step?.type === 'pick'
        ? `закреплена вершина ${step.current}`
        : '';

  return (
    <DemoShell>
      <DemoCard
        title="Алгоритм Дейкстры — пошагово"
        subtitle="Жадный выбор ближайшей вершины и улучшение расстояний по рёбрам"
      >
        <CdStack>
          <div className={toolStyles.chips}>
            {DIJKSTRA_GRAPH.nodes.map((n) => (
              <button
                key={n.id}
                type="button"
                className={clsx(toolStyles.chip, start === n.id && toolStyles.chipActive)}
                onClick={() => {
                  setStart(n.id);
                  setStepIdx(0);
                }}
              >
                Старт: {n.label}
              </button>
            ))}
          </div>

          <CdGraphWrap viewBox="0 0 440 260" label="Взвешенный граф">
            {DIJKSTRA_GRAPH.edges.map((e) => {
              const a = DIJKSTRA_GRAPH.nodes.find((n) => n.id === e.from);
              const b = DIJKSTRA_GRAPH.nodes.find((n) => n.id === e.to);
              const active = activeEdge && activeEdge.from === e.from && activeEdge.to === e.to;
              return (
                <g key={`${e.from}-${e.to}`}>
                  <path
                    d={graphEdgePath(e.from, e.to, DIJKSTRA_GRAPH.nodes)}
                    className={clsx(styles.graphEdge, active && styles.graphEdgeActive)}
                  />
                  <text
                    x={(a.x + b.x) / 2}
                    y={(a.y + b.y) / 2 - 8}
                    textAnchor="middle"
                    className={styles.graphSubLabel}
                  >
                    {e.w}
                  </text>
                </g>
              );
            })}
            {DIJKSTRA_GRAPH.nodes.map((n) => {
              const d = step?.dist?.[n.id];
              return (
                <g key={n.id}>
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={22}
                    className={clsx(
                      styles.graphNode,
                      step?.current === n.id && styles.graphNodeActive,
                      step?.visited?.has(n.id) && styles.graphNodeVisited,
                    )}
                  />
                  <text x={n.x} y={n.y + 4} textAnchor="middle" className={styles.graphLabel}>
                    {n.label}
                  </text>
                  <text x={n.x} y={n.y + 38} textAnchor="middle" className={styles.graphSubLabel}>
                    d={d === Infinity ? '∞' : d}
                  </text>
                </g>
              );
            })}
          </CdGraphWrap>

          <CdStepControls
            step={stepIdx}
            total={steps.length}
            hint={hint}
            onReset={() => setStepIdx(0)}
            onPrev={() => setStepIdx((i) => Math.max(0, i - 1))}
            onNext={() => setStepIdx((i) => Math.min(i + 1, steps.length - 1))}
          />

          <CdMetricGrid>
            {DIJKSTRA_GRAPH.nodes.map((n) => (
              <CdMetric
                key={n.id}
                label={`dist(${n.label})`}
                value={dist[n.id] === Infinity ? '∞' : dist[n.id]}
                tone={start === n.id ? 'accent' : 'accent'}
              />
            ))}
          </CdMetricGrid>
          <CdHint>Отрицательные веса ломают Дейкстру — используйте алгоритм Беллмана–Форда.</CdHint>
        </CdStack>
      </DemoCard>
    </DemoShell>
  );
}

export default DijkstraPathPlayInner;
