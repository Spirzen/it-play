/** Учебная модель DOM для демо "JS ↔ HTML" (статья 102). */

export const NODE_META = {
  document: {label: '#document', kind: 'root'},
  html: {label: 'html', kind: 'element'},
  head: {label: 'head', kind: 'element'},
  title: {label: 'title', kind: 'element', text: 'Моя страница'},
  body: {label: 'body', kind: 'element'},
  pageHeader: {label: 'header#pageHeader', kind: 'element', tag: 'header', id: 'pageHeader', text: 'Заголовок страницы'},
  main: {label: 'main#main-content', kind: 'element', tag: 'main', id: 'main-content'},
  p1: {label: 'p.lead', kind: 'element', tag: 'p', classes: ['lead'], text: 'Первый абзац'},
  p2: {label: 'p.lead', kind: 'element', tag: 'p', classes: ['lead'], text: 'Второй абзац'},
  myButton: {label: 'button#myButton', kind: 'element', tag: 'button', id: 'myButton', classes: ['action-btn'], text: 'Нажми меня'},
  btn2: {label: 'button.action-btn', kind: 'element', tag: 'button', classes: ['action-btn'], text: 'Вторая кнопка'},
  wrapper: {label: 'div.wrapper', kind: 'element', tag: 'div', classes: ['wrapper']},
  target1: {label: 'span.target', kind: 'element', tag: 'span', classes: ['target'], text: 'Текст'},
  target2: {label: 'span.target', kind: 'element', tag: 'span', classes: ['target'], text: 'Ещё текст'},
};

export const DOM_TREE = {
  id: 'document',
  children: [
    {
      id: 'html',
      children: [
        {id: 'head', children: [{id: 'title'}]},
        {
          id: 'body',
          children: [
            {id: 'pageHeader'},
            {
              id: 'main',
              children: [
                {id: 'p1'},
                {id: 'p2'},
                {id: 'myButton'},
                {id: 'btn2'},
                {id: 'wrapper', children: [{id: 'target1'}, {id: 'target2'}]},
              ],
            },
          ],
        },
      ],
    },
  ],
};

export const SCRIPT_SCENARIOS = [
  {
    id: 'head-early',
    label: 'Скрипт в <head>',
    hint: 'Скрипт выполняется до появления кнопки в DOM — getElementById вернёт null.',
    steps: [
      {label: 'Парсинг <head>', done: true},
      {label: 'Выполнение <script>', done: true, active: true},
      {label: 'getElementById("myButton") → null', done: true, warn: true},
      {label: 'Парсинг <body> и кнопки', done: false},
    ],
    code: `// в <head>, до <body>\nconst el = document.getElementById('myButton');\nconsole.log(el); // null`,
    result: null,
    resultLabel: 'null',
  },
  {
    id: 'body-end',
    label: 'Скрипт в конце body',
    hint: 'HTML уже разобран — элемент существует, ссылка на объект кнопки.',
    steps: [
      {label: 'Парсинг всего HTML', done: true},
      {label: 'Создана кнопка #myButton', done: true},
      {label: 'Выполнение <script> внизу body', done: true, active: true},
      {label: 'getElementById → объект HTMLButtonElement', done: true, ok: true},
    ],
    code: `// после разметки\nconst el = document.getElementById('myButton');\nconsole.log(el); // HTMLButtonElement`,
    result: 'myButton',
    resultLabel: 'HTMLButtonElement { id: "myButton" }',
  },
  {
    id: 'defer',
    label: 'defer в head',
    hint: 'Скрипт откладывается до полного разбора документа — результат как у скрипта в конце body.',
    steps: [
      {label: 'Парсинг HTML (скрипт загружается, не выполняется)', done: true},
      {label: 'DOM готов', done: true},
      {label: 'Выполнение отложенного скрипта', done: true, active: true},
      {label: 'getElementById → объект кнопки', done: true, ok: true},
    ],
    code: `<script src="app.js" defer></script>\n// выполнится после разбора DOM`,
    result: 'myButton',
    resultLabel: 'HTMLButtonElement { id: "myButton" }',
  },
];

