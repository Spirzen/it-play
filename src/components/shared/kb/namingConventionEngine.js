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
    id: 'upper_snake',
    label: 'UPPER_SNAKE_CASE',
    hint: 'константы, макросы, env-переменные',
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
