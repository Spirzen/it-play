export const TOKEN_CLASS = {
  comment: 'comment',
  kw: 'kw',
  fn: 'fn',
  str: 'str',
  num: 'num',
  p: 'p',
  plain: 'plain',
};

const PY_KEYWORDS = new Set([
  'def',
  'class',
  'if',
  'else',
  'elif',
  'for',
  'while',
  'return',
  'import',
  'from',
  'print',
  'True',
  'False',
  'None',
  'and',
  'or',
  'not',
  'in',
  'as',
]);

/** Простая подсветка Python для демо-редактора. */
export function tokenizePythonLine(line, highlight = true) {
  if (!highlight) {
    return line ? [{t: TOKEN_CLASS.plain, v: line}] : [];
  }

  const trimmed = line.trim();
  if (!trimmed) return [];

  if (trimmed.startsWith('#')) {
    return [{t: TOKEN_CLASS.comment, v: line}];
  }

  const tokens = [];
  const re =
    /(#.*$)|("(?:[^"\\]|\\.)*")|('(?:[^'\\]|\\.)*')|(\b\d+\b)|(\b(?:def|class|if|else|elif|for|while|return|import|from|print|True|False|None|and|or|not|in|as)\b)|(\b[a-zA-Z_][\w]*\b)|([():.,=+\-*/\[\]{}])|(\s+)/g;
  let m;
  while ((m = re.exec(line)) !== null) {
    const [, comment, dbl, sgl, num, kw, ident, punct, ws] = m;
    if (comment) tokens.push({t: TOKEN_CLASS.comment, v: comment});
    else if (dbl || sgl) tokens.push({t: TOKEN_CLASS.str, v: dbl || sgl});
    else if (num) tokens.push({t: TOKEN_CLASS.num, v: num});
    else if (kw) tokens.push({t: TOKEN_CLASS.kw, v: kw});
    else if (ident) {
      const lower = ident.toLowerCase();
      if (PY_KEYWORDS.has(lower) || ident === 'print') {
        tokens.push({t: TOKEN_CLASS.kw, v: ident});
      } else if (line[m.index - 1] === '(' || ident.endsWith('(')) {
        tokens.push({t: TOKEN_CLASS.fn, v: ident});
      } else {
        tokens.push({t: TOKEN_CLASS.plain, v: ident});
      }
    } else if (punct) tokens.push({t: TOKEN_CLASS.p, v: punct});
    else if (ws) tokens.push({t: TOKEN_CLASS.plain, v: ws});
  }
  return tokens.length ? tokens : [{t: TOKEN_CLASS.plain, v: line}];
}

export const SCENARIOS = [
  {
    id: 'plain',
    label: 'Новый файл',
    tabTitle: 'Untitled-1',
    fileName: null,
    highlight: false,
    code: ['print("Привет!")'],
    bottomTab: null,
    caption:
      'Текст без расширения — IDE пока не знает язык и не подсвечивает синтаксис.',
  },
  {
    id: 'highlight',
    label: 'Подсветка',
    tabTitle: 'Hello.py',
    fileName: 'Hello.py',
    highlight: true,
    code: ['print("Привет!")'],
    bottomTab: null,
    extensionBadge: 'Python',
    caption:
      'После установки расширения Python ключевые слова и строки получают цвет — так проще читать структуру кода.',
  },
  {
    id: 'run',
    label: 'Запуск',
    tabTitle: 'Hello.py',
    fileName: 'Hello.py',
    highlight: true,
    code: ['print("Привет!")'],
    bottomTab: 'terminal',
    terminal: [
      '> python Hello.py',
      'Привет!',
      '',
      'Process finished with exit code 0',
    ],
    runActive: true,
    caption:
      '"Запуск и отладка" выполняет файл и выводит результат в нижнюю панель — как в учебном примере со print.',
  },
  {
    id: 'errors',
    label: 'Ошибки',
    tabTitle: 'Hello.py',
    fileName: 'Hello.py',
    highlight: true,
    code: ['prnt("Привет!")', 'непонятное_слово = 1'],
    errorLines: [1, 2],
    bottomTab: 'problems',
    problems: [
      {line: 1, col: 1, message: 'Undefined name "prnt". Did you mean "print"?'},
      {line: 2, col: 1, message: 'SyntaxError: invalid syntax'},
    ],
    caption:
      'Пока синтаксис неверен, IDE показывает список проблем — код не запустится, пока ошибки не исправлены.',
  },
  {
    id: 'autocomplete',
    label: 'Автодополнение',
    tabTitle: 'Hello.py',
    fileName: 'Hello.py',
    highlight: true,
    code: ['pr'],
    autocomplete: {
      line: 1,
      prefix: 'pr',
      items: [
        {label: 'print', detail: 'built-in', insert: 'print(value, ...)', kind: 'function'},
        {label: 'property', detail: 'built-in', insert: 'property(...)', kind: 'function'},
        {label: 'range', detail: 'built-in', insert: 'range(stop)', kind: 'function'},
      ],
    },
    caption:
      'Набираете "pr" — IDE предлагает print и другие варианты из стандартной библиотеки и вашего проекта.',
  },
  {
    id: 'debug',
    label: 'Отладка',
    tabTitle: 'Hello.py',
    fileName: 'Hello.py',
    highlight: true,
    code: [
      'x = 5',
      'y = x + 3',
      'print("Сумма:", y)',
      'print("Готово")',
    ],
    breakpointLine: 3,
    currentLine: 3,
    bottomTab: 'debug',
    variables: [
      {name: 'x', value: '5'},
      {name: 'y', value: '8'},
    ],
    debugToolbar: true,
    caption:
      'Точка останова останавливает выполнение перед строкой — в панели видны значения переменных.',
  },
];

export function getScenario(id) {
  return SCENARIOS.find((s) => s.id === id) ?? SCENARIOS[0];
}
