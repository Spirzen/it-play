import React, {useCallback, useEffect, useRef, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  ADOBE_PRODUCTS,
  AE_LAYERS,
  EXPRESS_TEMPLATES,
  EXP_MODULES,
  FONT_SAMPLES,
  LR_SLIDERS,
  PR_TRACKS,
  PS_BLEND_MODES,
  PS_LAYERS,
  RUSH_FORMATS,
  STOCK_ASSETS,
  XD_SCREENS,
  drawAcrobat,
  drawAfterEffects,
  drawAero,
  drawDimension,
  drawFresco,
  drawIllustrator,
  drawInDesign,
  drawLightroom,
  drawPhotoshop,
  drawPremiere,
  drawSubstance,
  getProductMeta,
} from '@/components/shared/kb/adobeProductsEngine';
import styles from '@/components/demos/AdobeProductPlay.module.css';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';

const CANVAS_W = 360;
const CANVAS_H = 200;

function useCanvasPainter(drawFn, deps) {
  const canvasRef = useRef(null);
  const paint = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    drawFn(ctx, CANVAS_W, CANVAS_H);
  }, deps);

  useEffect(() => {
    paint();
  }, [paint]);

  return {canvasRef, paint};
}

function CanvasBlock({canvasRef, light}) {
  return (
    <div className={clsx(styles.canvasWrap, light && styles.canvasLight)}>
      <canvas
        ref={canvasRef}
        width={CANVAS_W}
        height={CANVAS_H}
        className={styles.canvas}
      />
    </div>
  );
}

function PhotoshopDemo({meta}) {
  const [layers, setLayers] = useState(PS_LAYERS);
  const [blend, setBlend] = useState('normal');
  const {canvasRef} = useCanvasPainter(
    (ctx, w, h) => drawPhotoshop(ctx, w, h, layers, blend),
    [layers, blend],
  );

  return (
    <>
      <div className={styles.row}>
        {layers.map((l) => (
          <button
            key={l.id}
            type="button"
            className={clsx(styles.layerBtn, !l.visible && styles.layerBtnOff)}
            onClick={() =>
              setLayers((prev) =>
                prev.map((x) => (x.id === l.id ? {...x, visible: !x.visible} : x)),
              )
            }
          >
            <span className={styles.layerDot} style={{background: l.color}} />
            {l.label}
          </button>
        ))}
      </div>
      <div className={toolStyles.chips}>
        {PS_BLEND_MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            className={clsx(toolStyles.chip, blend === m.id && toolStyles.chipActive)}
            onClick={() => setBlend(m.id)}
          >
            {m.label}
          </button>
        ))}
      </div>
      <CanvasBlock canvasRef={canvasRef} />
      <p className={styles.hint}>{meta.hint}</p>
    </>
  );
}

function IllustratorDemo({meta}) {
  const [points, setPoints] = useState([
    {x: 60, y: 140},
    {x: 140, y: 60},
    {x: 280, y: 100},
    {x: 300, y: 160},
  ]);
  const {canvasRef} = useCanvasPainter(
    (ctx, w, h) => drawIllustrator(ctx, w, h, points),
    [points],
  );

  const addPoint = () => {
    setPoints((p) => [
      ...p,
      {x: 80 + Math.random() * 200, y: 50 + Math.random() * 120},
    ]);
  };

  return (
    <>
      <button type="button" className={toolStyles.chip} onClick={addPoint}>
        Pen Tool — добавить точку
      </button>
      <button
        type="button"
        className={toolStyles.chip}
        onClick={() => setPoints([{x: 60, y: 140}, {x: 140, y: 60}, {x: 280, y: 100}])}
      >
        Сбросить путь
      </button>
      <CanvasBlock canvasRef={canvasRef} light />
      <p className={styles.hint}>{meta.hint}</p>
    </>
  );
}

