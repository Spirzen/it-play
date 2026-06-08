/** Данные и вычисления для демо "Операнды · Операторы · Операции". */

export const ARITY_TABS = [
  {id: 'binary', label: 'Бинарный', hint: 'два операнда'},
  {id: 'unary', label: 'Унарный', hint: 'один операнд'},
  {id: 'ternary', label: 'Тернарный', hint: 'три операнда'},
  {id: 'priority', label: 'Приоритет', hint: 'порядок вычисления'},
];

export const BINARY_OPS = [
  {id: '+', symbol: '+', label: 'сложение', fn: (a, b) => a + b},
  {id: '-', symbol: '-', label: 'вычитание', fn: (a, b) => a - b},
  {id: '*', symbol: '*', label: 'умножение', fn: (a, b) => a * b},
  {id: '/', symbol: '/', label: 'деление', fn: (a, b) => (b === 0 ? NaN : a / b)},
  {id: '%', symbol: '%', label: 'остаток', fn: (a, b) => (b === 0 ? NaN : a % b)},
  {id: '**', symbol: '**', label: 'степень', fn: (a, b) => a ** b},
  {id: '==', symbol: '==', label: 'равно (==)', fn: (a, b) => a == b},
  {id: '===', symbol: '===', label: 'строго равно', fn: (a, b) => a === b},
  {id: '<', symbol: '<', label: 'меньше', fn: (a, b) => a < b},
  {id: '&&', symbol: '&&', label: 'логическое И', fn: (a, b) => a && b},
  {id: '||', symbol: '||', label: 'логическое ИЛИ', fn: (a, b) => a || b},
];

export const UNARY_OPS = [
  {id: 'neg', symbol: '-', label: 'унарный минус', prefix: true, fn: (x) => -x},
  {id: 'pos', symbol: '+', label: 'унарный плюс', prefix: true, fn: (x) => +x},
  {id: 'not', symbol: '!', label: 'логическое НЕ', prefix: true, fn: (x) => !x},
  {id: 'typeof', symbol: 'typeof', label: 'typeof (JS)', prefix: true, fn: (x) => typeof x},
];

export function formatOperandValue(value) {
  if (typeof value === 'string') return `"${value}"`;
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (typeof value === 'number' && Number.isNaN(value)) return 'NaN';
  return String(value);
}

export function formatResult(value) {
  if (typeof value === 'string') return `"${value}"`;
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (typeof value === 'number' && Number.isNaN(value)) return 'NaN';
  if (typeof value === 'undefined') return 'undefined';
  return String(value);
}

export function evalBinary(opId, a, b, pool = BINARY_OPS) {
  const op = pool.find((o) => o.id === opId) ?? pool[0];
  return {op, result: op.fn(a, b)};
}

export function evalUnary(opId, x, pool = UNARY_OPS) {
  const op = pool.find((o) => o.id === opId) ?? pool[0];
  return {op, result: op.fn(x)};
}

export function evalTernary(condition, whenTrue, whenFalse) {
  const branch = condition ? whenTrue : whenFalse;
  return {branch, result: branch};
}

/** Пошаговый разбор a + b * c при заданных значениях. */
export function buildPrioritySteps(a, b, c) {
  const product = b * c;
  const sum = a + product;
  return [
    {
      step: 1,
      text: `Сначала * (приоритет выше): b * c = ${b} * ${c}`,
      highlight: 'mul',
      partial: product,
    },
    {
      step: 2,
      text: `Затем +: a + (b * c) = ${a} + ${product}`,
      highlight: 'add',
      partial: sum,
    },
    {
      step: 3,
      text: `Итоговая операция: ${a} + ${b} * ${c} = ${sum}`,
      highlight: 'done',
      partial: sum,
    },
  ];
}

export const PRIORITY_WRONG = (a, b, c) => (a + b) * c;
