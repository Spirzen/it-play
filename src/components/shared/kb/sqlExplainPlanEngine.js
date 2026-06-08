/** Учебная модель плана выполнения для orders WHERE customer_id = ? */

export const ORDERS_TABLE = [
  {rowid: 1, order_id: 1001, customer_id: 101, customer_name: 'ООО Альфа', order_total: 12000},
  {rowid: 2, order_id: 1002, customer_id: 123, customer_name: 'Иванов И.', order_total: 4500},
  {rowid: 3, order_id: 1003, customer_id: 205, customer_name: 'Петров П.', order_total: 8900},
  {rowid: 4, order_id: 1004, customer_id: 123, customer_name: 'Иванов И.', order_total: 2100},
  {rowid: 5, order_id: 1005, customer_id: 88, customer_name: 'Сидоров С.', order_total: 15600},
  {rowid: 6, order_id: 1006, customer_id: 123, customer_name: 'Иванов И.', order_total: 7800},
  {rowid: 7, order_id: 1007, customer_id: 301, customer_name: 'Козлова К.', order_total: 3200},
  {rowid: 8, order_id: 1008, customer_id: 123, customer_name: 'Иванов И.', order_total: 990},
  {rowid: 9, order_id: 1009, customer_id: 123, customer_name: 'Иванов И.', order_total: 5400},
  {rowid: 10, order_id: 1010, customer_id: 44, customer_name: 'Никитин Н.', order_total: 1100},
  {rowid: 11, order_id: 1011, customer_id: 123, customer_name: 'Иванов И.', order_total: 6700},
  {rowid: 12, order_id: 1012, customer_id: 177, customer_name: 'Орлова О.', order_total: 4300},
];

export const TARGET_CUSTOMER = 123;

const SEQ_STEPS = [
  {opcode: 'OpenRead', comment: 'Открыть таблицу orders для чтения', phase: 'open'},
  {opcode: 'Rewind', comment: 'Указатель в начало таблицы', phase: 'scan'},
  {opcode: 'Column + Ne', comment: 'Сравнить customer_id с 123', phase: 'filter'},
  {opcode: 'ResultRow', comment: 'Строка подходит — в результат', phase: 'emit'},
  {opcode: 'Next', comment: 'Следующая строка (цикл)', phase: 'scan'},
  {opcode: 'Halt', comment: 'Строки закончились', phase: 'done'},
];

const IDX_STEPS = [
  {opcode: 'OpenRead', comment: 'Открыть таблицу и индекс idx_customer_id', phase: 'open'},
  {opcode: 'SeekGE', comment: 'Бинарный поиск первой записи customer_id ≥ 123', phase: 'seek'},
  {opcode: 'IdxGT + DeferredSeek', comment: 'Проверка точного совпадения = 123', phase: 'filter'},
  {opcode: 'IdxRowid + Column', comment: 'Получить rowid и столбцы из heap', phase: 'emit'},
  {opcode: 'Next', comment: 'Следующее совпадение в индексе', phase: 'seek'},
  {opcode: 'Halt', comment: 'Совпадений больше нет', phase: 'done'},
];

export function buildIndexEntries(table) {
  return [...table]
    .map((r) => ({customer_id: r.customer_id, rowid: r.rowid}))
    .sort((a, b) => a.customer_id - b.customer_id || a.rowid - b.rowid);
}

function matchingRows(table, limit) {
  const all = table.filter((r) => r.customer_id === TARGET_CUSTOMER);
  return limit ? all.slice(0, limit) : all;
}

/** Пошаговая симуляция: какие rowid затронуты на каждом шаге */
export function simulatePlan({hasIndex, limit}) {
  const steps = hasIndex ? IDX_STEPS : SEQ_STEPS;
  const matched = matchingRows(ORDERS_TABLE, limit);
  const matchedIds = new Set(matched.map((r) => r.rowid));
  const timeline = [];
  let examined = 0;

  if (!hasIndex) {
    for (let i = 0; i < ORDERS_TABLE.length; i++) {
      const row = ORDERS_TABLE[i];
      examined += 1;
      const hit = matchedIds.has(row.rowid);
      timeline.push({
        stepIndex: i === 0 ? 1 : 4,
        rowid: row.rowid,
        examined: true,
        matched: hit,
        stopEarly: Boolean(limit && timeline.filter((t) => t.matched).length >= limit),
      });
      if (limit && timeline.filter((t) => t.matched).length >= limit) break;
    }
  } else {
    const index = buildIndexEntries(ORDERS_TABLE);
    let found = 0;
    for (const entry of index) {
      examined += 1;
      if (entry.customer_id < TARGET_CUSTOMER) continue;
      if (entry.customer_id > TARGET_CUSTOMER) break;
      const hit = matchedIds.has(entry.rowid);
      timeline.push({stepIndex: 2, rowid: entry.rowid, examined: true, matched: hit, stopEarly: false});
      found += 1;
      if (limit && found >= limit) break;
    }
  }

  const rowsExamined = hasIndex
    ? timeline.length
    : examined;
  const rowsReturned = limit ? Math.min(matched.length, limit) : matched.length;
  const fullScanCost = ORDERS_TABLE.length;
  const relativeCost = hasIndex
    ? Math.max(2, Math.ceil(rowsExamined * 0.6) + (limit ? 0 : 1))
    : fullScanCost;

  return {
    steps,
    timeline,
    matched,
    rowsExamined,
    rowsReturned,
    relativeCost,
    fullScanCost,
    planLabel: hasIndex ? 'SEARCH TABLE orders USING INDEX idx_customer_id' : 'SCAN TABLE orders',
    planRu: hasIndex
      ? 'Поиск через индекс (SeekGE → Next по совпадениям)'
      : 'Полное сканирование таблицы (Seq Scan)',
    hint: hasIndex
      ? limit
        ? 'LIMIT сокращает итерацию по индексу — движок останавливается после N строк.'
        : 'Индекс находит первую запись быстро; при многих совпадениях цикл Next всё ещё заметен.'
      : 'Без индекса каждая строка проверяется — стоимость растёт линейно с размером таблицы.',
  };
}
