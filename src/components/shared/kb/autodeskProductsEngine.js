/** Данные и отрисовка для демо продуктов Autodesk */

export const AUTODESK_PRODUCTS = {
  autocad: {
    id: 'autocad',
    label: 'AutoCAD',
    brand: '#e51937',
    subtitle: '2D-чертёж: слои, примитивы и командная строка',
    hint: 'Переключайте слои и добавляйте геометрию — объекты хранятся в "базе чертежа" с привязкой к слою.',
  },
  revit: {
    id: 'revit',
    label: 'Revit',
    brand: '#0696d7',
    subtitle: 'BIM: одна модель — план, разрез и спецификация',
    hint: 'Изменение высоты стены обновляет все виды: параметрическая связь элементов.',
  },
  '3dsmax': {
    id: '3dsmax',
    label: '3ds Max',
    brand: '#1fbc00',
    subtitle: 'Стек модификаторов над полигональным телом',
    hint: 'Модификаторы применяются снизу вверх: Box → TurboSmooth → Bend.',
  },
  maya: {
    id: 'maya',
    label: 'Maya',
    brand: '#37a0e0',
    subtitle: 'Узловой граф DAG: атрибуты и связи сцены',
    hint: 'Узлы соединены связями — изменение translate X двигает mesh в viewport.',
  },
  softimage: {
    id: 'softimage',
    label: 'Softimage',
    brand: '#6b7280',
    subtitle: 'ICE-узлы и нелинейные клипы (исторический продукт)',
    hint: 'Autodesk прекратил развитие в 2015; идеи ICE живут в Bifrost (Maya).',
  },
  tinkercad: {
    id: 'tinkercad',
    label: 'TinkerCAD',
    brand: '#f5a623',
    subtitle: 'CSG: примитивы, отверстия и группировка',
    hint: 'Объединение твёрдых тел и вычитание "отверстий" — конструктивная геометрия.',
  },
};

export const AUTOCAD_LAYERS = [
  {id: 'walls', label: 'Стены', color: '#00ffff', visible: true},
  {id: 'axes', label: 'Оси', color: '#ff00ff', visible: true},
  {id: 'dims', label: 'Размеры', color: '#ffff00', visible: true},
];

export const REVIT_VIEWS = [
  {id: 'plan', label: 'План'},
  {id: 'section', label: 'Разрез'},
  {id: 'schedule', label: 'Спецификация'},
];

export const MAX_MODIFIERS = [
  {id: 'box', label: 'Box', enabled: true},
  {id: 'turbo', label: 'TurboSmooth', enabled: true},
  {id: 'bend', label: 'Bend', enabled: true},
];

export const MAYA_NODES = [
  {id: 'transform', label: 'transform1', type: 'transform'},
  {id: 'mesh', label: 'polySphere1', type: 'shape'},
  {id: 'shader', label: 'lambert1', type: 'shader'},
];

export const MAYA_EDGES = [
  ['transform', 'mesh'],
  ['shader', 'mesh'],
];

export const ICE_NODES = [
  {id: 'emit', label: 'Emit', x: 0},
  {id: 'noise', label: 'Noise', x: 1},
  {id: 'scale', label: 'Scale', x: 2},
  {id: 'render', label: 'Render', x: 3},
];

export const TINKER_SHAPES = [
  {id: 'box', label: 'Куб', solid: true},
  {id: 'cyl', label: 'Цилиндр', solid: true},
  {id: 'hole', label: 'Отверстие', solid: false},
];

function grid(ctx, w, h, step, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  for (let x = 0; x <= w; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = 0; y <= h; y += step) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }
}

/** AutoCAD: чертёж с объектами по слоям */
export function drawAutoCAD(ctx, w, h, entities, layers) {
  ctx.fillStyle = '#0d1117';
  ctx.fillRect(0, 0, w, h);
  grid(ctx, w, h, 20, 'rgba(0,255,255,0.06)');

  const layerMap = Object.fromEntries(layers.map((l) => [l.id, l]));

  entities.forEach((ent) => {
    const layer = layerMap[ent.layer];
    if (!layer?.visible) return;
    ctx.strokeStyle = layer.color;
    ctx.fillStyle = layer.color;
    ctx.lineWidth = ent.width ?? 2;

    if (ent.type === 'line') {
      ctx.beginPath();
      ctx.moveTo(ent.x1, ent.y1);
      ctx.lineTo(ent.x2, ent.y2);
      ctx.stroke();
    } else if (ent.type === 'circle') {
      ctx.beginPath();
      ctx.arc(ent.cx, ent.cy, ent.r, 0, Math.PI * 2);
      ctx.stroke();
    } else if (ent.type === 'rect') {
      ctx.strokeRect(ent.x, ent.y, ent.w, ent.h);
    }
  });

  ctx.fillStyle = 'rgba(0,0,0,0.55)';
  ctx.fillRect(0, h - 22, w, 22);
  ctx.fillStyle = '#7ee787';
  ctx.font = '11px monospace';
  ctx.fillText('Command: _MODEL', 8, h - 8);
}

