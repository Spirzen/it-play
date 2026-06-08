/** Зоны пальцев и домашний ряд для TouchTypingFingerPlay (физические позиции QWERTY). */

export const FINGER_IDS = {
  lp: 'lp',
  lr: 'lr',
  lm: 'lm',
  li: 'li',
  rt: 'rt',
  ri: 'ri',
  rm: 'rm',
  rr: 'rr',
  rp: 'rp',
};

export const FINGER_META = {
  [FINGER_IDS.lp]: {label: 'Мизинец левой', short: 'Л миз', color: '#e57373'},
  [FINGER_IDS.lr]: {label: 'Безымянный левой', short: 'Л без', color: '#ffb74d'},
  [FINGER_IDS.lm]: {label: 'Средний левой', short: 'Л ср', color: '#fff176'},
  [FINGER_IDS.li]: {label: 'Указательный левой', short: 'Л указ', color: '#81c784'},
  [FINGER_IDS.rt]: {label: 'Большой (пробел)', short: 'Большой', color: '#90caf9'},
  [FINGER_IDS.ri]: {label: 'Указательный правой', short: 'П указ', color: '#4db6ac'},
  [FINGER_IDS.rm]: {label: 'Средний правой', short: 'П ср', color: '#64b5f6'},
  [FINGER_IDS.rr]: {label: 'Безымянный правой', short: 'П без', color: '#9575cd'},
  [FINGER_IDS.rp]: {label: 'Мизинец правой', short: 'П миз', color: '#f06292'},
};

/** Домашний ряд — физические id клавиш. */
export const HOME_ROW_KEYS = new Set([
  'KeyA',
  'KeyS',
  'KeyD',
  'KeyF',
  'KeyJ',
  'KeyK',
  'KeyL',
  'Semicolon',
]);

/** Тактильные метки на F и J. */
export const BUMP_KEYS = new Set(['KeyF', 'KeyJ']);

/** Русские буквы на тех же физических клавишах (ЙЦУКЕН). */
export const RU_LABELS = {
  KeyQ: 'й',
  KeyW: 'ц',
  KeyE: 'у',
  KeyR: 'к',
  KeyT: 'е',
  KeyY: 'н',
  KeyU: 'г',
  KeyI: 'ш',
  KeyO: 'щ',
  KeyP: 'з',
  KeyA: 'ф',
  KeyS: 'ы',
  KeyD: 'в',
  KeyF: 'а',
  KeyG: 'п',
  KeyH: 'р',
  KeyJ: 'о',
  KeyK: 'л',
  KeyL: 'д',
  Semicolon: 'ж',
  KeyZ: 'я',
  KeyX: 'ч',
  KeyC: 'с',
  KeyV: 'м',
  KeyB: 'и',
  KeyN: 'т',
  KeyM: 'ь',
  Comma: 'б',
  Period: 'ю',
  Space: 'пробел',
};

/** Палец → id клавиш (основной блок + пробел). */
export const KEY_FINGER_MAP = {
  Backquote: FINGER_IDS.lp,
  Digit1: FINGER_IDS.lp,
  Digit2: FINGER_IDS.lp,
  Tab: FINGER_IDS.lp,
  KeyQ: FINGER_IDS.lp,
  CapsLock: FINGER_IDS.lp,
  KeyA: FINGER_IDS.lp,
  ShiftLeft: FINGER_IDS.lp,
  KeyZ: FINGER_IDS.lp,
  ControlLeft: FINGER_IDS.lp,

  Digit3: FINGER_IDS.lr,
  KeyW: FINGER_IDS.lr,
  KeyS: FINGER_IDS.lr,
  KeyX: FINGER_IDS.lr,

  Digit4: FINGER_IDS.lm,
  KeyE: FINGER_IDS.lm,
  KeyD: FINGER_IDS.lm,
  KeyC: FINGER_IDS.lm,

  Digit5: FINGER_IDS.li,
  Digit6: FINGER_IDS.li,
  KeyR: FINGER_IDS.li,
  KeyT: FINGER_IDS.li,
  KeyF: FINGER_IDS.li,
  KeyG: FINGER_IDS.li,
  KeyV: FINGER_IDS.li,
  KeyB: FINGER_IDS.li,

  Space: FINGER_IDS.rt,

  Digit7: FINGER_IDS.ri,
  Digit8: FINGER_IDS.ri,
  KeyY: FINGER_IDS.ri,
  KeyU: FINGER_IDS.ri,
  KeyH: FINGER_IDS.ri,
  KeyJ: FINGER_IDS.ri,
  KeyN: FINGER_IDS.ri,
  KeyM: FINGER_IDS.ri,

  Digit9: FINGER_IDS.rm,
  KeyI: FINGER_IDS.rm,
  KeyK: FINGER_IDS.rm,
  Comma: FINGER_IDS.rm,

  Digit0: FINGER_IDS.rr,
  KeyO: FINGER_IDS.rr,
  KeyL: FINGER_IDS.rr,
  Period: FINGER_IDS.rr,

  Minus: FINGER_IDS.rp,
  Equal: FINGER_IDS.rp,
  KeyP: FINGER_IDS.rp,
  BracketLeft: FINGER_IDS.rp,
  BracketRight: FINGER_IDS.rp,
  Backslash: FINGER_IDS.rp,
  Semicolon: FINGER_IDS.rp,
  Quote: FINGER_IDS.rp,
  Slash: FINGER_IDS.rp,
  ShiftRight: FINGER_IDS.rp,
  Enter: FINGER_IDS.rp,
  Backspace: FINGER_IDS.rp,
};

