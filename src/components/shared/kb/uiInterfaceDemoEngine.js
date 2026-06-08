export const PALETTE_ROLES = [
  {id: 'primary', label: 'Основной', hex: '#1976d2'},
  {id: 'secondary', label: 'Второстепенный', hex: '#388e3c'},
  {id: 'accent', label: 'Акцентный', hex: '#ef6c00'},
  {id: 'neutral', label: 'Нейтральный', hex: '#757575'},
];

export const FONT_SAMPLES = [
  {id: 'sans', label: 'Sans-serif', family: 'Roboto, Helvetica, Arial, sans-serif', sample: 'Интерфейс и кнопки'},
  {id: 'serif', label: 'Serif', family: 'Georgia, "Times New Roman", serif', sample: 'Статьи и документы'},
  {id: 'mono', label: 'Monospace', family: 'Consolas, "Courier New", monospace', sample: 'const api = fetch(url);'},
];

export function hexToRgb(hex) {
  const normalized = hex.replace('#', '').trim();
  if (!/^[0-9a-fA-F]{6}$/.test(normalized)) {
    return null;
  }
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  return {r, g, b};
}

export function rgbToHex(r, g, b) {
  const clamp = (n) => Math.max(0, Math.min(255, Math.round(n)));
  return `#${[clamp(r), clamp(g), clamp(b)]
    .map((v) => v.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase()}`;
}

export const BREADCRUMB_TRAIL = [
  {label: 'Главная', href: '#'},
  {label: 'Каталог', href: '#'},
  {label: 'Ноутбуки', href: '#'},
  {label: 'ThinkPad X1', current: true},
];

export const NOTIFICATION_TYPES = [
  {id: 'info', label: 'Информация', tone: 'info'},
  {id: 'success', label: 'Успех', tone: 'success'},
  {id: 'warning', label: 'Предупреждение', tone: 'warning'},
  {id: 'error', label: 'Ошибка', tone: 'danger'},
];

export const UX_PAIRS = [
  {
    id: 'consistency',
    title: 'Согласованность',
    bad: 'Кнопки "Сохранить" и "save" в разных стилях на одной странице',
    good: 'Одинаковые подписи, размеры и цвета для однотипных действий',
  },
  {
    id: 'readability',
    title: 'Читаемость',
    bad: 'Серый текст 12px на светло-сером фоне',
    good: 'Контраст ≥ 4.5:1, основной текст 16px, line-height 1.5',
  },
  {
    id: 'feedback',
    title: 'Обратная связь',
    bad: 'Клик по кнопке без индикатора загрузки',
    good: 'Спиннер или "Сохранено" сразу после действия',
  },
  {
    id: 'minimalism',
    title: 'Минимализм',
    bad: 'Пять баннеров и три CTA на экране входа',
    good: 'Один главный сценарий и вторичные ссылки в меню',
  },
  {
    id: 'accessibility',
    title: 'Доступность',
    bad: 'Иконки без подписей и управление только мышью',
    good: 'aria-label, контраст, Tab-навигация и озвучка скринридером',
  },
];
