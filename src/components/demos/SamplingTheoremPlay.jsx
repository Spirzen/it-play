import React, {useEffect, useRef, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {isAliasing, nyquistFrequency} from '@/components/shared/kb/mediaInteractiveEngines';
import {readCanvasColors, styles} from '@/components/shared/kb/basicsPlayUi';

function drawSampling(canvas, sampleRate, signalHz) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const colors = readCanvasColors(canvas);
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const cssW = canvas.clientWidth || 640;
  const cssH = 200;
  canvas.width = Math.floor(cssW * dpr);
  canvas.height = Math.floor(cssH * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const w = cssW;
  const h = cssH;
  ctx.fillStyle = colors.bg;
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = colors.wave;
  ctx.globalAlpha = 0.85;
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let x = 0; x < w; x += 1) {
    const t = (x / w) * 0.01;
    const y = h / 2 + Math.sin(2 * Math.PI * signalHz * t) * (h * 0.32);
    if (x === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.globalAlpha = 1;

  const alias = isAliasing(signalHz, sampleRate);
  const step = w / (sampleRate * 0.01);
  ctx.fillStyle = alias ? colors.sampleBad : colors.sampleOk;
  for (let x = 0; x < w; x += step) {
    const t = (x / w) * 0.01;
    const y = h / 2 + Math.sin(2 * Math.PI * signalHz * t) * (h * 0.32);
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = colors.text;
  ctx.font = '600 11px var(--ifm-font-family-base, sans-serif)';
  ctx.fillText(
    `Сигнал ${signalHz} Гц · Fs ${sampleRate} Гц · Найквист ${nyquistFrequency(sampleRate)} Гц`,
    10,
    18,
  );
}

function SamplingTheoremPlayInner() {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const [sampleRate, setSampleRate] = useState(8000);
  const signalHz = 3000;
  const alias = isAliasing(signalHz, sampleRate);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const redraw = () => drawSampling(canvas, sampleRate, signalHz);
    redraw();

    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(redraw) : null;
    if (wrapRef.current && ro) ro.observe(wrapRef.current);

    return () => ro?.disconnect();
  }, [sampleRate]);

  return (
    <DemoShell>
      <DemoCard
        title="Теорема отсчётов"
        subtitle="Частота дискретизации должна превышать удвоенную частоту сигнала"
      >
        <div ref={wrapRef} className={styles.canvasWrap}>
          <canvas ref={canvasRef} height={200} aria-label="График сигнала и отсчётов" />
        </div>

        <div className={styles.rangeRow} style={{marginTop: '0.75rem'}}>
          <label className="it-demo__label" htmlFor="fs-range" style={{margin: 0, textTransform: 'none'}}>
            Fs
          </label>
          <input
            id="fs-range"
            className="it-demo__range"
            type="range"
            min={4000}
            max={20000}
            step={500}
            value={sampleRate}
            onChange={(e) => setSampleRate(Number(e.target.value))}
          />
          <strong>{sampleRate} Гц</strong>
        </div>

        <p className={clsx(styles.verdict, alias ? styles.verdictBad : styles.verdictOk)}>
          {alias
            ? 'Алиасинг: частота сигнала выше половины Fs — исходный тон восстановить нельзя.'
            : 'Условие Шеннона выполнено — отсчётов достаточно для восстановления сигнала.'}
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default SamplingTheoremPlayInner;
