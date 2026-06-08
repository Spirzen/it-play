import {BINARY_OPS as BASE_BINARY, UNARY_OPS as BASE_UNARY} from './operatorsEngine';

/** @typedef {{ id: string, symbol: string, label: string, fn: (a: number, b: number) => unknown, prefix?: boolean }} UnaryOp */
/** @typedef {{ id: string, symbol: string, label: string, fn: (a: number, b: number) => unknown }} BinaryOp */

/** @param {string[]} ids @param {BinaryOp[]} pool */
function pickBinary(ids, pool = BASE_BINARY) {
  return ids.map((id) => pool.find((o) => o.id === id)).filter(Boolean);
}

/** @param {string[]} ids @param {UnaryOp[]} pool */
function pickUnary(ids, pool = BASE_UNARY) {
  return ids.map((id) => pool.find((o) => o.id === id)).filter(Boolean);
}

const PYTHON_BINARY = [
  ...pickBinary(['+', '-', '*', '/']),
  {id: '//', symbol: '//', label: 'целочисленное деление', fn: (a, b) => (b === 0 ? NaN : Math.floor(a / b))},
  ...pickBinary(['%', '**']),
  {id: '==', symbol: '==', label: 'равно', fn: (a, b) => a == b},
  {id: '!=', symbol: '!=', label: 'не равно', fn: (a, b) => a != b},
  ...pickBinary(['<']),
  {
    id: 'and',
    symbol: 'and',
    label: 'логическое И',
    fn: (a, b) => Boolean(a) && Boolean(b),
  },
  {
    id: 'or',
    symbol: 'or',
    label: 'логическое ИЛИ',
    fn: (a, b) => Boolean(a) || Boolean(b),
  },
];

const PYTHON_UNARY = [
  {id: 'neg', symbol: '-', label: 'унарный минус', prefix: true, fn: (x) => -x},
  {id: 'not', symbol: 'not', label: 'логическое НЕ', prefix: true, fn: (x) => !x},
];

const LUA_BINARY = [
  ...pickBinary(['+', '-', '*', '/']),
  {id: '//', symbol: '//', label: 'целочисленное деление', fn: (a, b) => (b === 0 ? NaN : Math.floor(a / b))},
  ...pickBinary(['%', '**', '==']),
  {id: '~=', symbol: '~=', label: 'не равно', fn: (a, b) => a != b},
  ...pickBinary(['<']),
];

const R_BINARY = [
  ...pickBinary(['+', '-', '*', '/']),
  {id: '==', symbol: '==', label: 'равно', fn: (a, b) => a == b},
  {id: '!=', symbol: '!=', label: 'не равно', fn: (a, b) => a != b},
  ...pickBinary(['<', '&&', '||']),
  {id: '|', symbol: '|', label: 'побитовое ИЛИ / or()', fn: (a, b) => Number(a) | Number(b)},
];

const ELIXIR_BINARY = [
  ...pickBinary(['+', '-', '*', '/']),
  {id: '==', symbol: '==', label: 'строгое равенство', fn: (a, b) => a === b},
  {id: '!=', symbol: '!=', label: 'не равно', fn: (a, b) => a !== b},
  ...pickBinary(['<', '&&', '||']),
  {id: 'and', symbol: 'and', label: 'and (короткое замыкание)', fn: (a, b) => a && b},
  {id: 'or', symbol: 'or', label: 'or (короткое замыкание)', fn: (a, b) => a || b},
];

const HASKELL_BINARY = [
  ...pickBinary(['+', '-', '*', '/']),
  {id: '==', symbol: '==', label: 'равно', fn: (a, b) => a === b},
  ...pickBinary(['<']),
  {id: '&&', symbol: '&&', label: '&&', fn: (a, b) => a && b},
  {id: '||', symbol: '||', label: '||', fn: (a, b) => a || b},
];

