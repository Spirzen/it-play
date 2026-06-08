/** Данные для NimEcosystemPlay — статья 5-21-nim/3. */

export const TABS = [
  {id: 'stack', label: 'Слои экосистемы'},
  {id: 'deps', label: 'Граф зависимостей'},
  {id: 'structure', label: 'Структура приложения'},
  {id: 'build', label: 'Компиляция и сборка'},
  {id: 'modules', label: 'Модули и Nimble'},
];

export const ECOSYSTEM_LAYERS = [
  {
    id: 'compiler',
    tag: 'Компилятор',
    label: 'nim · бэкенды',
    color: '#eab308',
    icon: '⚙',
    items: ['nim c · nim r · nim js', 'C · C++ · ObjC · JS', 'AST · макросы · шаблоны'],
    detail:
      'Исходник → AST → раскрытие макросов и generics → генерация C/JS → внешний компилятор (GCC/Clang/Emscripten). Один .nim может стать нативным бинарником или JS без переписывания логики.',
  },
  {
    id: 'stdlib',
    tag: 'stdlib',
    label: 'Стандартная библиотека',
    color: '#f59e0b',
    icon: '📚',
    items: ['std/asyncdispatch', 'std/httpclient · json', 'std/options · results', 'ORC/ARC · threads'],
    detail:
      'Модули std/... входят с компилятором. async/await поверх epoll/kqueue/IOCP. options/results — явные ошибки без исключений. Память: ORC по умолчанию в Nim 2.x.',
  },
  {
    id: 'nimble',
    tag: 'Nimble',
    label: 'Пакеты и зависимости',
    color: '#10b981',
    icon: '📦',
    items: ['*.nimble · requires', 'nimble install · publish', 'nimble.paths · lock'],
    detail:
      'Каждый проект — пакет с манифестом. nimble install тянет зависимости с nimble.directory; версии фиксируются в lock-файле для воспроизводимых сборок.',
  },
  {
    id: 'tooling',
    tag: 'Инструменты',
    label: 'LSP · choosenim · NimScript',
    color: '#ec4899',
    icon: '🔧',
    items: ['nimlsp · nimsuggest', 'choosenim · nimpretty', 'config.nims · nim doc'],
    detail:
      'nimlsp — автодополнение и навигация в VS Code/Vim. choosenim переключает версии компилятора. config.nims и tasks в .nimble — скрипты сборки на NimScript.',
  },
  {
    id: 'frameworks',
    tag: 'Фреймворки',
    label: 'Веб · GUI · игры',
    color: '#06b6d4',
    icon: '🌐',
    items: ['Jester · Prologue', 'Karax · NimJS', 'pixie · godot-nim', 'norm · db_connector'],
    detail:
      'Jester/Prologue — HTTP и маршруты с макросами. Karax — SPA в браузер (nim js). ORM norm и FFI к C-библиотекам подключаются через nimble require.',
  },
  {
    id: 'app',
    tag: 'Приложение',
    label: 'Ваш код',
    color: '#6366f1',
    icon: '🏗',
    items: ['src/ · modules', 'routes · services', 'models · views', 'FFI · {.importc.}'],
    detail:
      'Файл .nim = модуль; import связывает слои. Типичная схема: HTTP → handlers → domain → store/FFI. Макросы генерируют маршруты, сериализацию, SQL.',
  },
];

export const DEP_NODES = [
  {id: 'main', label: 'src/main.nim', type: 'app', x: 200, y: 24},
  {id: 'routes', label: 'routes.nim', type: 'module', x: 70, y: 90},
  {id: 'service', label: 'services/', type: 'module', x: 200, y: 90},
  {id: 'worker', label: 'workers/', type: 'lazy', x: 330, y: 90},
  {id: 'jester', label: 'jester', type: 'nimble', x: 50, y: 168},
  {id: 'norm', label: 'norm', type: 'nimble', x: 130, y: 168},
  {id: 'checksums', label: 'checksums', type: 'nimble', x: 210, y: 168},
  {id: 'httpclient', label: 'std/httpclient', type: 'stdlib', x: 290, y: 168},
  {id: 'redis', label: 'redis', type: 'nimble', x: 360, y: 168},
];

