/** Данные для HaskellEcosystemPlay — статья 5-17-haskell/3. */

export const TABS = [
  {id: 'stack', label: 'Слои экосистемы'},
  {id: 'deps', label: 'Граф зависимостей'},
  {id: 'structure', label: 'Структура приложения'},
  {id: 'build', label: 'GHC и сборка'},
  {id: 'modules', label: 'Модули и импорты'},
];

export const ECOSYSTEM_LAYERS = [
  {
    id: 'ghc',
    tag: 'Runtime',
    label: 'GHC · RTS · ленивость',
    color: '#5d4f85',
    icon: 'λ',
    items: ['Core → STG → native/LLVM', 'thunks · green threads', 'GC · STM · async'],
    detail:
      'GHC компилирует .hs через Core и STG в машинный код. Рантайм управляет ленивыми thunk, лёгкими потоками и сборкой мусора — это основа архитектуры выполнения Haskell.',
  },
  {
    id: 'stdlib',
    tag: 'Стандартная библиотека',
    label: 'base · Prelude · containers',
    color: '#7c6aad',
    icon: '📚',
    items: ['Data.List · Data.Map', 'Control.Monad · IO', 'text · bytestring'],
    detail:
      'Поставляется с GHC без Hackage. Prelude импортируется неявно; mtl и transformers — стандартные абстракции для эффектов поверх чистых функций.',
  },
  {
    id: 'packages',
    tag: 'Зависимости',
    label: 'Hackage · Cabal · Stack',
    color: '#10b981',
    icon: '📦',
    items: ['package.yaml · .cabal', 'build-depends', 'Stackage snapshots'],
    detail:
      'Hackage — репозиторий пакетов. Cabal читает .cabal и собирает проект; Stack фиксирует совместимые версии через Stackage для воспроизводимых сборок.',
  },
  {
    id: 'tooling',
    tag: 'Инструменты',
    label: 'HLS · тесты · качество',
    color: '#ec4899',
    icon: '🔧',
    items: ['HLS · GHCup', 'QuickCheck · Hspec', 'hlint · ormolu · fourmolu'],
    detail:
      'Haskell Language Server даёт типы и навигацию в редакторе. QuickCheck проверяет свойства; Hspec — интеграционные сценарии. Форматтеры унифицируют стиль кода.',
  },
  {
    id: 'frameworks',
    tag: 'Фреймворки',
    label: 'Веб · CLI · эффекты',
    color: '#06b6d4',
    icon: '⚙',
    items: ['Servant · Yesod · Scotty', 'Persistent · aeson', 'optparse · conduit'],
    detail:
      'Servant описывает API типами; Yesod — full-stack с шаблонами. Библиотеки подключаются точечно через build-depends, а не "всё включено".',
  },
  {
    id: 'app',
    tag: 'Приложение',
    label: 'Слои и модули',
    color: '#6366f1',
    icon: '🏗',
    items: ['Domain · чистая логика', 'Effects · IO / mtl', 'Adapters · JSON/DB', 'Main · сборка'],
    detail:
      'Типичная архитектура: домен без IO, эффекты в монаде, адаптеры для внешних форматов, main связывает зависимости и запускает программу.',
  },
];

/** Узлы графа зависимостей (viewBox 400×220). */
export const DEP_NODES = [
  {id: 'main', label: 'Main.hs', type: 'app', x: 200, y: 24},
  {id: 'server', label: 'App.Server', type: 'module', x: 70, y: 90},
  {id: 'domain', label: 'App.Domain', type: 'pure', x: 200, y: 90},
  {id: 'effects', label: 'App.Effects', type: 'lazy', x: 330, y: 90},
  {id: 'servant', label: 'servant-server', type: 'hackage', x: 40, y: 168},
  {id: 'aeson', label: 'aeson', type: 'hackage', x: 115, y: 168},
  {id: 'warp', label: 'warp', type: 'hackage', x: 190, y: 168},
  {id: 'mtl', label: 'mtl', type: 'hackage', x: 265, y: 168},
  {id: 'pgsql', label: 'postgresql-simple', type: 'hackage', x: 340, y: 168},
];

export const DEP_EDGES = [
  ['main', 'server'],
  ['main', 'domain'],
  ['main', 'effects'],
  ['server', 'servant'],
  ['server', 'aeson'],
  ['server', 'warp'],
  ['server', 'domain'],
  ['effects', 'mtl'],
  ['effects', 'pgsql'],
  ['effects', 'domain'],
];

export const NODE_TYPE_META = {
  app: {label: 'Точка входа IO', stroke: '#6366f1'},
  module: {label: 'IO-модуль', stroke: '#10b981'},
  pure: {label: 'Чистый домен', stroke: '#5d4f85'},
  lazy: {label: 'Слой эффектов', stroke: '#f59e0b', dash: '6 4'},
  hackage: {label: 'Hackage-пакет', stroke: '#ec4899'},
};