export const QUERY_PRESETS = [
  {
    id: 'byId',
    label: 'getElementById',
    code: "document.getElementById('myButton')",
    match: ['myButton'],
    returns: 'один элемент или null',
    hint: 'Самый быстрый поиск по уникальному id.',
  },
  {
    id: 'byClass',
    label: 'getElementsByClassName',
    code: "document.getElementsByClassName('action-btn')",
    match: ['myButton', 'btn2'],
    returns: 'живая HTMLCollection',
    hint: 'Все элементы с классом; коллекция обновляется при изменении DOM.',
  },
  {
    id: 'byTag',
    label: 'getElementsByTagName',
    code: "document.getElementsByTagName('p')",
    match: ['p1', 'p2'],
    returns: 'живая HTMLCollection',
    hint: 'Все теги <p> на странице.',
  },
  {
    id: 'queryOne',
    label: 'querySelector',
    code: "document.querySelector('.wrapper .target')",
    match: ['target1'],
    returns: 'первый элемент или null',
    hint: 'Любой CSS-селектор — первое совпадение.',
  },
  {
    id: 'queryAll',
    label: 'querySelectorAll',
    code: "document.querySelectorAll('.lead')",
    match: ['p1', 'p2'],
    returns: 'статический NodeList',
    hint: 'Все совпадения; список не "живой".',
  },
  {
    id: 'body',
    label: 'document.body',
    code: 'document.body',
    match: ['body'],
    returns: 'элемент <body>',
    hint: 'Прямой доступ к телу документа без поиска.',
  },
];

export const DOCUMENT_PROPS = [
  {key: 'document.body', nodeId: 'body', desc: 'контейнер видимой страницы'},
  {key: 'document.title', value: '"Моя страница"', desc: 'текст из <title>'},
  {key: 'document.documentElement', nodeId: 'html', desc: 'корневой <html>'},
  {key: 'document.head', nodeId: 'head', desc: 'секция <head>'},
];

export const MODIFY_ACTIONS = [
  {
    id: 'text',
    label: 'textContent',
    code: (id) => `el.textContent = '…';`,
    apply: (nodeId, state) => ({
      ...state,
      overrides: {...state.overrides, [nodeId]: {...state.overrides[nodeId], text: 'Текст изменён из JS'}},
    }),
  },
  {
    id: 'style',
    label: 'style.color',
    code: () => `el.style.color = 'blue';`,
    apply: (nodeId, state) => ({
      ...state,
      styles: {...state.styles, [nodeId]: {...state.styles[nodeId], color: '#1565c0'}},
    }),
  },
  {
    id: 'class',
    label: 'classList.add',
    code: () => `el.classList.add('highlighted');`,
    apply: (nodeId, state) => ({
      ...state,
      extraClasses: {...state.extraClasses, [nodeId]: [...(state.extraClasses[nodeId] || []), 'highlighted']},
    }),
  },
];

/** Путь от document до узла (для подсветки цепочки). */
export function getPathToNode(targetId, tree = DOM_TREE, path = []) {
  const next = [...path, tree.id];
  if (tree.id === targetId) {
    return next;
  }
  for (const child of tree.children || []) {
    const found = getPathToNode(targetId, child, next);
    if (found) {
      return found;
    }
  }
  return null;
}

export function getNodeText(nodeId, overrides = {}) {
  if (overrides[nodeId]?.text) {
    return overrides[nodeId].text;
  }
  return NODE_META[nodeId]?.text || '';
}

export function getNodeClasses(nodeId, extraClasses = {}) {
  const base = NODE_META[nodeId]?.classes || [];
  const extra = extraClasses[nodeId] || [];
  return [...base, ...extra];
}
