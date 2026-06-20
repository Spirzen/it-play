import React, {useMemo, useState} from 'react';
import {
  Canvas2D,
  ChipRow,
  CodeBlock,
  Hint,
  MetricGrid,
  PlayRoot,
  Section,
} from '@/components/shared/dataMarkupPlayKit';

const EDGES = [
  [0, 1],
  [0, 2],
  [1, 3],
  [2, 3],
  [3, 4],
];

export default function GraphTheoryPlay() {
  const [mode, setMode] = useState('adj-list');
  const n = 5;
  const degrees = useMemo(() => {
    const d = new Array(n).fill(0);
    EDGES.forEach(([a, b]) => {
      d[a] += 1;
      d[b] += 1;
    });
    return d;
  }, []);
  const handshakes = degrees.reduce((s, x) => s + x, 0);

  const draw = useMemo(
    () => (ctx, w, h, theme) => {
      const pos = [
        [w * 0.18, h * 0.32],
        [w * 0.48, h * 0.14],
        [w * 0.48, h * 0.58],
        [w * 0.78, h * 0.36],
        [w * 0.88, h * 0.72],
      ];
      ctx.strokeStyle = theme.border;
      ctx.lineWidth = 1.5;
      EDGES.forEach(([a, b]) => {
        ctx.beginPath();
        ctx.moveTo(pos[a][0], pos[a][1]);
        ctx.lineTo(pos[b][0], pos[b][1]);
        ctx.stroke();
      });
      pos.forEach(([x, y], i) => {
        ctx.fillStyle = theme.primary;
        ctx.beginPath();
        ctx.arc(x, y, 16, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.font = '600 12px var(--ifm-font-family-base, sans-serif)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(String(i), x, y);
      });
    },
    [],
  );

  const adjText = degrees
    .map(
      (d, i) =>
        `v${i}: [${EDGES.filter(([a, b]) => a === i || b === i)
          .map(([a, b]) => (a === i ? b : a))
          .join(', ')}]  deg=${d}`,
    )
    .join('\n');

  const matrixText = Array.from({length: n}, (_, i) =>
    Array.from({length: n}, (_, j) =>
      EDGES.some(([a, b]) => (a === i && b === j) || (a === j && b === i)) ? 1 : 0,
    ).join(' '),
  ).join('\n');

  return (
    <PlayRoot title="Теория графов" subtitle="Лемма о рукопожатиях и представления графа">
      <ChipRow
        value={mode}
        onChange={setMode}
        options={[
          {id: 'adj-list', label: 'Список смежности'},
          {id: 'matrix', label: 'Матрица смежности'},
        ]}
      />
      <Canvas2D draw={draw} height={200} />
      <Section title={mode === 'adj-list' ? 'Adjacency list' : 'Adjacency matrix'}>
        <CodeBlock>{mode === 'adj-list' ? adjText : matrixText}</CodeBlock>
      </Section>
      <MetricGrid
        items={[
          {label: 'Σ deg(v)', value: String(handshakes)},
          {label: '2|E|', value: String(EDGES.length * 2)},
          {label: 'Лемма', value: handshakes === EDGES.length * 2 ? '✓' : '✗', tone: 'success'},
        ]}
      />
      <Hint>Сумма степеней вершин всегда равна удвоенному числу рёбер.</Hint>
    </PlayRoot>
  );
}
