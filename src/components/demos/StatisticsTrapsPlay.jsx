import React, {useMemo, useState} from 'react';
import {
  Canvas2D,
  ChipRow,
  Hint,
  PlayRoot,
} from '@/components/shared/dataMarkupPlayKit';

const GROUPS = {
  overall: [
    {x: 0, y: 70, g: 'A'},
    {x: 1, y: 65, g: 'A'},
    {x: 2, y: 68, g: 'A'},
    {x: 3, y: 40, g: 'B'},
    {x: 4, y: 45, g: 'B'},
    {x: 5, y: 42, g: 'B'},
  ],
  byGroup: [
    {x: 0, y: 85, g: 'A'},
    {x: 1, y: 80, g: 'A'},
    {x: 2, y: 82, g: 'A'},
    {x: 3, y: 82, g: 'B'},
    {x: 4, y: 78, g: 'B'},
    {x: 5, y: 80, g: 'B'},
  ],
};

export default function StatisticsTrapsPlay() {
  const [view, setView] = useState('overall');
  const points = GROUPS[view];

  const draw = useMemo(
    () => (ctx, w, h, theme) => {
      const pad = 28;
      const colors = {A: theme.primary, B: theme.error};
      points.forEach((p) => {
        ctx.fillStyle = colors[p.g];
        ctx.beginPath();
        ctx.arc(pad + p.x * ((w - pad * 2) / 5), h - pad - p.y * ((h - pad * 2) / 100), 7, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.strokeStyle = theme.grid;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(pad, h - pad);
      ctx.lineTo(w - pad, h - pad);
      ctx.moveTo(pad, pad);
      ctx.lineTo(pad, h - pad);
      ctx.stroke();
    },
    [points],
  );

  return (
    <PlayRoot title="Ловушки статистики" subtitle="Simpson's paradox — агрегат vs группы">
      <ChipRow
        value={view}
        onChange={setView}
        options={[
          {id: 'overall', label: 'Общий график'},
          {id: 'byGroup', label: 'Группы A / B'},
        ]}
      />
      <Canvas2D draw={draw} height={180} />
      <Hint>
        {view === 'overall'
          ? 'В среднем B «ниже» — но внутри каждой группы A лучше!'
          : 'При stratification paradox исчезает — всегда смотрите подгруппы.'}
      </Hint>
    </PlayRoot>
  );
}
