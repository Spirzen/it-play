import React, {useEffect, useRef, useState} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {styles} from '@/components/shared/kb/basicsPlayUi';

const SWATCHES = [
  {id: 'red', srgb: '#e53935', p3: '#ff453a', rec: '#ff1744', label: 'Красный'},
  {id: 'green', srgb: '#43a047', p3: '#30d158', rec: '#00e676', label: 'Зелёный'},
  {id: 'blue', srgb: '#1e88e5', p3: '#0a84ff', rec: '#2979ff', label: 'Синий'},
];

function drawHdr(canvas, hdr) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const cssW = canvas.clientWidth || 640;
  const cssH = 100;
  canvas.width = Math.floor(cssW * dpr);
  canvas.height = Math.floor(cssH * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  for (let x = 0; x < cssW; x += 1) {
    const t = x / cssW;
    const r = hdr ? Math.min(255, (t ** 0.45) * 255) : (t ** 0.7) * 220;
    const g = hdr ? Math.min(255, ((1 - Math.abs(t - 0.5) * 2) ** 0.5) * 255) : (1 - Math.abs(t - 0.5) * 2) * 180;
    const b = hdr ? Math.min(255, ((1 - t) ** 0.5) * 255) : (1 - t) * 200;
    ctx.fillStyle = `rgb(${r | 0},${g | 0},${b | 0})`;
    ctx.fillRect(x, 0, 1, cssH);
  }
}

function HdrToneMapPlayInner() {
  const [hdr, setHdr] = useState(true);
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const redraw = () => drawHdr(canvas, hdr);
    redraw();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(redraw) : null;
    if (wrapRef.current && ro) ro.observe(wrapRef.current);
    return () => ro?.disconnect();
  }, [hdr]);

  return (
    <DemoShell>
      <DemoCard
        title="SDR vs HDR (упрощённо)"
        subtitle="Расширенный динамический диапазон на совместимом дисплее и контенте"
      >
        <label className={styles.opRow}>
          <span>
            <input type="checkbox" checked={hdr} onChange={(e) => setHdr(e.target.checked)} />
            Режим HDR (PQ-упрощение)
          </span>
          <span className={hdr ? 'it-demo__badge it-demo__badge--success' : 'it-demo__badge it-demo__badge--warning'}>
            {hdr ? 'HDR' : 'SDR'}
          </span>
        </label>

        <div ref={wrapRef} className={styles.canvasWrap}>
          <canvas ref={canvasRef} height={100} aria-label="Градиент SDR или HDR" />
        </div>

        <div className={styles.swatchGrid}>
          {SWATCHES.map((sw) => {
            const color = hdr ? sw.p3 : sw.srgb;
            return (
              <div key={sw.id} className={styles.swatchCard}>
                <div className={styles.swatch} style={{background: color}} />
                <div className={styles.swatchLabel}>{sw.label}</div>
              </div>
            );
          })}
        </div>

        <p className="it-demo__hint" style={{marginTop: '0.55rem'}}>
          {hdr
            ? 'HDR даёт больше деталей в светах и тенях — нужны контент, дисплей и tone mapping.'
            : 'SDR (sRGB / Rec.709) — стандарт для большинства мониторов и веба.'}
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default HdrToneMapPlayInner;
