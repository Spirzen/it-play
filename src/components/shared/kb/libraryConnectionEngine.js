/** Данные и логика для демо "Библиотека и подключение". */

export const LIBRARY = {
  name: 'lodash',
  version: '4.17.21',
  description: 'Утилиты для массивов, объектов и строк',
  exports: [
    {name: 'capitalize', signature: '(string) → string', example: "'hello' → 'Hello'"},
    {name: 'chunk', signature: '(array, size) → array[]', example: '[1,2,3,4] → [[1,2],[3,4]]'},
    {name: 'uniq', signature: '(array) → array', example: '[1,1,2] → [1,2]'},
  ],
};

export const CONNECTION_MODES = {
  npm: {
    id: 'npm',
    label: 'Менеджер пакетов (npm)',
    short: 'npm',
    hint: 'Зависимость в package.json → npm install → import в коде',
  },
  cdn: {
    id: 'cdn',
    label: 'CDN в браузере',
    short: 'CDN',
    hint: 'Скрипт по URL в HTML — без node_modules на диске',
  },
};

export const NPM_STEPS = [
  {
    id: 'manifest',
    short: 'Манифест',
    title: 'Объявление зависимости',
    description:
      'В package.json указывают имя пакета и диапазон версии. Менеджер пакетов прочитает файл и скачает библиотеку вместе с её зависимостями.',
    terminal: null,
    highlightFiles: ['package.json'],
    codeFile: 'package.json',
    insight: 'Версию фиксируют в package-lock.json, чтобы сборка была воспроизводимой.',
  },
  {
    id: 'install',
    short: 'Установка',
    title: 'npm install',
    description:
      'Команда загружает пакет из реестра (npm Registry) в папку node_modules. Повторный clone репозитория — снова npm install по lock-файлу.',
    terminal: ['$ npm install', 'added 1 package, audited 2 packages in 1.2s', 'node_modules/lodash/ created'],
    highlightFiles: ['package.json', 'node_modules/lodash'],
    codeFile: 'package.json',
    insight: 'node_modules может содержать сотни пакетов — это транзитивные зависимости lodash и других библиотек.',
  },
  {
    id: 'import',
    short: 'Импорт',
    title: 'Подключение в коде',
    description:
      'В начале файла — import (ES modules) или require (CommonJS). Сборщик или Node находит модуль в node_modules по имени пакета.',
    terminal: null,
    highlightFiles: ['src/app.js', 'node_modules/lodash'],
    codeFile: 'src/app.js',
    insight: 'IDE подсказывает методы библиотеки, потому что читает типы и исходники из установленного пакета.',
  },
  {
    id: 'run',
    short: 'Вызов',
    title: 'Использование API',
    description:
      'Вы вызываете готовые функции — реализация скрыта внутри пакета. Ваш код описывает задачу, библиотека выполняет детали.',
    terminal: ['$ node src/app.js', 'Hello → Hello', 'chunk(4) → [[1,2],[3,4]]'],
    highlightFiles: ['src/app.js'],
    codeFile: 'src/app.js',
    insight: 'При сборке bundler может включить только используемые функции (tree-shaking), если пакет это поддерживает.',
  },
];

export const CDN_STEPS = [
  {
    id: 'html',
    short: 'HTML',
    title: 'Подключение по ссылке',
    description:
      'Тег script загружает библиотеку с CDN при открытии страницы. Файл кэшируется браузером, но нужен интернет и рабочая ссылка.',
    terminal: null,
    highlightFiles: ['index.html'],
    codeFile: 'index.html',
    insight: 'Глобальная переменная _ (у lodash) появляется после загрузки скрипта — import не нужен.',
  },
  {
    id: 'use',
    short: 'Скрипт',
    title: 'Вызов из своего кода',
    description:
      'Ваш скрипт выполняется после библиотеки и использует её API через глобальный объект. Удобно для прототипов и простых страниц.',
    terminal: null,
    highlightFiles: ['index.html', 'app.js'],
    codeFile: 'app.js',
    insight: 'В продакшене чаще собирают проект с npm, чтобы контролировать версии и не зависеть от внешнего CDN.',
  },
  {
    id: 'run',
    short: 'Результат',
    title: 'Работа в браузере',
    description:
      'Браузер выполняет HTML и скрипты по порядку: сначала библиотека с CDN, затем ваш код.',
    terminal: ['Console: capitalize("привет") → "Привет"'],
    highlightFiles: ['app.js'],
    codeFile: 'app.js',
    insight: 'Тот же пакет lodash можно подключить и через npm, и через CDN — меняется только способ доставки кода.',
  },
];

export const CODE_SNIPPETS = {
  'package.json': `{
  "name": "my-app",
  "dependencies": {
    "lodash": "^4.17.21"
  }
}`,
  'src/app.js': `import { capitalize, chunk } from 'lodash';

const title = capitalize('hello');
const groups = chunk([1, 2, 3, 4], 2);

console.log(title);
console.log(groups);`,
  'index.html': `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Демо CDN</title>
</head>
<body>
  <script src="https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js"></script>
  <script src="app.js"></script>
</body>
</html>`,
  'app.js': `// _ доступен глобально после загрузки lodash с CDN
const title = _.capitalize('привет');
console.log(title);`,
};

export const PROJECT_FILES = {
  npm: [
    {path: 'package.json', type: 'config'},
    {path: 'node_modules/lodash', type: 'lib', children: ['index.js', 'capitalize.js', 'chunk.js', 'package.json']},
    {path: 'src/app.js', type: 'code'},
  ],
  cdn: [
    {path: 'index.html', type: 'code'},
    {path: 'app.js', type: 'code'},
    {path: '(CDN) lodash.min.js', type: 'cdn'},
  ],
};

export function getSteps(mode) {
  return mode === 'cdn' ? CDN_STEPS : NPM_STEPS;
}

export function runDemo(mode, userInput = 'привет') {
  const text = String(userInput || 'привет').trim() || 'привет';
  const cap = text.charAt(0).toUpperCase() + text.slice(1);
  if (mode === 'cdn') {
    return {
      lines: [
        `_.capitalize("${text}")`,
        `→ "${cap}"`,
        'Источник: глобальный объект _ после <script src="…lodash…">',
      ],
      ok: true,
    };
  }
  return {
    lines: [
      `capitalize("${text}")`,
      `→ "${cap}"`,
      'chunk([1, 2, 3, 4], 2) → [[1, 2], [3, 4]]',
      'Источник: import из пакета lodash в node_modules',
    ],
    ok: true,
  };
}
