/** Данные и логика для демо "Фреймворк". */

export const FRAMEWORK = {
  name: 'MiniWeb',
  version: '2.4.0',
  tagline: 'Минимальный веб-фреймворк (аналог Express / ASP.NET MVC)',
  provides: [
    {name: 'HTTP-сервер', desc: 'слушает порт, парсит запросы'},
    {name: 'Router', desc: 'сопоставляет URL и метод с обработчиком'},
    {name: 'Middleware', desc: 'цепочка до/после вашего кода'},
    {name: 'CLI', desc: 'create-miniweb-app, миграции'},
  ],
};

export const VIEW_MODES = {
  library: {
    id: 'library',
    label: 'Библиотека',
    hint: 'Вы управляете программой и сами вызываете функции библиотеки.',
    controlLabel: 'Вы звоните библиотеке',
    flow: [
      {id: 'app', label: 'Ваш app.js', role: 'main'},
      {id: 'lib', label: 'lodash', role: 'lib'},
    ],
    arrow: 'вызывает →',
  },
  framework: {
    id: 'framework',
    label: 'Фреймворк',
    hint: 'Фреймворк управляет циклом запросов и "звонит" вашему коду в нужный момент.',
    controlLabel: 'Фреймворк звонит вам',
    flow: [
      {id: 'fw', label: 'MiniWeb', role: 'framework'},
      {id: 'handler', label: 'routes/posts.js', role: 'yours'},
    ],
    arrow: 'вызывает →',
  },
};

export const PROJECT_FILES = [
  {path: 'package.json', type: 'config'},
  {path: 'src/server.js', type: 'bootstrap'},
  {path: 'src/routes/posts.js', type: 'yours'},
  {path: 'src/controllers/PostController.js', type: 'yours'},
  {path: 'src/models/Post.js', type: 'yours'},
  {path: 'src/config/app.config.js', type: 'config'},
  {path: 'node_modules/miniweb-framework/', type: 'fw', children: ['Router', 'HttpServer', 'cli']},
];

export const FRAMEWORK_STEPS = [
  {
    id: 'scaffold',
    short: 'Каркас',
    title: 'Шаблон проекта',
    description:
      'CLI фреймворка создаёт готовую структуру папок, точку входа и конфигурацию. Вы не проектируете HTTP-сервер с нуля — только наполняете каркас.',
    terminal: ['$ npx create-miniweb-app mini-blog', '✓ routes/  controllers/  models/  config/', '✓ src/server.js — точка входа'],
    highlightFiles: ['package.json', 'src/server.js', 'node_modules/miniweb-framework/'],
    codeFile: 'package.json',
    requestFlow: null,
    insight:
      'Фреймворк задаёт "философию": где лежат маршруты, как называются слои MVC, как запускать dev-сервер.',
  },
  {
    id: 'route',
    short: 'Маршрут',
    title: 'Ваш код в каркасе',
    description:
      'Разработчик описывает, что делать при GET /api/posts. Цикл listen→parse→route→respond остаётся внутри MiniWeb — вы только регистрируете обработчик.',
    terminal: null,
    highlightFiles: ['src/routes/posts.js', 'src/controllers/PostController.js'],
    codeFile: 'src/routes/posts.js',
    requestFlow: null,
    insight:
      'Это инверсия управления: не вы вызываете router.handle(), а фреймворк вызывает вашу функцию, когда URL совпал.',
  },
  {
    id: 'request',
    short: 'Запрос',
    title: 'Входящий HTTP-запрос',
    description:
      'Браузер или клиент шлёт GET /api/posts. Фреймворк принимает соединение, проходит middleware и находит ваш обработчик.',
    terminal: ['GET /api/posts HTTP/1.1', 'Host: localhost:3000', '→ Router: match posts.list'],
    highlightFiles: ['src/server.js', 'src/routes/posts.js'],
    codeFile: 'src/server.js',
    requestFlow: ['browser', 'router', 'handler'],
    insight: 'Поток выполнения контролирует фреймворк; вы дополняете его точками расширения.',
  },
  {
    id: 'response',
    short: 'Ответ',
    title: 'Ответ клиенту',
    description:
      'Обработчик возвращает данные; фреймворк сериализует JSON, выставляет заголовки и закрывает соединение по правилам HTTP.',
    terminal: ['HTTP/1.1 200 OK', 'Content-Type: application/json', '{"posts":[{"id":1,"title":"Привет"}]}'],
    highlightFiles: ['src/routes/posts.js'],
    codeFile: 'src/routes/posts.js',
    requestFlow: ['handler', 'router', 'browser'],
    insight:
      'Тот же каркас масштабируется: добавляете файлы в routes/, models/ — структура остаётся узнаваемой для всей команды.',
  },
];

export const CODE_SNIPPETS = {
  'package.json': `{
  "name": "mini-blog",
  "scripts": { "dev": "miniweb dev", "start": "miniweb start" },
  "dependencies": {
    "miniweb-framework": "^2.4.0"
  }
}`,
  'src/server.js': `// Точка входа — запускает фреймворк (вы не пишете цикл HTTP)
import { createApp } from 'miniweb-framework';
import { postRoutes } from './routes/posts.js';

const app = createApp();
app.use('/api/posts', postRoutes);
app.listen(3000);  // MiniWeb: listen → parse → route → respond`,
  'src/routes/posts.js': `// ВАШ код: фреймворк вызовет listPosts при GET /api/posts
import { Post } from '../models/Post.js';

export const postRoutes = {
  'GET /': async (req, res) => {
    const posts = await Post.findAll();
    res.json(posts);  // MiniWeb отправит ответ клиенту
  },
};`,
};

export const LIBRARY_SNIPPETS = {
  'src/app.js': `// ВЫ управляете порядком выполнения
import { capitalize, chunk } from 'lodash';

const title = capitalize('привет');
const parts = chunk([1, 2, 3, 4], 2);
console.log(title, parts);
// Программа сама решает, когда вызвать библиотеку`,
};

export const SAMPLE_RESPONSE = {
  posts: [
    {id: 1, title: 'Что такое фреймворк'},
    {id: 2, title: 'Инверсия управления'},
  ],
};

export function runFrameworkRequest() {
  return {
    lines: [
      '→ MiniWeb: HTTP GET /api/posts',
      '→ Router: posts.list (ваш обработчик)',
      '→ Post.findAll() → 2 записи',
      '← 200 application/json',
      JSON.stringify(SAMPLE_RESPONSE, null, 2),
    ],
  };
}

export function runLibrarySample(input) {
  const s = String(input || '').trim() || 'привет';
  const cap = s.charAt(0).toUpperCase() + s.slice(1);
  return {
    lines: [
      'import { capitalize } from "lodash"',
      `capitalize("${s}") → "${cap}"`,
      'chunk([1,2,3,4], 2) → [[1,2],[3,4]]',
    ],
  };
}
