import React, {useCallback, useEffect, useRef, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  MODELING_STAGES,
  drawModelPreview,
  modelingProgress,
} from '@/components/shared/kb/gameModelingEngine';
import styles from '@/components/demos/GameModelingPlay.module.css';

const PREVIEW = 260;

function GameModelingPlayInner() {
  const canvasRef = useRef(null);
  const [idx, setIdx] = useState(0);
  const [completed, setCompleted] = useState([]);

  const stage = MODELING_STAGES[idx];
  const progress = modelingProgress(completed);

  const paint = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    drawModelPreview(ctx, PREVIEW, PREVIEW, stage.id);
  }, [stage.id]);

  useEffect(() => {
    paint();
  }, [paint]);

  const advance = () => {
    setCompleted((prev) => (prev.includes(stage.id) ? prev : [...prev, stage.id]));
    setIdx((i) => Math.min(MODELING_STAGES.length - 1, i + 1));
  };

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Конвейер игрового моделирования"
        subtitle="От концепта до PBR-текстур — полигоны и артефакты на каждом шаге"
      >
        <div className={styles.steps}>
          {MODELING_STAGES.map((s, i) => (
            <button
              key={s.id}
              type="button"
              className={clsx(
                styles.stepBtn,
                idx === i && styles.stepBtnActive,
                completed.includes(s.id) && styles.stepBtnDone,
              )}
              onClick={() => setIdx(i)}
            >
              <span className={styles.stepIcon}>{s.icon}</span>
              {s.label}
            </button>
          ))}
        </div>

        <div className={styles.previewRow}>
          <canvas ref={canvasRef} width={PREVIEW} height={PREVIEW} className={styles.canvas} />
          <div className={styles.stats}>
            <div className={styles.statRow}>
              <span>Полигоны</span>
              <strong>{stage.polys ? stage.polys.toLocaleString('ru-RU') : '—'}</strong>
            </div>
            <div className={styles.statRow}>
              <span>LOD</span>
              <strong>{stage.lod}</strong>
            </div>
            <ul className={styles.artifacts}>
              {stage.artifacts.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </div>
        </div>

        <p className={styles.detail}>{stage.detail}</p>

        <div className={styles.barTrack}>
          <div className={styles.barFill} style={{width: `${progress.pct}%`}} />
        </div>
        <p className={styles.progressText}>
          Этап {idx + 1} из {MODELING_STAGES.length} · завершено {progress.done}
        </p>

        <button type="button" className={styles.primaryBtn} onClick={advance}>
          {idx < MODELING_STAGES.length - 1 ? 'Завершить этап →' : 'Сбросить'}
        </button>
        {idx >= MODELING_STAGES.length - 1 && (
          <button
            type="button"
            className={styles.linkBtn}
            onClick={() => {
              setCompleted([]);
              setIdx(0);
            }}
          >
            Начать заново
          </button>
        )}
      </DemoCard>
    </DemoShell>
  );
}

export default GameModelingPlayInner;
