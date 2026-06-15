export const INITIAL_ITEMS = ['🍔', '🍟', '🥤'];
export const DEMO_ITEM = '🍕';
export const SEARCH_ITEM = '🍟';
export const CONTAINS_ITEM = '🥤';
export const RANGE_START = 0;
export const RANGE_COUNT = 2;

export const COLLECTION_LANG_TABS = [
  {id: 'general', label: 'Общее'},
  {id: 'js', label: 'JS'},
  {id: 'ts', label: 'TS'},
  {id: 'py', label: 'Python'},
  {id: 'java', label: 'Java'},
  {id: 'cs', label: 'C#'},
  {id: 'kotlin', label: 'Kotlin'},
];

const METHOD_IDS = [
  'add',
  'insert',
  'indexOf',
  'reverse',
  'contains',
  'remove',
  'removeAt',
  'clear',
  'getRange',
];

function idxOf(items, item) {
  return items.indexOf(item);
}

function formatList(items) {
  if (!items.length) return '∅';
  return `[${items.join(', ')}]`;
}

export function resolveCollectionLang(requested) {
  const ids = COLLECTION_LANG_TABS.map((t) => t.id);
  if (requested && ids.includes(requested)) return requested;
  return 'general';
}

function labelFor(lang, id, items) {
  const i1 = 1;
  const i0 = 0;
  const friesIdx = idxOf(items, SEARCH_ITEM);
  const removeIdx = friesIdx >= 0 ? friesIdx : 1;

  const labels = {
    add: {
      general: `ДОБАВИТЬ(${DEMO_ITEM})`,
      js: `.push(${DEMO_ITEM})`,
      ts: `.push(${DEMO_ITEM})`,
      py: `.append(${DEMO_ITEM})`,
      java: `.add(${DEMO_ITEM})`,
      cs: `.Add(${DEMO_ITEM})`,
      kotlin: `.add(${DEMO_ITEM})`,
    },
    insert: {
      general: `ВСТАВИТЬ(${i1}, ${DEMO_ITEM})`,
      js: `.splice(${i1}, 0, ${DEMO_ITEM})`,
      ts: `.splice(${i1}, 0, ${DEMO_ITEM})`,
      py: `.insert(${i1}, ${DEMO_ITEM})`,
      java: `.add(${i1}, ${DEMO_ITEM})`,
      cs: `.Insert(${i1}, ${DEMO_ITEM})`,
      kotlin: `.add(${i1}, ${DEMO_ITEM})`,
    },
    indexOf: {
      general: `ИНДЕКС(${SEARCH_ITEM})`,
      js: `.indexOf(${SEARCH_ITEM})`,
      ts: `.indexOf(${SEARCH_ITEM})`,
      py: `.index(${SEARCH_ITEM})`,
      java: `.indexOf(${SEARCH_ITEM})`,
      cs: `.IndexOf(${SEARCH_ITEM})`,
      kotlin: `.indexOf(${SEARCH_ITEM})`,
    },
    reverse: {
      general: 'ПЕРЕВЕРНУТЬ()',
      js: '.reverse()',
      ts: '.reverse()',
      py: '.reverse()',
      java: 'Collections.reverse(list)',
      cs: '.Reverse()',
      kotlin: '.reverse()',
    },
    contains: {
      general: `СОДЕРЖИТ(${CONTAINS_ITEM})`,
      js: `.includes(${CONTAINS_ITEM})`,
      ts: `.includes(${CONTAINS_ITEM})`,
      py: `${CONTAINS_ITEM} in list`,
      java: `.contains(${CONTAINS_ITEM})`,
      cs: `.Contains(${CONTAINS_ITEM})`,
      kotlin: `.contains(${CONTAINS_ITEM})`,
    },
    remove: {
      general: `УДАЛИТЬ(${SEARCH_ITEM})`,
      js: `.splice(${removeIdx}, 1)`,
      ts: `.splice(${removeIdx}, 1)`,
      py: `.remove(${SEARCH_ITEM})`,
      java: `.remove(${SEARCH_ITEM})`,
      cs: `.Remove(${SEARCH_ITEM})`,
      kotlin: `.remove(${SEARCH_ITEM})`,
    },
    removeAt: {
      general: `УДАЛИТЬПО(${i0})`,
      js: `.splice(${i0}, 1)`,
      ts: `.splice(${i0}, 1)`,
      py: `del list[${i0}]`,
      java: `.remove(${i0})`,
      cs: `.RemoveAt(${i0})`,
      kotlin: `.removeAt(${i0})`,
    },
    clear: {
      general: 'ОЧИСТИТЬ()',
      js: '.length = 0',
      ts: '.length = 0',
      py: '.clear()',
      java: '.clear()',
      cs: '.Clear()',
      kotlin: '.clear()',
    },
    getRange: {
      general: `ПОЛУЧИТЬДИАПАЗОН(${RANGE_START}, ${RANGE_COUNT})`,
      js: `.slice(${RANGE_START}, ${RANGE_START + RANGE_COUNT})`,
      ts: `.slice(${RANGE_START}, ${RANGE_START + RANGE_COUNT})`,
      py: `list[${RANGE_START}:${RANGE_START + RANGE_COUNT}]`,
      java: `.subList(${RANGE_START}, ${RANGE_START + RANGE_COUNT})`,
      cs: `.GetRange(${RANGE_START}, ${RANGE_COUNT})`,
      kotlin: `.subList(${RANGE_START}, ${RANGE_START + RANGE_COUNT})`,
    },
  };

  return labels[id]?.[lang] ?? labels[id]?.general ?? id;
}

