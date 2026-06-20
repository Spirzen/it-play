import React, {useCallback, useMemo, useState} from 'react';
import {
  ActionBar,
  Canvas2D,
  Hint,
  MetricGrid,
  PlayRoot,
} from '@/components/shared/dataMarkupPlayKit';

const INIT = [
  {x: 1, y: 2},
  {x: 2, y: 2.8},
  {x: 3, y: 3.1},
  {x: 4, y: 4.2},
  {x: 5, y: 4.8},
];

function fitLine(points) {
  const n = points.length;
  const sx = points.reduce((s, p) => s + p.x, 0);
  const sy = points.reduce((s, p) => s + p.y, 0);
  const sxx = points.reduce((s, p) => s + p.x * p.x, 0);
  const sxy = points.reduce((s, p) => s + p.x * p.y, 0);
  const denom = n * sxx - sx * sx;
  const b = denom ? (n * sxy - sx * sy) / denom : 0;
  const a = (sy - b * sx) / n;
  const meanY = sy / n;
  const ssTot = points.reduce((s, p) => s + (p.y - meanY) ** 2, 0);
  const ssRes = points.reduce((s, p) => s + (p.y - (a + b * p.x)) ** 2, 0);
  const r2 = ssTot ? 1 - ssRes / ssTot : 0;
  return {a, b, r2};
}

export default function RegressionLinePlay() {
  const [points, setPoints] = useState(INIT);
  const line = useMemo(() => fitLine(points), [points]);

  const draw = useCallback(
    (ctx, w, h, theme) => {
      const pad = 32;
      const xs = points.map((p) => p.x);
      const ys = points.map((p) => p.y);
      const xMax = Math.max(...xs, 5);
      const yMax = Math.max(...ys, 5);
      const tx = (x) => pad + (x / xMax) * (w - pad * 2);
      const ty = (y) => h - pad - (y / yMax) * (h - pad * 2);
      ctx.strokeStyle = theme.grid;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(pad, pad);
      ctx.lineTo(pad, h - pad);
      ctx.lineTo(w - pad, h - pad);
      ctx.stroke();
      ctx.strokeStyle = theme.primary;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(tx(0), ty(line.a));
      ctx.lineTo(tx(xMax), ty(line.a + line.b * xMax));
      ctx.stroke();
      points.forEach((p) => {
        ctx.fillStyle = theme.muted;
        ctx.beginPath();
        ctx.arc(tx(p.x), ty(p.y), 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = theme.surface;
        ctx.lineWidth = 2;
        ctx.stroke();
      });
    },
    [points, line],
  );

  const bump = (i, dy) => {
    setPoints((pts) => pts.map((p, j) => (j === i ? {...p, y: Math.max(0, Math.min(8, p.y + dy))} : p)));
  };

  return (
    <PlayRoot title="Линейная регрессия" subtitle="Сдвиг точек — меняются наклон и R²">
      <Canvas2D draw={draw} height={220} />
      <ActionBar stretch>
        {points.map((p, i) => (
          <React.Fragment key={i}>
            <button type="button" className="it-demo__btn it-demo__btn--sm it-demo__btn--secondary" onClick={() => bump(i, 0.3)}>
              ↑ y{i + 1}
            </button>
            <button type="button" className="it-demo__btn it-demo__btn--sm it-demo__btn--secondary" onClick={() => bump(i, -0.3)}>
              ↓ y{i + 1}
            </button>
          </React.Fragment>
        ))}
      </ActionBar>
      <MetricGrid
        items={[
          {label: 'y = a + bx', value: `${line.a.toFixed(2)} + ${line.b.toFixed(2)}x`},
          {label: 'R²', value: line.r2.toFixed(3), tone: 'success'},
        ]}
      />
      <Hint>R² ближе к 1 — точки лучше ложатся на прямую.</Hint>
    </PlayRoot>
  );
}
