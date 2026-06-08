import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  TASK_EDGES,
  TASK_NODES,
  adjacencyList,
  adjacencyMatrix,
  bfsSteps,
} from '@/components/shared/kb/graphCodeEngine';
import styles from '@/components/demos/GraphRepresentationPlay.module.css';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';

function edgePath(from, to) {
  const a = TASK_NODES.find((n) => n.id === from);
  const b = TASK_NODES.find((n) => n.id === to);
  if (!a || !b) return '';
  return `M ${a.x} ${a.y} L ${b.x} ${b.y}`;
}

function GraphRepresentationPlayInner() {
  const [repr, setRepr] = useState('list');
  const [bfsStep, setBfsStep] = useState(0);
  const list = useMemo(() => adjacencyList(), []);
  const {ids, matrix} = useMemo(() => adjacencyMatrix(), []);
  const {order} = useMemo(() => bfsSteps('a'), []);
  const visited = new Set(order.slice(0, bfsStep + 1));

  return (
    <DemoShell>
      <DemoCard
        title="Граф задач: представление и обход"
        subtitle="Список смежности vs матрица — и пошаговый BFS от узла &quot;ТЗ&quot;"
      >
        <div className={toolStyles.chips}>
          <button
            type="button"
            className={clsx(toolStyles.chip, repr === 'list' && toolStyles.chipActive)}
            onClick={() => setRepr('list')}
          >
            Список смежности
          </button>
          <button
            type="button"
            className={clsx(toolStyles.chip, repr === 'matrix' && toolStyles.chipActive)}
            onClick={() => setRepr('matrix')}
          >
            Матрица смежности
          </button>
        </div>

        <div className={styles.layout}>
          <svg viewBox="0 0 420 240" className={styles.svg} role="img" aria-label="Граф зависимостей задач">
            {TASK_EDGES.map((e) => (
              <path key={`${e.from}-${e.to}`} d={edgePath(e.from, e.to)} className={styles.edge} />
            ))}
            {TASK_NODES.map((n) => (
              <g key={n.id}>
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={24}
                  className={clsx(styles.node, visited.has(n.id) && styles.nodeVisited)}
                />
                <text x={n.x} y={n.y + 4} textAnchor="middle" className={styles.nodeLabel}>
                  {n.label}
                </text>
              </g>
            ))}
          </svg>

          <div className={styles.panel}>
            {repr === 'list' ? (
              <pre className={styles.struct}>
                {Object.entries(list)
                  .map(([k, v]) => `${k}: [${v.join(', ') || '—'}]`)
                  .join('\n')}
              </pre>
            ) : (
              <table className={styles.matrix}>
                <thead>
                  <tr>
                    <th />
                    {ids.map((id) => (
                      <th key={id}>{id}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {matrix.map((row, i) => (
                    <tr key={ids[i]}>
                      <th>{ids[i]}</th>
                      {row.map((cell, j) => (
                        <td key={`${i}-${j}`} className={cell ? styles.cellOn : undefined}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <div className={styles.bfs}>
              <span className="it-demo__label">BFS от "ТЗ" (a)</span>
              <p className={styles.order}>{order.join(' → ')}</p>
              <div className={styles.controls}>
                <button
                  type="button"
                  className="it-demo__btn it-demo__btn--secondary"
                  disabled={bfsStep <= 0}
                  onClick={() => setBfsStep((s) => Math.max(0, s - 1))}
                >
                  ←
                </button>
                <button
                  type="button"
                  className="it-demo__btn it-demo__btn--primary"
                  disabled={bfsStep >= order.length - 1}
                  onClick={() => setBfsStep((s) => Math.min(order.length - 1, s + 1))}
                >
                  Шаг BFS →
                </button>
              </div>
            </div>
          </div>
        </div>

        <p className="it-demo__hint" style={{marginBottom: 0}}>
          Список экономит память на разреженных графах; матрица даёт O(1) проверку ребра. Для обхода соседей удобнее
          список.
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default GraphRepresentationPlayInner;
