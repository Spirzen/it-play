/** Данные для JsEcosystemPlay — статья 5-01-javascript/25. */

export const TABS = [
  {id: 'stack', label: 'Слои экосистемы'},
  {id: 'deps', label: 'Граф зависимостей'},
  {id: 'structure', label: 'Структура приложения'},
  {id: 'build', label: 'Сборка и чанки'},
  {id: 'modules', label: 'Системы модулей'},
];

export const ECOSYSTEM_LAYERS = [
  {
    id: 'engine',
    tag: 'Runtime',
    label: 'Движок JavaScript',
    color: '#f59e0b',
    icon: '⚙',
    items: ['V8 (Chrome, Node)', 'SpiderMonkey (Firefox)', 'JavaScriptCore (Safari)'],
    detail:
      'Исполняет байткод: парсинг, JIT-компиляция, GC. Один и тот же язык — разные движки в браузере и в Node.js.',
  },
  {
    id: 'runtime',
    tag: 'Среда',
    label: 'Браузер и Node.js',
    color: '#3b82f6',
    icon: '🌐',
    items: ['DOM, fetch, Web APIs', 'fs, http, process (Node)', 'npm-пакеты на сервере'],
    detail:
      'Браузер даёт UI и сеть; Node — файлы, процессы, backend. От среды зависит, какие API доступны модулю.',
  },
  {
    id: 'modules',
    tag: 'Модули',
    label: 'ESM · CommonJS · AMD',
    color: '#8b5cf6',
    icon: '📦',
    items: ['import / export', 'require / module.exports', 'define / require (legacy)'],
    detail:
      'Формат модулей задаёт граф зависимостей. ESM — статический анализ и tree-shaking; CJS — Node по умолчанию; AMD — enterprise legacy.',
  },
  {
    id: 'packages',
    tag: 'Зависимости',
    label: 'npm · pnpm · yarn',
    color: '#10b981',
    icon: '📋',
    items: ['package.json', 'node_modules', 'lock-файл', 'semver'],
    detail:
      'Манифест фиксирует версии библиотек. Менеджер разрешает дерево зависимостей и кладёт пакеты в node_modules (или store у pnpm).',
  },
  {
    id: 'tooling',
    tag: 'Инструменты',
    label: 'Сборка и качество',
    color: '#ec4899',
    icon: '🔧',
    items: ['Vite · Webpack · Rollup', 'TypeScript · Babel', 'ESLint · Prettier · Vitest'],
    detail:
      'Транспиляция TS/JSX, бандлинг, code splitting, HMR в dev. Без сборщика в браузер часто попадает только ESM с CDN.',
  },
  {
    id: 'frameworks',
    tag: 'Фреймворки',
    label: 'UI и backend',
    color: '#06b6d4',
    icon: '⚛',
    items: ['React · Vue · Angular · Svelte', 'Express · NestJS · Fastify', 'Electron · Next · Nuxt'],
    detail:
      'Фреймворк задаёт структуру проекта и жизненный цикл. Библиотека (date-fns, axios) подключается точечно; фреймворк "ведёт" приложение.',
  },
  {
    id: 'app',
    tag: 'Приложение',
    label: 'Ваш код',
    color: '#6366f1',
    icon: '🏗',
    items: ['features / domains', 'shared UI', 'services · store', 'routes · API-клиент'],
    detail:
      'Прикладные модули: домены (users, orders), общие компоненты, слой данных. Обязательные модули в main-бандле, остальные — lazy chunks.',
  },
];

/** Узлы графа зависимостей (координаты в viewBox 400×220). */
export const DEP_NODES = [
  {id: 'app', label: 'main.tsx', type: 'app', x: 200, y: 24},
  {id: 'router', label: 'AppRouter', type: 'module', x: 80, y: 90},
  {id: 'store', label: 'store/auth', type: 'module', x: 200, y: 90},
  {id: 'reports', label: 'features/reports', type: 'lazy', x: 320, y: 90},
  {id: 'react', label: 'react', type: 'npm', x: 60, y: 168},
  {id: 'routerLib', label: 'react-router', type: 'npm', x: 140, y: 168},
  {id: 'zustand', label: 'zustand', type: 'npm', x: 220, y: 168},
  {id: 'charts', label: 'recharts', type: 'npm', x: 300, y: 168},
  {id: 'dateFns', label: 'date-fns', type: 'npm', x: 360, y: 168},
];

export const DEP_EDGES = [
  ['app', 'router'],
  ['app', 'store'],
  ['app', 'reports'],
  ['router', 'routerLib'],
  ['router', 'react'],
  ['store', 'zustand'],
  ['store', 'react'],
  ['reports', 'charts'],
  ['reports', 'dateFns'],
  ['reports', 'react'],
  ['charts', 'react'],
];

