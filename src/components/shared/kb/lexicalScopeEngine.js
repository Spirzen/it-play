export const SCOPE_LEVELS = ['inner', 'outer', 'global'];

export const ENVIRONMENTS = {
  inner: {
    id: 'inner',
    label: 'inner()',
    title: 'Inner Function',
    variables: {z: 30},
    outerRef: 'outer',
  },
  outer: {
    id: 'outer',
    label: 'outer()',
    title: 'Outer Function',
    variables: {y: 20, x: 10},
    outerRef: 'global',
  },
  global: {
    id: 'global',
    label: 'Global',
    title: 'Global Scope',
    variables: {x: 10, undefinedVal: undefined},
    outerRef: null,
  },
};

export const CODE_LINES = [
  {num: 1, parts: [{t: 'kw', v: 'let '}, {t: 'v', v: 'x'}, {t: 'p', v: ' = 10;'}]},
  {num: 2, parts: []},
  {
    num: 3,
    parts: [{t: 'kw', v: 'function '}, {t: 'fn', v: 'outer'}, {t: 'p', v: '() {'}],
  },
  {num: 4, indent: 1, parts: [{t: 'kw', v: 'let '}, {t: 'v', v: 'y'}, {t: 'p', v: ' = 20;'}]},
  {num: 5, indent: 1, parts: []},
  {
    num: 6,
    indent: 1,
    parts: [{t: 'kw', v: 'function '}, {t: 'fn', v: 'inner'}, {t: 'p', v: '() {'}],
  },
  {num: 7, indent: 2, parts: [{t: 'kw', v: 'let '}, {t: 'v', v: 'z'}, {t: 'p', v: ' = 30;'}]},
  {num: 8, indent: 2, parts: []},
  {
    num: 9,
    indent: 2,
    parts: [
      {t: 'fn', v: 'console'},
      {t: 'p', v: '.log('},
      {t: 'v', v: 'x'},
      {t: 'p', v: ', '},
      {t: 'v', v: 'y'},
      {t: 'p', v: ', '},
      {t: 'v', v: 'z'},
      {t: 'p', v: ');'},
    ],
  },
  {num: 10, indent: 1, parts: [{t: 'p', v: '}'}]},
  {num: 11, indent: 1, parts: [{t: 'fn', v: 'inner'}, {t: 'p', v: '();'}]},
  {num: 12, parts: [{t: 'p', v: '}'}]},
  {num: 13, parts: [{t: 'fn', v: 'outer'}, {t: 'p', v: '();'}]},
];

export const PRESETS = [
  {name: 'z', hint: 'Локальная переменная inner'},
  {name: 'y', hint: 'Объявлена в outer'},
  {name: 'x', hint: 'Shadowing: inner не видит, outer имеет x=10'},
  {name: 'foo', hint: 'Не найдена ни в одном окружении'},
];

/** Путь поиска и результат разрешения имени. */
export function resolveVariable(name) {
  const term = name.trim();
  if (!term) {
    return {term: '', path: [], found: false, value: null, level: null};
  }

  const path = [];
  let level = 'inner';
  let found = false;
  let value = null;

  while (level) {
    path.push(level);
    const env = ENVIRONMENTS[level];
    if (Object.prototype.hasOwnProperty.call(env.variables, term)) {
      found = true;
      value = env.variables[term];
      break;
    }
    level = env.outerRef;
  }

  return {
    term,
    path,
    found,
    value,
    level: found ? path[path.length - 1] : null,
  };
}

export function formatValue(value) {
  if (value === undefined) return 'undefined';
  return String(value);
}
