/** Тексты и расчёт скорости печати для TypingSpeedTrainerPlay. */

import {TYPING_ENGLISH_PRESETS} from './typingSpeedEnglishPresets';
import {TYPING_HARD_PRESETS} from './typingSpeedHardPresets';

export {TYPING_ENGLISH_PRESETS, TYPING_HARD_PRESETS};

export const TYPING_CATALOGS = [
  {id: 'basic', label: 'Базовые'},
  {id: 'hard', label: 'Сложные'},
  {id: 'english', label: 'Английские'},
];

export const TYPING_DURATIONS = [
  {id: '30', label: '30 сек', seconds: 30},
  {id: '60', label: '1 мин', seconds: 60},
  {id: 'text', label: 'До конца текста', seconds: null},
];

export const TYPING_PRESETS = [
  {
    id: 'basics',
    label: 'Базовый',
    hint: 'Короткая фраза для первой пробы',
    text:
      'Компьютер помогает учиться, работать и общаться. Набирайте текст спокойно, без спешки.',
  },
  {
    id: 'keyboard',
    label: 'Клавиатура',
    hint: 'Термины из главы про клавиатуру',
    text:
      'Клавиатура передаёт скан-код клавиши. Раскладка в системе решает, какая буква появится на экране.',
  },
  {
    id: 'windows',
    label: 'Windows',
    hint: 'Горячие клавиши и привычные действия',
    text:
      'Сочетание Win плюс E открывает проводник. Alt Tab переключает окна. Ctrl C копирует выделенный текст.',
  },
  {
    id: 'it',
    label: 'IT-лексика',
    hint: 'Слова из повседневной работы в IT',
    text:
      'Пароль, резервная копия и обновления системы защищают данные. Не скачивайте программы с сомнительных сайтов.',
  },
  {
    id: 'homerow',
    label: 'Домашний ряд',
    hint: 'ЙЦУКЕН: ф ы в а · о л д ж — включите русскую раскладку',
    text: 'фыва олдж фыва олдж дав лов род фад лад',
  },
  {
    id: 'touch',
    label: 'Слепая печать',
    hint: 'Длиннее — для замера после освоения домашнего ряда',
    text:
      'Скорость и точность растут от регулярной практики. Печатайте не глядя на клавиши, только на экран. Ошибки исправляйте сразу, но не останавливайтесь.',
  },
];

/** Уровни для ориентира (знаков в минуту, чистый набор). */
export const TYPING_LEVELS = [
  {id: 'start', label: 'Старт', minCpm: 0, maxCpm: 120},
  {id: 'base', label: 'Базовый', minCpm: 120, maxCpm: 180},
  {id: 'good', label: 'Уверенный', minCpm: 180, maxCpm: 250},
  {id: 'fast', label: 'Быстрый', minCpm: 250, maxCpm: 320},
  {id: 'pro', label: 'Продвинутый', minCpm: 320, maxCpm: Infinity},
];

const CHARS_PER_WORD = 5;

/** Дефис с клавиатуры и типографские тире считаем одним знаком. */
const DASH_CHARS = new Set(['-', '–', '—', '−']);

function typingCharsMatch(expected, actual) {
  if (actual === expected) return true;
  return DASH_CHARS.has(expected) && DASH_CHARS.has(actual);
}

export function getPresetsForCatalog(catalogId) {
  if (catalogId === 'hard') return TYPING_HARD_PRESETS;
  if (catalogId === 'english') return TYPING_ENGLISH_PRESETS;
  return TYPING_PRESETS;
}

export function getPresetById(id, catalogId = 'basic') {
  const list = getPresetsForCatalog(catalogId);
  return list.find((p) => p.id === id) ?? list[0];
}

export function getDurationById(id) {
  return TYPING_DURATIONS.find((d) => d.id === id) ?? TYPING_DURATIONS[1];
}

/** Сравнение посимвольно: позиция, ошибки, "лишние" символы после конца эталона. */
export function analyzeTyping(target, typed) {
  const len = Math.max(target.length, typed.length);
  let correct = 0;
  let errors = 0;
  const marks = [];

  for (let i = 0; i < len; i += 1) {
    const expected = target[i];
    const actual = typed[i];

    if (expected === undefined) {
      errors += 1;
      marks.push({state: 'extra'});
      continue;
    }
    if (actual === undefined) {
      marks.push({state: 'pending'});
      continue;
    }
    if (typingCharsMatch(expected, actual)) {
      correct += 1;
      marks.push({state: 'ok'});
    } else {
      errors += 1;
      marks.push({state: 'err'});
    }
  }

  return {correct, errors, marks, completed: typed.length >= target.length};
}

export function calcTypingStats({elapsedMs, correct, errors, targetLength}) {
  const minutes = Math.max(elapsedMs / 60000, 1 / 60000);
  const cpm = Math.round(correct / minutes);
  const wpm = Math.round(correct / CHARS_PER_WORD / minutes);
  const accuracy =
    targetLength > 0
      ? Math.round((correct / Math.max(correct + errors, 1)) * 100)
      : 100;

  return {cpm, wpm, accuracy, minutes: elapsedMs / 60000};
}

export function levelForCpm(cpm) {
  return (
    TYPING_LEVELS.find((l) => cpm >= l.minCpm && cpm < l.maxCpm) ??
    TYPING_LEVELS[TYPING_LEVELS.length - 1]
  );
}

export function formatDuration(seconds) {
  const s = Math.max(0, Math.ceil(seconds));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return m > 0 ? `${m}:${String(r).padStart(2, '0')}` : `${r} с`;
}
