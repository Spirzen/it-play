import React, {useCallback, useEffect, useRef, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  ARCH_STYLES,
  GAME_LAYERS,
  LOOP_PHASES,
  SUBSYSTEM_DETAILS,
  drawGameLoopFrame,
  getDependenciesForNode,
} from '@/components/shared/kb/gameArchitectureEngine';
import styles from '@/components/demos/GameArchitecturePlay.module.css';

const MODES = [
  {id: 'structure', label: 'Подсистемы'},
  {id: 'loop', label: 'Game loop'},
  {id: 'style', label: 'Стили'},
];

const CANVAS_W = 520;
const CANVAS_H = 200;

function GameArchitecturePlayInner() {
  const [mode, setMode] = useState('structure');
  const [selected, setSelected] = useState({layer: 'engine', node: 'render'});
  const [styleId, setStyleId] = useState('monolith');
  const [fixedStep, setFixedStep] = useState(true);
  const [simFps, setSimFps] = useState(60);
  const [playing, setPlaying] = useState(true);
  const [loopPhase, setLoopPhase] = useState(0);
  const canvasRef = useRef(null);
  const frameRef = useRef(0);
  const rafRef = useRef(null);

  const detail = SUBSYSTEM_DETAILS[selected.node];
  const {deps, provides} = getDependenciesForNode(selected.layer, selected.node);
  const arch = ARCH_STYLES.find((s) => s.id === styleId) ?? ARCH_STYLES[0];

  const paintLoop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    drawGameLoopFrame(ctx, CANVAS_W, CANVAS_H, loopPhase, frameRef.current, {
      fixedStep,
      simulatedFps: simFps,
    });
  }, [fixedStep, simFps, loopPhase]);

  useEffect(() => {
    if (mode !== 'loop' || !playing) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (mode === 'loop') paintLoop();
      return undefined;
    }

    let last = performance.now();
    const tick = (now) => {
      if (now - last > 120) {
        setLoopPhase((p) => (p + 1) % 3);
        frameRef.current += 1;
        last = now;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [mode, playing, paintLoop]);

  useEffect(() => {
    if (mode === 'loop') paintLoop();
  }, [mode, fixedStep, simFps, loopPhase, paintLoop]);

  const selectNode = (layerId, nodeId) => {
    setSelected({layer: layerId, node: nodeId});
  };

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Архитектура игрового приложения"
        subtitle="Слои движка, цикл кадра и архитектурные стили — как в статье"
      >
        <div className={styles.modeTabs} role="tablist">
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              role="tab"
              aria-selected={mode === m.id}
              className={clsx(styles.modeTab, mode === m.id && styles.modeTabActive)}
              onClick={() => setMode(m.id)}
            >
              {m.label}
            </button>
          ))}
        </div>

        {mode === 'structure' && (
          <>
            <div className={styles.layers}>
              {GAME_LAYERS.map((layer) => (
                <section
                  key={layer.id}
                  className={clsx(
                    styles.layer,
                    selected.layer === layer.id && styles.layerActive,
                  )}
                  style={{borderColor: `color-mix(in srgb, ${layer.color} 35%, var(--ifm-color-emphasis-300))`}}
                >
                  <header className={styles.layerHead}>
                    <span>{layer.icon}</span>
                    <span>{layer.label}</span>
                  </header>
                  <div className={styles.layerNodes}>
                    {layer.nodes.map((node) => (
                      <button
                        key={node.id}
                        type="button"
                        className={clsx(
                          styles.nodeBtn,
                          selected.layer === layer.id &&
                            selected.node === node.id &&
                            styles.nodeBtnActive,
                        )}
                        onClick={() => selectNode(layer.id, node.id)}
                        title={node.role}
                      >
                        {node.label}
                      </button>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            {detail ? (
              <div className={styles.detailCard}>
                <p className={styles.detailTitle}>{detail.title}</p>
                <p className={styles.detailBody}>{detail.body}</p>
                <p className={styles.detailWarn}>⛔ {detail.forbidden}</p>
                {(deps.length > 0 || provides.length > 0) && (
                  <div className={styles.deps}>
                    {deps.map((d) => (
                      <span key={`d-${d.node}`} className={styles.depChip}>
                        → {d.node}
                      </span>
                    ))}
                    {provides.map((p) => (
                      <span key={`p-${p.node}`} className={styles.depChip}>
                        ← {p.node}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <p className="it-demo__hint">Выберите подсистему, чтобы увидеть границы ответственности.</p>
            )}
          </>
        )}

        {mode === 'loop' && (
          <>
            <canvas
              ref={canvasRef}
              width={CANVAS_W}
              height={CANVAS_H}
              className={styles.loopCanvas}
              aria-label="Анимация game loop"
            />
            <div className={styles.loopControls}>
              <label className={styles.toggleRow}>
                <input
                  type="checkbox"
                  checked={fixedStep}
                  onChange={(e) => setFixedStep(e.target.checked)}
                />
                Фиксированный timestep
              </label>
              {!fixedStep && (
                <label className={styles.toggleRow}>
                  FPS
                  <input
                    type="range"
                    min={20}
                    max={60}
                    value={simFps}
                    onChange={(e) => setSimFps(Number(e.target.value))}
                  />
                  {simFps}
                </label>
              )}
              <button
                type="button"
                className="it-demo__btn it-demo__btn--secondary"
                onClick={() => setPlaying((p) => !p)}
              >
                {playing ? 'Пауза' : '▶ Цикл'}
              </button>
            </div>
            <div className={styles.detailCard}>
              <p className={styles.detailTitle}>
                {LOOP_PHASES[loopPhase]?.icon} {LOOP_PHASES[loopPhase]?.label}
              </p>
              <p className={styles.detailBody}>{LOOP_PHASES[loopPhase]?.detail}</p>
              <p className={styles.detailBody} style={{marginTop: '0.35rem', opacity: 0.85}}>
                Полный цикл: Input → Update → Render. Физика и сеть обычно на фиксированном шаге;
                рендер — с интерполяцией.
              </p>
            </div>
          </>
        )}

        {mode === 'style' && (
          <>
            <div className={styles.styleGrid}>
              {ARCH_STYLES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className={clsx(styles.styleCard, styleId === s.id && styles.styleCardActive)}
                  onClick={() => setStyleId(s.id)}
                >
                  <span className={styles.styleIcon}>{s.icon}</span>
                  <span className={styles.styleLabel}>{s.label}</span>
                  <span className={styles.styleSummary}>{s.summary}</span>
                </button>
              ))}
            </div>
            <div className={styles.prosCons}>
              <div>
                <h5>Плюсы</h5>
                <ul>
                  {arch.pros.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h5>Минусы</h5>
                <ul>
                  {arch.cons.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </div>
            </div>
            <p className={styles.fit}>
              <strong>Когда уместно:</strong> {arch.fit}
            </p>
          </>
        )}

        <p className={styles.footer}>
          Архитектура — свойство системы в коде, а не только на диаграмме. Граница архитектуры и деталей: отмена
          решения затрагивает несколько подсистем.
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default GameArchitecturePlayInner;
