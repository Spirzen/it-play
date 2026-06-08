import React, {useEffect, useRef, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import ZoomPanViewport from '@/components/shared/kb/ZoomPanViewport';
import {
  describeRasterAtZoom,
  describeVectorAtZoom,
  drawRasterScene,
  rasterPixelCount,
  SCENE_SIZE,
  ZOOM_STOPS,
} from '@/components/shared/kb/rasterVectorDemoEngine';
import styles from '@/components/demos/RasterVectorCompareDemo.module.css';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';

function RasterVectorCompareDemoInner() {
  const canvasRef = useRef(null);
  const rasterScrollerRef = useRef(null);
  const vectorScrollerRef = useRef(null);
  const [zoom, setZoom] = useState(2);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    drawRasterScene(ctx, SCENE_SIZE);
  }, []);

  const displaySize = SCENE_SIZE * zoom;

  return (
    <DemoShell>
      <DemoCard
        title="Растр и вектор: масштабирование"
        subtitle="Одна и та же сцена — слева фиксированная сетка пикселей, справа параметрическое SVG. Увеличьте масштаб, прокрутите или перетащите область просмотра и сравните края."
      >
        <div className={styles.zoomRow}>
          <span className="it-demo__label" style={{marginBottom: 0}}>
            Масштаб
          </span>
          <input
            type="range"
            className={styles.zoomSlider}
            min={1}
            max={8}
            step={0.25}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            aria-valuemin={1}
            aria-valuemax={8}
            aria-valuenow={zoom}
          />
          <span className={styles.zoomValue}>{Math.round(zoom * 100)}%</span>
          <div className={toolStyles.chips}>
            {ZOOM_STOPS.map((stop) => (
              <button
                key={stop.id}
                type="button"
                className={clsx(toolStyles.chip, zoom === stop.value && toolStyles.chipActive)}
                onClick={() => setZoom(stop.value)}
              >
                {stop.label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.compareRow}>
          <div className={clsx(styles.panel, styles.panelRaster)}>
            <div className={styles.panelLabel}>Растр ({SCENE_SIZE}×{SCENE_SIZE} px)</div>
            <ZoomPanViewport
              contentWidth={displaySize}
              contentHeight={displaySize}
              scrollerRef={rasterScrollerRef}
              syncRef={vectorScrollerRef}
              ariaLabel="Область просмотра растрового изображения"
            >
              <div className={styles.rasterWrap}>
                <canvas
                  ref={canvasRef}
                  className={styles.canvas}
                  width={SCENE_SIZE}
                  height={SCENE_SIZE}
                  style={{width: displaySize, height: displaySize}}
                  aria-label="Растровое изображение фиксированного разрешения"
                />
              </div>
            </ZoomPanViewport>
            <p className={styles.hint}>{describeRasterAtZoom(zoom)}</p>
          </div>

          <div className={clsx(styles.panel, styles.panelVector)}>
            <div className={styles.panelLabel}>Вектор (SVG)</div>
            <ZoomPanViewport
              contentWidth={displaySize}
              contentHeight={displaySize}
              scrollerRef={vectorScrollerRef}
              syncRef={rasterScrollerRef}
              ariaLabel="Область просмотра векторного SVG"
            >
              <svg
                className={styles.svgShape}
                viewBox={`0 0 ${SCENE_SIZE} ${SCENE_SIZE}`}
                width={displaySize}
                height={displaySize}
                role="img"
                aria-label="Векторное SVG-изображение"
              >
                <rect x="18" y="52" width="84" height="28" fill="#1976d2" stroke="#1a237e" strokeWidth="3" />
                <circle cx="60" cy="42" r="22" fill="#ef6c00" />
              </svg>
            </ZoomPanViewport>
            <p className={styles.hint}>{describeVectorAtZoom(zoom)}</p>
          </div>
        </div>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <strong>Растр:</strong> {rasterPixelCount().toLocaleString('ru-RU')} пикселей в данных;
            при печати или Retina нужны отдельные копии (@2x, @3x).
          </div>
          <div className={styles.stat}>
            <strong>Вектор:</strong> описание из нескольких примитивов; на мониторе всё равно
            растрируется, но параметры пересчитываются под текущий DPI.
          </div>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default RasterVectorCompareDemoInner;