/** Revit: план / разрез / спецификация */
export function drawRevit(ctx, w, h, view, wallHeight, doorCount) {
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, w, h);

  if (view === 'schedule') {
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('Спецификация стен', 12, 22);
    const rows = [
      ['Стены', `${Math.round(wallHeight * 10)} мм`, '12'],
      ['Двери', `900×2100`, String(doorCount)],
      ['Окна', `1200×1400`, '4'],
    ];
    let y = 44;
    rows.forEach(([a, b, c]) => {
      ctx.fillStyle = '#64748b';
      ctx.font = '10px sans-serif';
      ctx.fillText(a, 12, y);
      ctx.fillText(b, 100, y);
      ctx.fillText(c, w - 28, y);
      y += 22;
    });
    return;
  }

  const baseY = h - 40;
  const wallH = 30 + wallHeight * 0.55;
  const wallColor = '#0696d7';

  if (view === 'section') {
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(0, baseY, w, 8);
    ctx.fillStyle = wallColor;
    ctx.fillRect(40, baseY - wallH, 24, wallH);
    ctx.fillRect(120, baseY - wallH * 0.85, 24, wallH * 0.85);
    ctx.fillStyle = '#94a3b8';
    for (let i = 0; i < doorCount; i++) {
      const dx = 55 + i * 35;
      ctx.fillRect(dx, baseY - 18, 14, 18);
    }
    ctx.strokeStyle = '#ef4444';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(10, baseY - wallH - 8);
    ctx.lineTo(w - 10, baseY - wallH - 8);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#64748b';
    ctx.font = '10px sans-serif';
    ctx.fillText(`↑ ${Math.round(wallHeight * 10)} мм`, w - 72, baseY - wallH - 12);
    return;
  }

  // plan
  grid(ctx, w, h, 24, 'rgba(6,150,215,0.08)');
  ctx.strokeStyle = wallColor;
  ctx.lineWidth = 3;
  ctx.strokeRect(36, 36, w - 72, h - 90);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(w / 2, 36);
  ctx.lineTo(w / 2, h - 54);
  ctx.stroke();
  for (let i = 0; i < doorCount; i++) {
    const gap = 48 + i * 42;
    ctx.fillStyle = '#fff';
    ctx.fillRect(gap, h - 58, 28, 6);
    ctx.strokeStyle = '#64748b';
    ctx.strokeRect(gap, h - 58, 28, 6);
  }
  ctx.fillStyle = '#64748b';
  ctx.font = '10px sans-serif';
  ctx.fillText('План этажа', 12, 18);
}

/** 3ds Max: коробка с модификаторами */
export function draw3dsMax(ctx, w, h, bend, mods) {
  ctx.fillStyle = '#2a2a2a';
  ctx.fillRect(0, 0, w, h);
  grid(ctx, w, h, 16, 'rgba(255,255,255,0.05)');

  const cx = w / 2;
  const cy = h / 2 + 10;
  const cols = 6;
  const rows = 4;
  const cellW = 22;
  const cellH = 14;
  const angle = (bend / 100) * 0.9;

  const enabled = Object.fromEntries(mods.map((m) => [m.id, m.enabled]));

  ctx.save();
  ctx.translate(cx, cy);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const nx = (c - cols / 2) / cols;
      const bendOff = enabled.bend ? Math.sin(nx * Math.PI + angle) * 18 : 0;
      const smooth = enabled.turbo ? 1 : 0;
      const sz = enabled.box ? cellW : cellW * 0.7;
      const hCell = cellH + smooth * 2;
      const x = c * (cellW + 4) - (cols * (cellW + 4)) / 2;
      const y = r * (cellH + 6) - (rows * (cellH + 6)) / 2 + bendOff;
      ctx.fillStyle = r % 2 === c % 2 ? '#5cdb5c' : '#3d9a3d';
      ctx.fillRect(x, y, sz, hCell);
      ctx.strokeStyle = '#1a4d1a';
      ctx.strokeRect(x, y, sz, hCell);
    }
  }
  ctx.restore();
}

