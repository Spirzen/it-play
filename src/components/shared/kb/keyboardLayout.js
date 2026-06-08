/** Скан-коды PC/AT (Set 1) — для демо "аппаратный уровень". */
export const SCAN_CODES = {
  Escape: '0x01',
  F1: '0x3B',
  F5: '0x3F',
  F11: '0x57',
  F12: '0x58',
  Backquote: '0x29',
  Digit1: '0x02',
  Tab: '0x0F',
  KeyQ: '0x10',
  CapsLock: '0x3A',
  KeyA: '0x1E',
  ShiftLeft: '0x2A',
  KeyZ: '0x2C',
  ControlLeft: '0x1D',
  MetaLeft: '0xE0·5B',
  AltLeft: '0x38',
  Space: '0x39',
  AltRight: '0xE0·38',
  MetaRight: '0xE0·5C',
  ControlRight: '0xE0·1D',
  Enter: '0x1C',
  Backspace: '0x0E',
  Delete: '0xE0·53',
  ArrowUp: '0xE0·48',
  ArrowLeft: '0xE0·4B',
  ArrowDown: '0xE0·50',
  ArrowRight: '0xE0·4D',
  PrintScreen: '0xE0·37',
};

/** Ряды клавиш: w — ширина в условных единицах сетки. */
export const KEYBOARD_ROWS = [
  {
    zone: 'function',
    keys: [
      {id: 'Escape', label: 'Esc', w: 1},
      {id: '_gapFn', label: '', w: 0.5, gap: true},
      {id: 'F1', label: 'F1', w: 1},
      {id: 'F2', label: 'F2', w: 1},
      {id: 'F3', label: 'F3', w: 1},
      {id: 'F4', label: 'F4', w: 1},
      {id: 'F5', label: 'F5', w: 1},
      {id: 'F6', label: 'F6', w: 1},
      {id: 'F7', label: 'F7', w: 1},
      {id: 'F8', label: 'F8', w: 1},
      {id: 'F9', label: 'F9', w: 1},
      {id: 'F10', label: 'F10', w: 1},
      {id: 'F11', label: 'F11', w: 1},
      {id: 'F12', label: 'F12', w: 1},
      {id: 'PrintScreen', label: 'PrtSc', w: 1.25},
    ],
  },
  {
    zone: 'main',
    keys: [
      {id: 'Backquote', label: '`', w: 1},
      {id: 'Digit1', label: '1', w: 1},
      {id: 'Digit2', label: '2', w: 1},
      {id: 'Digit3', label: '3', w: 1},
      {id: 'Digit4', label: '4', w: 1},
      {id: 'Digit5', label: '5', w: 1},
      {id: 'Digit6', label: '6', w: 1},
      {id: 'Digit7', label: '7', w: 1},
      {id: 'Digit8', label: '8', w: 1},
      {id: 'Digit9', label: '9', w: 1},
      {id: 'Digit0', label: '0', w: 1},
      {id: 'Minus', label: '-', w: 1},
      {id: 'Equal', label: '=', w: 1},
      {id: 'Backspace', label: '⌫', w: 2},
    ],
  },
  {
    zone: 'main',
    keys: [
      {id: 'Tab', label: 'Tab', w: 1.5},
      {id: 'KeyQ', label: 'Q', w: 1},
      {id: 'KeyW', label: 'W', w: 1},
      {id: 'KeyE', label: 'E', w: 1},
      {id: 'KeyR', label: 'R', w: 1},
      {id: 'KeyT', label: 'T', w: 1},
      {id: 'KeyY', label: 'Y', w: 1},
      {id: 'KeyU', label: 'U', w: 1},
      {id: 'KeyI', label: 'I', w: 1},
      {id: 'KeyO', label: 'O', w: 1},
      {id: 'KeyP', label: 'P', w: 1},
      {id: 'BracketLeft', label: '[', w: 1},
      {id: 'BracketRight', label: ']', w: 1},
      {id: 'Backslash', label: '\\', w: 1.5},
    ],
  },
  {
    zone: 'main',
    keys: [
      {id: 'CapsLock', label: 'Caps', w: 1.75},
      {id: 'KeyA', label: 'A', w: 1},
      {id: 'KeyS', label: 'S', w: 1},
      {id: 'KeyD', label: 'D', w: 1},
      {id: 'KeyF', label: 'F', w: 1},
      {id: 'KeyG', label: 'G', w: 1},
      {id: 'KeyH', label: 'H', w: 1},
      {id: 'KeyJ', label: 'J', w: 1},
      {id: 'KeyK', label: 'K', w: 1},
      {id: 'KeyL', label: 'L', w: 1},
      {id: 'Semicolon', label: ';', w: 1},
      {id: 'Quote', label: "'", w: 1},
      {id: 'Enter', label: 'Enter', w: 2.25},
    ],
  },
  {
    zone: 'main',
    keys: [
      {id: 'ShiftLeft', label: '⇧', w: 2.25},
      {id: 'KeyZ', label: 'Z', w: 1},
      {id: 'KeyX', label: 'X', w: 1},
      {id: 'KeyC', label: 'C', w: 1},
      {id: 'KeyV', label: 'V', w: 1},
      {id: 'KeyB', label: 'B', w: 1},
      {id: 'KeyN', label: 'N', w: 1},
      {id: 'KeyM', label: 'M', w: 1},
      {id: 'Comma', label: ',', w: 1},
      {id: 'Period', label: '.', w: 1},
      {id: 'Slash', label: '/', w: 1},
      {id: 'ShiftRight', label: '⇧', w: 2.75},
    ],
  },
  {
    zone: 'modifiers',
    keys: [
      {id: 'ControlLeft', label: 'Ctrl', w: 1.25, mod: true},
      {id: 'MetaLeft', label: 'Win', w: 1.25, mod: true},
      {id: 'AltLeft', label: 'Alt', w: 1.25, mod: true},
      {id: 'Space', label: '', w: 6.25},
      {id: 'AltRight', label: 'Alt', w: 1.25, mod: true},
      {id: 'MetaRight', label: 'Win', w: 1.25, mod: true},
      {id: 'ControlRight', label: 'Ctrl', w: 1.25, mod: true},
    ],
  },
];

