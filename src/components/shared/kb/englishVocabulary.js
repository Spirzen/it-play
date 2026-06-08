import planVocabulary from '@/data/englishPlanVocabulary.json';

export {planVocabulary};

export function normalizeTermKey(term) {
  return String(term || '')
    .trim()
    .toLowerCase();
}

/** Объединяет слова из таблицы статьи и учебного плана без дубликатов. */
export function mergeVocabulary(tableItems = [], planItems = planVocabulary) {
  const map = new Map();

  const add = (item, source) => {
    const term = item.term?.trim();
    const definition = item.definition?.trim();
    if (!term || !definition) {
      return;
    }
    const key = normalizeTermKey(term);
    const existing = map.get(key);
    if (existing) {
      if (!existing.category && item.category) {
        existing.category = item.category;
      }
      if (source === 'table') {
        existing.source = 'both';
      }
      return;
    }
    map.set(key, {
      term,
      definition,
      category: item.category || null,
      source,
    });
  };

  tableItems.forEach((item) => add(item, 'table'));
  planItems.forEach((item) => add(item, 'plan'));

  return Array.from(map.values()).sort((a, b) => a.term.localeCompare(b.term, 'en'));
}

export function shuffleArray(items) {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function pickQuizOptions(pool, correct, count = 4) {
  const unique = [];
  const seen = new Set();
  pool.forEach((item) => {
    const key = normalizeTermKey(item.term);
    if (seen.has(key)) {
      return;
    }
    seen.add(key);
    unique.push(item);
  });
  const distractors = shuffleArray(unique.filter((w) => w.term !== correct.term)).slice(
    0,
    Math.max(0, count - 1),
  );
  return shuffleArray([correct, ...distractors]);
}

/** Упрощённая проверка ввода перевода (без скобок и синонимов через /). */
export function matchTranslation(input, expected) {
  const norm = (s) =>
    s
      .toLowerCase()
      .replace(/\([^)]*\)/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  const a = norm(input);
  const b = norm(expected);
  if (!a || !b) {
    return false;
  }
  if (a === b) {
    return true;
  }
  const variants = b.split(/\s*\/\s*/).map((v) => v.trim()).filter(Boolean);
  return variants.some((v) => {
    if (a === v) {
      return true;
    }
    const minLen = 3;
    if (v.length >= minLen && a.length >= minLen) {
      return a.includes(v) || v.includes(a);
    }
    return false;
  });
}

export const CATEGORY_LABELS = {
  'Общие': 'Интерфейс и действия',
  'Уровень 1: Файловая система и управление данными': 'Файлы и данные',
  'Уровень 2: Периферия и внешние устройства': 'Периферия',
  'Уровень 3: Сеть и Интернет для пользователя': 'Сеть и браузер',
  'Уровень 4: Офис, продуктивность и мультимедиа': 'Офис и мультимедиа',
};

export function getCategoryLabel(category) {
  if (!category) {
    return 'IT-словарь';
  }
  return CATEGORY_LABELS[category] || category;
}