export const ARCH_PRESETS = [
  {
    id: 'servant',
    label: 'Servant REST API',
    toolchain: 'Stack · Servant · aeson · warp · postgresql-simple',
    tree: [
      {
        type: 'dir',
        path: 'orders-api',
        children: [
          {type: 'file', path: 'orders-api/package.yaml', role: 'Stack/Cabal', hint: 'dependencies: servant-server, aeson, warp, postgresql-simple'},
          {type: 'file', path: 'orders-api/orders-api.cabal', role: 'Манифест', hint: 'executable orders-api, exposed-modules, build-depends'},
          {type: 'file', path: 'orders-api/stack.yaml', role: 'Stackage', hint: 'resolver: lts-22.x — фиксированные версии'},
          {
            type: 'dir',
            path: 'orders-api/src',
            children: [
              {type: 'file', path: 'orders-api/src/Main.hs', role: 'main', hint: 'runSettings defaultSettings app — точка входа IO'},
              {type: 'file', path: 'orders-api/src/Api.hs', role: 'Servant API', hint: 'type API = "orders" :> Get \'[JSON] [Order]'},
              {type: 'file', path: 'orders-api/src/Handlers.hs', role: 'Handlers', hint: 'server = hoistServer api nt handlers — IO в Handler'},
              {type: 'file', path: 'orders-api/src/Domain.hs', role: 'Домен', hint: 'validateOrder :: Order -> Either Err Order — без IO'},
              {type: 'file', path: 'orders-api/src/Db.hs', role: 'Адаптер БД', hint: 'query_ conn "SELECT ..." — postgresql-simple'},
            ],
          },
          {
            type: 'dir',
            path: 'orders-api/test',
            children: [
              {type: 'file', path: 'orders-api/test/Spec.hs', role: 'Hspec', hint: 'describe "orders" $ it "validates" ...'},
              {type: 'file', path: 'orders-api/test/Properties.hs', role: 'QuickCheck', hint: 'prop_sort_idempotent = ...'},
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'layered',
    label: 'Слоёная архитектура',
    toolchain: 'Domain · Effects · Adapters · tagless final / mtl',
    tree: [
      {
        type: 'dir',
        path: 'billing',
        children: [
          {type: 'file', path: 'billing/billing.cabal', role: 'Cabal', hint: 'library + executable; exposed-modules по слоям'},
          {
            type: 'dir',
            path: 'billing/src',
            children: [
              {
                type: 'dir',
                path: 'billing/src/Domain',
                role: 'Чистое ядро',
                children: [
                  {type: 'file', path: 'billing/src/Domain/Invoice.hs', role: 'Типы', hint: 'data Invoice = Invoice { ... } — ADT предметной области'},
                  {type: 'file', path: 'billing/src/Domain/Rules.hs', role: 'Логика', hint: 'applyDiscount :: Invoice -> Discount -> Invoice'},
                ],
              },
              {
                type: 'dir',
                path: 'billing/src/Effects',
                role: 'Интерфейсы эффектов',
                children: [
                  {type: 'file', path: 'billing/src/Effects/Store.hs', role: 'MTL class', hint: 'class Monad m => HasStore m where saveInvoice :: ...'},
                  {type: 'file', path: 'billing/src/Effects/Log.hs', role: 'Writer', hint: 'MonadWriter Log m — логирование через тип'},
                ],
              },
              {
                type: 'dir',
                path: 'billing/src/Adapters',
                role: 'Реализации',
                children: [
                  {type: 'file', path: 'billing/src/Adapters/Postgres.hs', role: 'Store IO', hint: 'instance HasStore IO where saveInvoice = ...'},
                  {type: 'file', path: 'billing/src/Adapters/Json.hs', role: 'JSON', hint: 'FromJSON/ToJSON для API — aeson'},
                ],
              },
              {type: 'file', path: 'billing/src/Main.hs', role: 'Composition root', hint: 'runApp postgresConfig — связывает слои'},
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'yesod',
    label: 'Yesod full-stack',
    toolchain: 'Yesod · Persistent · Hamlet · stack build',
    tree: [
      {
        type: 'dir',
        path: 'shop-yesod',
        children: [
          {type: 'file', path: 'shop-yesod/package.yaml', role: 'Stack', hint: 'yesod, yesod-core, persistent, persistent-postgresql'},
          {type: 'file', path: 'shop-yesod/config/routes', role: 'Маршруты', hint: '/catalog CatalogR GET /item/#ItemId ItemR GET'},
          {
            type: 'dir',
            path: 'shop-yesod/src',
            children: [
              {type: 'file', path: 'shop-yesod/src/Foundation.hs', role: 'App foundation', hint: 'data App = App { appSettings :: ..., appConnPool :: ... }'},
              {type: 'file', path: 'shop-yesod/src/Model.hs', role: 'Persistent', hint: 'share [mkPersist sqlSettings] $(discoverEntities)'},
              {type: 'file', path: 'shop-yesod/src/Handler/Catalog.hs', role: 'Handlers', hint: 'getCatalogR = runDB $ selectList ...'},
              {type: 'file', path: 'shop-yesod/src/Handler/Common.hs', role: 'Widgets', hint: 'Hamlet-шаблоны для HTML'},
            ],
          },
          {type: 'file', path: 'shop-yesod/static/css/site.css', role: 'Статика', hint: 'yesod-static — кэш и маршруты'},
        ],
      },
    ],
  },
];

export const BUILD_STEPS = [
  {
    id: 'ghcup',
    label: 'GHCup',
    cmd: 'curl --proto \'=https\' -sSf https://get-ghcup.haskell.org | sh\nghcup install ghc 9.8\ncabal update',
    detail:
      'GHCup ставит GHC, Cabal и HLS. Одна версия компилятора на машину; проекты изолируют зависимости через Cabal/Stack, а не через "виртуальные окружения" как в Python.',
  },
  {
    id: 'init',
    label: 'Проект',
    cmd: 'stack new orders-api simple\n# или\ncabal init --libandexe --enable-tests',
    detail:
      'Stack создаёт package.yaml + stack.yaml; Cabal — .cabal. В манифесте: имя пакета, exposed-modules, executable main-is, build-depends.',
  },
  {
    id: 'deps',
    label: 'Зависимости',
    cmd: 'build-depends:\n  base >=4.18 && <5\n  servant-server\n  aeson\n  warp\n\nstack build   # или cabal build',
    detail:
      'Cabal/Stack скачивает пакеты с Hackage (или Stackage snapshot). Разрешение версий — constraint solver; конфликты видны до компиляции.',
  },
  {
    id: 'parse',
    label: 'Парсинг',
    cmd: '-- App.Domain.hs\nmodule App.Domain (validateOrder) where\n\nvalidateOrder :: Order -> Either Err Order',
    detail:
      'GHC разбирает модули, проверяет типы (Hindley-Milner), разрешает import/export. Ошибки типов — на этом этапе, до генерации кода.',
  },
  {
    id: 'core',
    label: 'Core · STG',
    cmd: 'ghc -ddump-simpl App.Domain.hs   # Core\nghc -ddump-stg App.Domain.hs      # STG\n# оптимизации: inlining, specialization, strictness',
    detail:
      'Core — типизированное лямбда-ядро; STG — абстрактная машина для ленивых программ (thunks, updates). Оптимизации сохраняют семантику, меняя порядок вычислений.',
  },
  {
    id: 'native',
    label: 'Native',
    cmd: 'stack build\n# .stack-work/dist/.../orders-api\n./orders-api',
    detail:
      'GHC генерирует машинный код (native или LLVM). Исполняемый файл включает RTS: GC, планировщик green threads, поддержку STM и async.',
  },
  {
    id: 'ship',
    label: 'Деплой',
    cmd: 'docker build -t orders-api .\n# multi-stage: stack build → copy binary\n# статический линк: ghc-options: -static',
    detail:
      'Один бинарник без JVM/интерпретатора. Контейнер фиксирует libc и конфиг; для минимального образа — static или distroless + скопированный exe.',
  },
];

export const MODULE_SYSTEMS = [
  {
    id: 'single',
    label: 'Один модуль',
    era: 'Скрипт · REPL',
    color: '#5d4f85',
    syntax: `-- Main.hs
module Main where

main :: IO ()
main = putStrLn "hello"

-- ghc Main.hs -o hello && ./hello`,
    traits: ['Один .hs файл', 'module Main where', 'ghc/runghc без Cabal'],
    tools: 'ghc · runghc · ghci',
    use: 'Учебные примеры, быстрые эксперименты',
  },
  {
    id: 'cabal',
    label: 'Cabal-пакет',
    era: 'Библиотека · executable',
    color: '#10b981',
    syntax: `-- orders-api.cabal
library
  exposed-modules: App.Domain, App.Server
  build-depends: base, aeson

executable orders-api
  main-is: Main.hs
  build-depends: base, orders-api

-- import App.Domain (validateOrder)`,
    traits: ['exposed-modules / other-modules', 'build-depends', 'import с квалификацией'],
    tools: 'cabal build · stack build · HLS',
    use: 'Сервисы, библиотеки на Hackage',
  },
  {
    id: 'layered',
    label: 'Слои + mtl',
    era: 'Domain-driven · effects',
    color: '#6366f1',
    syntax: `-- Domain: только чистые типы
module App.Domain where

-- Effects: классы типов
class Monad m => HasStore m where
  getOrder :: OrderId -> m (Maybe Order)

-- Main: interpretEffects postgresConfig program
import App.Domain
import App.Effects
import App.Adapters.Postgres`,
    traits: ['Домен без IO', 'mtl / tagless final', 'Инверсия зав зависимостей', 'QuickCheck на Domain'],
    tools: 'Hspec · QuickCheck · cabal test',
    use: 'Финтех, надёжные сервисы, type-driven design',
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
  const hasEffects = enabledNodeIds.has('effects');
  const hackageCount = DEP_NODES.filter((n) => n.type === 'hackage' && enabledNodeIds.has(n.id)).length;
  const layers = hasEffects
    ? ['Main.hs', 'App.Server · App.Domain · App.Effects', `Hackage: ${hackageCount} пакетов`]
    : ['Main.hs', 'App.Server · App.Domain (без mtl)', `Hackage: ${hackageCount - 2} пакетов`];
  return {layers, hasEffects, hackageCount};
}
