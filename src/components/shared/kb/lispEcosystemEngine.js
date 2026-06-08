/** Данные для LispEcosystemPlay — статья 5-16-starye-yazyki/Lisp/3. */

export const TABS = [
  {id: 'stack', label: 'Слои экосистемы'},
  {id: 'deps', label: 'Граф систем ASDF'},
  {id: 'structure', label: 'Структура приложения'},
  {id: 'eval', label: 'Цикл REPL / eval'},
  {id: 'systems', label: 'Загрузка и пакеты'},
];

export const ECOSYSTEM_LAYERS = [
  {
    id: 'impl',
    tag: 'Реализация',
    label: 'SBCL · CCL · ECL',
    color: '#662d91',
    icon: 'λ',
    items: ['ANSI Common Lisp', 'REPL · образ (image)', 'компиляция в FASL'],
    detail:
      'Интерпретатор/компилятор загружает .lisp и .asd, держит "живой" образ: функции переопределяются без перезапуска процесса. SBCL — самый частый выбор в курсе.',
  },
  {
    id: 'language',
    tag: 'Язык',
    label: 'S-выражения · CLOS · условия',
    color: '#7c3aed',
    icon: '◉',
    items: ['read · eval · print', 'макросы · quote', 'пакеты · gensym', 'condition/restart'],
    detail:
      'Код и данные — одни и те же списки (гомоиконичность). Пакет — пространство имён символов; макросы расширяют язык до компиляции. Система условий — не только try/catch, но и рестарты.',
  },
  {
    id: 'asdf',
    tag: 'ASDF',
    label: 'Системы и зависимости',
    color: '#10b981',
    icon: '📦',
    items: ['.asd · :depends-on', 'asdf:load-system', 'компоненты :file :module'],
    detail:
      'ASDF описывает систему (библиотеку/приложение) как дерево компонентов и зависимостей. load-system подтягивает транзитивные системы в правильном порядке.',
  },
  {
    id: 'quicklisp',
    tag: 'Quicklisp',
    label: 'Дистрибутив библиотек',
    color: '#06b6d4',
    icon: '🌐',
    items: ['(ql:quickload ...)', 'dist · версии', 'local-projects/'],
    detail:
      'Менеджер, как Bundler/cargo для CL: скачивает системы с зеркала, кладёт в ~/quicklisp. Свои проекты — в local-projects/ или через git в :defsystem-depends-on.',
  },
  {
    id: 'frameworks',
    tag: 'Фреймворки',
    label: 'Веб · GUI · утилиты',
    color: '#f59e0b',
    icon: '⚙',
    items: ['Clack · Hunchentoot', 'Caveman2 · Ningle', 'McCLIM · Lparallel'],
    detail:
      'Фреймворк задаёт каркас: маршруты, middleware, шаблоны, ORM-обёртки. Clack — общий HTTP-слой (как Rack); поверх него — Hunchentoot, Ningle, Caveman2.',
  },
  {
    id: 'app',
    tag: 'Приложение',
    label: 'Ваш код',
    color: '#6366f1',
    icon: '🏗',
    items: ['src/ · main.lisp', 'routes · handlers', 'models · jobs', 'tests/'],
    detail:
      'Прикладная логика в пакетах вашей системы ASDF. Точка входа — main или server.lisp; зависимости объявляются в .asd, а не только через require.',
  },
];

export const DEP_NODES = [
  {id: 'main', label: 'shop/main.lisp', type: 'app', x: 210, y: 22},
  {id: 'routes', label: 'routes.lisp', type: 'module', x: 70, y: 88},
  {id: 'handlers', label: 'handlers.lisp', type: 'module', x: 210, y: 88},
  {id: 'jobs', label: 'jobs.lisp', type: 'lazy', x: 350, y: 88},
  {id: 'shop-sys', label: ':shop (asd)', type: 'system', x: 55, y: 175},
  {id: 'caveman', label: 'caveman2', type: 'system', x: 145, y: 175},
  {id: 'clack', label: 'clack', type: 'system', x: 235, y: 175},
  {id: 'postmodern', label: 'postmodern', type: 'system', x: 325, y: 175},
  {id: 'lparallel', label: 'lparallel', type: 'system', x: 395, y: 175},
];

export const DEP_EDGES = [
  ['main', 'routes'],
  ['main', 'handlers'],
  ['main', 'jobs'],
  ['routes', 'shop-sys'],
  ['handlers', 'shop-sys'],
  ['handlers', 'caveman'],
  ['jobs', 'lparallel'],
  ['jobs', 'shop-sys'],
  ['shop-sys', 'caveman'],
  ['caveman', 'clack'],
  ['caveman', 'postmodern'],
  ['handlers', 'postmodern'],
  ['jobs', 'postmodern'],
];

export const NODE_TYPE_META = {
  app: {label: 'Точка входа', stroke: '#6366f1'},
  module: {label: 'Исходники приложения', stroke: '#10b981'},
  lazy: {label: 'Фон / async', stroke: '#f59e0b', dash: '6 4'},
  system: {label: 'ASDF / Quicklisp', stroke: '#662d91'},
};

