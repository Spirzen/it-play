/** Данные для визуальных эмуляторов платформ (статьи PC / PS / Nintendo / Xbox). */

export const STEAM_NAV = [
  {id: 'library', label: 'Библиотека', icon: '▦'},
  {id: 'store', label: 'Магазин', icon: '🛒'},
  {id: 'community', label: 'Сообщество', icon: '👥'},
  {id: 'downloads', label: 'Загрузки', icon: '↓'},
];

export const STEAM_GAMES = [
  {id: 'hl', title: 'Half-Life 2', hours: '142 ч', status: 'play', accent: '#ff7b00'},
  {id: 'cs', title: 'Counter-Strike 2', hours: '890 ч', status: 'play', accent: '#de9b35'},
  {id: 'bg3', title: "Baldur's Gate 3", hours: '—', status: 'install', accent: '#7c3aed'},
  {id: 'hades', title: 'Hades II', hours: '12 ч', status: 'play', accent: '#dc2626'},
];

export const STEAM_VIEWS = {
  library: {
    headline: 'Библиотека',
    hint: 'Локальные установки, Cloud Saves, Steam Overlay (Shift+Tab).',
  },
  store: {
    headline: 'Магазин',
    hint: 'Витрина, отзывы, wishlist — комиссия платформы 20–30%.',
  },
  community: {
    headline: 'Сообщество',
    hint: 'Профили, достижения, обсуждения и Workshop.',
  },
  downloads: {
    headline: 'Загрузки',
    hint: 'Очередь обновлений, Proton для Linux-сборок.',
  },
};

export const XBOX_MODELS = [
  {
    id: 'seriesX',
    label: 'Series X',
    shape: 'cube',
    color: '#1a1a1a',
    accent: '#107c10',
    spec: '12 TFLOPS · 1 TB SSD · 4K/60',
    vent: 'top-grid',
  },
  {
    id: 'seriesS',
    label: 'Series S',
    shape: 'slim',
    color: '#e8e8e8',
    accent: '#107c10',
    spec: '4 TFLOPS · 512 GB · 1440p/60',
    vent: 'side-slot',
  },
];

export const SWITCH_MODES = [
  {id: 'handheld', label: 'Портатив', screen: 'built-in'},
  {id: 'docked', label: 'Док-станция', screen: 'tv'},
];

export const PS5_FEATURES = [
  {id: 'disc', label: 'Ultra HD Blu-ray', on: true},
  {id: 'ssd', label: 'SSD 825 GB', on: true},
  {id: 'ray', label: 'Ray tracing', on: true},
  {id: 'haptic', label: 'DualSense haptic', on: true},
];
