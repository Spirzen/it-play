/** Этапы 3D-графики и анимации */

export const GRAPHICS_STAGES = [
  {
    id: 'mesh',
    label: 'Сетка',
    phase: 'Геометрия',
    polys: 240,
    detail: 'Вершины, рёбра и треугольные грани — каркас модели.',
    hint: 'Полигональная mesh: каждая грань — плоский треугольник для GPU.',
  },
  {
    id: 'transform',
    label: 'Трансформы',
    phase: 'Пространство',
    polys: 240,
    detail: 'Матрицы перемещения, поворота и масштаба (TRS).',
    hint: 'Объект движется в сцене без изменения топологии сетки.',
  },
  {
    id: 'animation',
    label: 'Анимация',
    phase: 'Время',
    polys: 240,
    detail: 'Ключевые кадры и интерполяция параметров по timeline.',
    hint: 'Keyframe на кадре 1 и 48 — Blender/NLE считает промежуточные значения.',
  },
  {
    id: 'lighting',
    label: 'Освещение',
    phase: 'Свет',
    polys: 240,
    detail: 'Источники света, тени, нормали и BSDF-материалы.',
    hint: 'Area Light + Principled BSDF задают отклик поверхности.',
  },
  {
    id: 'render',
    label: 'Рендер',
    phase: 'Кадр',
    polys: 240,
    detail: 'Ray tracing / rasterization — итоговое 2D-изображение сцены.',
    hint: 'Cycles/Eevee сэмплируют лучи или растрируют в буфер кадра.',
  },
];

export function stageProgress(index) {
  return {
    done: index + 1,
    total: GRAPHICS_STAGES.length,
    pct: Math.round(((index + 1) / GRAPHICS_STAGES.length) * 100),
  };
}

/** Рисует превью сцены на canvas в зависимости от этапа */
export function drawGraphicsStage(ctx, w, h, stageId, frame) {
  const cx = w / 2;
  const cy = h / 2;
  const bg = getComputedStyle(document.documentElement)
    .getPropertyValue('--ifm-background-color')
    .trim() || '#fff';
  ctx.fillStyle = stageId === 'render' ? '#0f172a' : bg;
  ctx.fillRect(0, 0, w, h);

  const t = frame * 0.04;
  const bob = Math.sin(t) * 6;

  if (stageId === 'mesh' || stageId === 'transform') {
    ctx.strokeStyle = stageId === 'mesh' ? '#1565c0' : '#2e7d32';
    ctx.lineWidth = 1.5;
    const pts = [
      [cx - 50, cy + 20 + bob], [cx + 50, cy + 20 + bob], [cx, cy - 40 + bob],
      [cx - 35, cy + 50], [cx + 35, cy + 50],
    ];
    const tris = [[0, 1, 2], [0, 1, 3], [1, 2, 4]];
    tris.forEach(([a, b, c]) => {
      ctx.beginPath();
      ctx.moveTo(pts[a][0], pts[a][1]);
      ctx.lineTo(pts[b][0], pts[b][1]);
      ctx.lineTo(pts[c][0], pts[c][1]);
      ctx.closePath();
      ctx.stroke();
    });
    pts.forEach(([x, y]) => {
      ctx.fillStyle = '#1565c0';
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  if (stageId === 'animation') {
    const angle = t;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    ctx.fillStyle = 'rgba(21, 101, 192, 0.35)';
    ctx.fillRect(-40, -30, 80, 60);
    ctx.strokeStyle = '#1565c0';
    ctx.strokeRect(-40, -30, 80, 60);
    ctx.restore();
    ctx.fillStyle = '#ef6c00';
    ctx.fillRect(12, 12, w - 24, 28);
    ctx.fillStyle = '#fff';
    ctx.font = '10px monospace';
    const kf = Math.floor((t % 6.28) / 1.57);
    ctx.fillText(`Keyframe ${kf + 1}/4  frame ${Math.floor(frame) % 48}`, 20, 30);
  }

  if (stageId === 'lighting') {
    ctx.fillStyle = 'rgba(21, 101, 192, 0.7)';
    ctx.beginPath();
    ctx.moveTo(cx, cy - 35);
    ctx.lineTo(cx + 45, cy + 35);
    ctx.lineTo(cx - 45, cy + 35);
    ctx.closePath();
    ctx.fill();
    const lg = ctx.createRadialGradient(cx - 30, cy - 50, 5, cx, cy, 90);
    lg.addColorStop(0, 'rgba(255, 235, 59, 0.5)');
    lg.addColorStop(1, 'transparent');
    ctx.fillStyle = lg;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#ffeb3b';
    ctx.font = '18px sans-serif';
    ctx.fillText('☀', cx - 55, cy - 45);
  }

  if (stageId === 'render') {
    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, '#1e3a5f');
    g.addColorStop(1, '#0f172a');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#ff9f43';
    ctx.beginPath();
    ctx.arc(cx, cy, 42, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.beginPath();
    ctx.ellipse(cx - 14, cy - 18, 16, 8, -0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.font = '11px monospace';
    ctx.fillText('Cycles · 128 samples', 8, h - 10);
  }
}