export const ARCH_PRESETS = [
  {
    id: 'library',
    label: 'Библиотека (ASDF)',
    toolchain: 'ASDF · пакет :my-lib · без Quicklisp в runtime',
    tree: [
      {
        type: 'dir',
        path: 'my-lib',
        children: [
          {type: 'file', path: 'my-lib/my-lib.asd', role: 'Система', hint: ':defsystem "my-lib" :depends-on (:alexandria) :components ((:file "package") (:file "core"))'},
          {type: 'file', path: 'my-lib/src/package.lisp', role: 'Пакет', hint: '(defpackage :my-lib ... (:export #:normalize)) — пространство имён'},
          {type: 'file', path: 'my-lib/src/core.lisp', role: 'Код', hint: '(in-package :my-lib) (defun normalize ...))'},
          {type: 'file', path: 'my-lib/tests/tests.lisp', role: 'FiveAM / RT', hint: 'asdf:load-system :my-lib/test — отдельная система в .asd'},
        ],
      },
    ],
  },
  {
    id: 'hunchentoot',
    label: 'Hunchentoot (минимальный веб)',
    toolchain: 'Clack · Hunchentoot · ASDF · ql:quickload',
    tree: [
      {
        type: 'dir',
        path: 'notes-api',
        children: [
          {type: 'file', path: 'notes-api/notes-api.asd', role: 'Система', hint: ':depends-on (:clack :hunchentoot :jonathan)'},
          {type: 'file', path: 'notes-api/src/package.lisp', role: 'Пакет', hint: '(defpackage :notes-api ... (:use :cl :hunchentoot))'},
          {type: 'file', path: 'notes-api/src/server.lisp', role: 'Старт', hint: "(clack:clackup #'app) — Clack оборачивает handler"},
          {type: 'file', path: 'notes-api/src/routes.lisp', role: 'Маршруты', hint: 'defroute "/notes" () ... — декларативные GET/POST'},
          {type: 'file', path: 'notes-api/src/handlers.lisp', role: 'Обработчики', hint: 'JSON через jonathan; бизнес-логика без HTML'},
        ],
      },
    ],
  },
  {
    id: 'caveman2',
    label: 'Caveman2 (полный веб-стек)',
    toolchain: 'Caveman2 · Clack · DB · шаблоны · middleware',
    tree: [
      {
        type: 'dir',
        path: 'shop',
        children: [
          {type: 'file', path: 'shop/shop.asd', role: 'Система', hint: ':depends-on (:caveman2 :cl-postgres :drakma)'},
          {type: 'file', path: 'shop/main.lisp', role: 'Точка входа', hint: '(shop:main) — запуск сервера из образа'},
          {type: 'file', path: 'shop/routes.lisp', role: 'Маршруты', hint: '@route GET "/items/:id" — макросы Caveman'},
          {
            type: 'dir',
            path: 'shop/models',
            role: 'Модели',
            children: [
              {type: 'file', path: 'shop/models/article.lisp', role: 'defmodel', hint: 'Active-record-подобный слой Caveman + SQL'},
            ],
          },
          {
            type: 'dir',
            path: 'shop/views',
            role: 'Шаблоны',
            children: [
              {type: 'file', path: 'shop/views/article/show.tmpl', role: 'HTML', hint: 'рендер через Clack middleware'},
            ],
          },
          {type: 'file', path: 'shop/jobs.lisp', role: 'Фон', hint: 'lparallel или bordeaux-threads — вне HTTP-запроса'},
        ],
      },
    ],
  },
  {
    id: 'mcclim',
    label: 'McCLIM (десктоп)',
    toolchain: 'McCLIM · ASDF · образ без веб-сервера',
    tree: [
      {
        type: 'dir',
        path: 'sketchpad',
        children: [
          {type: 'file', path: 'sketchpad/sketchpad.asd', role: 'Система', hint: ':depends-on (:mcclim :alexandria)'},
          {type: 'file', path: 'sketchpad/src/package.lisp', role: 'Пакет', hint: 'GUI-приложение: пакет :sketchpad'},
          {type: 'file', path: 'sketchpad/src/app.lisp', role: 'main', hint: '(run-frame-top-level (make-application ...))'},
          {type: 'file', path: 'sketchpad/src/panes.lisp', role: 'UI', hint: 'pane-layout, draw-line — логика отделена от domain'},
          {type: 'file', path: 'sketchpad/src/commands.lisp', role: 'Команды', hint: 'presenter/command pattern в CLIM'},
        ],
      },
    ],
  },
];