export const DEP_EDGES = [
  ['main', 'routes'],
  ['main', 'service'],
  ['main', 'worker'],
  ['routes', 'jester'],
  ['routes', 'service'],
  ['service', 'norm'],
  ['service', 'checksums'],
  ['service', 'httpclient'],
  ['worker', 'redis'],
  ['worker', 'service'],
  ['worker', 'checksums'],
];

export const NODE_TYPE_META = {
  app: {label: 'Точка входа', stroke: '#6366f1'},
  module: {label: 'Модуль проекта', stroke: '#10b981'},
  lazy: {label: 'Фоновый worker', stroke: '#f59e0b', dash: '6 4'},
  nimble: {label: 'nimble require', stroke: '#ec4899'},
  stdlib: {label: 'std/...', stroke: '#eab308'},
};

export const ARCH_PRESETS = [
  {
    id: 'jester-api',
    label: 'REST + Jester',
    toolchain: 'nimble · Jester · norm · ORC',
    tree: [
      {
        type: 'dir',
        path: 'orders-api',
        children: [
          {
            type: 'file',
            path: 'orders-api/orders_api.nimble',
            role: 'Манифест',
            hint: 'requires "jester", "norm", "checksums"; bin = @["src/main"]',
          },
          {type: 'file', path: 'orders-api/config.nims', role: 'NimScript', hint: '--mm:orc -d:release; switch("backend", "c")'},
          {type: 'file', path: 'orders-api/src/main.nim', role: 'main', hint: 'import routes; serve() — точка входа'},
          {
            type: 'dir',
            path: 'orders-api/src',
            children: [
              {
                type: 'file',
                path: 'orders-api/src/routes.nim',
                role: 'HTTP',
                hint: 'макросы Jester: get "/orders": ...',
              },
              {
                type: 'file',
                path: 'orders-api/src/services/order_service.nim',
                role: 'Бизнес-логика',
                hint: 'import models; Result/Option для ошибок',
              },
              {
                type: 'file',
                path: 'orders-api/src/models/order.nim',
                role: 'Типы',
                hint: 'object Order; norm model macro → SQLite',
              },
            ],
          },
          {type: 'file', path: 'orders-api/tests/test_orders.nim', role: 'Тесты', hint: 'unittest; nim c -r tests/test_orders.nim'},
        ],
      },
    ],
  },
  {
    id: 'karax-spa',
    label: 'Karax SPA (JS)',
    toolchain: 'nim js · Karax · std/dom',
    tree: [
      {
        type: 'dir',
        path: 'dashboard',
        children: [
          {type: 'file', path: 'dashboard/dashboard.nimble', role: 'Манифест', hint: 'requires "karax"; task js: exec "nim js ..."'},
          {type: 'file', path: 'dashboard/src/app.nim', role: 'Karax App', hint: 'import karax / karax/server; Router, VNode'},
          {type: 'file', path: 'dashboard/src/views/dashboard.nim', role: 'Компоненты', hint: 'render → VNode; state в ref объектах'},
          {type: 'file', path: 'dashboard/src/api/client.nim', role: 'API', hint: 'std/httpclient или fetch через jsffi'},
          {type: 'file', path: 'dashboard/public/index.html', role: 'HTML shell', hint: '<script src="app.js"> — артефакт nim js'},
          {type: 'file', path: 'dashboard/nimcache/app.js', role: 'Сборка', hint: 'nim js -d:release src/app.nim → Emscripten/GCC не нужен'},
        ],
      },
    ],
  },
  {
    id: 'cli-ffi',
    label: 'CLI + FFI к C',
    toolchain: 'nim c · {.importc.} · static link',
    tree: [
      {
        type: 'dir',
        path: 'imgtool',
        children: [
          {type: 'file', path: 'imgtool/imgtool.nimble', role: 'Манифест', hint: 'requires "checksums"; skipDirs = @["nimcache"]'},
          {type: 'file', path: 'imgtool/src/main.nim', role: 'CLI', hint: 'import parseopt; dispatch subcommands'},
          {type: 'file', path: 'imgtool/src/lib/resize.nim', role: 'Логика', hint: 'export resize; used by main and tests'},
          {
            type: 'file',
            path: 'imgtool/src/lib/stb_ffi.nim',
            role: 'FFI',
            hint: '{.passC:"-Ivendor".} {.importc:"stbi_load".} proc stbiLoad(...)',
          },
          {type: 'file', path: 'imgtool/vendor/stb_image.h', role: 'C header', hint: 'линковка с nim c; один статический бинарник'},
        ],
      },
    ],
  },
];