/** Maya: сфера с поворотом от transform */
export function drawMaya(ctx, w, h, translateX, activeNode) {
  ctx.fillStyle = '#3d3d3d';
  ctx.fillRect(0, 0, w, h);
  grid(ctx, w, h, 18, 'rgba(255,255,255,0.06)');

  const cx = w / 2 + translateX * 0.8;
  const cy = h / 2;
  const grad = ctx.createRadialGradient(cx - 8, cy - 8, 4, cx, cy, 52);
  grad.addColorStop(0, '#7ec8ff');
  grad.addColorStop(1, '#2563eb');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.ellipse(cx, cy, 48, 40, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = activeNode === 'mesh' ? '#fbbf24' : '#1e40af';
  ctx.lineWidth = activeNode === 'mesh' ? 3 : 1;
  ctx.stroke();

  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.fillRect(0, 0, w, 20);
  ctx.fillStyle = '#e2e8f0';
  ctx.font = '10px monospace';
  ctx.fillText(`translateX = ${translateX.toFixed(1)}`, 8, 14);
}

/** Softimage: ICE-цепочка */
export function drawSoftimageICE(ctx, w, h, activeId, clipMix) {
  ctx.fillStyle = '#1e1e2e';
  ctx.fillRect(0, 0, w, h);
  const nodes = ICE_NODES;
  const nodeW = (w - 40) / nodes.length;
  nodes.forEach((n, i) => {
    const x = 20 + i * nodeW;
    const y = 50;
    const active = n.id === activeId;
    ctx.fillStyle = active ? '#818cf8' : '#374151';
    ctx.fillRect(x, y, nodeW - 12, 36);
    ctx.fillStyle = '#f8fafc';
    ctx.font = '10px sans-serif';
    ctx.fillText(n.label, x + 6, y + 22);
    if (i < nodes.length - 1) {
      ctx.strokeStyle = '#94a3b8';
      ctx.beginPath();
      ctx.moveTo(x + nodeW - 12, y + 18);
      ctx.lineTo(x + nodeW, y + 18);
      ctx.stroke();
    }
  });
  const barY = h - 48;
  ctx.fillStyle = '#4b5563';
  ctx.fillRect(16, barY, w - 32, 28);
  ctx.fillStyle = '#a78bfa';
  ctx.fillRect(16, barY, (w - 32) * clipMix, 28);
  ctx.fillStyle = '#e2e8f0';
  ctx.font = '10px sans-serif';
  ctx.fillText('NLA clip mix', 20, barY + 18);
}

/** TinkerCAD: изометрические примитивы */
export function isoProject(x, y, z, cx, cy, scale) {
  return {
    x: cx + (x - z) * scale * 0.866,
    y: cy + (x + z) * scale * 0.5 - y * scale,
  };
}

export function drawTinkerCAD(ctx, w, h, shapes, grouped) {
  ctx.fillStyle = '#e8f4fc';
  ctx.fillRect(0, 0, w, h);
  grid(ctx, w, h, 20, 'rgba(0,120,200,0.1)');

  const cx = w / 2;
  const cy = h / 2 + 20;
  const scale = grouped ? 14 : 12;

  shapes.forEach((sh, i) => {
    const ox = (i - 1) * (grouped ? 0 : 28);
    const oz = grouped ? 0 : i * 8;
    const color = sh.solid ? '#f5a623' : '#4a90d9';
    const size = sh.id === 'cyl' ? [0.6, 1, 0.6] : [1, sh.solid ? 0.5 : 0.35, 1];
    const [sx, sy, sz] = size;

    const verts = [
      [-sx, 0, -sz], [sx, 0, -sz], [sx, 0, sz], [-sx, 0, sz],
      [-sx, sy * 2, -sz], [sx, sy * 2, -sz], [sx, sy * 2, sz], [-sx, sy * 2, sz],
    ].map(([x, y, z]) => isoProject(x + ox, y, z + oz, cx, cy, scale));

    const edges = [
      [0, 1], [1, 2], [2, 3], [3, 0],
      [4, 5], [5, 6], [6, 7], [7, 4],
      [0, 4], [1, 5], [2, 6], [3, 7],
    ];
    ctx.fillStyle = sh.solid ? color : 'rgba(74,144,217,0.35)';
    ctx.strokeStyle = sh.solid ? '#c77d00' : '#2563eb';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(verts[0].x, verts[0].y);
    verts.slice(1, 4).forEach((p) => ctx.lineTo(p.x, p.y));
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(verts[4].x, verts[4].y);
    [5, 6, 7, 4].forEach((idx) => ctx.lineTo(verts[idx].x, verts[idx].y));
    ctx.fill();
    ctx.stroke();
    [0, 1, 2, 3].forEach((i2) => {
      ctx.beginPath();
      ctx.moveTo(verts[i2].x, verts[i2].y);
      ctx.lineTo(verts[i2 + 4].x, verts[i2 + 4].y);
      ctx.stroke();
    });
  });
}

export function getProductMeta(productId) {
  return AUTODESK_PRODUCTS[productId] ?? AUTODESK_PRODUCTS.autocad;
}
