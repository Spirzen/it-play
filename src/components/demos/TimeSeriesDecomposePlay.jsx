import React, {useMemo, useState} from 'react';
import {
  Canvas2D,
  ChipRow,
  PlayRoot,
} from '@/components/shared/dataMarkupPlayKit';

function series(n, seasonAmp, noise) {
  return Array.from({length: n}, (_, i) => {
    const trend = i * 0.3;
    const seasonal = seasonAmp * Math.sin((i / 12) * Math.PI * 2);
    const noiseV = Math.sin(i * 2.1) * noise;
    return trend + seasonal + noiseV + 10;
  });
}

export default function TimeSeriesDecomposePlay() {
  const [show, setShow] = useState('observed');
  const n = 36;
  const observed = useMemo(() => series(n, 3, 0.5), []);
  const trend = useMemo(() => observed.map((_, i) => i * 0.3 + 10), [observed]);
  const seasonal = useMemo(() => observed.map((v, i) => v - trend[i]), [observed, trend]);
  const data = {observed, trend, seasonal, residual: observed.map((v, i) => v - trend[i] - seasonal[i])}[show];

  const draw = useMemo(
    () => (ctx, w, h, theme) => {
      const pad = 16;
      const max = Math.max(...data);
      const min = Math.min(...data);
      const range = max - min || 1;
      ctx.strokeStyle = theme.primary;
      ctx.lineWidth = 2;
      ctx.lineJoin = 'round';
      ctx.beginPath();
      data.forEach((v, i) => {
        const x = pad + (i / (data.length - 1)) * (w - pad * 2);
        const y = h - pad - ((v - min) / range) * (h - pad * 2);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
      ctx.strokeStyle = theme.grid;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(pad, h - pad);
      ctx.lineTo(w - pad, h - pad);
      ctx.stroke();
    },
    [data],
  );

  return (
    <PlayRoot title="Декомпозиция ряда" subtitle="Observed = trend + seasonal + residual">
      <ChipRow
        value={show}
        onChange={setShow}
        scrollable
        options={[
          {id: 'observed', label: 'Observed'},
          {id: 'trend', label: 'Trend'},
          {id: 'seasonal', label: 'Seasonal'},
          {id: 'residual', label: 'Residual'},
        ]}
      />
      <Canvas2D draw={draw} height={180} />
    </PlayRoot>
  );
}