export const BUILD_STEPS = [
  {
    id: 'source',
    label: 'Исходник',
    cmd: '# src/main.nim\nimport routes\nwhen isMainModule:\n  serve()',
    detail: 'Каждый .nim — модуль. import подтягивает публичные символы (export). Отступы задают блоки, как в Python.',
  },
  {
    id: 'parse',
    label: 'AST',
    cmd: 'nim check src/main.nim\n# nim dumpast routes.nim',
    detail: 'Лексер и парсер строят AST. nim check — семантика без полной линковки; dumpast показывает дерево после макросов.',
  },
  {
    id: 'macro',
    label: 'Макросы',
    cmd: '# compile-time: template, macro, generic\n# Jester генерирует proc для каждого маршрута',
    detail: 'Макросы и шаблоны меняют AST до codegen. DSL маршрутов, ORM, сериализация — без runtime-интерпретатора.',
  },
  {
    id: 'codegen',
    label: 'Codegen',
    cmd: 'nim c --backend:c src/main.nim\n# nim js / --backend:cpp',
    detail: 'Компилятор пишет nimcache/main.c (или .js). Выбор C/C++/ObjC/JS задаёт целевую платформу и ABI.',
  },
  {
    id: 'native',
    label: 'C-компилятор',
    cmd: 'gcc -o main nimcache/*.c -lm\n# или clang; кросс: --os:windows --cpu:amd64',
    detail: 'Nim вызывает GCC/Clang/MSVC. Кросс-компиляция через --os и --cpu. Отладка: GDB/LLDB по сгенерированному C.',
  },
  {
    id: 'ship',
    label: 'Nimble · деплой',
    cmd: 'nimble build -y\nnimble install -y\n# Docker: COPY bin/main',
    detail: 'nimble build запускает задачи из .nimble. Итог — автономный бинарник или app.js; зависимости зафиксированы в lock.',
  },
];

export const PACKAGE_MODELS = [
  {
    id: 'file',
    label: 'Один модуль',
    era: 'Скрипт · утилита',
    color: '#eab308',
    syntax: `# hello.nim
proc main() =
  echo "hello"

when isMainModule:
  main()`,
    traits: ['Файл = модуль', 'nim r hello.nim', 'Без .nimble для прототипа'],
    tools: 'nim c · nim r · choosenim',
    use: 'Учебные примеры, однофайловые CLI',
  },
  {
    id: 'project',
    label: 'src/ + import',
    era: 'Сервис · библиотека',
    color: '#10b981',
    syntax: `# src/routes.nim
import services/order_service
export getOrders

# src/main.nim
import routes
when isMainModule: serve()`,
    traits: ['import vs import except', 'export открывает API модуля', 'Префиксы: http.get → модуль.символ'],
    tools: 'nim c src/main.nim · nim check',
    use: 'Веб-сервисы, многофайловые приложения',
  },
  {
    id: 'nimble',
    label: 'Пакет Nimble',
    era: 'Публикуемая зависимость',
    color: '#8b5cf6',
    syntax: `# mylib.nimble
version       = "0.1.0"
author        = "You"
requires      "nim >= 2.0.0"
requires      "jester >= 0.5.0"
skipDirs      = @["nimcache", "tests"]`,
    traits: ['nimble install подтягивает граф', 'task test/doc в .nimble', 'Публикация на nimble.directory'],
    tools: 'nimble build · nimble test · nim doc',
    use: 'Библиотеки, команды, переиспользуемые модули',
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

export function activeDepEdges(enabledNodeIds) {
  return DEP_EDGES.filter(([from, to]) => enabledNodeIds.has(from) && enabledNodeIds.has(to));
}

export function defaultEnabledNodes() {
  return new Set(DEP_NODES.map((n) => n.id));
}

export function bundleSummary(enabledNodeIds) {
  const hasWorker = enabledNodeIds.has('worker');
  const nimbleCount = DEP_NODES.filter((n) => n.type === 'nimble' && enabledNodeIds.has(n.id)).length;
  const artifacts = hasWorker
    ? ['bin/main (native)', 'workers/ + redis', `nimble deps: ${nimbleCount}`]
    : ['bin/main (~сотни KB)', 'без worker/redis', `nimble deps: ${nimbleCount - 1}`];
  return {artifacts, hasWorker, nimbleCount};
}
