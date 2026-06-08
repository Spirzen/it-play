/** Параметры сцены "логотип" для сравнения растра и вектора */
export const SCENE_SIZE = 120;

export const ZOOM_STOPS = [
  {id: '1', label: '100%', value: 1},
  {id: '2', label: '200%', value: 2},
  {id: '3', label: '400%', value: 4},
  {id: '4', label: '800%', value: 8},
];

/** Рисует ту же композицию на canvas (растр фиксированного разрешения) */
export function drawRasterScene(ctx, size = SCENE_SIZE) {
  const bg = getComputedStyle(document.documentElement)
    .getPropertyValue('--ifm-background-color')
    .trim() || '#ffffff';
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, size, size);

  ctx.fillStyle = '#1976d2';
  ctx.fillRect(18, 52, 84, 28);

  ctx.beginPath();
  ctx.arc(60, 42, 22, 0, Math.PI * 2);
  ctx.fillStyle = '#ef6c00';
  ctx.fill();

  ctx.strokeStyle = '#1a237e';
  ctx.lineWidth = 3;
  ctx.strokeRect(18, 52, 84, 28);
}

export function rasterPixelCount(size = SCENE_SIZE) {
  return size * size;
}

export function describeRasterAtZoom(zoom, size = SCENE_SIZE) {
  const displayPx = Math.round(size * zoom);
  const nativePx = size;
  if (zoom <= 1) {
    return `Сетка ${nativePx}×${nativePx} пикселей — каждая точка закодирована в файле.`;
  }
  return `При увеличении ${Math.round(zoom * 100)}% браузер интерполирует ${nativePx}×${nativePx} → ${displayPx}×${displayPx}: появляются "лесенки".`;
}

export function describeVectorAtZoom(zoom) {
  return `Кривые и прямоугольники пересчитываются при каждом масштабе (${Math.round(zoom * 100)}%) — границы остаются гладкими до растрирования на экране.`;
}
