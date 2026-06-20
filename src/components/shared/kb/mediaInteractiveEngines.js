export function nyquistFrequency(sampleRate) {
  return sampleRate / 2;
}

export function isAliasing(signalMaxHz, sampleRate) {
  return signalMaxHz > nyquistFrequency(sampleRate);
}

export function pcmBitrate(sampleRate, bitDepth, channels) {
  return sampleRate * bitDepth * channels;
}

export function formatMbps(bps) {
  return `${(bps / 1_000_000).toFixed(2)} Мбит/с`;
}

export function formatMB(bytes) {
  if (bytes >= 1_048_576) return `${(bytes / 1_048_576).toFixed(1)} МБ`;
  return `${(bytes / 1024).toFixed(0)} КБ`;
}

/** @param {'h264'|'h265'|'av1'|'vp9'} codec */
export function estimateVideoBitrate(width, height, fps, codec) {
  const pixels = width * height * fps;
  const factors = {h264: 0.08, h265: 0.05, av1: 0.04, vp9: 0.055};
  const kbps = Math.round((pixels * (factors[codec] ?? 0.07)) / 1000);
  return Math.max(500, Math.min(kbps, 50000));
}

export function codecQualityLoss(codec, bitrateKbps) {
  const ref = {mp3_128: 62, aac_128: 74, opus_96: 78, flac: 100};
  const key = codec;
  const base = ref[key] ?? 70;
  const boost = Math.min(20, Math.floor(bitrateKbps / 32));
  return Math.min(100, base + boost);
}

export function rawPixelBytes(width, height, bpp) {
  return width * height * (bpp / 8);
}

export const GPU_PIPELINE_STEPS = [
  {id: 'geo', label: 'Вершины', detail: 'Модельные → мировые → видовые координаты'},
  {id: 'rast', label: 'Растеризация', detail: 'Треугольники → фрагменты (пиксели)'},
  {id: 'frag', label: 'Фрагментный шейдер', detail: 'Цвет, текстуры, освещение'},
  {id: 'test', label: 'Тесты глубины', detail: 'Z-buffer, отсечение невидимого'},
  {id: 'blend', label: 'Композитинг', detail: 'Альфа, постобработка, вывод в framebuffer'},
];

export const FPS_OPERATIONS = [
  {id: 'logic', label: 'Игровая логика', ms: 2.5},
  {id: 'physics', label: 'Физика', ms: 3},
  {id: 'cull', label: 'Отсечение / culling', ms: 1.2},
  {id: 'draw', label: 'Draw calls', ms: 4},
  {id: 'post', label: 'Постобработка', ms: 2.8},
  {id: 'ui', label: 'UI overlay', ms: 1.5},
];

export function fpsFromBudget(totalMs, frameBudget = 16.7) {
  if (totalMs <= 0) return 60;
  return Math.min(240, Math.round(1000 / Math.max(totalMs, 0.5)));
}

export const COLOR_SPACES = [
  {id: 'srgb', label: 'sRGB', gamut: 100, note: 'Стандарт веба и большинства мониторов'},
  {id: 'p3', label: 'Display P3', gamut: 125, note: 'Шире по зелёному и красному — Mac, iPhone, HDR-дисплеи'},
  {id: 'rec2020', label: 'Rec. 2020', gamut: 155, note: 'UHD/HDR контент, редко в быту'},
];