export const EVAL_STEPS = [
  {
    id: 'read',
    label: 'READ',
    cmd: '(read)  ; текст → S-выражение\n\'(unless (> x 10) (print "small"))',
    detail: 'Читатель парсит поток в дерево cons-ячеек и атомов. Синтаксис — префиксные списки; запятая — шорткат для eval.',
    activePhases: ['read'],
    highlight: ['read'],
  },
  {
    id: 'macro',
    label: 'MACROEXPAND',
    cmd: '(macroexpand-1 \'(unless (> x 10) (print "small")))\n=> (IF (NOT (> X 10)) (PROGN (PRINT "small")))',
    detail: 'Макросы раскрываются до eval. Пользовательские defmacro расширяют язык без патча компилятора.',
    activePhases: ['read', 'macro'],
    highlight: ['macro'],
  },
  {
    id: 'eval',
    label: 'EVAL',
    cmd: '; специальная форма → свои правила\n; иначе: eval функции, eval аргументов, funcall\n(if (not (> x 10)) (progn (print "small")))',
    detail: 'Окружение связывает символы со значениями. lambda создаёт замыкание; quote останавливает вычисление.',
    activePhases: ['read', 'macro', 'eval', 'package'],
    highlight: ['eval', 'package'],
  },
  {
    id: 'print',
    label: 'PRINT',
    cmd: '*  ; результат в * и в REPL\n"small"   ; или #<UNBOUND> при ошибке → condition',
    detail: 'Результат печатается; при condition срабатывает handler-case / invoke-restart без обязательного падения образа.',
    activePhases: ['read', 'macro', 'eval', 'package', 'print'],
    highlight: ['print'],
  },
];

export const REPL_PHASES = [
  {id: 'read', label: 'READ'},
  {id: 'macro', label: 'MACROEXPAND'},
  {id: 'package', label: 'Пакет *PACKAGE*'},
  {id: 'eval', label: 'EVAL'},
  {id: 'print', label: 'PRINT'},
];

export const SYSTEM_LOADERS = [
  {
    id: 'load',
    label: 'load / require',
    era: 'Встроено',
    color: '#f59e0b',
    syntax: `(load "src/helper.lisp")
(require :json)   ; система из образа

; Порядок load важен; без .asd — только файлы`,
    traits: ['Синхронно', 'Один образ', 'Без lock-файла', 'Подходит для скриптов'],
    tools: 'sbcl --script file.lisp',
    use: 'Одноразовые скрипты, прототип в REPL',
  },
  {
    id: 'asdf',
    label: 'ASDF',
    era: 'Стандарт проекта',
    color: '#662d91',
    syntax: `;; shop.asd
(defsystem "shop"
  :depends-on (:caveman2 :cl-postgres)
  :components ((:module "src"
                 :components ((:file "package")
                              (:file "main")))))

(asdf:load-system :shop)`,
    traits: ['Транзитивные :depends-on', 'Версии :version', 'Отдельные test-системы', 'В образе и CI'],
    tools: 'asdf:load-system · make · deploy',
    use: 'Любое приложение и библиотека на CL',
  },
  {
    id: 'quicklisp',
    label: 'Quicklisp',
    era: 'Сторонние системы',
    color: '#06b6d4',
    syntax: `(ql:quickload :hunchentoot)
(ql:quickload :postmodern)

;; local-projects/shop/ — ваша система
;; ql:update-all-dists — обновление зеркала`,
    traits: ['~4000 систем', 'dist с версиями', 'ql:bundle для деплоя', 'Не смешивать с ручным load без нужды'],
    tools: 'quicklisp setup · ql:quickload',
    use: 'Hunchentoot, Drakma, Alexandria — всё из репозитория',
  },
];

export const FRAMEWORK_COMPARE = [
  {id: 'hunchentoot', label: 'Hunchentoot', color: '#662d91', mvp: 4, maintain: 3, boot: 'образ + ql', fit: 'REST, учебные API'},
  {id: 'ningle', label: 'Ningle', color: '#3b82f6', mvp: 5, maintain: 2, boot: 'минимум слоёв', fit: 'микросервисы, API'},
  {id: 'caveman2', label: 'Caveman2', color: '#f59e0b', mvp: 3, maintain: 4, boot: 'генератор проекта', fit: 'MVC, CRUD, шаблоны'},
  {id: 'mcclim', label: 'McCLIM', color: '#10b981', mvp: 2, maintain: 4, boot: 'GUI-образ', fit: 'десктоп, внутренние tools'},
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

export function activeDepEdges(enabledNodeIds) {
  return DEP_EDGES.filter(([from, to]) => enabledNodeIds.has(from) && enabledNodeIds.has(to));
}

export function defaultEnabledNodes() {
  return new Set(DEP_NODES.map((n) => n.id));
}

export function bundleSummary(enabledNodeIds) {
  const hasJobs = enabledNodeIds.has('jobs');
  const sysCount = DEP_NODES.filter((n) => n.type === 'system' && enabledNodeIds.has(n.id)).length;
  const load = hasJobs
    ? 'Образ ~45 МБ (Caveman2 + Postmodern + lparallel)'
    : 'Образ ~32 МБ (без фоновых jobs)';
  return {load, hasJobs, sysCount};
}
