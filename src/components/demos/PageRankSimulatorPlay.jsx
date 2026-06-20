import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  CdGraphWrap,
  CdHint,
  CdRange,
  CdStack,
  graphEdgePath,
} from '@/components/shared/kb/codeDevPlayKit';
import {PAGERANK_GRAPH, pageRankIterations} from '@/components/shared/kb/graphAlgorithmsEngine';
import styles from '@/components/demos/CodeDevNewPlays.module.css';

function PageRankSimulatorPlayInner() {
  const [iter, setIter] = useState(0);
  const [beta, setBeta] = useState(0.85);
  const history = useMemo(() => pageRankIterations(PAGERANK_GRAPH, beta, 30), [beta]);
  const snap = history[Math.min(iter, history.length - 1)];
  const maxRank = Math.max(...Object.values(snap.rank), 0.001);

  return (
    <DemoShell>
      <DemoCard
        title="PageRank — итерации ранжирования"
        subtitle="«Случайный сёрфер» с телепортацией: rank стекается по исходящим ссылкам"
      >
        <CdStack>
          <CdGraphWrap viewBox="0 0 380 240" label="Граф гиперссылок">
            <defs>
              <marker id="pr-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6 Z" fill="var(--ifm-color-emphasis-500)" />
              </marker>
            </defs>
            {PAGERANK_GRAPH.edges.map((e, i) => (
              <path
                key={i}
                d={graphEdgePath(e.from, e.to, PAGERANK_GRAPH.nodes)}
                className={styles.graphEdge}
                markerEnd="url(#pr-arrow)"
              />
            ))}
            {PAGERANK_GRAPH.nodes.map((n) => {
              const r = snap.rank[n.id] ?? 0;
              const radius = 16 + (r / maxRank) * 26;
              return (
                <g key={n.id}>
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={radius}
                    className={clsx(styles.graphNode, styles.graphNodeActive)}
                    style={{opacity: 0.35 + Math.min(r * 4, 0.65)}}
                  />
                  <text x={n.x} y={n.y + 4} textAnchor="middle" className={styles.graphLabel}>
                    {n.label}
                  </text>
                  <text x={n.x} y={n.y + radius + 14} textAnchor="middle" className={styles.graphSubLabel}>
                    {(r * 100).toFixed(1)}%
                  </text>
                </g>
              );
            })}
          </CdGraphWrap>

          <CdRange
            label="Итерация"
            value={iter}
            displayValue={iter}
            min={0}
            max={30}
            onChange={(e) => setIter(Number(e.target.value))}
          />
          <CdRange
            label="β — вероятность перехода по ссылке"
            value={beta}
            displayValue={beta.toFixed(2)}
            min={0.5}
            max={0.99}
            step={0.01}
            onChange={(e) => setBeta(Number(e.target.value))}
          />
          <CdHint>
            При β→1 rank концентрируется на «хабах»; телепорт (1−β) не даёт застрять на тупиковых страницах.
          </CdHint>
        </CdStack>
      </DemoCard>
    </DemoShell>
  );
}

export default PageRankSimulatorPlayInner;