/** Ряды для визуализации (упрощённый основной блок). */
export const TOUCH_TYPING_ROWS = [
  {
    keys: [
      {id: 'Digit1', en: '1', w: 1},
      {id: 'Digit2', en: '2', w: 1},
      {id: 'Digit3', en: '3', w: 1},
      {id: 'Digit4', en: '4', w: 1},
      {id: 'Digit5', en: '5', w: 1},
      {id: 'Digit6', en: '6', w: 1},
      {id: 'Digit7', en: '7', w: 1},
      {id: 'Digit8', en: '8', w: 1},
      {id: 'Digit9', en: '9', w: 1},
      {id: 'Digit0', en: '0', w: 1},
    ],
  },
  {
    keys: [
      {id: 'KeyQ', en: 'Q', w: 1},
      {id: 'KeyW', en: 'W', w: 1},
      {id: 'KeyE', en: 'E', w: 1},
      {id: 'KeyR', en: 'R', w: 1},
      {id: 'KeyT', en: 'T', w: 1},
      {id: 'KeyY', en: 'Y', w: 1},
      {id: 'KeyU', en: 'U', w: 1},
      {id: 'KeyI', en: 'I', w: 1},
      {id: 'KeyO', en: 'O', w: 1},
      {id: 'KeyP', en: 'P', w: 1},
    ],
  },
  {
    home: true,
    keys: [
      {id: 'KeyA', en: 'A', w: 1},
      {id: 'KeyS', en: 'S', w: 1},
      {id: 'KeyD', en: 'D', w: 1},
      {id: 'KeyF', en: 'F', w: 1},
      {id: 'KeyG', en: 'G', w: 1},
      {id: 'KeyH', en: 'H', w: 1},
      {id: 'KeyJ', en: 'J', w: 1},
      {id: 'KeyK', en: 'K', w: 1},
      {id: 'KeyL', en: 'L', w: 1},
      {id: 'Semicolon', en: ';', w: 1},
    ],
  },
  {
    keys: [
      {id: 'KeyZ', en: 'Z', w: 1},
      {id: 'KeyX', en: 'X', w: 1},
      {id: 'KeyC', en: 'C', w: 1},
      {id: 'KeyV', en: 'V', w: 1},
      {id: 'KeyB', en: 'B', w: 1},
      {id: 'KeyN', en: 'N', w: 1},
      {id: 'KeyM', en: 'M', w: 1},
      {id: 'Comma', en: ',', w: 1},
      {id: 'Period', en: '.', w: 1},
      {id: 'Slash', en: '/', w: 1},
    ],
  },
  {
    keys: [{id: 'Space', en: 'Пробел', w: 10}],
  },
];

export const DRILL_KEYS = TOUCH_TYPING_ROWS.flatMap((row) =>
  row.keys.filter((k) => k.id !== 'Space').map((k) => k.id),
);

export function fingerForKey(keyId) {
  return KEY_FINGER_MAP[keyId] ?? null;
}

export function labelForKey(keyId, layout = 'ru') {
  if (keyId === 'Space') return 'Пробел';
  if (layout === 'ru' && RU_LABELS[keyId]) return RU_LABELS[keyId];
  const row = TOUCH_TYPING_ROWS.flatMap((r) => r.keys).find((k) => k.id === keyId);
  return row?.en ?? keyId;
}
