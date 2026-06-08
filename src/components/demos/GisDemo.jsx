import React, {useCallback, useMemo, useRef, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import styles from '@/components/demos/GisDemo.module.css';

const MAP_W = 480;
const MAP_H = 320;

const LAYERS = [
  {id: 'parcels', label: 'Участки', color: '#66bb6a'},
  {id: 'buildings', label: 'Здания', color: '#42a5f5'},
  {id: 'roads', label: 'Дороги', color: '#ffa726'},
  {id: 'poi', label: 'Точки (POI)', color: '#ef5350'},
];

/** Учебный набор объектов — мини-квартал */
const FEATURES = [
  {
    id: 'parcel-a',
    layer: 'parcels',
    type: 'polygon',
    points: [
      [24, 28],
      [118, 28],
      [118, 108],
      [24, 108],
    ],
    attrs: {кадастр: '47:01:0001', площадь: '1 240 м²', назначение: 'жилое'},
  },
  {
    id: 'parcel-b',
    layer: 'parcels',
    type: 'polygon',
    points: [
      [128, 32],
      [248, 32],
      [248, 118],
      [128, 118],
    ],
    attrs: {кадастр: '47:01:0002', площадь: '980 м²', назначение: 'общественное'},
  },
  {
    id: 'b-school',
    layer: 'buildings',
    type: 'polygon',
    points: [
      [40, 44],
      [100, 44],
      [100, 92],
      [40, 92],
    ],
    attrs: {название: 'Школа №12', этажей: '3', год: '1987'},
  },
  {
    id: 'b-clinic',
    layer: 'buildings',
    type: 'polygon',
    points: [
      [148, 48],
      [228, 48],
      [228, 100],
      [148, 100],
    ],
    attrs: {название: 'Поликлиника', этажей: '5', год: '2004'},
  },
  {
    id: 'b-park',
    layer: 'buildings',
    type: 'polygon',
    points: [
      [280, 40],
      [360, 40],
      [360, 120],
      [280, 120],
    ],
    attrs: {название: 'Павильон парка', этажей: '1', год: '2019'},
  },
  {
    id: 'road-main',
    layer: 'roads',
    type: 'line',
    points: [
      [0, 158],
      [480, 158],
    ],
    attrs: {название: 'ул. Центральная', полос: '4', покрытие: 'асфальт'},
  },
  {
    id: 'road-cross',
    layer: 'roads',
    type: 'line',
    points: [
      [200, 0],
      [200, 320],
    ],
    attrs: {название: 'пр. Северный', полос: '2', покрытие: 'асфальт'},
  },
  {
    id: 'poi-metro',
    layer: 'poi',
    type: 'point',
    x: 198,
    y: 152,
    attrs: {тип: 'метро', название: 'Станция "Северная"'},
  },
  {
    id: 'poi-stop',
    layer: 'poi',
    type: 'point',
    x: 320,
    y: 168,
    attrs: {тип: 'остановка', название: 'Автобус №42'},
  },
  {
    id: 'poi-fountain',
    layer: 'poi',
    type: 'point',
    x: 318,
    y: 78,
    attrs: {тип: 'благоустройство', название: 'Фонтан'},
  },
];

/** Упрощённое R-дерево (2 уровня) для демонстрации MBR */
const RTREE_NODES = [
  {id: 'root', mbr: [0, 0, 480, 320], children: ['n-west', 'n-east']},
  {id: 'n-west', mbr: [20, 24, 252, 122], children: ['parcel-a', 'parcel-b', 'b-school', 'b-clinic']},
  {id: 'n-east', mbr: [276, 32, 364, 172], children: ['b-park', 'poi-fountain', 'poi-stop']},
];

function bboxOfFeature(f) {
  if (f.type === 'point') {
    const pad = 8;
    return [f.x - pad, f.y - pad, f.x + pad, f.y + pad];
  }
  const xs = f.points.map((p) => p[0]);
  const ys = f.points.map((p) => p[1]);
  return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)];
}

function rectsIntersect(a, b) {
  return !(a[2] < b[0] || a[0] > b[2] || a[3] < b[1] || a[1] > b[3]);
}

function normalizeRect(x1, y1, x2, y2) {
  return [Math.min(x1, x2), Math.min(y1, y2), Math.max(x1, x2), Math.max(y1, y2)];
}

function featureInQuery(f, query) {
  const fb = bboxOfFeature(f);
  if (!rectsIntersect(fb, query)) return false;
  if (f.type === 'point') {
    return f.x >= query[0] && f.x <= query[2] && f.y >= query[1] && f.y <= query[3];
  }
  return true;
}

function clientToMap(svg, clientX, clientY) {
  const rect = svg.getBoundingClientRect();
  const x = ((clientX - rect.left) / rect.width) * MAP_W;
  const y = ((clientY - rect.top) / rect.height) * MAP_H;
  return [Math.max(0, Math.min(MAP_W, x)), Math.max(0, Math.min(MAP_H, y))];
}