export function getMethodDefinitions(lang, items = INITIAL_ITEMS) {
  return METHOD_IDS.map((id) => ({
    id,
    label: labelFor(lang, id, items),
    hint: METHOD_HINTS[id],
  }));
}

const METHOD_HINTS = {
  add: 'Добавить элемент в конец',
  insert: 'Вставить по индексу, сдвинув остальные',
  indexOf: 'Найти индекс первого вхождения',
  reverse: 'Развернуть порядок элементов',
  contains: 'Проверить наличие элемента',
  remove: 'Удалить первое вхождение',
  removeAt: 'Удалить элемент по индексу',
  clear: 'Удалить все элементы',
  getRange: 'Взять подпоследовательность (не меняет исходник)',
};

export function applyCollectionMethod(methodId, items) {
  const list = [...items];

  switch (methodId) {
    case 'add':
      return {
        items: [...list, DEMO_ITEM],
        result: null,
        mutates: true,
        summary: `→ ${formatList([...list, DEMO_ITEM])}`,
      };
    case 'insert': {
      const next = [...list];
      next.splice(1, 0, DEMO_ITEM);
      return {items: next, result: null, mutates: true, summary: `→ ${formatList(next)}`};
    }
    case 'indexOf': {
      const idx = list.indexOf(SEARCH_ITEM);
      return {
        items: list,
        result: idx,
        resultType: 'scalar',
        mutates: false,
        summary: `→ ${idx}`,
      };
    }
    case 'reverse': {
      const next = [...list].reverse();
      return {items: next, result: null, mutates: true, summary: `→ ${formatList(next)}`};
    }
    case 'contains': {
      const ok = list.includes(CONTAINS_ITEM);
      return {
        items: list,
        result: ok,
        resultType: 'boolean',
        mutates: false,
        summary: `→ ${ok}`,
      };
    }
    case 'remove': {
      const idx = list.indexOf(SEARCH_ITEM);
      if (idx < 0) {
        return {
          items: list,
          result: null,
          mutates: false,
          error: `${SEARCH_ITEM} не найден`,
          summary: 'элемент отсутствует',
        };
      }
      const next = [...list];
      next.splice(idx, 1);
      return {items: next, result: null, mutates: true, summary: `→ ${formatList(next)}`};
    }
    case 'removeAt': {
      if (!list.length) {
        return {items: list, result: null, mutates: false, error: 'Список пуст', summary: 'нельзя удалить'};
      }
      const next = [...list];
      next.splice(0, 1);
      return {items: next, result: null, mutates: true, summary: `→ ${formatList(next)}`};
    }
    case 'clear':
      return {items: [], result: null, mutates: true, summary: '→ ∅'};
    case 'getRange': {
      const slice = list.slice(RANGE_START, RANGE_START + RANGE_COUNT);
      return {
        items: list,
        result: slice,
        resultType: 'list',
        mutates: false,
        summary: `→ ${formatList(slice)}`,
      };
    }
    default:
      return {items: list, result: null, mutates: false, summary: ''};
  }
}

export function canApplyMethod(methodId, items) {
  if (methodId === 'remove' && items.indexOf(SEARCH_ITEM) < 0) return false;
  if (methodId === 'removeAt' && items.length === 0) return false;
  if (methodId === 'getRange' && items.length < RANGE_COUNT) return false;
  if (methodId === 'indexOf' && items.indexOf(SEARCH_ITEM) < 0) return false;
  return true;
}
