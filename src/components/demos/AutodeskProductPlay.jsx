import React, {useCallback, useEffect, useRef, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  AUTOCAD_LAYERS,
  AUTODESK_PRODUCTS,
  ICE_NODES,
  MAX_MODIFIERS,
  MAYA_NODES,
  REVIT_VIEWS,
  TINKER_SHAPES,
  draw3dsMax,
  drawAutoCAD,
  drawMaya,
  drawRevit,
  drawSoftimageICE,
  drawTinkerCAD,
  getProductMeta,
} from '@/components/shared/kb/autodeskProductsEngine';
import styles from '@/components/demos/AutodeskProductPlay.module.css';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';

const CANVAS_W = 360;
const CANVAS_H = 220;

const AUTOCAD_DEFAULT_ENTITIES = [
  {type: 'rect', layer: 'walls', x: 48, y: 48, w: 200, h: 120, width: 2},
  {type: 'line', layer: 'axes', x1: 148, y1: 36, x2: 148, y2: 180, width: 1},
  {type: 'line', layer: 'axes', x1: 36, y1: 108, x2: 260, y2: 108, width: 1},
  {type: 'circle', layer: 'dims', cx: 248, cy: 168, r: 28, width: 1},
];

function AutoCADDemo({meta}) {
  const canvasRef = useRef(null);
  const [layers, setLayers] = useState(AUTOCAD_LAYERS);
  const [entities, setEntities] = useState(AUTOCAD_DEFAULT_ENTITIES);
  const [cmd, setCmd] = useState('LINE');
  const [lastCmd, setLastCmd] = useState('Готов');

  const paint = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    drawAutoCAD(ctx, CANVAS_W, CANVAS_H, entities, layers);
  }, [entities, layers]);

  useEffect(() => {
    paint();
  }, [paint]);

  const toggleLayer = (id) => {
    setLayers((prev) =>
      prev.map((l) => (l.id === id ? {...l, visible: !l.visible} : l)),
    );
  };

  const runCommand = () => {
    const c = cmd.trim().toUpperCase();
    if (c === 'LINE') {
      setEntities((e) => [
        ...e,
        {
          type: 'line',
          layer: 'walls',
          x1: 60 + Math.random() * 80,
          y1: 60 + Math.random() * 60,
          x2: 140 + Math.random() * 80,
          y2: 100 + Math.random() * 60,
        },
      ]);
      setLastCmd('LINE — отрезок добавлен');
    } else if (c === 'CIRCLE') {
      setEntities((e) => [
        ...e,
        {
          type: 'circle',
          layer: 'dims',
          cx: 80 + Math.random() * 180,
          cy: 70 + Math.random() * 100,
          r: 12 + Math.random() * 20,
        },
      ]);
      setLastCmd('CIRCLE — окружность добавлена');
    } else {
      setLastCmd(`Неизвестная команда: ${c}`);
    }
  };

  return (
    <>
      <div className={styles.row}>
        {layers.map((l) => (
          <button
            key={l.id}
            type="button"
            className={clsx(styles.layerBtn, !l.visible && styles.layerBtnOff)}
            onClick={() => toggleLayer(l.id)}
          >
            <span className={styles.layerDot} style={{background: l.color}} />
            {l.label}
          </button>
        ))}
      </div>
      <input
        className={styles.cmdInput}
        value={cmd}
        onChange={(e) => setCmd(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && runCommand()}
        aria-label="Команда AutoCAD"
      />
      <button type="button" className={toolStyles.chip} onClick={runCommand}>
        Выполнить
      </button>
      <div className={styles.canvasWrap}>
        <canvas
          ref={canvasRef}
          width={CANVAS_W}
          height={CANVAS_H}
          className={styles.canvas}
          aria-label="Область черчёж AutoCAD"
        />
      </div>
      <p className={styles.hint}>
        {meta.hint} Последняя команда: <strong>{lastCmd}</strong>
      </p>
    </>
  );
}

