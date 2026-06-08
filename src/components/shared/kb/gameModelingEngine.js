/** Этапы игрового моделирования (статья 115) */

export const MODELING_STAGES = [
  {
    id: 'concept',
    label: 'Концепт',
    icon: '✏',
    polys: 0,
    lod: '—',
    detail: 'Эскиз формы, пропорций и силуэта — ориентир для всей модели.',
    artifacts: ['Concept art', 'Reference board'],
  },
  {
    id: 'blocking',
    label: 'Блокинг',
    icon: '▣',
    polys: 420,
    lod: 'LOD0 block',
    detail: 'Примитивы (куб, цилиндр) задают объём без деталей.',
    artifacts: ['Proxy mesh', 'Scale check'],
  },
  {
    id: 'detail',
    label: 'Детализация',
    icon: '◈',
    polys: 12400,
    lod: 'LOD0 high',
    detail: 'Скульпт или ручное моделирование — рёбра, панели, износ.',
    artifacts: ['High-poly bake source'],
  },
  {
    id: 'uv',
    label: 'UV-развёртка',
    icon: '▤',
    polys: 3200,
    lod: 'Game mesh',
    detail: 'Поверхность "разрезается" на 2D-острова для текстур.',
    artifacts: ['UV layout', 'Texel density map'],
  },
  {
    id: 'texture',
    label: 'Текстуры',
    icon: '🎨',
    polys: 3200,
    lod: 'In-engine',
    detail: 'Albedo, Normal, Roughness — PBR-набор для движка.',
    artifacts: ['.png / .tga', 'Material instance'],
  },
];

export function modelingProgress(completedIds) {
  const done = completedIds.length;
  return {done, total: MODELING_STAGES.length, pct: Math.round((done / MODELING_STAGES.length) * 100)};
}

/** Упрощённая "сетка" — больше линий на поздних этапах */
export function drawModelPreview(ctx, w, h, stageId) {
  const cx = w / 2;
  const cy = h / 2;
  ctx.fillStyle = getComputedStyle(document.documentElement)
    .getPropertyValue('--ifm-background-color')
    .trim() || '#fff';
  ctx.fillRect(0, 0, w, h);

  if (stageId === 'concept') {
    ctx.strokeStyle = '#9e9e9e';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    ctx.strokeRect(cx - 55, cy - 35, 110, 70);
    ctx.setLineDash([]);
    ctx.strokeStyle = '#424242';
    ctx.beginPath();
    ctx.moveTo(cx - 40, cy + 25);
    ctx.quadraticCurveTo(cx, cy - 50, cx + 45, cy + 20);
    ctx.stroke();
    ctx.font = '12px sans-serif';
    ctx.fillStyle = '#757575';
    ctx.fillText('Sketch', cx - 22, cy + 5);
    return;
  }

  const density =
    stageId === 'blocking' ? 4 : stageId === 'detail' ? 12 : stageId === 'uv' ? 8 : 8;
  const fill =
    stageId === 'texture'
      ? '#8d6e63'
      : stageId === 'uv'
        ? 'rgba(33, 150, 243, 0.25)'
        : 'rgba(21, 101, 192, 0.2)';
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.moveTo(cx - 48, cy + 28);
  ctx.lineTo(cx + 48, cy + 28);
  ctx.lineTo(cx + 20, cy - 38);
  ctx.lineTo(cx - 30, cy - 30);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = stageId === 'detail' ? '#1565c0' : '#546e7a';
  ctx.lineWidth = stageId === 'detail' ? 0.8 : 1.2;
  for (let row = 0; row < density; row++) {
    for (let col = 0; col < density; col++) {
      const x0 = cx - 45 + (col / density) * 90;
      const y0 = cy - 35 + (row / density) * 65;
      const x1 = cx - 45 + ((col + 1) / density) * 90;
      const y1 = cy - 35 + ((row + 1) / density) * 65;
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y0);
      ctx.lineTo(x1, y1);
      ctx.stroke();
    }
  }

  if (stageId === 'uv') {
    ctx.strokeStyle = '#ff9800';
    ctx.setLineDash([3, 3]);
    ctx.strokeRect(cx - 45, cy - 35, 42, 30);
    ctx.strokeRect(cx + 5, cy - 35, 38, 30);
    ctx.setLineDash([]);
    ctx.font = '9px monospace';
    ctx.fillStyle = '#e65100';
    ctx.fillText('UV island A', cx - 42, cy - 38);
    ctx.fillText('UV island B', cx + 8, cy - 38);
  }

  if (stageId === 'texture') {
    const g = ctx.createLinearGradient(cx - 40, cy - 20, cx + 40, cy + 20);
    g.addColorStop(0, '#a1887f');
    g.addColorStop(0.5, '#6d4c41');
    g.addColorStop(1, '#4e342e');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(cx - 48, cy + 28);
    ctx.lineTo(cx + 48, cy + 28);
    ctx.lineTo(cx + 20, cy - 38);
    ctx.lineTo(cx - 30, cy - 30);
    ctx.closePath();
    ctx.fill();
  }
}
