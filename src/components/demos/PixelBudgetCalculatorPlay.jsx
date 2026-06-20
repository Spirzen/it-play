import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {formatMB, rawPixelBytes} from '@/components/shared/kb/mediaInteractiveEngines';
import {toolStyles, styles} from '@/components/shared/kb/basicsPlayUi';

const FORMATS = [
  {id: 'rgb24', label: 'RGB 24-bit', bpp: 24},
  {id: 'rgba32', label: 'RGBA 32-bit', bpp: 32},
  {id: 'png8', label: 'PNG-8', bpp: 8},
];

function PixelBudgetCalculatorPlayInner() {
  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);
  const [bpp, setBpp] = useState(24);

  const bytes = useMemo(() => rawPixelBytes(width, height, bpp), [width, height, bpp]);
  const mp = ((width * height) / 1_000_000).toFixed(2);

  return (
    <DemoShell>
      <DemoCard
        title="Калькулятор объёма растра"
        subtitle="Ширина × высота × байт на пиксель — до сжатия JPEG / PNG / WebP"
      >
        <div className={styles.rangeRow}>
          <label className="it-demo__label" htmlFor="px-w" style={{margin: 0, textTransform: 'none'}}>Ширина</label>
          <input id="px-w" className="it-demo__range" type="range" min={320} max={3840} step={10} value={width} onChange={(e) => setWidth(Number(e.target.value))} />
          <strong>{width}</strong>
        </div>
        <div className={styles.rangeRow}>
          <label className="it-demo__label" htmlFor="px-h" style={{margin: 0, textTransform: 'none'}}>Высота</label>
          <input id="px-h" className="it-demo__range" type="range" min={240} max={2160} step={10} value={height} onChange={(e) => setHeight(Number(e.target.value))} />
          <strong>{height}</strong>
        </div>

        <div className={toolStyles.chips} style={{margin: '0.5rem 0 0.75rem'}}>
          {FORMATS.map((f) => (
            <button
              key={f.id}
              type="button"
              className={clsx(toolStyles.chip, bpp === f.bpp && toolStyles.chipActive)}
              onClick={() => setBpp(f.bpp)}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="it-demo__stat">
          <div className="it-demo__statValue">{formatMB(bytes)}</div>
          <div className="it-demo__statLabel">
            {mp} Мп · {bpp} бит/пикс · несжатый буфер
          </div>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default PixelBudgetCalculatorPlayInner;