function RevitDemo({meta}) {
  const canvasRef = useRef(null);
  const [view, setView] = useState('plan');
  const [wallHeight, setWallHeight] = useState(28);
  const [doorCount, setDoorCount] = useState(2);

  const paint = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    drawRevit(ctx, CANVAS_W, CANVAS_H, view, wallHeight, doorCount);
  }, [view, wallHeight, doorCount]);

  useEffect(() => {
    paint();
  }, [paint]);

  return (
    <>
      <div className={toolStyles.chips}>
        {REVIT_VIEWS.map((v) => (
          <button
            key={v.id}
            type="button"
            className={clsx(toolStyles.chip, view === v.id && toolStyles.chipActive)}
            onClick={() => setView(v.id)}
          >
            {v.label}
          </button>
        ))}
      </div>
      <div className={styles.row}>
        <label className={styles.sliderLabel}>
          Высота стены (параметр)
          <input
            type="range"
            min={12}
            max={48}
            value={wallHeight}
            onChange={(e) => setWallHeight(Number(e.target.value))}
          />
        </label>
        <label className={styles.sliderLabel}>
          Количество дверей
          <input
            type="range"
            min={0}
            max={4}
            value={doorCount}
            onChange={(e) => setDoorCount(Number(e.target.value))}
          />
        </label>
      </div>
      <div className={clsx(styles.canvasWrap, styles.canvasLight)}>
        <canvas
          ref={canvasRef}
          width={CANVAS_W}
          height={CANVAS_H}
          className={styles.canvas}
          aria-label="Вид Revit"
        />
      </div>
      <p className={styles.hint}>{meta.hint}</p>
    </>
  );
}

function MaxDemo({meta}) {
  const canvasRef = useRef(null);
  const [bend, setBend] = useState(40);
  const [mods, setMods] = useState(MAX_MODIFIERS);

  const paint = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    draw3dsMax(ctx, CANVAS_W, CANVAS_H, bend, mods);
  }, [bend, mods]);

  useEffect(() => {
    paint();
  }, [paint]);

  const toggleMod = (id) => {
    setMods((prev) =>
      prev.map((m) => (m.id === id ? {...m, enabled: !m.enabled} : m)),
    );
  };

  return (
    <>
      <div className={styles.modStack}>
        {mods.map((m) => (
          <button
            key={m.id}
            type="button"
            className={clsx(styles.modRow, m.enabled && styles.modRowActive)}
            onClick={() => toggleMod(m.id)}
          >
            <input type="checkbox" readOnly checked={m.enabled} tabIndex={-1} />
            {m.label}
          </button>
        ))}
      </div>
      <label className={styles.sliderLabel}>
        Bend angle
        <input
          type="range"
          min={0}
          max={100}
          value={bend}
          onChange={(e) => setBend(Number(e.target.value))}
        />
      </label>
      <div className={styles.canvasWrap}>
        <canvas
          ref={canvasRef}
          width={CANVAS_W}
          height={CANVAS_H}
          className={styles.canvas}
          aria-label="Viewport 3ds Max"
        />
      </div>
      <p className={styles.hint}>{meta.hint}</p>
    </>
  );
}

function MayaDemo({meta}) {
  const canvasRef = useRef(null);
  const [translateX, setTranslateX] = useState(0);
  const [activeNode, setActiveNode] = useState('transform');

  const paint = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    drawMaya(ctx, CANVAS_W, CANVAS_H, translateX, activeNode);
  }, [translateX, activeNode]);

  useEffect(() => {
    paint();
  }, [paint]);

  return (
    <>
      <div className={styles.nodeGraph}>
        {MAYA_NODES.map((n) => (
          <button
            key={n.id}
            type="button"
            className={clsx(styles.mayaNode, activeNode === n.id && styles.mayaNodeActive)}
            onClick={() => setActiveNode(n.id)}
          >
            {n.label}
          </button>
        ))}
      </div>
      {activeNode === 'transform' && (
        <label className={styles.sliderLabel}>
          translateX
          <input
            type="range"
            min={-80}
            max={80}
            value={translateX}
            onChange={(e) => setTranslateX(Number(e.target.value))}
          />
        </label>
      )}
      <div className={styles.canvasWrap}>
        <canvas
          ref={canvasRef}
          width={CANVAS_W}
          height={CANVAS_H}
          className={styles.canvas}
          aria-label="Viewport Maya"
        />
      </div>
      <p className={styles.hint}>{meta.hint}</p>
    </>
  );
}

