/** Данные для JavaScriptRuntimePlay — статья 5-01-javascript/14. */

export const ECOSYSTEM_AREAS = [
  {
    id: 'frontend',
    icon: '🌐',
    label: 'Веб-фронтенд',
    tools: 'Vanilla JS, React, Vue, Angular',
    summary: 'Интерфейс, логика взаимодействия, анимации.',
    runtime: 'Браузер + Web APIs',
    color: '#264de4',
  },
  {
    id: 'backend',
    icon: '⚙️',
    label: 'Веб-бэкенд',
    tools: 'Node.js, Express, NestJS',
    summary: 'Серверная логика, API, работа с БД.',
    runtime: 'Node.js (V8) + libuv',
    color: '#339933',
  },
  {
    id: 'mobile',
    icon: '📱',
    label: 'Мобильные приложения',
    tools: 'React Native, Ionic, Expo',
    summary: 'Один код — iOS и Android.',
    runtime: 'JS-движок + нативный мост',
    color: '#61dafb',
  },
  {
    id: 'desktop',
    icon: '🖥️',
    label: 'Десктоп',
    tools: 'Electron, Tauri, NW.js',
    summary: 'Программы для Windows, macOS, Linux.',
    runtime: 'Chromium/WebView + Node',
    color: '#47848f',
  },
  {
    id: 'games',
    icon: '🎮',
    label: 'Игры',
    tools: 'Phaser, Three.js, Babylon.js',
    summary: 'Браузерные и лёгкие мобильные игры.',
    runtime: 'Canvas / WebGL',
    color: '#e44d26',
  },
  {
    id: 'iot',
    icon: '🔌',
    label: 'IoT',
    tools: 'Johnny-Five, Espruino',
    summary: 'Скрипты для микроконтроллеров и Raspberry Pi.',
    runtime: 'Ограниченный JS на "железе"',
    color: '#f7df1e',
  },
  {
    id: 'automation',
    icon: '🤖',
    label: 'Автоматизация',
    tools: 'Puppeteer, Cypress, Selenium',
    summary: 'Тестирование, парсинг, боты, DevOps-скрипты.',
    runtime: 'Node.js + headless browser',
    color: '#7c3aed',
  },
];

export const BROWSER_PIPELINE = [
  {
    id: 'html',
    label: 'Парсинг HTML',
    short: 'DOM',
    detail:
      'Браузер читает разметку сверху вниз и строит DOM — дерево узлов. Скрипт без async/defer может прервать парсинг.',
    preview: {dom: true, cssom: false, js: false, render: false, layout: false, paint: false, composite: false},
    blocking: false,
  },
  {
    id: 'css',
    label: 'Парсинг CSS',
    short: 'CSSOM',
    detail:
      'Параллельно обрабатываются <style> и <link rel="stylesheet"> — строится CSSOM, дерево правил стилей.',
    preview: {dom: true, cssom: true, js: false, render: false, layout: false, paint: false, composite: false},
    blocking: false,
  },
  {
    id: 'js',
    label: 'Выполнение JavaScript',
    short: 'JS',
    detail:
      'Синхронный <script> приостанавливает парсинг HTML. Код может читать и менять DOM, регистрировать обработчики, вызывать fetch.',
    preview: {dom: true, cssom: true, js: true, render: false, layout: false, paint: false, composite: false},
    blocking: true,
    jsEffect: 'title',
  },
  {
    id: 'render-tree',
    label: 'Render Tree',
    short: 'Render',
    detail:
      'DOM и CSSOM объединяются: в дерево отрисовки попадают только видимые элементы (display:none и <script> исключаются).',
    preview: {dom: true, cssom: true, js: true, render: true, layout: false, paint: false, composite: false},
    blocking: false,
  },
  {
    id: 'layout',
    label: 'Layout (Reflow)',
    short: 'Layout',
    detail:
      'Вычисляются размеры и координаты каждого узла. Изменение width/height в JS запускает reflow — это дорого.',
    preview: {dom: true, cssom: true, js: true, render: true, layout: true, paint: false, composite: false},
    blocking: false,
  },
  {
    id: 'paint',
    label: 'Paint',
    short: 'Paint',
    detail:
      'Узлы превращаются в пиксели: цвета, текст, тени. Смена backgroundColor вызывает repaint без reflow.',
    preview: {dom: true, cssom: true, js: true, render: true, layout: true, paint: true, composite: false},
    blocking: false,
  },
  {
    id: 'composite',
    label: 'Composite',
    short: 'GPU',
    detail:
      'Слои с transform/will-change собираются на GPU. Анимация через transform — самый дешёвый путь.',
    preview: {dom: true, cssom: true, js: true, render: true, layout: true, paint: true, composite: true},
    blocking: false,
    compositeLayer: true,
  },
];

export const JS_IMPACTS = [
  {
    id: 'reflow',
    label: 'element.style.width',
    effect: 'Reflow',
    cost: 'high',
    hint: 'Меняет геометрию — пересчёт layout.',
  },
  {
    id: 'repaint',
    label: 'element.style.backgroundColor',
    effect: 'Repaint',
    cost: 'medium',
    hint: 'Цвет без изменения размеров — только paint.',
  },
  {
    id: 'composite',
    label: 'element.style.transform',
    effect: 'Composite',
    cost: 'low',
    hint: 'Отдельный GPU-слой — без reflow.',
  },
];

export const EVENT_LOOP_SCENARIOS = {
  basic: {
    label: 'A → C → B',
    code: `console.log("A");
setTimeout(() => console.log("B"), 0);
console.log("C");`,
    output: ['A', 'C', 'B'],
    steps: [
      {line: 0, action: 'sync', log: 'A', stack: ['(global)'], micro: [], macro: []},
      {line: 1, action: 'delegate', log: null, stack: ['(global)'], micro: [], macro: ['setTimeout → B'], webApi: 'Timer 0 ms'},
      {line: 2, action: 'sync', log: 'C', stack: ['(global)'], micro: [], macro: ['setTimeout → B']},
      {line: -1, action: 'macro', log: 'B', stack: ['callback B'], micro: [], macro: []},
    ],
  },
  micro: {
    label: 'A → D → C → B',
    code: `console.log("A");
setTimeout(() => console.log("B"), 0);
Promise.resolve().then(() => console.log("C"));
console.log("D");`,
    output: ['A', 'D', 'C', 'B'],
    steps: [
      {line: 0, action: 'sync', log: 'A', stack: ['(global)'], micro: [], macro: []},
      {line: 1, action: 'delegate', log: null, stack: ['(global)'], micro: [], macro: ['setTimeout → B'], webApi: 'Timer 0 ms'},
      {line: 2, action: 'enqueueMicro', log: null, stack: ['(global)'], micro: ['Promise.then → C'], macro: ['setTimeout → B']},
      {line: 3, action: 'sync', log: 'D', stack: ['(global)'], micro: ['Promise.then → C'], macro: ['setTimeout → B']},
      {line: -1, action: 'micro', log: 'C', stack: ['Promise.then'], micro: [], macro: ['setTimeout → B']},
      {line: -1, action: 'macro', log: 'B', stack: ['callback B'], micro: [], macro: []},
    ],
  },
};

export const ENGINES = [
  {name: 'V8', hosts: 'Chrome, Edge, Node.js', color: '#4285f4'},
  {name: 'SpiderMonkey', hosts: 'Firefox', color: '#ff7139'},
  {name: 'JavaScriptCore', hosts: 'Safari (WebKit)', color: '#006cff'},
];
