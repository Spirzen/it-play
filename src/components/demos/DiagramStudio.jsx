import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import useCopyToClipboard from '@/components/shared/kb/useCopyToClipboard';
import {
  MODES,
  BPMN_TEMPLATES,
  UML_TEMPLATES,
  C4_TEMPLATES,
  FLOW_TEMPLATES,
  C4_LEVELS,
  UML_DIAGRAM_TYPES,
  getPalette,
  getDefaultSubMode,
  createNodeFromPalette,
  loadTemplate,
  exportMermaid,
} from '@/components/shared/kb/diagramStudioEngine';
import styles from '@/components/demos/DiagramStudio.module.css';

function nodeShapeClass(shape) {
  const map = {
    circle: styles.shapeCircle,
    'circle-thick': styles.shapeCircleThick,
    rect: styles.shapeRect,
    diamond: styles.shapeDiamond,
    ellipse: styles.shapeEllipse,
    actor: styles.shapePerson,
    system: styles.shapeSystem,
    'system-ext': styles.shapeSystemExt,
    db: styles.shapeDb,
    container: styles.shapeContainer,
    component: styles.shapeComponent,
    class: styles.shapeClass,
    interface: styles.shapeClass,
  };
  return map[shape] || styles.shapeRect;
}

function DiagramNode({node, selected, onSelect, onDrag}) {
  const dragRef = useRef({active: false, ox: 0, oy: 0, sx: 0, sy: 0});

  const onPointerDown = (e) => {
    e.stopPropagation();
    onSelect(node.id);
    dragRef.current = {
      active: true,
      ox: e.clientX,
      oy: e.clientY,
      sx: node.x,
      sy: node.y,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!dragRef.current.active) return;
    const dx = e.clientX - dragRef.current.ox;
    const dy = e.clientY - dragRef.current.oy;
    onDrag(node.id, dragRef.current.sx + dx, dragRef.current.sy + dy);
  };

  const onPointerUp = () => {
    dragRef.current.active = false;
  };

  const isClass = node.shape === 'class' || node.shape === 'interface';

  return (
    <div
      className={clsx(
        styles.node,
        nodeShapeClass(node.shape),
        selected && styles.nodeSelected,
      )}
      style={{left: node.x, top: node.y, width: node.w, height: node.h}}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      {node.shape === 'actor' ? (
        <>
          <div className={styles.personHead} />
          <div className={styles.personBody} />
          <span className={styles.nodeLabel}>{node.label}</span>
        </>
      ) : isClass ? (
        <>
          <div className={styles.classHead}>{node.label}</div>
          <div className={styles.classBody}>
            + id: int
            <br />
            + save()
          </div>
        </>
      ) : (
        <span className={node.shape === 'diamond' ? styles.nodeLabel : undefined}>
          {node.label}
        </span>
      )}
    </div>
  );
}

