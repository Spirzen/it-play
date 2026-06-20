import React, {useMemo, useState} from 'react';
import {
  ActionBar,
  Canvas2D,
  Hint,
  MetricGrid,
  Panel,
  PlayRoot,
} from '@/components/shared/dataMarkupPlayKit';

export default function IntegerLpCuttingPlay() {
  const [cut, setCut] = useState(false);
  const lp = {x: 2.5, y: 3.2, z: 2.5 * 3 + 3.2 * 2};
  const ip = {x: 2, y: 3, z: 12};

  const plot = cut ? ip : lp;

  const draw = useMemo(
    () => (ctx, w, h, theme) => {
      const pt = (x, y) => [20 + x * 22, h - 20 - y * 22];
      ctx.strokeStyle = theme.grid;
      ctx.strokeRect(20, 20, w - 40, h - 40);
      const [px, py] = pt(plot.x, plot.y);
      ctx.fillStyle = cut ? theme.success : theme.error;
      ctx.beginPath();
      ctx.arc(px, py, 9, 0, Math.PI * 2);
      ctx.fill();
      if (!cut) {
        ctx.strokeStyle = theme.error;
        ctx.setLineDash([5, 4]);
        ctx.beginPath();
        ctx.moveTo(20, py);
        ctx.lineTo(w - 20, py);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    },
    [cut, plot],
  );

  return (
    <PlayRoot title="Целочисленное LP" subtitle="LP relaxation → cutting plane → integer solution">
      <Canvas2D draw={draw} height={200} />
      <ActionBar>
        <button type="button" className="it-demo__btn it-demo__btn--primary" onClick={() => setCut(true)}>
          Добавить cut x ≤ 2
        </button>
        <button type="button" className="it-demo__btn it-demo__btn--secondary" onClick={() => setCut(false)}>
          Сброс
        </button>
      </ActionBar>
      <MetricGrid
        items={[
          {label: 'Solution', value: `(${plot.x}, ${plot.y})`},
          {label: 'Z', value: plot.z.toFixed(1), tone: 'success'},
        ]}
      />
      <Panel title="Идея" muted>
        Branch-and-bound и cutting planes отсекают дробные вершины симплекса.
      </Panel>
      <Hint>Красная точка — дробный оптимум LP; зелёная — целочисленное решение после cut.</Hint>
    </PlayRoot>
  );
}
