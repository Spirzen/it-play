import React, {useCallback, useMemo, useState} from 'react';
import {
  Canvas2D,
  ChipRow,
  Hint,
  MetricGrid,
  PlayRoot,
  Section,
  SliderRow,
} from '@/components/shared/dataMarkupPlayKit';

function mul(m, v) {
  return [m[0][0] * v[0] + m[0][1] * v[1], m[1][0] * v[0] + m[1][1] * v[1]];
}

function det2(m) {
  return m[0][0] * m[1][1] - m[0][1] * m[1][0];
}

const PRESETS = {
  scale: [
    [2, 0],
    [0, 2],
  ],
  rot: [
    [0.866, -0.5],
    [0.5, 0.866],
  ],
  shear: [
    [1, 0.5],
    [0, 1],
  ],
};

export default function MatrixTransformPlay() {
  const [preset, setPreset] = useState('scale');
  const [v, setV] = useState([1, 0.5]);
  const m = PRESETS[preset];
  const out = useMemo(() => mul(m, v), [m, v]);
  const det = det2(m);

  const draw = useCallback(
    (ctx, w, h, theme) => {
      const ox = w / 2;
      const oy = h / 2;
      const sc = Math.min(w, h) * 0.22;
      const drawVec = (vec, color, width = 2) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.beginPath();
        ctx.moveTo(ox, oy);
        ctx.lineTo(ox + vec[0] * sc, oy - vec[1] * sc);
        ctx.stroke();
      };
      ctx.strokeStyle = theme.grid;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, oy);
      ctx.lineTo(w, oy);
      ctx.moveTo(ox, 0);
      ctx.lineTo(ox, h);
      ctx.stroke();
      drawVec(v, theme.muted, 1.5);
      drawVec(out, theme.primary, 2.5);
      ctx.fillStyle = theme.muted;
      ctx.font = '11px sans-serif';
      ctx.fillText('v', ox + v[0] * sc + 4, oy - v[1] * sc);
      ctx.fillStyle = theme.primary;
      ctx.fillText('Av', ox + out[0] * sc + 4, oy - out[1] * sc);
    },
    [v, out],
  );

  return (
    <PlayRoot title="Матричные преобразования" subtitle="2D-вектор × матрица — масштаб, поворот, shear">
      <ChipRow
        value={preset}
        onChange={setPreset}
        options={[
          {id: 'scale', label: '×2 масштаб'},
          {id: 'rot', label: '~30° поворот'},
          {id: 'shear', label: 'Shear'},
        ]}
      />
      <Canvas2D draw={draw} height={240} />
      <Section title="Вектор v">
        <SliderRow label="x" value={v[0]} displayValue={v[0].toFixed(1)} min={-2} max={2} step={0.1} onChange={(x) => setV([x, v[1]])} />
        <SliderRow label="y" value={v[1]} displayValue={v[1].toFixed(1)} min={-2} max={2} step={0.1} onChange={(y) => setV([v[0], y])} />
      </Section>
      <MetricGrid
        items={[
          {label: 'Av', value: `[${out[0].toFixed(2)}, ${out[1].toFixed(2)}]`},
          {label: 'det(A)', value: det.toFixed(3)},
          {label: 'Вырождена', value: Math.abs(det) < 0.01 ? 'да' : 'нет', tone: Math.abs(det) < 0.01 ? 'error' : 'success'},
        ]}
      />
      <Hint>Серый — исходный v, фиолетовый — результат умножения на матрицу A.</Hint>
    </PlayRoot>
  );
}