export const NODE_TYPE_META = {
  app: {label: 'Точка входа', stroke: '#6366f1'},
  module: {label: 'Прикладной модуль', stroke: '#10b981'},
  lazy: {label: 'Lazy chunk', stroke: '#f59e0b', dash: '6 4'},
  npm: {label: 'npm-пакет', stroke: '#ec4899'},
};

/** Пресеты структуры проекта. */
export const ARCH_PRESETS = [
  {
    id: 'react-vite',
    label: 'React + Vite',
    toolchain: 'Vite · ESM · TypeScript',
    tree: [
      {
        type: 'dir',
        path: 'crm-portal',
        children: [
          {type: 'file', path: 'crm-portal/package.json', role: 'Манифест', hint: 'react, vite, зависимости и scripts'},
          {type: 'file', path: 'crm-portal/vite.config.ts', role: 'Сборка', hint: 'alias @/, proxy API, code splitting'},
          {type: 'file', path: 'crm-portal/index.html', role: 'Точка входа HTML', hint: 'Подключает /src/main.tsx'},
          {
            type: 'dir',
            path: 'crm-portal/src',
            children: [
              {type: 'file', path: 'crm-portal/src/main.tsx', role: 'Bootstrap', hint: 'createRoot, RouterProvider, провайдеры'},
              {
                type: 'dir',
                path: 'crm-portal/src/app',
                role: 'Оболочка',
                children: [
                  {type: 'file', path: 'crm-portal/src/app/App.tsx', role: 'Layout', hint: 'Маршруты, общий UI'},
                  {type: 'file', path: 'crm-portal/src/app/routes.tsx', role: 'Маршруты', hint: 'lazy(() => import(...)) для отчётов'},
                ],
              },
              {
                type: 'dir',
                path: 'crm-portal/src/features',
                role: 'Домены',
                children: [
                  {type: 'file', path: 'crm-portal/src/features/users/', role: 'Модуль users', hint: 'api + components + hooks'},
                  {type: 'file', path: 'crm-portal/src/features/reports/', role: 'Lazy chunk', hint: 'Загружается при переходе в /reports'},
                ],
              },
              {
                type: 'dir',
                path: 'crm-portal/src/shared',
                role: 'Общее',
                children: [
                  {type: 'file', path: 'crm-portal/src/shared/ui/', role: 'UI-kit', hint: 'Кнопки, таблицы'},
                  {type: 'file', path: 'crm-portal/src/shared/api/', role: 'HTTP-клиент', hint: 'fetch/axios, interceptors'},
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'vue-nuxt',
    label: 'Vue + Nuxt',
    toolchain: 'Nuxt 3 · auto-imports',
    tree: [
      {
        type: 'dir',
        path: 'shop-nuxt',
        children: [
          {type: 'file', path: 'shop-nuxt/nuxt.config.ts', role: 'Конфиг', hint: 'modules, runtimeConfig, nitro'},
          {type: 'file', path: 'shop-nuxt/package.json', role: 'Зависимости', hint: 'vue, pinia, @nuxt/content'},
          {
            type: 'dir',
            path: 'shop-nuxt/pages',
            role: 'Маршруты = файлы',
            children: [
              {type: 'file', path: 'shop-nuxt/pages/index.vue', role: 'Главная', hint: 'File-based routing'},
              {type: 'file', path: 'shop-nuxt/pages/catalog/[id].vue', role: 'Динамический маршрут', hint: ''},
            ],
          },
          {
            type: 'dir',
            path: 'shop-nuxt/components',
            role: 'Компоненты',
            children: [{type: 'file', path: 'shop-nuxt/components/ProductCard.vue', role: 'UI', hint: ''}],
          },
          {
            type: 'dir',
            path: 'shop-nuxt/server',
            role: 'Backend в том же репо',
            children: [{type: 'file', path: 'shop-nuxt/server/api/orders.ts', role: 'API route', hint: 'Nitro handler'}],
          },
        ],
      },
    ],
  },
  {
    id: 'enterprise-amd',
    label: 'Enterprise (AMD)',
    toolchain: 'RequireJS · sandbox · event bus',
    tree: [
      {
        type: 'dir',
        path: 'bpm-suite',
        children: [
          {type: 'file', path: 'bpm-suite/conf/require-config.js', role: 'AMD paths', hint: 'baseUrl, shim, bundles'},
          {
            type: 'dir',
            path: 'bpm-suite/Schema',
            role: 'Модули платформы',
            children: [
              {type: 'file', path: 'bpm-suite/Schema/UserSection/', role: 'AMD-модуль', hint: 'define([deps], factory)'},
              {type: 'file', path: 'bpm-suite/Schema/Reports/', role: 'Lazy load', hint: 'require([...], callback) по маршруту'},
            ],
          },
          {type: 'file', path: 'bpm-suite/sandbox.js', role: 'Песочница', hint: 'publish / subscribe, изоляция модулей'},
          {type: 'file', path: 'bpm-suite/package.json', role: 'Современные deps', hint: 'Смешение AMD + npm в миграции'},
        ],
      },
    ],
  },
];

export const BUILD_STEPS = [
  {
    id: 'source',
    label: 'Исходники',
    cmd: 'src/**/*.tsx  import { x } from "./module"',
    detail: 'ESM-импорты образуют статический граф. TypeScript проверяет типы до сборки.',
  },
  {
    id: 'resolve',
    label: 'Разрешение',
    cmd: 'npm install  →  node_modules/react@18.2.0',
    detail: 'Сборщик читает package.json и связывает import "react" с файлом в node_modules.',
  },
  {
    id: 'transform',
    label: 'Трансформация',
    cmd: 'esbuild / Babel: TS→JS, JSX→React.createElement',
    detail: 'Синтаксис приводится к целевым браузерам; плагины обрабатывают CSS, assets.',
  },
  {
    id: 'bundle',
    label: 'Бандл',
    cmd: 'dist/assets/index-a1b2c3.js  (main chunk)',
    detail: 'Обязательные модули попадают в main. Rollup/Webpack/Vite объединяют граф в файлы.',
  },
  {
    id: 'split',
    label: 'Code splitting',
    cmd: 'import("./reports")  →  reports.chunk.js',
    detail: 'Динамический import() выносит код в отдельный чанк; загрузка по маршруту или клику.',
  },
  {
    id: 'ship',
    label: 'Доставка',
    cmd: 'index.html  <script type="module" src="/assets/index.js">',
    detail: 'Браузер грузит HTML, затем main, по требованию — lazy chunks. Tree-shaking убирает неиспользуемый export.',
  },
];

export const MODULE_SYSTEMS = [
  {
    id: 'esm',
    label: 'ES Modules',
    era: '2015+ · стандарт',
    color: '#10b981',
    syntax: `// profile.js
export function fetchUser(id) { ... }

// main.js
import { fetchUser } from './profile.js';
const mod = await import('./lazy.js');`,
    traits: ['Статический import', 'Tree-shaking', 'Нативно в браузере', 'import() для lazy'],
    tools: 'Vite, Rollup, Webpack 5, Node ("type": "module")',
    use: 'React, Vue, Angular, современный Node',
  },
  {
    id: 'cjs',
    label: 'CommonJS',
    era: 'Node.js legacy',
    color: '#3b82f6',
    syntax: `// math.js
module.exports = { add: (a,b) => a+b };

// app.js
const { add } = require('./math');`,
    traits: ['Синхронный require', 'Кэш модуля', 'Без tree-shaking "из коробки"', 'Файл = модуль'],
    tools: 'Node (по умолчанию), Browserify, старый Webpack',
    use: 'Старые пакеты npm, скрипты Node, .cjs',
  },
  {
    id: 'amd',
    label: 'AMD',
    era: 'Браузер до ESM',
    color: '#f59e0b',
    syntax: `define(['dep'], function(dep) {
  return { run: () => dep.init() };
});
require(['module'], function(M) { M.run(); });`,
    traits: ['Асинхронная загрузка', 'RequireJS, r.js', 'Плагины CSS/JSON', 'Enterprise legacy'],
    tools: 'RequireJS, Sencha Cmd, SAPUI5, Creatio/BPMSoft',
    use: 'Корпоративные CRM/BPM без полной миграции',
  },
];

export function flattenArchFiles(tree, acc = []) {
  for (const node of tree) {
    if (node.type === 'file') acc.push(node);
    if (node.children) flattenArchFiles(node.children, acc);
  }
  return acc;
}

export function getArchPreset(id) {
  return ARCH_PRESETS.find((p) => p.id === id) ?? ARCH_PRESETS[0];
}

/** Какие рёбра исчезают при отключении lazy-модуля reports. */
export function activeDepEdges(enabledNodeIds) {
  return DEP_EDGES.filter(([from, to]) => enabledNodeIds.has(from) && enabledNodeIds.has(to));
}

export function defaultEnabledNodes() {
  return new Set(DEP_NODES.map((n) => n.id));
}

export function bundleSummary(enabledNodeIds) {
  const hasReports = enabledNodeIds.has('reports');
  const npmCount = DEP_NODES.filter((n) => n.type === 'npm' && enabledNodeIds.has(n.id)).length;
  const chunks = hasReports
    ? ['main.js (~180 KB)', 'reports.chunk.js (~95 KB)']
    : ['main.js (~140 KB)'];
  return {chunks, hasReports, npmCount};
}