function PremiereDemo({meta}) {
  const [playhead, setPlayhead] = useState(0.35);
  const {canvasRef} = useCanvasPainter(
    (ctx, w, h) => drawPremiere(ctx, w, h, playhead, PR_TRACKS),
    [playhead],
  );

  return (
    <>
      <label className={styles.sliderLabel}>
        Плейхед (Program Monitor)
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={playhead}
          onChange={(e) => setPlayhead(Number(e.target.value))}
        />
      </label>
      <CanvasBlock canvasRef={canvasRef} />
      <p className={styles.hint}>{meta.hint}</p>
    </>
  );
}

function AfterEffectsDemo({meta}) {
  const [progress, setProgress] = useState(0);
  const [activeLayer, setActiveLayer] = useState('shape');
  const {canvasRef} = useCanvasPainter(
    (ctx, w, h) => drawAfterEffects(ctx, w, h, progress, activeLayer),
    [progress, activeLayer],
  );

  return (
    <>
      <div className={toolStyles.chips}>
        {AE_LAYERS.map((l) => (
          <button
            key={l.id}
            type="button"
            className={clsx(
              toolStyles.chip,
              activeLayer === l.id && toolStyles.chipActive,
            )}
            onClick={() => setActiveLayer(l.id)}
          >
            {l.label}
          </button>
        ))}
      </div>
      <label className={styles.sliderLabel}>
        Ключевой кадр Position (время)
        <input
          type="range"
          min={0}
          max={1}
          step={0.02}
          value={progress}
          onChange={(e) => setProgress(Number(e.target.value))}
        />
      </label>
      <CanvasBlock canvasRef={canvasRef} />
      <p className={styles.hint}>{meta.hint}</p>
    </>
  );
}

function AcrobatDemo({meta}) {
  const [page, setPage] = useState(1);
  const [hasForm, setHasForm] = useState(false);
  const {canvasRef} = useCanvasPainter(
    (ctx, w, h) => drawAcrobat(ctx, w, h, page, hasForm),
    [page, hasForm],
  );

  return (
    <>
      <div className={styles.row}>
        <button
          type="button"
          className={toolStyles.chip}
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
        >
          ← Стр.
        </button>
        <span style={{fontSize: '0.78rem'}}>Стр. {page} / 3</span>
        <button
          type="button"
          className={toolStyles.chip}
          disabled={page >= 3}
          onClick={() => setPage((p) => p + 1)}
        >
          Стр. →
        </button>
        <button
          type="button"
          className={clsx(toolStyles.chip, hasForm && toolStyles.chipActive)}
          onClick={() => setHasForm((v) => !v)}
        >
          AcroForm
        </button>
      </div>
      <CanvasBlock canvasRef={canvasRef} light />
      <p className={styles.hint}>{meta.hint}</p>
    </>
  );
}

function InDesignDemo({meta}) {
  const [fill, setFill] = useState(0.4);
  const {canvasRef} = useCanvasPainter(
    (ctx, w, h) => drawInDesign(ctx, w, h, fill),
    [fill],
  );

  return (
    <>
      <label className={styles.sliderLabel}>
        Объём текста (Smart Text Reflow)
        <input
          type="range"
          min={0.1}
          max={1}
          step={0.05}
          value={fill}
          onChange={(e) => setFill(Number(e.target.value))}
        />
      </label>
      <CanvasBlock canvasRef={canvasRef} light />
      <p className={styles.hint}>{meta.hint}</p>
    </>
  );
}

function LightroomDemo({meta}) {
  const [values, setValues] = useState(
    Object.fromEntries(LR_SLIDERS.map((s) => [s.id, s.def])),
  );
  const {canvasRef} = useCanvasPainter(
    (ctx, w, h) => drawLightroom(ctx, w, h, values),
    [values],
  );

  return (
    <>
      {LR_SLIDERS.map((s) => (
        <label key={s.id} className={styles.sliderLabel}>
          {s.label}
          <input
            type="range"
            min={s.min}
            max={s.max}
            value={values[s.id]}
            onChange={(e) =>
              setValues((v) => ({...v, [s.id]: Number(e.target.value)}))
            }
          />
        </label>
      ))}
      <CanvasBlock canvasRef={canvasRef} />
      <p className={styles.hint}>{meta.hint}</p>
    </>
  );
}