/** @type {Record<string, { label: string | null, binaryOps: BinaryOp[], unaryOps: UnaryOp[], showTernary?: boolean, ternaryHint?: string }>} */
export const OPERATORS_PRESETS = {
  default: {
    label: null,
    binaryOps: BASE_BINARY,
    unaryOps: BASE_UNARY,
    showTernary: true,
  },
  javascript: {
    label: 'JavaScript',
    binaryOps: pickBinary(['+', '-', '*', '/', '%', '**', '==', '===', '<', '&&', '||']),
    unaryOps: pickUnary(['neg', 'pos', 'not', 'typeof']),
    showTernary: true,
    ternaryHint: 'Единственный тернарный оператор в JS: condition ? a : b',
  },
  python: {
    label: 'Python',
    binaryOps: PYTHON_BINARY,
    unaryOps: PYTHON_UNARY,
    showTernary: true,
    ternaryHint: 'В Python: a if условие else b (в демо — общая схема ? :)',
  },
  java: {
    label: 'Java',
    binaryOps: pickBinary(['+', '-', '*', '/', '%', '==', '!=', '<', '&&', '||']),
    unaryOps: pickUnary(['neg', 'not']),
    showTernary: true,
  },
  csharp: {
    label: 'C#',
    binaryOps: pickBinary(['+', '-', '*', '/', '%', '==', '!=', '<', '&&', '||']),
    unaryOps: pickUnary(['neg', 'not']),
    showTernary: true,
  },
  cpp: {
    label: 'C++',
    binaryOps: pickBinary(['+', '-', '*', '/', '%', '==', '!=', '<', '&&', '||']),
    unaryOps: pickUnary(['neg', 'not']),
    showTernary: true,
  },
  c: {
    label: 'C',
    binaryOps: pickBinary(['+', '-', '*', '/', '%', '==', '!=', '<', '&&', '||']),
    unaryOps: pickUnary(['neg', 'not']),
    showTernary: true,
  },
  go: {
    label: 'Go',
    binaryOps: pickBinary(['+', '-', '*', '/', '%', '==', '!=', '<', '&&', '||']),
    unaryOps: pickUnary(['neg', 'not']),
    showTernary: false,
    ternaryHint: 'В Go нет тернарного оператора — используйте if/else',
  },
  php: {
    label: 'PHP',
    binaryOps: pickBinary(['+', '-', '*', '/', '%', '==', '===', '!=', '<', '&&', '||']),
    unaryOps: pickUnary(['neg', 'not']),
    showTernary: true,
  },
  kotlin: {
    label: 'Kotlin',
    binaryOps: pickBinary(['+', '-', '*', '/', '%', '==', '!=', '<', '&&', '||']),
    unaryOps: pickUnary(['neg', 'not']),
    showTernary: true,
  },
  rust: {
    label: 'Rust',
    binaryOps: pickBinary(['+', '-', '*', '/', '%', '==', '!=', '<', '&&', '||']),
    unaryOps: pickUnary(['neg', 'not']),
    showTernary: false,
    ternaryHint: 'В Rust нет тернарного ? : — выражение if блоком',
  },
  swift: {
    label: 'Swift',
    binaryOps: pickBinary(['+', '-', '*', '/', '%', '==', '!=', '<', '&&', '||']),
    unaryOps: pickUnary(['neg', 'not']),
    showTernary: false,
  },
  ruby: {
    label: 'Ruby',
    binaryOps: pickBinary(['+', '-', '*', '/', '%', '**', '==', '!=', '<', '&&', '||']),
    unaryOps: pickUnary(['neg', 'not']),
    showTernary: false,
    ternaryHint: 'В Ruby: if в выражениях вместо ? :',
  },
  dart: {
    label: 'Dart',
    binaryOps: pickBinary(['+', '-', '*', '/', '%', '==', '!=', '<', '&&', '||']),
    unaryOps: pickUnary(['neg', 'not']),
    showTernary: true,
  },
  scala: {
    label: 'Scala',
    binaryOps: pickBinary(['+', '-', '*', '/', '%', '==', '!=', '<', '&&', '||']),
    unaryOps: pickUnary(['neg', 'not']),
    showTernary: false,
  },
  groovy: {
    label: 'Groovy',
    binaryOps: pickBinary(['+', '-', '*', '/', '%', '==', '!=', '<', '&&', '||']),
    unaryOps: pickUnary(['neg', 'not']),
    showTernary: true,
  },
  lua: {
    label: 'Lua',
    binaryOps: LUA_BINARY,
    unaryOps: pickUnary(['neg', 'not']),
    showTernary: false,
    ternaryHint: 'В Lua: and/or/not вместо &&/||/!',
  },
  elixir: {
    label: 'Elixir',
    binaryOps: ELIXIR_BINARY,
    unaryOps: pickUnary(['not']),
    showTernary: false,
  },
  haskell: {
    label: 'Haskell',
    binaryOps: HASKELL_BINARY,
    unaryOps: pickUnary(['neg', 'not']),
    showTernary: false,
  },
  r: {
    label: 'R',
    binaryOps: R_BINARY,
    unaryOps: pickUnary(['neg', 'not']),
    showTernary: true,
    ternaryHint: 'В R нет ? : ; для векторов — ifelse(), для скаляров — if (условие) значение',
  },
  julia: {
    label: 'Julia',
    binaryOps: pickBinary(['+', '-', '*', '/', '%', '^', '==', '!=', '<', '&&', '||']),
    unaryOps: pickUnary(['neg', 'not']),
    showTernary: true,
  },
  nim: {
    label: 'Nim',
    binaryOps: pickBinary(['+', '-', '*', '/', '%', '==', '!=', '<', '&&', '||']),
    unaryOps: pickUnary(['neg', 'not']),
    showTernary: true,
  },
  zig: {
    label: 'Zig',
    binaryOps: pickBinary(['+', '-', '*', '/', '%', '==', '!=', '<', '&&', '||']),
    unaryOps: pickUnary(['neg', 'not']),
    showTernary: false,
  },
  bash: {
    label: 'Bash',
    binaryOps: pickBinary(['+', '-', '*', '/', '%', '==', '!=', '<', '&&', '||']),
    unaryOps: pickUnary(['neg', 'not']),
    showTernary: false,
    ternaryHint: 'В Bash тесты: [[ условие ]] и $(( арифметика ))',
  },
  powershell: {
    label: 'PowerShell',
    binaryOps: [
      {id: 'eq', symbol: '-eq', label: 'равно', fn: (a, b) => a == b},
      {id: 'ne', symbol: '-ne', label: 'не равно', fn: (a, b) => a != b},
      {id: 'gt', symbol: '-gt', label: 'больше', fn: (a, b) => a > b},
      {id: 'lt', symbol: '-lt', label: 'меньше', fn: (a, b) => a < b},
      {id: 'and', symbol: '-and', label: 'логическое И', fn: (a, b) => Boolean(a) && Boolean(b)},
      {id: 'or', symbol: '-or', label: 'логическое ИЛИ', fn: (a, b) => Boolean(a) || Boolean(b)},
      ...pickBinary(['+', '-', '*', '/']),
    ],
    unaryOps: [{id: 'not', symbol: '-not', label: 'логическое НЕ', prefix: true, fn: (x) => !x}],
    showTernary: false,
  },
  pascal: {
    label: 'Pascal',
    binaryOps: pickBinary(['+', '-', '*', '/', '==', '!=', '<', '&&', '||']),
    unaryOps: pickUnary(['neg', 'not']),
    showTernary: false,
  },
  fortran: {
    label: 'Fortran',
    binaryOps: pickBinary(['+', '-', '*', '/', '==', '!=', '<', '&&', '||']),
    unaryOps: pickUnary(['neg', 'not']),
    showTernary: false,
  },
  cobol: {
    label: 'COBOL',
    binaryOps: pickBinary(['+', '-', '*', '/', '==', '!=', '<', '&&', '||']),
    unaryOps: pickUnary(['neg', 'not']),
    showTernary: false,
  },
  lisp: {
    label: 'Lisp',
    binaryOps: pickBinary(['+', '-', '*', '/', '==', '<', '&&', '||']),
    unaryOps: pickUnary(['neg', 'not']),
    showTernary: false,
  },
  vb: {
    label: 'Visual Basic',
    binaryOps: pickBinary(['+', '-', '*', '/', '==', '!=', '<', '&&', '||']),
    unaryOps: pickUnary(['neg', 'not']),
    showTernary: false,
  },
  smalltalk: {
    label: 'Smalltalk',
    binaryOps: pickBinary(['+', '-', '*', '/', '==', '<', '&&', '||']),
    unaryOps: pickUnary(['neg', 'not']),
    showTernary: false,
  },
  assembler: {
    label: 'Ассемблер',
    binaryOps: pickBinary(['+', '-', '*', '/', '==', '!=', '<']),
    unaryOps: pickUnary(['neg', 'not']),
    showTernary: false,
    ternaryHint: 'Ветвление через CMP и условные переходы (JZ, JNZ…)',
  },
  '1c': {
    label: '1С',
    binaryOps: [
      ...pickBinary(['+', '-', '*', '/']),
      {id: 'intdiv', symbol: '\\', label: 'целочисленное деление', fn: (a, b) => (b === 0 ? NaN : Math.floor(a / b))},
      {id: 'mod', symbol: 'Mod', label: 'остаток', fn: (a, b) => (b === 0 ? NaN : a % b)},
      ...pickBinary(['==', '!=', '<']),
      {id: 'and', symbol: 'И', label: 'логическое И', fn: (a, b) => Boolean(a) && Boolean(b)},
      {id: 'or', symbol: 'ИЛИ', label: 'логическое ИЛИ', fn: (a, b) => Boolean(a) || Boolean(b)},
    ],
    unaryOps: [{id: 'not', symbol: 'НЕ', label: 'логическое НЕ', prefix: true, fn: (x) => !x}],
    showTernary: false,
    ternaryHint: 'В 1С ветвление — конструкция Если…Тогда…Иначе, не тернарный ? :',
  },
};

export function resolveOperatorsPreset(language) {
  const key = (language ?? 'default').toLowerCase().replace(/[^a-z0-9_-]/g, '');
  return OPERATORS_PRESETS[key] ?? OPERATORS_PRESETS.default;
}