function SoftimageDemo({meta}) {
  const canvasRef = useRef(null);
  const [activeId, setActiveId] = useState('noise');
  const [clipMix, setClipMix] = useState(0.65);

  const paint = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    drawSoftimageICE(ctx, CANVAS_W, CANVAS_H, activeId, clipMix);
  }, [activeId, clipMix]);

  useEffect(() => {
    paint();
  }, [paint]);

  return (
    <>
      <div className={styles.iceRow}>
        {ICE_NODES.map((n) => (
          <button
            key={n.id}
            type="button"
            className={clsx(toolStyles.chip, activeId === n.id && toolStyles.chipActive)}
            onClick={() => setActiveId(n.id)}
          >
            {n.label}
          </button>
        ))}
      </div>
      <label className={styles.sliderLabel}>
        Смешивание NLA-клипа
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={clipMix}
          onChange={(e) => setClipMix(Number(e.target.value))}
        />
      </label>
      <div className={styles.canvasWrap}>
        <canvas
          ref={canvasRef}
          width={CANVAS_W}
          height={CANVAS_H}
          className={styles.canvas}
          aria-label="ICE Softimage"
        />
      </div>
      <p className={styles.hint}>{meta.hint}</p>
    </>
  );
}

function TinkerDemo({meta}) {
  const canvasRef = useRef(null);
  const [shapes, setShapes] = useState(TINKER_SHAPES);
  const [grouped, setGrouped] = useState(false);
  const [activeShape, setActiveShape] = useState('box');

  const paint = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    drawTinkerCAD(ctx, CANVAS_W, CANVAS_H, shapes, grouped);
  }, [shapes, grouped]);

  useEffect(() => {
    paint();
  }, [paint]);

  const toggleHole = () => {
    setShapes((prev) =>
      prev.map((s) =>
        s.id === 'hole' ? {...s, solid: !s.solid} : s,
      ),
    );
  };

  return (
    <>
      <div className={toolStyles.chips}>
        {shapes.map((s) => (
          <button
            key={s.id}
            type="button"
            className={clsx(
              toolStyles.chip,
              activeShape === s.id && toolStyles.chipActive,
            )}
            onClick={() => setActiveShape(s.id)}
          >
            {s.label}
            {!s.solid && ' (hole)'}
          </button>
        ))}
      </div>
      <div className={styles.row}>
        <button type="button" className={toolStyles.chip} onClick={toggleHole}>
          Тело ↔ отверстие
        </button>
        <button
          type="button"
          className={clsx(toolStyles.chip, grouped && toolStyles.chipActive)}
          onClick={() => setGrouped(true)}
        >
          Group (CSG)
        </button>
        <button type="button" className={toolStyles.chip} onClick={() => setGrouped(false)}>
          Разгруппировать
        </button>
      </div>
      <div className={clsx(styles.canvasWrap, styles.canvasLight)}>
        <canvas
          ref={canvasRef}
          width={CANVAS_W}
          height={CANVAS_H}
          className={styles.canvas}
          aria-label="Рабочая плоскость TinkerCAD"
        />
      </div>
      <p className={styles.hint}>{meta.hint}</p>
    </>
  );
}

function AutodeskProductPlayInner({product = 'autocad'}) {
  const meta = getProductMeta(product);
  const isLegacy = product === 'softimage';

  const body = (() => {
    switch (product) {
      case 'revit':
        return <RevitDemo meta={meta} />;
      case '3dsmax':
        return <MaxDemo meta={meta} />;
      case 'maya':
        return <MayaDemo meta={meta} />;
      case 'softimage':
        return <SoftimageDemo meta={meta} />;
      case 'tinkercad':
        return <TinkerDemo meta={meta} />;
      default:
        return <AutoCADDemo meta={meta} />;
    }
  })();

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title={
          <>
            <span style={{color: meta.brand}} className={styles.brand}>
              {meta.label}
            </span>
            {isLegacy && <span className={styles.legacyBadge}>2015 — EOL</span>}
          </>
        }
        subtitle={meta.subtitle}
      >
        {body}
      </DemoCard>
    </DemoShell>
  );
}

/**
 * Интерактивное демо продукта Autodesk.
 * @param {{ product?: 'autocad'|'revit'|'3dsmax'|'maya'|'softimage'|'tinkercad' }} props
 */
export default function AutodeskProductPlay({product = 'autocad'}) {
  const valid = AUTODESK_PRODUCTS[product] ? product : 'autocad';
  return <AutodeskProductPlayInner product={valid} />;
}