function RushDemo({meta}) {
  const [format, setFormat] = useState('169');
  const f = RUSH_FORMATS.find((x) => x.id === format) ?? RUSH_FORMATS[0];

  return (
    <>
      <div className={toolStyles.chips}>
        {RUSH_FORMATS.map((fmt) => (
          <button
            key={fmt.id}
            type="button"
            className={clsx(
              toolStyles.chip,
              format === fmt.id && toolStyles.chipActive,
            )}
            onClick={() => setFormat(fmt.id)}
          >
            {fmt.label}
          </button>
        ))}
      </div>
      <div className={styles.reframePreview}>
        <div
          className={styles.reframeInner}
          style={{width: f.w, height: f.h}}
        >
          <div className={styles.reframeSubject} title="Auto Reframe" />
        </div>
      </div>
      <p className={styles.hint}>{meta.hint}</p>
    </>
  );
}

function XdDemo({meta}) {
  const [mode, setMode] = useState('design');
  const [from, setFrom] = useState('home');
  const [to, setTo] = useState('list');

  return (
    <>
      <div className={toolStyles.chips}>
        <button
          type="button"
          className={clsx(toolStyles.chip, mode === 'design' && toolStyles.chipActive)}
          onClick={() => setMode('design')}
        >
          Design
        </button>
        <button
          type="button"
          className={clsx(toolStyles.chip, mode === 'prototype' && toolStyles.chipActive)}
          onClick={() => setMode('prototype')}
        >
          Prototype
        </button>
      </div>
      {mode === 'prototype' ? (
        <>
          <div className={styles.row}>
            <select
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className={toolStyles.chip}
              style={{fontSize: '0.72rem'}}
            >
              {XD_SCREENS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
            <span>→ Tap →</span>
            <select
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className={toolStyles.chip}
              style={{fontSize: '0.72rem'}}
            >
              {XD_SCREENS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
          <p style={{fontSize: '0.78rem', margin: '0.35rem 0'}}>
            Переход: <strong>Dissolve</strong> · Auto-Animate
          </p>
        </>
      ) : (
        <div className={toolStyles.chips}>
          {XD_SCREENS.map((s) => (
            <button key={s.id} type="button" className={toolStyles.chip}>
              {s.label}
            </button>
          ))}
        </div>
      )}
      <p className={styles.hint}>{meta.hint}</p>
    </>
  );
}

function ExpressDemo({meta}) {
  const [tpl, setTpl] = useState('story');

  return (
    <>
      <div className={toolStyles.chips}>
        {EXPRESS_TEMPLATES.map((t) => (
          <button
            key={t.id}
            type="button"
            className={clsx(toolStyles.chip, tpl === t.id && toolStyles.chipActive)}
            onClick={() => setTpl(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div
        className={styles.previewBox}
        style={{
          aspectRatio: tpl === 'story' ? '9/16' : tpl === 'post' ? '1' : '16/5',
          maxHeight: 140,
          margin: '0 auto',
          background: 'linear-gradient(135deg,#ff6b9d,#8b5cf6)',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.85rem',
        }}
      >
        Шаблон: {EXPRESS_TEMPLATES.find((t) => t.id === tpl)?.label}
      </div>
      <p className={styles.hint}>{meta.hint}</p>
    </>
  );
}

function AnimateDemo({meta}) {
  const [frame, setFrame] = useState(1);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return undefined;
    const id = setInterval(() => {
      setFrame((f) => (f >= 12 ? 1 : f + 1));
    }, 200);
    return () => clearInterval(id);
  }, [playing]);

  return (
    <>
      <div className={styles.frameStrip}>
        {Array.from({length: 12}, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            type="button"
            className={clsx(styles.frameCell, frame === n && styles.frameCellActive)}
            onClick={() => setFrame(n)}
          >
            {n}
          </button>
        ))}
      </div>
      <button
        type="button"
        className="it-demo__btn it-demo__btn--primary"
        onClick={() => setPlaying((p) => !p)}
      >
        {playing ? 'Стоп' : '▶ Воспроизведение'}
      </button>
      <p className={styles.hint}>
        {meta.hint} Кадр {frame}/12.
      </p>
    </>
  );
}

function DreamweaverDemo({meta}) {
  const [html, setHtml] = useState('<h1>IT Universe</h1>\n<p>Привет, мир!</p>');

  return (
    <>
      <div className={styles.split}>
        <div className={styles.splitPane}>
          <strong>Code</strong>
          <textarea
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            rows={5}
            style={{width: '100%', fontSize: '0.68rem', marginTop: 4}}
            spellCheck={false}
          />
        </div>
        <div className={styles.splitPane}>
          <strong>Live View</strong>
          <div
            className={styles.previewBox}
            dangerouslySetInnerHTML={{__html: html}}
          />
        </div>
      </div>
      <p className={styles.hint}>{meta.hint}</p>
    </>
  );
}

function StockDemo({meta}) {
  const [query, setQuery] = useState('');
  const [picked, setPicked] = useState(null);
  const filtered = STOCK_ASSETS.filter(
    (a) => !query.trim() || a.title.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <>
      <input
        type="search"
        placeholder="Поиск в панели Stock…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={toolStyles.chip}
        style={{width: '100%', marginBottom: '0.5rem'}}
      />
      <div className={styles.stockGrid}>
        {filtered.map((a) => (
          <button
            key={a.id}
            type="button"
            className={clsx(
              styles.stockCard,
              picked === a.id && styles.stockCardActive,
            )}
            onClick={() => setPicked(a.id)}
          >
            <span style={{opacity: 0.7}}>{a.type}</span>
            <br />
            {a.title}
          </button>
        ))}
      </div>
      {picked && (
        <p style={{fontSize: '0.78rem', marginTop: '0.35rem'}}>
          Лицензировано и вставлено в проект одним кликом.
        </p>
      )}
      <p className={styles.hint}>{meta.hint}</p>
    </>
  );
}

function FontsDemo({meta}) {
  const [fonts, setFonts] = useState(FONT_SAMPLES);
  const [sample, setSample] = useState('Типографика Adobe Fonts');

  const active = fonts.find((f) => f.active)?.label ?? 'Source Sans 3';

  return (
    <>
      {fonts.map((f) => (
        <label key={f.id} className={styles.row} style={{alignItems: 'center'}}>
          <input
            type="checkbox"
            checked={f.active}
            onChange={() =>
              setFonts((prev) =>
                prev.map((x) =>
                  x.id === f.id
                    ? {...x, active: !x.active}
                    : {...x, active: false},
                ),
              )
            }
          />
          <span style={{fontSize: '0.78rem'}}>{f.label}</span>
        </label>
      ))}
      <input
        value={sample}
        onChange={(e) => setSample(e.target.value)}
        style={{
          width: '100%',
          fontSize: '1.1rem',
          fontFamily: active.includes('Minion')
            ? 'Georgia, serif'
            : active.includes('Myriad')
              ? 'system-ui, sans-serif'
              : 'var(--ifm-font-family-base)',
          padding: '0.5rem',
          border: '1px solid var(--ifm-color-emphasis-300)',
          borderRadius: 4,
        }}
      />
      <p className={styles.hint}>{meta.hint}</p>
    </>
  );
}

function DocumentCloudDemo({meta}) {
  const steps = ['Загрузка', 'Заполнение', 'Подпись', 'Архив'];
  const [step, setStep] = useState(0);

  return (
    <>
      <div className={styles.flowSteps}>
        {steps.map((s, i) => (
          <span
            key={s}
            className={clsx(styles.flowStep, i <= step && styles.flowStepDone)}
          >
            {s}
          </span>
        ))}
      </div>
      <button
        type="button"
        className="it-demo__btn it-demo__btn--primary"
        disabled={step >= steps.length - 1}
        onClick={() => setStep((s) => Math.min(s + 1, steps.length - 1))}
      >
        Следующий этап (Adobe Sign)
      </button>
      <p className={styles.hint}>{meta.hint}</p>
    </>
  );
}

function ExperienceCloudDemo({meta}) {
  const [active, setActive] = useState(['aem', 'analytics']);

  const toggle = (id) => {
    setActive((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  return (
    <>
      <div className={toolStyles.chips}>
        {EXP_MODULES.map((m) => (
          <button
            key={m.id}
            type="button"
            className={clsx(
              toolStyles.chip,
              active.includes(m.id) && toolStyles.chipActive,
            )}
            onClick={() => toggle(m.id)}
          >
            {m.label}
          </button>
        ))}
      </div>
      <p style={{fontSize: '0.78rem'}}>
        Стек: {active.map((id) => EXP_MODULES.find((m) => m.id === id)?.label).join(' → ')}
      </p>
      <p className={styles.hint}>{meta.hint}</p>
    </>
  );
}

function SubstanceDemo({meta}) {
  const [rot, setRot] = useState(15);
  const [light, setLight] = useState(60);
  const {canvasRef} = useCanvasPainter(
    (ctx, w, h) => drawSubstance(ctx, w, h, rot, light),
    [rot, light],
  );

  return (
    <>
      <label className={styles.sliderLabel}>
        Поворот модели
        <input
          type="range"
          min={-45}
          max={45}
          value={rot}
          onChange={(e) => setRot(Number(e.target.value))}
        />
      </label>
      <label className={styles.sliderLabel}>
        Интенсивность света
        <input
          type="range"
          min={0}
          max={100}
          value={light}
          onChange={(e) => setLight(Number(e.target.value))}
        />
      </label>
      <CanvasBlock canvasRef={canvasRef} />
      <p className={styles.hint}>{meta.hint}</p>
    </>
  );
}

function AuditionDemo({meta}) {
  const [denoise, setDenoise] = useState(30);
  const bars = Array.from({length: 48}, (_, i) => 20 + Math.sin(i * 0.4) * 15 + (100 - denoise) * 0.1);

  return (
    <>
      <div className={styles.waveform}>
        {bars.map((h, i) => (
          <div key={i} className={styles.waveBar} style={{height: `${h}%`}} />
        ))}
      </div>
      <label className={styles.sliderLabel}>
        Шумоподавление (ИИ)
        <input
          type="range"
          min={0}
          max={100}
          value={denoise}
          onChange={(e) => setDenoise(Number(e.target.value))}
        />
      </label>
      <p className={styles.hint}>{meta.hint}</p>
    </>
  );
}

function AeroDemo({meta}) {
  const [dist, setDist] = useState(0.5);
  const {canvasRef} = useCanvasPainter(
    (ctx, w, h) => drawAero(ctx, w, h, dist),
    [dist],
  );

  return (
    <>
      <label className={styles.sliderLabel}>
        Расстояние до объекта (триггер)
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={dist}
          onChange={(e) => setDist(Number(e.target.value))}
        />
      </label>
      <CanvasBlock canvasRef={canvasRef} light />
      <p className={styles.hint}>{meta.hint}</p>
    </>
  );
}

function InCopyDemo({meta}) {
  const [text, setText] = useState('Заголовок статьи\n\nТекст перетекает в макет InDesign…');

  return (
    <>
      <div className={styles.split}>
        <div className={styles.splitPane}>
          <strong>InCopy (писатель)</strong>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            style={{width: '100%', fontSize: '0.72rem'}}
          />
        </div>
        <div className={styles.splitPane}>
          <strong>InDesign (макет)</strong>
          <div className={styles.previewBox} style={{whiteSpace: 'pre-wrap', fontSize: '0.72rem'}}>
            {text}
          </div>
        </div>
      </div>
      <p className={styles.hint}>{meta.hint}</p>
    </>
  );
}

function FrescoDemo({meta}) {
  const [brush, setBrush] = useState('live');
  const [pressure, setPressure] = useState(6);
  const {canvasRef} = useCanvasPainter(
    (ctx, w, h) => drawFresco(ctx, w, h, brush, pressure),
    [brush, pressure],
  );

  return (
    <>
      <div className={toolStyles.chips}>
        <button
          type="button"
          className={clsx(toolStyles.chip, brush === 'live' && toolStyles.chipActive)}
          onClick={() => setBrush('live')}
        >
          Live Brush
        </button>
        <button
          type="button"
          className={clsx(toolStyles.chip, brush === 'vector' && toolStyles.chipActive)}
          onClick={() => setBrush('vector')}
        >
          Vector Brush
        </button>
      </div>
      <label className={styles.sliderLabel}>
        Давление пера
        <input
          type="range"
          min={2}
          max={12}
          value={pressure}
          onChange={(e) => setPressure(Number(e.target.value))}
        />
      </label>
      <CanvasBlock canvasRef={canvasRef} light />
      <p className={styles.hint}>{meta.hint}</p>
    </>
  );
}

function DimensionDemo({meta}) {
  const [angle, setAngle] = useState(20);
  const {canvasRef} = useCanvasPainter(
    (ctx, w, h) => drawDimension(ctx, w, h, angle),
    [angle],
  );

  return (
    <>
      <label className={styles.sliderLabel}>
        Угол обзора 3D-мокапа
        <input
          type="range"
          min={-40}
          max={40}
          value={angle}
          onChange={(e) => setAngle(Number(e.target.value))}
        />
      </label>
      <CanvasBlock canvasRef={canvasRef} light />
      <p className={styles.hint}>{meta.hint}</p>
    </>
  );
}

const DEMO_MAP = {
  photoshop: PhotoshopDemo,
  illustrator: IllustratorDemo,
  premiere: PremiereDemo,
  aftereffects: AfterEffectsDemo,
  acrobat: AcrobatDemo,
  indesign: InDesignDemo,
  lightroom: LightroomDemo,
  rush: RushDemo,
  xd: XdDemo,
  express: ExpressDemo,
  animate: AnimateDemo,
  dreamweaver: DreamweaverDemo,
  stock: StockDemo,
  fonts: FontsDemo,
  documentcloud: DocumentCloudDemo,
  experiencecloud: ExperienceCloudDemo,
  substance: SubstanceDemo,
  audition: AuditionDemo,
  aero: AeroDemo,
  incopy: InCopyDemo,
  fresco: FrescoDemo,
  dimension: DimensionDemo,
};

function AdobeProductPlayInner({product = 'photoshop'}) {
  const meta = getProductMeta(product);
  const Demo = DEMO_MAP[product] ?? PhotoshopDemo;

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title={
          <span style={{color: meta.brand}} className={styles.brand}>
            {meta.label}
          </span>
        }
        subtitle={meta.subtitle}
      >
        <Demo meta={meta} />
      </DemoCard>
    </DemoShell>
  );
}

/**
 * Интерактивное демо продукта Adobe Creative Cloud / Document Cloud.
 * @param {{ product?: keyof typeof ADOBE_PRODUCTS }} props
 */
export default function AdobeProductPlay({product = 'photoshop'}) {
  const valid = ADOBE_PRODUCTS[product] ? product : 'photoshop';
  return <AdobeProductPlayInner product={valid} />;
}
