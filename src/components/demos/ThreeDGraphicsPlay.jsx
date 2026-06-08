import React, {useEffect, useRef, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  GRAPHICS_STAGES,
  drawGraphicsStage,
  stageProgress,
} from '@/components/shared/kb/threeDGraphicsEngine';
import styles from '@/components/demos/ThreeDGraphicsPlay.module.css';

const CANVAS = 300;

function ThreeDGraphicsPlayInner() {
  const canvasRef = useRef(null);
  const frameRef = useRef(0);
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(true);

  const stage = GRAPHICS_STAGES[idx];
  const progress = stageProgress(idx);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf;
    const tick = () => {
      if (playing || stage.id === 'animation') frameRef.current += 1;
      drawGraphicsStage(ctx, CANVAS, CANVAS, stage.id, frameRef.current);
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [stage.id, playing]);

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="3D-графика: от сетки до кадра"
        subtitle="Геометрия → трансформы → анимация → свет → рендер"
      >
        <div className={styles.pipeline}>
          {GRAPHICS_STAGES.map((s, i) => (
            <button
              key={s.id}
              type="button"
              className={clsx(styles.step, idx === i && styles.stepActive, i < idx && styles.stepDone)}
              onClick={() => setIdx(i)}
            >
              {s.label}
            </button>
          ))}
        </div>
        <div className={styles.canvasWrap}>
          <canvas ref={canvasRef} width={CANVAS} height={CANVAS} className={styles.canvas} />
        </div>
        <div className={styles.panel}>
          <p className={styles.panelTitle}>
            {stage.label} <span className={styles.chip}>{stage.phase}</span>
          </p>
          <p className={styles.detail}>{stage.detail}</p>
          <p className={styles.hint}>{stage.hint}</p>
        </div>
        <div className={styles.barTrack}>
          <div className={styles.barFill} style={{width: `${progress.pct}%`}} />
        </div>
        <div className={styles.controls}>
          <button type="button" className={styles.btn} onClick={() => setPlaying((p) => !p)}>
            {playing ? 'Пауза' : 'Анимация'}
          </button>
          <button
            type="button"
            className={styles.btn}
            disabled={idx >= GRAPHICS_STAGES.length - 1}
            onClick={() => setIdx((i) => Math.min(GRAPHICS_STAGES.length - 1, i + 1))}
          >
            Следующий этап
          </button>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default ThreeDGraphicsPlayInner;
