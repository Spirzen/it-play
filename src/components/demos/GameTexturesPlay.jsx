import React, {useCallback, useEffect, useRef, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {TEXTURE_MAPS} from '@/components/shared/kb/gameDevEngine';
import {drawTexturePreview} from '@/components/shared/kb/gameDevPlaysCanvas';
import styles from '@/components/demos/GameDevDemo.module.css';

const W = 400;
const H = 280;

function GameTexturesPlayInner() {
  const canvasRef = useRef(null);
  const [maps, setMaps] = useState(new Set(['albedo', 'normal']));

  const toggle = (id) => {
    setMaps((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const paint = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    drawTexturePreview(ctx, W, H, [...maps]);
  }, [maps]);

  useEffect(() => {
    paint();
  }, [paint]);

  return (
    <DemoShell className={styles.shell}>
      <DemoCard
        title="Текстуры и PBR-карты"
        subtitle="UV-развёртка и слои материала — что даёт каждая карта на меше"
      >
        <canvas ref={canvasRef} width={W} height={H} className={styles.previewCanvas} />
        <div className={styles.tabs} style={{marginTop: '0.65rem'}}>
          {TEXTURE_MAPS.map((m) => (
            <button
              key={m.id}
              type="button"
              className={clsx(styles.tab, maps.has(m.id) && styles.tabActive)}
              onClick={() => toggle(m.id)}
            >
              {m.label}
            </button>
          ))}
        </div>
        <div className={styles.panel}>
          {TEXTURE_MAPS.filter((m) => maps.has(m.id)).map((m) => (
            <p key={m.id} className={styles.hint} style={{marginTop: maps.has(m.id) ? '0.35rem' : 0}}>
              <strong>{m.label}:</strong> {m.role}
            </p>
          ))}
          {maps.size === 0 && (
            <p className={styles.hint}>Включите хотя бы albedo — иначе меш останется "серым".</p>
          )}
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default GameTexturesPlayInner;