function edgePath(from, to, nodes) {
  const a = nodes.find((n) => n.id === from);
  const b = nodes.find((n) => n.id === to);
  if (!a || !b) return '';
  const x1 = a.x + a.w / 2;
  const y1 = a.y + a.h / 2;
  const x2 = b.x + b.w / 2;
  const y2 = b.y + b.h / 2;
  const mx = (x1 + x2) / 2;
  return `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;
}

function DiagramStudioInner({
  initialMode = 'bpmn',
  modes = ['bpmn', 'uml', 'c4'],
  title,
  subtitle,
  initialTemplate,
}) {
  const allowed = modes.filter((m) => MODES[m]);
  const [mode, setMode] = useState(initialMode);
  const [subMode, setSubMode] = useState(getDefaultSubMode(initialMode));
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [connectFrom, setConnectFrom] = useState(null);
  const [labelDraft, setLabelDraft] = useState('');
  const canvasRef = useRef(null);
  const {copy, copied} = useCopyToClipboard();

  const palette = useMemo(() => getPalette(mode, subMode), [mode, subMode]);

  const mermaid = useMemo(
    () => exportMermaid(mode, nodes, edges, subMode),
    [mode, nodes, edges, subMode],
  );

  const resetCanvas = useCallback(() => {
    setNodes([]);
    setEdges([]);
    setSelectedId(null);
    setConnectFrom(null);
  }, []);

  const applyTemplate = useCallback(
    (key, modeOverride) => {
      const activeMode = modeOverride || mode;
      const tpl = loadTemplate(activeMode, key);
      setNodes(tpl.nodes);
      setEdges(tpl.edges);
      if (tpl.subMode) setSubMode(tpl.subMode);
      setSelectedId(null);
      setConnectFrom(null);
    },
    [mode],
  );

  useEffect(() => {
    if (initialTemplate) applyTemplate(initialTemplate, initialMode);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount preset only
  }, []);

  const switchMode = (next) => {
    setMode(next);
    setSubMode(getDefaultSubMode(next));
    resetCanvas();
  };

  const addAtCenter = (item) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    const x = rect ? rect.width / 2 - item.w / 2 : 120;
    const y = rect ? rect.height / 2 - item.h / 2 : 80;
    const node = createNodeFromPalette(item, x, y);
    setNodes((prev) => [...prev, node]);
    setSelectedId(node.id);
  };

  const onCanvasClick = (e) => {
    if (e.target !== canvasRef.current) return;
    setSelectedId(null);
    setConnectFrom(null);
  };

  const onNodeSelect = (id) => {
    if (connectFrom && connectFrom !== id) {
      setEdges((prev) => {
        if (prev.some((ed) => ed.from === connectFrom && ed.to === id)) return prev;
        return [...prev, {from: connectFrom, to: id, label: labelDraft || ''}];
      });
      setConnectFrom(null);
      setLabelDraft('');
      return;
    }
    if (!connectFrom) {
      setSelectedId(id);
      const n = nodes.find((x) => x.id === id);
      setLabelDraft(n?.label || '');
    }
  };

  const startConnect = () => {
    if (selectedId) setConnectFrom(selectedId);
  };

  const updateLabel = (value) => {
    setLabelDraft(value);
    if (selectedId) {
      setNodes((prev) =>
        prev.map((n) => (n.id === selectedId ? {...n, label: value} : n)),
      );
    }
  };

  const removeSelected = () => {
    if (!selectedId) return;
    setNodes((prev) => prev.filter((n) => n.id !== selectedId));
    setEdges((prev) => prev.filter((e) => e.from !== selectedId && e.to !== selectedId));
    setSelectedId(null);
  };

  const templates =
    mode === 'flow'
      ? FLOW_TEMPLATES
      : mode === 'bpmn'
        ? BPMN_TEMPLATES
        : mode === 'uml'
          ? UML_TEMPLATES
          : C4_TEMPLATES;

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title={title || 'Студия моделирования'}
        subtitle={
          subtitle ||
          'Добавляйте элементы, перетаскивайте, соединяйте стрелками и экспортируйте в Mermaid'
        }
      >
        <div className={styles.modeBar}>
          {allowed.map((m) => (
            <button
              key={m}
              type="button"
              className={clsx(styles.modeBtn, mode === m && styles.modeBtnActive)}
              style={mode === m ? {background: MODES[m].color} : undefined}
              onClick={() => switchMode(m)}
            >
              {MODES[m].label}
            </button>
          ))}
        </div>

        {mode === 'uml' && (
          <div className={styles.modeBar}>
            {UML_DIAGRAM_TYPES.map((t) => (
              <button
                key={t.id}
                type="button"
                className={clsx(styles.modeBtn, subMode === t.id && styles.modeBtnActive)}
                style={subMode === t.id ? {background: MODES.uml.color} : undefined}
                onClick={() => {
                  setSubMode(t.id);
                  resetCanvas();
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}

        {mode === 'c4' && (
          <div className={styles.modeBar}>
            {C4_LEVELS.map((l) => (
              <button
                key={l.id}
                type="button"
                className={clsx(styles.modeBtn, subMode === l.id && styles.modeBtnActive)}
                style={subMode === l.id ? {background: MODES.c4.color} : undefined}
                onClick={() => {
                  setSubMode(l.id);
                  resetCanvas();
                }}
                title={l.desc}
              >
                {l.label}
              </button>
            ))}
          </div>
        )}

        <p className={styles.hint}>
          Клик по палитре — новый элемент. Выберите узел → "Связать" → второй узел. Перетаскивание
          мышью. Экспорт — текст для Mermaid / Confluence.
        </p>

        <div className={styles.layout}>
          <div className={styles.panel}>
            <div className={styles.panelHead}>Палитра</div>
            <div className={styles.panelBody}>
              {palette.map((item) => (
                <button
                  key={item.type}
                  type="button"
                  className={styles.paletteItem}
                  onClick={() => addAtCenter(item)}
                >
                  + {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.panel}>
            <div className={styles.toolbar}>
              {Object.entries(templates).map(([key, tpl]) => (
                <button
                  key={key}
                  type="button"
                  className={styles.toolBtn}
                  onClick={() => applyTemplate(key)}
                >
                  {tpl.label}
                </button>
              ))}
              <button type="button" className={styles.toolBtn} onClick={startConnect}>
                Связать
              </button>
              <button type="button" className={styles.toolBtn} onClick={removeSelected}>
                Удалить
              </button>
              <button type="button" className={styles.toolBtn} onClick={resetCanvas}>
                Очистить
              </button>
            </div>
            <div
              ref={canvasRef}
              className={styles.canvasWrap}
              onClick={onCanvasClick}
              role="presentation"
            >
              <svg className={styles.canvasSvg} aria-hidden>
                <defs>
                  <marker
                    id="arrow"
                    markerWidth="8"
                    markerHeight="8"
                    refX="6"
                    refY="4"
                    orient="auto"
                  >
                    <path d="M0,0 L8,4 L0,8 Z" fill="var(--ifm-color-emphasis-600)" />
                  </marker>
                </defs>
                {edges.map((e) => (
                  <path
                    key={`${e.from}-${e.to}`}
                    d={edgePath(e.from, e.to, nodes)}
                    className={styles.edgePath}
                  />
                ))}
              </svg>
              {nodes.map((node) => (
                <DiagramNode
                  key={node.id}
                  node={node}
                  selected={selectedId === node.id || connectFrom === node.id}
                  onSelect={onNodeSelect}
                  onDrag={(id, x, y) =>
                    setNodes((prev) =>
                      prev.map((n) => (n.id === id ? {...n, x, y} : n)),
                    )
                  }
                />
              ))}
            </div>
          </div>

          <div className={styles.panel}>
            <div className={styles.panelHead}>Свойства</div>
            <div className={styles.panelBody}>
              {selectedId ? (
                <>
                  <label className={styles.hint}>
                    Подпись
                    <input
                      className="input-demo"
                      value={labelDraft}
                      onChange={(e) => updateLabel(e.target.value)}
                      style={{width: '100%', marginTop: 4}}
                    />
                  </label>
                  {connectFrom && (
                    <p className={styles.hint} style={{marginTop: 8}}>
                      Выберите целевой узел для связи…
                    </p>
                  )}
                </>
              ) : (
                <p className={styles.hint}>Выберите элемент на холсте</p>
              )}
              <p className={styles.hint} style={{marginTop: '0.75rem'}}>
                Mermaid
              </p>
              <div className={styles.exportBox}>{mermaid || '—'}</div>
              <button
                type="button"
                className={styles.toolBtn}
                style={{marginTop: 6}}
                onClick={() => copy(mermaid)}
              >
                {copied ? 'Скопировано' : 'Копировать'}
              </button>
            </div>
          </div>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default DiagramStudioInner;