export const NAV_CLUSTER = [
  {
    zone: 'nav',
    keys: [
      {id: 'Insert', label: 'Ins', w: 1},
      {id: 'Delete', label: 'Del', w: 1},
      {id: 'Home', label: 'Home', w: 1},
      {id: 'End', label: 'End', w: 1},
    ],
  },
  {
    zone: 'nav',
    keys: [
      {id: 'PageUp', label: 'PgUp', w: 1},
      {id: 'PageDown', label: 'PgDn', w: 1},
      {id: '_gapNav', label: '', w: 2, gap: true},
    ],
  },
  {
    zone: 'nav',
    keys: [
      {id: '_gapNav2', label: '', w: 1, gap: true},
      {id: 'ArrowUp', label: '↑', w: 1},
      {id: '_gapNav3', label: '', w: 1, gap: true},
    ],
  },
  {
    zone: 'nav',
    keys: [
      {id: 'ArrowLeft', label: '←', w: 1},
      {id: 'ArrowDown', label: '↓', w: 1},
      {id: 'ArrowRight', label: '→', w: 1},
    ],
  },
];

export const ZONE_LABELS = {
  function: 'F1–F12',
  main: 'Основной блок',
  modifiers: 'Модификаторы',
  nav: 'Навигация',
};

/** Пресеты сочетаний по вариантам демо. */
export const SHORTCUT_PRESETS = {
  explorer: [
    {
      id: 'layout',
      keys: ['MetaLeft', 'Space'],
      label: 'Win + Пробел',
      action: 'Переключить раскладку (Windows)',
      hint: 'Физическая клавиша не меняется — меняется таблица в ОС.',
    },
    {
      id: 'copy',
      keys: ['ControlLeft', 'KeyC'],
      label: 'Ctrl + C',
      action: 'Копировать выделенное',
    },
    {
      id: 'paste',
      keys: ['ControlLeft', 'KeyV'],
      label: 'Ctrl + V',
      action: 'Вставить из буфера',
    },
    {
      id: 'alt-tab',
      keys: ['AltLeft', 'Tab'],
      label: 'Alt + Tab',
      action: 'Переключить окно',
    },
    {
      id: 'lock',
      keys: ['MetaLeft', 'KeyL'],
      label: 'Win + L',
      action: 'Заблокировать экран',
    },
    {
      id: 'screenshot',
      keys: ['MetaLeft', 'ShiftLeft', 'KeyS'],
      label: 'Win + Shift + S',
      action: 'Снимок области экрана',
    },
    {
      id: 'shift-arrows',
      keys: ['ShiftLeft', 'ArrowRight'],
      label: 'Shift + →',
      action: 'Выделить текст посимвольно',
    },
  ],
  internals: [
    {
      id: 'scan-a',
      keys: ['KeyA'],
      label: 'Клавиша A',
      action: 'Скан-код 0x1E — буква зависит от раскладки',
      scanFocus: 'KeyA',
    },
    {
      id: 'scan-enter',
      keys: ['Enter'],
      label: 'Enter',
      action: 'Скан-код 0x1C — новая строка или подтверждение',
      scanFocus: 'Enter',
    },
    {
      id: 'mods-copy',
      keys: ['ControlLeft', 'KeyC'],
      label: 'Ctrl + C',
      action: 'Модификатор + код клавиши → команда приложения',
    },
  ],
  windows: [
    {id: 'win-e', keys: ['MetaLeft', 'KeyE'], label: 'Win + E', action: 'Проводник'},
    {id: 'win-d', keys: ['MetaLeft', 'KeyD'], label: 'Win + D', action: 'Показать рабочий стол'},
    {id: 'win-l', keys: ['MetaLeft', 'KeyL'], label: 'Win + L', action: 'Блокировка сеанса'},
    {id: 'win-i', keys: ['MetaLeft', 'KeyI'], label: 'Win + I', action: 'Параметры Windows'},
    {id: 'alt-tab', keys: ['AltLeft', 'Tab'], label: 'Alt + Tab', action: 'Переключение окон'},
    {id: 'alt-f4', keys: ['AltLeft', 'F4'], label: 'Alt + F4', action: 'Закрыть окно'},
    {id: 'ctrl-c', keys: ['ControlLeft', 'KeyC'], label: 'Ctrl + C', action: 'Копировать'},
    {id: 'ctrl-v', keys: ['ControlLeft', 'KeyV'], label: 'Ctrl + V', action: 'Вставить'},
    {id: 'ctrl-z', keys: ['ControlLeft', 'KeyZ'], label: 'Ctrl + Z', action: 'Отменить действие'},
    {id: 'ctrl-shift-esc', keys: ['ControlLeft', 'ShiftLeft', 'Escape'], label: 'Ctrl + Shift + Esc', action: 'Диспетчер задач'},
    {id: 'win-shift-s', keys: ['MetaLeft', 'ShiftLeft', 'KeyS'], label: 'Win + Shift + S', action: 'Ножницы — выбор области'},
    {id: 'win-tab', keys: ['MetaLeft', 'Tab'], label: 'Win + Tab', action: 'Обзор задач'},
    {id: 'win-ctrl-d', keys: ['MetaLeft', 'ControlLeft', 'KeyD'], label: 'Win + Ctrl + D', action: 'Новый виртуальный рабочий стол'},
    {id: 'f2', keys: ['F2'], label: 'F2', action: 'Переименовать файл в проводнике'},
    {id: 'f5', keys: ['F5'], label: 'F5', action: 'Обновить окно'},
  ],
};

export const ALL_KEY_IDS = new Set(
  [...KEYBOARD_ROWS, ...NAV_CLUSTER].flatMap((row) =>
    row.keys.filter((k) => !k.gap).map((k) => k.id),
  ),
);

/** Нормализация code с физической клавиатуры. */
export function normalizeCode(code) {
  if (!code) return null;
  if (ALL_KEY_IDS.has(code)) return code;
  if (code === 'OSLeft' || code === 'OSRight') return code === 'OSLeft' ? 'MetaLeft' : 'MetaRight';
  return code;
}

export function modifiersFromEvent(e) {
  const ids = [];
  if (e.ctrlKey) {
    ids.push('ControlLeft');
  }
  if (e.altKey) {
    ids.push('AltLeft');
  }
  if (e.shiftKey) {
    ids.push('ShiftLeft');
  }
  if (e.metaKey) {
    ids.push('MetaLeft');
  }
  const code = normalizeCode(e.code);
  if (code && !ids.includes(code) && ALL_KEY_IDS.has(code)) {
    ids.push(code);
  }
  return ids;
}
