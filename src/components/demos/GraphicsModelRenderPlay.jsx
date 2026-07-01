import React, {useCallback, useEffect, useRef, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {styles} from '@/components/shared/kb/basicsPlayUi';

const W = 320;
const H = 200;
const PHASES = [
  {id: 'model', label: 'Модель', hint: 'Числа в памяти: x, y, vx, vy, color'},
  {id: 'update', label: 'update()', hint: 'Физика и отскок от стен'},
  {id: 'render', label: 'render()', hint: 'clearRect + arc по координатам модели'},
  {id: 'loop', label: 'Цикл', hint: 'requestAnimationFrame ~60 раз/с'},
];

const CODE_SNIPPETS = {
  model: `const ball = {
  x: 160, y: 100,
  vx: 120, vy: 90,
  radius: 14,
  color: '#ef4444',
};`,
  update: `function update(ball, dt, w, h) {
  ball.x += ball.vx * dt;
  ball.y += ball.vy * dt;
  if (ball.x < r || ball.x > w - r) ball.vx *= -1;
  if (ball.y < r || ball.y > h - r) ball.vy *= -1;
}`,
  render: `function render(ctx, ball) {
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = ball.color;
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fill();
}`,
  loop: `let last = 0;
function frame(t) {
  const dt = Math.min((t - last) / 1000, 0.05);
  last = t;
  update(ball, dt, W, H);
  render(ctx, ball);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);`,
};

function GraphicsModelRenderPlayInner() {
  const canvasRef = useRef(null);
  const ballRef = useRef({
    x: W / 2,
    y: H / 2,
    vx: 110,
    vy: 75,
    radius: 14,
    color: '#ef4444',
  });
  const lastRef = useRef(0);
  const rafRef = useRef(0);
  const [phase, setPhase] = useState('loop');
  const [paused, setPaused] = useState(false);
  const [tick, setTick] = useState(0);

  const update = useCallback((ball, dt) => {
    const r = ball.radius;
    ball.x += ball.vx * dt;
    ball.y += ball.vy * dt;
    if (ball.x < r || ball.x > W - r) {
      ball.x = Math.max(r, Math.min(W - r, ball.x));
      ball.vx *= -1;
    }
    if (ball.y < r || ball.y > H - r) {
      ball.y = Math.max(r, Math.min(H - r, ball.y));
      ball.vy *= -1;
    }
  }, []);

  const render = useCallback((ctx, ball, highlight) => {
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = '#334155';
    ctx.strokeRect(0.5, 0.5, W - 1, H - 1);
    if (highlight === 'render' || highlight === 'loop') {
      ctx.fillStyle = ball.color;
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fill();
    } else if (highlight === 'model' || highlight === 'update') {
      ctx.strokeStyle = ball.color;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    const ball = ballRef.current;

    const frame = (t) => {
      rafRef.current = requestAnimationFrame(frame);
      if (paused) return;

      const dt = lastRef.current ? Math.min((t - lastRef.current) / 1000, 0.05) : 0;
      lastRef.current = t;

      const active = phase === 'loop' ? 'loop' : phase;
      if (active === 'update' || active === 'loop') {
        update(ball, dt);
      }
      render(ctx, ball, active);
      setTick((n) => n + 1);
    };

    lastRef.current = 0;
    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
  }, [paused, phase, render, update]);

  const ball = ballRef.current;
  const modelJson = JSON.stringify(
    {
      x: Math.round(ball.x),
      y: Math.round(ball.y),
      vx: Math.round(ball.vx),
      vy: Math.round(ball.vy),
      radius: ball.radius,
      color: ball.color,
    },
    null,
    2,
  );

  return (
    <DemoShell>
      <DemoCard
        title="Модель → update → render"
        subtitle="Один шар на canvas: переключите слой и смотрите, что меняется"
      >
        <div className={styles.pipeline} style={{marginBottom: '0.65rem'}}>
          {PHASES.map((p) => (
            <button
              key={p.id}
              type="button"
              className={clsx(styles.pipelineStep, phase === p.id && styles.pipelineStepActive)}
              onClick={() => setPhase(p.id)}
            >
              <span className={styles.stepNum}>{p.id === 'loop' ? '↻' : p.label[0]}</span>
              <span>
                <strong>{p.label}</strong>
                <div className="it-demo__hint">{p.hint}</div>
              </span>
            </button>
          ))}
        </div>

        <div style={{display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: '0.75rem'}}>
          <div>
            <canvas
              ref={canvasRef}
              width={W}
              height={H}
              aria-label="Демо: шар на canvas"
              style={{width: '100%', maxWidth: W, borderRadius: 8, border: '1px solid var(--ifm-color-emphasis-300)'}}
            />
            <div style={{display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap'}}>
              <button
                type="button"
                className="it-demo__btn it-demo__btn--secondary it-demo__btn--sm"
                onClick={() => setPaused((p) => !p)}
              >
                {paused ? '▶ Продолжить' : '⏸ Пауза'}
              </button>
              <button
                type="button"
                className="it-demo__btn it-demo__btn--secondary it-demo__btn--sm"
                onClick={() => {
                  ballRef.current.x = W / 2;
                  ballRef.current.y = H / 2;
                  setTick((n) => n + 1);
                }}
              >
                Сброс позиции
              </button>
            </div>
          </div>

          <div>
            <div className={styles.panelAccent} style={{marginBottom: '0.5rem'}}>
              Модель (RAM) — кадр #{tick}
            </div>
            <pre
              style={{
                margin: 0,
                padding: '0.65rem',
                fontSize: '0.78rem',
                borderRadius: 8,
                background: 'var(--ifm-code-background)',
                overflow: 'auto',
                maxHeight: 120,
              }}
            >
              {modelJson}
            </pre>
            <div className={styles.panelAccent} style={{marginTop: '0.65rem', marginBottom: '0.35rem'}}>
              Код слоя «{PHASES.find((p) => p.id === phase)?.label}»
            </div>
            <pre
              style={{
                margin: 0,
                padding: '0.65rem',
                fontSize: '0.72rem',
                borderRadius: 8,
                background: 'var(--ifm-code-background)',
                overflow: 'auto',
                maxHeight: 200,
              }}
            >
              {CODE_SNIPPETS[phase === 'loop' ? 'loop' : phase]}
            </pre>
          </div>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default GraphicsModelRenderPlayInner;