function GisDemoInner() {
  const svgRef = useRef(null);
  const dragRef = useRef(null);

  const [layerVis, setLayerVis] = useState(() =>
    Object.fromEntries(LAYERS.map((l) => [l.id, true])),
  );
  const [mode, setMode] = useState('query');
  const [showRtree, setShowRtree] = useState(true);
  const [queryRect, setQueryRect] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [draftRect, setDraftRect] = useState(null);

  const visibleFeatures = useMemo(
    () => FEATURES.filter((f) => layerVis[f.layer]),
    [layerVis],
  );

  const activeQuery = queryRect || draftRect;

  const hits = useMemo(() => {
    if (!queryRect) return [];
    return visibleFeatures.filter((f) => featureInQuery(f, queryRect));
  }, [queryRect, visibleFeatures]);

  const hitIds = useMemo(() => new Set(hits.map((f) => f.id)), [hits]);

  const rtreeLog = useMemo(() => {
    if (!queryRect || !showRtree) return [];
    return RTREE_NODES.filter((n) => n.id !== 'root').map((node) => {
      const pruned = !rectsIntersect(node.mbr, queryRect);
      const nodeHits = node.children.filter((id) => hitIds.has(id));
      return {id: node.id, pruned, nodeHits};
    });
  }, [queryRect, showRtree, hitIds]);

  const selected = FEATURES.find((f) => f.id === selectedId);

  const onPointerDown = useCallback(
    (e) => {
      if (mode !== 'query') return;
      const svg = svgRef.current;
      if (!svg) return;
      const [x, y] = clientToMap(svg, e.clientX, e.clientY);
      dragRef.current = {x0: x, y0: y};
      setDraftRect([x, y, x, y]);
      setQueryRect(null);
      setSelectedId(null);
      e.currentTarget.setPointerCapture(e.pointerId);
    },
    [mode],
  );

  const onPointerMove = useCallback((e) => {
    const drag = dragRef.current;
    const svg = svgRef.current;
    if (!drag || !svg) return;
    const [x, y] = clientToMap(svg, e.clientX, e.clientY);
    setDraftRect(normalizeRect(drag.x0, drag.y0, x, y));
  }, []);

  const onPointerUp = useCallback(() => {
    const drag = dragRef.current;
    dragRef.current = null;
    if (!drag) return;
    setDraftRect((r) => {
      if (!r) return null;
      const w = r[2] - r[0];
      const h = r[3] - r[1];
      if (w < 6 && h < 6) {
        setQueryRect(null);
        return null;
      }
      setQueryRect(r);
      return null;
    });
  }, []);

  const clearQuery = () => {
    setQueryRect(null);
    setDraftRect(null);
    setSelectedId(null);
  };

  const layerColor = (id) => LAYERS.find((l) => l.id === id)?.color ?? '#888';

  const renderFeature = (f) => {
    const selected = f.id === selectedId;
    const hit = hitIds.has(f.id);
    const stroke = selected ? '#7b68ee' : hit ? '#2e7d32' : layerColor(f.layer);
    const strokeW = selected || hit ? 2.5 : 1.5;
    const fillOpacity = f.type === 'polygon' ? (hit ? 0.55 : 0.35) : 0;

    if (f.type === 'polygon') {
      const d = f.points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`).join(' ') + ' Z';
      return (
        <path
          key={f.id}
          d={d}
          fill={layerColor(f.layer)}
          fillOpacity={fillOpacity}
          stroke={stroke}
          strokeWidth={strokeW}
          onClick={() => setSelectedId(f.id)}
          style={{cursor: 'pointer'}}
        />
      );
    }
    if (f.type === 'line') {
      const d = f.points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`).join(' ');
      return (
        <path
          key={f.id}
          d={d}
          fill="none"
          stroke={stroke}
          strokeWidth={hit || selected ? 5 : 4}
          strokeLinecap="round"
          onClick={() => setSelectedId(f.id)}
          style={{cursor: 'pointer'}}
        />
      );
    }
    return (
      <g key={f.id} onClick={() => setSelectedId(f.id)} style={{cursor: 'pointer'}}>
        <circle cx={f.x} cy={f.y} r={hit || selected ? 9 : 7} fill={layerColor(f.layer)} stroke={stroke} strokeWidth={strokeW} />
        <circle cx={f.x} cy={f.y} r={3} fill="#fff" />
      </g>
    );
  };

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Мини-ГИС: слои, объекты и пространственный запрос"
        subtitle="Векторная карта с атрибутами, переключением слоёв и поиском &quot;в прямоугольнике&quot; через ограничивающие прямоугольники (R-дерево)."
      >
        <div className={styles.toolbar} role="toolbar" aria-label="Режим карты">
          <button
            type="button"
            className={clsx('it-demo__tab', {'it-demo__tab--active': mode === 'view'})}
            onClick={() => setMode('view')}
          >
            Просмотр
          </button>
          <button
            type="button"
            className={clsx('it-demo__tab', {'it-demo__tab--active': mode === 'query'})}
            onClick={() => setMode('query')}
          >
            Запрос по области
          </button>
          <button type="button" className="it-demo__btn it-demo__btn--secondary" onClick={clearQuery}>
            Сбросить
          </button>
          <label className="it-demo__check" style={{marginLeft: 'auto'}}>
            <input type="checkbox" checked={showRtree} onChange={(e) => setShowRtree(e.target.checked)} />
            MBR узлов R-дерева
          </label>
        </div>

        <div className={styles.layout}>
          <div>
            <div className={styles.mapWrap}>
              <svg
                ref={svgRef}
                className={clsx(styles.mapSvg, mode === 'view' && styles.mapSvgView)}
                viewBox={`0 0 ${MAP_W} ${MAP_H}`}
                role="img"
                aria-label="Учебная карта квартала"
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerLeave={onPointerUp}
              >
                <defs>
                  <pattern id="gis-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--gis-grid)" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width={MAP_W} height={MAP_H} fill="url(#gis-grid)" />

                {showRtree &&
                  RTREE_NODES.filter((n) => n.id !== 'root').map((node) => (
                    <rect
                      key={node.id}
                      x={node.mbr[0]}
                      y={node.mbr[1]}
                      width={node.mbr[2] - node.mbr[0]}
                      height={node.mbr[3] - node.mbr[1]}
                      fill="var(--gis-rtree)"
                      stroke="var(--gis-rtree-stroke)"
                      strokeWidth={1.5}
                      strokeDasharray="6 4"
                      rx={2}
                    />
                  ))}

                {visibleFeatures.map(renderFeature)}

                {activeQuery && (
                  <rect
                    x={activeQuery[0]}
                    y={activeQuery[1]}
                    width={activeQuery[2] - activeQuery[0]}
                    height={activeQuery[3] - activeQuery[1]}
                    fill="var(--gis-query)"
                    stroke="var(--gis-query-stroke)"
                    strokeWidth={2}
                    strokeDasharray="4 3"
                    pointerEvents="none"
                  />
                )}
              </svg>
            </div>

            <div className={styles.legend}>
              <span className={styles.legendItem}>
                <span className={styles.legendBox} style={{background: 'var(--gis-rtree)', borderColor: 'var(--gis-rtree-stroke)'}} />
                MBR узла индекса
              </span>
              <span className={styles.legendItem}>
                <span className={styles.legendBox} style={{background: 'var(--gis-query)', borderColor: 'var(--gis-query-stroke)'}} />
                Область запроса
              </span>
              <span className={styles.legendItem}>
                <span className={styles.legendBox} style={{background: 'var(--gis-hit)', borderColor: '#2e7d32'}} />
                Найденные объекты
              </span>
            </div>

            <p className={styles.hint}>
              {mode === 'query'
                ? 'Выделите прямоугольник на карте — ГИС сначала отсечёт ветви R-дерева по пересечению MBR, затем проверит геометрию объектов. Клик по объекту откроет атрибуты.'
                : 'Режим просмотра: кликайте по объектам, переключайте слои справа.'}
            </p>
          </div>

          <aside className={styles.sidePanel}>
            <div className={styles.panelBlock}>
              <p className={styles.panelTitle}>Слои</p>
              {LAYERS.map((layer) => (
                <label key={layer.id} className={styles.layerRow}>
                  <input
                    type="checkbox"
                    checked={layerVis[layer.id]}
                    onChange={(e) => setLayerVis((v) => ({...v, [layer.id]: e.target.checked}))}
                  />
                  <span className={styles.layerSwatch} style={{background: layer.color}} />
                  {layer.label}
                </label>
              ))}
            </div>

            <div className={styles.panelBlock}>
              <p className={styles.panelTitle}>Результат запроса</p>
              {queryRect ? (
                <>
                  <p style={{margin: '0 0 0.35rem'}}>
                    Найдено: <strong>{hits.length}</strong>
                    {hits.length > 0 && ` — ${hits.map((h) => h.attrs.название || h.attrs.кадастр || h.id).join(', ')}`}
                  </p>
                  {showRtree && (
                    <ul className={styles.queryLog}>
                      {rtreeLog.map((row) => (
                        <li key={row.id} className={row.pruned ? styles.queryLogSkip : styles.queryLogHit}>
                          {row.pruned
                            ? `${row.id}: MBR не пересекается → ветвь отсечена`
                            : `${row.id}: MBR ✓ → объекты: ${row.nodeHits.length ? row.nodeHits.join(', ') : '—'}`}
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <p style={{margin: 0, color: 'var(--demo-muted)'}}>Выделите область на карте</p>
              )}
            </div>

            <div className={styles.panelBlock}>
              <p className={styles.panelTitle}>Атрибуты объекта</p>
              {selected ? (
                <ul className={styles.attrList}>
                  <li>
                    <span className={styles.attrKey}>Слой</span>
                    <span>{LAYERS.find((l) => l.id === selected.layer)?.label}</span>
                  </li>
                  {Object.entries(selected.attrs).map(([k, v]) => (
                    <li key={k}>
                      <span className={styles.attrKey}>{k}</span>
                      <span>{v}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{margin: 0, color: 'var(--demo-muted)'}}>Выберите объект на карте</p>
              )}
            </div>
          </aside>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default GisDemoInner;
