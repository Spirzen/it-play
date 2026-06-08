/** Учебная модель таблицы и B-tree-подобного индекса для визуализации планов запросов. */

export const USERS_TABLE = [
  {id: 1, email: 'anna@corp.ru', age: 28, name: 'Anna'},
  {id: 2, email: 'boris@corp.ru', age: 34, name: 'Boris'},
  {id: 3, email: 'clara@mail.com', age: 22, name: 'Clara'},
  {id: 4, email: 'dmitry@corp.ru', age: 41, name: 'Dmitry'},
  {id: 5, email: 'elena@corp.ru', age: 29, name: 'Elena'},
  {id: 6, email: 'foma@mail.com', age: 19, name: 'Foma'},
  {id: 7, email: 'gala@corp.ru', age: 36, name: 'Gala'},
  {id: 8, email: 'ivan@corp.ru', age: 31, name: 'Ivan'},
  {id: 9, email: 'julia@mail.com', age: 27, name: 'Julia'},
  {id: 10, email: 'kira@corp.ru', age: 45, name: 'Kira'},
  {id: 11, email: 'leon@corp.ru', age: 33, name: 'Leon'},
  {id: 12, email: 'mila@mail.com', age: 24, name: 'Mila'},
];

export const INDEX_TYPES = [
  {id: 'none', label: 'Без индекса', columns: []},
  {id: 'email', label: 'idx_email (email)', columns: ['email']},
  {id: 'age', label: 'idx_age (age)', columns: ['age']},
  {id: 'composite', label: 'idx_email_age (email, age)', columns: ['email', 'age']},
];

export const QUERY_PRESETS = [
  {
    id: 'eq_email',
    label: 'Поиск по email',
    sql: "SELECT * FROM users WHERE email = 'boris@corp.ru';",
    predicate: {column: 'email', op: 'eq', value: 'boris@corp.ru'},
  },
  {
    id: 'range_age',
    label: 'Диапазон по age',
    sql: 'SELECT * FROM users WHERE age > 30;',
    predicate: {column: 'age', op: 'gt', value: 30},
  },
  {
    id: 'like_email',
    label: "LIKE '%@corp.ru'",
    sql: "SELECT * FROM users WHERE email LIKE '%@corp.ru';",
    predicate: {column: 'email', op: 'endsWith', value: '@corp.ru'},
    note: 'Ведущий % — B-tree не используется, нужен Seq Scan.',
  },
  {
    id: 'composite_age_only',
    label: 'Только age при составном индексе',
    sql: 'SELECT * FROM users WHERE age > 35;',
    predicate: {column: 'age', op: 'gt', value: 35},
    note: 'Индекс (email, age) не помогает без условия по первому столбцу.',
    requiresComposite: true,
  },
];

function compareKeys(a, b) {
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  return String(a).localeCompare(String(b), 'ru');
}

function rowKey(row, columns) {
  if (columns.length === 1) return row[columns[0]];
  return columns.map((c) => row[c]).join('|');
}

export function buildIndexEntries(table, columns) {
  return [...table]
    .map((row) => ({
      key: rowKey(row, columns),
      rowId: row.id,
      label: columns.length === 1 ? String(row[columns[0]]) : columns.map((c) => row[c]).join(' · '),
    }))
    .sort((a, b) => compareKeys(a.key, b.key));
}

function matchesPredicate(row, predicate) {
  const v = row[predicate.column];
  switch (predicate.op) {
    case 'eq':
      return v === predicate.value;
    case 'gt':
      return v > predicate.value;
    case 'endsWith':
      return String(v).endsWith(predicate.value);
    default:
      return false;
  }
}

/** Может ли оптимизатор использовать данный индекс для предиката. */
export function indexUsable(indexColumns, predicate, presetId) {
  if (!indexColumns.length) return false;
  if (predicate.op === 'endsWith') return false;
  if (indexColumns.length === 1) return indexColumns[0] === predicate.column;
  if (presetId === 'composite_age_only') return false;
  if (predicate.column === 'email') return true;
  if (predicate.column === 'age' && indexColumns[0] === 'email') {
    return false;
  }
  return indexColumns.includes(predicate.column);
}

function indexProbe(entries, predicate) {
  if (predicate.op === 'eq') {
    const idx = entries.findIndex((e) => {
      const row = USERS_TABLE.find((r) => r.id === e.rowId);
      return row && row[predicate.column] === predicate.value;
    });
    const examined = idx === -1 ? Math.ceil(Math.log2(entries.length + 1)) + 1 : idx + 1;
    return {examined, hits: idx === -1 ? [] : [entries[idx].rowId]};
  }
  if (predicate.op === 'gt') {
    const first = entries.findIndex((e) => {
      const row = USERS_TABLE.find((r) => r.id === e.rowId);
      return row && row[predicate.column] > predicate.value;
    });
    if (first === -1) return {examined: Math.ceil(Math.log2(entries.length + 1)), hits: []};
    const slice = entries.slice(first);
    const hits = slice
      .map((e) => USERS_TABLE.find((r) => r.id === e.rowId))
      .filter((r) => r && matchesPredicate(r, predicate))
      .map((r) => r.id);
    return {examined: first + 2, hits};
  }
  return {examined: entries.length, hits: []};
}

export function simulateQuery(table, indexType, predicate, presetId) {
  const matched = table.filter((r) => matchesPredicate(r, predicate));
  const usable = indexUsable(indexType.columns, predicate, presetId);

  if (!usable) {
    return {
      plan: 'Seq Scan',
      planRu: 'Полное сканирование таблицы',
      effective: false,
      rowsExamined: table.length,
      rowsReturned: matched.length,
      relativeCost: table.length,
      indexPath: [],
      scannedRowIds: table.map((r) => r.id),
      matchedRowIds: matched.map((r) => r.id),
      hint:
        predicate.op === 'endsWith'
          ? 'Паттерн с ведущим % не сопоставляется с отсортированным B-tree.'
          : indexType.columns.length > 1
            ? 'Составной индекс работает по левому префиксу: сначала email, потом age.'
            : 'Нет подходящего индекса по столбцу в WHERE — читаются все строки.',
    };
  }

  const entries = buildIndexEntries(table, indexType.columns);
  const {examined, hits} = indexProbe(entries, predicate);
  const hitSet = new Set(hits);

  return {
    plan: 'Index Scan',
    planRu: 'Поиск по индексу (B-tree)',
    effective: true,
    rowsExamined: Math.max(examined, hits.length || 1),
    rowsReturned: matched.length,
    relativeCost: Math.max(2, examined),
    indexPath: entries.slice(0, Math.min(entries.length, examined + 2)).map((e) => ({
      ...e,
      active: hitSet.has(e.rowId) || examined <= entries.indexOf(e) + 1,
    })),
    scannedRowIds: hits,
    matchedRowIds: matched.map((r) => r.id),
    hint: 'Индекс отсортирован по ключу — СУБД пропускает нерелевантные страницы таблицы.',
  };
}

export function simulateInsert(indexType, rowCount = 1) {
  const base = 1;
  const indexPenalty = indexType.columns.length * 2 * rowCount;
  return {
    tableWrites: rowCount,
    indexWrites: indexType.columns.length ? indexType.columns.length * rowCount : 0,
    relativeCost: base + indexPenalty,
    hint: indexType.columns.length
      ? `Каждый INSERT обновляет ${indexType.columns.length} индекс(а) — запись замедляется.`
      : 'Без индексов запись только в таблицу — быстрее, но SELECT по столбцу медленнее.',
  };
}
