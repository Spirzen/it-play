import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {CdBtn, CdGraphWrap, CdHint, CdStack, CdVerdict, graphEdgePath} from '@/components/shared/kb/codeDevPlayKit';
import {EULER_GRAPH, eulerVerdict} from '@/components/shared/kb/graphAlgorithmsEngine';
import styles from '@/components/demos/CodeDevNewPlays.module.css';

function EulerBridgesPlayInner() {
  const [used, setUsed] = useState([]);

  const toggle = (id) => {
    setUsed((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const {degree, oddCount, hasEulerTrail, allUsed} = eulerVerdict(EULER_GRAPH, used);

  return (
    <DemoShell>
      <DemoCard title="Мосты Кёнигсberg — эйлеров путь" subtitle="Кликайте мосты: каждый ровно один раз">
        <CdStack>
          <CdGraphWrap viewBox="0 0 380 260" label="Граф мостов Кёнигсberg">
            {EULER_GRAPH.edges.map((e) => {
              const on = used.includes(e.id);
              const a = EULER_GRAPH.nodes.find((n) => n.id === e.from);
              const b = EULER_GRAPH.nodes.find((n) => n.id === e.to);
              return (
                <g key={e.id} style={{cursor: 'pointer'}} onClick={() => toggle(e.id)} role="button" tabIndex={0} onKeyDown={(ev) => ev.key === 'Enter' && toggle(e.id)}>
                  <path
                    d={graphEdgePath(e.from, e.to, EULER_GRAPH.nodes)}
                    className={clsx(styles.graphEdge, on && styles.graphEdgeDone)}
                    strokeWidth={on ? 4 : 2}
                  />
                  <text
                    x={(a.x + b.x) / 2 + (e.id === 'b2' ? 10 : e.id === 'b5' ? -10 : 0)}
                    y={(a.y + b.y) / 2}
                    textAnchor="middle"
                    className={styles.graphSubLabel}
                  >
                    {e.label}
                  </text>
                </g>
              );
            })}
            {EULER_GRAPH.nodes.map((n) => (
              <g key={n.id}>
                <circle cx={n.x} cy={n.y} r={26} className={styles.graphNode} />
                <text x={n.x} y={n.y + 4} textAnchor="middle" className={styles.graphLabel}>
                  {n.label}
                </text>
              </g>
            ))}
          </CdGraphWrap>

          <CdHint>
            Степени: {Object.entries(degree).map(([k, v]) => `${k}:${v}`).join(', ')} · нечётных вершин: {oddCount}
          </CdHint>

          <CdVerdict tone={hasEulerTrail && allUsed ? 'success' : hasEulerTrail ? 'info' : 'warning'}>
            {!hasEulerTrail && 'Эйлеров путь невозможен — больше двух вершин нечётной степени (задача Кёнигсberg).'}
            {hasEulerTrail && !allUsed && 'Теоретически возможно — отметьте все 7 мостов.'}
            {hasEulerTrail && allUsed && 'Все мосты пройдены ровно по одному разу!'}
          </CdVerdict>

          <CdBtn onClick={() => setUsed([])}>Сброс</CdBtn>
        </CdStack>
      </DemoCard>
    </DemoShell>
  );
}

export default EulerBridgesPlayInner;
