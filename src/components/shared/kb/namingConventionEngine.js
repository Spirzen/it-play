export const NAMING_STYLES = [
  {
    id: 'camel',
    label: 'camelCase',
    hint: 'переменные, параметры, локальные поля',
    transform: (words) =>
      words[0].toLowerCase() +
      words
        .slice(1)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(''),
    examples: {
      csharp: 'int userAge;\nstring firstName;',
      python: 'user_age = 25  # в Python чаще snake_case',
      js: 'const totalAmount = 0;',
      css: '/* в CSS не используется */',
    },
  },
  {
    id: 'pascal',
    label: 'PascalCase',
    hint: 'классы, методы, свойства, типы',
    transform: (words) =>
      words.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(''),
    examples: {
      csharp: 'class UserAccount { }\nvoid CalculateTotal() { }',
      python: 'class UserAccount:\n    def CalculateTotal(self): ...',
      js: 'class UserAccount {}\nfunction CalculateTotal() {}',
      css: '/* в CSS не используется */',
    },
  },
  {
    id: 'snake',
    label: 'snake_case',
    hint: 'переменные и функции в Python, константы в Ruby',
    transform: (words) => words.map((w) => w.toLowerCase()).join('_'),
    examples: {
      csharp: '// редко в C#, но встречается в JSON\nvar user_age = 25;',
      python: 'user_age = 25\ndef calculate_total(): pass',
      js: 'const user_age = 25;',
      css: '/* в CSS не используется */',
    },
  },
  {
    id: 'pascal_snake',
    label: 'Pascal_Snake_Case',
    hint: 'редко в коде; встречается в генераторах и legacy API',
    transform: (words) =>
      words.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('_'),
    examples: {
      csharp: '// редко\nvar User_Account = ...;',
      python: 'User_Account = None  # нетипично для Python',
      js: 'const User_Account = {};',
      css: '/* в CSS не используется */',
    },
  },
  {
    id: 'camel_snake',
    label: 'camel_Snake_Case',
    hint: 'промежуточный стиль; чаще в автогенерации, чем вручную',
    transform: (words) =>
      words[0].toLowerCase() +
      (words.length > 1 ? '_' : '') +
      words
        .slice(1)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join('_'),
    examples: {
      csharp: '// редко\nvar user_Account = ...;',
      python: 'user_Account = None',
      js: 'const user_Account = {};',
      css: '/* в CSS не используется */',
    },
  },
  {
    id: 'upper_snake',
    label: 'UPPER_SNAKE_CASE',
    hint: 'константы, макросы, env-переменные (ещё screaming snake case)',
    transform: (words) => words.map((w) => w.toUpperCase()).join('_'),
    examples: {
      csharp: 'const int MAX_RETRY = 3;',
      python: 'MAX_RETRY = 3',
      js: 'const MAX_RETRY = 3;',
      css: '/* в CSS не используется */',
    },
  },
  {
    id: 'kebab',
    label: 'kebab-case',
    hint: 'URL, CSS-классы, имена файлов в вебе',
    transform: (words) => words.map((w) => w.toLowerCase()).join('-'),
    examples: {
      csharp: '// имена файлов/маршрутов\n"api/user-profile"',
      python: '# slug в URL\nuser-profile',
      js: 'const route = "/user-profile";',
      css: '.main-header { color: red; }',
    },
  },
  {
    id: 'train',
    label: 'Train-Case',
    hint: 'HTTP-заголовки, MIME-типы, некоторые конфиги',
    transform: (words) =>
      words.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('-'),
    examples: {
      csharp: '// HTTP-заголовок\n"Content-Type"',
      python: '# заголовок запроса\nContent-Type',
      js: 'headers["Content-Type"] = "application/json";',
      css: '/* в CSS не используется */',
    },
  },
  {
    id: 'cobol',
    label: 'COBOL-CASE',
    hint: 'разделы и параграфы COBOL, mainframe-соглашения',
    transform: (words) => words.map((w) => w.toUpperCase()).join('-'),
    examples: {
      csharp: '// legacy mainframe\n"PROCEDURE-DIVISION"',
      python: '# редко вне COBOL\nIDENTIFICATION-DIVISION',
      js: '// в вебе не используется',
      css: '/* в CSS не используется */',
    },
  },
  {
    id: 'flat',
    label: 'flatcase',
    hint: 'слитно, нижний регистр; редко в идентификаторах',
    transform: (words) => words.map((w) => w.toLowerCase()).join(''),
    examples: {
      csharp: '// редко\nvar useraccount = ...;',
      python: 'useraccount = 0',
      js: 'const useraccount = 0;',
      css: '/* в CSS не используется */',
    },
  },
  {
    id: 'upper_flat',
    label: 'UPPERFLATCASE',
    hint: 'слитно, верхний регистр; legacy и сжатые идентификаторы',
    transform: (words) => words.map((w) => w.toUpperCase()).join(''),
    examples: {
      csharp: '// legacy\nvar USERACCOUNT = ...;',
      python: 'USERACCOUNT = 0',
      js: 'const USERACCOUNT = 0;',
      css: '/* в CSS не используется */',
    },
  },
];

export const LANG_OPTIONS = [
  {id: 'csharp', label: 'C#'},
  {id: 'python', label: 'Python'},
  {id: 'js', label: 'JavaScript'},
  {id: 'css', label: 'CSS / HTML'},
];

export const DEFAULT_WORDS = ['user', 'account', 'total'];

export function parseWords(input) {
  const raw = input
    .split(/[\s,_-]+/)
    .map((w) => w.replace(/[^a-zA-Zа-яА-Я0-9]/g, ''))
    .filter(Boolean);
  return raw.length ? raw : DEFAULT_WORDS;
}

export function buildIdentifier(styleId, wordsInput) {
  const words = parseWords(wordsInput);
  const style = NAMING_STYLES.find((s) => s.id === styleId) ?? NAMING_STYLES[0];
  return {words, style, identifier: style.transform(words)};
}
